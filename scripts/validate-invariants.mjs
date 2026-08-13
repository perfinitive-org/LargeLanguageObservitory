import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");

const args = new Set(process.argv.slice(2));
const reportOnly = args.has("--report-only");
const writeDerived = args.has("--write");

// Status strength ladder. A record may never assert a status stronger than
// its own most recent review decision supports.
const statusStrength = new Map([
  ["placeholder", 0],
  ["needs_source_review", 1],
  ["source_backed", 2]
]);

// Reviewer labels that name a process rather than a person. The human
// review ledger only means something if a human is named.
const nonHumanReviewerPattern = /\b(batch|threshold|pilot|automated|script|pipeline|seed)\b/i;

// A registry seed note is a statement about indexing policy, not evidence.
const seedNotePattern = /^\s*registry seed note\b/i;

const STALE_WARN_DAYS = 180;
const STALE_ERROR_DAYS = 365;

function readJson(fileName) {
  const filePath = path.join(dataDir, fileName);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error("Could not parse " + fileName + ": " + error.message);
  }
}

function readJsonIfPresent(fileName) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return readJson(fileName);
}

function strength(status) {
  return statusStrength.has(status) ? statusStrength.get(status) : -1;
}

function latestDecision(decisions) {
  return decisions
    .slice()
    .sort((a, b) => String(a.reviewDate).localeCompare(String(b.reviewDate)))
    .at(-1);
}

function daysSince(isoDate) {
  const then = Date.parse(isoDate);
  if (Number.isNaN(then)) {
    return null;
  }
  return Math.floor((Date.now() - then) / 86400000);
}

function isSeedNote(observation) {
  return seedNotePattern.test(observation.claim || "");
}

function groupBy(rows, key) {
  const map = new Map();
  rows.forEach((row) => {
    const value = row[key];
    if (!map.has(value)) {
      map.set(value, []);
    }
    map.get(value).push(row);
  });
  return map;
}

// INV-01 A record may not out-rank its own most recent review decision.
function checkStatusLadder(errors, observables, decisionsByObservable) {
  observables.forEach((observable) => {
    const decisions = decisionsByObservable.get(observable.id);
    if (!decisions || decisions.length === 0) {
      return;
    }

    const latest = latestDecision(decisions);
    if (strength(observable.verification_status) > strength(latest.decision)) {
      errors.push(
        "INV-01 " + observable.id + " is " + observable.verification_status +
          " but its latest review decision (" + latest.id + ", " +
          latest.reviewDate + ") is " + latest.decision
      );
    }
  });
}

// INV-02 Every source_backed record needs a source_backed decision row.
function checkReviewCoverage(errors, warnings, observables, decisionsByObservable) {
  observables.forEach((observable) => {
    const decisions = decisionsByObservable.get(observable.id) || [];
    const hasBackedDecision = decisions.some(
      (decision) => decision.decision === "source_backed"
    );

    if (observable.verification_status === "source_backed" && !hasBackedDecision) {
      errors.push(
        "INV-02 " + observable.id +
          " claims source_backed with no source_backed review decision row"
      );
      return;
    }

    if (decisions.length === 0) {
      warnings.push("INV-02 " + observable.id + " has no review decision row at all");
    }
  });
}

// INV-03 Reviewers must be named humans listed in data/reviewers.json.
function checkNamedReviewers(errors, decisions, reviewers) {
  const known = new Set((reviewers || []).map((reviewer) => reviewer.id));

  decisions.forEach((decision) => {
    const reviewer = String(decision.reviewer);

    if (nonHumanReviewerPattern.test(reviewer)) {
      errors.push(
        "INV-03 review decision " + decision.id + " reviewer " + reviewer +
          " names a process, not a person"
      );
      return;
    }

    if (reviewers && !known.has(reviewer)) {
      errors.push(
        "INV-03 review decision " + decision.id + " reviewer " + reviewer +
          " is not listed in data/reviewers.json"
      );
    }
  });
}

// INV-04 A registry seed note may never itself be source_backed.
function checkSeedNoteAccounting(errors, observations) {
  observations.forEach((observation) => {
    if (!isSeedNote(observation)) {
      return;
    }

    if (observation.verification_status === "source_backed") {
      errors.push(
        "INV-04 observation " + observation.id +
          " is a registry seed note but is marked source_backed"
      );
    }

    if (observation.evidenceType !== "registry_note") {
      errors.push(
        "INV-04 observation " + observation.id +
          " is a registry seed note but evidenceType is " + observation.evidenceType
      );
    }
  });
}

// INV-05 A source_backed record needs at least one substantive observation.
function checkSubstantiveEvidence(errors, observables, observationsByObservable) {
  observables
    .filter((observable) => observable.verification_status === "source_backed")
    .forEach((observable) => {
      const observations = observationsByObservable.get(observable.id) || [];
      const substantive = observations.filter(
        (observation) => !isSeedNote(observation)
      );

      if (substantive.length === 0) {
        errors.push(
          "INV-05 " + observable.id + " claims source_backed but has " +
            observations.length + " observation(s), all registry seed notes"
        );
      }
    });
}

// INV-06 Evidence decays. Retrieval dates must stay current.
function checkSourceFreshness(errors, warnings, sources) {
  sources.forEach((source) => {
    const age = daysSince(source.retrievedAt);

    if (age === null) {
      errors.push("INV-06 source " + source.id + " has an unparseable retrievedAt");
      return;
    }

    if (age > STALE_ERROR_DAYS && source.verification_status === "source_backed") {
      errors.push(
        "INV-06 source " + source.id +
          " is source_backed but was last retrieved " + age + " days ago"
      );
    } else if (age > STALE_WARN_DAYS) {
      warnings.push(
        "INV-06 source " + source.id + " last retrieved " + age + " days ago"
      );
    }
  });
}

// INV-07 Public counts must be derived, never hand-written. This behaves
// like a lockfile: regenerate with --write, and CI fails if it drifts.
function buildDerivedCounts(observables, sources, observations, relationships, decisions) {
  const byType = {};
  const byStatus = {};

  observables.forEach((observable) => {
    byType[observable.type] = (byType[observable.type] || 0) + 1;
    byStatus[observable.verification_status] =
      (byStatus[observable.verification_status] || 0) + 1;
  });

  const seedNotes = observations.filter(isSeedNote).length;
  const covered = new Set(decisions.map((decision) => decision.observableId));
  const retrievals = sources
    .map((source) => source.retrievedAt)
    .filter(Boolean)
    .sort();

  return {
    observables: { total: observables.length, byType, byStatus },
    sources: { total: sources.length },
    observations: {
      total: observations.length,
      registrySeedNotes: seedNotes,
      substantive: observations.length - seedNotes
    },
    relationships: { total: relationships.length },
    reviewDecisions: {
      total: decisions.length,
      observablesCovered: covered.size,
      observablesUncovered: observables.length - covered.size
    },
    freshness: {
      oldestRetrievedAt: retrievals.at(0) || null,
      latestRetrievedAt: retrievals.at(-1) || null
    }
  };
}

function checkDerivedCounts(errors, derived) {
  const filePath = path.join(dataDir, "derived-counts.json");
  const serialized = JSON.stringify(derived, null, 2) + "\n";

  if (writeDerived) {
    fs.writeFileSync(filePath, serialized, "utf8");
    console.log("Wrote data/derived-counts.json");
    return;
  }

  if (!fs.existsSync(filePath)) {
    errors.push(
      "INV-07 data/derived-counts.json is missing. Run: npm run validate:invariants -- --write"
    );
    return;
  }

  if (fs.readFileSync(filePath, "utf8") !== serialized) {
    errors.push(
      "INV-07 data/derived-counts.json is stale. Run: npm run validate:invariants -- --write"
    );
  }
}

function main() {
  const errors = [];
  const warnings = [];

  const observables = readJson("observables.json");
  const sources = readJson("sources.json");
  const observations = readJson("observations.json");
  const relationships = readJson("relationships.json");
  const decisions = readJson("review-decisions.json");
  const reviewers = readJsonIfPresent("reviewers.json");

  const decisionsByObservable = groupBy(decisions, "observableId");
  const observationsByObservable = groupBy(observations, "observableId");

  checkStatusLadder(errors, observables, decisionsByObservable);
  checkReviewCoverage(errors, warnings, observables, decisionsByObservable);
  checkNamedReviewers(errors, decisions, reviewers);
  checkSeedNoteAccounting(errors, observations);
  checkSubstantiveEvidence(errors, observables, observationsByObservable);
  checkSourceFreshness(errors, warnings, sources);

  const derived = buildDerivedCounts(
    observables,
    sources,
    observations,
    relationships,
    decisions
  );
  checkDerivedCounts(errors, derived);

  warnings.forEach((warning) => console.warn("warn  " + warning));
  errors.forEach((error) => console.error("error " + error));

  console.log(
    "\nInvariant check: " + errors.length + " error(s), " +
      warnings.length + " warning(s)"
  );

  if (errors.length > 0 && !reportOnly) {
    process.exitCode = 1;
  }
}

main();

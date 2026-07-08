import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");
const frontierClaimsPath = path.join(dataDir, "frontier-claim-velocity.json");
const validateDataPath = path.join(root, "scripts", "validate-data.mjs");

const allowed = {
  type: new Set(["model", "infrastructure"]),
  unit_family: new Set(["parameters", "accelerators", "power"]),
  status: new Set([
    "source_backed",
    "reported_public_claim",
    "needs_source_review",
    "excluded_from_chart"
  ]),
  event_type: new Set([
    "announcement",
    "expansion",
    "revision",
    "delay",
    "cancellation",
    "retraction",
    "capacity_reduction",
    "source_removed",
    "source_changed",
    "needs_review"
  ]),
  direction: new Set([
    "increase",
    "decrease",
    "delay",
    "cancellation",
    "revision",
    "unknown"
  ]),
  source_status: new Set([
    "live",
    "archived",
    "changed",
    "removed",
    "dead_link",
    "requires_review"
  ]),
  normalization_status: new Set([
    "direct",
    "converted_with_formula",
    "reported_equivalent",
    "ambiguous",
    "not_comparable",
    "quarantined"
  ]),
  source_type: new Set([
    "direct_vendor_statement",
    "technical_report",
    "system_card",
    "regulatory_filing",
    "permit_or_planning_record",
    "court_record",
    "government_record",
    "customer_or_partner_statement",
    "investigative_reporting",
    "news_reporting",
    "analyst_report",
    "secondary_summary",
    "unknown"
  ]),
  source_tier: new Set([
    "primary",
    "official_partner",
    "public_record",
    "reputable_reporting",
    "secondary",
    "unresolved"
  ])
};

const requiredFields = [
  "id",
  "date",
  "entity",
  "label",
  "claim",
  "type",
  "unit_family",
  "value",
  "display_value",
  "source_ids",
  "evidence_record_ids",
  "status",
  "caveat",
  "event_type",
  "direction",
  "source_type",
  "source_tier",
  "source_url",
  "archive_url",
  "accessed_at",
  "source_status",
  "normalization_status",
  "normalization_note",
  "conversion_formula",
  "plotted",
  "prior_claim_id",
  "supersedes_claim_id"
];

const historyLinkedEventTypes = new Set([
  "revision",
  "delay",
  "cancellation",
  "retraction",
  "capacity_reduction",
  "source_removed",
  "source_changed"
]);

const nonPlottableNormalizationStatuses = new Set([
  "ambiguous",
  "not_comparable",
  "quarantined"
]);

const nonPlottableSourceStatuses = new Set([
  "changed",
  "removed",
  "dead_link",
  "requires_review"
]);

const reportedSourceTypes = new Set([
  "investigative_reporting",
  "news_reporting",
  "analyst_report",
  "secondary_summary",
  "unknown"
]);

const officialSourceTiers = new Set([
  "primary",
  "official_partner",
  "public_record"
]);

function printHelp() {
  console.log(`Author one Frontier Claim Velocity event.

Usage:
  npm run author:frontier-claim -- --input path/to/payload.json
  npm run author:frontier-claim -- --input path/to/payload.json --write

Rules:
  - Dry-run validation is the default; no files change unless --write is supplied.
  - With --write, appends exactly one claim-event record at a time.
  - Refuses duplicate IDs and broken source/evidence references.
  - Refuses plotted records with ambiguous, quarantined, or not-comparable metrics.
  - Refuses plotted records without source_url, archive_url, accessed_at, and evidence/source links.
  - Requires revision/cancellation/retraction/source-decay events to link to prior history.
  - Does not fetch sources, create evidence, verify claims, or assign status automatically.
`);
}

function parseArgs(argv) {
  const args = {
    input: "",
    dryRun: false,
    write: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--help" || value === "-h") {
      args.help = true;
    } else if (value === "--dry-run") {
      args.dryRun = true;
    } else if (value === "--write") {
      args.write = true;
    } else if (value === "--input") {
      args.input = argv[index + 1] || "";
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }

  if (args.write && args.dryRun) {
    throw new Error("Use either --write or --dry-run, not both.");
  }

  return args;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Could not parse ${filePath}: ${error.message}`);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function push(errorList, message) {
  errorList.push(message);
}

function validateEnum(errors, record, field) {
  if (!allowed[field].has(record[field])) {
    push(errors, `${record.id || "(missing id)"} has invalid ${field}: ${record[field]}`);
  }
}

function validateFrontierClaimPayload(record, context) {
  const errors = [];
  const existingIds = new Set(context.frontierClaims.map((claim) => claim.id));
  const sourceIds = new Set(context.sources.map((source) => source.id));
  const evidenceRecordIds = new Set(
    context.evidenceRecords.map((evidenceRecord) => evidenceRecord.id)
  );

  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return ["Payload must be a single JSON object."];
  }

  requiredFields.forEach((field) => {
    if (record[field] === undefined) {
      push(errors, `Payload missing ${field}`);
    }
  });

  if (isNonEmptyString(record.id) && existingIds.has(record.id)) {
    push(errors, `Frontier claim id already exists: ${record.id}`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date || "")) {
    push(errors, `${record.id || "(missing id)"} date must be YYYY-MM-DD`);
  }

  ["type", "unit_family", "status", "event_type", "direction"].forEach((field) =>
    validateEnum(errors, record, field)
  );
  ["source_type", "source_tier", "source_status", "normalization_status"].forEach(
    (field) => validateEnum(errors, record, field)
  );

  [
    "id",
    "date",
    "entity",
    "label",
    "claim",
    "display_value",
    "caveat"
  ].forEach((field) => {
    if (!isNonEmptyString(record[field])) {
      push(errors, `${record.id || "(missing id)"} ${field} must be a non-empty string`);
    }
  });

  if (typeof record.value !== "number" || record.value < 0) {
    push(errors, `${record.id || "(missing id)"} value must be a non-negative number`);
  }

  if (!isStringArray(record.source_ids)) {
    push(errors, `${record.id || "(missing id)"} source_ids must be an array of non-empty strings`);
  } else {
    record.source_ids.forEach((sourceId) => {
      if (!sourceIds.has(sourceId)) {
        push(errors, `${record.id || "(missing id)"} references missing source ${sourceId}`);
      }
    });
  }

  if (!isStringArray(record.evidence_record_ids)) {
    push(
      errors,
      `${record.id || "(missing id)"} evidence_record_ids must be an array of non-empty strings`
    );
  } else {
    record.evidence_record_ids.forEach((evidenceRecordId) => {
      if (!evidenceRecordIds.has(evidenceRecordId)) {
        push(
          errors,
          `${record.id || "(missing id)"} references missing evidence record ${evidenceRecordId}`
        );
      }
    });
  }

  if (typeof record.plotted !== "boolean") {
    push(errors, `${record.id || "(missing id)"} plotted must be a boolean`);
  }

  ["prior_claim_id", "supersedes_claim_id"].forEach((field) => {
    const value = record[field];
    if (value !== null && !isNonEmptyString(value)) {
      push(errors, `${record.id || "(missing id)"} ${field} must be null or a non-empty string`);
      return;
    }
    if (value && !existingIds.has(value)) {
      push(errors, `${record.id || "(missing id)"} ${field} references missing claim ${value}`);
    }
    if (value === record.id) {
      push(errors, `${record.id || "(missing id)"} ${field} cannot reference itself`);
    }
  });

  if (
    historyLinkedEventTypes.has(record.event_type) &&
    !record.prior_claim_id &&
    !record.supersedes_claim_id
  ) {
    push(
      errors,
      `${record.id || "(missing id)"} ${record.event_type} event must link to prior_claim_id or supersedes_claim_id`
    );
  }

  if (
    record.normalization_status !== "direct" &&
    !isNonEmptyString(record.normalization_note)
  ) {
    push(
      errors,
      `${record.id || "(missing id)"} must include normalization_note when normalization_status is not direct`
    );
  }

  if (
    record.normalization_status === "converted_with_formula" &&
    !isNonEmptyString(record.conversion_formula)
  ) {
    push(
      errors,
      `${record.id || "(missing id)"} converted_with_formula records must include conversion_formula`
    );
  }

  if (record.status === "source_backed") {
    if (!officialSourceTiers.has(record.source_tier)) {
      push(errors, `${record.id || "(missing id)"} source_backed records require a primary, official_partner, or public_record source_tier`);
    }
    if (reportedSourceTypes.has(record.source_type)) {
      push(errors, `${record.id || "(missing id)"} source_backed records cannot rely on reported or secondary source_type`);
    }
  }

  if (record.plotted === true) {
    if (!["source_backed", "reported_public_claim"].includes(record.status)) {
      push(errors, `${record.id || "(missing id)"} plotted records must be source_backed or reported_public_claim`);
    }
    if (record.event_type === "needs_review") {
      push(errors, `${record.id || "(missing id)"} cannot be plotted with event_type needs_review`);
    }
    if (nonPlottableNormalizationStatuses.has(record.normalization_status)) {
      push(errors, `${record.id || "(missing id)"} cannot be plotted with normalization_status ${record.normalization_status}`);
    }
    if (nonPlottableSourceStatuses.has(record.source_status)) {
      push(errors, `${record.id || "(missing id)"} cannot be plotted with source_status ${record.source_status}`);
    }
    if (record.value <= 0) {
      push(errors, `${record.id || "(missing id)"} plotted records must have a positive value`);
    }
    if (record.source_ids.length + record.evidence_record_ids.length === 0) {
      push(errors, `${record.id || "(missing id)"} plotted records require at least one source or evidence link`);
    }
    if (!isNonEmptyString(record.source_url)) {
      push(errors, `${record.id || "(missing id)"} plotted records require source_url`);
    }
    if (!isNonEmptyString(record.archive_url)) {
      push(errors, `${record.id || "(missing id)"} plotted records require archive_url`);
    }
    if (!isNonEmptyString(record.accessed_at)) {
      push(errors, `${record.id || "(missing id)"} plotted records require accessed_at`);
    }
  }

  if (record.status === "needs_source_review" && record.plotted === true) {
    push(errors, `${record.id || "(missing id)"} needs_source_review records cannot be plotted`);
  }

  return errors;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  if (!args.input) {
    throw new Error("Missing --input path/to/payload.json");
  }

  const inputPath = path.resolve(process.cwd(), args.input);
  const payload = readJson(inputPath);
  const originalFrontierClaimsJson = fs.readFileSync(frontierClaimsPath, "utf8");
  const frontierClaims = JSON.parse(originalFrontierClaimsJson);
  const context = {
    frontierClaims,
    sources: readJson(path.join(dataDir, "sources.json")),
    evidenceRecords: readJson(path.join(dataDir, "evidence-records.json"))
  };

  const errors = validateFrontierClaimPayload(payload, context);
  if (errors.length > 0) {
    console.error("Claim-event authoring failed:");
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  const nextFrontierClaims = [...frontierClaims, payload];
  const nextJson = `${JSON.stringify(nextFrontierClaims, null, 2)}\n`;

  if (!args.write) {
    console.log("Claim-event payload is valid. Dry run only; no files changed.");
    console.log("Add --write to append this record after human review.");
    console.log(
      JSON.stringify(
        {
          id: payload.id,
          plotted: payload.plotted,
          status: payload.status,
          event_type: payload.event_type,
          direction: payload.direction,
          prior_claim_id: payload.prior_claim_id,
          supersedes_claim_id: payload.supersedes_claim_id
        },
        null,
        2
      )
    );
    return;
  }

  console.log("Explicit --write supplied. Appending one manually reviewed claim-event record.");
  fs.writeFileSync(frontierClaimsPath, nextJson);

  const validation = spawnSync(process.execPath, [validateDataPath], {
    cwd: root,
    stdio: "inherit"
  });

  if (validation.status !== 0) {
    fs.writeFileSync(frontierClaimsPath, originalFrontierClaimsJson);
    console.error("Global data validation failed; frontier claim file was restored.");
    process.exit(validation.status || 1);
  }

  console.log(`Claim-event record authored after explicit --write: ${payload.id}`);
  console.log(`Updated ${path.relative(root, frontierClaimsPath)}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

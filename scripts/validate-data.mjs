import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dataDir = path.join(root, "data");

const observableTypes = new Set([
  "Organization",
  "Model",
  "Data Center",
  "Source"
]);
const verificationStatuses = new Set([
  "source_backed",
  "needs_source_review",
  "placeholder"
]);

function readJson(fileName) {
  const filePath = path.join(dataDir, fileName);
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Could not parse ${fileName}: ${error.message}`);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function duplicateValues(rows, key) {
  const seen = new Set();
  const duplicates = new Set();

  rows.forEach((row) => {
    const value = row[key];
    if (seen.has(value)) {
      duplicates.add(value);
    }
    seen.add(value);
  });

  return Array.from(duplicates);
}

function pushMissing(errors, label, row, fields) {
  fields.forEach((field) => {
    if (row[field] === undefined || row[field] === null || row[field] === "") {
      errors.push(`${label} ${row.id || "(missing id)"} missing ${field}`);
    }
  });
}

function validateVerificationStatus(errors, label, row) {
  if (!verificationStatuses.has(row.verification_status)) {
    errors.push(
      `${label} ${row.id || "(missing id)"} has invalid verification_status`
    );
  }
}

function validateBaseObservable(errors, observable) {
  pushMissing(errors, "Observable", observable, [
    "id",
    "slug",
    "name",
    "type",
    "verification_status",
    "summary",
    "description",
    "location",
    "status",
    "tags",
    "aliases",
    "metadata"
  ]);

  if (!observableTypes.has(observable.type)) {
    errors.push(`Observable ${observable.id} has invalid type ${observable.type}`);
  }
  validateVerificationStatus(errors, "Observable", observable);

  if (!isStringArray(observable.tags)) {
    errors.push(`Observable ${observable.id} tags must be non-empty strings`);
  }
  if (!Array.isArray(observable.aliases)) {
    errors.push(`Observable ${observable.id} aliases must be an array`);
  }
  if (typeof observable.metadata !== "object" || Array.isArray(observable.metadata)) {
    errors.push(`Observable ${observable.id} metadata must be an object`);
  }
}

function validateObservableByType(errors, observable, observableIds, sourceById) {
  const metadata = observable.metadata || {};

  if (observable.type === "Organization") {
    if (!isNonEmptyString(metadata.website)) {
      errors.push(`Organization ${observable.id} missing metadata.website`);
    }
  }

  if (observable.type === "Model") {
    if (!isNonEmptyString(metadata.developer)) {
      errors.push(`Model ${observable.id} missing metadata.developer`);
    }
    if (!isNonEmptyString(metadata.developerObservableId)) {
      errors.push(`Model ${observable.id} missing metadata.developerObservableId`);
    } else if (!observableIds.has(metadata.developerObservableId)) {
      errors.push(
        `Model ${observable.id} references missing developer ${metadata.developerObservableId}`
      );
    }
  }

  if (observable.type === "Data Center") {
    if (!isNonEmptyString(metadata.operator)) {
      errors.push(`Data Center ${observable.id} missing metadata.operator`);
    }
    if (!isNonEmptyString(metadata.operatorObservableId)) {
      errors.push(`Data Center ${observable.id} missing metadata.operatorObservableId`);
    } else if (!observableIds.has(metadata.operatorObservableId)) {
      errors.push(
        `Data Center ${observable.id} references missing operator ${metadata.operatorObservableId}`
      );
    }
  }

  if (observable.type === "Source") {
    if (!isNonEmptyString(metadata.sourceId)) {
      errors.push(`Source observable ${observable.id} missing metadata.sourceId`);
    } else if (!sourceById.has(metadata.sourceId)) {
      errors.push(
        `Source observable ${observable.id} references missing source ${metadata.sourceId}`
      );
    }

    if (!isNonEmptyString(metadata.sourceSlug)) {
      errors.push(`Source observable ${observable.id} missing metadata.sourceSlug`);
    } else {
      const source = sourceById.get(metadata.sourceId);
      if (source && source.slug !== metadata.sourceSlug) {
        errors.push(
          `Source observable ${observable.id} metadata.sourceSlug does not match source slug`
        );
      }
    }
  }
}

function validateSource(errors, source, observableIds) {
  pushMissing(errors, "Source", source, [
    "id",
    "slug",
    "title",
    "verification_status",
    "publisher",
    "url",
    "publishedAt",
    "retrievedAt",
    "sourceType",
    "reliability",
    "summary",
    "tags",
    "linkedObservableIds"
  ]);
  validateVerificationStatus(errors, "Source", source);

  if (!isStringArray(source.tags)) {
    errors.push(`Source ${source.id} tags must be non-empty strings`);
  }
  if (!isStringArray(source.linkedObservableIds)) {
    errors.push(`Source ${source.id} linkedObservableIds must be non-empty strings`);
  } else {
    source.linkedObservableIds.forEach((observableId) => {
      if (!observableIds.has(observableId)) {
        errors.push(`Source ${source.id} links missing observable ${observableId}`);
      }
    });
  }
}

function validateRelationship(errors, relationship, observableIds, sourceIds) {
  pushMissing(errors, "Relationship", relationship, [
    "id",
    "fromObservableId",
    "toObservableId",
    "verification_status",
    "type",
    "label",
    "sourceIds",
    "observedAt",
    "confidence",
    "notes"
  ]);
  validateVerificationStatus(errors, "Relationship", relationship);

  if (!observableIds.has(relationship.fromObservableId)) {
    errors.push(
      `Relationship ${relationship.id} references missing fromObservableId ${relationship.fromObservableId}`
    );
  }
  if (!observableIds.has(relationship.toObservableId)) {
    errors.push(
      `Relationship ${relationship.id} references missing toObservableId ${relationship.toObservableId}`
    );
  }
  if (!Array.isArray(relationship.sourceIds)) {
    errors.push(`Relationship ${relationship.id} sourceIds must be an array`);
  } else {
    relationship.sourceIds.forEach((sourceId) => {
      if (!sourceIds.has(sourceId)) {
        errors.push(`Relationship ${relationship.id} references missing source ${sourceId}`);
      }
    });
  }
}

function validateObservation(errors, observation, observableIds, sourceIds) {
  pushMissing(errors, "Observation", observation, [
    "id",
    "observableId",
    "sourceId",
    "verification_status",
    "observedAt",
    "claim",
    "evidenceType",
    "confidence"
  ]);
  validateVerificationStatus(errors, "Observation", observation);

  if (!observableIds.has(observation.observableId)) {
    errors.push(
      `Observation ${observation.id} references missing observable ${observation.observableId}`
    );
  }
  if (!sourceIds.has(observation.sourceId)) {
    errors.push(
      `Observation ${observation.id} references missing source ${observation.sourceId}`
    );
  }
}

function validateReviewDecision(errors, decision, observableIds) {
  pushMissing(errors, "Review decision", decision, [
    "id",
    "observableId",
    "decision",
    "reviewDate",
    "reviewer",
    "reason",
    "missingInformation",
    "recommendedSources"
  ]);

  if (!observableIds.has(decision.observableId)) {
    errors.push(
      `Review decision ${decision.id || "(missing id)"} references missing observableId ${decision.observableId}`
    );
  }

  if (!verificationStatuses.has(decision.decision)) {
    errors.push(
      `Review decision ${decision.id || "(missing id)"} has invalid decision ${decision.decision}`
    );
  }

  if (!Array.isArray(decision.missingInformation)) {
    errors.push(
      `Review decision ${decision.id || "(missing id)"} missingInformation must be an array`
    );
  }

  if (!Array.isArray(decision.recommendedSources)) {
    errors.push(
      `Review decision ${decision.id || "(missing id)"} recommendedSources must be an array`
    );
  }
}

function validateEvidenceRecord(errors, evidenceRecord, observableIds, reviewDecisionIds) {
  pushMissing(errors, "Evidence record", evidenceRecord, [
    "id",
    "title",
    "publisher",
    "url",
    "sourceType",
    "linkedObservableIds",
    "linkedReviewDecisionIds",
    "notes"
  ]);

  if (!isStringArray(evidenceRecord.linkedObservableIds)) {
    errors.push(
      `Evidence record ${evidenceRecord.id || "(missing id)"} linkedObservableIds must be an array of strings`
    );
  } else {
    evidenceRecord.linkedObservableIds.forEach((observableId) => {
      if (!observableIds.has(observableId)) {
        errors.push(
          `Evidence record ${evidenceRecord.id} links missing observable ${observableId}`
        );
      }
    });
  }

  if (!isStringArray(evidenceRecord.linkedReviewDecisionIds)) {
    errors.push(
      `Evidence record ${evidenceRecord.id || "(missing id)"} linkedReviewDecisionIds must be an array of strings`
    );
  } else {
    evidenceRecord.linkedReviewDecisionIds.forEach((reviewDecisionId) => {
      if (!reviewDecisionIds.has(reviewDecisionId)) {
        errors.push(
          `Evidence record ${evidenceRecord.id} links missing review decision ${reviewDecisionId}`
        );
      }
    });
  }
}

const evidenceRecords = readJson("evidence-records.json");
const observables = readJson("observables.json");
const sources = readJson("sources.json");
const observations = readJson("observations.json");
const relationships = readJson("relationships.json");
const reviewDecisions = readJson("review-decisions.json");
const errors = [];

if (!Array.isArray(evidenceRecords)) {
  errors.push("evidence-records.json must be an array");
}
if (!Array.isArray(observables)) errors.push("observables.json must be an array");
if (!Array.isArray(sources)) errors.push("sources.json must be an array");
if (!Array.isArray(observations)) errors.push("observations.json must be an array");
if (!Array.isArray(relationships)) errors.push("relationships.json must be an array");
if (!Array.isArray(reviewDecisions)) {
  errors.push("review-decisions.json must be an array");
}

const observableIds = new Set(observables.map((observable) => observable.id));
const sourceIds = new Set(sources.map((source) => source.id));
const reviewDecisionIds = new Set(
  reviewDecisions.map((decision) => decision.id)
);
const sourceById = new Map(sources.map((source) => [source.id, source]));

duplicateValues(evidenceRecords, "id").forEach((id) =>
  errors.push(`Duplicate evidence record id ${id}`)
);
duplicateValues(observables, "id").forEach((id) =>
  errors.push(`Duplicate observable id ${id}`)
);
duplicateValues(observables, "slug").forEach((slug) =>
  errors.push(`Duplicate observable slug ${slug}`)
);
duplicateValues(sources, "id").forEach((id) => errors.push(`Duplicate source id ${id}`));
duplicateValues(sources, "slug").forEach((slug) =>
  errors.push(`Duplicate source slug ${slug}`)
);
duplicateValues(observations, "id").forEach((id) =>
  errors.push(`Duplicate observation id ${id}`)
);
duplicateValues(relationships, "id").forEach((id) =>
  errors.push(`Duplicate relationship id ${id}`)
);
duplicateValues(reviewDecisions, "id").forEach((id) =>
  errors.push(`Duplicate review decision id ${id}`)
);

observables.forEach((observable) => {
  validateBaseObservable(errors, observable);
  validateObservableByType(errors, observable, observableIds, sourceById);
});
sources.forEach((source) => validateSource(errors, source, observableIds));
relationships.forEach((relationship) =>
  validateRelationship(errors, relationship, observableIds, sourceIds)
);
observations.forEach((observation) =>
  validateObservation(errors, observation, observableIds, sourceIds)
);
reviewDecisions.forEach((decision) =>
  validateReviewDecision(errors, decision, observableIds)
);
evidenceRecords.forEach((evidenceRecord) =>
  validateEvidenceRecord(
    errors,
    evidenceRecord,
    observableIds,
    reviewDecisionIds
  )
);

const countsByType = observables.reduce((counts, observable) => {
  counts[observable.type] = (counts[observable.type] || 0) + 1;
  return counts;
}, {});

if (errors.length > 0) {
  console.error("Data validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("Data validation passed.");
console.log(
  JSON.stringify(
    {
      observables: observables.length,
      countsByType,
      sources: sources.length,
      observations: observations.length,
      relationships: relationships.length,
      reviewDecisions: reviewDecisions.length,
      evidenceRecords: evidenceRecords.length
    },
    null,
    2
  )
);

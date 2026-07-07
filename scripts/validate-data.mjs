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
const frontierClaimTypes = new Set(["model", "infrastructure"]);
const frontierClaimUnitFamilies = new Set([
  "parameters",
  "accelerators",
  "power"
]);
const frontierClaimStatuses = new Set([
  "source_backed",
  "reported_public_claim",
  "needs_source_review",
  "excluded_from_chart"
]);
const plottedFrontierClaimStatuses = new Set([
  "source_backed",
  "reported_public_claim"
]);

// Method-governance fields (PACKET_061): the claim tracks an *event*, not
// only growth, and the record must be internally consistent about whether
// it is safe to plot as a comparable number before `plotted` can be true.
const frontierClaimEventTypes = new Set([
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
]);
const frontierClaimDirections = new Set([
  "increase",
  "decrease",
  "delay",
  "cancellation",
  "revision",
  "unknown"
]);
const frontierClaimSourceStatuses = new Set([
  "live",
  "archived",
  "changed",
  "removed",
  "dead_link",
  "requires_review"
]);
const frontierClaimNormalizationStatuses = new Set([
  "direct",
  "converted_with_formula",
  "reported_equivalent",
  "ambiguous",
  "not_comparable",
  "quarantined"
]);
const frontierClaimSourceTypes = new Set([
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
]);
const frontierClaimSourceTiers = new Set([
  "primary",
  "official_partner",
  "public_record",
  "reputable_reporting",
  "secondary",
  "unresolved"
]);
const nonPlottableNormalizationStatuses = new Set([
  "ambiguous",
  "not_comparable",
  "quarantined"
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

function validateFrontierClaimVelocityRecord(
  errors,
  warnings,
  record,
  sourceIds,
  evidenceRecordIds
) {
  const label = record.id || "(missing id)";

  pushMissing(errors, "Frontier claim velocity record", record, [
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
    "caveat"
  ]);

  // PACKET_061 method-governance fields: required regardless of whether
  // the claim ends up plotted, so every record declares its own event
  // type, direction, source classification, and normalization disposition.
  pushMissing(errors, "Frontier claim velocity record", record, [
    "event_type",
    "direction",
    "source_type",
    "source_tier",
    "source_status",
    "normalization_status",
    "plotted"
  ]);

  if (record.event_type !== undefined && !frontierClaimEventTypes.has(record.event_type)) {
    errors.push(`Frontier claim velocity record ${label} has invalid event_type ${record.event_type}`);
  }
  if (record.direction !== undefined && !frontierClaimDirections.has(record.direction)) {
    errors.push(`Frontier claim velocity record ${label} has invalid direction ${record.direction}`);
  }
  if (record.source_type !== undefined && !frontierClaimSourceTypes.has(record.source_type)) {
    errors.push(`Frontier claim velocity record ${label} has invalid source_type ${record.source_type}`);
  }
  if (record.source_tier !== undefined && !frontierClaimSourceTiers.has(record.source_tier)) {
    errors.push(`Frontier claim velocity record ${label} has invalid source_tier ${record.source_tier}`);
  }
  if (
    record.source_status !== undefined &&
    !frontierClaimSourceStatuses.has(record.source_status)
  ) {
    errors.push(`Frontier claim velocity record ${label} has invalid source_status ${record.source_status}`);
  }
  if (
    record.normalization_status !== undefined &&
    !frontierClaimNormalizationStatuses.has(record.normalization_status)
  ) {
    errors.push(
      `Frontier claim velocity record ${label} has invalid normalization_status ${record.normalization_status}`
    );
  }

  if (typeof record.plotted !== "boolean") {
    errors.push(`Frontier claim velocity record ${label} plotted must be a boolean`);
  }

  // A non-direct normalization must explain itself — silent conversions
  // or silent ambiguity are exactly what this packet hardens against.
  if (
    record.normalization_status !== undefined &&
    record.normalization_status !== "direct" &&
    !isNonEmptyString(record.normalization_note)
  ) {
    errors.push(
      `Frontier claim velocity record ${label} must have normalization_note when normalization_status is not direct`
    );
  }

  if (record.plotted === true) {
    if (!isNonEmptyString(record.archive_url)) {
      warnings.push(
        `Frontier claim velocity record ${label} is plotted but missing archive_url`
      );
    }
    if (nonPlottableNormalizationStatuses.has(record.normalization_status)) {
      errors.push(
        `Frontier claim velocity record ${label} cannot be plotted with normalization_status ${record.normalization_status}`
      );
    }
    if (record.source_status === "requires_review") {
      errors.push(
        `Frontier claim velocity record ${label} cannot be plotted while source_status is requires_review`
      );
    }
    if (record.event_type === "needs_review") {
      errors.push(
        `Frontier claim velocity record ${label} cannot be plotted while event_type is needs_review`
      );
    }
  }


  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date || "")) {
    errors.push(
      `Frontier claim velocity record ${record.id || "(missing id)"} date must be YYYY-MM-DD`
    );
  }

  if (!frontierClaimTypes.has(record.type)) {
    errors.push(
      `Frontier claim velocity record ${record.id || "(missing id)"} has invalid type ${record.type}`
    );
  }

  if (!frontierClaimUnitFamilies.has(record.unit_family)) {
    errors.push(
      `Frontier claim velocity record ${record.id || "(missing id)"} has invalid unit_family ${record.unit_family}`
    );
  }

  if (!frontierClaimStatuses.has(record.status)) {
    errors.push(
      `Frontier claim velocity record ${record.id || "(missing id)"} has invalid status ${record.status}`
    );
  }

  if (typeof record.value !== "number" || record.value < 0) {
    errors.push(
      `Frontier claim velocity record ${record.id || "(missing id)"} value must be a non-negative number`
    );
  }

  if (!Array.isArray(record.source_ids)) {
    errors.push(
      `Frontier claim velocity record ${record.id || "(missing id)"} source_ids must be an array`
    );
  } else {
    record.source_ids.forEach((sourceId) => {
      if (!sourceIds.has(sourceId)) {
        errors.push(
          `Frontier claim velocity record ${record.id} references missing source ${sourceId}`
        );
      }
    });
  }

  if (!Array.isArray(record.evidence_record_ids)) {
    errors.push(
      `Frontier claim velocity record ${record.id || "(missing id)"} evidence_record_ids must be an array`
    );
  } else {
    record.evidence_record_ids.forEach((evidenceRecordId) => {
      if (!evidenceRecordIds.has(evidenceRecordId)) {
        errors.push(
          `Frontier claim velocity record ${record.id} references missing evidence record ${evidenceRecordId}`
        );
      }
    });
  }

  if (
    plottedFrontierClaimStatuses.has(record.status) &&
    (!record.source_ids || !record.evidence_record_ids ||
      record.source_ids.length + record.evidence_record_ids.length === 0)
  ) {
    errors.push(
      `Frontier claim velocity record ${record.id || "(missing id)"} is plotted but has no source or evidence links`
    );
  }

  if (plottedFrontierClaimStatuses.has(record.status) && record.value <= 0) {
    errors.push(
      `Frontier claim velocity record ${record.id || "(missing id)"} is plotted but value is not positive`
    );
  }
}

function validateFrontierClaimVelocityChain(errors, record, frontierClaimIds) {
  const label = record.id || "(missing id)";

  [
    ["prior_claim_id", record.prior_claim_id],
    ["supersedes_claim_id", record.supersedes_claim_id]
  ].forEach(([field, value]) => {
    if (value === null || value === undefined) return;
    if (!frontierClaimIds.has(value)) {
      errors.push(
        `Frontier claim velocity record ${label} ${field} references missing claim ${value}`
      );
    }
    if (value === record.id) {
      errors.push(`Frontier claim velocity record ${label} ${field} cannot reference itself`);
    }
  });
}

const evidenceRecords = readJson("evidence-records.json");
const frontierClaimVelocityRecords = readJson("frontier-claim-velocity.json");
const observables = readJson("observables.json");
const sources = readJson("sources.json");
const observations = readJson("observations.json");
const relationships = readJson("relationships.json");
const reviewDecisions = readJson("review-decisions.json");
const errors = [];
const warnings = [];

if (!Array.isArray(evidenceRecords)) {
  errors.push("evidence-records.json must be an array");
}
if (!Array.isArray(frontierClaimVelocityRecords)) {
  errors.push("frontier-claim-velocity.json must be an array");
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
const evidenceRecordIds = new Set(
  evidenceRecords.map((evidenceRecord) => evidenceRecord.id)
);
const sourceById = new Map(sources.map((source) => [source.id, source]));
const frontierClaimIds = new Set(
  frontierClaimVelocityRecords.map((record) => record.id)
);

duplicateValues(evidenceRecords, "id").forEach((id) =>
  errors.push(`Duplicate evidence record id ${id}`)
);
duplicateValues(frontierClaimVelocityRecords, "id").forEach((id) =>
  errors.push(`Duplicate frontier claim velocity record id ${id}`)
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
frontierClaimVelocityRecords.forEach((record) => {
  validateFrontierClaimVelocityRecord(
    errors,
    warnings,
    record,
    sourceIds,
    evidenceRecordIds
  );
  validateFrontierClaimVelocityChain(errors, record, frontierClaimIds);
});

const countsByType = observables.reduce((counts, observable) => {
  counts[observable.type] = (counts[observable.type] || 0) + 1;
  return counts;
}, {});

if (warnings.length > 0) {
  console.warn("Data validation warnings:");
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}

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
      evidenceRecords: evidenceRecords.length,
      frontierClaimVelocityRecords: frontierClaimVelocityRecords.length
    },
    null,
    2
  )
);

import governanceGapMatrixJson from "../../data/governance-gap-matrix.json";

// The Governance Gap Matrix tracks whether an organization's public
// materials recognize a set of cognitive-sovereignty-adjacent dimensions:
// portability, consent, context, auditability, appeal, and continuity.
//
// Every cell starts (and, honestly, currently remains) "not_yet_assessed" -
// that status means no research has been done yet, not that the
// organization fails the dimension. A real assessment (recognized,
// partially_recognized, or not_recognized) must cite a claim in the Claim
// Evidence Registry - this matrix never asserts a judgment about a real
// organization without a source-backed claim behind it.
export const governanceDimensions = [
  "portability",
  "consent",
  "context",
  "auditability",
  "appeal",
  "continuity"
] as const;

export const governanceGapStatuses = [
  "recognized",
  "partially_recognized",
  "not_recognized",
  "not_yet_assessed",
  "out_of_scope"
] as const;

export type GovernanceDimension = (typeof governanceDimensions)[number];
export type GovernanceGapStatus = (typeof governanceGapStatuses)[number];

export type GovernanceGapRecord = {
  id: string;
  subject_observable_id: string;
  subject_label: string;
  dimension: GovernanceDimension;
  status: GovernanceGapStatus;
  claim_id: string | null;
  notes: string;
  last_reviewed: string;
};

export const governanceGapMatrix =
  governanceGapMatrixJson as GovernanceGapRecord[];

const assessedStatuses = new Set<GovernanceGapStatus>([
  "recognized",
  "partially_recognized",
  "not_recognized"
]);

export function requiresClaimLink(status: GovernanceGapStatus) {
  return assessedStatuses.has(status);
}

export function getDimensionLabel(dimension: GovernanceDimension) {
  return dimension;
}

export function getGapStatusLabel(status: GovernanceGapStatus) {
  return status.replaceAll("_", " ");
}

export function getGapMatrixBySubject() {
  const bySubject = new Map<
    string,
    { label: string; records: GovernanceGapRecord[] }
  >();

  governanceGapMatrix.forEach((record) => {
    const existing = bySubject.get(record.subject_observable_id);
    if (existing) {
      existing.records.push(record);
    } else {
      bySubject.set(record.subject_observable_id, {
        label: record.subject_label,
        records: [record]
      });
    }
  });

  return [...bySubject.entries()]
    .map(([observableId, value]) => ({ observableId, ...value }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getAssessedCount() {
  return governanceGapMatrix.filter((record) =>
    assessedStatuses.has(record.status)
  ).length;
}

export function getGapCoveragePercent() {
  if (governanceGapMatrix.length === 0) return 0;
  return Math.round((getAssessedCount() / governanceGapMatrix.length) * 100);
}

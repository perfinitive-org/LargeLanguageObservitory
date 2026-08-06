import humanDecisionAuditsJson from "../../data/human-decision-audits.json";

// Meaningful Human Decision Audits test whether a platform's "human in
// the loop" claim is actually meaningful, on four axes: does the
// reviewer have real awareness of what they're deciding, real authority
// to change the outcome, clear accountability for the decision, and
// adequate time to review rather than a token click-through. Same
// pattern as the Governance Gap Matrix and Platform Portability
// Scorecards: every cell starts (and, honestly, currently remains)
// "not_yet_assessed" - no audit has been performed yet for any of these
// platforms. A real finding (meaningful, partially_meaningful, or
// not_meaningful) must cite a claim in the Claim Evidence Registry.
export const humanDecisionDimensions = [
  "awareness",
  "authority",
  "accountability",
  "time"
] as const;

export const humanDecisionStatuses = [
  "meaningful",
  "partially_meaningful",
  "not_meaningful",
  "not_yet_assessed",
  "out_of_scope"
] as const;

export type HumanDecisionDimension = (typeof humanDecisionDimensions)[number];
export type HumanDecisionStatus = (typeof humanDecisionStatuses)[number];

export type HumanDecisionAuditRecord = {
  id: string;
  subject_observable_id: string;
  subject_label: string;
  dimension: HumanDecisionDimension;
  status: HumanDecisionStatus;
  claim_id: string | null;
  notes: string;
  last_reviewed: string;
};

export const humanDecisionAudits =
  humanDecisionAuditsJson as HumanDecisionAuditRecord[];

const assessedHumanDecisionStatuses = new Set<HumanDecisionStatus>([
  "meaningful",
  "partially_meaningful",
  "not_meaningful"
]);

export function requiresClaimLink(status: HumanDecisionStatus) {
  return assessedHumanDecisionStatuses.has(status);
}

export function getHumanDecisionStatusLabel(status: HumanDecisionStatus) {
  return status.replaceAll("_", " ");
}

export function getHumanDecisionAuditsByPlatform() {
  const byPlatform = new Map<
    string,
    { label: string; records: HumanDecisionAuditRecord[] }
  >();

  humanDecisionAudits.forEach((record) => {
    const existing = byPlatform.get(record.subject_observable_id);
    if (existing) {
      existing.records.push(record);
    } else {
      byPlatform.set(record.subject_observable_id, {
        label: record.subject_label,
        records: [record]
      });
    }
  });

  return [...byPlatform.entries()]
    .map(([observableId, value]) => ({ observableId, ...value }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getHumanDecisionAssessedCount() {
  return humanDecisionAudits.filter((record) =>
    assessedHumanDecisionStatuses.has(record.status)
  ).length;
}

export function getHumanDecisionCoveragePercent() {
  if (humanDecisionAudits.length === 0) return 0;
  return Math.round(
    (getHumanDecisionAssessedCount() / humanDecisionAudits.length) * 100
  );
}

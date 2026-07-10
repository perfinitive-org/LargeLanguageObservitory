import platformPortabilityJson from "../../data/platform-portability-scorecards.json";

// Platform Portability Scorecards track whether a platform's public
// materials describe support for raw data export, context export, memory
// visibility, deletion controls, an appeal path, workflow continuity, and
// recovery. Same pattern as the Governance Gap Matrix: every cell starts
// (and, honestly, currently remains) "not_yet_assessed" - no portability
// research exists yet for any of these platforms, so every cell says so
// rather than asserting an unresearched judgment. A real assessment
// (supported, partially_supported, or not_supported) must cite a claim in
// the Claim Evidence Registry.
export const portabilityDimensions = [
  "raw_data_export",
  "context_export",
  "memory_visibility",
  "deletion_controls",
  "appeal_path",
  "workflow_continuity",
  "recovery"
] as const;

export const portabilityStatuses = [
  "supported",
  "partially_supported",
  "not_supported",
  "not_yet_assessed",
  "out_of_scope"
] as const;

export type PortabilityDimension = (typeof portabilityDimensions)[number];
export type PortabilityStatus = (typeof portabilityStatuses)[number];

export type PortabilityRecord = {
  id: string;
  subject_observable_id: string;
  subject_label: string;
  dimension: PortabilityDimension;
  status: PortabilityStatus;
  claim_id: string | null;
  notes: string;
  last_reviewed: string;
};

export const platformPortabilityScorecards =
  platformPortabilityJson as PortabilityRecord[];

const assessedPortabilityStatuses = new Set<PortabilityStatus>([
  "supported",
  "partially_supported",
  "not_supported"
]);

export function requiresClaimLink(status: PortabilityStatus) {
  return assessedPortabilityStatuses.has(status);
}

export function getPortabilityStatusLabel(status: PortabilityStatus) {
  return status.replaceAll("_", " ");
}

export function getPortabilityByPlatform() {
  const byPlatform = new Map<
    string,
    { label: string; records: PortabilityRecord[] }
  >();

  platformPortabilityScorecards.forEach((record) => {
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

export function getPortabilityAssessedCount() {
  return platformPortabilityScorecards.filter((record) =>
    assessedPortabilityStatuses.has(record.status)
  ).length;
}

export function getPortabilityCoveragePercent() {
  if (platformPortabilityScorecards.length === 0) return 0;
  return Math.round(
    (getPortabilityAssessedCount() / platformPortabilityScorecards.length) * 100
  );
}

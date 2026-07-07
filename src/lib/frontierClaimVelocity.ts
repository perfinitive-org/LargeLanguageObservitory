import frontierClaimVelocityJson from "../../data/frontier-claim-velocity.json";

export const frontierClaimTypes = ["model", "infrastructure"] as const;
export const frontierClaimUnitFamilies = [
  "parameters",
  "accelerators",
  "power"
] as const;
export const frontierClaimStatuses = [
  "source_backed",
  "reported_public_claim",
  "needs_source_review",
  "excluded_from_chart"
] as const;

// Method-governance fields (PACKET_061). These track the claim *event*
// itself (not just a growth data point), the source's citation and decay
// state, and whether the record is safe to plot as a comparable number.
export const frontierClaimEventTypes = [
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
] as const;

export const frontierClaimDirections = [
  "increase",
  "decrease",
  "delay",
  "cancellation",
  "revision",
  "unknown"
] as const;

export const frontierClaimSourceStatuses = [
  "live",
  "archived",
  "changed",
  "removed",
  "dead_link",
  "requires_review"
] as const;

export const frontierClaimNormalizationStatuses = [
  "direct",
  "converted_with_formula",
  "reported_equivalent",
  "ambiguous",
  "not_comparable",
  "quarantined"
] as const;

export const frontierClaimSourceTypes = [
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
] as const;

export const frontierClaimSourceTiers = [
  "primary",
  "official_partner",
  "public_record",
  "reputable_reporting",
  "secondary",
  "unresolved"
] as const;

export type FrontierClaimType = (typeof frontierClaimTypes)[number];
export type FrontierClaimUnitFamily =
  (typeof frontierClaimUnitFamilies)[number];
export type FrontierClaimStatus = (typeof frontierClaimStatuses)[number];
export type FrontierClaimEventType = (typeof frontierClaimEventTypes)[number];
export type FrontierClaimDirection = (typeof frontierClaimDirections)[number];
export type FrontierClaimSourceStatus =
  (typeof frontierClaimSourceStatuses)[number];
export type FrontierClaimNormalizationStatus =
  (typeof frontierClaimNormalizationStatuses)[number];
export type FrontierClaimSourceType = (typeof frontierClaimSourceTypes)[number];
export type FrontierClaimSourceTier = (typeof frontierClaimSourceTiers)[number];

export type FrontierClaimVelocityRecord = {
  id: string;
  date: string;
  entity: string;
  label: string;
  claim: string;
  type: FrontierClaimType;
  unit_family: FrontierClaimUnitFamily;
  value: number;
  display_value: string;
  source_ids: string[];
  evidence_record_ids: string[];
  status: FrontierClaimStatus;
  caveat: string;
  event_type: FrontierClaimEventType;
  direction: FrontierClaimDirection;
  source_type: FrontierClaimSourceType;
  source_tier: FrontierClaimSourceTier;
  source_url: string;
  archive_url: string;
  accessed_at: string;
  source_status: FrontierClaimSourceStatus;
  normalization_status: FrontierClaimNormalizationStatus;
  normalization_note: string;
  conversion_formula: string | null;
  plotted: boolean;
  prior_claim_id: string | null;
  supersedes_claim_id: string | null;
};

export const frontierClaimVelocityRecords =
  frontierClaimVelocityJson as FrontierClaimVelocityRecord[];

// A record's own `plotted` flag is the single source of truth for chart
// inclusion, not a status re-derived here — see scripts/validate-data.mjs
// for the rules that keep `plotted` consistent with normalization_status,
// source_status, and event_type before the record ever reaches this code.
export function isPlottedFrontierClaim(record: FrontierClaimVelocityRecord) {
  return record.plotted === true;
}

export function getPlottedFrontierClaims() {
  return frontierClaimVelocityRecords
    .filter(isPlottedFrontierClaim)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getModelScaleClaims() {
  return getPlottedFrontierClaims().filter(
    (record) => record.type === "model" && record.unit_family === "parameters"
  );
}

export function getInfrastructureScaleClaims() {
  return getPlottedFrontierClaims().filter(
    (record) =>
      record.type === "infrastructure" &&
      record.unit_family === "accelerators"
  );
}

export function getFrontierClaimStatusLabel(status: FrontierClaimStatus) {
  return status.replaceAll("_", " ");
}

const decayedSourceStatuses = new Set<FrontierClaimSourceStatus>([
  "archived",
  "changed",
  "removed",
  "dead_link"
]);

export function isSourceDecayed(record: FrontierClaimVelocityRecord) {
  return decayedSourceStatuses.has(record.source_status);
}

export function isReportedRatherThanDirect(
  record: FrontierClaimVelocityRecord
) {
  return record.normalization_status === "reported_equivalent";
}

/**
 * MVP glyph for the claim-event legend (PACKET_061):
 * - "●"  plotted, source-backed / direct claim
 * - "○"  plotted, reported public claim (not company/direct documentation)
 * - "—"  table-only / not plotted (needs review, ambiguous, quarantined, etc.)
 * - trailing " †" appended when the underlying source has decayed
 *   (archived, changed, removed, or a dead link) regardless of plotted state.
 */
export function getClaimGlyph(record: FrontierClaimVelocityRecord) {
  const base = !record.plotted
    ? "—"
    : isReportedRatherThanDirect(record)
      ? "○"
      : "●";
  return isSourceDecayed(record) ? `${base} †` : base;
}

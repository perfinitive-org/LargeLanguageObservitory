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

export type FrontierClaimType = (typeof frontierClaimTypes)[number];
export type FrontierClaimUnitFamily =
  (typeof frontierClaimUnitFamilies)[number];
export type FrontierClaimStatus = (typeof frontierClaimStatuses)[number];

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
};

export const frontierClaimVelocityRecords =
  frontierClaimVelocityJson as FrontierClaimVelocityRecord[];

export const plottedFrontierClaimStatuses = new Set<FrontierClaimStatus>([
  "source_backed",
  "reported_public_claim"
]);

export function isPlottedFrontierClaim(record: FrontierClaimVelocityRecord) {
  return plottedFrontierClaimStatuses.has(record.status) && record.value > 0;
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

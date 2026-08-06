import claimEvidenceRegistryJson from "../../data/claim-evidence-registry.json";

// The Claim Evidence Registry is the backbone object for the measurement
// and reporting layer: every claim gets an id, text, a source list, a
// status, an uncertainty label, and a review date. It is distinct from
// `observations` (one observable, one source, one confidence label) -
// a claim here can be linked to zero or more sources and is not tied to
// any single domain's observable model, so it can outlive any one
// proof case (AI infrastructure, cognitive rights, or a future domain).
export const claimStatuses = [
  "supported",
  "partially_supported",
  "needs_review",
  "contested",
  "unsupported",
  "out_of_scope",
  "protected"
] as const;

export const claimUncertaintyLevels = ["low", "medium", "high"] as const;

export type ClaimStatus = (typeof claimStatuses)[number];
export type ClaimUncertainty = (typeof claimUncertaintyLevels)[number];

export type ClaimEvidenceRecord = {
  id: string;
  text: string;
  subject_label: string;
  subject_observable_id: string | null;
  source_ids: string[];
  status: ClaimStatus;
  uncertainty: ClaimUncertainty;
  review_date: string;
  reviewer: string;
  evidence_type: string;
  notes: string;
};

export const claimEvidenceRegistry =
  claimEvidenceRegistryJson as ClaimEvidenceRecord[];

const sourceBackedStatuses = new Set<ClaimStatus>([
  "supported",
  "partially_supported",
  "contested"
]);

export function requiresSourceLinks(status: ClaimStatus) {
  return sourceBackedStatuses.has(status);
}

export function getClaimStatusLabel(status: ClaimStatus) {
  return status.replaceAll("_", " ");
}

const statusOrder: Record<ClaimStatus, number> = {
  supported: 0,
  partially_supported: 1,
  contested: 2,
  needs_review: 3,
  unsupported: 4,
  out_of_scope: 5,
  protected: 6
};

export function getClaimsByStatus() {
  return [...claimEvidenceRegistry].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );
}

export function getClaimCountsByStatus() {
  const counts = new Map<ClaimStatus, number>(
    claimStatuses.map((status) => [status, 0])
  );
  claimEvidenceRegistry.forEach((claim) => {
    counts.set(claim.status, (counts.get(claim.status) ?? 0) + 1);
  });
  return counts;
}

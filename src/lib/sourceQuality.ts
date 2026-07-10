import { claimEvidenceRegistry } from "./claimEvidenceRegistry";
import { sources } from "./data";
import type { Source } from "./types";

// Source Quality Reports are entirely derived from data that already
// exists and is already validated (sources.json + the Claim Evidence
// Registry). Nothing here is a new stored fact - it is a computed view,
// so there is no new raw data to fabricate and nothing new to validate
// beyond what scripts/validate-data.mjs already enforces on its inputs.

export const sourceTypeTiers = ["primary", "secondary", "placeholder"] as const;
export const sourceFreshnessTiers = ["fresh", "aging", "stale"] as const;
export const sourceDiversityTiers = [
  "broad",
  "narrow",
  "single_use",
  "unused"
] as const;
export const sourceCounterevidenceTiers = ["none_identified", "flagged"] as const;
export const sourceOverallTiers = ["strong", "moderate", "weak"] as const;

export type SourceTypeTier = (typeof sourceTypeTiers)[number];
export type SourceFreshnessTier = (typeof sourceFreshnessTiers)[number];
export type SourceDiversityTier = (typeof sourceDiversityTiers)[number];
export type SourceCounterevidenceTier =
  (typeof sourceCounterevidenceTiers)[number];
export type SourceOverallTier = (typeof sourceOverallTiers)[number];

export type SourceQualityReport = {
  source: Source;
  typeTier: SourceTypeTier;
  freshnessTier: SourceFreshnessTier;
  daysSinceRetrieved: number;
  claimCount: number;
  subjectCount: number;
  diversityTier: SourceDiversityTier;
  counterevidenceCount: number;
  counterevidenceTier: SourceCounterevidenceTier;
  overallTier: SourceOverallTier;
};

const placeholderReliabilities = new Set([
  "primary-placeholder",
  "government-placeholder"
]);

function getTypeTier(source: Source): SourceTypeTier {
  if (source.reliability === "primary") return "primary";
  if (placeholderReliabilities.has(source.reliability)) return "placeholder";
  return "secondary";
}

// Freshness is computed relative to the most recently retrieved source in
// the dataset, not the machine's system clock - that keeps this honest
// and reproducible regardless of when the report is generated, and avoids
// a stale-looking report simply because nothing has been re-checked since
// the last data pull.
function getAsOfDate(): number {
  return Math.max(...sources.map((source) => Date.parse(source.retrievedAt)));
}

function getFreshnessTier(daysSinceRetrieved: number): SourceFreshnessTier {
  if (daysSinceRetrieved <= 30) return "fresh";
  if (daysSinceRetrieved <= 180) return "aging";
  return "stale";
}

function getDiversityTier(
  claimCount: number,
  subjectCount: number
): SourceDiversityTier {
  if (claimCount === 0) return "unused";
  if (subjectCount >= 3) return "broad";
  if (subjectCount === 2) return "narrow";
  return "single_use";
}

function getOverallTier(
  typeTier: SourceTypeTier,
  freshnessTier: SourceFreshnessTier,
  counterevidenceTier: SourceCounterevidenceTier
): SourceOverallTier {
  if (
    counterevidenceTier === "flagged" ||
    typeTier === "placeholder" ||
    freshnessTier === "stale"
  ) {
    return "weak";
  }
  if (typeTier === "primary" && freshnessTier === "fresh") {
    return "strong";
  }
  return "moderate";
}

export function getSourceQualityReports(): SourceQualityReport[] {
  const asOfDate = getAsOfDate();

  return sources.map((source) => {
    const claims = claimEvidenceRegistry.filter((claim) =>
      claim.source_ids.includes(source.id)
    );
    const subjectIds = new Set(
      claims
        .map((claim) => claim.subject_observable_id)
        .filter((id): id is string => Boolean(id))
    );
    const counterevidenceCount = claims.filter((claim) =>
      claim.status === "contested" || claim.status === "unsupported"
    ).length;
    const counterevidenceTier: SourceCounterevidenceTier =
      counterevidenceCount > 0 ? "flagged" : "none_identified";

    const daysSinceRetrieved = Math.round(
      (asOfDate - Date.parse(source.retrievedAt)) / (1000 * 60 * 60 * 24)
    );
    const typeTier = getTypeTier(source);
    const freshnessTier = getFreshnessTier(daysSinceRetrieved);
    const diversityTier = getDiversityTier(claims.length, subjectIds.size);

    return {
      source,
      typeTier,
      freshnessTier,
      daysSinceRetrieved,
      claimCount: claims.length,
      subjectCount: subjectIds.size,
      diversityTier,
      counterevidenceCount,
      counterevidenceTier,
      overallTier: getOverallTier(typeTier, freshnessTier, counterevidenceTier)
    };
  });
}

const overallOrder: Record<SourceOverallTier, number> = {
  strong: 0,
  moderate: 1,
  weak: 2
};

export function getSourceQualityReportsByOverallTier(): SourceQualityReport[] {
  return [...getSourceQualityReports()].sort(
    (a, b) => overallOrder[a.overallTier] - overallOrder[b.overallTier]
  );
}

export function getSourceQualityCounts() {
  const counts = new Map<SourceOverallTier, number>(
    sourceOverallTiers.map((tier) => [tier, 0])
  );
  getSourceQualityReports().forEach((report) => {
    counts.set(report.overallTier, (counts.get(report.overallTier) ?? 0) + 1);
  });
  return counts;
}

export function getTierLabel(tier: string) {
  return tier.replaceAll("_", " ");
}

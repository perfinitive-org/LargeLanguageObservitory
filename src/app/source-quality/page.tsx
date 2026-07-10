import type { Metadata } from "next";
import Link from "next/link";
import {
  getSourceQualityCounts,
  getSourceQualityReportsByOverallTier,
  getTierLabel,
  sourceOverallTiers,
  type SourceOverallTier
} from "@/lib/sourceQuality";

export const metadata: Metadata = {
  title: "Source Quality Reports | AI Native Observatory",
  description:
    "How each cataloged source scores on type, freshness, diversity, and counterevidence."
};

const overallBadgeClasses: Record<SourceOverallTier, string> = {
  strong: "border-[#7ba36f]/35 bg-[#7ba36f]/10 text-[#b8d8b1]",
  moderate: "border-[#d39b50]/40 bg-[#d39b50]/10 text-[#f0c889]",
  weak: "border-slate-400/25 bg-slate-400/10 text-slate-300"
};

export default function SourceQualityPage() {
  const reports = getSourceQualityReportsByOverallTier();
  const counts = getSourceQualityCounts();

  return (
    <div className="bg-[#03050d] text-white">
      <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d]">
        <FieldTexture />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <nav className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/" className="text-[#8fb7cf] hover:text-white">
                Home
              </Link>
              <Link href="/claims" className="text-[#8fb7cf] hover:text-white">
                Claim Evidence Registry
              </Link>
              <Link href="/evidence" className="text-[#8fb7cf] hover:text-white">
                Evidence
              </Link>
              <Link
                href="/method/source-evidence-model"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source/Evidence Model
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Measurement layer
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              Source Quality Reports
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Every cataloged source is scored on type, freshness, breadth of
              use, and counterevidence - computed directly from the Claim
              Evidence Registry, not assigned by hand.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              What this is not
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This is not a safety rating, a trust score, or a certification.
              It describes how a source is cataloged (primary vs.
              placeholder), how recently it was checked, how many distinct
              claims and subjects rely on it, and whether any claim it
              supports has since been contested or found unsupported.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Overall tier counts
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {sourceOverallTiers.map((tier) => (
              <div
                key={tier}
                className="rounded border border-white/10 bg-[#03050d] p-3"
              >
                <p className="text-2xl font-semibold text-white">
                  {counts.get(tier) ?? 0}
                </p>
                <p className="mt-1 text-xs uppercase text-slate-400">
                  {getTierLabel(tier)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Scoring method
          </p>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-300 sm:grid-cols-2">
            <li>
              <span className="font-semibold text-white">Type</span> - primary
              catalog entries score higher than placeholder metadata.
            </li>
            <li>
              <span className="font-semibold text-white">Freshness</span> -
              days since last retrieved, relative to the most recently
              checked source in the catalog.
            </li>
            <li>
              <span className="font-semibold text-white">Diversity</span> -
              how many distinct claims and subjects rely on this source
              (broad, narrow, single use, or unused).
            </li>
            <li>
              <span className="font-semibold text-white">
                Counterevidence
              </span>{" "}
              - whether any claim this source supports has been marked
              contested or unsupported.
            </li>
          </ul>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Registry
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Every cataloged source
          </h2>

          <div className="mt-5 overflow-x-auto rounded border border-white/10 bg-[#03050d]">
            <table className="min-w-[1080px] divide-y divide-white/10 text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Overall</th>
                  <th className="px-3 py-3">Source</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Freshness</th>
                  <th className="px-3 py-3">Diversity</th>
                  <th className="px-3 py-3">Claims / subjects</th>
                  <th className="px-3 py-3">Counterevidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-300">
                {reports.map((report) => (
                  <tr key={report.source.id}>
                    <td className="px-3 py-4 align-top">
                      <span
                        className={`inline-flex rounded border px-2 py-1 text-xs font-semibold uppercase ${overallBadgeClasses[report.overallTier]}`}
                      >
                        {getTierLabel(report.overallTier)}
                      </span>
                    </td>
                    <td className="px-3 py-4 align-top">
                      <Link
                        href={`/sources/${report.source.slug}`}
                        className="font-semibold text-[#8fb7cf] hover:text-white"
                      >
                        {report.source.title}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">
                        {report.source.publisher}
                      </p>
                    </td>
                    <td className="px-3 py-4 align-top text-xs uppercase text-slate-400">
                      {getTierLabel(report.typeTier)}
                    </td>
                    <td className="px-3 py-4 align-top text-xs uppercase text-slate-400">
                      {getTierLabel(report.freshnessTier)}
                      <br />
                      {report.daysSinceRetrieved}d
                    </td>
                    <td className="px-3 py-4 align-top text-xs uppercase text-slate-400">
                      {getTierLabel(report.diversityTier)}
                    </td>
                    <td className="px-3 py-4 align-top">
                      {report.claimCount} / {report.subjectCount}
                    </td>
                    <td className="px-3 py-4 align-top text-xs uppercase text-slate-400">
                      {report.counterevidenceTier === "flagged"
                        ? `Flagged (${report.counterevidenceCount})`
                        : "None identified"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Method boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            &quot;None identified&quot; describes the current Claim Evidence
            Registry, not a guarantee that no counterevidence exists. Scores
            update automatically as claims are added, reviewed, or
            reclassified - they are computed, not asserted by hand.
          </p>
        </section>
      </main>
    </div>
  );
}

function FieldTexture() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-35"
      style={{
        backgroundImage:
          "linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)",
        backgroundSize: "56px 56px"
      }}
    />
  );
}

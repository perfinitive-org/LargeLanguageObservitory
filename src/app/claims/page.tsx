import type { Metadata } from "next";
import Link from "next/link";
import {
  claimStatuses,
  getClaimCountsByStatus,
  getClaimStatusLabel,
  getClaimsByStatus,
  requiresSourceLinks,
  type ClaimStatus
} from "@/lib/claimEvidenceRegistry";
import { getObservableById, getSourceById } from "@/lib/data";

export const metadata: Metadata = {
  title: "Claim Evidence Registry | AI Native Observatory",
  description:
    "A source-backed registry of claims: what was said, what supports it, and what remains unresolved."
};

const statusBadgeClasses: Record<ClaimStatus, string> = {
  supported: "border-[#7ba36f]/35 bg-[#7ba36f]/10 text-[#b8d8b1]",
  partially_supported: "border-[#8fb7cf]/35 bg-[#8fb7cf]/10 text-[#d8edf8]",
  needs_review: "border-[#d39b50]/40 bg-[#d39b50]/10 text-[#f0c889]",
  contested: "border-[#c97b63]/40 bg-[#c97b63]/10 text-[#f0c1af]",
  unsupported: "border-slate-400/25 bg-slate-400/10 text-slate-300",
  out_of_scope: "border-white/15 bg-white/[0.06] text-slate-400",
  protected: "border-white/15 bg-white/[0.06] text-slate-500"
};

export default function ClaimsPage() {
  const claims = getClaimsByStatus();
  const counts = getClaimCountsByStatus();

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
              <Link href="/evidence" className="text-[#8fb7cf] hover:text-white">
                Evidence
              </Link>
              <Link
                href="/evidence/frontier-claim-velocity"
                className="text-[#8fb7cf] hover:text-white"
              >
                Frontier Claim Velocity
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
              Claim Evidence Registry
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Every claim tracked here carries a source list, a status, an
              uncertainty label, and a review date. This is a source-backed
              evidence instrument, not a certification or a truth score.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              What this is not
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This registry does not certify, approve, or rate any entity. It
              records whether a specific claim is supported by sources,
              partially supported, unresolved, contested, unsupported, out of
              scope, or protected from publication pending review.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Status counts
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {claimStatuses.map((status) => (
              <div
                key={status}
                className="rounded border border-white/10 bg-[#03050d] p-3"
              >
                <p className="text-2xl font-semibold text-white">
                  {counts.get(status) ?? 0}
                </p>
                <p className="mt-1 text-xs uppercase text-slate-400">
                  {getClaimStatusLabel(status)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Registry
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Every tracked claim
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
            Claims asserted as supported, partially supported, or contested
            must carry at least one source. Claims marked needs review,
            unsupported, out of scope, or protected may carry none yet.
          </p>

          {claims.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No claims recorded yet.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto rounded border border-white/10 bg-[#03050d]">
              <table className="min-w-[980px] divide-y divide-white/10 text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Claim</th>
                    <th className="px-3 py-3">Subject</th>
                    <th className="px-3 py-3">Uncertainty</th>
                    <th className="px-3 py-3">Sources</th>
                    <th className="px-3 py-3">Review date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-300">
                  {claims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="px-3 py-4 align-top">
                        <span
                          className={`inline-flex rounded border px-2 py-1 text-xs font-semibold uppercase ${statusBadgeClasses[claim.status]}`}
                        >
                          {getClaimStatusLabel(claim.status)}
                        </span>
                      </td>
                      <td className="max-w-md px-3 py-4 align-top">
                        {claim.text}
                      </td>
                      <td className="px-3 py-4 align-top font-semibold text-white">
                        <ClaimSubject
                          label={claim.subject_label}
                          observableId={claim.subject_observable_id}
                        />
                      </td>
                      <td className="px-3 py-4 align-top text-xs uppercase text-slate-400">
                        {claim.uncertainty}
                      </td>
                      <td className="px-3 py-4 align-top">
                        <ClaimSources sourceIds={claim.source_ids} />
                      </td>
                      <td className="px-3 py-4 align-top">
                        {claim.review_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Method boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This registry is the backbone for future reports (source quality,
            governance gaps, platform portability, human-decision audits, and
            continuity incidents), not a finished measurement product on its
            own. A claim&apos;s status reflects source support only - it does
            not imply legal, medical, or compliance conclusions.
          </p>
        </section>
      </main>
    </div>
  );
}

function ClaimSubject({
  label,
  observableId
}: {
  label: string;
  observableId: string | null;
}) {
  const observable = observableId ? getObservableById(observableId) : undefined;

  if (!observable) {
    return <>{label}</>;
  }

  return (
    <Link
      href={`/registry/${observable.slug}`}
      className="text-[#8fb7cf] hover:text-white"
    >
      {label}
    </Link>
  );
}

function ClaimSources({ sourceIds }: { sourceIds: string[] }) {
  const sources = sourceIds
    .map(getSourceById)
    .filter((source): source is NonNullable<ReturnType<typeof getSourceById>> =>
      Boolean(source)
    );

  if (sources.length === 0) {
    return <span className="text-xs text-slate-500">No sources linked</span>;
  }

  return (
    <div className="grid gap-1">
      {sources.map((source) => (
        <Link
          key={source.id}
          href={`/sources/${source.slug}`}
          className="text-xs font-semibold text-[#8fb7cf] hover:text-white"
        >
          {source.title}
        </Link>
      ))}
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

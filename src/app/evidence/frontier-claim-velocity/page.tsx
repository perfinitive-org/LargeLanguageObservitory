import type { Metadata } from "next";
import Link from "next/link";
import { FrontierClaimVelocityChart } from "@/components/FrontierClaimVelocityChart";
import {
  type FrontierClaimStatus,
  type FrontierClaimVelocityRecord,
  frontierClaimVelocityRecords,
  getClaimGlyph,
  getFrontierClaimStatusLabel,
  getInfrastructureScaleClaims,
  getModelScaleClaims,
  isPlottedFrontierClaim,
  isSourceDecayed
} from "@/lib/frontierClaimVelocity";
import { getEvidenceRecordById, getSourceById } from "@/lib/data";

export const metadata: Metadata = {
  title: "Frontier Claim Velocity | AI Native Observatory",
  description:
    "A timeline of public source-backed claims about frontier AI model and infrastructure scale."
};

export default function FrontierClaimVelocityPage() {
  const modelClaims = getModelScaleClaims();
  const infrastructureClaims = getInfrastructureScaleClaims();
  const plottedCount = frontierClaimVelocityRecords.filter(
    isPlottedFrontierClaim
  ).length;
  const tableOnlyCount = frontierClaimVelocityRecords.length - plottedCount;

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
              <Link href="/latest" className="text-[#8fb7cf] hover:text-white">
                Latest
              </Link>
              <Link
                href="/custom-research"
                className="text-[#8fb7cf] hover:text-white"
              >
                Custom Research
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Evidence visualization
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              Frontier Claim Velocity
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              A timeline of public source-backed claims about frontier AI model
              and infrastructure scale.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Method boundary
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This page tracks public claim <em>events</em> over time, not
              only growth. A claim event may indicate expansion, revision,
              delay, cancellation, retraction, or uncertainty — a later,
              smaller, or withdrawn number is preserved on the record, not
              dropped. It does not forecast AGI, predict future systems,
              certify claims, rank providers, or verify private capacity.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Unit and normalization boundary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Values are shown by unit family and never silently normalized.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
            Values across unit families should not be interpreted as directly
            equivalent. Model parameters, accelerator counts, and power claims
            describe different things; this MVP separates plotted claims into
            model-scale and infrastructure-scale panels. The system does not
            normalize incompatible metrics without a transparent conversion
            rule, and it does not plot ambiguous or not-comparable figures
            (e.g. &quot;hundreds of thousands&quot; without a stated number) —
            those rows remain in the table below with a note explaining why.
          </p>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Source boundary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Direct documentation is not the same as reported coverage.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
            Investigative and news reporting may be tracked here as a
            reported public claim when clearly labeled, but it is not treated
            as equivalent to direct documentation, filings, permits, or
            public records — the table below marks each row&apos;s source
            type and tier so that distinction stays visible. If a linked
            source later changes or disappears, the record is marked for
            review rather than silently removed or re-plotted.
          </p>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Symbol legend
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300 sm:grid-cols-2">
            <li><span className="font-mono text-white">●</span> Plotted, source-backed / direct claim</li>
            <li><span className="font-mono text-white">○</span> Plotted, reported public claim (not direct documentation)</li>
            <li><span className="font-mono text-white">—</span> Table-only / not plotted (needs review, ambiguous, or quarantined)</li>
            <li><span className="font-mono text-white">†</span> Underlying source has changed, been archived, or gone dead</li>
          </ul>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Chart
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Public scale claims over time
              </h2>
            </div>
            <span className="w-fit rounded border border-white/10 bg-[#03050d] px-3 py-2 text-xs font-semibold uppercase text-slate-300">
              {plottedCount} plotted &middot; {tableOnlyCount} table-only
            </span>
          </div>

          <div className="mt-5">
            <FrontierClaimVelocityChart
              modelClaims={modelClaims}
              infrastructureClaims={infrastructureClaims}
            />
          </div>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Data table
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Every claim event, plotted or not
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
            Only rows marked <span className="font-mono">plotted</span> appear
            on the chart above. Needs-review, ambiguous, and quarantined rows
            remain visible here as candidate or table-only points but are
            excluded from the chart until stronger source and evidence support
            exists, or until the metric can be compared without guessing.
          </p>

          <div className="mt-5 overflow-x-auto rounded border border-white/10 bg-[#03050d]">
            <table className="min-w-[1180px] divide-y divide-white/10 text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Symbol</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Entity</th>
                  <th className="px-3 py-3">Claim label</th>
                  <th className="px-3 py-3">Display value</th>
                  <th className="px-3 py-3">Event / direction</th>
                  <th className="px-3 py-3">Source type / tier</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Source / evidence links</th>
                  <th className="px-3 py-3">Normalization</th>
                  <th className="px-3 py-3">Caveat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-300">
                {frontierClaimVelocityRecords.map((record) => (
                  <tr key={record.id}>
                    <td
                      className="px-3 py-4 align-top font-mono text-white"
                      title={
                        isSourceDecayed(record)
                          ? "Underlying source has changed, been archived, or gone dead"
                          : record.plotted
                            ? "Plotted"
                            : "Table-only / not plotted"
                      }
                    >
                      {getClaimGlyph(record)}
                    </td>
                    <td className="px-3 py-4 align-top">{record.date}</td>
                    <td className="px-3 py-4 align-top font-semibold text-white">
                      {record.entity}
                    </td>
                    <td className="px-3 py-4 align-top">
                      <p className="font-semibold text-white">{record.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">
                        {record.claim}
                      </p>
                    </td>
                    <td className="px-3 py-4 align-top">
                      {record.display_value}
                    </td>
                    <td className="px-3 py-4 align-top text-xs uppercase text-slate-400">
                      {record.event_type.replaceAll("_", " ")}
                      <br />
                      {record.direction.replaceAll("_", " ")}
                    </td>
                    <td className="px-3 py-4 align-top text-xs uppercase text-slate-400">
                      {record.source_type.replaceAll("_", " ")}
                      <br />
                      {record.source_tier.replaceAll("_", " ")}
                    </td>
                    <td className="px-3 py-4 align-top">
                      <StatusBadge status={record.status} />
                    </td>
                    <td className="px-3 py-4 align-top">
                      <SourceEvidenceLinks record={record} />
                    </td>
                    <td className="max-w-[220px] px-3 py-4 align-top text-xs leading-5 text-slate-400">
                      <span className="uppercase text-slate-500">
                        {record.normalization_status.replaceAll("_", " ")}
                      </span>
                      {record.normalization_note ? (
                        <p className="mt-1">{record.normalization_note}</p>
                      ) : null}
                    </td>
                    <td className="max-w-xs px-3 py-4 align-top text-xs leading-5 text-slate-400">
                      {record.caveat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <Panel title="Interpretation Boundary" eyebrow="What this does not say">
            <p className="text-sm leading-6 text-slate-300">
              The chart does not say that any system is near AGI. It does not
              compare capability, safety, provider quality, or private capacity.
              It shows when public scale claims entered the observable record
              and whether those claims are ready to plot under the current
              source rules.
            </p>
          </Panel>

          <Panel title="Buyer Implications" eyebrow="Research use">
            <p className="text-sm leading-6 text-slate-300">
              For buyers, the question is not whether a chart predicts AGI. It
              does not.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              The practical question is whether existing procurement, risk, and
              vendor-review processes are keeping pace with the public scale
              claims being made across the AI infrastructure ecosystem.
            </p>
          </Panel>
        </section>

        <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Custom research
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Need this translated into vendor questions or a provider-specific
            evidence brief?
          </h2>
          <Link
            href="/custom-research"
            className="mt-5 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#03050d] transition hover:bg-slate-200"
          >
            Request custom research
          </Link>
        </section>
      </main>
    </div>
  );
}

function SourceEvidenceLinks({
  record
}: {
  record: FrontierClaimVelocityRecord;
}) {
  const sources = record.source_ids
    .map(getSourceById)
    .filter((source): source is NonNullable<ReturnType<typeof getSourceById>> =>
      Boolean(source)
    );
  const evidenceRecords = record.evidence_record_ids
    .map(getEvidenceRecordById)
    .filter(
      (
        evidence
      ): evidence is NonNullable<ReturnType<typeof getEvidenceRecordById>> =>
        Boolean(evidence)
    );

  const hasRawUrl = Boolean(record.source_url);
  const decayed = isSourceDecayed(record);

  if (sources.length === 0 && evidenceRecords.length === 0 && !hasRawUrl) {
    return <span className="text-xs text-slate-500">Needs source review</span>;
  }

  return (
    <div className="grid gap-2">
      {sources.map((source) => (
        <Link
          key={source.id}
          href={`/sources/${source.slug}`}
          className="text-xs font-semibold text-[#8fb7cf] hover:text-white"
        >
          Source: {source.title}
        </Link>
      ))}
      {evidenceRecords.map((evidence) => (
        <Link
          key={evidence.id}
          href={`/evidence/${evidence.id}`}
          className="text-xs font-semibold text-[#8fb7cf] hover:text-white"
        >
          Evidence: {evidence.title}
        </Link>
      ))}
      {hasRawUrl ? (
        <a
          href={record.source_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-400 hover:text-white"
        >
          Original URL{record.accessed_at ? ` (accessed ${record.accessed_at})` : ""}
        </a>
      ) : null}
      {record.archive_url ? (
        <a
          href={record.archive_url}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-400 hover:text-white"
        >
          Archived copy
        </a>
      ) : null}
      {decayed ? (
        <span className="text-xs font-semibold uppercase text-amber-400">
          † source {record.source_status.replaceAll("_", " ")} — flagged for review
        </span>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: FrontierClaimStatus }) {
  return (
    <span className="inline-flex rounded border border-white/15 bg-white/[0.06] px-2 py-1 text-xs font-semibold uppercase text-slate-200">
      {getFrontierClaimStatusLabel(status)}
    </span>
  );
}

function Panel({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
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

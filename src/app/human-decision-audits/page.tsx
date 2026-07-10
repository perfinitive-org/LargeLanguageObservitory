import type { Metadata } from "next";
import Link from "next/link";
import {
  getHumanDecisionAuditsByPlatform,
  getHumanDecisionCoveragePercent,
  getHumanDecisionStatusLabel,
  humanDecisionDimensions,
  type HumanDecisionStatus
} from "@/lib/humanDecisionAudits";
import { getObservableById } from "@/lib/data";

export const metadata: Metadata = {
  title: "Meaningful Human Decision Audits | AI Native Observatory",
  description:
    "Whether a platform's human-in-the-loop claim is backed by real awareness, authority, accountability, and time - or just a label."
};

const statusCellClasses: Record<HumanDecisionStatus, string> = {
  meaningful: "border-[#7ba36f]/35 bg-[#7ba36f]/10 text-[#b8d8b1]",
  partially_meaningful: "border-[#8fb7cf]/35 bg-[#8fb7cf]/10 text-[#d8edf8]",
  not_meaningful: "border-[#c97b63]/40 bg-[#c97b63]/10 text-[#f0c1af]",
  not_yet_assessed: "border-white/10 bg-white/[0.03] text-slate-500",
  out_of_scope: "border-white/10 bg-white/[0.03] text-slate-600"
};

const statusSymbols: Record<HumanDecisionStatus, string> = {
  meaningful: "●",
  partially_meaningful: "◐",
  not_meaningful: "○",
  not_yet_assessed: "—",
  out_of_scope: "n/a"
};

const dimensionCopy: Record<
  (typeof humanDecisionDimensions)[number],
  { label: string; question: string }
> = {
  awareness: {
    label: "Awareness",
    question: "Does the reviewer know what they're actually deciding?"
  },
  authority: {
    label: "Authority",
    question: "Can the reviewer actually change or reject the outcome?"
  },
  accountability: {
    label: "Accountability",
    question: "Is someone identifiably responsible for the decision?"
  },
  time: {
    label: "Time",
    question: "Is there adequate time to review, not a token click-through?"
  }
};

export default function HumanDecisionAuditsPage() {
  const byPlatform = getHumanDecisionAuditsByPlatform();
  const coveragePercent = getHumanDecisionCoveragePercent();

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
              <Link
                href="/platform-portability"
                className="text-[#8fb7cf] hover:text-white"
              >
                Platform Portability Scorecards
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Measurement layer
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              Meaningful Human Decision Audits
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              &quot;Human in the loop&quot; is a claim, not a guarantee. This
              audit tests whether that claim is backed by real awareness,
              authority, accountability, and time - or just a label.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              What this is not
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              &quot;Not yet assessed&quot; means no audit has been performed
              yet - it is not a claim that human review is decorative. A
              real finding (meaningful, partially meaningful, or not
              meaningful) always cites a claim in the Claim Evidence
              Registry. This is not a legal determination of liability.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Coverage
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {coveragePercent}% of cells have a real, source-backed finding
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Coverage grows only as real audits are added to the Claim
            Evidence Registry - it is never filled in by assumption.
          </p>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            The four axes
          </p>
          <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-300 sm:grid-cols-2">
            {humanDecisionDimensions.map((dimension) => (
              <li key={dimension}>
                <span className="font-semibold text-white">
                  {dimensionCopy[dimension].label}
                </span>{" "}
                - {dimensionCopy[dimension].question}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Symbol legend
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300 sm:grid-cols-2">
            <li><span className="font-mono text-white">●</span> Meaningful (source-backed)</li>
            <li><span className="font-mono text-white">◐</span> Partially meaningful (source-backed)</li>
            <li><span className="font-mono text-white">○</span> Not meaningful (source-backed)</li>
            <li><span className="font-mono text-white">—</span> Not yet assessed</li>
          </ul>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Audit
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Platforms &times; axes
          </h2>

          <div className="mt-5 overflow-x-auto rounded border border-white/10 bg-[#03050d]">
            <table className="min-w-[760px] divide-y divide-white/10 text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Platform</th>
                  {humanDecisionDimensions.map((dimension) => (
                    <th key={dimension} className="px-3 py-3">
                      {dimensionCopy[dimension].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-300">
                {byPlatform.map((platform) => {
                  const observable = getObservableById(platform.observableId);
                  return (
                    <tr key={platform.observableId}>
                      <td className="whitespace-nowrap px-3 py-3 align-top font-semibold text-white">
                        {observable ? (
                          <Link
                            href={`/registry/${observable.slug}`}
                            className="text-[#8fb7cf] hover:text-white"
                          >
                            {platform.label}
                          </Link>
                        ) : (
                          platform.label
                        )}
                      </td>
                      {humanDecisionDimensions.map((dimension) => {
                        const record = platform.records.find(
                          (r) => r.dimension === dimension
                        );
                        if (!record) {
                          return (
                            <td key={dimension} className="px-3 py-3 align-top">
                              <span className="text-xs text-slate-600">n/a</span>
                            </td>
                          );
                        }
                        return (
                          <td key={dimension} className="px-3 py-3 align-top">
                            <span
                              className={`inline-flex rounded border px-2 py-1 font-mono text-xs ${statusCellClasses[record.status]}`}
                              title={getHumanDecisionStatusLabel(record.status)}
                            >
                              {statusSymbols[record.status]}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Method boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This audit scopes to platforms already tracked as Model
            observables in the registry. It does not determine legal
            liability, does not certify any review process, and does not
            imply that the absence of a finding means a process is
            inadequate - only that it has not yet been examined.
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

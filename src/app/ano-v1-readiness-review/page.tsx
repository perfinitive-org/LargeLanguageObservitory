import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import { evidenceRecords, observables, reviewDecisions } from "@/lib/data";
import type { Observable, ObservableType } from "@/lib/types";

export const metadata: Metadata = {
  title: "ANO v1.0 Readiness Review | AI Native Observatory",
  description:
    "Read-only readiness review for AI Native Observatory v1.0 after the 80 source-backed threshold."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;
type ReadinessVerdict = "Ready" | "Mostly Ready" | "Needs Work" | "Not Ready";

const observableTypes: Array<{
  type: ObservableType;
  label: string;
}> = [
  { type: "Organization", label: "Organizations" },
  { type: "Model", label: "Models" },
  { type: "Data Center", label: "Infrastructure" },
  { type: "Source", label: "Sources" }
];

const statusCounts = {
  total: observables.length,
  source_backed: countByStatus("source_backed"),
  needs_source_review: countByStatus("needs_source_review"),
  placeholder: countByStatus("placeholder")
};

const unresolvedRows = observableTypes.map((row) => {
  const count = observables.filter(
    (observable) =>
      observable.type === row.type &&
      observable.verification_status !== "source_backed"
  ).length;

  return {
    ...row,
    count,
    share: formatPercent(count, statusCounts.needs_source_review + statusCounts.placeholder)
  };
});

const readinessRows: Array<{
  category: string;
  verdict: ReadinessVerdict;
  rationale: string;
}> = [
  {
    category: "Data integrity",
    verdict: "Ready",
    rationale:
      "The registry validates with 101 observables and reconciled status counts."
  },
  {
    category: "Evidence integrity",
    verdict: "Mostly Ready",
    rationale:
      "The evidence ledger is operational at 84 records, but archival snapshot depth remains a known gap."
  },
  {
    category: "Review workflow maturity",
    verdict: "Ready",
    rationale:
      "Review decisions, review queue, and verification pages are working static governance surfaces."
  },
  {
    category: "Verification coverage",
    verdict: "Mostly Ready",
    rationale:
      "80 records are source-backed, with 20 needs-review records and one placeholder still unresolved."
  },
  {
    category: "Public-facing clarity",
    verdict: "Needs Work",
    rationale:
      "Core status pages exist, but public governance and v1.0 release explanations are not yet hardened."
  },
  {
    category: "Governance clarity",
    verdict: "Mostly Ready",
    rationale:
      "The 80-threshold lock, state audit, and backlog pages clarify governance boundaries, with release packaging still pending."
  },
  {
    category: "Source/provenance clarity",
    verdict: "Mostly Ready",
    rationale:
      "The source/evidence distinction is established, while evidence archival and provenance depth should improve later."
  },
  {
    category: "Static deployment readiness",
    verdict: "Ready",
    rationale:
      "The app builds and exports as static content with generated registry, source, evidence, and review pages."
  },
  {
    category: "Known unresolved records",
    verdict: "Needs Work",
    rationale:
      "Models remain the largest unresolved category, and the registry still includes one placeholder."
  },
  {
    category: "Scope boundary clarity",
    verdict: "Ready",
    rationale:
      "ANO, parked DRO work, and parked Signals Infrastructure generalization are clearly separated by the status lock."
  }
];

const strengths = [
  "80 source-backed records",
  "Evidence ledger operational",
  "Review decisions operational",
  "Source/evidence distinction established",
  "Review queue operational",
  "State audit passed",
  "80-threshold lock completed",
  "DRO boundary protected"
];

const gaps = [
  "20 needs-review records",
  "1 placeholder",
  "Unresolved source observables",
  "Evidence archival/snapshot depth",
  "Public governance pages not yet hardened",
  "No formal v1.0 release notes yet"
];

const v1PathOptions = [
  {
    label: "A",
    title: "Continue verification toward 90",
    verdict: "Mostly Ready" as ReadinessVerdict,
    detail:
      "Improves coverage, especially for the remaining model backlog, but should not delay governance hardening if v1.0 is the target."
  },
  {
    label: "B",
    title: "Harden governance/public documentation",
    verdict: "Needs Work" as ReadinessVerdict,
    detail:
      "Strengthens public interpretation of the existing system and addresses the clearest readiness gap."
  },
  {
    label: "C",
    title: "Prepare v1.0 release package",
    verdict: "Mostly Ready" as ReadinessVerdict,
    detail:
      "Packages what ANO already is: an 80-record source-backed AI ecosystem trust instrument with audit trails."
  },
  {
    label: "D",
    title: "Improve evidence archival/provenance later",
    verdict: "Needs Work" as ReadinessVerdict,
    detail:
      "Important for future robustness, but can be sequenced after a clear v1.0 readiness package."
  }
];

export default function AnoV1ReadinessReviewPage() {
  return (
    <div className="bg-[#03050d] text-white">
      <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)",
            backgroundSize: "56px 56px"
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(36,91,123,0.24),transparent)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <nav className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/" className="text-[#8fb7cf] hover:text-white">
                Home
              </Link>
              <Link
                href="/ano-80-status-lock"
                className="text-[#8fb7cf] hover:text-white"
              >
                80 Status Lock
              </Link>
              <Link
                href="/ano-governance"
                className="text-[#8fb7cf] hover:text-white"
              >
                Governance
              </Link>
              <Link
                href="/ano-v1-release-candidate"
                className="text-[#8fb7cf] hover:text-white"
              >
                v1.0 RC
              </Link>
              <Link
                href="/ano-v1-internal-qa"
                className="text-[#8fb7cf] hover:text-white"
              >
                Internal QA
              </Link>
              <Link
                href="/mvp-status"
                className="text-[#8fb7cf] hover:text-white"
              >
                MVP Status
              </Link>
              <Link
                href="/review-metrics"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Metrics
              </Link>
              <Link
                href="/backlog-rebalance"
                className="text-[#8fb7cf] hover:text-white"
              >
                Backlog Rebalance
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              v1.0 readiness review
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              ANO v1.0 readiness review.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This read-only review evaluates whether the AI Native Observatory
              is ready for a v1.0 review package after reaching and locking the
              80 source-backed threshold. It changes no data, statuses,
              evidence, review decisions, schemas, or architecture.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Current ANO State
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryLine label="Observables" value={statusCounts.total} />
              <SummaryLine
                label="Source backed"
                value={statusCounts.source_backed}
                status="source_backed"
              />
              <SummaryLine
                label="Needs review"
                value={statusCounts.needs_source_review}
                status="needs_source_review"
              />
              <SummaryLine
                label="Placeholder"
                value={statusCounts.placeholder}
                status="placeholder"
              />
              <SummaryLine label="Evidence records" value={evidenceRecords.length} />
              <SummaryLine
                label="Review decisions"
                value={reviewDecisions.length}
              />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Readiness Verdicts"
            title="Category-by-category v1.0 review"
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Verdict</th>
                  <th className="px-3 py-3 font-semibold">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {readinessRows.map((row) => (
                  <tr key={row.category} className="border-b border-white/10">
                    <td className="px-3 py-4 font-semibold text-white">
                      {row.category}
                    </td>
                    <td className="px-3 py-4">
                      <VerdictBadge verdict={row.verdict} />
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.rationale}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Current Strengths" eyebrow="Ready foundation">
            <ChecklistGrid items={strengths} />
          </Panel>

          <Panel title="Remaining Gaps" eyebrow="Needs attention">
            <ChecklistGrid items={gaps} muted />
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Known Unresolved Records"
            title="Remaining backlog by category"
          />
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {unresolvedRows.map((row) => (
              <article
                key={row.type}
                className="rounded border border-white/10 bg-[#03050d] p-4"
              >
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {row.label}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {row.count}
                </h3>
                <p className="mt-2 text-sm text-slate-400">
                  {row.share} of unresolved records
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Recommended v1.0 Path"
            title="Compare options before choosing"
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            {v1PathOptions.map((option) => (
              <article
                key={option.label}
                className="rounded border border-white/10 bg-[#03050d] p-4"
              >
                <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                  Option {option.label}
                </p>
                <h3 className="mt-2 text-base font-semibold leading-6 text-white">
                  {option.title}
                </h3>
                <div className="mt-3">
                  <VerdictBadge verdict={option.verdict} />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {option.detail}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function countByStatus(status: ReviewStatus) {
  return observables.filter(
    (observable) => observable.verification_status === status
  ).length;
}

function formatPercent(count: number, total: number) {
  if (total === 0) {
    return "0.0%";
  }

  return `${((count / total) * 100).toFixed(1)}%`;
}

function SummaryLine({
  label,
  value,
  status
}: {
  label: string;
  value: number;
  status?: ReviewStatus;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-white/10 bg-[#03050d] px-3 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="flex items-center gap-2 text-sm font-semibold text-white">
        {status ? <VerificationBadge status={status} /> : null}
        {value}
      </span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="border-b border-white/10 pb-3">
      <p className="text-xs font-semibold uppercase text-slate-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
    </div>
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
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ChecklistGrid({
  items,
  muted = false
}: {
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-md border border-white/10 bg-[#03050d] px-3 py-3 text-sm text-slate-300"
        >
          <span
            aria-hidden="true"
            className={`font-semibold ${muted ? "text-slate-500" : "text-[#b8d8b1]"}`}
          >
            {muted ? "GAP" : "OK"}
          </span>
          {item}
        </div>
      ))}
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: ReadinessVerdict }) {
  const colorClass =
    verdict === "Ready"
      ? "border-[#7ba36f]/50 bg-[#7ba36f]/12 text-[#d8f2d2]"
      : verdict === "Mostly Ready"
        ? "border-[#8fb7cf]/45 bg-[#8fb7cf]/10 text-[#d8edf8]"
        : verdict === "Needs Work"
          ? "border-[#d1a64a]/45 bg-[#d1a64a]/10 text-[#f6dfad]"
          : "border-[#c66]/45 bg-[#c66]/10 text-[#ffd0d0]";

  return (
    <span
      className={`inline-flex rounded border px-2 py-1 text-xs font-semibold uppercase ${colorClass}`}
    >
      {verdict}
    </span>
  );
}

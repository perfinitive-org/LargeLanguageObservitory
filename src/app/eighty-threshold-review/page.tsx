import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import { evidenceRecords, observables, reviewDecisions } from "@/lib/data";
import type { Observable, ObservableType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Eighty Threshold Review | AI Native Observatory",
  description:
    "Static milestone review for the AI Native Observatory after reaching 80 source-backed records."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;

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

const unresolvedCount =
  statusCounts.needs_source_review + statusCounts.placeholder;

const unresolvedRows = [
  ...observableTypes.map((row) => {
    const records = observables.filter(
      (observable) =>
        observable.type === row.type &&
        observable.verification_status !== "source_backed"
    );

    return {
      key: row.type,
      label: row.label,
      count: records.length,
      share: formatPercent(records.length, unresolvedCount),
      note: getBacklogNote(row.type)
    };
  }),
  {
    key: "Placeholder",
    label: "Placeholder",
    count: statusCounts.placeholder,
    share: formatPercent(statusCounts.placeholder, unresolvedCount),
    note: "Status subset; currently overlaps Infrastructure"
  }
];

const evolutionRows = [
  {
    phase: "Registry formation",
    detail:
      "The Observatory established 101 canonical observables across organizations, models, infrastructure, and source artifacts."
  },
  {
    phase: "Review workflow creation",
    detail:
      "Review queues, conservative status language, and review decision records made status movement explicit instead of implicit."
  },
  {
    phase: "Evidence normalization",
    detail:
      "Evidence records separated source artifacts from conclusions and linked review work back to observable records."
  },
  {
    phase: "Verification pilots",
    detail:
      "The AI21 Labs and Equinix pilots proved the smallest useful source-backed transition before wider batches."
  },
  {
    phase: "Infrastructure verification",
    detail:
      "Infrastructure batches moved the registry from seed coverage toward source-backed operator and site records while preserving placeholders."
  },
  {
    phase: "Model verification",
    detail:
      "Model verification introduced model-specific discipline and avoided broad family evidence for specific records."
  },
  {
    phase: "Source verification",
    detail:
      "Source batches tested whether Source observables themselves were identifiable, attributable, accessible, and correctly represented."
  },
  {
    phase: "State audit",
    detail:
      "The state audit reconciled observable, evidence, review, batch, and status ledgers before further verification work."
  },
  {
    phase: "Threshold 80 achievement",
    detail:
      "A single-record threshold review moved the registry to 80 source-backed records without creating a new batch."
  }
];

const governanceRows = [
  "Observable registry",
  "Evidence layer",
  "Review decision ledger",
  "Verification workflow",
  "Source governance",
  "State audit process",
  "Backlog governance"
];

const lessonRows = [
  {
    title: "Evidence before conclusion",
    detail:
      "The registry became more reliable when evidence artifacts were recorded before status changes were made."
  },
  {
    title: "Review before verification",
    detail:
      "Review decisions created a deliberate pause between a candidate record and a source-backed outcome."
  },
  {
    title: "Trust over volume",
    detail:
      "The Observatory gained value by upgrading fewer records with tighter evidence instead of expanding claims quickly."
  },
  {
    title: "Governance before automation",
    detail:
      "Manual criteria, auditability, and conservative outcomes came before any ingestion or automation concepts."
  },
  {
    title: "Verification creates value",
    detail:
      "Each source-backed transition improved the registry as a decision surface, not merely as a list of AI ecosystem objects."
  }
];

const primitiveRows = [
  {
    primitive: "Observable",
    role:
      "A stable object of attention that can be reviewed, related, and counted."
  },
  {
    primitive: "Observation",
    role:
      "A bounded claim or note connecting an observable to a source record."
  },
  {
    primitive: "Source",
    role:
      "Operational source metadata used by observations and relationships."
  },
  {
    primitive: "Evidence",
    role:
      "A normalized artifact used to support a review outcome without becoming the conclusion itself."
  },
  {
    primitive: "Review Decision",
    role:
      "A human-readable governance record explaining status movement or retention."
  },
  {
    primitive: "Verification Status",
    role:
      "A compact trust state that makes review coverage visible across the registry."
  }
];

const validationRows = [
  {
    label: "ANO",
    status: "Supports hypothesis",
    detail:
      "The AI Native Observatory demonstrates that these primitives can support a governed, auditable static registry."
  },
  {
    label: "DRO",
    status: "Pending replication",
    detail:
      "The hypothesis should next be tested by replicating the pattern in the Digital Roots Observatory."
  },
  {
    label: "Future observatories",
    status: "Not tested",
    detail:
      "No claim is made that the pattern is universal or validated outside ANO."
  }
];

export default function EightyThresholdReviewPage() {
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
              <Link
                href="/verification-threshold-80"
                className="text-[#8fb7cf] hover:text-white"
              >
                Threshold 80
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              80-threshold milestone review
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Eighty source-backed records: what now exists.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This static milestone review interprets the Observatory after the
              80-record threshold. It performs no verification, creates no
              evidence, records no decisions, and changes no ledger status.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Current Observatory State
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
            eyebrow="Observatory Evolution"
            title="Major phases completed"
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {evolutionRows.map((row) => (
              <InfoCard key={row.phase} title={row.phase} detail={row.detail} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Panel title="Governance Achievements" eyebrow="What exists now">
            <div className="grid gap-2">
              {governanceRows.map((item) => (
                <ChecklistItem key={item} label={item} />
              ))}
            </div>
          </Panel>

          <Panel title="Remaining Backlog" eyebrow="Current unresolved records">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Count</th>
                    <th className="px-3 py-3 font-semibold">
                      Share of unresolved
                    </th>
                    <th className="px-3 py-3 font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {unresolvedRows.map((row) => (
                    <tr key={row.key} className="border-b border-white/10">
                      <td className="px-3 py-4 font-semibold text-white">
                        {row.label}
                      </td>
                      <td className="px-3 py-4 text-slate-300">{row.count}</td>
                      <td className="px-3 py-4 text-slate-300">{row.share}</td>
                      <td className="px-3 py-4 text-slate-400">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Placeholder is shown as a status subset and is not additive with
              the category rows.
            </p>
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Observatory Lessons"
            title="What the 80-record threshold taught"
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {lessonRows.map((row) => (
              <InfoCard key={row.title} title={row.title} detail={row.detail} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Historical Infrastructure Insight — Parked"
            title="Trust primitives as an emerging hypothesis"
          />
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
            ANO suggests a hypothesis: Observable, Observation, Source,
            Evidence, Review Decision, and Verification Status may be reusable
            trust primitives for governed observatories. This is a hypothesis
            supported by ANO practice. It is not validation, not a claim of
            universality, and not a claim that the pattern will work unchanged
            in other domains. Signals Infrastructure remains a candidate and
            parked generalization; it is not part of ANO v1.0.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {primitiveRows.map((row) => (
              <InfoCard
                key={row.primitive}
                title={row.primitive}
                detail={row.role}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel title="Validation Status" eyebrow="Hypothesis boundary">
            <div className="grid gap-3">
              {validationRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded border border-white/10 bg-[#03050d] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-semibold text-white">{row.label}</h3>
                    <span className="rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-2 py-1 text-xs font-semibold uppercase text-[#d8edf8]">
                      {row.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {row.detail}
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Recommended Next Action" eyebrow="After 80">
            <p className="text-sm leading-6 text-slate-300">
              DRO validation was later parked. The current ANO priority is to
              complete implementation readiness: scope contamination check,
              internal v1 QA, final copy QA, and public launch decision.
              Signals Infrastructure remains a candidate/parked generalization
              and is not part of ANO v1.0.
            </p>
            <Link
              href="/backlog-rebalance"
              className="mt-5 inline-flex rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-sm font-semibold text-[#d8edf8] hover:bg-[#8fb7cf]/15"
            >
              Review ANO backlog context
            </Link>
          </Panel>
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

function getBacklogNote(type: ObservableType) {
  if (type === "Organization") {
    return "Small entity cleanup set";
  }

  if (type === "Model") {
    return "Largest remaining category";
  }

  if (type === "Data Center") {
    return "Includes the current placeholder record";
  }

  return "Remaining source-observable governance work";
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

function InfoCard({ title, detail }: { title: string; detail: string }) {
  return (
    <article className="rounded border border-white/10 bg-[#03050d] p-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p>
    </article>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-white/10 bg-[#03050d] px-3 py-3 text-sm text-slate-300">
      <span aria-hidden="true" className="font-semibold text-[#b8d8b1]">
        OK
      </span>
      {label}
    </div>
  );
}

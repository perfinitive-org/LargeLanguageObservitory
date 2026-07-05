import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  evidenceRecords,
  getObservableById,
  observables,
  reviewDecisions
} from "@/lib/data";
import type { Observable, ObservableType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Review Metrics | AI Native Observatory",
  description:
    "Static operational metrics for Observatory review-system health."
};

const statuses: Array<NonNullable<Observable["verification_status"]>> = [
  "source_backed",
  "needs_source_review",
  "placeholder"
];

const categoryRows: Array<{
  type: ObservableType;
  label: string;
}> = [
  { type: "Organization", label: "Organizations" },
  { type: "Data Center", label: "Infrastructure" },
  { type: "Model", label: "Models" },
  { type: "Source", label: "Sources" }
];

const reviewedObservableIds = new Set(
  reviewDecisions.map((decision) => decision.observableId)
);
const upgradedObservableIds = new Set(
  reviewDecisions
    .filter((decision) => decision.decision === "source_backed")
    .map((decision) => decision.observableId)
);
const recordsUpgraded = Array.from(upgradedObservableIds).filter(
  (observableId) =>
    getObservableById(observableId)?.verification_status === "source_backed"
).length;
const recordsReviewed = reviewedObservableIds.size;
const recordsRetained = recordsReviewed - recordsUpgraded;

const reviewBatchesCompleted = 9;
const verificationPilotsCompleted = 2;
const evidenceLinkedToDecisions = evidenceRecords.filter(
  (record) => record.linkedReviewDecisionIds.length > 0
).length;
const evidenceLinkedToObservables = evidenceRecords.filter(
  (record) => record.linkedObservableIds.length > 0
).length;

const registryStatusCounts = {
  total: observables.length,
  source_backed: countByStatus("source_backed"),
  needs_source_review: countByStatus("needs_source_review"),
  placeholder: countByStatus("placeholder")
};

const throughputRows = [
  {
    label: "Batch 001",
    value: "10 candidates",
    detail: "Initial review-batch candidate set"
  },
  {
    label: "Pilot Reviews",
    value: "2 completed",
    detail: "AI21 Labs and Equinix"
  },
  {
    label: "Batch 002",
    value: "5 reviewed",
    detail: "Scaled verification batch"
  },
  {
    label: "Batch 003",
    value: "5 reviewed",
    detail: "Infrastructure verification batch"
  },
  {
    label: "Batch 004",
    value: "5 reviewed",
    detail: "Infrastructure verification batch"
  },
  {
    label: "Batch 005",
    value: "5 reviewed",
    detail: "Infrastructure verification batch"
  },
  {
    label: "Batch 006",
    value: "5 reviewed",
    detail: "Infrastructure verification batch"
  },
  {
    label: "Batch 007",
    value: "5 reviewed",
    detail: "Model verification batch"
  },
  {
    label: "Source Batch 001",
    value: "5 reviewed",
    detail: "Source observable verification batch"
  },
  {
    label: "Source Batch 002",
    value: "5 reviewed",
    detail: "Source observable verification batch"
  },
  {
    label: "Threshold 80",
    value: "1 reviewed",
    detail: "Single-record verification threshold"
  }
];

export default function ReviewMetricsPage() {
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
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <nav className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/" className="text-[#8fb7cf] hover:text-white">
                Home
              </Link>
              <Link
                href="/review-queue"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Queue
              </Link>
              <Link
                href="/review-decisions"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Decisions
              </Link>
              <Link href="/evidence" className="text-[#8fb7cf] hover:text-white">
                Evidence
              </Link>
              <Link href="/about" className="text-[#8fb7cf] hover:text-white">
                Method
              </Link>
              <Link
                href="/mvp-status"
                className="text-[#8fb7cf] hover:text-white"
              >
                MVP Status
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Review system health
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Operational metrics for the Observatory review pipeline.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              These static metrics measure review coverage, evidence coverage,
              and category-level source status using the existing JSON registry
              only.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Observatory health summary
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryLine
                label="Review coverage"
                value={`${registryStatusCounts.source_backed} / ${registryStatusCounts.total} source backed`}
              />
              <SummaryLine
                label="Evidence coverage"
                value={`${evidenceRecords.length} evidence records`}
              />
              <SummaryLine
                label="Review decisions"
                value={`${reviewDecisions.length} decisions recorded`}
              />
            </div>
            <Link
              href="/mvp-status"
              className="mt-5 inline-flex rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-sm font-semibold text-[#d8edf8] hover:bg-[#8fb7cf]/15"
            >
              Open MVP status
            </Link>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-3">
          <MetricPanel title="Registry Metrics">
            <MetricRow label="Total records" value={registryStatusCounts.total} />
            <MetricRow
              label="Source backed"
              value={registryStatusCounts.source_backed}
              status="source_backed"
            />
            <MetricRow
              label="Needs review"
              value={registryStatusCounts.needs_source_review}
              status="needs_source_review"
            />
            <MetricRow
              label="Placeholder"
              value={registryStatusCounts.placeholder}
              status="placeholder"
            />
          </MetricPanel>

          <MetricPanel title="Review Metrics">
            <MetricRow
              label="Review decisions total"
              value={reviewDecisions.length}
            />
            <MetricRow
              label="Review batches completed"
              value={reviewBatchesCompleted}
            />
            <MetricRow
              label="Verification pilots completed"
              value={verificationPilotsCompleted}
            />
            <MetricRow label="Records reviewed" value={recordsReviewed} />
            <MetricRow label="Records upgraded" value={recordsUpgraded} />
            <MetricRow label="Records retained" value={recordsRetained} />
          </MetricPanel>

          <MetricPanel title="Evidence Metrics">
            <MetricRow
              label="Evidence records total"
              value={evidenceRecords.length}
            />
            <MetricRow
              label="Linked to decisions"
              value={evidenceLinkedToDecisions}
            />
            <MetricRow
              label="Linked to observables"
              value={evidenceLinkedToObservables}
            />
          </MetricPanel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <div className="border-b border-white/10 pb-3">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Category Metrics
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Review status by observable type
            </h2>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Total</th>
                  <th className="px-3 py-3 font-semibold">Source backed</th>
                  <th className="px-3 py-3 font-semibold">Needs review</th>
                  <th className="px-3 py-3 font-semibold">Placeholder</th>
                </tr>
              </thead>
              <tbody>
                {categoryRows.map((row) => {
                  const metrics = categoryMetrics(row.type);

                  return (
                    <tr key={row.type} className="border-b border-white/10">
                      <td className="px-3 py-4 font-semibold text-white">
                        {row.label}
                      </td>
                      <td className="px-3 py-4 text-slate-300">
                        {metrics.total}
                      </td>
                      <td className="px-3 py-4 text-slate-300">
                        {metrics.source_backed}
                      </td>
                      <td className="px-3 py-4 text-slate-300">
                        {metrics.needs_source_review}
                      </td>
                      <td className="px-3 py-4 text-slate-300">
                        {metrics.placeholder}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Review Throughput
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Completed review work
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {throughputRows.map((row) => (
              <div
                key={row.label}
                className="rounded border border-white/10 bg-[#03050d] p-4"
              >
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {row.label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {row.value}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {row.detail}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function countByStatus(status: NonNullable<Observable["verification_status"]>) {
  return observables.filter(
    (observable) => observable.verification_status === status
  ).length;
}

function categoryMetrics(type: ObservableType) {
  const records = observables.filter((observable) => observable.type === type);

  return {
    total: records.length,
    source_backed: records.filter(
      (record) => record.verification_status === "source_backed"
    ).length,
    needs_source_review: records.filter(
      (record) => record.verification_status === "needs_source_review"
    ).length,
    placeholder: records.filter(
      (record) => record.verification_status === "placeholder"
    ).length
  };
}

function MetricPanel({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

function MetricRow({
  label,
  value,
  status
}: {
  label: string;
  value: number;
  status?: NonNullable<Observable["verification_status"]>;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-white/10 bg-[#03050d] px-3 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="flex items-center gap-2">
        {status ? <VerificationBadge status={status} compact /> : null}
        <span className="text-lg font-semibold text-white">{value}</span>
      </span>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-[#03050d] p-3">
      <div className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { TypeBadge } from "@/components/TypeBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  evidenceRecords,
  observables,
  reviewDecisions
} from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type { Observable } from "@/lib/types";

export const metadata: Metadata = {
  title: "MVP Status | AI Native Observatory",
  description:
    "Current status checkpoint for the AI Native Observatory MVP."
};

const statusCounts = {
  total: observables.length,
  source_backed: countByStatus("source_backed"),
  needs_source_review: countByStatus("needs_source_review"),
  placeholder: countByStatus("placeholder")
};

const verifiedRecords = observables
  .filter(
    (observable) =>
      observable.verification_status === "source_backed" &&
      (observable.type === "Organization" || observable.type === "Data Center")
  )
  .sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "Organization" ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });

const infrastructureCounts = {
  total: observables.filter((observable) => observable.type === "Data Center")
    .length,
  source_backed: observables.filter(
    (observable) =>
      observable.type === "Data Center" &&
      observable.verification_status === "source_backed"
  ).length,
  needs_source_review: observables.filter(
    (observable) =>
      observable.type === "Data Center" &&
      observable.verification_status === "needs_source_review"
  ).length,
  placeholder: observables.filter(
    (observable) =>
      observable.type === "Data Center" &&
      observable.verification_status === "placeholder"
  ).length
};

const modelCounts = {
  total: observables.filter((observable) => observable.type === "Model").length,
  source_backed: observables.filter(
    (observable) =>
      observable.type === "Model" &&
      observable.verification_status === "source_backed"
  ).length,
  needs_source_review: observables.filter(
    (observable) =>
      observable.type === "Model" &&
      observable.verification_status === "needs_source_review"
  ).length
};

const sourceNeedsReviewCount = observables.filter(
  (observable) =>
    observable.type === "Source" &&
    observable.verification_status === "needs_source_review"
).length;

const sourceCounts = {
  total: observables.filter((observable) => observable.type === "Source").length,
  source_backed: observables.filter(
    (observable) =>
      observable.type === "Source" &&
      observable.verification_status === "source_backed"
  ).length,
  needs_source_review: sourceNeedsReviewCount
};

const knownGaps = [
  `${statusCounts.needs_source_review} records remain in needs-source-review status.`,
  `${statusCounts.placeholder} placeholder record remains in the registry.`,
  `Infrastructure verification is substantially complete, but ${infrastructureCounts.needs_source_review} infrastructure records still require source review and ${infrastructureCounts.placeholder} infrastructure placeholder remains.`,
  `${modelCounts.needs_source_review} model records remain unresolved, making models the largest remaining category backlog.`,
  `${sourceNeedsReviewCount} source observables remain unresolved after the second source verification batch.`,
  "Evidence archival snapshots are not implemented.",
  "Source acquisition remains manual."
];

const milestones = [
  "Registry operational",
  "Review workflow operational",
  "Evidence normalization operational",
  "First verified record completed",
  "Infrastructure verification batch completed",
  "Infrastructure verification phase substantially complete",
  "First model verification batch completed",
  "Observatory passed full state audit",
  "First source observable verification batch completed",
  "Second source observable verification batch completed",
  "80 source-backed records reached"
];

const deferredItems = [
  "Globe visualization",
  "Maps and geography lens",
  "Timelines",
  "Graph and network views",
  "Charts and dashboard layers",
  "Live feeds",
  "Automation",
  "AI-assisted review"
];

const pipelineSteps = [
  "Observable",
  "Review Queue",
  "Review Decision",
  "Evidence",
  "Verification",
  "Source Backed"
];

export default function MvpStatusPage() {
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
                href="/ano-v1-final-release-decision"
                className="text-[#8fb7cf] hover:text-white"
              >
                Final Decision
              </Link>
              <Link
                href="/ano-v1-public-launch-checklist"
                className="text-[#8fb7cf] hover:text-white"
              >
                Launch Checklist
              </Link>
              <Link href="/about" className="text-[#8fb7cf] hover:text-white">
                Method
              </Link>
              <Link
                href="/review-metrics"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Metrics
              </Link>
              <Link
                href="/review-queue"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Queue
              </Link>
              <Link href="/evidence" className="text-[#8fb7cf] hover:text-white">
                Evidence
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              MVP status checkpoint
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              One place to understand what exists, what is trusted, and what is
              next.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This page summarizes the current Observatory state using only the
              static registry, review-decision, and evidence JSON records.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Current Observatory State
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryLine label="Total records" value={statusCounts.total} />
              <SummaryLine
                label="Source-backed"
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
              <SummaryLine
                label="Infrastructure source-backed"
                value={infrastructureCounts.source_backed}
                status="source_backed"
              />
              <SummaryLine
                label="Infrastructure needs review"
                value={infrastructureCounts.needs_source_review}
                status="needs_source_review"
              />
              <SummaryLine
                label="Infrastructure placeholder"
                value={infrastructureCounts.placeholder}
                status="placeholder"
              />
              <SummaryLine
                label="Review decisions"
                value={reviewDecisions.length}
              />
              <SummaryLine
                label="Evidence records"
                value={evidenceRecords.length}
              />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Panel title="Review Pipeline" eyebrow="How trust changes">
            <div className="grid gap-2">
              {pipelineSteps.map((step, index) => (
                <PipelineStep
                  key={step}
                  label={step}
                  terminal={index === pipelineSteps.length - 1}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Current Priority" eyebrow="What happens next">
            <div className="grid gap-3">
              <PriorityRow
                label="Primary"
                value="Plan Batch 009 model verification."
              />
              <PriorityRow
                label="Secondary"
                value="Continue source cleanup planning."
              />
              <PriorityRow
                label="Tertiary"
                value="Resolve remaining infrastructure records opportunistically."
              />
            </div>
            <div className="mt-5 rounded border border-l-4 border-white/10 border-l-[#8fb7cf] bg-[#03050d] p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Recommended Next Action
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Batch 009 model planning
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Batch 007 completed the first model-verification pass, and
                Source Batches 001 and 002 applied the source-review criteria to
                ten Source observables. Verification Threshold 80 moved the
                Observatory to {statusCounts.source_backed} / {statusCounts.total}{" "}
                source-backed records. Source observables are now{" "}
                {sourceCounts.source_backed} / {sourceCounts.total}{" "}
                source-backed, with {sourceCounts.needs_source_review} still
                requiring review; Models are the largest remaining category, so
                the next full planning step should rebalance toward model
                verification.
              </p>
            </div>
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <div className="border-b border-white/10 pb-3">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Milestones
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Completed MVP checkpoints
            </h2>
          </div>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {milestones.map((milestone) => (
              <MilestoneItem key={milestone}>{milestone}</MilestoneItem>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <div className="border-b border-white/10 pb-3">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Verified Records
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Source-backed organizations and infrastructure records
            </h2>
          </div>
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {verifiedRecords.map((record) => (
              <VerifiedRecordCard key={record.id} record={record} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Known Gaps" eyebrow="Incomplete by design">
            <ul className="grid gap-3">
              {knownGaps.map((gap) => (
                <ListItem key={gap}>{gap}</ListItem>
              ))}
            </ul>
          </Panel>

          <Panel title="Intentionally Deferred" eyebrow="Parked future layers">
            <p className="text-sm leading-6 text-slate-300">
              These ideas are not rejected. They are parked until the static
              evidence and review base is stronger.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {deferredItems.map((item) => (
                <span
                  key={item}
                  className="rounded border border-white/10 bg-[#03050d] px-3 py-2 text-sm text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </Panel>
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

function SummaryLine({
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
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PipelineStep({
  label,
  terminal = false
}: {
  label: string;
  terminal?: boolean;
}) {
  return (
    <div>
      <div className="rounded border border-white/10 bg-[#03050d] px-3 py-3 text-sm font-semibold text-slate-200">
        {label}
      </div>
      {terminal ? null : (
        <div className="px-3 py-1 text-sm font-semibold text-[#8fb7cf]">
          &rarr;
        </div>
      )}
    </div>
  );
}

function PriorityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-[#03050d] px-3 py-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function VerifiedRecordCard({ record }: { record: Observable }) {
  return (
    <Link
      href={registryObservableHref(record)}
      className="rounded-lg border border-l-4 border-white/10 border-l-[#7ba36f] bg-[#03050d] p-4 hover:border-[#8fb7cf]/55"
    >
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge type={record.type} variant="dark" />
        <VerificationBadge status={record.verification_status} compact />
      </div>
      <h3 className="mt-3 text-lg font-semibold text-white">{record.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{record.summary}</p>
    </Link>
  );
}

function MilestoneItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded border border-white/10 bg-[#03050d] px-3 py-3 text-sm font-semibold text-slate-200">
      <span aria-hidden="true" className="text-[#b8d8b1]">
        {"\u2713"}
      </span>
      {children}
    </li>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded border border-white/10 bg-[#03050d] px-3 py-3 text-sm leading-6 text-slate-300">
      {children}
    </li>
  );
}

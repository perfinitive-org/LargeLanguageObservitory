import type { Metadata } from "next";
import Link from "next/link";
import { TypeAccentRule, TypeBadge } from "@/components/TypeBadge";
import {
  VerificationBadge,
  verificationAccentClass
} from "@/components/VerificationBadge";
import {
  getObservationsForObservable,
  getRelatedObservables,
  getSourcesForObservable,
  observables
} from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type { Observable, ObservableType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Review Queue | AI Native Observatory",
  description:
    "Static maintenance view for reviewing needs-source-review and placeholder records."
};

const reviewStatuses: Array<NonNullable<Observable["verification_status"]>> = [
  "needs_source_review",
  "placeholder"
];

const statusOrder: Array<NonNullable<Observable["verification_status"]>> = [
  "source_backed",
  "needs_source_review",
  "placeholder"
];

const groupOrder: Array<{
  type: ObservableType;
  title: string;
}> = [
  { type: "Organization", title: "Organizations" },
  { type: "Model", title: "Models" },
  { type: "Data Center", title: "Infrastructure" },
  { type: "Source", title: "Sources" }
];

type QueueItem = {
  observable: Observable;
  sourceCount: number;
  observationCount: number;
  relationshipCount: number;
  priority: "High" | "Medium" | "Low";
};

export default function ReviewQueuePage() {
  const statusCounts = statusOrder.map((status) => ({
    status,
    count: observables.filter(
      (observable) => observable.verification_status === status
    ).length
  }));
  const queueItems = observables
    .filter((observable) =>
      reviewStatuses.includes(
        observable.verification_status ?? "placeholder"
      )
    )
    .map(toQueueItem)
    .sort((a, b) => {
      const priorityDifference =
        priorityRank(a.priority) - priorityRank(b.priority);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return a.observable.name.localeCompare(b.observable.name);
    });
  const queueGroups = groupOrder
    .map((group) => ({
      ...group,
      items: queueItems.filter(
        (item) => item.observable.type === group.type
      )
    }))
    .filter((group) => group.items.length > 0);
  const suggestedTargets = queueItems.slice(0, 10);

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
                href="/registry"
                className="text-[#8fb7cf] hover:text-white"
              >
                Registry
              </Link>
              <Link href="/about" className="text-[#8fb7cf] hover:text-white">
                Method
              </Link>
              <Link
                href="/review-batch-001"
                className="text-[#8fb7cf] hover:text-white"
              >
                Batch 001 Artifact
              </Link>
              <Link
                href="/review-decisions"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Decisions
              </Link>
              <Link
                href="/review-metrics"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Metrics
              </Link>
              <Link
                href="/review-batch-001-sources"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source Artifact
              </Link>
              <Link
                href="/review-batch-001-evidence"
                className="text-[#8fb7cf] hover:text-white"
              >
                Evidence Artifact
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Data review queue
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Records needing source review or placeholder cleanup.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This static maintenance view lists registry observables that need
              source review before future trust-focused data passes. It uses
              existing JSON fields only and does not make launch claims.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Review summary
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryTile label="Total records" value={observables.length} />
              {statusCounts.map(({ status, count }) => (
                <StatusSummaryTile key={status} status={status} count={count} />
              ))}
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Review workflow
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Repeatable human review process
            </h2>
            <div className="mt-5 grid gap-3">
              <WorkflowStep
                step="Step 1"
                title="Open record dossier"
                description="Start from the queue item and inspect the full static record page."
              />
              <WorkflowStep
                step="Step 2"
                title="Inspect linked sources"
                description="Open source records and confirm the source quality labels match the evidence available."
              />
              <WorkflowStep
                step="Step 3"
                title="Verify existence"
                description="Confirm the organization, model, infrastructure site, or source URL is appropriate for the registry."
              />
              <WorkflowStep
                step="Step 4"
                title="Review description"
                description="Confirm the description is conservative, readable, and does not overstate what sources support."
              />
              <WorkflowStep
                step="Step 5"
                title="Determine review outcome"
                description="Leave the record as needs more review or placeholder, or move it to source backed after human review."
              />
            </div>
          </div>

          <div className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Review checklist
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Static checklist
            </h2>
            <div className="mt-5 grid gap-3">
              <ChecklistItem label="Description reviewed" />
              <ChecklistItem label="Sources reviewed" />
              <ChecklistItem label="Relationships reviewed" />
              <ChecklistItem label="Tags reviewed" />
              <ChecklistItem label="Ready for source-backed status" />
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">
              This checklist is intentionally static. Status changes happen by
              editing the JSON records after human review.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Suggested next review targets
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                First 10 candidates
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              High priority favors infrastructure and organizations.
            </p>
          </div>
          <div className="grid gap-3 xl:grid-cols-2">
            {suggestedTargets.map((item) => (
              <QueueCard key={item.observable.id} item={item} compact />
            ))}
          </div>
        </section>

        <div className="mb-6 mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Queue records
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {queueItems.length} records queued
            </h2>
          </div>
          <p className="text-sm text-slate-400">
            Source-backed records are excluded from the queue.
          </p>
        </div>

        <div className="grid gap-6">
          {queueGroups.map((group) => (
            <section
              key={group.type}
              className="rounded-lg border border-white/15 bg-[#07111c] p-4"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    {group.title}
                  </p>
                  <TypeAccentRule type={group.type} className="mt-2" />
                </div>
                <span className="rounded border border-white/10 bg-[#03050d] px-2 py-1 text-xs text-slate-300">
                  {group.items.length}
                </span>
              </div>

              <div className="mt-4 grid gap-3 xl:grid-cols-2">
                {group.items.map((item) => (
                  <QueueCard key={item.observable.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}

function toQueueItem(observable: Observable): QueueItem {
  return {
    observable,
    sourceCount: getSourcesForObservable(observable.id).length,
    observationCount: getObservationsForObservable(observable.id).length,
    relationshipCount: getRelatedObservables(observable.id).length,
    priority: getPriority(observable)
  };
}

function getPriority(observable: Observable): QueueItem["priority"] {
  if (observable.verification_status === "placeholder") {
    return "Low";
  }

  if (
    observable.verification_status === "needs_source_review" &&
    (observable.type === "Organization" || observable.type === "Data Center")
  ) {
    return "High";
  }

  if (
    observable.verification_status === "needs_source_review" &&
    observable.type === "Model"
  ) {
    return "Medium";
  }

  return "Low";
}

function priorityRank(priority: QueueItem["priority"]) {
  const ranks: Record<QueueItem["priority"], number> = {
    High: 0,
    Medium: 1,
    Low: 2
  };

  return ranks[priority];
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-white/10 bg-[#03050d] p-3">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
    </div>
  );
}

function StatusSummaryTile({
  status,
  count
}: {
  status: NonNullable<Observable["verification_status"]>;
  count: number;
}) {
  return (
    <div
      className={`rounded border border-l-4 border-white/10 bg-[#03050d] p-3 ${verificationAccentClass(
        status
      )}`}
    >
      <div className="text-2xl font-semibold text-white">{count}</div>
      <div className="mt-2">
        <VerificationBadge status={status} />
      </div>
    </div>
  );
}

function QueueCard({
  item,
  compact = false
}: {
  item: QueueItem;
  compact?: boolean;
}) {
  const { observable } = item;
  const readinessItems = getReadinessItems(item);

  return (
    <Link
      href={registryObservableHref(observable)}
      className={`group grid gap-4 rounded-lg border border-l-4 border-white/10 bg-[#03050d] p-4 transition hover:border-y-[#8fb7cf]/55 hover:border-r-[#8fb7cf]/55 hover:bg-[#0b1725] ${verificationAccentClass(
        observable.verification_status
      )}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={observable.type} variant="dark" />
          <VerificationBadge status={observable.verification_status} />
          <PriorityBadge priority={item.priority} />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white group-hover:text-[#d8edf8]">
          {observable.name}
        </h3>
        <TypeAccentRule type={observable.type} className="mt-3" />
        {!compact ? (
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {observable.summary}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2 border-t border-white/10 pt-4 text-sm sm:grid-cols-3">
        <QueueMetric label="Sources" value={item.sourceCount} />
        <QueueMetric label="Observations" value={item.observationCount} />
        <QueueMetric label="Relationships" value={item.relationshipCount} />
      </div>

      {!compact ? (
        <div className="grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2">
          {readinessItems.map((readinessItem) => (
            <ReadinessIndicator
              key={readinessItem.label}
              label={readinessItem.label}
              ready={readinessItem.ready}
            />
          ))}
        </div>
      ) : null}
    </Link>
  );
}

function getReadinessItems(item: QueueItem) {
  return [
    {
      label: "description present",
      ready: item.observable.summary.trim().length > 0
    },
    {
      label: "tags present",
      ready: item.observable.tags.length > 0
    },
    {
      label: "linked sources present",
      ready: item.sourceCount > 0
    },
    {
      label: "relationships present",
      ready: item.relationshipCount > 0
    }
  ];
}

function PriorityBadge({ priority }: { priority: QueueItem["priority"] }) {
  const classes: Record<QueueItem["priority"], string> = {
    High: "border-[#d39b50]/40 bg-[#d39b50]/10 text-[#f0c889]",
    Medium: "border-[#8fb7cf]/35 bg-[#8fb7cf]/10 text-[#b8d5e5]",
    Low: "border-slate-400/25 bg-slate-400/10 text-slate-300"
  };

  return (
    <span
      className={`rounded border px-2 py-1 text-xs font-semibold uppercase ${classes[priority]}`}
    >
      {priority} priority
    </span>
  );
}

function QueueMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
      <div className="text-sm font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
    </div>
  );
}

function WorkflowStep({
  step,
  title,
  description
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-[#03050d] p-4">
      <div className="text-xs font-semibold uppercase text-[#8fb7cf]">
        {step}
      </div>
      <div className="mt-2 text-base font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-white/10 bg-[#03050d] px-3 py-2 text-sm text-slate-300">
      <span
        aria-hidden="true"
        className="flex size-4 shrink-0 items-center justify-center rounded border border-slate-500 text-[10px] text-slate-500"
      >
        □
      </span>
      {label}
    </div>
  );
}

function ReadinessIndicator({
  label,
  ready
}: {
  label: string;
  ready: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <span
        aria-hidden="true"
        className={`font-semibold ${ready ? "text-[#b8d8b1]" : "text-slate-500"}`}
      >
        {ready ? "✓" : "□"}
      </span>
      {label}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { TypeAccentRule, TypeBadge } from "@/components/TypeBadge";
import {
  VerificationBadge,
  verificationAccentClass
} from "@/components/VerificationBadge";
import {
  getObservableById,
  getObservationsForObservable,
  getRelatedObservables,
  getSourcesForObservable,
  reviewDecisions
} from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type { Observable, ObservableType, ReviewDecision } from "@/lib/types";

export const metadata: Metadata = {
  title: "Review Batch 001 | AI Native Observatory",
  description:
    "Pilot review batch for validating the human data review workflow."
};

const batchObservableIds = [
  "org-ai21-labs",
  "org-alibaba-cloud",
  "org-cerebras",
  "org-deepseek",
  "org-equinix",
  "dc-aws-northern-virginia",
  "dc-aws-ohio",
  "dc-aws-oregon",
  "dc-cerebras-condor-galaxy",
  "dc-equinix-dc21"
];

type BatchItem = {
  observable: Observable;
  sourceCount: number;
  observationCount: number;
  relationshipCount: number;
  reviewDecision?: ReviewDecision;
  priority: "High" | "Medium" | "Low";
};

export default function ReviewBatch001Page() {
  const batchTargets = batchObservableIds
    .map(getObservableById)
    .filter((observable): observable is Observable => Boolean(observable))
    .map(toBatchItem);
  const organizationTargets = batchTargets.filter(
    (item) => item.observable.type === "Organization"
  );
  const infrastructureTargets = batchTargets.filter(
    (item) => item.observable.type === "Data Center"
  );
  const batchItems = [...organizationTargets, ...infrastructureTargets];

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
              Review batch 001
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Pilot batch for validating the review workflow.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This static batch selects five organization records and five
              infrastructure records from the highest-priority review queue
              targets. The purpose is process validation, not final
              verification. It remains visible as a historical review-process
              artifact.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Batch summary
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryTile label="Batch size" value={batchItems.length} />
              <SummaryTile
                label="Organizations"
                value={organizationTargets.length}
              />
              <SummaryTile
                label="Infrastructure"
                value={infrastructureTargets.length}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Purpose: process validation, not final verification.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Decisions logged:{" "}
              {
                batchItems.filter((item) => Boolean(item.reviewDecision)).length
              }
              /{batchItems.length}
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Review worksheet
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Review questions
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Static worksheet only. No status is changed on this page.
            </p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <ChecklistItem label="Does the organization/infrastructure exist?" />
            <ChecklistItem label="Is the description reasonable?" />
            <ChecklistItem label="Are linked sources appropriate?" />
            <ChecklistItem label="Are relationships reasonable?" />
            <ChecklistItem label="Ready for source-backed review?" />
          </div>
        </section>

        <BatchSection
          title="Top organization review targets"
          type="Organization"
          items={organizationTargets}
        />
        <BatchSection
          title="Top infrastructure review targets"
          type="Data Center"
          items={infrastructureTargets}
        />
      </main>
    </div>
  );
}

function toBatchItem(observable: Observable): BatchItem {
  return {
    observable,
    sourceCount: getSourcesForObservable(observable.id).length,
    observationCount: getObservationsForObservable(observable.id).length,
    relationshipCount: getRelatedObservables(observable.id).length,
    reviewDecision: reviewDecisions.find(
      (decision) => decision.observableId === observable.id
    ),
    priority: getPriority(observable)
  };
}

function getPriority(observable: Observable): BatchItem["priority"] {
  if (observable.verification_status === "placeholder") {
    return "Low";
  }

  if (observable.type === "Organization" || observable.type === "Data Center") {
    return "High";
  }

  if (observable.type === "Model") {
    return "Medium";
  }

  return "Low";
}

function BatchSection({
  title,
  type,
  items
}: {
  title: string;
  type: ObservableType;
  items: BatchItem[];
}) {
  return (
    <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Review targets
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
          <TypeAccentRule type={type} className="mt-3" />
        </div>
        <span className="rounded border border-white/10 bg-[#03050d] px-2 py-1 text-xs text-slate-300">
          {items.length}
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {items.map((item) => (
          <BatchCard key={item.observable.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function BatchCard({ item }: { item: BatchItem }) {
  const { observable } = item;

  return (
    <article
      className={`grid gap-4 rounded-lg border border-l-4 border-white/10 bg-[#03050d] p-4 ${verificationAccentClass(
        observable.verification_status
      )}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge type={observable.type} variant="dark" />
        <VerificationBadge status={observable.verification_status} />
        <PriorityBadge priority={item.priority} />
        <DecisionBadge decision={item.reviewDecision} />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white">{observable.name}</h3>
        <TypeAccentRule type={observable.type} className="mt-3" />
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {observable.summary}
        </p>
      </div>

      <div className="grid gap-2 border-t border-white/10 pt-4 text-sm sm:grid-cols-3">
        <BatchMetric label="Sources" value={item.sourceCount} />
        <BatchMetric label="Observations" value={item.observationCount} />
        <BatchMetric label="Relationships" value={item.relationshipCount} />
      </div>

      {item.reviewDecision ? (
        <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2 text-sm text-slate-300">
          <div className="text-xs font-semibold uppercase text-slate-500">
            Review decision
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <VerificationBadge status={item.reviewDecision.decision} />
            <span>{item.reviewDecision.reviewDate}</span>
            <span className="text-slate-500">
              {item.reviewDecision.reviewer}
            </span>
          </div>
        </div>
      ) : null}

      <div className="border-t border-white/10 pt-4">
        <Link
          href={registryObservableHref(observable)}
          className="inline-flex rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-sm font-semibold text-[#d8edf8] hover:bg-[#8fb7cf]/15"
        >
          Open dossier
        </Link>
      </div>
    </article>
  );
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

function BatchMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
      <div className="text-sm font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: BatchItem["priority"] }) {
  const classes: Record<BatchItem["priority"], string> = {
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

function DecisionBadge({ decision }: { decision: ReviewDecision | undefined }) {
  if (!decision) {
    return (
      <span className="rounded border border-slate-400/25 bg-slate-400/10 px-2 py-1 text-xs font-semibold uppercase text-slate-300">
        No decision logged
      </span>
    );
  }

  return (
    <span className="rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-2 py-1 text-xs font-semibold uppercase text-[#b8d5e5]">
      Decision logged
    </span>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-white/10 bg-[#03050d] px-3 py-3 text-sm text-slate-300">
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

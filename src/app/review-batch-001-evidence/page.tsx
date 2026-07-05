import type { Metadata } from "next";
import Link from "next/link";
import { TypeAccentRule, TypeBadge } from "@/components/TypeBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import { getObservableById, reviewDecisions } from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type { Observable, ReviewDecision } from "@/lib/types";

export const metadata: Metadata = {
  title: "Review Batch 001 Evidence | AI Native Observatory",
  description:
    "Static evidence planning artifact for Review Batch 001 records."
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

const sourceTargetCategories: Record<string, string[]> = {
  "org-ai21-labs": [
    "Official company website",
    "Company About page",
    "Company product documentation",
    "Independent industry profile"
  ],
  "org-alibaba-cloud": [
    "Official company website",
    "Official cloud documentation",
    "Official AI/model documentation",
    "Independent industry profile"
  ],
  "org-cerebras": [
    "Official company website",
    "Company About page",
    "Product or system documentation",
    "Independent infrastructure report"
  ],
  "org-deepseek": [
    "Official company website",
    "Company or model documentation",
    "Official model release note",
    "Independent industry profile"
  ],
  "org-equinix": [
    "Official company website",
    "Company data center or interconnection page",
    "Facility or platform documentation",
    "Independent infrastructure report"
  ],
  "dc-aws-northern-virginia": [
    "Official AWS region documentation",
    "AWS global infrastructure page",
    "AWS regional availability reference",
    "Independent infrastructure reference"
  ],
  "dc-aws-ohio": [
    "Official AWS region documentation",
    "AWS global infrastructure page",
    "AWS regional availability reference",
    "Independent infrastructure reference"
  ],
  "dc-aws-oregon": [
    "Official AWS region documentation",
    "AWS global infrastructure page",
    "AWS regional availability reference",
    "Independent infrastructure reference"
  ],
  "dc-cerebras-condor-galaxy": [
    "Official Cerebras system page",
    "Official deployment announcement",
    "Operator confirmation source",
    "Independent infrastructure report"
  ],
  "dc-equinix-dc21": [
    "Official Equinix facility page",
    "Official campus or location documentation",
    "Operator confirmation source",
    "Independent infrastructure reference"
  ]
};

type EvidenceWorkbenchItem = {
  observable: Observable;
  reviewDecision: ReviewDecision | undefined;
  sourceTargets: string[];
};

export default function ReviewBatch001EvidencePage() {
  const evidenceItems = batchObservableIds
    .map((observableId) => {
      const observable = getObservableById(observableId);

      if (!observable) {
        return null;
      }

      return {
        observable,
        reviewDecision: reviewDecisions.find(
          (decision) => decision.observableId === observable.id
        ),
        sourceTargets: sourceTargetCategories[observable.id] ?? []
      };
    })
    .filter((item): item is EvidenceWorkbenchItem => Boolean(item));

  const officialSourcesNeeded = evidenceItems.filter((item) =>
    item.sourceTargets.some((target) => target.toLowerCase().includes("official"))
  ).length;
  const independentSourcesNeeded = evidenceItems.filter((item) =>
    item.sourceTargets.some((target) =>
      target.toLowerCase().includes("independent")
    )
  ).length;

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
                href="/review-batch-001-sources"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source Artifact
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Evidence planning artifact
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Staging area for Batch 001 evidence packages.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This historical review-process artifact shows empty evidence slots
              for each Batch 001 record before verification status changes are
              considered. It does
              not collect sources, verify facts, or persist edits.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Evidence summary
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryTile label="Records" value={evidenceItems.length} />
              <SummaryTile
                label="Official sources needed"
                value={officialSourcesNeeded}
              />
              <SummaryTile
                label="Independent sources needed"
                value={independentSourcesNeeded}
              />
              <SummaryTile label="Evidence packages started" value={0} />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Planning guidance
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Staging before verification review
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This historical artifact is a staging reference. Evidence should
              be collected before verification status changes are considered.
              The page is static and does not save inputs.
            </p>
          </div>

          <div className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Evidence readiness
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Evidence ready
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ChecklistItem label="Official source collected" />
              <ChecklistItem label="Independent source collected" />
              <ChecklistItem label="Review notes completed" />
              <ChecklistItem label="Ready for verification review" />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Batch 001 records
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Evidence acquisition slots
              </h2>
            </div>
            <span className="rounded border border-white/10 bg-[#03050d] px-2 py-1 text-xs text-slate-300">
              {evidenceItems.length}
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            {evidenceItems.map((item) => (
              <EvidenceCard key={item.observable.id} item={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function EvidenceCard({ item }: { item: EvidenceWorkbenchItem }) {
  const { observable, reviewDecision, sourceTargets } = item;

  return (
    <article className="grid gap-4 rounded-lg border border-l-4 border-white/10 border-l-[#8fb7cf] bg-[#03050d] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge type={observable.type} variant="dark" />
        <VerificationBadge status={observable.verification_status} />
        {reviewDecision ? (
          <VerificationBadge status={reviewDecision.decision} />
        ) : (
          <span className="rounded border border-slate-400/25 bg-slate-400/10 px-2 py-1 text-xs font-semibold uppercase text-slate-300">
            No decision logged
          </span>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white">
          <Link
            href={registryObservableHref(observable)}
            className="hover:text-[#d8edf8]"
          >
            {observable.name}
          </Link>
        </h3>
        <TypeAccentRule type={observable.type} className="mt-3" />
      </div>

      <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
        <div className="text-xs font-semibold uppercase text-slate-500">
          Required source categories
        </div>
        <ul className="mt-2 grid gap-1 text-sm text-slate-300 md:grid-cols-2">
          {sourceTargets.map((target) => (
            <li key={target}>□ {target}</li>
          ))}
        </ul>
      </div>

      <div className="grid gap-3 border-t border-white/10 pt-4 lg:grid-cols-3">
        <EvidenceSlot
          title="Official source"
          status="□ Not collected"
          placeholder="(No source collected)"
        />
        <EvidenceSlot
          title="Independent source"
          status="□ Not collected"
          placeholder="(No source collected)"
        />
        <EvidenceSlot
          title="Review notes"
          status="□ Not collected"
          placeholder="(No notes recorded)"
        />
      </div>
    </article>
  );
}

function EvidenceSlot({
  title,
  status,
  placeholder
}: {
  title: string;
  status: string;
  placeholder: string;
}) {
  return (
    <section className="rounded border border-white/10 bg-[#07111c] p-3">
      <h4 className="text-xs font-semibold uppercase text-[#8fb7cf]">
        {title}
      </h4>
      <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
        Status
      </p>
      <p className="mt-1 text-sm text-slate-300">{status}</p>
      <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
        Placeholder
      </p>
      <p className="mt-1 text-sm text-slate-500">{placeholder}</p>
    </section>
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

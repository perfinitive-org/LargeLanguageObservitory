import type { Metadata } from "next";
import Link from "next/link";
import { TypeAccentRule, TypeBadge } from "@/components/TypeBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import { getObservableById, reviewDecisions } from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type { Observable, ReviewDecision } from "@/lib/types";

export const metadata: Metadata = {
  title: "Review Batch 001 Sources | AI Native Observatory",
  description:
    "Static source acquisition targets for Review Batch 001 records."
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

type SourceTargetItem = {
  observable: Observable;
  reviewDecision: ReviewDecision | undefined;
  sourceTargets: string[];
};

export default function ReviewBatch001SourcesPage() {
  const sourceTargetItems = batchObservableIds
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
    .filter((item): item is SourceTargetItem => Boolean(item));

  const officialSourceCount = sourceTargetItems.filter((item) =>
    item.sourceTargets.some((target) => target.toLowerCase().includes("official"))
  ).length;
  const independentSourceCount = sourceTargetItems.filter((item) =>
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
                href="/review-batch-001-evidence"
                className="text-[#8fb7cf] hover:text-white"
              >
                Evidence Artifact
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Source target collection
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Specific source targets for Review Batch 001.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This planning page converts generic review requirements into
              source acquisition categories. It does not verify facts, collect
              live sources, or change any registry status.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Source target summary
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryTile
                label="Records in batch"
                value={sourceTargetItems.length}
              />
              <SummaryTile
                label="Requiring official source"
                value={officialSourceCount}
              />
              <SummaryTile
                label="Requiring independent source"
                value={independentSourceCount}
              />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Review guidance
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Guidance before source-backed status
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              A record should generally have at least one authoritative source
              and at least one independent supporting source before
              source-backed status is considered. This is guidance only and is
              not enforced in code.
            </p>
          </div>

          <div className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Source target checklist
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Acquisition worksheet
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ChecklistItem label="Official source identified" />
              <ChecklistItem label="Official source linked" />
              <ChecklistItem label="Independent source identified" />
              <ChecklistItem label="Independent source linked" />
              <ChecklistItem label="Ready for human verification" />
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
                Source acquisition targets
              </h2>
            </div>
            <span className="rounded border border-white/10 bg-[#03050d] px-2 py-1 text-xs text-slate-300">
              {sourceTargetItems.length}
            </span>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {sourceTargetItems.map((item) => (
              <SourceTargetCard key={item.observable.id} item={item} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function SourceTargetCard({ item }: { item: SourceTargetItem }) {
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
        <p className="mt-3 text-sm leading-6 text-slate-300">
          {observable.summary}
        </p>
      </div>

      <div className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-2">
        <SourceList
          label="Missing information"
          items={reviewDecision?.missingInformation ?? []}
        />
        <SourceList label="Required source targets" items={sourceTargets} />
      </div>

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

function SourceList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
      <div className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-1 text-sm text-slate-300">
          {items.map((item) => (
            <li key={item}>□ {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">None listed</p>
      )}
    </div>
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

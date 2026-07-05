import type { Metadata } from "next";
import Link from "next/link";
import { TypeBadge } from "@/components/TypeBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  getRelatedObservables,
  getSourcesForObservable,
  observables
} from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type { Observable, ObservableType } from "@/lib/types";

export const metadata: Metadata = {
  title: "Backlog Rebalance | AI Native Observatory",
  description:
    "Read-only prioritization analysis for moving the Observatory beyond 80 source-backed records."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;
type Effort = "Low" | "Medium" | "High";
type ValueLevel = "Low" | "Medium" | "High";

const categoryDefinitions: Array<{
  type: ObservableType;
  label: string;
  shortLabel: string;
}> = [
  { type: "Organization", label: "Organizations", shortLabel: "Organizations" },
  { type: "Model", label: "Models", shortLabel: "Models" },
  { type: "Data Center", label: "Infrastructure", shortLabel: "Infrastructure" },
  { type: "Source", label: "Sources", shortLabel: "Sources" }
];

const verifiedCount = countByStatus("source_backed");
const needsReviewCount = countByStatus("needs_source_review");
const placeholderCount = countByStatus("placeholder");
const unresolvedRecords = observables.filter(isUnresolved);
const unresolvedCount = unresolvedRecords.length;
const recordsTo80 = Math.max(0, 80 - verifiedCount);
const recordsTo90 = Math.max(0, 90 - verifiedCount);
const recordsTo100 = Math.max(0, 100 - verifiedCount);
const nextRouteGain = Math.min(5, recordsTo90);

const categoryBacklogRows = categoryDefinitions.map((category) => {
  const records = unresolvedRecords.filter(
    (observable) => observable.type === category.type
  );

  return {
    ...category,
    records,
    count: records.length,
    percentage: formatPercent(records.length, unresolvedCount)
  };
});

const placeholderRecords = observables.filter(
  (observable) => observable.verification_status === "placeholder"
);

const displayBacklogRows = [
  ...categoryBacklogRows.map((row) => ({
    key: row.type,
    label: row.label,
    count: row.count,
    percentage: row.percentage,
    note: `${row.shortLabel} unresolved records`
  })),
  {
    key: "placeholder",
    label: "Placeholder",
    count: placeholderRecords.length,
    percentage: formatPercent(placeholderRecords.length, unresolvedCount),
    note: "Status subset; currently overlaps Infrastructure"
  }
];

const categoryCounts = Object.fromEntries(
  categoryBacklogRows.map((row) => [row.type, row.count])
) as Record<ObservableType, number>;

const effortRows: Array<{
  label: string;
  effort: Effort;
  count: number;
  rationale: string;
}> = [
  {
    label: "Organizations",
    effort: "Low",
    count: categoryCounts.Organization,
    rationale: `${categoryCounts.Organization} remain, and each is an entity record with narrow identity questions and few relationships.`
  },
  {
    label: "Models",
    effort: "Medium",
    count: categoryCounts.Model,
    rationale: `${categoryCounts.Model} remain. They have likely official release paths, but model-specific review still needs version discipline.`
  },
  {
    label: "Infrastructure",
    effort: "High",
    count: categoryCounts["Data Center"],
    rationale:
      "The remaining set includes local campuses, region-level claims, and one placeholder, so completion is cleanup-sensitive."
  },
  {
    label: "Sources",
    effort: "High",
    count: categoryCounts.Source,
    rationale: `${categoryCounts.Source} remain, and source-observable review judges source identity, accessibility, classification, and support scope.`
  },
  {
    label: "Placeholder",
    effort: "High",
    count: placeholderRecords.length,
    rationale:
      "The placeholder should not be upgraded without resolving whether the registry object itself should remain, split, or be replaced."
  }
];

const valueRows: Array<{
  label: string;
  trustValue: ValueLevel;
  ecosystemValue: ValueLevel;
  observatoryValue: ValueLevel;
  rationale: string;
}> = [
  {
    label: "Organizations",
    trustValue: "Medium",
    ecosystemValue: "Medium",
    observatoryValue: "Medium",
    rationale:
      "Finishing the remaining organizations improves entity coverage, but the count is small and most core organizations are already source-backed."
  },
  {
    label: "Models",
    trustValue: "High",
    ecosystemValue: "High",
    observatoryValue: "High",
    rationale:
      "Remaining models are visible ecosystem artifacts, and model verification materially improves search, comparison, and relationship trust."
  },
  {
    label: "Infrastructure",
    trustValue: "Medium",
    ecosystemValue: "High",
    observatoryValue: "Medium",
    rationale:
      "Infrastructure has strong ecosystem importance, but the phase is substantially complete and the remaining records are more edge-case heavy."
  },
  {
    label: "Sources",
    trustValue: "High",
    ecosystemValue: "Medium",
    observatoryValue: "High",
    rationale:
      "Source observable verification improves the evidence layer itself and can stage cleaner follow-on review for models and infrastructure."
  },
  {
    label: "Placeholder",
    trustValue: "High",
    ecosystemValue: "Low",
    observatoryValue: "High",
    rationale:
      "Resolving the placeholder improves registry trust, but it is not a broad ecosystem coverage gain by itself."
  }
];

const recommendedBatch009Ids = [
  "model-amazon-nova",
  "model-falcon-180b",
  "model-jamba-1-5-large",
  "model-qwen-2-5",
  "model-deepseek-v3"
];

const recommendedBatch009Records = recommendedBatch009Ids
  .map((id) => observables.find((observable) => observable.id === id))
  .filter((observable): observable is Observable => Boolean(observable));

const pathRows = [
  {
    label: "Path A",
    title: "Source-focused",
    gain: nextRouteGain,
    result: verifiedCount + nextRouteGain,
    route:
      "Continue with remaining Source observables as source-layer cleanup.",
    tradeoff:
      "Direct evidence-layer value, but source representation questions can still retain records."
  },
  {
    label: "Path B",
    title: "Model-focused",
    gain: nextRouteGain,
    result: verifiedCount + nextRouteGain,
    route:
      "Stage a full model-focused Batch 009 using the cleaner source context from Source Batch 002.",
    tradeoff:
      "High ecosystem value, but exact model/version evidence discipline remains the main risk."
  },
  {
    label: "Path C",
    title: "Infrastructure completion",
    gain: nextRouteGain,
    result: verifiedCount + nextRouteGain,
    route:
      "Review remaining non-placeholder infrastructure records while keeping the placeholder separate.",
    tradeoff:
      "Improves phase closure, but local campus evidence and the placeholder make infrastructure cleanup harder."
  },
  {
    label: "Path D",
    title: "Organization completion",
    gain: nextRouteGain,
    result: verifiedCount + nextRouteGain,
    route:
      "Finish the three remaining organization records, then add model or source records.",
    tradeoff:
      "Likely low effort, but it leaves the largest remaining model backlog untouched."
  }
];

const roadmapRows = [
  {
    milestone: "80 verified",
    needed: recordsTo80,
    remaining: observables.length - 80,
    note: "Threshold achieved by the single-record Verification Threshold 80 step."
  },
  {
    milestone: "90 verified",
    needed: recordsTo90,
    remaining: observables.length - 90,
    note:
      "Requires resolving most source and model backlog, or a balanced mix across Sources, Models, Organizations, and Infrastructure."
  },
  {
    milestone: "100 verified",
    needed: recordsTo100,
    remaining: observables.length - 100,
    note:
      "Equivalent to clearing every current needs-review record while leaving the lone placeholder as the final unresolved item."
  }
];

export default function BacklogRebalancePage() {
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
                href="/backlog-analysis"
                className="text-[#8fb7cf] hover:text-white"
              >
                Backlog Analysis
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
                href="/source-verification-criteria"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source Criteria
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Backlog rebalance
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Backlog rebalance after source verification batch 002.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This page reassesses the remaining Observatory backlog from the
              current {verifiedCount} source-backed records and recommends the
              highest-value path beyond 80 verified records. It is analysis only: no
              verification, evidence, review decisions, or status changes are
              performed here.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Current State
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryLine
                label="Verified"
                value={verifiedCount}
                status="source_backed"
              />
              <SummaryLine
                label="Needs review"
                value={needsReviewCount}
                status="needs_source_review"
              />
              <SummaryLine
                label="Placeholder"
                value={placeholderCount}
                status="placeholder"
              />
              <SummaryLine label="Records needed for 80" value={recordsTo80} />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Unresolved Backlog"
            title="Remaining records by category"
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
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
                {displayBacklogRows.map((row) => (
                  <tr key={row.key} className="border-b border-white/10">
                    <td className="px-3 py-4 font-semibold text-white">
                      {row.label}
                    </td>
                    <td className="px-3 py-4 text-slate-300">{row.count}</td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.percentage}
                    </td>
                    <td className="px-3 py-4 text-slate-400">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Placeholder is shown as a status subset and is not additive with the
            category rows.
          </p>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Verification Effort Assessment"
            title="Likely effort by remaining category"
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {effortRows.map((row) => (
              <AssessmentCard key={row.label} row={row} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Verification Value Assessment"
            title="Trust, ecosystem, and Observatory value"
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-5">
            {valueRows.map((row) => (
              <ValueCard key={row.label} row={row} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="After Threshold 80"
            title={`Four routes from ${verifiedCount} toward 90`}
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            {pathRows.map((row) => (
              <PathCard key={row.label} row={row} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Recommended Batch 009"
            title="Model-focused batch, five records"
          />
          <div className="mt-3 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded border border-white/10 bg-[#03050d] p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                Recommendation
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Batch 009 should rebalance toward model verification.
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Models are now the largest unresolved segment at{" "}
                {categoryCounts.Model} of {unresolvedCount} unresolved records.
                Source Batch 002 verified source observables tied to these
                model records, so the next full batch can use that cleaner
                source context without treating this page as verification.
              </p>
            </div>
            <div className="grid gap-3">
              {recommendedBatch009Records.map((observable, index) => (
                <BatchTargetCard
                  key={observable.id}
                  observable={observable}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Roadmap Snapshot"
            title={`Illustrative milestones beyond ${verifiedCount} verified`}
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {roadmapRows.map((row) => (
              <RoadmapCard key={row.milestone} row={row} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Strategic Recommendation"
            title="What should the Observatory verify next?"
          />
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
            The Observatory has reached 80 source-backed records. The next full
            batch should rebalance toward model verification because Models are
            now the largest unresolved category and the recently completed
            source work improved source context for several remaining model
            records.
          </p>
        </section>
      </main>
    </div>
  );
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

function AssessmentCard({
  row
}: {
  row: {
    label: string;
    effort: Effort;
    count: number;
    rationale: string;
  };
}) {
  return (
    <article className="rounded border border-white/10 bg-[#03050d] p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">
        {row.label}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-white">{row.effort}</h3>
      <p className="mt-1 text-xs font-semibold uppercase text-[#8fb7cf]">
        {row.count} unresolved
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{row.rationale}</p>
    </article>
  );
}

function ValueCard({
  row
}: {
  row: {
    label: string;
    trustValue: ValueLevel;
    ecosystemValue: ValueLevel;
    observatoryValue: ValueLevel;
    rationale: string;
  };
}) {
  return (
    <article className="rounded border border-white/10 bg-[#03050d] p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">
        {row.label}
      </p>
      <div className="mt-3 grid gap-2 text-sm">
        <ValueLine label="Trust" value={row.trustValue} />
        <ValueLine label="Ecosystem" value={row.ecosystemValue} />
        <ValueLine label="Observatory" value={row.observatoryValue} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{row.rationale}</p>
    </article>
  );
}

function ValueLine({ label, value }: { label: string; value: ValueLevel }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded border border-white/10 bg-[#07111c] px-3 py-2">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function PathCard({
  row
}: {
  row: {
    label: string;
    title: string;
    gain: number;
    result: number;
    route: string;
    tradeoff: string;
  };
}) {
  return (
    <article className="rounded border border-white/10 bg-[#03050d] p-4">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
        {row.label}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-white">{row.title}</h3>
      <p className="mt-2 text-sm font-semibold text-slate-300">
        +{row.gain} records, reaching {row.result}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{row.route}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">{row.tradeoff}</p>
    </article>
  );
}

function BatchTargetCard({
  observable,
  index
}: {
  observable: Observable;
  index: number;
}) {
  const related = getRelatedObservables(observable.id);
  const sources = getSourcesForObservable(observable.id);

  return (
    <article className="rounded border border-white/10 bg-[#03050d] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Candidate {index + 1}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            <Link
              href={registryObservableHref(observable)}
              className="hover:text-[#d8edf8]"
            >
              {observable.name}
            </Link>
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <TypeBadge type={observable.type} variant="dark" />
          <VerificationBadge status={observable.verification_status} />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {observable.summary}
      </p>
      <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
        Registry source
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-300">
        {sources[0]?.title ?? "No linked source record"}{" "}
        {sources[0] ? `(${sources[0].publisher})` : ""}
      </p>
      <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
        Linked review surface
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-300">
        {related.map((item) => item.observable.name).join(", ")}
      </p>
    </article>
  );
}

function RoadmapCard({
  row
}: {
  row: {
    milestone: string;
    needed: number;
    remaining: number;
    note: string;
  };
}) {
  return (
    <article className="rounded border border-white/10 bg-[#03050d] p-4">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
        {row.milestone}
      </p>
      <h3 className="mt-2 text-2xl font-semibold text-white">
        {row.needed} more
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        {row.remaining} records would remain unresolved.
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{row.note}</p>
    </article>
  );
}

function isUnresolved(observable: Observable) {
  return observable.verification_status !== "source_backed";
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

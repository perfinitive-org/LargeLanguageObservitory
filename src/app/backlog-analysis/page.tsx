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
  title: "Backlog Analysis | AI Native Observatory",
  description:
    "Read-only analysis of remaining Observatory verification backlog."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;

const categoryRows: Array<{
  type: ObservableType;
  label: string;
  opportunity: string;
}> = [
  {
    type: "Organization",
    label: "Organizations",
    opportunity: "Fast cleanup, small remaining count"
  },
  {
    type: "Model",
    label: "Models",
    opportunity: "Remaining entity backlog"
  },
  {
    type: "Data Center",
    label: "Infrastructure",
    opportunity: "Substantially complete"
  },
  {
    type: "Source",
    label: "Sources",
    opportunity: "Recommended verification focus"
  }
];

const unresolvedRecords = observables.filter(isUnresolved);
const needsReviewRecords = observables.filter(
  (observable) => observable.verification_status === "needs_source_review"
);
const placeholderRecords = observables.filter(
  (observable) => observable.verification_status === "placeholder"
);

const backlogSummary = {
  needsReview: needsReviewRecords.length,
  placeholder: placeholderRecords.length,
  unresolved: unresolvedRecords.length
};

const categoryBacklog = categoryRows.map((category) => {
  const records = unresolvedRecords.filter(
    (observable) => observable.type === category.type
  );

  return {
    ...category,
    records,
    remaining: records.length,
    percentage: formatPercent(records.length, backlogSummary.unresolved)
  };
});

const organizationBacklog =
  categoryBacklog.find((row) => row.type === "Organization")?.remaining ?? 0;
const modelBacklog =
  categoryBacklog.find((row) => row.type === "Model")?.remaining ?? 0;
const infrastructureBacklog =
  categoryBacklog.find((row) => row.type === "Data Center")?.remaining ?? 0;
const sourceBacklog =
  categoryBacklog.find((row) => row.type === "Source")?.remaining ?? 0;
const infrastructurePlaceholderCount = placeholderRecords.filter(
  (record) => record.type === "Data Center"
).length;

const backlogDisplayRows = [
  ...categoryBacklog.map((row) => ({
    key: row.type,
    label: row.label,
    type: row.type,
    remaining: row.remaining,
    percentage: row.percentage,
    opportunity: row.opportunity
  })),
  {
    key: "Placeholder",
    label: "Placeholder",
    type: undefined,
    remaining: placeholderRecords.length,
    percentage: formatPercent(
      placeholderRecords.length,
      backlogSummary.unresolved
    ),
    opportunity: "Status cleanup subset; overlaps infrastructure"
  }
];

const tiers = [
  {
    name: "Tier 1",
    label: "Clear path",
    rationale:
      "Needs-review organizations and non-placeholder infrastructure records with direct operator or product identity in the registry.",
    records: unresolvedRecords.filter(
      (observable) => getTierName(observable) === "Tier 1"
    )
  },
  {
    name: "Tier 2",
    label: "Moderate effort",
    rationale:
      "Model records with likely official release or documentation paths, but requiring careful model/version confirmation.",
    records: unresolvedRecords.filter(
      (observable) => getTierName(observable) === "Tier 2"
    )
  },
  {
    name: "Tier 3",
    label: "Hardest cleanup",
    rationale:
      "Source observables and placeholder records where the review target is more ambiguous or cleanup-sensitive.",
    records: unresolvedRecords.filter(
      (observable) => getTierName(observable) === "Tier 3"
    )
  }
];

const sourcePlanningTargets = unresolvedRecords
  .filter(
    (observable) =>
      observable.type === "Source" &&
      observable.verification_status === "needs_source_review"
  )
  .sort(compareOpportunity)
  .slice(0, 15);

const riskItems = [
  `Infrastructure verification is substantially complete at ${
    25 - infrastructureBacklog
  } / 25 source-backed records, with ${infrastructureBacklog} infrastructure records still unresolved including ${infrastructurePlaceholderCount} placeholder.`,
  `${modelBacklog} model records remain unresolved, making models the largest remaining category after Source Batch 002.`,
  `${sourceBacklog} source observables remain unresolved and remain high-value source-layer cleanup targets.`,
  `${placeholderRecords.length} placeholder record remains and should not be upgraded without direct review.`
];

const verificationValueRows = [
  {
    label: "Organizations",
    remaining: organizationBacklog,
    difficulty: "Low",
    value:
      "Small remaining count and clear entity identities; useful cleanup, but limited backlog reduction."
  },
  {
    label: "Models",
    remaining: modelBacklog,
    difficulty: "Moderate",
    value:
      "Strong ecosystem value and the largest remaining backlog segment; model records have likely official release or documentation paths."
  },
  {
    label: "Infrastructure",
    remaining: infrastructureBacklog,
    difficulty: "Moderate to high",
    value:
      "High ecosystem value, but the infrastructure phase is already substantially complete and the remaining records are narrower or cleanup-sensitive."
  },
  {
    label: "Sources",
    remaining: sourceBacklog,
    difficulty: "High",
    value:
      "Source observables remain high-trust-value cleanup, but source-observable review is ambiguous because it judges source records themselves."
  }
];

const recommendedStrategy = {
  option: "Batch 009 planning",
  category: "Models",
  rationale: `Model observables account for ${modelBacklog} unresolved records (${formatPercent(
    modelBacklog,
    backlogSummary.unresolved
  )}), the largest remaining category after Source Batch 002 and Verification Threshold 80. The Observatory has reached 80 source-backed records, and the next full batch should rebalance toward model records while source cleanup continues in parallel planning.`
};

export default function BacklogAnalysisPage() {
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
                href="/review-metrics"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Metrics
              </Link>
              <Link
                href="/mvp-status"
                className="text-[#8fb7cf] hover:text-white"
              >
                MVP Status
              </Link>
              <Link href="/evidence" className="text-[#8fb7cf] hover:text-white">
                Evidence
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Backlog analysis
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Remaining verification work, without changing the registry.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This read-only analysis categorizes unresolved Observatory records
              using existing observable metadata only. It does not verify
              records, create evidence, or change review outcomes.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Backlog Summary
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryLine
                label="Remaining needs review"
                value={backlogSummary.needsReview}
                status="needs_source_review"
              />
              <SummaryLine
                label="Remaining placeholder"
                value={backlogSummary.placeholder}
                status="placeholder"
              />
              <SummaryLine
                label="Total unresolved"
                value={backlogSummary.unresolved}
              />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Category backlog"
            title="Remaining backlog by category"
          />
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Placeholder is shown as a status subset, so it can overlap an
            observable category. The current placeholder is an infrastructure
            record.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Remaining</th>
                  <th className="px-3 py-3 font-semibold">Backlog share</th>
                  <th className="px-3 py-3 font-semibold">Opportunity</th>
                </tr>
              </thead>
              <tbody>
                {backlogDisplayRows.map((row) => (
                  <tr key={row.key} className="border-b border-white/10">
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        {row.type ? (
                          <TypeBadge type={row.type} variant="dark" />
                        ) : (
                          <VerificationBadge status="placeholder" compact />
                        )}
                        <span className="font-semibold text-white">
                          {row.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.remaining}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.percentage}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.opportunity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <TierPanel key={tier.name} tier={tier} />
          ))}
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Suggested next targets"
            title="Top 15 records for review planning"
          />
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Ranked from existing registry metadata only, this source-specific
            planning set preserves the remaining source cleanup queue after
            Source Batch 002. This is planning copy only and does not perform
            verification.
          </p>
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {sourcePlanningTargets.map((observable, index) => (
              <RecordCard
                key={observable.id}
                observable={observable}
                eyebrow={`Target ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <ReportPanel title="Backlog Risk Assessment" eyebrow="Risk surface">
            <ul className="grid gap-3">
              {riskItems.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </ul>
          </ReportPanel>

          <ReportPanel
            title="Verification Value Assessment"
            eyebrow="Where review effort pays off"
          >
            <div className="grid gap-3">
              {verificationValueRows.map((item) => (
                <div
                  key={item.label}
                  className="rounded border border-white/10 bg-[#03050d] p-4"
                >
                  <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                    {item.label}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <Metric label="Remaining" value={item.remaining} />
                    <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
                      <div className="text-sm font-semibold text-white">
                        {item.difficulty}
                      </div>
                      <div className="mt-1 text-xs font-semibold uppercase text-slate-500">
                        Expected difficulty
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </ReportPanel>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Priority Recommendation"
            title="Batch 009 should rebalance toward models"
          />
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {recommendedStrategy.rationale}
          </p>
          <div className="mt-4 rounded border border-white/10 bg-[#03050d] p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Recommended Verification Strategy
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              {recommendedStrategy.option}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Recommended next category: {recommendedStrategy.category}.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Source planning targets"
            title="Source records to stage before the next verification pass"
          />
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Recommendation only. These source observables are unresolved and
            should be staged as candidates for the next source verification
            batch. This page does not perform verification.
          </p>
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {sourcePlanningTargets.map((observable) => (
              <RecordCard
                key={observable.id}
                observable={observable}
                eyebrow="Source planning target"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function isUnresolved(observable: Observable) {
  return (
    observable.verification_status === "needs_source_review" ||
    observable.verification_status === "placeholder"
  );
}

function getTierName(observable: Observable) {
  if (
    observable.verification_status === "needs_source_review" &&
    (observable.type === "Organization" || observable.type === "Data Center")
  ) {
    return "Tier 1";
  }

  if (
    observable.verification_status === "needs_source_review" &&
    observable.type === "Model"
  ) {
    return "Tier 2";
  }

  return "Tier 3";
}

function compareOpportunity(a: Observable, b: Observable) {
  const statusDifference = statusRank(a) - statusRank(b);

  if (statusDifference !== 0) {
    return statusDifference;
  }

  const typeDifference = typeRank(a.type) - typeRank(b.type);

  if (typeDifference !== 0) {
    return typeDifference;
  }

  const tierDifference = tierRank(a) - tierRank(b);

  if (tierDifference !== 0) {
    return tierDifference;
  }

  const sourceDifference =
    getSourcesForObservable(b.id).length - getSourcesForObservable(a.id).length;

  if (sourceDifference !== 0) {
    return sourceDifference;
  }

  const relationshipDifference =
    getRelatedObservables(b.id).length - getRelatedObservables(a.id).length;

  if (relationshipDifference !== 0) {
    return relationshipDifference;
  }

  return observableOrder(a) - observableOrder(b);
}

function statusRank(observable: Observable) {
  return observable.verification_status === "placeholder" ? 1 : 0;
}

function tierRank(observable: Observable) {
  const ranks: Record<string, number> = {
    "Tier 1": 0,
    "Tier 2": 1,
    "Tier 3": 2
  };

  return ranks[getTierName(observable)];
}

function typeRank(type: ObservableType) {
  const ranks: Record<ObservableType, number> = {
    Model: 0,
    "Data Center": 1,
    Organization: 2,
    Source: 3
  };

  return ranks[type];
}

function observableOrder(observable: Observable) {
  return observables.findIndex((record) => record.id === observable.id);
}

function formatPercent(value: number, total: number) {
  if (total === 0) {
    return "0.0%";
  }

  return `${((value / total) * 100).toFixed(1)}%`;
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
      <span className="flex items-center gap-2">
        {status ? <VerificationBadge status={status} compact /> : null}
        <span className="text-lg font-semibold text-white">{value}</span>
      </span>
    </div>
  );
}

function TierPanel({
  tier
}: {
  tier: {
    name: string;
    label: string;
    rationale: string;
    records: Observable[];
  };
}) {
  return (
    <section className="rounded-lg border border-white/15 bg-[#07111c] p-4">
      <div className="border-b border-white/10 pb-3">
        <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
          {tier.name}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">{tier.label}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {tier.rationale}
        </p>
      </div>
      <SummaryLine label="Records" value={tier.records.length} />
      <p className="mt-3 text-sm text-slate-400">
        {formatPercent(tier.records.length, backlogSummary.unresolved)} of
        unresolved backlog.
      </p>
      <div className="mt-4 grid gap-2">
        {tier.records.slice(0, 6).map((observable) => (
          <MiniRecord key={observable.id} observable={observable} />
        ))}
        {tier.records.length > 6 ? (
          <div className="rounded border border-white/10 bg-[#03050d] px-3 py-2 text-sm text-slate-400">
            {tier.records.length - 6} additional records in this tier.
          </div>
        ) : null}
      </div>
    </section>
  );
}

function RecordCard({
  observable,
  eyebrow
}: {
  observable: Observable;
  eyebrow: string;
}) {
  const sourceCount = getSourcesForObservable(observable.id).length;
  const relationshipCount = getRelatedObservables(observable.id).length;

  return (
    <Link
      href={registryObservableHref(observable)}
      className="rounded-lg border border-l-4 border-white/10 border-l-[#8fb7cf] bg-[#03050d] p-4 transition hover:border-y-[#8fb7cf]/55 hover:border-r-[#8fb7cf]/55 hover:bg-[#0b1725]"
    >
      <p className="text-xs font-semibold uppercase text-slate-500">
        {eyebrow}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TypeBadge type={observable.type} variant="dark" />
        {observable.verification_status ? (
          <VerificationBadge status={observable.verification_status} />
        ) : null}
        <span className="rounded border border-white/10 bg-[#07111c] px-2 py-1 text-xs font-semibold uppercase text-slate-400">
          {getTierName(observable)}
        </span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-white">
        {observable.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        {observable.summary}
      </p>
      <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2">
        <Metric label="Linked sources" value={sourceCount} />
        <Metric label="Relationships" value={relationshipCount} />
      </div>
    </Link>
  );
}

function MiniRecord({ observable }: { observable: Observable }) {
  return (
    <Link
      href={registryObservableHref(observable)}
      className="rounded border border-white/10 bg-[#03050d] px-3 py-2 text-sm text-slate-300 hover:border-[#8fb7cf]/55 hover:text-white"
    >
      <span className="font-semibold text-white">{observable.name}</span>
      <span className="ml-2 text-xs uppercase text-slate-500">
        {observable.type}
      </span>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
      <div className="text-sm font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
    </div>
  );
}

function ReportPanel({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/15 bg-[#07111c] p-4">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded border border-white/10 bg-[#03050d] px-3 py-3 text-sm leading-6 text-slate-300">
      {children}
    </li>
  );
}

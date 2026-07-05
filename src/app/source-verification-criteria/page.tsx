import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import { observables, sources } from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type { Observable, Source } from "@/lib/types";

export const metadata: Metadata = {
  title: "Source Verification Criteria | AI Native Observatory",
  description:
    "Planning criteria for reviewing Source observables during source-verification batches."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;
type Difficulty = "Low" | "Medium" | "High";

type SourceObservableRow = {
  observable: Observable;
  sourceRecord: Source | undefined;
  sourceType: string;
};

const sourceObservables = observables
  .filter((observable) => observable.type === "Source")
  .sort((a, b) => a.name.localeCompare(b.name));

const sourceObservableRows: SourceObservableRow[] = sourceObservables.map((observable) => {
  const sourceRecord = sources.find(
    (source) => source.id === getMetadataString(observable, "sourceId")
  );

  return {
    observable,
    sourceRecord,
    sourceType: sourceRecord?.sourceType ?? "Unmapped source record"
  };
});

const sourceCounts = {
  total: sourceObservables.length,
  source_backed: countSourceObservablesByStatus("source_backed"),
  needs_source_review: countSourceObservablesByStatus("needs_source_review"),
  placeholder: countSourceObservablesByStatus("placeholder")
};

const unresolvedSourceCount =
  sourceCounts.needs_source_review + sourceCounts.placeholder;

const sourceCategoryRows = Object.entries(
  sourceObservableRows.reduce<Record<string, number>>((counts, row) => {
    counts[row.sourceType] = (counts[row.sourceType] ?? 0) + 1;
    return counts;
  }, {})
)
  .map(([label, count]) => ({
    label,
    count,
    unresolved: sourceObservableRows.filter(
      (row) =>
        row.sourceType === label &&
        row.observable.verification_status !== "source_backed"
    ).length
  }))
  .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

const sourceRecordOnlyCategoryRows = Object.entries(
  sources.reduce<Record<string, number>>((counts, source) => {
    counts[source.sourceType] = (counts[source.sourceType] ?? 0) + 1;
    return counts;
  }, {})
)
  .map(([label, count]) => ({ label, count }))
  .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

const definitionRows = [
  {
    label: "Source Observable",
    detail:
      "A canonical registry observable with type Source. It lets a source-like entity or source artifact be searched, related to other observables, and reviewed with the same status vocabulary as organizations, models, and infrastructure."
  },
  {
    label: "Source Record",
    detail:
      "A row in data/sources.json. It carries operational source metadata: title, publisher, URL, retrieval date, source type, reliability label, and linked observable IDs used by observations and relationships."
  },
  {
    label: "Evidence Record",
    detail:
      "A row in data/evidence-records.json. It documents a specific artifact used in review work, links that artifact to observables and review decisions, and explains how it supports a verification outcome."
  }
];

const verificationQuestions = [
  "Does the source actually exist at the recorded URL or stable identifier?",
  "Is the source identifiable by title, page name, document name, dataset name, or repository name?",
  "Is the publisher identifiable and consistent with the observable metadata?",
  "Is the source still accessible without relying on private access or unavailable context?",
  "Is the source correctly classified by source type and reliability label?",
  "Does the source support the associated observable without overbroad family, publisher, or category substitution?",
  "Do linked observations and relationships rely on the same source in a way the source can actually support?",
  "Is the Source observable distinct from any existing Source observable, Source record, or Evidence record?"
];

const outcomeRows: Array<{
  status: ReviewStatus;
  title: string;
  detail: string;
}> = [
  {
    status: "source_backed",
    title: "Source backed",
    detail:
      "Use only when the Source observable is identifiable, accessible, correctly classified, and its linked Source record supports the associated observables conservatively."
  },
  {
    status: "needs_source_review",
    title: "Needs source review",
    detail:
      "Use when the source likely belongs in the registry but one or more review questions remain unresolved, such as accessibility, publisher identity, classification, or support scope."
  },
  {
    status: "placeholder",
    title: "Placeholder",
    detail:
      "Use when the source is only a structural placeholder or likely future target and should not be treated as reviewed source material."
  }
];

const difficultyRows: Array<{
  difficulty: Difficulty;
  title: string;
  detail: string;
}> = [
  {
    difficulty: "Low",
    title: "Clear primary source",
    detail:
      "Official release notes, product documentation, model documentation, or company announcements with a clear publisher, stable title, and narrow linked observable set."
  },
  {
    difficulty: "Medium",
    title: "Requires scope judgment",
    detail:
      "Sources linked to unresolved observables, multiple relationships, broad documentation pages, or source types where the source may support identity but not every registry claim."
  },
  {
    difficulty: "High",
    title: "Ambiguous or broad support surface",
    detail:
      "Public filings, broad data analysis, technical reports, mirrored documents, or sources that may be confused with evidence artifacts or duplicate Source observables."
  }
];

const tierRows = [
  {
    tier: "Tier 1",
    title: "Clear official source observables",
    detail:
      "Start with official release notes, product documentation, model documentation, and company announcements from identifiable publishers. These calibrate the checklist with low ambiguity and high registry value.",
    examples:
      "Google Gemma 2, Mistral Large, Mixtral 8x7B, NVIDIA H100, Microsoft Wisconsin announcement"
  },
  {
    tier: "Tier 2",
    title: "Sources tied to unresolved entities",
    detail:
      "Then review source observables that may unlock later entity verification planning, especially sources linked to unresolved models, organizations, or infrastructure records.",
    examples:
      "Amazon Nova, AI21 Jamba, Alibaba Qwen, Oracle AI infrastructure overview"
  },
  {
    tier: "Tier 3",
    title: "Broad, ambiguous, or high-risk sources",
    detail:
      "Finish with broad data-analysis sources, public filings, technical reports, and sources touching placeholders or many relationships. These need tighter scope notes before status changes.",
    examples:
      "EIA data center electricity analysis, CoreWeave public filing, DeepSeek-V3 report, Falcon 180B release material"
  }
];

const suggestedSourceBatch001Ids = [
  "source-google-gemma-2",
  "source-mistral-large",
  "source-mistral-mixtral",
  "source-nvidia-h100-product-brief",
  "source-microsoft-wisconsin-campus"
];

const suggestedSourceBatch001Rows = suggestedSourceBatch001Ids
  .map((id) => sourceObservableRows.find((row) => row.observable.id === id))
  .filter((row): row is SourceObservableRow => Boolean(row));

const riskRows = [
  {
    title: "Duplicate source observables",
    detail:
      "A source page can appear as a Source observable, a Source record, and an Evidence record. Reviewers must confirm whether a new Source observable is genuinely distinct."
  },
  {
    title: "Publisher ambiguity",
    detail:
      "Some documents are hosted by one entity, authored by another, or refer to a product family. Source verification should identify the publisher used by the registry."
  },
  {
    title: "Dead links or moved pages",
    detail:
      "A URL may redirect, disappear, or require a new stable location. Accessibility should be checked before any source-backed outcome."
  },
  {
    title: "Source/evidence confusion",
    detail:
      "Source observables describe cataloged source material. Evidence records document artifacts used to support review decisions. A source should not be upgraded merely because evidence exists elsewhere."
  },
  {
    title: "Support-scope overreach",
    detail:
      "A source can support the existence of a page or product while not supporting every linked claim, relationship, capability, benchmark, or deployment detail."
  }
];

export default function SourceVerificationCriteriaPage() {
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
                href="/backlog-analysis"
                className="text-[#8fb7cf] hover:text-white"
              >
                Backlog Analysis
              </Link>
              <Link
                href="/method/source-evidence-model"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source/Evidence Model
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Source verification criteria
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Source verification criteria.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Planning guidance for reviewing Source observables during
              source-verification batches. This page defines criteria only; it
              does not create evidence, create review decisions, or change
              statuses.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Source Observable Inventory
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryLine label="Source observables" value={sourceCounts.total} />
              <SummaryLine
                label="Source backed"
                value={sourceCounts.source_backed}
                status="source_backed"
              />
              <SummaryLine
                label="Unresolved"
                value={unresolvedSourceCount}
                status="needs_source_review"
              />
              <SummaryLine
                label="Placeholder"
                value={sourceCounts.placeholder}
                status="placeholder"
              />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-3">
          {definitionRows.map((row) => (
            <Panel key={row.label} title={row.label} eyebrow="Definition">
              <p className="text-sm leading-6 text-slate-300">{row.detail}</p>
            </Panel>
          ))}
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Review Questions"
            title="Questions every Source observable review should answer"
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {verificationQuestions.map((question, index) => (
              <ChecklistRow
                key={question}
                label={`Question ${index + 1}`}
                value={question}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {outcomeRows.map((row) => (
            <Panel key={row.status} title={row.title} eyebrow="Review Outcome">
              <div className="mb-3">
                <VerificationBadge status={row.status} />
              </div>
              <p className="text-sm leading-6 text-slate-300">{row.detail}</p>
            </Panel>
          ))}
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Difficulty Assessment"
            title="How to estimate source-verification effort"
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {difficultyRows.map((row) => (
              <DifficultyCard key={row.difficulty} row={row} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.78fr]">
          <Panel
            title="Source Observable Categories"
            eyebrow="Current Source observables"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                    <th className="px-3 py-3 font-semibold">Category</th>
                    <th className="px-3 py-3 font-semibold">Total</th>
                    <th className="px-3 py-3 font-semibold">Unresolved</th>
                  </tr>
                </thead>
                <tbody>
                  {sourceCategoryRows.map((row) => (
                    <tr key={row.label} className="border-b border-white/10">
                      <td className="px-3 py-4 font-semibold text-white">
                        {row.label}
                      </td>
                      <td className="px-3 py-4 text-slate-300">{row.count}</td>
                      <td className="px-3 py-4 text-slate-300">
                        {row.unresolved}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Other Source Data Categories" eyebrow="Source records">
            <p className="mb-4 text-sm leading-6 text-slate-300">
              Source records also include categories that may not yet have a
              matching Source observable or may appear only as backing records.
            </p>
            <div className="grid gap-2">
              {sourceRecordOnlyCategoryRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 rounded border border-white/10 bg-[#03050d] px-3 py-2"
                >
                  <span className="text-sm font-semibold text-white">
                    {row.label}
                  </span>
                  <span className="text-sm text-slate-300">{row.count}</span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Recommended Order"
            title="Source verification tiers"
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {tierRows.map((row) => (
              <TierCard key={row.tier} row={row} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Source Batch 001 Calibration Set"
            title="Five Source observables used for the first source-review calibration set"
          />
          <p className="mt-3 text-sm leading-6 text-slate-300">
            These Source observables were selected because they have identifiable
            publishers and relatively narrow support surfaces. Source
            Verification Batch 001 used this set to calibrate source-specific
            criteria before harder public filings, broad data analysis, or
            technical reports.
          </p>
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {suggestedSourceBatch001Rows.map((row, index) => (
              <SourceTargetCard key={row.observable.id} row={row} index={index} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Source Verification Risks"
            title="Risks to resolve before status changes"
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {riskRows.map((row) => (
              <div
                key={row.title}
                className="rounded border border-white/10 bg-[#03050d] p-4"
              >
                <h3 className="font-semibold text-white">{row.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
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

function getMetadataString(observable: Observable, key: string) {
  const value = observable.metadata[key];
  return typeof value === "string" ? value : undefined;
}

function countSourceObservablesByStatus(status: ReviewStatus) {
  return sourceObservables.filter(
    (observable) => observable.verification_status === status
  ).length;
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

function ChecklistRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-[#03050d] p-4">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{value}</p>
    </div>
  );
}

function DifficultyCard({
  row
}: {
  row: { difficulty: Difficulty; title: string; detail: string };
}) {
  const classes: Record<Difficulty, string> = {
    Low: "border-l-[#7ba36f]",
    Medium: "border-l-[#d6b75f]",
    High: "border-l-[#d46a6a]"
  };

  return (
    <div
      className={`rounded-lg border border-l-4 border-white/15 bg-[#03050d] p-4 ${classes[row.difficulty]}`}
    >
      <p className="text-xs font-semibold uppercase text-slate-500">
        {row.difficulty} difficulty
      </p>
      <h3 className="mt-2 text-xl font-semibold text-white">{row.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{row.detail}</p>
    </div>
  );
}

function TierCard({
  row
}: {
  row: { tier: string; title: string; detail: string; examples: string };
}) {
  return (
    <div className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#03050d] p-4">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
        {row.tier}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-white">{row.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{row.detail}</p>
      <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
        Examples
      </p>
      <p className="mt-1 text-sm leading-6 text-slate-300">{row.examples}</p>
    </div>
  );
}

function SourceTargetCard({
  row,
  index
}: {
  row: SourceObservableRow;
  index: number;
}) {
  const publisher = row.sourceRecord?.publisher ?? "Publisher not mapped";
  const linkedCount = row.sourceRecord?.linkedObservableIds.length ?? 0;

  return (
    <Link
      href={registryObservableHref(row.observable)}
      className="rounded-lg border border-l-4 border-white/10 border-l-[#7ba36f] bg-[#03050d] p-4 transition hover:border-y-[#8fb7cf]/55 hover:border-r-[#8fb7cf]/55 hover:bg-[#0b1725]"
    >
      <p className="text-xs font-semibold uppercase text-slate-500">
        Suggested source {index + 1}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {row.observable.verification_status ? (
          <VerificationBadge status={row.observable.verification_status} />
        ) : null}
        <span className="rounded border border-white/10 bg-[#07111c] px-2 py-1 text-xs font-semibold uppercase text-slate-400">
          {row.sourceType}
        </span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-white">
        {row.observable.name}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        {row.observable.summary}
      </p>
      <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2">
        <Metric label="Publisher" value={publisher} />
        <Metric label="Linked observables" value={String(linkedCount)} />
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
      <div className="text-sm font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { TypeBadge } from "@/components/TypeBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  getEvidenceRecordById,
  getObservableById,
  getReviewDecisionById
} from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type {
  EvidenceRecord,
  Observable,
  ReviewDecision
} from "@/lib/types";

export const metadata: Metadata = {
  title: "Verification Batch 006 | AI Native Observatory",
  description:
    "Infrastructure verification batch for five Observatory records using normalized evidence."
};

const batchRecords = [
  {
    observableId: "dc-groq-lpu-cloud",
    decisionId: "verification-batch-006-groq-lpu-cloud-source-backed",
    category: "Infrastructure",
    officialEvidenceIds: ["evidence-groq-cloud-official"],
    independentEvidenceIds: ["evidence-groq-wsj-data-center-expansion"],
    findings: [
      "Distributed infrastructure record exists",
      "Official GroqCloud material identified",
      "Independent infrastructure coverage identified",
      "Groq operator context appears reasonable",
      "No capacity, deployment, performance, power, or tenancy claims were added"
    ]
  },
  {
    observableId: "dc-hugging-face-inference",
    decisionId: "verification-batch-006-hugging-face-inference-source-backed",
    category: "Infrastructure",
    officialEvidenceIds: ["evidence-hugging-face-inference-endpoints-official"],
    independentEvidenceIds: ["evidence-hugging-face-wikipedia-platform"],
    findings: [
      "Distributed infrastructure record exists",
      "Official Hugging Face Inference Endpoints documentation identified",
      "Independent broad platform reference identified",
      "Hosted inference service context appears reasonable",
      "No capacity, cloud-provider, performance, power, or tenancy claims were added"
    ]
  },
  {
    observableId: "dc-nvidia-dgx-cloud",
    decisionId: "verification-batch-006-nvidia-dgx-cloud-source-backed",
    category: "Infrastructure",
    officialEvidenceIds: ["evidence-nvidia-dgx-cloud-official"],
    independentEvidenceIds: ["evidence-nvidia-dgx-cloud-tomshardware"],
    findings: [
      "Distributed infrastructure record exists",
      "Official NVIDIA DGX Cloud material identified",
      "Independent cloud infrastructure coverage identified",
      "NVIDIA operator context appears reasonable",
      "No GPU-count, capacity, performance, power, or tenancy claims were added"
    ]
  },
  {
    observableId: "dc-oracle-chicago-region",
    decisionId: "verification-batch-006-oracle-chicago-source-backed",
    category: "Infrastructure",
    officialEvidenceIds: ["evidence-oracle-chicago-official-regions"],
    independentEvidenceIds: ["evidence-oracle-chicago-wikipedia-cloud"],
    findings: [
      "Cloud region record exists",
      "Official Oracle OCI region documentation identified",
      "Independent Oracle Cloud context identified",
      "Chicago region and OCI operator context appear reasonable",
      "No capacity, power, tenancy, or facility claims were added"
    ]
  },
  {
    observableId: "dc-tesla-dojo",
    decisionId: "verification-batch-006-tesla-dojo-needs-source-review",
    category: "Infrastructure",
    officialEvidenceIds: ["evidence-tesla-ai-day-2021-official"],
    independentEvidenceIds: ["evidence-tesla-dojo-dcd"],
    findings: [
      "Infrastructure record exists",
      "Official Tesla AI Day material was reviewed",
      "Independent historical Dojo infrastructure coverage identified",
      "Current active-status support remains review-sensitive",
      "Record retained for source review with no new capacity or deployment claims"
    ]
  }
];

type BatchItem = {
  observable: Observable;
  decision: ReviewDecision | undefined;
  category: string;
  officialEvidence: EvidenceRecord[];
  independentEvidence: EvidenceRecord[];
  findings: string[];
};

const batchItems = batchRecords
  .map((record): BatchItem | null => {
    const observable = getObservableById(record.observableId);

    if (!observable) {
      return null;
    }

    return {
      observable,
      decision: getReviewDecisionById(record.decisionId),
      category: record.category,
      officialEvidence: record.officialEvidenceIds
        .map(getEvidenceRecordById)
        .filter((evidence): evidence is EvidenceRecord => Boolean(evidence)),
      independentEvidence: record.independentEvidenceIds
        .map(getEvidenceRecordById)
        .filter((evidence): evidence is EvidenceRecord => Boolean(evidence)),
      findings: record.findings
    };
  })
  .filter((item): item is BatchItem => Boolean(item));

const evidenceRecordCount = new Set(
  batchRecords.flatMap((record) => [
    ...record.officialEvidenceIds,
    ...record.independentEvidenceIds
  ])
).size;

const upgradedCount = batchItems.filter(
  (item) =>
    item.decision?.decision === "source_backed" &&
    item.observable.verification_status === "source_backed"
).length;
const retainedCount = batchItems.length - upgradedCount;

export default function VerificationBatch006Page() {
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
              <Link
                href="/method/source-evidence-model"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source/Evidence Model
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Infrastructure verification batch
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Verification Batch 006.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Five additional infrastructure records were reviewed using the
              existing Observatory pipeline: official source, independent source,
              normalized evidence, review decision, and record-level status
              outcome.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Batch summary
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryTile label="Records reviewed" value={batchItems.length} />
              <SummaryTile label="Records upgraded" value={upgradedCount} />
              <SummaryTile label="Records retained" value={retainedCount} />
              <SummaryTile
                label="Evidence records created"
                value={evidenceRecordCount}
              />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-5">
          {batchItems.map((item) => (
            <BatchRecordCard key={item.observable.id} item={item} />
          ))}
        </section>
      </main>
    </div>
  );
}

function BatchRecordCard({ item }: { item: BatchItem }) {
  return (
    <article className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            {item.category}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            <Link
              href={registryObservableHref(item.observable)}
              className="hover:text-[#d8edf8]"
            >
              {item.observable.name}
            </Link>
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            {item.observable.summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TypeBadge type={item.observable.type} variant="dark" />
          <VerificationBadge status={item.observable.verification_status} />
        </div>
      </div>

      <section className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-4">
          <div className="rounded border border-white/10 bg-[#03050d] p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Review decision
            </p>
            {item.decision ? (
              <div className="mt-3">
                <VerificationBadge status={item.decision.decision} />
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {item.decision.reason}
                </p>
                <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
                  {item.decision.reviewer} / {item.decision.reviewDate}
                </p>
              </div>
            ) : null}
          </div>

          <div className="rounded border border-white/10 bg-[#03050d] p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Review findings
            </p>
            <ul className="mt-3 grid gap-2">
              {item.findings.map((finding) => (
                <ChecklistItem key={finding} label={finding} checked />
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4">
          <EvidenceGroup label="Official source" records={item.officialEvidence} />
          <EvidenceGroup
            label="Independent source"
            records={item.independentEvidence}
          />
        </div>
      </section>
    </article>
  );
}

function EvidenceGroup({
  label,
  records
}: {
  label: string;
  records: EvidenceRecord[];
}) {
  return (
    <section className="rounded border border-white/10 bg-[#03050d] p-4">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">{label}</p>
      <div className="mt-3 grid gap-3">
        {records.map((record) => (
          <Link
            key={record.id}
            href={`/evidence/${record.id}`}
            className="rounded border border-white/10 bg-[#07111c] p-3 hover:border-[#8fb7cf]/55"
          >
            <p className="text-sm font-semibold text-white">{record.title}</p>
            <p className="mt-1 text-xs font-semibold uppercase text-slate-500">
              {record.publisher} / {record.sourceType}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {record.notes}
            </p>
          </Link>
        ))}
      </div>
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

function ChecklistItem({
  label,
  checked = false
}: {
  label: string;
  checked?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-white/10 bg-[#07111c] px-3 py-3 text-sm text-slate-300">
      <span
        aria-hidden="true"
        className={`font-semibold ${checked ? "text-[#b8d8b1]" : "text-slate-500"}`}
      >
        {checked ? "\u2713" : "\u25a1"}
      </span>
      {label}
    </li>
  );
}

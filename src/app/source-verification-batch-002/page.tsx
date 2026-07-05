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
  title: "Source Verification Batch 002 | AI Native Observatory",
  description:
    "Second Source observable verification batch using the existing evidence and review-decision pipeline."
};

const batchRecords = [
  {
    observableId: "source-amazon-nova",
    decisionId: "source-verification-batch-002-amazon-nova-source-backed",
    officialEvidenceIds: ["evidence-source-amazon-nova-official"],
    independentEvidenceIds: ["evidence-source-amazon-nova-the-verge"],
    findings: [
      "Source exists as an identifiable AWS News Blog announcement",
      "Publisher is attributable to Amazon Web Services",
      "Source remains accessible at the normalized AWS URL",
      "Company-announcement classification is reasonable",
      "Review verifies the source observable itself only"
    ]
  },
  {
    observableId: "source-tii-falcon-180b",
    decisionId: "source-verification-batch-002-tii-falcon-180b-source-backed",
    officialEvidenceIds: ["evidence-source-tii-falcon-180b-huggingface"],
    independentEvidenceIds: ["evidence-source-tii-falcon-180b-wikipedia"],
    findings: [
      "Source exists as identifiable Falcon 180B model source material",
      "Publisher is attributable to Technology Innovation Institute",
      "Source remains accessible through the TII Hugging Face organization",
      "Model-card/source-material classification is reasonable",
      "Review verifies the source observable itself only"
    ]
  },
  {
    observableId: "source-ai21-jamba",
    decisionId: "source-verification-batch-002-ai21-jamba-source-backed",
    officialEvidenceIds: ["evidence-source-ai21-jamba-docs"],
    independentEvidenceIds: ["evidence-source-ai21-jamba-wikipedia"],
    findings: [
      "Source exists as identifiable AI21 Labs Jamba documentation",
      "Publisher is attributable to AI21 Labs",
      "Source remains accessible at the normalized AI21 documentation URL",
      "Product-documentation classification is reasonable",
      "Review verifies the source observable itself only"
    ]
  },
  {
    observableId: "source-alibaba-qwen",
    decisionId: "source-verification-batch-002-alibaba-qwen-source-backed",
    officialEvidenceIds: ["evidence-source-alibaba-qwen-official"],
    independentEvidenceIds: ["evidence-source-alibaba-qwen-wikipedia"],
    findings: [
      "Source exists as identifiable Qwen2.5 source material",
      "Publisher is attributable to the Qwen team and Alibaba context",
      "Source remains accessible at the normalized Qwen URL",
      "Model-documentation/source-material classification is reasonable",
      "Review verifies the source observable itself only"
    ]
  },
  {
    observableId: "source-deepseek-v3",
    decisionId: "source-verification-batch-002-deepseek-v3-source-backed",
    officialEvidenceIds: [
      "evidence-source-deepseek-v3-official-report",
      "evidence-source-deepseek-v3-official-api-docs"
    ],
    independentEvidenceIds: ["evidence-source-deepseek-v3-wikipedia"],
    findings: [
      "Source exists as an identifiable DeepSeek-V3 technical report",
      "Publisher is attributable to DeepSeek-AI and official DeepSeek release material",
      "Source remains accessible through stable report and DeepSeek documentation URLs",
      "Technical-report classification is reasonable",
      "Review verifies the source observable itself only"
    ]
  }
];

type BatchItem = {
  observable: Observable;
  decision: ReviewDecision | undefined;
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

export default function SourceVerificationBatch002Page() {
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
                href="/source-verification-criteria"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source Criteria
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Source verification batch
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Source Verification Batch 002.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Five Source observables were reviewed using the existing
              Observatory pipeline. This batch verifies source existence,
              attribution, accessibility, classification, and representation
              only; it does not verify the linked model records or add
              capability, benchmark, pricing, deployment, adoption, or market
              claims.
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
            Source observable
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
                <ChecklistItem key={finding} label={finding} />
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-4">
          <EvidenceGroup
            label="Official source"
            records={item.officialEvidence}
          />
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

function ChecklistItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-white/10 bg-[#07111c] px-3 py-3 text-sm text-slate-300">
      <span aria-hidden="true" className="font-semibold text-[#b8d8b1]">
        OK
      </span>
      {label}
    </li>
  );
}

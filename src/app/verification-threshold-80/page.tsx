import type { Metadata } from "next";
import Link from "next/link";
import { TypeBadge } from "@/components/TypeBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  getEvidenceRecordById,
  getObservableById,
  getReviewDecisionById,
  observables
} from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type { EvidenceRecord } from "@/lib/types";

export const metadata: Metadata = {
  title: "Verification Threshold 80 | AI Native Observatory",
  description:
    "Single-record verification checkpoint that moves the Observatory to 80 source-backed records."
};

const selectedObservableId = "org-stability-ai";
const reviewDecisionId = "verification-threshold-80-stability-ai-source-backed";
const evidenceIds = [
  "evidence-threshold-80-stability-ai-official",
  "evidence-threshold-80-stability-ai-wikipedia"
];

const selectedObservable = getObservableById(selectedObservableId);
const reviewDecision = getReviewDecisionById(reviewDecisionId);
const evidenceRecords = evidenceIds
  .map(getEvidenceRecordById)
  .filter((record): record is EvidenceRecord => Boolean(record));

const currentSourceBackedCount = observables.filter(
  (observable) => observable.verification_status === "source_backed"
).length;
const previousSourceBackedCount = currentSourceBackedCount - 1;
const remainingUnresolvedCount = observables.filter(
  (observable) => observable.verification_status !== "source_backed"
).length;

const findings = [
  "Exactly one unresolved record was selected",
  "Selected record is an organization record with low review risk",
  "Official Stability AI source supports the conservative organization description",
  "Independent reference corroborates the organization and Stable Diffusion association",
  "No model capability, benchmark, pricing, deployment, performance, adoption, or market claims were added"
];

export default function VerificationThreshold80Page() {
  if (!selectedObservable) {
    return null;
  }

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
                href="/review-decisions"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Decisions
              </Link>
              <Link href="/evidence" className="text-[#8fb7cf] hover:text-white">
                Evidence
              </Link>
              <Link
                href="/backlog-rebalance"
                className="text-[#8fb7cf] hover:text-white"
              >
                Backlog Rebalance
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              80-record threshold verification
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Verification threshold 80.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              One low-risk organization record was reviewed to move the
              Observatory from 79 to 80 source-backed records. This threshold
              check is not a batch and reviews no other record.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Threshold summary
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryTile
                label="Previous source-backed count"
                value={previousSourceBackedCount}
              />
              <SummaryTile
                label="New source-backed count"
                value={currentSourceBackedCount}
              />
              <SummaryTile
                label="Remaining unresolved"
                value={remainingUnresolvedCount}
              />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Selected record
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                <Link
                  href={registryObservableHref(selectedObservable)}
                  className="hover:text-[#d8edf8]"
                >
                  {selectedObservable.name}
                </Link>
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                {selectedObservable.summary}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <TypeBadge type={selectedObservable.type} variant="dark" />
              <VerificationBadge
                status={selectedObservable.verification_status}
              />
            </div>
          </div>

          <section className="mt-5 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="grid gap-4">
              <div className="rounded border border-white/10 bg-[#03050d] p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Review decision
                </p>
                {reviewDecision ? (
                  <div className="mt-3">
                    <VerificationBadge status={reviewDecision.decision} />
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {reviewDecision.reason}
                    </p>
                    <p className="mt-3 text-xs font-semibold uppercase text-slate-500">
                      {reviewDecision.reviewer} / {reviewDecision.reviewDate}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="rounded border border-white/10 bg-[#03050d] p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Threshold findings
                </p>
                <ul className="mt-3 grid gap-2">
                  {findings.map((finding) => (
                    <ChecklistItem key={finding} label={finding} />
                  ))}
                </ul>
              </div>
            </div>

            <section className="rounded border border-white/10 bg-[#03050d] p-4">
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Evidence used
              </p>
              <div className="mt-3 grid gap-3">
                {evidenceRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/evidence/${record.id}`}
                    className="rounded border border-white/10 bg-[#07111c] p-3 hover:border-[#8fb7cf]/55"
                  >
                    <p className="text-sm font-semibold text-white">
                      {record.title}
                    </p>
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
          </section>
        </section>
      </main>
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
    <li className="flex items-center gap-3 rounded-md border border-white/10 bg-[#07111c] px-3 py-3 text-sm text-slate-300">
      <span aria-hidden="true" className="font-semibold text-[#b8d8b1]">
        OK
      </span>
      {label}
    </li>
  );
}

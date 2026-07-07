import type { Metadata } from "next";
import Link from "next/link";
import { TypeBadge } from "@/components/TypeBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  evidenceRecords,
  getObservableById,
  getReviewDecisionById
} from "@/lib/data";
import type { EvidenceRecord, Observable, ReviewDecision } from "@/lib/types";

export const metadata: Metadata = {
  title: "Evidence | AI Native Observatory",
  description:
    "Reusable evidence records linked to observables and review decisions."
};

export default function EvidencePage() {
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
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <nav className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/" className="text-[#8fb7cf] hover:text-white">
                Home
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
                href="/method/source-evidence-model"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source/Evidence Model
              </Link>
              <Link
                href="/evidence/frontier-claim-velocity"
                className="text-[#8fb7cf] hover:text-white"
              >
                Frontier Claim Velocity
              </Link>
              <Link
                href="/verification-pilot-ai21-labs"
                className="text-[#8fb7cf] hover:text-white"
              >
                AI21 Pilot
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Evidence records
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Reusable source evidence for Observatory review decisions.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Evidence records normalize source metadata so the same evidence
              can support observables, review decisions, and future review
              workflows without adding a database. The{" "}
              <Link
                href="/method/source-evidence-model"
                className="font-semibold text-[#8fb7cf] hover:text-white"
              >
                source/evidence model
              </Link>{" "}
              explains the boundary between publisher origins and specific
              artifacts.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Evidence summary
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryTile label="Evidence records" value={evidenceRecords.length} />
              <SummaryTile
                label="Linked observables"
                value={
                  new Set(
                    evidenceRecords.flatMap(
                      (record) => record.linkedObservableIds
                    )
                  ).size
                }
              />
              <SummaryTile
                label="Linked decisions"
                value={
                  new Set(
                    evidenceRecords.flatMap(
                      (record) => record.linkedReviewDecisionIds
                    )
                  ).size
                }
              />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="mb-8 rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Evidence visualization
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Frontier Claim Velocity
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
            A timeline of public source-backed claims about frontier AI model
            and infrastructure scale. Values are shown by unit family and are
            not a forecast, ranking, certification, or private-capacity audit.
          </p>
          <Link
            href="/evidence/frontier-claim-velocity"
            className="mt-5 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#03050d] transition hover:bg-slate-200"
          >
            Open Frontier Claim Velocity
          </Link>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-4">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Evidence Records
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Normalized evidence ledger
              </h2>
            </div>
            <span className="rounded border border-white/10 bg-[#03050d] px-2 py-1 text-xs text-slate-300">
              {evidenceRecords.length}
            </span>
          </div>

          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {evidenceRecords.map((record) => (
              <EvidenceCard key={record.id} record={record} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function EvidenceCard({ record }: { record: EvidenceRecord }) {
  const observables = record.linkedObservableIds
    .map(getObservableById)
    .filter((observable): observable is Observable => Boolean(observable));
  const reviewDecisions = record.linkedReviewDecisionIds
    .map(getReviewDecisionById)
    .filter(
      (decision): decision is ReviewDecision => Boolean(decision)
    );

  return (
    <article className="grid gap-4 rounded-lg border border-l-4 border-white/10 border-l-[#8fb7cf] bg-[#03050d] p-4">
      <div>
        <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
          {record.sourceType}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-white">
          <Link
            href={`/evidence/${record.id}`}
            className="hover:text-[#d8edf8]"
          >
            {record.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-slate-400">{record.publisher}</p>
      </div>

      <div className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-2">
        <LinkedObservableList observables={observables} />
        <LinkedDecisionList decisions={reviewDecisions} />
      </div>

      <div className="border-t border-white/10 pt-4">
        <Link
          href={`/evidence/${record.id}`}
          className="inline-flex rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-sm font-semibold text-[#d8edf8] hover:bg-[#8fb7cf]/15"
        >
          Open evidence dossier
        </Link>
      </div>
    </article>
  );
}

function LinkedObservableList({ observables }: { observables: Observable[] }) {
  return (
    <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
      <p className="text-xs font-semibold uppercase text-slate-500">
        Linked observables
      </p>
      <div className="mt-2 grid gap-2">
        {observables.map((observable) => (
          <div key={observable.id} className="flex flex-wrap items-center gap-2">
            <TypeBadge type={observable.type} variant="dark" />
            <Link
              href={`/registry/${observable.slug}`}
              className="text-sm text-slate-300 hover:text-white"
            >
              {observable.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function LinkedDecisionList({
  decisions
}: {
  decisions: ReviewDecision[];
}) {
  return (
    <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
      <p className="text-xs font-semibold uppercase text-slate-500">
        Linked review decisions
      </p>
      <div className="mt-2 grid gap-2">
        {decisions.map((decision) => (
          <div key={decision.id} className="flex flex-wrap items-center gap-2">
            <VerificationBadge status={decision.decision} />
            <Link
              href="/review-decisions"
              className="text-sm text-slate-300 hover:text-white"
            >
              {decision.id}
            </Link>
          </div>
        ))}
      </div>
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

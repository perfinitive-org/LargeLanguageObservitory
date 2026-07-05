import type { Metadata } from "next";
import Link from "next/link";
import { TypeAccentRule, TypeBadge } from "@/components/TypeBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  getObservableById,
  observables,
  reviewDecisions
} from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type { Observable, ReviewDecision } from "@/lib/types";

export const metadata: Metadata = {
  title: "Review Decisions | AI Native Observatory",
  description:
    "Static ledger of human review decisions for AI Native Observatory records."
};

export default function ReviewDecisionsPage() {
  const decisionRows = reviewDecisions
    .map((decision) => ({
      decision,
      observable: getObservableById(decision.observableId)
    }))
    .sort((a, b) => b.decision.reviewDate.localeCompare(a.decision.reviewDate));

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
                href="/review-batch-001-sources"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source Artifact
              </Link>
              <Link href="/evidence" className="text-[#8fb7cf] hover:text-white">
                Evidence
              </Link>
              <Link
                href="/review-batch-001-evidence"
                className="text-[#8fb7cf] hover:text-white"
              >
                Evidence Artifact
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Review decision ledger
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Documented review outcomes for registry records.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This static ledger records human review decisions without changing
              provenance. It is backed by JSON and intentionally does not
              perform automated review.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Ledger summary
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryTile label="Review decisions" value={reviewDecisions.length} />
              <SummaryTile label="Registry records" value={observables.length} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Decision rows document review outcomes without mutating observable
              verification status.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Ledger schema
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Review decision fields
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">
              Status changes should be backed by a corresponding decision row.
            </p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <SchemaField label="id" />
            <SchemaField label="observableId" />
            <SchemaField label="decision" />
            <SchemaField label="reviewDate" />
            <SchemaField label="reviewer" />
            <SchemaField label="reason" />
            <SchemaField label="missingInformation[]" />
            <SchemaField label="recommendedSources[]" />
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Reviewed records
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Decision ledger
              </h2>
            </div>
            <span className="rounded border border-white/10 bg-[#03050d] px-2 py-1 text-xs text-slate-300">
              {reviewDecisions.length}
            </span>
          </div>

          {decisionRows.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {decisionRows.map(({ decision, observable }) => (
                <DecisionCard
                  key={decision.id}
                  decision={decision}
                  observable={observable}
                />
              ))}
            </div>
          ) : (
            <EmptyLedgerState />
          )}
        </section>
      </main>
    </div>
  );
}

function DecisionCard({
  decision,
  observable
}: {
  decision: ReviewDecision;
  observable: Observable | undefined;
}) {
  return (
    <article className="grid gap-4 rounded-lg border border-l-4 border-white/10 border-l-[#8fb7cf] bg-[#03050d] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <VerificationBadge status={decision.decision} />
        {observable ? <TypeBadge type={observable.type} variant="dark" /> : null}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white">
          {observable ? (
            <Link
              href={registryObservableHref(observable)}
              className="hover:text-[#d8edf8]"
            >
              {observable.name}
            </Link>
          ) : (
            decision.observableId
          )}
        </h3>
        {observable ? (
          <TypeAccentRule type={observable.type} className="mt-3" />
        ) : null}
      </div>

      <dl className="grid gap-3 border-t border-white/10 pt-4 text-sm md:grid-cols-3">
        <DecisionMeta label="Review date" value={decision.reviewDate} />
        <DecisionMeta label="Reviewer" value={decision.reviewer} />
        <DecisionMeta label="Reason" value={decision.reason} />
      </dl>

      <div className="grid gap-3 border-t border-white/10 pt-4 md:grid-cols-2">
        <DecisionList
          label="Missing information"
          items={decision.missingInformation}
        />
        <DecisionList
          label="Recommended sources"
          items={decision.recommendedSources}
        />
      </div>
    </article>
  );
}

function EmptyLedgerState() {
  return (
    <div className="mt-4 rounded-lg border border-dashed border-white/15 bg-[#03050d] p-6">
      <h3 className="text-lg font-semibold text-white">
        No review decisions currently logged.
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
        This is an acceptable state for the pilot. When records are reviewed,
        add rows to <CodeLabel>data/review-decisions.json</CodeLabel> before
        changing registry verification status.
      </p>
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

function SchemaField({ label }: { label: string }) {
  return (
    <div className="rounded border border-white/10 bg-[#03050d] px-3 py-2 text-sm font-semibold text-slate-300">
      {label}
    </div>
  );
}

function DecisionMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
      <dt className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-300">{value}</dd>
    </div>
  );
}

function DecisionList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded border border-white/10 bg-[#07111c] px-3 py-2">
      <div className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
      {items.length > 0 ? (
        <ul className="mt-2 grid gap-1 text-sm text-slate-300">
          {items.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-500">None listed</p>
      )}
    </div>
  );
}

function CodeLabel({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-white/10 bg-[#07111c] px-1.5 py-0.5 text-slate-100">
      {children}
    </code>
  );
}

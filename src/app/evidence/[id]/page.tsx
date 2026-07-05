import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TypeBadge } from "@/components/TypeBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  evidenceRecords,
  getEvidenceRecordById,
  getObservableById,
  getReviewDecisionById
} from "@/lib/data";
import type { Observable, ReviewDecision } from "@/lib/types";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return evidenceRecords.map((record) => ({
    id: record.id
  }));
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getEvidenceRecordById(id);

  return {
    title: record
      ? `${record.title} | Evidence | AI Native Observatory`
      : "Evidence | AI Native Observatory",
    description: record?.notes ?? "Evidence dossier for AI Native Observatory."
  };
}

export default async function EvidenceDossierPage({ params }: PageProps) {
  const { id } = await params;
  const record = getEvidenceRecordById(id);

  if (!record) {
    notFound();
  }

  const linkedObservables = record.linkedObservableIds
    .map(getObservableById)
    .filter((observable): observable is Observable => Boolean(observable));
  const linkedReviewDecisions = record.linkedReviewDecisionIds
    .map(getReviewDecisionById)
    .filter(
      (decision): decision is ReviewDecision => Boolean(decision)
    );

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
              <Link href="/evidence" className="text-[#8fb7cf] hover:text-white">
                Evidence
              </Link>
              <Link
                href="/review-decisions"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Decisions
              </Link>
              <Link
                href="/method/source-evidence-model"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source/Evidence Model
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Evidence dossier
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              {record.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              {record.notes}
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Source metadata
            </p>
            <dl className="mt-4 grid gap-3">
              <MetaItem label="Publisher" value={record.publisher} />
              <MetaItem label="URL" value={record.url} />
              <MetaItem label="Source type" value={record.sourceType} />
              <MetaItem label="Evidence ID" value={record.id} />
            </dl>
            <a
              href={record.url}
              className="mt-5 inline-flex rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-sm font-semibold text-[#d8edf8] hover:bg-[#8fb7cf]/15"
            >
              Open external source
            </a>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-2">
          <LinkedObservablePanel observables={linkedObservables} />
          <LinkedDecisionPanel decisions={linkedReviewDecisions} />
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Notes
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {record.notes}
          </p>
        </section>

        <details className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-5">
          <summary className="cursor-pointer text-sm font-semibold text-[#8fb7cf]">
            Raw JSON
          </summary>
          <pre className="mt-4 overflow-auto rounded border border-white/10 bg-[#03050d] p-4 text-xs leading-6 text-slate-300">
            {JSON.stringify(record, null, 2)}
          </pre>
        </details>
      </main>
    </div>
  );
}

function LinkedObservablePanel({ observables }: { observables: Observable[] }) {
  return (
    <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
        Linked observables
      </p>
      <div className="mt-4 grid gap-3">
        {observables.map((observable) => (
          <Link
            key={observable.id}
            href={`/registry/${observable.slug}`}
            className="rounded border border-white/10 bg-[#03050d] p-3 hover:border-[#8fb7cf]/55"
          >
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={observable.type} variant="dark" />
              <span className="text-sm font-semibold text-white">
                {observable.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LinkedDecisionPanel({
  decisions
}: {
  decisions: ReviewDecision[];
}) {
  return (
    <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
        Linked review decisions
      </p>
      <div className="mt-4 grid gap-3">
        {decisions.map((decision) => (
          <Link
            key={decision.id}
            href="/review-decisions"
            className="rounded border border-white/10 bg-[#03050d] p-3 hover:border-[#8fb7cf]/55"
          >
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge status={decision.decision} />
              <span className="text-sm font-semibold text-white">
                {decision.id}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {decision.reviewer} - {decision.reviewDate}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-[#03050d] px-3 py-2">
      <dt className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-slate-300">{value}</dd>
    </div>
  );
}

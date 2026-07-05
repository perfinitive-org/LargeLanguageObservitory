import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import { evidenceRecords, observables, reviewDecisions } from "@/lib/data";
import type { Observable } from "@/lib/types";

export const metadata: Metadata = {
  title: "ANO 80 Status Lock | AI Native Observatory",
  description:
    "Checkpoint page locking the AI Native Observatory 80 source-backed threshold and project boundaries."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;

const statusCounts = {
  total: observables.length,
  source_backed: countByStatus("source_backed"),
  needs_source_review: countByStatus("needs_source_review"),
  placeholder: countByStatus("placeholder")
};

const anoOwns = [
  "AI entities",
  "AI models",
  "AI infrastructure",
  "AI source observables",
  "Evidence records",
  "Review decisions",
  "Verification status"
];

const anoDoesNotOwn = [
  "Consumer data-flow receipts",
  "Data reciprocity scoring",
  "LiO signal routing",
  "Automated feeds",
  "Globe, timeline, or map layers",
  "Platform data-rights workflows"
];

const parkedWork = [
  "DRO replication",
  "Signals Infrastructure generalization",
  "Signal Layer V2",
  "Data Provenance Layer",
  "Globe",
  "Timeline",
  "Event streams",
  "LiO integration",
  "Automation"
];

const nextAnoOptions = [
  {
    label: "A",
    title: "Continue ANO verification from 80 toward 90"
  },
  {
    label: "B",
    title: "Harden ANO governance and public-facing documentation"
  },
  {
    label: "C",
    title: "Prepare ANO v1.0 review package"
  },
  {
    label: "D",
    title: "Improve evidence archival/provenance later"
  }
];

export default function Ano80StatusLockPage() {
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
                href="/ano-v1-readiness-review"
                className="text-[#8fb7cf] hover:text-white"
              >
                v1.0 Readiness
              </Link>
              <Link
                href="/ano-governance"
                className="text-[#8fb7cf] hover:text-white"
              >
                Governance
              </Link>
              <Link
                href="/ano-v1-release-candidate"
                className="text-[#8fb7cf] hover:text-white"
              >
                v1.0 RC
              </Link>
              <Link
                href="/ano-v1-internal-qa"
                className="text-[#8fb7cf] hover:text-white"
              >
                Internal QA
              </Link>
              <Link
                href="/ano-v1-final-release-decision"
                className="text-[#8fb7cf] hover:text-white"
              >
                Final Decision
              </Link>
              <Link
                href="/review-metrics"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Metrics
              </Link>
              <Link
                href="/eighty-threshold-review"
                className="text-[#8fb7cf] hover:text-white"
              >
                80 Review
              </Link>
              <Link
                href="/verification-threshold-80"
                className="text-[#8fb7cf] hover:text-white"
              >
                Threshold 80
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              80-threshold checkpoint
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              ANO 80-threshold status lock.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              AI Native Observatory is the active AI ecosystem trust instrument.
              This checkpoint locks the 80 source-backed threshold and preserves
              clear boundaries between ANO, parked DRO replication work, and
              the candidate Signals Infrastructure model.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Locked ANO State
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryLine label="Observables" value={statusCounts.total} />
              <SummaryLine
                label="Source backed"
                value={statusCounts.source_backed}
                status="source_backed"
              />
              <SummaryLine
                label="Needs review"
                value={statusCounts.needs_source_review}
                status="needs_source_review"
              />
              <SummaryLine
                label="Placeholder"
                value={statusCounts.placeholder}
                status="placeholder"
              />
              <SummaryLine label="Evidence records" value={evidenceRecords.length} />
              <SummaryLine
                label="Review decisions"
                value={reviewDecisions.length}
              />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <Panel title="Checkpoint Summary" eyebrow="80 source-backed">
            <p className="text-sm leading-6 text-slate-300">
              ANO has reached 80 source-backed records, maintains 84 evidence
              records, and has recorded 53 review decisions. The working review,
              evidence, and verification systems remain scoped to AI ecosystem
              observables.
            </p>
          </Panel>

          <Panel title="Project Boundary" eyebrow="Separation">
            <p className="text-sm leading-6 text-slate-300">
              AI Native Observatory tracks AI ecosystem records. Data
              Reciprocity Observatory is a separate parked replication study.
              Signals Infrastructure remains a candidate shared trust model, not
              a replacement for ANO.
            </p>
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Current ANO Scope" eyebrow="ANO owns">
            <ChecklistGrid items={anoOwns} />
          </Panel>

          <Panel title="Outside Current ANO Scope" eyebrow="ANO does not own">
            <ChecklistGrid items={anoDoesNotOwn} muted />
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading eyebrow="Parked Work" title="Separated future layers" />
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {parkedWork.map((item) => (
              <div
                key={item}
                className="rounded border border-white/10 bg-[#03050d] p-4 text-sm font-semibold text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Next ANO Work Options"
            title="Options only, no automatic choice"
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            {nextAnoOptions.map((option) => (
              <article
                key={option.label}
                className="rounded border border-white/10 bg-[#03050d] p-4"
              >
                <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                  Option {option.label}
                </p>
                <h3 className="mt-2 text-base font-semibold leading-6 text-white">
                  {option.title}
                </h3>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function countByStatus(status: ReviewStatus) {
  return observables.filter(
    (observable) => observable.verification_status === status
  ).length;
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

function ChecklistGrid({
  items,
  muted = false
}: {
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center gap-3 rounded-md border border-white/10 bg-[#03050d] px-3 py-3 text-sm text-slate-300"
        >
          <span
            aria-hidden="true"
            className={`font-semibold ${muted ? "text-slate-500" : "text-[#b8d8b1]"}`}
          >
            {muted ? "OUT" : "IN"}
          </span>
          {item}
        </div>
      ))}
    </div>
  );
}

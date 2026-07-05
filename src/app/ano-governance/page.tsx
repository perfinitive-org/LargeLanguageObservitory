import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import { evidenceRecords, observables, reviewDecisions } from "@/lib/data";
import type { Observable } from "@/lib/types";

export const metadata: Metadata = {
  title: "ANO Governance | AI Native Observatory",
  description:
    "Public-facing governance guide for reading, trusting, and bounding the AI Native Observatory."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;

const statusCounts = {
  total: observables.length,
  source_backed: countByStatus("source_backed"),
  needs_source_review: countByStatus("needs_source_review"),
  placeholder: countByStatus("placeholder")
};

const recordGuideRows = [
  {
    title: "Observable",
    detail: "The thing being tracked: an AI organization, model, infrastructure record, or source observable."
  },
  {
    title: "Observation",
    detail: "A bounded statement about the observable, tied to a source record."
  },
  {
    title: "Source",
    detail: "The origin or publisher of information, such as a company, publication, documentation set, report, or repository."
  },
  {
    title: "Evidence",
    detail: "A specific artifact used to support a claim, review decision, or verification outcome."
  },
  {
    title: "Review Decision",
    detail: "A human review outcome explaining why a record moved, stayed unresolved, or remained a placeholder."
  },
  {
    title: "Verification Status",
    detail: "The current trust state of the record: source-backed, needs source review, or placeholder."
  }
];

const statusRows: Array<{
  status: ReviewStatus;
  title: string;
  detail: string;
}> = [
  {
    status: "source_backed",
    title: "source_backed",
    detail:
      "The limited claim or conservative record description is supported by cited evidence. It does not mean the record is complete or universally true."
  },
  {
    status: "needs_source_review",
    title: "needs_source_review",
    detail:
      "The record belongs in the Observatory, but its evidence, source fit, relationships, or wording still need review before source-backed trust."
  },
  {
    status: "placeholder",
    title: "placeholder",
    detail:
      "The record is present only as a structural or likely future target. It should not be treated as verified."
  }
];

const evidenceStandardRows = [
  "Source-backed does not mean complete truth.",
  "Source-backed means the limited claim is supported by cited evidence.",
  "Policy, documentation, or article text supports what that source says.",
  "ANO does not infer hidden internal behavior.",
  "ANO does not treat claims as facts beyond the evidence."
];

const knownLimits = [
  `${statusCounts.needs_source_review} records remain needs-source-review.`,
  `${statusCounts.placeholder} record remains placeholder.`,
  "Some source observables remain unresolved.",
  "Evidence archival and snapshot depth are not yet fully hardened.",
  "ANO is static and manually reviewed.",
  "ANO does not provide live monitoring yet.",
  "ANO does not provide automated scoring."
];

const anoCovers = [
  "AI organizations",
  "AI models",
  "AI infrastructure",
  "AI source observables",
  "Evidence records",
  "Review decisions",
  "Verification status"
];

const anoDoesNotCover = [
  "Consumer data reciprocity",
  "DRO records",
  "LiO signal routing",
  "Automated feeds",
  "Event streams",
  "Live monitoring",
  "Globe, timeline, or map layers"
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

export default function AnoGovernancePage() {
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
              <Link href="/about" className="text-[#8fb7cf] hover:text-white">
                Method
              </Link>
              <Link
                href="/mvp-status"
                className="text-[#8fb7cf] hover:text-white"
              >
                MVP Status
              </Link>
              <Link
                href="/ano-80-status-lock"
                className="text-[#8fb7cf] hover:text-white"
              >
                80 Status Lock
              </Link>
              <Link
                href="/ano-v1-readiness-review"
                className="text-[#8fb7cf] hover:text-white"
              >
                v1.0 Readiness
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
                href="/ano-v1-public-launch-checklist"
                className="text-[#8fb7cf] hover:text-white"
              >
                Launch Checklist
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Public governance guide
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              How to read and trust the AI Native Observatory.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              AI Native Observatory is a static, manually reviewed trust
              instrument for public AI ecosystem records. It tracks AI
              organizations, models, infrastructure, source observables,
              evidence, review decisions, and verification status. It is not a
              live monitor, automated score, product feed, or complete truth
              claim about the AI ecosystem.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Current Trust State
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
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title="What ANO Is" eyebrow="Purpose">
            <p className="text-sm leading-6 text-slate-300">
              ANO is a source-backed registry for public AI ecosystem records.
              It is designed to make trust visible: what is tracked, what
              source supports it, what evidence was reviewed, and what status
              the record currently carries.
            </p>
          </Panel>

          <Panel title="What ANO Is Not" eyebrow="Boundary">
            <p className="text-sm leading-6 text-slate-300">
              ANO is not a complete market map, not a real-time feed, not an
              automated ranking system, and not a claim that every public AI
              statement is true. It does not infer hidden internal behavior or
              expand claims beyond the evidence.
            </p>
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="How to Read a Record"
            title="The pieces of a governed record"
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recordGuideRows.map((row) => (
              <InfoCard key={row.title} title={row.title} detail={row.detail} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Verification Status"
            title="How ANO status language should be read"
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {statusRows.map((row) => (
              <article
                key={row.status}
                className="rounded border border-white/10 bg-[#03050d] p-4"
              >
                <div className="mb-3">
                  <VerificationBadge status={row.status} />
                </div>
                <h3 className="font-semibold text-white">{row.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {row.detail}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Source vs Evidence" eyebrow="Core distinction">
            <p className="text-sm leading-6 text-slate-300">
              A Source is the origin or publisher of information. Evidence is
              the specific artifact reviewed to support a claim. One source may
              produce many evidence artifacts, and one evidence artifact may
              support more than one review decision.
            </p>
          </Panel>

          <Panel
            title="Observation vs Review Decision"
            eyebrow="Claim vs outcome"
          >
            <p className="text-sm leading-6 text-slate-300">
              An Observation is a bounded statement about an observable. A
              Review Decision is the human review outcome that explains whether
              evidence is sufficient for a status. Observations describe what is
              being claimed; review decisions describe what the Observatory
              trusts.
            </p>
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-4">
          <SectionHeading eyebrow="Evidence Standard" title="Limited claims only" />
          <div className="mt-4 grid gap-2">
            {evidenceStandardRows.map((item) => (
              <ChecklistItem key={item} label={item} />
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            ANO avoids unsupported claims because trust is only useful when the
            boundary is clear. If evidence supports a narrow statement, ANO
            keeps the claim narrow. If evidence only supports what a source
            says, ANO does not treat that as proof of hidden facts beyond the
            cited artifact.
          </p>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading eyebrow="Known Limits" title="What remains unresolved" />
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {knownLimits.map((item) => (
              <ChecklistItem key={item} label={item} muted />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Current Scope Boundary" eyebrow="ANO currently covers">
            <ChecklistGrid items={anoCovers} />
          </Panel>

          <Panel title="Outside Current Scope" eyebrow="ANO does not cover">
            <ChecklistGrid items={anoDoesNotCover} muted />
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading eyebrow="Parked Work" title="Not part of current ANO" />
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

function InfoCard({ title, detail }: { title: string; detail: string }) {
  return (
    <article className="rounded border border-white/10 bg-[#03050d] p-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{detail}</p>
    </article>
  );
}

function ChecklistItem({
  label,
  muted = false
}: {
  label: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-white/10 bg-[#03050d] px-3 py-3 text-sm text-slate-300">
      <span
        aria-hidden="true"
        className={`font-semibold ${muted ? "text-slate-500" : "text-[#b8d8b1]"}`}
      >
        {muted ? "LIMIT" : "OK"}
      </span>
      {label}
    </div>
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
        <ChecklistItem key={item} label={item} muted={muted} />
      ))}
    </div>
  );
}

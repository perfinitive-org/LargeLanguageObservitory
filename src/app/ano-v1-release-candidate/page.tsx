import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import { evidenceRecords, observables, reviewDecisions } from "@/lib/data";
import type { Observable } from "@/lib/types";

export const metadata: Metadata = {
  title: "ANO v1.0 Release Candidate | AI Native Observatory",
  description:
    "Release candidate package for the AI Native Observatory bounded AI ecosystem registry."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;

const statusCounts = {
  total: observables.length,
  source_backed: countByStatus("source_backed"),
  needs_source_review: countByStatus("needs_source_review"),
  placeholder: countByStatus("placeholder")
};

const includes = [
  "Registry of AI organizations, models, infrastructure, and source observables",
  "Observable detail pages",
  "Evidence records",
  "Source/evidence distinction",
  "Review decision ledger",
  "Verification statuses",
  "Review queue",
  "Review metrics",
  "State audit",
  "80-threshold lock",
  "Governance page",
  "Readiness review"
];

const doesNotInclude = [
  "Live feeds",
  "Scraping",
  "Automation",
  "Real-time monitoring",
  "Scoring",
  "Predictions",
  "Maps, globe, timeline, or graph layers",
  "LiO signal routing",
  "DRO data reciprocity records",
  "Universal Signals Infrastructure claims"
];

const knownLimits = [
  `${statusCounts.needs_source_review} records still need review.`,
  `${statusCounts.placeholder} placeholder remains.`,
  "Evidence archival and snapshot depth are not fully hardened.",
  "Some source observables remain unresolved.",
  "ANO uses manually reviewed static data only.",
  "Source-backed means limited evidence support, not complete truth."
];

const nextOptions = [
  {
    label: "A",
    title: "Internal v1.0 QA pass"
  },
  {
    label: "B",
    title: "Evidence archival/provenance hardening"
  },
  {
    label: "C",
    title: "Continue verification toward 90"
  },
  {
    label: "D",
    title: "Prepare deployment/public launch checklist"
  }
];

export default function AnoV1ReleaseCandidatePage() {
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
                href="/ano-governance"
                className="text-[#8fb7cf] hover:text-white"
              >
                Governance
              </Link>
              <Link
                href="/ano-v1-readiness-review"
                className="text-[#8fb7cf] hover:text-white"
              >
                v1.0 Readiness
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
              <Link
                href="/ano-80-status-lock"
                className="text-[#8fb7cf] hover:text-white"
              >
                80 Status Lock
              </Link>
              <Link
                href="/mvp-status"
                className="text-[#8fb7cf] hover:text-white"
              >
                MVP Status
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              v1.0 release candidate
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              ANO v1.0 release candidate.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              AI Native Observatory is a manual evidence-backed observatory, a
              static public trust instrument, and a bounded AI ecosystem
              registry. This page packages the current system as a v1.0 release
              candidate, not as a comprehensive AI map, real-time monitoring
              product, automated analysis platform, general trust
              infrastructure, or final authority.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Release Candidate Summary
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
        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Panel title="Release Candidate Summary" eyebrow="Current package">
            <p className="text-sm leading-6 text-slate-300">
              ANO v1.0 release candidate contains 101 observables, 80
              source-backed records, 20 needs-review records, 1 placeholder, 84
              evidence records, and 53 review decisions. Static export is
              working, the review workflow is operational, and the public
              governance page has been created.
            </p>
          </Panel>

          <Panel title="Release Candidate Verdict" eyebrow="Internal review">
            <div className="rounded border border-[#7ba36f]/45 bg-[#7ba36f]/10 px-3 py-2 text-sm font-semibold text-[#d8f2d2]">
              Ready for internal v1.0 review
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Public launch still depends on final review, copy QA, and
              optional evidence archival hardening.
            </p>
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="What v1.0 Includes" eyebrow="Included scope">
            <ChecklistGrid items={includes} />
          </Panel>

          <Panel title="What v1.0 Does Not Include" eyebrow="Excluded scope">
            <ChecklistGrid items={doesNotInclude} muted />
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading eyebrow="Known Limits" title="Release candidate limits" />
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {knownLimits.map((item) => (
              <ChecklistItem key={item} label={item} muted />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Recommended Next Options"
            title="Options only, no automatic choice"
          />
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            {nextOptions.map((option) => (
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
        <ChecklistItem key={item} label={item} muted={muted} />
      ))}
    </div>
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
        {muted ? "OUT" : "IN"}
      </span>
      {label}
    </div>
  );
}

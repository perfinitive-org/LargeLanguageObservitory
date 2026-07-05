import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import { evidenceRecords, observables, reviewDecisions } from "@/lib/data";
import type { Observable } from "@/lib/types";

export const metadata: Metadata = {
  title: "ANO v1.0 Internal QA | AI Native Observatory",
  description:
    "Internal v1.0 QA pass for the AI Native Observatory release-candidate site."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;
type QaSeverity = "Release Blocker" | "Important" | "Minor" | "Future";

const statusCounts = {
  total: observables.length,
  source_backed: countByStatus("source_backed"),
  needs_source_review: countByStatus("needs_source_review"),
  placeholder: countByStatus("placeholder")
};

const reviewedPages = [
  "/",
  "/mvp-status",
  "/registry",
  "/review-queue",
  "/review-decisions",
  "/review-metrics",
  "/evidence",
  "/state-audit",
  "/backlog-analysis",
  "/eighty-threshold-review",
  "/ano-80-status-lock",
  "/ano-v1-readiness-review",
  "/ano-governance",
  "/ano-v1-release-candidate",
  "/ano-v1-internal-qa",
  "/method/source-evidence-model"
];

const qaFindings: Array<{
  area: string;
  severity: QaSeverity;
  finding: string;
  disposition: string;
}> = [
  {
    area: "Navigation consistency",
    severity: "Minor",
    finding:
      "Core release-candidate pages cross-link to status, governance, readiness, and review surfaces. Older maintenance pages use local-purpose navigation rather than a unified release nav.",
    disposition:
      "Non-blocking. Consider a shared public navigation pass after v1.0 final review."
  },
  {
    area: "Count consistency",
    severity: "Minor",
    finding:
      "Reviewed status pages derive current counts from the JSON ledgers and agree on 101 observables, 80 source-backed records, 20 needs-review records, 1 placeholder, 84 evidence records, and 53 review decisions.",
    disposition: "No required fix."
  },
  {
    area: "Scope consistency",
    severity: "Minor",
    finding:
      "ANO, parked DRO work, parked Signals Infrastructure generalization, and the PPCL/cognitive fork remain separated from ANO v1.0 scope.",
    disposition: "No required fix."
  },
  {
    area: "Governance language consistency",
    severity: "Minor",
    finding:
      "Governance language consistently treats source-backed as limited evidence support rather than complete truth. Some older method copy still mentions possible future provenance work.",
    disposition:
      "Non-blocking. Keep the future provenance note as deferred work unless the v1.0 copy QA pass decides to tighten it."
  },
  {
    area: "Public readability",
    severity: "Important",
    finding:
      "The release-candidate, governance, readiness, and status-lock pages are readable and bounded. Some internal pages still use maintenance terms such as workbench, queue, and batch labels.",
    disposition:
      "Acceptable for internal v1.0 review. Public launch copy QA should decide whether to expose, rename, or de-emphasize older maintenance surfaces."
  },
  {
    area: "Stale references",
    severity: "Minor",
    finding:
      "Batch 007 is described as completed where it appears, and the stale DRO next-action language in the 80-threshold review has been remediated. Remaining next-action copy points to ANO implementation readiness or ANO backlog context.",
    disposition: "No required fix."
  },
  {
    area: "Overclaims",
    severity: "Minor",
    finding:
      "Reviewed release pages avoid claims that ANO is complete, live, automated, universal, or definitive.",
    disposition: "No required fix."
  },
  {
    area: "Internal links",
    severity: "Minor",
    finding:
      "The reviewed pages link to existing static routes or generated registry, evidence, and source detail routes. Build/export verification confirms the static routes are generated.",
    disposition: "No required fix."
  },
  {
    area: "Missing cross-links",
    severity: "Minor",
    finding:
      "The v1.0 release-candidate, MVP status, 80-status-lock, readiness, and governance pages link to this internal QA pass. Some older review pages do not link back to the v1.0 release path.",
    disposition:
      "Non-blocking. A future shared navigation cleanup can make the review surfaces easier to traverse."
  },
  {
    area: "Release-blocking issues",
    severity: "Release Blocker",
    finding:
      "No release blockers were found in this internal QA pass.",
    disposition: "No required fix before internal v1.0 final review."
  }
];

const requiredFixes: string[] = [];

const releaseBlockers: string[] = [];

const recommendedCleanup = [
  "Consider a shared navigation component for release, governance, evidence, and review surfaces.",
  "Keep older batch and workbench pages framed as historical review-process artifacts.",
  "Later, harden evidence archival and provenance snapshots without blocking internal v1.0 review."
];

const finalCopyQaItems = [
  "Public release and governance pages no longer expose packet IDs as reader-facing labels.",
  "Source-backed, needs-review, and placeholder language is aligned with the governance standard.",
  "Batch and evidence planning pages are framed as historical review-process artifacts, not current launch claims.",
  "DRO, Signals Infrastructure, LiO, PPCL, and cognitive telemetry references remain parked or excluded boundary references.",
  "No release-blocking copy issue was found."
];

const doNotFixNow = [
  "20 needs-review records",
  "1 placeholder",
  "Evidence archival depth",
  "Globe, timeline, or map layers",
  "Live monitoring",
  "Automation",
  "LiO integration",
  "DRO replication",
  "Signals Infrastructure generalization",
  "PPCL / cognitive persistence",
  "Cognitive telemetry fork"
];

export default function AnoV1InternalQaPage() {
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
                href="/ano-v1-release-candidate"
                className="text-[#8fb7cf] hover:text-white"
              >
                v1.0 RC
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
                href="/ano-governance"
                className="text-[#8fb7cf] hover:text-white"
              >
                Governance
              </Link>
              <Link
                href="/ano-v1-readiness-review"
                className="text-[#8fb7cf] hover:text-white"
              >
                Readiness
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
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              v1.0 internal QA pass
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              ANO v1.0 internal QA pass.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This read-only QA pass reviews the static release-candidate site
              for navigation, counts, scope boundaries, governance language,
              stale references, overclaims, links, and release-blocking issues.
              It does not verify records or change any ledger data.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              QA Count Check
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
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel title="QA Verdict" eyebrow="Internal release review">
            <div className="rounded border border-[#d8b35f]/45 bg-[#d8b35f]/10 px-3 py-2 text-sm font-semibold text-[#ffe8a6]">
              Conditional Pass — minor issues remain
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              No release blockers were found. The remaining issues are
              non-blocking cleanup items around public copy polish, older
              maintenance labels, and future provenance hardening.
            </p>
          </Panel>

          <Panel title="Pages Reviewed" eyebrow="Minimum QA surface">
            <div className="grid gap-2 sm:grid-cols-2">
              {reviewedPages.map((page) => (
                <Link
                  key={page}
                  href={page}
                  className="rounded border border-white/10 bg-[#03050d] px-3 py-2 text-sm font-semibold text-slate-300 hover:border-[#8fb7cf]/70 hover:text-white"
                >
                  {page}
                </Link>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="QA Findings"
            title="Severity-scored review results"
          />
          <div className="mt-4 grid gap-3">
            {qaFindings.map((finding) => (
              <FindingCard key={finding.area} finding={finding} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Release Blockers"
            title="True blockers before v1.0 final review"
          />
          <div className="mt-4">
            {releaseBlockers.length > 0 ? (
              <ChecklistGrid items={releaseBlockers} />
            ) : (
              <p className="text-sm leading-6 text-slate-300">
                No release blockers found.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Final Copy QA"
            title="Public copy readiness summary"
          />
          <div className="mt-4 rounded border border-[#d8b35f]/45 bg-[#d8b35f]/10 px-3 py-2 text-sm font-semibold text-[#ffe8a6]">
            Conditional Pass — non-blocking polish remains
          </div>
          <div className="mt-4">
            <ChecklistGrid items={finalCopyQaItems} />
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Required Fixes Before v1.0" eyebrow="Release blockers">
            {requiredFixes.length > 0 ? (
              <ChecklistGrid items={requiredFixes} />
            ) : (
              <p className="text-sm leading-6 text-slate-300">
                None identified for internal v1.0 final review.
              </p>
            )}
          </Panel>

          <Panel title="Recommended Cleanup" eyebrow="Non-blocking">
            <ChecklistGrid items={recommendedCleanup} />
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#6f7f92] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Do Not Fix Now"
            title="Deferred items that should not block v1.0"
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {doNotFixNow.map((item) => (
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

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="border-b border-white/10 pb-3">
      <p className="text-xs font-semibold uppercase text-slate-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
    </div>
  );
}

function FindingCard({
  finding
}: {
  finding: {
    area: string;
    severity: QaSeverity;
    finding: string;
    disposition: string;
  };
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#03050d] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{finding.area}</h3>
        <span className={severityClass(finding.severity)}>
          {finding.severity}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{finding.finding}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {finding.disposition}
      </p>
    </article>
  );
}

function ChecklistGrid({ items }: { items: string[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item}
          className="rounded border border-white/10 bg-[#03050d] px-3 py-2 text-sm text-slate-300"
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function severityClass(severity: QaSeverity) {
  const base =
    "rounded border px-2 py-1 text-xs font-semibold uppercase tracking-wide";

  if (severity === "Release Blocker") {
    return `${base} border-[#d66f6f]/45 bg-[#d66f6f]/10 text-[#ffd0d0]`;
  }

  if (severity === "Important") {
    return `${base} border-[#d8b35f]/45 bg-[#d8b35f]/10 text-[#ffe8a6]`;
  }

  if (severity === "Future") {
    return `${base} border-[#6f7f92]/45 bg-[#6f7f92]/10 text-slate-300`;
  }

  return `${base} border-[#8fb7cf]/45 bg-[#8fb7cf]/10 text-[#d8edf8]`;
}

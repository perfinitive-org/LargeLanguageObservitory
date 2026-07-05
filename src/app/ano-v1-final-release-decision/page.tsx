import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import { evidenceRecords, observables, reviewDecisions } from "@/lib/data";
import type { Observable } from "@/lib/types";

export const metadata: Metadata = {
  title: "ANO v1.0 Final Release Decision | AI Native Observatory",
  description:
    "Internal v1.0 release decision record for the AI Native Observatory."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;

const statusCounts = {
  total: observables.length,
  source_backed: countByStatus("source_backed"),
  needs_source_review: countByStatus("needs_source_review"),
  placeholder: countByStatus("placeholder")
};

const basisForDecision = [
  "80 source-backed threshold reached",
  "Evidence ledger operational",
  "Review decision ledger operational",
  "State audit passed",
  "Governance page completed",
  "Release candidate page completed",
  "Contamination check passed after stale DRO reference remediation",
  "Internal v1 QA completed",
  "Final copy QA completed",
  "No release blockers found",
  "No ledger changes during QA/remediation",
  "Build and static export passing"
];

const acceptedLimits = [
  "20 needs-review records remain",
  "1 placeholder remains",
  "Evidence archival/provenance depth remains future hardening",
  "Older historical review pages may still have minor polish issues",
  "No live monitoring",
  "No automation",
  "No map, globe, timeline, or graph layers",
  "No Signals Infrastructure generalization claim",
  "No DRO inclusion",
  "No LiO integration",
  "No PPCL/cognitive persistence content",
  "No cognitive telemetry fork inclusion"
];

const notApprovedFor = [
  "Public launch announcement",
  "Monetization launch",
  "Paid services page",
  "External claims of completeness",
  "Automated review",
  "Live monitoring",
  "Universal infrastructure claim",
  "Expansion into DRO, LiO, PPCL, or cognitive telemetry"
];

const publicLaunchRequirements = [
  "Final human review of the exported static site",
  "Deployment target decision",
  "Domain / hosting decision",
  "Optional archival/provenance hardening decision",
  "Final README or launch note if public release is chosen"
];

const nextOptions = [
  {
    label: "A",
    title: "Prepare deployment/public launch checklist"
  },
  {
    label: "B",
    title: "Harden evidence archival/provenance before public launch"
  },
  {
    label: "C",
    title: "Continue verification toward 90 before public launch"
  },
  {
    label: "D",
    title: "Create separate business/custom-briefs thread after public release decision"
  }
];

export default function AnoV1FinalReleaseDecisionPage() {
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
                href="/ano-v1-internal-qa"
                className="text-[#8fb7cf] hover:text-white"
              >
                Internal QA
              </Link>
              <Link
                href="/ano-governance"
                className="text-[#8fb7cf] hover:text-white"
              >
                Governance
              </Link>
              <Link
                href="/ano-80-status-lock"
                className="text-[#8fb7cf] hover:text-white"
              >
                80 Status Lock
              </Link>
              <Link
                href="/ano-v1-public-launch-checklist"
                className="text-[#8fb7cf] hover:text-white"
              >
                Launch Checklist
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              v1.0 final release decision
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              ANO is approved for internal v1.0 release.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This decision moves AI Native Observatory from v1.0 release
              candidate to internal v1.0 release approved. It does not complete
              public launch, publish externally, or authorize claims beyond the
              current bounded AI ecosystem registry.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Current ANO State
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
          <Panel title="Final Release Decision" eyebrow="Decision">
            <div className="rounded border border-[#7ba36f]/45 bg-[#7ba36f]/10 px-3 py-2 text-sm font-semibold text-[#d8f2d2]">
              Approved for internal v1.0 release
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              This approval means ANO may be treated as an internal v1.0 release
              of the static, evidence-backed AI ecosystem observatory. It does
              not mean public launch is complete.
            </p>
          </Panel>

          <Panel title="Public Launch Still Requires" eyebrow="Not launched">
            <ChecklistGrid items={publicLaunchRequirements} />
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Basis for Decision"
            title="Why internal v1.0 release is approved"
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {basisForDecision.map((item) => (
              <ChecklistItem key={item} label={item} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Known Limits Accepted for v1.0" eyebrow="Accepted limits">
            <ChecklistGrid items={acceptedLimits} muted />
          </Panel>

          <Panel title="Not Approved For" eyebrow="Decision boundary">
            <ChecklistGrid items={notApprovedFor} muted />
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Next Options"
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

function ChecklistGrid({
  items,
  muted = false
}: {
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="grid gap-3">
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
    <div
      className={`rounded border px-3 py-2 text-sm ${
        muted
          ? "border-white/10 bg-[#03050d] text-slate-400"
          : "border-[#8fb7cf]/20 bg-[#03050d] text-slate-300"
      }`}
    >
      {label}
    </div>
  );
}

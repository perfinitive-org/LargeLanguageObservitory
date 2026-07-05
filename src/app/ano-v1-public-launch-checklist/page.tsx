import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import { evidenceRecords, observables, reviewDecisions } from "@/lib/data";
import type { Observable } from "@/lib/types";

export const metadata: Metadata = {
  title: "ANO v1.0 Public Launch Checklist | AI Native Observatory",
  description:
    "Deployment and public launch readiness checklist for the AI Native Observatory v1.0."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;
type RiskSeverity = "Launch Blocker" | "Important" | "Minor" | "Future";

const statusCounts = {
  total: observables.length,
  source_backed: countByStatus("source_backed"),
  needs_source_review: countByStatus("needs_source_review"),
  placeholder: countByStatus("placeholder")
};

const deploymentOptions = [
  {
    label: "A",
    name: "GitHub Pages",
    suitability: "Good fit for static export and transparent project hosting.",
    cost: "Free or very low cost for public static hosting.",
    lockIn: "Low; static files and repository history remain portable.",
    compatibility: "Compatible with exported static files.",
    recommendation: "Recommended"
  },
  {
    label: "B",
    name: "Cloudflare Pages",
    suitability: "Strong fit for static export, CDN delivery, and custom domains.",
    cost: "Free or low cost for typical static-site use.",
    lockIn: "Low to moderate; deployment configuration is portable but platform-specific.",
    compatibility: "Compatible with exported static files.",
    recommendation: "Recommended"
  },
  {
    label: "C",
    name: "Netlify",
    suitability: "Good fit for static export and simple deploy previews.",
    cost: "Free or low cost at small scale.",
    lockIn: "Moderate; convenient platform features may become workflow-specific.",
    compatibility: "Compatible with exported static files.",
    recommendation: "Acceptable"
  },
  {
    label: "D",
    name: "Vercel static hosting",
    suitability: "Good fit for Next.js projects, including static routes.",
    cost: "Free or low cost depending on project/account use.",
    lockIn: "Moderate; optimized for Next.js workflows.",
    compatibility: "Compatible with the current Next.js build/export posture.",
    recommendation: "Acceptable"
  },
  {
    label: "E",
    name: "Self-owned static hosting",
    suitability: "Viable if direct infrastructure control is more important than convenience.",
    cost: "Variable; depends on storage, CDN, and maintenance choices.",
    lockIn: "Low platform lock-in, higher operational responsibility.",
    compatibility: "Compatible if the host serves static files correctly.",
    recommendation: "Not recommended for first public launch unless operations are already prepared"
  }
];

const preLaunchChecklist = [
  "Final manual click-through of exported /out",
  "Confirm homepage clarity",
  "Confirm About page clarity",
  "Confirm governance page clarity",
  "Confirm release-decision page exists",
  "Confirm no public page implies completeness",
  "Confirm parked projects remain excluded",
  "Confirm source-backed meaning is clear",
  "Confirm needs-review and placeholder meanings are clear",
  "Confirm no stale DRO next-action language",
  "Confirm no PPCL/cognitive persistence contamination",
  "Confirm final build/export passes",
  "Confirm repository branch/tag strategy",
  "Confirm public README or launch note"
];

const riskRows: Array<{
  risk: string;
  severity: RiskSeverity;
  mitigation: string;
}> = [
  {
    risk: "Historical review pages may still look internal.",
    severity: "Minor",
    mitigation:
      "Keep them framed as historical review-process artifacts and avoid promoting them as primary launch pages."
  },
  {
    risk: "Evidence archival/provenance depth is not yet hardened.",
    severity: "Important",
    mitigation:
      "Decide whether archival hardening is required before public launch or accepted as post-launch hardening."
  },
  {
    risk: "No global navigation system.",
    severity: "Minor",
    mitigation:
      "Use current page-level links for launch; consider shared navigation as a later usability cleanup."
  },
  {
    risk: "20 needs-review records and 1 placeholder remain.",
    severity: "Important",
    mitigation:
      "Make the limits visible and keep verification-status labels clear across the site."
  },
  {
    risk: "Public readers may misunderstand source-backed as complete truth if they skip governance pages.",
    severity: "Important",
    mitigation:
      "Keep source-backed caveats visible on governance, release, checklist, and status pages."
  }
];

const acceptedLimits = [
  "20 needs-review records remain",
  "1 placeholder remains",
  "No live monitoring",
  "No automation",
  "No external completeness claim",
  "No Signals Infrastructure proof",
  "No DRO",
  "No LiO",
  "No PPCL",
  "No cognitive telemetry",
  "Evidence archival depth remains future hardening"
];

const launchPathOptions = [
  {
    label: "A",
    title: "Launch now as v1.0 public beta / public registry v1.0 with accepted limits.",
    detail:
      "Recommended default only if the documented limits are accepted and one final human click-through of the exported site is completed."
  },
  {
    label: "B",
    title: "Delay launch for evidence archival/provenance hardening.",
    detail:
      "Best if public credibility depends on stronger evidence snapshots before launch."
  },
  {
    label: "C",
    title: "Delay launch until 90 source-backed records.",
    detail:
      "Best if coverage growth is more important than launching the current governed static registry."
  }
];

const doNotAnnounceAs = [
  "Complete AI map",
  "Live AI monitor",
  "AI truth engine",
  "Risk-rating product",
  "Universal trust infrastructure",
  "Signals Infrastructure proof",
  "Automated AI governance platform",
  "Compliance system"
];

const safePublicDescription =
  "AI Native Observatory is a static, evidence-backed registry of selected AI ecosystem entities. It separates observables, sources, evidence, review decisions, and verification status so public claims can be inspected instead of simply trusted.";

export default function AnoV1PublicLaunchChecklistPage() {
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
                href="/ano-v1-final-release-decision"
                className="text-[#8fb7cf] hover:text-white"
              >
                Final Decision
              </Link>
              <Link
                href="/ano-v1-release-candidate"
                className="text-[#8fb7cf] hover:text-white"
              >
                v1.0 RC
              </Link>
              <Link
                href="/ano-governance"
                className="text-[#8fb7cf] hover:text-white"
              >
                Governance
              </Link>
              <Link
                href="/mvp-status"
                className="text-[#8fb7cf] hover:text-white"
              >
                MVP Status
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              v1.0 public launch checklist
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Public launch is not yet executed.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              ANO is internally approved for v1.0 and awaits a deployment
              choice. This checklist supports a launch decision; it does not
              publish, deploy, announce, or expand the Observatory.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#d8b35f] bg-[#07111c]/82 p-5">
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
          <Panel title="Launch Decision Status" eyebrow="Not launched">
            <div className="rounded border border-[#d8b35f]/45 bg-[#d8b35f]/10 px-3 py-2 text-sm font-semibold text-[#ffe8a6]">
              Public launch not yet executed.
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              ANO is approved internally for v1.0, but deployment target,
              domain/hosting, and final public launch choice remain open.
            </p>
          </Panel>

          <Panel title="Safe Public Description" eyebrow="Launch-safe copy">
            <p className="text-sm leading-6 text-slate-300">
              {safePublicDescription}
            </p>
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Deployment Options"
            title="Static hosting choices"
          />
          <div className="mt-4 grid gap-3 xl:grid-cols-5">
            {deploymentOptions.map((option) => (
              <DeploymentCard key={option.label} option={option} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Panel title="Pre-Launch Checklist" eyebrow="Manual checks">
            <ChecklistGrid items={preLaunchChecklist} />
          </Panel>

          <Panel title="Accepted v1.0 Limits" eyebrow="Launch boundary">
            <ChecklistGrid items={acceptedLimits} muted />
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Launch Risk Register"
            title="Known launch risks"
          />
          <div className="mt-4 grid gap-3">
            {riskRows.map((row) => (
              <RiskCard key={row.risk} row={row} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Recommended Launch Path" eyebrow="Options">
            <div className="grid gap-3">
              {launchPathOptions.map((option) => (
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
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {option.detail}
                  </p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Do Not Announce As" eyebrow="Overclaim guardrails">
            <ChecklistGrid items={doNotAnnounceAs} muted />
          </Panel>
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

function DeploymentCard({
  option
}: {
  option: (typeof deploymentOptions)[number];
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#03050d] p-4">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
        Option {option.label}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-white">{option.name}</h3>
      <div className="mt-4 grid gap-3 text-sm">
        <InfoLine label="Suitability" value={option.suitability} />
        <InfoLine label="Cost posture" value={option.cost} />
        <InfoLine label="Lock-in risk" value={option.lockIn} />
        <InfoLine label="Static export" value={option.compatibility} />
        <InfoLine label="Recommendation" value={option.recommendation} />
      </div>
    </article>
  );
}

function RiskCard({
  row
}: {
  row: {
    risk: string;
    severity: RiskSeverity;
    mitigation: string;
  };
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#03050d] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-white">{row.risk}</h3>
        <span className={riskClass(row.severity)}>{row.severity}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        {row.mitigation}
      </p>
    </article>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 leading-6 text-slate-300">{value}</p>
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
        <div
          key={item}
          className={`rounded border px-3 py-2 text-sm ${
            muted
              ? "border-white/10 bg-[#03050d] text-slate-400"
              : "border-[#8fb7cf]/20 bg-[#03050d] text-slate-300"
          }`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function riskClass(severity: RiskSeverity) {
  const base =
    "rounded border px-2 py-1 text-xs font-semibold uppercase tracking-wide";

  if (severity === "Launch Blocker") {
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

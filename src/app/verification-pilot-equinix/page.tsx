import type { Metadata } from "next";
import Link from "next/link";
import { TypeBadge } from "@/components/TypeBadge";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  getEvidenceRecordById,
  getObservableById,
  reviewDecisions
} from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";
import type { EvidenceRecord } from "@/lib/types";

export const metadata: Metadata = {
  title: "Equinix Verification Pilot | AI Native Observatory",
  description:
    "Evidence package documenting the second source-backed verification transition."
};

const observable = getObservableById("org-equinix");
const pilotDecision = reviewDecisions.find(
  (decision) => decision.id === "verification-pilot-equinix-source-backed"
);

const officialEvidence = getEvidenceRecordById(
  "evidence-equinix-official-about"
);
const independentEvidence = getEvidenceRecordById(
  "evidence-equinix-investopedia-ai-demand"
);

const requiredEvidence = [
  "Official company identity source",
  "Independent infrastructure or company profile",
  "Infrastructure relationship reasonableness review",
  "Conservative description review"
];

const verificationFindings = [
  "Organization exists",
  "Infrastructure relationships appear reasonable",
  "Official source identified",
  "Independent source identified",
  "Description appears reasonable"
];

export default function VerificationPilotEquinixPage() {
  if (!observable) {
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
                href="/review-queue"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Queue
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
                href="/method/source-evidence-model"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source/Evidence Model
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Second verified record pilot
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Equinix evidence package.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This page documents the second bounded transition from
              needs-source-review to source-backed status. It tests the same
              review pipeline on an infrastructure-linked organization record.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Record summary
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <TypeBadge type={observable.type} variant="dark" />
              <VerificationBadge status={observable.verification_status} />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              {observable.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              {observable.summary}
            </p>
            <Link
              href={registryObservableHref(observable)}
              className="mt-5 inline-flex rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-sm font-semibold text-[#d8edf8] hover:bg-[#8fb7cf]/15"
            >
              Open registry dossier
            </Link>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Required evidence
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Evidence requirements
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {requiredEvidence.map((item) => (
                <ChecklistItem key={item} label={item} checked />
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Verification outcome
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Source-backed pilot decision
            </h2>
            {pilotDecision ? (
              <dl className="mt-5 grid gap-3 text-sm">
                <DecisionMeta label="Decision" value={pilotDecision.decision} />
                <DecisionMeta label="Reviewer" value={pilotDecision.reviewer} />
                <DecisionMeta
                  label="Review date"
                  value={pilotDecision.reviewDate}
                />
                <DecisionMeta label="Reason" value={pilotDecision.reason} />
              </dl>
            ) : null}
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <div className="border-b border-white/10 pb-3">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Evidence records
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Sources used
            </h2>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {officialEvidence ? (
              <EvidenceSourceCard
                label="Official source"
                source={officialEvidence}
              />
            ) : null}
            {independentEvidence ? (
              <EvidenceSourceCard
                label="Independent source"
                source={independentEvidence}
              />
            ) : null}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Review findings
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Pilot review summary
            </h2>
            <ul className="mt-5 grid gap-3">
              {verificationFindings.map((finding) => (
                <ChecklistItem key={finding} label={finding} checked />
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Review notes
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Conservative finding
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The official Equinix source supports the existence, identity, and
              digital infrastructure positioning of Equinix. The independent
              Investopedia source provides external infrastructure-oriented
              coverage connecting Equinix to data center and AI-demand context.
              The registry description remains intentionally narrow, and
              existing infrastructure relationships are treated as reasonable
              without adding capacity, tenancy, power, or facility-specific
              claims.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function EvidenceSourceCard({
  label,
  source
}: {
  label: string;
  source: EvidenceRecord;
}) {
  return (
    <article className="rounded-lg border border-l-4 border-white/10 border-l-[#8fb7cf] bg-[#03050d] p-4">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">{label}</p>
      <h3 className="mt-3 text-xl font-semibold text-white">
        <Link href={`/evidence/${source.id}`} className="hover:text-[#d8edf8]">
          {source.title}
        </Link>
      </h3>
      <dl className="mt-4 grid gap-3 text-sm">
        <DecisionMeta label="Publisher" value={source.publisher} />
        <DecisionMeta label="URL" value={source.url} />
        <DecisionMeta label="Source type" value={source.sourceType} />
        <DecisionMeta label="Supports record because" value={source.notes} />
      </dl>
      <Link
        href={`/evidence/${source.id}`}
        className="mt-4 inline-flex rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-sm font-semibold text-[#d8edf8] hover:bg-[#8fb7cf]/15"
      >
        Open evidence dossier
      </Link>
    </article>
  );
}

function DecisionMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-[#03050d] px-3 py-2">
      <dt className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-slate-300">{value}</dd>
    </div>
  );
}

function ChecklistItem({
  label,
  checked = false
}: {
  label: string;
  checked?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 rounded-md border border-white/10 bg-[#03050d] px-3 py-3 text-sm text-slate-300">
      <span
        aria-hidden="true"
        className={`font-semibold ${checked ? "text-[#b8d8b1]" : "text-slate-500"}`}
      >
        {checked ? "\u2713" : "\u25a1"}
      </span>
      {label}
    </li>
  );
}

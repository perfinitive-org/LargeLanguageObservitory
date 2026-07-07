import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Method | AI Native Observatory",
  description:
    "Method and data model for the evidence-backed AI infrastructure observatory MVP."
};

export default function AboutPage() {
  return (
    <div className="bg-[#03050d] text-white">
      <section className="relative overflow-hidden border-b border-[#182033]">
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
        <div className="relative mx-auto grid max-w-5xl gap-8 px-5 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Observatory Handbook
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              A source-backed AI infrastructure observatory registry
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              AI Native Observatory is an MVP for tracking public, observable
              parts of the AI infrastructure ecosystem: organizations, models,
              data centers, and sources. It avoids hype language and treats the
              registry as an evidence ledger.
            </p>
          </div>

          <div className="self-start rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-slate-400">
              About and method
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Method notes for how records enter the observatory, how evidence is
              represented, and where the static MVP stops.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/registry"
                className="inline-flex rounded-md bg-[#8fb7cf] px-4 py-2 text-sm font-semibold text-[#07111c] transition hover:bg-white"
              >
                Browse registry
              </Link>
              <Link
                href="/review-queue"
                className="inline-flex rounded-md border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-[#8fb7cf]/70 hover:bg-white/10"
              >
                Review queue
              </Link>
              <Link
                href="/review-decisions"
                className="inline-flex rounded-md border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-[#8fb7cf]/70 hover:bg-white/10"
              >
                Review decisions
              </Link>
              <Link
                href="/review-metrics"
                className="inline-flex rounded-md border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-[#8fb7cf]/70 hover:bg-white/10"
              >
                Review metrics
              </Link>
              <Link
                href="/mvp-status"
                className="inline-flex rounded-md border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-[#8fb7cf]/70 hover:bg-white/10"
              >
                MVP status
              </Link>
              <Link
                href="/ano-governance"
                className="inline-flex rounded-md border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-[#8fb7cf]/70 hover:bg-white/10"
              >
                ANO governance
              </Link>
              <Link
                href="/method/source-evidence-model"
                className="inline-flex rounded-md border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-[#8fb7cf]/70 hover:bg-white/10"
              >
                Source/evidence model
              </Link>
              <Link
                href="/method/evidence-manifold"
                className="inline-flex rounded-md border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-[#8fb7cf]/70 hover:bg-white/10"
              >
                Evidence manifold
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <HandbookCard title="Data model">
            Observables are canonical records. Sources are documents or
            datasets. Observations are atomic claims backed by one source.
            Relationships connect observables and carry their own source
            references.
          </HandbookCard>
          <HandbookCard title="Current scope">
            This version uses static JSON files and manually reviewed data. Some
            records remain placeholders or need source review so the public
            registry can distinguish supported claims from unfinished records.
          </HandbookCard>
          <HandbookCard title="Inclusion criteria">
            A record belongs in the registry when it can be identified,
            described, linked to sources, and related to other ecosystem
            observables without relying on private claims.
          </HandbookCard>
          <HandbookCard title="Source quality note">
            Source backed means the limited record claim is supported by cited
            evidence; it does not mean complete truth. Needs source review means
            the record is included but still requires review. Placeholder means
            the record should not be treated as verified.
          </HandbookCard>
          <HandbookCard title="Review queue">
            The review queue is a static maintenance view for improving data
            quality. It collects needs-review and placeholder records so review
            work can focus on trust before expanding scope.
          </HandbookCard>
          <HandbookCard title="Human review workflow">
            Records become source backed through human review, not automated
            scoring. Reviewers inspect sources, relationships, tags, and
            descriptions before changing a record status in JSON.
          </HandbookCard>
          <HandbookCard title="Review decision ledger">
            Review status changes must be supported by documented review
            decisions. The static decision ledger preserves who reviewed a
            record, when it was reviewed, and why the status should change.
          </HandbookCard>
          <HandbookCard title="Review metrics">
            Operational metrics summarize review coverage, evidence coverage,
            and review throughput using existing JSON records only.
            <span className="mt-3 block">
              <Link
                href="/review-metrics"
                className="font-semibold text-[#8fb7cf] hover:text-white"
              >
                Open review metrics
              </Link>
            </span>
          </HandbookCard>
          <HandbookCard title="MVP status">
            The MVP status page is the current checkpoint for what exists, what
            is trusted, what remains incomplete, and what should happen next.
            <span className="mt-3 block">
              <Link
                href="/mvp-status"
                className="font-semibold text-[#8fb7cf] hover:text-white"
              >
                Open MVP status
              </Link>
            </span>
          </HandbookCard>
          <HandbookCard title="Public governance">
            The governance page explains how records should be read, what
            source-backed status means, and where the Observatory boundaries
            are intentionally drawn.
            <span className="mt-3 block">
              <Link
                href="/ano-governance"
                className="font-semibold text-[#8fb7cf] hover:text-white"
              >
                Open ANO governance
              </Link>
            </span>
          </HandbookCard>
          <HandbookCard title="Source/evidence boundary">
            Sources are cataloged origins or publishers. Evidence records are
            specific artifacts used to support observations, review decisions,
            and verification outcomes.
            <span className="mt-3 block">
              <Link
                href="/method/source-evidence-model"
                className="font-semibold text-[#8fb7cf] hover:text-white"
              >
                Open the source/evidence model
              </Link>
            </span>
          </HandbookCard>
          <HandbookCard title="Evidence manifold">
            The evidence manifold documents the broader domain-agnostic
            architecture behind LLO: source inputs, evidence normalization,
            domain plugins, human review, and buyer-side outputs.
            <span className="mt-3 block">
              <Link
                href="/method/evidence-manifold"
                className="font-semibold text-[#8fb7cf] hover:text-white"
              >
                Open the evidence manifold
              </Link>
            </span>
          </HandbookCard>
          <HandbookCard title="Future work">
            A later version can add ingestion workflows, source snapshots,
            confidence review, data export, entity reconciliation, and a
            database without changing the public route model.
          </HandbookCard>
        </div>

        <section className="mt-10 rounded-lg border border-white/15 bg-[#07111c] p-6">
          <h2 className="text-xl font-semibold text-white">MVP files</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The registry is powered by{" "}
            <CodeLabel>data/observables.json</CodeLabel>,{" "}
            <CodeLabel>data/sources.json</CodeLabel>,{" "}
            <CodeLabel>data/observations.json</CodeLabel>, and{" "}
            <CodeLabel>data/relationships.json</CodeLabel>.
          </p>
          <Link
            href="/registry"
            className="mt-5 inline-flex rounded-md bg-[#8fb7cf] px-4 py-2 text-sm font-semibold text-[#07111c] transition hover:bg-white"
          >
            Browse registry
          </Link>
        </section>
      </section>
    </div>
  );
}

function HandbookCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/15 bg-white/[0.055] p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{children}</p>
    </section>
  );
}

function CodeLabel({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-white/10 bg-[#03050d] px-1.5 py-0.5 text-slate-100">
      {children}
    </code>
  );
}

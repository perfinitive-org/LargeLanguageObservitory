import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evidence Manifold | AI Native Observatory",
  description:
    "A domain-agnostic source-connection and evidence-normalization architecture behind LLO."
};

const architectureLayers = [
  {
    title: "Connector layer",
    description:
      "Catalogs source inputs such as official documentation, filings, model cards, technical reports, public datasets, feeds, manual uploads, and archived URLs."
  },
  {
    title: "Normalization layer",
    description:
      "Converts source material into structured source records, parsed claims, entity references, relation candidates, evidence items, and unresolved questions."
  },
  {
    title: "Canonical evidence schema",
    description:
      "Defines the stable objects shared across domains: source, claim, observable, relation, evidence item, confidence, status, timestamp, review decision, and unresolved question."
  },
  {
    title: "Domain plugin layer",
    description:
      "Adds domain vocabulary, source categories, entity types, relation types, review rules, confidence heuristics, and output labels without changing the canonical schema."
  },
  {
    title: "Review queue",
    description:
      "Routes evidence items and relationship candidates into human review so source-backed findings are separated from needs-review, unresolved, placeholder, or out-of-scope items."
  },
  {
    title: "Human review",
    description:
      "Documents review decisions, caveats, missing information, recommended sources, and limits before public dossiers or buyer-facing reports are delivered."
  },
  {
    title: "Output layer",
    description:
      "Packages reviewed evidence into records, dossiers, sample briefs, buyer memos, custom evidence briefs, digests, reports, future exports, and future APIs."
  }
];

const sourceTypes = [
  "APIs",
  "RSS/news feeds",
  "government data sites",
  "corporate documentation",
  "public filings",
  "technical reports",
  "model cards",
  "press releases",
  "manual uploads",
  "archived URLs"
];

const canonicalObjects = [
  "source",
  "claim",
  "entity / observable",
  "relation",
  "evidence item",
  "confidence",
  "status",
  "timestamp",
  "review decision",
  "unresolved question"
];

const pluginFields = [
  "domain title",
  "source categories",
  "vocabulary",
  "entity types",
  "relation types",
  "review rules",
  "confidence heuristics",
  "output labels"
];

const domainTitleFlow = [
  "Enter a domain title.",
  "Load or create the domain plugin.",
  "Activate source categories.",
  "Define entity and relation types.",
  "Apply review rules.",
  "Start ingestion or manual source entry.",
  "Route evidence to review.",
  "Publish reviewed outputs."
];

const normalizationFlow = [
  "Raw source",
  "parsed claim",
  "source record",
  "entity / observable",
  "relation",
  "evidence item",
  "review queue",
  "review decision",
  "unresolved question or source-backed record",
  "output product"
];

const outputs = [
  "evidence records",
  "review decisions",
  "anchor dossiers",
  "sample briefs",
  "buyer memos",
  "custom evidence briefs",
  "comparison matrices",
  "procurement question packs",
  "monthly digests",
  "quarterly reviews",
  "annual reports",
  "future exports",
  "future APIs"
];

const productPath = [
  "public evidence layer",
  "sample proof-of-work",
  "custom reports",
  "recurring digests",
  "future data exports or API access"
];

const implementationStatus = [
  {
    title: "Implemented and working",
    description:
      "The repository includes entity and observable records, source records, relationship records, review-oriented status fields, and public pages for registry, evidence, and review-decision material."
  },
  {
    title: "Implemented, but not exactly as proposed",
    description:
      "The current schema supports many canonical evidence functions, but it is not a one-to-one implementation of the proposed source / claim / entity / relation / evidence item / confidence / status / timestamp / review decision / unresolved question model."
  },
  {
    title: "Planned but not built",
    description:
      "The domain-title interface, dynamic plugin generation, live source connector orchestration, scheduled ingestion, parser pipeline, deduplication engine, and operator review dashboard are not implemented."
  },
  {
    title: "Explicitly not present",
    description:
      "There is no live connector layer, no automated source ingestion, no automated status-upgrade system, and no claim that placeholder or illustrative preview content is ingestion-backed evidence."
  }
];

export default function EvidenceManifoldPage() {
  return (
    <div className="bg-[#03050d] text-white">
      <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d]">
        <FieldTexture />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <nav className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/" className="text-[#8fb7cf] hover:text-white">
                Home
              </Link>
              <Link href="/about" className="text-[#8fb7cf] hover:text-white">
                Method
              </Link>
              <Link
                href="/method/source-evidence-model"
                className="text-[#8fb7cf] hover:text-white"
              >
                Source/Evidence Model
              </Link>
              <Link href="/transparency" className="text-[#8fb7cf] hover:text-white">
                Transparency
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Method architecture
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              Evidence Manifold
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              A domain-agnostic source-connection and evidence-normalization
              architecture behind LLO.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Current boundary
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              LLO is Domain Instance 001.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The current site focuses on AI / LLM infrastructure. The broader
              manifold is a roadmap for reusing the same evidence engine across
              other domains without rebuilding the core system.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="What This Is" eyebrow="Definition">
            <p className="text-sm leading-6 text-slate-300">
              The evidence manifold is the architecture behind LLO&apos;s
              source-backed records. It connects many public source types,
              normalizes them into a canonical evidence schema, applies
              domain-specific review rules through plugins, and produces
              human-reviewed outputs such as evidence records, dossiers,
              briefs, feeds, and exports.
            </p>
          </Panel>

          <Panel title="What This Is Not" eyebrow="Boundary">
            <p className="text-sm leading-6 text-slate-300">
              This is not a generic data lake, search engine, scraper, ranking
              system, certification system, or opinion platform.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              The manifold does not sell verification status, source-backed
              status, badges, certification, legal advice, vendor approval, or
              rankings.
            </p>
          </Panel>
        </section>

        <Panel title="Why It Matters" eyebrow="Public proof chain">
          <p className="text-sm leading-6 text-slate-300">
            Most data systems either collect raw information without review or
            publish conclusions without showing the evidence chain. LLO&apos;s
            model is different: public sources are converted into traceable
            evidence records, review decisions, unresolved questions, and
            buyer-facing decision artifacts.
          </p>
        </Panel>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Core architecture
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Connector layer to output layer
          </h2>
          <Flow labels={architectureLayers.map((layer) => layer.title)} />
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {architectureLayers.map((layer) => (
              <article
                key={layer.title}
                className="rounded border border-white/10 bg-[#03050d] p-4"
              >
                <h3 className="text-base font-semibold text-white">
                  {layer.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {layer.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Connector Layer" eyebrow="Source inputs">
            <ul className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
              {sourceTypes.map((sourceType) => (
                <li
                  key={sourceType}
                  className="rounded border border-white/10 bg-[#03050d] p-3"
                >
                  {sourceType}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Current LLO is still primarily static and manually reviewed. Live
              automated connectors are a future capability, not a current
              claim.
            </p>
          </Panel>

          <Panel title="Canonical Evidence Schema" eyebrow="Locked core">
            <ul className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
              {canonicalObjects.map((object) => (
                <li
                  key={object}
                  className="rounded border border-white/10 bg-[#03050d] p-3"
                >
                  {object}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Plugins can extend meaning, but they cannot alter the canonical
              schema.
            </p>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <Panel title="Plugin Model" eyebrow="Domain instances">
            <p className="text-sm leading-6 text-slate-300">
              Each domain is treated as a plugin. The core system remains
              subject-matter agnostic. A plugin defines domain title, source
              categories, vocabulary, entity types, relation types, review
              rules, confidence heuristics, and output labels.
            </p>
            <div className="mt-4 rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 p-4 text-sm font-semibold text-[#d8edf8]">
              Domain Instance 001: AI / LLM infrastructure
            </div>
          </Panel>

          <Panel title="Plugin Fields" eyebrow="Stub contract">
            <ul className="grid gap-2 text-sm text-slate-300">
              {pluginFields.map((field) => (
                <li key={field} className="rounded border border-white/10 bg-[#03050d] p-3">
                  {field}
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Domain-Title Flow" eyebrow="Future operator flow">
            <NumberedList items={domainTitleFlow} />
          </Panel>
          <Panel title="Evidence Normalization Flow" eyebrow="Claim path">
            <Flow labels={normalizationFlow} />
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel title="Trust / Review Layer" eyebrow="Human review">
            <p className="text-sm leading-6 text-slate-300">
              The review layer separates what is source-backed from what
              remains unresolved, needs review, out of scope, or placeholder.
              Human review remains part of the workflow before buyer-facing
              reports, public dossiers, or recurring digests are delivered or
              published.
            </p>
          </Panel>

          <Panel title="Output Layer" eyebrow="Reviewed outputs">
            <ul className="grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
              {outputs.map((output) => (
                <li key={output} className="rounded border border-white/10 bg-[#03050d] p-3">
                  {output}
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Monetization logic
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Public proof-of-work becomes buyer-side products.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            The evidence manifold supports monetization by turning public
            proof-of-work into buyer-side products. Clients do not buy
            verification. They buy domain-specific evidence normalization,
            review, monitoring, and decision-ready reporting.
          </p>
          <Flow labels={productPath} />
        </section>

        <section className="rounded-lg border border-l-4 border-white/15 border-l-[#d39b50] bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Current implementation status
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Working pieces exist, but the full manifold is not built yet.
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-300">
            The current system contains working pieces of the proposed
            architecture, but the full connector-driven, dynamically
            instantiated evidence manifold is not yet built.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {implementationStatus.map((status) => (
              <article
                key={status.title}
                className="rounded border border-white/10 bg-[#03050d] p-4"
              >
                <h3 className="text-base font-semibold text-white">
                  {status.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {status.description}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded border border-[#d39b50]/35 bg-[#d39b50]/10 p-4 text-sm leading-6 text-[#f0d9ad]">
            Schema and plugin-like behavior are implemented in the current
            repository, but not in the exact future form proposed here.
            Connector orchestration, dynamic plugin generation, and the
            proposed review/status model are not built as written.
          </div>
        </section>

        <Panel title="Current Boundary" eyebrow="Roadmap status">
          <p className="text-sm leading-6 text-slate-300">
            LLO is the first working domain instance of the future evidence
            manifold. The current site focuses on AI / LLM infrastructure. The
            broader manifold architecture is a roadmap for reusing the same
            evidence engine across other domains without rebuilding the core
            system.
          </p>
        </Panel>
      </main>
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
      <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="grid gap-3 text-sm text-slate-300">
      {items.map((item, index) => (
        <li
          key={item}
          className="grid grid-cols-[32px_1fr] gap-3 rounded border border-white/10 bg-[#03050d] p-3"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 text-xs font-semibold text-[#d8edf8]">
            {index + 1}
          </span>
          <span className="pt-1">{item}</span>
        </li>
      ))}
    </ol>
  );
}

function Flow({ labels }: { labels: string[] }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-300">
      {labels.map((label, index) => (
        <span key={label} className="flex items-center gap-2">
          <span className="rounded border border-white/10 bg-[#03050d] px-3 py-2">
            {label}
          </span>
          {index < labels.length - 1 ? (
            <span className="text-[#8fb7cf]">-&gt;</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

function FieldTexture() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-35"
      style={{
        backgroundImage:
          "linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)",
        backgroundSize: "56px 56px"
      }}
    />
  );
}

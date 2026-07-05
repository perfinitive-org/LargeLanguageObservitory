import Link from "next/link";
import {
  getObservableById,
  getRegistryStats,
  getSourceById,
  observations,
  observables
} from "@/lib/data";
import { formatDate } from "@/lib/format";
import { observableHref } from "@/lib/routes";
import type { Observable, ObservableType } from "@/lib/types";
import { observableTypes } from "@/lib/types";
import { TypeAccentRule, TypeBadge } from "@/components/TypeBadge";
import {
  VerificationBadge,
  verificationAccentClass
} from "@/components/VerificationBadge";

const ecosystemSeedIds: Record<ObservableType, string[]> = {
  Organization: [
    "org-openai",
    "org-anthropic",
    "org-google-deepmind",
    "org-meta-ai",
    "org-microsoft",
    "org-nvidia",
    "org-xai",
    "org-mistral-ai"
  ],
  Model: [
    "model-gpt-4o",
    "model-o3",
    "model-claude-3-5-sonnet",
    "model-gemini-1-5-pro",
    "model-llama-3-1-405b",
    "model-grok-2",
    "model-mistral-large",
    "model-command-r-plus"
  ],
  "Data Center": [
    "dc-stargate-abilene",
    "dc-microsoft-wisconsin",
    "dc-google-council-bluffs",
    "dc-meta-eagle-mountain",
    "dc-coreweave-lancaster",
    "dc-xai-memphis",
    "dc-google-tpu-cloud",
    "dc-nvidia-dgx-cloud"
  ],
  Source: [
    "source-openai-gpt4o-release",
    "source-openai-o3-system-card",
    "source-anthropic-claude-sonnet-release",
    "source-google-gemini-1-5-pro-announcement",
    "source-meta-llama-3-1-release",
    "source-microsoft-wisconsin-campus",
    "source-eia-data-center-electricity",
    "source-nvidia-h100-product-brief"
  ]
};

const lensCards: Array<{
  type: ObservableType;
  chapter: string;
  title: string;
  label: string;
  description: string;
  href: string;
}> = [
  {
    type: "Organization",
    chapter: "Lens 01",
    title: "Explore Organizations",
    label: "Organizations tracked",
    description: "Labs, clouds, chipmakers, research groups, and AI-native companies.",
    href: "/registry?type=Organization"
  },
  {
    type: "Model",
    chapter: "Lens 02",
    title: "Explore Models",
    label: "Models tracked",
    description: "Major frontier, open-weight, and product model families in the registry.",
    href: "/registry?type=Model"
  },
  {
    type: "Data Center",
    chapter: "Lens 03",
    title: "Explore Infrastructure",
    label: "Infrastructure sites tracked",
    description: "Known AI data center campuses, cloud regions, and compute infrastructure.",
    href: `/registry?type=${encodeURIComponent("Data Center")}`
  },
  {
    type: "Source",
    chapter: "Lens 04",
    title: "Explore Sources / Evidence",
    label: "Sources cataloged",
    description: "Announcements, technical reports, filings, and evidence records.",
    href: "/registry?type=Source"
  }
];

export default function Home() {
  const stats = getRegistryStats();
  const countsByType = observableTypes.reduce(
    (counts, type) => ({
      ...counts,
      [type]: observables.filter((observable) => observable.type === type).length
    }),
    {} as Record<ObservableType, number>
  );
  const ecosystemGroups = lensCards.map((lens) => ({
    ...lens,
    count: countsByType[lens.type],
    records: getEcosystemRecords(lens.type)
  }));
  const recentObservations = observations
    .slice()
    .sort((a, b) => b.observedAt.localeCompare(a.observedAt))
    .slice(0, 5);

  return (
    <div className="bg-[#03050d] text-white">
      <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d] text-white">
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
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Public AI ecosystem observatory
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              A window into the organizations, models, infrastructure, and
              evidence shaping artificial intelligence.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Search the source-backed registry, choose a lens, and move from
              high-level ecosystem signals into the records and evidence behind
              them.
            </p>

            <form
              action="/registry"
              className="mt-8 max-w-2xl rounded-lg border border-white/15 bg-white/[0.07] p-2 shadow-[0_28px_90px_rgba(0,0,0,0.34)] sm:flex sm:items-end sm:gap-2"
            >
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="home-search"
                  className="mb-2 block px-2 text-xs font-semibold uppercase text-slate-300"
                >
                  Telescope search
                </label>
                <input
                  id="home-search"
                  name="q"
                  placeholder="Search OpenAI, Claude, Wisconsin, NVIDIA..."
                  className="min-h-12 w-full rounded-md border border-white/10 bg-[#03050d] px-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[#8fb7cf] focus:ring-4 focus:ring-[#8fb7cf]/20"
                />
              </div>
              <button
                type="submit"
                className="mt-2 min-h-12 w-full rounded-md bg-[#8fb7cf] px-5 text-sm font-semibold text-[#07111c] transition hover:bg-white sm:mt-0 sm:w-auto"
              >
                Search registry
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-300">
              <Link
                href="/registry?q=OpenAI"
                className="rounded border border-white/15 bg-white/[0.06] px-3 py-2 transition hover:border-[#8fb7cf]/70 hover:text-white"
              >
                OpenAI
              </Link>
              <Link
                href="/registry?q=Claude"
                className="rounded border border-white/15 bg-white/[0.06] px-3 py-2 transition hover:border-[#8fb7cf]/70 hover:text-white"
              >
                Claude
              </Link>
              <Link
                href="/registry?q=data%20center"
                className="rounded border border-white/15 bg-white/[0.06] px-3 py-2 transition hover:border-[#8fb7cf]/70 hover:text-white"
              >
                Data center
              </Link>
              <Link
                href="/registry?type=Source"
                className="rounded border border-white/15 bg-white/[0.06] px-3 py-2 transition hover:border-[#8fb7cf]/70 hover:text-white"
              >
                Evidence
              </Link>
            </div>
          </div>

          <div className="self-start rounded-lg border border-white/15 bg-[#07111c]/82 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.34)]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Registry aperture
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  Static JSON, source-linked records
                </p>
              </div>
              <div className="rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-right">
                <div className="text-2xl font-semibold text-[#d8edf8]">
                  {stats.observables}
                </div>
                <div className="text-[11px] uppercase text-slate-400">
                  observables
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="Organizations tracked"
                value={countsByType.Organization}
                accentType="Organization"
              />
              <MetricCard
                label="Models tracked"
                value={countsByType.Model}
                accentType="Model"
              />
              <MetricCard
                label="Infrastructure sites tracked"
                value={countsByType["Data Center"]}
                accentType="Data Center"
              />
              <MetricCard
                label="Sources cataloged"
                value={countsByType.Source}
                note={`${stats.sources} source metadata entries`}
                accentType="Source"
              />
            </div>
            <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 text-xs text-slate-400 sm:grid-cols-2">
              <span>{stats.observations} observation notes</span>
              <span>{stats.relationships} relationship links</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d] text-white">
        <FieldTexture />
        <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Choose your lens
              </p>
              <h2 className="mt-2 max-w-2xl text-2xl font-semibold text-white">
                Four ways into the same source-backed ecosystem.
              </h2>
            </div>
            <Link
              href="/registry"
              className="w-fit rounded-md bg-[#8fb7cf] px-4 py-2 text-sm font-semibold text-[#07111c] transition hover:bg-white"
            >
              View full registry
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ecosystemGroups.map((lens) => (
              <Link
                key={lens.type}
                href={lens.href}
                className="rounded-lg border border-white/15 bg-[#07111c] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-[#8fb7cf]/55 hover:bg-[#0b1725]"
              >
                <div className="flex items-start justify-between gap-3">
                  <TypeBadge type={lens.type} variant="dark" />
                  <span className="text-xs font-semibold uppercase text-slate-500">
                    {lens.chapter}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {lens.title}
                </h3>
                <TypeAccentRule type={lens.type} className="mt-3" />
                <p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-300">
                  {lens.description}
                </p>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="text-3xl font-semibold text-white">{lens.count}</div>
                  <div className="mt-1 text-sm text-slate-400">{lens.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[#182033] bg-[#03050d] text-white">
        <FieldTexture />
        <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Ecosystem field
              </p>
              <h2 className="mt-2 max-w-3xl text-2xl font-semibold">
                A compact view of the organizations, models, infrastructure,
                and evidence already visible in the registry.
              </h2>
            </div>
            <Link
              href="/registry"
              className="w-fit rounded-md bg-[#8fb7cf] px-4 py-2 text-sm font-semibold text-[#07111c] transition hover:bg-white"
            >
              Open registry
            </Link>
          </div>

          <div className="mt-6 rounded-lg border border-white/15 bg-[#07111c] p-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {ecosystemGroups.map((group) => (
                <div key={group.type} className="rounded-md border border-white/10 bg-white/[0.035] p-3">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        {group.chapter}
                      </p>
                      <h3 className="mt-1 text-sm font-semibold text-slate-100">
                        {group.type === "Data Center"
                          ? "Infrastructure"
                          : group.type}
                      </h3>
                      <TypeAccentRule type={group.type} className="mt-2" />
                    </div>
                    <span className="rounded border border-white/10 bg-[#03050d] px-2 py-1 text-xs text-slate-300">
                      {group.count}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {group.records.map((observable) => (
                      <EcosystemNode
                        key={observable.id}
                        observable={observable}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 text-xs text-slate-400 sm:grid-cols-3">
              <span>{stats.sources} cataloged source metadata records</span>
              <span>{stats.observations} source-backed observation notes</span>
              <span>{stats.relationships} relationship links in JSON</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d] text-white">
        <FieldTexture />
        <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase text-[#f0c889]">
                Observation ledger
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Recent evidence notes
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Observations are atomic claims linked to one observable and one
                source record. They are intentionally smaller than narrative
                profiles.
              </p>
            </div>
            <div className="divide-y divide-white/10 rounded-lg border border-white/15 bg-[#07111c]">
              {recentObservations.map((observation) => {
                const observable = getObservableById(observation.observableId);
                const source = getSourceById(observation.sourceId);

                return (
                  <div key={observation.id} className="p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{formatDate(observation.observedAt)}</span>
                      {observable ? (
                        <Link
                          href={observableHref(observable)}
                          className="font-semibold text-[#8fb7cf] hover:text-white"
                        >
                          {observable.name}
                        </Link>
                      ) : null}
                      {source ? (
                        <Link
                          href={`/sources/${source.slug}`}
                          className="font-semibold text-[#8fb7cf] hover:text-white"
                        >
                          {source.publisher}
                        </Link>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {observation.claim}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
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

function MetricCard({
  label,
  value,
  note,
  accentType
}: {
  label: string;
  value: number;
  note?: string;
  accentType?: ObservableType;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.045] p-4">
      <div className="text-3xl font-semibold text-white">{value}</div>
      <div className="mt-2 text-sm font-medium text-slate-300">
        {label}
      </div>
      {accentType ? <TypeAccentRule type={accentType} className="mt-3" /> : null}
      {note ? <div className="mt-1 text-xs text-slate-500">{note}</div> : null}
    </div>
  );
}

function EcosystemNode({ observable }: { observable: Observable }) {
  return (
    <Link
      href={observableHref(observable)}
      className={`group flex min-h-[52px] items-center justify-between gap-3 rounded-md border border-l-4 border-white/10 bg-[#03050d] px-3 py-2 transition hover:border-y-[#8fb7cf]/65 hover:border-r-[#8fb7cf]/65 hover:bg-[#0b1725] ${verificationAccentClass(
        observable.verification_status
      )}`}
    >
      <span className="min-w-0 text-sm font-medium leading-5 text-slate-200 group-hover:text-white">
        {observable.name}
      </span>
      <VerificationBadge status={observable.verification_status} compact />
    </Link>
  );
}

function getEcosystemRecords(type: ObservableType) {
  const preferredRecords = ecosystemSeedIds[type]
    .map(getObservableById)
    .filter((observable): observable is Observable => Boolean(observable));
  const preferredIds = new Set(preferredRecords.map((observable) => observable.id));
  const fallbackRecords = observables
    .filter(
      (observable) =>
        observable.type === type && !preferredIds.has(observable.id)
    )
    .slice(0, Math.max(0, 8 - preferredRecords.length));

  return [...preferredRecords, ...fallbackRecords].slice(0, 8);
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TagList } from "@/components/TagList";
import { TypeAccentRule, TypeBadge } from "@/components/TypeBadge";
import {
  VerificationBadge,
  verificationAccentClass,
  verificationLabel
} from "@/components/VerificationBadge";
import {
  getObservableBySlug,
  getObservablesForSource,
  getObservationsForObservable,
  getObservationsForSource,
  getRelatedObservables,
  getSourceById,
  getSourcesForObservable,
  observables
} from "@/lib/data";
import { formatDate, formatKey } from "@/lib/format";
import { registryObservableHref } from "@/lib/routes";
import type {
  Observable,
  ObservableType,
  RelatedObservable,
  Source
} from "@/lib/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return observables.map((observable) => ({ slug: observable.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const observable = getObservableBySlug(slug);

  if (!observable) {
    return {
      title: "Registry record not found | AI Native Observatory"
    };
  }

  return {
    title: `${observable.name} registry record | AI Native Observatory`,
    description: observable.summary
  };
}

export default async function RegistryRecordPage({ params }: PageProps) {
  const { slug } = await params;
  const observable = getObservableBySlug(slug);

  if (!observable) {
    notFound();
  }

  const relatedObservables = getRelatedObservables(observable.id);
  const connectedRecords = consolidateRelatedObservables(relatedObservables);
  const relationshipGroups = groupConnectedRecords(connectedRecords);
  const linkedSources = getSourcesForObservable(observable.id);
  const observationRows = getObservationsForObservable(observable.id)
    .slice()
    .sort((a, b) => a.observedAt.localeCompare(b.observedAt));
  const sourceSummaries = linkedSources.map((source) => ({
    source,
    linkedObservableCount: getObservablesForSource(source.id).length,
    observationsForRecord: observationRows.filter(
      (observation) => observation.sourceId === source.id
    ).length,
    totalObservationCount: getObservationsForSource(source.id).length
  }));
  const sourceGroups = groupSourcesByQuality(sourceSummaries);
  const metadataEntries = Object.entries(observable.metadata).filter(
    ([, value]) => value !== undefined
  );

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
        <div className="relative mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <nav className="flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/" className="text-[#8fb7cf] hover:text-white">
              Home
            </Link>
            <Link href="/registry" className="text-[#8fb7cf] hover:text-white">
              Back to Registry
            </Link>
          </nav>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type={observable.type} variant="dark" />
                <StatusBadge status={observable.status} />
                <VerificationBadge status={observable.verification_status} />
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
                {observable.name}
              </h1>
              <TypeAccentRule type={observable.type} className="mt-4" />
              <p className="mt-4 text-lg leading-8 text-slate-300">
                {observable.summary}
              </p>
              {observable.location ? (
                <p className="mt-4 text-sm leading-6 text-slate-400">
                  Location:{" "}
                  <span className="text-slate-200">{observable.location}</span>
                </p>
              ) : null}
            </div>

            <section
              className={`rounded-lg border border-l-4 border-white/15 bg-[#07111c]/82 p-5 ${verificationAccentClass(
                observable.verification_status
              )}`}
            >
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Evidence summary
              </p>
              <div className="mt-4 grid gap-3">
                <MetricTile
                  label="Sources"
                  value={linkedSources.length}
                  accent="sources"
                />
                <MetricTile
                  label="Observations"
                  value={observationRows.length}
                  accent="notes"
                />
                <MetricTile
                  label="Related Records"
                  value={connectedRecords.length}
                  accent="links"
                />
              </div>
            </section>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <aside className="space-y-6">
          <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <SectionKicker>Tags</SectionKicker>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Registry tags
            </h2>
            <div className="mt-4">
              <TagList tags={observable.tags} variant="dark" />
            </div>
          </section>

          <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <SectionKicker>Raw registry metadata</SectionKicker>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Audit panel
            </h2>
            <details className="mt-4 rounded-md border border-white/10 bg-[#03050d] p-4">
              <summary className="cursor-pointer text-sm font-semibold text-[#8fb7cf]">
                Show raw JSON record
              </summary>
              <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-slate-300">
                {JSON.stringify(observable, null, 2)}
              </pre>
            </details>

            <dl className="mt-4 divide-y divide-white/10 text-sm">
              <MetadataLine label="ID" value={observable.id} />
              <MetadataLine label="Slug" value={observable.slug} />
              <MetadataLine
                label="Aliases"
                value={observable.aliases.join(", ") || "None"}
              />
              {metadataEntries.map(([key, value]) => (
                <MetadataLine
                  key={key}
                  label={formatKey(key)}
                  value={Array.isArray(value) ? value.join(", ") : value}
                />
              ))}
            </dl>
          </section>
        </aside>

        <div className="space-y-8">
          <section>
            <SectionHeader
              kicker="Connected records"
              title="Connected records"
              count={`Related Records: ${connectedRecords.length}`}
            />
            <div className="rounded-lg border border-white/15 bg-[#07111c] p-4">
              {relationshipGroups.length > 0 ? (
                <div className="grid gap-4">
                  {relationshipGroups.map((group) => (
                    <ConnectedRecordGroup key={group.type} group={group} />
                  ))}
                </div>
              ) : (
                <p className="p-5 text-sm text-slate-400">
                  No connected records currently cataloged.
                </p>
              )}
            </div>
          </section>

          <section>
            <SectionHeader
              kicker="Sources"
              title="Linked source records"
              count={`${sourceSummaries.length} sources`}
            />
            <div className="rounded-lg border border-white/15 bg-[#07111c] p-4">
              {sourceGroups.length > 0 ? (
                <div className="grid gap-4">
                  {sourceGroups.map((group) => (
                    <SourceQualityGroup key={group.status} group={group} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-white/15 bg-[#07111c] p-5 text-sm text-slate-400">
                  No sources are currently linked to this record.
                </div>
              )}
            </div>
          </section>

          <section>
            <SectionHeader
              kicker="Observation ledger"
              title="Chronological observations"
              count={`${observationRows.length} notes`}
            />
            <div className="overflow-hidden rounded-lg border border-white/15 bg-[#07111c]">
              <div className="hidden grid-cols-[130px_1fr_180px_120px] gap-4 border-b border-white/10 bg-[#03050d] px-4 py-3 text-xs font-semibold uppercase text-slate-500 md:grid">
                <span>Date</span>
                <span>Observation</span>
                <span>Source</span>
                <span>Confidence</span>
              </div>
              <div className="divide-y divide-white/10">
                {observationRows.map((observation) => {
                  const source = getSourceById(observation.sourceId);

                  return (
                    <div
                      key={observation.id}
                      className="grid gap-3 px-4 py-4 md:grid-cols-[130px_1fr_180px_120px] md:gap-4"
                    >
                      <div className="text-sm text-slate-400">
                        {formatDate(observation.observedAt)}
                      </div>
                      <div>
                        <p className="text-sm leading-6 text-slate-300">
                          {observation.claim}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded border border-white/10 bg-[#03050d] px-2 py-1 text-xs text-slate-400">
                            {observation.evidenceType}
                          </span>
                          <VerificationBadge
                            status={observation.verification_status}
                            compact
                          />
                        </div>
                      </div>
                      <div>
                        {source ? (
                          <Link
                            href={`/sources/${source.slug}`}
                            className="text-sm font-semibold text-[#8fb7cf] hover:text-white"
                          >
                            {source.publisher}
                          </Link>
                        ) : (
                          <span className="text-sm text-slate-400">Unknown</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-400">
                        {observation.confidence}
                      </div>
                    </div>
                  );
                })}
                {observationRows.length === 0 ? (
                  <p className="p-5 text-sm text-slate-400">
                    No observations have been added for this record.
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex w-fit rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-2 py-1 text-xs font-semibold uppercase text-[#b8d5e5]">
      {status}
    </span>
  );
}

const relationshipGroupOrder: Array<{
  type: ObservableType;
  title: string;
}> = [
  { type: "Model", title: "Models" },
  { type: "Organization", title: "Organizations" },
  { type: "Data Center", title: "Infrastructure" },
  { type: "Source", title: "Sources" }
];

type RelationshipGroup = {
  type: ObservableType;
  title: string;
  records: ConsolidatedRelatedRecord[];
};

type ConsolidatedRelatedRecord = {
  observable: Observable;
  relatedObservables: RelatedObservable[];
  relationshipLabels: string;
  confidenceLabel: string;
  directionLabel: string;
};

function consolidateRelatedObservables(
  relatedObservables: RelatedObservable[]
): ConsolidatedRelatedRecord[] {
  const records = new Map<string, RelatedObservable[]>();

  relatedObservables.forEach((relatedObservable) => {
    const existing = records.get(relatedObservable.observable.id) ?? [];
    records.set(relatedObservable.observable.id, [...existing, relatedObservable]);
  });

  return Array.from(records.values())
    .map((rows) => {
      const [firstRow] = rows;

      return {
        observable: firstRow.observable,
        relatedObservables: rows,
        relationshipLabels: uniqueJoin(
          rows.map(({ relationship }) => relationship.label)
        ),
        confidenceLabel: uniqueJoin(
          rows.map(({ relationship }) => relationship.confidence)
        ),
        directionLabel: uniqueJoin(rows.map(({ direction }) => direction))
      };
    })
    .sort((a, b) => a.observable.name.localeCompare(b.observable.name));
}

function groupConnectedRecords(
  connectedRecords: ConsolidatedRelatedRecord[]
): RelationshipGroup[] {
  return relationshipGroupOrder
    .map((group) => ({
      ...group,
      records: connectedRecords.filter(
        ({ observable }) => observable.type === group.type
      )
    }))
    .filter((group) => group.records.length > 0);
}

function uniqueJoin(values: string[]) {
  return Array.from(new Set(values)).join(" / ");
}

type SourceSummary = {
  source: Source;
  linkedObservableCount: number;
  observationsForRecord: number;
  totalObservationCount: number;
};

type SourceQualityGroup = {
  status: NonNullable<Source["verification_status"]>;
  title: string;
  sources: SourceSummary[];
};

const sourceQualityGroupOrder: Array<{
  status: NonNullable<Source["verification_status"]>;
  title: string;
}> = [
  { status: "source_backed", title: "Source backed" },
  { status: "needs_source_review", title: "Needs source review" },
  { status: "placeholder", title: "Placeholder" }
];

function groupSourcesByQuality(
  sourceSummaries: SourceSummary[]
): SourceQualityGroup[] {
  return sourceQualityGroupOrder
    .map((group) => ({
      ...group,
      sources: sourceSummaries.filter(
        ({ source }) => sourceQualityStatus(source) === group.status
      )
    }))
    .filter((group) => group.sources.length > 0);
}

function sourceQualityStatus(
  source: Source
): NonNullable<Source["verification_status"]> {
  return source.verification_status ?? "placeholder";
}

function SourceQualityGroup({ group }: { group: SourceQualityGroup }) {
  return (
    <section className="rounded-md border border-white/10 bg-[#03050d] p-4">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            {group.title}
          </p>
          <div
            aria-hidden="true"
            className={`mt-2 h-px w-12 rounded-full ${
              group.status === "source_backed"
                ? "bg-[#7ba36f]"
                : group.status === "needs_source_review"
                  ? "bg-[#d39b50]"
                  : "bg-slate-400"
            }`}
          />
        </div>
        <span className="rounded border border-white/10 bg-[#07111c] px-2 py-1 text-xs text-slate-300">
          {group.sources.length}
        </span>
      </div>
      <div className="mt-3 grid gap-3">
        {group.sources.map((summary) => (
          <SourceCard key={summary.source.id} summary={summary} />
        ))}
      </div>
    </section>
  );
}

function ConnectedRecordGroup({ group }: { group: RelationshipGroup }) {
  return (
    <section className="rounded-md border border-white/10 bg-[#03050d] p-4">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            {group.title}
          </p>
          <TypeAccentRule type={group.type} className="mt-2" />
        </div>
        <span className="rounded border border-white/10 bg-[#07111c] px-2 py-1 text-xs text-slate-300">
          {group.records.length}
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        {group.records.map((record) => (
          <Link
            key={record.observable.id}
            href={registryObservableHref(record.observable)}
            className={`grid gap-3 rounded-md border border-l-4 border-white/10 bg-[#07111c] p-3 transition hover:border-y-[#8fb7cf]/55 hover:border-r-[#8fb7cf]/55 hover:bg-[#0b1725] md:grid-cols-[minmax(0,1fr)_180px] ${verificationAccentClass(
              record.observable.verification_status
            )}`}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type={record.observable.type} variant="dark" />
                <VerificationBadge
                  status={record.observable.verification_status}
                  compact
                />
                <span className="text-xs uppercase text-slate-500">
                  {record.directionLabel}
                </span>
              </div>
              <h3 className="mt-3 text-base font-semibold text-white">
                <span className="text-slate-500">├──</span> {record.observable.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {record.relationshipLabels}
              </p>
            </div>
            <div className="text-sm leading-6 text-slate-400">
              <div className="text-slate-300">
                Confidence: {record.confidenceLabel}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function MetricTile({
  label,
  value,
  accent
}: {
  label: string;
  value: number;
  accent: "sources" | "notes" | "links";
}) {
  const accentClasses = {
    sources: "border-t-[#8fb7cf]/70",
    notes: "border-t-slate-500/70",
    links: "border-t-[#a78bfa]/70"
  };

  return (
    <div
      className={`rounded border border-t-2 border-white/10 bg-[#03050d] p-3 ${accentClasses[accent]}`}
    >
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
    </div>
  );
}

function SectionKicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase text-[#8fb7cf]">{children}</p>
  );
}

function SectionHeader({
  kicker,
  title,
  count
}: {
  kicker: string;
  title: string;
  count: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <SectionKicker>{kicker}</SectionKicker>
        <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      </div>
      <div className="text-sm text-slate-400">{count}</div>
    </div>
  );
}

function MetadataLine({
  label,
  value
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="grid gap-1 py-3">
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="text-slate-300">{value || "Not specified"}</dd>
    </div>
  );
}

function SourceCard({ summary }: { summary: SourceSummary }) {
  const { source } = summary;

  return (
    <article
      className={`rounded-lg border border-l-4 border-white/15 bg-[#07111c] p-5 ${verificationAccentClass(
        source.verification_status
      )}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={`/sources/${source.slug}`}
            className="text-lg font-semibold text-white hover:text-[#d8edf8]"
          >
            {source.title}
          </Link>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {source.publisher} · {source.sourceType}
          </p>
        </div>
        <VerificationBadge status={source.verification_status} />
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">{source.summary}</p>
      <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 text-sm sm:grid-cols-3">
        <SourceMetric
          label="Quality"
          value={verificationLabel(source.verification_status)}
        />
        <SourceMetric
          label="Observations"
          value={`${summary.observationsForRecord} record / ${summary.totalObservationCount} total`}
        />
        <SourceMetric
          label="Linked observables"
          value={summary.linkedObservableCount.toString()}
        />
      </div>
      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block break-all text-sm font-semibold text-[#8fb7cf] hover:text-white"
        >
          {source.url}
        </a>
      ) : null}
    </article>
  );
}

function SourceMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-[#03050d] px-3 py-2">
      <div className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm leading-5 text-slate-300">{value}</div>
    </div>
  );
}

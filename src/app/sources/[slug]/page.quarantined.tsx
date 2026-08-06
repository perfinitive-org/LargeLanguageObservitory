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
  getObservableById,
  getObservablesForSource,
  getObservationsForSource,
  getRelationshipsForSource,
  getSourceBySlug,
  sources
} from "@/lib/data";
import { formatDate } from "@/lib/format";
import { observableHref } from "@/lib/routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sources.map((source) => ({ slug: source.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const source = getSourceBySlug(slug);

  if (!source) {
    return {
      title: "Source not found | AI Native Observatory"
    };
  }

  return {
    title: `${source.title} | AI Native Observatory`,
    description: source.summary
  };
}

export default async function SourceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const source = getSourceBySlug(slug);

  if (!source) {
    notFound();
  }

  const linkedObservables = getObservablesForSource(source.id);
  const sourceObservations = getObservationsForSource(source.id);
  const sourceRelationships = getRelationshipsForSource(source.id);

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
          <Link
            href="/registry?type=Source"
            className="text-sm font-semibold text-[#8fb7cf] hover:text-white"
          >
            Sources
          </Link>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <TypeBadge type="Source" variant="dark" />
                <span className="inline-flex w-fit rounded border border-slate-400/25 bg-slate-400/10 px-2 py-1 text-xs font-semibold uppercase text-slate-300">
                  {source.sourceType}
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
                {source.title}
              </h1>
              <TypeAccentRule type="Source" className="mt-4" />
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                {source.summary}
              </p>
              <div className="mt-5">
                <TagList tags={source.tags} variant="dark" />
              </div>
            </div>
            <div
              className={`rounded-lg border border-l-4 border-white/15 bg-[#07111c]/82 p-5 ${verificationAccentClass(
                source.verification_status
              )}`}
            >
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Source quality
              </p>
              <dl className="space-y-4 text-sm">
                <div className="mt-4">
                  <dt className="font-semibold text-slate-500">Publisher</dt>
                  <dd className="mt-1 text-slate-300">{source.publisher}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Source type</dt>
                  <dd className="mt-1 text-slate-300">{source.sourceType}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Published</dt>
                  <dd className="mt-1 text-slate-300">
                    {formatDate(source.publishedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Retrieved</dt>
                  <dd className="mt-1 text-slate-300">
                    {formatDate(source.retrievedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Reliability</dt>
                  <dd className="mt-1 text-slate-300">{source.reliability}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-500">Verification</dt>
                  <dd className="mt-2">
                    <VerificationBadge status={source.verification_status} />
                  </dd>
                </div>
              </dl>
              <div className="mt-5 grid gap-2 border-t border-white/10 pt-4">
                <SourceMetric
                  label="Linked observables"
                  value={linkedObservables.length.toString()}
                />
                <SourceMetric
                  label="Observations supported"
                  value={sourceObservations.length.toString()}
                />
                <SourceMetric
                  label="Quality label"
                  value={verificationLabel(source.verification_status)}
                />
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full justify-center rounded-md bg-[#8fb7cf] px-4 py-2 text-sm font-semibold text-[#07111c] transition hover:bg-white"
              >
                Open source URL
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-[#b8d8b1]">
                Linked entities
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Observables linked to this source
              </h2>
            </div>
            <div className="text-sm text-slate-400">
              {linkedObservables.length} records
            </div>
          </div>
          <div className="divide-y divide-white/10 rounded-lg border border-white/15 bg-[#07111c]">
            {linkedObservables.map((observable) => (
              <Link
                key={observable.id}
                href={observableHref(observable)}
                className={`grid gap-3 border-l-4 border-transparent p-4 transition hover:bg-[#0b1725] md:grid-cols-[1fr_150px] ${verificationAccentClass(
                  observable.verification_status
                )}`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <TypeBadge type={observable.type} variant="dark" />
                    <VerificationBadge
                      status={observable.verification_status}
                      compact
                    />
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {observable.name}
                  </h3>
                  <TypeAccentRule type={observable.type} className="mt-2" />
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {observable.summary}
                  </p>
                </div>
                <div className="text-sm leading-6 text-slate-400">
                  {observable.location}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="space-y-8">
          <section>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase text-[#f0c889]">
                Supported observations
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Observations supported by this source
              </h2>
            </div>
            <div className="divide-y divide-white/10 rounded-lg border border-white/15 bg-[#07111c]">
              {sourceObservations.map((observation) => {
                const observable = getObservableById(observation.observableId);

                return (
                  <div key={observation.id} className="p-4">
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      <span>{formatDate(observation.observedAt)}</span>
                      {observable ? <span>{observable.name}</span> : null}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
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
                );
              })}
              {sourceObservations.length === 0 ? (
                <p className="p-4 text-sm text-slate-400">
                  No observations are currently linked to this source.
                </p>
              ) : null}
            </div>
          </section>

          <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Source metadata
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Audit metadata
            </h2>
            <dl className="mt-4 divide-y divide-white/10 text-sm">
              <MetadataLine label="ID" value={source.id} />
              <MetadataLine label="Slug" value={source.slug} />
              <MetadataLine label="Publisher / origin" value={source.publisher} />
              <MetadataLine label="Source type" value={source.sourceType} />
              <MetadataLine label="Reliability" value={source.reliability} />
              <MetadataLine label="URL" value={source.url} />
              <MetadataLine
                label="Linked observable IDs"
                value={source.linkedObservableIds.join(", ") || "None"}
              />
            </dl>
            <details className="mt-4 rounded-md border border-white/10 bg-[#03050d] p-4">
              <summary className="cursor-pointer text-sm font-semibold text-[#8fb7cf]">
                Show raw JSON source
              </summary>
              <pre className="mt-4 max-h-[520px] overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-slate-300">
                {JSON.stringify(source, null, 2)}
              </pre>
            </details>
          </section>

          <section>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                Relationships
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Relationship evidence
              </h2>
            </div>
            <div className="divide-y divide-white/10 rounded-lg border border-white/15 bg-[#07111c]">
              {sourceRelationships.map((relationship) => {
                const from = getObservableById(relationship.fromObservableId);
                const to = getObservableById(relationship.toObservableId);

                return (
                  <div key={relationship.id} className="p-4">
                    <div className="text-sm font-semibold text-white">
                      {from?.name ?? "Unknown"} {"->"} {to?.name ?? "Unknown"}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {relationship.label} - confidence {relationship.confidence}
                    </p>
                  </div>
                );
              })}
              {sourceRelationships.length === 0 ? (
                <p className="p-4 text-sm text-slate-400">
                  No relationship evidence is linked to this source.
                </p>
              ) : null}
            </div>
          </section>
        </aside>
      </div>
    </div>
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

function MetadataLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-3">
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="break-words text-slate-300">{value}</dd>
    </div>
  );
}

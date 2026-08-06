import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TagList } from "@/components/TagList";
import { TypeAccentRule, TypeBadge } from "@/components/TypeBadge";
import {
  VerificationBadge,
  verificationAccentClass
} from "@/components/VerificationBadge";
import {
  getObservableById,
  getObservableBySlug,
  getObservationsForObservable,
  getRelatedObservables,
  getSourceById,
  getSourcesForObservable,
  observables
} from "@/lib/data";
import { formatDate, formatKey } from "@/lib/format";
import { observableHref } from "@/lib/routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return observables
    .filter((observable) => observable.type !== "Source")
    .map((observable) => ({ slug: observable.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const observable = getObservableBySlug(slug);

  if (!observable) {
    return {
      title: "Observable not found | AI Native Observatory"
    };
  }

  return {
    title: `${observable.name} | AI Native Observatory`,
    description: observable.summary
  };
}

export default async function ObservableDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const observable = getObservableBySlug(slug);

  if (!observable) {
    notFound();
  }

  const sourceSlug = observable.metadata.sourceSlug;
  if (observable.type === "Source" && typeof sourceSlug === "string") {
    redirect(`/sources/${sourceSlug}`);
  }

  const relatedObservables = getRelatedObservables(observable.id);
  const observationRows = getObservationsForObservable(observable.id);
  const linkedSources = getSourcesForObservable(observable.id);
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
          <Link
            href="/registry"
            className="text-sm font-semibold text-[#8fb7cf] hover:text-white"
          >
            Registry
          </Link>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <TypeBadge type={observable.type} variant="dark" />
              <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
                {observable.name}
              </h1>
              <TypeAccentRule type={observable.type} className="mt-4" />
              <p className="mt-4 text-lg leading-8 text-slate-300">
                {observable.description}
              </p>
            </div>
            <div
              className={`min-w-64 rounded-lg border border-l-4 border-white/15 bg-[#07111c]/82 p-5 ${verificationAccentClass(
                observable.verification_status
              )}`}
            >
              <div className="text-xs font-semibold uppercase text-slate-400">
                Record status
              </div>
              <div className="mt-2 text-xl font-semibold text-white">
                {observable.status}
              </div>
              <div className="mt-4 text-xs font-semibold uppercase text-slate-400">
                Verification
              </div>
              <div className="mt-2">
                <VerificationBadge status={observable.verification_status} />
              </div>
              <div className="mt-4 text-xs font-semibold uppercase text-slate-400">
                Location
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-300">
                {observable.location}
              </div>
            </div>
          </div>
          <div className="mt-6">
            <TagList tags={observable.tags} variant="dark" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <aside className="space-y-6">
          <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <h2 className="text-lg font-semibold text-white">Metadata</h2>
            <dl className="mt-4 divide-y divide-white/10 text-sm">
              <div className="grid gap-1 py-3">
                <dt className="font-semibold text-slate-500">Aliases</dt>
                <dd className="text-slate-300">{observable.aliases.join(", ")}</dd>
              </div>
              {metadataEntries.map(([key, value]) => (
                <div key={key} className="grid gap-1 py-3">
                  <dt className="font-semibold text-slate-500">{formatKey(key)}</dt>
                  <dd className="text-slate-300">
                    {Array.isArray(value) ? value.join(", ") : value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <h2 className="text-lg font-semibold text-white">Linked sources</h2>
            <div className="mt-4 space-y-3">
              {linkedSources.map((source) => (
                <Link
                  key={source.id}
                  href={`/sources/${source.slug}`}
                  className={`block rounded-md border border-l-4 border-white/10 bg-[#03050d] p-4 transition hover:border-y-[#8fb7cf]/55 hover:border-r-[#8fb7cf]/55 hover:bg-[#0b1725] ${verificationAccentClass(
                    source.verification_status
                  )}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="text-sm font-semibold text-white">
                      {source.title}
                    </div>
                    <VerificationBadge status={source.verification_status} compact />
                  </div>
                  <div className="mt-2 text-xs text-slate-400">
                    {source.publisher} - {source.sourceType}
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {source.summary}
                  </p>
                </Link>
              ))}
              {linkedSources.length === 0 ? (
                <p className="text-sm text-slate-400">No source links yet.</p>
              ) : null}
            </div>
          </section>
        </aside>

        <div className="space-y-8">
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-[#b8d8b1]">
                  Related records
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Related observables
                </h2>
              </div>
              <div className="text-sm text-slate-400">
                {relatedObservables.length} linked records
              </div>
            </div>
            <div className="divide-y divide-white/10 rounded-lg border border-white/15 bg-[#07111c]">
              {relatedObservables.map(({ observable: related, relationship, direction }) => (
                <Link
                  key={`${relationship.id}-${related.id}`}
                  href={observableHref(related)}
                  className={`grid gap-3 border-l-4 border-transparent p-4 transition hover:bg-[#0b1725] md:grid-cols-[1fr_160px_140px] ${verificationAccentClass(
                    related.verification_status
                  )}`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <TypeBadge type={related.type} variant="dark" />
                      <VerificationBadge
                        status={related.verification_status}
                        compact
                      />
                      <span className="text-xs uppercase text-slate-500">
                        {direction}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white">
                      {related.name}
                    </h3>
                    <TypeAccentRule type={related.type} className="mt-2" />
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {relationship.notes}
                    </p>
                  </div>
                  <div className="text-sm text-slate-300">{relationship.label}</div>
                  <div className="text-sm text-slate-400">
                    Confidence: {relationship.confidence}
                  </div>
                </Link>
              ))}
              {relatedObservables.length === 0 ? (
                <p className="p-5 text-sm text-slate-400">
                  No relationships have been added for this observable.
                </p>
              ) : null}
            </div>
          </section>

          <section>
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase text-[#f0c889]">
                Evidence
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Observations</h2>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/15 bg-[#07111c]">
              <div className="hidden grid-cols-[130px_1fr_180px_120px] gap-4 border-b border-white/10 bg-[#03050d] px-4 py-3 text-xs font-semibold uppercase text-slate-500 md:grid">
                <span>Date</span>
                <span>Claim</span>
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
                        <p className="mt-1 text-xs uppercase text-slate-500">
                          {observation.evidenceType}
                        </p>
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
                      <div className="text-sm text-slate-400">{observation.confidence}</div>
                    </div>
                  );
                })}
                {observationRows.length === 0 ? (
                  <p className="p-5 text-sm text-slate-400">
                    No observations have been added for this observable.
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

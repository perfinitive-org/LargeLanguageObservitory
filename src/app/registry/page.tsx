import type { Metadata } from "next";
import {
  getObservationsForObservable,
  getRelatedObservables,
  getSourcesForObservable,
  observables
} from "@/lib/data";
import {
  RegistrySearch,
  type RegistryRecordMetrics
} from "@/components/RegistrySearch";

export const metadata: Metadata = {
  title: "Registry | AI Native Observatory",
  description: "Search AI ecosystem observables by name, type, location, and tags."
};

export default function RegistryPage() {
  const recordMetrics = observables.reduce<Record<string, RegistryRecordMetrics>>(
    (metrics, observable) => {
      metrics[observable.id] = {
        observations: getObservationsForObservable(observable.id).length,
        relationships: getRelatedObservables(observable.id).length,
        sources: getSourcesForObservable(observable.id).length
      };

      return metrics;
    },
    {}
  );

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
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_0.75fr] lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Registry
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Search observables
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Search across organizations, models, data centers, and source
              observables. Filters run locally against static JSON data.
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-white/15 bg-[#07111c]/82 p-4 sm:grid-cols-3 lg:self-start">
            <RegistryStat label="Records" value={observables.length} />
            <RegistryStat label="Search" value="Client-side" />
            <RegistryStat label="Storage" value="JSON" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <RegistrySearch
          observables={observables}
          recordMetrics={recordMetrics}
        />
      </section>
    </div>
  );
}

function RegistryStat({
  label,
  value
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.045] p-3">
      <div className="text-xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}

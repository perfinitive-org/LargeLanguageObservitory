"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { registryObservableHref } from "@/lib/routes";
import type { Observable, ObservableType } from "@/lib/types";
import { observableTypes } from "@/lib/types";
import { TagList } from "./TagList";
import { TypeAccentRule, TypeBadge } from "./TypeBadge";
import {
  VerificationBadge,
  verificationAccentClass
} from "./VerificationBadge";

const allTypes = ["All", ...observableTypes] as const;
type TypeFilter = (typeof allTypes)[number];
type ViewMode = "cards" | "list";

export type RegistryRecordMetrics = {
  observations: number;
  relationships: number;
  sources: number;
};

const emptyMetrics: RegistryRecordMetrics = {
  observations: 0,
  relationships: 0,
  sources: 0
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function searchableText(observable: Observable) {
  return [
    observable.name,
    observable.type,
    observable.location,
    observable.summary,
    observable.status,
    ...observable.tags,
    ...observable.aliases
  ]
    .join(" ")
    .toLowerCase();
}

export function RegistrySearch({
  observables,
  recordMetrics
}: {
  observables: Observable[];
  recordMetrics: Record<string, RegistryRecordMetrics>;
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("q");
    const typeParam = params.get("type") as TypeFilter | null;

    if (queryParam) {
      setQuery(queryParam);
    }

    if (typeParam && allTypes.includes(typeParam)) {
      setTypeFilter(typeParam);
    }
  }, []);

  const counts = useMemo(() => {
    const values = new Map<TypeFilter, number>([["All", observables.length]]);

    observableTypes.forEach((type) => {
      values.set(
        type,
        observables.filter((observable) => observable.type === type).length
      );
    });

    return values;
  }, [observables]);

  const filteredObservables = useMemo(() => {
    const normalizedQuery = normalize(query);

    return observables
      .filter((observable) => {
        const matchesType =
          typeFilter === "All" || observable.type === (typeFilter as ObservableType);
        const matchesQuery =
          normalizedQuery.length === 0 ||
          searchableText(observable).includes(normalizedQuery);

        return matchesType && matchesQuery;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [observables, query, typeFilter]);

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-white/15 bg-[#07111c] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.24)]">
        <div className="mb-4 flex flex-col gap-1 border-b border-white/10 pb-4">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Observatory console
          </p>
          <p className="text-sm text-slate-400">
            Search and filter the static catalog without leaving the local data
            layer.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <label className="block">
            <span className="text-sm font-semibold text-slate-100">
              Search registry
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, location, tag, type, or alias"
              className="mt-2 w-full rounded-md border border-white/10 bg-[#03050d] px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-[#8fb7cf] focus:ring-4 focus:ring-[#8fb7cf]/15"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between xl:justify-end">
            <div className="text-sm text-slate-400">
              {filteredObservables.length} of {observables.length} records
            </div>
            <div className="inline-flex w-fit rounded-md border border-white/10 bg-[#03050d] p-1">
              {(["cards", "list"] as const).map((mode) => {
                const active = viewMode === mode;

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`rounded px-3 py-1.5 text-sm font-semibold transition ${
                      active
                        ? "bg-[#8fb7cf] text-[#07111c]"
                        : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {mode === "cards" ? "Cards" : "List"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {allTypes.map((type) => {
            const active = typeFilter === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "border-[#8fb7cf]/60 bg-[#8fb7cf]/15 text-white"
                    : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-[#8fb7cf]/45 hover:text-white"
                }`}
              >
                {type} ({counts.get(type) ?? 0})
              </button>
            );
          })}
        </div>
      </div>

      {filteredObservables.length === 0 ? (
        <div className="rounded-lg border border-white/15 bg-[#07111c] px-4 py-12 text-center">
          <p className="text-lg font-semibold text-white">No records found</p>
          <p className="mt-2 text-sm text-slate-400">
            Try a broader query or clear the type filter.
          </p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredObservables.map((observable) => (
            <ObservableCard
              key={observable.id}
              observable={observable}
              metrics={recordMetrics[observable.id] ?? emptyMetrics}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredObservables.map((observable) => (
            <ObservableListItem
              key={observable.id}
              observable={observable}
              metrics={recordMetrics[observable.id] ?? emptyMetrics}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ObservableCard({
  observable,
  metrics
}: {
  observable: Observable;
  metrics: RegistryRecordMetrics;
}) {
  return (
    <Link
      href={registryObservableHref(observable)}
      className={`group flex min-h-[310px] flex-col rounded-lg border border-l-4 border-white/[0.12] bg-[#07111c] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-y-[#8fb7cf]/55 hover:border-r-[#8fb7cf]/55 hover:bg-[#0b1725] ${verificationAccentClass(
        observable.verification_status
      )}`}
    >
      <div className="flex items-start justify-between gap-3">
        <TypeBadge type={observable.type} variant="dark" />
        <VerificationBadge status={observable.verification_status} />
      </div>

      <h2 className="mt-4 text-xl font-semibold leading-6 text-white group-hover:text-[#d8edf8]">
        {observable.name}
      </h2>
      <TypeAccentRule type={observable.type} className="mt-3" />
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-300">
        {observable.summary}
      </p>

      <div className="mt-4 grid gap-2 border-t border-white/10 pt-4 text-sm">
        <MetadataLine label="Location" value={observable.location} />
        <MetadataLine label="Status" value={observable.status} />
      </div>

      <div className="mt-4">
        <TagList tags={observable.tags} limit={4} variant="dark" />
      </div>

      <MetricStrip metrics={metrics} />
    </Link>
  );
}

function ObservableListItem({
  observable,
  metrics
}: {
  observable: Observable;
  metrics: RegistryRecordMetrics;
}) {
  return (
    <Link
      href={registryObservableHref(observable)}
      className={`group grid gap-4 rounded-lg border border-l-4 border-white/[0.12] bg-[#07111c] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.2)] transition hover:border-y-[#8fb7cf]/55 hover:border-r-[#8fb7cf]/55 hover:bg-[#0b1725] md:grid-cols-[minmax(0,1fr)_260px] ${verificationAccentClass(
        observable.verification_status
      )}`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={observable.type} variant="dark" />
          <VerificationBadge status={observable.verification_status} />
        </div>
        <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-[#d8edf8]">
          {observable.name}
        </h2>
        <TypeAccentRule type={observable.type} className="mt-2" />
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-300">
          {observable.summary}
        </p>
        <div className="mt-3">
          <TagList tags={observable.tags} limit={5} variant="dark" />
        </div>
      </div>

      <div className="grid content-start gap-3 rounded-md border border-white/10 bg-[#03050d] p-3">
        <MetadataLine label="Location" value={observable.location} />
        <MetadataLine label="Status" value={observable.status} />
        <MetricStrip metrics={metrics} compact />
      </div>
    </Link>
  );
}

function MetadataLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-0.5 text-sm leading-5 text-slate-300">{value}</div>
    </div>
  );
}

function MetricStrip({
  metrics,
  compact = false
}: {
  metrics: RegistryRecordMetrics;
  compact?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-3 gap-2 ${
        compact ? "pt-1" : "mt-5 border-t border-white/10 pt-4"
      }`}
    >
      <Metric label="Sources" value={metrics.sources} accent="sources" />
      <Metric label="Notes" value={metrics.observations} accent="notes" />
      <Metric label="Links" value={metrics.relationships} accent="links" />
    </div>
  );
}

function Metric({
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
      className={`rounded border border-t-2 border-white/10 bg-[#03050d] px-2 py-2 text-center ${accentClasses[accent]}`}
    >
      <div className="text-sm font-semibold text-white">{value}</div>
      <div className="mt-0.5 text-[11px] text-slate-500">{label}</div>
    </div>
  );
}

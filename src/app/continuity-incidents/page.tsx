import type { Metadata } from "next";
import Link from "next/link";
import {
  continuityIncidentTypes,
  getIncidentTypeLabel,
  getIncidentsSortedByReportedDate
} from "@/lib/continuityRuptureIncidents";
import { getObservableById, getSourceById } from "@/lib/data";
import { claimEvidenceRegistry } from "@/lib/claimEvidenceRegistry";

export const metadata: Metadata = {
  title: "Continuity Rupture Incident Reports | AI Native Observatory",
  description:
    "A log of real, source-backed cases where a platform update, migration, policy change, or account event broke a user's working context."
};

function getClaimById(id: string) {
  return claimEvidenceRegistry.find((claim) => claim.id === id);
}

export default function ContinuityIncidentsPage() {
  const incidents = getIncidentsSortedByReportedDate();

  return (
    <div className="bg-[#03050d] text-white">
      <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d]">
        <FieldTexture />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <nav className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/" className="text-[#8fb7cf] hover:text-white">
                Home
              </Link>
              <Link href="/claims" className="text-[#8fb7cf] hover:text-white">
                Claim Evidence Registry
              </Link>
              <Link
                href="/human-decision-audits"
                className="text-[#8fb7cf] hover:text-white"
              >
                Human Decision Audits
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Measurement layer
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              Continuity Rupture Incident Reports
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Real, dated cases where a platform reset, migration, policy
              change, account event, or workflow loss broke someone&apos;s
              working context - each one backed by a source-backed claim.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              What this is not
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This is a log, not a coverage matrix - there is no
              &quot;not yet assessed&quot; row for every platform. An empty
              log means no source-backed continuity-rupture incident has
              been documented yet, not that no such incident has ever
              occurred.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Incident types tracked
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {continuityIncidentTypes.map((type) => (
              <span
                key={type}
                className="rounded border border-white/10 bg-[#03050d] px-3 py-1.5 text-xs uppercase text-slate-300"
              >
                {getIncidentTypeLabel(type)}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Log
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {incidents.length} incident{incidents.length === 1 ? "" : "s"}{" "}
            recorded
          </h2>

          {incidents.length === 0 ? (
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300">
              No continuity-rupture incidents have been documented yet. This
              log will fill in as real, source-backed incidents are
              identified through the Claim Evidence Registry - never by
              assumption about a platform that hasn&apos;t been examined.
            </p>
          ) : (
            <div className="mt-5 grid gap-4">
              {incidents.map((incident) => {
                const observable = getObservableById(
                  incident.subject_observable_id
                );
                const claim = getClaimById(incident.claim_id);
                const sources = claim
                  ? claim.source_ids.map(getSourceById).filter(Boolean)
                  : [];

                return (
                  <article
                    key={incident.id}
                    className="rounded border border-white/10 bg-[#03050d] p-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded border border-[#c97b63]/40 bg-[#c97b63]/10 px-2 py-1 text-xs font-semibold uppercase text-[#f0c1af]">
                        {getIncidentTypeLabel(incident.incident_type)}
                      </span>
                      <span className="text-xs uppercase text-slate-500">
                        {incident.severity}
                      </span>
                      {observable ? (
                        <Link
                          href={`/registry/${observable.slug}`}
                          className="font-semibold text-[#8fb7cf] hover:text-white"
                        >
                          {incident.subject_label}
                        </Link>
                      ) : (
                        <span className="font-semibold text-white">
                          {incident.subject_label}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {incident.description}
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                      Occurred {incident.occurred_date ?? "unknown"} - reported{" "}
                      {incident.reported_date}
                    </p>
                    {sources.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-3">
                        {sources.map((source) =>
                          source ? (
                            <Link
                              key={source.id}
                              href={`/sources/${source.slug}`}
                              className="text-xs font-semibold text-[#8fb7cf] hover:text-white"
                            >
                              Source: {source.title}
                            </Link>
                          ) : null
                        )}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Method boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Every incident here carries a claim_id pointing to a
            source-backed record in the Claim Evidence Registry - there is
            no severity or frequency scoring applied across platforms, and
            no incident here implies negligence or breach of any specific
            legal duty.
          </p>
        </section>
      </main>
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

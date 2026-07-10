import type { Metadata } from "next";
import Link from "next/link";
import {
  getPortabilityByPlatform,
  getPortabilityCoveragePercent,
  getPortabilityStatusLabel,
  portabilityDimensions,
  type PortabilityStatus
} from "@/lib/platformPortability";
import { getObservableById } from "@/lib/data";

export const metadata: Metadata = {
  title: "Platform Portability Scorecards | AI Native Observatory",
  description:
    "Whether each platform's public materials describe support for data export, context export, memory visibility, deletion, appeal, continuity, and recovery."
};

const statusCellClasses: Record<PortabilityStatus, string> = {
  supported: "border-[#7ba36f]/35 bg-[#7ba36f]/10 text-[#b8d8b1]",
  partially_supported: "border-[#8fb7cf]/35 bg-[#8fb7cf]/10 text-[#d8edf8]",
  not_supported: "border-[#c97b63]/40 bg-[#c97b63]/10 text-[#f0c1af]",
  not_yet_assessed: "border-white/10 bg-white/[0.03] text-slate-500",
  out_of_scope: "border-white/10 bg-white/[0.03] text-slate-600"
};

const statusSymbols: Record<PortabilityStatus, string> = {
  supported: "●",
  partially_supported: "◐",
  not_supported: "○",
  not_yet_assessed: "—",
  out_of_scope: "n/a"
};

const dimensionLabels: Record<(typeof portabilityDimensions)[number], string> = {
  raw_data_export: "Raw data export",
  context_export: "Context export",
  memory_visibility: "Memory visibility",
  deletion_controls: "Deletion controls",
  appeal_path: "Appeal path",
  workflow_continuity: "Workflow continuity",
  recovery: "Recovery"
};

export default function PlatformPortabilityPage() {
  const byPlatform = getPortabilityByPlatform();
  const coveragePercent = getPortabilityCoveragePercent();

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
                href="/governance-gaps"
                className="text-[#8fb7cf] hover:text-white"
              >
                Governance Gap Matrix
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Measurement layer
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              Platform Portability Scorecards
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
              Whether each platform&apos;s public materials describe support
              for raw data export, context export, memory visibility,
              deletion controls, an appeal path, workflow continuity, and
              recovery.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              What this is not
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              &quot;Not yet assessed&quot; means no research has been done -
              it is not a claim that a platform lacks the feature. A real
              assessment (supported, partially supported, or not supported)
              always cites a claim in the Claim Evidence Registry. This is
              not a compliance rating or a legal determination.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Coverage
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {coveragePercent}% of cells have a real, source-backed assessment
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
            Coverage grows only as real research is added to the Claim
            Evidence Registry - it is never filled in by assumption.
          </p>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Symbol legend
          </p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300 sm:grid-cols-2">
            <li><span className="font-mono text-white">●</span> Supported (source-backed)</li>
            <li><span className="font-mono text-white">◐</span> Partially supported (source-backed)</li>
            <li><span className="font-mono text-white">○</span> Not supported (source-backed)</li>
            <li><span className="font-mono text-white">—</span> Not yet assessed</li>
          </ul>
        </section>

        <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Scorecard
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Platforms &times; dimensions
          </h2>

          <div className="mt-5 overflow-x-auto rounded border border-white/10 bg-[#03050d]">
            <table className="min-w-[1100px] divide-y divide-white/10 text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Platform</th>
                  {portabilityDimensions.map((dimension) => (
                    <th key={dimension} className="px-3 py-3">
                      {dimensionLabels[dimension]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-300">
                {byPlatform.map((platform) => {
                  const observable = getObservableById(platform.observableId);
                  return (
                    <tr key={platform.observableId}>
                      <td className="whitespace-nowrap px-3 py-3 align-top font-semibold text-white">
                        {observable ? (
                          <Link
                            href={`/registry/${observable.slug}`}
                            className="text-[#8fb7cf] hover:text-white"
                          >
                            {platform.label}
                          </Link>
                        ) : (
                          platform.label
                        )}
                      </td>
                      {portabilityDimensions.map((dimension) => {
                        const record = platform.records.find(
                          (r) => r.dimension === dimension
                        );
                        if (!record) {
                          return (
                            <td key={dimension} className="px-3 py-3 align-top">
                              <span className="text-xs text-slate-600">n/a</span>
                            </td>
                          );
                        }
                        return (
                          <td key={dimension} className="px-3 py-3 align-top">
                            <span
                              className={`inline-flex rounded border px-2 py-1 font-mono text-xs ${statusCellClasses[record.status]}`}
                              title={getPortabilityStatusLabel(record.status)}
                            >
                              {statusSymbols[record.status]}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-l-4 border-white/15 border-l-white bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Method boundary
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This scorecard scopes to platforms already tracked as Model
            observables in the registry. Dimensions describe practical
            portability and continuity concerns for someone using the
            platform - not a legal compliance checklist, and no cell here
            constitutes legal advice.
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

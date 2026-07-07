import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail, contactMailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Transparency | AI Native Observatory",
  description:
    "Commercial boundaries, source submission rules, human review process, and limitations for AI Native Observatory."
};

const boundaries = [
  "Payment cannot buy verification status, source-backed status, badges, favorable treatment, changed evidence standards, review decisions, or inclusion.",
  "Source submission can provide evidence, but it does not guarantee source-backed status or inclusion.",
  "Sponsorship and buyer-side custom research are separated from registry verification outcomes.",
  "Review decisions should be supported by evidence records, source records, and conservative written reasons.",
  "Corrections are handled as source and evidence questions, not as paid reputation management."
];

const reviewSteps = [
  "Identify the observable, claim, or relationship under review.",
  "Inspect linked sources, evidence records, observations, and review decisions.",
  "Separate source-backed findings from needs-review items and unresolved questions.",
  "Record limitations plainly when current ANO data does not establish a claim.",
  "Keep buyer-side research artifacts separate from public verification status."
];

const limitations = [
  "ANO is static and manually maintained in the MVP.",
  "Coverage is incomplete and biased toward records already added to the registry.",
  "Source-backed status is not a legal, security, procurement, or compliance conclusion.",
  "Evidence may age; buyers should confirm current vendor terms before procurement decisions.",
  "The MVP does not provide maps, rankings, scoring, automated review, or live monitoring."
];

const capabilityBoundary = [
  {
    label: "Primary object",
    dataCenterTracker: "Facility, parcel, or site",
    ano: "Observable, relationship, and source-backed claim"
  },
  {
    label: "Main lens",
    dataCenterTracker: "Real estate and capacity",
    ano: "AI stack accountability"
  },
  {
    label: "Core unit",
    dataCenterTracker: "Data center asset",
    ano: "Public evidence record and review decision"
  },
  {
    label: "Buyer value",
    dataCenterTracker: "Capacity intelligence",
    ano: "Decision-ready evidence"
  },
  {
    label: "Best question",
    dataCenterTracker: "How big is this asset?",
    ano: "What claim can we trace to a source?"
  }
];

export default function TransparencyPage() {
  return (
    <div className="bg-[#03050d] text-white">
      <Hero />

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Infrastructure evidence boundary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            ANO maps the claim network, not the proprietary real-estate asset.
          </h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="grid gap-4 text-sm leading-6 text-slate-300">
              <p>
                A commercial data center market-intelligence platform answers:
                what is this data center asset?
              </p>
              <p>
                AI Native Observatory answers: what role does this
                infrastructure play in the AI stack, and what public evidence
                supports that relationship?
              </p>
              <p>
                ANO does not attempt to provide proprietary parcel data, lease
                terms, exact square footage, or private capacity forecasts. It
                tracks source-backed public relationships across AI
                organizations, models, infrastructure sites, source documents,
                observations, and review decisions.
              </p>
            </div>
            <div className="overflow-x-auto rounded border border-white/10 bg-[#03050d]">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Question</th>
                    <th className="px-3 py-3">Data center tracker</th>
                    <th className="px-3 py-3">ANO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-300">
                  {capabilityBoundary.map((row) => (
                    <tr key={row.label}>
                      <td className="px-3 py-3 font-semibold text-white">
                        {row.label}
                      </td>
                      <td className="px-3 py-3">{row.dataCenterTracker}</td>
                      <td className="px-3 py-3">{row.ano}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-5 rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 p-4 text-sm leading-6 text-[#d8edf8]">
            ANO sacrifices proprietary real-estate depth in exchange for
            public, source-backed AI-stack traceability.
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <Panel title="Funding" eyebrow="Operating model">
            <p className="text-sm leading-6 text-slate-300">
              ANO is built as a zero-recurring-cost public evidence layer using
              static JSON data and static hosting. Commercial work, where
              offered, is buyer-side AI infrastructure evidence research rather
              than vendor-paid verification.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Paid work may support manual research labor, report packaging,
              and buyer-facing explanation. It does not change public registry
              verification outcomes.
            </p>
          </Panel>

          <Panel title="Commercial Boundaries" eyebrow="What payment cannot buy">
            <ul className="grid gap-3 text-sm text-slate-300">
              {boundaries.map((boundary) => (
                <li
                  key={boundary}
                  className="rounded border border-[#d39b50]/35 bg-[#d39b50]/10 p-3 text-[#f0d9ad]"
                >
                  {boundary}
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Panel title="Review Independence" eyebrow="Evidence standard">
            <p className="text-sm leading-6 text-slate-300">
              Review independence means the public record is governed by
              source quality, evidence records, review decisions, and stated
              limitations. ANO does not sell verification, certification,
              rankings, vendor approval, or badges.
            </p>
          </Panel>

          <Panel title="Source Submission Rules" eyebrow="Free source intake">
            <p className="text-sm leading-6 text-slate-300">
              Organizations and readers may submit official sources or
              corrections. Submission is outcome-neutral: it can provide
              evidence, but it cannot force inclusion, status changes, or
              favorable treatment.
            </p>
            <Link
              href="/submit-official-sources"
              className="mt-4 inline-flex rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-sm font-semibold text-[#d8edf8] hover:bg-[#8fb7cf]/15"
            >
              Submit official sources
            </Link>
          </Panel>

          <Panel title="Corrections Process" eyebrow="Public record">
            <p className="text-sm leading-6 text-slate-300">
              Corrections should identify the record, the issue, the official
              source, any independent supporting source, and the specific claim
              that should be reviewed. Missing relationships should be marked
              as unresolved, not inferred.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Contact:{" "}
              <a href={contactMailto} className="font-semibold text-[#8fb7cf]">
                {contactEmail}
              </a>
            </p>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Human Review Process" eyebrow="Method">
            <ol className="grid gap-3 text-sm text-slate-300">
              {reviewSteps.map((step, index) => (
                <li
                  key={step}
                  className="grid grid-cols-[32px_1fr] gap-3 rounded border border-white/10 bg-[#03050d] p-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 text-xs font-semibold text-[#d8edf8]">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Known Limitations" eyebrow="Scope control">
            <ul className="grid gap-3 text-sm text-slate-300">
              {limitations.map((limitation) => (
                <li key={limitation} className="rounded border border-white/10 bg-[#03050d] p-3">
                  {limitation}
                </li>
              ))}
            </ul>
          </Panel>
        </section>
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d]">
      <FieldTexture />
      <div className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <nav className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/" className="text-[#8fb7cf] hover:text-white">
            Home
          </Link>
          <Link href="/about" className="text-[#8fb7cf] hover:text-white">
            Method
          </Link>
          <Link href="/custom-research" className="text-[#8fb7cf] hover:text-white">
            Custom Research
          </Link>
          <Link href="/press" className="text-[#8fb7cf] hover:text-white">
            Press
          </Link>
        </nav>
        <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
          Transparency
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
          The trust boundary for buyer-side AI infrastructure evidence research.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
          Source-backed public proof-of-work, converted into decision-ready
          buyer intelligence. Not verification, certification, ranking, legal
          advice, or vendor approval.
        </p>
      </div>
    </section>
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

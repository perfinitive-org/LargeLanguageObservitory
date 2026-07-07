import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail, contactMailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "AI Infrastructure Evidence Briefs | AI Native Observatory",
  description:
    "Buyer-side AI infrastructure evidence briefs built around the AI Native Observatory registry."
};

const briefTypes = [
  {
    title: "AI Infrastructure Evidence Brief",
    description:
      "A buyer-side evidence review of one AI infrastructure provider, model, API platform, or data-policy claim.",
    outputs: [
      "Claim being evaluated",
      "Source list and evidence table",
      "Source-backed findings and unresolved questions",
      "Plain-English risk summary and limitations"
    ]
  },
  {
    title: "Comparison Report",
    description:
      "A buyer-side comparison of selected organizations, model providers, infrastructure records, or source claims.",
    outputs: [
      "Comparable public claims",
      "Evidence-backed and unresolved items",
      "Ownership, funding, or data-policy notes where sourced",
      "Decision-focused summary"
    ]
  },
  {
    title: "Procurement Risk Memo",
    description:
      "A concise memo for teams deciding what to trust before vendor conversations, purchasing, partnership, or grant decisions.",
    outputs: [
      "Plain-English risk summary",
      "Source-backed documentation map",
      "Open questions for the vendor or provider",
      "No compliance certification language"
    ]
  }
];

const useCases = [
  "Prepare for a vendor call.",
  "Evaluate one AI infrastructure provider.",
  "Compare providers for procurement.",
  "Track a category over time.",
  "Support a client recommendation.",
  "Create a source-backed appendix."
];

const productsByNeed = [
  {
    need: "I need to ask better questions before a vendor call.",
    report: "AI Procurement Question Pack"
  },
  {
    need: "I need one focused answer.",
    report: "Buyer Memo"
  },
  {
    need: "I need to evaluate one provider or claim.",
    report: "Custom Evidence Brief"
  },
  {
    need: "I need to compare 2-4 vendors.",
    report: "Comparison Matrix"
  },
  {
    need: "I need to monitor this category over time.",
    report: "Monthly Digest"
  },
  {
    need: "I need the source trail.",
    report: "Evidence Appendix / Claim Sheet"
  },
  {
    need: "I need proof ANO can do the work.",
    report: "Sample Brief"
  }
];

const audience = [
  "Founders evaluating infrastructure vendors",
  "Agencies advising clients",
  "Procurement teams",
  "Investors",
  "Policy and research teams",
  "Schools and nonprofits evaluating AI infrastructure risk"
];

const briefIncludes = [
  "Claim being evaluated",
  "Source list",
  "Evidence table",
  "Source-backed findings",
  "Unresolved questions",
  "Ownership and funding notes where available",
  "Data-policy notes where available",
  "Plain-English risk summary",
  "Limitations"
];

const briefExclusions = [
  "Legal advice",
  "Compliance certification",
  "Guaranteed verification outcome",
  "Vendor approval",
  "Paid badge",
  "Change to public verification status"
];

const processSteps = [
  "Scope the question and intended audience.",
  "Identify relevant registry records and evidence records.",
  "Review source quality and unresolved gaps.",
  "Prepare a written brief with caveats and next questions.",
  "Keep client questions separate from registry verification outcomes."
];

const assemblySteps = [
  "Structured evidence records",
  "Source-backed claim table",
  "Review decision log",
  "Human editorial pass",
  "Buyer-facing report"
];

const proofLinks = [
  {
    title: "Method",
    href: "/about",
    description: "How the observatory defines records, evidence, and review status."
  },
  {
    title: "Transparency",
    href: "/transparency",
    description: "Commercial boundaries, source-submission rules, and limitations."
  },
  {
    title: "Sample Brief",
    href: "/sample-brief",
    description: "A public sample of a buyer-side evidence brief."
  },
  {
    title: "Evidence Records",
    href: "/evidence",
    description: "Reusable evidence records linked to observables and review decisions."
  },
  {
    title: "Frontier Claim Velocity",
    href: "/evidence/frontier-claim-velocity",
    description:
      "A neutral timeline of public claims about frontier model and infrastructure scale."
  },
  {
    title: "Review Decisions",
    href: "/review-decisions",
    description: "The static human review ledger behind status changes."
  }
];

const faqs = [
  {
    question: "What do clients buy?",
    answer:
      "Buyer-side research reports built from ANO's public evidence records, review decisions, registry entries, and source-backed claims."
  },
  {
    question: "Is this verification?",
    answer:
      "No. ANO does not sell verification, certification, rankings, badges, vendor approval, source-backed status, or favorable treatment."
  },
  {
    question: "How are reports produced?",
    answer:
      "Reports are machine-assembled from structured evidence records and human-edited before delivery or publication."
  },
  {
    question: "Can a vendor pay to improve its status?",
    answer:
      "No. Payment cannot change verification status, source-backed status, evidence standards, review decisions, inclusion criteria, or public registry treatment."
  },
  {
    question: "What can I request?",
    answer:
      "A buyer memo, AI Infrastructure Evidence Brief, comparison matrix, procurement question pack, or recurring evidence digest."
  }
];

export default function CustomResearchPage() {
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
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <nav className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/" className="text-[#8fb7cf] hover:text-white">
                Home
              </Link>
              <Link href="/registry" className="text-[#8fb7cf] hover:text-white">
                Registry
              </Link>
              <Link href="/sponsor" className="text-[#8fb7cf] hover:text-white">
                Sponsor
              </Link>
              <Link
                href="/submit-official-sources"
                className="text-[#8fb7cf] hover:text-white"
              >
                Submit Sources
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              AI infrastructure evidence briefs
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              Buyer-side AI infrastructure evidence briefs.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Custom briefs help founders, agencies, procurement teams,
              investors, policy teams, schools, and nonprofits understand what
              public sources support, what remains unresolved, and where
              infrastructure risk needs closer review.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={contactMailto}
                className="rounded-md bg-[#8fb7cf] px-5 py-3 text-sm font-semibold text-[#07111c] transition hover:bg-white"
              >
                Request an AI Infrastructure Evidence Brief
              </a>
              <Link
                href="/sponsor"
                className="rounded-md border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8fb7cf]/70"
              >
                Support the Observatory
              </Link>
            </div>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Contact
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              Limited manual availability
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Founding research briefs are available on a limited manual basis
              while ANO validates demand. No pricing is published in this MVP
              checkpoint.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Start by emailing{" "}
              <a href={contactMailto} className="font-semibold text-[#8fb7cf]">
                {contactEmail}
              </a>{" "}
              with the infrastructure provider, model, or claim you want
              reviewed.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section>
          <SectionHeading
            eyebrow="Buyer-side research"
            title="Research brief offers"
          />
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {briefTypes.map((brief) => (
              <article
                key={brief.title}
                className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-5"
              >
                <h2 className="text-xl font-semibold text-white">
                  {brief.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {brief.description}
                </p>
                <p className="mt-5 text-xs font-semibold uppercase text-[#8fb7cf]">
                  Typical outputs
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                  {brief.outputs.map((output) => (
                    <li key={output} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8fb7cf]" />
                      <span>{output}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Use Cases" eyebrow="Buyer workflow">
            <ul className="grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              {useCases.map((item) => (
                <li
                  key={item}
                  className="rounded border border-white/10 bg-[#03050d] p-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Panel>

          <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Product by need
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Start with the decision, then choose the report.
            </h2>
            <div className="mt-4 overflow-x-auto rounded border border-white/10 bg-[#03050d]">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Buyer need</th>
                    <th className="px-3 py-3">Recommended report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-slate-300">
                  {productsByNeed.map((row) => (
                    <tr key={row.need}>
                      <td className="px-3 py-3">{row.need}</td>
                      <td className="px-3 py-3 font-semibold text-white">
                        {row.report}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Product boundary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            ANO maps the public claim network behind AI infrastructure.
          </h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded border border-white/10 bg-[#03050d] p-4">
              <p className="text-sm font-semibold text-white">
                Use a data center market-intelligence platform when you need:
              </p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                <li>Parcel precision, lease terms, or private site details.</li>
                <li>Exact square footage, power capacity, or capacity forecasts.</li>
                <li>Real-estate market, submarket, utility, or pipeline analysis.</li>
              </ul>
            </div>
            <div className="rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 p-4">
              <p className="text-sm font-semibold text-[#d8edf8]">
                Use ANO when you need:
              </p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-300">
                <li>
                  A source-backed explanation of how an AI organization, model,
                  infrastructure site, and public claim connect.
                </li>
                <li>
                  A clear split between source-backed findings, needs-review
                  items, unresolved questions, and buyer follow-up questions.
                </li>
                <li>
                  Decision-ready evidence built from public records, evidence
                  records, and review decisions.
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            Short version: a data center tracker maps the asset. ANO maps the
            claim network.
          </p>
          <div className="mt-5 rounded border border-white/10 bg-[#03050d] p-4 text-sm leading-6 text-slate-300">
            ANO is not a model hub, benchmark index, ranking site, or data
            center real-estate database. It maps public claim networks across
            AI organizations, models, infrastructure, and sources.
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr_1fr]">
          <Panel title="Who It Is For" eyebrow="Audience">
            <ul className="grid gap-2 text-sm text-slate-300">
              {audience.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8fb7cf]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Brief Includes" eyebrow="Evidence package">
            <ul className="grid gap-2 text-sm text-slate-300">
              {briefIncludes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#7ba36f]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Does Not Include" eyebrow="Boundary">
            <ul className="grid gap-2 text-sm text-slate-300">
              {briefExclusions.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Panel title="Research Process" eyebrow="Workflow">
            <ol className="grid gap-3 text-sm text-slate-300">
              {processSteps.map((step, index) => (
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

          <Panel title="Independence Boundary" eyebrow="Important">
            <p className="text-sm leading-6 text-slate-300">
              ANO reports are buyer-side research support. They are not legal
              advice, compliance certification, official approval, vendor
              endorsement, rankings, or verification badges.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Payment for custom research does not alter ANO&apos;s public
              verification status, source-backed status, evidence standards,
              review decisions, or inclusion criteria.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Paid work may identify evidence, summarize public records, and
              list unresolved questions. It cannot buy favorable treatment,
              badges, or a changed evidence standard.
            </p>
            <div className="mt-5 rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 p-4 text-sm leading-6 text-[#d8edf8]">
              Start by emailing{" "}
              <a href={contactMailto} className="font-semibold underline">
                {contactEmail}
              </a>{" "}
              with a topic and desired brief type.
            </div>
          </Panel>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <Panel title="How Reports Are Assembled" eyebrow="Evidence packaging">
            <div className="grid gap-3 text-sm text-slate-300">
              {assemblySteps.map((step, index) => (
                <div
                  key={step}
                  className="grid grid-cols-[32px_1fr] gap-3 rounded border border-white/10 bg-[#03050d] p-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 text-xs font-semibold text-[#d8edf8]">
                    {index + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Public evidence records create the trust layer. Reports package
              that same evidence into a decision artifact for a specific buyer
              workflow.
            </p>
          </Panel>

          <Panel title="Public Proof Links" eyebrow="Trust spine">
            <div className="grid gap-3">
              {proofLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded border border-white/10 bg-[#03050d] p-3 transition hover:border-[#8fb7cf]/60"
                >
                  <p className="text-sm font-semibold text-white">
                    {link.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Later data products
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Evidence exports come after manual demand is proven.
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Future products may include source inventories, claim sheets,
            evidence appendices, review-decision logs, recurring evidence
            digests, and structured exports. They are not checkout products in
            this MVP checkpoint.
          </p>
        </section>

        <section className="mt-8">
          <SectionHeading
            eyebrow="Common questions"
            title="How buyer-side research works"
          />
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-lg border border-white/15 bg-[#07111c] p-5"
              >
                <h2 className="text-base font-semibold text-white">
                  {item.question}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
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

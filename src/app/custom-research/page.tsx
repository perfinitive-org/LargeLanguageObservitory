import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail, contactMailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Custom AI Ecosystem Research | AI Native Observatory",
  description:
    "Custom research brief services built around the AI Native Observatory registry."
};

const briefTypes = [
  {
    title: "AI Infrastructure Evidence Brief",
    description:
      "A source-backed review of one AI infrastructure provider, model, API platform, or data-policy claim.",
    outputs: [
      "What the organization claims",
      "What public sources support",
      "What remains unresolved",
      "Evidence table and plain-English risk summary"
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

const processSteps = [
  "Scope the question and intended audience.",
  "Identify relevant registry records and evidence records.",
  "Review source quality and unresolved gaps.",
  "Prepare a written brief with caveats and next questions.",
  "Keep client questions separate from registry verification outcomes."
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
              Custom research
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              Buyer-side AI infrastructure evidence briefs.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Custom briefs help founders, agencies, procurement teams,
              consultants, schools, nonprofits, and investors understand what
              public sources support and what remains unresolved.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={contactMailto}
                className="rounded-md bg-[#8fb7cf] px-5 py-3 text-sm font-semibold text-[#07111c] transition hover:bg-white"
              >
                Request a brief
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
              Founding range: $150-$300
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              First 3-5 buyer-side briefs should stay intentionally small:
              useful enough to prove demand, bounded enough to preserve review
              quality.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section>
          <SectionHeading
            eyebrow="Research products"
            title="First paid offers"
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
              Custom research is for people deciding what to trust. Paid work
              may identify evidence, summarize public records, and list
              unresolved questions. It does not buy source-backed status,
              verification status, favorable treatment, badges, or a changed
              evidence standard.
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

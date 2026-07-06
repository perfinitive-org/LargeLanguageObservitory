import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail, contactMailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Press | AI Native Observatory",
  description:
    "Press and brand language for AI Native Observatory, an evidence-backed AI infrastructure observatory."
};

const researchAreas = [
  "AI infrastructure providers",
  "models-as-infrastructure",
  "data center and compute infrastructure records",
  "ownership and funding claims where sourced",
  "data-policy claims where sourced",
  "evidence records and review decisions",
  "unresolved buyer questions"
];

const nonClaims = [
  "legal advice",
  "compliance certification",
  "official approval",
  "vendor endorsement",
  "rankings or best-provider lists",
  "paid verification",
  "badges or marketplace placement"
];

const brandLanguage = [
  "AI Native Observatory is an evidence-backed AI infrastructure observatory.",
  "ANO provides buyer-side AI infrastructure evidence research.",
  "ANO converts source-backed public proof-of-work into decision-ready buyer intelligence.",
  "ANO separates source submission, sponsorship, and buyer-side research from public verification outcomes.",
  "Reports are machine-assembled from structured evidence records and human-edited before delivery or publication."
];

export default function PressPage() {
  return (
    <div className="bg-[#03050d] text-white">
      <Hero />

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Panel title="Short Description" eyebrow="One sentence">
            <p className="text-sm leading-6 text-slate-300">
              AI Native Observatory is an evidence-backed AI infrastructure
              observatory for source-backed public records, review decisions,
              and buyer-side research briefs.
            </p>
          </Panel>

          <Panel title="Long Description" eyebrow="About ANO">
            <p className="text-sm leading-6 text-slate-300">
              AI Native Observatory tracks organizations, models,
              infrastructure sites, sources, evidence records, and review
              decisions across the AI ecosystem. The public site serves as the
              evidence layer. Buyer-side reports package that evidence into
              decision-ready intelligence for consultants, agencies,
              procurement teams, founders, investors, researchers, schools, and
              nonprofits evaluating AI infrastructure risk.
            </p>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Panel title="What ANO Researches" eyebrow="Coverage">
            <ul className="grid gap-3 text-sm text-slate-300">
              {researchAreas.map((area) => (
                <li key={area} className="rounded border border-white/10 bg-[#03050d] p-3">
                  {area}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="What ANO Does Not Claim" eyebrow="Boundary">
            <ul className="grid gap-3 text-sm text-slate-300">
              {nonClaims.map((claim) => (
                <li key={claim} className="rounded border border-white/10 bg-[#03050d] p-3">
                  Not {claim}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Contact" eyebrow="Press and research">
            <p className="text-sm leading-6 text-slate-300">
              For press, corrections, source submissions, or buyer-side
              research inquiries, contact{" "}
              <a href={contactMailto} className="font-semibold text-[#8fb7cf]">
                {contactEmail}
              </a>
              .
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/custom-research"
                className="rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-sm font-semibold text-[#d8edf8] hover:bg-[#8fb7cf]/15"
              >
                Custom research
              </Link>
              <Link
                href="/transparency"
                className="rounded border border-white/15 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white hover:border-[#8fb7cf]/70"
              >
                Transparency
              </Link>
            </div>
          </Panel>
        </section>

        <Panel title="Brand Language" eyebrow="Use this language">
          <div className="grid gap-3 md:grid-cols-2">
            {brandLanguage.map((line) => (
              <blockquote
                key={line}
                className="rounded border border-white/10 bg-[#03050d] p-4 text-sm leading-6 text-slate-300"
              >
                {line}
              </blockquote>
            ))}
          </div>
        </Panel>
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
          <Link href="/latest" className="text-[#8fb7cf] hover:text-white">
            Latest
          </Link>
          <Link href="/sample-brief" className="text-[#8fb7cf] hover:text-white">
            Sample Brief
          </Link>
          <Link href="/transparency" className="text-[#8fb7cf] hover:text-white">
            Transparency
          </Link>
        </nav>
        <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
          Press
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
          Public language for an evidence-backed AI infrastructure observatory.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
          Use this page for short descriptions, public positioning, contact
          information, and trust-boundary language.
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

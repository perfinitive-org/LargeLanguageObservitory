import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail, contactMailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Submit Official Sources | AI Native Observatory",
  description:
    "Submit official source material for AI Native Observatory infrastructure review without buying verification status."
};

const requestedMaterials = [
  "Official organization website or about page",
  "Official product, model, infrastructure, or documentation page",
  "Official press release, technical report, filing, or policy document",
  "Independent public source that corroborates the record",
  "Notes about what should be corrected, added, or reviewed"
];

const guardrails = [
  "Submitting sources does not guarantee source-backed status.",
  "Submitting sources does not guarantee verification status, favorable treatment, or inclusion.",
  "Paid priority review, if offered later, will only affect review timing, not outcome.",
  "The same evidence standard applies to every record."
];

const emailTemplate = `Observable or organization name:
Official source URL:
Independent source URL:
Suggested correction or addition:
Why this source is relevant:
Contact name and role:`;

export default function SubmitOfficialSourcesPage() {
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
              <Link href="/about" className="text-[#8fb7cf] hover:text-white">
                Method
              </Link>
              <Link
                href="/custom-research"
                className="text-[#8fb7cf] hover:text-white"
              >
                Custom Research
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Free source intake
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              Submit official sources for review.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Is this your organization, model, infrastructure site, or source?
              Send official documentation so the AI infrastructure observatory
              can review whether the public record should be corrected,
              expanded, or kept as-is.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={`${contactMailto}?subject=AI%20Native%20Observatory%20source%20submission`}
                className="rounded-md bg-[#8fb7cf] px-5 py-3 text-sm font-semibold text-[#07111c] transition hover:bg-white"
              >
                Email official sources
              </a>
              <Link
                href="/custom-research"
                className="rounded-md border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8fb7cf]/70"
              >
                Buyer-side research briefs
              </Link>
            </div>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#d6a84f] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Trust boundary
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              Submission is not verification.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The Observatory reviews evidence manually. Source-backed status is
              an outcome of evidence review, not a paid service or a claim badge.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <Panel title="What To Send" eyebrow="Requested material">
            <ul className="grid gap-3 text-sm text-slate-300">
              {requestedMaterials.map((item) => (
                <li
                  key={item}
                  className="rounded border border-white/10 bg-[#03050d] p-3"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="No-Guarantee Review Language" eyebrow="Policy">
            <ul className="grid gap-3 text-sm text-slate-300">
              {guardrails.map((item) => (
                <li
                  key={item}
                  className="rounded border border-[#d6a84f]/35 bg-[#d6a84f]/10 p-3 text-[#f4dfad]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Email template
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Copy this into your message
          </h2>
          <pre className="mt-4 overflow-x-auto rounded border border-white/10 bg-[#03050d] p-4 text-sm leading-6 text-slate-300">
            {emailTemplate}
          </pre>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            Send to{" "}
            <a href={contactMailto} className="font-semibold text-[#8fb7cf]">
              {contactEmail}
            </a>
            . A form can be added later, but this keeps the first public intake
            static and zero-cost.
          </p>
        </section>
      </main>
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

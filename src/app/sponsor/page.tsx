import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail, contactMailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Sponsor AI Native Observatory",
  description:
    "Sponsor and enhanced profile options for the AI Native Observatory."
};

const products = [
  {
    title: "Sponsored Supporter Slot",
    label: "Directory sponsorship",
    description:
      "A clearly labeled supporter placement for organizations that want to support the public Observatory while reaching AI ecosystem readers.",
    includes: [
      "Supporter name on a sponsor section or sponsor page",
      "Link to official website",
      "Short sponsor description",
      "Clear sponsorship label"
    ]
  },
  {
    title: "Enhanced Company / Profile Page",
    label: "Claimed profile",
    description:
      "An expanded profile layer for organizations already represented in the registry, kept separate from evidence and verification status.",
    includes: [
      "Official website and contact links",
      "Company-provided summary marked as provided copy",
      "Product, hiring, or documentation links",
      "Clear separation from source-backed registry claims"
    ]
  },
  {
    title: "Custom AI Ecosystem Research Brief",
    label: "Research service",
    description:
      "A manually prepared brief using the Observatory's registry, evidence records, and reviewer workflow as the starting point.",
    includes: [
      "Custom scope definition",
      "Curated record and evidence review",
      "Plain-language findings",
      "Delivery as a written brief"
    ]
  }
];

const safeguards = [
  "Sponsorship never changes verification status.",
  "Paid profile content is labeled separately from source-backed evidence.",
  "Registry records remain governed by evidence, review decisions, and source quality.",
  "The Observatory will not sell source-backed status, review outcomes, or hidden ranking influence."
];

export default function SponsorPage() {
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
              <Link
                href="/custom-research"
                className="text-[#8fb7cf] hover:text-white"
              >
                Custom Research
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Sponsorship and directory products
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              Support the Observatory without compromising the evidence layer.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              AI Native Observatory can operate like a serious directory:
              public registry access remains free, while sponsorship, enhanced
              profiles, and custom research create revenue around the trusted
              data product.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={contactMailto}
                className="rounded-md bg-[#8fb7cf] px-5 py-3 text-sm font-semibold text-[#07111c] transition hover:bg-white"
              >
                Contact {contactEmail}
              </a>
              <Link
                href="/custom-research"
                className="rounded-md border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8fb7cf]/70"
              >
                View research briefs
              </Link>
            </div>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Revenue rule
            </p>
            <p className="mt-3 text-2xl font-semibold text-white">
              Money buys visibility, not trust status.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The registry&apos;s value depends on the distinction between paid
              placement and evidence-backed review. Sponsored and enhanced
              content must be labeled.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section>
          <SectionHeading
            eyebrow="Available products"
            title="Three first revenue offers"
          />
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.title}
                className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-5"
              >
                <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                  {product.label}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-white">
                  {product.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {product.description}
                </p>
                <ul className="mt-4 grid gap-2 text-sm text-slate-300">
                  {product.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8fb7cf]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel title="Sponsorship Safeguards" eyebrow="Trust boundary">
            <ul className="grid gap-3 text-sm text-slate-300">
              {safeguards.map((item) => (
                <li key={item} className="rounded border border-white/10 bg-[#03050d] p-3">
                  {item}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="How To Start" eyebrow="Contact">
            <p className="text-sm leading-6 text-slate-300">
              Email{" "}
              <a href={contactMailto} className="font-semibold text-[#8fb7cf]">
                {contactEmail}
              </a>{" "}
              with the product you are interested in, the organization or topic,
              and the preferred timing. The first step is a manual scope review,
              not an automated purchase flow.
            </p>
            <div className="mt-5 rounded border border-[#7ba36f]/45 bg-[#7ba36f]/10 p-4 text-sm leading-6 text-[#d8f2d2]">
              Recommended first offer: sponsor slot plus optional enhanced
              profile for organizations already represented in the registry.
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

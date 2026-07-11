import Link from "next/link";

const entryPoints = [
  {
    href: "/directory",
    label: "Directory",
    description: "Organization and facility records will appear here after evidence review."
  },
  {
    href: "/claims",
    label: "Claims",
    description: "Specific assertions will carry a status, source linkage, date, and confidence note."
  },
  {
    href: "/sources",
    label: "Sources",
    description: "The source register will document provenance, type, dates, and review notes."
  },
  {
    href: "/reports",
    label: "Reports",
    description: "Reports will follow evidence tables and will state their datasets and limitations."
  }
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-[#c9c6bb] bg-[#f7f6f1]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#315a52]">
            Public scaffold · evidence records not yet published
          </p>
          <h1 className="mt-5 max-w-5xl font-serif text-4xl leading-tight text-[#18201b] sm:text-6xl">
            Making the infrastructure behind frontier AI more visible.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#505852]">
            The LLM Infrastructure Observatory is an independent public evidence
            surface for claims about compute, facilities, power, capital, and
            operational constraints. Records will show provenance, uncertainty,
            review status, and change over time.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/methodology"
              className="border border-[#315a52] bg-[#315a52] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#244840]"
            >
              Read the methodology
            </Link>
            <Link
              href="/directory"
              className="border border-[#9e9b91] bg-transparent px-5 py-3 text-sm font-semibold text-[#29302b] transition hover:border-[#315a52]"
            >
              View the directory scaffold
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#315a52]">
              Evidence posture
            </p>
            <h2 className="mt-3 font-serif text-3xl text-[#18201b]">
              The scaffold comes before the findings.
            </h2>
            <p className="mt-4 leading-7 text-[#59605a]">
              This release establishes public routes and method boundaries only.
              It contains no production infrastructure records, seeded findings,
              or implied coverage.
            </p>
          </div>
          <dl className="grid gap-px border border-[#c9c6bb] bg-[#c9c6bb] sm:grid-cols-2">
            {[
              ["Source", "A reviewable document, filing, record, dataset, or public statement."],
              ["Claim", "A specific assertion whose support can be evaluated."],
              ["Status", "The current evidence state, including unresolved or not yet assessed."],
              ["Review date", "The date a record and its supporting evidence were last checked."]
            ].map(([term, definition]) => (
              <div key={term} className="bg-[#f7f6f1] p-5">
                <dt className="font-semibold text-[#29302b]">{term}</dt>
                <dd className="mt-2 text-sm leading-6 text-[#626963]">{definition}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-y border-[#c9c6bb] bg-[#e9e7df]">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="grid gap-px border border-[#c9c6bb] bg-[#c9c6bb] md:grid-cols-2 xl:grid-cols-4">
            {entryPoints.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-[#f7f6f1] p-6 transition hover:bg-white"
              >
                <h2 className="font-serif text-2xl text-[#18201b] group-hover:text-[#315a52]">
                  {item.label}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#626963]">
                  {item.description}
                </p>
                <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-[#315a52]">
                  Open section →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="max-w-3xl border-l-2 border-[#315a52] pl-6">
          <h2 className="font-serif text-2xl text-[#18201b]">Current limitation</h2>
          <p className="mt-3 leading-7 text-[#59605a]">
            No public evidence dataset has been authorized for this skeleton.
            Empty states are intentional. Coverage, recency, and completeness
            should not be inferred from the presence of these pages.
          </p>
        </div>
      </section>
    </>
  );
}

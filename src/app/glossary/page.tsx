import type { Metadata } from "next";
import { PublicScaffoldPage } from "@/components/PublicScaffoldPage";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Plain-language definitions for the Observatory public evidence surface."
};

const terms = [
  ["Claim", "A specific assertion that can be checked against one or more sources."],
  ["Source", "An identifiable document, record, dataset, filing, statement, or publication used to assess a claim."],
  ["Evidence state", "A label describing the current relationship between a claim and its available support."],
  ["Confidence note", "A plain-language explanation of uncertainty, evidence limits, or assumptions."],
  ["Last reviewed", "The date a record and its linked evidence were most recently checked."],
  ["Not yet assessed", "A record or field for which no completed evidence review is being claimed."]
];

export default function GlossaryPage() {
  return (
    <PublicScaffoldPage
      eyebrow="Glossary"
      title="Terms used on the public evidence surface."
      description="Definitions are intentionally plain and will expand only as reviewed records and measurements are introduced."
    >
      <dl className="divide-y divide-[#c9c6bb] border-y border-[#c9c6bb]">
        {terms.map(([term, definition]) => (
          <div key={term} className="grid gap-2 py-5 sm:grid-cols-[220px_1fr] sm:gap-8">
            <dt className="font-serif text-xl text-[#18201b]">{term}</dt>
            <dd className="leading-7 text-[#59605a]">{definition}</dd>
          </div>
        ))}
      </dl>
    </PublicScaffoldPage>
  );
}

import type { Metadata } from "next";
import { PublicScaffoldPage } from "@/components/PublicScaffoldPage";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How the Observatory will document sources, claims, uncertainty, review, and corrections."
};

const principles = [
  ["Specific claims", "Records should separate a narrow assertion from surrounding narrative."],
  ["Reviewable sources", "A source must exist, be identifiable, and support the wording attributed to it."],
  ["Visible uncertainty", "Direct statements, estimates, inferences, and unresolved questions should not be collapsed into one status."],
  ["Dated review", "Records should show when evidence was checked and when a material status changed."],
  ["Public boundaries", "Protected or internal material must not appear on the public evidence surface."],
  ["Corrections", "Material corrections should preserve what changed, why it changed, and the evidence used."]
];

export default function MethodologyPage() {
  return (
    <PublicScaffoldPage
      eyebrow="Methodology"
      title="Evidence before interpretation."
      description="The Observatory will distinguish what a source says, what a record infers, what remains uncertain, and when each item was reviewed."
    >
      <section className="grid gap-px border border-[#c9c6bb] bg-[#c9c6bb] md:grid-cols-2">
        {principles.map(([title, body]) => (
          <article key={title} className="bg-[#f7f6f1] p-6">
            <h2 className="font-serif text-2xl text-[#18201b]">{title}</h2>
            <p className="mt-3 leading-7 text-[#59605a]">{body}</p>
          </article>
        ))}
      </section>
      <section className="mt-8 border-l-2 border-[#315a52] pl-6">
        <h2 className="font-serif text-2xl text-[#18201b]">Current method status</h2>
        <p className="mt-3 max-w-3xl leading-7 text-[#59605a]">
          This page states the public method posture for the static skeleton.
          Detailed status definitions, source-quality rules, and correction
          procedures will be added only with the evidence-schema and validation gates.
        </p>
      </section>
    </PublicScaffoldPage>
  );
}

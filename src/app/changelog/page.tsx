import type { Metadata } from "next";
import { PublicScaffoldPage } from "@/components/PublicScaffoldPage";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Public record of material changes to the Observatory evidence surface."
};

export default function ChangelogPage() {
  return (
    <PublicScaffoldPage
      eyebrow="Changelog"
      title="Material public changes should remain visible."
      description="This log will record public additions, corrections, status changes, and methodology revisions without rewriting prior states out of view."
    >
      <article className="grid gap-4 border-y border-[#c9c6bb] py-6 sm:grid-cols-[180px_1fr] sm:gap-8">
        <div>
          <time dateTime="2026-07-11" className="font-semibold text-[#29302b]">
            July 11, 2026
          </time>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#747b75]">
            Scaffold
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-[#18201b]">
            Public skeleton established
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#59605a]">
            Added the public route structure and method-facing empty states.
            No production evidence records, infrastructure findings, or reports
            were published with this change.
          </p>
        </div>
      </article>
    </PublicScaffoldPage>
  );
}

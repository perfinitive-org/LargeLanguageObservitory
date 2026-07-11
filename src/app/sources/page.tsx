import type { Metadata } from "next";
import { EmptyState, PublicScaffoldPage } from "@/components/PublicScaffoldPage";

export const metadata: Metadata = {
  title: "Sources",
  description: "Public source-register scaffold for the LLM Infrastructure Observatory."
};

export default function SourcesPage() {
  return (
    <PublicScaffoldPage
      eyebrow="Source register"
      title="The record should show what the Observatory relies on."
      description="Published sources will identify the document or dataset, publisher, date, source type, access or review date, supported claims, and relevant limitations."
    >
      <EmptyState title="No sources are published in this scaffold.">
        <p>
          The source register will be populated only after the evidence-data gate.
          A company statement, public filing, utility record, research paper, and
          news report will not be treated as interchangeable forms of evidence.
        </p>
      </EmptyState>
    </PublicScaffoldPage>
  );
}

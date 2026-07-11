import type { Metadata } from "next";
import { EmptyState, PublicScaffoldPage } from "@/components/PublicScaffoldPage";

export const metadata: Metadata = {
  title: "Reports",
  description: "Future public reports derived from reviewed and versioned Observatory evidence."
};

export default function ReportsPage() {
  return (
    <PublicScaffoldPage
      eyebrow="Reports"
      title="Reports come after the evidence base."
      description="Future reports will state their source set, review period, dataset version, assumptions, uncertainty, and limitations."
    >
      <EmptyState title="No reports are published in this scaffold.">
        <p>
          Report production is a later gate. The Observatory will not publish a
          summary, index, ranking, or trend claim merely to make this page appear complete.
        </p>
      </EmptyState>
    </PublicScaffoldPage>
  );
}

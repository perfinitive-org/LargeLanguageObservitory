import type { Metadata } from "next";
import { EmptyState, MethodLink, PublicScaffoldPage } from "@/components/PublicScaffoldPage";

export const metadata: Metadata = {
  title: "Claims",
  description: "Public claim-registry scaffold for dated, sourced, and reviewed infrastructure assertions."
};

export default function ClaimsPage() {
  return (
    <PublicScaffoldPage
      eyebrow="Claim registry"
      title="Claims are records to review, not conclusions to inherit."
      description="Each published claim will be narrow enough to evaluate and will carry source links, an evidence state, a confidence note, and a review date."
    >
      <EmptyState title="No claims are published in this scaffold.">
        <p>
          Claims will remain absent until source-backed records are separately
          authorized and reviewed. No example on this page should be read as a
          finding about a company, facility, technology, power system, or market.
        </p>
        <MethodLink />
      </EmptyState>
    </PublicScaffoldPage>
  );
}

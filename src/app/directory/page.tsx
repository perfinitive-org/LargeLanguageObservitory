import type { Metadata } from "next";
import { EmptyState, MethodLink, PublicScaffoldPage } from "@/components/PublicScaffoldPage";

export const metadata: Metadata = {
  title: "Directory",
  description: "Public directory scaffold for reviewed infrastructure organizations and facilities."
};

export default function DirectoryPage() {
  return (
    <PublicScaffoldPage
      eyebrow="Directory"
      title="Organizations and facilities, with evidence attached."
      description="Directory records will identify relevant infrastructure actors and physical sites without treating announcements, estimates, and operational assets as equivalent."
    >
      <EmptyState title="No directory records are published in this scaffold.">
        <p>
          Organization and facility records will be added only after a separate
          data gate authorizes schemas, source review, and public-safe evidence.
          This empty state does not imply that no infrastructure exists or that
          coverage has been attempted.
        </p>
        <MethodLink />
      </EmptyState>
    </PublicScaffoldPage>
  );
}

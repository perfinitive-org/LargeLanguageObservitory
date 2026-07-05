import type { Observable } from "@/lib/types";

type VerificationStatus = NonNullable<Observable["verification_status"]>;

const labels: Record<VerificationStatus, string> = {
  placeholder: "Placeholder",
  needs_source_review: "Needs source review",
  source_backed: "Source backed"
};

const compactLabels: Record<VerificationStatus, string> = {
  placeholder: "Placeholder",
  needs_source_review: "Review",
  source_backed: "Sourced"
};

const badgeClasses: Record<VerificationStatus, string> = {
  placeholder: "border-slate-400/25 bg-slate-400/10 text-slate-300",
  needs_source_review: "border-[#d39b50]/40 bg-[#d39b50]/10 text-[#f0c889]",
  source_backed: "border-[#7ba36f]/35 bg-[#7ba36f]/10 text-[#b8d8b1]"
};

const accentClasses: Record<VerificationStatus, string> = {
  placeholder: "border-l-slate-500",
  needs_source_review: "border-l-[#d39b50]",
  source_backed: "border-l-[#7ba36f]"
};

export function verificationAccentClass(
  status: Observable["verification_status"]
) {
  return status ? accentClasses[status] : "border-l-slate-500";
}

export function verificationLabel(status: Observable["verification_status"]) {
  return status ? labels[status] : "Unspecified";
}

export function VerificationBadge({
  status,
  compact = false
}: {
  status: Observable["verification_status"];
  compact?: boolean;
}) {
  if (!status) {
    return null;
  }

  return (
    <span
      className={`shrink-0 rounded border px-2 py-1 text-xs font-semibold ${badgeClasses[status]}`}
    >
      {compact ? compactLabels[status] : labels[status]}
    </span>
  );
}

import type { ObservableType } from "@/lib/types";

const lightTypeClasses: Record<ObservableType, string> = {
  Organization: "border-dataBlue/30 bg-dataBlue/10 text-dataBlue",
  Model: "border-dataGreen/30 bg-dataGreen/10 text-dataGreen",
  "Data Center": "border-dataGold/35 bg-dataGold/10 text-[#7a4c18]",
  Source: "border-ink/20 bg-ink/5 text-ink/70"
};

const darkTypeClasses: Record<ObservableType, string> = {
  Organization: "border-[#8fb7cf]/35 bg-[#8fb7cf]/10 text-[#b8d5e5]",
  Model: "border-[#7ba36f]/35 bg-[#7ba36f]/10 text-[#b8d8b1]",
  "Data Center": "border-[#d39b50]/40 bg-[#d39b50]/10 text-[#f0c889]",
  Source: "border-slate-400/25 bg-slate-400/10 text-slate-300"
};

const typeAccentClasses: Record<ObservableType, string> = {
  Organization: "bg-[#8fb7cf]",
  Model: "bg-[#7ba36f]",
  "Data Center": "bg-[#d39b50]",
  Source: "bg-slate-400"
};

export function TypeBadge({
  type,
  variant = "light"
}: {
  type: ObservableType;
  variant?: "light" | "dark";
}) {
  const typeClasses = variant === "dark" ? darkTypeClasses : lightTypeClasses;

  return (
    <span
      className={`inline-flex w-fit items-center rounded border px-2 py-1 text-xs font-semibold uppercase ${typeClasses[type]}`}
    >
      {type}
    </span>
  );
}

export function TypeAccentRule({
  type,
  className = ""
}: {
  type: ObservableType;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`block h-px w-12 rounded-full opacity-75 ${typeAccentClasses[type]} ${className}`}
    />
  );
}

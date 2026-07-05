export function TagList({
  tags,
  limit,
  variant = "light"
}: {
  tags: string[];
  limit?: number;
  variant?: "light" | "dark";
}) {
  const visibleTags = typeof limit === "number" ? tags.slice(0, limit) : tags;
  const remaining = typeof limit === "number" ? tags.length - visibleTags.length : 0;
  const tagClass =
    variant === "dark"
      ? "border-white/10 bg-white/[0.055] text-slate-300"
      : "border-line bg-white text-ink/64";
  const remainingClass =
    variant === "dark"
      ? "border-white/10 bg-white/[0.04] text-slate-400"
      : "border-line bg-white text-ink/54";

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className={`rounded border px-2 py-1 text-xs ${tagClass}`}
        >
          {tag}
        </span>
      ))}
      {remaining > 0 ? (
        <span className={`rounded border px-2 py-1 text-xs ${remainingClass}`}>
          +{remaining}
        </span>
      ) : null}
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden bg-[#03050d] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)",
          backgroundSize: "56px 56px"
        }}
      />
      <div className="relative mx-auto max-w-3xl px-5 py-16 text-center lg:px-8">
        <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
          Not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          This registry record does not exist.
        </h1>
        <p className="mt-3 text-slate-300">
          The record may not be part of the static MVP dataset.
        </p>
        <Link
          href="/registry"
          className="mt-6 inline-flex rounded-md bg-[#8fb7cf] px-4 py-2 text-sm font-semibold text-[#07111c] transition hover:bg-white"
        >
          Return to registry
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";

type PublicScaffoldPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function PublicScaffoldPage({
  eyebrow,
  title,
  description,
  children
}: PublicScaffoldPageProps) {
  return (
    <>
      <header className="border-b border-[#c9c6bb] bg-[#f7f6f1]">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#315a52]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-tight text-[#18201b] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#59605a]">
            {description}
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
        {children}
      </div>
    </>
  );
}

export function EmptyState({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[#c9c6bb] bg-[#f7f6f1] p-7 sm:p-9">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#747b75]">
        Not yet populated
      </p>
      <h2 className="mt-3 font-serif text-2xl text-[#18201b]">{title}</h2>
      <div className="mt-4 max-w-3xl leading-7 text-[#59605a]">{children}</div>
    </section>
  );
}

export function MethodLink() {
  return (
    <Link
      href="/methodology"
      className="mt-6 inline-block text-sm font-semibold text-[#315a52] underline decoration-[#9aaea8] underline-offset-4 hover:text-[#1c3f38]"
    >
      Review the methodology
    </Link>
  );
}

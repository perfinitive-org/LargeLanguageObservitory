import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "LLM Infrastructure Observatory",
    template: "%s | LLM Infrastructure Observatory"
  },
  description:
    "An independent public evidence surface for the infrastructure behind large language models and frontier AI systems."
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/methodology", label: "Methodology" },
  { href: "/directory", label: "Directory" },
  { href: "/claims", label: "Claims" },
  { href: "/sources", label: "Sources" },
  { href: "/reports", label: "Reports" },
  { href: "/glossary", label: "Glossary" },
  { href: "/changelog", label: "Changelog" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col bg-[#f3f1eb] text-[#202622]">
          <header className="border-b border-[#c9c6bb] bg-[#f7f6f1]">
            <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <Link href="/" className="inline-flex max-w-sm flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#315a52]">
                  LLM Infrastructure Observatory
                </span>
                <span className="mt-1 text-sm text-[#5e655f]">
                  Independent public evidence surface
                </span>
              </Link>
              <nav
                aria-label="Primary navigation"
                className="flex flex-wrap gap-x-1 gap-y-2 text-sm font-medium text-[#424a44]"
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="border-b border-transparent px-2 py-1.5 transition hover:border-[#315a52] hover:text-[#1c3f38]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[#c9c6bb] bg-[#e9e7df]">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-[#5e655f] sm:flex-row sm:items-end sm:justify-between lg:px-8">
              <div>
                <p className="font-semibold text-[#29302b]">
                  LLM Infrastructure Observatory
                </p>
                <p className="mt-1 max-w-xl leading-6">
                  Public records will distinguish evidence, uncertainty, and
                  review status. The current release is a static scaffold.
                </p>
              </div>
              <div className="flex gap-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#315a52]">
                <Link href="/methodology" className="hover:text-[#1c3f38]">
                  Methodology
                </Link>
                <Link href="/changelog" className="hover:text-[#1c3f38]">
                  Changelog
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

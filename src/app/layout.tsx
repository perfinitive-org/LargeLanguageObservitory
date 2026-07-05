import type { Metadata } from "next";
import Link from "next/link";
import { contactEmail, contactMailto } from "@/lib/contact";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Native Observatory",
  description:
    "An evidence-backed AI infrastructure observatory for source-backed AI ecosystem records."
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/registry", label: "Registry" },
  { href: "/about", label: "Method" },
  { href: "/submit-official-sources", label: "Submit Sources" },
  { href: "/custom-research", label: "Research" }
];

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <div className="min-h-screen">
          <header className="border-b border-[#182033] bg-[#03050d]">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
              <Link href="/" className="group inline-flex flex-col">
                <span className="text-xs font-semibold uppercase text-[#8fb7cf]">
                  AI Native Observatory
                </span>
                <span className="mt-1 text-sm text-slate-300">
                  Evidence-backed AI infrastructure observatory
                </span>
              </Link>
              <nav className="flex flex-wrap gap-2 text-sm font-medium text-slate-300">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md border border-transparent px-3 py-2 transition hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t border-[#182033] bg-[#03050d]">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-sm text-slate-400 lg:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p>AI Native Observatory MVP</p>
                <p>Static JSON data. No database dependency.</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-normal">
                <Link href="/sponsor" className="text-[#8fb7cf] hover:text-white">
                  Sponsor
                </Link>
                <Link
                  href="/submit-official-sources"
                  className="text-[#8fb7cf] hover:text-white"
                >
                  Submit Sources
                </Link>
                <Link
                  href="/custom-research"
                  className="text-[#8fb7cf] hover:text-white"
                >
                  Custom Research
                </Link>
                <a href={contactMailto} className="text-[#8fb7cf] hover:text-white">
                  {contactEmail}
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

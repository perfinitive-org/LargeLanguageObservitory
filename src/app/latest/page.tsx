import type { Metadata } from "next";
import Link from "next/link";
import {
  evidenceRecords,
  getObservableById,
  reviewDecisions
} from "@/lib/data";
import { registryObservableHref } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Latest | AI Native Observatory",
  description:
    "Latest evidence updates, review decisions, sample updates, buyer questions, and method notes from AI Native Observatory."
};

const reportUpdates = [
  {
    title: "Frontier Claim Velocity",
    status: "Evidence visualization",
    note:
      "A neutral timeline shows public source-backed and reported public claims about frontier model and infrastructure scale without forecasting AGI.",
    href: "/evidence/frontier-claim-velocity"
  },
  {
    title: "AI21 Labs sample evidence brief",
    status: "Public sample",
    note:
      "A buyer-side sample brief shows how ANO converts source-backed public proof-of-work into decision-ready buyer intelligence.",
    href: "/sample-brief"
  },
  {
    title: "Custom research FAQ",
    status: "Research page update",
    note:
      "The research page now clarifies what buyers can request, how reports are produced, and what payment cannot change.",
    href: "/custom-research"
  }
];

const buyerQuestions = [
  "What public evidence supports this provider, model, infrastructure site, or data-policy claim?",
  "Which claims are source-backed, and which still need source review?",
  "What unresolved questions should a buyer raise before a vendor call?",
  "Which evidence records and review decisions support this reading?",
  "What does ANO not claim about this provider or claim?"
];

const methodNotes = [
  "Buyer-side AI infrastructure evidence research is separate from source submission and sponsorship.",
  "Manual fulfillment begins after scope review; reports are machine-assembled from structured evidence records and human-edited before delivery or publication.",
  "Source-backed status is an evidence-review outcome, not a paid product.",
  "The public site remains the evidence layer; reports are decision-ready buyer artifacts built from that layer."
];

export default function LatestPage() {
  const latestEvidence = evidenceRecords.slice(-6).reverse();
  const latestDecisions = reviewDecisions
    .slice()
    .sort((a, b) => b.reviewDate.localeCompare(a.reviewDate))
    .slice(0, 6);

  return (
    <div className="bg-[#03050d] text-white">
      <Hero
        eyebrow="Latest updates"
        title="Recent Observatory proof-of-work."
        description="A manually maintained view of recent evidence records, review decisions, sample/report updates, buyer questions, and method notes. This is not a blog system."
      />

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Latest Evidence Updates" eyebrow="Evidence records">
            <div className="grid gap-3">
              {latestEvidence.map((record) => (
                <article
                  key={record.id}
                  className="rounded border border-white/10 bg-[#03050d] p-4"
                >
                  <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                    {record.sourceType}
                  </p>
                  <h2 className="mt-2 text-base font-semibold text-white">
                    <Link href={`/evidence/${record.id}`} className="hover:text-[#d8edf8]">
                      {record.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">{record.publisher}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {record.notes}
                  </p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Latest Review Decisions" eyebrow="Review ledger">
            <div className="grid gap-3">
              {latestDecisions.map((decision) => {
                const observable = getObservableById(decision.observableId);

                return (
                  <article
                    key={decision.id}
                    className="rounded border border-white/10 bg-[#03050d] p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-[#8fb7cf]">
                      <span>{decision.reviewDate}</span>
                      <span>{decision.decision.replaceAll("_", " ")}</span>
                    </div>
                    <h2 className="mt-2 text-base font-semibold text-white">
                      {observable ? (
                        <Link
                          href={registryObservableHref(observable)}
                          className="hover:text-[#d8edf8]"
                        >
                          {observable.name}
                        </Link>
                      ) : (
                        decision.observableId
                      )}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {decision.reason}
                    </p>
                  </article>
                );
              })}
            </div>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Panel title="Latest Sample / Report Updates" eyebrow="Buyer artifacts">
            <div className="grid gap-3">
              {reportUpdates.map((update) => (
                <Link
                  key={update.title}
                  href={update.href}
                  className="rounded border border-white/10 bg-[#03050d] p-4 transition hover:border-[#8fb7cf]/60"
                >
                  <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                    {update.status}
                  </p>
                  <h2 className="mt-2 text-base font-semibold text-white">
                    {update.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {update.note}
                  </p>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Latest Buyer Questions" eyebrow="Research demand">
            <ul className="grid gap-3 text-sm text-slate-300">
              {buyerQuestions.map((question) => (
                <li key={question} className="rounded border border-white/10 bg-[#03050d] p-3">
                  {question}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Latest Method Notes" eyebrow="Method">
            <ul className="grid gap-3 text-sm text-slate-300">
              {methodNotes.map((note) => (
                <li key={note} className="rounded border border-white/10 bg-[#03050d] p-3">
                  {note}
                </li>
              ))}
            </ul>
          </Panel>
        </section>
      </main>
    </div>
  );
}

function Hero({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d]">
      <FieldTexture />
      <div className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <nav className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/" className="text-[#8fb7cf] hover:text-white">
            Home
          </Link>
          <Link href="/registry" className="text-[#8fb7cf] hover:text-white">
            Registry
          </Link>
          <Link href="/evidence" className="text-[#8fb7cf] hover:text-white">
            Evidence
          </Link>
          <Link href="/sample-brief" className="text-[#8fb7cf] hover:text-white">
            Sample Brief
          </Link>
        </nav>
        <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}

function Panel({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FieldTexture() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-35"
      style={{
        backgroundImage:
          "linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)",
        backgroundSize: "56px 56px"
      }}
    />
  );
}

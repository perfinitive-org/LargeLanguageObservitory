import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  evidenceRecords,
  getObservableById,
  getReviewDecisionById,
  getSourceById,
  observations,
  relationships
} from "@/lib/data";
import type { ReviewDecision } from "@/lib/types";

export const metadata: Metadata = {
  title: "Sample AI Infrastructure Evidence Brief | AI Native Observatory",
  description:
    "Public sample buyer-side evidence brief based on the AI21 Labs Observatory record."
};

const ai21 = getObservableById("org-ai21-labs");
const jamba = getObservableById("model-jamba-1-5-large");
const jambaSourceObservable = getObservableById("source-ai21-jamba");
const ai21Evidence = evidenceRecords.filter((record) =>
  record.linkedObservableIds.includes("org-ai21-labs")
);
const ai21Decisions = [
  getReviewDecisionById("review-batch-001-ai21-labs"),
  getReviewDecisionById("verification-pilot-ai21-labs-source-backed")
].filter((decision): decision is ReviewDecision => Boolean(decision));
const ai21Source = getSourceById("src-ai21-jamba");
const ai21Relationships = relationships.filter(
  (relationship) =>
    relationship.fromObservableId === "org-ai21-labs" ||
    relationship.toObservableId === "org-ai21-labs"
);
const ai21Observations = observations.filter(
  (observation) => observation.observableId === "org-ai21-labs"
);

export default function SampleBriefPage() {
  if (!ai21) {
    return (
      <div className="bg-[#03050d] px-5 py-20 text-white">
        <p>AI21 Labs sample data is not available in current ANO data.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#03050d] text-white">
      <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d]">
        <FieldTexture />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <nav className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/" className="text-[#8fb7cf] hover:text-white">
                Home
              </Link>
              <Link href="/custom-research" className="text-[#8fb7cf] hover:text-white">
                Custom Research
              </Link>
              <Link href="/registry/ai21-labs" className="text-[#8fb7cf] hover:text-white">
                AI21 Dossier
              </Link>
              <Link href="/transparency" className="text-[#8fb7cf] hover:text-white">
                Transparency
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Sample buyer-side evidence brief
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
              AI21 Labs evidence brief sample.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              This public sample shows how ANO converts source-backed public
              proof-of-work into decision-ready buyer intelligence while
              preserving caveats and unresolved questions.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/custom-research"
                className="rounded-md bg-[#8fb7cf] px-5 py-3 text-sm font-semibold text-[#07111c] transition hover:bg-white"
              >
                Request a custom evidence brief
              </Link>
              <Link
                href="/registry/ai21-labs"
                className="rounded-md border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8fb7cf]/70"
              >
                Open AI21 registry dossier
              </Link>
            </div>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#d39b50] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Disclaimer
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This sample is buyer-side research support. It is not legal
              advice, compliance certification, official approval, vendor
              endorsement, ranking, or a verification badge.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Panel title="Report Header" eyebrow="Sample scope">
            <dl className="grid gap-3 text-sm text-slate-300">
              <Meta label="Report type" value="AI Infrastructure Evidence Brief" />
              <Meta label="Entity / provider" value={ai21.name} />
              <Meta
                label="Question reviewed"
                value="What current ANO evidence supports the AI21 Labs organization record, and what should a buyer treat as unresolved?"
              />
              <Meta label="Public source basis" value="Current ANO repository data" />
              <Meta label="Not legal advice" value="Yes" />
              <Meta label="Not certification" value="Yes" />
            </dl>
          </Panel>

          <Panel title="Executive Summary" eyebrow="Buyer reading">
            <p className="text-sm leading-6 text-slate-300">
              AI21 Labs is currently tracked in ANO as a source-backed
              Organization observable. The organization record summary
              describes AI21 Labs as an AI company associated with Jamba and
              Jurassic model families, located in Tel Aviv, Israel, with tags
              for models, API, and enterprise AI.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              The narrow buyer-side reading is that current ANO data supports
              the existence and identity of the conservative AI21 Labs
              organization record for MVP registry use. Current ANO data does
              not establish detailed product capability, benchmark, deployment,
              model-family, funding, pricing, retention, security, or
              compliance claims.
            </p>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Panel title="What Was Reviewed" eyebrow="Record scope">
            <ul className="grid gap-2 text-sm text-slate-300">
              <li>Observable: `org-ai21-labs`</li>
              <li>Type: {ai21.type}</li>
              <li>Status: {ai21.status}</li>
              <li>Location: {ai21.location}</li>
              <li>Evidence records: {ai21Evidence.length}</li>
              <li>Review decisions: {ai21Decisions.length}</li>
              <li>Relationships: {ai21Relationships.length}</li>
              <li>Observations: {ai21Observations.length}</li>
            </ul>
          </Panel>

          <Panel title="Evidence Status Summary" eyebrow="Current ANO status">
            <div className="flex flex-wrap gap-2">
              <VerificationBadge status={ai21.verification_status} />
              {jamba ? <VerificationBadge status={jamba.verification_status} /> : null}
              {jambaSourceObservable ? (
                <VerificationBadge status={jambaSourceObservable.verification_status} />
              ) : null}
            </div>
            <ul className="mt-4 grid gap-3 text-sm text-slate-300">
              <li>Organization record: source-backed for MVP registry use.</li>
              <li>Jamba relationship rows: needs source review.</li>
              <li>Jamba source observable: source-backed source identity.</li>
            </ul>
          </Panel>

          <Panel title="Why This Matters" eyebrow="Buyer context">
            <p className="text-sm leading-6 text-slate-300">
              Buyers evaluating AI infrastructure providers need to distinguish
              basic organization identity from broader product, data-policy,
              infrastructure, and funding claims. This sample shows how ANO
              separates supported findings from unresolved buyer questions.
            </p>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Panel title="Source-Backed Findings" eyebrow="Supported by current data">
            <ul className="grid gap-3 text-sm text-slate-300">
              <li className="rounded border border-white/10 bg-[#03050d] p-3">
                AI21 Labs is a source-backed Organization observable in ANO.
              </li>
              <li className="rounded border border-white/10 bg-[#03050d] p-3">
                The AI21 Labs official website supports the existence and
                identity of the organization observable.
              </li>
              <li className="rounded border border-white/10 bg-[#03050d] p-3">
                Business Insider coverage supports external recognition of AI21
                as an AI company/startup.
              </li>
            </ul>
          </Panel>

          <Panel title="Needs-Review Items" eyebrow="Not settled">
            <ul className="grid gap-3 text-sm text-slate-300">
              <li className="rounded border border-white/10 bg-[#03050d] p-3">
                AI21 Labs to Jamba 1.5 Large relationship: needs source review.
              </li>
              <li className="rounded border border-white/10 bg-[#03050d] p-3">
                Jamba 1.5 Large to AI21 Labs reciprocal relationship: needs
                source review.
              </li>
              <li className="rounded border border-white/10 bg-[#03050d] p-3">
                AI21 Labs seed observation: needs source review.
              </li>
            </ul>
          </Panel>
        </section>

        <Panel title="Evidence Table" eyebrow="Claim support">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Claim</th>
                  <th className="px-3 py-3">Source</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Caveat / limitation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-300">
                <tr>
                  <td className="px-3 py-4">
                    AI21 Labs organization observable exists and is identifiable
                    for ANO registry use.
                  </td>
                  <td className="px-3 py-4">AI21 Labs official website</td>
                  <td className="px-3 py-4">Source-backed</td>
                  <td className="px-3 py-4">
                    Supports existence and identity only; does not establish
                    detailed product, data-policy, or procurement claims.
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-4">
                    AI21 has independent external recognition as an AI
                    company/startup.
                  </td>
                  <td className="px-3 py-4">Business Insider profile</td>
                  <td className="px-3 py-4">Source-backed</td>
                  <td className="px-3 py-4">
                    Current ANO data uses this as external recognition; this
                    sample does not independently validate funding details.
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-4">
                    AI21 Labs develops Jamba 1.5 Large.
                  </td>
                  <td className="px-3 py-4">Jamba product documentation</td>
                  <td className="px-3 py-4">Needs source review</td>
                  <td className="px-3 py-4">
                    Relationship records are currently marked needs source
                    review in ANO data.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Ownership / Funding Notes" eyebrow="Caveat">
            <p className="text-sm leading-6 text-slate-300">
              Current ANO data includes a Business Insider article titled
              &quot;Nvidia-backed Israeli AI startup AI21 is raising a $300
              million funding round.&quot; In this sample, that record is used
              only as independent industry/company profile evidence supporting
              external recognition of AI21 as an AI company/startup.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Specific ownership, investor, funding-round size, valuation,
              governance, or control claims are not established in current ANO
              data.
            </p>
          </Panel>

          <Panel title="Data-Policy Notes" eyebrow="Not established">
            <p className="text-sm leading-6 text-slate-300">
              Not established in current ANO data. A buyer should separately
              ask AI21 Labs for current documentation covering customer
              input/output retention, model-training use, enterprise controls,
              subprocessors, security documentation, and contract-specific
              terms.
            </p>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Panel title="Buyer Questions" eyebrow="Ask next">
            <ul className="grid gap-3 text-sm text-slate-300">
              {[
                "What current public documentation should buyers use for AI21 product and model-family claims?",
                "Does AI21 use customer inputs or outputs for model training by default?",
                "What retention period applies to customer inputs, outputs, logs, metadata, or embeddings?",
                "What security, privacy, subprocessor, and enterprise documentation is available?",
                "What public evidence supports current ownership, funding, or strategic-partner claims?"
              ].map((question) => (
                <li key={question} className="rounded border border-white/10 bg-[#03050d] p-3">
                  {question}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Limitations" eyebrow="What ANO does not claim">
            <ul className="grid gap-3 text-sm text-slate-300">
              {[
                "This sample uses current ANO data only.",
                "No web browsing, new source collection, source archival, or factual re-verification was performed for this public sample page.",
                "The sample does not establish legal, compliance, security, privacy, performance, procurement, benchmark, financial, or suitability conclusions.",
                "Needs-review relationships and observations remain needs-review.",
                "Source-backed status is limited to the conservative organization record and the specific review decision in current ANO data."
              ].map((limitation) => (
                <li key={limitation} className="rounded border border-white/10 bg-[#03050d] p-3">
                  {limitation}
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Evidence Records" eyebrow="Source appendix">
            <div className="grid gap-3">
              {ai21Evidence.map((record) => (
                <article key={record.id} className="rounded border border-white/10 bg-[#03050d] p-4">
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

          <Panel title="Review Decisions" eyebrow="Decision appendix">
            <div className="grid gap-3">
              {ai21Decisions.map((decision) => (
                <article key={decision.id} className="rounded border border-white/10 bg-[#03050d] p-4">
                  <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
                    {decision.reviewDate} / {decision.decision.replaceAll("_", " ")}
                  </p>
                  <h2 className="mt-2 text-base font-semibold text-white">
                    {decision.reviewer}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {decision.reason}
                  </p>
                </article>
              ))}
            </div>
          </Panel>
        </section>

        <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Final buyer-side reading
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Use ANO&apos;s AI21 Labs record as a source-backed organization
            identity and registry-context starting point. Treat Jamba-related
            relationship details, product capabilities, data-policy terms,
            security claims, and funding specifics as follow-up diligence areas
            unless separately supported by current evidence.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/custom-research"
              className="rounded-md bg-[#8fb7cf] px-5 py-3 text-sm font-semibold text-[#07111c] transition hover:bg-white"
            >
              Request a custom brief
            </Link>
            <Link
              href="/evidence"
              className="rounded-md border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8fb7cf]/70"
            >
              Browse evidence records
            </Link>
          </div>
        </section>

        {ai21Source ? (
          <p className="text-xs leading-5 text-slate-500">
            Linked source record used in this sample: {ai21Source.title} /{" "}
            {ai21Source.publisher} / {ai21Source.sourceType}.
          </p>
        ) : null}
      </main>
    </div>
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

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-[#03050d] p-3">
      <dt className="text-xs font-semibold uppercase text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-slate-300">{value}</dd>
    </div>
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

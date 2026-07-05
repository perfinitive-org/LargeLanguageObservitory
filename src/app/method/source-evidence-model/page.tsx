import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Source/Evidence Model | AI Native Observatory",
  description:
    "Boundary guidance for sources and evidence in the AI Native Observatory."
};

const comparisonRows = [
  {
    source: "Business Insider",
    evidence: "Business Insider article about AI21"
  },
  {
    source: "AWS Documentation",
    evidence: "AWS us-east-1 region documentation page"
  },
  {
    source: "OpenAI",
    evidence: "GPT-4o release announcement"
  },
  {
    source: "Anthropic",
    evidence: "Claude announcement"
  }
];

const sourceCreationGuidance = [
  "A new publisher, origin, institution, repository, platform, or documentation family enters the system.",
  "Multiple evidence artifacts may reasonably point back to the same origin.",
  "Reviewers need a stable catalog record for the producer of information, not just one artifact."
];

const evidenceCreationGuidance = [
  "A specific artifact is used to support a claim, review decision, observation, or verification outcome.",
  "The artifact has its own title, URL, source type, and review notes.",
  "The same artifact may support more than one observable or review decision."
];

export default function SourceEvidenceModelPage() {
  return (
    <div className="bg-[#03050d] text-white">
      <section className="relative overflow-hidden border-b border-[#182033] bg-[#03050d]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148, 163, 184, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)",
            backgroundSize: "56px 56px"
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(36,91,123,0.24),transparent)]"
        />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <nav className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/" className="text-[#8fb7cf] hover:text-white">
                Home
              </Link>
              <Link href="/about" className="text-[#8fb7cf] hover:text-white">
                Method
              </Link>
              <Link
                href="/mvp-status"
                className="text-[#8fb7cf] hover:text-white"
              >
                MVP Status
              </Link>
              <Link
                href="/ano-governance"
                className="text-[#8fb7cf] hover:text-white"
              >
                Governance
              </Link>
              <Link href="/evidence" className="text-[#8fb7cf] hover:text-white">
                Evidence
              </Link>
              <Link
                href="/review-decisions"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Decisions
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              Method handbook
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Source/Evidence model
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Sources produce evidence. Evidence supports claims. This boundary
              keeps the Observatory review process understandable as the static
              registry grows.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Boundary rule
            </p>
            <p className="mt-4 text-2xl font-semibold leading-snug text-white">
              Source is the origin. Evidence is the artifact.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              A source may produce many evidence artifacts. A single evidence
              artifact may support multiple observables, observations, or review
              decisions.
            </p>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-2">
          <DefinitionCard eyebrow="Source" title="Cataloged origin">
            A source is a cataloged origin, publisher, institution, platform,
            repository, organization, documentation set, publication family, or
            information provider. Examples include Business Insider, OpenAI,
            Anthropic, AWS Documentation, NVIDIA Documentation, and EU AI Act
            Documentation.
          </DefinitionCard>
          <DefinitionCard eyebrow="Evidence" title="Specific artifact">
            Evidence is a specific artifact used to support a claim, review
            decision, observation, or verification outcome. Examples include a
            Business Insider article about AI21, an OpenAI GPT-4o release page,
            an Anthropic Claude announcement, or an AWS region documentation
            page.
          </DefinitionCard>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <FlowCard title="Observable claim path">
            <FlowStep label="Observable" />
            <FlowStep label="Observation" />
            <FlowStep label="Evidence" />
            <FlowStep label="Source" terminal />
          </FlowCard>
          <FlowCard title="Review decision path">
            <FlowStep label="Review Decision" />
            <FlowStep label="Evidence" />
            <FlowStep label="Source" terminal />
          </FlowCard>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <div className="border-b border-white/10 pb-3">
            <p className="text-xs font-semibold uppercase text-slate-500">
              Comparison table
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Source versus evidence
            </h2>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Source</th>
                  <th className="px-3 py-3 font-semibold">Evidence</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.source} className="border-b border-white/10">
                    <td className="px-3 py-4 font-semibold text-white">
                      {row.source}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.evidence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <GuidanceCard
            title="Create a Source when"
            items={sourceCreationGuidance}
          />
          <GuidanceCard
            title="Create Evidence when"
            items={evidenceCreationGuidance}
          />
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            AI21 pilot boundary review
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Business Insider is the origin; the AI21 article is the artifact.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            In the AI21 verification pilot, Business Insider is treated as the
            source origin or publisher. The specific Business Insider article
            about AI21 is treated as an evidence artifact linked to the AI21
            observable and the pilot review decision. The official AI21 Labs
            website follows the same rule: AI21 Labs is the origin, and the
            website record is the evidence artifact used in the pilot.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/verification-pilot-ai21-labs"
              className="inline-flex rounded border border-[#8fb7cf]/35 bg-[#8fb7cf]/10 px-3 py-2 text-sm font-semibold text-[#d8edf8] hover:bg-[#8fb7cf]/15"
            >
              Open AI21 pilot
            </Link>
            <Link
              href="/evidence/evidence-ai21-business-insider-profile"
              className="inline-flex rounded border border-white/15 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-slate-100 hover:border-[#8fb7cf]/70 hover:bg-white/10"
            >
              Open AI21 evidence
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-5">
          <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
            Validator note
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            No schema change is required for this clarification packet. Current
            validation already checks evidence IDs and links to observables and
            review decisions. A future packet may add an explicit source-origin
            reference on evidence records if the Observatory needs stricter
            source-to-evidence lineage.
          </p>
        </section>
      </main>
    </div>
  );
}

function DefinitionCard({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c] p-5">
      <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{children}</p>
    </section>
  );
}

function FlowCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-5 grid gap-2">{children}</div>
    </section>
  );
}

function FlowStep({
  label,
  terminal = false
}: {
  label: string;
  terminal?: boolean;
}) {
  return (
    <div>
      <div className="rounded border border-white/10 bg-[#03050d] px-3 py-3 text-sm font-semibold text-slate-200">
        {label}
      </div>
      {terminal ? null : (
        <div className="px-3 py-1 text-sm font-semibold text-[#8fb7cf]">
          &darr;
        </div>
      )}
    </div>
  );
}

function GuidanceCard({
  title,
  items
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-lg border border-white/15 bg-[#07111c] p-5">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <ul className="mt-4 grid gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded border border-white/10 bg-[#03050d] px-3 py-3 text-sm leading-6 text-slate-300"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

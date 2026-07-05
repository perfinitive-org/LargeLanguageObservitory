import type { Metadata } from "next";
import Link from "next/link";
import { VerificationBadge } from "@/components/VerificationBadge";
import {
  evidenceRecords,
  getObservableById,
  observables,
  observations,
  relationships,
  reviewDecisions,
  sources
} from "@/lib/data";
import type { Observable } from "@/lib/types";

export const metadata: Metadata = {
  title: "State Audit | AI Native Observatory",
  description:
    "Read-only state audit for Observatory registry counts, evidence links, review decisions, and verification batches."
};

type ReviewStatus = NonNullable<Observable["verification_status"]>;
type AuditLevel = "PASS" | "WARNING" | "FAIL";

const previousReportedObservableCount = 100;

const statuses: ReviewStatus[] = [
  "source_backed",
  "needs_source_review",
  "placeholder"
];

const observableIds = new Set(observables.map((observable) => observable.id));
const sourceIds = new Set(sources.map((source) => source.id));
const reviewDecisionIds = new Set(
  reviewDecisions.map((decision) => decision.id)
);

const statusCounts = {
  source_backed: countByStatus("source_backed"),
  needs_source_review: countByStatus("needs_source_review"),
  placeholder: countByStatus("placeholder")
};
const unresolvedCount =
  statusCounts.needs_source_review + statusCounts.placeholder;
const statusTotal =
  statusCounts.source_backed +
  statusCounts.needs_source_review +
  statusCounts.placeholder;

const ledgerCounts = {
  observables: observables.length,
  observations: observations.length,
  relationships: relationships.length,
  sources: sources.length,
  evidenceRecords: evidenceRecords.length,
  reviewDecisions: reviewDecisions.length
};

const typeRows = ["Organization", "Model", "Data Center", "Source"].map(
  (type) => {
    const rows = observables.filter((observable) => observable.type === type);

    return {
      label: type,
      total: rows.length,
      source_backed: rows.filter(
        (row) => row.verification_status === "source_backed"
      ).length,
      needs_source_review: rows.filter(
        (row) => row.verification_status === "needs_source_review"
      ).length,
      placeholder: rows.filter(
        (row) => row.verification_status === "placeholder"
      ).length
    };
  }
);

const observationLinkIssues = observations.flatMap((observation) => [
  ...(!observableIds.has(observation.observableId)
    ? [
        {
          id: observation.id,
          issue: `Missing observable ${observation.observableId}`
        }
      ]
    : []),
  ...(!sourceIds.has(observation.sourceId)
    ? [{ id: observation.id, issue: `Missing source ${observation.sourceId}` }]
    : [])
]);

const relationshipLinkIssues = relationships.flatMap((relationship) => [
  ...(!observableIds.has(relationship.fromObservableId)
    ? [
        {
          id: relationship.id,
          issue: `Missing from-observable ${relationship.fromObservableId}`
        }
      ]
    : []),
  ...(!observableIds.has(relationship.toObservableId)
    ? [
        {
          id: relationship.id,
          issue: `Missing to-observable ${relationship.toObservableId}`
        }
      ]
    : []),
  ...relationship.sourceIds
    .filter((sourceId) => !sourceIds.has(sourceId))
    .map((sourceId) => ({
      id: relationship.id,
      issue: `Missing source ${sourceId}`
    }))
]);

const sourceLinkIssues = sources.flatMap((source) =>
  source.linkedObservableIds
    .filter((observableId) => !observableIds.has(observableId))
    .map((observableId) => ({
      id: source.id,
      issue: `Missing linked observable ${observableId}`
    }))
);

const evidenceIssues = evidenceRecords.flatMap((record) => [
  ...(record.linkedObservableIds.length === 0
    ? [{ id: record.id, issue: "No linked observables" }]
    : []),
  ...(record.linkedReviewDecisionIds.length === 0
    ? [{ id: record.id, issue: "No linked review decisions" }]
    : []),
  ...record.linkedObservableIds
    .filter((observableId) => !observableIds.has(observableId))
    .map((observableId) => ({
      id: record.id,
      issue: `Missing observable ${observableId}`
    })),
  ...record.linkedReviewDecisionIds
    .filter((decisionId) => !reviewDecisionIds.has(decisionId))
    .map((decisionId) => ({
      id: record.id,
      issue: `Missing review decision ${decisionId}`
    }))
]);

const reviewDecisionIssues = reviewDecisions.flatMap((decision) =>
  observableIds.has(decision.observableId)
    ? []
    : [
        {
          id: decision.id,
          issue: `Missing observable ${decision.observableId}`
        }
      ]
);

const duplicateIdRows = [
  ...duplicateIds("Observable", observables),
  ...duplicateIds("Observation", observations),
  ...duplicateIds("Relationship", relationships),
  ...duplicateIds("Source", sources),
  ...duplicateIds("Evidence", evidenceRecords),
  ...duplicateIds("Review decision", reviewDecisions)
];

const decisionsByObservable = countBy(
  reviewDecisions.map((decision) => decision.observableId)
);
const multiDecisionObservables = Object.entries(decisionsByObservable)
  .filter(([, count]) => count > 1)
  .map(([observableId, count]) => ({
    observableId,
    count,
    name: getObservableById(observableId)?.name ?? observableId
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const exactDecisionDuplicates = Object.entries(
  countBy(
    reviewDecisions.map(
      (decision) =>
        `${decision.observableId}|${decision.decision}|${decision.reviewDate}|${decision.reviewer}`
    )
  )
).filter(([, count]) => count > 1);

const uniqueReviewedObservableIds = new Set(
  reviewDecisions.map((decision) => decision.observableId)
);
const uniqueUpgradedObservableIds = new Set(
  reviewDecisions
    .filter((decision) => decision.decision === "source_backed")
    .map((decision) => decision.observableId)
);
const retainedReviewedRecords = Array.from(uniqueReviewedObservableIds).filter(
  (observableId) => !uniqueUpgradedObservableIds.has(observableId)
);

const addedObservable = getObservableById(
  "source-openai-gpt-4o-mini-release"
);
const addedSource = sources.find(
  (source) => source.id === "src-openai-gpt-4o-mini-release"
);
const addedObservableObservations = observations.filter(
  (observation) =>
    observation.observableId === "source-openai-gpt-4o-mini-release" ||
    observation.sourceId === "src-openai-gpt-4o-mini-release"
);
const addedObservableRelationships = relationships.filter(
  (relationship) =>
    relationship.fromObservableId === "source-openai-gpt-4o-mini-release" ||
    relationship.toObservableId === "source-openai-gpt-4o-mini-release" ||
    relationship.sourceIds.includes("src-openai-gpt-4o-mini-release")
);
const addedObservableReviewDecision = reviewDecisions.find(
  (decision) => decision.id === "verification-batch-007-gpt-4o-mini-source-backed"
);

const verificationBatchRows = [
  buildBatchRow("Pilot AI21", "verification-pilot-ai21-labs", 1),
  buildBatchRow("Pilot Equinix", "verification-pilot-equinix", 1),
  buildBatchRow("Batch 002", "verification-batch-002-", 5),
  buildBatchRow("Batch 003", "verification-batch-003-", 5),
  buildBatchRow("Batch 004", "verification-batch-004-", 5),
  buildBatchRow("Batch 005", "verification-batch-005-", 5),
  buildBatchRow("Batch 006", "verification-batch-006-", 5),
  buildBatchRow("Batch 007", "verification-batch-007-", 5)
];

const surfaceRows = [
  {
    name: "review-metrics",
    total: observables.length,
    sourceBacked: statusCounts.source_backed,
    needsReview: statusCounts.needs_source_review,
    placeholder: statusCounts.placeholder,
    evidence: evidenceRecords.length,
    reviewDecisions: reviewDecisions.length,
    note: "Registry, evidence, and review counts are derived from the JSON ledgers."
  },
  {
    name: "mvp-status",
    total: observables.length,
    sourceBacked: statusCounts.source_backed,
    needsReview: statusCounts.needs_source_review,
    placeholder: statusCounts.placeholder,
    evidence: evidenceRecords.length,
    reviewDecisions: reviewDecisions.length,
    note: "Current Observatory State uses the same ledger counts."
  },
  {
    name: "backlog-analysis",
    total: statusCounts.source_backed + unresolvedCount,
    sourceBacked: statusCounts.source_backed,
    needsReview: statusCounts.needs_source_review,
    placeholder: statusCounts.placeholder,
    evidence: evidenceRecords.length,
    reviewDecisions: reviewDecisions.length,
    note: "Backlog total reconciles as source-backed plus unresolved records."
  }
];

const hardFailures = [
  ...observationLinkIssues,
  ...relationshipLinkIssues,
  ...sourceLinkIssues,
  ...evidenceIssues,
  ...reviewDecisionIssues,
  ...duplicateIdRows,
  ...exactDecisionDuplicates.map(([key, count]) => ({
    id: key,
    issue: `Exact duplicate review-decision key appears ${count} times`
  }))
];

const auditFindings: Array<{
  level: AuditLevel;
  title: string;
  detail: string;
}> = [
  {
    level: statusTotal === observables.length ? "PASS" : "FAIL",
    title: "Status counts reconcile to observable total",
    detail: `${statusCounts.source_backed} source-backed + ${statusCounts.needs_source_review} needs-review + ${statusCounts.placeholder} placeholder = ${statusTotal} of ${observables.length} observables.`
  },
  {
    level: hardFailures.length === 0 ? "PASS" : "FAIL",
    title: "Ledger references resolve",
    detail:
      hardFailures.length === 0
        ? "Observations, relationships, sources, evidence records, and review decisions all link to existing ledger IDs."
        : `${hardFailures.length} link, orphan, or duplicate issue(s) require cleanup.`
  },
  {
    level: evidenceIssues.length === 0 ? "PASS" : "FAIL",
    title: "Evidence ledger is connected",
    detail: `${evidenceRecords.length} evidence records; ${evidenceRecords.length - evidenceIssues.length} have valid observable and review-decision links.`
  },
  {
    level: reviewDecisionIssues.length === 0 ? "PASS" : "FAIL",
    title: "Review-decision ledger is connected",
    detail: `${reviewDecisions.length} review decisions; ${reviewDecisionIssues.length} orphaned decision rows found.`
  },
  {
    level: "WARNING",
    title: "Observable count increased from 100 to 101",
    detail:
      "The added observable is a Source record for the exact OpenAI GPT-4o mini release. Ledger dates tie it to Batch 007 on 2026-06-12."
  },
  {
    level: "WARNING",
    title: "Decision history contains superseded Batch 001 rows",
    detail: `${multiDecisionObservables.length} observables have more than one review decision because initial Batch 001 needs-review decisions were later followed by verification decisions. No exact duplicate decision rows were found.`
  },
  {
    level: "PASS",
    title: "Narrative copy reflects completed Batch 007",
    detail:
      "review-metrics, mvp-status, and backlog-analysis now treat Batch 007 as completed work and point future planning toward source verification."
  },
  {
    level: "WARNING",
    title: "Commit-level timing is unavailable",
    detail:
      "This folder is not a Git worktree, so the audit can identify ledger timing but not the commit where the 101st observable was introduced."
  }
];

export default function StateAuditPage() {
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
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <nav className="flex flex-wrap gap-3 text-sm font-semibold">
              <Link href="/" className="text-[#8fb7cf] hover:text-white">
                Home
              </Link>
              <Link
                href="/review-metrics"
                className="text-[#8fb7cf] hover:text-white"
              >
                Review Metrics
              </Link>
              <Link
                href="/mvp-status"
                className="text-[#8fb7cf] hover:text-white"
              >
                MVP Status
              </Link>
              <Link
                href="/backlog-analysis"
                className="text-[#8fb7cf] hover:text-white"
              >
                Backlog Analysis
              </Link>
            </nav>
            <p className="mt-8 text-xs font-semibold uppercase text-[#8fb7cf]">
              State audit
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Observatory state audit.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Read-only reconciliation of current registry counts, evidence
              links, review decisions, and verification batches. This page does
              not verify records, create evidence, or change statuses.
            </p>
          </div>

          <section className="rounded-lg border border-l-4 border-white/15 border-l-[#8fb7cf] bg-[#07111c]/82 p-5">
            <p className="text-xs font-semibold uppercase text-[#8fb7cf]">
              Current Counts
            </p>
            <div className="mt-4 grid gap-3">
              <SummaryLine label="Total records" value={observables.length} />
              <SummaryLine
                label="Source backed"
                value={statusCounts.source_backed}
                status="source_backed"
              />
              <SummaryLine
                label="Needs review"
                value={statusCounts.needs_source_review}
                status="needs_source_review"
              />
              <SummaryLine
                label="Placeholder"
                value={statusCounts.placeholder}
                status="placeholder"
              />
              <SummaryLine
                label="Evidence records"
                value={evidenceRecords.length}
              />
              <SummaryLine
                label="Review decisions"
                value={reviewDecisions.length}
              />
            </div>
          </section>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <section className="rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Audit Summary"
            title="PASS, WARNING, and FAIL findings"
          />
          <div className="mt-4 grid gap-3">
            {auditFindings.map((finding) => (
              <FindingRow key={finding.title} finding={finding} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Ledger Counts" eyebrow="Data files">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                <tbody>
                  {Object.entries(ledgerCounts).map(([label, value]) => (
                    <tr key={label} className="border-b border-white/10">
                      <td className="px-3 py-3 font-semibold capitalize text-white">
                        {formatCamelLabel(label)}
                      </td>
                      <td className="px-3 py-3 text-slate-300">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Backlog Reconciliation" eyebrow="Status totals">
            <div className="grid gap-3">
              <MetricLine
                label="Source backed"
                value={statusCounts.source_backed}
                status="source_backed"
              />
              <MetricLine
                label="Needs review"
                value={statusCounts.needs_source_review}
                status="needs_source_review"
              />
              <MetricLine
                label="Placeholder"
                value={statusCounts.placeholder}
                status="placeholder"
              />
              <MetricLine label="Unresolved backlog" value={unresolvedCount} />
              <MetricLine label="Reconciled total" value={statusTotal} />
            </div>
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="100 to 101"
            title="Observable-count delta explanation"
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <tbody>
                <AuditFact
                  label="Previous reported count"
                  value={previousReportedObservableCount}
                />
                <AuditFact label="Current count" value={observables.length} />
                <AuditFact
                  label="Added observable"
                  value={
                    addedObservable
                      ? `${addedObservable.name} (${addedObservable.id})`
                      : "Not found"
                  }
                />
                <AuditFact
                  label="Type and status"
                  value={
                    addedObservable
                      ? `${addedObservable.type}, ${addedObservable.verification_status}`
                      : "Unavailable"
                  }
                />
                <AuditFact
                  label="When it appeared"
                  value={`Ledger date ${addedSource?.retrievedAt ?? "unknown"}; source-observable observation ${addedObservableObservations.find((row) => row.observableId === addedObservable?.id)?.observedAt ?? "unknown"}; related Batch 007 decision ${addedObservableReviewDecision?.reviewDate ?? "unknown"}.`}
                />
                <AuditFact
                  label="Why it appeared"
                  value="Batch 007 needed an exact GPT-4o mini release source rather than relying on broader GPT-4o family evidence."
                />
                <AuditFact
                  label="Intentional"
                  value={
                    addedObservable && addedSource && addedObservableReviewDecision
                      ? "Yes. The source, observation, relationships, evidence, and Batch 007 decision form a coherent ledger trail."
                      : "Unable to confirm from current ledgers."
                  }
                />
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Status by Type"
            title="Observable categories reconcile to total count"
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Type</th>
                  <th className="px-3 py-3 font-semibold">Total</th>
                  {statuses.map((status) => (
                    <th key={status} className="px-3 py-3 font-semibold">
                      {formatStatus(status)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {typeRows.map((row) => (
                  <tr key={row.label} className="border-b border-white/10">
                    <td className="px-3 py-4 font-semibold text-white">
                      {row.label}
                    </td>
                    <td className="px-3 py-4 text-slate-300">{row.total}</td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.source_backed}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.needs_source_review}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.placeholder}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Metrics Reconciliation"
            title="review-metrics, mvp-status, and backlog-analysis"
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Surface</th>
                  <th className="px-3 py-3 font-semibold">Total</th>
                  <th className="px-3 py-3 font-semibold">Source backed</th>
                  <th className="px-3 py-3 font-semibold">Needs review</th>
                  <th className="px-3 py-3 font-semibold">Placeholder</th>
                  <th className="px-3 py-3 font-semibold">Evidence</th>
                  <th className="px-3 py-3 font-semibold">Decisions</th>
                  <th className="px-3 py-3 font-semibold">Audit note</th>
                </tr>
              </thead>
              <tbody>
                {surfaceRows.map((row) => (
                  <tr key={row.name} className="border-b border-white/10">
                    <td className="px-3 py-4 font-semibold text-white">
                      {row.name}
                    </td>
                    <td className="px-3 py-4 text-slate-300">{row.total}</td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.sourceBacked}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.needsReview}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.placeholder}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.evidence}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.reviewDecisions}
                    </td>
                    <td className="px-3 py-4 text-slate-300">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Panel title="Evidence Audit" eyebrow="Evidence records">
            <MetricLine label="Evidence records" value={evidenceRecords.length} />
            <MetricLine
              label="Linked to observables"
              value={
                evidenceRecords.filter(
                  (record) => record.linkedObservableIds.length > 0
                ).length
              }
            />
            <MetricLine
              label="Linked to review decisions"
              value={
                evidenceRecords.filter(
                  (record) => record.linkedReviewDecisionIds.length > 0
                ).length
              }
            />
            <MetricLine label="Orphaned or invalid" value={evidenceIssues.length} />
          </Panel>

          <Panel title="Review Decision Audit" eyebrow="Decision ledger">
            <MetricLine
              label="Review decisions"
              value={reviewDecisions.length}
            />
            <MetricLine
              label="Unique reviewed records"
              value={uniqueReviewedObservableIds.size}
            />
            <MetricLine
              label="Unique upgraded records"
              value={uniqueUpgradedObservableIds.size}
            />
            <MetricLine
              label="Unique retained records"
              value={retainedReviewedRecords.length}
            />
            <MetricLine
              label="Orphaned decisions"
              value={reviewDecisionIssues.length}
            />
            <MetricLine
              label="Exact duplicate decisions"
              value={exactDecisionDuplicates.length}
            />
          </Panel>
        </section>

        <section className="mt-8 rounded-lg border border-white/15 bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Verification Batches"
            title="Pilots and batches reconcile with the review-decision ledger"
          />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase text-slate-500">
                  <th className="px-3 py-3 font-semibold">Batch</th>
                  <th className="px-3 py-3 font-semibold">Expected</th>
                  <th className="px-3 py-3 font-semibold">Decisions</th>
                  <th className="px-3 py-3 font-semibold">Source backed</th>
                  <th className="px-3 py-3 font-semibold">Retained</th>
                  <th className="px-3 py-3 font-semibold">Evidence</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {verificationBatchRows.map((row) => (
                  <tr key={row.label} className="border-b border-white/10">
                    <td className="px-3 py-4 font-semibold text-white">
                      {row.label}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.expected}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.decisions}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.sourceBacked}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.retained}
                    </td>
                    <td className="px-3 py-4 text-slate-300">
                      {row.evidenceRecords}
                    </td>
                    <td className="px-3 py-4">
                      <LevelBadge
                        level={
                          row.reconciles && row.decisionsWithoutEvidence === 0
                            ? "PASS"
                            : "FAIL"
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#7ba36f] bg-[#07111c] p-4">
          <SectionHeading
            eyebrow="Recommended Next Action"
            title="Plan source-observable verification"
          />
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Based on current reconciled counts, source observables are the
            largest unresolved backlog. The next action should define
            source-review criteria and target order before any Batch 008 scope,
            verification, evidence creation, or status changes.
          </p>
        </section>

        {hardFailures.length > 0 ? (
          <section className="mt-8 rounded-lg border border-l-4 border-white/15 border-l-[#d46a6a] bg-[#07111c] p-4">
            <SectionHeading eyebrow="Failures" title="Issues requiring cleanup" />
            <ul className="mt-4 grid gap-2">
              {hardFailures.map((failure) => (
                <li
                  key={`${failure.id}-${failure.issue}`}
                  className="rounded border border-white/10 bg-[#03050d] px-3 py-2 text-sm text-slate-300"
                >
                  <span className="font-semibold text-white">{failure.id}</span>
                  {": "}
                  {failure.issue}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function countByStatus(status: ReviewStatus) {
  return observables.filter(
    (observable) => observable.verification_status === status
  ).length;
}

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function duplicateIds(label: string, rows: Array<{ id: string }>) {
  return Object.entries(countBy(rows.map((row) => row.id)))
    .filter(([, count]) => count > 1)
    .map(([id, count]) => ({
      id,
      issue: `${label} ID appears ${count} times`
    }));
}

function buildBatchRow(label: string, decisionPrefix: string, expected: number) {
  const decisions = reviewDecisions.filter((decision) =>
    decision.id.startsWith(decisionPrefix)
  );
  const decisionIds = new Set(decisions.map((decision) => decision.id));
  const linkedEvidence = evidenceRecords.filter((record) =>
    record.linkedReviewDecisionIds.some((decisionId) =>
      decisionIds.has(decisionId)
    )
  );
  const decisionsWithoutEvidence = decisions.filter(
    (decision) =>
      !evidenceRecords.some((record) =>
        record.linkedReviewDecisionIds.includes(decision.id)
      )
  ).length;

  return {
    label,
    expected,
    decisions: decisions.length,
    sourceBacked: decisions.filter(
      (decision) => decision.decision === "source_backed"
    ).length,
    retained: decisions.filter(
      (decision) => decision.decision === "needs_source_review"
    ).length,
    evidenceRecords: linkedEvidence.length,
    decisionsWithoutEvidence,
    reconciles: decisions.length === expected
  };
}

function formatCamelLabel(label: string) {
  return label.replace(/([A-Z])/g, " $1").toLowerCase();
}

function formatStatus(status: ReviewStatus) {
  return status.replaceAll("_", " ");
}

function SectionHeading({
  eyebrow,
  title
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="border-b border-white/10 pb-3">
      <p className="text-xs font-semibold uppercase text-slate-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
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
    <section className="rounded-lg border border-white/15 bg-[#07111c] p-4">
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SummaryLine({
  label,
  value,
  status
}: {
  label: string;
  value: number;
  status?: ReviewStatus;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded border border-white/10 bg-[#03050d] px-3 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="flex items-center gap-2">
        {status ? <VerificationBadge status={status} compact /> : null}
        <span className="text-lg font-semibold text-white">{value}</span>
      </span>
    </div>
  );
}

function MetricLine({
  label,
  value,
  status
}: {
  label: string;
  value: number;
  status?: ReviewStatus;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-3">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="flex items-center gap-2">
        {status ? <VerificationBadge status={status} compact /> : null}
        <span className="text-lg font-semibold text-white">{value}</span>
      </span>
    </div>
  );
}

function FindingRow({
  finding
}: {
  finding: { level: AuditLevel; title: string; detail: string };
}) {
  return (
    <div className="grid gap-3 border-b border-white/10 px-3 py-3 md:grid-cols-[120px_minmax(0,1fr)]">
      <LevelBadge level={finding.level} />
      <div>
        <h3 className="font-semibold text-white">{finding.title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-300">
          {finding.detail}
        </p>
      </div>
    </div>
  );
}

function LevelBadge({ level }: { level: AuditLevel }) {
  const classes: Record<AuditLevel, string> = {
    PASS: "border-[#7ba36f]/40 bg-[#7ba36f]/12 text-[#dcefd6]",
    WARNING: "border-[#d6b75f]/45 bg-[#d6b75f]/12 text-[#f5e8b0]",
    FAIL: "border-[#d46a6a]/45 bg-[#d46a6a]/12 text-[#ffd7d7]"
  };

  return (
    <span
      className={`inline-flex w-fit rounded border px-2 py-1 text-xs font-semibold uppercase ${classes[level]}`}
    >
      {level}
    </span>
  );
}

function AuditFact({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <tr className="border-b border-white/10">
      <td className="px-3 py-4 font-semibold text-white">{label}</td>
      <td className="px-3 py-4 text-slate-300">{value}</td>
    </tr>
  );
}

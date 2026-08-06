# Data Science Additions Technical Notes

This document is the implementation appendix for the data-science additions on `feature/claim-evidence-registry`.

It is meant for future maintainers, reviewers, and LLM-assisted development sessions that need precise file-level context.

## Branch And Commit Stack

Current branch:

```text
feature/claim-evidence-registry
```

Base branch observed locally:

```text
origin/main at 7672b1c Constrain frontier claim authoring path
```

Branch commits:

```text
e2489c7 feat: add Claim Evidence Registry as the backbone measurement object
a28a015 feat: add Source Quality Reports as a computed measurement layer
d637900 feat: add Governance Gap Matrix, seeded honestly at not_yet_assessed
fbb8a24 feat: add Platform Portability Scorecards, seeded honestly at not_yet_assessed
ead1b2e feat: add Meaningful Human Decision Audits, seeded honestly at not_yet_assessed
942d6cf feat: add Continuity Rupture Incident Reports as an empty, source-required log
```

## Files Added Or Changed

### Data Files

```text
data/claim-evidence-registry.json
data/governance-gap-matrix.json
data/platform-portability-scorecards.json
data/human-decision-audits.json
data/continuity-rupture-incidents.json
```

Current row counts:

```text
claim-evidence-registry.json: 101
governance-gap-matrix.json: 150
platform-portability-scorecards.json: 175
human-decision-audits.json: 100
continuity-rupture-incidents.json: 0
```

### Library Files

```text
src/lib/claimEvidenceRegistry.ts
src/lib/sourceQuality.ts
src/lib/governanceGapMatrix.ts
src/lib/platformPortability.ts
src/lib/humanDecisionAudits.ts
src/lib/continuityRuptureIncidents.ts
```

### Public Routes

```text
src/app/claims/page.tsx
src/app/source-quality/page.tsx
src/app/governance-gaps/page.tsx
src/app/platform-portability/page.tsx
src/app/human-decision-audits/page.tsx
src/app/continuity-incidents/page.tsx
```

### Validation

```text
scripts/validate-data.mjs
```

The validator now knows about the new data files, enum sets, duplicate checks, reference checks, and blocking rules for assessed states.

## Data Models

### Claim Evidence Registry

Source file:

```text
data/claim-evidence-registry.json
```

Library:

```text
src/lib/claimEvidenceRegistry.ts
```

Record shape:

```ts
{
  id: string;
  text: string;
  subject_label: string;
  subject_observable_id: string | null;
  source_ids: string[];
  status: "supported" | "partially_supported" | "needs_review" | "contested" | "unsupported" | "out_of_scope" | "protected";
  uncertainty: "low" | "medium" | "high";
  review_date: string;
  reviewer: string;
  evidence_type: string;
  notes: string;
}
```

Blocking rule:

```text
supported / partially_supported / contested claims require source_ids.
```

### Source Quality Reports

Source Quality Reports do not have a dedicated data file. They are computed from:

```text
data/sources.json
data/claim-evidence-registry.json
```

Library:

```text
src/lib/sourceQuality.ts
```

Computed fields:

```text
typeTier
freshnessTier
daysSinceRetrieved
claimCount
subjectCount
diversityTier
counterevidenceCount
counterevidenceTier
overallTier
```

Freshness is computed relative to the most recently retrieved source in the dataset, not the machine clock. That keeps the output reproducible.

### Governance Gap Matrix

Source file:

```text
data/governance-gap-matrix.json
```

Library:

```text
src/lib/governanceGapMatrix.ts
```

Record shape:

```ts
{
  id: string;
  subject_observable_id: string;
  subject_label: string;
  dimension: "portability" | "consent" | "context" | "auditability" | "appeal" | "continuity";
  status: "recognized" | "partially_recognized" | "not_recognized" | "not_yet_assessed" | "out_of_scope";
  claim_id: string | null;
  notes: string;
  last_reviewed: string;
}
```

Current behavior:

```text
All 150 cells are seeded as not_yet_assessed.
```

Blocking rule:

```text
recognized / partially_recognized / not_recognized require claim_id.
```

### Platform Portability Scorecards

Source file:

```text
data/platform-portability-scorecards.json
```

Library:

```text
src/lib/platformPortability.ts
```

Record shape:

```ts
{
  id: string;
  subject_observable_id: string;
  subject_label: string;
  dimension: "raw_data_export" | "context_export" | "memory_visibility" | "deletion_controls" | "appeal_path" | "workflow_continuity" | "recovery";
  status: "supported" | "partially_supported" | "not_supported" | "not_yet_assessed" | "out_of_scope";
  claim_id: string | null;
  notes: string;
  last_reviewed: string;
}
```

Current behavior:

```text
All 175 cells are seeded as not_yet_assessed.
```

Blocking rule:

```text
supported / partially_supported / not_supported require claim_id.
```

### Meaningful Human Decision Audits

Source file:

```text
data/human-decision-audits.json
```

Library:

```text
src/lib/humanDecisionAudits.ts
```

Record shape:

```ts
{
  id: string;
  subject_observable_id: string;
  subject_label: string;
  dimension: "awareness" | "authority" | "accountability" | "time";
  status: "meaningful" | "partially_meaningful" | "not_meaningful" | "not_yet_assessed" | "out_of_scope";
  claim_id: string | null;
  notes: string;
  last_reviewed: string;
}
```

Current behavior:

```text
All 100 cells are seeded as not_yet_assessed.
```

Blocking rule:

```text
meaningful / partially_meaningful / not_meaningful require claim_id.
```

### Continuity Rupture Incident Reports

Source file:

```text
data/continuity-rupture-incidents.json
```

Library:

```text
src/lib/continuityRuptureIncidents.ts
```

Record shape:

```ts
{
  id: string;
  subject_observable_id: string;
  subject_label: string;
  incident_type: "reset" | "migration" | "policy_change" | "account_lockout" | "workflow_loss";
  description: string;
  claim_id: string;
  occurred_date: string | null;
  reported_date: string;
  severity: "minor" | "moderate" | "severe" | "unknown";
}
```

Current behavior:

```text
The incident log is intentionally empty.
```

Blocking rule:

```text
Every non-empty incident record requires claim_id.
```

There is no `not_yet_assessed` state for incidents because the layer is a log, not a matrix.

## Validator Behavior

Validator file:

```text
scripts/validate-data.mjs
```

New validator coverage:

```text
claim-evidence-registry.json must be an array
governance-gap-matrix.json must be an array
platform-portability-scorecards.json must be an array
human-decision-audits.json must be an array
continuity-rupture-incidents.json must be an array
```

Duplicate checks:

```text
Duplicate claim evidence record id
Duplicate governance gap record id
Duplicate portability record id
Duplicate human decision audit record id
Duplicate continuity rupture incident id
```

Reference checks:

```text
subject_observable_id must reference an existing observable
source_ids must reference existing sources
claim_id must reference an existing claim evidence record
```

Date checks:

```text
review_date must be YYYY-MM-DD
last_reviewed must be YYYY-MM-DD
reported_date must be YYYY-MM-DD
occurred_date must be YYYY-MM-DD or null
```

Blocking rule summary:

```text
No source-backed claim status without source_ids.
No assessed governance gap status without claim_id.
No assessed portability status without claim_id.
No assessed human-decision audit status without claim_id.
No continuity rupture incident without claim_id.
```

## Rendering Behavior

### Matrix Pages

The following routes render matrix-style views:

```text
/governance-gaps
/platform-portability
/human-decision-audits
```

These pages group records by subject and render one cell per dimension. They show `not_yet_assessed` as an honest unreviewed state, not as a negative finding.

### Claim And Source Pages

The following routes render evidence and source quality views:

```text
/claims
/source-quality
```

`/claims` renders the Claim Evidence Registry directly.

`/source-quality` renders a computed quality report from source records and claim usage. No separate source-quality JSON file exists.

### Incident Page

Route:

```text
/continuity-incidents
```

This page renders an empty-state message when `data/continuity-rupture-incidents.json` has no entries. That is expected. The page should explain that incidents require source-backed claim support before entering the log.

## Empty-State Versus Matrix-State Rule

Use this distinction in future work:

```text
Matrix layers can be seeded with not_yet_assessed because coverage exists before assessment.
Incident logs should not be seeded because an incident either exists with evidence or it does not belong in the log.
```

Future contributors should not add placeholder continuity incidents.

## Verification Checklist

Run:

```bash
npm run validate:data
npm run typecheck
NEXT_PUBLIC_BASE_PATH=/LargeLanguageObservitory npm run build
```

Recommended browser checks:

```text
/claims
/source-quality
/governance-gaps
/platform-portability
/human-decision-audits
/continuity-incidents
```

Confirm:

```text
Claim list renders.
Source quality table renders.
Governance gap matrix renders.
Platform portability matrix renders.
Human decision audit matrix renders.
Continuity incidents page renders an honest empty state.
No page implies certification, ranking, vendor approval, paid verification, or legal advice.
```

## Known Constraints

- The governance, portability, and human-decision matrices are coverage scaffolds, not completed assessments.
- `not_yet_assessed` means no research has been performed for that cell.
- Source Quality Reports are computed from current data and should not be treated as external audits.
- The incident log is intentionally empty until real, source-backed incident claims exist.
- The branch does not add a database, API, scraper, automated ingestion path, checkout flow, or payment logic.

## Future Follow-Up Items

- Add real claim-backed assessments one cell at a time.
- Preserve `claim_id` links for every assessed matrix finding.
- Add continuity incidents only when there is a source-backed claim.
- Consider small route-level docs or method notes if these pages become public-facing production surfaces.
- Add targeted tests or fixture mutation checks if the validator grows beyond script-level validation.


# Data Science Additions Overview

This branch adds a six-layer measurement stack to the AI Native Observatory. The purpose is to make public claims, source quality, governance gaps, portability, human review, and continuity ruptures visible without turning unreviewed gaps into unsupported findings.

The additions keep the Observatory's existing rule intact: source-backed claims can support assessments, but missing evidence should be shown honestly as missing evidence.

## What Was Added

The branch adds six public data-science layers:

1. Claim Evidence Registry.
2. Source Quality Reports.
3. Governance Gap Matrix.
4. Platform Portability Scorecards.
5. Meaningful Human Decision Audits.
6. Continuity Rupture Incident Reports.

Together, these layers extend the Observatory from a registry of AI ecosystem observables into a measurement system for source-backed institutional and platform claims.

## Why Each Layer Exists

### Claim Evidence Registry

The Claim Evidence Registry is the backbone object for the new measurement layer. It stores individual public claims with:

- claim text
- subject label
- optional linked observable
- source links
- status
- uncertainty
- review date
- evidence type
- notes

This gives the rest of the stack a stable citation target. A matrix cell can remain unassessed until a real claim exists, and an incident can only enter the log when there is a claim behind it.

### Source Quality Reports

Source Quality Reports are computed from existing source records and claim records. They do not introduce a new raw data file.

The reports summarize:

- source type posture
- freshness
- claim usage
- subject diversity
- counterevidence flags
- overall source quality tier

This lets the Observatory show whether the evidence base is broad, narrow, stale, placeholder-heavy, or exposed to contested claims.

### Governance Gap Matrix

The Governance Gap Matrix tracks whether organization-level public materials recognize:

- portability
- consent
- context
- auditability
- appeal
- continuity

The current matrix is seeded with `not_yet_assessed` cells. That status means no assessment has been performed. It does not mean the organization fails the dimension.

### Platform Portability Scorecards

Platform Portability Scorecards apply a similar matrix pattern to model/platform observables. They track whether public materials describe:

- raw data export
- context export
- memory visibility
- deletion controls
- appeal paths
- workflow continuity
- recovery

The current scorecards are seeded with `not_yet_assessed` cells. A real status requires a linked claim.

### Meaningful Human Decision Audits

Meaningful Human Decision Audits test whether a platform's "human in the loop" posture is meaningful across four dimensions:

- awareness
- authority
- accountability
- time

The current audit matrix is seeded with `not_yet_assessed` cells. A future finding such as `meaningful`, `partially_meaningful`, or `not_meaningful` must cite a claim in the Claim Evidence Registry.

### Continuity Rupture Incident Reports

Continuity Rupture Incident Reports are intentionally different from the matrices. They are an incident log, not a coverage grid.

This layer starts empty because there is no honest placeholder for an incident. An incident either happened and has a source-backed claim, or it does not belong in the log yet.

When non-empty, each incident must include a `claim_id` from the moment it is added.

## How The Six-Layer Stack Fits Together

```text
Claim Evidence Registry
  -> supports Governance Gap Matrix findings
  -> supports Platform Portability Scorecard findings
  -> supports Meaningful Human Decision Audit findings
  -> supports Continuity Rupture Incident entries

Source records
  -> support Claim Evidence Registry entries
  -> feed computed Source Quality Reports
```

The key relationship is simple:

```text
Sources support claims.
Claims support assessments.
Assessments remain empty or not_yet_assessed until claims exist.
```

## Honest Data States

The branch deliberately distinguishes seeded matrix coverage from real findings.

### Seeded Matrix State

The following matrix layers are seeded with honest `not_yet_assessed` rows:

- Governance Gap Matrix: 150 rows.
- Platform Portability Scorecards: 175 rows.
- Meaningful Human Decision Audits: 100 rows.

These rows provide coverage scaffolding. They do not assert findings.

### Empty Incident State

The Continuity Rupture Incident Reports file starts empty:

- Continuity Rupture Incident Reports: 0 rows.

That is intentional. The log should not create placeholder incidents.

### Seeded Claim State

The Claim Evidence Registry currently contains 101 claim records. These provide initial claim objects linked into the broader registry and allow later matrix findings to cite stable claim IDs.

## Validation And Integrity Guarantees

The validator now enforces the new measurement stack:

- all new JSON files must be arrays
- duplicate IDs are rejected
- enum values are checked
- date fields must use `YYYY-MM-DD`
- observable references must exist
- source references must exist
- claim references must exist
- source-backed claim statuses require source links
- assessed matrix statuses require `claim_id`
- incident records always require `claim_id`

The important integrity rule is this:

```text
No real assessment without a claim.
No incident without a claim.
No source-backed claim without a source.
```

## Current Branch Status

Current branch:

```text
feature/claim-evidence-registry
```

Commit stack on this branch:

```text
e2489c7 feat: add Claim Evidence Registry as the backbone measurement object
a28a015 feat: add Source Quality Reports as a computed measurement layer
d637900 feat: add Governance Gap Matrix, seeded honestly at not_yet_assessed
fbb8a24 feat: add Platform Portability Scorecards, seeded honestly at not_yet_assessed
ead1b2e feat: add Meaningful Human Decision Audits, seeded honestly at not_yet_assessed
942d6cf feat: add Continuity Rupture Incident Reports as an empty, source-required log
```

This branch is positioned as a reviewable data-science expansion. It does not add checkout, payment links, APIs, databases, scraping, automated verification, or public ingestion.

## Review Readiness

Before merge or deployment, reviewers should confirm:

- `npm run validate:data` passes.
- `npm run typecheck` passes.
- `NEXT_PUBLIC_BASE_PATH=/LargeLanguageObservitory npm run build` passes.
- Each new public route renders.
- Matrix pages clearly label `not_yet_assessed` as unreviewed, not negative.
- The incident page clearly explains why the log is empty.
- No page implies certification, ranking, vendor approval, or paid verification.


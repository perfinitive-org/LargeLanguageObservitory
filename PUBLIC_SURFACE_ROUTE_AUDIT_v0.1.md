# Public Surface Route Audit v0.1

Audit date: 2026-07-11  
Mode: read-first; no route modification or deletion  
Authority: repository `AGENTS.md` and `LLM_INFRA_OBSERVATORY_RECONSTRUCTION_BRIEF_v0.4_INTERNAL.md`  
Release decision: **do not deploy until non-canonical routes are quarantined or explicitly retained**

## Summary

The repository contains **60 page route patterns** under `src/app`. Eight match the authorized MVP public surface. The remaining **52 route patterns require quarantine or human review before deployment**.

The production build currently generates **356 static pages** in total. Four dynamic route families account for roughly 300 generated record pages: `/evidence/[id]`, `/observables/[slug]`, `/registry/[slug]`, and `/sources/[slug]`. These pages make pre-existing datasets publicly addressable even though the canonical navigation does not link to them.

Classification totals:

| Classification | Route patterns | Release posture |
|---|---:|---|
| `keep_public_mvp` | 8 | Authorized canonical surface |
| `quarantine_internal` | 30 | Disable or move out of the public route tree |
| `legacy_commercial` | 7 | Remove from public route tree under the current non-commercial gate |
| `legacy_internal_method` | 9 | Move to internal documentation or disable |
| `unknown_needs_review` | 6 | Human review required before keep/quarantine decision |
| **Total** | **60** | **Deployment blocked pending quarantine** |

## Canonical MVP routes

| Route | Source file | Classification | Reason | Recommended action |
|---|---|---|---|---|
| `/` | `src/app/page.tsx` | `keep_public_mvp` | Authorized Home scaffold | keep public |
| `/methodology` | `src/app/methodology/page.tsx` | `keep_public_mvp` | Authorized public methodology | keep public |
| `/directory` | `src/app/directory/page.tsx` | `keep_public_mvp` | Authorized empty directory scaffold | keep public |
| `/claims` | `src/app/claims/page.tsx` | `keep_public_mvp` | Authorized empty claim-registry scaffold | keep public |
| `/sources` | `src/app/sources/page.tsx` | `keep_public_mvp` | Authorized empty source-register scaffold | keep public |
| `/reports` | `src/app/reports/page.tsx` | `keep_public_mvp` | Authorized empty reports scaffold | keep public |
| `/glossary` | `src/app/glossary/page.tsx` | `keep_public_mvp` | Authorized public terminology page | keep public |
| `/changelog` | `src/app/changelog/page.tsx` | `keep_public_mvp` | Authorized public change record | keep public |

## Non-canonical route audit

### Internal workflow and release-control routes

| Route | Source file | Classification | Why outside MVP | Recommended action |
|---|---|---|---|---|
| `/ano-80-status-lock` | `src/app/ano-80-status-lock/page.tsx` | `quarantine_internal` | Internal status lock; contains internal method and release material | disable with `notFound()` or move to internal docs |
| `/ano-governance` | `src/app/ano-governance/page.tsx` | `quarantine_internal` | Legacy governance/release control page with internal terminology | move to internal docs |
| `/ano-v1-final-release-decision` | `src/app/ano-v1-final-release-decision/page.tsx` | `quarantine_internal` | Internal release decision record | move to internal docs |
| `/ano-v1-internal-qa` | `src/app/ano-v1-internal-qa/page.tsx` | `quarantine_internal` | Explicit internal QA surface | move to internal docs |
| `/ano-v1-public-launch-checklist` | `src/app/ano-v1-public-launch-checklist/page.tsx` | `quarantine_internal` | Release checklist, not public evidence | move to internal docs |
| `/ano-v1-readiness-review` | `src/app/ano-v1-readiness-review/page.tsx` | `quarantine_internal` | Internal readiness/release review | move to internal docs |
| `/ano-v1-release-candidate` | `src/app/ano-v1-release-candidate/page.tsx` | `quarantine_internal` | Internal release-candidate checkpoint | move to internal docs |
| `/backlog-analysis` | `src/app/backlog-analysis/page.tsx` | `quarantine_internal` | Internal workflow/backlog analysis | move to internal docs |
| `/backlog-rebalance` | `src/app/backlog-rebalance/page.tsx` | `quarantine_internal` | Internal workflow planning | move to internal docs |
| `/eighty-threshold-review` | `src/app/eighty-threshold-review/page.tsx` | `quarantine_internal` | Internal threshold/readiness review | move to internal docs |
| `/mvp-status` | `src/app/mvp-status/page.tsx` | `quarantine_internal` | Internal project checkpoint, not public evidence | move to internal docs |
| `/review-batch-001` | `src/app/review-batch-001/page.tsx` | `quarantine_internal` | Internal review batch | move to internal docs |
| `/review-batch-001-evidence` | `src/app/review-batch-001-evidence/page.tsx` | `quarantine_internal` | Internal batch evidence review | move to internal docs |
| `/review-batch-001-sources` | `src/app/review-batch-001-sources/page.tsx` | `quarantine_internal` | Internal batch source review | move to internal docs |
| `/review-decisions` | `src/app/review-decisions/page.tsx` | `quarantine_internal` | Reviewer workflow and decision ledger not authorized for public MVP | disable with `notFound()` pending public-safe redesign |
| `/review-metrics` | `src/app/review-metrics/page.tsx` | `quarantine_internal` | Internal operational metrics | disable with `notFound()` |
| `/review-queue` | `src/app/review-queue/page.tsx` | `quarantine_internal` | Internal work queue | disable with `notFound()` |
| `/source-verification-batch-001` | `src/app/source-verification-batch-001/page.tsx` | `quarantine_internal` | Internal source-verification batch | move to internal docs |
| `/source-verification-batch-002` | `src/app/source-verification-batch-002/page.tsx` | `quarantine_internal` | Internal source-verification batch | move to internal docs |
| `/source-verification-criteria` | `src/app/source-verification-criteria/page.tsx` | `quarantine_internal` | Detailed internal verification gate; not canonical methodology | move useful public-safe portions later; disable route now |
| `/state-audit` | `src/app/state-audit/page.tsx` | `quarantine_internal` | Internal state/release audit | move to internal docs |
| `/verification-batch-002` | `src/app/verification-batch-002/page.tsx` | `quarantine_internal` | Internal verification batch | move to internal docs |
| `/verification-batch-003` | `src/app/verification-batch-003/page.tsx` | `quarantine_internal` | Internal verification batch | move to internal docs |
| `/verification-batch-004` | `src/app/verification-batch-004/page.tsx` | `quarantine_internal` | Internal verification batch | move to internal docs |
| `/verification-batch-005` | `src/app/verification-batch-005/page.tsx` | `quarantine_internal` | Internal verification batch | move to internal docs |
| `/verification-batch-006` | `src/app/verification-batch-006/page.tsx` | `quarantine_internal` | Internal verification batch | move to internal docs |
| `/verification-batch-007` | `src/app/verification-batch-007/page.tsx` | `quarantine_internal` | Internal verification batch | move to internal docs |
| `/verification-pilot-ai21-labs` | `src/app/verification-pilot-ai21-labs/page.tsx` | `quarantine_internal` | Entity-specific verification pilot using pre-existing data | disable with `notFound()` |
| `/verification-pilot-equinix` | `src/app/verification-pilot-equinix/page.tsx` | `quarantine_internal` | Entity-specific verification pilot using pre-existing data | disable with `notFound()` |
| `/verification-threshold-80` | `src/app/verification-threshold-80/page.tsx` | `quarantine_internal` | Internal threshold checkpoint | move to internal docs |

### Legacy commercial routes

| Route | Source file | Classification | Why outside MVP | Recommended action |
|---|---|---|---|---|
| `/custom-research` | `src/app/custom-research/page.tsx` | `legacy_commercial` | Buyer, payment, checkout, and custom-research positioning | remove route or move copy to internal archive |
| `/latest` | `src/app/latest/page.tsx` | `legacy_commercial` | Legacy public funnel includes sponsor/payment/custom-research calls | remove route |
| `/press` | `src/app/press/page.tsx` | `legacy_commercial` | Legacy promotional/press surface tied to buyer and sponsor posture | remove route |
| `/sample-brief` | `src/app/sample-brief/page.tsx` | `legacy_commercial` | Buyer artifact with commercial, enterprise, and internal-method language | remove route; preserve internally if needed |
| `/sponsor` | `src/app/sponsor/page.tsx` | `legacy_commercial` | Sponsorship and payment surface | remove route |
| `/submit-official-sources` | `src/app/submit-official-sources/page.tsx` | `legacy_commercial` | Non-canonical intake surface linked to legacy buyer/commercial system | disable with `notFound()` pending separate intake gate |
| `/transparency` | `src/app/transparency/page.tsx` | `legacy_commercial` | Mixes transparency with commercial, payment, sponsor, and custom-research posture | remove route; migrate public-safe method content only after review |

### Legacy internal method routes

| Route | Source file | Classification | Why outside MVP | Recommended action |
|---|---|---|---|---|
| `/about` | `src/app/about/page.tsx` | `legacy_internal_method` | Superseded by canonical `/methodology`; links internal method/workflow surfaces | disable with `notFound()` |
| `/continuity-incidents` | `src/app/continuity-incidents/page.tsx` | `legacy_internal_method` | Later evidence/report layer, not skeleton | move to internal docs or disable |
| `/evidence/frontier-claim-velocity` | `src/app/evidence/frontier-claim-velocity/page.tsx` | `legacy_internal_method` | Data-derived report/measurement surface; reports and evidence are not authorized yet | disable with `notFound()` |
| `/governance-gaps` | `src/app/governance-gaps/page.tsx` | `legacy_internal_method` | Later governance-gap matrix outside infrastructure MVP skeleton | move to internal docs |
| `/human-decision-audits` | `src/app/human-decision-audits/page.tsx` | `legacy_internal_method` | Later audit product outside public skeleton | move to internal docs |
| `/method/evidence-manifold` | `src/app/method/evidence-manifold/page.tsx` | `legacy_internal_method` | Protected/internal method architecture and non-canonical route | move to internal docs; disable public route |
| `/method/source-evidence-model` | `src/app/method/source-evidence-model/page.tsx` | `legacy_internal_method` | Detailed legacy method page superseded by canonical methodology gate | move useful public-safe material later; disable now |
| `/platform-portability` | `src/app/platform-portability/page.tsx` | `legacy_internal_method` | Cross-domain platform scorecard outside LLM infrastructure MVP | move to internal docs |
| `/source-quality` | `src/app/source-quality/page.tsx` | `legacy_internal_method` | Later data-derived source-quality report | disable until evidence and report gates |

### Routes needing human review

| Route | Source file | Classification | Why outside MVP | Recommended action |
|---|---|---|---|---|
| `/evidence` | `src/app/evidence/page.tsx` | `unknown_needs_review` | Potentially reusable evidence surface, but not canonical and currently data-backed | needs human review; likely disable now and merge later into Claims/Sources |
| `/evidence/[id]` | `src/app/evidence/[id]/page.tsx` | `unknown_needs_review` | Generates many public data dossiers from pre-existing records | disable with `notFound()` now; review future record model separately |
| `/observables/[slug]` | `src/app/observables/[slug]/page.tsx` | `unknown_needs_review` | Generates public entity records from legacy schema | disable with `notFound()` pending Directory gate |
| `/registry` | `src/app/registry/page.tsx` | `unknown_needs_review` | Legacy searchable registry overlaps canonical Directory and uses existing data | needs human review; likely supersede with `/directory` |
| `/registry/[slug]` | `src/app/registry/[slug]/page.tsx` | `unknown_needs_review` | Generates many legacy public records and duplicates future Directory detail routes | disable with `notFound()` pending Directory design |
| `/sources/[slug]` | `src/app/sources/[slug]/page.tsx` | `unknown_needs_review` | Generates public source details from pre-existing data while `/sources` is intentionally empty | disable with `notFound()` pending source-data gate |

## Static expansion risk

The four dynamic patterns are the largest public-addressability risk:

| Dynamic pattern | Build evidence | Risk |
|---|---:|---|
| `/evidence/[id]` | 85 generated evidence paths indicated by build output | Publishes legacy evidence dossiers |
| `/observables/[slug]` | 75 generated observable paths indicated by build output | Publishes legacy organization/model/facility/source records |
| `/registry/[slug]` | 101 generated registry paths indicated by build output | Publishes legacy registry records |
| `/sources/[slug]` | 39 generated source paths indicated by build output | Publishes legacy source records |

Counts are derived from the build summary examples plus the reported “more paths” totals. They are evidence of generated addressable pages, not an assessment of the underlying records.

## Recommended quarantine sequence

1. Preserve this audit and obtain explicit authorization for route quarantine.
2. Disable all `quarantine_internal`, `legacy_commercial`, and `legacy_internal_method` routes.
3. Disable the four dynamic route families before any deployment.
4. Resolve the six `unknown_needs_review` routes; default to disabled for the MVP.
5. Re-run route enumeration, prohibited-language scanning, typecheck, and static build.
6. Confirm the build output contains only the eight canonical routes plus framework-required not-found output.
7. Do not delete historical source files until an archive/migration decision is made.

## Commands and evidence

Read-only commands used:

```text
find src/app -type f -name page.tsx
rg metadata and boundary-language signals across route source files
npm run build output from the immediately preceding skeleton gate
```

## Files changed

- `PUBLIC_SURFACE_ROUTE_AUDIT_v0.1.md` only.

No route, application component, dataset, SQL/database artifact, payment or checkout integration, ResearchOS integration, public method implementation, dependency, or Codex environment file was changed during this audit.

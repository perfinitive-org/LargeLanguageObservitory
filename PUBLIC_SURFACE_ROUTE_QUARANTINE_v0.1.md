  # Public Surface Route Quarantine v0.1

Date: 2026-07-11  
Gate: `PUBLIC_SURFACE_ROUTE_QUARANTINE_v0.1`  
Authority: `AGENTS.md`, `PUBLIC_SURFACE_ROUTE_AUDIT_v0.1.md`, and `LLM_INFRA_OBSERVATORY_RECONSTRUCTION_BRIEF_v0.4_INTERNAL.md`  
Final status: **PASS**

## Result

Only the eight canonical MVP routes contain public Observatory content:

- `/`
- `/methodology`
- `/directory`
- `/claims`
- `/sources`
- `/reports`
- `/glossary`
- `/changelog`

Forty-eight non-canonical static route modules now call Next.js `notFound()`. Their static-export files contain the not-found marker and no legacy page content.

The four legacy dynamic route families were removed from Next's route tree by renaming their page modules to `page.quarantined.tsx`. This was required because Next.js static export rejects a dynamic `page.tsx` whose `generateStaticParams()` returns an empty array. The source files remain preserved in their route directories; no historical route file or dataset was deleted.

## Static routes quarantined

The following 48 routes return not found:

```text
/about
/ano-80-status-lock
/ano-governance
/ano-v1-final-release-decision
/ano-v1-internal-qa
/ano-v1-public-launch-checklist
/ano-v1-readiness-review
/ano-v1-release-candidate
/backlog-analysis
/backlog-rebalance
/continuity-incidents
/custom-research
/eighty-threshold-review
/evidence
/evidence/frontier-claim-velocity
/governance-gaps
/human-decision-audits
/latest
/method/evidence-manifold
/method/source-evidence-model
/mvp-status
/platform-portability
/press
/registry
/review-batch-001
/review-batch-001-evidence
/review-batch-001-sources
/review-decisions
/review-metrics
/review-queue
/sample-brief
/source-quality
/source-verification-batch-001
/source-verification-batch-002
/source-verification-criteria
/sponsor
/state-audit
/submit-official-sources
/transparency
/verification-batch-002
/verification-batch-003
/verification-batch-004
/verification-batch-005
/verification-batch-006
/verification-batch-007
/verification-pilot-ai21-labs
/verification-pilot-equinix
/verification-threshold-80
```

## Dynamic route families disabled

| Former route family | Preserved quarantine module | Generated record pages after patch |
|---|---|---:|
| `/evidence/[id]` | `src/app/evidence/[id]/page.quarantined.tsx` | 0 |
| `/observables/[slug]` | `src/app/observables/[slug]/page.quarantined.tsx` | 0 |
| `/registry/[slug]` | `src/app/registry/[slug]/page.quarantined.tsx` | 0 |
| `/sources/[slug]` | `src/app/sources/[slug]/page.quarantined.tsx` | 0 |

## Verification

| Check | Result |
|---|---|
| Route enumeration | PASS — 56 active `page.tsx` modules: 8 canonical and 48 explicit quarantines |
| Static quarantine coverage | PASS — 48/48 legacy route outputs contain not-found markers |
| Dynamic route generation | PASS — zero record pages generated across all four families |
| Canonical output existence | PASS — all eight canonical `index.html` files generated |
| Public-copy prohibited-language scan | PASS — no matches in canonical source files |
| TypeScript | PASS |
| Production static build | PASS |

The build inventory still names the 48 static quarantined routes because their `page.tsx` modules exist, but each generated file is the not-found output rather than the historical page. The dynamic families do not appear in the build route inventory.

## Typecheck adjustment

Next automatically includes `.next/dev/types/**/*.ts` in the main TypeScript configuration. Those dev-only generated stubs retained references to the four removed dynamic page modules and caused standalone `tsc` to fail even though the production build TypeScript phase passed.

The `typecheck` script now uses `tsconfig.typecheck.json`, which includes source files and current production `.next/types` while excluding stale `.next/dev` types. No dependency or compiler strictness setting changed.

## Commands run

```text
find src/app -type f -name page.tsx
rg route quarantine coverage and canonical public-copy boundary terms
npm run typecheck
npm run build
find/rg checks against generated out/ HTML
git status and diff inspection
```

One intermediate build failed because Next static export rejected empty `generateStaticParams()` for `/evidence/[id]`. The four dynamic page modules were then removed from the route tree through the preserved `.quarantined.tsx` filename, after which the build passed.

## Files changed for quarantine

- 48 non-canonical static `src/app/**/page.tsx` modules now contain only `notFound()`.
- Four dynamic `page.tsx` modules were replaced by preserved `page.quarantined.tsx` modules:
  - `src/app/evidence/[id]/page.quarantined.tsx`
  - `src/app/observables/[slug]/page.quarantined.tsx`
  - `src/app/registry/[slug]/page.quarantined.tsx`
  - `src/app/sources/[slug]/page.quarantined.tsx`
- `package.json` — standalone typecheck now uses the dedicated configuration.
- `tsconfig.typecheck.json` — production-oriented standalone typecheck scope.
- `PUBLIC_SURFACE_ROUTE_QUARANTINE_v0.1.md` — this report.

## Boundary confirmation

No production data, data schema, SQL/database artifact, payment or checkout integration, Packet 064 dependency, ResearchOS integration, public internal-method content, infrastructure claim, monetization/API/enterprise copy, dependency version, or Codex environment file was added or changed.

No deployment was performed.

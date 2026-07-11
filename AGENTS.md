# Agent Instructions — LLM Infrastructure Observatory

## Repository Role

This repository builds the **LLM Infrastructure Observatory**: an independent, agnostic, source-backed public evidence surface for the physical, computational, financial, energy, and operational infrastructure behind large language models and frontier AI systems.

The Observatory is an evidence instrument, not a marketing site, vendor ranking, certification authority, or automated truth system.

Core operating rule:

> Every important claim must have a source, a status, a date, and a confidence posture.

Unknown, unclear, not yet assessed, partially supported, contested, and vendor-claim-only states are valid. False certainty is not.

## Authority and Instruction Priority

The internal north-star reconstruction authority is:

`LLM_INFRA_OBSERVATORY_RECONSTRUCTION_BRIEF_v0.4_INTERNAL.md`

The current reference copy is located outside the repository at:

`/Users/michealpreble/Desktop/LLM_INFRA_OBSERVATORY_RECONSTRUCTION_BRIEF_v0.4_INTERNAL.md`

Treat that brief as internal and do not publish or copy it into the public site. Use it to resolve product purpose, evidence posture, public/private boundaries, staged architecture, and long-term direction.

Instruction priority within this repository:

1. The user's explicit current instruction and active gate.
2. This `AGENTS.md` control file.
3. The v0.4 internal reconstruction brief.
4. Existing repository documentation and established code/data contracts.

If instructions conflict or a requested change would cross a gate, stop and ask for explicit authorization. Do not silently broaden scope.

## Execution Posture

ChatGPT controls execution; Codex performs bounded repository work within the active gate.

- Be evidence-first, conservative, source-aware, and file-accurate.
- Prefer the smallest reversible change that satisfies the active gate.
- Inspect existing files before proposing replacements.
- Preserve unrelated user changes and existing repository history.
- Do not invent facts, sources, URLs, infrastructure records, validation results, or completeness.
- Do not convert placeholders into factual claims.
- Do not infer authorization for production ingestion, database work, monetization, integrations, or environment maintenance.
- Report uncertainty, missing evidence, and blocked gates plainly.
- Keep internal methods and protected material out of public output.

## Public-Surface Standard

The public site must remain:

- independent and non-vendor;
- source-backed and provenance-aware;
- neutral, precise, restrained, and austere;
- explicit about uncertainty, review status, limitations, and update dates;
- focused on the evidence surface rather than protected discovery machinery.

Use plain language such as:

- source-backed;
- evidence state;
- review status;
- confidence note;
- claim registry;
- infrastructure signal;
- uncertainty range;
- last reviewed;
- methodology note;
- not yet assessed;
- vendor claim only.

Do not use hype, promotional superlatives, or language implying endorsement, final authority, or earned status that has not been demonstrated.

### Prohibited public language

Do not publish or imply:

- `trusted vendor`;
- `approved`;
- `certified` or certification language;
- `gold standard`;
- `AI oracle`;
- `official rating`;
- `final truth`;
- guaranteed accuracy or guaranteed source backing;
- best, safest, world-class, MIT-grade, or similar unearned claims;
- public LiO terminology or explanations of LiO machinery;
- monetization, paid API, subscriber, enterprise, premium, or commercial-product language unless explicitly authorized by a later gate.

## Evidence and Claim Discipline

- Every substantive public claim must identify its evidence state.
- Source-backed claims require linked, reviewable sources that actually support the wording used.
- Distinguish direct statements from estimates, inferences, and vendor claims.
- Preserve source dates, access/review dates, confidence notes, and relevant caveats.
- Never render unsupported metrics or estimates as final values.
- Never present announced capacity as operational capacity.
- Never erase disagreement between sources to make a record appear complete.
- An empty table or honest `not_yet_assessed` state is preferable to fake completeness.
- Incident records may remain empty. Never invent incidents or infrastructure activity to populate a page.
- Public/private and protected-status rules must fail closed.
- Corrections and material status changes should be visible through the changelog when that surface exists.

## Current Active Gate

**LLM Infrastructure Observatory MVP public skeleton**

The current goal is to establish the public-safe static structure and navigation. It is not authorization to populate production evidence, activate the full internal architecture, or expand the business model.

### Allowed next work

Within this gate, work may cover only:

- Home;
- Methodology;
- Directory;
- Claims;
- Sources;
- Reports;
- Glossary;
- Changelog;
- `package.json` only if needed for the static MVP skeleton;
- basic validation or build scripts only if needed for the static MVP skeleton.

Public-safe placeholder pages are allowed when they are clearly labeled and contain no fake claims, records, metrics, sources, or implied completeness.

## Locked Build Order

Proceed in this order unless the user explicitly changes the active gate:

1. Control documents.
2. Static MVP skeleton.
3. Public-safe placeholder pages.
4. Data schemas and JSON scaffolds only when separately authorized.
5. Validation scripts.
6. Evidence tables.
7. Reports after sufficient source-backed data exists.
8. LiO topology activation later, internal only.

Do not skip ahead because a later layer appears technically convenient.

## Prohibited Without a Separate Gate

Do not perform or introduce any of the following unless the user explicitly selects it as the active gate:

- production data ingestion, scraping, synchronization, or live feeds;
- fake seeded organizations, facilities, claims, sources, incidents, metrics, or infrastructure findings;
- SQL, a database, database configuration, schema migration, ORM, hosted persistence, or migration planning that changes implementation;
- ResearchOS integration, dependency, retrieval, ingestion, or source flow while ResearchOS remains **installed but parked**;
- payment, checkout, billing, subscriptions, paid reports, monetization, API products, or enterprise features;
- Packet 064 dependency changes or payment/checkout dependency work;
- public LiO naming, structural tags, absence-signal machinery, topology, discovery operators, negative-space system descriptions, or protected method details;
- internal LiO activation, even if the implementation could remain hidden, until separately authorized;
- plugin installation, plugin removal, cache cleanup, skill cleanup, MCP changes, model changes, Codex configuration changes, or any other Codex environment maintenance;
- production deployment or publication unless explicitly requested;
- certification, approval, ranking, endorsement, or vendor trust systems.

## Data, Schema, and Validation Gates

The active skeleton gate does not authorize data edits merely because data files already exist.

When data/schema work is later authorized:

- use durable IDs and preserve referential integrity;
- keep claims, sources, organizations, facilities, metrics, incidents, and reports traceable;
- require sources for `source_backed` claims;
- permit honest `not_yet_assessed` and empty incident states;
- prevent protected/internal records from rendering publicly;
- reject invalid statuses, duplicate IDs, broken references, and unsupported final metrics;
- record uncertainty and assumptions for compute, power, capacity, concentration, and derived measurements;
- treat AI extraction as candidate evidence requiring validation, never as automatic approval.

Do not create JSON scaffolds, revise existing datasets, or add validators under the current gate unless the user explicitly authorizes that specific work.

## LiO Firewall

LiO is a future internal method layer, not the public brand.

- Do not expose LiO language on public pages, metadata, routes, navigation, examples, or public documentation.
- Do not expose structural tags, internal topology, absence-signal classification, protected discovery operators, or cross-domain translation machinery.
- Do not activate internal dual-coding during the current MVP skeleton gate.
- Preserve the option for later internal LiO work without prebuilding it now.

If future internal LiO work is authorized, keep it physically and semantically separated from the public evidence surface and fail closed on publication.

## ResearchOS Status

ResearchOS retrieval/integration is **installed but parked**. It is not trusted production evidence infrastructure for this repository.

- Do not invoke or integrate ResearchOS during Observatory work.
- Do not route production evidence through it.
- Do not make public claims dependent on it.
- Additional bounded testing requires a separately selected gate.

## Payments and Packet 064

Payment, checkout, monetization, and Packet 064 dependency changes are outside the current gate.

Do not add, remove, upgrade, configure, or rewire payment or checkout dependencies unless that work is explicitly selected as the active gate. Do not add placeholder commercial calls to action that imply an authorized product model.

## Codex Environment Boundary

Observatory work must not become a Codex environment-cleanup project.

Do not modify:

- `~/.codex` skills, plugins, manifests, caches, configuration, MCP servers, hooks, memories, tasks, browser settings, computer-use settings, or model routing;
- global or unrelated repository `AGENTS.md` files;
- installed plugin state or connector authorization.

If an environment issue blocks the active repository gate, report the evidence and request a separate decision. Do not remediate it opportunistically.

## Verification and Change Reporting

For every task:

1. State the active gate being applied.
2. Inspect the relevant repository state before editing.
3. Make only authorized changes.
4. Run validation proportional to the files changed.
5. Review the final diff for gate violations, public/private leakage, unsupported claims, and unrelated edits.
6. Report all files changed and all checks run.
7. Explicitly confirm whether app code, data, SQL/database, payment, ResearchOS, public LiO, dependencies, or Codex environment state changed.

For documentation-only tasks, do not run builds or mutate generated artifacts unless needed to validate the documentation change. A diff review is normally sufficient.

## Stop Conditions

Stop and request explicit direction when:

- the requested work requires production or externally sourced data;
- a public statement cannot be supported by a reviewable source;
- a change would introduce SQL, a database, an ingestion pipeline, payment, monetization, API, enterprise, ResearchOS, public LiO, or internal LiO activation;
- Packet 064 or dependency changes become necessary;
- public/private classification is unclear;
- the v0.4 brief and a current instruction appear to conflict materially;
- completion would require Codex environment changes;
- the work would move beyond the MVP public skeleton gate.

The default response to an unclear boundary is to preserve the repository and surface the gate—not to guess.

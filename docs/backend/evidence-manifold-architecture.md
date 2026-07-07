# Evidence Manifold Architecture

Status: Current architecture note with planned and future sections.

## Architecture Overview

The evidence manifold is the domain-agnostic architecture behind LLO / ANO's source-backed records. It connects source inputs, normalizes claims into a canonical evidence structure, applies domain-specific review rules through plugins, and produces human-reviewed outputs.

The current working instance is:

```text
Domain Instance 001: AI / LLM infrastructure
```

## Core Components

Current:

- Static JSON registry files.
- Observables, sources, observations, relationships, evidence records, review decisions.
- Human-reviewed status changes.
- Static pages for registry records, evidence records, review decisions, method, transparency, sample brief, and custom research.

Planned:

- Clear plugin contracts for domain-specific vocabulary, entity types, relation types, source categories, and review rules.
- Manual ingestion protocol that keeps source metadata, atomic claims, evidence items, relationships, and review decisions separate.

Future:

- Source connector manifests.
- Scheduled ingestion.
- Evidence exports.
- Feed or API products after manual demand is proven.

Do not claim yet:

- Live automated connectors.
- Automated review.
- Database-backed ingestion.
- Production API access.
- Automated domain creation.

## Canonical Schema Boundaries

Canonical objects:

- source
- claim
- entity / observable
- relation
- evidence item
- confidence
- status
- timestamp
- review decision
- unresolved question

Core rule:

```text
Plugins can extend meaning, but they cannot alter the canonical schema.
```

## Plugin Model

Each domain is treated as a plugin. The core evidence engine stays subject-matter agnostic.

A plugin defines:

- domain title
- source categories
- vocabulary
- entity types
- relation types
- review rules
- confidence heuristics
- output labels

Current:

- `config/domains/ai-infrastructure.plugin.json` is a non-executing domain plugin stub.

Planned:

- Use plugin stubs to document domain-specific assumptions before runtime ingestion exists.

Future:

- Domain plugins may eventually drive source routing, review queue labels, output labels, and export schemas.

Do not claim yet:

- Plugins are not runtime-loaded in the current MVP.
- Plugins do not create live connectors.
- Plugins do not alter public verification status automatically.

## Domain-Title Flow

Future operator flow:

1. Enter a domain title.
2. Load or create the domain plugin.
3. Activate source categories.
4. Define entity and relation types.
5. Apply review rules.
6. Start ingestion or manual source entry.
7. Route evidence to review.
8. Publish reviewed outputs.

## Evidence Normalization Flow

```text
Raw source
-> parsed claim
-> source record
-> entity / observable
-> relation
-> evidence item
-> review queue
-> review decision
-> unresolved question or source-backed record
-> output product
```

## Trust / Review Flow

Current:

- Records are added to static JSON.
- Sources and evidence are linked manually.
- Human review decisions document status changes.
- Needs-review, placeholder, and source-backed states remain visible.

Planned:

- Formalize review routing for source-backed, needs-source-review, unresolved, accepted-with-caveat, rejected-as-unsupported, and out-of-scope outcomes.

Future:

- Review queues may be generated from connector outputs.

Do not claim yet:

- No source can automatically become source-backed.
- No client can buy source-backed status.
- No output should hide unresolved questions or caveats.

## Output Layer

Current:

- Registry records.
- Evidence records.
- Review decisions.
- Source pages.
- Sample brief.
- Custom research page.

Planned:

- Buyer memos.
- Custom evidence briefs.
- Comparison matrices.
- Procurement question packs.
- Source-backed claim sheets.
- Evidence appendices.
- Review decision logs.
- Monthly evidence digests.

Future:

- Quarterly reviews.
- Annual reports.
- Structured exports.
- API access.

Do not claim yet:

- No checkout flow exists.
- No API product exists.
- No live feed product exists.

## Monetization Logic

The evidence manifold supports monetization by turning public proof-of-work into buyer-side products. Clients do not buy verification. They buy domain-specific evidence normalization, review, monitoring, and decision-ready reporting.

Product path:

```text
public evidence layer
-> sample proof-of-work
-> custom reports
-> recurring digests
-> future data exports or API access
```

## 6. Current Implementation Status

This section distinguishes the proposed evidence manifold architecture from the current repository implementation.

The current system contains working pieces of the proposed architecture, but the full connector-driven, dynamically instantiated evidence manifold is not yet built.

### 6.1 Implemented and working

The repository includes a working evidence-oriented structure with entity / observable records, source records, relationship records, review-oriented status fields, and public-facing pages that expose registry, evidence, and review-decision material.

Current working pieces:

- Static JSON registry files.
- Observables, sources, observations, relationships, evidence records, review decisions.
- Human-reviewed status changes.
- Public registry, evidence, source, review-decision, method, transparency, sample brief, and custom research pages.
- Buyer-side evidence research positioning with the verification and payment boundary preserved.

### 6.2 Implemented, but not exactly as proposed

The current schema supports many of the same functions as the proposed canonical schema, but it is not a one-to-one implementation of the proposed source / claim / entity / relation / evidence item / confidence / status / timestamp / review decision / unresolved question model.

The current plugin-like behavior is present through domain-specific configuration and page structure, but it is not yet a generalized runtime plugin system.

Implementation posture:

```text
Schema: implemented, but not in the exact form proposed here.
Plugin system: implemented, but not in the exact form proposed here.
Connector layer: not built.
Proposed dynamic plugin generation: not built.
Proposed review/status model: not built as written.
```

### 6.3 Planned but not built

The proposed domain-title interface, dynamic plugin generation, live source connector orchestration, scheduled ingestion, parser pipeline, deduplication engine, and operator review dashboard are not yet implemented.

Planned items remain roadmap items:

- Formalized manual ingestion and review queue rules.
- Runtime domain plugin loading.
- Connector manifests that can route source inputs.
- Source parsing and deduplication.
- Review dashboard workflows.
- Structured exports or API products after manual demand is proven.

### 6.4 Explicitly not present

There is no live connector layer in the current implementation.

There are no automated API, RSS, filing, corporate-source, scraping, or archive-pull connectors running in the current system.

There is no automated review or automated status-upgrade system.

There is no claim that placeholder or illustrative preview content is ingestion-backed evidence.

Do not claim yet:

- Do not describe connector stubs as active integrations.
- Do not describe plugin stubs as runtime behavior.
- Do not imply certification, legal advice, vendor approval, or rankings.

## Partner-Safe Preview Posture

Use this statement when sharing the architecture preview:

```text
The preview demonstrates the presentation layer and portions of the evidence architecture. It shows how sources, claims, entities, relationships, and review concepts can be organized into a domain-aware evidence service. It does not yet include the full connector layer, dynamic domain plugin generation, automated ingestion, or the proposed review/status model exactly as written.
```

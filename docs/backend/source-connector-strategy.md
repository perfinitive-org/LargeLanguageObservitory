# Source Connector Strategy

Status: Planning document. No live automated connectors are implemented in this packet.

## Connector Strategy

Source connectors are a future capability for routing public source inputs into the evidence manifold. The current LLO / ANO MVP remains static and manually reviewed.

## Connector Categories

| Source type | Expected fields | Trust priority | Refresh frequency | Parser strategy | Review requirement | Failure behavior | Current status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| official company documentation | title, url, publisher, date accessed, claim text | high when direct | manual for now | manual extraction | human review required | mark needs_source_review | Current manual source category |
| technical reports | title, url, publisher, date accessed, claim text | high when primary | manual for now | manual extraction | human review required | mark needs_source_review | Current manual source category |
| model cards | title, url, publisher, model name, date accessed, claim text | high when primary | manual for now | manual extraction | human review required | mark needs_source_review | Planned source category |
| government filings | title, url, agency or publisher, date accessed, claim text | high when relevant | manual for now | manual extraction | human review required | mark needs_source_review | Current manual source category |
| public datasets | title, url, publisher, date accessed, dataset scope, claim text | medium to high depending on provenance | manual for now | manual extraction | human review required | mark unresolved | Planned source category |
| RSS/news feeds | title, url, publisher, date accessed, claim text | medium, requires caveat | future scheduled | future RSS ingestion | human review required | mark unresolved | Future connector category |
| corporate blogs | title, url, publisher, date accessed, claim text | medium to high when official | manual for now | manual extraction | human review required | mark needs_source_review | Current manual source category |
| press releases | title, url, publisher, date accessed, claim text | medium to high when official | manual for now | manual extraction | human review required | mark needs_source_review | Current manual source category |
| manual uploads | title, file reference, submitted by, date received, claim text | varies, requires review | on submission | manual review | human review required | do not publish until reviewed | Planned intake category |
| archived URLs | title, archived url, original url, publisher, date accessed, claim text | varies, requires review | manual for now | manual extraction | human review required | mark unresolved | Planned source category |

## Connector Rules

Current:

- Sources are entered manually.
- Claims are extracted conservatively.
- Evidence records and review decisions are static JSON records.

Planned:

- Connector manifests document expected fields, trust priority, parser strategy, review requirement, and failure behavior.

Future:

- Some connector categories may become scheduled or semi-automated after manual review workflows are stable.

Do not claim yet:

- No RSS, API, filing, or documentation connector runs in production.
- No connector can publish directly to source-backed status.
- No connector output bypasses human review.


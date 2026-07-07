# Manual Ingestion Protocol

Status: Current manual-review guidance for source-backed evidence work.

## Workflow

1. Identify source.
2. Record source metadata.
3. Extract atomic claim.
4. Link claim to entity / observable.
5. Create evidence item.
6. Add relation if supported.
7. Mark status.
8. Send to review queue.
9. Record review decision.
10. Publish only after review.

## Frontier Claim Event Updates

Frontier Claim Velocity updates use the scripted authoring path documented in
`docs/backend/frontier-claim-authoring.md`.

Use the script when adding a claim event to `data/frontier-claim-velocity.json`:

```bash
npm run author:frontier-claim -- --input /path/to/claim-event.json --dry-run
npm run author:frontier-claim -- --input /path/to/claim-event.json
```

Do not use an HTTP submission endpoint for frontier claim events in the current
MVP. Authorship is operator-led until the write model has more review history.

## Manual Source Rules

- Do not infer missing facts.
- Do not convert source presence into verification.
- Do not collapse caveats.
- Do not treat reporting as official documentation unless labeled.
- Do not use a third-party article as a substitute for an official source when the claim requires primary support.
- Do not publish unsupported relationships as source-backed.
- Do not hide unresolved questions.

## Metadata Expectations

Record, when available:

- title
- URL or file reference
- publisher / owner
- source type
- date accessed
- claim text
- related observable
- related relation
- evidence item
- review decision
- caveat / limitation

If a field is not established in current ANO data, mark it plainly rather than inferring it.

## Claim Extraction

Claims should be atomic. A single source may support more than one claim, but each claim should be separable.

Example:

```text
Bad: Provider X is a major AI infrastructure company with safe products and strong market position.
Good: Provider X published documentation for Product Y on Date Z.
Good: Source A states Provider X is associated with Infrastructure Site B.
Good: Source B reports a GPU count claim, but the claim needs review.
```

## Review Boundary

Current:

- Manual ingestion supports the public evidence layer.
- Human review remains required before status changes.

Planned:

- Ingestion forms and review queue routing can make this workflow easier.

Future:

- Connector outputs may create review candidates, but not final status changes.

Do not claim yet:

- No automated ingestion is active.
- No source presence creates source-backed status by itself.
- No paid work changes evidence standards or public registry status.

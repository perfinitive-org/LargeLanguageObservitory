# Frontier Claim Event Authoring

This is the operator-led write path for Frontier Claim Velocity records.

It is intentionally a script, not a public HTTP endpoint. The Observatory should keep claim-event authorship explicit until the write model, source hierarchy, and review posture have more operating history.

## Command

Run a dry validation first:

```bash
npm run author:frontier-claim -- --input /path/to/claim-event.json --dry-run
```

Write one record after the dry run passes:

```bash
npm run author:frontier-claim -- --input /path/to/claim-event.json
```

The script appends exactly one record to `data/frontier-claim-velocity.json`, then runs `npm run validate:data` through the same validator used by the rest of the site. If global validation fails after a write, the script restores the original JSON file.

## Payload Shape

Every payload must be a single JSON object with the full Frontier Claim Velocity schema:

```json
{
  "id": "fcv-011",
  "date": "YYYY-MM-DD",
  "entity": "",
  "label": "",
  "claim": "",
  "type": "model",
  "unit_family": "parameters",
  "value": 0,
  "display_value": "",
  "source_ids": [],
  "evidence_record_ids": [],
  "status": "needs_source_review",
  "caveat": "",
  "event_type": "announcement",
  "direction": "unknown",
  "source_type": "unknown",
  "source_tier": "unresolved",
  "source_url": "",
  "archive_url": "",
  "accessed_at": "",
  "source_status": "requires_review",
  "normalization_status": "quarantined",
  "normalization_note": "",
  "conversion_formula": null,
  "plotted": false,
  "prior_claim_id": null,
  "supersedes_claim_id": null
}
```

## Plotting Rules

A payload cannot enter the plotted set unless it is safe to draw as a comparable point.

The script refuses plotted records when:

- `status` is not `source_backed` or `reported_public_claim`
- `event_type` is `needs_review`
- `normalization_status` is `ambiguous`, `not_comparable`, or `quarantined`
- `source_status` is `changed`, `removed`, `dead_link`, or `requires_review`
- `value` is zero or negative
- no source or evidence record is linked
- `source_url`, `archive_url`, or `accessed_at` is missing

This is stricter than the legacy dataset, where some plotted records still carry archive-url warnings. New plotted records should not add more archive debt.

## Source-Backed Boundary

`source_backed` records require a direct or public-record posture:

- `source_tier` must be `primary`, `official_partner`, or `public_record`
- `source_type` cannot be `investigative_reporting`, `news_reporting`, `analyst_report`, `secondary_summary`, or `unknown`

Reported or investigative material can still be authored, but should use `reported_public_claim` or remain table-only when the metric is not clean enough to plot.

## Revision And Negative Velocity Events

The timeline tracks claim events, not only growth. These event types must link to prior history with `prior_claim_id` or `supersedes_claim_id`:

- `revision`
- `delay`
- `cancellation`
- `retraction`
- `capacity_reduction`
- `source_removed`
- `source_changed`

The old record should remain in place. The new event records how the public claim changed.

## Operator Checklist

Before writing a claim event:

- Confirm the source and evidence records already exist if they are referenced.
- Use `needs_source_review` and `plotted: false` for ambiguous, incomplete, or unreviewable records.
- Use `reported_public_claim` for clearly labeled reporting that is not direct vendor documentation.
- Use `source_backed` only when the source tier and source type support that posture.
- Include an archive URL for every new plotted record.
- Link revisions, cancellations, retractions, and source-decay events to prior claim history.

This write path does not create evidence records, source records, review decisions, payments, checkout links, or public submission endpoints.

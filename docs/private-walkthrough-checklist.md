# Private Walkthrough Checklist

Use the static export or local dev server. Do not introduce new features during
the walkthrough.

## Setup

```bash
npm run validate:data
npm run typecheck
npm run build
npm run serve:static
```

Open `http://localhost:3000` unless `PORT` is set.

## Walkthrough Path

1. Open `/registry`.
2. Search `OpenAI`.
3. Open the OpenAI organization detail page.
4. Confirm related models appear, including GPT-4o and o3.
5. Follow a related model link.
6. Open a linked source page.
7. Return to `/registry` and search `data center`.
8. Open a data center / AI infrastructure record.
9. Inspect `verification_status` in the source JSON for the record being shown.
10. Confirm the static export works from `out/` with `npm run serve:static`.

## Notes

- Founder Observation #001: The MVP homepage felt flat. Target feeling is
  scale, discovery, and orientation.
- Treat `placeholder` and `needs_source_review` records as data-model coverage,
  not final factual claims.
- Do not demo maps, timelines, graph UI, dashboards, auth, APIs, scraping, or
  database workflows. They are outside MVP scope.

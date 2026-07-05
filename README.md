# AI Native Observatory

A public, source-backed registry MVP for AI ecosystem observables.

## MVP Scope

The MVP is a static searchable observatory for four observable types:

- Organizations
- Models
- Data centers / AI infrastructure sites
- Sources

The current seed registry contains 100 observables, plus source metadata,
observations, and relationships. It is intended for private walkthroughs and
early data-model review, not for public factual completeness.

Out of scope for this MVP:

- Maps
- Timelines
- Graph UI
- Database-backed editing
- Authentication
- Dashboards
- Scraping
- Hosted APIs

## Zero-Cost Architecture

- Zero recurring costs.
- No paid services, paid APIs, hosted databases, or monthly subscriptions.
- JSON files only for data storage.
- Client-side search only.
- Static export output in `out/`.
- Runs locally, from static files, on GitHub Pages, Cloudflare Pages free tier,
  and user-owned static hosting.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Static JSON data files
- Dependency-free local static server script

## Run Locally

```bash
cd ~/ai-native-observatory
npm install
npm run dev
```

Open `http://localhost:3000`.

## QA Commands

```bash
npm run validate:data
npm run typecheck
npm run build
```

`validate:data` checks duplicate IDs/slugs, broken references, and required
fields by record type.

## Static Build

```bash
npm run build
npm run serve:static
```

The static site is generated in `out/` and can be served by any static file
host. The built output does not require a Node server at runtime.

If you run inside a macOS runtime that cannot load the native Next SWC binary,
use:

```bash
NEXT_TEST_WASM_DIR=node_modules/@next/swc-wasm-nodejs npm run build
```

## Static Hosting

GitHub Pages, root site:

```bash
npm run build
```

Publish the `out/` directory.

GitHub Pages, repository subpath:

```bash
NEXT_PUBLIC_BASE_PATH=/ai-native-observatory npm run build
```

Publish the `out/` directory. The included `public/.nojekyll` marker ensures
GitHub Pages serves `_next` assets correctly.

Cloudflare Pages free tier:

- Build command: `npm run build`
- Output directory: `out`
- Environment variables: leave empty for a root domain, or set
  `NEXT_PUBLIC_BASE_PATH` only when deploying under a subpath.

Existing user-owned hosting:

```bash
npm run build
```

Upload the contents of `out/` to any static web host.

## Data Files

- `data/observables.json`: canonical organizations, models, data centers, and
  source observables.
- `data/sources.json`: source metadata and linked observable IDs.
- `data/observations.json`: source-backed or registry-note claims about
  observables.
- `data/relationships.json`: observable-to-observable relationships with source
  references.

JSON remains the source of truth. There is no database or hidden ingestion
state.

## Verification Status

Every registry record should include `verification_status`.

- `source_backed`: conservative claim has a direct linked source record.
- `needs_source_review`: useful seed record, but the linked source metadata
  should be reviewed before making stronger claims.
- `placeholder`: intentionally incomplete record included to reserve structure
  or support walkthrough navigation.

Use `needs_source_review` by default when adding records unless the claim is
plainly supported by a linked source.

## Data Maintenance Notes

- Edit JSON files directly.
- Keep `id` and `slug` stable once a record is linked.
- Use lowercase kebab-style IDs with type prefixes such as `org-`, `model-`,
  `dc-`, and `src-`.
- Do not add claims about capacity, power, customers, benchmarks, release dates,
  or partnerships unless a source record supports them.
- Add at least one observation for each new observable.
- Link sources to observables with `linkedObservableIds`.
- Link relationships to source records with `sourceIds` when available.
- Run `npm run validate:data` after every data edit.
- Run `npm run build` before sharing a static export.

Future database migration should preserve the current JSON shapes as importable
tables or collections: observables, sources, observations, and relationships.

## Private Walkthrough

Use [docs/private-walkthrough-checklist.md](docs/private-walkthrough-checklist.md)
for the MVP walkthrough path.

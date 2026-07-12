# Flat-File Validator v0.1

**Status:** INTERNAL / SANDBOX / NO PUBLIC ROUTE CHANGES

This validator checks AI Infrastructure Observatory dry-run CSV bundles before a public Claim Brief is generated. It is designed for the xAI Colossus flat-file workflow, but it does not scrape sources, create API routes, create SQL migrations, publish pages, or modify public site copy.

## Required Input Files

Place these files in one directory:

```text
organizations.csv
facilities.csv
claims.csv
sources.csv
evidence_links.csv
changelog.csv
source_capture_log.csv
review_checklist.csv
```

## Run

```bash
python3 validate_flat_files.py \
  --input-dir /path/to/dry-run-csvs \
  --output-dir /path/to/validation-output
```

The script writes:

```text
validation_report.md
validation_report.json
```

## What It Checks

- enum integrity
- referential integrity
- public/private containment
- placeholder indicators in public rows
- banned public-copy language in public rows
- source capture hash verification
- evidence-link support logic
- changelog coverage warnings
- claim-split integrity
- compound GPU claim splitting

## Passing Criteria

```text
zero BLOCKER issues
warnings allowed only with explicit reviewer note
public Claim Brief generation is blocked if any BLOCKER exists
```

## Boundary

This script is internal validation tooling. It does not create public claims, certify vendors, verify legal sufficiency, add pricing, or alter the public Observatory.

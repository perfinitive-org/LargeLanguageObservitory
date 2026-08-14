---
name: publication-gate
description: What the public site is allowed to claim at each verification status, and which numbers may appear in public copy. Use before writing or auditing any user-facing text, count, badge, or methodology page.
---

# Publication gate

The registry's only asset is that its public claims are narrower than its private beliefs. This file defines how narrow.

## What each status licenses in public

**source_backed.** May be counted in a public total. May carry a badge. May be cited in a brief. Requires a review decision row whose `decision` is `source_backed`, signed by a named reviewer, plus at least one observation making a substantive claim that a cited source supports.

**needs_source_review.** May appear on the site. May be listed and browsed. May **not** be counted in any total presented as verified, and may not carry a verification badge. The record is a lead, not a finding. Saying so is a feature.

**placeholder.** May appear in an index. May not be counted anywhere, and may not carry a claim beyond its own name and type.

## The numbers rule

Every number in public copy comes from `data/derived-counts.json`, which is generated from the data. No number is ever typed by hand into a component, a heading, a meta description, or a README. A hand-typed count is true only until the next commit, and there is no way to notice when it stops being true.

If a number cannot be derived, it does not get published.

## Words that must not appear unless earned

- **verified** - only for records with a `source_backed` decision row signed by a named human.
- **audited** - implies an independent pass with a written scope. Do not use it for automated checks.
- **comprehensive**, **complete**, **all** - the registry holds 101 records selected by hand. None of these words is available.
- **independent** - only if the reviewer did not share a context window with whatever produced the record.
- **monitored**, **tracked in real time**, **live** - only if something actually re-checks on a schedule. A one-time retrieval in June is not monitoring.

## Evidence-as-of stamp

Any page presenting counts must show `freshness.latestRetrievedAt` as an explicit "evidence as of" date. A registry whose newest retrieval is months old is not dishonest; a registry that hides that fact is. The stamp is what makes staleness self-reporting rather than something a reader has to discover.

## Registry notes are not evidence

An observation whose claim is a registry note describes an editorial decision to include a record. It is not evidence of anything about the world and must never be counted toward an evidence total, a coverage percentage, or a per-record evidence badge. All 101 current observations are registry notes, which means the honest count of substantively evidenced records is currently zero.

That number is allowed to be zero in public. It is not allowed to be misreported.

## Methodology pages

A published methodology must describe the process actually followed, including its gaps. If 58 of 101 records have never been reviewed, the methodology page says so. If reviewers were batch labels rather than people, it says that too, until it stops being true.

A methodology page copied from another project and left unedited is worse than none, because it describes a process nobody performed.

## The test to apply

Before publishing any claim, ask: if a hostile reader clicked through to the underlying record and its source, would they find the claim overstated? If yes, narrow the claim rather than strengthening the record. Narrowing is free and immediate. Strengthening takes research.

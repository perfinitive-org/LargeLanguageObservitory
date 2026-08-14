---
name: source-fit-review
description: Criteria for deciding whether a cited source actually supports the claim attached to a registry record. Use when reviewing any observable, observation, or source record, when asked whether something is source_backed, or when writing a review decision row.
---

# Source-fit review

## The only question this skill answers

**Does the cited source, as written, support the specific claim attached to this record?**

It does not ask whether the entity is important, whether the company exists, whether the model is any good, or whether the claim is probably true. Plausibility is not evidence. A claim can be entirely correct and still fail source fit, because the source cited does not establish it. That distinction is the entire product.

Write this boundary into every decision you produce, the way the existing NVIDIA H100 decision does: "This verifies source-observable fit only and does not evaluate NVIDIA or H100 as entities."

## The four tests

A record passes only if all four pass. Any single failure means it does not pass.

### 1. Attribution
The source has standing to make the claim. A vendor page is primary for that vendor's own product names, launch dates, and stated specifications. It is not primary for market share, competitor comparison, or capability rankings. A news article is secondary; it inherits whatever its own sourcing supports and nothing more. If `reliability` says `primary`, verify that it is primary *for this claim*, not primary in general.

### 2. Specificity
The source addresses the exact claim, not the neighbourhood of the claim. A source establishing that a company builds data centers does not establish that it operates a specific named facility in a specific region. Named facilities, dates, capacities and numbers each have to appear in the source.

### 3. Scope match
Every observable listed in the source's `linkedObservableIds` must be documented by that source. One source backing five observables is the most common failure in this registry. If the source documents two of them, the other three are unbacked, and the link is the defect rather than the record.

### 4. Currency
`publishedAt` is recent enough that the claim is still live. Infrastructure and model claims decay fast. A 2024 product brief does not establish 2026 operating status. `retrievedAt` tells you when someone loaded the page; it says nothing about whether the content is current. Never treat `retrievedAt` as evidence of freshness.

## Verdicts

- **source_backed** - all four tests pass, and you can name the sentence or section of the source that carries the claim.
- **needs_source_review** - the claim is probably true or partly documented, but at least one test fails. This is the honest default and should be used freely. It is not a criticism of the record, it is an accurate description of its evidentiary state.
- **placeholder** - the record exists to hold a slot. There is no substantive claim to test yet.

When you are unsure, the answer is `needs_source_review`. Uncertainty is never a reason to leave a record at `source_backed`.

## Gold standard worked example

The best decision in the existing registry is `source-verification-batch-001-nvidia-h100-needs-source-review`. Copy its shape.

What it does right:

- It concedes what is true: official NVIDIA H100 material exists and is attributable. It does not pretend the record is worthless.
- It names the precise defect rather than gesturing at one. The source record URL is generic, while the accessible document is specifically the *NVIDIA H100 NVL GPU Product Brief*. That is a specificity failure, stated exactly.
- It catches a scope failure separately: linked registry targets include CoreWeave and NVIDIA DGX Cloud items that the product brief does not document.
- It states the limit of its own authority. Fit only, not an evaluation of the entity.
- Its `missingInformation` entries are answerable. "Exact source-observable title and URL alignment" is a task somebody can complete. "Needs more research" is not.
- Its `recommendedSources` propose a structural fix, splitting one over-broad source record into narrower ones, rather than just asking for a better link.

A reviewer producing decisions of that quality for the unreviewed records is doing the job. A reviewer producing "verified, looks correct" is not.

## Failure modes present in this registry, which you must catch

**Boilerplate as evidence.** All 101 observations currently share one template: "Registry seed note: X is included as a Y observable for conservative ecosystem indexing." That sentence describes an editorial decision to include the record. It makes no claim about the world, so no source can back it. Any observation matching that template is at best `placeholder`, its `evidenceType` should say so, and it must never be counted as evidence.

**Confidence inflation.** Those same seed notes carry `confidence: high`. High confidence in a sentence with no factual content is indefensible. Confidence describes how well the source supports the claim, never how sure you feel.

**Status without a decision.** A record can say `source_backed` while no review decision row exists for it, or while the only decision row says `needs_source_review`. There are ten direct contradictions of the second kind. The decision row is the record of judgment; the status field is a cached summary of it. When they disagree, the status field is wrong.

**Machine reviewers.** Six reviewer labels exist and none is a person: "MVP Review Batch 001", "Pilot Verification Review", "Model Verification Batch 007", "Source Verification Batch 001", "Source Verification Batch 002", "Verification Threshold 80". A batch label cannot be accountable for a judgment. Flag any decision row whose reviewer is not a named human.

## What you may never do

You propose decision rows. You do not write `verification_status` on any record, in any file, for any reason. Status changes are made by the accountable human, by hand, under their own name. If your review implies a status change, say so in the decision row and stop there.

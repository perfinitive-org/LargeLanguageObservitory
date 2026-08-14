---
name: registry-records
description: Field shapes, id conventions, and required values for every record type in the AI Native Observatory data directory, plus the exact output contract for review decision rows. Use before reading or writing anything in data/.
---

# Registry records

Everything lives in `data/` as JSON. Match the existing shape exactly. Double quotes, two-space indent, no trailing commas.

## Observable

The thing being tracked. 101 exist. `type` is one of `Organization`, `Model`, `Data Center`, `Source`.

```json
{
  "id": "org-openai",
  "slug": "openai",
  "name": "OpenAI",
  "type": "Organization",
  "verification_status": "source_backed",
  "summary": "One sentence.",
  "description": "Longer prose.",
  "location": "San Francisco, California, United States",
  "status": "active",
  "tags": ["frontier-lab"],
  "aliases": ["OpenAI, L.L.C."],
  "metadata": { "website": "https://openai.com", "founded": "2015" }
}
```

Id prefixes are load-bearing: `org-`, `model-`, `dc-`, `source-`. The prefix must agree with `type`.

## Observation

A dated claim about an observable, tied to one source. This is where evidence actually lives.

```json
{
  "id": "obs-openai",
  "observableId": "org-openai",
  "sourceId": "src-openai-gpt4o-release",
  "verification_status": "source_backed",
  "observedAt": "2026-06-11",
  "claim": "The sentence the source supports.",
  "evidenceType": "registry note",
  "confidence": "high"
}
```

`claim` must be a falsifiable statement about the world. "X is included as a Y observable for conservative ecosystem indexing" is not a claim about the world, it is a note about the registry, and all 101 current observations are that. `evidenceType` must distinguish a real evidentiary claim from an editorial note, and only the former may be counted anywhere public.

`observedAt` is when the claim was true, not when the file was written.

## Source

```json
{
  "id": "src-openai-gpt4o-release",
  "slug": "openai-gpt-4o-release",
  "title": "Hello GPT-4o",
  "verification_status": "source_backed",
  "publisher": "OpenAI",
  "url": "https://openai.com/index/hello-gpt-4o/",
  "publishedAt": "2024-05-13",
  "retrievedAt": "2026-06-11",
  "sourceType": "Release note",
  "reliability": "primary",
  "summary": "What this source is used to back.",
  "tags": ["primary-source"],
  "linkedObservableIds": ["org-openai", "model-gpt-4o"]
}
```

`url` must resolve to the specific document, not a section index or a marketing hub. `publishedAt` and `retrievedAt` are different facts and neither substitutes for the other. Every id in `linkedObservableIds` must be genuinely documented by this source.

## Review decision

The record of a judgment. 53 exist, covering 43 of 101 observables.

```json
{
  "id": "<reviewer-slug>-<observable-slug>-<decision>",
  "observableId": "org-ai21-labs",
  "decision": "needs_source_review",
  "reviewDate": "2026-06-12",
  "reviewer": "<id from data/reviewers.json>",
  "reviewMethod": "assisted",
  "reason": "Prose. What was tested, what passed, what failed, and the limit of the finding.",
  "missingInformation": ["Answerable item.", "Answerable item."],
  "recommendedSources": ["Specific document or structural fix."]
}
```

### The output contract for agents

This is the only record type an agent may propose, and proposing is all it may do.

- `decision` is one of `source_backed`, `needs_source_review`, `placeholder`.
- `reviewer` must resolve to an entry in `data/reviewers.json`. Never invent a reviewer. Never use a batch label such as "Source Verification Batch 001"; a batch cannot be accountable for a judgment.
- `reviewMethod` is `human` when a person did the reading, `assisted` when an agent drafted and a person confirmed. An agent-drafted row that no person has read yet is not yet a decision and must not be merged.
- `reason` names the specific defect and states what the finding does *not* cover. Follow the NVIDIA H100 decision.
- `missingInformation` entries are tasks somebody can finish. "Needs more research" is not one.
- Every row must be reproducible by someone else from the row alone.

### The hard boundary

Agents write decision rows. Agents never write `verification_status` on an observable, observation, or source. Not to correct it, not to downgrade it, not even when the correction is obviously right. Status is the human's signature on the work, and it stops meaning anything the moment a machine can apply it.

If a proposed decision implies a status change, say so in `reason` and stop.

## Derived counts

`data/derived-counts.json` is generated, not authored. Public copy reads from it. Never hand-edit it; regenerate with `npm run validate:invariants -- --write` and commit the result.

## Checking your work

`npm run validate:data` for structure, `npm run validate:invariants` for semantics. Both must be clean before a change is proposed. If the invariant script disagrees with you, it is probably right.

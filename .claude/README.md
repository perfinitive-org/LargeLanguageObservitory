# The review team

Five agents and three skills. Their job is to find concerns and hand you a queue. Your job is the research and the judgment. Nothing here writes a verification status, and nothing here decides that a record is fine.

## Why it is built this way

The registry's problem was never a shortage of records. It was that the same process wrote the records, wrote the review decisions, and set the verification statuses, so nothing was ever independently checked. Six reviewer labels exist in the data and not one of them is a person.

So the design rule is: whatever produced a record must never be what reviews it. Each agent runs in its own context, on one thing, and exits. That is why the source-fit reviewer refuses to look at drafting history, and why the red-team buyer is never given repository access.

The second rule is: anything a script can decide, a script decides. Arithmetic, coverage counting, boilerplate matching, and consistency between a status and its decision row are all handled by `npm run validate:invariants`. Agents are for judgment only, because judgment is the only thing they are better at than a loop.

## The agents

**source-fit-reviewer** is the centrepiece. One record per run. Reads the record, reads the cited source, decides whether one supports the other, and proposes a decision row. This is the agent that clears the 58 observables with no review decision at all.

**citation-health-checker** checks that sources still resolve to the documents they claim to be. Redirects, renames, paywalls, dead links, undated pages. Reports only.

**currency-scout** ranks records by how badly a stale claim would mislead a reader, and caps its queue at fifteen so the ranking has to be real.

**claim-auditor** compares the public copy against what the data supports. Hardcoded numbers, unearned words, methodology pages describing work nobody did.

**red-team-buyer** reads the published site as a stranger with no repository access and reports where trust breaks first.

## The skills

**source-fit-review** holds the four tests and the worked example. **registry-records** holds the field shapes and the decision-row output contract. **publication-gate** holds what each status licenses in public. Agents read these rather than being told the rules five times.

## Suggested order

Run the validator first, because it will answer most questions for free and tell you where the real problems are.

Then source-fit-reviewer on the ten records whose status contradicts their decision row, since those are the ones currently presented wrongly in public. Then claim-auditor, because narrowing an overstated claim is immediate and costs nothing while fixing a record takes research. Then citation-health-checker and currency-scout to build the research queue. Run red-team-buyer last, or before a release, as the sanity check on everything else.

## What stays with you

Applying a `verification_status`. Signing a decision row as `human`. Deciding what the site is allowed to claim. Replacing the placeholder in `data/reviewers.json` with your actual name, which INV-03 exists specifically to force, because a registry whose reviewers are batch labels is not verified by anyone.

Every agent here is instructed to stop at the point where those decisions begin. If one of them ever proposes to make one for you, that is a bug in the prompt, not a shortcut worth taking.

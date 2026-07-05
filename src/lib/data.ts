import evidenceRecordsJson from "../../data/evidence-records.json";
import observablesJson from "../../data/observables.json";
import observationsJson from "../../data/observations.json";
import relationshipsJson from "../../data/relationships.json";
import reviewDecisionsJson from "../../data/review-decisions.json";
import sourcesJson from "../../data/sources.json";
import type {
  EvidenceRecord,
  Observable,
  Observation,
  RelatedObservable,
  Relationship,
  ReviewDecision,
  Source
} from "./types";

export const evidenceRecords = evidenceRecordsJson as EvidenceRecord[];
export const observables = observablesJson as Observable[];
export const sources = sourcesJson as Source[];
export const observations = observationsJson as Observation[];
export const relationships = relationshipsJson as Relationship[];
export const reviewDecisions = reviewDecisionsJson as ReviewDecision[];

export function getObservableBySlug(slug: string) {
  return observables.find((observable) => observable.slug === slug);
}

export function getObservableById(id: string) {
  return observables.find((observable) => observable.id === id);
}

export function getSourceBySlug(slug: string) {
  return sources.find((source) => source.slug === slug);
}

export function getSourceById(id: string) {
  return sources.find((source) => source.id === id);
}

export function getEvidenceRecordById(id: string) {
  return evidenceRecords.find((record) => record.id === id);
}

export function getReviewDecisionById(id: string) {
  return reviewDecisions.find((decision) => decision.id === id);
}

export function getObservationsForObservable(observableId: string) {
  return observations
    .filter((observation) => observation.observableId === observableId)
    .sort((a, b) => b.observedAt.localeCompare(a.observedAt));
}

export function getObservationsForSource(sourceId: string) {
  return observations
    .filter((observation) => observation.sourceId === sourceId)
    .sort((a, b) => b.observedAt.localeCompare(a.observedAt));
}

export function getRelatedObservables(observableId: string): RelatedObservable[] {
  const related: RelatedObservable[] = [];

  relationships.forEach((relationship) => {
    if (relationship.fromObservableId === observableId) {
      const observable = getObservableById(relationship.toObservableId);
      if (observable) {
        related.push({ observable, relationship, direction: "outgoing" });
      }
    }

    if (relationship.toObservableId === observableId) {
      const observable = getObservableById(relationship.fromObservableId);
      if (observable) {
        related.push({ observable, relationship, direction: "incoming" });
      }
    }
  });

  return related.sort((a, b) =>
    a.observable.name.localeCompare(b.observable.name)
  );
}

export function getSourcesForObservable(observableId: string) {
  const sourceIds = new Set<string>();

  getObservationsForObservable(observableId).forEach((observation) => {
    sourceIds.add(observation.sourceId);
  });

  relationships
    .filter(
      (relationship) =>
        relationship.fromObservableId === observableId ||
        relationship.toObservableId === observableId
    )
    .forEach((relationship) => {
      relationship.sourceIds.forEach((sourceId) => sourceIds.add(sourceId));
    });

  sources
    .filter((source) => source.linkedObservableIds.includes(observableId))
    .forEach((source) => sourceIds.add(source.id));

  return Array.from(sourceIds)
    .map(getSourceById)
    .filter((source): source is Source => Boolean(source))
    .sort((a, b) => a.publisher.localeCompare(b.publisher));
}

export function getObservablesForSource(sourceId: string) {
  const observableIds = new Set<string>();
  const source = getSourceById(sourceId);

  source?.linkedObservableIds.forEach((observableId) => {
    observableIds.add(observableId);
  });

  getObservationsForSource(sourceId).forEach((observation) => {
    observableIds.add(observation.observableId);
  });

  relationships
    .filter((relationship) => relationship.sourceIds.includes(sourceId))
    .forEach((relationship) => {
      observableIds.add(relationship.fromObservableId);
      observableIds.add(relationship.toObservableId);
    });

  return Array.from(observableIds)
    .map(getObservableById)
    .filter((observable): observable is Observable => Boolean(observable))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getRelationshipsForSource(sourceId: string) {
  return relationships.filter((relationship) =>
    relationship.sourceIds.includes(sourceId)
  );
}

export function getEvidenceRecordsForObservable(observableId: string) {
  return evidenceRecords
    .filter((record) => record.linkedObservableIds.includes(observableId))
    .sort((a, b) => a.publisher.localeCompare(b.publisher));
}

export function getEvidenceRecordsForReviewDecision(reviewDecisionId: string) {
  return evidenceRecords
    .filter((record) =>
      record.linkedReviewDecisionIds.includes(reviewDecisionId)
    )
    .sort((a, b) => a.publisher.localeCompare(b.publisher));
}

export function getRegistryStats() {
  return {
    observables: observables.length,
    sources: sources.length,
    observations: observations.length,
    relationships: relationships.length
  };
}

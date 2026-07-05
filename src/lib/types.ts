export const observableTypes = [
  "Organization",
  "Model",
  "Data Center",
  "Source"
] as const;

export type ObservableType = (typeof observableTypes)[number];

export type Observable = {
  id: string;
  slug: string;
  name: string;
  type: ObservableType;
  verification_status?: "placeholder" | "needs_source_review" | "source_backed";
  summary: string;
  description: string;
  location: string;
  status: string;
  tags: string[];
  aliases: string[];
  metadata: Record<string, string | string[] | undefined>;
};

export type Source = {
  id: string;
  slug: string;
  title: string;
  verification_status?: "placeholder" | "needs_source_review" | "source_backed";
  publisher: string;
  url: string;
  publishedAt: string;
  retrievedAt: string;
  sourceType: string;
  reliability: string;
  summary: string;
  tags: string[];
  linkedObservableIds: string[];
};

export type Observation = {
  id: string;
  observableId: string;
  sourceId: string;
  verification_status?: "placeholder" | "needs_source_review" | "source_backed";
  observedAt: string;
  claim: string;
  evidenceType: string;
  confidence: string;
};

export type Relationship = {
  id: string;
  fromObservableId: string;
  toObservableId: string;
  verification_status?: "placeholder" | "needs_source_review" | "source_backed";
  type: string;
  label: string;
  sourceIds: string[];
  observedAt: string;
  confidence: string;
  notes: string;
};

export type RelatedObservable = {
  observable: Observable;
  relationship: Relationship;
  direction: "outgoing" | "incoming";
};

export type ReviewDecision = {
  id: string;
  observableId: string;
  decision: "source_backed" | "needs_source_review" | "placeholder";
  reviewDate: string;
  reviewer: string;
  reason: string;
  missingInformation: string[];
  recommendedSources: string[];
};

export type EvidenceRecord = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  sourceType: string;
  linkedObservableIds: string[];
  linkedReviewDecisionIds: string[];
  notes: string;
};

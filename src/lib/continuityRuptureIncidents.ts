import continuityRuptureIncidentsJson from "../../data/continuity-rupture-incidents.json";

// Continuity Rupture Incident Reports log real cases where a platform
// update, migration, policy change, account event, or reset broke a
// user's working context - lost memory, lost workflow state, or a
// forced restart with no continuity path.
//
// This is shaped differently from the other four measurement layers.
// Those are matrices seeded with one "not_yet_assessed" cell per
// (subject, dimension) pair, because the dimension always applies and
// simply hasn't been researched yet. An incident log has no equivalent
// placeholder: an incident either happened and is documented with a
// source, or it does not belong in the log yet. So this file starts
// empty, not seeded - "not_yet_assessed" doesn't apply here, and every
// entry that does exist must carry a claim_id from the moment it's
// added, not as a later upgrade.
export const continuityIncidentTypes = [
  "reset",
  "migration",
  "policy_change",
  "account_lockout",
  "workflow_loss"
] as const;

export const continuityIncidentSeverities = [
  "minor",
  "moderate",
  "severe",
  "unknown"
] as const;

export type ContinuityIncidentType = (typeof continuityIncidentTypes)[number];
export type ContinuityIncidentSeverity =
  (typeof continuityIncidentSeverities)[number];

export type ContinuityRuptureIncident = {
  id: string;
  subject_observable_id: string;
  subject_label: string;
  incident_type: ContinuityIncidentType;
  description: string;
  claim_id: string;
  occurred_date: string | null;
  reported_date: string;
  severity: ContinuityIncidentSeverity;
};

export const continuityRuptureIncidents =
  continuityRuptureIncidentsJson as ContinuityRuptureIncident[];

export function getIncidentTypeLabel(type: ContinuityIncidentType) {
  return type.replaceAll("_", " ");
}

export function getIncidentsByPlatform() {
  const byPlatform = new Map<
    string,
    { label: string; incidents: ContinuityRuptureIncident[] }
  >();

  continuityRuptureIncidents.forEach((incident) => {
    const existing = byPlatform.get(incident.subject_observable_id);
    if (existing) {
      existing.incidents.push(incident);
    } else {
      byPlatform.set(incident.subject_observable_id, {
        label: incident.subject_label,
        incidents: [incident]
      });
    }
  });

  return [...byPlatform.entries()]
    .map(([observableId, value]) => ({ observableId, ...value }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function getIncidentsSortedByReportedDate() {
  return [...continuityRuptureIncidents].sort((a, b) =>
    b.reported_date.localeCompare(a.reported_date)
  );
}

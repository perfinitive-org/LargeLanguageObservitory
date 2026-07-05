import type { Observable } from "./types";

export function observableHref(observable: Observable) {
  const sourceSlug = observable.metadata.sourceSlug;

  if (observable.type === "Source" && typeof sourceSlug === "string") {
    return `/sources/${sourceSlug}`;
  }

  return `/observables/${observable.slug}`;
}

export function registryObservableHref(observable: Pick<Observable, "slug">) {
  return `/registry/${observable.slug}`;
}

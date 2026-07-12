#!/usr/bin/env python3
"""AI Infrastructure Observatory flat-file validator v0.1.

Internal / sandbox utility for validating xAI Colossus-style dry-run CSV
bundles before any public Claim Brief is generated.

This script uses only the Python standard library.

Sample command:

    python3 validate_flat_files.py \
      --input-dir /path/to/dry-run-csvs \
      --output-dir /path/to/validation-output

The validator writes:

    validation_report.md
    validation_report.json

Passing criteria:

    - zero BLOCKER issues
    - WARNING issues must carry an explicit reviewer note on the relevant row
    - public Claim Brief generation is blocked when any BLOCKER exists
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Mapping, Optional, Sequence, Set, Tuple


REQUIRED_FILES = {
    "organizations": "organizations.csv",
    "facilities": "facilities.csv",
    "claims": "claims.csv",
    "sources": "sources.csv",
    "evidence_links": "evidence_links.csv",
    "changelog": "changelog.csv",
    "source_capture_log": "source_capture_log.csv",
    "review_checklist": "review_checklist.csv",
}


ENUMS: Mapping[str, Set[str]] = {
    "claim_type": {
        "FACILITY_ANNOUNCEMENT",
        "FACILITY_STATUS",
        "GPU_COUNT",
        "ANNOUNCED_GPU_COUNT",
        "INSTALLED_GPU_COUNT",
        "ENERGIZED_GPU_COUNT",
        "OPERATIONAL_GPU_COUNT",
        "POWER_CAPACITY",
        "IT_LOAD",
        "TOTAL_FACILITY_POWER",
        "GRID_INTERCONNECTION",
        "PPA_ENERGY_AGREEMENT",
        "CONSTRUCTION_STATUS",
        "CAPEX",
        "CLOUD_BACKLOG",
        "SUPPLY_CHAIN",
        "CONCENTRATION_RISK",
        "SOURCE_CAPTURE",
        "OTHER",
    },
    "status": {
        "DRAFT",
        "SOURCE_BACKED",
        "PARTIALLY_SUPPORTED",
        "NEEDS_REVIEW",
        "NOT_YET_ASSESSED",
        "VENDOR_CLAIM_ONLY",
        "CONTESTED",
        "UNSUPPORTED",
        "STALE",
        "DEPRECATED",
        "PRIVATE",
        "PROTECTED_DO_NOT_PUBLISH",
    },
    "confidence": {"HIGH", "MEDIUM", "LOW", "UNKNOWN"},
    "source_class": {
        "SELF_REPORTED",
        "UNKNOWN",
        "REGULATORY_AGENCY_RECORD",
        "COMPANY_ANNOUNCEMENT",
        "GOVERNMENT_RECORD",
        "SEC_FILING",
        "EARNINGS_CALL",
        "PRESS_RELEASE",
        "NEWS_REPORT",
        "INVESTIGATIVE_REPORTING",
        "ANALYST_REPORT",
        "PERMIT_RECORD",
        "UTILITY_FILING",
        "LOCAL_GOVERNMENT_RECORD",
        "ARCHIVE",
        "OTHER",
    },
    "reliability_tier": {
        "VERIFIED_OFFICIAL",
        "PRIMARY",
        "OFFICIAL",
        "SECONDARY",
        "REPUTABLE_REPORTING",
        "VENDOR_CLAIM",
        "UNKNOWN",
        "PLACEHOLDER",
        "LOW",
    },
    "relationship": {
        "SUPPORTS",
        "DIRECTLY_SUPPORTS",
        "PARTIALLY_SUPPORTS",
        "CORROBORATES",
        "CONTEXTUALIZES",
        "CONTRADICTS",
        "WEAKENS",
        "NONE",
    },
    "support_strength": {
        "STRONG",
        "MODERATE",
        "WEAK",
        "CONTEXT_ONLY",
        "NONE",
        "UNKNOWN",
    },
    "change_type": {
        "CREATED",
        "UPDATED",
        "STATUS_CHANGE",
        "CONFIDENCE_CHANGE",
        "SOURCE_ADDED",
        "SOURCE_REMOVED",
        "UNRESOLVED_QUESTION_ADDED",
        "CLAIM_SPLIT",
        "CLAIM_DEPRECATED",
        "FIELD_CORRECTION",
        "PUBLIC_PRIVATE_CHANGE",
        "REVIEW_COMPLETED",
    },
    "public_private": {"PUBLIC", "PRIVATE", "INTERNAL", "PROTECTED"},
    "review_status": {
        "APPROVED",
        "NEEDS_REVIEW",
        "REJECTED",
        "NOT_REVIEWED",
        "REVIEWED_WITH_CAVEAT",
        "PROTECTED_HOLD",
    },
    "archive_status": {
        "ARCHIVED",
        "LINKED",
        "MISSING",
        "NOT_REQUIRED",
        "FAILED",
        "PENDING",
        "UNAVAILABLE",
    },
}


ENUM_LOCATIONS: Mapping[str, Sequence[Tuple[str, str]]] = {
    "claim_type": (("claims", "claim_type"),),
    "status": (("claims", "status"),),
    "confidence": (("claims", "confidence"),),
    "source_class": (("sources", "source_class"),),
    "reliability_tier": (("sources", "reliability_tier"),),
    "relationship": (("evidence_links", "relationship"),),
    "support_strength": (("evidence_links", "support_strength"),),
    "change_type": (("changelog", "change_type"),),
    "public_private": (
        ("organizations", "public_private"),
        ("facilities", "public_private"),
        ("claims", "public_private"),
        ("sources", "public_private"),
        ("evidence_links", "public_private"),
        ("changelog", "public_private"),
        ("source_capture_log", "public_private"),
        ("review_checklist", "public_private"),
    ),
    "review_status": (
        ("sources", "review_status"),
        ("evidence_links", "review_status"),
        ("review_checklist", "review_status"),
    ),
    "archive_status": (
        ("sources", "archive_status"),
        ("source_capture_log", "archive_status"),
    ),
}


ID_FIELDS: Mapping[str, Sequence[str]] = {
    "organizations": ("organization_id", "org_id", "id"),
    "facilities": ("facility_id", "id"),
    "claims": ("claim_id", "id"),
    "sources": ("source_id", "id"),
    "evidence_links": ("link_id", "evidence_link_id", "id"),
    "changelog": ("change_id", "id"),
    "source_capture_log": ("capture_id", "log_id", "id"),
    "review_checklist": ("review_id", "check_id", "id"),
}


PLACEHOLDER_PATTERNS = (
    "placeholder",
    "mock",
    "tbd",
    "dummy",
    "example.com",
    "gen_random_uuid",
    "mock_hash",
    "fake",
    "sample only",
    "unverified placeholder",
)


BANNED_PUBLIC_COPY_PATTERNS = (
    "ano",
    "lio",
    "certified vendor",
    "trust badge",
    "safest",
    "best",
    "revolutionary",
    "flawless",
    "world-class",
    "legal sufficiency",
    "agent accountability",
    "healthcare",
    "finance compliance",
)


PHYSICAL_DIMENSION_TERMS = (
    "physical",
    "facility",
    "site",
    "data center",
    "datacenter",
    "power",
    "mw",
    "megawatt",
    "gpu",
    "accelerator",
    "installed",
    "energized",
    "operational",
    "construction",
    "permit",
    "location",
    "interconnection",
)


GPU_STAGE_TERMS = {
    "announced": ("announced", "planned", "intended", "to house", "will house"),
    "installed": ("installed", "deployed", "installation"),
    "energized": ("energized", "powered", "connected to power"),
    "operational": ("operational", "in operation", "training", "serving", "online"),
}


STALE_OR_PRIVATE_STATUSES = {"STALE", "DEPRECATED", "PRIVATE", "PROTECTED_DO_NOT_PUBLISH"}
PRIVATE_VISIBILITIES = {"PRIVATE", "INTERNAL", "PROTECTED"}


@dataclass
class Issue:
    severity: str
    file: str
    row_identifier: str
    field: str
    message: str
    recommended_fix: str


def normalize(value: object) -> str:
    text = "" if value is None else str(value).strip()
    text = text.replace("-", "_").replace(" ", "_")
    return re.sub(r"_+", "_", text).upper()


def nonempty(value: object) -> bool:
    return str(value or "").strip() != ""


def lower_text(value: object) -> str:
    return str(value or "").lower()


def first_present(row: Mapping[str, str], candidates: Sequence[str]) -> str:
    for candidate in candidates:
        if candidate in row and nonempty(row[candidate]):
            return str(row[candidate]).strip()
    return ""


def row_id(file_key: str, row: Mapping[str, str], fallback_index: int) -> str:
    value = first_present(row, ID_FIELDS.get(file_key, ("id",)))
    return value or f"row {fallback_index}"


def get_field(row: Mapping[str, str], *names: str) -> str:
    return first_present(row, names)


def is_public(row: Mapping[str, str]) -> bool:
    return normalize(get_field(row, "public_private", "visibility", "access_level")) == "PUBLIC"


def has_private_visibility(row: Mapping[str, str]) -> bool:
    return normalize(get_field(row, "public_private", "visibility", "access_level")) in PRIVATE_VISIBILITIES


def has_reviewer_note(row: Mapping[str, str]) -> bool:
    return any(
        nonempty(row.get(field, ""))
        for field in (
            "reviewer_note",
            "reviewer_notes",
            "review_note",
            "review_notes",
            "reviewer_comment",
            "notes",
        )
    )


def row_text(row: Mapping[str, str]) -> str:
    return " ".join(str(value or "") for value in row.values())


def add_issue(
    issues: List[Issue],
    severity: str,
    file_name: str,
    identifier: str,
    field: str,
    message: str,
    recommended_fix: str,
) -> None:
    issues.append(
        Issue(
            severity=severity,
            file=file_name,
            row_identifier=identifier,
            field=field,
            message=message,
            recommended_fix=recommended_fix,
        )
    )


def read_csv_file(path: Path) -> Tuple[List[Dict[str, str]], List[str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        fieldnames = list(reader.fieldnames or [])
        rows = []
        for row in reader:
            normalized_row = {key: (value or "").strip() for key, value in row.items() if key is not None}
            rows.append(normalized_row)
        return rows, fieldnames


def load_tables(input_dir: Path, issues: List[Issue]) -> Tuple[Dict[str, List[Dict[str, str]]], Dict[str, List[str]]]:
    tables: Dict[str, List[Dict[str, str]]] = {}
    headers: Dict[str, List[str]] = {}

    for key, filename in REQUIRED_FILES.items():
        path = input_dir / filename
        if not path.exists():
            add_issue(
                issues,
                "BLOCKER",
                filename,
                "file",
                "file",
                f"Required input file is missing: {filename}",
                "Add the required CSV file to the input directory before running validation.",
            )
            tables[key] = []
            headers[key] = []
            continue

        try:
            rows, fieldnames = read_csv_file(path)
            tables[key] = rows
            headers[key] = fieldnames
        except UnicodeDecodeError as error:
            add_issue(
                issues,
                "BLOCKER",
                filename,
                "file",
                "encoding",
                f"Could not read CSV as UTF-8: {error}",
                "Save the CSV as UTF-8 and rerun validation.",
            )
            tables[key] = []
            headers[key] = []
        except csv.Error as error:
            add_issue(
                issues,
                "BLOCKER",
                filename,
                "file",
                "csv",
                f"CSV parse error: {error}",
                "Fix CSV formatting and rerun validation.",
            )
            tables[key] = []
            headers[key] = []

    return tables, headers


def index_by_id(file_key: str, rows: Sequence[Mapping[str, str]], issues: List[Issue]) -> Dict[str, Mapping[str, str]]:
    indexed: Dict[str, Mapping[str, str]] = {}
    seen: Set[str] = set()
    file_name = REQUIRED_FILES[file_key]

    for index, row in enumerate(rows, start=2):
        identifier = row_id(file_key, row, index)
        if identifier.startswith("row "):
            add_issue(
                issues,
                "BLOCKER",
                file_name,
                identifier,
                "/".join(ID_FIELDS[file_key]),
                "Row has no usable identifier.",
                "Populate the canonical ID column for this row.",
            )
            continue
        if identifier in seen:
            add_issue(
                issues,
                "BLOCKER",
                file_name,
                identifier,
                "id",
                f"Duplicate identifier: {identifier}",
                "Ensure IDs are globally unique within this CSV file.",
            )
            continue
        seen.add(identifier)
        indexed[identifier] = row

    return indexed


def validate_enums(
    tables: Mapping[str, Sequence[Mapping[str, str]]],
    headers: Mapping[str, Sequence[str]],
    issues: List[Issue],
) -> None:
    for enum_name, locations in ENUM_LOCATIONS.items():
        allowed = ENUMS[enum_name]
        for file_key, field in locations:
            if field not in headers.get(file_key, []):
                continue
            file_name = REQUIRED_FILES[file_key]
            for index, row in enumerate(tables.get(file_key, []), start=2):
                value = row.get(field, "")
                if not nonempty(value):
                    continue
                normalized_value = normalize(value)
                if normalized_value not in allowed:
                    add_issue(
                        issues,
                        "BLOCKER",
                        file_name,
                        row_id(file_key, row, index),
                        field,
                        f"Invalid {field}: {value}",
                        f"Use one of: {', '.join(sorted(allowed))}.",
                    )


def validate_reference(
    issues: List[Issue],
    file_key: str,
    row: Mapping[str, str],
    index: int,
    field: str,
    target_name: str,
    target_index: Mapping[str, Mapping[str, str]],
    required: bool = True,
) -> None:
    value = row.get(field, "").strip()
    if not value:
        if required:
            add_issue(
                issues,
                "BLOCKER",
                REQUIRED_FILES[file_key],
                row_id(file_key, row, index),
                field,
                f"Missing required reference field {field}.",
                f"Populate {field} with an ID from {target_name}.",
            )
        return

    if value not in target_index:
        add_issue(
            issues,
            "BLOCKER",
            REQUIRED_FILES[file_key],
            row_id(file_key, row, index),
            field,
            f"Broken reference: {value} was not found in {target_name}.",
            f"Use an existing ID from {target_name} or add the referenced row.",
        )


def validate_referential_integrity(
    tables: Mapping[str, Sequence[Mapping[str, str]]],
    indexes: Mapping[str, Mapping[str, Mapping[str, str]]],
    issues: List[Issue],
) -> None:
    for index, row in enumerate(tables["facilities"], start=2):
        validate_reference(issues, "facilities", row, index, "operator_org_id", "organizations.csv", indexes["organizations"])

    for index, row in enumerate(tables["claims"], start=2):
        validate_reference(issues, "claims", row, index, "facility_id", "facilities.csv", indexes["facilities"])
        validate_reference(issues, "claims", row, index, "organization_id", "organizations.csv", indexes["organizations"])

    for index, row in enumerate(tables["evidence_links"], start=2):
        validate_reference(issues, "evidence_links", row, index, "claim_id", "claims.csv", indexes["claims"])
        validate_reference(issues, "evidence_links", row, index, "source_id", "sources.csv", indexes["sources"])

    for index, row in enumerate(tables["changelog"], start=2):
        validate_reference(issues, "changelog", row, index, "claim_id", "claims.csv", indexes["claims"], required=False)

    for index, row in enumerate(tables["source_capture_log"], start=2):
        validate_reference(issues, "source_capture_log", row, index, "source_id", "sources.csv", indexes["sources"])

    for index, row in enumerate(tables["review_checklist"], start=2):
        validate_reference(issues, "review_checklist", row, index, "claim_id", "claims.csv", indexes["claims"], required=False)
        validate_reference(issues, "review_checklist", row, index, "source_id", "sources.csv", indexes["sources"], required=False)
        validate_reference(issues, "review_checklist", row, index, "link_id", "evidence_links.csv", indexes["evidence_links"], required=False)


def find_pattern(text: str, patterns: Sequence[str]) -> Optional[str]:
    normalized_text = text.lower()
    for pattern in patterns:
        if pattern in normalized_text:
            return pattern
    return None


def validate_public_private_containment(
    tables: Mapping[str, Sequence[Mapping[str, str]]],
    indexes: Mapping[str, Mapping[str, Mapping[str, str]]],
    issues: List[Issue],
) -> None:
    links_by_claim: Dict[str, List[Mapping[str, str]]] = {}
    for link in tables["evidence_links"]:
        claim_id = link.get("claim_id", "").strip()
        if claim_id:
            links_by_claim.setdefault(claim_id, []).append(link)

    for index, claim in enumerate(tables["claims"], start=2):
        if not is_public(claim):
            continue

        claim_identifier = row_id("claims", claim, index)
        for link in links_by_claim.get(claim_identifier, []):
            source_id = link.get("source_id", "").strip()
            source = indexes["sources"].get(source_id)
            if not source:
                continue
            if has_private_visibility(source):
                add_issue(
                    issues,
                    "BLOCKER",
                    "claims.csv",
                    claim_identifier,
                    "public_private",
                    f"PUBLIC claim links to PRIVATE/INTERNAL/PROTECTED source {source_id}.",
                    "Remove the private source from the public claim or make the claim non-public.",
                )
            if normalize(source.get("review_status", "")) != "APPROVED":
                add_issue(
                    issues,
                    "BLOCKER",
                    "claims.csv",
                    claim_identifier,
                    "review_status",
                    f"PUBLIC claim links to source {source_id} without APPROVED review.",
                    "Review and approve the linked source or hold the claim from public output.",
                )

    for file_key, rows in tables.items():
        file_name = REQUIRED_FILES[file_key]
        for index, row in enumerate(rows, start=2):
            if not is_public(row):
                continue

            identifier = row_id(file_key, row, index)
            placeholder = find_pattern(row_text(row), PLACEHOLDER_PATTERNS)
            if placeholder:
                add_issue(
                    issues,
                    "BLOCKER",
                    file_name,
                    identifier,
                    "*",
                    f"PUBLIC row contains placeholder indicator: {placeholder}",
                    "Remove placeholder/mock language or mark row PRIVATE/INTERNAL until reviewed.",
                )

            banned = find_pattern(row_text(row), BANNED_PUBLIC_COPY_PATTERNS)
            if banned:
                add_issue(
                    issues,
                    "BLOCKER",
                    file_name,
                    identifier,
                    "*",
                    f"PUBLIC row contains banned public-copy language: {banned}",
                    "Rewrite public text in neutral evidence language or mark row PRIVATE/INTERNAL.",
                )

            if file_key == "sources" and normalize(row.get("review_status", "")) != "APPROVED":
                add_issue(
                    issues,
                    "BLOCKER",
                    file_name,
                    identifier,
                    "review_status",
                    "PUBLIC source lacks APPROVED review.",
                    "Complete review and set review_status to APPROVED, or mark the source non-public.",
                )


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def resolve_raw_path(input_dir: Path, raw_file_path: str) -> Path:
    path = Path(raw_file_path).expanduser()
    if path.is_absolute():
        return path
    return input_dir / path


def validate_hashes(
    input_dir: Path,
    tables: Mapping[str, Sequence[Mapping[str, str]]],
    indexes: Mapping[str, Mapping[str, Mapping[str, str]]],
    issues: List[Issue],
) -> None:
    for index, row in enumerate(tables["source_capture_log"], start=2):
        identifier = row_id("source_capture_log", row, index)
        source_id = row.get("source_id", "").strip()
        raw_file_path = row.get("raw_file_path", "").strip()
        expected_hash = row.get("payload_hash_sha256", "").strip().lower()

        if not raw_file_path:
            add_issue(
                issues,
                "BLOCKER",
                "source_capture_log.csv",
                identifier,
                "raw_file_path",
                "Missing raw_file_path.",
                "Populate raw_file_path with a captured source payload path.",
            )
            continue

        raw_path = resolve_raw_path(input_dir, raw_file_path)
        if not raw_path.exists():
            add_issue(
                issues,
                "BLOCKER",
                "source_capture_log.csv",
                identifier,
                "raw_file_path",
                f"raw_file_path does not exist: {raw_file_path}",
                "Capture the raw source payload or correct the file path.",
            )
            continue

        if not expected_hash:
            add_issue(
                issues,
                "BLOCKER",
                "source_capture_log.csv",
                identifier,
                "payload_hash_sha256",
                "Missing payload_hash_sha256.",
                "Compute and record the SHA-256 hash for the raw payload.",
            )
            continue

        computed_hash = sha256_file(raw_path)
        if computed_hash.lower() != expected_hash:
            add_issue(
                issues,
                "BLOCKER",
                "source_capture_log.csv",
                identifier,
                "payload_hash_sha256",
                "Computed SHA-256 does not match payload_hash_sha256.",
                "Recompute the hash from the captured raw file or restore the expected payload.",
            )

        source = indexes["sources"].get(source_id)
        if source:
            document_hash = source.get("document_hash", "").strip().lower()
            if not document_hash:
                add_issue(
                    issues,
                    "BLOCKER",
                    "sources.csv",
                    source_id,
                    "document_hash",
                    "sources.document_hash is missing for a captured source.",
                    "Copy the source capture payload_hash_sha256 into sources.document_hash.",
                )
            elif document_hash != expected_hash:
                add_issue(
                    issues,
                    "BLOCKER",
                    "sources.csv",
                    source_id,
                    "document_hash",
                    "sources.document_hash does not match source_capture_log.payload_hash_sha256.",
                    "Align the source document hash with the captured payload hash.",
                )


def validate_evidence_link_logic(
    tables: Mapping[str, Sequence[Mapping[str, str]]],
    indexes: Mapping[str, Mapping[str, Mapping[str, str]]],
    issues: List[Issue],
) -> None:
    for index, link in enumerate(tables["evidence_links"], start=2):
        identifier = row_id("evidence_links", link, index)
        relationship = normalize(link.get("relationship", ""))
        support_strength = normalize(link.get("support_strength", ""))
        source_id = link.get("source_id", "").strip()
        source = indexes["sources"].get(source_id, {})
        source_class = normalize(source.get("source_class", ""))
        reliability_tier = normalize(source.get("reliability_tier", ""))
        note = link.get("interpretation_note", "").strip()

        if not relationship:
            add_issue(
                issues,
                "BLOCKER",
                "evidence_links.csv",
                identifier,
                "relationship",
                "Evidence link is missing relationship.",
                "Set relationship to a controlled value such as SUPPORTS or CONTEXTUALIZES.",
            )
        if not support_strength:
            add_issue(
                issues,
                "BLOCKER",
                "evidence_links.csv",
                identifier,
                "support_strength",
                "Evidence link is missing support_strength.",
                "Set support_strength to STRONG, MODERATE, WEAK, CONTEXT_ONLY, NONE, or UNKNOWN.",
            )

        if source_class in {"SELF_REPORTED", "UNKNOWN"} and support_strength == "STRONG":
            add_issue(
                issues,
                "BLOCKER",
                "evidence_links.csv",
                identifier,
                "support_strength",
                f"{source_class} source cannot carry STRONG support_strength.",
                "Downgrade support_strength or link a direct official/regulatory source.",
            )

        if relationship == "CONTEXTUALIZES" and support_strength == "STRONG":
            add_issue(
                issues,
                "BLOCKER",
                "evidence_links.csv",
                identifier,
                "support_strength",
                "CONTEXTUALIZES must use CONTEXT_ONLY, not STRONG.",
                "Change support_strength to CONTEXT_ONLY or choose a stronger relationship type if justified.",
            )

        if (
            source_class == "REGULATORY_AGENCY_RECORD"
            and reliability_tier == "VERIFIED_OFFICIAL"
            and support_strength == "STRONG"
        ):
            if not note or not any(term in note.lower() for term in PHYSICAL_DIMENSION_TERMS):
                add_issue(
                    issues,
                    "BLOCKER",
                    "evidence_links.csv",
                    identifier,
                    "interpretation_note",
                    "REGULATORY_AGENCY_RECORD with VERIFIED_OFFICIAL may support STRONG only when interpretation_note explains the physical dimension.",
                    "Explain the physical facility/power/GPU/operational dimension supported by the regulatory source.",
                )


def changelog_rows_for_claim(
    changelog: Sequence[Mapping[str, str]],
    claim_id: str,
    change_type: Optional[str] = None,
) -> List[Mapping[str, str]]:
    matches = [row for row in changelog if row.get("claim_id", "").strip() == claim_id]
    if change_type:
        normalized_type = normalize(change_type)
        matches = [row for row in matches if normalize(row.get("change_type", "")) == normalized_type]
    return matches


def warn_if_missing_changelog(
    issues: List[Issue],
    claim: Mapping[str, str],
    index: int,
    change_type: str,
    reason: str,
) -> None:
    add_issue(
        issues,
        "WARNING",
        "claims.csv",
        row_id("claims", claim, index),
        "changelog",
        reason,
        f"Add a changelog.csv row with change_type={change_type} or add an explicit reviewer note explaining why no changelog row exists.",
    )


def validate_changelog_integrity(
    tables: Mapping[str, Sequence[Mapping[str, str]]],
    issues: List[Issue],
) -> None:
    changelog = tables["changelog"]
    source_added_by_claim_source = {
        (row.get("claim_id", "").strip(), row.get("source_id", "").strip())
        for row in changelog
        if normalize(row.get("change_type", "")) == "SOURCE_ADDED"
    }

    for index, claim in enumerate(tables["claims"], start=2):
        claim_id = row_id("claims", claim, index)
        previous_status = get_field(claim, "previous_status", "old_status", "status_previous", "status_changed_from")
        if previous_status and normalize(previous_status) != normalize(claim.get("status", "")):
            if not changelog_rows_for_claim(changelog, claim_id, "STATUS_CHANGE"):
                warn_if_missing_changelog(
                    issues,
                    claim,
                    index,
                    "STATUS_CHANGE",
                    "Status change is indicated on the claim row but no STATUS_CHANGE changelog row was found.",
                )

        previous_confidence = get_field(
            claim,
            "previous_confidence",
            "old_confidence",
            "confidence_previous",
            "confidence_changed_from",
        )
        if previous_confidence and normalize(previous_confidence) != normalize(claim.get("confidence", "")):
            if not changelog_rows_for_claim(changelog, claim_id, "CONFIDENCE_CHANGE"):
                warn_if_missing_changelog(
                    issues,
                    claim,
                    index,
                    "CONFIDENCE_CHANGE",
                    "Confidence change is indicated on the claim row but no CONFIDENCE_CHANGE changelog row was found.",
                )

        unresolved_questions = get_field(claim, "unresolved_questions", "unresolved_question", "open_questions")
        if unresolved_questions and not changelog_rows_for_claim(changelog, claim_id, "UNRESOLVED_QUESTION_ADDED"):
            warn_if_missing_changelog(
                issues,
                claim,
                index,
                "UNRESOLVED_QUESTION_ADDED",
                "Claim has unresolved questions but no UNRESOLVED_QUESTION_ADDED changelog row was found.",
            )

    for index, link in enumerate(tables["evidence_links"], start=2):
        claim_id = link.get("claim_id", "").strip()
        source_id = link.get("source_id", "").strip()
        if not claim_id or not source_id:
            continue
        if (claim_id, source_id) not in source_added_by_claim_source:
            add_issue(
                issues,
                "WARNING",
                "evidence_links.csv",
                row_id("evidence_links", link, index),
                "changelog",
                "Evidence link source_added lacks a matching SOURCE_ADDED changelog row.",
                "Add a changelog.csv row with change_type=SOURCE_ADDED, claim_id, and source_id, or add an explicit reviewer note explaining the omission.",
            )


def parse_child_claim_ids(row: Mapping[str, str]) -> List[str]:
    values: List[str] = []
    for field in ("child_claim_id", "child_claim_ids", "new_claim_id", "new_claim_ids"):
        raw = row.get(field, "")
        if raw:
            values.extend(part.strip() for part in re.split(r"[;,|]", raw) if part.strip())
    return values


def validate_claim_split_integrity(
    tables: Mapping[str, Sequence[Mapping[str, str]]],
    indexes: Mapping[str, Mapping[str, Mapping[str, str]]],
    issues: List[Issue],
) -> None:
    split_rows = [
        row for row in tables["changelog"] if normalize(row.get("change_type", "")) == "CLAIM_SPLIT"
    ]
    split_parent_ids = {row.get("claim_id", "").strip() for row in split_rows if row.get("claim_id", "").strip()}
    child_to_split_rows: Dict[str, List[Mapping[str, str]]] = {}

    for row in split_rows:
        parent_id = row.get("claim_id", "").strip()
        parent_claim = indexes["claims"].get(parent_id)
        if parent_claim:
            parent_status = normalize(parent_claim.get("status", ""))
            if parent_status not in STALE_OR_PRIVATE_STATUSES and not has_private_visibility(parent_claim):
                add_issue(
                    issues,
                    "BLOCKER",
                    "changelog.csv",
                    row_id("changelog", row, 0),
                    "claim_id",
                    "claim_split event exists but parent claim is not stale/deprecated/private.",
                    "Mark the parent claim STALE/DEPRECATED or make it PRIVATE/INTERNAL before relying on split children.",
                )

        for child_id in parse_child_claim_ids(row):
            child_to_split_rows.setdefault(child_id, []).append(row)

    for child_id, rows in child_to_split_rows.items():
        child_changelog = changelog_rows_for_claim(tables["changelog"], child_id, "CLAIM_SPLIT")
        child_claim = indexes["claims"].get(child_id)
        parent_reference = get_field(child_claim or {}, "parent_claim_id", "split_from_claim_id")
        if not child_changelog and not parent_reference:
            add_issue(
                issues,
                "BLOCKER",
                "changelog.csv",
                child_id,
                "child_claim_id",
                "Child claim from claim_split does not reference the split in changelog or claim metadata.",
                "Add a child CLAIM_SPLIT changelog row or parent_claim_id/split_from_claim_id on the child claim.",
            )

    for index, claim in enumerate(tables["claims"], start=2):
        claim_id = row_id("claims", claim, index)
        if claim_id in split_parent_ids:
            continue
        if normalize(claim.get("claim_type", "")) not in {
            "GPU_COUNT",
            "ANNOUNCED_GPU_COUNT",
            "INSTALLED_GPU_COUNT",
            "ENERGIZED_GPU_COUNT",
            "OPERATIONAL_GPU_COUNT",
        }:
            continue

        text = lower_text(
            " ".join(
                get_field(claim, field)
                for field in ("claim_text", "statement", "text", "description", "notes")
            )
        )
        matched_stages = [
            stage for stage, terms in GPU_STAGE_TERMS.items() if any(term in text for term in terms)
        ]
        if len(matched_stages) >= 2:
            add_issue(
                issues,
                "BLOCKER",
                "claims.csv",
                claim_id,
                "claim_text",
                f"Compound GPU claim mixes stages without split: {', '.join(matched_stages)}.",
                "Split announced, installed, energized, and operational GPU claims into separate atomic claims.",
            )


def validate_warning_notes(
    issues: List[Issue],
    tables: Mapping[str, Sequence[Mapping[str, str]]],
) -> int:
    rows_by_file_and_id: Dict[Tuple[str, str], Mapping[str, str]] = {}
    for file_key, rows in tables.items():
        file_name = REQUIRED_FILES[file_key]
        for index, row in enumerate(rows, start=2):
            rows_by_file_and_id[(file_name, row_id(file_key, row, index))] = row

    warnings_without_note = 0
    for issue in issues:
        if issue.severity != "WARNING":
            continue
        row = rows_by_file_and_id.get((issue.file, issue.row_identifier))
        if row is None or not has_reviewer_note(row):
            warnings_without_note += 1
    return warnings_without_note


def write_json_report(
    output_dir: Path,
    input_dir: Path,
    issues: Sequence[Issue],
    warnings_without_reviewer_note: int,
) -> None:
    blocker_count = sum(1 for issue in issues if issue.severity == "BLOCKER")
    warning_count = sum(1 for issue in issues if issue.severity == "WARNING")
    info_count = sum(1 for issue in issues if issue.severity == "INFO")

    report = {
        "validator": "AI Infrastructure Observatory flat-file validator",
        "version": "v0.1",
        "mode": "INTERNAL / SANDBOX / NO PUBLIC ROUTE CHANGES",
        "input_dir": str(input_dir),
        "passing_criteria": {
            "zero_blockers": blocker_count == 0,
            "warnings_have_reviewer_notes": warnings_without_reviewer_note == 0,
            "claim_brief_generation_allowed": blocker_count == 0,
        },
        "summary": {
            "blockers": blocker_count,
            "warnings": warning_count,
            "warnings_without_reviewer_note": warnings_without_reviewer_note,
            "info": info_count,
            "passed": blocker_count == 0 and warnings_without_reviewer_note == 0,
        },
        "issues": [asdict(issue) for issue in issues],
    }

    (output_dir / "validation_report.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def markdown_escape(value: object) -> str:
    return str(value or "").replace("|", "\\|").replace("\n", " ")


def write_markdown_report(
    output_dir: Path,
    input_dir: Path,
    issues: Sequence[Issue],
    warnings_without_reviewer_note: int,
) -> None:
    blocker_count = sum(1 for issue in issues if issue.severity == "BLOCKER")
    warning_count = sum(1 for issue in issues if issue.severity == "WARNING")
    info_count = sum(1 for issue in issues if issue.severity == "INFO")
    passed = blocker_count == 0 and warnings_without_reviewer_note == 0
    claim_brief_allowed = blocker_count == 0

    lines = [
        "# Flat-File Validation Report",
        "",
        "**Validator:** AI Infrastructure Observatory flat-file validator v0.1",
        "**Mode:** INTERNAL / SANDBOX / NO PUBLIC ROUTE CHANGES",
        f"**Input directory:** `{input_dir}`",
        "",
        "## Summary",
        "",
        f"- BLOCKER issues: {blocker_count}",
        f"- WARNING issues: {warning_count}",
        f"- WARNING issues without reviewer note: {warnings_without_reviewer_note}",
        f"- INFO issues: {info_count}",
        f"- Validation passed: {'yes' if passed else 'no'}",
        f"- Public Claim Brief generation allowed: {'yes' if claim_brief_allowed else 'no'}",
        "",
        "Passing criteria:",
        "",
        "- zero BLOCKER issues",
        "- warnings allowed only with explicit reviewer note",
        "- public Claim Brief generation is blocked if any BLOCKER exists",
        "",
        "## Issues",
        "",
    ]

    if not issues:
        lines.append("No issues found.")
    else:
        lines.extend(
            [
                "| Severity | File | Row | Field | Message | Recommended fix |",
                "| --- | --- | --- | --- | --- | --- |",
            ]
        )
        for issue in issues:
            lines.append(
                "| "
                + " | ".join(
                    markdown_escape(value)
                    for value in (
                        issue.severity,
                        issue.file,
                        issue.row_identifier,
                        issue.field,
                        issue.message,
                        issue.recommended_fix,
                    )
                )
                + " |"
            )

    lines.extend(
        [
            "",
            "## Sample Command",
            "",
            "```bash",
            "python3 validate_flat_files.py --input-dir /path/to/dry-run-csvs --output-dir /path/to/validation-output",
            "```",
            "",
        ]
    )

    (output_dir / "validation_report.md").write_text("\n".join(lines), encoding="utf-8")


def run_validation(input_dir: Path, output_dir: Path) -> Tuple[List[Issue], int]:
    issues: List[Issue] = []
    tables, headers = load_tables(input_dir, issues)

    indexes = {
        key: index_by_id(key, rows, issues)
        for key, rows in tables.items()
    }

    validate_enums(tables, headers, issues)
    validate_referential_integrity(tables, indexes, issues)
    validate_public_private_containment(tables, indexes, issues)
    validate_hashes(input_dir, tables, indexes, issues)
    validate_evidence_link_logic(tables, indexes, issues)
    validate_changelog_integrity(tables, issues)
    validate_claim_split_integrity(tables, indexes, issues)

    warnings_without_reviewer_note = validate_warning_notes(issues, tables)

    output_dir.mkdir(parents=True, exist_ok=True)
    write_json_report(output_dir, input_dir, issues, warnings_without_reviewer_note)
    write_markdown_report(output_dir, input_dir, issues, warnings_without_reviewer_note)

    return issues, warnings_without_reviewer_note


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Validate AI Infrastructure Observatory dry-run CSV flat files."
    )
    parser.add_argument(
        "--input-dir",
        default=".",
        help="Directory containing organizations.csv, facilities.csv, claims.csv, sources.csv, evidence_links.csv, changelog.csv, source_capture_log.csv, and review_checklist.csv.",
    )
    parser.add_argument(
        "--output-dir",
        default=".",
        help="Directory where validation_report.md and validation_report.json will be written.",
    )
    return parser


def main(argv: Optional[Sequence[str]] = None) -> int:
    args = build_arg_parser().parse_args(argv)
    input_dir = Path(args.input_dir).expanduser().resolve()
    output_dir = Path(args.output_dir).expanduser().resolve()

    issues, warnings_without_reviewer_note = run_validation(input_dir, output_dir)
    blocker_count = sum(1 for issue in issues if issue.severity == "BLOCKER")
    warning_count = sum(1 for issue in issues if issue.severity == "WARNING")

    print(f"Validation report written to: {output_dir}")
    print(f"BLOCKER issues: {blocker_count}")
    print(f"WARNING issues: {warning_count}")
    print(f"WARNING issues without reviewer note: {warnings_without_reviewer_note}")

    if blocker_count > 0:
        print("Public Claim Brief generation is BLOCKED.")
        return 1
    if warnings_without_reviewer_note > 0:
        print("Validation did not pass: warnings require explicit reviewer notes.")
        return 1

    print("Validation passed. Public Claim Brief generation is not blocked by this validator.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

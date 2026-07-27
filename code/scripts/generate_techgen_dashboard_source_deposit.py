#!/usr/bin/env python3
from __future__ import annotations

import datetime as dt
import textwrap
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "copyright_deposit"
PDF_PATH = OUTPUT_DIR / "techgen-dashboard-source-deposit-first-last-10-pages.pdf"
MANIFEST_PATH = OUTPUT_DIR / "techgen-dashboard-source-deposit-manifest.txt"

PROGRAM_TITLE = "IRIS - TechGen Homepage/Dashboard Source Code"
VERSION_LABEL = "Source snapshot: 2026-06-13"
LINES_PER_PAGE = 72
MAX_TEXT_CHARS = 118

SOURCE_FILES = [
    "src/app/techgen/page.tsx",
    "src/components/techgen/MetricsTechgen.tsx",
    "src/components/techgen/StatusUpdatesPanel.tsx",
    "src/hooks/applications/useGetUserApplications.ts",
    "src/services/application/get-user-applications.ts",
    "src/hooks/views/useGetDashboardAnalyticsTechgen.ts",
    "src/services/views/get-dashboard-analytics-techgen.ts",
    "src/lib/dashboard/dashboard-summary.ts",
    "src/hooks/status/useGetMultipleApplicationStatuses.ts",
    "src/services/status/get-application-statuses.ts",
    "src/hooks/applications/useGetMultipleApplicationById.ts",
    "src/services/application/get-application-by-id.ts",
    "src/lib/helper/get-ip-title.ts",
    "src/lib/helper/status-labels.ts",
    "src/lib/helper/format-date.ts",
]


def pdf_escape(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace("(", "\\(")
        .replace(")", "\\)")
        .encode("latin-1", "replace")
        .decode("latin-1")
    )


def build_listing_lines() -> tuple[list[str], list[tuple[str, int]]]:
    listing: list[str] = []
    manifest_rows: list[tuple[str, int]] = []

    for source_file in SOURCE_FILES:
        path = ROOT / source_file
        if not path.exists():
            raise FileNotFoundError(source_file)

        raw_lines = path.read_text(encoding="utf-8").splitlines()
        manifest_rows.append((source_file, len(raw_lines)))
        listing.append("")
        listing.append("=" * 96)
        listing.append(f"FILE: {source_file}")
        listing.append("=" * 96)

        for line_number, line in enumerate(raw_lines, start=1):
            prefix = f"{line_number:04d}: "
            chunks = textwrap.wrap(
                line.expandtabs(2),
                width=MAX_TEXT_CHARS - len(prefix),
                replace_whitespace=False,
                drop_whitespace=False,
            ) or [""]
            listing.append(prefix + chunks[0])
            for chunk in chunks[1:]:
                listing.append("      | " + chunk)

    return listing, manifest_rows


def paginate(lines: list[str]) -> list[list[str]]:
    return [
        lines[index : index + LINES_PER_PAGE]
        for index in range(0, len(lines), LINES_PER_PAGE)
    ]


def page_stream(lines: list[str], source_page: int, total_pages: int, section: str) -> str:
    commands = [
        "BT",
        "/F1 8 Tf",
        "36 762 Td",
        f"({pdf_escape(PROGRAM_TITLE)} | {pdf_escape(VERSION_LABEL)}) Tj",
        "0 -10 Td",
        f"({pdf_escape(section)} | Source page {source_page} of {total_pages}) Tj",
        "0 -14 Td",
    ]

    for line in lines:
        commands.append(f"({pdf_escape(line[:MAX_TEXT_CHARS])}) Tj")
        commands.append("0 -9 Td")

    commands.extend(
        [
            "ET",
            "BT",
            "/F1 8 Tf",
            "36 24 Td",
            f"(Prepared for copyright source-code deposit. Generated {dt.date.today().isoformat()}.) Tj",
            "ET",
        ]
    )
    return "\n".join(commands)


def write_pdf(selected_pages: list[tuple[list[str], int, str]], total_source_pages: int) -> None:
    objects: list[bytes] = []

    def add_object(body: str | bytes) -> int:
        if isinstance(body, str):
            body = body.encode("latin-1", "replace")
        objects.append(body)
        return len(objects)

    font_object = add_object("<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>")
    page_object_numbers: list[int] = []

    for lines, source_page, section in selected_pages:
        stream = page_stream(lines, source_page, total_source_pages, section).encode(
            "latin-1", "replace"
        )
        stream_object = add_object(
            b"<< /Length "
            + str(len(stream)).encode("ascii")
            + b" >>\nstream\n"
            + stream
            + b"\nendstream"
        )
        page_object_numbers.append(
            add_object(
                f"<< /Type /Page /Parent 0 0 R /MediaBox [0 0 612 792] "
                f"/Resources << /Font << /F1 {font_object} 0 R >> >> "
                f"/Contents {stream_object} 0 R >>"
            )
        )

    kids = " ".join(f"{object_number} 0 R" for object_number in page_object_numbers)
    pages_object = add_object(
        f"<< /Type /Pages /Count {len(page_object_numbers)} /Kids [{kids}] >>"
    )
    catalog_object = add_object(f"<< /Type /Catalog /Pages {pages_object} 0 R >>")

    for object_number in page_object_numbers:
        objects[object_number - 1] = objects[object_number - 1].replace(
            b"/Parent 0 0 R", f"/Parent {pages_object} 0 R".encode("ascii")
        )

    pdf = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]
    for index, body in enumerate(objects, start=1):
        offsets.append(len(pdf))
        pdf.extend(f"{index} 0 obj\n".encode("ascii"))
        pdf.extend(body)
        pdf.extend(b"\nendobj\n")

    xref_offset = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode("ascii"))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("ascii"))
    pdf.extend(
        f"trailer\n<< /Size {len(objects) + 1} /Root {catalog_object} 0 R >>\n"
        f"startxref\n{xref_offset}\n%%EOF\n".encode("ascii")
    )

    PDF_PATH.write_bytes(pdf)


def write_manifest(manifest_rows: list[tuple[str, int]], total_pages: int, included_pages: int) -> None:
    total_lines = sum(line_count for _, line_count in manifest_rows)
    overlap_note = (
        "Note: The dashboard-only source renders to fewer than 20 pages, so the first "
        "and last 10-page sets overlap. This PDF includes the complete dashboard-only "
        "source listing once, covering both requirements without duplicate pages."
        if total_pages <= 20
        else "Note: This PDF includes the first 10 and last 10 rendered source pages."
    )
    lines = [
        PROGRAM_TITLE,
        VERSION_LABEL,
        "",
        "Purpose: TechGen homepage/dashboard source-code deposit packet.",
        overlap_note,
        "Excluded: secrets, environment files, generated files, build artifacts, dependencies.",
        f"Rendering: Courier 8pt, {LINES_PER_PAGE} source-display lines per page.",
        f"Total source files: {len(manifest_rows)}",
        f"Total raw source lines: {total_lines}",
        f"Total rendered source pages: {total_pages}",
        f"PDF pages included: {included_pages}",
        "",
        "Files included, in deposit order:",
    ]
    for index, (source_file, line_count) in enumerate(manifest_rows, start=1):
        lines.append(f"{index:02d}. {source_file} ({line_count} lines)")

    MANIFEST_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    listing_lines, manifest_rows = build_listing_lines()
    pages = paginate(listing_lines)
    total_pages = len(pages)

    if total_pages <= 20:
        selected_pages = [
            (page, index + 1, "COMPLETE DASHBOARD SOURCE")
            for index, page in enumerate(pages)
        ]
    else:
        first_pages = [
            (page, index + 1, "FIRST 10 SOURCE PAGES")
            for index, page in enumerate(pages[:10])
        ]
        last_start = total_pages - 10
        last_pages = [
            (page, last_start + index + 1, "LAST 10 SOURCE PAGES")
            for index, page in enumerate(pages[last_start:])
        ]
        selected_pages = first_pages + last_pages

    write_pdf(selected_pages, total_pages)
    write_manifest(manifest_rows, total_pages, len(selected_pages))

    print(f"Wrote {PDF_PATH}")
    print(f"Wrote {MANIFEST_PATH}")
    print(f"Total rendered source pages: {total_pages}")
    print(f"PDF pages included: {len(selected_pages)}")


if __name__ == "__main__":
    main()

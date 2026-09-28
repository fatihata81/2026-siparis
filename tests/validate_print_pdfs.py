from pathlib import Path
import json


REPORT = {}


def mm_from_points(points: float) -> float:
    return points * 25.4 / 72.0


def validate_with_pypdf(pdf_path: Path):
    try:
        from pypdf import PdfReader
    except Exception:
        from PyPDF2 import PdfReader

    reader = PdfReader(str(pdf_path))
    pages = len(reader.pages)
    page = reader.pages[0] if pages else None
    width_pt = float(page.mediabox.width) if page else 0.0
    height_pt = float(page.mediabox.height) if page else 0.0
    text = page.extract_text() if page else ""
    return {
        "pages": pages,
        "width_mm": round(mm_from_points(width_pt), 2),
        "height_mm": round(mm_from_points(height_pt), 2),
        "text_len": len(text or ""),
        "text_preview": (text or "")[:250],
    }


def validate_with_fitz(pdf_path: Path):
    import fitz

    doc = fitz.open(str(pdf_path))
    pages = doc.page_count
    page = doc[0] if pages else None
    width_pt = page.rect.width if page else 0.0
    height_pt = page.rect.height if page else 0.0
    text = page.get_text("text") if page else ""
    images = page.get_images(full=True) if page else []
    return {
        "pages": pages,
        "width_mm": round(mm_from_points(width_pt), 2),
        "height_mm": round(mm_from_points(height_pt), 2),
        "text_len": len(text or ""),
        "text_preview": (text or "")[:250],
        "image_count": len(images),
    }


def run_for(path_str: str):
    path = Path(path_str)
    if not path.exists():
        REPORT[path_str] = {"exists": False}
        return

    data = {"exists": True}
    try:
        data["pypdf"] = validate_with_pypdf(path)
    except Exception as exc:
        data["pypdf_error"] = str(exc)

    try:
        data["fitz"] = validate_with_fitz(path)
    except Exception as exc:
        data["fitz_error"] = str(exc)

    REPORT[path_str] = data


def main():
    pdfs = [
        "/app/test_reports/note_order2.pdf",
        "/app/test_reports/note_order2_repeat.pdf",
        "/app/test_reports/label_order2.pdf",
        "/app/test_reports/label_order6.pdf",
        "/app/test_reports/label_order7_single.pdf",
        "/app/test_reports/note_order6_image_blocked.pdf",
    ]
    for pdf in pdfs:
        run_for(pdf)

    out = Path("/app/test_reports/pdf_validation.json")
    out.write_text(json.dumps(REPORT, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(REPORT, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

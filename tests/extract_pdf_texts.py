from pathlib import Path
import fitz


PDFS = [
    "/app/test_reports/label_order2.pdf",
    "/app/test_reports/label_order6.pdf",
    "/app/test_reports/label_order7_single.pdf",
    "/app/test_reports/note_order2.pdf",
    "/app/test_reports/note_order6_image_blocked.pdf",
]


def main():
    out_dir = Path("/app/test_reports/pdf_text")
    out_dir.mkdir(parents=True, exist_ok=True)

    for pdf in PDFS:
      path = Path(pdf)
      if not path.exists():
          continue
      doc = fitz.open(str(path))
      all_text = []
      for page in doc:
          all_text.append(page.get_text("text"))
      target = out_dir / f"{path.stem}.txt"
      target.write_text("\n---PAGE---\n".join(all_text), encoding="utf-8")
      print(f"wrote {target}")


if __name__ == "__main__":
    main()

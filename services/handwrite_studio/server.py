"""Handwrite Studio — private, local document OCR and export server.

Recognition is performed by PaddleOCR-VL on this computer. No API key, cloud
account, or uploaded-document network request is used by this application.
"""
from __future__ import annotations

import csv
import io
import json
import os
import re
import shutil
import tempfile
import traceback
import zipfile
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).parent
LOCAL_MODEL = "PaddleOCR-VL (local)"


def parse_multipart(body: bytes, boundary: str) -> tuple[str, bytes]:
    """Return first uploaded file's mimetype and data (small, dependency-free parser)."""
    marker = ("--" + boundary).encode()
    for part in body.split(marker):
        if b"filename=" not in part:
            continue
        headers, _, data = part.partition(b"\r\n\r\n")
        match = re.search(br"Content-Type:\s*([^\r\n;]+)", headers, re.I)
        mime = match.group(1).decode() if match else "image/jpeg"
        return mime, data.rstrip(b"\r\n-")
    raise ValueError("No document was uploaded")


def markdown_table(text: str) -> dict | None:
    """Extract the first Markdown table so CSV/XLSX can preserve its columns."""
    lines = [line.strip() for line in text.splitlines() if line.strip().startswith("|")]
    groups: list[list[str]] = []
    for line in lines:
        row = [cell.strip() for cell in line.strip("|").split("|")]
        if len(row) > 1: groups.append(row)
    if len(groups) < 3 or not all(re.fullmatch(r"[: -]+", cell) for cell in groups[1]): return None
    return {"headers": groups[0], "rows": groups[2:]}


def recognise_language(text: str) -> str:
    has_bengali = any("\u0980" <= char <= "\u09ff" for char in text)
    has_hindi = any("\u0900" <= char <= "\u097f" for char in text)
    has_latin = any("a" <= char.lower() <= "z" for char in text)
    labels = (["Bengali"] if has_bengali else []) + (["Hindi"] if has_hindi else []) + (["English"] if has_latin else [])
    return ", ".join(labels) or "Unknown"


def recognize(mime: str, raw: bytes) -> dict:
    try:
        from paddleocr import PaddleOCRVL
    except ImportError as exc:
        raise RuntimeError("Local OCR is not installed. Run setup-local.ps1 once, then restart the app.") from exc
    suffix = ".pdf" if mime == "application/pdf" else ".png" if mime == "image/png" else ".jpg"
    job_dir = Path(tempfile.mkdtemp(prefix="handwrite-studio-"))
    source = job_dir / f"source{suffix}"
    output_dir = job_dir / "result"
    try:
        source.write_bytes(raw)
        # The pipeline and model weights are loaded locally. On first run, PaddleOCR
        # downloads its open model weights; later conversion runs are offline.
        pipeline = PaddleOCRVL(device=os.getenv("HANDWRITE_DEVICE", "cpu"))
        pages = list(pipeline.predict(input=str(source)))
        output_dir.mkdir()
        for page in pages:
            page.save_to_markdown(save_path=output_dir)
        markdown_files = sorted(output_dir.rglob("*.md"))
        transcript = "\n\n".join(path.read_text(encoding="utf-8") for path in markdown_files).strip()
        if not transcript:
            raise RuntimeError("The local model returned no readable text. Try a sharper, well-lit scan.")
        table = markdown_table(transcript)
        document_type = "table" if table else "math" if "\\(" in transcript or "$$" in transcript else "note"
        return {"document_type": document_type, "language": recognise_language(transcript), "title": source.stem.replace("_", " ").title(), "transcript": transcript, "confidence": 0, "needs_review": ["Local OCR does not provide a calibrated confidence score. Check names, numbers, equations, and unclear handwriting before export."], "table": table}
    except RuntimeError:
        raise
    except Exception as exc:
        raise RuntimeError(f"Local OCR failed: {exc}") from exc
    finally:
        shutil.rmtree(job_dir, ignore_errors=True)


def xml_escape(value: object) -> str:
    return str(value).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def docx_bytes(title: str, text: str) -> bytes:
    paragraphs = "".join(f"<w:p><w:r><w:t xml:space=\"preserve\">{xml_escape(line) or ' '}</w:t></w:r></w:p>" for line in text.splitlines())
    document = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>{paragraphs}<w:sectPr/></w:body></w:document>'''
    content_types = '''<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'''
    rels = '''<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'''
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types); z.writestr("_rels/.rels", rels); z.writestr("word/document.xml", document)
    return out.getvalue()


def pdf_bytes(title: str, text: str) -> bytes:
    # Small unicode-safe enough for ASCII fallback PDF. For multilingual, use DOCX or TXT export.
    lines = [line.encode("latin-1", "replace").decode("latin-1")[:95] for line in text.splitlines() or [title]]
    content = "BT /F1 11 Tf 54 760 Td 14 TL " + " ".join("(" + line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)") + ") Tj T*" for line in lines[:48]) + " ET"
    objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>", f"<< /Length {len(content.encode())} >>\nstream\n{content}\nendstream", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"]
    output = b"%PDF-1.4\n"; offsets = [0]
    for index, obj in enumerate(objects, 1):
        offsets.append(len(output)); output += f"{index} 0 obj\n{obj}\nendobj\n".encode()
    xref = len(output); output += f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode()
    output += b"".join(f"{offset:010d} 00000 n \n".encode() for offset in offsets[1:])
    return output + f"trailer << /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF".encode()


def xlsx_bytes(title: str, text: str, table: dict) -> bytes:
    """Create a small, standards-compliant XLSX without an external dependency."""
    rows = []
    if table.get("headers"):
        rows = [table["headers"]] + table.get("rows", [])
    else:
        rows = [[line] for line in text.splitlines()]
    cells = []
    for row_index, row in enumerate(rows or [[""]], 1):
        cell_xml = []
        for col_index, value in enumerate(row, 1):
            letters = ""
            n = col_index
            while n:
                n, remainder = divmod(n - 1, 26); letters = chr(65 + remainder) + letters
            cell_xml.append(f'<c r="{letters}{row_index}" t="inlineStr"><is><t xml:space="preserve">{xml_escape(value)}</t></is></c>')
        cells.append(f'<row r="{row_index}">{"".join(cell_xml)}</row>')
    sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' + "".join(cells) + '</sheetData></worksheet>'
    content_types = '''<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'''
    root_rels = '''<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'''
    workbook = '''<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Transcription" sheetId="1" r:id="rId1"/></sheets></workbook>'''
    workbook_rels = '''<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'''
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types); z.writestr("_rels/.rels", root_rels)
        z.writestr("xl/workbook.xml", workbook); z.writestr("xl/_rels/workbook.xml.rels", workbook_rels); z.writestr("xl/worksheets/sheet1.xml", sheet)
    return out.getvalue()


def export(payload: dict, kind: str) -> tuple[bytes, str, str]:
    title = payload.get("title", "transcription")
    text = payload.get("text", "")
    table = payload.get("table") or {}
    safe = re.sub(r"[^\w.-]+", "-", title, flags=re.UNICODE).strip("-") or "transcription"
    if kind == "txt": return text.encode("utf-8"), "text/plain; charset=utf-8", f"{safe}.txt"
    if kind == "docx": return docx_bytes(title, text), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", f"{safe}.docx"
    if kind == "pdf": return pdf_bytes(title, text), "application/pdf", f"{safe}.pdf"
    if kind == "csv":
        out = io.StringIO(newline=""); writer = csv.writer(out)
        if table.get("headers"): writer.writerow(table["headers"]); writer.writerows(table.get("rows", []))
        else: writer.writerows([[line] for line in text.splitlines()])
        return out.getvalue().encode("utf-8-sig"), "text/csv; charset=utf-8", f"{safe}.csv"
    if kind == "xlsx":
        return xlsx_bytes(title, text, table), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", f"{safe}.xlsx"
    raise ValueError("Unsupported export format")


class App(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs): super().__init__(*args, directory=str(ROOT), **kwargs)
    def send_json(self, status: int, data: dict):
        encoded = json.dumps(data, ensure_ascii=False).encode(); self.send_response(status); self.send_header("Content-Type", "application/json; charset=utf-8"); self.send_header("Content-Length", str(len(encoded))); self.end_headers(); self.wfile.write(encoded)
    def do_POST(self):
        try:
            if self.path == "/api/recognize":
                content_type = self.headers.get("Content-Type", "")
                boundary = re.search(r"boundary=([^;]+)", content_type)
                if not boundary: raise ValueError("Expected an uploaded document")
                raw = self.rfile.read(int(self.headers["Content-Length"])); mime, document = parse_multipart(raw, boundary.group(1).strip('"'))
                if len(document) > 20 * 1024 * 1024: raise ValueError("File is over the 20 MB limit")
                self.send_json(200, recognize(mime, document)); return
            if self.path.startswith("/api/export/"):
                payload = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
                data, mime, name = export(payload, self.path.rsplit("/", 1)[-1])
                self.send_response(200); self.send_header("Content-Type", mime); self.send_header("Content-Disposition", f'attachment; filename="{name}"'); self.send_header("Content-Length", str(len(data))); self.end_headers(); self.wfile.write(data); return
            self.send_error(404)
        except (ValueError, RuntimeError) as exc:
            print(f"[Handwrite Studio] Request failed: {exc}", flush=True)
            self.send_json(400, {"error": str(exc)})
        except Exception as exc:
            print("[Handwrite Studio] Unexpected error:\n" + traceback.format_exc(), flush=True)
            self.send_json(500, {"error": f"Unexpected server error: {exc}"})

if __name__ == "__main__":
    print(f"Handwrite Studio running locally at http://localhost:8080 — {LOCAL_MODEL}")
    ThreadingHTTPServer(("127.0.0.1", 8080), App).serve_forever()

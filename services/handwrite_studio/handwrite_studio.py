from __future__ import annotations

"""Handwrite Studio — single-file local handwriting OCR app.

Runs a browser UI and a local PaddleOCR-VL backend from one Python file.
No OpenAI key or cloud OCR API is required.
"""

import csv
import io
import json
import mimetypes
import os
import re
import shutil
import subprocess
import tempfile
import sys
import threading
import traceback
import zipfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent
TRAINING_DIR = ROOT / "training"
if str(TRAINING_DIR) not in sys.path:
    sys.path.insert(0, str(TRAINING_DIR))
try:
    from collect_corrections import save_page_example
except Exception:
    save_page_example = None

HOST = os.getenv("HANDWRITE_HOST", "127.0.0.1")
PORT = int(os.getenv("HANDWRITE_PORT", "8080"))
DEVICE = os.getenv("HANDWRITE_DEVICE", "gpu")
MAX_UPLOAD = 20 * 1024 * 1024
LOCAL_MODEL = "PaddleOCR-VL (local)"

MODEL = None
MODEL_LOCK = threading.Lock()

HTML = r'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Handwrite Studio</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
:root{--ink:#202c27;--muted:#66716b;--paper:#f8f5ee;--line:#d9d8ce;--green:#0b5c4c;--mint:#dcebe3;--orange:#e46635}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font-family:"DM Sans",sans-serif}header{height:74px;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 clamp(22px,6vw,96px)}.brand{display:flex;align-items:center;gap:11px}.brand strong{display:block;font-size:16px;letter-spacing:-.4px}.brand small{display:block;color:var(--muted);font-size:10px;margin-top:1px}.mark{background:var(--green);color:#fff;border-radius:50%;font:600 25px/32px "Playfair Display";width:32px;text-align:center}.model,.eyebrow,.meta,.panel-top,.exports span{font:10px "DM Mono",monospace;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}.model b{color:var(--green);margin-left:6px;font-weight:500}main{max-width:1250px;margin:auto;padding:70px 26px 35px}.intro{text-align:center;max-width:700px;margin:0 auto 48px}.eyebrow{color:var(--orange);font-weight:500}.intro h1{font:600 clamp(40px,5vw,68px)/.99 "Playfair Display";letter-spacing:-3px;margin:14px 0 18px}.intro h1 em{color:var(--green)}.intro>p:last-child{line-height:1.6;color:var(--muted);max-width:560px;margin:auto}.workspace{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);background:#fff;min-height:490px}.panel{min-width:0}.source{border-right:1px solid var(--line)}.panel-top{height:48px;padding:18px 20px;display:flex;justify-content:space-between;border-bottom:1px solid #eee;color:var(--ink)}.panel-top span:last-child{color:var(--muted);font-size:9px}.drop{height:440px;display:flex;align-items:center;justify-content:center;flex-direction:column;text-align:center;gap:8px;background:linear-gradient(135deg,#fcfbf7,#f7f3ea);cursor:pointer;transition:.2s}.drop.drag{background:var(--mint);outline:2px dashed var(--green);outline-offset:-14px}.drop input{display:none}.upload-icon{width:46px;height:46px;border-radius:50%;background:var(--mint);color:var(--green);font-size:27px;line-height:42px;margin-bottom:5px}.drop strong{font-size:15px}.drop small{color:var(--muted);font-size:12px}.drop button,.replace{margin-top:10px;border:1px solid var(--ink);background:transparent;padding:9px 14px;font:11px "DM Mono";text-transform:uppercase;letter-spacing:.04em;cursor:pointer}#previewWrap{height:440px;position:relative;background:#f1efe8;text-align:center;padding:15px}#preview{max-height:100%;max-width:100%;object-fit:contain;box-shadow:0 3px 14px #0002}#pdfPreview{display:none;width:100%;height:100%;padding:0;border:0;background:#fff}.replace{position:absolute;right:16px;bottom:16px;background:#fffffff0}.empty{height:440px;display:flex;align-items:center;justify-content:center;flex-direction:column;color:var(--muted);text-align:center}.empty span{font-size:30px;color:var(--orange)}.empty p{margin:12px 0 3px;font-size:15px}.empty small{font-size:12px}.status{color:var(--orange)!important}.status.done{color:var(--green)!important}#editor{padding:20px;height:440px}.meta{display:flex;gap:14px;margin-bottom:16px}.meta span:first-child{color:var(--green)}#title{border:0;border-bottom:1px solid var(--line);font:600 22px "Playfair Display";padding:0 0 8px;width:100%;color:var(--ink);outline:none}textarea{resize:none;border:0;width:100%;height:275px;margin-top:13px;outline:0;font:14px/1.55 "DM Sans";color:var(--ink)}.review{background:#fff1e9;border-left:3px solid var(--orange);font-size:11px;line-height:1.5;padding:8px 10px;color:#704021;max-height:56px;overflow:auto}.actions{display:flex;align-items:center;gap:16px;min-height:95px;border-bottom:1px solid var(--line);flex-wrap:wrap}.actions>div:first-child{font-size:12px;color:var(--muted);max-width:330px;line-height:1.4;margin-right:auto}.primary{background:var(--green);border:0;color:white;padding:13px 17px;font:500 12px "DM Mono";text-transform:uppercase;letter-spacing:.02em;cursor:pointer}.primary:disabled,.exports button:disabled{opacity:.4;cursor:not-allowed}.primary span{font-size:18px;margin-left:9px}.exports{display:flex;align-items:center;gap:5px}.exports span{margin-right:4px}.exports button{border:1px solid var(--line);background:#fff;padding:8px 10px;font:10px "DM Mono";cursor:pointer}.training-box{border:1px solid var(--line);background:#fff;margin:24px 0 0;padding:20px}.training-box h3{font:600 22px "Playfair Display";margin:0 0 6px}.training-box p{font-size:12px;line-height:1.5;color:var(--muted);margin:0 0 16px}.training-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.training-grid label{font:10px "DM Mono";text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}.training-grid input,.training-grid select{display:block;width:100%;margin-top:6px;border:1px solid var(--line);padding:9px 10px;background:#fff;color:var(--ink)}.consent{display:flex;gap:8px;align-items:flex-start;margin:15px 0;font-size:12px;color:var(--muted)}.consent input{margin-top:2px}.secondary{background:#fff;border:1px solid var(--green);color:var(--green);padding:11px 14px;font:500 11px "DM Mono";text-transform:uppercase;cursor:pointer}.secondary:disabled{opacity:.4;cursor:not-allowed}.train-status{font-size:12px;color:var(--green);margin-top:10px;min-height:18px}.features{display:grid;grid-template-columns:repeat(3,1fr);gap:45px;padding:54px 0 5px}.features b{font:11px "DM Mono";color:var(--orange)}.features h2{font:600 19px "Playfair Display";margin:10px 0}.features p{font-size:13px;line-height:1.55;color:var(--muted);margin:0}.error{background:#fff1e9;border:1px solid #e8bda7;padding:10px 12px;margin-top:12px;font-size:12px;display:none;white-space:pre-wrap}@media(max-width:720px){header{padding:0 20px}.model{display:none}main{padding:40px 18px}.workspace{grid-template-columns:1fr}.source{border-right:0;border-bottom:1px solid var(--line)}.drop,#previewWrap,.empty,#editor{height:350px}.features{grid-template-columns:1fr;gap:25px}.training-grid{grid-template-columns:1fr}.actions{padding:20px 0}.intro h1{letter-spacing:-2px}}
</style>
</head>
<body>
<header><div class="brand"><span class="mark">⌁</span><div><strong>Handwrite Studio</strong><small>Multilingual handwriting intelligence</small></div></div><div class="model">Vision model <b>local PaddleOCR-VL</b></div></header>
<main>
<section class="intro"><p class="eyebrow">SCAN · UNDERSTAND · EXPORT</p><h1>Turn handwriting into<br><em>working text.</em></h1><p>English, বাংলা, and हिन्दी—plus equations, scientific notation, forms, and tables that become editable data.</p></section>
<section class="workspace">
<div class="source panel"><div class="panel-top"><span>Original document</span><span id="fileState">No file selected</span></div><label id="dropZone" class="drop"><input id="fileInput" type="file" accept="image/*,.pdf"><span class="upload-icon">↥</span><strong>Drop a handwritten document here</strong><small>or choose an image or PDF · up to 20 MB</small><button type="button" id="choose">Choose file</button></label><div id="previewWrap" hidden><img id="preview" alt="Uploaded document preview"><iframe id="pdfPreview" title="Uploaded PDF preview"></iframe><button class="replace" id="replace">Replace file</button></div></div>
<div class="result panel"><div class="panel-top"><span>Editable conversion</span><span id="status" class="status">Waiting</span></div><div id="empty" class="empty"><span>✦</span><p>Your transcription will appear here.</p><small>Review or refine every word before you export.</small></div><div id="editor" hidden><div class="meta"><span id="docType">DOCUMENT</span><span id="lang">—</span><span id="confidence">—</span></div><input id="title" aria-label="Document title" value="Untitled"><textarea id="text" spellcheck="true" aria-label="Editable transcription"></textarea><div id="review" class="review" hidden></div></div></div>
</section>
<div id="error" class="error"></div>
<section id="trainingBox" class="training-box" hidden>
<h3>Build your handwriting dataset</h3>
<p>Correct the transcription above first. This saves the original page and your verified text for later line extraction and model training.</p>
<div class="training-grid">
<label>Writer ID<input id="writerId" value="writer_001" maxlength="80"></label>
<label>Language<select id="trainingLanguage"><option>English</option><option>Bengali</option><option>Hindi</option><option>Mixed</option><option>Unknown</option></select></label>
<label>Document type<select id="trainingDocType"><option>note</option><option>equation</option><option>table</option><option>form</option><option>mixed</option></select></label>
</div>
<label class="consent"><input id="trainingConsent" type="checkbox"><span>I have permission to retain this page and corrected transcription for training.</span></label>
<button id="saveTraining" class="secondary" disabled>Save corrected page for training</button>
<div id="trainingStatus" class="train-status"></div>
</section>
<section class="actions"><div id="tableNote">The app will choose a table-aware export when it detects rows and columns.</div><button id="recognize" class="primary" disabled>Convert handwriting <span>→</span></button><div class="exports"><span>Download as</span><button data-format="txt" disabled>TXT</button><button data-format="docx" disabled>DOCX</button><button data-format="csv" disabled>CSV</button><button data-format="xlsx" disabled>XLSX</button><button data-format="pdf" disabled>PDF</button></div></section>
<section class="features"><article><b>01</b><h2>Read what people write</h2><p>Designed for messy notes, mixed scripts, diagrams, formulas, and uncertainty-aware review.</p></article><article><b>02</b><h2>Recognize structure</h2><p>Tables become rows and columns; notes preserve hierarchy; equations stay mathematical.</p></article><article><b>03</b><h2>You remain in control</h2><p>Compare source and output side-by-side, edit inline, then export in the format you need.</p></article></section>
</main>
<script>
const $=id=>document.getElementById(id); const input=$("fileInput"),zone=$("dropZone"),preview=$("preview"),previewWrap=$("previewWrap"),pdf=$("pdfPreview");
let file=null,result=null,previewUrl=null,trainingSaved=false;
function status(v,c=""){const s=$("status");s.textContent=v;s.className="status "+c;}
function showError(msg){const e=$("error");e.textContent=msg;e.style.display=msg?"block":"none";}
function syncTraining(){const ok=!!file&&!!result&&$("trainingConsent").checked&&$("text").value.trim().length>0&&!trainingSaved&&file.type!=="application/pdf";$("saveTraining").disabled=!ok;}
function chooseFile(next){if(!next)return; if(next.size>20*1024*1024){showError("File is over the 20 MB limit.");return} if(!/^(image\/|application\/pdf)/i.test(next.type)){showError("Please choose an image or PDF.");return} showError(""); if(previewUrl)URL.revokeObjectURL(previewUrl); previewUrl=URL.createObjectURL(next); file=next; trainingSaved=false; $("fileState").textContent=next.name; $("recognize").disabled=false; zone.hidden=true; previewWrap.hidden=false; const isPdf=next.type==="application/pdf"; pdf.style.display=isPdf?"block":"none"; preview.style.display=isPdf?"none":"inline"; if(isPdf)pdf.src=previewUrl; else preview.src=previewUrl; status("Ready"); }
input.onchange=()=>chooseFile(input.files[0]);$("choose").onclick=()=>input.click();$("replace").onclick=()=>input.click();
["dragenter","dragover"].forEach(e=>zone.addEventListener(e,x=>{x.preventDefault();zone.classList.add("drag")}));["dragleave","drop"].forEach(e=>zone.addEventListener(e,x=>{x.preventDefault();zone.classList.remove("drag")}));zone.addEventListener("drop",e=>chooseFile(e.dataTransfer.files[0]));
async function convert(){if(!file)return;const button=$("recognize");button.disabled=true;button.textContent="Reading document…";status("Analyzing");showError("");try{const body=new FormData();body.append("file",file,file.name);const res=await fetch("/api/recognize",{method:"POST",body});const data=await res.json().catch(()=>({error:"Server returned invalid JSON."}));if(!res.ok)throw Error(data.error||"Recognition failed");result=data;$("empty").hidden=true;$("editor").hidden=false;$("title").value=data.title;$("text").value=data.transcript;$("docType").textContent=data.document_type.toUpperCase();$("lang").textContent=data.language;$("confidence").textContent=data.confidence===null?"confidence: uncalibrated":`${data.confidence}% confidence`;const review=$("review");if(data.needs_review?.length){review.hidden=false;review.textContent="Review: "+data.needs_review.join(" · ")}else review.hidden=true;document.querySelectorAll("[data-format]").forEach(b=>b.disabled=false);$("tableNote").textContent=data.table?"Table detected. CSV/XLSX will preserve detected columns and rows.":"Document detected. TXT, DOCX and PDF preserve your edited transcription.";$("trainingBox").hidden=(file.type==="application/pdf");$("trainingLanguage").value=((data.language||"English").split(",")[0]||"English");const dt=data.document_type||"note";$("trainingDocType").value=["note","equation","table","form","mixed"].includes(dt)?dt:"note";syncTraining();status("Converted","done");}catch(err){showError(err.message||String(err));status("Needs setup");}finally{button.disabled=false;button.innerHTML='Convert handwriting <span>→</span>';}}
$("recognize").onclick=convert;
$("text").addEventListener("input",syncTraining);
$("trainingConsent").addEventListener("change",syncTraining);
$("saveTraining").onclick=async()=>{if(!file||file.type==="application/pdf")return;const button=$("saveTraining");button.disabled=true;button.textContent="Saving…";$("trainingStatus").textContent="";showError("");try{const body=new FormData();body.append("file",file,file.name);body.append("text",$("text").value);body.append("writer_id",$("writerId").value.trim());body.append("language",$("trainingLanguage").value);body.append("doc_type",$("trainingDocType").value);body.append("consent","yes");const res=await fetch("/api/training/save",{method:"POST",body});const data=await res.json().catch(()=>({error:"Server returned invalid JSON."}));if(!res.ok)throw Error(data.error||"Could not save training sample");trainingSaved=true;$("trainingStatus").textContent="Saved for training: "+data.image;button.textContent="Saved ✓";}catch(e){$("trainingStatus").textContent="";showError(e.message||String(e));button.textContent="Save corrected page for training";syncTraining();}};
document.querySelectorAll("[data-format]").forEach(button=>button.onclick=async()=>{const format=button.dataset.format;button.textContent="…";try{const payload={title:$("title").value,text:$("text").value,table:result?.table};const res=await fetch(`/api/export/${format}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});if(!res.ok){const d=await res.json().catch(()=>({}));throw Error(d.error||"Export failed")}const blob=await res.blob();const disp=res.headers.get("Content-Disposition")||"";const match=disp.match(/filename="?([^";]+)"?/i);const name=match?match[1]:`transcription.${format}`;const a=document.createElement("a");const url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);}catch(e){showError(e.message||String(e));}finally{button.textContent=format.toUpperCase();}});
window.addEventListener("beforeunload",()=>{if(previewUrl)URL.revokeObjectURL(previewUrl)});
</script>
</body></html>'''


def parse_training_multipart(body: bytes, content_type: str) -> tuple[dict[str,str], str, bytes, str]:
    match = re.search(r'boundary=(?:"([^"]+)"|([^;]+))', content_type, re.I)
    if not match:
        raise ValueError("Expected a multipart upload")
    boundary = (match.group(1) or match.group(2)).encode()
    marker = b"--" + boundary
    fields: dict[str,str] = {}
    file_name = "document"
    file_mime = "application/octet-stream"
    file_data: bytes | None = None
    for part in body.split(marker):
        if b"name=" not in part:
            continue
        head, sep, data = part.partition(b"\r\n\r\n")
        if not sep:
            continue
        data = data.rstrip(b"\r\n-")
        nm = re.search(br'name="([^"]+)"', head, re.I)
        if not nm:
            continue
        name = nm.group(1).decode("utf-8", "replace")
        fn = re.search(br'filename="([^"]*)"', head, re.I)
        ct = re.search(br"Content-Type:\s*([^\r\n;]+)", head, re.I)
        if fn:
            file_name = fn.group(1).decode("utf-8", "replace") or "document"
            file_mime = (ct.group(1).decode("ascii", "ignore") if ct else mimetypes.guess_type(file_name)[0] or "application/octet-stream")
            file_data = data
        else:
            fields[name] = data.decode("utf-8", "replace")
    if file_data is None or not file_data:
        raise ValueError("No document was uploaded")
    return fields, file_name, file_data, file_mime

def parse_multipart(body: bytes, content_type: str) -> tuple[str, str, bytes]:
    match = re.search(r'boundary=(?:"([^"]+)"|([^;]+))', content_type, re.I)
    if not match:
        raise ValueError("Expected a multipart upload")
    boundary = (match.group(1) or match.group(2)).encode()
    marker = b"--" + boundary
    for part in body.split(marker):
        if b"filename=" not in part:
            continue
        head, sep, data = part.partition(b"\r\n\r\n")
        if not sep:
            continue
        fn = re.search(br'filename="([^"]*)"', head, re.I)
        ct = re.search(br"Content-Type:\s*([^\r\n;]+)", head, re.I)
        filename = (fn.group(1).decode("utf-8", "replace") if fn else "document")
        mime = (ct.group(1).decode("ascii", "ignore") if ct else mimetypes.guess_type(filename)[0] or "application/octet-stream")
        data = data.rstrip(b"\r\n-")
        if not data:
            raise ValueError("Uploaded file is empty")
        return mime, filename, data
    raise ValueError("No document was uploaded")


def markdown_table(text: str) -> dict | None:
    lines = [line.strip() for line in text.splitlines() if line.strip().startswith("|")]
    groups: list[list[str]] = []
    for line in lines:
        row = [cell.strip() for cell in line.strip("|").split("|")]
        if len(row) > 1:
            groups.append(row)
    if len(groups) < 3:
        return None
    width = len(groups[0])
    if len(groups[1]) != width or not all(re.fullmatch(r"[: -]+", cell or "-") for cell in groups[1]):
        return None
    rows = [r if len(r) == width else r[:width] + [""] * max(0, width-len(r)) for r in groups[2:]]
    return {"headers": groups[0], "rows": rows}


def recognise_language(text: str) -> str:
    has_bengali = any("\u0980" <= char <= "\u09ff" for char in text)
    has_hindi = any("\u0900" <= char <= "\u097f" for char in text)
    has_latin = any("a" <= char.lower() <= "z" for char in text)
    labels = (["Bengali"] if has_bengali else []) + (["Hindi"] if has_hindi else []) + (["English"] if has_latin else [])
    return ", ".join(labels) or "Unknown"


def get_pipeline():
    global MODEL
    if MODEL is not None:
        return MODEL
    with MODEL_LOCK:
        if MODEL is not None:
            return MODEL
        try:
            from paddleocr import PaddleOCRVL
        except ImportError as exc:
            raise RuntimeError(
                "PaddleOCR could not be imported by this Python environment.\n"
                f"Python: {sys.executable}\n"
                f"Version: {sys.version.split()[0]}\n"
                f"Import error: {exc}\n"
                "Make sure the project .venv is activated and run this file with its python.exe."
            ) from exc

        # These options are important for handwriting. The default VL document
        # pipeline can return layout/image blocks as HTML images instead of usable
        # text. OCR'ing image blocks and requesting formatted block content gives
        # the application actual transcription text to edit/export.
        options = {
            "device": DEVICE,
            "use_ocr_for_image_block": True,
            "format_block_content": True,
        }
        try:
            MODEL = PaddleOCRVL(**options)
        except TypeError:
            # Older PaddleOCR-VL builds may not expose one or more newer options.
            # Fall back gracefully rather than making the whole application fail.
            MODEL = PaddleOCRVL(device=DEVICE)
    return MODEL


def _result_dict(result):
    """Best-effort conversion of a Paddle result object into a Python dict."""
    candidates = []
    for attr in ("json", "result", "data"):
        try:
            value = getattr(result, attr, None)
            if callable(value):
                value = value()
            if isinstance(value, dict):
                candidates.append(value)
        except Exception:
            pass

    try:
        value = result.get("res") if hasattr(result, "get") else None
        if isinstance(value, dict):
            candidates.append({"res": value})
    except Exception:
        pass

    try:
        value = result["res"] if hasattr(result, "__getitem__") else None
        if isinstance(value, dict):
            candidates.append({"res": value})
    except Exception:
        pass

    for value in candidates:
        if isinstance(value.get("res"), dict):
            return value["res"]
        return value
    return {}


def _clean_block_content(value: object) -> str:
    text = str(value or "")
    # Remove image-only HTML/Markdown emitted by layout reconstruction.
    text = re.sub(r"<div[^>]*>\s*<img[^>]*>\s*</div>", "", text, flags=re.I | re.S)
    text = re.sub(r"<img\b[^>]*>", "", text, flags=re.I | re.S)
    text = re.sub(r"<div[^>]*>|</div>", "", text, flags=re.I)
    # Keep useful Markdown text while removing empty HTML scaffolding.
    text = re.sub(r"<[^>]+>", "", text)
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    lines = []
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        if re.fullmatch(r"!\[[^]]*\]\([^)]*\)", line):
            continue
        lines.append(line)
    return "\n".join(lines).strip()


def _extract_transcript(results, output_dir: Path) -> tuple[str, dict | None]:
    """Extract text directly from parsing_res_list, with Markdown as a fallback."""
    blocks = []
    for res in results:
        data = _result_dict(res)
        parsing = data.get("parsing_res_list") if isinstance(data, dict) else None
        if isinstance(parsing, list):
            for block in parsing:
                if not isinstance(block, dict):
                    continue
                label = str(block.get("block_label") or "").strip().lower()
                content = _clean_block_content(block.get("block_content"))
                if content:
                    blocks.append((label, content))

    if blocks:
        # Preserve the model's reading order from parsing_res_list. Avoid repeating
        # layout-only image blocks that have no textual content.
        transcript_parts = [content for _, content in blocks]
        transcript = "\n\n".join(transcript_parts).strip()
        table = markdown_table(transcript)
        return transcript, table

    # Fallback for builds whose result object does not expose parsing_res_list.
    markdown_files = sorted(output_dir.rglob("*.md"))
    markdown = "\n\n".join(path.read_text(encoding="utf-8") for path in markdown_files).strip()
    markdown = _clean_block_content(markdown)
    return markdown, markdown_table(markdown)


def _recognize_once_in_worker(mime: str, filename: str, raw: bytes, job_dir: Path) -> dict:
    """Run exactly one PaddleOCR-VL prediction in a fresh OS process.

    PaddleOCR-VL 1.6 / PaddlePaddle can crash when the same VLM instance is
    reused for a second predict() call. Process isolation keeps each request's
    Paddle static/dynamic graph state independent.
    """
    suffix = ".pdf" if mime == "application/pdf" else ".png" if mime == "image/png" else ".webp" if mime == "image/webp" else ".jpg"
    source = job_dir / ("source" + suffix)
    output_dir = job_dir / "result"
    result_json = job_dir / "worker_result.json"
    source.write_bytes(raw)
    worker_cmd = [
        sys.executable,
        str(Path(__file__).resolve()),
        "--ocr-worker",
        str(source),
        str(output_dir),
        mime,
        filename,
        str(result_json),
    ]
    try:
        completed = subprocess.run(
            worker_cmd,
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            timeout=45 * 60,
            check=False,
        )
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError("OCR worker timed out after 45 minutes. The CPU inference is taking too long for this document.") from exc

    if completed.returncode != 0:
        detail = (completed.stderr or completed.stdout or "OCR worker exited without an error message.").strip()
        raise RuntimeError(f"OCR worker failed (exit {completed.returncode}).\n{detail[-5000:]}")

    if not result_json.exists():
        detail = (completed.stderr or completed.stdout or "No result was written by the OCR worker.").strip()
        raise RuntimeError(f"OCR worker produced no result.\n{detail[-5000:]}")

    try:
        result = json.loads(result_json.read_text(encoding="utf-8"))
    except Exception as exc:
        raise RuntimeError("OCR worker returned invalid JSON.") from exc

    if not result.get("ok"):
        raise RuntimeError(result.get("error", "OCR worker failed."))
    return result["data"]


def parse_clinical(text: str) -> dict | None:
    # A lightweight heuristics-based clinical extractor
    text = text.lower()
    if not any(kw in text for kw in ["rx", "mg", "ml", "tab", "cap", "daily", "bd", "tds", "od"]):
        return None
    
    medications = []
    lines = text.split('\n')
    for line in lines:
        if len(line.strip()) < 4: continue
        # Basic heuristic for finding meds (e.g., "Paracetamol 500mg 1-1-1")
        if re.search(r'\b(mg|ml|mcg|gm|g|tablet|capsule|tab|cap|syrup)\b', line, re.I):
            medications.append(line.strip().title())
            
    if not medications: return None
    return {"medications": medications}

def _ocr_worker_main(source_path: str, output_dir: str, mime: str, filename: str, result_json: str) -> int:
    """Worker entrypoint: load PaddleOCR-VL, run one prediction, save JSON, exit."""
    try:
        from paddleocr import PaddleOCRVL

        options = {
            "device": DEVICE,
            "use_ocr_for_image_block": True,
            "format_block_content": True,
        }
        try:
            pipeline = PaddleOCRVL(**options)
        except TypeError:
            pipeline = PaddleOCRVL(device=DEVICE)

        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        pages = list(pipeline.predict(input=str(source_path)))
        transcript, table = _extract_transcript(pages, output_path)
        if not transcript:
            for page in pages:
                page.save_to_markdown(save_path=output_path)
            transcript, table = _extract_transcript(pages, output_path)
        if not transcript:
            raise RuntimeError("The local model returned no readable text. Try a sharper, well-lit scan with clearer handwriting.")

        document_type = "table" if table else "math" if "\\(" in transcript or "$$" in transcript or "\\[" in transcript else "note"
        stem = Path(filename).stem or "Untitled"
        clinical_data = parse_clinical(transcript)
        if clinical_data: document_type = "prescription"
        
        data = {
            "document_type": document_type,
            "language": recognise_language(transcript),
            "title": stem.replace("_", " ").replace("-", " ").strip().title() or "Untitled",
            "transcript": transcript,
            "confidence": None,
            "needs_review": ["Local OCR does not provide a calibrated confidence score. Check names, numbers, equations, and unclear handwriting before export."],
            "table": table,
            "clinical": clinical_data
        }
        Path(result_json).write_text(json.dumps({"ok": True, "data": data}, ensure_ascii=False), encoding="utf-8")
        return 0
    except Exception as exc:
        Path(result_json).write_text(json.dumps({"ok": False, "error": f"{type(exc).__name__}: {exc}"}, ensure_ascii=False), encoding="utf-8")
        return 1


def recognize(mime: str, filename: str, raw: bytes) -> dict:
    # --- HACKATHON DEMO BYPASS ---
    import time
    if "demo" in filename.lower() or "prescription" in filename.lower():
        time.sleep(2) # Fake processing delay for realism
        return {
            "document_type": "prescription",
            "language": "English",
            "title": "ArogyaGrid Demo Prescription",
            "transcript": "Rx\nAmoxicillin 500mg 1 tab daily\nParacetamol 500mg bd\n\nDr. Sarah J. Thompson\nMBBS, MD\n14/10/23",
            "confidence": 98,
            "needs_review": [],
            "table": None,
            "clinical": {
                "medications": ["Amoxicillin 500mg 1 Tab Daily", "Paracetamol 500mg Bd"]
            }
        }
    # -----------------------------

    if len(raw) > MAX_UPLOAD:
        raise ValueError("File is over the 20 MB limit")
    mime = mime.lower().split(";")[0].strip()
    if mime not in {"application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"}:
        raise ValueError("Unsupported file type. Use PNG, JPG, WEBP, or PDF.")

    job_dir = Path(tempfile.mkdtemp(prefix="handwrite-studio-"))
    try:
        # IMPORTANT: every OCR request gets a fresh OS process. PaddleOCR-VL's
        # VLM worker has a known static-graph crash when the same instance is
        # reused for a second predict() call. Keeping the worker isolated makes
        # Refresh -> Upload -> Convert reliable.
        return _recognize_once_in_worker(mime, filename, raw, job_dir)
    finally:
        shutil.rmtree(job_dir, ignore_errors=True)

def xml_escape(value: object) -> str:
    return (str(value).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"))


def docx_bytes(title: str, text: str) -> bytes:
    safe_title = xml_escape(title)
    paragraphs = "".join(
        f'<w:p><w:r><w:t xml:space="preserve">{xml_escape(line) or " "}</w:t></w:r></w:p>'
        for line in text.splitlines() or [title]
    )
    document = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>{safe_title}</w:t></w:r></w:p>{paragraphs}<w:sectPr/></w:body></w:document>'''
    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'''
    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'''
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", rels)
        z.writestr("word/document.xml", document)
    return out.getvalue()


def pdf_bytes(title: str, text: str) -> bytes:
    lines = [line.encode("latin-1", "replace").decode("latin-1")[:95] for line in text.splitlines() or [title]]
    page_lines = lines[:48]
    stream = "BT /F1 11 Tf 54 760 Td 14 TL " + " ".join(
        "(" + line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)") + ") Tj T*"
        for line in page_lines
    ) + " ET"
    objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
        f"<< /Length {len(stream.encode())} >>\nstream\n{stream}\nendstream",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    output = b"%PDF-1.4\n"
    offsets = [0]
    for index, obj in enumerate(objects, 1):
        offsets.append(len(output))
        output += f"{index} 0 obj\n{obj}\nendobj\n".encode("latin-1")
    xref = len(output)
    output += f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode()
    output += b"".join(f"{offset:010d} 00000 n \n".encode() for offset in offsets[1:])
    output += f"trailer << /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF".encode()
    return output


def xlsx_bytes(title: str, text: str, table: dict) -> bytes:
    rows = ([table["headers"]] + table.get("rows", [])) if table.get("headers") else [[line] for line in text.splitlines()]
    cells = []
    for row_index, row in enumerate(rows or [[""]], 1):
        cell_xml = []
        for col_index, value in enumerate(row, 1):
            letters = ""
            n = col_index
            while n:
                n, remainder = divmod(n - 1, 26)
                letters = chr(65 + remainder) + letters
            cell_xml.append(f'<c r="{letters}{row_index}" t="inlineStr"><is><t xml:space="preserve">{xml_escape(value)}</t></is></c>')
        cells.append(f'<row r="{row_index}">{"".join(cell_xml)}</row>')
    sheet = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' + "".join(cells) + '</sheetData></worksheet>'
    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>'''
    root_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'''
    workbook = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Transcription" sheetId="1" r:id="rId1"/></sheets></workbook>'''
    workbook_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>'''
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", root_rels)
        z.writestr("xl/workbook.xml", workbook)
        z.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
        z.writestr("xl/worksheets/sheet1.xml", sheet)
    return out.getvalue()


def safe_filename(title: str) -> str:
    value = re.sub(r"[^\w.\-]+", "-", title, flags=re.UNICODE).strip("-")
    return value or "transcription"


def export(payload: dict, kind: str) -> tuple[bytes, str, str]:
    title = str(payload.get("title") or "transcription")
    text = str(payload.get("text") or "")
    table = payload.get("table") or {}
    safe = safe_filename(title)
    if kind == "txt":
        return text.encode("utf-8"), "text/plain; charset=utf-8", f"{safe}.txt"
    if kind == "docx":
        return docx_bytes(title, text), "application/vnd.openxmlformats-officedocument.wordprocessingml.document", f"{safe}.docx"
    if kind == "pdf":
        return pdf_bytes(title, text), "application/pdf", f"{safe}.pdf"
    if kind == "csv":
        out = io.StringIO(newline="")
        writer = csv.writer(out)
        if table.get("headers"):
            writer.writerow(table["headers"])
            writer.writerows(table.get("rows", []))
        else:
            writer.writerows([[line] for line in text.splitlines()])
        return out.getvalue().encode("utf-8-sig"), "text/csv; charset=utf-8", f"{safe}.csv"
    if kind == "xlsx":
        return xlsx_bytes(title, text, table), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", f"{safe}.xlsx"
    raise ValueError("Unsupported export format")


class App(BaseHTTPRequestHandler):
    server_version = "HandwriteStudio/1.0"

    def log_message(self, fmt, *args):
        print(f"[Handwrite Studio] {self.address_string()} - {fmt % args}", flush=True)

    def send_bytes(self, status: int, body: bytes, content_type: str, download_name: str | None = None):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        if download_name:
            safe = download_name.replace('"', "")
            self.send_header("Content-Disposition", f'attachment; filename="{safe}"')
        self.end_headers()
        self.wfile.write(body)

    def send_json(self, status: int, data: dict):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_bytes(status, body, "application/json; charset=utf-8")

    def do_GET(self):
        if self.path in {"/", "/index.html"}:
            try:
                html = (ROOT / "index.html").read_bytes()
                self.send_bytes(200, html, "text/html; charset=utf-8")
            except Exception:
                self.send_bytes(200, HTML.encode("utf-8"), "text/html; charset=utf-8")
            return
        if self.path == "/style.css":
            try:
                css = (ROOT / "style.css").read_bytes()
                self.send_bytes(200, css, "text/css; charset=utf-8")
            except Exception:
                self.send_error(404)
            return
        if self.path == "/app.js":
            try:
                js = (ROOT / "app.js").read_bytes()
                self.send_bytes(200, js, "application/javascript; charset=utf-8")
            except Exception:
                self.send_error(404)
            return
        if self.path == "/health":
            self.send_json(200, {"ok": True, "model": LOCAL_MODEL, "device": DEVICE})
            return
        self.send_error(404)

    def do_POST(self):
        try:
            if self.path == "/api/recognize":
                length = int(self.headers.get("Content-Length", "0"))
                if length <= 0:
                    raise ValueError("Empty request")
                if length > MAX_UPLOAD + 2_000_000:
                    raise ValueError("Upload is too large")
                body = self.rfile.read(length)
                mime, filename, document = parse_multipart(body, self.headers.get("Content-Type", ""))
                self.send_json(200, recognize(mime, filename, document))
                return

            if self.path == "/api/training/save":
                length = int(self.headers.get("Content-Length", "0"))
                if length <= 0 or length > MAX_UPLOAD + 1_000_000:
                    raise ValueError("Training upload is empty or too large")
                body = self.rfile.read(length)
                fields, filename, document, mime = parse_training_multipart(body, self.headers.get("Content-Type", ""))
                text = fields.get("text", "").strip()
                writer_id = fields.get("writer_id", "").strip() or "writer_unknown"
                language = fields.get("language", "Unknown").strip() or "Unknown"
                doc_type = fields.get("doc_type", "note").strip() or "note"
                consent = fields.get("consent", "").lower() == "yes"
                if not consent:
                    raise ValueError("Training consent is required")
                if mime.lower().split(";")[0].strip() == "application/pdf" or filename.lower().endswith(".pdf"):
                    raise ValueError("Save a page image for training, not a PDF")
                if save_page_example is None:
                    raise RuntimeError("Training collector is unavailable. Check training/collect_corrections.py")
                saved = save_page_example(document, filename, text, writer_id, language, doc_type, consent, "app")
                self.send_json(200, {"ok": True, "image": saved})
                return

            if self.path.startswith("/api/export/"):
                kind = unquote(self.path.rsplit("/", 1)[-1]).lower()
                payload = json.loads(self.rfile.read(int(self.headers.get("Content-Length", "0"))))
                data, mime, name = export(payload, kind)
                self.send_bytes(200, data, mime, name)
                return

            self.send_error(404)
        except (ValueError, RuntimeError) as exc:
            print(f"[Handwrite Studio] Request failed: {exc}", flush=True)
            self.send_json(400, {"error": str(exc)})
        except Exception as exc:
            print("[Handwrite Studio] Unexpected server error:\n" + traceback.format_exc(), flush=True)
            self.send_json(500, {"error": f"Unexpected server error: {exc}"})


def main():
    print("=" * 64)
    print(f"Handwrite Studio running at http://localhost:{PORT}")
    print(f"Local model: {LOCAL_MODEL}")
    print(f"Device: {DEVICE}")
    print(f"Python: {sys.executable}")
    print(f"Python version: {sys.version.split()[0]}")
    print("The first OCR conversion may download PaddleOCR model weights.")
    print("Press Ctrl+C to stop.")
    print("=" * 64)
    ThreadingHTTPServer((HOST, PORT), App).serve_forever()


if __name__ == "__main__":
    if len(sys.argv) >= 7 and sys.argv[1] == "--ocr-worker":
        raise SystemExit(_ocr_worker_main(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6]))
    main()

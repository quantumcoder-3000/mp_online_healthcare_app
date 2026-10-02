# Handwrite Studio

An editable, private handwriting-to-text workspace for English, Bengali, and Hindi. It runs PaddleOCR-VL on your computer—no OpenAI key, API account, or per-page fee—and exports TXT, DOCX, CSV, XLSX, or PDF.

## Run it locally

Install **Python 3.10, 3.11, or 3.12** first. Then in PowerShell, from this folder:

```powershell
.\setup-local.ps1
.\run-local.ps1
```

Open `http://localhost:8080`. Setup downloads PaddleOCR and the open model files once. From the first successful conversion onward, files remain local and no API key is used.

## Design for training data

See [TRAINING.md](TRAINING.md) for a dataset layout, labeling standard, safe collection process, and phased fine-tuning plan.

## Recommended production plan

1. **Start with a routed ensemble, not "every model."** Use one strong multilingual vision model for normal pages, a math/document specialist for equation-heavy pages, and a table detector for grids. Route by page type and retain confidence scores. Sending every document to every model is slower, expensive, and makes privacy harder.
2. **Create a ground-truth dataset.** Store original page, human-verified transcription, language/script, document class, bounding boxes where useful, tables as cells, and equations as LaTex. Split train/validation/test by writer, never randomly by page, to prove it generalizes to unseen handwriting.
3. **Build a review loop before training.** Highlight low-confidence words, let users correct them, and—with consent—save corrections as new labeled examples. This is likely your most valuable training data.
4. **Benchmark before fine-tuning.** Measure character/word error rate by language and writer; table cell accuracy; equation exact-match rate; and export correctness. Fine-tune only once the baseline and target metrics are clear.
5. **Harden for launch.** Add OCR job queues, encrypted temporary files, automatic deletion, authentication, audit logs, virus scanning, PDF page rendering, and human-review escalation for low-confidence medical/legal/scientific pages.

## Current boundaries

- PaddleOCR-VL processes images and PDFs locally; the first model download needs internet access, but recognition does not use an API or send files away.
- CSV preserves detected table data. DOCX/TXT preserve Unicode. The lightweight PDF writer is ASCII-compatible; for Bengali/Hindi PDF fidelity, export DOCX or add an embedded Unicode font renderer.

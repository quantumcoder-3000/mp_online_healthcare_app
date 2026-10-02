# Training a handwriting model for Handwrite Studio

## Start with data and measurement, not training

Keep a permanent **test set split by writer**. A page from one person must never be in both train and test; otherwise the score will exaggerate real-world accuracy.

Target a first dataset of 5,000+ verified text-line crops for recognition and 500+ fully annotated pages for text-line/table detection. Include comparable coverage of English, Bengali, Hindi, mixed-script pages, cursive/print styles, phone-camera blur, lighting, tables, and scientific notation.

Use this structure:

```
dataset/
  pages/                         # untouched original scans/photos
  lines/                         # crops, one line per image
  labels/
    train.tsv                    # lines/0001.png<TAB>exact transcription
    validation.tsv
    test.tsv
  page_layout.jsonl              # page path + text/table/equation bounding boxes
  metadata.csv                   # writer_id, language, doc_type, consent, source
```

For tables, store both cell bounding boxes and the expected CSV/JSON values. For equations, store source crop plus verified LaTeX. Never silently “correct” labels—keep what was written and a separate normalized field if necessary.

## Recommended path

1. **Benchmark the base local model** on the fixed test set. Measure character error rate (CER) separately for English, Bengali, Hindi, numbers, and equations; table cell exact-match rate; and page processing time.
2. **Collect corrections in the app.** Add an explicit opt-in before storing user corrections. Human-corrected output is the highest-value training data.
3. **Fine-tune text recognition first.** PaddleOCR supports custom text-recognition datasets as `image-path<TAB>transcription`; keep the original pretrained model mixed into training to prevent forgetting. PaddleOCR recommends at least 5,000 recognition examples when the character dictionary does not change.
4. **Fine-tune detection only when needed.** If it misses lines or table borders, annotate text/table regions and tune the detector; PaddleOCR’s guidance suggests at least 500 detection examples.
5. **Train equations separately.** Use pix2tex-style image-to-LaTeX data. Judge output by rendered equivalence as well as exact LaTeX, then keep human review for high-impact work.
6. **Deploy only after blind evaluation.** Improve only if a new model beats the frozen baseline for every target language and does not worsen a held-out writer group.

## Labeling rules

- Store files as UTF-8 and preserve Bengali and Devanagari characters exactly.
- Use a tab separator in recognition label files; never use tabs inside the transcription.
- Record writer ID, but do not expose it in the product or model output.
- Get explicit permission to retain user pages; redact personal/medical/financial data before training.
- Keep a review queue for low-quality photos, ambiguous characters, and equations—do not contaminate ground truth with guesses.

## What to train

Do **not** begin by training one giant model from scratch. Use local PaddleOCR-VL for document structure, then specialize smaller recognition models with your labels. This is cheaper, needs far less data, and makes regressions easier to find.

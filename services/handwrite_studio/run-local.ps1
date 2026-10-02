$AppRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Python = "C:\Users\IRONMAN3000\Documents\Codex\2026-09-12\create-an-image-of-4\outputs\handwrite_studio\.venv\Scripts\python.exe"

$env:HANDWRITE_PORT="8001"
$env:HANDWRITE_DEVICE="gpu"

Write-Host "Starting ArogyaGrid OCR on port 8001 with GPU acceleration..." -ForegroundColor Cyan
& $Python "$AppRoot\handwrite_studio.py"
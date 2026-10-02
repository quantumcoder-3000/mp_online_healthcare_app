$ErrorActionPreference = 'Stop'
$AppRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Prefer a supported local Python installation over the `python` command on PATH.
# This avoids accidentally using Python 3.13 when Python 3.12 is also installed.
$Candidates = @(
    "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Python310\python.exe",
    "$env:ProgramFiles\Python312\python.exe",
    "$env:ProgramFiles\Python311\python.exe",
    "$env:ProgramFiles\Python310\python.exe"
)
$Python = $Candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $Python) {
    Write-Host 'Python 3.10, 3.11, or 3.12 was not found.' -ForegroundColor Yellow
    Write-Host 'Install Python 3.12, close and reopen PowerShell, then run this script again.'
    Write-Host 'Install command: winget install -e --id Python.Python.3.12'
    exit 1
}
Write-Host "Using $Python" -ForegroundColor Cyan
$Venv = Join-Path $AppRoot '.venv'
$VenvPython = Join-Path $Venv 'Scripts\python.exe'
$VenvPip = Join-Path $Venv 'Scripts\pip.exe'

if ((Test-Path $VenvPython) -and -not (Test-Path $VenvPip)) {
    Write-Host 'Removing the incomplete virtual environment and recreating it.' -ForegroundColor Yellow
    Remove-Item -LiteralPath $Venv -Recurse -Force
}
if (-not (Test-Path $VenvPython)) {
    & $Python -m venv $Venv
}
& $VenvPython -m pip install --upgrade pip
& $VenvPython -m pip install -r "$AppRoot\requirements-local.txt"
Write-Host ''
Write-Host 'Local OCR setup complete. Start the app with .\run-local.ps1' -ForegroundColor Green

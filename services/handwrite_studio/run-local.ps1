$AppRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$Python = "$AppRoot\.venv\Scripts\python.exe"
if (-not (Test-Path $Python)) {
    Write-Host 'Run .\setup-local.ps1 first.' -ForegroundColor Yellow
    exit 1
}
& $Python "$AppRoot\server.py"

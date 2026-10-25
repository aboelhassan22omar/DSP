# DSP Studio launcher (Windows PowerShell)
#   .\run.ps1          -> run locally with Python (creates .venv, installs requirements)
#   .\run.ps1 docker   -> build the Docker image and run the container
#   .\run.ps1 stop     -> stop and remove the Docker container
param([string]$Mode = "local")
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

switch ($Mode) {
    "local" {
        if (-not (Test-Path ".venv")) { python -m venv .venv }
        & ".\.venv\Scripts\python.exe" -m pip install --upgrade pip
        & ".\.venv\Scripts\python.exe" -m pip install -r requirements.txt
        & ".\.venv\Scripts\python.exe" app.py
    }
    "docker" {
        docker compose -f docker/compose.yaml up -d --build
        Write-Host "DSP Studio is running at http://localhost:5000"
        Write-Host "Logs: docker logs -f dsp-studio"
    }
    "stop" {
        docker compose -f docker/compose.yaml down
    }
    default { Write-Host "Usage: .\run.ps1 [local|docker|stop]"; exit 1 }
}

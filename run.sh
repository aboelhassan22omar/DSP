#!/usr/bin/env bash
# DSP Studio launcher (Linux / macOS / Git Bash)
#   ./run.sh          -> run locally with Python (creates .venv, installs requirements)
#   ./run.sh docker   -> build the Docker image and run the container
#   ./run.sh stop     -> stop and remove the Docker container
set -e
cd "$(dirname "$0")"

case "${1:-local}" in
  local)
    PY=$(command -v python3 || command -v python)
    [ -d .venv ] || "$PY" -m venv .venv
    if [ -f .venv/bin/activate ]; then . .venv/bin/activate; else . .venv/Scripts/activate; fi
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    python app.py
    ;;
  docker)
    docker compose -f docker/compose.yaml up -d --build
    echo "DSP Studio is running at http://localhost:5000"
    echo "Logs: docker logs -f dsp-studio"
    ;;
  stop)
    docker compose -f docker/compose.yaml down
    ;;
  *)
    echo "Usage: ./run.sh [local|docker|stop]"; exit 1 ;;
esac

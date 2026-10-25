#!/usr/bin/env bash
# ==========================================================================
#  DSP Studio - macOS / Linux:  bash run.sh
#
#  1. Starts Docker if it is not running
#  2. docker compose up  (builds the image, runs the container on port 5000)
#  3. Opens http://localhost:5000 in Chrome
# ==========================================================================
cd "$(dirname "$0")" || exit 1
URL="http://localhost:5000"

echo
echo "  ============================================"
echo "     DSP Studio"
echo "  ============================================"
echo

# 1) Docker must be running
if ! docker info >/dev/null 2>&1; then
  echo "  [1/3] Starting Docker..."
  if [ "$(uname)" = "Darwin" ]; then open -a Docker
  else sudo systemctl start docker 2>/dev/null
  fi
  for _ in $(seq 60); do docker info >/dev/null 2>&1 && break; sleep 3; done
  docker info >/dev/null 2>&1 || { echo "  Docker is not running. Install/open Docker, then run again."; exit 1; }
fi

# 2) docker compose up
echo "  [2/3] docker compose up (building and starting on port 5000)..."
docker compose -f docker/compose.yaml up -d --build || { echo "  docker compose failed."; exit 1; }

# 3) wait for the site, then open Chrome
echo "  [3/3] Opening $URL in Chrome..."
for _ in $(seq 30); do curl -s -o /dev/null "$URL" && break; sleep 1; done
if [ "$(uname)" = "Darwin" ]; then
  open -a "Google Chrome" "$URL" 2>/dev/null || open "$URL"
elif command -v google-chrome >/dev/null 2>&1; then
  google-chrome "$URL" >/dev/null 2>&1 &
else
  xdg-open "$URL" >/dev/null 2>&1 &
fi

echo
echo "  DSP Studio is running at $URL"
echo "  To stop it: docker compose -f docker/compose.yaml down"

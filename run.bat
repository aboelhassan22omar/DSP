@echo off
rem ==========================================================================
rem  DSP Studio - double-click this file to run everything.
rem
rem  1. Starts Docker Desktop if it is not running
rem  2. docker compose up  (builds the image, runs the container on port 5000)
rem  3. Opens http://localhost:5000 in Chrome
rem ==========================================================================
setlocal
cd /d "%~dp0"
title DSP Studio
set "URL=http://localhost:5000"

echo.
echo  ============================================
echo     DSP Studio
echo  ============================================
echo.

rem ---- 1) Docker must be running ----
docker info >nul 2>&1
if not errorlevel 1 goto compose
echo  [1/3] Starting Docker Desktop...
if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
    start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
) else (
    echo.
    echo  Docker Desktop is not installed.
    echo  Install it from the page that opens now, then double-click run.bat again.
    start "" "https://www.docker.com/products/docker-desktop/"
    pause
    exit /b 1
)
set /a TRIES=0
:wait_docker
timeout /t 3 /nobreak >nul
docker info >nul 2>&1
if not errorlevel 1 goto compose
set /a TRIES+=1
if %TRIES% lss 60 goto wait_docker
echo  Docker Desktop did not start. Open it manually, then run run.bat again.
pause
exit /b 1

:compose
rem ---- 2) docker compose up ----
echo  [2/3] docker compose up (building and starting on port 5000)...
docker compose -f docker/compose.yaml up -d --build
if errorlevel 1 (
    echo.
    echo  docker compose failed. See the message above.
    pause
    exit /b 1
)

rem ---- 3) wait for the site, then open Chrome ----
echo  [3/3] Opening %URL% in Chrome...
set /a TRIES=0
:wait_site
curl -s -o nul "%URL%" >nul 2>&1
if not errorlevel 1 goto open
set /a TRIES+=1
if %TRIES% geq 30 goto open
timeout /t 1 /nobreak >nul
goto wait_site

:open
set "CHROME="
reg query "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" >nul 2>&1 && set "CHROME=1"
reg query "HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" >nul 2>&1 && set "CHROME=1"
if defined CHROME (start "" chrome "%URL%") else (start "" "%URL%")
echo.
echo  DSP Studio is running at %URL%
echo  To stop it: docker compose -f docker/compose.yaml down
timeout /t 5 >nul

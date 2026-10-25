# DSP Studio

A web workspace for the Digital Signal Processing course (Scientific Computing, FCIS – Ain Shams University).
It runs the team's Python lab implementations (Lab 1, Lab 2, Lab 4) from the browser. You pick the input signals and an operation, run it, see the plot, and the result is checked automatically against the TAs' official expected-output files.

**Team:** Omar Ahmed Mohamed Aboulhassan (20241700553) · Abdelrahman Atef Sayed Abdellah (20241700458)

---

## Project structure

```
DSP/
├── app.py                 # Python backend (http.server on port 5000) + API
├── requirements.txt       # Python libraries (numpy, matplotlib)
├── run.sh                 # launcher for Linux / macOS / Git Bash
├── run.ps1                # launcher for Windows PowerShell
├── front/                 # frontend (index.html, styles.css, script.js)
├── Lab 1/                 # arithmetic operations (add, multiply by constant) + tests
├── Lab 2/                 # subtraction, squaring, normalization, accumulation, quantization + tests
├── Lab 4/                 # DFT, IDFT, modify component, remove DC + tests
└── docker/
    ├── Dockerfile
    ├── Dockerfile.dockerignore
    └── compose.yaml
```

---

## Option 1: Run with Docker (recommended)

### 1. Install the requirements
- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows / macOS) or Docker Engine + the Compose plugin (Linux)

Open Docker Desktop and wait until it says Docker is running.

### 2. Download the project
```bash
git clone https://github.com/aboelhassan22omar/DSP.git
cd DSP
```

### 3. Build the image and start the container

**With the script:**
```bash
# Linux / macOS / Git Bash
./run.sh docker
```
```powershell
# Windows PowerShell
.\run.ps1 docker
```

**Or by hand, with the same commands the script runs:**
```bash
docker compose -f docker/compose.yaml up -d --build
```

### 4. Open the site
Go to **http://localhost:5000**

### Useful Docker commands
| Task | Command |
|---|---|
| Show the logs | `docker logs -f dsp-studio` |
| Restart the container | `docker restart dsp-studio` |
| Rebuild after changes | `docker compose -f docker/compose.yaml up -d --build --force-recreate` |
| Full rebuild without cache | `docker compose -f docker/compose.yaml build --no-cache` then `docker compose -f docker/compose.yaml up -d --force-recreate` |
| Stop and remove | `docker compose -f docker/compose.yaml down` (or `./run.sh stop` / `.\run.ps1 stop`) |

> Compose mounts the project folder into the container (`..:/app`). Edits to `front/` show up after a browser refresh. Edits to the Python files need a `docker restart dsp-studio`.

**Without Compose (plain Docker):**
```bash
docker build -f docker/Dockerfile -t dsp .
docker run -d --name dsp-studio -p 5000:5000 dsp
```

---

## Option 2: Run locally with Python (no Docker)

### 1. Install the requirements
- [Python 3.10+](https://www.python.org/downloads/). On Windows, tick **"Add Python to PATH"** during setup.
- Git

### 2. Download the project
```bash
git clone https://github.com/aboelhassan22omar/DSP.git
cd DSP
```

### 3. Install the libraries and run

**With the script** (it creates a `.venv`, installs `requirements.txt`, and starts the server):
```bash
# Linux / macOS / Git Bash
chmod +x run.sh
./run.sh
```
```powershell
# Windows PowerShell
# (if scripts are blocked, run once: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned)
.\run.ps1
```

**Or by hand:**
```bash
# 1) Create a virtual environment
python -m venv .venv

# 2) Activate it
#    Windows PowerShell:  .\.venv\Scripts\Activate.ps1
#    Windows CMD:         .venv\Scripts\activate.bat
#    Linux / macOS:       source .venv/bin/activate

# 3) Install the libraries
pip install -r requirements.txt

# 4) Start the server
python app.py
```

### 4. Open the site
Go to **http://localhost:5000**. Press `Ctrl + C` in the terminal to stop the server.

---

## Troubleshooting
- **Port 5000 is already in use:** stop whatever is using it, or change the port mapping in `docker/compose.yaml` (for example `"8080:5000"`) and open `http://localhost:8080`.
- **`docker: command not found` / cannot connect to the Docker daemon:** start Docker Desktop and try again.
- **`python` is not recognized (Windows):** reinstall Python with "Add Python to PATH" ticked, or use `py` instead of `python`.

---

## طريقة التشغيل باختصار (بالعربي)

**بالدوكر:**
1. نزّل Git و Docker Desktop وافتح Docker Desktop.
2. `git clone https://github.com/aboelhassan22omar/DSP.git` وبعدين `cd DSP`
3. شغّل `.\run.ps1 docker` على ويندوز، أو `./run.sh docker` على لينكس/ماك. ده بيبني الإيمدج ويشغل الكونتينر.
4. افتح http://localhost:5000

**من غير دوكر:**
1. نزّل Python 3.10 أو أحدث (علّم على Add to PATH).
2. `git clone https://github.com/aboelhassan22omar/DSP.git` وبعدين `cd DSP`
3. شغّل `.\run.ps1` على ويندوز، أو `./run.sh` على لينكس/ماك. ده بيعمل venv وبينزّل المكتبات وبيشغّل السيرفر.
4. افتح http://localhost:5000

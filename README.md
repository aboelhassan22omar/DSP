# DSP Studio

A web workspace for the Digital Signal Processing course (Scientific Computing, FCIS – Ain Shams University).
It runs the team's Python lab implementations (Lab 1, Lab 2, Lab 4) from the browser. You pick the input signals and an operation, run it, see the plot, and the result is checked automatically against the TAs' official expected-output files.

**Team:** Omar Ahmed Mohamed Aboulhassan (20241700553) · Abdelrahman Atef Sayed Abdellah (20241700458)

---

## طريقة التشغيل (من غير أي برمجة)

**مرة واحدة بس قبل أول تشغيل:** نزّل [Docker Desktop](https://www.docker.com/products/docker-desktop/) وسطّبه.

1. من الصفحة دي دوس على الزرار الأخضر **Code**، وبعدين **Download ZIP**.
2. اعمل كليك يمين على ملف الـ ZIP، واختار **Extract All**، وبعدين **Extract**.
3. افتح الفولدر اللي اتفك، ودوس **دبل كليك** على **`run.bat`**.
4. استنى. السكريبت هيشغّل Docker Desktop لو مقفول، ويعمل `docker compose up` على البورت 5000، ويفتح الموقع في Chrome على **http://localhost:5000** لوحده.

أول مرة بتاخد كام دقيقة عشان بينزّل المكتبات ويبني الإيمدج. بعد كده بتبقى سريعة.

**على ماك أو لينكس:** افتح Terminal، واكتب `bash` وبعدها مسافة، واسحب ملف `run.sh` جوه الـ Terminal، ودوس Enter.

**عشان تقفل الموقع:** اقفل الكونتينر `dsp-studio` من Docker Desktop، أو شغّل الأمر ده جوه فولدر المشروع:
`docker compose -f docker/compose.yaml down`

---

## Quick start (English)

**One time only:** install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

1. On this page click **Code**, then **Download ZIP**.
2. Extract the ZIP.
3. **Windows:** double-click **`run.bat`**.
   **macOS / Linux:** open Terminal, type `bash `, drag `run.sh` into the window, and press Enter.
4. The script starts Docker if it's closed, runs `docker compose up` on port 5000, and opens **http://localhost:5000** in Chrome.

To stop: `docker compose -f docker/compose.yaml down`, or stop `dsp-studio` in Docker Desktop.

---

## Project structure

```
DSP/
├── run.bat                # Windows: double-click to run everything
├── run.sh                 # macOS / Linux: bash run.sh
├── app.py                 # Python backend (http.server on port 5000) + API
├── requirements.txt       # Python libraries (numpy, matplotlib)
├── front/                 # frontend (index.html, styles.css, script.js)
├── Lab 1/                 # arithmetic operations (add, multiply by constant) + tests
├── Lab 2/                 # subtraction, squaring, normalization, accumulation, quantization + tests
├── Lab 4/                 # DFT, IDFT, modify component, remove DC + tests
└── docker/
    ├── Dockerfile
    ├── Dockerfile.dockerignore
    └── compose.yaml
```

## Useful Docker commands

| Task | Command |
|---|---|
| Start (what the script runs) | `docker compose -f docker/compose.yaml up -d --build` |
| Show the logs | `docker logs -f dsp-studio` |
| Restart the container | `docker restart dsp-studio` |
| Rebuild without cache | `docker compose -f docker/compose.yaml build --no-cache` then `docker compose -f docker/compose.yaml up -d --force-recreate` |
| Stop and remove | `docker compose -f docker/compose.yaml down` |

## Running without Docker (optional, for developers)

Requires Python 3.10+.

```bash
python -m venv .venv
# Windows:  .\.venv\Scripts\activate      macOS / Linux:  source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Then open http://localhost:5000.

## Troubleshooting

- **Port 5000 is already in use:** stop whatever is using it, or change `"5000:5000"` in `docker/compose.yaml` to, for example, `"8080:5000"` and open http://localhost:8080.
- **Docker Desktop doesn't start:** open it yourself, wait until it says "Engine running", then double-click `run.bat` again.

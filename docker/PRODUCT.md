# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary: the TAs and the course doctor** evaluating the team's DSP lab work during the discussion / grading session. They watch the site on a laptop (sometimes projected) while the team demos it. First impression and clarity of the work matter most: within seconds they should understand what was built, then watch a lab run and pass its official test.
- **Secondary:** the two team members, who drive the site during the demo, and SC classmates who may use it to run labs and explore signals.

## Product Purpose

DSP Studio is a hands-on web workspace for the Digital Signal Processing course (Scientific Computing department, Faculty of Computer and Information Sciences, Ain Shams University). It wraps the team's own Python lab implementations in a browser UI: choose input signals and an operation, run it, see the plotted result, compare it automatically against the official expected-output files supplied by the TAs (PASS / FAIL / not-an-official-test), and download the result file. A Signal Playground lets visitors explore waveforms (sine, superposition, discrete stem, AM) interactively.

Success means the evaluators immediately understand the team's work and can watch any lab run and validate with zero friction.

## Positioning

Not a generic course page: it is the team's own lab code, runnable live in the browser, validated against the TAs' official test files (task1.py → Task1Test.py → expected output).

## Operating Context

- Served locally by `app.py` (Python `http.server` on port 5000, also via Docker compose with the project mounted as a volume). A lab run is a POST to `/api/lab1/run`; the backend runs the Python task and the TA comparison function and returns a matplotlib PNG plot.
- Used live in the evaluation session, usually on an ordinary laptop, possibly projected.
- Labs are added over the semester: each new lab (Lab 2, Lab 3, …) joins the Labs directory (sidebar + workspace). The directory must scale beyond one lab.

## Capabilities and Constraints

- Two views: **Home** (hero, Signal Playground, team, footer) and **Labs** (directory sidebar, empty state, Lab 1 workspace with signal selection, operation, constant presets, run, verdict, chart, download, execution path).
- Bilingual English / Arabic with full RTL; choice persists in localStorage. Arabic must be equal in quality to English.
- Content is fixed for the redesign: same content, no more and no less.
- Redesign scope is frontend only (`front/index.html`, `front/styles.css`, `front/script.js`). Backend, API contract, and lab Python files are out of scope.
- Signal Playground: its structure, controls, and interaction stay exactly as they are; its visuals adopt the site identity.
- Must stay light and smooth on ordinary laptops and faculty PCs.
- Bootstrap 5.3 (CDN) is used for the collapsible mobile navbar; fonts from Google Fonts.

## Brand Commitments

- Name and wordmark: "DSP Studio" (DSP + STUDIO); context chip "FCIS ASU · SC"; "Scientific Computing · 2026".
- Scientific seriousness first: the site must never read as a game or as effects for their own sake.

## Evidence on Hand

- Real lab: Lab 1 (Arithmetic Operations) with inputs `Lab 1/inputs/Signal1.txt`, `Signal2.txt`, `signal3.txt` and four official test files in `Lab 1/outputs/`.
- Team: Omar Ahmed Mohamed Aboulhassan (20241700553) and Abdelrahman Atef Sayed Abdellah (20241700458).
- No testimonials, metrics, or external claims exist; none may be invented.

## Product Principles

1. Show the work running: a lab result and its official verdict are the proof.
2. The labs are one click away from anywhere.
3. Scientific precision over spectacle; motion explains signals, it never decorates for its own sake.
4. Arabic and English are equals.
5. Light enough for any laptop in the room.

## Accessibility & Inclusion

- Full RTL parity, visible keyboard focus, and `prefers-reduced-motion` respected (animations settle, the playground starts paused).

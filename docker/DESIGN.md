---
name: DSP Studio
description: The team's DSP lab workspace as an iOS-native product page, Liquid Glass materials floating over a living 3D signal surface.
colors:
  navy-ground: "#060912"
  navy-elevated: "#0c1120"
  label: "#f5f5f7"
  label-2: "rgba(235, 235, 245, 0.72)"
  label-3: "rgba(235, 235, 245, 0.52)"
  separator: "rgba(255, 255, 255, 0.1)"
  separator-2: "rgba(255, 255, 255, 0.16)"
  system-blue: "#0a84ff"
  system-blue-lift: "#2a95ff"
  system-blue-hover: "#4aa3ff"
  system-blue-soft: "rgba(10, 132, 255, 0.16)"
  cobalt: "#2563eb"
  indigo: "#5e5ce6"
  sky: "#64d2ff"
  purple: "#bf5af2"
  pass-green: "#30d158"
  pass-green-label: "#5be27c"
  fail-red: "#ff453a"
  pending-orange: "#ff9f0a"
  fill: "rgba(118, 118, 128, 0.24)"
  fill-quiet: "rgba(118, 118, 128, 0.14)"
  glass-border: "rgba(255, 255, 255, 0.13)"
  well: "rgba(3, 6, 14, 0.55)"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Readex Pro, Segoe UI, sans-serif"
    fontSize: "clamp(2.8rem, 6.4vw, 5.6rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Readex Pro, Segoe UI, sans-serif"
    fontSize: "clamp(2.4rem, 4.8vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.035em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Readex Pro, Segoe UI, sans-serif"
    fontSize: "19px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Readex Pro, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.006em"
    fontFeature: "\"cv11\", \"ss01\", tabular-nums"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Readex Pro, Segoe UI, sans-serif"
    fontSize: "12.5px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
  body-arabic:
    fontFamily: "-apple-system, SF Arabic, Readex Pro, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
  value-mono:
    fontFamily: "SF Mono, JetBrains Mono, ui-monospace, Cascadia Mono, Menlo, monospace"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
  math:
    fontFamily: "STIX Two Text, Cambria Math, Times New Roman, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "22px"
  xl: "28px"
  pill: "999px"
spacing:
  hairline: "2px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "22px"
  xl: "28px"
  block: "48px"
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(88px, 10vw, 136px)"
components:
  button-primary:
    backgroundColor: "{colors.system-blue}"
    textColor: "{colors.label}"
    rounded: "{rounded.pill}"
    padding: "0 22px 0 26px"
    height: "52px"
  button-glass:
    textColor: "{colors.label}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "52px"
  button-tinted:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.system-blue-hover}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "42px"
  button-plain:
    textColor: "{colors.system-blue-hover}"
    rounded: "{rounded.pill}"
    padding: "0 16px 0 10px"
    height: "40px"
  segmented-control:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.label-2}"
    rounded: "{rounded.sm}"
    padding: "3px"
  segmented-control-active:
    backgroundColor: "rgba(118, 118, 128, 0.55)"
    textColor: "{colors.label}"
    rounded: "9px"
  nav-capsule:
    textColor: "{colors.label-2}"
    rounded: "{rounded.pill}"
    padding: "5px"
  nav-link:
    textColor: "{colors.label-2}"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "38px"
  card-glass:
    textColor: "{colors.label}"
    rounded: "{rounded.xl}"
    padding: "22px"
  grouped-list:
    backgroundColor: "rgba(118, 118, 128, 0.12)"
    rounded: "{rounded.md}"
  grouped-list-row:
    textColor: "{colors.label}"
    padding: "10px 16px"
    height: "62px"
  input-number:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.label}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "46px"
  tag-tinted:
    backgroundColor: "{colors.system-blue-soft}"
    textColor: "{colors.system-blue-hover}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
  status-capsule:
    backgroundColor: "rgba(48, 209, 88, 0.14)"
    textColor: "{colors.pass-green-label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  readout-thin:
    backgroundColor: "rgba(20, 24, 40, 0.42)"
    textColor: "{colors.label}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
---

# Design System: DSP Studio

## Overview

**Creative North Star: "Glass Over a Living Signal"**

DSP Studio reads as an iOS-native product page that happens to run real lab code. A deep navy ground, lit by slow drifting pools of blue, indigo, sky and violet light, is the field every surface refracts. Over it float Liquid Glass materials whose thickness is chosen by context: thin frosting for readouts that sit on live drawings, regular glass for the cards the visitor works inside, thick glass for chrome that floats over moving content. The landing page's memorable object is a Three.js signal surface in iOS blues that breathes under the hero and ripples toward the pointer; the time-domain card above it draws an indigo-to-sky area trace on a 2D canvas.

The system is calm, premium and precise. Colour is almost entirely the blue family; green, red and orange appear only to report state (PASS, FAIL, pending, live). Controls are the iOS vocabulary verbatim: capsule buttons, segmented controls, filled sliders, inset grouped lists with inset separators, notification-style toasts. Motion is a spring for touch feedback and a long decelerating ease for materials and views; nothing animates for its own sake, and `prefers-reduced-motion` settles everything.

The world explicitly refuses the dark lab-instrument look and any yellow (user-pinned). English and Arabic are equal: every surface mirrors under RTL, Arabic sets in Readex Pro with zero tracking and looser display leading.

**Key Characteristics:**
- Navy ground with drifting ambient light; glass floats over it in three context grades.
- One accent family: system blue, with indigo, sky and cobalt as its relatives.
- State colours (green, red, orange) carry meaning only, never decoration.
- iOS controls verbatim: capsules, segmented controls, filled sliders, inset grouped lists.
- Tabular, monospaced values and italic STIX math beside a geometric sans.
- Spring feedback on press, long ease on materials, cross-blur between views.

## Colors

A single cool blue family over navy, with iOS dark-appearance labels and system state colours held back for meaning.

### Primary
- **System Blue** (`system-blue`): the one action colour. Fills the primary capsule (as a gradient from System Blue Lift at the top), the active lab row, selected checkmarks and signal indices, the active operation's icon tile, slider fill, the paused playground button, focus rings (at 70% alpha) and text selection (at 45%).
- **System Blue Lift** (`system-blue-lift`): the lit top stop of every filled-blue gradient; never used flat.
- **Link Blue** (`system-blue-hover`): blue text on dark: plain and tinted buttons (Back, Download, presets), the Labs nav button, tags and count pills.
- **Blue Wash** (`system-blue-soft`): the tinted background of tags, count pills, the operation hint and the active operation card.

### Secondary
- **Cobalt** (`cobalt`): the deep middle of the brand gradient (sky to cobalt to indigo) on the brand mark, the Labs symbol and the empty-state tile, and the dominant ambient light pool.
- **Indigo** (`indigo`): the second ambient pool, the second channel's avatar gradient, the start of the hero trace gradient, and the first playground wave.
- **Sky** (`sky`): the light end of the brand gradient and the hero trace, the second playground wave, the mode readout text.

### Tertiary
- **Violet** (`purple`): a quiet fourth ambient pool and the alternate channel's avatar gradient (with indigo). Never a button, link or state.

### State
- **Pass Green** (`pass-green`) with **Pass Green Label** (`pass-green-label`) for text on its 14% tint: PASS verdicts, live and ready capsules, live status dots, success toasts.
- **Fail Red** (`fail-red`): FAIL verdicts and error toasts only.
- **Pending Orange** (`pending-orange`): the single pending dot on the Labs empty state.
- A verdict that is not an official test uses System Blue as its state colour.

### Neutral
- **Navy Ground** (`navy-ground`): the page and scrollbar track; the ambient field fades into it from #08101f.
- **Navy Raised** (`navy-elevated`): the elevated navy tone.
- **Label / Secondary Label / Tertiary Label** (`label`, `label-2`, `label-3`): iOS dark label colours for primary text, supporting copy, and metadata, axis labels and section labels.
- **Separator** (`separator`, `separator-2`): hairlines between list rows, panel dividers, the hero facts rule, the footer rule.
- **System Fill** (`fill`, `fill-quiet`): iOS grey fills (118, 118, 128) at 0.12 to 0.36 alpha for segmented tracks, inputs, icon tiles, tinted buttons, formula and chart wells; hover steps the alpha up (0.24 to 0.36).
- **Glass Border** (`glass-border`): the 1px edge of regular and thick glass.
- **Plot Well** (`well`): the recessed dark screen behind live canvases and the result chart (0.55 to 0.6 alpha).

### Named Rules
**The One Family Rule.** Accent colour is System Blue and its relatives (Lift, Link, Wash, Cobalt, Indigo, Sky). There is no second accent hue; Violet only tints light and avatars.

**The State Is Meaning Rule.** Green, red and orange appear only where they report a state (pass, fail, live, ready, pending). No decorative use.

**The No Yellow Rule.** Yellow and amber are banned outright (user-pinned), in CSS, canvas and shader colour alike.

## Typography

**Display Font:** SF Pro on Apple devices, Inter (loaded from Google Fonts) everywhere else
**Body Font:** the same stack; Readex Pro for Arabic
**Label/Mono Font:** SF Mono / JetBrains Mono for values; STIX Two Text italic for mathematics

**Character:** A tight, heavy geometric sans gives Apple-style product headlines; monospaced tabular numerals and true italic math make every value read as measured, not decorated.

### Hierarchy
- **Display** (700, clamp(2.8rem, 6.4vw, 5.6rem), 1.02, -0.04em): the hero headline and the lab workspace heading (clamp(2.5rem, 5.4vw, 4.4rem)). The second line drops to Tertiary Label at 600.
- **Headline** (700, clamp(2.4rem, 4.8vw, 4rem), 1.04, -0.035em): section titles; the empty Labs headline uses clamp(2rem, 4vw, 3.2rem). A trailing span dims to Tertiary Label at 600.
- **Title** (650, 19px, 1.2): control-panel steps; chart and verdict titles at 17px; list-row names at 15.5px / 600; result title clamp(1.5rem, 2.6vw, 2.1rem) / 700.
- **Body** (400, 16px, 1.55): running copy in Secondary Label; leads at clamp(1.03rem, 1.3vw, 1.17rem) / 1.6 capped at 46ch; section copy 1.08rem / 1.65 at 46ch; long lab copy at 62ch.
- **Label** (600, 11 to 12.5px, 0.04 to 0.06em): metadata, axis labels, capsule text, breadcrumb, footer row, in Tertiary Label.
- **Value Mono** (600, 13 to 15px): readouts, outputs, IDs, indices and inputs, always tabular.
- **Math** (italic 400, 15 to 18px): formulas, operation definitions, the hero formula column.

### Named Rules
**The Measured Value Rule.** Any number a signal produced (amplitude, frequency, sample counts, IDs, inputs) sets in the mono face; any formula sets in STIX italic. Never set either in the sans.

**The Equal Script Rule.** Under RTL, Arabic switches to Readex Pro, all letter-spacing goes to 0, and display leading opens to 1.25 to 1.3.

## Layout

The Bootstrap 5.3 grid carries responsive layout; the container caps at 1320px with a fluid gutter (clamp(16px, 4vw, 40px)) applied as both side padding and column gap. Breakpoints are Bootstrap's: 768px, 992px and 1200px. Sections breathe on a fluid rhythm (clamp(88px, 10vw, 136px) top, clamp(80px, 9vw, 120px) bottom); intros sit 48px above their content. Inside components the steps are 8, 12, 16, 22 and 28px.

The hero is a full-viewport grid (minimum 720px): headline and actions on top, the 3D surface and the floating time-domain card filling a flexible middle band, a facts row on a separator at the bottom. The fixed top bar is 76px (66px below 992px). The Labs view is a sticky glass sidebar beside a workspace capped at 1300px, with a sticky control panel beside a tall output panel.

Below 1200px the course chip hides and playground controls drop to two columns. Below 992px the capsule nav becomes a dropdown glass sheet behind a round menu button, the Labs sidebar becomes a horizontal scroller, and sticky panels release. Below 768px actions stretch to full width, controls stack to one column, segmented controls become a 2-column grid, and canvases shorten (playground 290px, chart 260px). Content-carrying canvases and labels stay LTR inside RTL pages.

## Elevation & Depth

Depth is material, not paper: surfaces are frosted glass separated from the ground by blur, a lit top edge and one long soft drop shadow. Thickness is chosen by role, not by importance. Inner wells (plot screens, inputs, formula and chart wells) recess with inset shadows and darker fills. Without backdrop-filter support, glass falls back to a solid tinted surface (rgba(22, 27, 42, 0.95)).

### Shadow Vocabulary
- **Glass edge** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.04), inset 0 0 0 0.5px rgba(255,255,255,0.06)`): the lit rim on every regular and thick glass surface.
- **Glass drop** (`box-shadow: 0 24px 60px -28px rgba(0,0,0,0.75), 0 2px 8px -2px rgba(0,0,0,0.3)`): the single lift under regular and thick glass.
- **Blue glow** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 0 10px 26px -10px rgba(10,132,255,0.85)`): filled blue capsules; deepens to `0 16px 32px -12px` on hover.
- **Thin rim** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.12)`): thin readouts and chips.
- **Well** (`box-shadow: inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 12px 30px -18px rgba(0,0,0,0.8)`): recessed plot screens.
- **Knob** (`box-shadow: 0 3px 8px rgba(0,0,0,0.35)`): white slider thumbs and the playground crosshair.

### Named Rules
**The Glass By Context Rule.** Thin glass (blur 12px, saturate 160%) for readouts and chips over live drawings; regular glass (blur 26px, saturate 180%) for cards and panels the visitor works inside; thick glass (blur 44px, saturate 200%) for chrome that floats over moving content (nav capsule, language toggle, menu button, Labs sidebar, toasts).

**The Frost On Scroll Rule.** The top bar is clear over the hero and frosts (rgba(8, 12, 26, 0.86), blur 28px, separator underline) once content scrolls under it, in Labs, and when the mobile menu is open.

## Shapes

Continuous, soft iOS corners on a fixed ladder: 8px for the smallest marks, 12px for readouts, inputs and segmented tracks, 16px for list groups, wells and operation cards, 22px for chart cards, verdicts, toasts and the floating formula column, 28px for every major glass card and panel. Every button, tag, nav link and capsule is a full pill (999px); avatars, status dots, steps and checkmarks are circles. Icon tiles use 9 to 12px. Borders are hairlines only (1px separators and glass borders, 1.5px for the active operation and checkmark rings). Icons are inline stroked SVG with round caps and joins.

## Components

### Buttons
Capsules that answer touch with a spring.
- **Shape:** full pill (999px), 52px tall in the hero, 54px for Run, 40 to 46px for tinted and plain buttons.
- **Primary (filled):** System Blue Lift to System Blue vertical gradient, white 16px / 600 text, a 22% white top sheen, blue glow; trailing arrow icon nudges 3px on hover (mirrored in RTL). One per view: Explore labs on Home, Run in the lab.
- **Hover / Focus / Press:** brightness 1.08 and 1px lift; press scales to 0.97; focus is a 3px System Blue ring at 70% with 2px offset. Run while busy sweeps a light band across its fill.
- **Glass (secondary):** regular glass capsule, Label text 500, brightens 1.3 on hover.
- **Tinted:** System Fill capsule with Link Blue text (Download, constant presets, Pause); fill alpha rises on hover; the paused state fills System Blue.
- **Plain:** transparent with Link Blue text (Back), Blue Wash on hover.

### Chips
- **Tag:** Blue Wash capsule with Link Blue text, 11 to 12.5px / 600 to 700 (student ID, count, tip marker).
- **Status capsule:** green 14% tint with Pass Green Label text and a fading green dot (live, ready, online).
- **Fact capsule:** thin glass pill with a bold Label value and Secondary Label caption.
- **Code chip:** System Fill pill with mono 12.5px.

### Cards / Containers
- **Corner Style:** 28px for glass cards and panels.
- **Background:** regular glass (white 10% to 4% vertical gradient) over the ambient field.
- **Shadow Strategy:** glass edge plus glass drop (see Elevation & Depth).
- **Border:** 1px Glass Border.
- **Internal Padding:** 22 to 24px (16px on phones).

### Inputs / Fields
- **Number input:** System Fill well, 12px corners, 46px tall, italic math prefix, mono 15px / 600 value.
- **Focus:** an inset 1.5px System Blue ring.
- **Slider:** 5px track filled System Blue up to a 26px white knob; the knob springs to 1.12 while dragged and gains a 4px blue focus halo.
- **Segmented control:** System Fill track (12px, 3px padding); the selected segment is a lighter grey pill (9px) with white 600 text and a small drop.
- **Selection rows:** circular 24px check that fills System Blue and springs to 1.06 when selected.

### Navigation
- **Style:** a centred thick-glass pill holding 15px / 500 links in Secondary Label; a sliding glass indicator (spring, 0.55s) sits under the active link and turns filled blue in Labs mode. The Labs button reads Link Blue with a pulsing dot.
- **States:** hover and active go to Label; press scales to 0.96.
- **Mobile:** below 992px a 44px round thick-glass menu button opens the links as a 28px-corner glass sheet; active rows take a white 10% fill or System Blue for Labs.

### Inset Grouped List
The iOS grouped list carries the team, the input signals and the Labs directory: rows sit in one rounded group (regular glass or System Fill at 12%), separated by 1px hairlines inset past the leading tile, with a 4 to 5% white hover wash. The active Labs row fills System Blue with white text and a blue glow.

### Verdict
The result tints its own glass: a 22px-corner thin-glass banner washed in the state colour at 13% with a 30% inset ring, a 32px filled state disc carrying a check (pass) or an exclamation (fail, not official), and a state-tinted capsule for the test name. It pops in with the spring.

### Signal Surface
A Three.js ShaderMaterial plane (280 by 110 segments) shaded from deep navy through indigo and System Blue to Sky with a soft fresnel rim, breathing over time and rippling toward the pointer. It sits behind a gradient shade so hero text stays legible. Light by design: it pauses under reduced motion and is the only 3D object in the system.

### Toast
A thick-glass notification banner (22px) dropping from under the top bar with a spring; a 12px green dot for success, red for errors.

## Do's and Don'ts

### Do:
- **Do** pick the glass grade by context: thin (12px blur) on live drawings, regular (26px) for working cards, thick (44px) for floating chrome.
- **Do** keep a single filled System Blue capsule per view; everything else is glass, tinted or plain.
- **Do** use iOS controls as-is: segmented controls, filled sliders with white knobs, inset grouped lists with inset hairlines, circular checks.
- **Do** set every signal value in the mono face with tabular numerals and every formula in STIX italic.
- **Do** answer touch with the spring (`cubic-bezier(0.34, 1.36, 0.64, 1)`, press scale 0.96 to 0.98) and move materials and views on the long ease (`cubic-bezier(0.32, 0.72, 0, 1)`).
- **Do** mirror every surface under RTL, switch Arabic to Readex Pro and zero all tracking.
- **Do** keep the 28px corner on major cards and the full pill on every button and tag.

### Don't:
- **Don't** use yellow or amber anywhere, including canvas and shader colours.
- **Don't** introduce an accent outside the blue family; green, red and orange are state only.
- **Don't** return to the dark lab-instrument look: no phosphor-green traces, instrument bezels or hard-edged opaque panels.
- **Don't** put a solid opaque panel where glass belongs; solid fills are only the no-backdrop-filter fallback.
- **Don't** set numbers or formulas in the body sans.
- **Don't** add a second 3D object or decorative motion; motion explains a signal or answers a touch.

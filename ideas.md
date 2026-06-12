# Lens Optics Explorer — Design Brainstorm

## Three Stylistic Approaches

### 1. Scientific Blueprint
**Theme Name:** Blueprint Lab  
**Brief:** Deep navy and cyan technical drafting aesthetic — like a physicist's notebook meets a precision instrument manual. Grid lines, monospace data readouts, and crisp geometric diagrams.  
**Probability:** 0.07

### 2. Dark Observatory
**Theme Name:** Observatory Dark  
**Brief:** Rich deep-space dark background with luminous amber/gold accent rays — evoking the drama of light bending through glass in a darkened optics lab. Cinematic and immersive.  
**Probability:** 0.03

### 3. Clean Scientific Journal
**Theme Name:** Precision Manuscript  
**Brief:** Off-white parchment tones with deep slate text and vivid teal/coral accent — the aesthetic of a high-quality physics textbook brought to life. Structured, legible, and authoritative.  
**Probability:** 0.06

---

## Chosen Approach: **Blueprint Lab** (Scientific Blueprint)

### Design Movement
Technical Drafting meets Interactive Science — inspired by engineering blueprints, optical bench schematics, and the visual language of precision scientific instruments.

### Core Principles
1. **Precision over decoration** — every visual element serves a communicative purpose; no gratuitous ornamentation
2. **Data as aesthetic** — numbers, equations, and measurements are displayed as beautiful typographic elements
3. **Light as metaphor** — the entire color system is built around the concept of light rays, refraction, and luminance
4. **Structural clarity** — asymmetric layouts with clear visual hierarchy guide the eye through complex optical concepts

### Color Philosophy
- **Background:** Deep navy `oklch(0.15 0.04 250)` — the darkness of an optics lab, a blackboard, a night sky
- **Primary accent:** Electric cyan `oklch(0.78 0.18 200)` — the color of laser light, refracted rays
- **Secondary accent:** Warm amber `oklch(0.75 0.14 75)` — the warmth of incandescent light, focal points
- **Surface:** Slightly lighter navy `oklch(0.20 0.035 250)` — card backgrounds
- **Text:** Near-white `oklch(0.92 0.01 250)` — crisp and readable against dark
- **Muted text:** Slate-blue `oklch(0.65 0.04 250)` — secondary information

### Layout Paradigm
Asymmetric split-panel layout: left-anchored navigation with a wide content area. The interactive simulation canvas dominates the right two-thirds of the screen. Sections use diagonal clip-path dividers to suggest the geometry of light refraction. Hero uses a full-bleed dark canvas with animated ray lines.

### Signature Elements
1. **Ray lines** — thin, glowing cyan lines that animate across the page suggesting light paths
2. **Grid overlay** — subtle dot-grid pattern on dark backgrounds, like graph paper
3. **Lens cross-sections** — SVG lens profile shapes used as decorative dividers and section markers

### Interaction Philosophy
Interactions should feel like adjusting a precision instrument — sliders have tactile snap, canvas updates in real-time with smooth 60fps animation, hover states reveal measurement annotations.

### Animation
- Ray diagram animations: 400ms ease-out, rays "travel" from left to right
- Slider updates: immediate canvas redraw, no delay
- Section entrances: fade-up 300ms staggered at 60ms intervals
- Hover on lens cards: subtle glow pulse, 200ms ease-out
- Number counters: smooth interpolation on value change

### Typography System
- **Display/Hero:** `Space Grotesk` — geometric, technical, slightly unusual — for headings
- **Body:** `Inter` — clean, readable for explanatory text (exception to the no-Inter rule: used only for body copy, not headings)
- **Monospace/Data:** `JetBrains Mono` — for equations, measurements, focal length values
- **Scale:** 4xl hero → 2xl section → xl card → base body → sm caption

### Brand Essence
**Lens Optics Explorer** — an interactive physics lab for curious minds who want to see light bend.  
Personality: **Precise. Luminous. Curious.**

### Brand Voice
Headlines are direct, declarative, and slightly poetic about physics:
- "Light bends. We show you how."
- "Every focal point tells a story."
Never: "Welcome to our website" or "Learn more about lenses today."

### Wordmark & Logo
A stylized lens cross-section icon — two arcs forming a biconvex shape — with a single ray line passing through it. No text in the mark itself. Used as favicon and header icon.

### Signature Brand Color
Electric cyan `oklch(0.78 0.18 200)` — unmistakably this brand's color, used for all ray lines, active states, and key data readouts.

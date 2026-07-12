# Project instructions — Quantum-Hub Website

Before creating or editing any HTML/CSS/design work in this project, read `Quantum-hub Design System.md` (including its **Dark v2 amendment** at the top) and follow it strictly. Key rules (dark v2):

- **Dark throughout — no white surfaces.** Page base `#0e1112`; fixed background of drifting magenta glows over a dark vertical blend (implemented as `.bg` in styles.css + js/motion.js). Components are flat/translucent; no gradients on components.
- Tokens in `tokens/*.css` are the source of truth: magenta `--q-magenta #D82B72` (accents/CTAs, sparingly), soft magenta `#f06ba0` for text accents/links, headings white, body `#c2cbcb`, sector accents only as tag/data dot hues.
- Fonts: **Syne** (display, 800) + **Newsreader** (serif body; italic emphasis renders white) + **Inter** (UI chrome). Sentence case everywhere; lowercase wide-tracked eyebrow labels.
- Shape: rounded radii 8/12/18/28px, pill buttons/tags. Cards: `rgba(255,255,255,.04)` fill, 1px `rgba(255,255,255,.09)` border, 18px radius; hover = magenta border/glow.
- Logo: actual image `assets/quantum-logo.jpg` top-left in a rounded white tile (`.logo-tile`) until a transparent mark arrives. The magenta dot motif — max one per composition. No emoji; Lucide icons via CDN.
- Motion: scroll-storytelling per DESIGN-SPEC.md §5 (reveals, pins, parallax, count-ups), micro-interactions 140–220ms ease-out, hard `prefers-reduced-motion` fallback. Focus = 3px soft magenta ring.
- Voice: pragmatic matchmaker between corporates and startups; POC/pilot/value-chain vocabulary.
- Facts: no unverified numbers — see `PHASE-0-AUDIT.md` fact register. "Partners Login" must not exist anywhere.

Repo: https://github.com/AmirNatan1/Quantum-Hub-Website.git (user pushes from their own machine).

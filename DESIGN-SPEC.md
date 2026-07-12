# Quantum-Hub.com — Frontend design specification

> ⚠ **DARK V2 (2026-07-12):** §2 (color) and §3 (typography) are superseded by the Dark v2 amendment in `Quantum-hub Design System.md`. In short: all-dark surfaces (S1 = dark base, S2 = translucent light wash, S3 = magenta wash — no white anywhere), a fixed blend background of magenta glows drifting with scroll, and Syne/Newsreader/Inter replacing Quicksand/Manrope. The surface *rhythm* logic, accent budget, pattern catalog (§4), motion architecture (§5), and page specs (§6) all still stand.

How the site looks, moves, and presents information. Decisions locked with Amir (2026-07-12): **scroll-storytelling motion** + **compact heroes**. Anchored to `Quantum-hub Design System.md` tokens; builds on `STRATEGY.md` sitemap and `PHASE-0-AUDIT.md` content.

---

## 1. Design principles

1. **Proof over polish.** Every screen leads with a verifiable claim (number, named partner, case outcome). Decoration never appears where evidence could.
2. **Dense, not busy.** Compact heroes, sections that touch, one idea per section — but every scroll-stop delivers content. Whitespace lives *inside* sections (padding), never *between* ideas (empty bands).
3. **Choreography, not decoration.** Scroll effects exist to sequence information — reveal in reading order, pin what needs dwell-time, count what should impress. Nothing moves that doesn't communicate.
4. **One magenta moment per view.** The accent budget is the brand. Each viewport-height of page gets at most one magenta element (CTA, active state, count-up numeral, or dot — not several).
5. **Two audiences, one system.** Partners and startups see the same design language with different content emphasis — never a different-looking site.

---

## 2. Color application system

### 2.1 Surface rhythm (the anti-white-space engine)

Pages are built as an alternating stack of four surface types. Two same-surface sections never touch.

| Surface | Token | Used for | Rough share of page |
|---|---|---|---|
| S1 White | `--q-neutral-0` | Heroes, feature splits, case grids | ~45% |
| S2 Mist | `--q-neutral-50` | Alternating rhythm sections, form areas | ~30% |
| S3 Ink (inverse) | `--q-ink`, white text | Stat bands, big-claim interludes, pre-footer CTA, footer | ~20% |
| S4 Magenta tint | `--q-magenta-tint` | Rare: one highlight strip per page max (e.g. SPARK deadline banner) | ~5% |

Rules: every page gets **1–2 S3 bands** (stats and/or pre-footer CTA). S3 never touches S4. Footer is always S3, so the page ends dark and grounded.

### 2.2 Accent deployment

- **Magenta** (`--q-magenta`): primary buttons, links, active nav item, eyebrow labels, count-up numerals on S3, the dot motif, focus rings. Never body text, never backgrounds (except S4 tint), never borders of neutral components.
- **Sector accents** (automotive blue / logistics teal / industry violet / energy amber): only as 8–10px dots in Tags, data-viz hues, and the Industries grid hover state. Never fills, never headings.
- **Status colors**: badges and form validation only.
- On S3 (ink) sections: text is white/`--q-neutral-300`; magenta appears on numerals and one CTA; sector dots still work on dark.

### 2.3 Depth

No gradients (system rule). Depth = shadow scale (`--shadow-sm→lg`) + surface alternation + scroll-parallax on imagery (see §5). Cards hover-raise from `--shadow-sm` to `--shadow-md`.

---

## 3. Typography system

| Role | Font/size/weight | Usage rules |
|---|---|---|
| Display XL | Quicksand 58px/700, leading 1.12 | Page heroes only, one per page. Sentence case. May contain the magenta dot terminal ("Where industry meets innovation<dot>") |
| Display L | Quicksand 44px/700 | S3 big-claim interludes, section openers on Home |
| Heading | Quicksand 34px/600 | Standard section headings |
| Card title | Quicksand 20px/600 | Cards, case tiles |
| Eyebrow | Manrope 13px/600, lowercase, tracking .14em, magenta | Every section starts with one ("what we're up to", "proof, not promises"). This is the section's landmark; screen-reader order: eyebrow → heading → body |
| Body | Manrope 15–17px/400, leading 1.55, `--text-body` | Max measure 68ch |
| Stat numeral | Quicksand 58–72px/700, tabular where possible | S3 bands, magenta on dark |
| Micro | Manrope 12–13px | Meta, dates, captions, `--text-muted` |

Rules: sentence case everywhere including nav and buttons (kills the live site's "CONTACt us"/"TECHNOLOGy" class of errors structurally). No italic for emphasis — weight or color. Numbers in headlines get Quicksand bold even inline.

---

## 4. Information presentation system

The core request: **presentation varies by information density × importance.** Every piece of content is classified on two axes and that classification picks its pattern:

- **Importance**: A = must be absorbed by every visitor (value prop, proof) · B = supports a decision (how it works, programs) · C = reference (FAQs, legal, long descriptions)
- **Density**: low (one claim) · medium (3–6 parallel items) · high (structured detail, long-form)

### 4.1 Pattern catalog

| # | Pattern | Importance×Density | Anatomy | Motion (see §5) |
|---|---|---|---|---|
| P1 | **Hero claim** | A × low | Compact hero (~65vh): eyebrow, Display XL, one-sentence sub, 1 primary + 1 outline CTA, media right or full-bleed behind scrim | Load-in stagger; background media parallax-drifts on scroll |
| P2 | **Stat band** | A × low | S3 full-bleed; 3–5 numerals + labels; source footnote (fact register ID) | Pins briefly; numerals count up once; unpins on completion |
| P3 | **Big-claim interlude** | A × low | S3 or S1; single Display L sentence, generous padding; the "breathing" moment between dense sections | Scroll-linked word-by-word opacity (Lux-style) |
| P4 | **Feature split** | A/B × medium | 50/50 text+media, alternating sides down the page; eyebrow+heading+body+link per split | Media parallax ±20px; text block rises in |
| P5 | **Card grid** | B × medium | 2–4 col grid of system Cards; icon (Lucide), title, 2–3 lines, optional link | Staggered rise-in, 60ms delay per card |
| P6 | **Sector grid** | A × medium | The four industries as large interactive tiles: sector dot, name, one-liner; hover = raise + sector-accent dot grows | Tiles rise in; hover per system motion |
| P7 | **Process rail** | B × medium | Numbered horizontal steps (SPARK program, POC method); connector line draws between steps | Pinned section: steps activate sequentially as user scrolls through pin distance |
| P8 | **Case story** | A × high | Full-width tile → detail page: challenge/approach/outcome blocks, pull-stat, sector tag, next-case footer link | Tile image parallax; detail page: outcome stat counts up in view |
| P9 | **Logo + proof row** | A × medium | Partner logos (grayscale, hover color) with expandable one-line facts | Simple fade-in; no motion on logos themselves (credibility content stays still) |
| P10 | **Accordion** | C × high | FAQs, long partner descriptions; one open at a time, chevron rotates | Height ease 220ms; no scroll effects |
| P11 | **News strip** | B × medium | "What we're up to": horizontal row of 3–4 date-stamped cards, LinkedIn-feedable | Row slides in from right ~40px; horizontal swipe on mobile |
| P12 | **Testimonial slab** | B × low | One quote at a time, name+role, S2 surface; no carousel autoplay — prev/next buttons | Crossfade 220ms on user action only |
| P13 | **Conversion band** | A × low | S3 pre-footer: one line ("Ready to test before you invest?") + one magenta CTA (book a meeting / register) | Rises in; CTA gets the page's last magenta moment |
| P14 | **Simple form** | A × low | Contact/register: minimal fields, 44px inputs, magenta focus ring, inline validation | None beyond field micro-interactions |

**Assignment rule of thumb:** important + low-density → big type and dark surfaces (P1–P3, P13); important + high-density → narrative structure (P8); supporting + medium → grids and splits (P4–P6, P11); reference → collapse it (P10). If content can't find a pattern, the content is wrong — rewrite it, don't invent a pattern.

### 4.2 Density controls

- Section vertical padding: 96px desktop / 64px mobile (`--space-9/8`) — but consecutive S1→S2 transitions may compress to 64px to keep the page "full".
- Compact heroes: next section's top edge visibly peeks above the fold (~10–15vh of it) — a standing invitation to scroll.
- Max content width 1200px; full-bleed only for S3 bands, hero media, and case tile imagery.

---

## 5. Scroll & motion architecture

Chosen direction: **scroll storytelling** — but disciplined. Scroll effects are position-driven (scrubbed), micro-interactions keep system timings (140–220ms ease-out). No bounces, no autoplay carousels, no scroll-jacking (native wheel speed always respected; pins never trap more than ~150vh of scroll distance).

### 5.1 Motion tiers

| Tier | What | Implementation |
|---|---|---|
| T1 Micro | Hover raise/darken, press scale(0.98), focus ring, accordion | CSS transitions, system tokens |
| T2 Reveal | Sections/cards rise 24px + fade in once when 20% in view | IntersectionObserver + CSS; `once: true` |
| T3 Scroll-linked | Image parallax (±20–40px), big-claim word reveals, connector-line draws, hero media drift | Scrub-linked transforms (GSAP ScrollTrigger scrub or CSS scroll-driven animations where supported) |
| T4 Pinned | Stat band (pins ~100vh while counting), process rail (pins ~150vh, steps 1→5 activate) | ScrollTrigger pin; max 2 pinned moments per page; never on mobile <768px (unpinned fallback: simple reveals) |

### 5.2 Global scroll feel

- Smooth scroll via a lightweight lerp library (Lenis-class), factor tuned subtle (~0.1) — "expensive" feel without floatiness. Anchor links animate with 600ms ease.
- Scroll progress: thin 2px magenta progress bar under the header on long pages (SPARK, case details) — doubles as the page's persistent-but-quiet magenta element.
- `prefers-reduced-motion: reduce` → smooth scroll off, T3/T4 become static (final states), T2 becomes plain fade, count-ups render final numbers instantly. This is a hard accessibility gate.

### 5.3 Header behavior

72px (`--header-height`), sticky, white at 85% + blur (the system's only transparency). On scroll down >200px it hides (translateY −100%); on any scroll-up it returns; when returning mid-page it slims to 60px. Active page link: magenta + dot indicator.

**Three-tier hierarchy** — items look different because they do different things:

| Tier | Items | Treatment |
|---|---|---|
| T-nav (page links) | For partners · For startups · SPARK · **Explore ▾** | Plain text links, Manrope 14px, `--text-body`; hover → ink; active → magenta + dot |
| T-utility (site controls) | Language selector | Ghost icon-button: globe glyph + "EN", 13px, `--text-muted`, circular hover fill — visibly *smaller and quieter* than nav links; opens dropdown |
| T-action (conversion) | Contact us | The only pill in the header: magenta primary. On SPARK pages the label context-swaps to "Apply to SPARK" |

**Explore ▾ dropdown** (the decrowding move): groups secondary pages — Industries, Case studies, About, What we're up to — into one dropdown panel (2-col: links left, one featured case tile right). Opens on click, 180ms ease-out, closes on outside-click/Esc. Keeps the visible nav at 4 items; the three business-critical destinations (partners, startups, SPARK) are never buried.

"Book a meeting" is not a second header button — it lives in the P13 conversion bands and on the Contact page (calendar embed), keeping the header to exactly one CTA.

Mobile: hamburger → full-screen S3 overlay, nav items stagger in 40ms apart; tiers preserved (nav large, utility small, one pill at bottom).

### 5.4 Signature moments (one per page, max)

- **Home**: the "Who are you?" hero — two large split panels (Partners / Startups) that tilt/raise on hover; choosing one sets a session preference that reorders Home emphasis and header CTA.
- **POC Playground / Case studies**: the muted auto-looping playground video as a **pinned takeover** — starts as an inset frame, expands to fill the entire viewport over the first ~45% of a 280vh pin, holds full-screen with a caption overlay while looping, then releases (per Amir, 2026-07-12). Plays only in viewport; mobile and reduced-motion get a static full-width block.
- **SPARK**: the pinned 5-step process rail.
- **Industries**: sector grid where the hovered tile's dot expands into a soft tinted halo behind the tile content.

---

## 6. Page-by-page specification

Format: section → surface → pattern → motion. (Content per `PHASE-0-AUDIT.md` triage; copy rewritten in matchmaker voice.)

### 6.1 Home — narrative: *who we are → proof → how → who it's for → what's new → act*

| # | Section | Surface | Pattern | Motion notes |
|---|---|---|---|---|
| 1 | Hero: "Where industry meets innovation·" + Who-are-you split (Partners/Startups panels) | S1 | P1 variant | Panels rise on load; hover tilt; click routes + remembers |
| 2 | Stat band (verified numbers, F-08) | S3 | P2 | Pin + count-up (signature-adjacent, brief) |
| 3 | Who we are (2 sentences + partner logo row) | S1 | P9 | Fade only — proof stays still |
| 4 | Industries grid (4 tiles) → /industries/ | S2 | P6 | Stagger rise; sector-dot hover |
| 5 | How we work (consolidated: 4 splits — scout, match, POC, scale) | S1 | P4 | Alternating splits, media parallax |
| 6 | Big claim: "We prove the fit before you invest." | S3 | P3 | Word-by-word scrub reveal |
| 7 | SPARK teaser (one paragraph + "Read more about SPARK" → /spark/) | S1 | P4 single | Standard reveal |
| 8 | Featured case study (video tile) → /case-studies/ | S2 | P8 tile | Video loops in view |
| 9 | What we're up to (news/LinkedIn strip) | S1 | P11 | Slide-in row |
| 10 | Conversion band: book a meeting | S3 | P13 | Last magenta moment |

### 6.2 For partners — narrative: *your pain → our method → programs → proof → act*

Hero (P1, "Innovation without the risk theater") → value splits (P4 ×3: market-needs scouting, in-house POC execution, de-risked adoption) → programs (P5 grid: SPARK for partners / Agile track / CHAMP / Enrichment Academy — each card links to its section or page) → CHAMP testimonials (P12, Globus/Tashtit quotes pending F-07) → partner logos + facts (P9, corrected F-02/F-03 data) → stat band (P2) → conversion band (P13: book a meeting).

### 6.3 For startups — narrative: *what you get → tracks → proof → apply*

Hero (P1, "Your shortcut to industrial customers") → advantages (P5 grid ×4: visibility, success criteria, expert support, ecosystem) → tracks comparison (P4 double: SPARK vs Agile — two cards side-by-side with "which fits you" microcopy) → alumni case tiles (P8 tiles ×2) → SPARK teaser + big CTA (P13: "Apply to SPARK" → /spark/).

### 6.4 SPARK (canonical program page) — narrative: *what it is → why apply → how it works → eligibility → apply*

Hero (P1, with S4 tint strip if a batch deadline is live) → what/why splits (P4 ×2, equity-free claim F-12 prominent) → **pinned process rail** (P7: application → interviews & DD → screening → use-case match → program; signature moment) → what you get grid (P5) → FAQs (P10, the 7 existing Q&As) → conversion band (P13: "Register now" → /spark/register/). Scroll progress bar active on this page.

### 6.5 SPARK register (was popup)

Minimal page, S2: heading, 3–4 fields max (name, email, company, stage select), consent, submit. No nav distractions beyond header. Success state replaces form (no redirect): "Application received — we respond within X days." (X from team.)

### 6.6 Industries — narrative: *the playground → four sectors → cross-sector synergy → act*

Hero (P1) → sector grid (P6, signature halo hover) → per-sector feature splits (P4 ×4: each with sector-dot eyebrow, what we scout, one linked case) → big claim on interconnectedness (P3) → conversion band.

### 6.7 Case studies (index + detail)

Index: hero (P1 compact) → featured video case (P8, auto-loop) → tile grid (P8 tiles: Corractions, Tactile Mobility, Maradin, Coreteel, Actasys, CHAMP) with sector Tag filters (system Tag component; filtering animates via FLIP reorder 220ms).
Detail template: full-bleed header (ph-case media, parallax) → challenge (S1) → approach (S2) → outcome with pull-stat count-up (S3, P2 single-stat variant) → next-case link (bottom, full-width tile).

### 6.8 About (team + news)

Hero (P1 short) → mission split (P4) → team grid (P5 variant: 1:1 photo placeholders, name, role, LinkedIn icon slot — no card renders without all four slots defined; fresh list pending) → What we're up to (P11 full version, feeds LinkedIn visibility goal) → conversion band.

### 6.9 Contact

Two-column S2: left — email (`company@quantum-hub.com`), address (F-11 corrected), LinkedIn, book-a-meeting link; right — **email + message fields only** (per review), magenta submit. No embedded form anywhere else on the site.

---

## 7. Responsive strategy

Breakpoints: 1200 (container) / 1024 / 768 / 480. Mobile-first CSS.

- ≥1024: full spec. 768–1024: splits stack (media above text), grids → 2-col, pins shortened. **<768: no T4 pins, no smooth-scroll lib** (native scroll; T2/T3-lite only), grids → 1-col, news strip → swipe row, hero split → stacked panels, header CTAs collapse into overlay menu.
- Touch targets ≥44px; hover-dependent info always has a visible-state equivalent on touch.

## 8. Accessibility gates

WCAG 2.1 AA. Contrast: body `--q-neutral-600` on white = passes; magenta on white passes for large text/UI only — never body copy. White on `--q-ink` passes. Focus: 3px `--shadow-focus` ring on every interactive element, never suppressed. Full keyboard path incl. accordion, tabs, filters, menu. Count-ups expose final value to AT immediately (`aria-live` off, static text under the hood). Video: muted, looping, `playsinline`, with pause control and no autoplay sound ever. `prefers-reduced-motion` per §5.2. Semantic landmarks per page: one `h1` (hero), eyebrows are not headings (styled `p`).

## 9. Performance budget

LCP < 2.0s (hero is text-first — media loads under it), CLS < 0.05 (placeholder boxes at fixed ratios), JS < 90KB gzip total (scroll lib + ScrollTrigger + Lucide + count-up ≈ within budget; no framework needed for a static marketing site), fonts: two families × weights actually used, `font-display: swap`, subset. Images lazy-load below fold; video `preload="metadata"`, loads only when near viewport.

## 10. Build notes (for the development phase, not action now)

Static HTML/CSS/vanilla JS matching the design system's token files (`tokens/*.css` as authored in the system doc). One `motion.js` module implements T2–T4 with a single reduced-motion switch. Patterns P1–P14 built as reusable HTML/CSS blocks so pages assemble from the same kit — this spec is the contract for that kit.

---

*Next step: wireframe Home against this spec (Phase 2), validating the pattern assignments with real rewritten copy.*

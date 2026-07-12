# Quantum-Hub.com — Website modernization strategy

Pre-development plan: UX analysis, content architecture, and visual direction.
Anchored to `Quantum-hub Design System.md` (charcoal `#283030` + magenta `#D82B72`, Quicksand/Manrope), evolved for a denser, more modern presentation inspired by sosa.co, startupnationcentral.org, and luxcapital.com.

---

## 1. UX/UI analysis

### 1.1 The core problem: a trust product with trust-eroding details

Quantum-hub's entire value proposition is *credible matchmaking* — "we vet startups, we de-risk pilots, test before you invest." That promise is undermined by exactly the flaws in the audit: wrong stats about your own partners (VDL's 22-countries/13,500-employees claim vs. the real 20/17,000; Hyundai "operating in 200 countries" when 195 exist), broken links, and an outdated team section without photos. For a visitor deciding whether to trust you with a POC, these read as carelessness — the one quality a matchmaker cannot afford to display. **Factual accuracy and link integrity are therefore not "polish" items; they are the product.**

### 1.2 Information architecture problems

**SPARK has no home.** SPARK is clearly a flagship program, yet it exists only as fragments re-explained on multiple pages, with two different "Read more about SPARK" links landing on two different wrong pages (POC Playground; Startups). When a program is important enough to be linked from everywhere, it must have a canonical page that every mention points to. The current structure forces each page to re-explain SPARK, which is the root cause of the repetition.

**Two audiences, one undifferentiated funnel.** Corporates ("Partners") and startups have opposite needs — one is buying de-risked innovation, the other is seeking market access — but the site serves them near-identical content: the Startups page recycles "Our partners" and "Choose your track" from the Partners page. This creates both redundancy and vagueness: copy written for two audiences at once persuades neither. The requested "Who are you?" selector is the right fix, but it must go deeper than a widget — the two journeys need genuinely distinct content.

**Navigation promises are broken.** "Industries we cover → Discover more" landing on POC Playground is a category error (a sector overview resolving to a case study). Every link's destination should be predictable from its label — this becomes a hard rule in the sitemap below.

**Modal misuse.** "Spark with us" as a popup buries a high-commitment conversion (registration) in a low-commitment UI pattern (interruption). Registration is a destination, not an interruption: full page, reached deliberately via "Register now."

**No content freshness signals.** Nothing on the site says "this organization is alive right now." Lux Capital's "What we're up to" works because it timestamps activity. Without news/blog/LinkedIn surface, the outdated content problem will recur — there is no designated place for *new* content to live.

### 1.3 Page-level and conversion problems

- **Contact is over-engineered.** A complex form raises the cost of the site's most valuable action. Reduce to email + message (plus the "Who are you?" context if already known). Every removed field measurably raises conversion.
- **Case studies undersell the proof.** POC Playground and Champ are the "proof" in "proof of concept" — the strongest sales asset a POC-methodology company has — yet they lack a clear narrative structure. Sosa's pattern is the fix: challenge → approach → outcome, with concrete numbers.
- **Copy intimidates.** "Setting up innovation for mutual success" is abstract corporate-speak; the design system's voice ("test before you invest") is already better than the live site's. "Network" → "globally" is part of the same shift from jargon to plain claims.
- **White space reads as emptiness.** The issue isn't whitespace per se (the design system rightly calls for generous spacing) — it's *low information density between sections*: sparse sections that each say one thin thing. Lux Capital feels "full" because every scroll-stop delivers content. The fix is fewer, richer sections, not cramped spacing.
- **Weak LinkedIn presence** on a B2B site removes the primary channel where corporate innovation people actually verify you.

### 1.4 What's structurally right (keep)

The underlying offer architecture is sound: sector focus (Automotive, Logistics, Industry 4.0, Energy), POC methodology, named corporate partners, real case studies. This is a content *organization* problem, not a content *existence* problem — which makes it very fixable pre-development.

---

## 2. Strategic roadmap (pre-development)

### Phase 0 — Content audit and fact base (foundation)

1. **Full content inventory**: spreadsheet of every page, section, link (label → actual destination → correct destination), and claim on the current site. The audit document seeds this; make it exhaustive.
2. **Fact-check register**: every number, partner stat, and claim gets a source and a verified value (VDL: 20 countries / ~17,000 employees; Hyundai: replace "200 countries" with a verifiable figure or a different framing, e.g. markets served). Rule going forward: **no unverifiable numbers on the site.**
3. **Copy triage**: mark each block keep / rewrite / delete. Flag all SPARK fragments for consolidation into the new SPARK page.
4. **Placeholder manifest**: list every image, team photo, video, and LinkedIn profile slot as a named placeholder (e.g. `team-photo-01`, `case-champ-hero`) so layouts can be designed now and assets dropped in later without rework.

Deliverable: content inventory + fact register + placeholder manifest.

### Phase 1 — Information architecture and content mapping

1. **Sitemap** (proposed below) — every page gets one job, every link a predictable destination.
2. **Audience journey maps**: one for corporates (aware → evaluate credibility → understand POC process → book a meeting) and one for startups (aware → assess fit → understand tracks → register for SPARK). The "Who are you?" selector routes into these.
3. **Page content briefs**: for each page, section order, message per section, CTA, and which placeholder assets it needs. This is where "logical section ordering" is designed.
4. **Redirect map**: old URL → new URL for every current page, so no inbound link breaks at launch.

Proposed sitemap:

```
Home
├─ For partners (corporates)         ← "Who are you?" route A
├─ For startups                      ← "Who are you?" route B
├─ SPARK                             ← dedicated program page (canonical)
│   └─ Register (full page, via "Register now" only)
├─ Industries                        ← Automotive · Logistics · Industry 4.0 · Energy
├─ Case studies
│   ├─ POC Playground                ← embedded auto-loop video
│   └─ Champ
├─ About
│   ├─ Team                          ← photo placeholders + LinkedIn slots
│   └─ News / What we're up to       ← freshness surface (Lux pattern)
└─ Contact                           ← email + message only
Global: header nav · language selector · book-a-meeting CTA · footer (with LinkedIn)
```

Section-ordering principle for every page: **hook → proof → process → action** (claim, evidence with numbers, how it works, single CTA).

Home page section order: hero with plain-language claim and "Who are you?" split → count-up stats band (inverse charcoal) → industries grid (4 sector cards, each linking to Industries) → SPARK teaser (one paragraph, links to SPARK page — nowhere else explains it) → featured case study with looping video → "What we're up to" strip → book-a-meeting band → footer.

Deliverable: sitemap + journey maps + per-page content briefs + redirect map.

### Phase 2 — Wireframes (structure before style)

1. **Low-fi wireframes** for the seven core templates: Home, For partners, For startups, SPARK, Industry, Case study, Contact/Register. Grayscale, placeholder blocks, real (drafted) copy — wireframing with lorem ipsum hides content problems, and content is our biggest risk.
2. **Copy drafting in parallel**: rewrite intimidating copy in the design-system voice while wireframing, since section sizes depend on real text length.
3. **Interaction specs**: "Who are you?" selector behavior, language selector placement and behavior, count-up trigger (on scroll into view, once), video embed (muted auto-loop, no controls chrome), book-a-meeting flow.
4. **Click-through review**: assemble wireframes into a clickable flow and walk both audience journeys end-to-end; verify every link label predicts its destination.

Deliverable: wireframe set + draft copy + interaction spec.

### Phase 3 — Visual design (high-fidelity)

1. **Design language application**: apply the evolved system (Section 3) to two pages first — Home and one case study — as the "north star" pair; review, adjust, then roll across remaining templates.
2. **Component sheet**: finalize the site's component states (buttons, cards, tags, stat counters, nav, language selector, forms) against the design-system tokens.
3. **Responsive passes**: desktop → tablet → mobile for each template.
4. **Verification gate before development**: every fact against the fact register; every link against the sitemap; copy voice check; accessibility check (contrast, focus rings, touch targets). Nothing enters development that fails the gate.

Deliverable: high-fidelity comps + component sheet + verified content, ready for build.

---

## 3. Visual identity vision

Direction: **evolve the existing Quantum-hub system** — the charcoal/magenta identity is distinctive and modern; what needs to change is density, rhythm, and motion, not the palette.

### 3.1 Color

Keep the token set as-is; change how it's *deployed*:

- **Rhythm through surface alternation**, not decoration: white → `--q-neutral-50` → inverse charcoal bands, alternating down the page. This is the direct answer to "too much white space" — Lux Capital's fullness comes from surface rhythm, and the inverse charcoal band is already in the system (stats, footer). Target roughly one inverse band per page (stats or CTA), never two adjacent same-color sections.
- **Magenta stays scarce**: one accent per view — the primary CTA, the active nav state, the count-up numerals. Scarcity is what makes it read as intentional.
- **Sector accents earn their keep** on the Industries grid and case-study tags (automotive blue, logistics teal, industry violet, energy amber) — as dots and data hues only, per the system.
- **No gradients** (per system); depth comes from the soft shadow scale and surface alternation.

### 3.2 Typography

Quicksand (display) + Manrope (body) stay. Evolutions:

- **Push the display scale harder**: heroes at `--text-4xl` (58px) with tight leading; stat numerals even larger in the inverse band. The current site likely underuses the top of the scale — big type is the cheapest modernization available.
- **Eyebrow labels everywhere sections start**: lowercase, wide-tracked, magenta (`what we're up to`, `proof, not promises`) — echoes the lowercase wordmark and gives every section a consistent entry point.
- **Plain-claim headlines**: sentence case, concrete, in the matchmaker voice. "Setting up innovation for mutual success" becomes something like "We prove the fit before you invest." Numbers in headlines wherever they're verified.

### 3.3 Design language, borrowed deliberately

- From **startupnationcentral.org** — the count-up stat band: 4–5 verified numbers (POCs run, startups vetted, corporate partners, countries) counting up on scroll, large numerals with magenta accent on the charcoal inverse surface. Only verified numbers from the fact register.
- From **sosa.co** — case-study anatomy: full-bleed header (placeholder image/video), challenge → approach → outcome structure, pull-quote stat, sector tag, next-case link. Plus the persistent **book-a-meeting** CTA (header button + pre-footer band) and, later, careers/blog patterns under About/News.
- From **luxcapital.com** — density and flow: sections that butt against each other with alternating surfaces, smooth scrolling, and the "What we're up to" news strip (3–4 cards: date, one-liner, link — LinkedIn posts can feed this, answering the visibility goal).
- **The dot motif** as the single decorative device (per system): one magenta dot per composition — punctuating the hero headline, or as the count-up separator. It's the signature; scarcity keeps it so.

### 3.4 Motion

Quiet and purposeful (per system: 140–220ms ease-out): count-ups trigger once on scroll-into-view; cards raise on hover; the POC Playground video auto-loops muted with no controls; smooth scroll for anchor navigation. No parallax, no bounces, no scroll-jacking.

### 3.5 Placeholder strategy

All imagery, team photos, and LinkedIn profiles are conceptual placeholders until late development: cool-toned neutral blocks (`--q-neutral-100`) at final aspect ratios, labeled from the placeholder manifest (Phase 0), with team cards designed to hold photo + name + role + LinkedIn slot. Layouts are designed to be *complete without* final assets, so nothing blocks on photography.

---

## Immediate next steps

1. Build the Phase 0 content inventory and fact register from the current site.
2. Draft the seven page content briefs (Phase 1).
3. Wireframe Home first — it forces every architectural decision (routing, stats, SPARK teaser, news strip) at once.

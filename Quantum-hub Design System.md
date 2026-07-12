# Quantum-hub Design System

> ⚠ **DARK V2 AMENDMENT (2026-07-12, decided by Amir) — supersedes parts of this document.**
> The site is now dark throughout: black/charcoal + magenta + blends only, **no white surfaces**.
> - **Surfaces**: page base `#0e1112`; sections are translucent overlays over a fixed background of drifting magenta radial glows (`rgba(216,43,114,.08–.16)`) on a `#0e1112 → #1a2020 → #14090f` vertical blend. The "no gradients" rule is lifted *for this background only*; components remain flat.
> - **Type**: Syne (display, weight 800) + Newsreader (serif body, italic emphasis renders white) + Inter (UI chrome: nav, buttons, forms, meta). Replaces Quicksand/Manrope.
> - **Text**: headings `#ffffff`, body `#c2cbcb`, muted `#8a9797`; links `#f06ba0` → white on hover.
> - **Cards/components**: translucent white fills (`rgba(255,255,255,.04)`) with `rgba(255,255,255,.09)` borders; hover = magenta border/glow, not shadow-raise.
> - **Logo**: the actual logo image (`assets/quantum-logo.jpg`) sits top-left in a rounded white tile until a transparent mark arrives.
> - Everything else below (spacing, radii, pills, dot motif, motion timing, voice, sector accents as dots) still applies. Current tokens live in `tokens/*.css` — those files are the source of truth.

Quantum-hub is an industry-and-tech platform that connects industry leaders with startups. It focuses on **Automotive, Logistics, Industry 4.0, and Energy**, using an end-to-end value-chain approach and a practical **POC (Proof of Concept)** testing methodology to bridge the two worlds.

## Sources provided
- `uploads/LOGO.jpg` — the only brand asset supplied: "quantum" wordmark (charcoal `#283030`, rounded lowercase geometric sans) with a circular Q mark and a magenta dot (`#D82B72`).
- Company description (text, above). No codebase, Figma, decks, or font files were provided; everything beyond the logo colors is a considered extension, flagged where relevant.

## CONTENT FUNDAMENTALS
The voice of a pragmatic matchmaker between corporates and startups: confident, concrete, outcome-driven. Not startup-hype, not corporate-stiff.

- **Tone**: direct, professional, optimistic. Talks about *proof*, *pilots*, *outcomes* — not buzzwords. "Test before you invest", not "revolutionize your synergies".
- **Person**: "we" for Quantum-hub, "you" for the reader (corporate or startup). Second-person CTAs: "Start your POC", "Meet your match".
- **Casing**: sentence case everywhere — headlines, buttons, nav. The brand itself is lowercase ("quantum"); eyebrow labels use lowercase with wide tracking to echo it.
- **Emoji**: none. Numbers and sector names carry the color instead.
- **Vocabulary**: POC, pilot, value chain, corporate partner, startup, scouting, validation, matchmaking, sector.
- **Examples**:
  - Hero: "Where industry meets innovation." / "We connect industry leaders with vetted startups — and prove the fit with a real POC."
  - CTA: "Start a POC" · "Scout startups" · "Book a call"
  - Status copy: "POC in validation — pilot starts May 12."

## VISUAL FOUNDATIONS
- **Colors**: near-monochrome charcoal/white with one hot accent. Charcoal `--q-ink #283030` for headings and inverse surfaces; magenta `--q-magenta #D82B72` used *sparingly* — the "dot" of the logo: CTAs, links, active states, one accent per view. Cool grays derived from the charcoal (slightly green-cast, never blue). Four muted sector accents (automotive blue, logistics teal, industry violet, energy amber) used only as tags/data hues. Backgrounds are white or `--q-neutral-50`; inverse charcoal sections for footers and stat bands. No gradients.
- **Type**: Quicksand (display — rounded, geometric, echoes the wordmark; lowercase-friendly) + Manrope (UI/body). Headlines bold, tight leading, sentence case. Eyebrow labels: 12–13px, lowercase, `letter-spacing: .14em`, often magenta.
- **Spacing**: 8px base scale; generous whitespace; 1200px max container.
- **Shape**: rounded — radii 8/12/18/28px and pills for buttons/tags, echoing the circular Q. Cards: white, 1px `--border-default` border, `--radius-lg`, `--shadow-sm` (hover `--shadow-md`). No colored left-border cards.
- **The dot motif**: a small magenta circle (8–10px) may punctuate headings, list markers, and section eyebrows — the single decorative device, straight from the logo. Use one per composition.
- **Imagery**: none provided. Use photo placeholders (industrial, cool-toned) rather than drawn illustration. No SVG illustration.
- **Motion**: quiet. 140–220ms ease-out fades/raises; hover = raise shadow + slight darken; press = scale(0.98). No bounces, no infinite loops.
- **States**: hover darkens fills (`--accent-primary-hover`) or raises shadow; focus = 3px magenta soft ring (`--shadow-focus`); disabled = 45% opacity.
- **Transparency/blur**: only for the sticky header (white at 85% + blur).

## ICONOGRAPHY
- No icon set was provided. **Substitute: [Lucide](https://lucide.dev) via CDN** — 1.5–2px stroke, rounded caps/joins, matches the rounded geometry. Flagged for replacement if the brand has its own set.
- Icons inherit `currentColor`, default 20px in UI, 24–28px in feature cards.
- No emoji, no unicode-glyph icons. The magenta dot (a plain CSS circle) is the only decorative glyph.
- Logo: `assets/quantum-logo.jpg` (200×200 JPG on white — only supplied version; a transparent/SVG mark and a horizontal lockup are needed from the brand team).

## Index
- `styles.css` — global entry; imports everything under `tokens/`.
- `tokens/` — `colors.css`, `typography.css`, `layout.css` (spacing/radius/shadow/motion), `fonts.css`, `base.css`.
- `assets/` — `quantum-logo.jpg`.
- `guidelines/` — foundation specimen cards (Design System tab).
- `components/` — standard set (no source inventory existed; see "Intentional additions"):
  - `core/`: Button, IconButton, Card, Badge, Tag
  - `forms/`: Input, Select, Checkbox, Radio, Switch
  - `navigation/`: Tabs
  - `feedback/`: Dialog, Toast, Tooltip
- `ui_kits/platform/` — marketing/platform screens for quantum-hub.com (invented layout on real foundations; no product source existed).
- `SKILL.md` — agent-skill entry point.

## Intentional additions
No component source (codebase/Figma) was provided, so the standard component set and the UI kit compositions are original work built strictly on the sampled brand colors and wordmark-derived type/shape language.

---

# Design Tokens

## Colors (tokens/colors.css)

```css
/* Quantum-hub — Color tokens
   Base palette sampled from uploads/LOGO.jpg:
   charcoal #283030, magenta #D82B72 */
:root {
  /* Brand */
  --q-ink: #283030;            /* logo charcoal */
  --q-ink-soft: #3a4444;
  --q-magenta: #d82b72;        /* logo dot */
  --q-magenta-strong: #b81f5e;
  --q-magenta-soft: #fbe4ee;
  --q-magenta-tint: #fdf2f7;

  /* Neutrals (cool, charcoal-derived) */
  --q-neutral-0: #ffffff;
  --q-neutral-50: #f6f8f8;
  --q-neutral-100: #eef1f1;
  --q-neutral-200: #dde3e3;
  --q-neutral-300: #c2cbcb;
  --q-neutral-400: #96a3a3;
  --q-neutral-500: #6b7a7a;
  --q-neutral-600: #4d5a5a;
  --q-neutral-700: #3a4444;
  --q-neutral-800: #283030;
  --q-neutral-900: #1a2020;

  /* Sector accents (harmonized in oklch with brand magenta) */
  --q-automotive: #2a6fdb;     /* automotive — blue */
  --q-logistics: #0e9488;      /* logistics — teal */
  --q-industry: #7a4fd0;      /* industry 4.0 — violet */
  --q-energy: #e8930c;         /* energy — amber */

  /* Semantic status */
  --q-success: #1f8a5b;
  --q-success-soft: #e2f4ea;
  --q-warning: #b97708;
  --q-warning-soft: #fdf1da;
  --q-danger: #cf3141;
  --q-danger-soft: #fbe7e9;
  --q-info: #2a6fdb;
  --q-info-soft: #e7effc;

  /* Semantic aliases */
  --text-heading: var(--q-ink);
  --text-body: var(--q-neutral-600);
  --text-muted: var(--q-neutral-400);
  --text-inverse: #ffffff;
  --text-link: var(--q-magenta);
  --text-link-hover: var(--q-magenta-strong);

  --surface-page: var(--q-neutral-0);
  --surface-subtle: var(--q-neutral-50);
  --surface-card: var(--q-neutral-0);
  --surface-inverse: var(--q-ink);
  --surface-accent: var(--q-magenta-tint);

  --border-default: var(--q-neutral-200);
  --border-strong: var(--q-neutral-300);
  --border-focus: var(--q-magenta);

  --accent-primary: var(--q-magenta);
  --accent-primary-hover: var(--q-magenta-strong);
  --accent-primary-soft: var(--q-magenta-soft);
}
```

## Typography (tokens/typography.css)

```css
/* Quantum-hub — Typography tokens
   NOTE: no font binaries were provided. Google Fonts substitutes:
   - Display: "Quicksand" (nearest match to the rounded lowercase wordmark)
   - UI/Body: "Manrope"
   Swap via @font-face in tokens/fonts.css when real files arrive. */
:root {
  --font-display: "Quicksand", "Manrope", system-ui, sans-serif;
  --font-body: "Manrope", system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, monospace;

  /* Scale */
  --text-xs: 12px;
  --text-sm: 13px;
  --text-base: 15px;
  --text-md: 17px;
  --text-lg: 20px;
  --text-xl: 26px;
  --text-2xl: 34px;
  --text-3xl: 44px;
  --text-4xl: 58px;

  /* Weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;

  /* Line heights */
  --leading-tight: 1.12;
  --leading-snug: 1.3;
  --leading-normal: 1.55;

  /* Letterspacing — wordmark is loose lowercase */
  --tracking-display: 0.01em;
  --tracking-wide: 0.14em;   /* eyebrows / labels, uppercase or lowercase */
  --tracking-normal: 0;
}
```

## Spacing, radius, shadow, motion (tokens/layout.css)

```css
/* Quantum-hub — Spacing, radius, shadow, motion tokens */
:root {
  /* Spacing (8px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 96px;

  /* Radii — rounded brand, echoing the circular Q mark */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 28px;
  --radius-pill: 999px;

  /* Shadows — soft, cool, low-contrast */
  --shadow-sm: 0 1px 2px rgba(40, 48, 48, 0.06);
  --shadow-md: 0 4px 14px rgba(40, 48, 48, 0.08);
  --shadow-lg: 0 12px 32px rgba(40, 48, 48, 0.12);
  --shadow-focus: 0 0 0 3px rgba(216, 43, 114, 0.22);

  /* Motion */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1); /* @kind other */
  --duration-fast: 140ms; /* @kind other */
  --duration-base: 220ms; /* @kind other */
  --duration-slow: 360ms; /* @kind other */

  /* Layout */
  --container-max: 1200px;
  --header-height: 72px;
}
```

## Fonts (tokens/fonts.css)

```css
/* Quantum-hub — Webfonts
   SUBSTITUTION: no brand font files were provided.
   Quicksand ≈ the rounded geometric lowercase wordmark; Manrope for UI/body.
   Loaded from Google Fonts CDN. Replace with @font-face rules + local
   binaries when the real brand fonts arrive. */
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap");
```

## Base element styles (tokens/base.css)

```css
/* Quantum-hub — base element styles */
body {
  font-family: var(--font-body);
  color: var(--text-body);
  background: var(--surface-page);
  -webkit-font-smoothing: antialiased;
}
h1, h2, h3, h4 {
  font-family: var(--font-display);
  color: var(--text-heading);
  letter-spacing: var(--tracking-display);
}
a { color: var(--text-link); text-decoration: none; }
a:hover { color: var(--text-link-hover); }
::selection { background: var(--q-magenta-soft); }
```

---

# Components

### core

#### Button

Pill-shaped button in the four brand variants; magenta primary is reserved for the main action of a view.

```jsx
<Button variant="primary" size="md" onClick={go}>Start a POC</Button>
<Button variant="outline" icon={<ArrowRight size={16} />}>Scout startups</Button>
```

Variants: `primary` (magenta), `secondary` (charcoal), `outline`, `ghost`. Sizes sm/md/lg (32/40/48px). Press scales to 0.98.

**Props:**

```ts
/** Pill-shaped brand button. */
export interface ButtonProps {
  /** Visual style */
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Optional leading icon node (20px) */
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
```

#### IconButton

Circular icon-only button; always pass `label` for accessibility.

```jsx
<IconButton label="Close" onClick={close}><X size={20} /></IconButton>
```

Variants: `primary`, `outline`, `ghost` (default). Sizes 32/40/48px circles.

**Props:**

```ts
/** Circular icon-only button. */
export interface IconButtonProps {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Accessible label (also the tooltip) */
  label: string;
  /** The icon node, ~20px */
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
```

#### Card

The brand surface: white, 1px `--border-default`, `--radius-lg`, `--shadow-sm`; hover raises when `interactive`.

```jsx
<Card interactive onClick={open}>
  <h3>Fleet telemetry POC</h3>
  <p>Validation phase — pilot starts May 12.</p>
</Card>
```

`inverse` renders the charcoal band variant for stats/footers.

**Props:**

```ts
/** Surface container: white, 1px border, 18px radius, soft shadow. */
export interface CardProps {
  /** Hover raise + pointer cursor */
  interactive?: boolean;
  /** Charcoal inverse surface */
  inverse?: boolean;
  /** CSS padding, default var(--space-5) */
  padding?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
```

#### Badge

Small pill for statuses ("In validation", "Pilot live").

```jsx
<Badge tone="success" dot>Pilot live</Badge>
```

Tones: neutral, magenta, success, warning, danger, info. `dot` adds a leading status dot.

**Props:**

```ts
/** Small pill status label. */
export interface BadgeProps {
  tone?: "neutral" | "magenta" | "success" | "warning" | "danger" | "info";
  /** Leading status dot */
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
```

#### Tag

Filter chip; use `sector` for the four sector hues (dot only — the chip stays neutral).

```jsx
<Tag sector="automotive" selected={f === "auto"} onClick={...}>Automotive</Tag>
```

**Props:**

```ts
/** Selectable filter chip; sector variants carry a colored dot. */
export interface TagProps {
  /** Sector dot color */
  sector?: "automotive" | "logistics" | "industry" | "energy";
  selected?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
```

### forms

#### Input

Labeled text field; 44px tall, 12px radius, magenta focus ring.

```jsx
<Input label="Work email" placeholder="you@company.com" hint="We only use this for the intro." />
```

`error="…"` switches to danger styling; `prefix` takes a leading icon.

**Props:**

```ts
/** Labeled text field with focus ring, hint and error states. */
export interface InputProps {
  label?: string;
  hint?: string;
  /** Error message; also colors the border */
  error?: string;
  /** Leading icon/adornment */
  prefix?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
```

#### Select

Native select matching Input's 44px/12px-radius chrome.

```jsx
<Select label="Sector" options={["Automotive", "Logistics", "Industry 4.0", "Energy"]} value={v} onChange={e => setV(e.target.value)} />
```

**Props:**

```ts
/** Labeled native select styled to match Input. */
export interface SelectProps {
  label?: string;
  /** Strings or {value,label} pairs */
  options: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
```

#### Checkbox

Controlled checkbox; `onChange` receives the next boolean.

```jsx
<Checkbox label="Include energy startups" checked={v} onChange={setV} />
```

**Props:**

```ts
/** 20px rounded checkbox with magenta checked state. */
export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
```

#### Radio

Radio option; render one per choice, `checked` on the active one.

```jsx
<Radio label="Corporate partner" checked={role === "corp"} onChange={() => setRole("corp")} />
```

**Props:**

```ts
/** 20px radio; checked state is a thick magenta ring. */
export interface RadioProps {
  label?: string;
  checked?: boolean;
  /** Called when this option is picked */
  onChange?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;
```

#### Switch

Toggle for settings/preferences.

```jsx
<Switch label="Email me new matches" checked={v} onChange={setV} />
```

**Props:**

```ts
/** 40×24 toggle switch, magenta when on. */
export interface SwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
```

### navigation

#### Tabs

Underline tab bar; optional count pill per tab.

```jsx
<Tabs tabs={[{id:"all",label:"All POCs",count:12},{id:"live",label:"Pilot live",count:3}]} active={tab} onChange={setTab} />
```

**Props:**

```ts
/** Underline tabs with magenta active indicator. */
export interface TabsProps {
  /** Strings or {id,label,count?} objects */
  tabs: Array<string | { id: string; label: string; count?: number }>;
  /** Active tab id */
  active: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
```

### feedback

#### Dialog

Modal dialog; pass Buttons in `footer`.

```jsx
<Dialog open={open} title="Request an intro" onClose={close}
  footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button onClick={send}>Send request</Button></>}>
  We'll connect you with the startup's founding team within 48 hours.
</Dialog>
```

**Props:**

```ts
/** Centered modal with scrim; click-outside or ✕ closes. */
export interface DialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  /** Action row, usually Buttons */
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /** px, default 480 */
  width?: number;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
```

#### Toast

Notification card; the tone shows as a status dot, not a colored border.

```jsx
<Toast tone="success" title="POC request sent" description="The startup will respond within 48 hours." onDismiss={hide} />
```

**Props:**

```ts
/** Notification card with tone dot; position it yourself (usually fixed bottom-right). */
export interface ToastProps {
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  title: string;
  description?: string;
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;
```

#### Tooltip

Hover tooltip; wrap the trigger.

```jsx
<Tooltip label="Vetted by quantum"><Badge tone="magenta">verified</Badge></Tooltip>
```

**Props:**

```ts
/** Hover tooltip on charcoal chip. */
export interface TooltipProps {
  label: string;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
```

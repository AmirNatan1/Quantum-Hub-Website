# Phase 0 — Content audit and fact base

Crawled from the live site on 2026-07-12 (Home, POC Playground, Partners, Startups, Contact us).
Three deliverables: **A. Content inventory** (pages, sections, links, triage) · **B. Fact register** (every claim, verified value, source) · **C. Placeholder manifest**.

Governing rules established here:

1. **Partners Login is removed entirely** — inactive service (per Amir, 2026-07-12). It currently appears in every header; the desktop button even points to a *different* URL (`qh.partners`) than the mobile menu (`qdealflow.com` password page). Both go.
2. No unverifiable numbers on the new site.
3. Every link label must predict its destination (link map below is the enforcement tool).

---

## A. Content inventory

### A.1 Site-wide elements (appear on every page)

| Element | Current state | Verdict |
|---|---|---|
| Header nav | Home · POC Playground · Partners (CHAMP, Enrichment Academy) · Startups (SPARK) | REBUILD per new sitemap (For partners / For startups / SPARK / Industries / Case studies / About / Contact) |
| **Partners Login button** | Desktop → `https://qh.partners/`; mobile menu → `https://qdealflow.com/?password-protected=login…` (two different dead-end destinations) | **REMOVE ENTIRELY** — inactive service |
| Contact us button | → /contact-us/ | KEEP (becomes book-a-meeting + contact CTA) |
| Contact form embedded at bottom of every page | Full Name, Company, Email, Message, consent | REMOVE from all pages; Contact page only, simplified (email + message) |
| Footer | Duplicated nav ×2, LinkedIn icon, legal links, "Quantum 2024" | REBUILD; fix stale year; "Terms of use" points to `/privacy-policy-2/` (a privacy-policy slug — verify the actual terms content exists) |
| Language selector | Does not exist | ADD (site-wide, header) |
| "Who are you?" routing | Only as two hero buttons on Home (see A.2) | ADD as designed selector routing Partners vs Startups |

### A.2 Home (`/`)

| # | Section | Content | Verdict |
|---|---|---|---|
| 1 | Hero | "Industry & tech platform" + PARTNERS / STARTUPS buttons | REWRITE — **STARTUPS button is a dead link (`#`)**; PARTNERS works. Becomes the "Who are you?" split |
| 2 | Who are we? | Platform description, "five holding companies with 300+ subsidiaries", partner names | KEEP + REWRITE (fact-check the 300+ claim, F-01) |
| 3 | "INDUSTRIES WE COVER. TECHNOLOGy WE SEEK." | 4 sectors + "DISCOVER MORE" → **/poc-playground/ (WRONG — should be Industries page)**. Typo: "TECHNOLOGy" | FIX LINK + REWRITE |
| 4 | "Setting up innovation for mutual success" | 5 offering blocks (Comprehensive offerings, Market needs, Tech validation, Trusted knowledge, Mutual impact) — **every block is rendered twice** (mobile/desktop duplication); heading typo "Matual impact"; intimidating copy flagged in review | CONSOLIDATE + REWRITE (soften headline) |
| 5 | How we work? | "IT'S NOT MAGIC, IT'S MUTUAL IMPACT" + 5 cards: Network, Events, POCs, Programs, Innovation Consulting | REWRITE — "Network" card text becomes "globally" phrasing per review; card set overlaps section 4 |
| 6 | SPARK teaser | Program description + "READ MORE ABOUT SPARK" → **/poc-playground/ (WRONG — should be SPARK page)** | KEEP teaser, FIX LINK → new /spark/ |
| 7 | Our team | 12 cards; LinkedIn links for 8; **no LinkedIn/photos for Gadi Ungar, Oz Dekel, Ella Orenstain**; mystery card "Q — Uplifting R&D Center Capabilities"; outdated per review | REWRITE from fresh team list; moves to About |
| 8 | Upcoming event | "Quantum & Hyundai Playground event 10 \| 02 \| 2024" — **rendered 4×, dated 2024 (2+ years stale)**, "Take me to event" has no href | REMOVE; replaced by "What we're up to" news strip |
| 9 | Contact us form | Full form + typo "CONTACt us" | REMOVE (site-wide rule) |

### A.3 POC Playground (`/poc-playground/`)

| # | Section | Content | Verdict |
|---|---|---|---|
| 1 | Hero | Playground description | KEEP + REWRITE |
| 2 | Stats band | "Partners' Assessment 500 · Portfolio Companies 0 · POCs done 0 · Commercial Discussions 0" — **counters render as 0 / labels misaligned** (JS count-up broken in static render) | REBUILD as verified count-up band (F-08); numbers from fact register only |
| 3 | Industries we cover | Sector overview, 5 icon slots | MOVE core content to new Industries page |
| 4 | CASE STUDIES | Intro card "READ MORE" → **dead link (`#`)**; 5 POC cards: Corractions, Tactile Mobility, Maradin, Coreteel, Actasys | REDESIGN per sosa.co anatomy (challenge→approach→outcome); fix dead link; add POC Playground auto-loop video per review |
| 5 | Contact form | Duplicate | REMOVE |

### A.4 Partners (`/partners/`)

| # | Section | Content | Verdict |
|---|---|---|---|
| 1 | Hero | Matchmaking description | KEEP + REWRITE |
| 2 | Our Partners | 5 partner blocks: Taavura-Livnat, Talcar, VDL, Hyundai, Bazan + VISIT WEBSITE links. **Talcar link goes to a Kia-importer page** (kia-israel.co.il), not a Talcar corporate page | KEEP; fact-check all stats (F-02…F-07); reconsider Talcar link target |
| 3 | A world where innovation thrives | 4 value blocks | REWRITE, consolidate with Home section 4 (same message, different words — redundancy) |
| 4 | Two main tracks | SPARK + "READ MORE ABOUT SPARK" → **/start-ups/ (WRONG — should be SPARK page)**; Agile Track → /poc-playground/ | FIX LINK; SPARK description is the 3rd variant of the same text (see A.7) |
| 5 | CHAMP | Program description + 3 testimonials (Maya Gitlin/Globus, Yaarit Harpaz/Globus, Galit Shrem/Tashtit) — **every testimonial rendered twice** | KEEP (CHAMP is real content); fix duplication; testimonials are an asset |
| 6 | Enrichment Academy | 3-paragraph description | KEEP, condense |
| 7 | Contact form | Duplicate | REMOVE |

### A.5 Startups (`/start-ups/`)

| # | Section | Content | Verdict |
|---|---|---|---|
| 1 | Hero | Commercialization journey description | KEEP + REWRITE |
| 2 | Our Partners | **Identical block to Partners page** (all 5 partners, same text) | REMOVE from this page — link to partners content instead (redundancy flagged in review) |
| 3 | Advantages of working with us | 4 cards (visibility, success, support, ecosystem) | KEEP + REWRITE — this is the genuinely startup-specific content |
| 4 | Choose your track | **Recycled from Partners page** (SPARK + Agile Track); "READ MORE ABOUT SPARK" → `#spark` anchor | REMOVE duplication; route to new /spark/ |
| 5 | SPARK long-form | Full program description, Why apply, REGISTER NOW → **Elementor popup** ("spark with us!" form — with typo "SUMBIT" on the submit button) | MOVE to new dedicated /spark/ page; popup becomes full /spark/register/ page per review |
| 6 | Program Overview | 5 steps: application → interviews & DD → screening committee → PoC use case → welcome | MOVE to /spark/ |
| 7 | FAQS | 7 Q&As (equity-free, who can apply, criteria, reapplying, commitment, after program) | MOVE to /spark/ — strong content, keep nearly as-is |
| 8 | Contact form | Duplicate | REMOVE |

### A.6 Contact us (`/contact-us/`)

| # | Section | Content | Verdict |
|---|---|---|---|
| 1 | Info cards | Waze address (Herzliya), company@quantum-hub.com, LinkedIn | KEEP, restyle |
| 2 | Get in touch form | Full Name, Company, Email, Message, consent | SIMPLIFY to email + message (per review) |

### A.7 Cross-site redundancy map (root causes)

- **SPARK is described 5 times** (Home teaser, Partners tracks, Startups tracks, Startups long-form, popup) with 3 different wordings and 3 different link destinations — none of them a SPARK page. → Fix: canonical /spark/ page; all mentions become one-paragraph teaser + link.
- **Partner list duplicated verbatim** on Partners and Startups.
- **Offering/value propositions triplicated**: Home "Setting up innovation…" (5 blocks) ≈ Home "How we work?" (5 cards) ≈ Partners "A world where innovation thrives" (4 blocks). One consolidated "how it works" treatment.
- **Contact form on every page**; several sections rendered twice in the DOM (Home offerings, CHAMP testimonials, event card ×4).

### A.8 Link map (label → actual → correct)

| Page | Link label | Actually goes to | Should go to | Status |
|---|---|---|---|---|
| All | Partners Login (desktop) | qh.partners | — | **REMOVE** |
| All | Partners Login (mobile) | qdealflow.com password page | — | **REMOVE** |
| Home | STARTUPS (hero) | `#` (dead) | /for-startups/ | BROKEN |
| Home | PARTNERS (hero) | /partners/ | /for-partners/ | OK→remap |
| Home | DISCOVER MORE (industries) | /poc-playground/ | /industries/ | WRONG |
| Home | READ MORE ABOUT SPARK | /poc-playground/ | /spark/ | WRONG |
| Home | Take me to event | none (no href) | — (section removed) | BROKEN |
| Partners | READ MORE ABOUT SPARK | /start-ups/ | /spark/ | WRONG |
| Partners | READ MORE ABOUT POC PLAYGROUND | /poc-playground/ | /case-studies/ | OK→remap |
| Partners | VISIT WEBSITE (Talcar) | kia-israel.co.il importer page | Talcar corporate site (confirm URL) | QUESTIONABLE |
| Startups | READ MORE ABOUT SPARK | #spark (same page) | /spark/ | REMAP |
| Startups | REGISTER NOW | Elementor popup | /spark/register/ | REBUILD |
| POC Playground | READ MORE (case studies) | `#` (dead) | /case-studies/ | BROKEN |
| Footer | Terms of use | /privacy-policy-2/ | /terms/ (verify content) | QUESTIONABLE |
| Footer nav (×2 duplicated blocks) | mirrors header | — | single footer nav | REBUILD |

### A.9 Copy defects noticed while crawling (fix in rewrite)

Typos/casing: "TECHNOLOGy WE SEEK", "Matual impact", "CONTACt us", "SUMBIT" (SPARK popup submit button), "sets up apart" (→ sets us apart), "that scouting, exploring and testing" (grammar), "specialises/specializes" inconsistency, "FI" in address (→ Fl./Floor). Intimidating copy per review: "Setting up innovation for mutual success"; "Network" card → "globally" phrasing.

---

## B. Fact register

Every number/claim found on the site. Status: ✅ verified externally · ⚠️ wrong/stale — correction proposed · ❓ internal claim, needs confirmation from Quantum (no external source exists).

| ID | Claim on live site | Where | Verified value | Source (checked 2026-07-12) | Status |
|---|---|---|---|---|---|
| F-01 | "five holding companies with 300+ subsidiaries worldwide" | Home | Also appears as "300+ industrial partners" (Home card) and "over 300 companies" (Startups) — **three different framings of the same number** | Internal | ❓ pick ONE framing + confirm count |
| F-02 | VDL: "over 100 subsidiaries, spread over 20 countries, about 17,000 employees" | Partners, Startups | **19 countries, 16,000+ employees, 100+ companies** — the live text (and the audit's 20/17,000 correction) are both stale | vdlgroep.com (official, Dutch): "ruim 16.000 medewerkers actief in 19 landen … meer dan 100 werkmaatschappijen" | ⚠️ update |
| F-03 | Hyundai: "active in 200 countries with 250,000 employees" | Partners, Startups | Only 195 countries exist. Group employees ≈ **292,575 (2021)**. Safe reframe: "the world's third-largest automaker, with brands (Hyundai, Kia, Genesis) sold in markets worldwide and ~290,000 employees" | Wikipedia/HMG corporate performance; OICA ranking | ⚠️ rewrite claim |
| F-04 | Talcar: "12% market share (2021)", "over 5 decades", Kia largest brand | Partners, Startups | 2021 figure is 5 years stale | Internal/importer data | ❓ refresh or drop the % |
| F-05 | Taavura-Livnat: "over 100 subsidiaries" | Partners, Startups | — | Internal | ❓ confirm |
| F-06 | Bazan: "largest refinery… in Israel", "up to 8 tons hydrogen per hour" | Partners, Startups | — | Internal/Bazan | ❓ confirm with Bazan page |
| F-07 | CHAMP testimonials (Globus ×2, Tashtit) | Partners | Named people + employers — need sign-off that quotes and titles are still accurate | Internal | ❓ reconfirm before reuse |
| F-08 | Stats band: "Partners' Assessment 500 · Portfolio Companies 0 · POCs done 0 · Commercial Discussions 0" | POC Playground / Home | Original rendering was broken. Confirmed replacement values: **110 POCs across all partners** and **29 group-wide implementations**. | Amir, 2026-07-15 | ✅ internally verified |
| F-09 | Event: "Quantum & Hyundai Playground event 10\|02\|2024" | Home | 2+ years stale | — | ⚠️ remove |
| F-10 | Footer: "Quantum 2024" | All pages | Current year | — | ⚠️ auto-year |
| F-11 | Address: "Arik Einstein 3, 8th FI, Herzliya Hills" | Contact | Typo "FI" → "8th Fl." | Internal | ⚠️ fix + confirm current |
| F-12 | "The program is equity-free, and we are not taking any fees" | Startups FAQ | Contractual claim | Internal | ❓ legal sign-off |

**Register updates (2026-07-14, per Amir):** F-04 moot — **Talcar/Kia is no longer a partner; removed site-wide (partner count is now four)**. F-07 testimonials confirmed. F-11 address confirmed (Arik Einstein 3, 8th Fl., Herzliya). F-12 equity-free claim confirmed. Team roster replaced with fresh 11-person list from The Team.pdf (photos extracted; Liron Ben Zaken has no LinkedIn URL yet).

**Register update (2026-07-15, per Amir):** F-08 resolved — 110 POCs across all partners and 29 group-wide implementations are confirmed for publication.

**Still open:** F-01 framing decision.

---

## C. Placeholder manifest

Naming: `ph-{page}-{slot}`. All placeholders are cool-toned neutral blocks (`--q-neutral-100`) at final aspect ratio, per design system (no drawn illustration).

| ID | Slot | Ratio (proposed) | Notes |
|---|---|---|---|
| ph-global-logo | Header/footer logo | — | Need transparent SVG from brand team (only 200×200 JPG exists) |
| ph-home-hero | Home hero visual | 16:9 wide | Industrial, cool-toned photo |
| ph-home-whoarewe | Who are we image | 4:3 | |
| ph-partner-logo-01…05 | Taavura, Talcar, VDL, Hyundai, Bazan logos | 3:2 contained | Grayscale treatment, hover to color |
| ph-sector-icon-01…04 | Automotive, Logistics, Industry 4.0, Energy | 1:1 | Lucide icons + sector accent dots (not images) |
| ph-case-video-poc | POC Playground video | 16:9 | **Muted auto-loop embed** per review — need file/URL from team |
| ph-case-01…05 | Corractions, Tactile Mobility, Maradin, Coreteel, Actasys | 16:9 | One hero visual per case study |
| ph-case-champ | CHAMP case visual | 16:9 | |
| ph-team-01…N | Team photos | 1:1 | Card = photo + name + role + LinkedIn slot. Fresh team list needed (current list outdated; 3 of 12 lack LinkedIn) |
| ph-news-01…04 | "What we're up to" cards | 3:2 | Can be fed by LinkedIn posts |
| ph-spark-steps | 5 program-overview step icons | 1:1 | Lucide |
| ph-academy-01 | Enrichment Academy visual | 4:3 | |

---

## Ready for Phase 1

The inventory above already implies the redirect map (old URLs → new sitemap) and the per-page briefs. Suggested next: draft the seven page content briefs, starting with Home and /spark/.

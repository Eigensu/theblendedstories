# THE BLENDED STORIES — Full Frontend Build Prompt
> Drop this entire document into your IDE/AI. It contains every section, colour, font, spacing, component, interaction, and asset instruction needed to build the complete website in one pass.

---

## DESIGN SYSTEM

### Colour Palette
| Token | Value | Usage |
|---|---|---|
| `--black` | `#000000` | Page background, footer background |
| `--white` | `#FFFFFF` | All text, borders, buttons |
| `--dark-navy` | `#050D18` | Conic gradient endpoint on glow blobs |
| `--gold` | `#AB853C` | Instagram social icon background |
| `--white-04` | `rgba(255,255,255,0.04)` | Ghost watermark text, button drop-shadow |
| `--white-08` | `rgba(255,255,255,0.08)` | Decorative fan rays, glow ellipses opacity |
| `--white-20` | `rgba(255,255,255,0.20)` | All horizontal/vertical divider lines |
| `--white-40` | `rgba(255,255,255,0.40)` | "Read More" arrow lines, button line separator |
| `--white-50` | `rgba(255,255,255,0.50)` | Search icon border |
| `--overlay-heavy` | `rgba(0,0,0,0.80)` | Image overlays on hero, explore, news backgrounds |
| `--overlay-medium` | `rgba(0,0,0,0.60)` | TBS Nights image overlay |

### Typography
| Role | Font Family | Weight | Size | Style | Tracking | Case |
|---|---|---|---|---|---|---|
| Hero title | Bodoni Moda | 400 | 72px | normal | 0.05em | UPPERCASE |
| Section title (large) | Bodoni Moda | 400 | 64px | normal | 0.05em | UPPERCASE |
| Section title (medium) | Bodoni Moda | 400 | 40px | italic | — | normal |
| Card heading | Bodoni Moda | 500 | 32px | italic | 0.05em | UPPERCASE |
| Press category label | Bodoni Moda | 400 | 20px | italic | — | normal |
| Hero subtitle | Bodoni Moda | 400 | 32px | italic | — | normal |
| Button text | Bodoni Moda | 500 | 16px | normal | 0.05em | UPPERCASE |
| Footer section head | Bodoni Moda | 400 | 20px | italic | — | normal |
| About card sub-head | Bodoni Moda | 500 | 24px | italic | 0.05em | UPPERCASE |
| Watermark ghost text | Bodoni Moda | 400 | 120px | normal | — | UPPERCASE |
| Script accent | Great Vibes | 400 | 64px | normal | — | sentence |
| Nav links | Montserrat | 400 | 14px | normal | 0.05em | UPPERCASE |
| Body copy | Montserrat | 400 | 14px | normal | — | sentence |
| Footer links | Montserrat | 400 | 16px | normal | — | sentence |
| Press headline | Montserrat | 400 | 24px | normal | — | UPPERCASE |
| Date / location meta | Montserrat | 500 | 16px | normal | — | sentence |
| Copyright / legal | Montserrat | 400 | 12px | normal | — | sentence |
| Menu / Search label | Martel Sans | 400 | 10px | normal | 0.4em | UPPERCASE |
| Read More link | Martel Sans | 400 | 20px | normal | — | UPPERCASE |
| Event title accent | Martel Sans | 400 | 40px | normal | — | UPPERCASE |

### Spacing Scale (base 44px grid)
- Page horizontal margin / left edge: **44px**
- Right edge margin: **41px**
- Content max-width: **1440px**, centred
- Inner content column: **1352px** (1440 − 44 − 44)
- Section vertical padding: **160px top/bottom** (hero excluded)
- Card grid gap: **44px**
- Component inner gap: **8–24px**

### Border Radius
- Portrait photo + border: **160px top-left/top-right, 0 bottom** (arch shape)
- News / Explore cards: **8px** all corners
- Speaker circle images: **50%** (full circle)
- CTA pill button (large): **30px**
- CTA pill button (small/join): **40px**
- CTA pill button (see-all): **25px**

---

## GLOBAL DECORATIVE ELEMENTS (appear on multiple sections)

### Glow Blobs
Scattered translucent conic-gradient ellipses (400×400px each), `filter: blur(100px)`, `opacity: 0.08`, `pointer-events: none`. Placed:
- Hero section: centred slightly right, top area
- "What is TBS" section: far left overflow (x: −70px), far right (x: 50% + 360px)
- Footer newsletter zone: centre-top
They use `background: conic-gradient(from 180deg at 50% 50%, #FFFFFF 0deg, #050D18 360deg)`.

### Fan Ray Decoration
A sunburst/fan of 13 white lines (`border: 2px solid #FFFFFF`) radiating from a single origin point, spanning a 180° arc from −90° to +90° (left half-circle). The group is 1200×600px, opacity 0.08, placed in the "What is TBS" section behind the text, rotated −180°. Lines are evenly spaced at 15° increments.

### Horizontal Dividers
`width: 1352px`, `border-top: 1px solid rgba(255,255,255,0.20)`, centred. Appear between every major section. Some sections have offset dividers (News cards have per-column bottom dividers; About cards have individual bottom dividers).

### Vertical Dividers
`height: 596px`, `border-left: 1px solid rgba(255,255,255,0.20)`, used in the Latest News section to separate the three columns visually.

---

## PAGE SECTIONS — TOP TO BOTTOM

---

### 1. STICKY NAVIGATION BAR
**Height:** 128px  
**Background:** `linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)` — fades to transparent so hero image bleeds through below  
**Position:** Fixed, full-width, z-index 100  
**Bottom edge:** 1px solid `rgba(255,255,255,0.20)` divider line

**Left zone (x: 44px):**
- Hamburger menu icon: two horizontal white lines (26×1.5px each, gap 13px)
- Label "MENU" underneath in Martel Sans 10px, letter-spacing 0.4em, uppercase, white

**Centre (exact horizontal centre):**
- Logo "TBS" in Bodoni Moda 400 ~40px, white, widely spaced. This is a custom logotype — render each letter with generous tracking (~0.15em). Vertically centred at ~40px from top.

**Left nav links (between menu and logo):**
- "LIFESTYLE & TRAVEL" at x:221px — two lines, 14px Montserrat uppercase, top-aligned at y:42px
- "FASHION" at x:371px, single line, y:53px
- "BEAUTY & WELLNESS" at x:513px, two lines, y:42px

**Right nav links (between logo and search):**
- "CULTURE" at x:853px, y:53px
- "EVENTS" at x:999px, y:53px
- "COMMUNITY" at x:1133px, y:53px

**Right zone (right: 41px):**
- Search icon: small circle with diagonal tail (magnifying glass), white, 50% opacity border
- Label "SEARCH" underneath in Martel Sans 10px, letter-spacing 0.4em, uppercase

---

### 2. HERO SECTION
**Height:** 720px  
**Background:** Full-bleed editorial/artistic photography (fashion or cultural art) with `linear-gradient(0deg, rgba(0,0,0,0.80), rgba(0,0,0,0.80))` overlay blended on top. Image should feel dark, cinematic, textured — think classical painting or fashion editorial.

**All content centred horizontally and vertically:**

1. **Sunburst icon** — 80px SVG: 16 thin white lines radiating outward from centre at 22.5° increments, like a compass rose / art deco sun. Lines are ~1px, full white, varying lengths (alternating long/short). Sits ~80px above title.

2. **"THE BLENDED STORIES"** — Bodoni Moda 72px, uppercase, letter-spacing 0.05em, white, centred. Line height 120%.

3. **"Explore the stories that define your city."** — Bodoni Moda 32px italic, white, centred. 16px gap below title.

4. **"SUBSCRIBE NOW" CTA button** — 223×60px pill, `border: 1px solid white`, `border-radius: 30px`, Bodoni Moda 16px 500 weight, letter-spacing 0.05em, uppercase. Background: transparent. Hover: `rgba(255,255,255,0.08)` fill. `drop-shadow(0px 16px 16px rgba(255,255,255,0.04))`. 48px gap below subtitle.

**Entrance animations:** Staggered fade-up — sunburst 0.1s delay, title 0.3s, subtitle 0.5s, button 0.7s. Each element fades in from 30px below, `ease-out`, 0.8s duration.

---

### 3. "WHAT IS THE BLENDED STORIES?" SECTION
**Background:** Pure black  
**Height:** ~700px  
**Padding:** 200px top, 200px bottom

**Left text block (x: 44px):**
- **"What is"** — Great Vibes 64px, white, line-height 120%. This is a flowing cursive script, sits on its own line above the bold heading.
- **"THE BLENDED STORIES ?"** — Bodoni Moda 64px uppercase, letter-spacing 0.05em, white. Immediately below the script (no gap).
- **Body paragraph** (40px below heading): Montserrat 14px, line-height 160%, white, max-width 614px. Text: *"Change is on the horizon and everyone needs to adapt to this fast-paced world. With over 15 years in consultancy, I have helped businesses of all kinds thrive amid change, through strategic innovation and bold vision. Work with me and get future-ready!"*

**Right image block (right-aligned, ~x: 960px from left):**
- Portrait photo: 320×440px, `border-radius: 160px 160px 0 0` (arch/tombstone shape). Use a warm, architectural or portrait image.
- White outline border frame: 336×456px (8px larger each side), `border: 0.5px solid white`, same arch border-radius, positioned behind the image offset by −8px top/left.

**Background decorations (all opacity 0.08):**
- Fan ray group: 13 lines radiating from a point at ~x:720px, y:bottom-of-section, spanning 180° upward. White, 2px, rotated −180°. Covers left 2/3 of section.
- Two glow blobs: one far left (overflowing left edge), one far right.

---

### 4. ABOUT US SECTION
**Background:** Pure black  
**Padding:** 160px top/bottom, 44px sides

**Ghost watermark:** "About Us" in Bodoni Moda 120px, uppercase, `color: rgba(255,255,255,0.04)`, absolutely positioned centred slightly left, behind all content. Acts as texture.

**Section title:** "About Us" — Bodoni Moda 64px, uppercase, letter-spacing 0.05em, white. Left-aligned at x:44px. 80px margin-bottom.

**Three-column card grid** (each ~388px wide, no column gap, content padded right 60px):

Each card contains in order:
1. **TBS logo mark** — two horizontal white lines (40×2px each, 10px gap), `mix-blend-mode: color-dodge`. Each card's logo sits at slightly different vertical positions (staggered by ~38px per column — col1 y:1862, col2 y:1900, col3 y:1938 — creating a diagonal step-down effect).
2. **Card sub-heading** — Bodoni Moda 24px italic, 500 weight, letter-spacing 0.05em, uppercase, white. Col1: "Who We Are", Col2: "Our Approach", Col3: "Why do YOU need US?"
3. **Body text** — Montserrat 14px, line-height 160%, white, 348px wide.
4. **Bottom divider** — 320px wide, 1px, `rgba(255,255,255,0.20)`, 40px margin-top.

---

### 5. LATEST NEWS SECTION
**Background:** Pure black  
**Padding:** 44px sides

**Full-width divider** at section top.

**Section title:** "Latest News" — Bodoni Moda 64px uppercase, centred, 80px top/60px bottom padding.

**Below title:** Full-width 1352px divider.

**Three-column news grid** (each column 424px wide, 44px gap):

Each news card:
1. **Card image** — 424×240px, `border-radius: 8px`. Use editorial lifestyle/fashion/culture photography.
2. **Category heading** — Bodoni Moda 32px italic, 500 weight, letter-spacing 0.05em, uppercase, white. Below image with 24px gap.
3. **Body text** — Montserrat 14px, line-height 160%, white, 380px wide, 16px gap below heading.
4. **"Read More" link** — Martel Sans 20px uppercase, white, with a 48×2px white line (40% opacity) immediately to the right. 28px gap below body.

**Between columns** (inside the grid): Two vertical dividers — `height: 596px`, `border-left: 1px solid rgba(255,255,255,0.20)`.

**Below grid:** Full-width 1352px divider, 60px margin-top.

**"SEE ALL NEWS" button** — centred, `width: 228px, height: 44px`, pill shape `border-radius: 25px`, `border: 1px solid white`, Bodoni Moda 16px 500 weight uppercase. Has a 16×1px white line (40% opacity) inside the button to the right of the text as a visual separator.

---

### 6. EXPLORE / TRENDING SECTION
**Height:** 985px  
**Background:** Editorial photography (urban/cultural/street scene) with `rgba(0,0,0,0.80)` overlay. Image should be dramatic and textural.

**Left edge — rotated typography stack:**
- **"Explore"** — Bodoni Moda 64px uppercase, letter-spacing 0.05em, white. Rotated −90° (reading bottom-to-top). Positioned at x:~100px from left, vertically centred.
- **"Latest Trending Topics"** — Bodoni Moda 40px italic, white. Also rotated, using CSS `writing-mode: vertical-rl` + `transform: rotate(180deg)`. Positioned at x:~200px, vertically centred.

**Right zone — three portrait cards (x: right-aligned, gap 36px):**
Each card is 340×440px, `border-radius: 8px`, photographic background (fashion/lifestyle/culture).
- Cards 1 and 3 are offset 25px upward vs card 2, creating an alternating high-low rhythm.
- Each card has a gradient overlay: `linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.80) 100%)`.
- Bottom-left of each card: category label in Bodoni Moda 14px italic, uppercase, 60% white opacity. Below label: 320px wide, 1px divider line in `rgba(255,255,255,0.20)`.

**Between explore labels and cards:** Three horizontal dividers at slightly offset vertical positions (staggered by ~50px) creating a cascading line effect.

---

### 7. PRESS / IN THE NEWS SECTION
**Background:** Pure black  
**Padding:** 100px top/bottom, 44px sides

**Three-column grid**, top-bordered by 1px divider line, 60px padding-top:

Each press item:
1. **Category + date** — Bodoni Moda 20px italic, white. Format: "Press — Jan 03, 2030"
2. **Headline** — Montserrat 24px uppercase, white, line-height 160%, max-width 320px.
3. **Bottom divider** — 340px wide, 1px, `rgba(255,255,255,0.20)`, 40px margin-top.

Note: Column 2's category label is offset ~50px lower than columns 1 and 3, creating a staggered visual rhythm.

---

### 8. TBS NIGHTS SECTION
**Height:** 720px  
**Background:** Event/nightlife photography with TWO overlays:
- `linear-gradient(0deg, rgba(0,0,0,0.60), rgba(0,0,0,0.60))`
- `linear-gradient(90deg, rgba(5,13,24,0) 50%, rgba(5,13,24,0.40) 100%)` — right edge darkens more

**All content right-aligned, positioned at ~x:740px from left, vertically centred:**
1. **"TBS Nights"** — Bodoni Moda 64px uppercase, letter-spacing 0.05em, white. Line-height 120%.
2. **Date** — Montserrat 16px 500 weight, white. "Jan 03, 2030". 24px below heading.
3. **Location** — Montserrat 16px 500 weight, white. "Andheri (W), Mumbai, 400001". 8px below date.
4. **Event subtitle** — Martel Sans 40px uppercase, white. "Lorem ipsum dolor sit". 32px below location.
5. **Body text** — Montserrat 14px, line-height 160%, white, max-width 540px, right-aligned. 32px below event title.
6. **"JOIN NOW" CTA button** — `width: 163px, height: 60px`, `border-radius: 40px`, `border: 1px solid white`, Bodoni Moda 16px 500, uppercase. 40px below body. Hover: `rgba(255,255,255,0.08)`.

---

### 9. TBS TALKS SECTION
**Background:** Full-bleed photography (conference/event scene) with `rgba(0,0,0,0.80)` overlay AND `linear-gradient(180deg, #000000 0%, rgba(0,0,0,0) 100%)` fade from top to ensure readability.  
**Min-height:** 1115px  
**Padding:** 120px top/bottom, 44px sides

**Section title:** "TBS Talks" — Bodoni Moda 64px uppercase, centred, white. 80px margin-bottom.

**Four-column speaker grid** (each column 308px, gap 44px, centred):

Each talk card:
1. **Circle image** — 308×308px, `border-radius: 50%`. Speaker portrait or event photography.
2. **Divider** — 308px wide, 1px, `rgba(255,255,255,0.20)`. 24px margin below image.
3. **Event name** — Bodoni Moda 32px uppercase, letter-spacing 0.05em, white. 20px margin below divider.
4. **Body text** — Montserrat 14px, line-height 160%, white, 308px wide.

**"VIEW ALL" button** — centred below grid, 60px margin-top. `width: 193px, height: 44px`, `border-radius: 25px`, `border: 1px solid white`, Bodoni Moda 16px 500. Has 16px line separator same as "See All News".

---

### 10. FOOTER
**Background:** Pure black  
**Total height:** ~921px

**Top area — large ghost logo:**  
"TBS" in Bodoni Moda ~120px, white at `opacity: 0.06`, `mix-blend-mode: hard-light`, absolutely positioned centred, behind all footer content. Creates subtle texture/watermark.

**Divider at y:~316px from footer top** — 1352px, 1px, `rgba(255,255,255,0.20)`.

**Four-column layout** (padding: 0 44px), below first divider:

**Column 1 — Quick Links (x: 44px):**
- Header: "Quick Links" — Bodoni Moda 20px italic, white
- Links: Lifestyle & Travel, Fashion, Beauty & Wellness, Culture, Events, Community — all Montserrat 16px, white, 6px gap between items

**Column 2 — Locations (x: 508px):**
- Header: "Locations" — Bodoni Moda 20px italic, white
- Links: Mumbai, Dubai, Indore, Lucknow, Hyderabad, Ahmedabad — Montserrat 16px, white

**Column 3 — empty** (spacer column)

**Column 4 — Follow Us (x: 1089px):**
- Header: "Follow Us" — Bodoni Moda 20px italic, white
- Three social icon circles, 48×48px each, in a horizontal row, 16px gap:
  - Facebook: white circle, black FB icon inside
  - Twitter/X: white circle, black X/bird icon inside
  - Instagram: **gold** (`#AB853C`) circle, black camera icon inside

**Second divider** at ~y:820px from footer top — 1352px, 1px, `rgba(255,255,255,0.20)`.

**Footer bottom bar** (below second divider, full width, flex space-between):
- Left: "©2024. All Rights Reserved." — Montserrat 12px, white
- Right: "Privacy Policy" and "Terms of Use" — Montserrat 12px, white, 80px gap between them

---

## INTERACTIONS & MICRO-ANIMATIONS

### Page Load
- Nav fades in from top (translateY −20px → 0), opacity 0→1, 0.5s ease
- Hero content staggered fade-up (each child: translateY 30px→0, opacity 0→1, 0.8s ease-out, delays: 0.1 / 0.3 / 0.5 / 0.7s)

### Scroll-triggered Reveals
- Each section's heading: fade up + slide from 40px below as it enters viewport
- Cards/columns: stagger-reveal left to right, 100ms delay between each column
- Divider lines: width animates from 0 → full width on scroll entry

### Hover States
- **All nav links:** opacity drops to 0.65, smooth 200ms transition
- **CTA pill buttons:** background fills to `rgba(255,255,255,0.08)`, subtle scale(1.02), 250ms ease
- **News cards:** image very subtly scales up (1.0 → 1.03 on the img), 300ms ease
- **Explore cards:** overlay darkens slightly, card lifts with `box-shadow: 0 20px 40px rgba(0,0,0,0.5)`
- **Footer links:** opacity 0.65, 200ms
- **Social circles:** scale(1.1), 200ms ease
- **"Read More" links:** the line extends from 48px → 64px width, 200ms ease

### Cursor
Custom cursor (optional): 12px white circle that follows mouse. On hover over links/buttons, expands to 40px with white outline and white fill at 10% opacity.

---

## RESPONSIVE BEHAVIOUR NOTES
(Build desktop-first at 1440px, then handle breakpoints)
- **1280px:** Slightly tighten column gaps, reduce hero title to 60px
- **1024px:** Two-column layout for news + about cards, hero title 48px, font reductions across headings
- **768px (tablet):** Single column for all grids, nav collapses to logo + hamburger only, hero title 36px
- **Mobile:** Full hamburger menu overlay, hero text recentred and reduced, sections stack fully, portrait image moves above text in "What is TBS"

---

## ASSETS NEEDED
- Hero: 1 dark editorial/fashion/cultural photograph (1440×720px minimum)
- What is TBS: 1 architectural or warm portrait photograph (portrait crop, 320×440px minimum)
- News section: 3 editorial photographs (424×240px minimum, landscape)
- Explore section: 1 large dark background photograph (1440×985px) + 3 portrait cards (340×440px minimum)
- TBS Nights: 1 evening event/venue photograph (1440×720px)
- TBS Talks background: 1 conference/event photograph (1440×1115px)
- TBS Talks speakers: 4 circular portraits (308×308px minimum)
- Google Fonts: Bodoni Moda (opsz 6–96, weights 400+500, normal+italic), Montserrat (400, 500), Great Vibes (400), Martel Sans (400)

---

## COMMON PITFALLS TO AVOID
- The sunburst in the hero is NOT a circle — it is radiating lines only, no circle outline
- The portrait in "What is TBS" has a 0.5px white border FRAME sitting 8px offset behind it — it's a separate element, not a CSS border on the image
- The "About Us" ghost text sits BEHIND the section title, both on screen at the same time
- The fan rays in "What is TBS" rotate −180° as a group (so they fan upward)
- The two-line logo mark above each About card uses `mix-blend-mode: color-dodge`
- Dividers in the news section are VERTICAL (between columns), not horizontal
- The explore section's left labels are ROTATED TEXT — "Explore" is rotate(−90deg), "Latest Trending Topics" uses writing-mode: vertical-rl
- Footer social icons are CIRCLES (48px diameter), not squares
- Only the Instagram circle uses gold (`#AB853C`) — the others are white
- The TBS Nights section content is RIGHT-ALIGNED, not left

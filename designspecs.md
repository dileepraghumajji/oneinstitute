# ONE Institute of Martial Arts — Design System

A combat-sports training institute specializing in **Boxing**, **Muaythai**, **Kickboxing (K1 and Low Kick)**. Professional coaching team with competitive experience.

- Instagram: https://www.instagram.com/oneinstituteofmartialarts/
- Maps: https://maps.app.goo.gl/NueVZvaGrQJLBgBB8
- Phone: 7411074751
- Design inspiration: https://fit-and-you.webflow.io/
- Primary brand color: `#FF5300`

## Sources used to build this system
- Instagram bio + posts (tone of voice, copy reference)
- Fit-and-you (Webflow inspiration site) — referenced for layout vocabulary: oversized all-caps display type, dark stage with single high-saturation accent, bracketed numerals, big media, ticker rails, motion-led hero blocks
- User-supplied primary color `#FF5300`
- User request: 3D boxing ring on hero in brand palette

> No codebase or Figma was attached. Visual foundations are built from the brand's social presence + the stated design inspiration. Real photography, logo files, and final iconography from the institute are placeholders pending user-supplied assets — see CAVEATS at the bottom.

---

## CONTENT FUNDAMENTALS

**Voice.** Direct, confident, coach-like. Speaks to the student, not at them. No fluff, no apology. Short imperative sentences carry the weight: *"Train. Spar. Win."*

**Person.** Mostly **second person** ("you train with us", "your first round") and occasional collective **we** for the institute ("we coach champions"). Avoid first-person singular.

**Casing.**
- Display headlines and section labels: **ALL CAPS**, often tracked tight.
- Body: sentence case.
- Numbered rails / overlines: bracketed monospace numerals like `[01]`, `[02]`, `[+]`.

**Tone words.** Disciplined. Raw. Unfiltered. Earned. Fighter-first. Not slick, not corporate, not hyped-up "fitness influencer".

**Examples (in-voice):**
- "MUAYTHAI. KICKBOXING. EARNED, NOT BOUGHT."
- "Step in. Wraps on. Round one starts here."
- "Coaches who've fought. Students who show up."
- "Walk-ins welcome. Excuses aren't."
- "Boxing 4× / week. Muaythai 3× / week. No filler."

**Examples (off-voice — avoid):**
- "Welcome to our amazing fitness journey ✨"
- "Unlock your best self today!"
- "We're so excited to have you!"

**Emoji.** Used **sparingly** in social copy only (🥇 🔥 📍 — the medals/fire/pin family) — *never* in the product UI, decks, or marketing site. UI uses real iconography instead.

**Numbers.** Stats are presented bare and oversized (e.g. `12` rounds, `729` followers, `467` posts, `5AM` first class). No "+", no currency clutter unless pricing.

---

## VISUAL FOUNDATIONS

### Color
Single high-saturation accent on a near-black stage. Whites are warm-neutral (not pure). The orange does the heavy lifting — used on one or two elements per screen, never as a wash.

- `--ink`        `#0A0A0A`  primary background, fight-night black
- `--ink-2`      `#161616`  cards / elevated surfaces
- `--ink-3`      `#222222`  dividers, hairlines on dark
- `--bone`       `#F4EFE7`  warm off-white, primary fg on dark
- `--bone-2`     `#C9C2B4`  muted text on dark
- `--blood`      `#FF5300`  primary accent (brand)
- `--blood-deep` `#C73D00`  pressed / hover-darker
- `--blood-glow` `#FF8A4D`  highlight, glow stops
- `--canvas`     `#EDE6D8`  light-mode page bg (boxing-canvas tone)

Imagery is **warm, high-contrast, slightly grainy** — fighters mid-round, hand-wraps, gloves, sweat. No cool/blue tints. Black-and-white photography is welcome with a single orange element punched through (gloves, ring rope, blood-spatter accent).

### Type
- **Display:** `Anton` — condensed, heavy, all-caps, tracked tight. Used at 80–240px for hero callouts.
- **Sub-display / titles:** `Archivo Black` — geometric, blocky, used 32–64px.
- **Body:** `Inter` (kept neutral so display does the talking) — 15–18px, 1.55 line-height.
- **Mono / numerals:** `JetBrains Mono` — bracketed list numerals `[01]`, timestamps, round counters.

> Anton, Archivo Black, Inter, JetBrains Mono are loaded from Google Fonts — flagged as **substitutions** since no original font files were supplied. Replace with licensed brand fonts when available.

### Spacing & rhythm
- Base unit `8px`. Scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`.
- Layout uses **generous vertical rhythm** — sections breathe with 96–128px between blocks.
- Display headlines pull tight: `letter-spacing: -0.02em`, `line-height: 0.88`.

### Backgrounds
- Default stage: solid `--ink`.
- Section variety: occasional `--canvas` (light) section to break rhythm; never gradients-as-decoration.
- Full-bleed photography is core — no rounded corners on hero media; edge-to-edge.
- Subtle film grain overlay on photography (`mix-blend-mode: overlay`, ~6% opacity).

### Animation
- Easing: `cubic-bezier(0.65, 0, 0.35, 1)` (firm, no bounce).
- Durations: `180ms` micro, `420ms` reveal, `900ms` hero entrance.
- **Marquee tickers** (always-on horizontal scroll of brand words: `MUAYTHAI · BOXING · K1 · LOW KICK ·`).
- Reveal: text masked-up from below on scroll. No fades-only.
- No bounces, no springs, no parallax tilt.

### Hover / press
- Buttons: hover swaps fill `--blood` → `--blood-deep`, text stays `--bone`. No scale.
- Press: `transform: translateY(1px)`, no shrink.
- Links: underline draws in left-to-right (`200ms`) instead of fading.
- Image cards: tiny zoom `scale(1.03)` on inner `<img>` only, container clipped.

### Borders, radii, shadows
- Corner radius: **mostly square**. `0` on hero/media. `4px` on inputs, `8px` on small chips, `999px` on pills.
- Borders are `1px solid --ink-3` (on dark) or `1px solid #00000018` (on light).
- Shadows are minimal. One elevation only: `0 12px 40px rgba(0,0,0,0.45)` on lifted cards. No glassmorphism stacks.
- **Inner glow accent:** orange CTAs may carry `box-shadow: inset 0 0 0 1px var(--blood-glow)` when active.

### Layout rules
- 12-col grid, 1440 design width, 96px outer gutter.
- Hero: full-bleed, with one fixed corner element (round counter `[R 01]` top-left, location pin bottom-right).
- Sticky top nav, ~72px tall, blends to transparent over hero, becomes solid `--ink` on scroll.

### Transparency / blur
- Used **only** on the sticky nav-on-scroll: `backdrop-filter: blur(14px)` over `rgba(10,10,10,0.72)`.
- Never used decoratively elsewhere.

### Cards
- Square corners or `8px` max. `--ink-2` fill, `1px solid --ink-3` border, no shadow by default. On hover, border becomes `--blood`.

### Iconography
See ICONOGRAPHY section below.

---

## ICONOGRAPHY

The brand has **no proprietary icon set**. We standardize on **Lucide** (open-source, `1.75px` stroke, square caps) loaded from CDN — closest match to the rugged, no-nonsense, line-based sensibility of the inspiration vocabulary. **Flagged as a substitution.**

- Stroke weight: `1.75px` consistent.
- Color: inherits `currentColor`; defaults to `--bone` on dark, `--ink` on light. Active = `--blood`.
- Size scale: `16 / 20 / 24 / 32`.
- **No emoji in product UI.** Emoji belongs to social copy only.
- **No unicode symbols** as icons — always SVG.
- Bracketed mono numerals (`[01]`, `[+]`) are treated as a typographic convention, **not** icons.
- Brand glyph: a stylized `1` inside a square — placeholder logomark in `assets/logo.svg`. Replace with the institute's real logo when supplied.

---

## INDEX

Top-level files:
- `README.md` — this document
- `colors_and_type.css` — CSS variables for colors, type, spacing, easing
- `SKILL.md` — agent skill manifest
- `assets/` — logos, brand glyphs
- `fonts/` — (empty; using Google Fonts CDN — see substitution note)
- `preview/` — Design System tab cards (registered assets)
- `ui_kits/website/` — marketing site UI kit including the 3D boxing-ring hero

---

## CAVEATS — please help iterate

- **No logo file was supplied.** I made a placeholder wordmark + monogram. Drop the real logo into `assets/` and I'll re-style around it.
- **No photography was supplied.** Hero / class imagery uses placeholder blocks. Send 4–6 high-res training photos (boxing pads, Muaythai clinch, sparring, group shot) and I'll wire them in.
- **Fonts are Google Fonts substitutions** (Anton / Archivo Black / Inter / JetBrains Mono). Send licensed brand fonts if different.
- **Icons are Lucide** (substitution). Confirm or send a brand icon set.
- **Address / coach names / class schedule** are placeholders. Share the real copy and I'll plug it in.

**Help me make this perfect — reply with the missing assets above (or tell me to proceed with placeholders for now), and I'll iterate.**

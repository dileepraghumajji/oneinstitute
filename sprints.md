# ONE Institute — Sprint Backlog

**Stack:** Next.js 14 App Router · Three.js · GSAP · Lenis · CSS Modules  
**Goal:** Awwwards-caliber martial arts website — cinematic, performant, original  
**Design system ref:** `designspecs.md`

---

## STATUS KEY
- `[ ]` Not started
- `[x]` Done
- `[~]` In progress
- `[!]` Blocked — needs asset or decision

---

## WHAT IS ALREADY DONE

- [x] `components/Hero.js` — full-bleed cinematic layout, 3D ring as background, GSAP entrance (ring crashes + text stagger)
- [x] `components/BoxingRing3D.js` — Three.js ring, transparent renderer, OrbitControls, UnrealBloom, logo mat, LED platform glow, auto-rotate
- [x] `components/Nav.js` — transparent-over-hero, solid-on-scroll, mobile hamburger, GSAP entrance keyed to `isLoaded`
- [x] `components/Ticker.js` — infinite marquee, disciplines list, scroll fade-in
- [x] `components/Programs.js` — 4 discipline cards, GSAP scroll stagger
- [x] `components/Stats.js` — 4 stat items, scroll stagger
- [x] `components/Philosophy.js` — two-column layout, 3 pillars, coach photo placeholder
- [x] `components/CTA.js` — contact section with phone CTA, scroll reveal
- [x] `components/Footer.js` — 4-column layout, social links, nav links
- [x] `components/LoadingScreen.js` — progress bar, GSAP slide-out, triggers `setLoaded`
- [x] `components/SmoothScroll.js` — Lenis via `ReactLenis`, ScrollTrigger registered
- [x] `context/LoadingContext.js` — `isLoaded` / `setLoaded` shared state
- [x] `app/globals.css` — CSS custom properties, marquee keyframe, reset
- [x] `designspecs.md` — full design system spec

---

## SPRINT 1 — Foundation Fixes *(do these first, they block everything else)*

### 1.1 Font loading
- [ ] In `app/layout.js`: import `Anton`, `Archivo_Black`, `Inter`, `JetBrains_Mono` from `next/font/google`
- [ ] Pass each font's `.variable` CSS variable into the `<html>` element's `className`
- [ ] In `app/globals.css`: set `--font-display: var(--font-anton)`, `--font-sub-display: var(--font-archivo-black)`, `--font-body: var(--font-inter)`, `--font-mono: var(--font-jetbrains-mono)`
- [ ] Verify `components/Hero.module.css` `.headline` uses `var(--font-display)` (currently hardcoded `sans-serif`)
- [ ] Check `Nav.module.css`, `Programs.module.css`, `Stats.module.css` all reference `var(--font-*)` variables (not system-ui fallbacks)

### 1.2 ScrollTrigger + Lenis wiring
- [ ] In `components/SmoothScroll.js`: confirm `gsap.registerPlugin(ScrollTrigger)` is called before `ScrollTrigger.normalizeScroll(true)` — add `normalizeScroll` call if missing
- [ ] Add `ScrollTrigger.scrollerProxy` or use the official Lenis GSAP plugin: `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add(time => lenis.raf(time * 1000))`
- [ ] Disable GSAP's default ticker by setting `gsap.ticker.lagSmoothing(0)` when Lenis is active
- [ ] Test: scroll animations in `Programs.js`, `Stats.js`, `Philosophy.js` must fire correctly after Lenis is active

### 1.3 Broken navigation links
- [ ] Nav currently links to `#schedule` — this section does not exist in `app/page.js`. Temporarily reroute `href` to `#programs` until Sprint 2 adds the Schedule section
- [ ] Confirm `id="coaches"` in `Philosophy.js` matches the `#coaches` nav link — it does, but verify scroll offset is correct with Lenis active

### 1.4 Nav backdrop blur
- [ ] In `Nav.module.css`: `.navScrolled` currently only changes opacity/background. Add `backdrop-filter: blur(14px)` and `-webkit-backdrop-filter: blur(14px)` per the design spec
- [ ] Background should be `rgba(10,10,10,0.72)` when scrolled, not solid `--ink`

### 1.5 Stats — animated counter
- [ ] In `components/Stats.js`: for numeric-only values (`12`, `5` if any), use GSAP `to()` on a state variable to count from 0 to the target number on scroll entry
- [ ] Non-numeric values (`5AM`, `4×`, `3×`) remain static strings — no animation needed
- [ ] Use `ScrollTrigger` `onEnter` callback (not `from`) so counter only runs once

---

## SPRINT 2 — Missing Sections

### 2.1 Schedule section
- [ ] Create `components/Schedule.js` with `id="schedule"`
- [ ] Create `components/Schedule.module.css`
- [ ] Layout: overline `[+] Training Schedule`, h2 `WEEK. ROUND. REPEAT.`
- [ ] Display a weekly timetable grid: rows = days (Mon–Sat), columns = time slots
- [ ] Data: `const schedule = [{ day: 'Monday', classes: [{ time: '6:00 AM', discipline: 'Boxing', level: 'All Levels' }, ...] }, ...]`
- [ ] Today's day column highlighted with `--blood` accent border (use `new Date().getDay()`)
- [ ] GSAP: table rows slide up on scroll entry with stagger 0.06s
- [ ] Add to `app/page.js` between `<Programs />` and `<Stats />`
- [ ] Update nav link `href="#schedule"` (remove the Sprint 1.3 temp fix)

### 2.2 Coaches section
- [ ] Create `components/Coaches.js` with `id="coaches-section"` (keep `id="coaches"` on Philosophy for the nav link or redirect Philosophy to this new section)
- [ ] Create `components/Coaches.module.css`
- [ ] Layout: full-width section, overline `[+] The Corner`, h2 `COACHES WHO'VE FOUGHT.`
- [ ] Coach card structure: large photo area (placeholder box with scan-line texture), name in display type, discipline tags, fight record line (placeholder copy)
- [ ] Placeholder copy for 3 coaches: use bracket-style tags `[Boxing]`, `[Muaythai]`, etc.
- [ ] On card hover: photo area gets a dim orange overlay (`rgba(255,83,0,0.15)`) via `::after` pseudo-element — CSS only, no JS
- [ ] GSAP: cards slide in from bottom with stagger 0.2s on scroll
- [ ] Update nav `#coaches` link to point to `#coaches-section` or merge with Philosophy

### 2.3 Contact form
- [ ] In `components/CTA.js`: replace the single `<a href="tel:...">` with a proper form
- [ ] Form fields: Name (text), Phone (tel), Discipline interest (select: Boxing / Muaythai / Kickboxing K1 / Low Kick), Message (textarea, optional)
- [ ] Submit button: style matches `.btnPrimary` from Hero — orange fill, bone text, no border-radius
- [ ] On submit: `preventDefault`, show inline success message `"ROUND ONE CONFIRMED. We'll call you."` in orange type — no external service needed in this sprint (static confirmation)
- [ ] Validation: required fields show a thin `--blood` bottom border when empty on blur
- [ ] In `CTA.module.css`: add `.form`, `.field`, `.input`, `.select`, `.textarea`, `.submitBtn`, `.success` classes

---

## SPRINT 3 — Motion & Scroll Experience

### 3.1 Hero ring entrance refinement
- [ ] In `Hero.js` GSAP timeline: after ring crashes (`bounce.out`), add a subtle camera-shake effect — translate the `ringRef` by `±4px` on X three times in 300ms using `gsap.to()` with `repeat: 3, yoyo: true, duration: 0.05`
- [ ] Add a brief flash: after ring lands, quickly animate `orangeEmissive.emissiveIntensity` from `5` down to normal `2.5` over 600ms — needs to be triggered from JS via a custom event or passed ref

### 3.2 Programs — horizontal scroll panel
- [ ] In `Programs.js`: wrap `.grid` in a pinned horizontal scroll using `ScrollTrigger.create({ pin: true, scrub: 1 })`
- [ ] The 4 program cards should translate horizontally as the user scrolls vertically past the pinned section
- [ ] Cards move from right to left: initial `x: 100vw`, end `x: 0` for each card staggered by card index × 30%
- [ ] Pin the section title on the left while cards scroll in from the right
- [ ] Update `Programs.module.css` grid to `display: flex; flex-wrap: nowrap; width: max-content` for horizontal layout
- [ ] On mobile (`max-width: 768px`): disable horizontal scroll, fall back to vertical stacked cards

### 3.3 Philosophy — text scrub animation
- [ ] In `Philosophy.js`: add a `ScrollTrigger` with `scrub: 1` that slowly moves `.left` column upward (`y: -40px`) and `.right` column downward (`y: 40px`) as the section scrolls through viewport
- [ ] The headline letters in `COACHES WHO'VE FOUGHT.` — split into words and stagger-reveal each word from a clip mask as section enters viewport (pure CSS: `.word { overflow: hidden }` wrapper, GSAP animates inner `span` from `y: 100%` to `y: 0`)

### 3.4 Ticker — bidirectional / pause on hover
- [ ] In `Ticker.js`: add a second track below the first that scrolls in reverse direction (use `animation-direction: reverse` on `.trackReverse`)
- [ ] On hover over the ticker container: pause the marquee animation (`animation-play-state: paused`)
- [ ] Between each word in the ticker: alternate `·` and a small SVG glove/fist icon (Lucide `Swords` or custom inline SVG) to break the repetition

### 3.5 Stats — count-up animation (detail)
- [ ] For the `12` (round limit) stat: count from `1` to `12` over `1.2s` using GSAP `to({ innerText: 12 }, { snap: { innerText: 1 }, duration: 1.2, ease: 'power2.out' })`
- [ ] At the end of the count, add a ring-bell flash: `.value` element briefly turns `--blood` then fades back to `--bone` over 400ms

---

## SPRINT 4 — Signature Micro-Interactions

### 4.1 Custom cursor
- [ ] Create `components/Cursor.js` — a `'use client'` component with `useEffect`
- [ ] Render two absolutely-positioned divs in a portal or at root: `.cursorDot` (6px circle, `--blood`) and `.cursorRing` (40px circle, border only, `--blood` 1px)
- [ ] `.cursorDot` follows mouse exactly (no lag) via `mousemove` listener updating `transform: translate(x, y)`
- [ ] `.cursorRing` follows with lerp lag: use `requestAnimationFrame` loop, lerp ring position toward dot position at factor `0.12`
- [ ] On hover over any `<a>` or `<button>`: `.cursorRing` scales to `64px`, fills semi-transparent `rgba(255,83,0,0.1)`, displays text `"GO"` or `"VIEW"` inside (3 chars max, 9px mono)
- [ ] On hover over `.ringCol` (3D canvas): cursor becomes crosshair (hide `.cursorRing`, show `.cursorDot` as `+` crosshair via CSS)
- [ ] Add `cursor: none` to `body` in `globals.css`
- [ ] Create `Cursor.module.css` with `.cursor`, `.cursorDot`, `.cursorRing`, `.cursorExpanded`
- [ ] Mount `<Cursor />` in `ClientLayout.js`

### 4.2 Film grain overlay
- [ ] Create `components/Grain.js` — `'use client'` component
- [ ] Inside `useEffect`: create a `<canvas>` element, size it to `200×200`, draw random noise pixels at `rgba(255,255,255,0.08)` density
- [ ] Position `<canvas>` as `position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 9998; pointer-events: none`
- [ ] Apply `mix-blend-mode: overlay` to the canvas element
- [ ] Use `setInterval` at 80ms to redraw noise (creates film-flutter effect)
- [ ] Mount `<Grain />` in `ClientLayout.js` alongside `<Cursor />`
- [ ] Performance guard: skip rendering on mobile/touch devices (`'ontouchstart' in window`)

### 4.3 Link hover underline animation
- [ ] In `globals.css`: add a global `.link-hover` class — on hover, a `--blood` colored underline draws in from left to right using `background-size` transition from `0% 1px` to `100% 1px`
- [ ] Apply to all nav links in `Nav.module.css` and footer links in `Footer.module.css`
- [ ] Remove any existing underline-on-hover CSS that uses `text-decoration` — replace with the background-gradient approach

### 4.4 Button magnetic effect
- [ ] In `components/CTA.js` and `Hero.js`: add `onMouseMove` handler to primary CTA buttons
- [ ] Calculate mouse offset from button center: `x = (e.clientX - rect.left - rect.width/2) * 0.25`, `y = (e.clientY - rect.top - rect.height/2) * 0.25`
- [ ] Apply `transform: translate(${x}px, ${y}px)` on hover; reset on `onMouseLeave` with `transition: transform 400ms ease`
- [ ] Works only on desktop (skip if `pointer: coarse`)

### 4.5 Program card — border reveal on hover
- [ ] In `Programs.module.css`: `.card` base has `border: 1px solid var(--ink-3)` 
- [ ] On `.card:hover`: border-color animates to `--blood` via `transition: border-color 200ms`
- [ ] On `.card:hover .cardNumber`: color changes from `--bone-2` to `--blood`
- [ ] On `.card:hover .cardCta`: the chevron icon translates `4px` to the right via `transform: translateX(4px)`
- [ ] All transitions: `180ms var(--ease)` as per design spec

---

## SPRINT 5 — 3D Ring Enhancements

### 5.1 Particle impact system
- [ ] In `BoxingRing3D.js`: add a `THREE.Points` geometry with 300 particles stored in `BufferGeometry`
- [ ] Particles start at `(0,0,0)` invisible (`opacity: 0` via shader `gl_PointAlpha`)
- [ ] Expose a `triggerImpact(x, y, z)` function: sets all particle positions to start point, gives each a random velocity vector, animates with GSAP `to()` over 0.8s ease-out, then resets
- [ ] Wire to: ring container `click` event — on click anywhere on the canvas, raycast to find the click point on the ring mat, call `triggerImpact` at that position
- [ ] Particle color: `--blood` orange (`0xFF5300`)
- [ ] Particle size: 0.08 world units, rendered as `THREE.PointsMaterial`

### 5.2 Punch-speed interaction (signature original feature)
- [ ] Add a UI overlay inside `components/Hero.js`: a small panel bottom-right of the 3D canvas showing `PUNCH SPEED: — mph`
- [ ] Detect rapid click/tap sequences on the canvas: measure time delta between consecutive clicks
- [ ] Formula: `speed_mph = Math.min(Math.round(1000 / deltaMs * 30), 120)` (capped at 120mph)
- [ ] Animate the speed number up using GSAP `to({ innerText })` with `snap`
- [ ] On each punch: call `triggerImpact()` (Sprint 5.1) — ring shakes `±2px` for 200ms
- [ ] After 3 seconds of inactivity: fade the panel back to `— mph`
- [ ] Mobile: responds to `touchstart` events instead of `click`
- [ ] CSS: panel in `Hero.module.css` as `.speedPanel` — monospace font, blood color, `z-index: 4`

### 5.3 Ring auto-rotation pause on interaction
- [ ] In `BoxingRing3D.js`: when user hovers over the canvas, set `controls.autoRotate = false`
- [ ] When user moves mouse away (mouseout), set `controls.autoRotate = true` with a 2-second delay
- [ ] This makes the ring feel responsive without being jumpy

### 5.4 Emissive glow intensity linked to scroll
- [ ] In `BoxingRing3D.js`: expose a `setGlowIntensity(v)` function on the container element's dataset or via a `CustomEvent`
- [ ] In `Hero.js`: add a `ScrollTrigger` that reads scroll progress of the hero section (0 to 1) and calls `setGlowIntensity(1 - progress)` — ring dims as user scrolls away
- [ ] When hero is fully visible: emissiveIntensity at max (`2.5`). When hero scrolled out: drops to `0.5`

---

## SPRINT 6 — Photography & Real Assets

*All tasks in this sprint are `[!]` blocked until the client provides files.*

- [!] Receive 4–6 high-resolution training photos from client (boxers, coaches, ring, gloves)
- [!] Place photos in `public/images/` — name them: `coach-1.jpg`, `coach-2.jpg`, `class-boxing.jpg`, `class-muaythai.jpg`, `gloves.jpg`
- [!] In `Philosophy.js`: replace `.imgPlaceholder` div with `<Image>` from `next/image` pointing to `coach-1.jpg`
- [!] Apply `mix-blend-mode: luminosity` + CSS `sepia(0.2) contrast(1.1)` filter for brand-consistent treatment
- [!] In `Coaches.js` (Sprint 2.2): wire coach photos to each card's placeholder box
- [!] In `BoxingRing3D.js`: replace canvas-drawn mat texture with `THREE.VideoTexture` if a 10-second training clip is provided — loop silently, muted
- [!] Receive real logo SVG from client — place at `public/logo.svg`
- [!] Update `Nav.js` logo from text-based to `<Image src="/logo.svg">` (keep text fallback)
- [!] Receive address/location details — update `Footer.js` contact column with real address string

---

## SPRINT 7 — Performance & SEO

### 7.1 Metadata
- [ ] In `app/layout.js`: add full `export const metadata` object with `title`, `description`, `keywords`, `openGraph`, `twitter` fields
- [ ] `title`: `"ONE Institute of Martial Arts — Boxing, Muaythai, Kickboxing"`
- [ ] `description`: `"Professional combat sports training in Boxing, Muaythai, and Kickboxing. Coaches who've fought. Walk-ins welcome."`
- [ ] `openGraph.images`: `["/og-image.jpg"]` — create a 1200×630 static OG image in `public/`
- [ ] Add `<link rel="canonical">` for the homepage

### 7.2 Three.js bundle splitting
- [ ] Confirm `BoxingRing3D.js` is loaded with `next/dynamic` and `ssr: false` — already done, verify in production build output
- [ ] Add `loading` prop to the dynamic import: `loading: () => null` (hero CSS background shows while Three.js loads)
- [ ] Verify Three.js chunk does not appear in the initial page JS bundle (check `.next/static/chunks/`)

### 7.3 Image optimization
- [ ] All `<img>` tags → `<Image>` from `next/image` with explicit `width`, `height`, `sizes`, `priority` (for above-fold images)
- [ ] Coach photos: `sizes="(max-width: 768px) 100vw, 50vw"`
- [ ] Add `placeholder="blur"` for all images once real assets are provided

### 7.4 Core Web Vitals
- [ ] Run `npx lighthouse http://localhost:3000 --output=json` and capture baseline scores
- [ ] LCP target: `< 2.5s` — ensure hero text is server-rendered (it is, via RSC), ring canvas does not affect LCP
- [ ] CLS target: `< 0.1` — hero section must have explicit `height: 100vh` to prevent layout shift when 3D canvas mounts
- [ ] FID/INP: ensure all GSAP animations use `will-change: transform` on animated elements via inline style

### 7.5 Accessibility baseline
- [ ] `BoxingRing3D.js` canvas: add `aria-hidden="true"` to the container div (it's decorative)
- [ ] Nav hamburger button: has `aria-label` already — verify `aria-expanded` is toggled correctly with `menuOpen` state
- [ ] Color contrast check: `--bone-2` (`#C9C2B4`) on `--ink` (`#0A0A0A`) — verify meets WCAG AA (4.5:1 minimum)
- [ ] All `<a>` tags with icon-only content must have `aria-label`
- [ ] Form fields in CTA (Sprint 2.3) must have `<label>` elements associated via `htmlFor`

---

## SPRINT 8 — Sound Design *(optional, enable with user consent)*

### 8.1 Install Howler
- [ ] `npm install howler`
- [ ] Add sound files to `public/sounds/`: `bell.mp3` (ring bell, ~1s), `punch.mp3` (impact, ~0.3s), `whoosh.mp3` (transition, ~0.5s)
- [ ] Source royalty-free: freesound.org (search "boxing bell", "punch impact", "whoosh")

### 8.2 Sound controller
- [ ] Create `context/SoundContext.js`: `isMuted` state + `toggleMute` + `playSound(name)` helper
- [ ] `playSound` uses Howler: `new Howl({ src: ['/sounds/bell.mp3'] }).play()`
- [ ] Wrap app in `SoundProvider` in `ClientLayout.js`

### 8.3 Sound triggers
- [ ] LoadingScreen: on complete (just before slide-out), play `bell` sound
- [ ] CTA submit button: play `punch` on click
- [ ] Punch-speed interaction (Sprint 5.2): play `punch` on each registered click
- [ ] Page scroll past hero: play `whoosh` once (use ScrollTrigger `onEnter`, `once: true`)

### 8.4 Mute toggle UI
- [ ] In `Nav.js`: add a mute toggle button (Lucide `Volume2` / `VolumeX` icons) to the right of nav links
- [ ] Persists in `localStorage` between visits
- [ ] Default: **muted** (users never expect sound — opt-in model)

---

## SPRINT 9 — Final Awwwards Polish

### 9.1 Page transition
- [ ] `npm install next-view-transitions`
- [ ] In `app/layout.js`: wrap children with `<ViewTransitions>`
- [ ] In `globals.css`: define `@keyframes slideIn` and `@keyframes slideOut` — full-screen orange wipe from right
- [ ] Apply via `::view-transition-old(root)` and `::view-transition-new(root)` CSS selectors

### 9.2 Scroll progress indicator
- [ ] Create `components/ScrollProgress.js`: a 1px-tall `--blood` line at the very top of the viewport, `position: fixed`, `z-index: 9999`
- [ ] Width interpolates from `0%` to `100%` using a `ScrollTrigger` `scrub: true` animation
- [ ] Add to `ClientLayout.js`

### 9.3 Section number system
- [ ] Each major section should have a fixed left-side vertical label matching the design spec's bracketed mono style
- [ ] Add `[S 01]`, `[S 02]`, etc. as `position: absolute; left: 24px` text in each section component
- [ ] Font: `var(--font-mono)`, `11px`, `--bone-2`, rotated `90deg`

### 9.4 Footer — entrance animation
- [ ] Currently no animation on footer entry
- [ ] In `Footer.js`: add `useGSAP` with `scrollTrigger` — each footer column slides up from `y: 60` with stagger `0.1s` on scroll entry

### 9.5 "Apply Now" easter egg
- [ ] On the CTA section headline `WALK-INS WELCOME. EXCUSES AREN'T.`: after 8 seconds of the user reading it without clicking, subtly pulse the orange `AREN'T` word with a `boxShadow` glow (`0 0 20px var(--blood-glow)`) for 2 cycles then stop
- [ ] Implemented as a `setTimeout` inside `useGSAP` on the CTA section, cleared on unmount

### 9.6 Responsive QA checklist
- [ ] Test all sections at: `375px` (iPhone SE), `390px` (iPhone 14), `768px` (iPad), `1024px`, `1440px`, `1920px`
- [ ] Hero: 3D ring canvas must be visible and performant at all sizes (verify `devicePixelRatio` cap at `2` in `BoxingRing3D.js`)
- [ ] Programs horizontal scroll (Sprint 3.2): verify fallback to vertical on mobile
- [ ] Nav mobile menu: verify it closes on link click and doesn't leave overflow issues
- [ ] Custom cursor (Sprint 4.1): verify `cursor: none` is reverted on touch devices

### 9.7 Vercel deployment
- [ ] `npm run build` — zero errors, zero type warnings
- [ ] Push to `main` branch on GitHub
- [ ] Connect repo to Vercel via dashboard or `vercel --prod` CLI
- [ ] Set environment variables if any (currently none)
- [ ] Run Lighthouse on deployed URL — target Perf `>85`, Accessibility `>90`, Best Practices `>95`, SEO `>95`
- [ ] Submit to Awwwards: fill in project name, description, URL — category `Agency / Studio` (closest fit)

---

## SPRINT 10 — Kinetic Typography with split-type *(Tier 1 — highest visual impact)*

> **`split-type` is the free alternative to GSAP SplitText** — identical API, zero cost, no membership required. GSAP SplitText is $99/yr (Club GSAP) and not needed here.

### 10.1 Install split-type
- [ ] `npm install split-type`
- [ ] Verify: `import SplitType from 'split-type'` compiles in a `'use client'` component
- [ ] Usage pattern: `const split = new SplitType('.target', { types: 'chars,words,lines' })` → splits DOM text into individually-animatable `<span>` elements
- [ ] Cleanup: always call `split.revert()` in the `useEffect` return to restore original DOM on unmount

### 10.2 Hero headline — letter-by-letter burst reveal
- [ ] In `Hero.js`: after `isLoaded`, run `new SplitText('.hero-headline', { type: 'chars,words' })` on the `<h1>` element
- [ ] Animate `.chars` from `{ y: 80, opacity: 0, rotation: -8, skewX: 12 }` to `{ y: 0, opacity: 1, rotation: 0, skewX: 0 }` with stagger `0.04s`, `ease: 'power4.out'`, duration `0.7s`
- [ ] This runs as part of the existing hero GSAP timeline, replacing the current plain `hero-text-anim` fade

### 10.3 Programs section heading scrub
- [ ] In `Programs.js`: split the `TRAIN. SPAR. WIN.` h2 into words using SplitText `type: 'words'`
- [ ] Tie each word's `y` position to scroll progress via `ScrollTrigger scrub: 1` — word 1 starts at `y: 120`, word 2 at `y: 200`, word 3 at `y: 300`; all resolve to `y: 0` as section enters
- [ ] Effect: words cascade in at different depths as user scrolls, not simultaneously

### 10.4 Philosophy headline — clip mask wipe per word
- [ ] In `Philosophy.js`: wrap each word of `COACHES WHO'VE FOUGHT.` in `<span class="word-wrap">` with `overflow: hidden`
- [ ] SplitText `type: 'words'`, animate words from `y: 100%` to `y: 0` (clip wipe from below), stagger `0.1s`, on scroll entry
- [ ] This is the "text tears through the screen" effect — words rip up through an invisible floor

### 10.5 CTA section headline — staggered line reveal
- [ ] In `CTA.js`: split `WALK-INS WELCOME. EXCUSES AREN'T.` into lines using SplitText `type: 'lines'`
- [ ] Each line clips up from below with `duration: 1s, stagger: 0.15s, ease: 'expo.out'` on scroll entry
- [ ] Wrap each line in `.lineWrapper { overflow: hidden }` so lines appear to push through the floor

### 10.6 Ticker — weight pulse on scroll speed
- [ ] In `Ticker.js`: detect scroll velocity using Lenis's `onScroll` callback (`e.velocity`)
- [ ] When `Math.abs(velocity) > 8`: transition ticker item `font-weight` to `900` and letter-spacing to `-0.04em`
- [ ] When velocity drops back to 0: transition back to base weight `400` — mimics ticker being "hit" by fast scroll
- [ ] CSS transition: `font-weight 200ms, letter-spacing 200ms var(--ease)`

---

## SPRINT 11 — Rive Interactive Animations *(Tier 2)*

> Rive is free for web use. Create `.riv` files at rive.app editor. Export and place in `public/rive/`.

### 11.1 Install Rive runtime
- [ ] `npm install @rive-app/react-canvas`
- [ ] Verify install: `import { useRive } from '@rive-app/react-canvas'` compiles without error

### 11.2 Animated round timer — LoadingScreen
- [ ] In Rive editor: create a `round-timer.riv` file — a circular countdown dial that sweeps from 0% to 100% with a number in the center
- [ ] State machine: trigger `start` input → animate 0 to 100 over 2s → trigger `complete` output
- [ ] In `LoadingScreen.js`: replace the current CSS progress bar with `<RiveComponent src="/rive/round-timer.riv">` sized at `120×120px`
- [ ] Wire: map loading progress percentage to the Rive `progress` number input via `rive.setNumberState('progress', value)`
- [ ] On 100%: Rive fires `complete` → call existing GSAP slide-out animation

### 11.3 Animated glove icon — Nav CTA
- [ ] In Rive editor: create `glove-icon.riv` — a boxing glove in rest state, on hover trigger it punches forward and retracts (0.4s)
- [ ] State machine: `idle` state → hover → `punch` animation → return to `idle`
- [ ] In `Nav.js`: replace the "Book a Class" text-only CTA with a flex row containing the Rive glove component (24×24px) + text
- [ ] Wire hover: `rive.stateMachineInput('hover').value = true` on `mouseenter`, `false` on `mouseleave`

### 11.4 Animated discipline icons — Programs cards
- [ ] Create four `.riv` files: `boxing.riv`, `muaythai.riv`, `kickboxing.riv`, `lowkick.riv`
- [ ] Each: simple silhouette pose at rest, on hover animates into a fighting stance or strike (0.5s loop)
- [ ] Dimensions: `64×64px`, placed above the card number in each `Programs.js` card
- [ ] Wire: `onMouseEnter`/`onMouseLeave` on each `.card` triggers the matching Rive state

### 11.5 Coach silhouette — Coaches cards (Sprint 2.2)
- [ ] Create `coach-stance.riv` — generic fighter silhouette, state machine: `idle` (slight sway) → `guard` stance on hover
- [ ] Use as placeholder in `Coaches.js` coach photo area until real photos arrive (Sprint 6)
- [ ] On photo arrival: Rive component is replaced by `<Image>` with overlay — remove Rive cleanly

---

## SPRINT 12 — React Three Fiber Migration & Advanced WebGL *(Tier 2)*

### 12.1 Install R3F + Drei
- [ ] `npm install @react-three/fiber @react-three/drei`
- [ ] Verify Three.js peer dependency matches: R3F requires Three `^0.170.0` — check `package.json` currently has `^0.183.2` (compatible)
- [ ] Do NOT remove raw `three` from dependencies — some imports will remain direct

### 12.2 Migrate BoxingRing3D to R3F Canvas
- [ ] Create `components/BoxingRing3DF.js` (new file, R3F version) — do not delete `BoxingRing3D.js` until verified working
- [ ] Replace `useEffect` Three.js imperative setup with declarative `<Canvas>` from R3F
- [ ] Camera: `<PerspectiveCamera makeDefault position={[0, 13, 22]} fov={38} />`
- [ ] Controls: `<OrbitControls enableDamping autoRotate autoRotateSpeed={0.35} maxPolarAngle={Math.PI / 2.2} />`
- [ ] Renderer props on `<Canvas>`: `shadows gl={{ antialias: true, alpha: true }} toneMapping={THREE.ACESFilmicToneMapping}`
- [ ] Post-processing: `<EffectComposer>` from `@react-three/postprocessing`, `<Bloom luminanceThreshold={0.85} intensity={0.6} />`

### 12.3 Upgrade ring materials with Drei
- [ ] Corner posts: wrap in `<Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>` — posts subtly breathe
- [ ] Rope tubes: replace `MeshStandardMaterial` with `<MeshDistortMaterial distort={0.05} speed={2} />` — ropes shimmer slightly
- [ ] Platform LED strips: add `<Sparkles count={20} size={0.5} speed={0.3} color="#FF5300" />` above each strip corner
- [ ] Ring mat logo: add a `<Trail>` component on an invisible fast-moving point above the mat to leave a faint orange streak

### 12.4 Noise distortion shader on section transitions
- [ ] Create `components/NoiseTransition.js` — a full-viewport `<Canvas>` using a custom GLSL fragment shader
- [ ] Shader input: two texture samplers (`tPrev`, `tNext`) + `uProgress` uniform (0→1)
- [ ] Fragment shader: UV displacement via `texture2D(noiseTexture, uv + time * 0.01)` creates heat-shimmer warp between the two textures
- [ ] Trigger: when Lenis scrolls past a section boundary (use ScrollTrigger `onEnter`), animate `uProgress` from 0 to 1 over 600ms
- [ ] Mount behind content (`z-index: 0`) so text layers stay on top — use `pointer-events: none`
- [ ] Mobile: disable this effect entirely (GPU cost too high on low-end devices — check `navigator.hardwareConcurrency < 4`)

### 12.5 Particle trail on cursor (replaces Sprint 4.1 dot)
- [ ] Add a `<Trail>` Drei component tracking the custom cursor position in 3D space (orthographic canvas overlay)
- [ ] Trail: 10 points, length `0.8`, attenuation curve `(t) => t`, color `#FF5300`, width `0.02`
- [ ] Only visible on the hero section — fade trail `opacity` to 0 outside the hero viewport

---

## SPRINT 13 — Gallery / Proof Section *(Tier 4)*

### 13.1 Section scaffold
- [ ] Create `components/Gallery.js` with `id="gallery"`
- [ ] Create `components/Gallery.module.css`
- [ ] Layout: full-width dark section, overline `[+] Proof of Work`, h2 `THE GYM. THE GRIND. THE RESULT.`
- [ ] Add to `app/page.js` between `<Philosophy />` and `<CTA />`

### 13.2 Masonry grid layout
- [ ] In `Gallery.module.css`: CSS grid with `grid-template-columns: repeat(12, 1fr)` and manual `grid-column` / `grid-row` placement for each photo
- [ ] 8 cells total, varied sizes: 2 wide cells (col span 6), 4 medium (span 4), 2 tall (row span 2) — creates editorial asymmetry
- [ ] Gap: `4px` between cells (tight industrial grid)
- [ ] Placeholder colors: use `--ink-2` fill with `--ink-3` border until real photos arrive

### 13.3 Blur-to-sharp reveal on scroll entry
- [ ] Each `.galleryCell` starts with `filter: blur(12px) brightness(0.4)` and `transform: scale(1.04)`
- [ ] On scroll entry (each cell individually): GSAP `to({ filter: 'blur(0px) brightness(1)', scale: 1, duration: 0.8, ease: 'power2.out' })`
- [ ] Stagger: `0.07s` per cell, using `ScrollTrigger batch` to trigger cells as they enter viewport individually
- [ ] Use `ScrollTrigger.batch('.gallery-cell', { onEnter: batch => gsap.to(batch, { ... }) })`

### 13.4 Photo hover effect — luminosity + color reveal
- [ ] All gallery photos are rendered in grayscale by default: `filter: grayscale(100%) contrast(1.1)`
- [ ] On `mouseenter`: animate `filter` to `grayscale(0%) contrast(1.0)` over `300ms` — photo snaps to full color on hover
- [ ] On `mouseleave`: returns to grayscale over `500ms`
- [ ] Add a thin `--blood` border (`1px`) that draws in on hover using a `clip-path` animation from `inset(100% 0 0 0)` to `inset(0% 0 0 0)`

### 13.5 Scan-line overlay on each cell
- [ ] Each `.galleryCell::after` pseudo-element: `background: repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 4px)`
- [ ] This creates horizontal scan lines at 25% opacity giving a monitor/CCTV aesthetic
- [ ] `pointer-events: none`, `z-index: 2` above image, `mix-blend-mode: multiply`

### 13.6 Caption overlay
- [ ] Each cell has an absolutely-positioned caption div: discipline tag in mono + short descriptor
- [ ] Default: `opacity: 0`, `transform: translateY(8px)`
- [ ] On cell hover: fade in over `200ms`, translate `y` to `0`
- [ ] Caption format: `[Boxing] — Sparring Round · Coach Session`

### 13.7 Mobile fallback
- [ ] On `max-width: 768px`: masonry collapses to a 2-column grid, all cells same height
- [ ] Blur-to-sharp still works but no stagger (all cells reveal simultaneously on first scroll into view)
- [ ] Hover grayscale effect replaced by tap — first tap reveals color, second tap follows link

---

## SPRINT 14 — Programs Video Thumbnails & CTA Map *(Tier 4)*

### 14.1 Programs card — video thumbnail on hover
- [ ] Source 4 short video clips (5–10s, looping): one per discipline — gloves impact, kick, sparring, pad work
- [ ] Place at `public/videos/boxing.mp4`, `muaythai.mp4`, `kickboxing.mp4`, `lowkick.mp4`
- [ ] In each `Programs.js` card: add a `<video>` element absolutely positioned, covering the top 40% of the card
- [ ] Video attrs: `muted loop playsInline preload="none"` — do NOT autoplay on load
- [ ] On card `mouseenter`: call `video.play()`; on `mouseleave`: `video.pause(); video.currentTime = 0`
- [ ] Video reveal: `opacity: 0` by default, animate to `opacity: 0.6` on play (dim overlay feel — text remains legible)
- [ ] `mix-blend-mode: luminosity` on the `<video>` element — brand color consistency

### 14.2 CTA section — embedded map
- [ ] In `CTA.js`: restructure `.right` column to split into two rows: top row = contact form (Sprint 2.3), bottom row = embedded map
- [ ] Map: `<iframe>` from Google Maps embed URL for ONE Institute's location (use the maps link from designspecs.md)
- [ ] iframe dims: `100% width`, `240px height`, `border: none`, `filter: grayscale(1) contrast(1.1) brightness(0.8)` — matches dark brand tone
- [ ] On iframe hover: `filter` transitions to `grayscale(0)` (color reveal, matches gallery cells Sprint 13.4)
- [ ] Add caption below map: `<span>[↗] Open in Google Maps</span>` linking to the full maps URL

### 14.3 Programs section — horizontal scroll mobile behavior
- [ ] Audit Sprint 3.2 mobile fallback — ensure pinned horizontal scroll is fully disabled at `max-width: 768px`
- [ ] On mobile: all 4 cards stack vertically, each card has video thumbnail playing on tap (not hover)
- [ ] Touch: first tap plays video, second tap follows `#contact` link

---

## SPRINT 15 — Advanced Typography System *(Tier 3)*

### 15.1 Variable font — weight animation on scroll
- [ ] Research: check if `Anton` or `Archivo Black` have variable font versions — they do not. Switch the **sub-display** font to `Plus Jakarta Sans` (has variable `wght` axis, free on Google Fonts)
- [ ] In `app/layout.js`: add `Plus_Jakarta_Sans` with `variable: '--font-sub-display'`, `axes: ['wght']`
- [ ] In `Programs.module.css`: `.card .cardName { font-weight: 400; transition: font-weight 600ms; }` — on card hover animate to `900`
- [ ] In `Stats.module.css`: `.value` — tie `font-weight` to scroll progress via GSAP `to({ fontVariationSettings: "'wght' 900" })` as stat enters viewport
- [ ] Note: `font-weight` CSS transitions require the variable font — test with `@supports (font-variation-settings: 'wght' 900)`

### 15.2 Giant background letterforms
- [ ] In `Programs.js`: add a `<span aria-hidden="true" className={styles.bgLetter}>01</span>` absolutely positioned behind the section
- [ ] Styling: `font-size: clamp(400px, 50vw, 800px)`, `color: var(--bone)`, `opacity: 0.025`, `line-height: 1`, `letter-spacing: -0.06em`, `user-select: none`, `pointer-events: none`
- [ ] Position: right-aligned, vertically centered behind the card grid
- [ ] GSAP: on scroll, slowly move the letterform upward at `y: -50px` scrubbed to section scroll progress (parallax layer)

- [ ] In `Philosophy.js`: add `<span aria-hidden="true" className={styles.bgLetter}>ONE</span>` similarly — `opacity: 0.02`, enormous, behind the two-column layout

- [ ] In `Stats.js`: add `<span aria-hidden="true" className={styles.bgLetter}>12</span>` (round limit number) — `opacity: 0.03`, positioned center-left

### 15.3 Halftone / duotone filter for coach photos
- [ ] In `app/globals.css`: define an SVG `<filter>` element via a `<svg>` hidden in the DOM (output to `app/layout.js` or a wrapper component)
- [ ] Filter: `<feTurbulence>` + `<feColorMatrix>` for duotone (black → orange)
- [ ] In `Coaches.module.css`: apply via `filter: url(#duotone)` on coach photo `<img>` elements
- [ ] On hover: transition to `filter: none` using CSS `transition: filter 400ms`

---

## SPRINT 16 — Multi-Page Architecture *(confirmed: YES)*

> Decision: the site expands to multiple pages. Home (`/`) stays the main cinematic entry. Sub-pages are full editorial pages with their own scroll narratives.

### 16.0 Route map (confirmed page structure)
```
/                   → Home (current — Hero, Ticker, Programs, Stats, Philosophy, CTA, Footer)
/programs           → Programs overview page — all 4 disciplines in detail
/programs/boxing    → Boxing detail page
/programs/muaythai  → Muaythai detail page
/programs/kickboxing → Kickboxing K1 detail page
/programs/lowkick   → Low Kick detail page
/coaches            → Coaches roster page
/schedule           → Weekly timetable page (interactive)
/contact            → Contact + map page (full screen)
```

### 16.1 Route scaffold — App Router folders
- [ ] Create `app/programs/page.js` — Programs overview
- [ ] Create `app/programs/boxing/page.js` — Boxing detail
- [ ] Create `app/programs/muaythai/page.js`
- [ ] Create `app/programs/kickboxing/page.js`
- [ ] Create `app/programs/lowkick/page.js`
- [ ] Create `app/coaches/page.js`
- [ ] Create `app/schedule/page.js`
- [ ] Create `app/contact/page.js`
- [ ] All pages import `Nav` and `Footer` — create a shared `app/(site)/layout.js` group layout that wraps these two, so each page doesn't re-import manually

### 16.2 Nav links — update hrefs to real routes
- [ ] In `Nav.js`: change `navLinks` array to use full route paths instead of hash anchors:
  ```js
  { label: 'Programs', href: '/programs' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Coaches',  href: '/coaches'  },
  { label: 'Contact',  href: '/contact'  },
  ```
- [ ] Hero section CTAs: `"Book a Class"` → `href="/contact"`, `"View Programs"` → `href="/programs"`
- [ ] Footer quick links: update all `href="#..."` anchors to real routes
- [ ] Keep home-page section `id` attributes in place for scroll-to use within the home page only

### 16.3 Page transitions (next-view-transitions — Sprint 9.1 expanded)
- [ ] `npm install next-view-transitions`
- [ ] In `app/layout.js`: wrap `{children}` with `<ViewTransitions>`
- [ ] Replace all `<a>` nav links with `<Link>` from `next-view-transitions` (re-exports Next.js `<Link>` with transition awareness)
- [ ] In `app/globals.css`: define the orange wipe transition:
  ```css
  ::view-transition-old(root) {
    animation: 400ms cubic-bezier(0.65,0,0.35,1) both wipeOut;
  }
  ::view-transition-new(root) {
    animation: 400ms cubic-bezier(0.65,0,0.35,1) both wipeIn;
  }
  @keyframes wipeOut {
    to { clip-path: inset(0 0 100% 0); }
  }
  @keyframes wipeIn {
    from { clip-path: inset(0 0 100% 0); }
    to   { clip-path: inset(0 0 0% 0); }
  }
  ```
- [ ] Test: navigate Home → Programs → back → transition fires both directions

### 16.4 `/programs` overview page
- [ ] `app/programs/page.js`: full-bleed hero section with headline `FOUR DISCIPLINES. ONE STANDARD.`
- [ ] 4 large cards (full width, stacked) — one per discipline, each links to `/programs/[slug]`
- [ ] Each card: full-bleed video background (Sprint 14.1 clips), discipline name in display type, days/times, `→ Learn more` CTA
- [ ] On card hover: video un-pauses (same pattern as Programs.js Sprint 14.1)
- [ ] GSAP: each card scrubs in from `x: -100%` on scroll entry

### 16.5 `/programs/[discipline]` detail page
- [ ] `app/programs/boxing/page.js` (repeat pattern for each discipline)
- [ ] Sections: Hero (discipline name huge, background video), What You'll Learn (3 bullet pillars), Schedule block (days/times from `Schedule.js` data), Coaches who teach it, CTA
- [ ] `export const metadata = { title: 'Boxing — ONE Institute' }` in each page
- [ ] Reuse existing component patterns — no new design language

### 16.6 `/coaches` page
- [ ] `app/coaches/page.js`: hero `COACHES WHO'VE FOUGHT.`, full roster grid
- [ ] Each coach: full-bleed photo (Sprint 6 assets), name in giant Anton type, discipline tags, fight record, quote
- [ ] On coach card click: expand to a detail modal or navigate to `/coaches/[name]` (decide: modal for now, route later)
- [ ] Rive coach silhouette (Sprint 11.5) used as placeholder until photos land

### 16.7 `/schedule` page
- [ ] `app/schedule/page.js`: full interactive timetable — reuse the `Schedule.js` component (Sprint 2.1)
- [ ] Expand: add filter buttons by discipline (`All · Boxing · Muaythai · Kickboxing · Low Kick`)
- [ ] Filter logic: `useState` for active discipline filter, filters the timetable rows
- [ ] Today's column still highlighted in `--blood`
- [ ] Add a sticky `"Book this class"` CTA in the table header row that links to `/contact`

### 16.8 `/contact` page
- [ ] `app/contact/page.js`: full-screen single page — left column is the contact form (Sprint 2.3), right column is the Google Maps embed (Sprint 14.2)
- [ ] Above the two-column layout: overline `[+] Round One`, headline `WALK-INS WELCOME.`
- [ ] Contact details block below the form: phone, Instagram, address
- [ ] After successful form submit: GSAP animates a confirmation overlay that slides up from bottom: `"ROUND ONE CONFIRMED."` with a ring-bell Rive animation (Sprint 11.2)

### 16.9 Shared metadata
- [ ] In each `page.js`: export `metadata` with page-specific `title` and `description`
- [ ] In `app/layout.js`: set `metadataBase: new URL('https://oneinstitute.in')` (or whatever the live domain is)
- [ ] Confirm canonical URLs resolve correctly on Vercel deployment (Sprint 9.7)

---

## SPRINT 17 — Parallax Depth Layers *(Tier 1 — scroll storytelling)*

### 17.1 Hero ring recede on scroll
- [ ] In `Hero.js`: add a `ScrollTrigger` scoped to the hero section with `scrub: 1`
- [ ] As hero scrolls from 0% to 100% out of view: animate `ringRef.current` with `scale: 0.7, y: -80, opacity: 0`
- [ ] Simultaneously animate the gradient overlay (`.hero::before`) opacity from `1` to `0` via a data attribute trick or inline style toggle
- [ ] Effect: ring physically recedes into the distance as the next section emerges

### 17.2 Multi-layer depth in Programs
- [ ] In `Programs.js`: add three depth layers behind the cards:
  - Layer 1 (far): background letterform `01` (Sprint 15.2) — moves at `0.2×` scroll speed
  - Layer 2 (mid): subtle horizontal line dividers — move at `0.5×` scroll speed
  - Layer 3 (near): the cards themselves — move at `1×` (normal)
- [ ] GSAP `ScrollTrigger scrub: true` drives each layer independently
- [ ] This creates true 3D depth illusion without WebGL

### 17.3 Ticker — react to scroll velocity
- [ ] In `Ticker.js`: read Lenis `velocity` on each scroll frame
- [ ] Accelerate ticker animation duration: `animation-duration = baseDuration / (1 + Math.abs(velocity) * 0.1)`
- [ ] When scrolling fast: ticker races. When still: ticker slows. Feels alive.
- [ ] Implement by dynamically setting `style.animationDuration` on the `.track` element via a `requestAnimationFrame` loop

### 17.4 Stats section — entrance from four sides
- [ ] In `Stats.js`: instead of all 4 stats fading from below, split into quadrants:
  - Stat 1 (5AM): slides in from `x: -80` (left)
  - Stat 2 (4×): slides in from `y: -80` (top)
  - Stat 3 (3×): slides in from `y: 80` (bottom)
  - Stat 4 (12): slides in from `x: 80` (right)
- [ ] All triggered by single `ScrollTrigger` on section enter, stagger `0.1s`
- [ ] This gives the impression stats are flying in from every direction — kinetic, fighter-energy

### 17.5 Philosophy — background image parallax
- [ ] In `Philosophy.js`: the `.right` column (coach photo placeholder, Sprint 2.2) should move at `0.85×` the normal scroll speed
- [ ] Implement: wrap the image in `.parallaxWrapper { overflow: hidden }`, inner `<img>` translates at `y: -15%` to `y: 15%` as section scrolls through viewport
- [ ] `scrub: 1` — smooth, not snappy

---

## DEPENDENCIES MAP

```
Sprint 1 (foundation)
  └─> Sprint 3 (motion) depends on 1.2 (ScrollTrigger wiring)
  └─> Sprint 4 (micro-interactions) can run in parallel after 1.1
  └─> Sprint 10 (SplitText) depends on 1.2 (ScrollTrigger + Lenis wired)
  └─> Sprint 16 (parallax) depends on 1.2

Sprint 2 (missing sections)
  └─> Sprint 6 (assets) populates Sprint 2.2 coach cards
  └─> Sprint 11.5 (Rive coach) is interim placeholder until Sprint 6 delivers photos
  └─> Sprint 14 (video thumbnails) requires video clips from client

Sprint 5 (3D enhancements)
  └─> Sprint 5.2 (punch-speed) depends on 5.1 (particle system)
  └─> Sprint 12 (R3F migration) supersedes Sprint 5 — do Sprint 12 first if starting fresh

Sprint 7 (performance)
  └─> Depends on Sprint 6 (all images loaded via next/image)
  └─> Run after Sprint 12 (R3F) to re-audit bundle size

Sprint 8 (sound)
  └─> Fully optional, no dependencies
  └─> Sprint 11.2 (Rive timer) replaces the CSS loading bar before sound can wire to it

Sprint 9 (final polish)
  └─> Depends on all prior sprints
  └─> 9.7 (deployment) is the last task

Sprint 10 (SplitText)
  └─> Depends on Sprint 1.2 (ScrollTrigger wiring)
  └─> Can run in parallel with Sprint 11 and Sprint 16

Sprint 11 (Rive)
  └─> No blocking dependencies — can start immediately
  └─> Sprint 11.5 (coach card Rive) replaced by real photos in Sprint 6

Sprint 12 (R3F + WebGL)
  └─> Should be done BEFORE Sprint 5 tasks if possible — R3F replaces the raw Three.js setup
  └─> Sprint 12.4 (noise shader) is the most complex — do last within Sprint 12

Sprint 13 (Gallery)
  └─> Sprint 6 (assets) fills gallery cells with real photos
  └─> Can be built with placeholder divs first — unblocked

Sprint 14 (video thumbnails + map)
  └─> Sprint 14.1 (video) blocked until video clips are provided
  └─> Sprint 14.2 (map iframe) is unblocked — use maps link from designspecs.md now

Sprint 15 (typography)
  └─> Sprint 1.1 (font loading) must be done first
  └─> Sprint 15.1 (variable font) requires Google Fonts update in layout.js

Sprint 16 (multi-page architecture)
  └─> Sprint 9.1 (page transitions) must be done first — view transitions wire into the same layout
  └─> Sprint 2.1 (Schedule), 2.2 (Coaches), 2.3 (Contact form) feed content into their respective pages
  └─> Sprint 16.3 (next-view-transitions) replaces Sprint 9.1 — do not do both separately
  └─> Sprint 6 (assets) needed to fill /coaches page with real photos

Sprint 17 (parallax)
  └─> Depends on Sprint 1.2 (ScrollTrigger wiring)
  └─> Sprint 17.1 (hero ring recede) must come before Sprint 17.2 (Programs parallax)
```

---

## OPEN DECISIONS / QUESTIONS FOR CLIENT

| # | Question | Blocks |
|---|----------|--------|
| 1 | ~~What is the gym's physical address?~~ **CONFIRMED** — Opp. Anand Marg School, Old Dairy Farm, Indira Gandhi Nagar, Adarsh Nagar, Visakhapatnam, AP 530040. Phone: 074110 74751. Full name: "ONE Institute of Martial Arts And Fitness Centre". Rating: 5.0 ⭐ (143 reviews). Opens 5 PM. | Footer updated ✓, CTA phone fixed ✓ |
| 2 | What are the actual class times for each discipline? | Schedule section (Sprint 2.1) |
| 3 | How many coaches? Names + fight records? | Coaches section (Sprint 2.2) |
| 4 | Can we source/create a 10-second training video clip? | Ring mat video texture (Sprint 5.4) |
| 5 | Is there a real logo SVG? | Nav, Footer, OG image |
| 6 | Should pricing be shown on the site or contact-only? | CTA section (Sprint 2.3) |
| 7 | Enable sound by default or keep muted until toggled? | Sprint 8 |
| 8 | Is there an Instagram feed API token for a live gallery? | Future gallery section |
| 9 | ~~Can we access Rive editor to create `.riv` animation files?~~ **YES — confirmed** | Sprint 11 — Rive animations |
| 10 | Are there 4 short video clips (5–10s) of training for each discipline? | Sprint 14.1 — program card video thumbnails |
| 11 | ~~Should the site have multiple pages or stay single-page?~~ **YES — multi-page confirmed** | Sprint 16 — full page architecture added |
| 12 | ~~Is GSAP Club membership available?~~ **Not needed — using free `split-type` package instead** | Sprint 10 updated — `npm install split-type` |

---
name: 3d-concept-visualizer
description: Turn any concept into a stunning interactive 3D web demo. Use this skill whenever the user wants to visualize, animate, or demonstrate a concept — science principles, mechanical structures, math ideas, physics simulations, engineering systems, biological processes, or any abstract idea that benefits from spatial/interactive exploration. Triggers on phrases like "visualize", "animate", "demonstrate", "interactive demo", "show me how X works", "3D explanation", "principle", "演示", "可视化", "动画", "原理", "模拟", or any request where turning a concept into an interactive 3D experience would help understanding. Also triggers when users want educational 3D widgets, explorable explanations, or concept playgrounds. Even if the user doesn't explicitly say "3D", if the concept is spatial, mechanical, physical, or structural, use this skill to create an interactive visualization.
---

# 3D Concept Visualizer

You are a creative developer who transforms concepts into interactive 3D experiences. Your job is to make the invisible visible — turn abstract principles into something users can touch, rotate, and experiment with.

## Output Format

Generate a **single-file React `.jsx` artifact** saved to `/mnt/user-data/outputs/`. The artifact uses vanilla Three.js inside React (via `useEffect` + `useRef`) because React Three Fiber is not available in the artifact runtime.

## Critical Runtime Constraints

The artifact environment has specific limitations. Read `references/runtime-constraints.md` before writing any code — it covers exactly which Three.js APIs are available, which are NOT, and the patterns that work reliably.

**The short version:**
- Three.js r128 is available: `import * as THREE from 'three'`
- OrbitControls and other `examples/jsm/` modules are **NOT** loadable — implement camera interaction manually
- `THREE.CapsuleGeometry` does **NOT** exist in r128 — use `CylinderGeometry` + `SphereGeometry`
- No `localStorage` — use React state only
- Tailwind utility classes are available for UI overlays
- Single file, default export, no required props

## Workflow

### Step 1: Understand the Concept

Before coding, identify:
1. **What is the core principle?** Strip it to the essential mechanism
2. **What are the moving parts?** What changes, what stays fixed, what interacts
3. **What parameters should be adjustable?** Let users experiment with variables that affect the outcome
4. **What's the "aha moment"?** The visual payoff that makes the concept click

If the user's request is vague, ask one focused question. Otherwise, proceed with reasonable defaults.

### Step 2: Choose the Visualization Approach

Pick the best 3D representation:

| Concept Type | Approach |
|---|---|
| Mechanical (gears, engines, linkages) | Animated mesh assemblies with parametric motion |
| Physics (waves, fields, forces) | Particle systems or deforming geometry with shader-like math |
| Math (surfaces, transforms, fractals) | Parametric geometry generation using BufferGeometry |
| Biology (cells, anatomy, molecules) | Composed primitive geometries with organic color palettes |
| Engineering (structures, circuits, flow) | Wireframe + solid hybrid with highlighted paths |
| Abstract (algorithms, data structures) | Spatial metaphors with animated state transitions |

### Step 3: Implement

Follow the architecture in `references/runtime-constraints.md` for the boilerplate. Every visualization must include:

1. **3D Scene** — The core visualization with proper lighting and camera
2. **Interactive Controls** — HTML overlay with sliders/toggles for key parameters (use React state, styled with Tailwind)
3. **Camera Interaction** — Mouse drag to orbit, scroll to zoom (custom implementation, see reference)
4. **Concept Labels** — Brief text explaining what the user is seeing and what the controls do
5. **Animation Loop** — Smooth, frame-rate-independent animation using `requestAnimationFrame` and `THREE.Clock`
6. **Responsive Sizing** — Handle window resize, use container dimensions
7. **Cleanup** — Dispose all Three.js resources in the useEffect cleanup function

### Step 4: Polish

After the core works, layer on:
- **Color choices** that reinforce meaning (red = hot, blue = cold, green = positive, etc.)
- **Smooth transitions** when parameters change — lerp values, don't snap
- **Annotations** — minimal text labels positioned near relevant 3D elements (as HTML overlays, not 3D text)
- **A default state** that already looks interesting before the user touches anything

## Design Principles

**Clarity over spectacle.** The visualization exists to teach, not to show off. Every visual element should map to something conceptual. If a glow or particle effect doesn't help understanding, remove it.

**Interactivity is the point.** Static 3D is just a picture. The value is in letting users change parameters and see consequences. Always include at least 2-3 adjustable parameters.

**Performance matters.** Keep geometry counts reasonable. Use `InstancedMesh` for repeated objects. Avoid real-time shadows unless they're essential to the concept. Target 60fps.

**Accessible defaults.** Start with parameter values that show the concept clearly. Include a "Reset" button. Add brief explanatory text so the visualization works without external context.

## Code Quality

- All Three.js resources created in `useEffect` must be disposed in its cleanup
- Use `THREE.Clock` for delta-time-based animation (frame-rate independent)
- Lerp parameter changes: `current += (target - current) * 0.05`
- Handle `window.resize` events
- Use `React.useState` for UI controls, refs for Three.js objects
- Keep the render loop lean — compute heavy math outside the loop when possible

## Reference Files

- `references/runtime-constraints.md` — **Read this first.** Covers what's available in the artifact runtime, boilerplate patterns, and camera interaction implementation
- `references/visualization-patterns.md` — Code patterns for common visualization types (particles, parametric surfaces, mechanical assemblies, wave simulations)

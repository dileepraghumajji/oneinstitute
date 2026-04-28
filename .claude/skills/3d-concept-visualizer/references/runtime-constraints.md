# Runtime Constraints & Boilerplate

## Available Libraries

In the artifact `.jsx` environment, these are available:

```javascript
import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";           // r128
import * as d3 from "d3";                 // For color scales, interpolation
import * as math from "mathjs";           // For complex math
import _ from "lodash";                   // Utilities
```

## What Does NOT Work

- `import { OrbitControls } from 'three/examples/jsm/...'` — NOT available. Implement manually.
- `THREE.CapsuleGeometry` — introduced in r142, does not exist in r128. Use `CylinderGeometry` + two `SphereGeometry` hemispheres instead.
- `localStorage` / `sessionStorage` — blocked. Use React state.
- External asset loading (GLB, textures from URLs) — unreliable. Generate geometry procedurally.
- `import` from arbitrary npm packages — only the pre-installed list works.

## Boilerplate: React + Three.js Artifact

This is the standard skeleton. Every visualization starts from this:

```jsx
import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ── Lerp utility (use for smooth parameter transitions) ──
const lerp = (a, b, t) => a + (b - a) * t;

export default function ConceptVisualizer() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const animFrameRef = useRef(null);

  // ── UI State (sliders, toggles) ──
  const [param1, setParam1] = useState(0.5);
  const [param2, setParam2] = useState(1.0);
  const [isPlaying, setIsPlaying] = useState(true);

  // ── Refs for values that the render loop reads ──
  const paramsRef = useRef({ param1: 0.5, param2: 1.0, isPlaying: true });
  useEffect(() => {
    paramsRef.current = { param1, param2, isPlaying };
  }, [param1, param2, isPlaying]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0a0a");

    // ── Camera ──
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    // ── Lights ──
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // ── Custom orbit camera state ──
    const orbitState = {
      isDragging: false,
      previousMouse: { x: 0, y: 0 },
      spherical: new THREE.Spherical().setFromVector3(camera.position),
      target: new THREE.Vector3(0, 0, 0),
      zoomSpeed: 0.1,
    };

    const onPointerDown = (e) => {
      orbitState.isDragging = true;
      orbitState.previousMouse = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e) => {
      if (!orbitState.isDragging) return;
      const dx = e.clientX - orbitState.previousMouse.x;
      const dy = e.clientY - orbitState.previousMouse.y;
      orbitState.spherical.theta -= dx * 0.005;
      orbitState.spherical.phi -= dy * 0.005;
      orbitState.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, orbitState.spherical.phi));
      orbitState.previousMouse = { x: e.clientX, y: e.clientY };

      camera.position.setFromSpherical(orbitState.spherical).add(orbitState.target);
      camera.lookAt(orbitState.target);
    };
    const onPointerUp = () => { orbitState.isDragging = false; };
    const onWheel = (e) => {
      orbitState.spherical.radius *= 1 + e.deltaY * 0.001;
      orbitState.spherical.radius = Math.max(2, Math.min(50, orbitState.spherical.radius));
      camera.position.setFromSpherical(orbitState.spherical).add(orbitState.target);
      camera.lookAt(orbitState.target);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: true });

    // ── Build your scene here ──
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshStandardMaterial({ color: 0x4488ff });
    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    // Store references for cleanup
    const disposables = []; // push geometries, materials here
    sceneRef.current = { scene, camera, renderer, orbitState };

    // ── Animation Loop ──
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const p = paramsRef.current;

      if (p.isPlaying) {
        // ── Update your scene here ──
        // mesh.rotation.y += delta * p.param1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize Handler ──
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);

      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-950 overflow-hidden">
      {/* 3D Canvas */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white text-sm max-w-xs space-y-3">
        <h2 className="text-lg font-bold">Concept Name</h2>
        <p className="text-gray-400 text-xs">Brief explanation of what you're looking at.</p>

        <label className="block">
          <span className="text-gray-300 text-xs">Parameter 1: {param1.toFixed(2)}</span>
          <input
            type="range" min="0" max="1" step="0.01"
            value={param1}
            onChange={(e) => setParam1(parseFloat(e.target.value))}
            className="w-full mt-1 accent-blue-500"
          />
        </label>

        <label className="block">
          <span className="text-gray-300 text-xs">Parameter 2: {param2.toFixed(2)}</span>
          <input
            type="range" min="0.1" max="3" step="0.1"
            value={param2}
            onChange={(e) => setParam2(parseFloat(e.target.value))}
            className="w-full mt-1 accent-blue-500"
          />
        </label>

        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs transition-colors"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={() => { setParam1(0.5); setParam2(1.0); }}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Drag hint */}
      <div className="absolute bottom-4 right-4 text-gray-500 text-xs">
        Drag to orbit · Scroll to zoom
      </div>
    </div>
  );
}
```

## Camera Interaction (Manual Orbit)

The boilerplate above includes a full manual orbit implementation. Key details:

- Uses `Spherical` coordinates — theta (horizontal), phi (vertical), radius (distance)
- Pointer events for drag-to-orbit
- Wheel events for zoom
- Phi is clamped to avoid camera flipping (0.1 to PI-0.1)
- Radius is clamped to reasonable range (2 to 50)

To change the orbit target (what the camera looks at), modify `orbitState.target`.

## Disposing Resources

Every geometry, material, and texture created must be disposed in the cleanup function. Track them:

```javascript
const disposables = [];

const geo = new THREE.BoxGeometry(1, 1, 1);
disposables.push(geo);

const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
disposables.push(mat);

// In cleanup:
disposables.forEach(d => d.dispose());
```

## Smooth Parameter Changes

Never assign parameter values directly to 3D properties in the render loop. Lerp them:

```javascript
// In the animation loop:
const currentSpeed = lerp(currentSpeed, p.targetSpeed, 0.08);
mesh.rotation.y += delta * currentSpeed;
```

Store "current" values as regular variables in the useEffect scope (not React state — that would cause re-renders).

## InstancedMesh for Repeated Objects

When you need many copies of the same geometry (particles, array of objects):

```javascript
const count = 500;
const geo = new THREE.SphereGeometry(0.1, 8, 8);
const mat = new THREE.MeshStandardMaterial({ color: 0x44aaff });
const instances = new THREE.InstancedMesh(geo, mat, count);
const dummy = new THREE.Object3D();

for (let i = 0; i < count; i++) {
  dummy.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
  dummy.updateMatrix();
  instances.setMatrixAt(i, dummy.matrix);
}
instances.instanceMatrix.needsUpdate = true;
scene.add(instances);
```

## Color Helpers

```javascript
// Color from hue (0-1)
const color = new THREE.Color().setHSL(hue, 0.8, 0.5);

// Lerp between colors
const c = new THREE.Color();
c.lerpColors(colorA, colorB, t);

// Temperature-style mapping
const tempColor = (t) => {
  // t: 0 = cold (blue), 1 = hot (red)
  return new THREE.Color().setHSL(0.66 - t * 0.66, 0.9, 0.5);
};
```

## Grid and Axis Helpers (for mathematical/engineering concepts)

```javascript
// Grid on XZ plane
const grid = new THREE.GridHelper(10, 20, 0x333333, 0x222222);
scene.add(grid);

// Axis arrows
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);
```

## Line Drawing (for graphs, paths, vectors)

```javascript
const points = [];
for (let i = 0; i <= 100; i++) {
  const t = i / 100;
  points.push(new THREE.Vector3(t * 10 - 5, Math.sin(t * Math.PI * 4), 0));
}
const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
const lineMat = new THREE.LineBasicMaterial({ color: 0x00ff88 });
const line = new THREE.Line(lineGeo, lineMat);
scene.add(line);
```

To update line points each frame:
```javascript
const positions = lineGeo.attributes.position.array;
for (let i = 0; i <= 100; i++) {
  positions[i * 3 + 1] = Math.sin((i / 100) * Math.PI * 4 + elapsed);
}
lineGeo.attributes.position.needsUpdate = true;
```

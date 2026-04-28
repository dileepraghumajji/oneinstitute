# Visualization Patterns

Patterns for common concept types. Each pattern shows the core idea — adapt and combine for specific visualizations.

## Pattern 1: Parametric Surface (Math Concepts)

Generate geometry from a mathematical function. Great for surfaces, fields, manifolds.

```javascript
function createParametricSurface(fn, uRange, vRange, segments) {
  const geo = new THREE.BufferGeometry();
  const positions = [];
  const normals = [];
  const colors = [];
  const indices = [];

  const [uMin, uMax] = uRange;
  const [vMin, vMax] = vRange;

  for (let i = 0; i <= segments; i++) {
    for (let j = 0; j <= segments; j++) {
      const u = uMin + (uMax - uMin) * (i / segments);
      const v = vMin + (vMax - vMin) * (j / segments);
      const p = fn(u, v); // returns { x, y, z }
      positions.push(p.x, p.y, p.z);

      // Approximate normal via cross product of partial derivatives
      const du = 0.001;
      const dv = 0.001;
      const pu = fn(u + du, v);
      const pv = fn(u, v + dv);
      const tangentU = new THREE.Vector3(pu.x - p.x, pu.y - p.y, pu.z - p.z);
      const tangentV = new THREE.Vector3(pv.x - p.x, pv.y - p.y, pv.z - p.z);
      const normal = new THREE.Vector3().crossVectors(tangentU, tangentV).normalize();
      normals.push(normal.x, normal.y, normal.z);

      // Color by height
      const t = (p.y + 2) / 4; // normalize to 0-1
      const color = new THREE.Color().setHSL(0.6 - t * 0.6, 0.8, 0.5);
      colors.push(color.r, color.g, color.b);
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + j;
      const b = a + 1;
      const c = a + (segments + 1);
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }

  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  return geo;
}

// Usage — saddle surface
const saddleFn = (u, v) => ({
  x: u,
  y: u * u - v * v,
  z: v,
});
const surfaceGeo = createParametricSurface(saddleFn, [-2, 2], [-2, 2], 50);
const surfaceMat = new THREE.MeshStandardMaterial({
  vertexColors: true,
  side: THREE.DoubleSide,
  metalness: 0.1,
  roughness: 0.6,
});
const surfaceMesh = new THREE.Mesh(surfaceGeo, surfaceMat);
```

To animate: regenerate positions each frame with a time-dependent function, then set `geo.attributes.position.needsUpdate = true`.

## Pattern 2: Particle System (Physics, Fields)

InstancedMesh-based particles for fields, flows, forces.

```javascript
function createParticleSystem(count) {
  const geo = new THREE.SphereGeometry(0.05, 6, 6);
  const mat = new THREE.MeshBasicMaterial({ color: 0x88ccff });
  const particles = new THREE.InstancedMesh(geo, mat, count);
  const dummy = new THREE.Object3D();

  // Store particle state
  const state = [];
  for (let i = 0; i < count; i++) {
    state.push({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ),
      vel: new THREE.Vector3(0, 0, 0),
    });
    dummy.position.copy(state[i].pos);
    dummy.updateMatrix();
    particles.setMatrixAt(i, dummy.matrix);
  }
  particles.instanceMatrix.needsUpdate = true;

  return { mesh: particles, state, dummy, geo, mat };
}

// Update each frame
function updateParticles(system, forceField, delta) {
  const { mesh, state, dummy } = system;
  for (let i = 0; i < state.length; i++) {
    const p = state[i];
    const force = forceField(p.pos); // returns THREE.Vector3
    p.vel.add(force.multiplyScalar(delta));
    p.vel.multiplyScalar(0.99); // damping
    p.pos.add(p.vel.clone().multiplyScalar(delta));

    // Boundary wrapping
    ["x", "y", "z"].forEach((axis) => {
      if (Math.abs(p.pos[axis]) > 5) p.pos[axis] *= -0.9;
    });

    dummy.position.copy(p.pos);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
}

// Example force field: vortex
const vortexField = (pos) => {
  return new THREE.Vector3(-pos.z, 0, pos.x).normalize().multiplyScalar(2);
};
```

## Pattern 3: Mechanical Assembly (Gears, Linkages, Engines)

Compose primitives to represent mechanical parts, animate with angular relationships.

```javascript
function createGear(radius, teeth, thickness, color) {
  const group = new THREE.Group();

  // Hub
  const hubGeo = new THREE.CylinderGeometry(radius * 0.8, radius * 0.8, thickness, 32);
  const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.6, roughness: 0.3 });
  const hub = new THREE.Mesh(hubGeo, mat);
  hub.rotation.x = Math.PI / 2;
  group.add(hub);

  // Teeth (simplified as boxes around the perimeter)
  const toothGeo = new THREE.BoxGeometry(radius * 0.15, thickness, radius * 0.2);
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2;
    const tooth = new THREE.Mesh(toothGeo, mat);
    tooth.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
    tooth.rotation.y = -angle;
    group.add(tooth);
  }

  return { group, mat, hubGeo, toothGeo };
}

// Meshing two gears: if gear A has teeth_A and gear B has teeth_B,
// gear B rotates at -(teeth_A / teeth_B) times gear A's speed,
// and starts offset by half a tooth pitch.
function animateGearPair(gearA, gearB, teethA, teethB, elapsed, speed) {
  const angleA = elapsed * speed;
  const ratio = teethA / teethB;
  const angleB = -angleA * ratio + Math.PI / teethB; // offset for meshing

  gearA.group.rotation.y = angleA;
  gearB.group.rotation.y = angleB;
}
```

## Pattern 4: Wave Simulation (Sound, Light, Water)

Deform a plane geometry over time to show wave propagation.

```javascript
function createWavePlane(width, depth, segW, segD) {
  const geo = new THREE.PlaneGeometry(width, depth, segW, segD);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x2266cc,
    side: THREE.DoubleSide,
    wireframe: false,
    metalness: 0.2,
    roughness: 0.4,
  });
  const mesh = new THREE.Mesh(geo, mat);
  return { mesh, geo, mat };
}

function updateWave(geo, elapsed, params) {
  const { amplitude, frequency, wavelength, decay } = params;
  const positions = geo.attributes.position.array;
  const count = geo.attributes.position.count;

  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const z = positions[i * 3 + 2];
    const dist = Math.sqrt(x * x + z * z);

    // Circular wave from center
    const wave = amplitude * Math.sin(dist / wavelength * Math.PI * 2 - elapsed * frequency);
    const envelope = Math.exp(-dist * decay); // decay with distance
    positions[i * 3 + 1] = wave * envelope;
  }
  geo.attributes.position.needsUpdate = true;
  geo.computeVertexNormals();
}
```

## Pattern 5: Vector Field Visualization

Show directional data with arrows (force fields, gradients, flow).

```javascript
function createArrowGrid(gridSize, spacing, arrowLength) {
  const group = new THREE.Group();
  const arrows = [];

  for (let x = -gridSize; x <= gridSize; x += spacing) {
    for (let z = -gridSize; z <= gridSize; z += spacing) {
      const dir = new THREE.Vector3(0, 1, 0);
      const origin = new THREE.Vector3(x, 0, z);
      const arrow = new THREE.ArrowHelper(dir, origin, arrowLength, 0x44ff88, 0.15, 0.1);
      group.add(arrow);
      arrows.push({ arrow, origin: origin.clone() });
    }
  }

  return { group, arrows };
}

function updateVectorField(arrows, fieldFn, time) {
  arrows.forEach(({ arrow, origin }) => {
    const dir = fieldFn(origin, time); // returns THREE.Vector3
    const mag = dir.length();
    dir.normalize();
    arrow.setDirection(dir);
    arrow.setLength(Math.min(mag, 1.5), 0.15, 0.1);

    // Color by magnitude
    const hue = 0.33 - Math.min(mag / 3, 1) * 0.33; // green to red
    arrow.setColor(new THREE.Color().setHSL(hue, 0.9, 0.5));
  });
}
```

## Pattern 6: Orbit / Planetary Motion

Circular or elliptical motion for celestial mechanics, atomic models, etc.

```javascript
function createOrbiter(orbitRadius, bodyRadius, color, tilt) {
  const group = new THREE.Group();
  group.rotation.x = tilt || 0;

  // Orbit path (visual ring)
  const ringGeo = new THREE.RingGeometry(orbitRadius - 0.02, orbitRadius + 0.02, 64);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x444444,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  group.add(ring);

  // Orbiting body
  const bodyGeo = new THREE.SphereGeometry(bodyRadius, 16, 16);
  const bodyMat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.3 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  return { group, body, ring, orbitRadius, ringGeo, ringMat, bodyGeo, bodyMat };
}

function updateOrbiter(orbiter, elapsed, speed) {
  const angle = elapsed * speed;
  orbiter.body.position.set(
    Math.cos(angle) * orbiter.orbitRadius,
    0,
    Math.sin(angle) * orbiter.orbitRadius
  );
}
```

## Pattern 7: Spring / Pendulum (Oscillation)

Physical simulation with simple Euler integration.

```javascript
function simulateSpring(state, params, delta) {
  const { stiffness, damping, mass } = params;
  // F = -k * x - c * v
  const force = -stiffness * state.displacement - damping * state.velocity;
  const acceleration = force / mass;
  state.velocity += acceleration * delta;
  state.displacement += state.velocity * delta;
  return state;
}

function simulatePendulum(state, params, delta) {
  const { length, gravity, damping } = params;
  // θ'' = -(g/L) * sin(θ) - c * θ'
  const angularAccel = -(gravity / length) * Math.sin(state.angle) - damping * state.angularVel;
  state.angularVel += angularAccel * delta;
  state.angle += state.angularVel * delta;

  // Convert to Cartesian for rendering
  state.x = Math.sin(state.angle) * length;
  state.y = -Math.cos(state.angle) * length;
  return state;
}
```

## Pattern 8: Cross Section / Cutaway

Show internal structure by clipping or using transparent layers.

```javascript
// Transparent outer shell + opaque inner structure
function createCutaway(outerGeo, innerGeo) {
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0x8888ff,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0xff4444,
    metalness: 0.3,
    roughness: 0.5,
  });

  const outer = new THREE.Mesh(outerGeo, outerMat);
  const inner = new THREE.Mesh(innerGeo, innerMat);

  return { outer, inner, outerMat, innerMat };
}
```

## UI Control Patterns

### Slider with Live Value

```jsx
<label className="block">
  <span className="text-gray-300 text-xs flex justify-between">
    <span>Frequency</span>
    <span className="text-blue-400 font-mono">{freq.toFixed(1)} Hz</span>
  </span>
  <input
    type="range" min="0.1" max="10" step="0.1"
    value={freq}
    onChange={(e) => setFreq(parseFloat(e.target.value))}
    className="w-full mt-1 accent-blue-500"
  />
</label>
```

### Toggle Group

```jsx
<div className="flex gap-1">
  {["Sine", "Square", "Sawtooth"].map((label) => (
    <button
      key={label}
      onClick={() => setWaveType(label.toLowerCase())}
      className={`px-2 py-1 rounded text-xs transition-colors ${
        waveType === label.toLowerCase()
          ? "bg-blue-600 text-white"
          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
      }`}
    >
      {label}
    </button>
  ))}
</div>
```

### Info Panel (collapsible)

```jsx
const [showInfo, setShowInfo] = useState(false);

<button
  onClick={() => setShowInfo(!showInfo)}
  className="text-xs text-gray-400 hover:text-white transition-colors"
>
  {showInfo ? "Hide" : "Show"} explanation
</button>
{showInfo && (
  <div className="mt-2 text-xs text-gray-400 leading-relaxed">
    <p>Explanation of the concept goes here...</p>
  </div>
)}
```

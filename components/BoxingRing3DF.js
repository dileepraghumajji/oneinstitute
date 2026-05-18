'use client'

import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, MeshDistortMaterial, Sparkles, Trail } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const C_ORANGE   = 0xFF5300
const C_WHITE    = 0xFFFFFF
const C_BLACK    = 0x111111
const C_CHARCOAL = 0x1a1a1a

// ── Canvas texture helpers (client-only) ─────────────────────
function makeLogoTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024; canvas.height = 1024
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#EBEBEB'
  ctx.fillRect(0, 0, 1024, 1024)
  const cs = 200
  ctx.fillStyle = '#FF5300'
  ctx.fillRect(0, 0, cs, cs)
  ctx.fillRect(1024 - cs, 0, cs, cs)
  ctx.fillRect(0, 1024 - cs, cs, cs)
  ctx.fillRect(1024 - cs, 1024 - cs, cs, cs)
  ctx.strokeStyle = '#FF5300'; ctx.lineWidth = 18; ctx.globalAlpha = 0.35
  ctx.strokeRect(60, 60, 904, 904); ctx.globalAlpha = 1.0
  ctx.strokeStyle = '#FF5300'; ctx.lineWidth = 14; ctx.globalAlpha = 0.25
  ctx.beginPath(); ctx.arc(512, 512, 200, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1.0
  ctx.fillStyle = '#FF5300'; ctx.font = 'bold 220px Arial Black, Arial, sans-serif'
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.globalAlpha = 0.82
  ctx.fillText('ONE', 512, 490)
  ctx.fillStyle = '#1a1a1a'; ctx.font = 'bold 72px Arial, sans-serif'; ctx.globalAlpha = 0.65
  ctx.fillText('INSTITUTE', 512, 580)
  ctx.fillStyle = '#555555'; ctx.font = '36px Arial, sans-serif'; ctx.globalAlpha = 0.45
  ctx.fillText('OF MARTIAL ARTS', 512, 640); ctx.globalAlpha = 1.0
  return new THREE.CanvasTexture(canvas)
}

function makeTextTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048; canvas.height = 256
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#111111'; ctx.fillRect(0, 0, 2048, 256)
  ctx.fillStyle = '#FF5300'; ctx.font = 'bold 110px Arial Black, Arial, sans-serif'
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('ONE INSTITUTE', 1024, 128)
  return new THREE.CanvasTexture(canvas)
}

// ── Trail target — orbits above ring mat ─────────────────────
function MatTrailTarget() {
  const meshRef = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (meshRef.current) meshRef.current.position.set(Math.cos(t * 0.8) * 1.5, 1.45, Math.sin(t * 0.8) * 1.5)
  })
  return (
    <Trail width={0.08} length={8} color={new THREE.Color(C_ORANGE)} attenuation={(t) => t * t}>
      <mesh ref={meshRef} visible={false}>
        <sphereGeometry args={[0.01, 4, 4]} />
        <meshBasicMaterial />
      </mesh>
    </Trail>
  )
}

// ── Platform: base, LED strips (emissive), steps, corner sparkles ──
const LED_CONFIGS = (() => {
  const out = []
  for (let side = 0; side < 4; side++) {
    for (let row = 0; row < 3; row++) {
      const y = 0.25 + row * 0.35; const offset = 5.03
      let pos, rot
      if (side === 0)      { pos = [0, y, offset];  rot = [0, 0, 0] }
      else if (side === 1) { pos = [0, y, -offset]; rot = [0, 0, 0] }
      else if (side === 2) { pos = [offset, y, 0];  rot = [0, Math.PI / 2, 0] }
      else                 { pos = [-offset, y, 0]; rot = [0, Math.PI / 2, 0] }
      out.push({ pos, rot, key: `led-${side}-${row}` })
    }
  }
  return out
})()

const SPARKLE_CORNERS = [[-4.5, 4.5], [4.5, 4.5], [4.5, -4.5], [-4.5, -4.5]]

function Platform({ emissiveMat, dimMat }) {
  return (
    <group>
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 1.2, 10]} />
        <meshStandardMaterial color={C_BLACK} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.22, 0]} material={dimMat}>
        <boxGeometry args={[10.05, 0.04, 10.05]} />
      </mesh>
      {LED_CONFIGS.map(({ pos, rot, key }) => (
        <mesh key={key} position={pos} rotation={rot} material={emissiveMat}>
          <boxGeometry args={[9.2, 0.05, 0.08]} />
        </mesh>
      ))}
      {SPARKLE_CORNERS.map(([x, z], i) => (
        <Sparkles key={i} count={20} size={0.5} speed={0.3} color="#FF5300" position={[x, 0.3, z]} />
      ))}
      {[0, 1, 2].map(i => (
        <group key={i}>
          <mesh position={[0, 0.12 + i * 0.35, 5.4 + (2 - i) * 0.8]} receiveShadow>
            <boxGeometry args={[2.5, 0.25, 0.8]} />
            <meshStandardMaterial color={C_CHARCOAL} roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.25 + i * 0.35, 5.4 + (2 - i) * 0.8 + 0.38]} material={emissiveMat}>
            <boxGeometry args={[2.3, 0.03, 0.04]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── Ring surface, logo texture, text panel, trail ────────────
function RingMat({ onClick }) {
  const textures = useMemo(() => ({ logo: makeLogoTexture(), text: makeTextTexture() }), [])
  useEffect(() => () => { textures.logo.dispose(); textures.text.dispose() }, [textures])
  return (
    <group>
      <mesh position={[0, 1.32, 0]} receiveShadow onClick={onClick}>
        <boxGeometry args={[8.5, 0.12, 8.5]} />
        <meshStandardMaterial color={0xf0f0f0} roughness={0.6} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.39, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial map={textures.logo} roughness={0.6} transparent />
      </mesh>
      <mesh position={[0, 0.6, 5.03]}>
        <planeGeometry args={[8, 1]} />
        <meshStandardMaterial map={textures.text} roughness={0.4} transparent />
      </mesh>
      <MatTrailTarget />
    </group>
  )
}

// ── Corner posts with Float (subtle breathing) ───────────────
const POST_XZ = [[-3.9, -3.9], [3.9, -3.9], [3.9, 3.9], [-3.9, 3.9]]

function CornerPosts() {
  return (
    <group>
      {POST_XZ.map(([x, z], i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
          <group>
            <mesh position={[x, 2.8, z]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 3.2, 16]} />
              <meshStandardMaterial color={C_WHITE} roughness={0.4} />
            </mesh>
            <mesh position={[x, 1.35, z]}>
              <cylinderGeometry args={[0.18, 0.2, 0.3, 16]} />
              <meshStandardMaterial color={C_CHARCOAL} roughness={0.3} metalness={0.4} />
            </mesh>
            <mesh position={[x, 4.5, z]}>
              <cylinderGeometry args={[0.06, 0.14, 0.2, 16]} />
              <meshStandardMaterial color={C_ORANGE} roughness={0.3} metalness={0.1} />
            </mesh>
            <mesh position={[x, 2.8, z]}>
              <boxGeometry args={[0.3, 2.4, 0.3]} />
              <meshStandardMaterial color={i === 0 || i === 2 ? C_ORANGE : C_WHITE} roughness={0.3} metalness={0.1} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  )
}

// ── Ropes: catmull-rom tubes with MeshDistortMaterial ────────
const POST_POSITIONS = [{ x: -3.9, z: -3.9 }, { x: 3.9, z: -3.9 }, { x: 3.9, z: 3.9 }, { x: -3.9, z: 3.9 }]
const ROPE_HEIGHTS   = [1.9, 2.6, 3.3, 4.0]
const ROPE_COLORS    = [C_ORANGE, C_WHITE, C_ORANGE, C_WHITE]

function Ropes() {
  const ropeData = useMemo(() => {
    const corners = POST_POSITIONS.map(p => new THREE.Vector3(p.x, 0, p.z))
    const data = []
    ROPE_HEIGHTS.forEach((rh, ri) => {
      for (let ci = 0; ci < 4; ci++) {
        const c1 = corners[ci]; const c2 = corners[(ci + 1) % 4]
        const pts = []
        for (let t = 0; t <= 1; t += 0.05) {
          const p = new THREE.Vector3().lerpVectors(
            new THREE.Vector3(c1.x, rh, c1.z),
            new THREE.Vector3(c2.x, rh, c2.z),
            t
          )
          p.y -= Math.sin(t * Math.PI) * 0.06
          pts.push(p)
        }
        data.push({
          geo: new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.035, 8, false),
          color: ROPE_COLORS[ri],
          key: `rope-${ri}-${ci}`,
        })
      }
    })
    return data
  }, [])
  useEffect(() => () => ropeData.forEach(r => r.geo.dispose()), [ropeData])
  return (
    <group>
      {ropeData.map(({ geo, color, key }) => (
        <mesh key={key} geometry={geo} castShadow>
          <MeshDistortMaterial color={color} distort={0.02} speed={1} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

// ── Particle system ──────────────────────────────────────────
const N = 300
const PDUR = 0.8

function Particles({ impactRef }) {
  const pos  = useMemo(() => new Float32Array(N * 3), [])
  const vel  = useMemo(() => new Float32Array(N * 3), [])
  const life = useMemo(() => new Float32Array(N), [])
  const geo  = useMemo(() => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); return g }, [pos])
  const ptRef  = useRef()
  const matRef = useRef()
  const state  = useRef({ active: false, startTime: null })

  useEffect(() => {
    impactRef.current = (x, y, z) => {
      state.current = { active: true, startTime: null }
      for (let i = 0; i < N; i++) {
        const i3 = i * 3
        pos[i3] = x; pos[i3 + 1] = y; pos[i3 + 2] = z
        const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1); const spd = 2 + Math.random() * 5
        vel[i3]     = Math.sin(phi) * Math.cos(theta) * spd
        vel[i3 + 1] = Math.abs(Math.sin(phi) * Math.sin(theta)) * spd * 1.2
        vel[i3 + 2] = Math.cos(phi) * spd
        life[i] = 0.5 + Math.random() * 0.5
      }
      if (ptRef.current) ptRef.current.geometry.attributes.position.needsUpdate = true
    }
  }, [impactRef, pos, vel, life])

  useFrame(({ clock }) => {
    const s = state.current
    if (!s.active || !matRef.current) return
    const t = clock.getElapsedTime()
    if (s.startTime === null) s.startTime = t
    const elapsed = t - s.startTime; const progress = elapsed / PDUR
    if (progress >= 1) { s.active = false; matRef.current.opacity = 0; return }
    matRef.current.opacity = 1 - progress
    for (let i = 0; i < N; i++) {
      const i3 = i * 3; const lp = Math.min(elapsed / life[i], 1); const eo = 1 - Math.pow(1 - lp, 3)
      pos[i3]     += vel[i3]     * 0.016 * (1 - eo)
      pos[i3 + 1] += (vel[i3 + 1] * 0.016 * (1 - eo)) - 0.003
      pos[i3 + 2] += vel[i3 + 2] * 0.016 * (1 - eo)
    }
    if (ptRef.current) ptRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ptRef} geometry={geo}>
      <pointsMaterial ref={matRef} color={C_ORANGE} size={0.08} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

// ── OrbitControls: pause autoRotate on hover ─────────────────
function SceneControls() {
  const ctrlRef = useRef(); const timerRef = useRef()
  useEffect(() => {
    const onHover = (e) => {
      if (!ctrlRef.current) return
      if (e.detail.hover) {
        clearTimeout(timerRef.current); ctrlRef.current.autoRotate = false
      } else {
        timerRef.current = setTimeout(() => { if (ctrlRef.current) ctrlRef.current.autoRotate = true }, 2000)
      }
    }
    window.addEventListener('ring-hover', onHover)
    return () => { window.removeEventListener('ring-hover', onHover); clearTimeout(timerRef.current) }
  }, [])
  return (
    <OrbitControls ref={ctrlRef} enableDamping dampingFactor={0.05}
      minDistance={14} maxDistance={32} maxPolarAngle={Math.PI / 2.2}
      target={[0, 1, 0]} autoRotate autoRotateSpeed={0.35} />
  )
}

// ── Full ring scene ──────────────────────────────────────────
function RingScene() {
  const impactRef = useRef(null)
  const flashRef  = useRef({ active: false, startTime: null })
  const glowRef   = useRef(1.0)
  const spotRef   = useRef()

  const emissiveMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: C_ORANGE, emissive: C_ORANGE, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0,
  }), [])
  const dimMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: C_ORANGE, emissive: C_ORANGE, emissiveIntensity: 1.0, roughness: 0.2, metalness: 0,
  }), [])

  useEffect(() => {
    const onGlow   = (e) => { glowRef.current = e.detail.intensity }
    const onImpact = () => { flashRef.current = { active: true, startTime: null } }
    window.addEventListener('ring-glow', onGlow)
    window.addEventListener('ring-impact', onImpact)
    return () => {
      window.removeEventListener('ring-glow', onGlow)
      window.removeEventListener('ring-impact', onImpact)
      emissiveMat.dispose(); dimMat.dispose()
    }
  }, [emissiveMat, dimMat])

  // Wire spotlight target below the mat
  useEffect(() => {
    if (!spotRef.current) return
    spotRef.current.target.position.set(0, 1.3, 0)
    spotRef.current.target.updateMatrixWorld()
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime(); const fl = flashRef.current; const glow = glowRef.current
    if (fl.active) {
      if (fl.startTime === null) fl.startTime = t
      const el = t - fl.startTime
      if (el < 0.6) {
        emissiveMat.emissiveIntensity = 5 - 2.5 * (el / 0.6)
      } else {
        fl.active = false
        emissiveMat.emissiveIntensity = (1.5 + Math.sin(t * 2) * 1.0) * glow
      }
    } else {
      emissiveMat.emissiveIntensity = (1.5 + Math.sin(t * 2) * 1.0) * glow
    }
  })

  const handleMatClick = (e) => {
    e.stopPropagation()
    if (impactRef.current) impactRef.current(e.point.x, e.point.y, e.point.z)
    window.dispatchEvent(new CustomEvent('ring-punch', { detail: { time: Date.now() } }))
  }

  return (
    <>
      <fogExp2 attach="fog" args={['#0a0a0a', 0.009]} />

      <ambientLight color={0x111111} intensity={0.8} />
      <directionalLight color={0xfff5e6} intensity={2.5} position={[8, 15, 5]} castShadow
        shadow-mapSize-width={1024} shadow-mapSize-height={1024}
        shadow-camera-near={1} shadow-camera-far={40}
        shadow-camera-left={-12} shadow-camera-right={12}
        shadow-camera-top={12} shadow-camera-bottom={-12}
        shadow-bias={-0.001} shadow-normalBias={0.02} />
      <directionalLight color={0xFF7733} intensity={1.0} position={[-10, 8, -3]} />
      <directionalLight color={0xFF5300} intensity={1.5} position={[0, 10, -10]} />
      {[[-5, -5], [5, -5], [5, 5], [-5, 5]].map(([x, z], i) => (
        <pointLight key={i} color={0xFF5300} intensity={3} distance={10} decay={2} position={[x, 0.3, z]} />
      ))}
      <spotLight ref={spotRef} color={0xFFFFFF} intensity={6} distance={35}
        angle={Math.PI / 5.5} penumbra={0.4} decay={1} position={[0, 15, 0]} castShadow />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={0x050505} roughness={0.95} />
      </mesh>

      <Platform emissiveMat={emissiveMat} dimMat={dimMat} />
      <RingMat onClick={handleMatClick} />
      <CornerPosts />
      <Ropes />
      <Particles impactRef={impactRef} />
      <SceneControls />
    </>
  )
}

// ── Canvas wrapper ───────────────────────────────────────────
export default function BoxingRing3DF() {
  return (
    <div
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
      onMouseEnter={() => window.dispatchEvent(new CustomEvent('ring-hover', { detail: { hover: true } }))}
      onMouseLeave={() => window.dispatchEvent(new CustomEvent('ring-hover', { detail: { hover: false } }))}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 13, 22], fov: 38, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2
          gl.setClearColor(0x000000, 0)
        }}
      >
        <RingScene />
        <EffectComposer>
          <Bloom luminanceThreshold={0.85} intensity={0.6} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

export default function BoxingRing3D() {
  const containerRef = useRef(null)
  const sceneRef = useRef({})

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight

    // ── Scene ───────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.009)

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 200)
    camera.position.set(0, 13, 22)
    camera.lookAt(0, 1, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // ── Post-processing ─────────────────────────────────────
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.6, 0.4, 0.85)
    composer.addPass(bloomPass)
    composer.addPass(new OutputPass())

    // ── Controls ────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 14
    controls.maxDistance = 32
    controls.maxPolarAngle = Math.PI / 2.2
    controls.target.set(0, 1, 0)
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.35

    // ── 5.3 Auto-rotation pause on hover ────────────────────
    let autoRotateResumeTimeout = null
    const handleMouseEnter = () => {
      controls.autoRotate = false
      if (autoRotateResumeTimeout) clearTimeout(autoRotateResumeTimeout)
    }
    const handleMouseLeave = () => {
      autoRotateResumeTimeout = setTimeout(() => {
        controls.autoRotate = true
      }, 2000)
    }
    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    // ── Materials ───────────────────────────────────────────
    const ORANGE   = 0xFF5300
    const WHITE    = 0xFFFFFF
    const BLACK    = 0x111111
    const CHARCOAL = 0x1a1a1a

    const orangeMat      = new THREE.MeshStandardMaterial({ color: ORANGE, roughness: 0.3, metalness: 0.1 })
    const whiteMat       = new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.4, metalness: 0.0 })
    const blackMat       = new THREE.MeshStandardMaterial({ color: BLACK, roughness: 0.2, metalness: 0.5 })
    const charcoalMat    = new THREE.MeshStandardMaterial({ color: CHARCOAL, roughness: 0.3, metalness: 0.4 })
    const orangeEmissive = new THREE.MeshStandardMaterial({
      color: ORANGE, emissive: ORANGE, emissiveIntensity: 2.5, roughness: 0.1, metalness: 0.0,
    })
    const orangeEmissiveDim = new THREE.MeshStandardMaterial({
      color: ORANGE, emissive: ORANGE, emissiveIntensity: 1.0, roughness: 0.2, metalness: 0.0,
    })

    // ── Platform base ───────────────────────────────────────
    const platformGroup = new THREE.Group()

    const platform = new THREE.Mesh(new THREE.BoxGeometry(10, 1.2, 10), blackMat)
    platform.position.y = 0.6
    platform.castShadow = true
    platform.receiveShadow = true
    platformGroup.add(platform)

    const platformTrim = new THREE.Mesh(new THREE.BoxGeometry(10.05, 0.04, 10.05), orangeEmissiveDim)
    platformTrim.position.y = 1.22
    platformGroup.add(platformTrim)

    function createLedStrip(width, position, rotation) {
      const strip = new THREE.Mesh(new THREE.BoxGeometry(width, 0.05, 0.08), orangeEmissive)
      strip.position.copy(position)
      if (rotation) strip.rotation.copy(rotation)
      return strip
    }

    for (let side = 0; side < 4; side++) {
      for (let row = 0; row < 3; row++) {
        const y = 0.25 + row * 0.35
        const offset = 5.03
        let pos, rot
        if (side === 0)      { pos = new THREE.Vector3(0, y, offset);  rot = new THREE.Euler(0, 0, 0) }
        else if (side === 1) { pos = new THREE.Vector3(0, y, -offset); rot = new THREE.Euler(0, 0, 0) }
        else if (side === 2) { pos = new THREE.Vector3(offset, y, 0);  rot = new THREE.Euler(0, Math.PI / 2, 0) }
        else                 { pos = new THREE.Vector3(-offset, y, 0); rot = new THREE.Euler(0, Math.PI / 2, 0) }
        platformGroup.add(createLedStrip(9.2, pos, rot))
      }
    }

    for (let i = 0; i < 3; i++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.25, 0.8), charcoalMat)
      step.position.set(0, 0.12 + i * 0.35, 5.4 + (2 - i) * 0.8)
      step.receiveShadow = true
      platformGroup.add(step)

      const stepLed = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.03, 0.04), orangeEmissive)
      stepLed.position.set(0, 0.25 + i * 0.35, 5.4 + (2 - i) * 0.8 + 0.38)
      platformGroup.add(stepLed)
    }

    // ── Emissive flash state ─────────────────────────────────
    let flashActive = false
    let flashStartTime = null

    const handleRingImpact = () => {
      flashActive = true
      flashStartTime = null
    }
    window.addEventListener('ring-impact', handleRingImpact)

    scene.add(platformGroup)

    // ── Ring surface ────────────────────────────────────────
    const ringGroup = new THREE.Group()

    const matMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.6, metalness: 0.0 })
    const ringMat = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.12, 8.5), matMaterial)
    ringMat.position.y = 1.32
    ringMat.receiveShadow = true
    ringGroup.add(ringMat)

    // Canvas logo texture on ring mat — real boxing mat design
    const logoCanvas = document.createElement('canvas')
    logoCanvas.width = 1024
    logoCanvas.height = 1024
    const ctx = logoCanvas.getContext('2d')

    // Mat base — off-white
    ctx.fillStyle = '#EBEBEB'
    ctx.fillRect(0, 0, 1024, 1024)

    // Orange corner accent squares
    const cs = 200
    ctx.fillStyle = '#FF5300'
    ctx.fillRect(0, 0, cs, cs)
    ctx.fillRect(1024 - cs, 0, cs, cs)
    ctx.fillRect(0, 1024 - cs, cs, cs)
    ctx.fillRect(1024 - cs, 1024 - cs, cs, cs)

    // Thin orange border stripe inside edge
    ctx.strokeStyle = '#FF5300'
    ctx.lineWidth = 18
    ctx.globalAlpha = 0.35
    ctx.strokeRect(60, 60, 904, 904)
    ctx.globalAlpha = 1.0

    // Center circle (ring ref circle)
    ctx.strokeStyle = '#FF5300'
    ctx.lineWidth = 14
    ctx.globalAlpha = 0.25
    ctx.beginPath()
    ctx.arc(512, 512, 200, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 1.0

    // "ONE" — large orange
    ctx.fillStyle = '#FF5300'
    ctx.font = 'bold 220px Arial Black, Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.globalAlpha = 0.82
    ctx.fillText('ONE', 512, 490)

    // "INSTITUTE" — dark, slightly smaller
    ctx.fillStyle = '#1a1a1a'
    ctx.font = 'bold 72px Arial, sans-serif'
    ctx.globalAlpha = 0.65
    ctx.fillText('INSTITUTE', 512, 580)

    // "OF MARTIAL ARTS" — faint label
    ctx.fillStyle = '#555555'
    ctx.font = '36px Arial, sans-serif'
    ctx.globalAlpha = 0.45
    ctx.fillText('OF MARTIAL ARTS', 512, 640)

    ctx.globalAlpha = 1.0

    const logoTexture = new THREE.CanvasTexture(logoCanvas)
    const logoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshStandardMaterial({ map: logoTexture, roughness: 0.6, transparent: true }),
    )
    logoMesh.rotation.x = -Math.PI / 2
    logoMesh.position.y = 1.39
    ringGroup.add(logoMesh)

    scene.add(ringGroup)

    // ── Corner posts ────────────────────────────────────────
    const postsGroup = new THREE.Group()
    const postPositions = [
      { x: -3.9, z: -3.9 }, { x: 3.9, z: -3.9 },
      { x: 3.9, z: 3.9 },   { x: -3.9, z: 3.9 },
    ]

    postPositions.forEach((pos, i) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16), whiteMat)
      post.position.set(pos.x, 2.8, pos.z)
      post.castShadow = true
      postsGroup.add(post)

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.3, 16), charcoalMat)
      base.position.set(pos.x, 1.35, pos.z)
      postsGroup.add(base)

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.14, 0.2, 16), orangeMat)
      cap.position.set(pos.x, 4.5, pos.z)
      postsGroup.add(cap)

      const padMat = (i === 0 || i === 2) ? orangeMat : whiteMat
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.4, 0.3), padMat)
      pad.position.set(pos.x, 2.8, pos.z)
      postsGroup.add(pad)
    })

    scene.add(postsGroup)

    // ── Ropes ───────────────────────────────────────────────
    const ropesGroup = new THREE.Group()
    const ropeHeights = [1.9, 2.6, 3.3, 4.0]
    const ropeColors  = [orangeMat, whiteMat, orangeMat, whiteMat]

    function createRope(start, end, material) {
      const points = []
      for (let t = 0; t <= 1; t += 0.05) {
        const p = new THREE.Vector3().lerpVectors(start, end, t)
        p.y -= Math.sin(t * Math.PI) * 0.06
        points.push(p)
      }
      const rope = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 20, 0.035, 8, false),
        material,
      )
      rope.castShadow = true
      return rope
    }

    const corners = postPositions.map(p => new THREE.Vector3(p.x, 0, p.z))
    ropeHeights.forEach((rh, ri) => {
      for (let ci = 0; ci < 4; ci++) {
        const c1 = corners[ci], c2 = corners[(ci + 1) % 4]
        ropesGroup.add(createRope(
          new THREE.Vector3(c1.x, rh, c1.z),
          new THREE.Vector3(c2.x, rh, c2.z),
          ropeColors[ri],
        ))
      }
    })

    scene.add(ropesGroup)

    // ── 5.1 Particle impact system ───────────────────────────
    const PARTICLE_COUNT = 300
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3)
    const particleVelocities = new Float32Array(PARTICLE_COUNT * 3)
    const particleAlphas = new Float32Array(PARTICLE_COUNT)
    const particleLifetimes = new Float32Array(PARTICLE_COUNT)

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute('alpha', new THREE.BufferAttribute(particleAlphas, 1))

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xFF5300,
      size: 0.08,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particleGeo, particleMaterial)
    scene.add(particles)

    let particlesActive = false
    let particleStartTime = 0
    const PARTICLE_DURATION = 0.8

    function triggerImpact(x, y, z) {
      particlesActive = true
      particleStartTime = time
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3
        particlePositions[i3]     = x
        particlePositions[i3 + 1] = y
        particlePositions[i3 + 2] = z
        // Random velocity in a sphere
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const speed = 2 + Math.random() * 5
        particleVelocities[i3]     = Math.sin(phi) * Math.cos(theta) * speed
        particleVelocities[i3 + 1] = Math.abs(Math.sin(phi) * Math.sin(theta)) * speed * 1.2
        particleVelocities[i3 + 2] = Math.cos(phi) * speed
        particleAlphas[i] = 1.0
        particleLifetimes[i] = 0.5 + Math.random() * 0.5
      }
      particleGeo.attributes.position.needsUpdate = true
      particleGeo.attributes.alpha.needsUpdate = true
    }

    // Store triggerImpact on the container element so Hero can access it
    container.dataset.ringReady = 'true'
    container.__triggerImpact = triggerImpact

    // Raycaster for click-to-impact
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    const handleCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObject(ringMat)
      if (intersects.length > 0) {
        const p = intersects[0].point
        triggerImpact(p.x, p.y, p.z)
      } else {
        // If missed the mat, impact at a default center point
        triggerImpact(0, 1.4, 0)
      }

      // Dispatch event for punch-speed tracker
      window.dispatchEvent(new CustomEvent('ring-punch', { detail: { time: Date.now() } }))
    }
    renderer.domElement.addEventListener('click', handleCanvasClick)
    renderer.domElement.addEventListener('touchstart', (e) => {
      const touch = e.touches[0]
      if (touch) {
        handleCanvasClick({ clientX: touch.clientX, clientY: touch.clientY })
      }
    }, { passive: true })

    // ── Platform text ────────────────────────────────────────
    const textCanvas = document.createElement('canvas')
    textCanvas.width = 2048; textCanvas.height = 256
    const tctx = textCanvas.getContext('2d')
    tctx.fillStyle = '#111111'
    tctx.fillRect(0, 0, 2048, 256)
    tctx.fillStyle = '#FF5300'
    tctx.font = 'bold 110px Arial Black, Arial, sans-serif'
    tctx.textAlign = 'center'
    tctx.textBaseline = 'middle'
    tctx.fillText('ONE INSTITUTE', 1024, 128)

    const textTexture = new THREE.CanvasTexture(textCanvas)
    const textPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 1),
      new THREE.MeshStandardMaterial({ map: textTexture, roughness: 0.4, transparent: true }),
    )
    textPlane.position.set(0, 0.6, 5.03)
    scene.add(textPlane)

    // ── Lighting ────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x111111, 0.8))

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5)
    keyLight.position.set(8, 15, 5)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(2048, 2048)
    keyLight.shadow.camera.near = 1
    keyLight.shadow.camera.far  = 40
    keyLight.shadow.camera.left   = -12; keyLight.shadow.camera.right  = 12
    keyLight.shadow.camera.top    = 12;  keyLight.shadow.camera.bottom = -12
    keyLight.shadow.bias       = -0.001
    keyLight.shadow.normalBias = 0.02
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xFF7733, 1.0)
    fillLight.position.set(-10, 8, -3)
    scene.add(fillLight)

    const rimLight = new THREE.DirectionalLight(0xFF5300, 1.5)
    rimLight.position.set(0, 10, -10)
    scene.add(rimLight)

    ;[{ x: -5, z: -5 }, { x: 5, z: -5 }, { x: 5, z: 5 }, { x: -5, z: 5 }].forEach(p => {
      const pl = new THREE.PointLight(0xFF5300, 3, 10, 2)
      pl.position.set(p.x, 0.3, p.z)
      scene.add(pl)
    })

    const spotLight = new THREE.SpotLight(0xFFFFFF, 6, 35, Math.PI / 5.5, 0.4, 1)
    spotLight.position.set(0, 15, 0)
    spotLight.target.position.set(0, 1.3, 0)
    spotLight.castShadow = true
    scene.add(spotLight, spotLight.target)

    // ── Ground ──────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.95 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // ── 5.4 Glow intensity linked to scroll ──────────────────
    let glowMultiplier = 1.0
    const handleGlowChange = (e) => {
      glowMultiplier = e.detail.intensity
    }
    window.addEventListener('ring-glow', handleGlowChange)

    // Store ref for cleanup
    sceneRef.current = { controls, orangeEmissive }

    // ── Animation loop ──────────────────────────────────────
    let time = 0
    renderer.setAnimationLoop(() => {
      time += 0.016
      controls.update()

      // Flash from ring-impact event
      if (flashActive) {
        if (flashStartTime === null) flashStartTime = time
        const elapsed = time - flashStartTime
        if (elapsed < 0.6) {
          orangeEmissive.emissiveIntensity = 5 - 2.5 * (elapsed / 0.6)
        } else {
          flashActive = false
          orangeEmissive.emissiveIntensity = (1.5 + Math.sin(time * 2) * 1.0) * glowMultiplier
        }
      } else {
        orangeEmissive.emissiveIntensity = (1.5 + Math.sin(time * 2) * 1.0) * glowMultiplier
      }

      // Animate particles
      if (particlesActive) {
        const elapsed = time - particleStartTime
        const progress = elapsed / PARTICLE_DURATION
        if (progress >= 1) {
          particlesActive = false
          particleMaterial.opacity = 0
        } else {
          particleMaterial.opacity = 1 - progress
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            const lifeProgress = Math.min(elapsed / particleLifetimes[i], 1)
            const easeOut = 1 - Math.pow(1 - lifeProgress, 3) // cubic ease-out
            particlePositions[i3]     += particleVelocities[i3] * 0.016 * (1 - easeOut)
            particlePositions[i3 + 1] += (particleVelocities[i3 + 1] * 0.016 * (1 - easeOut)) - 0.003 // gravity
            particlePositions[i3 + 2] += particleVelocities[i3 + 2] * 0.016 * (1 - easeOut)
          }
          particleGeo.attributes.position.needsUpdate = true
        }
      }

      composer.render()
    })

    // ── Resize ──────────────────────────────────────────────
    const handleResize = () => {
      const nw = container.clientWidth
      const nh = container.clientHeight
      if (!nw || !nh) return
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
      composer.setSize(nw, nh)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('ring-impact', handleRingImpact)
      window.removeEventListener('ring-glow', handleGlowChange)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
      if (autoRotateResumeTimeout) clearTimeout(autoRotateResumeTimeout)
      renderer.domElement.removeEventListener('click', handleCanvasClick)
      renderer.setAnimationLoop(null)
      renderer.dispose()
      particleGeo.dispose()
      particleMaterial.dispose()
      logoTexture.dispose()
      textTexture.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} aria-hidden="true" />
}

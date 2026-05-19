'use client'

import { useEffect, useRef } from 'react'

export default function Grain() {
  const canvasRef = useRef()

  useEffect(() => {
    if ('ontouchstart' in window) return

    const canvas = canvasRef.current
    if (!canvas) return

    canvas.style.display = 'block'
    const ctx = canvas.getContext('2d')

    function drawNoise() {
      const { width, height } = canvas
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255
        data[i + 1] = 255
        data[i + 2] = 255
        data[i + 3] = Math.random() > 0.5 ? 20 : 0 // ~rgba(255,255,255,0.08)
      }

      ctx.putImageData(imageData, 0, 0)
    }

    let rafId
    let lastDraw = 0

    function tick(now) {
      if (now - lastDraw >= 80) {
        drawNoise()
        lastDraw = now
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={200}
      height={200}
      style={{
        display: 'none',
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9997,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}
      aria-hidden="true"
    />
  )
}

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from './shaders/cloth.vert.glsl?raw'
import fragmentShader from './shaders/cloth.frag.glsl?raw'

export const buildTextTexture = (lines) => {
  const w = 2048
  const h = 1024
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '360px "Oculi", sans-serif'

  const lineHeight = 380
  const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + i * lineHeight)
  })

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

export default function ClothText({
  texture,
  position = [-1.0, 0.05, -0.6],
  rotation = [0, 0.24, 0],
}) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.085 },
      uSpeed: { value: 0.55 },
      uTexture: { value: texture },
      uTint: { value: new THREE.Color('#ffffff') },
    }),
    [texture],
  )

  const materialRef = useRef()

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  if (!texture) return null

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[2.8, 1.6, 96, 56]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

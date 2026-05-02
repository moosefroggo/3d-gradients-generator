import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from './store'
import { createOrbMaterial } from './lib/createOrbMaterial'

export default function Orb({ textTexture, position = [0, 0, -8], mode = 'foreground', speed, colors: propColors, ...props }) {
  const meshRef = useRef()
  const store = useStore()
  const { viewport } = useThree()
  
  const isBg = mode === 'background'
  const quality = isBg ? 0 : store.quality
  const materialType = isBg ? 'basic' : store.materialType
  const activeColors = propColors || store.colors
  const evolutionSpeed = speed !== undefined ? speed : (isBg ? 0.1 : store.evolutionSpeed)
  
  const shapeType = store.shapeType
  const noiseType = store.noiseType
  const frequency = isBg ? Math.min(store.frequency, 0.4) : store.frequency
  const amplitude = isBg ? Math.min(store.amplitude, 0.1) : store.amplitude
  const gradientType = store.gradientType
  const fullscreen = store.fullscreen

  const customUniforms = useMemo(() => ({
    uColors: { value: Array.from({ length: 8 }, () => new THREE.Color()) },
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uTextMask: { value: null },
    uNoiseType: { value: 0 },
    uFrequency: { value: 0 },
    uAmplitude: { value: 0 },
    uEvolutionSpeed: { value: 0 },
    uScaleX: { value: 0 },
    uScaleY: { value: 0 },
    uScaleZ: { value: 0 },
    uGradientType: { value: 0 }
  }), [])

  const sphereArgs = useMemo(() => [1.4, quality === 0 ? 64 : quality === 1 ? 128 : 256, quality === 0 ? 128 : quality === 1 ? 256 : 512], [quality])
  const boxArgs = useMemo(() => [2, 2, 2, quality === 0 ? 32 : quality === 1 ? 64 : 128, quality === 0 ? 32 : quality === 1 ? 64 : 128, quality === 0 ? 32 : quality === 1 ? 64 : 128], [quality])
  const torusArgs = useMemo(() => [1.2, 0.4, quality === 0 ? 48 : quality === 1 ? 96 : 160, quality === 0 ? 96 : quality === 1 ? 192 : 320], [quality])
  const cylinderArgs = useMemo(() => [1.2, 1.2, 2.5, quality === 0 ? 48 : quality === 1 ? 96 : 160, quality === 0 ? 48 : quality === 1 ? 96 : 160], [quality])
  const planeArgs = useMemo(() => [2, 2, quality === 0 ? 64 : quality === 1 ? 128 : 256, quality === 0 ? 64 : quality === 1 ? 128 : 256], [quality])

  const material = useMemo(() => {
    return createOrbMaterial(materialType, customUniforms, {
      mode,
      roughness: store.roughness,
      metalness: store.metalness,
      transmission: store.transmission,
      ior: store.ior,
      thickness: store.thickness
    })
  }, [materialType, mode, store.roughness, store.metalness, store.transmission, store.ior, store.thickness])

  // Calculate scaling for edge-to-edge
  const finalScale = useMemo(() => {
    if (!fullscreen) return [store.scaleX, store.scaleY, store.scaleZ]
    
    // Stable fallback for viewport scaling
    // Camera is at z=4, Orb is at z=-4. Distance = 8.
    // Standard viewport is calculated at distance camera.position.z from the camera.
    // So the scale factor to fill the screen at distance 8 is roughly 2.0x the z=0 viewport.
    const factor = 2.0 
    const s = Math.max(viewport.width, viewport.height) * factor * 1.2
    return [s, s, s]
  }, [fullscreen, viewport.width, viewport.height, store.scaleX, store.scaleY])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    customUniforms.uTime.value = t
    customUniforms.uTextMask.value = textTexture

    // Seamless one-way morph: start as a sphere (0), transform into a blob (1) and stay there
    customUniforms.uMorph.value = isBg ? 1.0 : Math.max(0, Math.min(1.0, (t - 0.5) / 4.0));
    customUniforms.uNoiseType.value = noiseType
    customUniforms.uFrequency.value = frequency
    customUniforms.uAmplitude.value = amplitude
    customUniforms.uEvolutionSpeed.value = evolutionSpeed
    customUniforms.uScaleX.value = finalScale[0]
    customUniforms.uScaleY.value = finalScale[1]
    customUniforms.uScaleZ.value = finalScale[2]
    customUniforms.uGradientType.value = gradientType
    
    // Update colors if they changed
    activeColors.forEach((c, i) => {
      if (customUniforms.uColors.value[i]) {
        customUniforms.uColors.value[i].set(c)
      }
    })

    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.04
    }
  })

  return (
    <mesh ref={meshRef} position={position} material={material} {...props} scale={finalScale}>
      {shapeType === 'sphere' && <sphereGeometry args={sphereArgs} />}
      {shapeType === 'box' && <boxGeometry args={boxArgs} />}
      {shapeType === 'torus' && <torusGeometry args={torusArgs} />}
      {shapeType === 'cylinder' && <cylinderGeometry args={cylinderArgs} />}
      {shapeType === 'plane' && <planeGeometry args={planeArgs} />}
    </mesh>
  )
}

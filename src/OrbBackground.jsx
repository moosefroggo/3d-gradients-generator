import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createOrbMaterial } from './lib/createOrbMaterial'

function OrbBackgroundMesh({ colors, noiseType, frequency, amplitude, speed, materialType, scaleX = 2.5, scaleY = 2.5 }) {
  const meshRef = useRef()

  const customUniforms = useMemo(() => ({
    uColors: { value: Array.from({ length: 8 }, () => new THREE.Color()) },
    uTime: { value: 0 },
    uMorph: { value: 1.0 },
    uTextMask: { value: null },
    uNoiseType: { value: 0 },
    uFrequency: { value: 0 },
    uAmplitude: { value: 0 },
    uEvolutionSpeed: { value: 0 },
    uScaleX: { value: 0 },
    uScaleY: { value: 0 }
  }), [])

  const material = useMemo(() => {
    return createOrbMaterial(materialType, customUniforms, { mode: 'background' })
  }, [materialType, customUniforms])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    customUniforms.uTime.value = t
    customUniforms.uNoiseType.value = noiseType
    customUniforms.uFrequency.value = frequency
    customUniforms.uAmplitude.value = amplitude
    customUniforms.uEvolutionSpeed.value = speed
    customUniforms.uScaleX.value = scaleX
    customUniforms.uScaleY.value = scaleY

    colors.forEach((c, i) => {
      if (customUniforms.uColors.value[i]) {
        customUniforms.uColors.value[i].set(c)
      }
    })

    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 0.6) * 0.04
    }
  })

  // Quality 0 (64x128) hardcoded for pure background rendering
  return (
    <mesh ref={meshRef} scale={[scaleX, scaleY, 2.5]} material={material}>
      <sphereGeometry args={[1.4, 64, 128]} />
    </mesh>
  )
}

export default function OrbBackground({
  colors = ['#F1ECCE', '#D6D2CB', '#F4EAE2', '#F2EFE9', '#D9DEE0', '#EFCAB5', '#C7E1D4', '#DCD2DD'],
  noiseType = 0,
  frequency = 0.4,
  amplitude = 0.1,
  speed = 0.1,
  materialType = 'basic',
  className = ""
}) {
  return (
    <div className={className} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
      <Canvas dpr={1} gl={{ antialias: false, powerPreference: 'low-power' }} camera={{ position: [0, 0, 4], fov: 48 }}>
        <OrbBackgroundMesh 
          colors={colors}
          noiseType={noiseType}
          frequency={frequency}
          amplitude={amplitude}
          speed={speed}
          materialType={materialType}
        />
      </Canvas>
    </div>
  )
}

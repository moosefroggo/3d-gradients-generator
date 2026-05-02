import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Environment, Lightformer } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import Orb from './Orb.jsx'
import ClothText, { buildTextTexture } from './ClothText.jsx'
import { useState, useEffect, useMemo } from 'react'
import ControlPanel from './components/ControlPanel.jsx'

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    const font = new FontFace('Oculi', 'url(/fonts/OculiDisplay-Regular.ttf)')
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont)
      setFontLoaded(true)
    }).catch(console.error)
  }, [])

  const textTexture = useMemo(() => {
    if (!fontLoaded) return null
    return buildTextTexture(['CLOUD', 'DANCER'])
  }, [fontLoaded])

  useEffect(() => {
    if (textTexture) return () => textTexture.dispose()
  }, [textTexture])

  if (!textTexture) return null

  return (
    <>
      <ControlPanel />
      
      <Canvas
        camera={{ position: [0, 0.3, 4], fov: 48 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        dpr={[1, 1.5]}
      >
        <Perf position="bottom-left" />
        
        {/* Lightest possible blue background */}
        <color attach="background" args={['#E6FDFF']} />

        {/* Abstract Studio Environment to prevent building reflections */}
        <Environment resolution={256} environmentIntensity={0.5}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            {/* Top/Main Light */}
            <Lightformer form="rect" intensity={2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            {/* Left Fill */}
            <Lightformer form="rect" intensity={1} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 2, 1]} />
            {/* Right Rim Light */}
            <Lightformer form="rect" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
            {/* Soft Ambient Wash */}
            <Lightformer form="rect" intensity={0.5} rotation-x={Math.PI / 2} position={[0, -5, 0]} scale={[10, 10, 1]} />
          </group>
        </Environment>

        {/* Floating Scene Lighting - Pure white */}
        <ambientLight intensity={1.0} color="#ffffff" />
        <directionalLight position={[-3.5, 4.5, 3.5]} intensity={1.0} color="#ffffff" />
        <directionalLight position={[5, 2, 1.5]} intensity={0.5} color="#ffffff" />

        <ClothText texture={textTexture} position={[0, 0.05, 0]} rotation={[0, 0, 0]} />
        <Orb textTexture={textTexture} position={[0, 0, -4]} scale={2.5} />

        <EffectComposer>
          <Bloom intensity={0.15} luminanceThreshold={0.9} luminanceSmoothing={0.5} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </>
  )
}

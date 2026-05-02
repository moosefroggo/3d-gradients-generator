import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import AnimatedClouds from './AnimatedClouds.jsx'
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
        dpr={[1, 2]}
      >
        {/* Lightest possible blue background */}
        <color attach="background" args={['#E6FDFF']} />

        {/* Cool, neutral environment to prevent brown tones */}
        <Environment preset="city" environmentIntensity={0.5} blur={0.8} />

        {/* Floating Scene Lighting - Pure white to avoid brown/yellow tinting on clouds */}
        <ambientLight intensity={1.0} color="#ffffff" />
        <directionalLight position={[-3.5, 4.5, 3.5]} intensity={1.0} color="#ffffff" />
        <directionalLight position={[5, 2, 1.5]} intensity={0.5} color="#ffffff" />

        <AnimatedClouds />
        <ClothText texture={textTexture} position={[0, 0.05, 0]} rotation={[0, 0, 0]} />
        <Orb textTexture={textTexture} position={[0, 0, -4]} scale={2.5} />

        {/* Soft grounding shadow */}
        <ContactShadows position={[0, -2.7, 0]} opacity={0.6} scale={20} blur={2.5} far={4.5} />

        <EffectComposer>
          <Bloom intensity={0.15} luminanceThreshold={0.9} luminanceSmoothing={0.5} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </>
  )
}

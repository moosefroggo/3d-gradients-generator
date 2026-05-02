import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Clouds, Cloud } from '@react-three/drei'
import * as THREE from 'three'

export default function AnimatedClouds() {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Extremely slow, peaceful rotation
      groupRef.current.rotation.y += delta * 0.02
    }
  })

  return (
    <group ref={groupRef}>
      <Clouds limit={1000}>
        {/* Background Clouds: Wide spread, ultra low density for airy look */}
        <Cloud 
          seed={1} 
          position={[0, 1, -6]} 
          scale={0.8}
          bounds={[14, 5, 1]} 
          segments={40}
          volume={6} 
          color="#ffffff" 
          opacity={0.15}
          fade={10}
          speed={0.2} 
        />
        <Cloud 
          seed={2} 
          position={[-6, 2, -5]} 
          scale={0.7}
          bounds={[10, 4, 1]} 
          segments={30}
          volume={5} 
          color="#ffffff" 
          opacity={0.1}
          fade={10}
          speed={0.15} 
        />
        <Cloud 
          seed={5} 
          position={[7, 0, -5]} 
          scale={0.7}
          bounds={[8, 4, 1]} 
          segments={30}
          volume={5} 
          color="#ffffff" 
          opacity={0.1}
          fade={10}
          speed={0.18} 
        />
        
        {/* Foreground Clouds: Barely visible white wisps passing in front */}
        <Cloud 
          seed={3} 
          position={[4, -1, 1.5]} 
          scale={0.5}
          bounds={[5, 2, 1]} 
          segments={20}
          volume={3} 
          color="#ffffff" 
          opacity={0.08}
          fade={5}
          speed={0.3} 
        />
        <Cloud 
          seed={4} 
          position={[-4, -2, 2]} 
          scale={0.5}
          bounds={[5, 2, 1]} 
          segments={20}
          volume={3} 
          color="#ffffff" 
          opacity={0.05}
          fade={5}
          speed={0.25} 
        />

      </Clouds>
    </group>
  )
}

// Backup of the chaotic, pointy morphing algorithm for the Orb vertex shader

export const pointyMorphAlgorithm = `
      vec3 getMorphedPosition(vec3 pos) {
          // Morph into a crazy organic blob in all directions
          float nx = snoise(pos * 1.2 + vec3(uTime * 0.4, 0.0, 0.0));
          float ny = snoise(pos * 1.2 + vec3(0.0, uTime * 0.5, 0.0));
          float nz = snoise(pos * 1.2 + vec3(0.0, 0.0, uTime * 0.6));
          
          vec3 noiseDisplacement = vec3(nx, ny, nz) * 1.4;
          
          vec3 targetPos = pos + noiseDisplacement;
          
          return mix(pos, targetPos, uMorph);
      }
`;

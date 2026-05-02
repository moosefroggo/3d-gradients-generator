import { useMemo, useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PANTONE_PALETTE } from './pantone'
import { useStore } from './store'

// Vertex shader injections are handled inside onBeforeCompile directly

const noiseLibrary = `
// 3D Simplex noise
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

// 3D Perlin noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
float pnoise(vec3 P) {
  vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0); Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0); vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = Pf0 * Pf0 * Pf0 * (Pf0 * (Pf0 * 6.0 - 15.0) + 10.0);
  float n_z = mix(mix(mix(n000, n100, fade_xyz.x), mix(n010, n110, fade_xyz.x), fade_xyz.y), mix(mix(n001, n101, fade_xyz.x), mix(n011, n111, fade_xyz.x), fade_xyz.y), fade_xyz.z);
  return 2.2 * n_z;
}

// 3D Worley noise
float worley(vec3 p) {
  vec3 n = floor(p); vec3 f = fract(p);
  float dis = 1.0;
  for(int j = -1; j <= 1; j++)
    for(int i = -1; i <= 1; i++)
      for(int k = -1; k <= 1; k++) {
        vec3 g = vec3(float(i), float(j), float(k));
        vec3 o = fract(sin(vec3(dot(n + g, vec3(127.1, 311.7, 74.7)), dot(n + g, vec3(269.5, 183.3, 246.1)), dot(n + g, vec3(113.5, 271.9, 124.6)))) * 43758.5453);
        vec3 r = g + o - f;
        float d = dot(r, r);
        dis = min(dis, d);
      }
  return sqrt(dis);
}

// FBM (Fractal Brownian Motion)
float fbm(vec3 p) {
  float value = 0.0; float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    value += amp * snoise(p);
    p *= 2.0; amp *= 0.5;
  }
  return value;
}

float getNoise(int type, vec3 p) {
  if (type == 0) return snoise(p);
  if (type == 1) return pnoise(p);
  if (type == 2) return 1.0 - worley(p);
  if (type == 3) return fbm(p);
  return snoise(p);
}
`

const orbShaderFragment = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vOriginalPosition;
varying vec3 myNormal;
varying vec3 myViewPosition;
uniform vec3 uColors[8];
uniform float uTime;
uniform int uNoiseType;
uniform float uFrequency;
uniform float uEvolutionSpeed;

${noiseLibrary}

void main() {
`

export default function Orb({ textTexture, position = [0, 0, -8], ...props }) {
  const meshRef = useRef()
  const matRef = useRef()
  const { 
    noiseType, frequency, amplitude, evolutionSpeed, scaleX, scaleY,
    materialType, roughness, metalness, transmission, ior, thickness,
    colors 
  } = useStore()

  const customUniforms = useMemo(() => ({
    uColors: { value: colors.map((c) => new THREE.Color(c)) },
    uTime: { value: 0 },
    uMorph: { value: 0 },
    uTextMask: { value: textTexture },
    uNoiseType: { value: noiseType },
    uFrequency: { value: frequency },
    uAmplitude: { value: amplitude },
    uEvolutionSpeed: { value: evolutionSpeed },
    uScaleX: { value: scaleX },
    uScaleY: { value: scaleY }
  }), [textTexture])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    customUniforms.uTime.value = t

    // Seamless one-way morph: start as a sphere (0), transform into a blob (1) and stay there
    // The noise will continue to animate the blob seamlessly over time.
    customUniforms.uMorph.value = Math.max(0, Math.min(1.0, (t - 0.5) / 4.0));
    customUniforms.uNoiseType.value = noiseType
    customUniforms.uFrequency.value = frequency
    customUniforms.uAmplitude.value = amplitude
    customUniforms.uEvolutionSpeed.value = evolutionSpeed
    customUniforms.uScaleX.value = scaleX
    customUniforms.uScaleY.value = scaleY
    
    // Update colors if they changed
    colors.forEach((c, i) => {
      customUniforms.uColors.value[i].set(c)
    })

    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * 0.6) * 0.04
    }
  })

  const onBeforeCompile = useCallback((shader) => {
    shader.uniforms.uColors = customUniforms.uColors
    shader.uniforms.uTime = customUniforms.uTime
    shader.uniforms.uMorph = customUniforms.uMorph
    shader.uniforms.uTextMask = customUniforms.uTextMask
    shader.uniforms.uNoiseType = customUniforms.uNoiseType
    shader.uniforms.uFrequency = customUniforms.uFrequency
    shader.uniforms.uAmplitude = customUniforms.uAmplitude
    shader.uniforms.uEvolutionSpeed = customUniforms.uEvolutionSpeed
    shader.uniforms.uScaleX = customUniforms.uScaleX
    shader.uniforms.uScaleY = customUniforms.uScaleY

    // Add varyings and morph function to vertex shader
    shader.vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vOriginalPosition;
      varying vec3 myNormal;
      varying vec3 myViewPosition;
      uniform float uMorph;
      uniform float uTime;
      uniform sampler2D uTextMask;
      uniform int uNoiseType;
      uniform float uFrequency;
      uniform float uAmplitude;
      uniform float uEvolutionSpeed;
      uniform float uScaleX;
      uniform float uScaleY;

      ${noiseLibrary}

      vec3 getMorphedPosition(vec3 pos) {
          // 1. Organic Blob Morphing
          float noiseVal = getNoise(uNoiseType, pos * uFrequency + vec3(uTime * uEvolutionSpeed, uTime * uEvolutionSpeed * 0.8, uTime * uEvolutionSpeed * 1.2));
          vec3 targetPos = pos + normalize(pos) * noiseVal * uAmplitude;
          
          vec3 morphedPos = mix(pos, targetPos, uMorph);
          
          // 2. Physical Denting against the Text
          // Project the vertex's world position onto the Text's local UV space.
          // In world space, the orb's vertex position is (morphedPos * scale) + position
          vec3 worldPos = morphedPos * vec3(uScaleX, uScaleY, 2.5) + vec3(0.0, 0.0, -4.0);
          
          // Text bounding box in world space:
          // X: -1.4 to 1.4 (width 2.8)
          // Y: 0.05 - 0.8 = -0.75 to 0.05 + 0.8 = 0.85
          // Z: 0.0
          vec2 textUV = vec2(
              (worldPos.x + 1.4) / 2.8,
              (worldPos.y + 0.75) / 1.6
          );
          
          // Check if vertex is horizontally behind the text area
          if (textUV.x >= -0.05 && textUV.x <= 1.05 && textUV.y >= -0.05 && textUV.y <= 1.05) {
              // Simplify to 1 texture sample for performance, rely on smoothstep for softness
              float softAlpha = texture2D(uTextMask, textUV).a;
              
              if (softAlpha > 0.01) {
                  float dentThreshold = -0.3;
                  float depthPenetration = (worldPos.z - dentThreshold) * 2.0; 
                  
                  if (depthPenetration > 0.0) {
                      float mask = smoothstep(0.0, 0.4, softAlpha);
                      float dent = (depthPenetration * mask) / 2.5;
                      morphedPos.z -= dent;
                  }
              }
          }
          
          return morphedPos;
      }
    ` + shader.vertexShader

    // 1. Recompute normals for morphed geometry (Only for materials that support lighting)
    if (materialType !== 'basic') {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
        vec3 helper = abs(normal.y) > 0.999 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
        vec3 myTangent = normalize(cross(helper, normal));
        vec3 myBitangent = normalize(cross(normal, myTangent));
        
        float stepSize = 0.02;
        vec3 p0_n = getMorphedPosition(position);
        vec3 p1_n = getMorphedPosition(position + myTangent * stepSize);
        vec3 p2_n = getMorphedPosition(position + myBitangent * stepSize);
        
        vec3 reconstructedNormal = cross(p1_n - p0_n, p2_n - p0_n);
        if (length(reconstructedNormal) > 0.0001) {
            reconstructedNormal = normalize(reconstructedNormal);
        } else {
            reconstructedNormal = normal;
        }
        
        vec3 objectNormal = reconstructedNormal;
        `
      )
    }

    // 2. Apply deformed position and pass varyings
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      vec3 transformed = getMorphedPosition(position);
      
      vUv = uv;
      vOriginalPosition = position;
      vPosition = transformed;
      
      // Pass the computed normal to the fragment shader
      #ifdef USE_NORMAL
        myNormal = normalize(normalMatrix * objectNormal);
      #else
        myNormal = vec3(0.0, 0.0, 1.0); // Fallback for basic
      #endif

      vec4 mvPos = modelViewMatrix * vec4(transformed, 1.0);
      myViewPosition = -mvPos.xyz;
      `
    )

    // Add uniforms and noise function to fragment shader
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      orbShaderFragment
    )

    // Overwrite the diffuse color using the noise
    shader.fragmentShader = shader.fragmentShader.replace(
      'vec4 diffuseColor = vec4( diffuse, opacity );',
      `
      vec3 p = vOriginalPosition * uFrequency + vec3(uTime * uEvolutionSpeed * 0.5, 0.0, 0.0);
      float nx = getNoise(uNoiseType, p * 1.2);
      float ny = getNoise(uNoiseType, p * 1.3 + vec3(0.0, uTime * uEvolutionSpeed * 0.6, 0.0));
      float nz = getNoise(uNoiseType, p * 1.1 + vec3(0.0, 0.0, uTime * uEvolutionSpeed * 0.7));
      
      nx = smoothstep(-0.5, 0.5, nx);
      ny = smoothstep(-0.5, 0.5, ny);
      nz = smoothstep(-0.5, 0.5, nz);

      vec3 mixX0 = mix(uColors[0], uColors[1], nx);
      vec3 mixX1 = mix(uColors[2], uColors[3], nx);
      vec3 mixX2 = mix(uColors[4], uColors[5], nx);
      vec3 mixX3 = mix(uColors[6], uColors[7], nx);

      vec3 mixY0 = mix(mixX0, mixX1, ny);
      vec3 mixY1 = mix(mixX2, mixX3, ny);

      vec3 baseColor = mix(mixY0, mixY1, nz);
      
      vec4 diffuseColor = vec4( baseColor, opacity );
      `
    )

    // Inject emissive
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      `
      #include <emissivemap_fragment>
      totalEmissiveRadiance += baseColor * 0.2; 
      `
    )

    // Overwrite final output color to forcibly remove any dark edges!
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      #include <dithering_fragment>
      // Adjusted Rim Light to be more subtle and prevent dark outlines
      float edgeRim = clamp(1.0 - max(dot(normalize(myNormal), normalize(myViewPosition)), 0.0), 0.0, 1.0);
      vec3 glowColor = baseColor * 1.25;
      gl_FragColor.rgb = mix(gl_FragColor.rgb, glowColor, pow(edgeRim, 2.5) * 0.6);
      `
    )
  }, [customUniforms])

  return (
    <mesh ref={meshRef} position={position} scale={[scaleX, scaleY, 2.5]}>
      <sphereGeometry args={[1.4, 192, 384]} />
      {materialType === 'glass' && (
        <meshPhysicalMaterial
          ref={matRef}
          roughness={roughness}
          metalness={metalness}
          transmission={transmission}
          ior={ior}
          thickness={thickness}
          attenuationDistance={10.0}
          clearcoat={1.0}
          clearcoatRoughness={0.4}
          iridescence={0.3}
          iridescenceIOR={1.3}
          onBeforeCompile={onBeforeCompile}
        />
      )}
      {materialType === 'standard' && (
        <meshStandardMaterial
          ref={matRef}
          roughness={roughness}
          metalness={metalness}
          onBeforeCompile={onBeforeCompile}
        />
      )}
      {materialType === 'basic' && (
        <meshBasicMaterial
          ref={matRef}
          onBeforeCompile={onBeforeCompile}
        />
      )}
    </mesh>
  )
}

uniform float uTime;
uniform float uAmp;
uniform float uSpeed;

varying vec2 vUv;
varying float vDisplace;
varying vec3 vNormal;
varying vec3 vWorldPosition;

float getDisplacement(vec2 uvCoord) {
  float t = uTime * uSpeed;
  float wave1 = sin(uvCoord.x * 6.2831 * 1.4 + t * 1.1);
  float wave2 = sin(uvCoord.y * 6.2831 * 0.9 - t * 0.7);
  float wave3 = sin((uvCoord.x + uvCoord.y) * 6.2831 * 0.6 + t * 0.55);
  float displace = (wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.20) * uAmp;

  // Anchor the corners a bit so the plane drapes rather than floats.
  float anchor = smoothstep(0.0, 0.25, uvCoord.x) * smoothstep(0.0, 0.25, 1.0 - uvCoord.x);
  displace *= mix(0.4, 1.0, anchor);
  
  return displace;
}

void main() {
  vUv = uv;

  float displace = getDisplacement(uv);
  vDisplace = displace;

  vec3 displaced = position + normal * displace;
  
  // Numerical derivatives to calculate normal
  // Object space width is 1.9, height is 1.1
  float eps = 0.01;
  float dDx = getDisplacement(uv + vec2(eps / 1.9, 0.0));
  float dDy = getDisplacement(uv + vec2(0.0, eps / 1.1));
  
  // Calculate tangent and bitangent
  vec3 p0 = position + normal * displace;
  vec3 p1 = position + vec3(eps, 0.0, 0.0) + normal * dDx;
  vec3 p2 = position + vec3(0.0, eps, 0.0) + normal * dDy;
  
  vec3 tangent = normalize(p1 - p0);
  vec3 bitangent = normalize(p2 - p0);
  vec3 computedNormal = normalize(cross(tangent, bitangent));

  vNormal = normalMatrix * computedNormal;
  
  vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
  vWorldPosition = worldPos.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
}

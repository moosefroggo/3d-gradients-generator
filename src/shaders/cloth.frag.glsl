precision highp float;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uSpeed;
uniform vec3 uTint;

varying vec2 vUv;
varying float vDisplace;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  float t = uTime * uSpeed;

  // Warp the UVs with the same wave field so the print drags with the cloth.
  vec2 warp = vec2(
    sin(vUv.y * 6.2831 * 0.9 - t * 0.7) * 0.012,
    sin(vUv.x * 6.2831 * 1.2 + t * 1.0) * 0.010
  );

  vec4 tex = texture2D(uTexture, vUv + warp);

  if (tex.a < 0.05) discard;

  // The user requested pure white text completely unaffected by lights and shadows
  vec3 col = vec3(1.0);

  gl_FragColor = vec4(col, tex.a);
}

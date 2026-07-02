export const heroVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

/**
 * Elegant entrance effect — no image distortion:
 * - background-size:cover UV mapping + entrance zoom-in
 * - soft radial vignette that darkens the edges
 * - subtle cursor-proximity warm glow (brightness lift only, no UV warp)
 * - ambient breathing via barely-visible brightness pulse
 */
export const heroFragmentShader = /* glsl */ `
uniform sampler2D uTexture;
uniform vec2 uPlaneRes;
uniform vec2 uImageRes;
uniform vec2 uMouse;
uniform float uTime;
uniform float uStrength;
uniform float uZoom;

varying vec2 vUv;

vec2 coverUv(vec2 uv) {
  vec2 ratio = vec2(
    min((uPlaneRes.x / uPlaneRes.y) / (uImageRes.x / uImageRes.y), 1.0),
    min((uPlaneRes.y / uPlaneRes.x) / (uImageRes.y / uImageRes.x), 1.0)
  );
  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

void main() {
  vec2 uv = coverUv(vUv);
  // entrance zoom: starts zoomed in, relaxes to 1.0
  uv = (uv - 0.5) / uZoom + 0.5;

  vec4 color = texture2D(uTexture, uv);

  // subtle radial vignette — darkens edges gently
  float vig = smoothstep(1.12, 0.38, distance(vUv, vec2(0.5)));
  color.rgb *= mix(0.78, 1.0, vig);

  // cursor proximity: soft warm brightness lift (no warp)
  float dist = distance(vUv, uMouse);
  float glow = smoothstep(0.45, 0.0, dist) * uStrength * 0.07;
  color.rgb += vec3(glow * 1.0, glow * 0.82, glow * 0.55);

  // ambient breathing — barely perceptible brightness pulse
  float breath = sin(uTime * 0.55) * 0.012 + 0.012;
  color.rgb += breath;

  gl_FragColor = vec4(color.rgb, 1.0);
}
`

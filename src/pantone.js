// Approximations of the requested Pantone palette.
// Tune these in the browser if you want stricter swatch matching.
export const PANTONE_PALETTE = [
  { name: '11-0515 Lemon Icing',         hex: '#F1ECCE' },
  { name: '13-4108 Nimbus Cloud',        hex: '#D6D2CB' },
  { name: '11-1400 Raindrops on Roses',  hex: '#F4EAE2' },
  { name: '11-4201 Cloud Dancer',        hex: '#F2EFE9' },
  { name: '13-4306 Ice Melt',            hex: '#D9DEE0' },
  { name: '12-1107 Peach Dust',          hex: '#EFCAB5' },
  { name: '13-6006 Almost Aqua',         hex: '#C7E1D4' },
  { name: '13-3802 Orchid Tint',         hex: '#DCD2DD' },
]

export const smoothstep = (edge0, edge1, x) => {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

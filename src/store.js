import { create } from 'zustand'

import { UI_GRADIENTS } from './uiGradients'

const CUSTOM_PRESETS = {
  pantone: ['#F1ECCE', '#D6D2CB', '#F4EAE2', '#F2EFE9', '#D9DEE0', '#EFCAB5', '#C7E1D4', '#DCD2DD'],
  midnight: ['#0f0c29', '#302b63', '#24243e', '#1a1a2e', '#16213e', '#0f3460', '#533483', '#000000'],
  lava: ['#ff4b1f', '#ff9068', '#f12711', '#f5af19', '#ed1c24', '#fdc830', '#f37335', '#23074d'],
  emerald: ['#00b09b', '#96c93d', '#11998e', '#38ef7d', '#56ab2f', '#a8e063', '#004e92', '#000428'],
  neon: ['#00f2ff', '#0061ff', '#60efff', '#00ff87', '#ff00ff', '#7000ff', '#ff0080', '#ff8c00']
}

export const GRADIENT_PRESETS = { ...CUSTOM_PRESETS, ...UI_GRADIENTS }

export const useStore = create((set) => ({
  // Performance Quality: 0: Performance, 1: Balanced, 2: Cinema
  quality: 1,

  // Noise Selection: 0: Simplex, 1: Perlin, 2: Worley, 3: FBM
  noiseType: 0,
  
  // Shape Selection: sphere, box, torus, cylinder
  shapeType: 'sphere',

  // Parametric controls
  frequency: 0.6,
  amplitude: 0.2,
  speed: 0.3,
  
  // Geometry controls
  scaleX: 2.5,
  scaleY: 2.5,
  
  // Evolution Speed for noise shifting
  evolutionSpeed: 0.3,

  // Material settings
  materialType: 'glass', // glass, standard, basic
  roughness: 0.2,
  metalness: 0.1,
  transmission: 1.0,
  ior: 1.5,
  thickness: 2.0,

  // Colors
  colors: GRADIENT_PRESETS.pantone,

  // Actions
  setQuality: (val) => set({ quality: parseInt(val) }),
  setNoiseType: (val) => set({ noiseType: parseInt(val) }),
  setShapeType: (val) => set({ shapeType: val }),
  setFrequency: (val) => set({ frequency: val }),
  setAmplitude: (val) => set({ amplitude: val }),
  setSpeed: (val) => set({ speed: val }),
  setScaleX: (val) => set({ scaleX: val }),
  setScaleY: (val) => set({ scaleY: val }),
  setEvolutionSpeed: (val) => set({ evolutionSpeed: val }),

  setMaterialType: (val) => set({ materialType: val }),
  setRoughness: (val) => set({ roughness: val }),
  setMetalness: (val) => set({ metalness: val }),
  setTransmission: (val) => set({ transmission: val }),
  setIor: (val) => set({ ior: val }),
  setThickness: (val) => set({ thickness: val }),

  setColors: (colors) => set({ colors }),
  setColorAt: (index, color) => set((state) => {
    const newColors = [...state.colors]
    newColors[index] = color
    return { colors: newColors }
  }),
  setPreset: (name) => set({ colors: GRADIENT_PRESETS[name] })
}))

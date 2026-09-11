# Morph — 3D Gradient Generator

An interactive WebGL studio for creating animated 3D gradients with procedural noise, real-time material controls, and exportable configurations.

**[Open the live tool →](https://moosefroggo.github.io/3d-gradients-generator/)**

## What it does

- Generates animated gradients from a large preset library or custom colors
- Morphs spheres, boxes, toruses, cylinders, and planes with GPU-driven noise
- Switches between Simplex, Perlin, Worley, and fractal noise models
- Tunes frequency, distortion, evolution speed, scale, and flow direction in real time
- Supports glow, plastic, and glass-like material treatments
- Provides selectable geometry quality for different devices
- Copies the current visual configuration to the clipboard for reuse

## Implementation

Morph injects custom GLSL into Three.js materials through `onBeforeCompile`. The shader library implements four procedural noise models, vertex displacement, multiple gradient mappings, and dithering to reduce visible color banding. Zustand keeps the control panel and render scene synchronized.

The repository also exposes the core scene, material factory, and gradient presets through a Vite library build.

## Stack

- React 19 and Vite
- Three.js, React Three Fiber, and Drei
- GLSL shaders and post-processing
- Zustand for interactive state
- Radix UI and Tailwind CSS for controls

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
npm run build:lib
```

## Project status

Morph is a working creative-tool prototype. It runs entirely in the browser and does not require a backend.

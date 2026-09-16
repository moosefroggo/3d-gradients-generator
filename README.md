# Morph: 3D Gradient Generator

Make animated 3D gradients in your browser. Change the colors, shapes, noise, and materials, then copy your settings to reuse them.

[Try Morph](https://moosefroggo.github.io/3d-gradients-generator/)

## What you can do

- Start with a preset or choose your own colors
- Change the shape and how it moves
- Choose Simplex, Perlin, Worley, or fractal noise
- Adjust speed, scale, distortion, and flow direction
- Try glow, plastic, and glass-like materials
- Lower the geometry quality on slower devices
- Copy the current settings to the clipboard

## How it works

Morph uses Three.js and custom GLSL shaders to animate the shapes. React Three Fiber renders the scene. Zustand keeps the controls and the scene in sync.

The repository also includes a Vite library build for the scene, materials, and gradient presets.

## Stack

React 19, Vite, Three.js, React Three Fiber, GLSL, Zustand, Radix UI, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

To check the build:

```bash
npm run lint
npm run build
npm run build:lib
```

Morph is a browser-based prototype. It does not need a backend.

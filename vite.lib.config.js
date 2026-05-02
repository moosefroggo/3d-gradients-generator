import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'Orb',
      fileName: (format) => `orb.${format}.js`
    },
    rollupOptions: {
      // Externalize deps that consuming projects should provide
      external: [
        'react', 
        'react-dom', 
        'three', 
        '@react-three/fiber', 
        '@react-three/drei', 
        '@react-three/postprocessing',
        'zustand'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          three: 'THREE',
          '@react-three/fiber': 'ReactThreeFiber',
          '@react-three/drei': 'ReactThreeDrei'
        }
      }
    }
  }
})

import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Mapeamento de módulos → chunk name (Rolldown/Vite v8)
const CHUNKS: Record<string, string> = {
  react: 'chunk-react',
  'react-dom': 'chunk-react',
  three: 'chunk-three',
  '@react-three/fiber': 'chunk-three',
  '@react-three/drei': 'chunk-three',
  gsap: 'chunk-gsap',
  '@gsap/react': 'chunk-gsap',
  lenis: 'chunk-gsap',
  'split-type': 'chunk-gsap',
  'framer-motion': 'chunk-framer',
  '@radix-ui/react-dialog': 'chunk-ui',
  clsx: 'chunk-ui',
  'tailwind-merge': 'chunk-ui',
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Não expõe source maps em produção
    sourcemap: false,
    // Assets < 4 KB são inlined como base64
    assetsInlineLimit: 4096,
    // Aviso de chunk grande — Three.js/WebGL é pesado por design;
    // já é carregado de forma lazy, então o aviso pode ser ignorado
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        // Separa vendors pesados em chunks independentes
        manualChunks(id: string) {
          for (const [pkg, chunk] of Object.entries(CHUNKS)) {
            if (id.includes(`/node_modules/${pkg}/`)) return chunk
          }
        },
        // Remove console.* e debugger em produção
        ...(mode === 'production' && {
          minify: {
            compress: {
              dropConsole: true,
              dropDebugger: true,
            },
          },
        }),
      },
    },
  },
}))


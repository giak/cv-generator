import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@ui': resolve(__dirname, 'src'),
      '@ui/components': resolve(__dirname, 'src/components'),
      '@ui/shared': resolve(__dirname, 'src/components/shared'),
      '@ui/modules': resolve(__dirname, 'src/modules'),
      '@ui/utils': resolve(__dirname, 'src/utils'),
      '@ui/types': resolve(__dirname, 'src/types')
    },
  },
  optimizeDeps: {
    exclude: ['@cv-generator/core', '@cv-generator/infrastructure', '@cv-generator/shared'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        format: 'esm',
      },
    },
  },
  worker: {
    format: 'es',
  },
})

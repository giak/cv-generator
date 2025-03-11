import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@ui': resolve(__dirname, 'src'),
      '@ui/components': resolve(__dirname, 'src/components'),
      '@ui/shared': resolve(__dirname, 'src/components/shared'),
      '@ui/modules': resolve(__dirname, 'src/modules'),
      '@ui/utils': resolve(__dirname, 'src/utils'),
      '@ui/types': resolve(__dirname, 'src/types'),
      '@cv-generator/shared': resolve(__dirname, '../shared/src'),
      '@cv-generator/core': resolve(__dirname, '../core/src'),
      '@cv-generator/infrastructure': resolve(__dirname, '../infrastructure/src')
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

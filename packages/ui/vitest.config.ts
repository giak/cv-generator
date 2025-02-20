/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@cv': resolve(__dirname, './src/modules/cv'),
      '@shared': resolve(__dirname, './src/components/shared'),
      '@stores': resolve(__dirname, './src/stores'),
      '@composables': resolve(__dirname, './src/composables'),
      '@assets': resolve(__dirname, './src/assets'),
      '@pages': resolve(__dirname, './src/pages'),
      '@types': resolve(__dirname, './src/types')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/__tests__/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: ['e2e/**/*', 'node_modules/**/*'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['src/**/*.{vue,ts}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/main.ts',
        'src/types/**/*'
      ]
    }
  }
})

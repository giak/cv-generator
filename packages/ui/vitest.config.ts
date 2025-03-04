/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup/index.ts', './src/composables/__tests__/setupTests.ts'],
    include: [
      'src/**/__tests__/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    exclude: [
      'src/test/e2e/**/*',
      'node_modules/**/*',
      'dist/**/*'
    ],
    threads: false,
    deps: {
      inline: ['vuetify'],
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: [
        'src/**/*.{js,ts,jsx,tsx}',
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/**/__tests__/**/*',
        'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
        '**/node_modules/**',
        '**/dist/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@ui': resolve(root, 'src'),
      '@core': resolve(root, 'src/core'),
      '@modules': resolve(root, 'src/modules'),
      '@shared': resolve(root, 'src/shared'),
    }
  }
})

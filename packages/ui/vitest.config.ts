/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { resolve } from 'path'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup/index.ts'],
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
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,vue}'],
      exclude: [
        'src/**/__tests__/**/*',
        'src/test/**/*'
      ]
    }
  },
  resolve: {
    alias: {
      '@ui': resolve(root, 'src'),
      '@core': resolve(root, 'src/core'),
      '@modules': resolve(root, 'src/modules'),
      '@shared': resolve(root, 'src/shared'),
      '@test': resolve(root, 'src/test'),
      '@cv': resolve(root, 'src/modules/cv'),
      '@components': resolve(root, 'src/core/components'),
      '@composables': resolve(root, 'src/core/composables'),
      '@utils': resolve(root, 'src/core/utils'),
      '@assets': resolve(root, 'src/assets')
    }
  }
})

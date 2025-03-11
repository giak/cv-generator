import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@cv-generator/core': resolve(__dirname, '../core/src'),
      '@cv-generator/infrastructure': resolve(__dirname, '../infrastructure/src'),
      '@cv-generator/ui': resolve(__dirname, '../ui/src')
    }
  }
}) 
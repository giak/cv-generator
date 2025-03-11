import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@core': resolve(__dirname, './src'),
      '@core/cv': resolve(__dirname, './src/cv'),
      '@core/cv/domain': resolve(__dirname, './src/cv/domain'),
      '@core/cv/application': resolve(__dirname, './src/cv/application'),
      '@core/cv/ports': resolve(__dirname, './src/cv/ports'),
      '@core/export': resolve(__dirname, './src/export'),
      '@core/user': resolve(__dirname, './src/user'),
      '@core/shared': resolve(__dirname, './src/shared'),
      
      '@cv-generator/shared': resolve(__dirname, '../shared/src'),
      '@cv-generator/infrastructure': resolve(__dirname, '../infrastructure/src'),
      '@cv-generator/ui': resolve(__dirname, '../ui/src')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/**/*.test.ts', 'src/**/*.spec.ts']
    },
    include: ['src/**/*.{test,spec}.ts']
  },
  optimizeDeps: {
    exclude: ['@cv-generator/shared', '@cv-generator/infrastructure']
  }
}) 
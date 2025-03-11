import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      'src/**/__tests__/*.{js,ts}'
    ],
    exclude: ['node_modules/**/*'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.ts',
        'src/**/*.spec.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@infrastructure': resolve(__dirname, './src'),
      '@infrastructure/repositories': resolve(__dirname, './src/repositories'),
      '@infrastructure/services': resolve(__dirname, './src/services'),
      '@infrastructure/adapters': resolve(__dirname, './src/adapters'),
      
      '@cv-generator/shared': resolve(__dirname, '../shared/src'),
      '@cv-generator/core': resolve(__dirname, '../core/src'),
      '@cv-generator/ui': resolve(__dirname, '../ui/src')
    }
  },
  optimizeDeps: {
    exclude: ['@cv-generator/core', '@cv-generator/shared']
  }
}) 
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    typecheck: {
      enabled: false // Désactiver pour l'instant pour éviter les erreurs de type
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@cv-generator/shared': resolve(__dirname, '../shared/src'),
      '@cv-generator/infrastructure': resolve(__dirname, '../infrastructure/src'),
      '@cv-generator/ui': resolve(__dirname, '../ui/src')
    }
  }
}) 
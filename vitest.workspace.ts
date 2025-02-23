import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./packages/ui/vitest.config.ts",
  "./packages/infrastructure/vitest.config.ts",
  "./packages/core/vitest.config.ts",
  "./packages/shared/vitest.config.ts"
])

import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./packages/infrastructure/vitest.config.ts",
  "./packages/core/vitest.config.ts",
  "./packages/shared/vitest.config.ts",
  "./packages/ui/vitest.config.ts"
])

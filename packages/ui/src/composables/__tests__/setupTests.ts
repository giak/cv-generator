import { beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Set up Pinia store for all tests
beforeEach(() => {
  setActivePinia(createPinia())
}) 
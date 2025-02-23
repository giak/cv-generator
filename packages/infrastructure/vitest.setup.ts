import { vi, afterEach } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0
}

global.localStorage = localStorageMock

// Mock global APIs if needed
global.fetch = vi.fn()

// Clean up mocks after each test
afterEach(() => {
  vi.clearAllMocks()
  vi.resetAllMocks()
  localStorageMock.clear()
}) 
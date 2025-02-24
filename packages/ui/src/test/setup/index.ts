/// <reference types="vitest" />
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/vue";
import { afterEach } from "vitest";
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Extend Vitest's expect with jest-dom matchers
declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T> {}
  interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
}

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock des composants globaux si nécessaire
config.global.components = {
  // Exemple : 'RouterLink': RouterLinkStub
}

// Mock des plugins Vue si nécessaire
config.global.plugins = []

// Mock des directives Vue si nécessaire
config.global.directives = {
  // Exemple : 'tooltip': TooltipDirective
}

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

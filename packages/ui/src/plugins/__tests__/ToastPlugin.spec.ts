import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createApp, nextTick, App } from 'vue'
import ToastPlugin from '../toast'

// Mocker ToastContainer directement
vi.mock('../../components/notification/ToastContainer.vue', () => ({
  default: {
    name: 'ToastContainer',
    render() {
      return null
    }
  }
}))

// Un mock plus simple pour les tests
const mockToastContainer = {
  addToast: vi.fn().mockReturnValue('mock-toast-id'),
  removeToast: vi.fn(),
  clearAll: vi.fn(),
}

// Type explicite pour notre app mockée
interface MockApp {
  mount: ReturnType<typeof vi.fn>;
  unmount: ReturnType<typeof vi.fn>;
  use: ReturnType<typeof vi.fn>;
  provide: ReturnType<typeof vi.fn>;
  component: ReturnType<typeof vi.fn>;
  directive: ReturnType<typeof vi.fn>;
  config: {
    globalProperties: {
      $toast: Record<string, any>;
    }
  }
}

// Plutôt que de mocker document.createElement, mockons createApp et mount
vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')
  return {
    ...actual,
    createApp: vi.fn().mockImplementation((component) => {
      const app: MockApp = {
        mount: vi.fn().mockReturnValue(mockToastContainer),
        unmount: vi.fn(),
        use: vi.fn().mockImplementation(function(this: MockApp, plugin, options) {
          if (plugin === ToastPlugin) {
            plugin.install(this, options)
          }
          return this
        }),
        provide: vi.fn(),
        component: vi.fn(),
        directive: vi.fn(),
        config: {
          globalProperties: {
            $toast: {} // Sera rempli par le plugin
          }
        }
      }
      return app
    })
  }
})

describe('ToastPlugin', () => {
  let app: ReturnType<typeof createApp>
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Réinitialiser le mock du conteneur
    mockToastContainer.addToast.mockClear().mockReturnValue('mock-toast-id')
    mockToastContainer.removeToast.mockClear()
    mockToastContainer.clearAll.mockClear()
    
    // Créer une nouvelle app pour chaque test
    app = createApp({
      template: '<div>Test App</div>'
    })
  })

  it('registers the plugin with default options', () => {
    app.use(ToastPlugin)
    app.mount('#app')
    
    // Vérifier que $toast est défini dans l'app
    expect(app.config.globalProperties.$toast).toBeDefined()
  })
  
  it('registers the plugin with custom options', () => {
    app.use(ToastPlugin, {
      position: 'bottom-left',
      maxToasts: 10
    })
    app.mount('#app')
    
    expect(app.config.globalProperties.$toast).toBeDefined()
  })
  
  it('adds toast methods to the app', () => {
    app.use(ToastPlugin)
    
    // Vérifier que les méthodes toast sont ajoutées
    expect(app.config.globalProperties.$toast).toBeDefined()
    expect(typeof app.config.globalProperties.$toast.show).toBe('function')
    expect(typeof app.config.globalProperties.$toast.success).toBe('function')
    expect(typeof app.config.globalProperties.$toast.error).toBe('function')
    expect(typeof app.config.globalProperties.$toast.warning).toBe('function')
    expect(typeof app.config.globalProperties.$toast.info).toBe('function')
    expect(typeof app.config.globalProperties.$toast.remove).toBe('function')
    expect(typeof app.config.globalProperties.$toast.clearAll).toBe('function')
  })
}) 
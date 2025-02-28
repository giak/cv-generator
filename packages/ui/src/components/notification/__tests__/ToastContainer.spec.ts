import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ToastContainer from '../ToastContainer.vue'
import Toast from '../Toast.vue'

vi.mock('../Toast.vue', () => ({
  default: {
    name: 'Toast',
    props: ['type', 'title', 'message', 'duration', 'dismissible', 'actionLabel', 'actionData'],
    template: `
      <div data-testid="toast" :data-type="type" :data-title="title" :data-message="message">
        <button v-if="dismissible" data-testid="dismiss-btn" @click="$emit('dismiss')"></button>
        <button v-if="actionLabel" data-testid="action-btn" @click="$emit('action', actionData)"></button>
      </div>
    `,
    emits: ['dismiss', 'action']
  }
}))

describe('ToastContainer.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('renders with default props', () => {
    const wrapper = mount(ToastContainer)
    
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.findAllComponents(Toast).length).toBe(0)
  })

  it('positions container based on position prop', async () => {
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
    
    for (const position of positions) {
      const wrapper = mount(ToastContainer, {
        props: { position }
      })
      
      const containerClasses = wrapper.attributes('class')
      
      if (position === 'top-left') {
        expect(containerClasses).toContain('top-4')
        expect(containerClasses).toContain('left-4')
      } else if (position === 'top-right') {
        expect(containerClasses).toContain('top-4')
        expect(containerClasses).toContain('right-4')
      } else if (position === 'bottom-left') {
        expect(containerClasses).toContain('bottom-4')
        expect(containerClasses).toContain('left-4')
      } else if (position === 'bottom-right') {
        expect(containerClasses).toContain('bottom-4')
        expect(containerClasses).toContain('right-4')
      }
    }
  })

  it('adds a toast when addToast method is called', async () => {
    const wrapper = mount(ToastContainer)
    const vm = wrapper.vm as any
    
    vm.addToast({
      type: 'success',
      title: 'Test Toast',
      message: 'This is a test toast'
    })
    
    await wrapper.vm.$nextTick()
    
    expect(wrapper.findAllComponents(Toast).length).toBe(1)
    
    const toast = wrapper.findComponent(Toast)
    expect(toast.props('type')).toBe('success')
    expect(toast.props('title')).toBe('Test Toast')
    expect(toast.props('message')).toBe('This is a test toast')
  })

  it('removes a toast when dismiss event is emitted', async () => {
    const wrapper = mount(ToastContainer)
    const vm = wrapper.vm as any
    
    // Add a toast
    const toastId = vm.addToast({
      type: 'info',
      title: 'Test Toast',
      message: 'This is a test toast'
    })
    
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(Toast).length).toBe(1)
    
    // Find the toast and trigger dismiss
    const toast = wrapper.findComponent(Toast)
    await toast.vm.$emit('dismiss')
    
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(Toast).length).toBe(0)
  })

  it('handles action event from toast', async () => {
    const actionHandler = vi.fn()
    const wrapper = mount(ToastContainer, {
      props: {
        onAction: actionHandler
      }
    })
    const vm = wrapper.vm as any
    
    const actionData = { id: 'test-123', action: 'confirm' }
    
    // Add a toast with an action
    vm.addToast({
      type: 'info',
      title: 'Action Toast',
      message: 'This toast has an action',
      actionLabel: 'Confirm',
      actionData
    })
    
    await wrapper.vm.$nextTick()
    
    // Trigger the action event
    const toast = wrapper.findComponent(Toast)
    await toast.vm.$emit('action', actionData)
    
    expect(actionHandler).toHaveBeenCalledWith(actionData)
  })

  it('limits number of toasts based on maxToasts prop', async () => {
    const wrapper = mount(ToastContainer, {
      props: {
        maxToasts: 3
      }
    })
    const vm = wrapper.vm as any
    
    // Add 5 toasts
    for (let i = 0; i < 5; i++) {
      vm.addToast({
        type: 'info',
        title: `Toast ${i+1}`,
        message: `Toast message ${i+1}`
      })
    }
    
    await wrapper.vm.$nextTick()
    
    // Should only show 3 toasts (the 3 most recent ones)
    expect(wrapper.findAllComponents(Toast).length).toBe(3)
    
    const toastTitles = wrapper.findAllComponents(Toast).map(t => t.props('title'))
    expect(toastTitles).toContain('Toast 3')
    expect(toastTitles).toContain('Toast 4')
    expect(toastTitles).toContain('Toast 5')
  })

  it('returns the toast ID when addToast is called', () => {
    const wrapper = mount(ToastContainer)
    const vm = wrapper.vm as any
    
    const toastId = vm.addToast({
      type: 'success',
      title: 'Test Toast',
      message: 'This is a test toast'
    })
    
    expect(typeof toastId).toBe('string')
    expect(toastId.length).toBeGreaterThan(0)
  })

  it('removes toast with specific ID when removeToast is called', async () => {
    const wrapper = mount(ToastContainer)
    const vm = wrapper.vm as any
    
    // Add two toasts
    const id1 = vm.addToast({
      type: 'info',
      title: 'Toast 1',
      message: 'First toast'
    })
    
    const id2 = vm.addToast({
      type: 'success',
      title: 'Toast 2',
      message: 'Second toast'
    })
    
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(Toast).length).toBe(2)
    
    // Remove one toast by ID
    vm.removeToast(id1)
    
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(Toast).length).toBe(1)
    
    const remainingToast = wrapper.findComponent(Toast)
    expect(remainingToast.props('title')).toBe('Toast 2')
  })

  it('clears all toasts when clearAll method is called', async () => {
    const wrapper = mount(ToastContainer)
    const vm = wrapper.vm as any
    
    // Add multiple toasts
    for (let i = 0; i < 3; i++) {
      vm.addToast({
        type: 'info',
        title: `Toast ${i+1}`,
        message: `Message ${i+1}`
      })
    }
    
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(Toast).length).toBe(3)
    
    // Clear all toasts
    vm.clearAll()
    
    await wrapper.vm.$nextTick()
    expect(wrapper.findAllComponents(Toast).length).toBe(0)
  })
}) 
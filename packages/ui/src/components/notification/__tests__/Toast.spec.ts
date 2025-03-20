import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Toast from '../Toast.vue'

describe('Toast.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders correctly with default props', () => {
    const wrapper = mount(Toast)
    
    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.find('.border-info-500').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true) // Dismissible button should exist by default
  })

  it('renders with correct type classes', async () => {
    const types = ['info', 'success', 'warning', 'error']
    
    for (const type of types) {
      const wrapper = mount(Toast, {
        props: { type: type as 'info' | 'success' | 'warning' | 'error' }
      })
      
      expect(wrapper.find(`.border-${type}-500`).exists()).toBe(true)
    }
  })

  it('renders title and message correctly', () => {
    const title = 'Test Title'
    const message = 'Test Message'
    
    const wrapper = mount(Toast, {
      props: { title, message }
    })
    
    expect(wrapper.text()).toContain(title)
    expect(wrapper.text()).toContain(message)
  })

  it('emits dismiss event when close button is clicked', async () => {
    const wrapper = mount(Toast, {
      props: { dismissible: true }
    })
    
    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('dismiss')).toBeTruthy()
    expect(wrapper.emitted('dismiss')?.length).toBe(1)
  })

  it('auto-dismisses after duration', async () => {
    const duration = 3000
    const wrapper = mount(Toast, {
      props: { duration }
    })
    
    expect(wrapper.emitted('dismiss')).toBeFalsy()
    
    // Fast-forward time
    vi.advanceTimersByTime(duration)
    await flushPromises()
    
    expect(wrapper.emitted('dismiss')).toBeTruthy()
    expect(wrapper.emitted('dismiss')?.length).toBe(1)
  })

  it('does not auto-dismiss if duration is 0', async () => {
    const wrapper = mount(Toast, {
      props: { duration: 0 }
    })
    
    // Fast-forward time by a large amount
    vi.advanceTimersByTime(10000)
    await flushPromises()
    
    expect(wrapper.emitted('dismiss')).toBeFalsy()
  })

  it('renders action button when actionLabel is provided', () => {
    const actionLabel = 'Click Me'
    const wrapper = mount(Toast, {
      props: { actionLabel }
    })
    
    const actionButton = wrapper.find('button[type="button"]:not(.text-neutral-400)')
    expect(actionButton.exists()).toBe(true)
    expect(actionButton.text()).toContain(actionLabel)
  })

  it('emits action event with actionData when action button is clicked', async () => {
    const actionLabel = 'Click Me'
    const actionData = { id: 123, action: 'test' }
    
    const wrapper = mount(Toast, {
      props: { 
        actionLabel, 
        actionData 
      }
    })
    
    const actionButton = wrapper.find('button[type="button"]:not(.text-neutral-400)')
    await actionButton.trigger('click')
    
    expect(wrapper.emitted('action')).toBeTruthy()
    expect(wrapper.emitted('action')?.[0][0]).toEqual(actionData)
  })

  it('renders custom icon through slot', () => {
    const wrapper = mount(Toast, {
      slots: {
        icon: '<div class="custom-icon">Icon</div>'
      }
    })
    
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-icon').text()).toBe('Icon')
  })

  it('renders custom title through slot', () => {
    const wrapper = mount(Toast, {
      slots: {
        title: '<h3 class="custom-title">Custom Title</h3>'
      }
    })


    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-title').text()).toBe('Custom Title')
  })

  it('renders custom content through default slot', () => {
    const wrapper = mount(Toast, {
      slots: {
        default: '<p class="custom-content">Custom Content</p>'
      }
    })
    
    expect(wrapper.find('.custom-content').exists()).toBe(true)
    expect(wrapper.find('.custom-content').text()).toBe('Custom Content')
  })

  it('renders custom actions through actions slot', () => {
    const wrapper = mount(Toast, {
      slots: {
        actions: '<button class="custom-action">Custom Action</button>'
      }
    })
    
    expect(wrapper.find('.custom-action').exists()).toBe(true)
    expect(wrapper.find('.custom-action').text()).toBe('Custom Action')
  })

  it('stops auto-dismiss timer when component is unmounted', async () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const wrapper = mount(Toast, {
      props: { duration: 5000 }
    })
    
    wrapper.unmount()
    
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('respects dismissible prop', () => {
    const wrapper = mount(Toast, {
      props: { dismissible: false }
    })
    
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('allows multiple actions via actions slot', async () => {
    const wrapper = mount(Toast, {
      slots: {
        actions: `
          <button class="action-1">Action 1</button>
          <button class="action-2">Action 2</button>
        `
      }
    })
    
    expect(wrapper.find('.action-1').exists()).toBe(true)
    expect(wrapper.find('.action-2').exists()).toBe(true)
  })
}) 
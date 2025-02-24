import { Component, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'

interface RenderComposableResult<T> {
  result: T
  cleanup: () => void
}

export function renderComposable<T>(composable: () => T): RenderComposableResult<T> {
  let result!: T

  const TestComponent = defineComponent({
    setup() {
      result = composable()
      // Vue Test Utils requires a template
      return () => h('div')
    }
  })

  const wrapper = mount(TestComponent)

  return {
    result,
    cleanup: () => wrapper.unmount()
  }
}

export function createTestComponent(component: Component) {
  return defineComponent({
    components: { TestComponent: component },
    template: '<test-component />'
  })
}

export const waitForNextTick = async () => {
  await new Promise(resolve => setTimeout(resolve, 0))
}

export const waitForAnimation = async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
} 
import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/vue'
import TabNav from '../TabNav.vue'
import TabNavItem from '../TabNavItem.vue'
import TabContent from '../TabContent.vue'

describe('TabNav', () => {
  it('renders properly with default props', () => {
    const { getAllByRole } = render(TabNav, {
      slots: {
        default: `
          <TabNavItem value="tab1" label="Tab 1" />
          <TabNavItem value="tab2" label="Tab 2" />
          <TabNavItem value="tab3" label="Tab 3" />
        `
      },
      global: {
        components: {
          TabNavItem
        }
      }
    })
    
    const tabs = getAllByRole('tab')
    expect(tabs).toHaveLength(3)
    expect(tabs[0]).toHaveTextContent('Tab 1')
    expect(tabs[1]).toHaveTextContent('Tab 2')
    expect(tabs[2]).toHaveTextContent('Tab 3')
  })
  
  it('activates the default tab', () => {
    const { getAllByRole } = render(TabNav, {
      props: {
        defaultTab: 'tab2'
      },
      slots: {
        default: `
          <TabNavItem value="tab1" label="Tab 1" />
          <TabNavItem value="tab2" label="Tab 2" />
          <TabNavItem value="tab3" label="Tab 3" />
        `
      },
      global: {
        components: {
          TabNavItem
        }
      }
    })
    
    const tabs = getAllByRole('tab')
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
  })
  
  it('activates the tab via v-model', () => {
    const { getAllByRole } = render(TabNav, {
      props: {
        modelValue: 'tab3'
      },
      slots: {
        default: `
          <TabNavItem value="tab1" label="Tab 1" />
          <TabNavItem value="tab2" label="Tab 2" />
          <TabNavItem value="tab3" label="Tab 3" />
        `
      },
      global: {
        components: {
          TabNavItem
        }
      }
    })
    
    const tabs = getAllByRole('tab')
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
  })
  
  it('emits update:modelValue when a tab is clicked', async () => {
    const { getAllByRole, emitted } = render(TabNav, {
      props: {
        defaultTab: 'tab1'
      },
      slots: {
        default: `
          <TabNavItem value="tab1" label="Tab 1" />
          <TabNavItem value="tab2" label="Tab 2" />
          <TabNavItem value="tab3" label="Tab 3" />
        `
      },
      global: {
        components: {
          TabNavItem
        }
      }
    })
    
    const tabs = getAllByRole('tab')
    await fireEvent.click(tabs[1])
    
    expect(emitted()).toHaveProperty('update:modelValue')
    expect(emitted()['update:modelValue'][0]).toEqual(['tab2'])
  })
  
  it('shows content for active tab only', async () => {
    const { getAllByRole, getByText, queryByText } = render(TabNav, {
      props: {
        modelValue: 'tab1'
      },
      slots: {
        default: `
          <TabNavItem value="tab1" label="Tab 1" />
          <TabNavItem value="tab2" label="Tab 2" />
          <TabNavItem value="tab3" label="Tab 3" />
        `,
        content: `
          <TabContent value="tab1">Content for Tab 1</TabContent>
          <TabContent value="tab2">Content for Tab 2</TabContent>
          <TabContent value="tab3">Content for Tab 3</TabContent>
        `
      },
      global: {
        components: {
          TabNavItem,
          TabContent
        }
      }
    })
    
    // Vérifier que le contenu de l'onglet 1 est présent
    expect(getByText('Content for Tab 1')).toBeTruthy()
    
    // Vérifier que les contenus des autres onglets ne sont pas présents
    expect(queryByText('Content for Tab 2')).toBeNull()
    expect(queryByText('Content for Tab 3')).toBeNull()
    
    // Cliquer sur le deuxième onglet
    const tabs = getAllByRole('tab')
    await fireEvent.click(tabs[1])
    
    // Vérifier que le contenu de l'onglet 2 est présent, et les autres non
    expect(queryByText('Content for Tab 1')).toBeNull()
    expect(getByText('Content for Tab 2')).toBeTruthy()
    expect(queryByText('Content for Tab 3')).toBeNull()
  })
  
  it('disables tabs correctly', () => {
    const { getAllByRole } = render(TabNav, {
      slots: {
        default: `
          <TabNavItem value="tab1" label="Tab 1" />
          <TabNavItem value="tab2" label="Tab 2" disabled />
          <TabNavItem value="tab3" label="Tab 3" />
        `
      },
      global: {
        components: {
          TabNavItem
        }
      }
    })
    
    const tabs = getAllByRole('tab')
    expect(tabs[1]).toBeDisabled()
  })
  
  it('supports vertical orientation', () => {
    const { getByRole } = render(TabNav, {
      props: {
        vertical: true
      },
      slots: {
        default: `
          <TabNavItem value="tab1" label="Tab 1" />
          <TabNavItem value="tab2" label="Tab 2" />
        `
      },
      global: {
        components: {
          TabNavItem
        }
      }
    })
    
    const tablist = getByRole('tablist')
    expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
    expect(tablist.classList.contains('tab-nav-vertical')).toBe(true)
  })
  
  it('renders with different variants', () => {
    const { getByRole } = render(TabNav, {
      props: {
        variant: 'contained'
      },
      slots: {
        default: `
          <TabNavItem value="tab1" label="Tab 1" />
          <TabNavItem value="tab2" label="Tab 2" />
        `
      },
      global: {
        components: {
          TabNavItem
        }
      }
    })
    
    const tablist = getByRole('tablist')
    expect(tablist.classList.contains('tab-nav-contained')).toBe(true)
  })
}) 
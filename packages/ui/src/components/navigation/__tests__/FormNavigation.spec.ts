/**
 * Tests for FormNavigation component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import FormNavigation from '../FormNavigation.vue'

// Create a custom reactive mock for sectionStatuses
const mockSectionStatuses = {
  value: [
    {
      id: 'basics',
      label: 'Informations de base',
      isRequired: true,
      isComplete: true,
      isPartial: false,
      progress: 100,
      path: '/basics',
      icon: 'user'
    }, 
    {
      id: 'skills',
      label: 'Compétences',
      isRequired: true,
      isComplete: false,
      isPartial: true,
      progress: 50,
      path: '/skills',
      icon: 'code'
    }, 
    {
      id: 'work',
      label: 'Expérience professionnelle',
      isRequired: true,
      isComplete: false,
      isPartial: false,
      progress: 0,
      path: '/work',
      icon: 'briefcase'
    }
  ]
}

// Mock the useFormProgress composable
vi.mock('../../../modules/cv/presentation/composables/useFormProgress', () => ({
  useFormProgress: vi.fn(() => ({
    sectionStatuses: mockSectionStatuses,
    getNavigationSections: vi.fn((id) => {
      if (id === 'basics') return { prev: null, next: { id: 'skills', label: 'Compétences', path: '/skills' } }
      if (id === 'skills') return { 
        prev: { id: 'basics', label: 'Informations de base', path: '/basics' }, 
        next: { id: 'work', label: 'Expérience professionnelle', path: '/work' }
      }
      if (id === 'work') return { prev: { id: 'skills', label: 'Compétences', path: '/skills' }, next: null }
      return { prev: null, next: null }
    }),
    findNextIncompleteSection: { 
      id: 'work', 
      label: 'Expérience professionnelle', 
      path: '/work',
      isRequired: true,
      isComplete: false,
      isPartial: false,
      progress: 0,
      icon: 'briefcase'
    }
  }))
}))

describe('FormNavigation', () => {
  let wrapper: any

  beforeEach(() => {
    // Create the component wrapper
    wrapper = mount(FormNavigation, {
      props: {
        currentSection: 'skills',
        showCompletion: true
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    // Vérification des classes Tailwind qui remplacent la classe 'form-navigation'
    expect(wrapper.classes()).toContain('mt-8')
    expect(wrapper.classes()).toContain('mb-6')
  })

  it('displays previous and next section navigation buttons', () => {
    const navigationButtons = wrapper.findAll('button')
    expect(navigationButtons.length).toBe(2)
    
    // Vérifie le texte des boutons au lieu des attributs href
    expect(navigationButtons[0].text()).toContain('Informations de base')
    expect(navigationButtons[1].text()).toContain('Expérience professionnelle')
    
    // Vérifie que les boutons émettent des événements de navigation quand on clique dessus
    navigationButtons[0].trigger('click')
    expect(wrapper.emitted('navigate')).toBeTruthy()
    expect(wrapper.emitted('navigate')[0]).toEqual(['basics'])
    
    navigationButtons[1].trigger('click')
    expect(wrapper.emitted('navigate')[1]).toEqual(['work'])
  })

  it('shows the completion status when showCompletion is true', () => {
    // Utilisation des nouvelles classes Tailwind pour la vérification
    expect(wrapper.find('.flex.justify-center.mt-6').exists()).toBe(true)
    expect(wrapper.find('.bg-warning-500\\/15').exists()).toBe(true)
  })

  it('hides the completion status when showCompletion is false', async () => {
    await wrapper.setProps({ showCompletion: false })
    // Vérifie que l'élément avec la classe flex justify-center mt-6 n'existe pas
    expect(wrapper.find('.flex.justify-center.mt-6').exists()).toBe(false)
  })

  it('handles changing the current section', async () => {
    // Crée un nouveau wrapper pour ce test pour éviter les interférences
    const localWrapper = mount(FormNavigation, {
      props: {
        currentSection: 'work',
        showCompletion: true
      }
    })
    
    const navigationButtons = localWrapper.findAll('button')
    
    // Puisque nous avons une "nextIncompleteSection", nous avons toujours 2 boutons:
    // un pour la section précédente et un pour la prochaine section incomplète
    expect(navigationButtons.length).toBe(2)
    
    // Vérifie que le premier bouton est pour la section précédente
    expect(navigationButtons[0].text()).toContain('Compétences')
    
    // Vérifie que le second bouton déclenche la navigation vers la prochaine section incomplète
    navigationButtons[1].trigger('click')
    const navigateEvents = localWrapper.emitted('navigate');
    expect(navigateEvents).toBeTruthy();
    expect(navigateEvents?.[0]).toEqual(['work']);
  })
}) 
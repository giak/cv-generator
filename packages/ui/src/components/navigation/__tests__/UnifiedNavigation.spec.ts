/**
 * Tests for UnifiedNavigation component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import UnifiedNavigation from '../UnifiedNavigation.vue'
import type { SectionStatus } from '../../../modules/cv/presentation/composables/useFormProgress'
import { computed } from 'vue'

// Créer un mock pour sectionStatuses avec la structure correcte
const mockSectionStatuses: SectionStatus[] = [
  {
    id: 'basics',
    label: 'Informations de base',
    isRequired: true,
    isComplete: true,
    isPartial: false,
    progress: 100,
    path: '#basics',
    icon: 'user'
  }, 
  {
    id: 'skills',
    label: 'Compétences',
    isRequired: true,
    isComplete: false,
    isPartial: true,
    progress: 50,
    path: '#skills',
    icon: 'code'
  }, 
  {
    id: 'work',
    label: 'Expérience professionnelle',
    isRequired: true,
    isComplete: false,
    isPartial: false,
    progress: 0,
    path: '#work',
    icon: 'briefcase'
  }
]

// Mock du composable useFormProgress en suivant sa structure réelle
vi.mock('../../../modules/cv/presentation/composables/useFormProgress', () => ({
  useFormProgress: vi.fn(() => ({
    sectionStatuses: computed(() => mockSectionStatuses),
    requiredSectionsCompletion: {
      completed: 1,
      total: 3,
      percentage: 33
    },
    overallProgress: 45,
    isNextToComplete: (id: string) => id === 'skills',
    findNextIncompleteSection: computed(() => ({ 
      id: 'skills', 
      label: 'Compétences', 
      path: '#skills',
      isRequired: true,
      isComplete: false,
      isPartial: true,
      progress: 50,
      icon: 'code'
    }))
  }))
}))

describe('UnifiedNavigation', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Create the component wrapper with default props
    wrapper = mount(UnifiedNavigation, {
      props: {
        currentSection: 'basics'
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('rounded-lg')
    expect(wrapper.classes()).toContain('border')
  })

  it('displays the overall progress percentage', () => {
    expect(wrapper.find('.text-primary-400').text()).toBe('45%')
  })

  it('displays the required sections completion correctly', () => {
    const requiredText = wrapper.find('.text-primary-300').text()
    expect(requiredText).toBe('1/3')
  })

  it('renders all sections in the navigation list', () => {
    // Sélectionner tous les divs à cliquer dans la div.py-2
    const sections = wrapper.findAll('.py-2 .relative .group')
    expect(sections.length).toBe(mockSectionStatuses.length)
  })

  it('highlights the current section', () => {
    // La première section est 'basics' et devrait être active
    const basicsSection = wrapper.findAll('.py-2 .relative .group').at(0)
    expect(basicsSection?.classes()).toContain('bg-primary-900/30')
    expect(basicsSection?.classes()).toContain('text-primary-300')
  })

  it('shows the "next" indicator for the next section to complete', () => {
    // La deuxième section est 'skills' et devrait avoir l'indicateur "Suivant"
    const skillsSection = wrapper.findAll('.py-2 .relative .group').at(1)
    const nextIndicator = skillsSection?.find('.bg-primary-800\\/50')
    expect(nextIndicator?.exists()).toBe(true)
    expect(nextIndicator?.text()).toBe('Suivant')
  })

  it('displays the "Continue with" button with next incomplete section', () => {
    const continueButton = wrapper.find('.border-t.border-neutral-800 div')
    expect(continueButton.exists()).toBe(true)
    expect(continueButton.text()).toContain('Continuer avec Compétences')
  })

  it('shows progress percentage for partial sections', () => {
    // La deuxième section est 'skills' et a un progrès partiel de 50%
    const skillsSection = wrapper.findAll('.py-2 .relative .group').at(1)
    const progressBadge = skillsSection?.find('.bg-neutral-800.text-neutral-400')
    expect(progressBadge?.exists()).toBe(true)
    expect(progressBadge?.text().trim()).toContain('50%')
  })

  it('emits navigate event on section click', async () => {
    // Cliquer sur la section skills
    const skillsSection = wrapper.findAll('.py-2 .relative .group').at(1)
    await skillsSection?.trigger('click')
    
    // Vérifier que l'événement navigate a été émis avec le bon chemin
    expect(wrapper.emitted('navigate')).toBeTruthy()
    expect(wrapper.emitted('navigate')?.[0]).toEqual(['#skills'])
  })

  it('emits navigate event on continue button click', async () => {
    // Cliquer sur le bouton "Continuer avec"
    const continueButton = wrapper.find('.border-t.border-neutral-800 div')
    await continueButton.trigger('click')
    
    // Vérifier que l'événement navigate a été émis avec le bon chemin
    expect(wrapper.emitted('navigate')).toBeTruthy()
    expect(wrapper.emitted('navigate')?.[0]).toEqual(['#skills'])
  })

  it('changes current section when props change', async () => {
    // Mettre à jour la prop currentSection pour skills
    await wrapper.setProps({ currentSection: 'skills' })
    
    // Après la mise à jour, la deuxième section devrait être active
    const basicsSection = wrapper.findAll('.py-2 .relative .group').at(0)
    const skillsSection = wrapper.findAll('.py-2 .relative .group').at(1)
    
    // La section "Informations de base" ne devrait plus être active
    expect(basicsSection?.classes()).not.toContain('bg-primary-900/30')
    
    // La section "Compétences" devrait maintenant être active
    expect(skillsSection?.classes()).toContain('bg-primary-900/30')
    expect(skillsSection?.classes()).toContain('text-primary-300')
  })

  it('displays icons correctly', () => {
    // Sélectionner la deuxième span dans chaque section (celle qui contient l'icône)
    const sections = wrapper.findAll('.py-2 .relative .group')
    
    // Cette span doit avoir la classe text-neutral-400 qui correspond au conteneur d'icône
    const iconContainers = sections.map(section => 
      section.findAll('.flex-shrink-0').at(1)
    )
    
    // Vérifie que tous les conteneurs d'icônes existent
    expect(iconContainers.every(container => container?.exists())).toBe(true)
    
    // Dans le cas de notre mock, les icônes sont définies par la propriété icon,
    // mais dans notre composant, elles ne sont pas injectées directement dans le HTML
    // Nous avons besoin de vérifier que les slots fonctionnent correctement
    
    // Une façon de tester serait de monter le composant avec des slots,
    // mais pour simplifier, nous vérifions juste que les conteneurs existent
    // et qu'ils ont la bonne structure
    const firstIconContainer = sections.at(0)?.findAll('.flex-shrink-0').at(1)
    expect(firstIconContainer?.classes()).toContain('text-neutral-400')
  })
}) 
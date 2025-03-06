/**
 * Tests for ProgressIndicator component
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressIndicator from '../ProgressIndicator.vue'

// Mock the RouterLink component
vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  }
}))

// Mock the useFormProgress composable
vi.mock('../../../modules/cv/presentation/composables/useFormProgress', () => ({
  useFormProgress: vi.fn(() => ({
    sectionStatuses: [{
      id: 'basics',
      label: 'Informations de base',
      isRequired: true,
      isComplete: true,
      isPartial: false,
      progress: 100,
      path: '#basics',
      icon: 'user'
    }, {
      id: 'skills',
      label: 'Compétences',
      isRequired: true,
      isComplete: false,
      isPartial: true,
      progress: 50,
      path: '#skills',
      icon: 'code'
    }, {
      id: 'work',
      label: 'Expérience professionnelle',
      isRequired: true,
      isComplete: false,
      isPartial: false,
      progress: 0,
      path: '#work',
      icon: 'briefcase'
    }],
    requiredSectionsCompletion: {
      total: 3,
      completed: 1,
      percentage: 33
    },
    overallProgress: 45,
    isNextToComplete: (id: string) => id === 'skills',
    findNextIncompleteSection: {
      id: 'skills',
      label: 'Compétences',
      isRequired: true,
      isComplete: false,
      isPartial: true,
      progress: 50,
      path: '#skills',
      icon: 'code'
    }
  }))
}))

describe('ProgressIndicator', () => {
  it('renders correctly', () => {
    const wrapper = mount(ProgressIndicator)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('rounded-lg')
    expect(wrapper.classes()).toContain('border')
  })

  it('displays the overall progress percentage', () => {
    const wrapper = mount(ProgressIndicator)
    expect(wrapper.find('.text-primary-400').text()).toBe('45%')
  })

  it('shows the progress bar with correct width', () => {
    const wrapper = mount(ProgressIndicator)
    const progressBar = wrapper.find('.bg-primary-500')
    expect(progressBar.attributes('style')).toContain('width: 45%')
  })

  it('displays the required sections completion status', () => {
    const wrapper = mount(ProgressIndicator)
    expect(wrapper.find('.text-sm.text-neutral-400').text()).toContain('1/3')
  })

  it('shows all sections with correct status indicators', () => {
    const wrapper = mount(ProgressIndicator)
    const sectionItems = wrapper.findAll('.rounded-md.transition-colors')
    
    expect(sectionItems.length).toBe(3)
    
    // Check the complete section
    expect(sectionItems[0].classes()).toContain('bg-neutral-800/30')
    expect(sectionItems[0].find('.text-success-400').exists()).toBe(true)
    
    // Check the partial section
    expect(sectionItems[1].classes()).toContain('bg-neutral-800/20')
    expect(sectionItems[1].find('.text-warning-400').exists()).toBe(true)
    expect(sectionItems[1].find('.bg-neutral-800.text-neutral-400').text()).toBe('50%')
    
    // Check the empty section
    expect(sectionItems[2].classes()).not.toContain('bg-neutral-800/30')
    expect(sectionItems[2].classes()).not.toContain('bg-neutral-800/20')
    expect(sectionItems[2].find('.text-neutral-500').exists()).toBe(true)
  })

  it('marks required sections correctly', () => {
    const wrapper = mount(ProgressIndicator)
    const requiredSections = wrapper.findAll('.border-l-2.border-primary-700')
    expect(requiredSections.length).toBe(3)
  })

  it('shows the next to complete indicator for the correct section', () => {
    const wrapper = mount(ProgressIndicator)
    const nextIndicators = wrapper.findAll('.bg-primary-800\\/30.text-primary-300')
    expect(nextIndicators.length).toBe(1)
    expect(nextIndicators[0].text()).toBe('Suivant')
    
    // The next section should be the skills section
    const skillsSection = wrapper.findAll('.rounded-md.transition-colors')[1]
    expect(skillsSection.find('.bg-primary-800\\/30.text-primary-300').exists()).toBe(true)
  })

  it('provides a button to continue with the next incomplete section', () => {
    const wrapper = mount(ProgressIndicator)
    const continueButton = wrapper.find('.bg-primary-700\\/20')
    expect(continueButton.exists()).toBe(true)
    expect(continueButton.text()).toContain('Compétences')
    expect(continueButton.attributes('href')).toBe('#skills')
  })
}) 
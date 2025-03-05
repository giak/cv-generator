import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DateRangeFields from '../DateRangeFields.vue'
import FormField from '../FormField.vue'

// Mock du composant FormField pour simplifier les tests
vi.mock('../FormField.vue', () => ({
  default: {
    name: 'FormField',
    template: '<div data-testid="form-field"><slot /></div>',
    props: ['modelValue', 'label', 'error', 'placeholder', 'helpText', 'icon', 'required', 'id', 'name'],
    emits: ['update:modelValue', 'blur']
  }
}))

describe('DateRangeFields', () => {
  const createWrapper = (props = {}) => {
    return mount(DateRangeFields, {
      props: {
        startDate: '',
        ...props
      },
      global: {
        stubs: {
          FormField
        }
      }
    })
  }
  
  it('should render correctly with default props', () => {
    const wrapper = createWrapper()
    
    // Vérifier que les deux champs de date et le checkbox sont rendus
    const formFields = wrapper.findAllComponents(FormField)
    expect(formFields.length).toBe(2)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
    
    // Vérifier les labels par défaut
    if (formFields.length >= 2) {
      expect(formFields[0].props('label')).toBe('Date de début')
      expect(formFields[1].props('label')).toBe('Date de fin')
    }
    expect(wrapper.find('label').text()).toBe('En cours')
  })
  
  it('should hide end date field when isCurrentlyActive is true', async () => {
    const wrapper = createWrapper({ isCurrentlyActive: true })
    
    // Un seul champ de date devrait être visible
    expect(wrapper.findAllComponents(FormField).length).toBe(1)
    
    // Le checkbox devrait être coché
    const checkbox = wrapper.find('input[type="checkbox"]').element as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })
  
  it('should emit update events when dates change', async () => {
    const wrapper = createWrapper()
    
    const formFields = wrapper.findAllComponents(FormField)
    if (formFields.length > 0) {
      // Simuler la mise à jour de la date de début
      await formFields[0].vm.$emit('update:modelValue', '2023-01-01')
      
      // Vérifier que l'événement est émis avec la bonne valeur
      const startDateEvents = wrapper.emitted('update:startDate')
      expect(startDateEvents).toBeTruthy()
      if (startDateEvents) {
        expect(startDateEvents[0]).toEqual(['2023-01-01'])
      }
      
      // Vérifier que l'événement global est également émis
      const rangeChangeEvents = wrapper.emitted('date-range-change')
      expect(rangeChangeEvents).toBeTruthy()
      if (rangeChangeEvents) {
        expect(rangeChangeEvents[0][0]).toEqual({
          startDate: '2023-01-01',
          endDate: '',
          isCurrentlyActive: false
        })
      }
    }
  })
  
  it('should clear end date when isCurrentlyActive becomes true', async () => {
    const wrapper = createWrapper({
      startDate: '2023-01-01',
      endDate: '2023-12-31'
    })
    
    // Simuler le clic sur le checkbox "en cours"
    await wrapper.find('input[type="checkbox"]').setValue(true)
    
    // Vérifier que l'événement de mise à jour de la date de fin est émis avec une valeur vide
    const endDateEvents = wrapper.emitted('update:endDate')
    expect(endDateEvents).toBeTruthy()
    if (endDateEvents) {
      expect(endDateEvents[0]).toEqual([''])
    }
    
    // Vérifier que l'événement de mise à jour de l'état "en cours" est émis
    const isCurrentlyActiveEvents = wrapper.emitted('update:isCurrentlyActive')
    expect(isCurrentlyActiveEvents).toBeTruthy()
    if (isCurrentlyActiveEvents) {
      expect(isCurrentlyActiveEvents[0]).toEqual([true])
    }
  })
  
  it('should turn off isCurrentlyActive when end date is set', async () => {
    const wrapper = createWrapper({
      startDate: '2023-01-01',
      isCurrentlyActive: true
    })
    
    // Manually trigger the handleEndDateChange method
    const vm = wrapper.vm as any
    vm.handleEndDateChange('2023-12-31')
    
    // Vérifier que l'événement de mise à jour de l'état "en cours" est émis avec false
    const isCurrentlyActiveEvents = wrapper.emitted('update:isCurrentlyActive')
    expect(isCurrentlyActiveEvents).toBeTruthy()
    if (isCurrentlyActiveEvents) {
      expect(isCurrentlyActiveEvents[0]).toEqual([false])
    }
  })
  
  it('should validate date format correctly', async () => {
    const wrapper = createWrapper()
    
    // Access the component instance to test the validation methods directly
    const vm = wrapper.vm as any
    
    // Valid formats
    expect(vm.validateDateFormat('2023-01-01')).toBe(true)
    expect(vm.validateDateFormat('')).toBe(true) // Empty is valid by default
    
    // Invalid formats
    expect(vm.validateDateFormat('01/01/2023')).toBe(false)
    expect(vm.validateDateFormat('2023-13-01')).toBe(false) // Invalid month
    expect(vm.validateDateFormat('not-a-date')).toBe(false)
  })
  
  it('should validate date ranges correctly', async () => {
    const wrapper = createWrapper()
    
    // Access the component instance to test the validation methods directly
    const vm = wrapper.vm as any
    
    // Valid ranges
    expect(vm.validateDateRange('2023-01-01', '2023-12-31')).toBe(true)
    expect(vm.validateDateRange('2023-01-01', '2023-01-01')).toBe(true) // Same day
    expect(vm.validateDateRange('', '')).toBe(true) // Both empty
    expect(vm.validateDateRange('2023-01-01', '')).toBe(true) // End date empty
    
    // Invalid ranges
    expect(vm.validateDateRange('2023-12-31', '2023-01-01')).toBe(false) // End before start
  })
  
  it('should handle accessibility attributes correctly', () => {
    // Test with custom IDs
    const wrapper = createWrapper({
      startDateId: 'custom-start-id',
      currentlyActiveId: 'custom-active-id'
    })
    
    // Check that the checkbox has the custom ID
    expect(wrapper.find('input[type="checkbox"]').attributes('id')).toBe('custom-active-id')
    
    // Verify that our component received the correct props
    expect(wrapper.props('startDateId')).toBe('custom-start-id')
    expect(wrapper.props('currentlyActiveId')).toBe('custom-active-id')
    expect(wrapper.props('endDateId')).toBeUndefined() // We didn't provide this
  })
}) 
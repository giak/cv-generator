import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CollectionManager from '../CollectionManager.vue'
import EmptyState from '../EmptyState.vue'
import Button from '../Button.vue'
import Card from '../Card.vue'
import ConfirmationModal from '../ConfirmationModal.vue'

// Mock des composants enfants
vi.mock('../EmptyState.vue', () => ({
  default: {
    name: 'EmptyState',
    template: '<div class="empty-state-mock"><slot></slot><slot name="icon"></slot></div>',
    props: ['title', 'description']
  }
}))

vi.mock('../ConfirmationModal.vue', () => ({
  default: {
    name: 'ConfirmationModal',
    template: '<div class="confirmation-modal-mock"></div>',
    props: ['modelValue', 'title', 'message'],
    emits: ['update:modelValue', 'confirm', 'cancel']
  }
}))

describe('CollectionManager', () => {
  const mockItems = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' }
  ]
  
  let wrapper: ReturnType<typeof mount>
  
  beforeEach(() => {
    wrapper = mount(CollectionManager, {
      props: {
        items: mockItems,
        title: 'Test Collection',
        description: 'Test Description'
      },
      global: {
        stubs: {
          Button,
          Card
        }
      }
    })
  })
  
  it('renders correctly with items', () => {
    expect(wrapper.find('h2').text()).toBe('Test Collection')
    expect(wrapper.find('p').text()).toBe('Test Description')
    expect(wrapper.findAll('.collection-item')).toHaveLength(3)
  })
  
  it('renders empty state when no items are provided', async () => {
    await wrapper.setProps({ items: [] })
    expect(wrapper.findComponent(EmptyState).exists()).toBe(true)
  })
  
  it('renders loading state when loading prop is true', async () => {
    await wrapper.setProps({ loading: true })
    expect(wrapper.find('.collection-loading').exists()).toBe(true)
  })
  
  it('emits add event when add button is clicked', async () => {
    await wrapper.find('button[type="button"]').trigger('click')
    expect(wrapper.emitted('add')).toBeTruthy()
  })
  
  it('emits edit event with item when edit button is clicked', async () => {
    // Trouver tous les boutons d'édition et cliquer sur le premier
    const editButtons = wrapper.findAll('button[title="Modifier"]')
    await editButtons[0].trigger('click')
    
    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockItems[0]])
  })
  
  it('shows confirmation modal when delete button is clicked', async () => {
    // Trouver tous les boutons de suppression et cliquer sur le premier
    const deleteButtons = wrapper.findAll('button[title="Supprimer"]')
    await deleteButtons[0].trigger('click')
    
    // Vérifier que le modal de confirmation est affiché
    expect(wrapper.findComponent(ConfirmationModal).exists()).toBe(true)
    expect(wrapper.findComponent(ConfirmationModal).isVisible()).toBe(true)
  })
  
  it('emits delete event when deletion is confirmed', async () => {
    // Simuler un clic sur le bouton de suppression
    const deleteButtons = wrapper.findAll('button[title="Supprimer"]')
    await deleteButtons[0].trigger('click')
    
    // Simuler la confirmation de suppression en émettant l'événement confirm du modal
    wrapper.findComponent(ConfirmationModal).vm.$emit('confirm')
    
    // Vérifier que l'événement delete est émis
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockItems[0]])
  })
  
  it('cancels deletion when cancel is called', async () => {
    // Simuler un clic sur le bouton de suppression
    const deleteButtons = wrapper.findAll('button[title="Supprimer"]')
    await deleteButtons[0].trigger('click')
    
    // Simuler l'annulation de suppression en émettant l'événement cancel du modal
    wrapper.findComponent(ConfirmationModal).vm.$emit('cancel')
    
    // Vérifier qu'aucun événement delete n'est émis
    expect(wrapper.emitted('delete')).toBeFalsy()
  })
  
  it('skips confirmation when confirmDelete prop is false', async () => {
    await wrapper.setProps({ confirmDelete: false })
    
    // Simuler un clic sur le bouton de suppression
    const deleteButtons = wrapper.findAll('button[title="Supprimer"]')
    await deleteButtons[0].trigger('click')
    
    // Vérifier que l'événement delete est émis directement sans confirmation
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockItems[0]])
  })
  
  it('uses custom idField prop to identify items', async () => {
    const customItems = [
      { customId: 'a', name: 'Item A' },
      { customId: 'b', name: 'Item B' }
    ]
    
    const customWrapper = mount(CollectionManager, {
      props: {
        items: customItems,
        idField: 'customId'
      },
      global: {
        stubs: {
          Button,
          Card
        }
      }
    })
    
    // Vérifier que les éléments sont correctement rendus avec l'identifiant personnalisé
    expect(customWrapper.findAll('.collection-item')).toHaveLength(2)
    
    // Simuler un clic sur le bouton de suppression
    const deleteButtons = customWrapper.findAll('button[title="Supprimer"]')
    await deleteButtons[0].trigger('click')
    
    // Vérifier que l'événement delete est émis avec le bon élément
    customWrapper.findComponent(ConfirmationModal).vm.$emit('confirm')
    expect(customWrapper.emitted('delete')).toBeTruthy()
    expect(customWrapper.emitted('delete')?.[0]).toEqual([customItems[0]])
  })
}) 
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, reactive } from 'vue'
import { useCollectionField } from '../useCollectionField'

// Mock uuid
vi.mock('uuid', () => ({
  v4: () => 'mock-uuid'
}))

// Test interface
interface TestItem {
  id?: string
  name: string
  value: number
}

describe('useCollectionField', () => {
  // Setup common test variables
  const defaultItemValues: TestItem = { name: '', value: 0 }
  let formModel: { items: TestItem[] }
  let updateFieldFn: vi.Mock
  
  beforeEach(() => {
    // Reset state before each test
    formModel = reactive({ items: [] })
    updateFieldFn = vi.fn((field: string, value: TestItem[]) => {
      formModel[field as keyof typeof formModel] = value
    })
  })
  
  it('should initialize with empty collection', () => {
    const { items } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues
    })
    
    expect(items.value).toEqual([])
  })
  
  it('should add an item to the collection', () => {
    const { addItem, items } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues
    })
    
    // Add a new item
    const newItem: TestItem = { name: 'Test', value: 42 }
    addItem(newItem)
    
    // Check item was added with ID
    expect(items.value).toHaveLength(1)
    expect(items.value[0].name).toBe('Test')
    expect(items.value[0].value).toBe(42)
    expect(items.value[0].id).toBe('mock-uuid')
    
    // Check update function was called
    expect(updateFieldFn).toHaveBeenCalledWith('items', [
      { name: 'Test', value: 42, id: 'mock-uuid' }
    ])
  })
  
  it('should remove an item by ID', () => {
    // Initialize with existing items
    formModel.items = [
      { id: 'item-1', name: 'Item 1', value: 1 },
      { id: 'item-2', name: 'Item 2', value: 2 }
    ]
    
    const { removeItem, items } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues
    })
    
    // Remove by ID
    removeItem('item-1')
    
    // Check item was removed
    expect(items.value).toHaveLength(1)
    expect(items.value[0].id).toBe('item-2')
    expect(updateFieldFn).toHaveBeenCalledWith('items', [{ id: 'item-2', name: 'Item 2', value: 2 }])
  })
  
  it('should remove an item by index', () => {
    // Initialize with existing items
    formModel.items = [
      { id: 'item-1', name: 'Item 1', value: 1 },
      { id: 'item-2', name: 'Item 2', value: 2 }
    ]
    
    const { removeItem, items } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues
    })
    
    // Remove by index
    removeItem(0)
    
    // Check item was removed
    expect(items.value).toHaveLength(1)
    expect(items.value[0].id).toBe('item-2')
  })
  
  it('should update an existing item', () => {
    // Initialize with existing items
    formModel.items = [
      { id: 'item-1', name: 'Item 1', value: 1 },
      { id: 'item-2', name: 'Item 2', value: 2 }
    ]
    
    const { updateItem, items } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues
    })
    
    // Update item
    updateItem('item-1', { name: 'Updated Item', value: 99 })
    
    // Check item was updated
    expect(items.value).toHaveLength(2)
    expect(items.value[0].name).toBe('Updated Item')
    expect(items.value[0].value).toBe(99)
    expect(items.value[0].id).toBe('item-1') // ID should remain the same
    
    // Check update function was called with correct data
    expect(updateFieldFn).toHaveBeenCalledWith('items', [
      { id: 'item-1', name: 'Updated Item', value: 99 },
      { id: 'item-2', name: 'Item 2', value: 2 }
    ])
  })
  
  it('should start editing an item', () => {
    // Initialize with existing items
    formModel.items = [
      { id: 'item-1', name: 'Item 1', value: 1 },
      { id: 'item-2', name: 'Item 2', value: 2 }
    ]
    
    const { startEditing, editingItemId } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues
    })
    
    // Start editing
    const itemToEdit = startEditing('item-2')
    
    // Check editing state
    expect(editingItemId.value).toBe('item-2')
    expect(itemToEdit).toEqual({ id: 'item-2', name: 'Item 2', value: 2 })
    
    // Check item is a copy, not a reference
    itemToEdit.name = 'Modified'
    expect(formModel.items[1].name).toBe('Item 2') // Original unchanged
  })
  
  it('should toggle add form state', () => {
    const { isAddingItem, toggleAddForm } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues
    })
    
    // Initially closed
    expect(isAddingItem.value).toBe(false)
    
    // Toggle open
    toggleAddForm()
    expect(isAddingItem.value).toBe(true)
    
    // Toggle closed
    toggleAddForm()
    expect(isAddingItem.value).toBe(false)
  })
  
  it('should reset new item to defaults', () => {
    const { newItem, resetNewItem } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues
    })
    
    // Modify new item
    newItem.value.name = 'Test Name'
    newItem.value.value = 123
    
    // Reset
    resetNewItem()
    
    // Check defaults restored
    expect(newItem.value.name).toBe('')
    expect(newItem.value.value).toBe(0)
  })
  
  it('should cancel editing', () => {
    // Initialize with existing items
    formModel.items = [
      { id: 'item-1', name: 'Item 1', value: 1 }
    ]
    
    const { startEditing, cancelEditing, editingItemId } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues
    })
    
    // Start editing
    startEditing('item-1')
    expect(editingItemId.value).toBe('item-1')
    
    // Cancel editing
    cancelEditing()
    expect(editingItemId.value).toBeNull()
  })
  
  it('should validate items before adding', () => {
    const validateItem = vi.fn((item: TestItem) => {
      const errors: Record<string, string> = {}
      
      if (!item.name) {
        errors.name = 'Name is required'
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      }
    })
    
    const { addItem, items, validationErrors } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues,
      validateItem
    })
    
    // Try to add invalid item
    addItem({ name: '', value: 42 })
    
    // Should not be added
    expect(items.value).toHaveLength(0)
    expect(validationErrors.value).toEqual({ name: 'Name is required' })
    expect(updateFieldFn).not.toHaveBeenCalled()
    
    // Try to add valid item
    addItem({ name: 'Valid Item', value: 42 })
    
    // Should be added
    expect(items.value).toHaveLength(1)
    expect(items.value[0].name).toBe('Valid Item')
  })
  
  it('should reorder items', () => {
    // Initialize with existing items
    formModel.items = [
      { id: 'item-1', name: 'Item 1', value: 1 },
      { id: 'item-2', name: 'Item 2', value: 2 },
      { id: 'item-3', name: 'Item 3', value: 3 }
    ]
    
    const { reorderItems, items } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: updateFieldFn,
      collection: () => formModel.items,
      defaultItemValues
    })
    
    // Reorder items
    reorderItems(['item-3', 'item-1', 'item-2'])
    
    // Check new order
    expect(items.value.map(item => item.id)).toEqual(['item-3', 'item-1', 'item-2'])
    expect(updateFieldFn).toHaveBeenCalled()
  })
  
  it('should handle Ref collections', () => {
    // Use ref instead of function for collection
    const collectionRef = ref<TestItem[]>([
      { id: 'item-1', name: 'Item 1', value: 1 }
    ])
    
    const { items, addItem } = useCollectionField<TestItem>({
      fieldName: 'items',
      updateField: (field, value) => {
        collectionRef.value = value
      },
      collection: collectionRef,
      defaultItemValues
    })
    
    // Should have initial data
    expect(items.value).toHaveLength(1)
    expect(items.value[0].id).toBe('item-1')
    
    // Add new item
    addItem({ name: 'New Item', value: 99 })
    
    // Should update ref
    expect(collectionRef.value).toHaveLength(2)
    expect(collectionRef.value[1].name).toBe('New Item')
  })
  
  it('should use custom identifier field', () => {
    interface CustomIdItem {
      customId?: string
      name: string
    }
    
    // Model with custom ID field
    const customModel = reactive({ items: [] as CustomIdItem[] })
    const updateCustomField = vi.fn((field: string, value: CustomIdItem[]) => {
      customModel[field as keyof typeof customModel] = value
    })
    
    const { addItem, items } = useCollectionField<CustomIdItem>({
      fieldName: 'items',
      updateField: updateCustomField,
      collection: () => customModel.items,
      defaultItemValues: { name: '' },
      identifierField: 'customId'
    })
    
    // Add new item
    addItem({ name: 'Custom ID Test' })
    
    // Check ID field is correctly set
    expect(items.value).toHaveLength(1)
    expect(items.value[0].customId).toBe('mock-uuid')
    expect(items.value[0].customId).toBeDefined()
    expect((items.value[0] as any).id).toBeUndefined() // No id field
  })
}) 
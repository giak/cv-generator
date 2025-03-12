/**
 * useCollectionField.ts
 * 
 * A composable for managing collection fields in form components.
 * This handles common operations such as:
 * - Adding items to a collection
 * - Removing items from a collection
 * - Updating specific items in a collection
 * - Managing temporary state for adding new items
 * - Validating collection items
 */

import { ref, Ref, reactive, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { 
  ResultType, 
  ValidationErrorInterface, 
  isSuccess, 
  isFailure,
  createSuccess 
} from '@cv-generator/shared'

export interface CollectionFieldOptions<T extends Record<string, any>> {
  /**
   * The field name in the parent model that contains the collection
   */
  fieldName: string
  
  /**
   * Function to update the collection in the parent model
   */
  updateField: (field: string, value: T[]) => void
  
  /**
   * Current collection from the parent model
   */
  collection: Ref<T[]> | (() => T[])
  
  /**
   * Default values for a new item
   */
  defaultItemValues: T
  
  /**
   * Optional validator function for items using Result pattern
   * Returns a ResultType<T> with success/failure instead of { isValid, errors }
   */
  validateItem?: (item: T) => ResultType<T>
  
  /**
   * Optional field to use as a unique identifier (defaults to 'id')
   */
  identifierField?: keyof T
  
  /**
   * Whether to enable performance logging
   */
  enableLogging?: boolean
}

export interface CollectionFieldReturn<T extends Record<string, any>> {
  /**
   * Current collection items
   */
  items: Ref<T[]>
  
  /**
   * New item being prepared for addition
   */
  newItem: Ref<T>
  
  /**
   * Whether the add form is currently visible
   */
  isAddingItem: Ref<boolean>
  
  /**
   * ID of the item being edited (if any)
   */
  editingItemId: Ref<string | null>
  
  /**
   * Any validation errors for the current item
   */
  validationErrors: Ref<Record<string, string>>
  
  /**
   * Last validation result using Result pattern
   */
  lastValidationResult: Ref<ResultType<T> | null>
  
  /**
   * Add a new item to the collection
   */
  addItem: (item?: T) => void
  
  /**
   * Remove an item from the collection by ID or index
   */
  removeItem: (idOrIndex: string | number) => void
  
  /**
   * Update an existing item in the collection
   */
  updateItem: (id: string, updatedItem: T) => void
  
  /**
   * Setup editing for an existing item
   */
  startEditing: (idOrIndex: string | number) => T
  
  /**
   * Reset the new item to default values
   */
  resetNewItem: () => void
  
  /**
   * Toggle the visibility of the add form
   */
  toggleAddForm: () => void
  
  /**
   * Cancel current editing operation
   */
  cancelEditing: () => void
  
  /**
   * Reorder collection items
   */
  reorderItems: (newOrder: string[]) => void
  
  /**
   * Performance metrics if logging is enabled
   */
  perfMetrics?: {
    addOperations: number
    removeOperations: number
    updateOperations: number
    validationOperations: number
  }
}

/**
 * Composable for managing collection fields in form components
 */
export function useCollectionField<T extends Record<string, any>>(
  options: CollectionFieldOptions<T>
): CollectionFieldReturn<T> {
  const {
    fieldName,
    updateField,
    collection,
    defaultItemValues,
    validateItem,
    identifierField = 'id' as keyof T,
    enableLogging = false
  } = options
  
  // Performance metrics
  const perfMetrics = enableLogging ? {
    addOperations: 0,
    removeOperations: 0,
    updateOperations: 0,
    validationOperations: 0
  } : undefined
  
  // State management
  const isAddingItem = ref(false)
  const editingItemId = ref<string | null>(null)
  const validationErrors = ref<Record<string, string>>({})
  const lastValidationResult = ref<ResultType<T> | null>(null)
  
  // Create a reactive new item with default values
  const newItem = reactive({ ...defaultItemValues }) as T
  
  // Computed items from the collection
  const items = computed(() => {
    return typeof collection === 'function' ? collection() : collection.value
  })
  
  // Generate a unique ID for a new item
  const generateId = (): string => {
    return uuidv4()
  }
  
  // Validate an item
  const validateItemInternal = (item: T): ResultType<T> => {
    if (!validateItem) {
      return createSuccess(item)
    }
    
    const startTime = enableLogging ? performance.now() : 0
    
    const result = validateItem(item)
    lastValidationResult.value = result
    
    // Update the validationErrors object based on the result
    if (isFailure(result)) {
      const errorMap: Record<string, string> = {}
      result.error.forEach(err => {
        if (err.field) {
          errorMap[err.field] = err.message
        }
      })
      validationErrors.value = errorMap
    } else {
      // Clear any previous errors
      validationErrors.value = {}
    }
    
    if (enableLogging && perfMetrics) {
      perfMetrics.validationOperations++
      console.log(`Validation took ${performance.now() - startTime}ms (total: ${perfMetrics.validationOperations})`)
    }
    
    return result
  }
  
  // Reset the new item to default values
  const resetNewItem = () => {
    Object.keys(newItem).forEach(key => {
      const typedKey = key as keyof T
      // @ts-ignore - This is safe as we're copying values
      newItem[typedKey] = defaultItemValues[typedKey]
    })
  }
  
  // Toggle the add form visibility
  const toggleAddForm = () => {
    isAddingItem.value = !isAddingItem.value
    
    if (!isAddingItem.value) {
      resetNewItem()
    }
  }
  
  // Add a new item to the collection
  const addItem = (item?: T) => {
    const startTime = enableLogging ? performance.now() : 0
    
    // Use provided item or the current newItem
    const itemToAdd = item || { ...newItem }
    
    // Validate the item before adding
    const validationResult = validateItemInternal(itemToAdd)
    
    if (isFailure(validationResult)) {
      if (enableLogging) {
        console.warn('Item validation failed:', validationErrors.value)
      }
      return
    }
    
    // À ce stade, nous savons que la validation a réussi
    // Utilisons l'item validé du résultat
    const validatedItem = validationResult.value
    
    // Ensure the item has an ID
    const itemWithId = {
      ...validatedItem,
      [identifierField]: validatedItem[identifierField] || generateId()
    } as T
    
    // Get current collection and add the new item
    const currentCollection = [...items.value]
    currentCollection.push(itemWithId)
    
    // Update the field in the parent model
    updateField(fieldName, currentCollection)
    
    // Reset form state
    resetNewItem()
    isAddingItem.value = false
    
    if (enableLogging && perfMetrics) {
      perfMetrics.addOperations++
      console.log(`Add operation took ${performance.now() - startTime}ms (total: ${perfMetrics.addOperations})`)
    }
  }
  
  // Remove an item from the collection
  const removeItem = (idOrIndex: string | number) => {
    const startTime = enableLogging ? performance.now() : 0
    
    let index = -1
    const currentCollection = [...items.value]
    
    if (typeof idOrIndex === 'number') {
      // If index is provided directly
      index = idOrIndex
    } else {
      // Find the item by ID
      index = currentCollection.findIndex(
        item => String(item[identifierField]) === idOrIndex
      )
    }
    
    if (index === -1) {
      if (enableLogging) {
        console.warn(`Item with id/index ${idOrIndex} not found`)
      }
      return
    }
    
    // Remove the item
    currentCollection.splice(index, 1)
    
    // Update the field in the parent model
    updateField(fieldName, currentCollection)
    
    if (enableLogging && perfMetrics) {
      perfMetrics.removeOperations++
      console.log(`Remove operation took ${performance.now() - startTime}ms (total: ${perfMetrics.removeOperations})`)
    }
  }
  
  // Setup editing for an existing item
  const startEditing = (idOrIndex: string | number): T => {
    let item: T | undefined
    
    if (typeof idOrIndex === 'number') {
      item = items.value[idOrIndex]
    } else {
      item = items.value.find(
        i => String(i[identifierField]) === idOrIndex
      )
    }
    
    if (!item) {
      if (enableLogging) {
        console.warn(`Item with id/index ${idOrIndex} not found for editing`)
      }
      throw new Error(`Item with id/index ${idOrIndex} not found`)
    }
    
    // Set the editing item ID
    editingItemId.value = String(item[identifierField])
    
    // Return a copy of the item to avoid direct mutation
    return { ...item }
  }
  
  // Update an existing item
  const updateItem = (id: string, updatedItem: T) => {
    const startTime = enableLogging ? performance.now() : 0
    
    // Validate the item before updating
    const validationResult = validateItemInternal(updatedItem)
    
    if (isFailure(validationResult)) {
      if (enableLogging) {
        console.warn('Item validation failed:', validationErrors.value)
      }
      return
    }
    
    // Find the item by ID
    const currentCollection = [...items.value]
    const index = currentCollection.findIndex(
      item => String(item[identifierField]) === id
    )
    
    if (index === -1) {
      if (enableLogging) {
        console.warn(`Item with id ${id} not found for update`)
      }
      return
    }
    
    // Update the item
    currentCollection[index] = {
      ...updatedItem,
      [identifierField]: id // Ensure ID doesn't change
    }
    
    // Update the field in the parent model
    updateField(fieldName, currentCollection)
    
    // Reset editing state
    editingItemId.value = null
    
    if (enableLogging && perfMetrics) {
      perfMetrics.updateOperations++
      console.log(`Update operation took ${performance.now() - startTime}ms (total: ${perfMetrics.updateOperations})`)
    }
  }
  
  // Cancel the current editing operation
  const cancelEditing = () => {
    editingItemId.value = null
    validationErrors.value = {}
  }
  
  // Reorder the collection items
  const reorderItems = (newOrder: string[]) => {
    const currentCollection = [...items.value]
    
    // Create a new array ordered according to the provided IDs
    const reorderedCollection = newOrder.map(id => 
      currentCollection.find(item => String(item[identifierField]) === id)
    ).filter(Boolean) as T[]
    
    // Check if we have the same number of items
    if (reorderedCollection.length !== currentCollection.length) {
      if (enableLogging) {
        console.warn('Reordering failed: not all items were found in the new order')
      }
      return
    }
    
    // Update the field in the parent model
    updateField(fieldName, reorderedCollection)
  }
  
  return {
    items,
    newItem: ref(newItem) as Ref<T>,
    isAddingItem,
    editingItemId,
    validationErrors,
    lastValidationResult,
    addItem,
    removeItem,
    updateItem,
    startEditing,
    resetNewItem,
    toggleAddForm,
    cancelEditing,
    reorderItems,
    perfMetrics
  }
} 
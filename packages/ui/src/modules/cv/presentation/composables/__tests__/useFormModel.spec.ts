import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useFormModel } from '../useFormModel'

// Mock performance.now for consistent testing
vi.spyOn(performance, 'now').mockImplementation(() => 0)

describe('useFormModel', () => {
  // Test interface
  interface TestModel {
    name: string
    email: string
    age: number
    isActive: boolean
    tags: string[]
    address: {
      street: string
      city: string
      zip: string
    }
  }

  // Default test model
  const defaultModel: TestModel = {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30,
    isActive: true,
    tags: ['developer', 'vue'],
    address: {
      street: '123 Main St',
      city: 'New York',
      zip: '10001'
    }
  }

  // Test setup
  let modelValue = ref<TestModel>({ ...defaultModel })
  let emitMock = vi.fn()

  beforeEach(() => {
    // Reset mocks and refs before each test
    modelValue.value = { ...defaultModel }
    emitMock = vi.fn()
    vi.clearAllMocks()
  })

  it('should initialize with the provided model value', async () => {
    const { localModel } = useFormModel<TestModel>({
      modelValue,
      emit: emitMock
    })

    // Wait for onMounted to complete
    await nextTick()

    // Check that the local model matches the provided model
    expect(localModel).toEqual(defaultModel)
  })

  it('should update the local model when modelValue changes', async () => {
    const { localModel } = useFormModel<TestModel>({
      modelValue,
      emit: emitMock
    })

    // Wait for onMounted to complete
    await nextTick()

    // Change the model value
    modelValue.value = {
      ...defaultModel,
      name: 'Jane Doe',
      email: 'jane@example.com'
    }

    // Wait for the watch to trigger
    await nextTick()

    // Check that the local model was updated
    expect(localModel.name).toBe('Jane Doe')
    expect(localModel.email).toBe('jane@example.com')
  })

  it('should update a field and emit the change', async () => {
    const { localModel, updateField } = useFormModel<TestModel>({
      modelValue,
      emit: emitMock
    })

    // Wait for onMounted to complete
    await nextTick()

    // Update a field
    updateField('name', 'Jane Doe')

    // Check that the local model was updated
    expect(localModel.name).toBe('Jane Doe')

    // Check that the emit was called with the updated model
    expect(emitMock).toHaveBeenCalledWith('update:modelValue', {
      ...defaultModel,
      name: 'Jane Doe'
    })
  })

  it('should update a nested field and emit the change', async () => {
    const { localModel, updateNestedField } = useFormModel<TestModel>({
      modelValue,
      emit: emitMock
    })

    // Wait for onMounted to complete
    await nextTick()

    // Update a nested field
    updateNestedField('address', 'city', 'San Francisco')

    // Check that the local model was updated
    expect(localModel.address.city).toBe('San Francisco')

    // Check that the emit was called with the updated model
    expect(emitMock).toHaveBeenCalledWith('update:modelValue', {
      ...defaultModel,
      address: {
        ...defaultModel.address,
        city: 'San Francisco'
      }
    })
  })

  it('should create the parent object if it does not exist when updating a nested field', async () => {
    // Create a model without an address
    const modelWithoutAddress = ref<TestModel>({
      ...defaultModel,
      address: undefined as any
    })

    const { localModel, updateNestedField } = useFormModel<TestModel>({
      modelValue: modelWithoutAddress,
      emit: emitMock
    })

    // Wait for onMounted to complete
    await nextTick()

    // Update a nested field
    updateNestedField('address', 'city', 'San Francisco')

    // Check that the address object was created
    expect(localModel.address).toBeDefined()
    expect(localModel.address.city).toBe('San Francisco')

    // Check that the emit was called with the updated model
    expect(emitMock).toHaveBeenCalledWith('update:modelValue', {
      ...defaultModel,
      address: {
        city: 'San Francisco'
      }
    })
  })

  it('should update the entire model and emit the change', async () => {
    const { localModel, updateModel } = useFormModel<TestModel>({
      modelValue,
      emit: emitMock
    })

    // Wait for onMounted to complete
    await nextTick()

    // New model to update with
    const newModel: TestModel = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      age: 25,
      isActive: false,
      tags: ['designer'],
      address: {
        street: '456 Oak St',
        city: 'San Francisco',
        zip: '94101'
      }
    }

    // Update the entire model
    updateModel(newModel)

    // Check that the local model was updated
    expect(localModel).toEqual(newModel)

    // Check that the emit was called with the updated model
    expect(emitMock).toHaveBeenCalledWith('update:modelValue', newModel)
  })

  it('should reset the model to default values', async () => {
    // Define default values
    const defaultValues: Partial<TestModel> = {
      name: '',
      email: '',
      age: 0,
      isActive: false,
      tags: [],
      address: {
        street: '',
        city: '',
        zip: ''
      }
    }

    const { localModel, resetModel } = useFormModel<TestModel>({
      modelValue,
      emit: emitMock,
      defaultValues
    })

    // Wait for onMounted to complete
    await nextTick()

    // Reset the model
    resetModel()

    // Check that the local model was reset to default values
    expect(localModel).toEqual(defaultValues)

    // Check that the emit was called with the reset model
    expect(emitMock).toHaveBeenCalledWith('update:modelValue', defaultValues)
  })

  it('should track performance metrics when enableLogging is true', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const { perfMetrics, updateField } = useFormModel<TestModel>({
      modelValue,
      emit: emitMock,
      enableLogging: true
    })

    // Wait for onMounted to complete
    await nextTick()

    // Check that performance metrics are defined
    expect(perfMetrics).toBeDefined()
    expect(perfMetrics?.modelUpdates).toBe(1) // Initial update from props

    // Update a field
    updateField('name', 'Jane Doe')

    // Check that field updates metric was incremented
    expect(perfMetrics?.fieldUpdates).toBe(1)

    // Check that console.log was called
    expect(consoleSpy).toHaveBeenCalled()

    // Restore console.log
    consoleSpy.mockRestore()
  })

  it('should not track performance metrics when enableLogging is false', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const { perfMetrics } = useFormModel<TestModel>({
      modelValue,
      emit: emitMock,
      enableLogging: false
    })

    // Wait for onMounted to complete
    await nextTick()

    // Check that performance metrics are undefined
    expect(perfMetrics).toBeUndefined()

    // Check that console.log was not called
    expect(consoleSpy).not.toHaveBeenCalled()

    // Restore console.log
    consoleSpy.mockRestore()
  })
}) 
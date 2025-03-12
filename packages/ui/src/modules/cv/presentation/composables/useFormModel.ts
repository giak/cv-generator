/**
 * useFormModel.ts
 * 
 * A composable for managing form model state in Vue components.
 * This composable handles:
 * 1. Creating and maintaining a local reactive model
 * 2. Synchronizing with external model value (from props)
 * 3. Handling field updates
 * 4. Emitting model changes
 * 5. Initializing default values
 */

import { reactive, watch, onMounted, computed, Ref, ComputedRef, UnwrapRef } from 'vue'

export interface FormModelOptions<T extends Record<string, any>> {
  /**
   * The model value from props
   */
  modelValue: Ref<T> | ComputedRef<T>
  
  /**
   * The emit function from the component
   */
  emit: (event: 'update:modelValue', value: T) => void
  
  /**
   * Default values to use when creating a new model
   * @default {}
   */
  defaultValues?: Partial<T>
  
  /**
   * Whether to enable performance logging
   * @default false
   */
  enableLogging?: boolean
}

export interface FormModelReturn<T extends Record<string, any>> {
  /**
   * The local reactive model
   */
  localModel: T
  
  /**
   * Update a field in the model and emit the change
   */
  updateField: <K extends keyof T>(field: K, value: T[K]) => void
  
  /**
   * Update a nested field in the model and emit the change
   */
  updateNestedField: <K extends keyof T>(
    parent: K, 
    field: string | number | symbol, 
    value: any
  ) => void
  
  /**
   * Update the entire model and emit the change
   */
  updateModel: (newModel: T) => void
  
  /**
   * Reset the model to its default values
   */
  resetModel: () => void
  
  /**
   * Performance metrics (if logging is enabled)
   */
  perfMetrics?: {
    modelUpdates: number
    fieldUpdates: number
    nestedUpdates: number
    renderTime: number
  }
}

/**
 * Composable for managing form model state in Vue components
 */
export function useFormModel<T extends Record<string, any>>(
  options: FormModelOptions<T>
): FormModelReturn<T> {
  const { modelValue, emit, defaultValues = {} as Partial<T>, enableLogging = false } = options
  
  // Performance metrics
  const perfMetrics = enableLogging ? {
    modelUpdates: 0,
    fieldUpdates: 0,
    nestedUpdates: 0,
    renderTime: 0
  } : undefined
  
  // Start time for render metrics
  const startTime = enableLogging ? performance.now() : 0
  
  // Create a local reactive model
  const localModel = reactive<T>({} as T)
  
  // Deep copy function to handle nested objects and arrays
  const deepCopy = <V>(source: V): V => {
    if (source === null || typeof source !== 'object') {
      return source;
    }
    
    if (Array.isArray(source)) {
      return source.map(item => deepCopy(item)) as unknown as V;
    }
    
    const result = {} as V;
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        result[key] = deepCopy(source[key]);
      }
    }
    
    return result;
  };
  
  // Initialize the local model with values from props
  const updateLocalModelFromProps = (source: T) => {
    let updateStart = 0;
    if (enableLogging) {
      updateStart = performance.now();
      console.log('Updating local model from props:', JSON.stringify(source));
    }
    
    // Create a deep copy of the source to avoid reference issues
    const sourceCopy = deepCopy(source);
    
    // Update all properties in the local model
    Object.keys(sourceCopy).forEach(key => {
      const typedKey = key as keyof T;
      (localModel as Record<keyof T, any>)[typedKey] = sourceCopy[typedKey];
    });
    
    if (enableLogging && perfMetrics) {
      perfMetrics.modelUpdates++;
      console.log(`Model update took ${performance.now() - updateStart}ms (total: ${perfMetrics.modelUpdates})`);
    }
  }
  
  // Initialize the local model immediately
  updateLocalModelFromProps(modelValue.value)
  
  // Also initialize on component mount for Vue lifecycle consistency
  onMounted(() => {
    if (enableLogging) {
      if (perfMetrics) {
        perfMetrics.renderTime = performance.now() - startTime
      }
      console.log('Form model initialized in', perfMetrics?.renderTime, 'ms')
      console.log('Initial localModel:', JSON.stringify(localModel))
    }
  })
  
  // Watch for changes to the model value from props
  watch(() => modelValue.value, (newValue) => {
    if (enableLogging) {
      console.log('Props model changed, updating local model:', JSON.stringify(newValue))
    }
    updateLocalModelFromProps(newValue)
  }, { deep: true })
  
  // Emit model changes to the parent component
  const emitModelUpdate = () => {
    if (enableLogging) {
      console.log('Emitting updated model to parent:', JSON.stringify(localModel))
    }
    emit('update:modelValue', deepCopy(localModel as unknown as T))
  }
  
  // Update a field in the model and emit the change
  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    let updateStart = 0;
    if (enableLogging) {
      updateStart = performance.now();
      console.log(`Updating field ${String(field)} with value:`, value);
    }
    
    // Update the local model
    (localModel as Record<keyof T, any>)[field] = deepCopy(value);
    
    // Emit the change
    emitModelUpdate()
    
    if (enableLogging && perfMetrics) {
      perfMetrics.fieldUpdates++;
      console.log(`Field update took ${performance.now() - updateStart}ms (total: ${perfMetrics.fieldUpdates})`);
    }
  }
  
  // Update a nested field in the model and emit the change
  const updateNestedField = <K extends keyof T>(
    parent: K, 
    field: string | number | symbol, 
    value: any
  ) => {
    let updateStart = 0;
    if (enableLogging) {
      updateStart = performance.now();
      console.log(`Updating nested field ${String(parent)}.${String(field)} with value:`, value);
    }
    
    // Ensure the parent object exists
    if (!(localModel as Record<keyof T, any>)[parent]) {
      (localModel as Record<keyof T, any>)[parent] = {} as T[K];
    }
    
    // Update the nested field
    ((localModel as Record<keyof T, any>)[parent] as Record<string | number | symbol, any>)[field] = deepCopy(value);
    
    // Emit the change
    emitModelUpdate()
    
    if (enableLogging && perfMetrics) {
      perfMetrics.nestedUpdates++;
      console.log(`Nested field update took ${performance.now() - updateStart}ms (total: ${perfMetrics.nestedUpdates})`);
    }
  }
  
  // Update the entire model and emit the change
  const updateModel = (newModel: T) => {
    let updateStart = 0;
    if (enableLogging) {
      updateStart = performance.now();
      console.log('Updating entire model with:', JSON.stringify(newModel));
    }
    
    // Update the local model
    updateLocalModelFromProps(newModel)
    
    // Emit the change
    emitModelUpdate()
    
    if (enableLogging && perfMetrics) {
      perfMetrics.modelUpdates++;
      console.log(`Full model update took ${performance.now() - updateStart}ms (total: ${perfMetrics.modelUpdates})`);
    }
  }
  
  // Reset the model to its default values
  const resetModel = () => {
    if (enableLogging) {
      console.log('Resetting model to default values')
    }
    
    // Reset to default values
    Object.keys(localModel).forEach(key => {
      const typedKey = key as keyof T
      
      if (defaultValues[typedKey] !== undefined) {
        (localModel as Record<keyof T, any>)[typedKey] = deepCopy(defaultValues[typedKey] as T[keyof T])
      } else {
        // If no default value is provided, use empty values based on type
        const currentValue = (localModel as Record<keyof T, any>)[typedKey]
        
        if (typeof currentValue === 'string') {
          (localModel as Record<keyof T, any>)[typedKey] = '' as unknown as T[keyof T]
        } else if (typeof currentValue === 'number') {
          (localModel as Record<keyof T, any>)[typedKey] = 0 as unknown as T[keyof T]
        } else if (typeof currentValue === 'boolean') {
          (localModel as Record<keyof T, any>)[typedKey] = false as unknown as T[keyof T]
        } else if (Array.isArray(currentValue)) {
          (localModel as Record<keyof T, any>)[typedKey] = [] as unknown as T[keyof T]
        } else if (typeof currentValue === 'object' && currentValue !== null) {
          (localModel as Record<keyof T, any>)[typedKey] = {} as unknown as T[keyof T]
        }
      }
    })
    
    // Emit the change
    emitModelUpdate()
  }
  
  return {
    localModel: localModel as unknown as T,
    updateField,
    updateNestedField,
    updateModel,
    resetModel,
    perfMetrics
  }
} 
<template>
  <div class="p-6 bg-neutral-900 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Combined Form Example</h2>
    <p class="text-neutral-400 mb-6">Using both useValidation and useFormModel composables</p>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Name field -->
      <div class="mb-4">
        <label for="name" class="block mb-1 text-sm font-medium text-neutral-300">
          Full Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          :value="localModel.name"
          @input="(e) => handleFieldUpdate('name', (e.target as HTMLInputElement).value)"
          type="text"
          class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
      </div>
      
      <!-- Email field -->
      <div class="mb-4">
        <label for="email" class="block mb-1 text-sm font-medium text-neutral-300">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          :value="localModel.email"
          @input="(e) => handleFieldUpdate('email', (e.target as HTMLInputElement).value)"
          type="email"
          class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
      </div>
      
      <!-- Location fields -->
      <div class="mb-4">
        <h3 class="text-lg font-medium mb-2">Location</h3>
        
        <!-- City field -->
        <div class="mb-4">
          <label for="city" class="block mb-1 text-sm font-medium text-neutral-300">
            City
          </label>
          <input
            id="city"
            :value="localModel.location.city"
            @input="(e) => handleLocationUpdate('city', (e.target as HTMLInputElement).value)"
            type="text"
            class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
          />
        </div>
        
        <!-- Country field -->
        <div class="mb-4">
          <label for="country" class="block mb-1 text-sm font-medium text-neutral-300">
            Country <span class="text-red-500">*</span>
          </label>
          <input
            id="country"
            :value="localModel.location.country"
            @input="(e) => handleLocationUpdate('country', (e.target as HTMLInputElement).value)"
            type="text"
            class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
            :class="{ 'border-red-500': errors['location.country'] }"
          />
          <p v-if="errors['location.country']" class="mt-1 text-sm text-red-500">{{ errors['location.country'] }}</p>
        </div>
      </div>
      
      <!-- Submit button -->
      <div class="flex justify-between">
        <button
          type="button"
          class="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          @click="resetModel"
        >
          Reset
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :disabled="!isValid"
        >
          Submit
        </button>
      </div>
      
      <!-- Form status -->
      <div v-if="formSubmitted" class="mt-4 p-3 rounded-md" :class="formValid ? 'bg-green-800/30' : 'bg-red-800/30'">
        <p v-if="formValid" class="text-green-400">
          Form submitted successfully!
        </p>
        <div v-else>
          <p class="text-red-400 font-medium">Validation errors:</p>
          <ul class="list-disc list-inside mt-2 text-red-400">
            <li v-for="(error, field) in errors" :key="field">
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Current model -->
      <div class="mt-6 p-4 bg-neutral-800 rounded-md">
        <h3 class="text-lg font-medium mb-2">Current Model</h3>
        <pre class="text-sm text-neutral-400 overflow-auto">{{ JSON.stringify(localModel, null, 2) }}</pre>
      </div>
      
      <!-- Performance metrics -->
      <div v-if="perfMetrics" class="mt-6 p-4 bg-neutral-800 rounded-md">
        <h3 class="text-lg font-medium mb-2">Performance Metrics</h3>
        <ul class="space-y-1 text-sm text-neutral-400">
          <li>Validation count: {{ perfMetrics.validationCount }}</li>
          <li>Total validation time: {{ perfMetrics.validationTime.toFixed(2) }} ms</li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import { useValidation } from '../../composables/useValidation'
import { useFormModel } from '../../composables/useFormModel'

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  location: z.object({
    city: z.string().optional(),
    country: z.string().min(2, 'Country must be at least 2 characters')
  })
})

// Define the form data type
interface FormData {
  name: string
  email: string
  location: {
    city: string
    country: string
  }
}

// Define props and emits
const props = defineProps<{
  modelValue?: FormData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: FormData): void
  (e: 'validate'): void
}>()

// Default values for the form
const defaultValues: FormData = {
  name: '',
  email: '',
  location: {
    city: '',
    country: ''
  }
}

// Use the form model composable
const { 
  localModel, 
  updateField, 
  updateNestedField,
  resetModel
} = useFormModel<FormData>({
  modelValue: computed(() => props.modelValue || defaultValues),
  emit: (event, value) => emit(event, value),
  defaultValues
})

// Form submission state
const formSubmitted = ref(false)
const formValid = ref(false)

// Set up validation with our schema and required fields
const { 
  validateField, 
  validateForm, 
  errors, 
  isValid,
  perfMetrics
} = useValidation<FormData>(
  formSchema, 
  { 
    requiredFields: ['name', 'email', 'location.country'],
    enableLogging: true
  }
)

// Handle field updates with validation
const handleFieldUpdate = (field: keyof FormData, value: any) => {
  updateField(field, value)
  validateField(field, value)
}

// Handle nested field updates with validation
const handleLocationUpdate = (field: keyof FormData['location'], value: string) => {
  updateNestedField('location', field, value)
  validateField(`location.${field}` as any, value)
}

// Handle form submission
const handleSubmit = () => {
  formSubmitted.value = true
  
  // Validate the entire form
  formValid.value = validateForm(localModel)
  
  if (formValid.value) {

    emit('validate')
  } else {}
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFormModel } from '../useFormModel'
import { useFieldValidation } from '../../composables/useCVFieldValidation'

// Define a simple user interface for the example
interface UserModel {
  firstName: string
  lastName: string
  email: string
  age: number
  address: {
    street: string
    city: string
    zip: string
  }
  preferences: string[]
}

// Define props and emits
const props = defineProps<{
  modelValue: UserModel
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: UserModel): void
  (e: 'validate'): void
  (e: 'cancel'): void
}>()

// Default values for a new user
const defaultValues: Partial<UserModel> = {
  firstName: '',
  lastName: '',
  email: '',
  age: 0,
  address: {
    street: '',
    city: '',
    zip: ''
  },
  preferences: []
}

// Use the form model composable
const { 
  localModel, 
  updateField, 
  updateNestedField, 
  resetModel 
} = useFormModel<UserModel>({
  modelValue: computed(() => props.modelValue),
  emit: (event, value) => emit(event, value),
  defaultValues,
  enableLogging: process.env.NODE_ENV === 'development' // Only enable logging in development
})

// Use field validation
const { errors, validateField, validateForm } = useFieldValidation()

// Handle field updates
const handleFieldUpdate = (field: keyof UserModel, value: any) => {
  updateField(field, value)
}

// Handle nested field updates for address
const handleAddressUpdate = (field: keyof UserModel['address'], value: string) => {
  updateNestedField('address', field, value)
}

// Handle adding a preference
const newPreference = ref('')
const addPreference = () => {
  if (!newPreference.value.trim()) return
  
  const updatedPreferences = [...localModel.preferences, newPreference.value.trim()]
  updateField('preferences', updatedPreferences)
  newPreference.value = ''
}

// Handle removing a preference
const removePreference = (index: number) => {
  const updatedPreferences = [...localModel.preferences]
  updatedPreferences.splice(index, 1)
  updateField('preferences', updatedPreferences)
}

// Handle form submission
const handleSubmit = () => {
  // Validate all fields
  const formIsValid = validateForm(localModel)
  
  if (formIsValid) {
    emit('validate')
  }
}

// Handle form cancellation
const handleCancel = () => {
  emit('cancel')
}

// Handle form reset
const handleReset = () => {
  resetModel()
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <h2 class="text-xl font-bold">User Information</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- First Name -->
      <div>
        <label class="block text-sm font-medium mb-1">First Name</label>
        <input
          type="text"
          :value="localModel.firstName"
          @input="handleFieldUpdate('firstName', ($event.target as HTMLInputElement).value)"
          @blur="validateField('firstName', localModel.firstName)"
          class="w-full px-3 py-2 border rounded-md"
          :class="errors.firstName ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="errors.firstName" class="mt-1 text-sm text-red-500">{{ errors.firstName }}</p>
      </div>
      
      <!-- Last Name -->
      <div>
        <label class="block text-sm font-medium mb-1">Last Name</label>
        <input
          type="text"
          :value="localModel.lastName"
          @input="handleFieldUpdate('lastName', ($event.target as HTMLInputElement).value)"
          @blur="validateField('lastName', localModel.lastName)"
          class="w-full px-3 py-2 border rounded-md"
          :class="errors.lastName ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="errors.lastName" class="mt-1 text-sm text-red-500">{{ errors.lastName }}</p>
      </div>
      
      <!-- Email -->
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          :value="localModel.email"
          @input="handleFieldUpdate('email', ($event.target as HTMLInputElement).value)"
          @blur="validateField('email', localModel.email)"
          class="w-full px-3 py-2 border rounded-md"
          :class="errors.email ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
      </div>
      
      <!-- Age -->
      <div>
        <label class="block text-sm font-medium mb-1">Age</label>
        <input
          type="number"
          :value="localModel.age"
          @input="handleFieldUpdate('age', Number(($event.target as HTMLInputElement).value))"
          @blur="validateField('age', localModel.age)"
          class="w-full px-3 py-2 border rounded-md"
          :class="errors.age ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="errors.age" class="mt-1 text-sm text-red-500">{{ errors.age }}</p>
      </div>
    </div>
    
    <!-- Address Section -->
    <div class="mt-6">
      <h3 class="text-lg font-medium mb-3">Address</h3>
      
      <div class="space-y-4">
        <!-- Street -->
        <div>
          <label class="block text-sm font-medium mb-1">Street</label>
          <input
            type="text"
            :value="localModel.address.street"
            @input="handleAddressUpdate('street', ($event.target as HTMLInputElement).value)"
            class="w-full px-3 py-2 border rounded-md border-gray-300"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- City -->
          <div>
            <label class="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              :value="localModel.address.city"
              @input="handleAddressUpdate('city', ($event.target as HTMLInputElement).value)"
              class="w-full px-3 py-2 border rounded-md border-gray-300"
            />
          </div>
          
          <!-- Zip Code -->
          <div>
            <label class="block text-sm font-medium mb-1">Zip Code</label>
            <input
              type="text"
              :value="localModel.address.zip"
              @input="handleAddressUpdate('zip', ($event.target as HTMLInputElement).value)"
              class="w-full px-3 py-2 border rounded-md border-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Preferences Section -->
    <div class="mt-6">
      <h3 class="text-lg font-medium mb-3">Preferences</h3>
      
      <!-- Add Preference -->
      <div class="flex space-x-2 mb-4">
        <input
          type="text"
          v-model="newPreference"
          placeholder="Add a preference"
          class="flex-1 px-3 py-2 border rounded-md border-gray-300"
          @keyup.enter="addPreference"
        />
        <button
          type="button"
          @click="addPreference"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add
        </button>
      </div>
      
      <!-- Preferences List -->
      <ul v-if="localModel.preferences.length > 0" class="space-y-2">
        <li
          v-for="(preference, index) in localModel.preferences"
          :key="index"
          class="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md"
        >
          <span>{{ preference }}</span>
          <button
            type="button"
            @click="removePreference(index)"
            class="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </li>
      </ul>
      <p v-else class="text-gray-500">No preferences added yet.</p>
    </div>
    
    <!-- Form Actions -->
    <div class="flex justify-end space-x-3 mt-8">
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="handleReset"
        class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
      >
        Reset
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        :disabled="loading"
      >
        <span v-if="loading">Loading...</span>
        <span v-else>Save</span>
      </button>
    </div>
  </form>
</template> 
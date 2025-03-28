<template>
  <div class="p-6 bg-neutral-900 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Exemple de validation de formulaire</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Name field -->
      <div class="mb-4">
        <label for="name" class="block mb-1 text-sm font-medium text-neutral-300">
          Nom complet <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
          :class="{ 'border-red-500': errors.name }"
          @blur="validateField('name', formData.name)"
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
          v-model="formData.email"
          type="email"
          class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
          :class="{ 'border-red-500': errors.email }"
          @blur="validateField('email', formData.email)"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
      </div>
      
      <!-- Phone field -->
      <div class="mb-4">
        <label for="phone" class="block mb-1 text-sm font-medium text-neutral-300">
          Téléphone
        </label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
          :class="{ 'border-red-500': errors.phone }"
          @blur="validateField('phone', formData.phone)"
        />
        <p v-if="errors.phone" class="mt-1 text-sm text-red-500">{{ errors.phone }}</p>
      </div>
      
      <!-- Submit button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :disabled="!isFormValid"
        >
          Soumettre
        </button>
      </div>
      
      <!-- Form status -->
      <div v-if="formSubmitted" class="mt-4 p-3 rounded-md" :class="formValid ? 'bg-green-800/30' : 'bg-red-800/30'">
        <p v-if="formValid" class="text-green-400">
          Formulaire soumis avec succès !
        </p>
        <div v-else>
          <p class="text-red-400 font-medium">Erreurs de validation :</p>
          <ul class="list-disc list-inside mt-2 text-red-400">
            <li v-for="(error, field) in errors" :key="field">
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Performance metrics -->
      <div v-if="perfMetrics" class="mt-6 p-4 bg-neutral-800 rounded-md">
        <h3 class="text-lg font-medium mb-2">Métriques de performance</h3>
        <ul class="space-y-1 text-sm text-neutral-400">
          <li>Nombre de validations : {{ perfMetrics.validationCount }}</li>
          <li>Temps total de validation : {{ perfMetrics.validationTime.toFixed(2) }} ms</li>
          <li>Temps moyen par validation : {{ (perfMetrics.validationTime / perfMetrics.validationCount).toFixed(2) }} ms</li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import { useValidation } from '../../composables/useValidation'

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Format email invalide'),
  phone: z.string().optional()
})

// Define the form data type
interface FormData {
  name: string
  email: string
  phone: string
}

// Initialize form data
const formData = ref<FormData>({
  name: '',
  email: '',
  phone: ''
})

// Form submission state
const formSubmitted = ref(false)
const formValid = ref(false)

// Set up validation with our schema and required fields
const { 
  validateValue, 
  validateField, 
  validateForm, 
  errors, 
  isValid,
  perfMetrics
} = useValidation<FormData>(
  formSchema, 
  { 
    requiredFields: ['name', 'email'],
    enableLogging: true
  }
)

// Computed property to check if form is valid
const isFormValid = computed(() => {
  return formData.value.name.length > 0 && 
         formData.value.email.length > 0 && 
         Object.keys(errors.value).length === 0
})

// Handle form submission
const handleSubmit = () => {
  formSubmitted.value = true
  
  // Validate the entire form
  formValid.value = validateForm(formData.value)
  
  if (formValid.value) {

    // Here you would typically send the data to an API
  } else {}
}
</script>

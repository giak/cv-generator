<template>
  <div class="p-6 bg-neutral-900 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Advanced Validation Example</h2>
    <p class="text-neutral-400 mb-6">Demonstrating complex validation with nested fields and custom validation</p>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Personal Information Section -->
      <div class="p-4 bg-neutral-800 rounded-lg">
        <h3 class="text-lg font-medium mb-4">Personal Information</h3>
        
        <!-- Name field -->
        <div class="mb-4">
          <label for="name" class="block mb-1 text-sm font-medium text-neutral-300">
            Full Name <span class="text-red-500">*</span>
          </label>
          <input
            id="name"
            v-model="formData.name"
            @input="validateField('name', formData.name)"
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
            v-model="formData.email"
            @input="validateField('email', formData.email)"
            type="email"
            class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
        </div>
        
        <!-- Age field -->
        <div class="mb-4">
          <label for="age" class="block mb-1 text-sm font-medium text-neutral-300">
            Age <span class="text-red-500">*</span>
          </label>
          <input
            id="age"
            v-model.number="formData.age"
            @input="validateField('age', formData.age)"
            type="number"
            class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
            :class="{ 'border-red-500': errors.age }"
          />
          <p v-if="errors.age" class="mt-1 text-sm text-red-500">{{ errors.age }}</p>
        </div>
      </div>
      
      <!-- Address Section -->
      <div class="p-4 bg-neutral-800 rounded-lg">
        <h3 class="text-lg font-medium mb-4">Address</h3>
        
        <!-- Street field -->
        <div class="mb-4">
          <label for="street" class="block mb-1 text-sm font-medium text-neutral-300">
            Street <span class="text-red-500">*</span>
          </label>
          <input
            id="street"
            v-model="formData.address.street"
            @input="validateNestedField('address', 'street', formData.address.street)"
            type="text"
            class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
            :class="{ 'border-red-500': errors['address.street'] }"
          />
          <p v-if="errors['address.street']" class="mt-1 text-sm text-red-500">{{ errors['address.street'] }}</p>
        </div>
        
        <!-- City field -->
        <div class="mb-4">
          <label for="city" class="block mb-1 text-sm font-medium text-neutral-300">
            City <span class="text-red-500">*</span>
          </label>
          <input
            id="city"
            v-model="formData.address.city"
            @input="validateNestedField('address', 'city', formData.address.city)"
            type="text"
            class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
            :class="{ 'border-red-500': errors['address.city'] }"
          />
          <p v-if="errors['address.city']" class="mt-1 text-sm text-red-500">{{ errors['address.city'] }}</p>
        </div>
        
        <!-- Postal Code field with custom validation -->
        <div class="mb-4">
          <label for="postalCode" class="block mb-1 text-sm font-medium text-neutral-300">
            Postal Code <span class="text-red-500">*</span>
          </label>
          <input
            id="postalCode"
            v-model="formData.address.postalCode"
            @input="validateNestedField('address', 'postalCode', formData.address.postalCode)"
            type="text"
            class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
            :class="{ 'border-red-500': errors['address.postalCode'] }"
          />
          <p v-if="errors['address.postalCode']" class="mt-1 text-sm text-red-500">{{ errors['address.postalCode'] }}</p>
        </div>
        
        <!-- Country field -->
        <div class="mb-4">
          <label for="country" class="block mb-1 text-sm font-medium text-neutral-300">
            Country <span class="text-red-500">*</span>
          </label>
          <select
            id="country"
            v-model="formData.address.country"
            @change="validateNestedField('address', 'country', formData.address.country)"
            class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
            :class="{ 'border-red-500': errors['address.country'] }"
          >
            <option value="">Select a country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>
          <p v-if="errors['address.country']" class="mt-1 text-sm text-red-500">{{ errors['address.country'] }}</p>
        </div>
      </div>
      
      <!-- Skills Section with dynamic fields -->
      <div class="p-4 bg-neutral-800 rounded-lg">
        <h3 class="text-lg font-medium mb-4">Skills</h3>
        <p class="text-neutral-400 mb-4">Add at least 2 skills</p>
        
        <div v-for="(skill, index) in formData.skills" :key="index" class="mb-4 flex items-center gap-2">
          <input
            :id="`skill-${index}`"
            v-model="formData.skills[index]"
            @input="validateSkills"
            type="text"
            class="flex-1 p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
            :class="{ 'border-red-500': errors.skills }"
            placeholder="Enter a skill"
          />
          <button 
            type="button" 
            @click="removeSkill(index)"
            class="p-2 bg-red-600 text-white rounded-md hover:bg-red-500"
          >
            Remove
          </button>
        </div>
        
        <button 
          type="button" 
          @click="addSkill"
          class="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          Add Skill
        </button>
        
        <p v-if="errors.skills" class="mt-1 text-sm text-red-500">{{ errors.skills }}</p>
      </div>
      
      <!-- Password Section with confirmation -->
      <div class="p-4 bg-neutral-800 rounded-lg">
        <h3 class="text-lg font-medium mb-4">Security</h3>
        
        <!-- Password field -->
        <div class="mb-4">
          <label for="password" class="block mb-1 text-sm font-medium text-neutral-300">
            Password <span class="text-red-500">*</span>
          </label>
          <input
            id="password"
            v-model="formData.password"
            @input="validateField('password', formData.password)"
            type="password"
            class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
        </div>
        
        <!-- Password confirmation field -->
        <div class="mb-4">
          <label for="passwordConfirm" class="block mb-1 text-sm font-medium text-neutral-300">
            Confirm Password <span class="text-red-500">*</span>
          </label>
          <input
            id="passwordConfirm"
            v-model="formData.passwordConfirm"
            @input="validatePasswordMatch"
            type="password"
            class="w-full p-2 bg-neutral-800 border border-neutral-700 rounded-md text-white"
            :class="{ 'border-red-500': errors.passwordConfirm }"
          />
          <p v-if="errors.passwordConfirm" class="mt-1 text-sm text-red-500">{{ errors.passwordConfirm }}</p>
        </div>
      </div>
      
      <!-- Terms and Conditions -->
      <div class="flex items-start mb-4">
        <div class="flex items-center h-5">
          <input
            id="terms"
            v-model="formData.acceptTerms"
            @change="validateField('acceptTerms', formData.acceptTerms)"
            type="checkbox"
            class="w-4 h-4 bg-neutral-800 border border-neutral-700 rounded"
          />
        </div>
        <label for="terms" class="ml-2 text-sm text-neutral-300">
          I accept the <a href="#" class="text-indigo-400 hover:underline">Terms and Conditions</a>
          <span class="text-red-500">*</span>
        </label>
      </div>
      <p v-if="errors.acceptTerms" class="mt-1 text-sm text-red-500">{{ errors.acceptTerms }}</p>
      
      <!-- Submit button -->
      <div class="flex justify-between">
        <button
          type="button"
          class="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          @click="resetForm"
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
      
      <!-- Performance metrics -->
      <div v-if="perfMetrics" class="mt-6 p-4 bg-neutral-800 rounded-md">
        <h3 class="text-lg font-medium mb-2">Performance Metrics</h3>
        <ul class="space-y-1 text-sm text-neutral-400">
          <li>Validation count: {{ perfMetrics.validationCount }}</li>
          <li>Total validation time: {{ perfMetrics.validationTime.toFixed(2) }} ms</li>
          <li>Average validation time: {{ (perfMetrics.validationTime / perfMetrics.validationCount || 0).toFixed(2) }} ms</li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { z } from 'zod'
import { useValidation } from '../../composables/useValidation'

// Define a custom postal code validator
const postalCodeValidator = (value: string) => {
  // This is a simplified example - adjust for your needs
  const usZipRegex = /^\d{5}(-\d{4})?$/
  const caPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/
  const ukPostalRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i
  
  if (!value) return false
  
  return usZipRegex.test(value) || caPostalRegex.test(value) || ukPostalRegex.test(value)
}

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(18, 'You must be at least 18 years old'),
  address: z.object({
    street: z.string().min(5, 'Street address is too short'),
    city: z.string().min(2, 'City name is too short'),
    postalCode: z.string().refine(postalCodeValidator, {
      message: 'Invalid postal code format'
    }),
    country: z.string().min(1, 'Please select a country')
  }),
  skills: z.array(z.string()).min(2, 'Please add at least 2 skills'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  passwordConfirm: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
}).refine(data => data.password === data.passwordConfirm, {
  message: 'Passwords do not match',
  path: ['passwordConfirm']
})

// Define the form data type
interface FormData {
  name: string
  email: string
  age: number
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  skills: string[]
  password: string
  passwordConfirm: string
  acceptTerms: boolean
}

// Initialize form data
const formData = ref<FormData>({
  name: '',
  email: '',
  age: 0,
  address: {
    street: '',
    city: '',
    postalCode: '',
    country: ''
  },
  skills: [''],
  password: '',
  passwordConfirm: '',
  acceptTerms: false
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
    requiredFields: [
      'name', 
      'email', 
      'age', 
      'address.street', 
      'address.city', 
      'address.postalCode', 
      'address.country',
      'password',
      'passwordConfirm',
      'acceptTerms'
    ],
    enableLogging: true
  } as any // Type assertion to bypass the linter error
)

// Helper function for nested field validation
const validateNestedField = (parent: keyof FormData, field: string, value: any) => {
  validateField(`${parent}.${field}` as any, value)
}

// Custom validation for password match
const validatePasswordMatch = () => {
  validateField('passwordConfirm' as keyof FormData, formData.value.passwordConfirm)
  
  // Additional custom validation for password match
  if (formData.value.password !== formData.value.passwordConfirm) {
    errors.value.passwordConfirm = 'Passwords do not match'
    return false
  }
  
  return true
}

// Validate skills array
const validateSkills = () => {
  validateField('skills' as keyof FormData, formData.value.skills)
}

// Add a new skill field
const addSkill = () => {
  formData.value.skills.push('')
  validateSkills()
}

// Remove a skill field
const removeSkill = (index: number) => {
  if (formData.value.skills.length > 1) {
    formData.value.skills.splice(index, 1)
    validateSkills()
  }
}

// Reset the form
const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    age: 0,
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: ''
    },
    skills: [''],
    password: '',
    passwordConfirm: '',
    acceptTerms: false
  }
  // Clear errors manually since resetErrors might not be available
  Object.keys(errors.value).forEach(key => {
    errors.value[key] = ''
  })
  formSubmitted.value = false
}

// Handle form submission
const handleSubmit = () => {
  formSubmitted.value = true
  
  // Validate the entire form
  formValid.value = validateForm(formData.value)
  
  if (formValid.value) {

    // Here you would typically send the data to your API
  } else {}
}
</script>

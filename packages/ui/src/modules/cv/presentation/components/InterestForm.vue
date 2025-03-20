<template>
  <Form 
    :loading="loading"
    :title="isEditing ? t(TRANSLATION_KEYS.RESUME.INTERESTS.FORM.EDIT_TITLE) : t(TRANSLATION_KEYS.RESUME.INTERESTS.FORM.ADD_TITLE)"
    :subtitle="isEditing ? t(TRANSLATION_KEYS.RESUME.INTERESTS.FORM.EDIT_SUBTITLE) : t(TRANSLATION_KEYS.RESUME.INTERESTS.FORM.ADD_SUBTITLE)"
    @submit="saveInterest"
  >
    <div class="grid grid-cols-1 gap-6">
      <!-- Champ pour le nom de l'intérêt -->
      <FormField
        name="name"
        :label="t(TRANSLATION_KEYS.RESUME.INTERESTS.LABELS.NAME)"
        :model-value="localModel.name"
        :error="errors.name"
        :icon="icons.interest"
        :placeholder="t(TRANSLATION_KEYS.RESUME.INTERESTS.PLACEHOLDERS.NAME)"
        :help-text="t(TRANSLATION_KEYS.RESUME.INTERESTS.HELP_TEXT.NAME)"
        required
        @update:model-value="(value) => form.name = value"
        @blur="validateField('name', form.name)"
      />
      
      <!-- Champ pour les mots-clés -->
      <div>
        <label class="block text-sm font-medium text-neutral-200 mb-1">{{ t(TRANSLATION_KEYS.RESUME.INTERESTS.LABELS.KEYWORDS) }}</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <div 
            v-for="(keyword, index) in (localModel.keywords || [])" 
            :key="index"
            class="flex items-center bg-neutral-800 px-3 py-1 rounded-full"
          >
            <span class="mr-2 text-sm">{{ keyword }}</span>
            <button 
              type="button" 
              class="text-neutral-400 hover:text-white"
              @click="removeKeyword(index)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="flex">
          <FormField
            name="newKeyword"
            :label="t(TRANSLATION_KEYS.RESUME.INTERESTS.FORM.KEYWORDS_SECTION)"
            :model-value="newKeyword"
            :icon="icons.keyword"
            :placeholder="t(TRANSLATION_KEYS.RESUME.INTERESTS.PLACEHOLDERS.KEYWORD)"
            class="flex-grow"
            @update:model-value="(value) => newKeyword = value"
            @keydown.enter.prevent="addKeyword"
          />
          <button
            type="button"
            class="ml-2 px-3 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
            @click="addKeyword"
          >
            {{ t(TRANSLATION_KEYS.RESUME.INTERESTS.FORM.ADD_KEYWORD) }}
          </button>
        </div>
        <p class="text-neutral-400 text-xs mt-1">
          {{ t(TRANSLATION_KEYS.RESUME.INTERESTS.FORM.KEYWORDS_DESCRIPTION) }}
        </p>
        <p v-if="errors.keywords" class="text-error-500 text-xs mt-1">
          {{ errors.keywords }}
        </p>
      </div>
    </div>
    
    <!-- Boutons d'action -->
    <div class="flex justify-end space-x-4 mt-8">
      <button
        type="button"
        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
        @click="cancel"
      >
        {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL) }}
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting" class="flex items-center">
          <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          {{ isEditing ? t(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE) : t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD) }}
        </span>
        <span v-else>
          {{ isEditing ? t(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE) : t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD) }}
        </span>
      </button>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useInterestStore } from '../stores/interest'
import type { InterestInterface } from '@cv-generator/shared/src/types/resume.interface'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

// Props
const props = defineProps<{
  interestId: string | null
}>()

// Emits
const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancelled'): void
}>()

// Initialize i18n
const { t } = useI18n()

// Fonction pour gérer les erreurs de traduction

// Store
const interestStore = useInterestStore()

// State
const loading = ref(false)
const isSubmitting = ref(false)
const newKeyword = ref('')

// Model wrapped in a computed to handle the null case
const modelValue = computed<InterestInterface>(() => {
  // Return empty model when creating a new interest
  if (!props.interestId || !interestStore.interests) {
    return {
      name: '',
      keywords: []
    }
  }
  
  // Find the interest by ID
  const interest = interestStore.interests.find(i => i.id === props.interestId)
  return interest || { name: '', keywords: [] }
})

// Form model
const { 
  localModel, 
  updateField} = useFormModel<InterestInterface>({
  modelValue,
  emit: () => {}, // We don't emit updates directly to parent
  defaultValues: {
    name: '',
    keywords: []
  }
})

// Alias to support the existing code
const form = localModel

// Form validation
const { 
  errors, 
  validateField, 
  validateForm 
} = useValidation<InterestInterface>(undefined, {
  requiredFields: ['name']
})

// Computed
const isEditing = computed(() => !!props.interestId)

// Methods
const loadInterest = async () => {
  if (!props.interestId) return
  
  loading.value = true
  
  try {
    // Load interests if not already loaded
    if (!interestStore.interests || interestStore.interests.length === 0) {
      await interestStore.loadInterests()
    }
    
    // The modelValue computed will update the localModel automatically
  } catch (error) {} finally {
    loading.value = false
  }
}

const addKeyword = () => {
  if (!newKeyword.value.trim()) return
  
  // Add the keyword if it doesn't already exist
  const keyword = newKeyword.value.trim()
  
  // Ensure keywords array exists
  const currentKeywords = localModel.keywords || []
  
  // Add keyword if it doesn't already exist
  if (!currentKeywords.includes(keyword)) {
    const updatedKeywords = [...currentKeywords, keyword]
    updateField('keywords', updatedKeywords)
  }
  
  // Clear the input
  newKeyword.value = ''
}

const removeKeyword = (index: number) => {
  const currentKeywords = localModel.keywords || []
  if (index >= 0 && index < currentKeywords.length) {
    const updatedKeywords = [...currentKeywords]
    updatedKeywords.splice(index, 1)
    updateField('keywords', updatedKeywords)
  }
}

const saveInterest = async () => {
  if (!validateForm(localModel)) return
  
  isSubmitting.value = true
  
  try {
    if (isEditing.value && props.interestId) {
      // Update existing interest
      await interestStore.updateInterest(props.interestId, localModel)
    } else {
      // Add new interest
      await interestStore.addInterest(localModel)
    }
    
    emit('saved')
  } catch (error) {} finally {
    isSubmitting.value = false
  }
}

const cancel = () => {
  emit('cancelled')
}

// Icônes pour les champs du formulaire
const icons = {
  interest: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1-5.16V14a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1 2 2 0 1 0-2-2 1 1 0 0 1-2 0 4 4 0 1 1 5 3.84z"></path></svg>`,
  keyword: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`
}

// Lifecycle
onMounted(async () => {
  if (props.interestId) {
    await loadInterest()
  }
})
</script>

<style scoped>
/* Les styles sont gérés par les composants partagés */
</style>

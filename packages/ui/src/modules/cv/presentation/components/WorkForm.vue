<script setup lang="ts">
import type { WorkInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFieldValidation } from '@ui/modules/cv/presentation/composables/useCVFieldValidation'
import { useModelUpdate } from '@ui/modules/cv/presentation/composables/useModelUpdate'
import { computed, reactive, ref } from 'vue'

interface Props {
  modelValue: WorkInterface
  loading?: boolean
  isNew?: boolean
}

const props = defineProps<Props>()

// Type-safe emits declaration
const emit = defineEmits<{
  (e: 'update:modelValue', value: WorkInterface): void
  (e: 'validate'): void
  (e: 'cancel'): void
}>()

// Create a local form model
const formModel = computed(() => ({
  name: props.modelValue.name || '',
  position: props.modelValue.position || '',
  url: props.modelValue.url || '',
  startDate: props.modelValue.startDate || '',
  endDate: props.modelValue.endDate || '',
  summary: props.modelValue.summary || '',
  highlights: [...(props.modelValue.highlights || [])]
}))

// Highlights management
const newHighlight = ref('')
const highlightError = ref('')

// Form validation setup
const { errors, validateField, validateForm } = useFieldValidation()
const { updateField } = useModelUpdate({
  emit: emit as (event: string, ...args: any[]) => void,
  modelValue: computed(() => props.modelValue)
})

// Update field handler
const handleFieldUpdate = (field: keyof WorkInterface, value: string) => {
  console.log(`Updating work field ${field} with value:`, value)
  
  if (field === 'highlights') {
    return // This is handled separately
  }
  
  // Create a clean copy of the current data
  const updatedData = {
    ...props.modelValue,
    [field]: value
  }
  
  console.log('Emitting work update with data:', updatedData)
  emit('update:modelValue', updatedData) // Update directly instead of using updateField
}

// Handle adding a highlight
const addHighlight = () => {
  if (!newHighlight.value.trim()) {
    highlightError.value = 'Le point fort ne peut pas être vide'
    return
  }
  
  highlightError.value = ''
  const updatedHighlights = [...(props.modelValue.highlights || []), newHighlight.value.trim()]
  
  // Update using direct emit to ensure consistency
  emit('update:modelValue', {
    ...props.modelValue,
    highlights: updatedHighlights
  })
  newHighlight.value = ''
}

// Handle removing a highlight
const removeHighlight = (index: number) => {
  const updatedHighlights = [...(props.modelValue.highlights || [])]
  updatedHighlights.splice(index, 1)
  
  // Update using direct emit to ensure consistency
  emit('update:modelValue', {
    ...props.modelValue,
    highlights: updatedHighlights
  })
}

// Validate form before emitting validate event
const handleSubmit = async () => {
  console.log('Work form submission - Current model:', JSON.parse(JSON.stringify(props.modelValue)))
  
  // Validate all fields
  const formIsValid = validateForm(props.modelValue)
  console.log('Form validation result:', formIsValid)
  
  if (formIsValid) {
    // Ensure all required fields are present
    if (!props.modelValue.name || !props.modelValue.position || !props.modelValue.startDate) {
      console.error('Required fields missing:', {
        name: !props.modelValue.name,
        position: !props.modelValue.position,
        startDate: !props.modelValue.startDate
      })
      return
    }
    
    // Log all the fields to verify they are present
    console.log('Submitting with complete model:', {
      name: props.modelValue.name,
      position: props.modelValue.position,
      startDate: props.modelValue.startDate,
      endDate: props.modelValue.endDate,
      url: props.modelValue.url,
      summary: props.modelValue.summary,
      highlights: props.modelValue.highlights
    })
    
    emit('validate')
  }
}

// Handle cancellation
const handleCancel = () => {
  console.log('Cancelling form - emitting cancel event')
  emit('cancel')
}

// Icônes SVG pour les champs
const icons = {
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
  position: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0-2-.9-2-2V9c0-1.1-.9-2-2-2zM9 4h6v3H9V4zm11 16H4V9h16v11z"></path><path d="M12 10h4v2h-4v-2z"></path></svg>`,
  startDate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  endDate: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  summary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
  highlight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
}
</script>

<template>
  <Form 
    :loading="loading"
    :title="isNew ? 'Ajouter une expérience professionnelle' : 'Modifier l\'expérience professionnelle'"
    :subtitle="isNew ? 'Complétez les informations concernant votre expérience professionnelle.' : 'Mettez à jour les informations concernant cette expérience professionnelle.'"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="name"
        label="Nom de l'entreprise"
        :model-value="formModel.name"
        :error="errors.name"
        :icon="icons.name"
        placeholder="Ex: Acme Inc."
        help-text="Nom de l'entreprise ou de l'organisation."
        required
        @update:model-value="handleFieldUpdate('name', $event)"
        @blur="validateField('name', formModel.name)"
      />

      <FormField
        name="position"
        label="Poste occupé"
        :model-value="formModel.position"
        :error="errors.position"
        :icon="icons.position"
        placeholder="Ex: Développeur Full Stack"
        help-text="Intitulé de votre poste dans cette entreprise."
        required
        @update:model-value="handleFieldUpdate('position', $event)"
        @blur="validateField('position', formModel.position)"
      />

      <FormField
        name="startDate"
        label="Date de début"
        :model-value="formModel.startDate"
        :error="errors.startDate"
        :icon="icons.startDate"
        placeholder="YYYY-MM-DD"
        help-text="Format: AAAA-MM-JJ (ex: 2020-01-15)"
        required
        @update:model-value="handleFieldUpdate('startDate', $event)"
        @blur="validateField('startDate', formModel.startDate)"
      />

      <FormField
        name="endDate"
        label="Date de fin"
        :model-value="formModel.endDate"
        :error="errors.endDate"
        :icon="icons.endDate"
        placeholder="YYYY-MM-DD (ou laissez vide si en cours)"
        help-text="Laissez vide si c'est votre emploi actuel."
        @update:model-value="handleFieldUpdate('endDate', $event)"
        @blur="validateField('endDate', formModel.endDate)"
      />

      <div class="col-span-1 md:col-span-2">
        <FormField
          name="url"
          type="url"
          label="Site web de l'entreprise"
          :model-value="formModel.url"
          :error="errors.url"
          :icon="icons.url"
          placeholder="Ex: https://www.acme.com"
          help-text="URL du site de l'entreprise (optionnel)."
          @update:model-value="handleFieldUpdate('url', $event)"
          @blur="validateField('url', formModel.url)"
        />
      </div>
    </div>
    
    <div class="mt-6">
      <FormField
        name="summary"
        label="Résumé de l'expérience"
        :model-value="formModel.summary"
        :error="errors.summary"
        :icon="icons.summary"
        placeholder="Décrivez brièvement vos responsabilités et accomplissements..."
        help-text="Un résumé concis de votre rôle et de vos responsabilités."
        @update:model-value="handleFieldUpdate('summary', $event)"
      />
    </div>
    
    <!-- Section pour les points forts (highlights) -->
    <div class="mt-6">
      <h3 class="block mb-1.5 text-xs font-medium text-neutral-300 tracking-wide">Points forts</h3>
      <p class="text-xs text-neutral-400 mb-4">
        Ajoutez les points clés de cette expérience (compétences acquises, réalisations, responsabilités).
      </p>
      
      <!-- Liste des points forts existants -->
      <ul v-if="formModel.highlights && formModel.highlights.length > 0" class="mb-4 space-y-2">
        <li v-for="(highlight, index) in formModel.highlights" :key="index" class="flex items-center bg-neutral-800 p-2 rounded">
          <span class="flex-grow text-sm">{{ highlight }}</span>
          <button 
            type="button" 
            @click="removeHighlight(index)"
            class="ml-2 text-neutral-400 hover:text-error-400 focus:outline-none"
            aria-label="Supprimer ce point fort"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </li>
      </ul>
      
      <!-- Ajout d'un nouveau point fort -->
      <div class="flex items-start">
        <div class="flex-grow">
          <div class="relative">
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              <span v-html="icons.highlight"></span>
            </div>
            
            <input
              v-model="newHighlight"
              type="text"
              name="new-highlight"
              placeholder="Ajoutez un point fort..."
              class="block w-full py-2.5 px-3 pl-10 text-sm leading-6 text-white bg-neutral-800 border rounded transition-all duration-200 border-neutral-700 hover:border-neutral-600 hover:bg-neutral-750 focus:border-primary-500 focus:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-primary-500/40"
              @keyup.enter="addHighlight"
            />
          </div>
          
          <div v-if="highlightError" class="mt-1 text-xs text-error-500">
            {{ highlightError }}
          </div>
        </div>
        
        <button
          type="button"
          @click="addHighlight"
          class="ml-2 px-3 py-2.5 rounded-md bg-primary-600 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors"
        >
          Ajouter
        </button>
      </div>
    </div>
    
    <!-- Actions personnalisées -->
    <template #actions>
      <div class="flex justify-end mt-8">
        <button
          type="button"
          class="px-4 py-2 mr-3 border border-neutral-600 rounded-md text-neutral-200 bg-transparent hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading"
          @click="handleCancel"
        >
          Annuler
        </button>
        
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ isNew ? 'Ajouter' : 'Enregistrer' }}
        </button>
      </div>
    </template>
  </Form>
</template> 
<script setup lang="ts">
import type { VolunteerInterface } from '../../../../../node_modules/@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import DateRangeFields from '@ui/components/shared/form/DateRangeFields.vue'
import { useFieldValidation } from '@ui/modules/cv/presentation/composables/useCVFieldValidation'
import { useModelUpdate } from '@ui/modules/cv/presentation/composables/useModelUpdate'
import { computed, ref } from 'vue'

interface Props {
  modelValue: VolunteerInterface
  loading?: boolean
  isNew?: boolean
}

const props = defineProps<Props>()

// Type-safe emits declaration
const emit = defineEmits<{
  (e: 'update:modelValue', value: VolunteerInterface): void
  (e: 'validate'): void
  (e: 'cancel'): void
}>()

// Create a local form model
const formModel = computed(() => ({
  organization: props.modelValue.organization || '',
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
const handleFieldUpdate = (field: keyof VolunteerInterface, value: string) => {
  console.log(`Updating volunteer field ${String(field)} with value:`, value)
  
  if (field === 'highlights') {
    return // This is handled separately
  }
  
  // Create a clean copy of the current data
  const updatedData = {
    ...props.modelValue,
    [field]: value
  }
  
  console.log('Emitting volunteer update with data:', updatedData)
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

// Handle form submission
const handleSubmit = async () => {
  console.log('Volunteer form submission - Current model:', JSON.stringify(props.modelValue))
  
  // Validate all fields
  const formIsValid = validateForm(props.modelValue)
  console.log('Form validation result:', formIsValid)
  
  if (formIsValid) {
    // Check that required fields are present
    if (!props.modelValue.organization || !props.modelValue.position || !props.modelValue.startDate) {
      console.error('Required fields missing:', {
        organization: !props.modelValue.organization,
        position: !props.modelValue.position,
        startDate: !props.modelValue.startDate
      })
      return
    }
    
    emit('validate')
  }
}

// Handle cancellation
const handleCancel = () => {
  emit('cancel')
}

// Handle the "currently volunteering" state
const handleCurrentlyVolunteeringChange = (isCurrentlyVolunteering: boolean) => {
  if (isCurrentlyVolunteering) {
    // If currently volunteering, clear the end date
    handleFieldUpdate('endDate', '')
  }
}

// Icons for form fields
const icons = {
  organization: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  position: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-4V3c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"></path></svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  date: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  summary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
  highlights: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
}
</script>

<template>
  <Form 
    :loading="loading"
    :title="isNew ? 'Ajouter une expérience de bénévolat' : 'Modifier l\'expérience de bénévolat'"
    :subtitle="isNew ? 'Décrivez votre engagement bénévole et vos contributions.' : 'Mettez à jour les détails de cette expérience.'"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="organization"
        label="Organisation"
        :model-value="formModel.organization"
        :error="errors.organization"
        :icon="icons.organization"
        placeholder="Ex: Croix-Rouge"
        help-text="Nom de l'organisation où vous avez effectué du bénévolat."
        required
        @update:model-value="handleFieldUpdate('organization', $event)"
        @blur="validateField('organization', formModel.organization)"
      />

      <FormField
        name="position"
        label="Poste / Rôle"
        :model-value="formModel.position"
        :error="errors.position"
        :icon="icons.position"
        placeholder="Ex: Bénévole aux premiers secours"
        help-text="Votre fonction ou rôle dans l'organisation."
        required
        @update:model-value="handleFieldUpdate('position', $event)"
        @blur="validateField('position', formModel.position)"
      />

      <div class="col-span-1 md:col-span-2">
        <FormField
          name="url"
          type="url"
          label="Site Web"
          :model-value="formModel.url"
          :error="errors.url"
          :icon="icons.url"
          placeholder="Ex: https://organisation.com"
          help-text="Site web de l'organisation (optionnel)."
          @update:model-value="handleFieldUpdate('url', $event)"
          @blur="validateField('url', formModel.url)"
        />
      </div>

      <div class="col-span-1 md:col-span-2">
        <DateRangeFields
          :startDate="formModel.startDate"
          :endDate="formModel.endDate"
          :isCurrentlyActive="!formModel.endDate"
          :startDateError="errors.startDate"
          :endDateError="errors.endDate"
          :startDateIcon="icons.date"
          :endDateIcon="icons.date"
          :required="true"
          :startDateHelpText="'Date à laquelle vous avez commencé le bénévolat.'"
          :endDateHelpText="'Date de fin (laisser vide si en cours).'"
          :currentlyActiveLabel="'Bénévolat en cours'"
          @update:startDate="handleFieldUpdate('startDate', $event)"
          @update:endDate="handleFieldUpdate('endDate', $event)"
          @update:isCurrentlyActive="handleCurrentlyVolunteeringChange"
          @startDate-blur="validateField('startDate', $event)"
          @endDate-blur="validateField('endDate', $event)"
        />
      </div>

      <div class="col-span-1 md:col-span-2">
        <FormField
          name="summary"
          label="Résumé"
          :model-value="formModel.summary"
          :error="errors.summary"
          :icon="icons.summary"
          placeholder="Ex: Participation à des actions de terrain et sensibilisation..."
          help-text="Décrivez brièvement vos responsabilités et activités."
          rows="4"
          @update:model-value="handleFieldUpdate('summary', $event)"
          @blur="validateField('summary', formModel.summary)"
        />
      </div>
    </div>

    <!-- Points forts / Highlights section -->
    <div class="mt-8 border-t border-neutral-700 pt-6">
      <h3 class="text-lg font-medium mb-4 flex items-center">
        <span class="mr-2" v-html="icons.highlights"></span>
        Points forts
      </h3>
      
      <div class="mb-4">
        <label class="text-sm mb-1 block">Ajoutez des points clés de cette expérience (réalisations, contributions, etc.)</label>
        
        <div class="flex">
          <input 
            v-model="newHighlight"
            type="text"
            placeholder="Ex: Formé 20 nouveaux bénévoles"
            class="flex-grow rounded-l bg-neutral-700 border-neutral-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @keydown.enter.prevent="addHighlight"
          />
          <button 
            type="button"
            class="rounded-r bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
            @click="addHighlight"
          >
            Ajouter
          </button>
        </div>
        
        <p v-if="highlightError" class="text-red-500 text-sm mt-1">{{ highlightError }}</p>
      </div>
      
      <!-- Liste des points forts -->
      <ul v-if="formModel.highlights && formModel.highlights.length > 0" class="space-y-2">
        <li 
          v-for="(highlight, index) in formModel.highlights" 
          :key="`highlight-${index}`"
          class="bg-neutral-800 p-3 rounded-lg flex justify-between items-center"
        >
          <span>{{ highlight }}</span>
          <button 
            type="button" 
            class="text-red-500 hover:text-red-400"
            @click="removeHighlight(index)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </li>
      </ul>
      
      <p v-else class="text-neutral-400 text-sm">
        Aucun point fort ajouté. Les points forts permettent de mettre en valeur vos réalisations.
      </p>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4 mt-8">
      <button 
        type="button"
        class="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-white"
        @click="handleCancel"
      >
        Annuler
      </button>
      <button 
        type="submit"
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
      >
        {{ isNew ? 'Ajouter' : 'Enregistrer' }}
      </button>
    </div>
  </Form>
</template> 
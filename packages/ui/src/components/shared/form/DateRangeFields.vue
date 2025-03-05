<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { uniqueId } from '@ui/utils/id-generator'

// Définition des props avec valeurs par défaut
const props = withDefaults(defineProps<{
  // Valeurs des dates
  startDate: string
  endDate?: string
  
  // État "en cours"
  isCurrentlyActive?: boolean
  
  // Labels et placeholders
  startDateLabel?: string
  endDateLabel?: string
  currentlyActiveLabel?: string
  startDatePlaceholder?: string
  endDatePlaceholder?: string
  
  // Validation
  required?: boolean
  startDateError?: string
  endDateError?: string
  
  // Textes d'aide
  startDateHelpText?: string
  endDateHelpText?: string
  
  // Icons
  startDateIcon?: string
  endDateIcon?: string
  
  // Ids
  startDateId?: string
  endDateId?: string
  currentlyActiveId?: string
  
  // Format de date
  dateFormat?: string
}>(), {
  // Valeurs par défaut
  isCurrentlyActive: false,
  startDateLabel: 'Date de début',
  endDateLabel: 'Date de fin',
  currentlyActiveLabel: 'En cours',
  startDatePlaceholder: 'YYYY-MM-DD',
  endDatePlaceholder: 'YYYY-MM-DD (ou vide si en cours)',
  required: false,
  startDateHelpText: 'Format: AAAA-MM-JJ (ex: 2020-01-15)',
  endDateHelpText: 'Laissez vide si en cours',
  dateFormat: 'YYYY-MM-DD',
  startDateIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
  endDateIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
})

// Définition des événements
const emit = defineEmits<{
  'update:startDate': [value: string]
  'update:endDate': [value: string]
  'update:isCurrentlyActive': [value: boolean]
  'startDate-blur': [value: string]
  'endDate-blur': [value: string]
  'date-range-change': [range: { startDate: string; endDate?: string; isCurrentlyActive: boolean }]
}>()

// Génération d'IDs uniques pour l'accessibilité si non fournis
const generatedStartDateId = uniqueId('start-date-')
const generatedEndDateId = uniqueId('end-date-')
const generatedCurrentlyActiveId = uniqueId('currently-active-')

// IDs finaux (props ou générés)
const startDateFieldId = computed(() => props.startDateId || generatedStartDateId)
const endDateFieldId = computed(() => props.endDateId || generatedEndDateId)
const currentlyActiveFieldId = computed(() => props.currentlyActiveId || generatedCurrentlyActiveId)

// Modèles locaux réactifs
const startDateModel = ref(props.startDate)
const endDateModel = ref(props.endDate || '')
const isCurrentlyActiveModel = ref(props.isCurrentlyActive || false)

// Validation des formats de date
const validateDateFormat = (date: string): boolean => {
  if (!date) return true // Date vide considérée valide (sauf si required est true)
  
  // Format ISO YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) return false
  
  // Vérifier que c'est une date valide
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}

// Validation de la plage de dates
const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true
  
  if (!validateDateFormat(startDate) || !validateDateFormat(endDate)) return false
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return end >= start
}

// Surveillance des changements de props pour maintenir les modèles locaux à jour
watch(() => props.startDate, (newValue) => {
  startDateModel.value = newValue
})

watch(() => props.endDate, (newValue) => {
  endDateModel.value = newValue || ''
})

watch(() => props.isCurrentlyActive, (newValue) => {
  isCurrentlyActiveModel.value = newValue || false
  
  // Si "en cours" devient actif, vider la date de fin
  if (newValue && endDateModel.value) {
    endDateModel.value = ''
    emit('update:endDate', '')
  }
})

// Gestionnaires d'événements
const handleStartDateChange = (value: string) => {
  startDateModel.value = value
  emit('update:startDate', value)
  
  // Émettre l'événement de changement global
  emit('date-range-change', {
    startDate: value,
    endDate: isCurrentlyActiveModel.value ? undefined : endDateModel.value,
    isCurrentlyActive: isCurrentlyActiveModel.value
  })
}

const handleEndDateChange = (value: string) => {
  endDateModel.value = value
  emit('update:endDate', value)
  
  // Si une date de fin est fournie, désactiver automatiquement "en cours"
  if (value && isCurrentlyActiveModel.value) {
    isCurrentlyActiveModel.value = false
    emit('update:isCurrentlyActive', false)
  }
  
  // Émettre l'événement de changement global
  emit('date-range-change', {
    startDate: startDateModel.value,
    endDate: value,
    isCurrentlyActive: isCurrentlyActiveModel.value
  })
}

const handleCurrentlyActiveChange = (event: Event) => {
  const isActive = (event.target as HTMLInputElement).checked
  isCurrentlyActiveModel.value = isActive
  
  if (isActive) {
    // Si "en cours" est coché, vider la date de fin
    endDateModel.value = ''
    emit('update:endDate', '')
  }
  
  emit('update:isCurrentlyActive', isActive)
  
  // Émettre l'événement de changement global
  emit('date-range-change', {
    startDate: startDateModel.value,
    endDate: isActive ? undefined : endDateModel.value,
    isCurrentlyActive: isActive
  })
}

const handleStartDateBlur = () => {
  emit('startDate-blur', startDateModel.value)
}

const handleEndDateBlur = () => {
  emit('endDate-blur', endDateModel.value)
}
</script>

<template>
  <div class="date-range-fields space-y-4">
    <!-- Champ de date de début -->
    <FormField
      :id="startDateFieldId"
      name="startDate"
      :label="startDateLabel"
      :model-value="startDateModel"
      :placeholder="startDatePlaceholder"
      :error="startDateError"
      :help-text="startDateHelpText"
      :icon="startDateIcon"
      :required="required"
      @update:model-value="handleStartDateChange"
      @blur="handleStartDateBlur"
    />
    
    <!-- Checkbox "en cours" -->
    <div class="currently-active flex items-center space-x-2">
      <input
        type="checkbox"
        :id="currentlyActiveFieldId"
        v-model="isCurrentlyActiveModel"
        @change="handleCurrentlyActiveChange"
        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-neutral-600 rounded"
      />
      <label :for="currentlyActiveFieldId" class="text-sm font-medium">
        {{ currentlyActiveLabel }}
      </label>
    </div>
    
    <!-- Champ de date de fin (masqué si "en cours" est coché) -->
    <FormField
      v-if="!isCurrentlyActiveModel"
      :id="endDateFieldId"
      name="endDate"
      :label="endDateLabel"
      :model-value="endDateModel"
      :placeholder="endDatePlaceholder"
      :error="endDateError"
      :help-text="endDateHelpText"
      :icon="endDateIcon"
      @update:model-value="handleEndDateChange"
      @blur="handleEndDateBlur"
    />
  </div>
</template>

<style scoped>
.date-range-fields {
  width: 100%;
}

.currently-active {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
</style> 
<script setup lang="ts">
import type { EducationInterface } from '../../../../../node_modules/@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import DateRangeFields from '@ui/components/shared/form/DateRangeFields.vue'
import { useFieldValidation } from '@ui/modules/cv/presentation/composables/useCVFieldValidation'
import { useModelUpdate } from '@ui/modules/cv/presentation/composables/useModelUpdate'
import { computed, ref } from 'vue'

interface Props {
  modelValue: EducationInterface
  loading?: boolean
  isNew?: boolean
}

const props = defineProps<Props>()

// Type-safe emits declaration
const emit = defineEmits<{
  (e: 'update:modelValue', value: EducationInterface): void
  (e: 'validate'): void
  (e: 'cancel'): void
}>()

// Create a local form model
const formModel = computed(() => ({
  institution: props.modelValue.institution || '',
  area: props.modelValue.area || '',
  studyType: props.modelValue.studyType || '',
  url: props.modelValue.url || '',
  startDate: props.modelValue.startDate || '',
  endDate: props.modelValue.endDate || '',
  score: props.modelValue.score || '',
  courses: [...(props.modelValue.courses || [])]
}))

// Courses management
const newCourse = ref('')
const courseError = ref('')

// Form validation setup
const { errors, validateField, validateForm } = useFieldValidation()
const { updateField } = useModelUpdate({
  emit: emit as (event: string, ...args: any[]) => void,
  modelValue: computed(() => props.modelValue)
})

// Update field handler
const handleFieldUpdate = (field: keyof EducationInterface, value: string) => {
  console.log(`Updating education field ${String(field)} with value:`, value)
  
  if (field === 'courses') {
    return // This is handled separately
  }
  
  // Create a clean copy of the current data
  const updatedData = {
    ...props.modelValue,
    [field]: value
  }
  
  console.log('Emitting education update with data:', updatedData)
  emit('update:modelValue', updatedData) // Update directly instead of using updateField
}

// Handle adding a course
const addCourse = () => {
  if (!newCourse.value.trim()) {
    courseError.value = 'Le cours ne peut pas être vide'
    return
  }
  
  courseError.value = ''
  const updatedCourses = [...(props.modelValue.courses || []), newCourse.value.trim()]
  
  // Update using direct emit to ensure consistency
  emit('update:modelValue', {
    ...props.modelValue,
    courses: updatedCourses
  })
  newCourse.value = ''
}

// Handle removing a course
const removeCourse = (index: number) => {
  const updatedCourses = [...(props.modelValue.courses || [])]
  updatedCourses.splice(index, 1)
  
  // Update using direct emit to ensure consistency
  emit('update:modelValue', {
    ...props.modelValue,
    courses: updatedCourses
  })
}

// Handle form submission
const handleSubmit = async () => {
  console.log('Education form submission - Current model:', JSON.stringify(props.modelValue))
  
  // Validate all fields
  const formIsValid = validateForm(props.modelValue)
  console.log('Form validation result:', formIsValid)
  
  if (formIsValid) {
    // Check that required fields are present
    if (!props.modelValue.institution || !props.modelValue.area || !props.modelValue.studyType || !props.modelValue.startDate) {
      console.error('Required fields missing:', {
        institution: !props.modelValue.institution,
        area: !props.modelValue.area,
        studyType: !props.modelValue.studyType,
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

// Handle the "currently studying" state
const handleCurrentlyStudyingChange = (isCurrentlyStudying: boolean) => {
  if (isCurrentlyStudying) {
    // If currently studying, clear the end date
    handleFieldUpdate('endDate', '')
  }
}

// Icons for form fields
const icons = {
  institution: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>`,
  area: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
  studyType: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  date: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  score: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`,
  courses: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`
}
</script>

<template>
  <Form 
    :loading="loading"
    :title="isNew ? 'Ajouter une formation' : 'Modifier la formation'"
    :subtitle="isNew ? 'Détaillez votre parcours éducatif et vos qualifications.' : 'Mettez à jour les détails de cette formation.'"
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="institution"
        label="Établissement"
        :model-value="formModel.institution"
        :error="errors.institution"
        :icon="icons.institution"
        placeholder="Ex: Université de Paris"
        help-text="Nom de l'établissement où vous avez étudié."
        required
        @update:model-value="handleFieldUpdate('institution', $event)"
        @blur="validateField('institution', formModel.institution)"
      />

      <FormField
        name="area"
        label="Domaine d'étude"
        :model-value="formModel.area"
        :error="errors.area"
        :icon="icons.area"
        placeholder="Ex: Informatique"
        help-text="Domaine ou spécialité de vos études."
        required
        @update:model-value="handleFieldUpdate('area', $event)"
        @blur="validateField('area', formModel.area)"
      />

      <FormField
        name="studyType"
        label="Type de diplôme"
        :model-value="formModel.studyType"
        :error="errors.studyType"
        :icon="icons.studyType"
        placeholder="Ex: Master"
        help-text="Type ou niveau de diplôme obtenu."
        required
        @update:model-value="handleFieldUpdate('studyType', $event)"
        @blur="validateField('studyType', formModel.studyType)"
      />

      <FormField
        name="url"
        type="url"
        label="Site Web"
        :model-value="formModel.url"
        :error="errors.url"
        :icon="icons.url"
        placeholder="Ex: https://universite.fr"
        help-text="Site web de l'établissement (optionnel)."
        @update:model-value="handleFieldUpdate('url', $event)"
        @blur="validateField('url', formModel.url)"
      />

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
          :startDateHelpText="'Date à laquelle vous avez commencé vos études.'"
          :endDateHelpText="'Date de fin (laisser vide si en cours).'"
          :currentlyActiveLabel="'Formation en cours'"
          @update:startDate="handleFieldUpdate('startDate', $event)"
          @update:endDate="handleFieldUpdate('endDate', $event)"
          @update:isCurrentlyActive="handleCurrentlyStudyingChange"
          @startDate-blur="validateField('startDate', $event)"
          @endDate-blur="validateField('endDate', $event)"
        />
      </div>

      <FormField
        name="score"
        label="Note / Distinction"
        :model-value="formModel.score"
        :error="errors.score"
        :icon="icons.score"
        placeholder="Ex: Mention Bien, 16/20"
        help-text="Résultat obtenu ou distinction honorifique (optionnel)."
        @update:model-value="handleFieldUpdate('score', $event)"
        @blur="validateField('score', formModel.score)"
      />
    </div>

    <!-- Cours suivis / Courses section -->
    <div class="mt-8 border-t border-neutral-700 pt-6">
      <h3 class="text-lg font-medium mb-4 flex items-center">
        <span class="mr-2" v-html="icons.courses"></span>
        Cours suivis
      </h3>
      
      <div class="mb-4">
        <label class="text-sm mb-1 block">Ajoutez les cours principaux ou modules suivis durant cette formation</label>
        
        <div class="flex">
          <input 
            v-model="newCourse"
            type="text"
            placeholder="Ex: Algorithmes et structures de données"
            class="flex-grow rounded-l bg-neutral-700 border-neutral-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @keydown.enter.prevent="addCourse"
          />
          <button 
            type="button"
            class="rounded-r bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
            @click="addCourse"
          >
            Ajouter
          </button>
        </div>
        
        <p v-if="courseError" class="text-red-500 text-sm mt-1">{{ courseError }}</p>
      </div>
      
      <!-- Liste des cours -->
      <ul v-if="formModel.courses && formModel.courses.length > 0" class="space-y-2">
        <li 
          v-for="(course, index) in formModel.courses" 
          :key="`course-${index}`"
          class="bg-neutral-800 p-3 rounded-lg flex justify-between items-center"
        >
          <span>{{ course }}</span>
          <button 
            type="button" 
            class="text-red-500 hover:text-red-400"
            @click="removeCourse(index)"
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
        Aucun cours ajouté. Les cours permettent de détailler les compétences acquises durant votre formation.
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
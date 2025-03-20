<script setup lang="ts">
import type { EducationInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import DateRangeFields from '@ui/components/shared/form/DateRangeFields.vue'
import { useValidation } from '@ui/modules/cv/presentation/composables/useValidation'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TRANSLATION_KEYS } from '@cv-generator/shared'

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

// Initialize i18n
const { t } = useI18n()

// Fonction pour gérer les erreurs de traduction
const safeTranslate = (key: string, fallback: string = 'Translation missing') => {
  try {
    const result = t(key);
    // Si la clé est retournée telle quelle, c'est qu'elle n'existe pas
    if (result === key) {

      return fallback;
    }
    return result;
  } catch (error) {

    return fallback;
  }
};

// Setup form model using useFormModel composable
const {
  localModel,
  updateField} = useFormModel<EducationInterface>({
  modelValue: computed(() => props.modelValue),
  emit: (event, value) => emit(event, value),
  defaultValues: {
    institution: '',
    area: '',
    studyType: '',
    url: '',
    startDate: '',
    endDate: '',
    score: '',
    courses: []
  }
})

// Courses management
const newCourse = ref('')
const courseError = ref('')
const editingCourseIndex = ref<number | null>(null)

// Setup form validation using useValidation composable
const {
  errors,
  validateField,
  validateForm
} = useValidation<EducationInterface>(undefined, {
  requiredFields: ['institution', 'area', 'studyType', 'startDate']
})

// Validation for courses
const validateCourse = (course: string): boolean => {
  if (!course.trim()) {
    courseError.value = safeTranslate(TRANSLATION_KEYS.COMMON.ERRORS.REQUIRED_FIELD, 'Le cours ne peut pas être vide')
    return false
  }
  
  if (course.length > 100) {
    courseError.value = safeTranslate(TRANSLATION_KEYS.COMMON.ERRORS.TOO_LONG, 'Le cours ne peut pas dépasser 100 caractères')
    return false
  }
  
  // Check for duplicates
  if (localModel.courses && localModel.courses.some(c => c.toLowerCase() === course.toLowerCase())) {
    courseError.value = safeTranslate(TRANSLATION_KEYS.RESUME.EDUCATION.VALIDATION.VAGUE_COURSES, 'Ce cours existe déjà dans la liste')
    return false
  }
  
  courseError.value = ''
  return true
}

// Handle field updates
const handleFieldUpdate = (field: keyof EducationInterface, value: string) => {
  if (field === 'courses') {
    return // This is handled separately
  }
  
  updateField(field, value)
  validateField(field, value)
}

// Handle adding a course
const addCourse = () => {
  if (!validateCourse(newCourse.value)) {
    return
  }
  
  const updatedCourses = [...(localModel.courses || []), newCourse.value.trim()]
  
  // Update the courses array
  updateField('courses', updatedCourses)
  newCourse.value = ''
}

// Handle editing a course
const startEditCourse = (index: number) => {
  editingCourseIndex.value = index
  newCourse.value = localModel.courses![index]
}

// Save edited course
const saveEditedCourse = () => {
  if (editingCourseIndex.value === null) return
  
  // First check if we're not trying to save the same value
  if (localModel.courses && localModel.courses[editingCourseIndex.value] === newCourse.value.trim()) {
    cancelEditCourse()
    return
  }
  
  // Remove the course from the array to avoid duplicate check
  const currentCourses = [...(localModel.courses || [])]
  currentCourses.splice(editingCourseIndex.value, 1)
  
  // Check if the new value is valid
  if (!validateCourse(newCourse.value)) {
    // Restore the original array and return
    return
  }
  
  // Update the course
  const updatedCourses = [...currentCourses]
  updatedCourses.splice(editingCourseIndex.value, 0, newCourse.value.trim())
  
  // Update the courses array
  updateField('courses', updatedCourses)
  editingCourseIndex.value = null
  newCourse.value = ''
}

// Cancel course editing
const cancelEditCourse = () => {
  editingCourseIndex.value = null
  newCourse.value = ''
  courseError.value = ''
}

// Handle removing a course
const removeCourse = (index: number) => {
  const updatedCourses = [...(localModel.courses || [])]
  updatedCourses.splice(index, 1)
  
  // Update the courses array
  updateField('courses', updatedCourses)
}

// Reorder courses up
const moveCourseUp = (index: number) => {
  if (index <= 0 || !localModel.courses) return
  
  const updatedCourses = [...localModel.courses]
  const temp = updatedCourses[index]
  updatedCourses[index] = updatedCourses[index - 1]
  updatedCourses[index - 1] = temp
  
  // Update the courses array
  updateField('courses', updatedCourses)
}

// Reorder courses down
const moveCourseDown = (index: number) => {
  if (!localModel.courses || index >= localModel.courses.length - 1) return
  
  const updatedCourses = [...localModel.courses]
  const temp = updatedCourses[index]
  updatedCourses[index] = updatedCourses[index + 1]
  updatedCourses[index + 1] = temp
  
  // Update the courses array
  updateField('courses', updatedCourses)
}

// Handle form submission
const handleSubmit = async () => {
  // Validate all fields
  const formIsValid = validateForm(localModel)
  
  if (formIsValid) {
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
  courses: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  moveUp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`,
  moveDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`
}
</script>

<template>
  <Form 
    :loading="loading"
    :title="isNew ? t(TRANSLATION_KEYS.RESUME.EDUCATION.FORM.ADD_TITLE) : t(TRANSLATION_KEYS.RESUME.EDUCATION.FORM.EDIT_TITLE)"
    :subtitle="isNew ? t(TRANSLATION_KEYS.RESUME.EDUCATION.FORM.ADD_SUBTITLE) : t(TRANSLATION_KEYS.RESUME.EDUCATION.FORM.EDIT_SUBTITLE)"
    @submit="handleSubmit"
    @cancel="handleCancel"
    :submit-label="isNew ? t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD) : t(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE)"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="institution"
        :label="t(TRANSLATION_KEYS.RESUME.EDUCATION.LABELS.INSTITUTION)"
        :model-value="localModel.institution"
        :error="errors.institution"
        :icon="icons.institution"
        :placeholder="t(TRANSLATION_KEYS.RESUME.EDUCATION.PLACEHOLDERS.INSTITUTION)"
        :help-text="t(TRANSLATION_KEYS.RESUME.EDUCATION.HELP_TEXT.INSTITUTION)"
        required
        @update:model-value="(value) => handleFieldUpdate('institution', value)"
        @blur="validateField('institution', localModel.institution)"
      />

      <FormField
        name="studyType"
        :label="t(TRANSLATION_KEYS.RESUME.EDUCATION.LABELS.STUDY_TYPE)"
        :model-value="localModel.studyType"
        :error="errors.studyType"
        :icon="icons.studyType"
        :placeholder="t(TRANSLATION_KEYS.RESUME.EDUCATION.PLACEHOLDERS.STUDY_TYPE)"
        :help-text="t(TRANSLATION_KEYS.RESUME.EDUCATION.HELP_TEXT.STUDY_TYPE)"
        required
        @update:model-value="(value) => handleFieldUpdate('studyType', value)"
        @blur="validateField('studyType', localModel.studyType)"
      />

      <FormField
        name="area"
        :label="t(TRANSLATION_KEYS.RESUME.EDUCATION.LABELS.AREA)"
        :model-value="localModel.area"
        :error="errors.area"
        :icon="icons.area"
        :placeholder="t(TRANSLATION_KEYS.RESUME.EDUCATION.PLACEHOLDERS.AREA)"
        :help-text="t(TRANSLATION_KEYS.RESUME.EDUCATION.HELP_TEXT.AREA)"
        required
        @update:model-value="(value) => handleFieldUpdate('area', value)"
        @blur="validateField('area', localModel.area)"
      />

      <FormField
        name="score"
        :label="t(TRANSLATION_KEYS.RESUME.EDUCATION.LABELS.GPA)"
        :model-value="localModel.score || ''"
        :error="errors.score"
        :icon="icons.score"
        :placeholder="t(TRANSLATION_KEYS.RESUME.EDUCATION.PLACEHOLDERS.GPA)"
        :help-text="t(TRANSLATION_KEYS.RESUME.EDUCATION.HELP_TEXT.GPA)"
        @update:model-value="(value) => handleFieldUpdate('score', value)"
        @blur="validateField('score', localModel.score)"
      />

      <div class="col-span-1 md:col-span-2">
        <FormField
          name="url"
          type="url"
          :label="t(TRANSLATION_KEYS.RESUME.WORK.LABELS.WEBSITE)"
          :model-value="localModel.url || ''"
          :error="errors.url"
          :icon="icons.url"
          :placeholder="t(TRANSLATION_KEYS.RESUME.WORK.PLACEHOLDERS.WEBSITE)"
          :help-text="safeTranslate('resume.education.helpText.website', 'Site web de l\'établissement (optionnel).')"
          @update:model-value="(value) => handleFieldUpdate('url', value)"
          @blur="validateField('url', localModel.url)"
        />
      </div>

      <div class="col-span-1 md:col-span-2">
        <DateRangeFields
          :start-date="localModel.startDate"
          :end-date="localModel.endDate || ''"
          :is-currently-active="!localModel.endDate"
          :start-date-error="errors.startDate"
          :end-date-error="errors.endDate"
          :start-date-icon="icons.date"
          :end-date-icon="icons.date"
          :required="true"
          :start-date-help-text="t(TRANSLATION_KEYS.RESUME.EDUCATION.HELP_TEXT.START_DATE)"
          :end-date-help-text="t(TRANSLATION_KEYS.RESUME.EDUCATION.HELP_TEXT.END_DATE)"
          :currently-active-label="safeTranslate('resume.education.form.currentEducation', 'Formation en cours')"
          @update:start-date="(value) => handleFieldUpdate('startDate', value)"
          @update:end-date="(value) => handleFieldUpdate('endDate', value)"
          @update:is-currently-active="handleCurrentlyStudyingChange"
          @start-date-blur="() => validateField('startDate', localModel.startDate)"
          @end-date-blur="() => validateField('endDate', localModel.endDate)"
        />
      </div>
    </div>

    <!-- Courses section -->
    <div class="mt-8 border-t border-neutral-700 pt-6">
      <h3 class="text-lg font-medium mb-4 flex items-center">
        <span class="mr-2" v-html="icons.courses"></span>
        {{ t(TRANSLATION_KEYS.RESUME.EDUCATION.FORM.COURSES_SECTION) }}
      </h3>

      <div class="mb-4">
        <label class="text-sm mb-1 block">{{ t(TRANSLATION_KEYS.RESUME.EDUCATION.FORM.COURSES_DESCRIPTION) }}</label>
        
        <div class="flex">
          <input 
            v-model="newCourse"
            type="text"
            :placeholder="t(TRANSLATION_KEYS.RESUME.EDUCATION.PLACEHOLDERS.COURSE)"
            class="flex-grow rounded-l bg-neutral-700 border-neutral-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @keydown.enter.prevent="editingCourseIndex === null ? addCourse() : saveEditedCourse()"
          />
          <button 
            v-if="editingCourseIndex === null"
            type="button"
            class="rounded-r bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
            @click="addCourse"
          >
            {{ t(TRANSLATION_KEYS.RESUME.EDUCATION.FORM.ADD_COURSE) }}
          </button>
          <div v-else class="flex">
            <button 
              type="button"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
              @click="saveEditedCourse"
            >
              {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE) }}
            </button>
            <button 
              type="button"
              class="rounded-r bg-neutral-600 hover:bg-neutral-700 text-white px-4 py-2"
              @click="cancelEditCourse"
            >
              {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL) }}
            </button>
          </div>
        </div>
        
        <p v-if="courseError" class="text-red-500 text-sm mt-1">{{ courseError }}</p>
      </div>
      
      <!-- Course list -->
      <ul v-if="localModel.courses && localModel.courses.length > 0" class="space-y-2">
        <li 
          v-for="(course, index) in localModel.courses" 
          :key="`course-${index}`"
          class="bg-neutral-800 p-3 rounded-lg flex justify-between items-center"
        >
          <span>{{ course }}</span>
          <div class="flex space-x-1">
            <button 
              type="button" 
              class="text-neutral-400 hover:text-white p-1 disabled:opacity-30"
              :disabled="index === 0"
              @click="moveCourseUp(index)"
              :title="t(TRANSLATION_KEYS.RESUME.EDUCATION.LIST.MOVE_UP)"
            >
              <span v-html="icons.moveUp"></span>
            </button>
            
            <button 
              type="button" 
              class="text-neutral-400 hover:text-white p-1 disabled:opacity-30"
              :disabled="!localModel.courses || index === localModel.courses.length - 1"
              @click="moveCourseDown(index)"
              :title="t(TRANSLATION_KEYS.RESUME.EDUCATION.LIST.MOVE_DOWN)"
            >
              <span v-html="icons.moveDown"></span>
            </button>
            
            <!-- Edit button -->
            <button 
              type="button" 
              class="text-indigo-400 hover:text-indigo-300 p-1"
              @click="startEditCourse(index)"
              :title="t(TRANSLATION_KEYS.COMMON.ACTIONS.EDIT)"
            >
              <span v-html="icons.edit"></span>
            </button>
            
            <!-- Delete button -->
            <button 
              type="button" 
              class="text-red-500 hover:text-red-400 p-1"
              @click="removeCourse(index)"
              :title="t(TRANSLATION_KEYS.COMMON.ACTIONS.DELETE)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </li>
      </ul>
      
      <p v-else class="text-neutral-400 text-sm rounded-lg bg-neutral-800 p-4 flex items-center justify-center italic">
        {{ t(TRANSLATION_KEYS.RESUME.EDUCATION.FORM.NO_COURSES) }}
      </p>
    </div>
  </Form>
</template>

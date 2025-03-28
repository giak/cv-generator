<script setup lang="ts">
import type { BasicsInterface, ProfileInterface } from '@cv-generator/shared/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { useCollectionField } from '@ui/modules/cv/presentation/composables/useCollectionField'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  type ValidationErrorInterface,
  type ResultType,
  ValidationLayerType,
  ERROR_CODES,
  createSuccess,
  createFailure,
  TRANSLATION_KEYS
} from '@cv-generator/shared'
// Remove BasicsValidationService direct import and use the composable
import { useBasicsFormValidation } from '../composables/useBasicsFormValidation'

// Debug translation keys structure

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

// Performance measurement
const perfMeasurements = {
  profileOperations: 0,
  validations: 0,
  renderTime: 0
}

const startTime = performance.now()

// Log component performance on unmount
onMounted(() => {
  perfMeasurements.renderTime = performance.now() - startTime

  // Clean up on component unmount
  
  
})

interface Props {
  modelValue: BasicsInterface
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: BasicsInterface): void
  (e: 'validate'): void
  (e: 'cancel'): void
}>()

// Default values for a new basics model
const defaultValues: Partial<BasicsInterface> = {
  name: '',
  email: '',
  label: '',
  phone: '',
  url: '',
  image: '',
  summary: '',
  location: {
    address: '',
    postalCode: '',
    city: '',
    countryCode: '',
    region: ''
  },
  profiles: []
}

// Use the form model composable
const { 
  localModel, 
  updateField, 
  updateNestedField} = useFormModel<BasicsInterface>({
  modelValue: computed(() => props.modelValue),
  emit: (event, value) => emit(event, value),
  defaultValues,
  enableLogging: process.env.NODE_ENV === 'development' // Only enable logging in development
})

// Initialize validation composable
const { 
  state: validationState,
  validateName,
  validateEmail,
  validatePhone,
  validateUrl,
  validateImageUrl,
  validateField,
  validateForm} = useBasicsFormValidation()

// Type assertion for FormField props to handle string | undefined
const toStringOrEmpty = (value: string | undefined): string => value || '';

// Handle field updates for top-level fields
const handleFieldUpdate = (field: keyof BasicsInterface, value: string) => {
  updateField(field, value)
}

// Handle updates for nested location fields
const handleLocationUpdate = (field: string, value: string) => {
  // Use typed function instead of type assertion
  updateNestedField('location', field, value)
}

// Create a type-safe wrapper function for updateField to use with profiles collection
const updateProfilesField = (field: string, value: ProfileInterface[]) => {
  if (field === 'profiles') {
    updateField('profiles', value)
  }
}

// Default profile for new items
const defaultProfile: ProfileInterface = {
  network: '',
  username: '',
  url: ''
}

/**
 * Valide un profil et retourne un ResultType conforme
 * Cette fonction adapte la validation legacy au pattern Result/Option
 */
const validateProfile = (profile: ProfileInterface): ResultType<ProfileInterface> => {
  const errors: ValidationErrorInterface[] = []
  
  // Validation du réseau (obligatoire)
  if (!profile.network) {
    errors.push({
      code: ERROR_CODES.COMMON.REQUIRED_FIELD,
      message: 'Le réseau est requis',
      i18nKey: TRANSLATION_KEYS.COMMON.ERRORS.REQUIRED_FIELD,
      field: 'network',
      severity: 'error',
      layer: ValidationLayerType.PRESENTATION
    })
  }
  
  // Validation du nom d'utilisateur (obligatoire)
  if (!profile.username) {
    errors.push({
      code: ERROR_CODES.COMMON.REQUIRED_FIELD,
      message: 'Le nom d\'utilisateur est requis',
      i18nKey: TRANSLATION_KEYS.COMMON.ERRORS.REQUIRED_FIELD,
      field: 'username',
      severity: 'error',
      layer: ValidationLayerType.PRESENTATION
    })
  }
  
  // Validation de l'URL (optionnelle mais doit être valide si présente)
  if (profile.url) {
    // Si nous avons un service de validation d'URL, nous pourrions l'utiliser ici
    // Pour l'instant, simple vérification de format
    if (!profile.url.startsWith('http://') && !profile.url.startsWith('https://')) {
      errors.push({
        code: ERROR_CODES.COMMON.INVALID_FORMAT,
        message: 'L\'URL doit commencer par http:// ou https://',
        i18nKey: TRANSLATION_KEYS.COMMON.ERRORS.INVALID_FORMAT,
        field: 'url',
        severity: 'warning',
        layer: ValidationLayerType.PRESENTATION
      })
    }
  }
  
  // Si des erreurs ont été trouvées, retourner un échec
  if (errors.length > 0) {
    return createFailure(errors)
  }
  
  // Sinon, retourner un succès avec le profil validé
  return createSuccess(profile)
}

// Use the collection field composable for profiles
const {
  items: profiles,
  newItem: newProfile,
  isAddingItem: isAddingProfile,
  validationErrors: profileValidationErrors,
  addItem: addProfile,
  removeItem: removeProfile,
  toggleAddForm: toggleProfileForm} = useCollectionField<ProfileInterface>({
  fieldName: 'profiles',
  updateField: updateProfilesField,
  collection: computed(() => localModel.profiles || []),
  defaultItemValues: defaultProfile,
  validateItem: validateProfile,
  enableLogging: process.env.NODE_ENV === 'development'
})

// Handle form submit
const handleSubmit = () => {

  // Validate the form before submitting
  const isValid = validateForm(localModel)
  
  if (isValid) {
    emit('validate')
  }
}

// SVG icons for fields (preserve original sizes)
const icons = {
  name: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>`,
  url: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
  summary: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>`,
  image: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,
  location: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  profile: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`
}
</script>

<template>
  <Form 
    @submit="handleSubmit" 
    @cancel="emit('cancel')" 
    :loading="props.loading"
    :submit-label="t(TRANSLATION_KEYS.COMMON.ACTIONS.SAVE)"
  >
    <!-- Section d'informations personnelles -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">{{ t(TRANSLATION_KEYS.RESUME.SECTIONS.BASICS) }}</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          name="name"
          :label="safeTranslate(TRANSLATION_KEYS.RESUME.BASICS.LABELS.NAME, 'Nom')"
          :model-value="toStringOrEmpty(localModel.name)"
          :error="validationState.errors.name"
          :icon="icons.name"
          :placeholder="safeTranslate(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.NAME, 'Entrez votre nom complet')"
          :help-text="safeTranslate(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.NAME, 'Votre nom complet tel qu\'il apparaîtra sur votre CV.')"
          required
          @update:model-value="handleFieldUpdate('name', $event)"
          @blur="validateName(localModel)"
        />
        
        <FormField
          name="email"
          :label="safeTranslate(TRANSLATION_KEYS.RESUME.BASICS.LABELS.EMAIL, 'E-mail')"
          type="email"
          :model-value="toStringOrEmpty(localModel.email)"
          :error="validationState.errors.email"
          :warning="validationState.warnings.email"
          :icon="icons.email"
          :placeholder="safeTranslate(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.EMAIL, 'Entrez votre e-mail professionnel')"
          :help-text="safeTranslate(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.EMAIL, 'Votre adresse email professionnelle.')"
          required
          @update:model-value="handleFieldUpdate('email', $event)"
          @blur="validateEmail(localModel)"
        />
        
        <FormField
          name="phone"
          :label="t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.PHONE)"
          :model-value="toStringOrEmpty(localModel.phone)"
          :error="validationState.errors.phone"
          :warning="validationState.warnings.phone"
          :icon="icons.phone"
          :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.PHONE)"
          :help-text="t(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.PHONE)"
          @update:model-value="handleFieldUpdate('phone', $event)"
          @blur="validatePhone(localModel)"
        />
        
        <FormField
          name="label"
          :label="t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.JOB_TITLE)"
          :model-value="toStringOrEmpty(localModel.label)"
          :icon="icons.label"
          :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.JOB_TITLE)"
          :help-text="t(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.JOB_TITLE)"
          @update:model-value="handleFieldUpdate('label', $event)"
        />
        
        <FormField
          name="url"
          :label="t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.WEBSITE)"
          type="url"
          :model-value="toStringOrEmpty(localModel.url)"
          :error="validationState.errors.url"
          :warning="validationState.warnings.url"
          :icon="icons.url"
          :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.WEBSITE)"
          :help-text="t(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.WEBSITE)"
          @update:model-value="handleFieldUpdate('url', $event)"
          @blur="validateUrl(localModel)"
        />
        
        <FormField
          name="image"
          :label="t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.IMAGE)"
          :model-value="toStringOrEmpty(localModel.image)"
          :error="validationState.errors.image"
          :warning="validationState.warnings.image"
          :icon="icons.image"
          :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.IMAGE)"
          :help-text="t(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.IMAGE)"
          @update:model-value="handleFieldUpdate('image', $event)"
          @blur="validateImageUrl(localModel)"
        />
        
        <!-- Affichage des suggestions si des erreurs de validation -->
        <div v-if="validationState.errors.image || validationState.warnings.image" class="col-span-2 text-sm">
          <p class="text-amber-400 pb-2">{{ t(TRANSLATION_KEYS.RESUME.BASICS.IMAGE_SUGGESTIONS.TITLE) }}</p>
          <ul class="list-disc list-inside space-y-1 text-neutral-300">
            <li>{{ t(TRANSLATION_KEYS.RESUME.BASICS.IMAGE_SUGGESTIONS.USE_FULL_URL) }}</li>
            <li>{{ t(TRANSLATION_KEYS.RESUME.BASICS.IMAGE_SUGGESTIONS.CHECK_PUBLIC_ACCESS) }}</li>
            <li>{{ t(TRANSLATION_KEYS.RESUME.BASICS.IMAGE_SUGGESTIONS.USE_PROFESSIONAL_IMAGE) }}</li>
            <li>{{ t(TRANSLATION_KEYS.RESUME.BASICS.IMAGE_SUGGESTIONS.RECOMMENDED_FORMATS) }}</li>
          </ul>
        </div>
      </div>
      
      <div class="mt-6">
        <FormField
          name="summary"
          :label="t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.SUMMARY)"
          type="textarea"
          :model-value="toStringOrEmpty(localModel.summary)"
          :icon="icons.summary"
          :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.SUMMARY)"
          :help-text="t(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.SUMMARY)"
          @update:model-value="handleFieldUpdate('summary', $event)"
        />
      </div>
    </div>
    
    <!-- Section d'adresse -->
    <div class="mt-8 border-t border-neutral-700 pt-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">{{ t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.LOCATION) }}</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          name="address"
          :label="t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.ADDRESS)"
          :model-value="localModel.location?.address || ''"
          :icon="icons.location"
          :error="validationState.errors['location.address']"
          :warning="validationState.warnings['location.address']"
          :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.ADDRESS)"
          :help-text="t(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.ADDRESS)"
          @update:model-value="handleLocationUpdate('address', $event)"
          @blur="validateField(localModel, 'location.address')"
        />
        
        <FormField
          name="postalCode"
          :label="t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.POSTAL_CODE)"
          :model-value="localModel.location?.postalCode || ''"
          :error="validationState.errors['location.postalCode']"
          :warning="validationState.warnings['location.postalCode']"
          :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.POSTAL_CODE)"
          :help-text="t(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.POSTAL_CODE)"
          @update:model-value="handleLocationUpdate('postalCode', $event)"
          @blur="validateField(localModel, 'location.postalCode')"
        />
        
        <FormField
          name="city"
          :label="t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.CITY)"
          :model-value="localModel.location?.city || ''"
          :error="validationState.errors['location.city']"
          :warning="validationState.warnings['location.city']"
          :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.CITY)"
          :help-text="t(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.CITY)"
          @update:model-value="handleLocationUpdate('city', $event)"
          @blur="validateField(localModel, 'location.city')"
        />
        
        <FormField
          name="region"
          :label="t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.REGION)"
          :model-value="localModel.location?.region || ''"
          :error="validationState.errors['location.region']"
          :warning="validationState.warnings['location.region']"
          :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.REGION)"
          :help-text="t(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.REGION)"
          @update:model-value="handleLocationUpdate('region', $event)"
          @blur="validateField(localModel, 'location.region')"
        />
        
        <FormField
          name="countryCode"
          :label="t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.COUNTRY_CODE)"
          :model-value="localModel.location?.countryCode || ''"
          :error="validationState.errors['location.countryCode']"
          :warning="validationState.warnings['location.countryCode']"
          :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PLACEHOLDERS.COUNTRY_CODE)"
          :help-text="t(TRANSLATION_KEYS.RESUME.BASICS.HELP_TEXT.COUNTRY_CODE)"
          @update:model-value="handleLocationUpdate('countryCode', $event)"
          @blur="validateField(localModel, 'location.countryCode')"
        />
      </div>
      
      <!-- Affichage des suggestions pour l'adresse si des erreurs ou des warnings de validation -->
      <div v-if="validationState.errors['location.address'] || 
                validationState.errors['location.postalCode'] || 
                validationState.errors['location.city'] || 
                validationState.errors['location.countryCode'] ||
                validationState.warnings['location.address'] || 
                validationState.warnings['location.postalCode'] || 
                validationState.warnings['location.city'] || 
                validationState.warnings['location.countryCode']" 
           class="mt-4 p-3 bg-neutral-800 rounded-lg text-sm">
        <p class="text-amber-400 pb-2">{{ t(TRANSLATION_KEYS.RESUME.BASICS.ADDRESS_SUGGESTIONS.TITLE) }}</p>
        <ul class="list-disc list-inside space-y-1 text-neutral-300">
          <li>{{ t(TRANSLATION_KEYS.RESUME.BASICS.ADDRESS_SUGGESTIONS.COMPLETE_ADDRESS) }}</li>
          <li>{{ t(TRANSLATION_KEYS.RESUME.BASICS.ADDRESS_SUGGESTIONS.VALID_POSTAL_CODE) }}</li>
          <li>{{ t(TRANSLATION_KEYS.RESUME.BASICS.ADDRESS_SUGGESTIONS.OFFICIAL_CITY_NAME) }}</li>
          <li>{{ t(TRANSLATION_KEYS.RESUME.BASICS.ADDRESS_SUGGESTIONS.ISO_COUNTRY_CODE) }}</li>
        </ul>
      </div>
    </div>
    
    <!-- Section des profils -->
    <div class="mt-8 border-t border-neutral-700 pt-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">{{ t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.PROFILES) }}</h2>
      
      <!-- Liste des profils existants -->
      <div v-if="profiles.length > 0" class="mb-6 space-y-4">
        <div v-for="(profile, index) in profiles" :key="index" class="bg-neutral-800 p-4 rounded-lg">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center">
              <span class="text-lg font-medium">{{ profile.network }}</span>
              <span class="mx-2 text-neutral-400">•</span>
              <span class="text-neutral-300">{{ profile.username }}</span>
            </div>
            <button
              type="button"
              class="text-red-400 hover:text-red-300 transition-colors"
              @click="removeProfile(index)"
            >
              {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.REMOVE) }}
            </button>
          </div>
          <div v-if="profile.url" class="text-sm text-neutral-400">
            <a :href="profile.url" target="_blank" rel="noopener noreferrer" class="hover:text-blue-400 transition-colors">
              {{ profile.url }}
            </a>
          </div>
        </div>
      </div>
      
      <!-- Formulaire d'ajout de profil -->
      <div v-if="isAddingProfile" class="bg-neutral-800 p-4 rounded-lg mb-4">
        <h3 class="text-lg font-medium mb-3">{{ t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD) }} {{ t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.PROFILES) }}</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <FormField
            name="network"
            :label="t(TRANSLATION_KEYS.RESUME.BASICS.PROFILES.NETWORK)"
            :model-value="newProfile.network"
            :error="profileValidationErrors.network"
            :icon="icons.profile"
            :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PROFILES.NETWORK_PLACEHOLDER)"
            required
            @update:model-value="(value) => newProfile.network = value"
          />
          
          <FormField
            name="username"
            :label="t(TRANSLATION_KEYS.RESUME.BASICS.PROFILES.USERNAME)"
            :model-value="newProfile.username"
            :error="profileValidationErrors.username"
            :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PROFILES.USERNAME_PLACEHOLDER)"
            required
            @update:model-value="(value) => newProfile.username = value"
          />
          
          <FormField
            name="profileUrl"
            :label="t(TRANSLATION_KEYS.RESUME.BASICS.PROFILES.URL)"
            type="url"
            :model-value="newProfile.url"
            :error="profileValidationErrors.url"
            :placeholder="t(TRANSLATION_KEYS.RESUME.BASICS.PROFILES.URL_PLACEHOLDER)"
            class="sm:col-span-2"
            @update:model-value="(value) => newProfile.url = value"
          />
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 border border-neutral-600 rounded-md hover:bg-neutral-700 transition-colors"
            @click="toggleProfileForm"
          >
            {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.CANCEL) }}
          </button>
          <button
            type="button"
            class="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
            @click="() => addProfile()"
          >
            {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD) }}
          </button>
        </div>
      </div>
      
      <!-- Bouton pour afficher le formulaire d'ajout -->
      <button
        v-if="!isAddingProfile"
        type="button"
        class="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        @click="toggleProfileForm"
      >
        <span class="mr-2">+</span>
        {{ t(TRANSLATION_KEYS.COMMON.ACTIONS.ADD) }} {{ t(TRANSLATION_KEYS.RESUME.BASICS.LABELS.PROFILES) }}
      </button>
    </div>
  </Form>
</template>

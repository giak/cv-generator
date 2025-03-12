<script setup lang="ts">
import type { BasicsInterface, LocationInterface, ProfileInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useValidationResult } from '@ui/modules/cv/presentation/composables/validation/useValidationResult'
import { useValidationCatalogue } from '@ui/modules/cv/presentation/composables/validation/useValidationCatalogue'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { useCollectionField } from '@ui/modules/cv/presentation/composables/useCollectionField'
import { computed, ref, onMounted } from 'vue'
import { 
  type ValidationErrorInterface,
  type ResultType,
  ValidationLayerType,
  ERROR_CODES,
  createSuccess,
  createFailure,
  isSuccess,
  isFailure
} from '@cv-generator/shared'
// Remove BasicsValidationService direct import and use the composable
import { useBasicsFormValidation } from '../composables/useBasicsFormValidation'

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
  console.log('BasicsForm mounted in', perfMeasurements.renderTime, 'ms')
  
  // Clean up on component unmount
  return () => {
    console.log('BasicsForm Performance Metrics:', {
      profileOperations: perfMeasurements.profileOperations,
      validations: perfMeasurements.validations,
      renderTime: perfMeasurements.renderTime,
      // Include metrics from useFormModel
      ...perfMetrics,
      // Include metrics from useCollectionField if logging enabled
      ...(profilesFieldMetrics || {})
      // No validation metrics, removed to fix linter error
    })
  }
})

interface Props {
  modelValue: BasicsInterface
  loading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: BasicsInterface): void
  (e: 'validate'): void
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
  updateNestedField,
  perfMetrics
} = useFormModel<BasicsInterface>({
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
  validateForm,
  hasErrors,
  hasWarnings
} = useBasicsFormValidation()

// Handle field updates for top-level fields
const handleFieldUpdate = (field: keyof BasicsInterface, value: string) => {
  updateField(field, value)
}

// Handle updates for nested location fields
const handleLocationUpdate = (field: keyof LocationInterface, value: string) => {
  // Use type assertion to match existing implementation
  const updateFn = updateNestedField as any
  updateFn('location', field, value)
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
  lastValidationResult: profileValidationResult,
  addItem: addProfile,
  removeItem: removeProfile,
  toggleAddForm: toggleProfileForm,
  perfMetrics: profilesFieldMetrics
} = useCollectionField<ProfileInterface>({
  fieldName: 'profiles',
  updateField: updateProfilesField,
  collection: computed(() => localModel.profiles || []),
  defaultItemValues: defaultProfile,
  validateItem: validateProfile,
  enableLogging: process.env.NODE_ENV === 'development'
})

// Handle form submit
const handleSubmit = () => {
  console.log('Current model:', localModel)
  
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
  <Form @submit="handleSubmit">
    <!-- Section d'informations personnelles -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Informations personnelles</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          name="name"
          label="Nom complet"
          :model-value="localModel.name"
          :error="validationState.errors.name"
          :icon="icons.name"
          placeholder="Ex: Jean Dupont"
          help-text="Votre nom complet tel qu'il apparaîtra sur votre CV."
          required
          @update:model-value="handleFieldUpdate('name', $event)"
          @blur="validateName(localModel)"
        />
        
        <FormField
          name="email"
          label="Email"
          type="email"
          :model-value="localModel.email"
          :error="validationState.errors.email"
          :warning="validationState.warnings.email"
          :icon="icons.email"
          placeholder="Ex: jean.dupont@example.com"
          help-text="Votre adresse email professionnelle."
          required
          @update:model-value="handleFieldUpdate('email', $event)"
          @blur="validateEmail(localModel)"
        />
        
        <FormField
          name="phone"
          label="Téléphone"
          :model-value="localModel.phone"
          :error="validationState.errors.phone"
          :warning="validationState.warnings.phone"
          :icon="icons.phone"
          placeholder="Ex: +33612345678"
          help-text="Votre numéro de téléphone (format international recommandé)."
          @update:model-value="handleFieldUpdate('phone', $event)"
          @blur="validatePhone(localModel)"
        />
        
        <FormField
          name="label"
          label="Titre professionnel"
          :model-value="localModel.label"
          :icon="icons.label"
          placeholder="Ex: Développeur Web Senior"
          help-text="Votre titre professionnel actuel."
          @update:model-value="handleFieldUpdate('label', $event)"
        />
        
        <FormField
          name="url"
          label="Site Web"
          type="url"
          :model-value="localModel.url"
          :error="validationState.errors.url"
          :warning="validationState.warnings.url"
          :icon="icons.url"
          placeholder="Ex: https://jeandupont.com"
          help-text="URL de votre site web ou portfolio."
          @update:model-value="handleFieldUpdate('url', $event)"
          @blur="validateUrl(localModel)"
        />
        
        <FormField
          name="image"
          label="Photo de profil"
          :model-value="localModel.image"
          :error="validationState.errors.image"
          :warning="validationState.warnings.image"
          :icon="icons.image"
          placeholder="Ex: https://example.com/photo.jpg"
          help-text="URL de votre photo professionnelle."
          @update:model-value="handleFieldUpdate('image', $event)"
          @blur="validateImageUrl(localModel)"
        />
        
        <!-- Affichage des suggestions si des erreurs de validation -->
        <div v-if="validationState.errors.image || validationState.warnings.image" class="col-span-2 text-sm">
          <p class="text-amber-400 pb-2">Suggestions pour l'URL de l'image :</p>
          <ul class="list-disc list-inside space-y-1 text-neutral-300">
            <li>Utilisez une URL complète (commençant par http:// ou https://)</li>
            <li>Vérifiez que l'image est accessible publiquement</li>
            <li>Utilisez une image professionnelle et de bonne qualité</li>
            <li>Les formats recommandés sont JPEG, PNG ou WebP</li>
          </ul>
        </div>
      </div>
      
      <div class="mt-6">
        <FormField
          name="summary"
          label="Résumé professionnel"
          type="textarea"
          :model-value="localModel.summary"
          :icon="icons.summary"
          placeholder="Présentez-vous en quelques phrases..."
          help-text="Résumé concis de votre profil et objectifs professionnels."
          @update:model-value="handleFieldUpdate('summary', $event)"
        />
      </div>
    </div>
    
    <!-- Section d'adresse -->
    <div class="mt-8 border-t border-neutral-700 pt-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Adresse</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          name="address"
          label="Adresse"
          :model-value="localModel.location?.address || ''"
          :icon="icons.location"
          placeholder="Ex: 123 Rue de Paris"
          help-text="Votre adresse postale."
          @update:model-value="handleLocationUpdate('address', $event)"
        />
        
        <FormField
          name="postalCode"
          label="Code Postal"
          :model-value="localModel.location?.postalCode || ''"
          placeholder="Ex: 75001"
          help-text="Code postal de votre localité."
          @update:model-value="handleLocationUpdate('postalCode', $event)"
        />
        
        <FormField
          name="city"
          label="Ville"
          :model-value="localModel.location?.city || ''"
          placeholder="Ex: Paris"
          help-text="Nom de votre ville."
          @update:model-value="handleLocationUpdate('city', $event)"
        />
        
        <FormField
          name="region"
          label="Région"
          :model-value="localModel.location?.region || ''"
          placeholder="Ex: Île-de-France"
          help-text="Votre région ou département."
          @update:model-value="handleLocationUpdate('region', $event)"
        />
        
        <FormField
          name="countryCode"
          label="Code Pays"
          :model-value="localModel.location?.countryCode || ''"
          placeholder="Ex: FR"
          help-text="Code pays ISO (ex: FR, US, CA)."
          @update:model-value="handleLocationUpdate('countryCode', $event)"
        />
      </div>
    </div>
    
    <!-- Section pour les profils réseaux sociaux -->
    <div class="mt-8 border-t border-neutral-700 pt-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium">Profils réseaux sociaux</h3>
        <button 
          type="button"
          class="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-700 rounded text-white"
          @click="toggleProfileForm"
        >
          {{ isAddingProfile ? 'Annuler' : 'Ajouter un profil' }}
        </button>
      </div>
      
      <!-- Formulaire d'ajout de profil -->
      <div v-if="isAddingProfile" class="bg-neutral-800 p-4 rounded-lg mb-4">
        <h4 class="text-md font-medium mb-3">Nouveau profil</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            name="profileNetwork"
            label="Réseau"
            v-model="newProfile.network"
            :icon="icons.profile"
            placeholder="Ex: LinkedIn"
            help-text="Nom du réseau social."
            :error="profileValidationErrors.network"
            required
          />
          
          <FormField
            name="profileUsername"
            label="Nom d'utilisateur"
            v-model="newProfile.username"
            placeholder="Ex: jeandupont"
            help-text="Votre identifiant sur ce réseau."
            :error="profileValidationErrors.username"
            required
          />
          
          <FormField
            name="profileUrl"
            label="URL"
            type="url"
            v-model="newProfile.url"
            :icon="icons.url"
            placeholder="Ex: https://linkedin.com/in/jeandupont"
            help-text="Lien vers votre profil."
          />
        </div>
        <div class="mt-3 flex justify-end">
          <button 
            type="button"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
            @click="addProfile()"
          >
            Ajouter
          </button>
        </div>
      </div>
      
      <!-- Liste des profils existants -->
      <div v-if="profiles.length > 0" class="space-y-3">
        <div 
          v-for="(profile, index) in profiles" 
          :key="`profile-${index}`"
          class="bg-neutral-900 p-3 rounded-lg flex justify-between items-center"
        >
          <div>
            <span class="font-medium">{{ profile.network }}</span>
            <span class="text-neutral-400 ml-2">@{{ profile.username }}</span>
            <a 
              v-if="profile.url" 
              :href="profile.url" 
              target="_blank" 
              class="ml-2 text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Voir le profil
            </a>
          </div>
          <button 
            type="button" 
            class="text-red-500 hover:text-red-400"
            @click="removeProfile(index)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Message si aucun profil -->
      <div v-else-if="!isAddingProfile" class="text-neutral-400 text-sm">
        Aucun profil social ajouté. Cliquez sur "Ajouter un profil" pour en créer un.
      </div>
    </div>
  </Form>
</template> 
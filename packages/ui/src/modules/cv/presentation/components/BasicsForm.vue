<script setup lang="ts">
import type { BasicsInterface, LocationInterface, ProfileInterface } from '@cv-generator/shared/src/types/resume.interface'
import Form from '@ui/components/shared/form/Form.vue'
import FormField from '@ui/components/shared/form/FormField.vue'
import { useFieldValidation as useCVFieldValidation } from '@ui/modules/cv/presentation/composables/useCVFieldValidation'
import { useFormModel } from '@ui/modules/cv/presentation/composables/useFormModel'
import { computed, ref, onMounted } from 'vue'

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
      ...perfMetrics
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

// Handle field updates for top-level fields
const handleFieldUpdate = (field: keyof BasicsInterface, value: string) => {
  if (field === 'image') {
    console.log('Updating image URL specific field:', value)
  }
  
  updateField(field, value)
}

// Handle location updates
const handleLocationUpdate = (field: keyof LocationInterface, value: string) => {
  if (field === 'countryCode') {
    console.log('Updating countryCode specific field:', value)
  }
  
  // Use type assertions to bypass TypeScript's type checking
  // This is safe because we know the structure of our data
  const updateFn = updateNestedField as any
  updateFn('location', field, value)
}

// Gestionnaire des profils
const newProfile = ref<ProfileInterface>({
  network: '',
  username: '',
  url: ''
})

const isAddingProfile = ref(false)

const toggleProfileForm = () => {
  isAddingProfile.value = !isAddingProfile.value
  
  // Reset du formulaire à la fermeture
  if (!isAddingProfile.value) {
    newProfile.value = {
      network: '',
      username: '',
      url: ''
    }
  }
}

const addProfile = () => {
  const opStart = performance.now()
  // Valider les champs du profil
  if (!newProfile.value.network || !newProfile.value.username) {
    return // Ne pas ajouter de profils incomplets
  }
  
  // Créer une copie du nouveau profil
  const profileToAdd = { ...newProfile.value }
  console.log('Adding profile:', JSON.stringify(profileToAdd))
  
  // Ajouter le profil au modèle local
  const updatedProfiles = [...(localModel.profiles || []), profileToAdd]
  updateField('profiles', updatedProfiles)
  
  // Reset et fermer le formulaire
  newProfile.value = {
    network: '',
    username: '',
    url: ''
  }
  isAddingProfile.value = false
  
  perfMeasurements.profileOperations++
  console.log(`Profile add operation took ${performance.now() - opStart}ms (total: ${perfMeasurements.profileOperations})`)
}

const removeProfile = (index: number) => {
  console.log(`Removing profile at index ${index}`)
  
  // Create a new array without the profile at the specified index
  const updatedProfiles = [...(localModel.profiles || [])]
  updatedProfiles.splice(index, 1)
  
  // Update the profiles field
  updateField('profiles', updatedProfiles)
}

// Valider le formulaire avant d'émettre l'événement de validation
const { errors, validateField, validateForm } = useCVFieldValidation()

const handleSubmit = async () => {
  const validationStart = performance.now()
  console.log('Form submission - Current model:', JSON.stringify(localModel))
  
  // Valider tous les champs
  const formIsValid = validateForm(localModel)
  console.log('Form validation result:', formIsValid)
  
  if (formIsValid) {
    // Vérifier que les champs obligatoires sont présents
    if (!localModel.name || !localModel.email) {
      console.error('Required fields missing:', {
        name: !localModel.name,
        email: !localModel.email
      })
      return
    }
    
    emit('validate')
  }
  
  perfMeasurements.validations++
  console.log(`Form validation took ${performance.now() - validationStart}ms (total: ${perfMeasurements.validations})`)
}

// Icônes SVG pour les champs
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
    :loading="loading"
    title="Informations personnelles"
    subtitle="Complétez vos informations pour créer un CV professionnel."
    @submit="handleSubmit"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        name="name"
        label="Nom complet"
        :model-value="localModel.name || ''"
        :error="errors.name"
        :icon="icons.name"
        placeholder="Ex: Jean Dupont"
        help-text="Votre nom et prénom comme ils apparaîtront sur votre CV."
        required
        @update:model-value="handleFieldUpdate('name', $event)"
        @blur="validateField('name', localModel.name || '')"
      />

      <FormField
        name="email"
        type="email"
        label="Adresse email"
        :model-value="localModel.email || ''"
        :error="errors.email"
        :icon="icons.email"
        placeholder="Ex: jean.dupont@example.com"
        help-text="Email professionnel pour les employeurs potentiels."
        required
        @update:model-value="handleFieldUpdate('email', $event)"
        @blur="validateField('email', localModel.email || '')"
      />

      <FormField
        name="phone"
        type="tel"
        label="Téléphone"
        :model-value="localModel.phone || ''"
        :error="errors.phone"
        :icon="icons.phone"
        placeholder="Ex: 0612345678"
        help-text="Numéro de téléphone où vous êtes joignable."
        @update:model-value="handleFieldUpdate('phone', $event)"
        @blur="validateField('phone', localModel.phone || '')"
      />

      <FormField
        name="label"
        label="Titre professionnel"
        :model-value="localModel.label || ''"
        :icon="icons.label"
        placeholder="Ex: Développeur Web Senior"
        help-text="Votre position ou titre actuel."
        @update:model-value="handleFieldUpdate('label', $event)"
      />
      
      <div class="col-span-1 md:col-span-2">
        <FormField
          name="url"
          type="url"
          label="Site Web"
          :model-value="localModel.url || ''"
          :error="errors.url"
          :icon="icons.url"
          placeholder="Ex: https://monportfolio.com"
          help-text="URL de votre portfolio ou site personnel (optionnel)."
          @update:model-value="handleFieldUpdate('url', $event)"
          @blur="validateField('url', localModel.url || '')"
        />
      </div>

      <div class="col-span-1 md:col-span-2">
        <FormField
          name="image"
          type="url"
          label="Photo (URL)"
          :model-value="localModel.image || ''"
          :error="errors.image"
          :icon="icons.image"
          placeholder="Ex: https://example.com/photo.jpg"
          help-text="URL de votre photo professionnelle (optionnel)."
          @update:model-value="handleFieldUpdate('image', $event)"
          @blur="validateField('image', localModel.image || '')"
        />
      </div>

      <div class="col-span-1 md:col-span-2">
        <FormField
          name="summary"
          type="text"
          label="Résumé professionnel"
          :model-value="localModel.summary || ''"
          :error="errors.summary"
          :icon="icons.summary"
          placeholder="Ex: Développeur Web passionné avec 5 ans d'expérience..."
          help-text="Brève description de votre parcours et objectifs professionnels."
          rows="4"
          @update:model-value="handleFieldUpdate('summary', $event)"
        />
      </div>
    </div>
    
    <!-- Section pour l'adresse -->
    <div class="mt-8 border-t border-neutral-700 pt-6">
      <h3 class="text-lg font-medium mb-4">Adresse</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          name="address"
          label="Adresse"
          :model-value="localModel.location?.address || ''"
          :icon="icons.location"
          placeholder="Ex: 15 rue de Paris"
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
            required
          />
          
          <FormField
            name="profileUsername"
            label="Nom d'utilisateur"
            v-model="newProfile.username"
            placeholder="Ex: jeandupont"
            help-text="Votre identifiant sur ce réseau."
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
            @click="addProfile"
          >
            Ajouter
          </button>
        </div>
      </div>
      
      <!-- Liste des profils existants -->
      <div v-if="localModel.profiles && localModel.profiles.length > 0" class="space-y-3">
        <div 
          v-for="(profile, index) in localModel.profiles" 
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
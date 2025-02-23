<script setup lang="ts">
import { useResumeStore } from '@ui/modules/cv/presentation/stores/resume'
import BasicsForm from '@ui/modules/cv/presentation/components/BasicsForm.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { Resume } from '@cv-generator/core'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'

const store = useResumeStore()

// Créer un CV vide par défaut avec reactive pour une meilleure gestion de l'état
const basics = reactive<BasicsInterface>({
  name: '',
  email: '',
  label: '',
  phone: '',
  url: '',
  summary: '',
  location: {
    address: '',
    postalCode: '',
    city: '',
    region: ''
  },
  profiles: []
})

// Charger le CV au montage du composant
onMounted(async () => {
  await store.loadResume()
  // Initialiser basics avec les données du store
  if (store.resume?.basics) {
    const storeBasics = store.resume.basics
    console.log('Loading data from store:', storeBasics)
    Object.assign(basics, {
      name: storeBasics.name ?? '',
      email: storeBasics.email ?? '',
      label: storeBasics.label ?? '',
      phone: storeBasics.phone ?? '',
      url: storeBasics.url ?? '',
      summary: storeBasics.summary ?? '',
      location: storeBasics.location ?? {
        address: '',
        postalCode: '',
        city: '',
        region: ''
      },
      profiles: storeBasics.profiles ?? []
    })
    console.log('Loaded data into basics:', basics)
  }
})

// Gérer la mise à jour du formulaire
const handleBasicsUpdate = (value: BasicsInterface) => {
  console.log('=== UI Layer - Basics Update ===')
  console.log('Received update:', value)
  
  // Mettre à jour le modèle directement
  basics.name = value.name || ''
  basics.email = value.email || ''
  basics.label = value.label || ''
  basics.phone = value.phone || ''
  basics.url = value.url || ''
  basics.summary = value.summary || ''
  
  // Mettre à jour location
  if (value.location) {
    basics.location.address = value.location.address || ''
    basics.location.postalCode = value.location.postalCode || ''
    basics.location.city = value.location.city || ''
    basics.location.region = value.location.region || ''
  }
  
  // Mettre à jour profiles
  basics.profiles = [...(value.profiles || [])]
  
  console.log('Updated basics:', JSON.parse(JSON.stringify(basics)))
}

// Gérer la sauvegarde du formulaire
const handleValidate = async () => {
  try {
    console.log('=== UI Layer - Form Submission ===')
    console.log('Current basics state:', JSON.parse(JSON.stringify(basics)))
    
    // Créer les données du CV
    const resumeData = {
      basics: {
        ...basics,
        location: { ...basics.location },
        profiles: [...basics.profiles]
      }
    }
    console.log('Complete resume data to save:', resumeData)

    // Sauvegarder les données du CV
    await store.saveResume(resumeData)
    console.log('CV sauvegardé avec succès dans App.vue')
  } catch (error) {
    console.error('Erreur dans App.vue lors de la sauvegarde:', error)
  }
}

// Log changes to basics
watch(basics, (newValue) => {
  console.log('Basics updated:', JSON.parse(JSON.stringify(newValue)))
}, { deep: true })
</script>

<template>
  <div class="min-h-screen bg-[var(--color-neutral-50)]">
    <header class="container mx-auto p-6">
      <h1 class="text-4xl font-bold text-[var(--color-primary-500)]">
        CV Generator
      </h1>
      <p class="mt-2 text-lg text-[var(--color-neutral-600)]">
        Build your professional CV
      </p>
    </header>

    <main class="container mx-auto p-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-2xl font-semibold mb-6">Informations de base</h2>
        <BasicsForm
          v-model="basics"
          :loading="store.loading"
          @update:modelValue="handleBasicsUpdate"
          @validate="handleValidate"
        />
      </div>

      <!-- Afficher les erreurs s'il y en a -->
      <div 
        v-if="store.error"
        class="mt-4 p-4 bg-red-50 text-red-700 rounded-lg"
      >
        {{ store.error.message }}
      </div>
    </main>
  </div>
</template> 
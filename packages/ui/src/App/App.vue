<!-- App.vue -->
<script setup lang="ts">
import { useResumeStore } from '@ui/modules/cv/presentation/stores/resume'
import BasicsForm from '@ui/modules/cv/presentation/components/BasicsForm.vue'
import { onMounted, reactive, ref } from 'vue'
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
  location: undefined,
  profiles: []
})

// Charger le CV au montage du composant
onMounted(async () => {
  await store.loadResume()
  // Initialiser basics avec les données du store
  if (store.resume?.basics) {
    const storeBasics = store.resume.basics
    Object.assign(basics, {
      name: storeBasics.name ?? '',
      email: storeBasics.email ?? '',
      label: storeBasics.label ?? '',
      phone: storeBasics.phone ?? '',
      url: storeBasics.url ?? '',
      summary: storeBasics.summary ?? '',
      location: storeBasics.location,
      profiles: storeBasics.profiles ?? []
    })
  }
})

// Gérer la sauvegarde du formulaire
const handleValidate = async () => {
  const resumeData = store.resume 
    ? { ...store.resume.toJSON(), basics }
    : { basics }

  const result = Resume.create(resumeData)
  if (result.isValid && result.resume) {
    await store.saveResume(result.resume)
  }
}
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
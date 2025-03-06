<!-- 
  ProgressIndicator.vue
  
  Un composant qui affiche l'état de progression des formulaires CV
  Utilise le composable useFormProgress pour obtenir le statut de complétion des sections
  Modernisé avec Tailwind CSS pour une meilleure cohérence visuelle
-->

<template>
  <div class="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/50 p-6 my-8">
    <h3 class="text-lg font-semibold text-white flex justify-between items-center mb-4">
      {{ t('progressIndicator.title', 'Progression du CV') }}
      <span class="font-bold text-primary-400">{{ overallProgress }}%</span>
    </h3>
    
    <div class="h-2 bg-neutral-800 rounded-full overflow-hidden mb-4">
      <div 
        class="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out"
        :style="{ width: `${overallProgress}%` }"
      ></div>
    </div>
    
    <div class="mb-4">
      <p class="text-sm text-neutral-400">
        {{ t('progressIndicator.requiredSections', 'Sections requises: {completed}/{total}', { completed: requiredSectionsCompletion.completed, total: requiredSectionsCompletion.total }) }}
      </p>
    </div>
    
    <div class="flex flex-col space-y-2">
      <div 
        v-for="section in sectionStatuses" 
        :key="section.id"
        :class="[
          'rounded-md transition-colors duration-200',
          section.isComplete ? 'bg-neutral-800/30' : '',
          section.isPartial ? 'bg-neutral-800/20' : '',
          section.isRequired ? 'border-l-2 border-primary-700' : '',
          'hover:bg-neutral-800/50'
        ]"
      >
        <a :href="section.path" class="flex items-center p-3 text-neutral-200 hover:text-white">
          <span class="flex items-center justify-center w-6 h-6 mr-3">
            <span 
              v-if="section.isComplete" 
              class="text-success-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>
            <span 
              v-else-if="section.isPartial" 
              class="text-warning-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </span>
            <span 
              v-else 
              class="text-neutral-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </span>
          </span>
          <span class="flex-1 font-medium">
            {{ section.label }}
            <span v-if="section.isRequired" class="text-error-400 ml-1">*</span>
          </span>
          <span 
            v-if="!section.isComplete && section.progress > 0"
            class="px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded-full text-xs"
          >
            {{ section.progress }}%
          </span>
          <span 
            v-if="isNextToComplete(section.id)" 
            class="ml-2 px-2 py-0.5 bg-primary-800/30 text-primary-300 rounded-full text-xs whitespace-nowrap"
          >
            {{ t('progressIndicator.nextToComplete', 'Suivant') }}
          </span>
        </a>
      </div>
    </div>
    
    <div v-if="nextIncompleteSection" class="mt-6 flex justify-center">
      <a 
        :href="nextIncompleteSection.path" 
        class="inline-flex items-center px-4 py-2.5 bg-primary-700/20 hover:bg-primary-700/30 text-primary-300 rounded-md border border-primary-700/40 transition-all duration-200 group"
      >
        <span class="text-sm font-medium">
          {{ t('progressIndicator.continueWith', 'Continuer avec') }} {{ nextIncompleteSection.label }}
        </span>
        <span class="flex items-center justify-center ml-2 text-lg transition-transform duration-200 group-hover:translate-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormProgress } from '../../modules/cv/presentation/composables/useFormProgress'

// Fonction simple de traduction (à remplacer par vue-i18n quand disponible)
const t = (key: string, defaultValue: string, params?: Record<string, any>) => {
  if (!params) return defaultValue
  
  // Remplacer les paramètres dans le texte
  let result = defaultValue
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`{${key}}`, String(value))
  }
  
  return result
}

// Initialisation du composable de suivi de progression
const { 
  sectionStatuses, 
  requiredSectionsCompletion, 
  overallProgress, 
  isNextToComplete,
  findNextIncompleteSection
} = useFormProgress()

// Section suivante incomplète
const nextIncompleteSection = findNextIncompleteSection
</script> 
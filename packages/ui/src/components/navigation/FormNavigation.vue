<!-- 
  FormNavigation.vue
  
  Composant de navigation pour les formulaires du CV
  Permet de naviguer facilement entre les sections précédentes et suivantes
  Amélioré avec Tailwind CSS pour une meilleure expérience utilisateur
-->

<template>
  <!-- Ligne de séparation horizontale -->
  <div class="border-t border-neutral-800 pt-4 mt-8 mb-6">
    <!-- Navigation sur une seule ligne avec tous les éléments alignés -->
    <div class="flex items-center justify-between">
      <!-- Navigation buttons container - gauche -->
      <div class="flex items-center gap-4">
        <!-- Previous section button -->
        <button 
          v-if="prevSection" 
          class="inline-flex items-center px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md border border-neutral-700 transition-all duration-200 group"
          :aria-label="t('navigation.previousSection', 'Section précédente')"
          @click="navigateTo(prevSection.path)"
        >
          <span class="flex items-center justify-center mr-2 text-lg text-primary-400 transition-transform duration-200 group-hover:-translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5"></path>
              <path d="M12 19l-7-7 7-7"></path>
            </svg>
          </span>
          <span class="text-sm font-medium">
            {{ prevSection.label }}
          </span>
        </button>
      
        <!-- Empty placeholder if no previous section -->
        <div v-else class="flex-1 min-w-[40px]"></div>
      </div>
      
      <!-- Section completion status indicator - centre -->
      <div v-if="showCompletion" class="mx-4">
        <div 
          v-if="sectionComplete" 
          class="inline-flex items-center px-3 py-1.5 bg-success-500/15 text-success-400 rounded-full text-sm"
        >
          <span class="flex items-center justify-center mr-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5"></path>
            </svg>
          </span>
          <span>{{ t('navigation.sectionComplete', 'Section complète') }}</span>
        </div>
        
        <div 
          v-else-if="sectionPartial" 
          class="inline-flex items-center px-3 py-1.5 bg-warning-500/15 text-warning-400 rounded-full text-sm"
        >
          <span class="flex items-center justify-center mr-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </span>
          <span>{{ t('navigation.sectionPartial', 'Section partiellement complète') }}</span>
        </div>
        
        <div  
          v-else 
          class="inline-flex items-center px-3 py-1.5 bg-neutral-800 text-neutral-400 rounded-full text-sm"
        >
          <span class="flex items-center justify-center mr-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </span>
          <span>{{ t('navigation.sectionIncomplete', 'Section incomplète') }}</span>
        </div>
      </div>
      
      <!-- Navigation buttons container - droite -->
      <div class="flex items-center gap-4">
        <!-- Next section button -->
        <button 
          v-if="nextSection" 
          class="inline-flex items-center px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md border border-neutral-700 transition-all duration-200 group"
          :aria-label="t('navigation.nextSection', 'Section suivante')"
          @click="navigateTo(nextSection.path)"
        >
          <span class="text-sm font-medium">
            {{ nextSection.label }}
          </span>
          <span class="flex items-center justify-center ml-2 text-lg text-primary-400 transition-transform duration-200 group-hover:translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </span>
        </button>
      
        <!-- Next incomplete section button with special styling -->
        <button 
          v-else-if="nextIncompleteSection"
          class="inline-flex items-center px-4 py-2.5 bg-primary-700/20 hover:bg-primary-700/30 text-primary-300 rounded-md border border-primary-700/40 transition-all duration-200 group"
          :aria-label="t('navigation.nextIncompleteSection', 'Prochaine section incomplète')"
          @click="navigateTo(nextIncompleteSection.path)"
        >
          <span class="text-sm font-medium">
            {{ t('navigation.continueWith', 'Continuer avec') }} {{ nextIncompleteSection.label }}
          </span>
          <span class="flex items-center justify-center ml-2 text-lg transition-transform duration-200 group-hover:translate-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </span>
        </button>
      
        <!-- Empty placeholder if no next section -->
        <div v-else class="flex-1 min-w-[40px]"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormProgress } from '../../modules/cv/presentation/composables/useFormProgress'

const props = defineProps({
  currentSection: {
    type: String,
    required: true
  },
  showCompletion: {
    type: Boolean,
    default: true
  }
})

// Définition des événements émis
const emit = defineEmits(['navigate'])

// Initialisation du composable de suivi de progression
const { 
  sectionStatuses, 
  getNavigationSections,
  findNextIncompleteSection
} = useFormProgress()

// Utiliser l'identifiant de section du prop
const sectionId = computed(() => {
  return props.currentSection
})

// Obtenir les sections précédente et suivante
const navigationSections = computed(() => {
  return getNavigationSections(sectionId.value)
})

const prevSection = computed(() => navigationSections.value.prev)
const nextSection = computed(() => navigationSections.value.next)

// Section suivante incomplète
const nextIncompleteSection = findNextIncompleteSection

// Statut de complétion de la section actuelle
const currentSectionStatus = computed(() => {
  return sectionStatuses.value.find(section => section.id === sectionId.value)
})

const sectionComplete = computed(() => {
  return currentSectionStatus.value?.isComplete || false
})

const sectionPartial = computed(() => {
  return currentSectionStatus.value?.isPartial || false
})

// Méthodes de traduction (utilisant les textes en dur pour simplifier)
const t = (key: string, defaultValue: string) => defaultValue

// Fonction de navigation
const navigateTo = (path: string) => {
  if (!path) return
  
  // Si le chemin commence par "/", le transformer en ID de section
  // ex: "/basics" devient "basics"
  const sectionId = path.startsWith('/') ? path.substring(1) : path
  
  // Émettre l'événement de navigation avec l'ID de section
  emit('navigate', sectionId)
}
</script> 
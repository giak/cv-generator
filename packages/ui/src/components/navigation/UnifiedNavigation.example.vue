<!-- 
  UnifiedNavigation.example.vue
  
  Exemple d'utilisation du composant UnifiedNavigation.
  Montre comment intégrer le composant dans un parent et gérer les événements de navigation.
-->

<template>
  <div class="p-6 bg-neutral-900 min-h-screen">
    <div class="max-w-screen-xl mx-auto grid grid-cols-12 gap-6">
      <!-- Sidebar avec navigation -->
      <div class="col-span-12 md:col-span-3">
        <h2 class="text-xl font-bold text-white mb-4">Votre CV</h2>
        
        <!-- Utilisation du composant UnifiedNavigation -->
        <UnifiedNavigation 
          :current-section="currentSection"
          @navigate="handleNavigation"
        >
          <!-- Exemple de slot pour personnaliser une icône spécifique -->
          <template #icon-basics>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </template>
        </UnifiedNavigation>
      </div>
      
      <!-- Contenu principal -->
      <div class="col-span-12 md:col-span-9">
        <div class="bg-neutral-800 p-6 rounded-lg text-white">
          <h2 class="text-2xl font-bold mb-4">
            {{ getCurrentSectionTitle() }}
          </h2>
          
          <p class="text-neutral-300 mb-6">
            Section actuelle: {{ currentSection }}
          </p>
          
          <div class="bg-neutral-700 p-4 rounded-md">
            <p class="text-sm text-neutral-300">
              Événements de navigation:
            </p>
            <ul class="mt-2 space-y-1 text-sm">
              <li 
                v-for="(event, index) in navigationEvents" 
                :key="index"
                class="text-neutral-400"
              >
                {{ event }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { UnifiedNavigation } from '.'

// État pour suivre la section actuelle
const currentSection = ref('basics')

// Journal des événements de navigation pour démonstration
const navigationEvents = ref<string[]>([])

/**
 * Gère les événements de navigation
 * @param path Chemin vers lequel naviguer
 */
const handleNavigation = (path: string) => {
  // Pour l'exemple, on extrait l'ID de section du chemin
  // Dans une vraie application, vous utiliseriez probablement vue-router ici
  const sectionId = path.replace('#', '')
  
  // Enregistrer l'événement dans le journal
  navigationEvents.value.push(`Navigation vers ${path} (${new Date().toLocaleTimeString()})`)
  
  // Mettre à jour la section actuelle
  currentSection.value = sectionId
}

/**
 * Récupère le titre de la section actuelle
 */
const getCurrentSectionTitle = () => {
  const titles: Record<string, string> = {
    basics: 'Informations de base',
    work: 'Expérience professionnelle',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    projects: 'Projets',
    // Ajoutez d'autres sections ici
  }
  
  return titles[currentSection.value] || 'Section inconnue'
}
</script> 
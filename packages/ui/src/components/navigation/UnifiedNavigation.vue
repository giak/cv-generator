<!-- 
  UnifiedNavigation.vue
  
  Composant unifié de navigation pour les formulaires du CV
  Combine les fonctionnalités de NavMenu.vue et CVNavigation.vue:
  - Émission d'événements pour la navigation (de NavMenu)
  - Support avancé des icônes avec slots, props et fallback (de NavMenu)
  - Indicateurs de progression et de statut des sections (de CVNavigation)
  - Compatibilité avec le composable useFormProgress (de CVNavigation)
-->

<template>
  <div class="rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/50">
    <!-- En-tête avec la progression globale -->
    <div class="p-4 bg-neutral-800/50 border-b border-neutral-700">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-sm font-medium text-neutral-200">{{ t('navigation.progress', 'Progression du CV') }}</h3>
        <span class="text-sm font-bold text-primary-400">{{ overallProgress }}%</span>
      </div>
      
      <!-- Barre de progression -->
      <div class="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
        <div 
          class="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${overallProgress}%` }"
        ></div>
      </div>

      <!-- Sections requises -->
      <div class="mt-2 text-xs text-neutral-400">
        <span>{{ t('navigation.requiredSections', 'Sections requises') }} : </span>
        <span class="font-medium text-primary-300">
          {{ requiredSectionsCompletion.completed }}/{{ requiredSectionsCompletion.total }}
        </span>
      </div>
    </div>
    
    <!-- Liste des sections -->
    <div class="py-2">
      <div 
        v-for="section in sectionStatuses" 
        :key="section.id"
        class="relative"
      >
        <div 
          class="group flex items-center px-4 py-3 w-full text-sm transition-colors duration-200 cursor-pointer hover:bg-neutral-800/40"
          :class="[
            currentSection === section.id ? 'bg-primary-900/30 text-primary-300' : 'text-neutral-300 hover:text-white',
            section.isComplete ? 'font-medium' : '',
          ]"
          @click="navigate(section.path)"
          :data-test="`nav-item-${section.id}`"
        >
          <!-- Indicateur d'état (cercle coloré) -->
          <span 
            :class="[
              'flex-shrink-0 w-5 h-5 rounded-full mr-3 flex items-center justify-center',
              section.isComplete ? 'bg-success-500/15 text-success-400' : 
                section.isPartial ? 'bg-warning-500/15 text-warning-400' : 
                  'bg-neutral-800 text-neutral-500'
            ]"
          >
            <svg v-if="section.isComplete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg v-else-if="section.isPartial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </span>
          
          <!-- Icône de la section (système à 3 niveaux) -->
          <span class="flex-shrink-0 w-5 h-5 mr-3 text-neutral-400 flex items-center justify-center" :class="{ 'text-primary-400': currentSection === section.id }">
            <!-- 1. Si un slot d'icône est fourni -->
            <slot :name="`icon-${section.id}`" v-if="$slots[`icon-${section.id}`]"></slot>
            
            <!-- 2. Si une icône SVG personnalisée est fournie via props -->
            <span v-else-if="section.icon && typeof section.icon === 'string' && section.icon.startsWith('<svg')" v-html="section.icon"></span>
            
            <!-- 3. Si un nom d'icône est fourni (Feather) -->
            <component :is="getIconComponent(section.icon)" v-else-if="section.icon" class="w-4 h-4" />
            
            <!-- 4. Utiliser des icônes prédéfinies basées sur l'ID de section -->
            <component :is="getIconComponent(section.id)" v-else-if="isKnownSection(section.id)" class="w-4 h-4" />
            
            <!-- 5. Icône par défaut (fallback) -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
            </svg>
          </span>
          
          <!-- Libellé de section -->
          <span class="flex-1 truncate">
            {{ section.label }}
            <span v-if="section.isRequired" class="text-error-400 ml-0.5">*</span>
          </span>
          
          <!-- Badge de progression (si partiel) -->
          <span 
            v-if="!section.isComplete && section.progress > 0" 
            class="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-neutral-800 text-neutral-400"
          >
            {{ section.progress }}%
          </span>
          
          <!-- Indicateur "Suivant" pour la section recommandée -->
          <span 
            v-if="isNextToComplete(section.id)"
            class="ml-2 px-1.5 py-0.5 rounded-full text-xs bg-primary-800/50 text-primary-300 font-medium"
          >
            {{ t('navigation.next', 'Suivant') }}
          </span>
          
          <!-- Fleche navigation -->
          <svg 
            class="ml-2 w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-transform duration-200 group-hover:translate-x-0.5"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Actions de navigation -->
    <div v-if="nextIncompleteSection" class="p-4 border-t border-neutral-800">
      <div 
        class="flex items-center justify-center w-full px-4 py-3 bg-primary-700/20 hover:bg-primary-700/30 text-primary-300 rounded-md border border-primary-700/40 transition-all duration-200 group text-sm font-medium cursor-pointer"
        @click="navigate(nextIncompleteSection.path)"
      >
        <span>
          {{ t('navigation.continueWith', 'Continuer avec') }} {{ nextIncompleteSection.label }}
        </span>
        <span class="flex items-center justify-center ml-2 transition-transform duration-200 group-hover:translate-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw, h } from 'vue';
import { useFormProgress } from '../../modules/cv/presentation/composables/useFormProgress';

// Définition des props et événements
interface Props {
  /** Identifiant de la section active */
  currentSection?: string;
  
  /** Afficher ou masquer les indicateurs de progression */
  showProgress?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currentSection: '',
  showProgress: true
})

// Définition des événements émis
const emit = defineEmits<{
  (e: 'navigate', path: string): void
}>()

// Initialisation du composable de suivi de progression
const { 
  sectionStatuses, 
  requiredSectionsCompletion, 
  overallProgress, 
  isNextToComplete,
  findNextIncompleteSection
} = useFormProgress()

// Section suivante incomplète
const nextIncompleteSection = computed(() => findNextIncompleteSection.value)

// Fonction de navigation
const navigate = (path: string) => {
  if (path) {
    // Émettre l'événement de navigation avec le chemin
    emit('navigate', path)
  }
}

// Vérifie si l'ID de section est connu
const isKnownSection = (sectionId: string): boolean => {
  return [
    'basics', 'work', 'education', 'skills', 'languages', 
    'projects', 'volunteer', 'publications', 'certificates', 
    'awards', 'interests', 'references'
  ].includes(sectionId)
}

// Définition des icônes SVG pour chaque type d'icône ou section
const getIconComponent = (iconNameOrSectionId: string | undefined) => {
  if (!iconNameOrSectionId) return null
  
  // Mappage de noms d'icônes à des composants
  const iconMap: Record<string, any> = {
    // Icônes de section
    basics: UserIcon,
    work: BriefcaseIcon,
    education: AcademicCapIcon,
    skills: CheckCircleIcon,
    languages: GlobeIcon,
    projects: StarIcon,
    volunteer: HeartIcon,
    publications: BookOpenIcon,
    certificates: CertificateIcon,
    awards: TrophyIcon,
    interests: SmileIcon,
    references: UsersIcon,
    
    // Noms d'icônes génériques
    user: UserIcon,
    briefcase: BriefcaseIcon,
    'graduation-cap': AcademicCapIcon,
    code: CodeIcon,
    globe: GlobeIcon,
    folder: FolderIcon,
    heart: HeartIcon,
    book: BookOpenIcon,
    award: AwardIcon,
    trophy: TrophyIcon,
    certificate: CertificateIcon,
    star: StarIcon,
    smile: SmileIcon,
    users: UsersIcon
  }
  
  return iconMap[iconNameOrSectionId] || null
}

// Définition des composants d'icônes inline SVG
// Vous pouvez également utiliser une bibliothèque comme @heroicons/vue si disponible

const UserIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '12', cy: '7', r: '4' })
    ])
  }
})

const BriefcaseIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('rect', { x: '2', y: '7', width: '20', height: '14', rx: '2', ry: '2' }),
      h('path', { d: 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' })
    ])
  }
})

const AcademicCapIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M12 2L2 7l10 5 10-5-10-5z' }),
      h('path', { d: 'M2 17l10 5 10-5' }),
      h('path', { d: 'M2 12l10 5 10-5' })
    ])
  }
})

const CheckCircleIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
      h('polyline', { points: '22 4 12 14.01 9 11.01' })
    ])
  }
})

const GlobeIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M2 12h20M12 2v20M4.5 9.5h3M16.5 9.5h3M5.5 14.5h4M14.5 14.5h4' })
    ])
  }
})

const StarIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' })
    ])
  }
})

const HeartIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' })
    ])
  }
})


const AwardIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('circle', { cx: '12', cy: '8', r: '7' }),
      h('polyline', { points: '8.21 13.89 7 23 12 20 17 23 15.79 13.88' })
    ])
  }
})

const SmileIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('circle', { cx: '12', cy: '12', r: '10' }),
      h('path', { d: 'M8 14s1.5 2 4 2 4-2 4-2' }),
      h('line', { x1: '9', y1: '9', x2: '9.01', y2: '9' }),
      h('line', { x1: '15', y1: '9', x2: '15.01', y2: '9' })
    ])
  }
})

const UsersIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '9', cy: '7', r: '4' }),
      h('path', { d: 'M23 21v-2a4 4 0 0 0-3-3.87' }),
      h('path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' })
    ])
  }
})

const BookOpenIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20' }),
      h('path', { d: 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' })
    ])
  }
})

const FolderIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z' })
    ])
  }
})

const CodeIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('polyline', { points: '16 18 22 12 16 6' }),
      h('polyline', { points: '8 6 2 12 8 18' })
    ])
  }
})

const CertificateIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }),
      h('line', { x1: '9', y1: '9', x2: '15', y2: '9' }),
      h('line', { x1: '9', y1: '12', x2: '15', y2: '12' }),
      h('line', { x1: '9', y1: '15', x2: '13', y2: '15' })
    ])
  }
})

const TrophyIcon = markRaw({
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      width: '14',
      height: '14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('path', { d: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6' }),
      h('path', { d: 'M18 9h1.5a2.5 2.5 0 0 0 0-5H18' }),
      h('path', { d: 'M4 22h16' }),
      h('path', { d: 'M10 22v-4.5a2.5 2.5 0 0 1 4 0V22' }),
      h('rect', { x: '8', y: '4', width: '8', height: '12', rx: '4' })
    ])
  }
})

// Fonction simple de traduction (à remplacer par vue-i18n quand disponible)
const t = (key: string, defaultValue: string) => defaultValue
</script>

<style scoped>
/* Effet hover pour les éléments de navigation */
.nav-item-hover:hover {
  background-color: rgba(75, 85, 99, 0.2);
  transform: translateX(2px);
}

/* Animation pour l'indicateur de progression */
@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.progress-pulse {
  animation: pulse 2s infinite;
}
</style> 
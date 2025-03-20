/**
 * useFormProgress.ts
 * 
 * Un composable pour gérer le suivi de la progression des formulaires CV
 * Permet de déterminer quelles sections sont complètes, incomplètes, et 
 * de calculer un pourcentage de progression global.
 * 
 * Ce composable suit la couche de présentation dans Clean Architecture.
 */

import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResumeStore } from '../stores/resume'
import { useWorkStore } from '../stores/work'
import { useEducationStore } from '../stores/education'
import { useSkillStore } from '../stores/skill'
import { useLanguageStore } from '../stores/language'
import { useProjectStore } from '../stores/project'
import { useVolunteerStore } from '../stores/volunteer'
import { useAwardStore } from '../stores/award'
import { useCertificateStore } from '../stores/certificate'
import { useInterestStore } from '../stores/interest'
import { usePublicationStore } from '../stores/publication'
import { useReferenceStore } from '../stores/reference'

/**
 * Interface représentant l'état de complétion d'une section
 */
export interface SectionStatus {
  id: string
  label: string
  icon?: string
  isRequired: boolean
  isComplete: boolean
  isPartial: boolean
  progress: number // 0-100
  path: string
}

/**
 * Composable pour gérer le suivi de la progression des formulaires
 * @returns Fonctions et état pour la gestion de la progression
 */
export function useFormProgress() {
  // Initialize i18n
  const { t, locale } = useI18n()
  
  // Initialisation des stores
  const resumeStore = useResumeStore()
  const workStore = useWorkStore()
  const educationStore = useEducationStore()
  const skillStore = useSkillStore()
  const languageStore = useLanguageStore()
  const projectStore = useProjectStore()
  const volunteerStore = useVolunteerStore()
  const awardStore = useAwardStore()
  const certificateStore = useCertificateStore()
  const interestStore = useInterestStore()
  const publicationStore = usePublicationStore()
  const referenceStore = useReferenceStore()
  
  // État pour suivre les sections essentielles
  
  /**
   * Détermine si les informations de base sont complètes
   */
  const isBasicsComplete = computed(() => {
    const resume = resumeStore.resume
    
    if (!resume || !resume.basics) return false
    
    // Vérifie que les champs essentiels sont remplis
    const requiredFields = ['name', 'email', 'label']
    const hasAllRequiredFields = requiredFields.every(field => {
      const value = resume.basics[field as keyof typeof resume.basics]
      return value && 
        typeof value === 'string' && 
        value.trim() !== ''
    })
    
    return hasAllRequiredFields
  })
  
  /**
   * Détermine si les informations de base sont partiellement complètes
   */
  const isBasicsPartial = computed(() => {
    const resume = resumeStore.resume
    
    if (!resume || !resume.basics) return false
    if (isBasicsComplete.value) return false
    
    // Vérifie qu'au moins un champ est rempli
    const hasAtLeastOneField = resume.basics.name || resume.basics.email || resume.basics.label
    
    return !!hasAtLeastOneField
  })
  
  /**
   * Calcule le pourcentage de complétion des informations de base
   */
  const basicsProgress = computed(() => {
    const resume = resumeStore.resume
    
    if (!resume || !resume.basics) return 0
    if (isBasicsComplete.value) return 100
    
    const fields = ['name', 'email', 'label', 'summary', 'phone', 'url']
    const filledFields = fields.filter(field => {
      const value = resume.basics[field as keyof typeof resume.basics]
      return value && 
        typeof value === 'string' && 
        value.trim() !== ''
    })
    
    return Math.round((filledFields.length / fields.length) * 100)
  })
  
  /**
   * Vérifie si un store a des éléments
   * @param store Le store à vérifier
   * @param property Le nom de la propriété contenant la collection
   */
  const hasStoreItems = (store: any, property: string): boolean => {
    return !!(store[property] && store[property].length > 0)
  }
  
  /**
   * Calcule l'état de toutes les sections
   */
  const sectionStatuses = computed<SectionStatus[]>(() => {
    return [
      {
        id: 'basics',
        label: t('resume.sections.basics', 'Basic Information'),
        isRequired: true,
        isComplete: isBasicsComplete.value,
        isPartial: isBasicsPartial.value,
        progress: basicsProgress.value,
        path: '#basics',
        icon: 'user'
      },
      {
        id: 'work',
        label: t('resume.sections.work', 'Work Experience'),
        isRequired: true,
        isComplete: hasStoreItems(workStore, 'works'),
        isPartial: false,
        progress: hasStoreItems(workStore, 'works') ? 100 : 0,
        path: '#experience',
        icon: 'briefcase'
      },
      {
        id: 'education',
        label: t('resume.sections.education', 'Education'),
        isRequired: true,
        isComplete: hasStoreItems(educationStore, 'educations'),
        isPartial: false,
        progress: hasStoreItems(educationStore, 'educations') ? 100 : 0,
        path: '#education',
        icon: 'graduation-cap'
      },
      {
        id: 'skills',
        label: t('resume.sections.skills', 'Skills'),
        isRequired: true,
        isComplete: hasStoreItems(skillStore, 'skills'),
        isPartial: false,
        progress: hasStoreItems(skillStore, 'skills') ? 100 : 0,
        path: '#skills',
        icon: 'code'
      },
      {
        id: 'languages',
        label: t('resume.sections.languages', 'Languages'),
        isRequired: false,
        isComplete: hasStoreItems(languageStore, 'languages'),
        isPartial: false,
        progress: hasStoreItems(languageStore, 'languages') ? 100 : 0,
        path: '#languages',
        icon: 'globe'
      },
      {
        id: 'projects',
        label: t('resume.sections.projects', 'Projects'),
        isRequired: false,
        isComplete: hasStoreItems(projectStore, 'projects'),
        isPartial: false,
        progress: hasStoreItems(projectStore, 'projects') ? 100 : 0,
        path: '#projects',
        icon: 'folder'
      },
      {
        id: 'volunteer',
        label: t('resume.sections.volunteer', 'Volunteer Work'),
        isRequired: false,
        isComplete: hasStoreItems(volunteerStore, 'volunteers'),
        isPartial: false,
        progress: hasStoreItems(volunteerStore, 'volunteers') ? 100 : 0,
        path: '#volunteer',
        icon: 'heart'
      },
      {
        id: 'awards',
        label: t('resume.sections.awards', 'Awards'),
        isRequired: false,
        isComplete: hasStoreItems(awardStore, 'awards'),
        isPartial: false,
        progress: hasStoreItems(awardStore, 'awards') ? 100 : 0,
        path: '#awards',
        icon: 'trophy'
      },
      {
        id: 'certificates',
        label: t('resume.sections.certificates', 'Certificates'),
        isRequired: false,
        isComplete: hasStoreItems(certificateStore, 'certificates'),
        isPartial: false,
        progress: hasStoreItems(certificateStore, 'certificates') ? 100 : 0,
        path: '#certificates',
        icon: 'certificate'
      },
      {
        id: 'interests',
        label: t('resume.sections.interests', 'Interests'),
        isRequired: false,
        isComplete: hasStoreItems(interestStore, 'interests'),
        isPartial: false,
        progress: hasStoreItems(interestStore, 'interests') ? 100 : 0,
        path: '#interests',
        icon: 'star'
      },
      {
        id: 'publications',
        label: t('resume.sections.publications', 'Publications'),
        isRequired: false,
        isComplete: hasStoreItems(publicationStore, 'publications'),
        isPartial: false,
        progress: hasStoreItems(publicationStore, 'publications') ? 100 : 0,
        path: '#publications',
        icon: 'book'
      },
      {
        id: 'references',
        label: t('resume.sections.references', 'References'),
        isRequired: false,
        isComplete: hasStoreItems(referenceStore, 'references'),
        isPartial: false,
        progress: hasStoreItems(referenceStore, 'references') ? 100 : 0,
        path: '#references',
        icon: 'users'
      }
    ]
  })
  
  // Make sectionStatuses reactive to locale changes
  watch(locale, () => {
    // This watch will force re-computation when locale changes
  }, { immediate: true })
  
  /**
   * Calcule les sections requises complétées vs. totales
   */
  const requiredSectionsCompletion = computed(() => {
    const requiredSections = sectionStatuses.value.filter(section => section.isRequired)
    const completedRequiredSections = requiredSections.filter(section => section.isComplete)
    
    return {
      total: requiredSections.length,
      completed: completedRequiredSections.length,
      percentage: Math.round((completedRequiredSections.length / requiredSections.length) * 100)
    }
  })
  
  /**
   * Calcule le pourcentage global de progression du CV
   */
  const overallProgress = computed(() => {
    // Les sections requises ont plus de poids dans le calcul
    const requiredWeight = 0.7
    const optionalWeight = 0.3
    
    const requiredSections = sectionStatuses.value.filter(section => section.isRequired)
    const optionalSections = sectionStatuses.value.filter(section => !section.isRequired)
    
    // Calcul pour les sections requises
    const requiredProgress = requiredSections.reduce((sum, section) => sum + section.progress, 0) / requiredSections.length
    
    // Calcul pour les sections optionnelles
    let optionalProgress = 0
    if (optionalSections.length > 0) {
      optionalProgress = optionalSections.reduce((sum, section) => sum + section.progress, 0) / optionalSections.length
    }
    
    // Calcul pondéré
    const weightedProgress = (requiredProgress * requiredWeight) + (optionalProgress * optionalWeight)
    
    return Math.round(weightedProgress)
  })
  
  /**
   * Détermine si une section est la prochaine à compléter
   * @param sectionId L'identifiant de la section
   */
  const isNextToComplete = (sectionId: string) => {
    // Obtenir toutes les sections incomplètes et requises
    const incompleteRequired = sectionStatuses.value
      .filter(section => section.isRequired && !section.isComplete)
      .sort((a, b) => a.id.localeCompare(b.id))
    
    // S'il n'y a pas de sections requises incomplètes, on vérifie les autres
    if (incompleteRequired.length === 0) {
      const incomplete = sectionStatuses.value
        .filter(section => !section.isComplete)
        .sort((a, b) => a.id.localeCompare(b.id))
      
      return incomplete.length > 0 && incomplete[0].id === sectionId
    }
    
    return incompleteRequired.length > 0 && incompleteRequired[0].id === sectionId
  }
  
  /**
   * Trouve la section suivante incomplète
   */
  const findNextIncompleteSection = computed(() => {
    // D'abord, on cherche parmi les sections requises
    const nextRequired = sectionStatuses.value
      .filter(section => section.isRequired && !section.isComplete)
      .sort((a, b) => a.id.localeCompare(b.id))
    
    if (nextRequired.length > 0) {
      return nextRequired[0]
    }
    
    // Ensuite, on cherche parmi les sections optionnelles
    const nextOptional = sectionStatuses.value
      .filter(section => !section.isRequired && !section.isComplete)
      .sort((a, b) => a.id.localeCompare(b.id))
    
    if (nextOptional.length > 0) {
      return nextOptional[0]
    }
    
    // Toutes les sections sont complètes
    return null
  })
  
  /**
   * Obtient la section précédente et suivante pour la navigation
   * @param currentSectionId L'identifiant de la section actuelle
   */
  const getNavigationSections = (currentSectionId: string) => {
    const currentIndex = sectionStatuses.value.findIndex(section => section.id === currentSectionId)
    
    if (currentIndex === -1) return { prev: null, next: null }
    
    const prev = currentIndex > 0 ? sectionStatuses.value[currentIndex - 1] : null
    const next = currentIndex < sectionStatuses.value.length - 1 ? sectionStatuses.value[currentIndex + 1] : null
    
    return { prev, next }
  }
  
  return {
    sectionStatuses,
    requiredSectionsCompletion,
    overallProgress,
    isNextToComplete,
    findNextIncompleteSection,
    getNavigationSections
  }
} 
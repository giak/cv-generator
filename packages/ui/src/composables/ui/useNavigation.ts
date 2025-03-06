import { computed, ref, watch, type Component } from 'vue'
import { useResumeStore } from '@ui/modules/cv/presentation/stores/resume'
import { useWorkStore } from '@ui/modules/cv/presentation/stores/work'
import { useVolunteerStore } from '@ui/modules/cv/presentation/stores/volunteer'
import { useEducationStore } from '@ui/modules/cv/presentation/stores/education'
import { useAwardStore } from '@ui/modules/cv/presentation/stores/award'
import { useCertificateStore } from '@ui/modules/cv/presentation/stores/certificate'
import { usePublicationStore } from '@ui/modules/cv/presentation/stores/publication'
import { useSkillStore } from '@ui/modules/cv/presentation/stores/skill'
import { useLanguageStore } from '@ui/modules/cv/presentation/stores/language'
import { useInterestStore } from '@ui/modules/cv/presentation/stores/interest'
import { useProjectStore } from '@ui/modules/cv/presentation/stores/project'
import { useReferenceStore } from '@ui/modules/cv/presentation/stores/reference'
import { useFormProgress } from '../../modules/cv/presentation/composables/useFormProgress'

// Define the navigation item interface
export interface NavItem {
  id: string
  label: string
  path: string
  active?: boolean
  icon?: string
}

// Define the navigation group interface
export interface NavGroup {
  id: string
  title: string
  items: NavItem[]
}

/**
 * Composable for handling navigation within the application
 * Manages navigation state and data loading based on navigation changes
 * Follows the UI layer pattern in Clean Architecture
 * 
 * @param {Object} options Configuration options
 * @param {Ref<string>} options.activeView Ref to the currently active view
 * @param {Ref<Component|null>} options.activeComponent Ref to the currently active component
 * @returns Object containing navigation state and methods
 */
export function useNavigation(options: {
  activeView: ReturnType<typeof ref<string>>,
  activeComponent: ReturnType<typeof ref<Component | null>>
}) {
  const { activeView, activeComponent } = options
  
  // Initialize all needed stores
  const resumeStore = useResumeStore()
  const workStore = useWorkStore()
  const volunteerStore = useVolunteerStore()
  const educationStore = useEducationStore()
  const awardStore = useAwardStore()
  const certificateStore = useCertificateStore()
  const publicationStore = usePublicationStore()
  const skillStore = useSkillStore()
  const languageStore = useLanguageStore()
  const interestStore = useInterestStore()
  const projectStore = useProjectStore()
  const referenceStore = useReferenceStore()
  
  // Initialize breadcrumb items
  const breadcrumbItems = ref<NavItem[]>([
    {
      id: 'home',
      label: 'Accueil',
      path: '#home'
    }
  ])
  
  // Setup navigation items for sidebar
  const navigationGroups: NavGroup[] = [
    {
      id: 'cv',
      title: 'Curriculum Vitae',
      items: [
        {
          id: 'basics',
          label: 'Informations de base',
          path: '#basics',
          active: true,
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>`
        },
        {
          id: 'experience',
          label: 'Expérience',
          path: '#experience',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>`
        },
        {
          id: 'volunteer',
          label: 'Bénévolat',
          path: '#volunteer',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>`
        },
        {
          id: 'education',
          label: 'Formation',
          path: '#education',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M22 10v6M2 10v6M17 10a5 5 0 0 0-10 0M12 10v6M7 16h10"></path>
                </svg>`
        },
        {
          id: 'awards',
          label: 'Prix & Distinctions',
          path: '#awards',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <circle cx="12" cy="8" r="7"></circle>
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>`
        },
        {
          id: 'certificates',
          label: 'Certifications',
          path: '#certificates',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>`
        },
        {
          id: 'publications',
          label: 'Publications',
          path: '#publications',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>`
        },
        {
          id: 'skills',
          label: 'Compétences',
          path: '#skills',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>`
        },
        {
          id: 'languages',
          label: 'Langues',
          path: '#languages',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M5 7l2-2h10l2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z"></path>
                  <path d="M9 2v3"></path>
                  <path d="M15 2v3"></path>
                  <path d="M9 13h6"></path>
                  <path d="M9 17h4"></path>
                </svg>`
        },
        {
          id: 'interests',
          label: 'Intérêts',
          path: '#interests',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                </svg>`
        },
        {
          id: 'projects',
          label: 'Projets',
          path: '#projects',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>`
        },
        {
          id: 'references',
          label: 'Références',
          path: '#references',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M17 6.1H3M21 12.5H3M21 18.9H3M16 18.9L14.8 3"/>
                </svg>`
        }
      ]
    },
    {
      id: 'options',
      title: 'Options',
      items: [
        {
          id: 'notifications',
          label: 'Notifications',
          path: '#notifications',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>`
        },
        {
          id: 'themes',
          label: 'Thèmes',
          path: '#themes',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>`
        },
        {
          id: 'settings',
          label: 'Paramètres',
          path: '#settings',
          icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>`
        }
      ]
    }
  ]
  
  /**
   * Update breadcrumb items based on active view
   * @param viewId ID of the active view
   */
  const updateBreadcrumbs = (viewId: string) => {
    // Find the nav item that corresponds to this view ID
    let navItem: NavItem | undefined
    
    // Search for the view in all navigation groups
    for (const group of navigationGroups) {
      navItem = group.items.find(item => item.id === viewId)
      if (navItem) break
    }
    
    if (navItem) {
      // Update breadcrumbs
      breadcrumbItems.value = [
        {
          id: 'home',
          label: 'Accueil',
          path: '#home'
        },
        {
          id: viewId,
          label: navItem.label,
          path: navItem.path
        }
      ]
    }
  }
  
  /**
   * Handle navigation to a new view
   * @param path The path to navigate to
   */
  const handleNavigation = async (path: string) => {
    console.log(`Navigating to ${path}...`)
    
    // Extract view ID from the path (remove # if present)
    const viewId = path.startsWith('#') ? path.substring(1) : path
    
    // Update active view
    activeView.value = viewId === 'experience' ? 'work' : viewId
    
    // Update breadcrumb items
    updateBreadcrumbs(viewId)
    
    // Load data based on the view ID
    await loadDataForView(viewId)
  }
  
  /**
   * Load data for the specified view
   * @param viewId ID of the view to load data for
   */
  const loadDataForView = async (viewId: string) => {
    console.log(`Loading data for ${viewId}...`)
    
    try {
      switch (viewId) {
        case 'basics':
          console.log('Loading resume data due to navigation...')
          await resumeStore.loadResume()
          break
        case 'experience':
        case 'work':
          console.log('Loading work experience data due to navigation...')
          await workStore.loadWorks()
          break
        case 'volunteer':
          console.log('Loading volunteer data due to navigation...')
          await volunteerStore.loadVolunteers()
          break
        case 'education':
          console.log('Loading education data due to navigation...')
          await educationStore.loadEducation()
          break
        case 'awards':
          console.log('Loading awards data due to navigation...')
          await awardStore.loadAwards()
          break
        case 'certificates':
          console.log('Loading certificates data due to navigation...')
          await certificateStore.loadCertificates()
          break
        case 'publications':
          console.log('Loading publications data due to navigation...')
          await publicationStore.loadPublications()
          break
        case 'skills':
          console.log('Loading skills data due to navigation...')
          await skillStore.loadSkills()
          break
        case 'languages':
          console.log('Loading languages data due to navigation...')
          await languageStore.loadLanguages()
          break
        case 'interests':
          console.log('Loading interests data due to navigation...')
          await interestStore.loadInterests()
          break
        case 'projects':
          console.log('Loading projects data due to navigation...')
          await projectStore.loadProjects()
          break
        case 'references':
          console.log('Loading references data due to navigation...')
          await referenceStore.loadReferences()
          break
        case 'notifications':
          console.log('Loading notifications data due to navigation...')
          // Implement notifications data loading logic
          break
      }
    } catch (error) {
      console.error(`Error loading data for ${viewId}:`, error)
    }
  }
  
  /**
   * Get the title for the active view
   */
  const getActiveViewTitle = computed<string>(() => {
    if (!activeView.value || activeView.value.length === 0) {
      return 'Vue'
    }
    
    switch (activeView.value) {
      case 'basics':
        return 'Informations de base'
      case 'work':
      case 'experience':
        return 'Expérience professionnelle'
      case 'volunteer':
        return 'Expérience de bénévolat'
      case 'education':
        return 'Formation'
      case 'awards':
        return 'Prix et Distinctions'
      case 'certificates':
        return 'Certifications'
      case 'publications':
        return 'Publications'
      case 'skills':
        return 'Compétences'
      case 'languages':
        return 'Langues'
      case 'interests':
        return 'Intérêts'
      case 'projects':
        return 'Projets'
      case 'references':
        return 'Références'
      case 'notifications':
        return 'Notifications'
      case 'themes':
        return 'Thèmes'
      case 'settings':
        return 'Paramètres'
      default:
        return 'Vue inconnue'
    }
  })

  /**
   * Get the description for the active view
   */
  const getActiveViewDescription = computed<string>(() => {
    switch (activeView.value) {
      case 'basics':
        return 'Gérez vos informations personnelles'
      case 'work':
      case 'experience':
        return 'Ajoutez votre expérience professionnelle'
      case 'volunteer':
        return 'Ajoutez votre expérience de bénévolat'
      case 'education':
        return 'Ajoutez votre parcours académique'
      case 'awards':
        return 'Ajoutez vos prix et distinctions'
      case 'certificates':
        return 'Ajoutez vos certifications'
      case 'publications':
        return 'Ajoutez vos publications'
      case 'skills':
        return 'Ajoutez vos compétences'
      case 'languages':
        return 'Ajoutez les langues que vous maîtrisez'
      case 'interests':
        return 'Ajoutez vos centres d\'intérêt'
      case 'projects':
        return 'Ajoutez vos projets personnels ou professionnels'
      case 'references':
        return 'Ajoutez vos références professionnelles'
      case 'notifications':
        return 'Gérez vos notifications'
      case 'themes':
        return 'Personnalisez l\'apparence de l\'application'
      case 'settings':
        return 'Configurez les paramètres de l\'application'
      default:
        return 'Description non disponible'
    }
  })
  
  // Intégration avec le suivi de progression
  const { 
    sectionStatuses, 
    requiredSectionsCompletion, 
    overallProgress, 
    findNextIncompleteSection,
    getNavigationSections 
  } = useFormProgress()
  
  /**
   * Naviguer vers la section suivante incomplète
   */
  const navigateToNextIncompleteSection = () => {
    const nextSection = findNextIncompleteSection.value
    if (nextSection) {
      handleNavigation(nextSection.id)
    }
    return nextSection
  }

  /**
   * Naviguer vers la section précédente
   */
  const navigateToPrevSection = () => {
    if (!activeView.value) return null
    
    const { prev } = getNavigationSections(activeView.value)
    if (prev) {
      handleNavigation(prev.id)
    }
    return prev
  }

  /**
   * Naviguer vers la section suivante
   */
  const navigateToNextSection = () => {
    if (!activeView.value) return null
    
    const { next } = getNavigationSections(activeView.value)
    if (next) {
      handleNavigation(next.id)
    }
    return next
  }

  /**
   * Vérifier si une section est incomplète
   * @param sectionId ID de la section à vérifier
   */
  const isSectionIncomplete = (sectionId: string) => {
    const section = sectionStatuses.value.find(s => s.id === sectionId)
    return section ? !section.isComplete : false
  }

  /**
   * Vérifier si une section est complète
   * @param sectionId ID de la section à vérifier
   */
  const isSectionComplete = (sectionId: string) => {
    const section = sectionStatuses.value.find(s => s.id === sectionId)
    return section ? section.isComplete : false
  }

  /**
   * Vérifier si une section est partiellement complète
   * @param sectionId ID de la section à vérifier
   */
  const isSectionPartial = (sectionId: string) => {
    const section = sectionStatuses.value.find(s => s.id === sectionId)
    return section ? section.isPartial : false
  }
  
  // Return the composable functions and state
  return {
    navigationGroups,
    breadcrumbItems,
    handleNavigation,
    getActiveViewTitle,
    getActiveViewDescription,
    updateBreadcrumbs,
    loadDataForView,
    navigateToNextSection,
    navigateToPrevSection,
    navigateToNextIncompleteSection,
    isSectionComplete,
    isSectionPartial,
    isSectionIncomplete,
    sectionStatuses
  }
} 
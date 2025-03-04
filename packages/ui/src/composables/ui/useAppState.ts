import { ref, reactive, watch, toValue, type Component } from 'vue'
import { useResumeStore } from '@ui/modules/cv/presentation/stores/resume'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'

/**
 * Composable for managing application state
 * Handles state transformations and UI state operations
 * Follows the UI layer pattern in Clean Architecture
 *
 * @returns Object containing application state and methods to manipulate it
 */
export function useAppState() {
  const resumeStore = useResumeStore()
  
  // Variable pour le composant actif à afficher en fonction de la vue
  const activeComponent = ref<Component | null>(null)
  
  // State pour la vue active
  const activeView = ref('basics')
  
  // État du menu latéral pour responsive
  const isSidebarOpen = ref(false)
  
  // Créer un CV vide par défaut avec reactive pour une meilleure gestion de l'état
  const basics = reactive<BasicsInterface>({
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
  })
  
  /**
   * Initialize basics data from the store
   */
  const initializeBasics = async () => {
    // Initialiser basics avec les données du store
    if (resumeStore.resume?.basics) {
      const storeBasics = resumeStore.resume.basics
      console.log('Loading data from store:', storeBasics)
      Object.assign(basics, {
        name: storeBasics.name ?? '',
        email: storeBasics.email ?? '',
        label: storeBasics.label ?? '',
        phone: storeBasics.phone ?? '',
        url: storeBasics.url ?? '',
        image: storeBasics.image ?? '',
        summary: storeBasics.summary ?? '',
        location: storeBasics.location ?? {
          address: '',
          postalCode: '',
          city: '',
          countryCode: '',
          region: ''
        },
        profiles: storeBasics.profiles ?? []
      })
      console.log('Loaded data into basics:', basics)
    }
  }
  
  /**
   * Update basics data
   * @param value New basics data
   */
  const updateBasics = (value: BasicsInterface) => {
    console.log('=== UI Layer - Basics Update ===')
    console.log('Received update:', JSON.stringify(value))
    
    // Mettre à jour le modèle directement
    basics.name = value.name || ''
    basics.email = value.email || ''
    basics.label = value.label || ''
    basics.phone = value.phone || ''
    basics.url = value.url || ''
    basics.image = value.image || ''
    basics.summary = value.summary || ''
    
    // Mettre à jour location avec focus particulier sur countryCode
    if (value.location && basics.location) {
      basics.location.address = value.location.address || ''
      basics.location.postalCode = value.location.postalCode || ''
      basics.location.city = value.location.city || ''
      basics.location.countryCode = value.location.countryCode || ''
      basics.location.region = value.location.region || ''
      
      // Ajout d'un log spécifique pour le countryCode
      console.log(`Updated countryCode: '${value.location.countryCode}'`)
    } else if (value.location) {
      // Si basics.location est undefined mais value.location existe
      basics.location = {
        address: value.location.address || '',
        postalCode: value.location.postalCode || '',
        city: value.location.city || '',
        countryCode: value.location.countryCode || '',
        region: value.location.region || ''
      }
    }
    
    // Mettre à jour profiles
    basics.profiles = [...(value.profiles || [])]
    
    // Log complet des données, y compris les champs problématiques
    console.log('Updated basics with ALL fields:', JSON.stringify({
      ...basics,
      image: basics.image,
      location: basics.location ? {
        ...basics.location,
        countryCode: basics.location.countryCode
      } : null
    }))
  }
  
  /**
   * Save basics data to the store
   */
  const saveBasics = async () => {
    try {
      console.log('=== UI Layer - Form Submission ===')
      console.log('Current basics state:', JSON.parse(JSON.stringify(basics)))
      
      // Créer les données du CV à sauvegarder - le store s'occupera de l'agrégation avec les autres sections
      const resumeData = {
        basics: {
          ...basics,
          location: { ...basics.location },
          profiles: [...(basics.profiles || [])]
        }
      }
      
      console.log('Basics data to save:', resumeData)

      // Sauvegarder les données du CV - le store s'occupera de récupérer les autres sections
      await resumeStore.saveResume(resumeData)
      console.log('CV sauvegardé avec succès dans App.vue')
      return true
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      return false
    }
  }
  
  /**
   * Toggle sidebar state
   */
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
    
    // Ajouter/retirer une classe au body pour empêcher le défilement sur mobile
    if (isSidebarOpen.value) {
      document.body.classList.add('sidebar-open')
    } else {
      document.body.classList.remove('sidebar-open')
    }
  }
  
  // Set up watchers
  
  // Log changes to basics
  watch(basics, (newValue) => {
    console.log('Basics updated:', JSON.parse(JSON.stringify(newValue)))
  }, { deep: true })
  
  // Close sidebar when window is resized to desktop size
  const setupResizeListener = () => {
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && isSidebarOpen.value) {
        // Sur desktop, on cache simplement la sidebar sans transition
        isSidebarOpen.value = false
        document.body.classList.remove('sidebar-open')
      }
    })
  }
  
  return {
    activeComponent,
    activeView,
    isSidebarOpen,
    basics,
    
    initializeBasics,
    updateBasics,
    saveBasics,
    toggleSidebar,
    setupResizeListener
  }
} 
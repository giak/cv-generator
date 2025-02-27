<script setup lang="ts">
import { useResumeStore } from '@ui/modules/cv/presentation/stores/resume'
import BasicsForm from '@ui/modules/cv/presentation/components/BasicsForm.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { Resume } from '@cv-generator/core'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import ErrorNotification from '../components/notification/ErrorNotification.vue'
import { useErrorStore, type ErrorInfo } from '../core/stores/error'

const store = useResumeStore()
const errorStore = useErrorStore()

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
  if (value.location && basics.location) {
    basics.location.address = value.location.address || ''
    basics.location.postalCode = value.location.postalCode || ''
    basics.location.city = value.location.city || ''
    basics.location.region = value.location.region || ''
  } else if (value.location) {
    // Si basics.location est undefined mais value.location existe
    basics.location = {
      address: value.location.address || '',
      postalCode: value.location.postalCode || '',
      city: value.location.city || '',
      region: value.location.region || ''
    }
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
        profiles: [...(basics.profiles || [])]
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

// Handle error actions for recovery
const handleErrorAction = async (error: ErrorInfo) => {
  if (!error.action) return
  
  console.log('Handling error action:', error.action)
  
  const [storeName, methodName] = error.action.handler.split('/')
  
  // Handle Resume store actions
  if (storeName === 'resume') {
    switch (methodName) {
      case 'retryLastOperation':
        if (error.action.params?.operation === 'save') {
          console.log('Retrying save operation')
          await handleValidate()
        } else if (error.action.params?.operation === 'load') {
          console.log('Retrying load operation')
          await store.loadResume()
        }
        break
      default:
        console.warn('Unknown resume store method:', methodName)
    }
  }
  
  // Handle application-wide actions
  if (storeName === 'app') {
    switch (methodName) {
      case 'enableOfflineMode':
        console.log('Enabling offline mode')
        // Implement offline mode logic
        break
      default:
        console.warn('Unknown app method:', methodName)
    }
  }
  
  // Dismiss the error after handling it
  errorStore.dismissError(error.id)
}

// État du menu latéral pour responsive
const sidebarOpen = ref(false)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  
  // Ajouter/retirer une classe au body pour empêcher le défilement
  if (sidebarOpen.value) {
    document.body.classList.add('sidebar-open')
  } else {
    document.body.classList.remove('sidebar-open')
  }
}

// Fermer la sidebar quand la largeur de la fenêtre change (responsive)
onMounted(() => {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && sidebarOpen.value) {
      // Sur desktop, on cache simplement la sidebar sans transition
      sidebarOpen.value = false
      document.body.classList.remove('sidebar-open')
    }
  })
})
</script>

<template>
  <!-- Application du thème sombre par défaut -->
  <div class="dashboard">
    <ErrorNotification @action="handleErrorAction" />
    
    <!-- Overlay pour mobile quand sidebar est ouverte -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
      @click="toggleSidebar"
    ></div>
    
    <!-- Sidebar -->
    <aside class="dashboard-sidebar" :class="{ 'is-open': sidebarOpen }">
      <div class="sidebar-header">
        <div class="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <span class="brand-name">CV Generator</span>
        
        <!-- Bouton pour fermer la sidebar sur mobile -->
        <button 
          @click="toggleSidebar" 
          class="ml-auto p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors md:hidden"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div class="sidebar-content">
        <nav class="nav-menu">
          <div class="nav-group">
            <div class="nav-group-title">Curriculum Vitae</div>
            <div class="nav-item active">
              <a href="#" class="nav-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="nav-text">Informations de base</span>
              </a>
            </div>
            <div class="nav-item">
              <a href="#" class="nav-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span class="nav-text">Expérience</span>
              </a>
            </div>
            <div class="nav-item">
              <a href="#" class="nav-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M22 10v6M2 10v6M17 10a5 5 0 0 0-10 0M12 10v6M7 16h10"></path>
                </svg>
                <span class="nav-text">Formation</span>
              </a>
            </div>
            <div class="nav-item">
              <a href="#" class="nav-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
                <span class="nav-text">Compétences</span>
              </a>
            </div>
          </div>
          
          <div class="nav-group">
            <div class="nav-group-title">Options</div>
            <div class="nav-item">
              <a href="#" class="nav-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
                <span class="nav-text">Thèmes</span>
              </a>
            </div>
            <div class="nav-item">
              <a href="#" class="nav-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span class="nav-text">Paramètres</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </aside>

    <!-- Content Area -->
    <div class="dashboard-content">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="flex items-center">
          <!-- Hamburger menu pour mobile -->
          <button class="btn-ghost btn-sm btn icon-only md:hidden mr-2" @click="toggleSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 class="header-title">Curriculum Vitae</h1>
        </div>
        
        <div class="header-actions">
          <div class="relative">
            <input type="search" placeholder="Rechercher..." class="search-input">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-2.5 text-neutral-400">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          
          <button class="btn-dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Exporter CV
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="dashboard-main">
        <!-- Breadcrumbs -->
        <div class="breadcrumbs">
          <div class="breadcrumb-item"><a href="#">CV Generator</a></div>
          <div class="breadcrumb-item">Informations de base</div>
        </div>
        
        <!-- Main Content Card -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Informations de base</h2>
            <div class="card-actions">
              <button class="btn btn-sm btn-ghost icon-only">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="card-body">
            <BasicsForm
              :modelValue="basics"
              :loading="store.loading"
              @update:modelValue="handleBasicsUpdate"
              @validate="handleValidate"
            />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
/* Assurez-vous que la hauteur prend 100% de la fenêtre */
html, body {
  height: 100%;
  margin: 0;
}

#app {
  height: 100%;
}

/* Empêcher le défilement du body quand le menu mobile est ouvert */
body.sidebar-open {
  overflow: hidden;
}
</style> 
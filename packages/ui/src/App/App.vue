<script setup lang="ts">
import { useResumeStore } from '@ui/modules/cv/presentation/stores/resume'
import BasicsForm from '@ui/modules/cv/presentation/components/BasicsForm.vue'
import WorkList from '@ui/modules/cv/presentation/components/WorkList.vue'
import VolunteerList from '@ui/modules/cv/presentation/components/VolunteerList.vue'
import EducationList from '@ui/modules/cv/presentation/components/EducationList.vue'
import AwardList from '@ui/modules/cv/presentation/components/AwardList.vue'
import CertificateList from '@ui/modules/cv/presentation/components/CertificateList.vue'
import { onMounted, reactive, ref, watch } from 'vue'
import { Resume } from '@cv-generator/core'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'
import ErrorNotification from '../components/notification/ErrorNotification.vue'
import { useErrorStore, type ErrorInfo } from '../core/stores/error'
import ToastDemo from '../components/notification/ToastDemo.vue'
// Import layout components
import { 
  DashboardLayout, 
  NavMenu, 
  BreadcrumbNav, 
  UserInfo, 
  SearchInput, 
  PageHeader,
  type NavGroup,
  type BreadcrumbItem
} from '../components/layouts'
import { useVolunteerStore } from '@ui/modules/cv/presentation/stores/volunteer'
import { useEducationStore } from '@ui/modules/cv/presentation/stores/education'
import { useAwardStore } from '@ui/modules/cv/presentation/stores/award'
import { useCertificateStore } from '@ui/modules/cv/presentation/stores/certificate'
import { usePublicationStore } from '@ui/modules/cv/presentation/stores/publication'
import PublicationList from '@ui/modules/cv/presentation/components/PublicationList.vue'
import { useSkillStore } from '@ui/modules/cv/presentation/stores/skill'
import SkillList from '@ui/modules/cv/presentation/components/SkillList.vue'

const store = useResumeStore()
const errorStore = useErrorStore()
const volunteerStore = useVolunteerStore()
const educationStore = useEducationStore()
const awardStore = useAwardStore()
const certificateStore = useCertificateStore()
const publicationStore = usePublicationStore()
const skillStore = useSkillStore()

// Variable pour le composant actif à afficher en fonction de la vue
const activeComponent = ref()

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
})

// Gérer la mise à jour du formulaire
const handleBasicsUpdate = (value: BasicsInterface) => {
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

// Gérer la sauvegarde du formulaire
const handleValidate = async () => {
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
const isSidebarOpen = ref(false);
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
  
  // Ajouter/retirer une classe au body pour empêcher le défilement sur mobile
  if (isSidebarOpen.value) {
    document.body.classList.add('sidebar-open');
  } else {
    document.body.classList.remove('sidebar-open');
  }
};

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
];

// Setup breadcrumb items
const breadcrumbItems: BreadcrumbItem[] = [
  {
    id: 'home',
    label: 'CV Generator',
    path: '#'
  },
  {
    id: 'basics',
    label: 'Informations de base'
  }
];

// Ajout de la vue active
const activeView = ref('basics');

// Load section data when activeView changes
watch(activeView, async (newView) => {
  if (newView === 'volunteer') {
    console.log('Loading volunteer data due to navigation...')
    await volunteerStore.loadVolunteers()
  } else if (newView === 'education') {
    console.log('Loading education data due to navigation...')
    await educationStore.loadEducation()
  } else if (newView === 'awards') {
    console.log('Loading awards data due to navigation...')
    await awardStore.loadAwards()
  } else if (newView === 'certificates') {
    console.log('Loading certificates data due to navigation...')
    await certificateStore.loadCertificates()
  } else if (newView === 'publications') {
    console.log('Loading publications data due to navigation...')
    await publicationStore.loadPublications()
  } else if (newView === 'skills') {
    console.log('Loading skills data due to navigation...')
    await skillStore.loadSkills()
  } else if (newView === 'notifications') {
    console.log('Loading notifications data due to navigation...')
    // Implement notifications data loading logic
  }
})

// Gestion de la navigation
const handleNavigation = (path: string) => {
  console.log('Navigation to:', path);
  
  const pathWithoutHash = path.startsWith('#') ? path.substring(1) : path;
  const segments = pathWithoutHash.split('/');
  const viewId = segments[0] || 'basics';
  
  console.log('Setting active view to:', viewId);
  activeView.value = viewId;
  
  // Mise à jour des breadcrumbs en fonction de la vue active
  if (viewId === 'basics') {
    breadcrumbItems.splice(1, 1, {
      id: 'basics',
      label: 'Informations de base'
    });
  }
  else if (viewId === 'experience') {
    breadcrumbItems.splice(1, 1, {
      id: 'experience',
      label: 'Expérience professionnelle'
    });
  }
  else if (viewId === 'volunteer') {
    breadcrumbItems.splice(1, 1, {
      id: 'volunteer',
      label: 'Bénévolat'
    });
  }
  else if (viewId === 'education') {
    breadcrumbItems.splice(1, 1, {
      id: 'education',
      label: 'Formation'
    });
  }
  else if (viewId === 'awards') {
    breadcrumbItems.splice(1, 1, {
      id: 'awards',
      label: 'Prix et distinctions'
    });
  }
  else if (viewId === 'certificates') {
    breadcrumbItems.splice(1, 1, {
      id: 'certificates',
      label: 'Certifications'
    });
  }
  else if (viewId === 'publications') {
    breadcrumbItems.splice(1, 1, {
      id: 'publications',
      label: 'Publications'
    });
  }
  else if (viewId === 'skills') {
    breadcrumbItems.splice(1, 1, {
      id: 'skills',
      label: 'Compétences'
    });
  }
  else if (viewId === 'notifications') {
    breadcrumbItems.splice(1, 1, {
      id: 'notifications',
      label: 'Notifications'
    });
  }
  else {
    // Autres vues
    breadcrumbItems.splice(1, 1, {
      id: viewId,
      label: viewId.charAt(0).toUpperCase() + viewId.slice(1)
    });
  }
};

// Watch activeView pour mettre à jour le composant actif
watch(activeView, (viewId) => {
  if (viewId === 'basics') {
    activeComponent.value = BasicsForm
  } else if (viewId === 'work') {
    activeComponent.value = WorkList
  } else if (viewId === 'volunteer') {
    activeComponent.value = VolunteerList
  } else if (viewId === 'education') {
    activeComponent.value = EducationList
  } else if (viewId === 'awards') {
    activeComponent.value = AwardList
  } else if (viewId === 'certificates') {
    activeComponent.value = CertificateList
  } else if (viewId === 'publications') {
    activeComponent.value = PublicationList
  } else if (viewId === 'skills') {
    activeComponent.value = SkillList
  } else {
    // Fallback à basics si la vue n'est pas reconnue
    activeComponent.value = BasicsForm
  }
})

// Fermer la sidebar quand la largeur de la fenêtre change (responsive)
onMounted(() => {
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && isSidebarOpen.value) {
      // Sur desktop, on cache simplement la sidebar sans transition
      isSidebarOpen.value = false;
      document.body.classList.remove('sidebar-open');
    }
  });
});
</script>

<template>
  <div class="dashboard">
    <ErrorNotification @action="handleErrorAction" />
    
    <DashboardLayout>
      <!-- Sidebar Content -->
      <template #sidebar-content>
        <NavMenu 
          :groups="navigationGroups"
          @navigate="handleNavigation"
        />
      </template>
      
      <!-- Sidebar Footer -->
      <template #sidebar-footer>
        <UserInfo
          name="John Doe"
          role="Développeur"
          @menu-click="() => console.log('User menu clicked')"
        />
      </template>
      
      <!-- Breadcrumb -->
      <template #breadcrumb>
        <BreadcrumbNav
          :items="breadcrumbItems"
          @navigate="handleNavigation"
        />
      </template>
      
      <!-- Search -->
      <template #search>
        <SearchInput
          placeholder="Rechercher..."
          @search="(query: string) => console.log('Search:', query)"
        />
      </template>
      
      <!-- Header Actions -->
      <template #header-actions>
        <button class="px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Exporter CV
        </button>
      </template>
      
      <!-- Page Header - dynamically change based on active view -->
      <PageHeader
        :title="activeView === 'basics' ? 'Informations de base' : 
               activeView === 'experience' ? 'Expérience professionnelle' :
               activeView === 'volunteer' ? 'Expérience de bénévolat' :
               activeView === 'education' ? 'Formation' :
               activeView === 'awards' ? 'Prix et Distinctions' :
               activeView === 'certificates' ? 'Certifications' :
               activeView === 'publications' ? 'Publications' :
               activeView.charAt(0).toUpperCase() + activeView.slice(1)"
        :description="activeView === 'basics' ? 'Renseignez vos informations personnelles et de contact pour votre CV' :
                    activeView === 'experience' ? 'Gérez vos expériences professionnelles pour votre CV' :
                    activeView === 'volunteer' ? 'Ajoutez vos activités de bénévolat pour enrichir votre CV' :
                    activeView === 'education' ? 'Gérez votre parcours académique et vos diplômes' :
                    activeView === 'awards' ? 'Présentez vos prix, récompenses et reconnaissances professionnelles' :
                    activeView === 'certificates' ? 'Ajoutez vos certifications professionnelles et diplômes' :
                    activeView === 'publications' ? 'Présentez vos livres, articles et travaux publiés' :
                    'Gérez les paramètres de votre CV'"
      />
      
      <!-- Main Content -->
      <div v-if="activeView === 'basics'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Informations de base</h2>
          <div>
            <button class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <BasicsForm
            :modelValue="basics"
            :loading="store.loading"
            @update:modelValue="handleBasicsUpdate"
            @validate="handleValidate"
          />
        </div>
      </div>

      <!-- Work Experience View -->
      <div v-if="activeView === 'experience'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Expérience professionnelle</h2>
          <div>
            <button class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <WorkList />
        </div>
      </div>

      <!-- Volunteer Experience View -->
      <div v-if="activeView === 'volunteer'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Expérience de bénévolat</h2>
          <div>
            <button class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <VolunteerList />
        </div>
      </div>

      <!-- Education View -->
      <div v-if="activeView === 'education'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Formation</h2>
          <div>
            <button class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <EducationList />
        </div>
      </div>

      <!-- Award View -->
      <div v-if="activeView === 'awards'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Prix et Distinctions</h2>
          <div>
            <button class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <AwardList />
        </div>
      </div>

      <!-- Certificate View -->
      <div v-if="activeView === 'certificates'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Certifications</h2>
          <div>
            <button class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <CertificateList />
        </div>
      </div>

      <!-- Publications View -->
      <div v-if="activeView === 'publications'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Publications</h2>
          <div>
            <button class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <PublicationList />
        </div>
      </div>

      <!-- Skills View -->
      <div v-if="activeView === 'skills'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Compétences</h2>
          <div>
            <button class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <SkillList />
        </div>
      </div>

      <!-- Toast Demo View -->
      <div v-if="activeView === 'notifications'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Notifications Toast</h2>
          <div>
            <button class="p-1.5 rounded-md text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <ToastDemo />
        </div>
      </div>
    </DashboardLayout>
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

/* Styles spécifiques pour le dashboard */
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Styles pour améliorer la visibilité du sidebar */
@media (max-width: 767px) {
  body.sidebar-open::after {
    content: '';
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 25;
    pointer-events: none;
  }
}
</style> 
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import BasicsForm from '@ui/modules/cv/presentation/components/BasicsForm.vue'
import WorkList from '@ui/modules/cv/presentation/components/WorkList.vue'
import VolunteerList from '@ui/modules/cv/presentation/components/VolunteerList.vue'
import EducationList from '@ui/modules/cv/presentation/components/EducationList.vue'
import AwardList from '@ui/modules/cv/presentation/components/AwardList.vue'
import CertificateList from '@ui/modules/cv/presentation/components/CertificateList.vue'
import ErrorNotification from '../components/notification/ErrorNotification.vue'
import ToastDemo from '../components/notification/ToastDemo.vue'
// Import layout components
import {
  DashboardLayout,
  UserInfo,
  SearchInput,
  PageHeader,
  BreadcrumbNav
} from '../components/layouts'
// Import des composants de navigation
import {
  FormNavigation,
  UnifiedNavigation
} from '../components/navigation'
// Import des composants de statut
import PublicationList from '@ui/modules/cv/presentation/components/PublicationList.vue'
import SkillList from '@ui/modules/cv/presentation/components/SkillList.vue'
import LanguageList from '@ui/modules/cv/presentation/components/LanguageList.vue'
import InterestList from '@ui/modules/cv/presentation/components/InterestList.vue'
import ReferenceList from '@ui/modules/cv/presentation/components/ReferenceList.vue'
import ProjectList from '@ui/modules/cv/presentation/components/ProjectList.vue'
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface'

// Import composables
import { useStores } from '../composables/ui/useStores'
import { useAppState } from '../composables/ui/useAppState'
import { useNavigation } from '../composables/ui/useNavigation'
import { useErrorHandling } from '../composables/ui/useErrorHandling'

// Initialize composables
const { resumeStore } = useStores()
const { 
  activeComponent, 
  activeView, 
  basics, 
  initializeBasics, 
  updateBasics, 
  saveBasics, 
  setupResizeListener 
} = useAppState()
const { 
  breadcrumbItems, 
  handleNavigation, 
  getActiveViewTitle, 
  getActiveViewDescription} = useNavigation({ activeView, activeComponent })
const { handleErrorAction } = useErrorHandling()

// Charger le CV au montage du composant
onMounted(async () => {
  await resumeStore.loadResume()
  await initializeBasics()
  setupResizeListener()
})

// Gérer la mise à jour du formulaire
const handleBasicsUpdate = (value: BasicsInterface) => {
  updateBasics(value)
}

// Gérer la sauvegarde du formulaire
const handleValidate = async () => {
  await saveBasics()
}

// Watch activeView pour mettre à jour le composant actif
watch(activeView, (viewId) => {
  if (viewId === 'basics') {
    activeComponent.value = BasicsForm
  } else if (viewId === 'experience') {
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
  } else if (viewId === 'languages') {
    activeComponent.value = LanguageList
  } else if (viewId === 'interests') {
    activeComponent.value = InterestList
  } else if (viewId === 'projects') {
    activeComponent.value = ProjectList
  } else if (viewId === 'references') {
    activeComponent.value = ReferenceList
  } else {
    // Fallback à basics si la vue n'est pas reconnue
    activeComponent.value = BasicsForm
  }
})
</script>

<template>
  <div class="dashboard">
    <ErrorNotification @action="handleErrorAction" />
    
    <DashboardLayout>
      <!-- Sidebar Content -->
      <template #sidebar-content>
        <UnifiedNavigation 
          :current-section="activeView"
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
        :title="getActiveViewTitle"
        :description="getActiveViewDescription"
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
            :loading="resumeStore.loading"
            @update:modelValue="handleBasicsUpdate"
            @validate="handleValidate"
          />
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="basics"
            show-completion
            @navigate="handleNavigation"
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
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="experience"
            show-completion
            @navigate="handleNavigation"
          />
        </div>
      </div>
      
      <!-- Work Experience View (for when activeView is 'work') -->
      <div v-if="activeView === 'work'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
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
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="work"
            show-completion
            @navigate="handleNavigation"
          />
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
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="volunteer"
            show-completion
            @navigate="handleNavigation"
          />
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
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="education"
            show-completion
            @navigate="handleNavigation"
          />
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
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="awards"
            show-completion
            @navigate="handleNavigation"
          />
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
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="certificates"
            show-completion
            @navigate="handleNavigation"
          />
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
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="publications"
            show-completion
            @navigate="handleNavigation"
          />
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
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="skills"
            show-completion
            @navigate="handleNavigation"
          />
        </div>
      </div>

      <!-- Languages View -->
      <div v-if="activeView === 'languages'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Langues</h2>
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
          <LanguageList />
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="languages"
            show-completion
            @navigate="handleNavigation"
          />
        </div>
      </div>

      <!-- Interests View -->
      <div v-if="activeView === 'interests'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Intérêts</h2>
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
          <InterestList />
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="interests"
            show-completion
            @navigate="handleNavigation"
          />
        </div>
      </div>

      <!-- Projects View -->
      <div v-if="activeView === 'projects'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Projets</h2>
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
          <ProjectList />
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="projects"
            show-completion
            @navigate="handleNavigation"
          />
        </div>
      </div>

      <!-- References View -->
      <div v-if="activeView === 'references'" class="bg-neutral-850 rounded-md border border-neutral-700 overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-700 flex justify-between items-center">
          <h2 class="font-medium text-white">Références</h2>
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
          <ReferenceList />
          
          <!-- Navigation entre les formulaires -->
          <FormNavigation 
            current-section="references"
            show-completion
            @navigate="handleNavigation"
          />
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
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
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
  BreadcrumbNav,
  SectionWrapper
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
  handleNavigation} = useNavigation({ activeView, activeComponent })
const { handleErrorAction } = useErrorHandling()

// Initialize i18n
const { t } = useI18n()

// Function to safely handle translations with fallback
const safeTranslate = (key: string, fallback: string = 'Translation missing') => {
  try {
    const translated = t(key)
    // Check if translation exists and is not the same as the key
    return (translated && translated !== key) ? translated : fallback
  } catch (error) {

    return fallback
  }
}

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
          :name="safeTranslate('ui.user.name', 'John Doe')"
          :role="safeTranslate('ui.user.role', 'Développeur')"
        />
      </template>
      
      <!-- Breadcrumb -->
      <template #breadcrumb>
        <BreadcrumbNav
          :items="breadcrumbItems"
          :translate="true"
          @navigate="handleNavigation"
        />
      </template>
      
      <!-- Search -->
      <template #search>
        <SearchInput
          :placeholder="safeTranslate('ui.search.placeholder', 'Rechercher...')"
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
          {{ safeTranslate('ui.export.button', 'Exporter CV') }}
        </button>
      </template>
      
      <!-- Page Header - dynamically change based on active view -->
      <!-- Removing PageHeader to avoid duplicate titles -->
      
      <!-- Main Content -->
      <SectionWrapper
        v-if="activeView === 'basics'"
        current-section="basics"
        @navigate="handleNavigation"
        :show-actions="false"
      >
        <BasicsForm
          :modelValue="basics"
          :loading="resumeStore.loading"
          @update:modelValue="handleBasicsUpdate"
          @validate="handleValidate"
        />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Work Experience View -->
      <SectionWrapper 
        v-if="activeView === 'experience'" 
        current-section="experience"
        @navigate="handleNavigation"
      >
        <WorkList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>
      
      <!-- Work Experience View (for when activeView is 'work') -->
      <SectionWrapper
        v-if="activeView === 'work'"
        current-section="work"
        @navigate="handleNavigation"
      >
        <WorkList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Volunteer Experience View -->
      <SectionWrapper
        v-if="activeView === 'volunteer'"
        current-section="volunteer"
        @navigate="handleNavigation"
      >
        <VolunteerList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Education View -->
      <SectionWrapper
        v-if="activeView === 'education'"
        current-section="education"
        @navigate="handleNavigation"
      >
        <EducationList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Award View -->
      <SectionWrapper
        v-if="activeView === 'awards'"
        current-section="awards"
        @navigate="handleNavigation"
      >
        <AwardList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Certificate View -->
      <SectionWrapper
        v-if="activeView === 'certificates'"
        current-section="certificates"
        @navigate="handleNavigation"
      >
        <CertificateList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Publications View -->
      <SectionWrapper
        v-if="activeView === 'publications'"
        current-section="publications"
        @navigate="handleNavigation"
      >
        <PublicationList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Skills View -->
      <SectionWrapper
        v-if="activeView === 'skills'"
        current-section="skills"
        @navigate="handleNavigation"
      >
        <SkillList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Languages View -->
      <SectionWrapper
        v-if="activeView === 'languages'"
        current-section="languages"
        @navigate="handleNavigation"
      >
        <LanguageList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Interests View -->
      <SectionWrapper
        v-if="activeView === 'interests'"
        current-section="interests"
        @navigate="handleNavigation"
      >
        <InterestList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Projects View -->
      <SectionWrapper
        v-if="activeView === 'projects'"
        current-section="projects"
        @navigate="handleNavigation"
      >
        <ProjectList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- References View -->
      <SectionWrapper
        v-if="activeView === 'references'"
        current-section="references"
        @navigate="handleNavigation"
      >
        <ReferenceList />
        
        <!-- Navigation entre les formulaires -->
        <template #navigation="{ currentSection }">
          <FormNavigation 
            :current-section="currentSection"
            show-completion
            @navigate="handleNavigation"
          />
        </template>
      </SectionWrapper>

      <!-- Toast Demo View -->
      <SectionWrapper
        v-if="activeView === 'notifications'"
        current-section="notifications"
        @navigate="handleNavigation"
        :show-navigation="false"
      >
        <ToastDemo />
      </SectionWrapper>
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

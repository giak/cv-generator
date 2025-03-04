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
import { useReferenceStore } from '@ui/modules/cv/presentation/stores/reference'
import { useProjectStore } from '@ui/modules/cv/presentation/stores/project'
import { useErrorStore } from '@ui/core/stores/error'

/**
 * Composable for centralizing store initialization and access
 * Provides a unified point of access to all stores in the application
 * Follows the UI layer pattern in Clean Architecture
 *
 * @returns Object containing all initialized stores
 */
export function useStores() {
  // Initialize all stores
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
  const referenceStore = useReferenceStore()
  const projectStore = useProjectStore()
  const errorStore = useErrorStore()

  /**
   * Load all CV section data
   * @returns Promise that resolves when all data is loaded
   */
  const loadAllData = async () => {
    try {
      await resumeStore.loadResume()
      await workStore.loadWorks()
      await volunteerStore.loadVolunteers()
      await educationStore.loadEducation()
      await awardStore.loadAwards()
      await certificateStore.loadCertificates()
      await publicationStore.loadPublications()
      await skillStore.loadSkills()
      await languageStore.loadLanguages()
      await interestStore.loadInterests()
      await referenceStore.loadReferences()
      await projectStore.loadProjects()
      return true
    } catch (error) {
      console.error('Error loading all data:', error)
      return false
    }
  }

  return {
    // Return all stores for direct access
    resumeStore,
    workStore,
    volunteerStore,
    educationStore,
    awardStore,
    certificateStore,
    publicationStore,
    skillStore,
    languageStore,
    interestStore,
    referenceStore,
    projectStore,
    errorStore,
    
    // Utility methods
    loadAllData
  }
} 
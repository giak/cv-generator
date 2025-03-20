import { useErrorStore, type ErrorInfo } from '@ui/core/stores/error'
import { useResumeStore } from '@ui/modules/cv/presentation/stores/resume'
import type { ResumeInterface } from '@cv-generator/shared/src/types/resume.interface'

/**
 * Composable for centralized error handling
 * Provides methods to handle error actions and recovery
 * Follows the UI layer pattern in Clean Architecture
 * 
 * @returns Object containing error handling methods
 */
export function useErrorHandling() {
  const errorStore = useErrorStore()
  const resumeStore = useResumeStore()
  
  /**
   * Handle error actions for recovery
   * @param error The error information
   */
  const handleErrorAction = async (error: ErrorInfo) => {
    if (!error.action) return

    const [storeName, methodName] = error.action.handler.split('/')
    
    // Handle Resume store actions
    if (storeName === 'resume') {
      switch (methodName) {
        case 'retryLastOperation':
          if (error.action.params?.operation === 'save') {

            // Ensure we have a valid ResumeInterface object with at least the required fields
            const resumeData: ResumeInterface = resumeStore.resume || { 
              basics: {
                name: '',
                email: ''
              }
            }
            await resumeStore.saveResume(resumeData)
          } else if (error.action.params?.operation === 'load') {

            await resumeStore.loadResume()
          }
          break
        default:

      }
    }
    
    // Handle application-wide actions
    if (storeName === 'app') {
      switch (methodName) {
        case 'enableOfflineMode':

          // Implement offline mode logic
          break
        default:

      }
    }
    
    // Dismiss the error after handling it
    errorStore.dismissError(error.id)
  }
  
  /**
   * Dismiss all errors
   */
  const dismissAllErrors = () => {
    errorStore.clearErrors()
  }
  
  return {
    handleErrorAction,
    dismissAllErrors
  }
}

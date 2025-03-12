import { ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { useErrorStore } from '../../../../core/stores/error'
import { ManageResume } from '@cv-generator/core'
import type { CertificateInterface } from '@cv-generator/shared/src/types/resume.interface'
import { LocalStorageResumeRepository } from '@cv-generator/infrastructure/repositories/LocalStorageResumeRepository'

export interface CertificateWithId extends CertificateInterface {
  id: string
}

export interface ValidatedCertificate extends CertificateWithId {
  name: string
  date: string
  issuer: string
  url?: string
  toJSON: () => CertificateInterface
}

export const useCertificateStore = defineStore('certificate', () => {
  const errorStore = useErrorStore()
  const repository = new LocalStorageResumeRepository()
  const manageResume = new ManageResume(repository)
  
  const certificates = ref<ValidatedCertificate[]>([])
  const loading = ref({
    certificates: false,
    creating: false,
    updating: false,
    deleting: false,
    reordering: false
  })

  // Charge les certificats depuis le repository
  const loadCertificates = async (): Promise<ValidatedCertificate[]> => {
    try {
      loading.value.certificates = true
      errorStore.clearErrors()

      const result = await errorStore.executeWithErrorHandling(async () => {
        return await repository.load()
      })
      
      if (result) {
        let resumeData
        try {
          resumeData = result.toJSON()
          console.log('[CertificateStore] Resume data after loading:', JSON.stringify(resumeData))
          
          if (!resumeData.certificates) {
            console.warn('[CertificateStore] No certificates found in resume data, initializing empty array')
            certificates.value = []
            return certificates.value
          }
          
          console.log('Loaded certificate data:', resumeData.certificates)
          
          // Map to ValidatedCertificate objects
          certificates.value = resumeData.certificates.map((certificate: CertificateInterface) => ({
            id: uuidv4(),
            name: certificate.name,
            date: certificate.date,
            issuer: certificate.issuer,
            url: certificate.url || '',
            toJSON: () => ({
              name: certificate.name,
              date: certificate.date,
              issuer: certificate.issuer,
              url: certificate.url || '',
            }),
          }))
          
          console.log('[CertificateStore] Successfully loaded certificates:', certificates.value.length)
          return certificates.value
        } catch (error) {
          console.warn('Failed to convert resume to JSON:', error)
          certificates.value = []
          return certificates.value
        }
      } else {
        console.warn('No valid resume found or no certificate data')
        certificates.value = []
        return certificates.value
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du chargement des certificats'
      errorStore.addError({
        id: 'LOAD_CERTIFICATES_ERROR',
        message: errorMessage,
        timestamp: Date.now(),
        severity: 'error',
        source: 'ui',
        dismissed: false
      })
      console.error('Erreur lors du chargement des certificats:', error)
      return []
    } finally {
      loading.value.certificates = false
    }
  }

  // Ajoute un nouveau certificat
  const addCertificate = async (certificate: CertificateInterface): Promise<ValidatedCertificate | null> => {
    try {
      loading.value.creating = true
      errorStore.clearErrors()

      // Validation des champs requis
      if (!certificate.name) {
        throw new Error('Le nom du certificat est requis')
      }
      if (!certificate.date) {
        throw new Error('La date d\'obtention est requise')
      }
      if (!certificate.issuer) {
        throw new Error('L\'organisme émetteur est requis')
      }

      // Si aucun certificat n'est chargé, on les charge d'abord
      if (certificates.value.length === 0) {
        await loadCertificates()
      }

      // Création d'un nouvel objet certificat avec ID unique
      const newCertificate: ValidatedCertificate = {
        id: uuidv4(),
        name: certificate.name,
        date: certificate.date,
        issuer: certificate.issuer,
        url: certificate.url || '',
        toJSON: () => ({
          name: certificate.name,
          date: certificate.date,
          issuer: certificate.issuer,
          url: certificate.url || '',
        }),
      }

      // Sauvegarde dans l'état local
      certificates.value = [newCertificate, ...certificates.value]

      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data
        const resumeData = result.toJSON()
        console.log('Current resume data before update:', JSON.stringify(resumeData))
        
        // Create updated resume data
        const updatedResumeJson = {
          ...resumeData,
          certificates: certificates.value.map(cert => cert.toJSON()),
        }
        
        // Utiliser la méthode createResume pour créer/mettre à jour l'instance
        await manageResume.createResume(updatedResumeJson)
        
        console.log('Certificate added successfully')
        return newCertificate
      } catch (error) {
        console.error('Error saving to repository:', error)
        // Remove from local state on error
        certificates.value = certificates.value.filter(cert => cert.id !== newCertificate.id)
        throw error
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'ajout du certificat'
      errorStore.addError({
        id: 'ADD_CERTIFICATE_ERROR',
        message: errorMessage,
        timestamp: Date.now(),
        severity: 'error',
        source: 'ui',
        dismissed: false
      })
      console.error('Erreur lors de l\'ajout du certificat:', error)
      return null
    } finally {
      loading.value.creating = false
    }
  }

  // Met à jour un certificat existant
  const updateCertificate = async (certificate: CertificateWithId): Promise<CertificateWithId | null> => {
    try {
      loading.value.updating = true
      errorStore.clearErrors()
      console.log('Mise à jour du certificat:', certificate.id)

      // Validation des champs requis
      if (!certificate.name) {
        throw new Error('Le nom du certificat est requis')
      }
      if (!certificate.date) {
        throw new Error('La date d\'obtention est requise')
      }
      if (!certificate.issuer) {
        throw new Error('L\'organisme émetteur est requis')
      }

      // Sauvegarde de l'état précédent pour restauration en cas d'erreur
      const previousCertificates = [...certificates.value]
      
      // Mise à jour dans l'état local
      if (certificates.value.length > 0) {
        certificates.value = certificates.value.map(c => 
          c.id === certificate.id ? {
            ...c,
            name: certificate.name,
            date: certificate.date,
            issuer: certificate.issuer,
            url: certificate.url || '',
            toJSON: () => ({
              name: certificate.name,
              date: certificate.date,
              issuer: certificate.issuer,
              url: certificate.url || '',
            })
          } : c
        )
      }

      const existingCertificate = certificates.value.find(c => c.id === certificate.id)
      if (!existingCertificate) {
        throw new Error('Certificate not found')
      }

      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data
        const resumeData = result.toJSON()
        
        // Create updated resume data
        const updatedResumeJson = {
          ...resumeData,
          certificates: certificates.value.map(cert => cert.toJSON()),
        }
        
        // Utiliser la méthode createResume pour mettre à jour l'instance
        await manageResume.createResume(updatedResumeJson)
        
        console.log('Certificate updated successfully')
        return certificate
      } catch (error) {
        // Restauration de l'état précédent en cas d'erreur
        certificates.value = [...previousCertificates]

        console.error('Error saving to repository:', error)
        throw error
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du certificat'
      errorStore.addError({
        id: 'UPDATE_CERTIFICATE_ERROR',
        message: errorMessage,
        timestamp: Date.now(),
        severity: 'error',
        source: 'ui',
        dismissed: false
      })
      console.error('Erreur lors de la mise à jour du certificat:', error)
      return null
    } finally {
      loading.value.updating = false
    }
  }

  // Supprime un certificat
  const deleteCertificate = async (id: string): Promise<boolean> => {
    try {
      loading.value.deleting = true
      errorStore.clearErrors()
      console.log('Suppression du certificat:', id)

      // Vérification que le certificat existe
      const certificateToDelete = certificates.value.find(c => c.id === id)
      if (!certificateToDelete) {
        throw new Error('Certificat non trouvé')
      }

      // Sauvegarde de l'état précédent pour restauration en cas d'erreur
      const previousCertificates = [...certificates.value]
      
      // Suppression du certificat de l'état local
      certificates.value = certificates.value.filter(c => c.id !== id)

      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data
        const resumeData = result.toJSON()
        
        // Create updated resume data
        const updatedResumeJson = {
          ...resumeData,
          certificates: certificates.value.map(cert => cert.toJSON()),
        }
        
        // Utiliser la méthode createResume pour mettre à jour l'instance
        await manageResume.createResume(updatedResumeJson)
        
        console.log('Certificate deleted successfully')
        return true
      } catch (error) {
        // Restauration de l'état précédent en cas d'erreur
        certificates.value = [...previousCertificates]

        console.error('Error saving to repository:', error)
        throw error
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression du certificat'
      errorStore.addError({
        id: 'DELETE_CERTIFICATE_ERROR',
        message: errorMessage,
        timestamp: Date.now(),
        severity: 'error',
        source: 'ui',
        dismissed: false
      })
      console.error('Erreur lors de la suppression du certificat:', error)
      return false
    } finally {
      loading.value.deleting = false
    }
  }

  // Réorganise les certificats
  const reorderCertificates = async (orderedCertificates: CertificateWithId[]): Promise<boolean> => {
    try {
      loading.value.reordering = true
      errorStore.clearErrors()

      // Sauvegarde de l'état précédent pour restauration en cas d'erreur
      const previousCertificates = [...certificates.value]
      
      // Convert ordered IDs to validated certificates
      const reorderedCertificates = orderedCertificates
        .map(cert => certificates.value.find(c => c.id === cert.id))
        .filter((cert): cert is ValidatedCertificate => cert !== undefined)

      // Mise à jour de l'ordre dans l'état local
      certificates.value = [...reorderedCertificates]

      try {
        const result = await errorStore.executeWithErrorHandling(async () => {
          return await repository.load()
        })
        
        if (!result) {
          throw new Error('Failed to load resume')
        }
        
        // Get current data
        const resumeData = result.toJSON()
        
        // Create updated resume data
        const updatedResumeJson = {
          ...resumeData,
          certificates: certificates.value.map(cert => cert.toJSON()),
        }
        
        // Utiliser la méthode createResume pour mettre à jour l'instance
        await manageResume.createResume(updatedResumeJson)
        
        console.log('Certificates reordered successfully')
        return true
      } catch (error) {
        // Restauration de l'état précédent en cas d'erreur
        certificates.value = [...previousCertificates]

        console.error('Error saving to repository:', error)
        throw error
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la réorganisation des certificats'
      errorStore.addError({
        id: 'REORDER_CERTIFICATES_ERROR',
        message: errorMessage,
        timestamp: Date.now(),
        severity: 'error',
        source: 'ui',
        dismissed: false
      })
      console.error('Erreur lors de la réorganisation des certificats:', error)
      return false
    } finally {
      loading.value.reordering = false
    }
  }

  return {
    certificates,
    loading,
    loadCertificates,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    reorderCertificates
  }
}) 
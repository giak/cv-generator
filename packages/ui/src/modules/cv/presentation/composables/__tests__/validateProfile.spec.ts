import { describe, it, expect } from 'vitest'
import { 
  ResultType, 
  ValidationLayerType,
  ValidationErrorInterface, 
  ERROR_CODES,
  createSuccess,
  createFailure,
  isSuccess,
  isFailure
} from '@cv-generator/shared'
import type { ProfileInterface } from '@cv-generator/shared/src/types/resume.interface'

// Définition de la fonction validateProfile basée sur celle dans BasicsForm.vue
function validateProfile(profile: ProfileInterface): ResultType<ProfileInterface> {
  const errors: ValidationErrorInterface[] = []
  
  // Validation du réseau (obligatoire)
  if (!profile.network) {
    errors.push({
      code: ERROR_CODES.COMMON.REQUIRED_FIELD,
      message: 'Le réseau est requis',
      field: 'network',
      severity: 'error',
      layer: 'presentation' as ValidationLayerType
    })
  }
  
  // Validation du nom d'utilisateur (obligatoire)
  if (!profile.username) {
    errors.push({
      code: ERROR_CODES.COMMON.REQUIRED_FIELD,
      message: 'Le nom d\'utilisateur est requis',
      field: 'username',
      severity: 'error',
      layer: 'presentation' as ValidationLayerType
    })
  }
  
  // Validation de l'URL (optionnelle mais doit être valide si présente)
  if (profile.url) {
    if (!profile.url.startsWith('http://') && !profile.url.startsWith('https://')) {
      errors.push({
        code: ERROR_CODES.COMMON.INVALID_FORMAT,
        message: 'L\'URL doit commencer par http:// ou https://',
        field: 'url',
        severity: 'warning',
        layer: 'presentation' as ValidationLayerType
      })
    }
  }
  
  // Si des erreurs ont été trouvées, retourner un échec
  if (errors.length > 0) {
    return createFailure(errors)
  }
  
  // Sinon, retourner un succès avec le profil validé
  return createSuccess(profile)
}

describe('validateProfile', () => {
  it('should validate a valid profile successfully', () => {
    const validProfile: ProfileInterface = {
      network: 'LinkedIn',
      username: 'johndoe',
      url: 'https://linkedin.com/in/johndoe'
    }
    
    const result = validateProfile(validProfile)
    
    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.value).toEqual(validProfile)
    }
  })
  
  it('should fail validation when network is missing', () => {
    const invalidProfile: ProfileInterface = {
      network: '',
      username: 'johndoe',
      url: 'https://linkedin.com/in/johndoe'
    }
    
    const result = validateProfile(invalidProfile)
    
    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toHaveLength(1)
      expect(result.error[0].field).toBe('network')
      expect(result.error[0].code).toBe(ERROR_CODES.COMMON.REQUIRED_FIELD)
      expect(result.error[0].severity).toBe('error')
    }
  })
  
  it('should fail validation when username is missing', () => {
    const invalidProfile: ProfileInterface = {
      network: 'LinkedIn',
      username: '',
      url: 'https://linkedin.com/in/johndoe'
    }
    
    const result = validateProfile(invalidProfile)
    
    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toHaveLength(1)
      expect(result.error[0].field).toBe('username')
      expect(result.error[0].code).toBe(ERROR_CODES.COMMON.REQUIRED_FIELD)
    }
  })
  
  it('should fail with warning when URL format is invalid', () => {
    const invalidProfile: ProfileInterface = {
      network: 'LinkedIn',
      username: 'johndoe',
      url: 'invalid-url'
    }
    
    const result = validateProfile(invalidProfile)
    
    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toHaveLength(1)
      expect(result.error[0].field).toBe('url')
      expect(result.error[0].code).toBe(ERROR_CODES.COMMON.INVALID_FORMAT)
      expect(result.error[0].severity).toBe('warning')
    }
  })
  
  it('should validate when URL is not provided', () => {
    const profile: ProfileInterface = {
      network: 'LinkedIn',
      username: 'johndoe',
      url: ''
    }
    
    const result = validateProfile(profile)
    
    expect(isSuccess(result)).toBe(true)
  })
  
  it('should accumulate multiple errors', () => {
    const invalidProfile: ProfileInterface = {
      network: '',
      username: '',
      url: 'invalid-url'
    }
    
    const result = validateProfile(invalidProfile)
    
    expect(isFailure(result)).toBe(true)
    if (isFailure(result)) {
      expect(result.error).toHaveLength(3)
      
      // Vérifier que les erreurs pour network, username et url sont présentes
      const fields = result.error.map(err => err.field)
      expect(fields).toContain('network')
      expect(fields).toContain('username')
      expect(fields).toContain('url')
    }
  })
}) 
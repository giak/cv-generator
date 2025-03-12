/**
 * Test pour la chaîne de validation complète utilisant le pattern Result/Option
 */
import { describe, it, expect } from 'vitest'
import { 
  ResultType, 
  ValidationErrorInterface, 
  createSuccess, 
  createFailure,
  isSuccess,
  isFailure,
  ValidationLayerType,
  ValidationSeverityType,
  createSuccessWithWarnings
} from '@cv-generator/shared'
import { useValidationResult } from '../validation/useValidationResult'

// Simuler une entité de domaine avec validation
class EmailValueObject {
  private constructor(public readonly value: string) {}
  
  static create(email: string): ResultType<EmailValueObject> {
    if (!email) {
      return createFailure<EmailValueObject>([{
        code: 'EMAIL.REQUIRED',
        message: 'L\'email est requis',
        field: 'email',
        severity: 'error' as ValidationSeverityType,
        layer: ValidationLayerType.DOMAIN
      }])
    }
    
    if (!email.includes('@')) {
      return createFailure<EmailValueObject>([{
        code: 'EMAIL.INVALID_FORMAT',
        message: 'Format d\'email invalide',
        field: 'email',
        severity: 'error' as ValidationSeverityType,
        layer: ValidationLayerType.DOMAIN
      }])
    }
    
    // Warning si email personnel
    const warnings: ValidationErrorInterface[] = []
    if (email.endsWith('@gmail.com') || email.endsWith('@yahoo.com')) {
      warnings.push({
        code: 'EMAIL.PERSONAL',
        message: 'Préférez utiliser une adresse email professionnelle',
        field: 'email',
        severity: 'warning' as ValidationSeverityType,
        layer: ValidationLayerType.DOMAIN
      })
    }
    
    return warnings.length > 0 
      ? createSuccessWithWarnings(new EmailValueObject(email), warnings)
      : createSuccess(new EmailValueObject(email))
  }
}

// Service de validation (couche application)
class EmailValidationService {
  validate(email: string): ResultType<string> {
    const emailResult = EmailValueObject.create(email)
    
    if (isFailure(emailResult)) {
      return createFailure(emailResult.error)
    }
    
    // On pourrait ajouter des validations supplémentaires au niveau application
    const warnings = isSuccess(emailResult) && emailResult.warnings 
      ? emailResult.warnings 
      : undefined
      
    return warnings 
      ? createSuccessWithWarnings(email, warnings)
      : createSuccess(email)
  }
}

describe('Chaîne de validation avec Result/Option', () => {
  it('devrait propager les erreurs de validation du domaine vers l\'UI', () => {
    // 1. Valider au niveau du domaine
    const invalidEmailResult = EmailValueObject.create('')
    expect(isFailure(invalidEmailResult)).toBe(true)
    
    // 2. Propager via le service (couche application)
    const validationService = new EmailValidationService()
    const serviceResult = validationService.validate('')
    expect(isFailure(serviceResult)).toBe(true)
    
    // 3. Utiliser le composable UI (couche présentation)
    const { setResult, isSuccess, isFailure: uiIsFailure, allErrors } = useValidationResult()
    setResult(serviceResult)
    
    // Vérifier que l'UI a bien reçu l'erreur
    expect(isSuccess.value).toBe(false)
    expect(uiIsFailure.value).toBe(true)
    expect(allErrors.value.length).toBeGreaterThan(0)
    expect(allErrors.value[0].code).toBe('EMAIL.REQUIRED')
  })
  
  it('devrait propager les warnings avec un résultat valide', () => {
    // 1. Valider au niveau du domaine avec un warning
    const personalEmailResult = EmailValueObject.create('test@gmail.com')
    expect(isSuccess(personalEmailResult)).toBe(true)
    if (isSuccess(personalEmailResult)) {
      expect(personalEmailResult.warnings).toBeDefined()
      expect(personalEmailResult.warnings?.length).toBeGreaterThan(0)
    }
    
    // 2. Propager via le service
    const validationService = new EmailValidationService()
    const serviceResult = validationService.validate('test@gmail.com')
    expect(isSuccess(serviceResult)).toBe(true)
    if (isSuccess(serviceResult)) {
      expect(serviceResult.warnings).toBeDefined()
    }
    
    // 3. Utiliser le composable UI
    const { setResult, isSuccess: uiIsSuccess, allWarnings } = useValidationResult()
    setResult(serviceResult)
    
    // Vérifier que l'UI a bien reçu le warning
    expect(uiIsSuccess.value).toBe(true)
    expect(allWarnings.value.length).toBeGreaterThan(0)
    expect(allWarnings.value[0].code).toBe('EMAIL.PERSONAL')
  })
  
  it('devrait propager les résultats sans erreur ni warning', () => {
    // 1. Valider au niveau du domaine avec succès
    const validEmailResult = EmailValueObject.create('contact@entreprise.com')
    expect(isSuccess(validEmailResult)).toBe(true)
    if (isSuccess(validEmailResult)) {
      expect(validEmailResult.warnings).toBeUndefined()
    }
    
    // 2. Propager via le service
    const validationService = new EmailValidationService()
    const serviceResult = validationService.validate('contact@entreprise.com')
    expect(isSuccess(serviceResult)).toBe(true)
    if (isSuccess(serviceResult)) {
      expect(serviceResult.warnings).toBeUndefined()
    }
    
    // 3. Utiliser le composable UI
    const { setResult, isSuccess: uiIsSuccess, allErrors, allWarnings } = useValidationResult()
    setResult(serviceResult)
    
    // Vérifier que l'UI a bien reçu le succès sans erreurs ni warnings
    expect(uiIsSuccess.value).toBe(true)
    expect(allErrors.value.length).toBe(0)
    expect(allWarnings.value.length).toBe(0)
  })
  
  it('devrait permettre l\'accès aux erreurs par champ', () => {
    // Créer un résultat avec plusieurs erreurs
    const multipleErrorsResult = createFailure<string>([
      {
        code: 'EMAIL.REQUIRED',
        message: 'L\'email est requis',
        field: 'email',
        severity: 'error' as ValidationSeverityType,
        layer: ValidationLayerType.DOMAIN
      },
      {
        code: 'NAME.REQUIRED',
        message: 'Le nom est requis',
        field: 'name',
        severity: 'error' as ValidationSeverityType,
        layer: ValidationLayerType.DOMAIN
      }
    ])
    
    // Utiliser le composable UI
    const { setResult, getFieldState } = useValidationResult()
    setResult(multipleErrorsResult)
    
    // Vérifier l'état spécifique pour le champ email
    const emailState = getFieldState('email')
    expect(emailState.hasError.value).toBe(true)
    expect(emailState.errors.value.length).toBe(1)
    expect(emailState.firstErrorMessage.value).toBe('L\'email est requis')
    
    // Vérifier l'état spécifique pour le champ name
    const nameState = getFieldState('name')
    expect(nameState.hasError.value).toBe(true)
    expect(nameState.errors.value.length).toBe(1)
    expect(nameState.firstErrorMessage.value).toBe('Le nom est requis')
  })
}); 
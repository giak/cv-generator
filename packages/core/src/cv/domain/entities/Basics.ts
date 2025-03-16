/**
 * Basics entity representing the basic information in a CV
 * Implements the principles of Domain-Driven Design with rich domain logic
 */

import type { BasicsInterface, LocationInterface, ProfileInterface } from '@cv-generator/shared/src/types/resume.interface';
import {
  ResultType,
  ValidationErrorInterface,
  ValidationLayerType,
  createSuccess,
  createFailure,
  createSuccessWithWarnings,
  TRANSLATION_KEYS
} from '@cv-generator/shared';
import { Email } from '../value-objects/email.value-object';
import { Phone } from '../value-objects/phone.value-object';
import { Url } from '../value-objects/url.value-object';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

// Type for validation result
export type BasicsValidationResultType = ResultType<BasicsInterface> & { 
  entity?: Basics 
};

// Export validation keys for Basics entity
export const BASICS_VALIDATION_KEYS = {
  MISSING_NAME: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_NAME,
  NAME_TOO_LONG: 'resume.basics.validation.nameTooLong',
  MISSING_EMAIL: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_EMAIL
};

/**
 * Default i18n adapter for backwards compatibility
 */
export class DefaultBasicsI18nAdapter implements DomainI18nPortInterface {
  translate(key: string, _params?: Record<string, unknown>): string {
    const defaultMessages: Record<string, string> = {
      [BASICS_VALIDATION_KEYS.MISSING_NAME]: 'Le nom est requis',
      [BASICS_VALIDATION_KEYS.NAME_TOO_LONG]: 'Le nom ne doit pas dépasser 100 caractères',
      [BASICS_VALIDATION_KEYS.MISSING_EMAIL]: 'L\'email est requis',
    };

    return defaultMessages[key] || key;
  }

  exists(_key: string): boolean {
    return true; // Optimistic response to avoid errors
  }
}

// Create a singleton instance for default adapter
const defaultI18nAdapter = new DefaultBasicsI18nAdapter();

/**
 * Basics entity representing the personal information in a CV
 * Applies domain rules and ensures data integrity
 */
export class Basics {
  /**
   * Private constructor to enforce use of factory method
   */
  private constructor(
    private readonly _name: string,
    private readonly _email: Email,
    private readonly _phone: Phone | null,
    private readonly _label: string | null,
    private readonly _url: Url | null,
    private readonly _image: Url | null,
    private readonly _summary: string | null,
    private readonly _location: LocationInterface | null,
    private readonly _profiles: ProfileInterface[]
  ) {}

  /**
   * Factory method to create a validated instance of Basics
   * @param data Raw data for basic information
   * @param i18n Internationalization adapter
   * @returns Object containing validation result and possibly the Basics instance
   */
  static create(
    data: Partial<BasicsInterface>, 
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): BasicsValidationResultType {
    console.log('=== Domain Layer - Basics Entity ===');
    console.log('Creating Basics from data:', data);
    
    const errors: ValidationErrorInterface[] = [];
    const warnings: ValidationErrorInterface[] = [];
    
    // Validate name (required field)
    if (!data.name || data.name.trim() === '') {
      errors.push({
        code: 'missing_name',
        message: i18n.translate(BASICS_VALIDATION_KEYS.MISSING_NAME),
        i18nKey: BASICS_VALIDATION_KEYS.MISSING_NAME,
        field: 'name',
        severity: 'error',
        layer: ValidationLayerType.DOMAIN,
        suggestion: 'Veuillez entrer votre nom complet'
      });
    } else if (data.name.length > 100) {
      errors.push({
        code: 'name_too_long',
        message: i18n.translate(BASICS_VALIDATION_KEYS.NAME_TOO_LONG),
        i18nKey: BASICS_VALIDATION_KEYS.NAME_TOO_LONG,
        field: 'name',
        severity: 'error',
        layer: ValidationLayerType.DOMAIN
      });
    }
    
    // Validate email with Email value object
    let emailObj: Email | null = null;
    if (data.email) {
      const emailResult = Email.create(data.email, i18n);
      if (!emailResult.success) {
        errors.push(...emailResult.error);
      } else {
        emailObj = emailResult.value;
        // Add warnings if any
        if (emailResult.warnings) {
          warnings.push(...emailResult.warnings);
        }
      }
    } else {
      errors.push({
        code: 'missing_email',
        message: i18n.translate(BASICS_VALIDATION_KEYS.MISSING_EMAIL),
        i18nKey: BASICS_VALIDATION_KEYS.MISSING_EMAIL,
        field: 'email',
        severity: 'error',
        layer: ValidationLayerType.DOMAIN,
        suggestion: 'Veuillez fournir une adresse email valide'
      });
    }
    
    // Validate phone with Phone value object (if provided)
    let phoneObj: Phone | null = null;
    if (data.phone) {
      const phoneResult = Phone.createWithResultType(data.phone, i18n);
      if (!phoneResult.success) {
        errors.push(...phoneResult.error);
      } else {
        phoneObj = phoneResult.value;
      }
    }
    
    // Validate URL with Url value object (if provided)
    let urlObj: Url | null = null;
    if (data.url) {
      const urlResult = Url.create(data.url, i18n);
      if (!urlResult.success) {
        errors.push(...urlResult.error);
      } else {
        urlObj = urlResult.value;
        // Add warnings if any
        if (urlResult.warnings) {
          warnings.push(...urlResult.warnings);
        }
      }
    }
    
    // Validate image URL with Url value object (if provided)
    let imageObj: Url | null = null;
    if (data.image) {
      const imageResult = Url.create(data.image, i18n);
      if (!imageResult.success) {
        errors.push(...imageResult.error);
      } else {
        imageObj = imageResult.value;
        // Add warnings if any
        if (imageResult.warnings) {
          warnings.push(...imageResult.warnings);
        }
      }
    }
    
    // If there are errors, return failure
    if (errors.length > 0) {
      return createFailure(errors);
    }
    
    // Create the entity with validated data
    const entity = new Basics(
      data.name!,
      emailObj!,
      phoneObj,
      data.label || null,
      urlObj,
      imageObj,
      data.summary || null,
      data.location || null,
      data.profiles || []
    );
    
    // If there are warnings, return success with warnings
    if (warnings.length > 0) {
      const result = createSuccessWithWarnings({
        name: entity.name,
        email: entity.email,
        ...(entity.phone ? { phone: entity.phone } : {}),
        ...(entity.label ? { label: entity.label } : {}),
        ...(entity.url ? { url: entity.url } : {}),
        ...(entity.image ? { image: entity.image } : {}),
        ...(entity.summary ? { summary: entity.summary } : {}),
        ...(entity.location ? { location: entity.location } : {}),
        profiles: entity.profiles
      }, warnings);
      
      // Attach the entity to the result for domain operations
      return { ...result, entity };
    }
    
    // Otherwise, return success
    const result = createSuccess({
      name: entity.name,
      email: entity.email,
      ...(entity.phone ? { phone: entity.phone } : {}),
      ...(entity.label ? { label: entity.label } : {}),
      ...(entity.url ? { url: entity.url } : {}),
      ...(entity.image ? { image: entity.image } : {}),
      ...(entity.summary ? { summary: entity.summary } : {}),
      ...(entity.location ? { location: entity.location } : {}),
      profiles: entity.profiles
    });
    
    // Attach the entity to the result for domain operations
    return { ...result, entity };
  }
  
  /**
   * Validate just one field of the Basics entity
   * @param data The basics data
   * @param field The field to validate
   * @param i18n Internationalization adapter
   * @returns Validation result for the specific field
   */
  static validateField(
    data: Partial<BasicsInterface>, 
    field: keyof BasicsInterface,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ResultType<unknown> {
    switch (field) {
      case 'name':
        if (!data.name || data.name.trim() === '') {
          return createFailure([{
            code: 'missing_name',
            message: i18n.translate(BASICS_VALIDATION_KEYS.MISSING_NAME),
            i18nKey: BASICS_VALIDATION_KEYS.MISSING_NAME,
            field: 'name',
            severity: 'error',
            layer: ValidationLayerType.DOMAIN,
            suggestion: 'Veuillez entrer votre nom complet'
          }]);
        } else if (data.name.length > 100) {
          return createFailure([{
            code: 'name_too_long',
            message: i18n.translate(BASICS_VALIDATION_KEYS.NAME_TOO_LONG),
            i18nKey: BASICS_VALIDATION_KEYS.NAME_TOO_LONG,
            field: 'name',
            severity: 'error',
            layer: ValidationLayerType.DOMAIN
          }]);
        }
        return createSuccess(data.name);
        
      case 'email':
        if (!data.email) {
          return createFailure([{
            code: 'missing_email',
            message: i18n.translate(BASICS_VALIDATION_KEYS.MISSING_EMAIL),
            i18nKey: BASICS_VALIDATION_KEYS.MISSING_EMAIL,
            field: 'email',
            severity: 'error',
            layer: ValidationLayerType.DOMAIN,
            suggestion: 'Veuillez fournir une adresse email valide'
          }]);
        }
        return Email.create(data.email, i18n);
        
      case 'phone':
        if (!data.phone) {
          return createSuccess(null);
        }
        return Phone.createWithResultType(data.phone, i18n);
        
      case 'url':
        if (!data.url) {
          return createSuccess(null);
        }
        return Url.create(data.url, i18n);
        
      case 'image':
        if (!data.image) {
          return createSuccess(null);
        }
        return Url.create(data.image, i18n);
        
      default:
        // For other fields that don't have specific validation
        return createSuccess(data[field] || null);
    }
  }
  
  /**
   * Create a new instance with modified properties
   * Immutable pattern for modifications
   * @param props Properties to modify
   * @returns Validation result with the new instance or errors
   */
  update(props: Partial<BasicsInterface>): BasicsValidationResultType {
    // Merge current data with new properties
    const updatedData: Partial<BasicsInterface> = {
      name: props.name !== undefined ? props.name : this.name,
      email: props.email !== undefined ? props.email : this.email,
      phone: props.phone !== undefined ? props.phone : this.phone,
      label: props.label !== undefined ? props.label : this.label,
      url: props.url !== undefined ? props.url : this.url,
      image: props.image !== undefined ? props.image : this.image,
      summary: props.summary !== undefined ? props.summary : this.summary,
      location: props.location !== undefined ? props.location : this.location,
      profiles: props.profiles !== undefined ? props.profiles : this.profiles
    };
    
    // Use factory method to validate the new data
    return Basics.create(updatedData);
  }
  
  // Getters for immutable access to properties
  
  get name(): string {
    return this._name;
  }
  
  get email(): string {
    return this._email.getValue();
  }
  
  get emailObj(): Email {
    return this._email;
  }
  
  get phone(): string | undefined {
    return this._phone ? this._phone.getValue() : undefined;
  }
  
  get phoneObj(): Phone | null {
    return this._phone;
  }
  
  get label(): string | undefined {
    return this._label || undefined;
  }
  
  get url(): string | undefined {
    return this._url ? this._url.getValue() : undefined;
  }
  
  get urlObj(): Url | null {
    return this._url;
  }
  
  get image(): string | undefined {
    return this._image ? this._image.getValue() : undefined;
  }
  
  get imageObj(): Url | null {
    return this._image;
  }
  
  get summary(): string | undefined {
    return this._summary || undefined;
  }
  
  get location(): LocationInterface | undefined {
    return this._location ? { ...this._location } : undefined;
  }
  
  get profiles(): ProfileInterface[] {
    return [...this._profiles];
  }
  
  /**
   * Convert the Basics entity to a JSON object
   * @returns BasicsInterface - A structured object that follows the schema
   */
  toJSON(): BasicsInterface {
    return {
      name: this.name,
      email: this.email,
      ...(this.phone ? { phone: this.phone } : {}),
      ...(this.label ? { label: this.label } : {}),
      ...(this.url ? { url: this.url } : {}),
      ...(this.image ? { image: this.image } : {}),
      ...(this.summary ? { summary: this.summary } : {}),
      ...(this.location ? { location: this.location } : {}),
      profiles: this.profiles
    };
  }
} 
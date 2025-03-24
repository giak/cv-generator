/**
 * Basics entity representing the basic information in a CV
 * Implements the principles of Domain-Driven Design with rich domain logic
 */

import type { BasicsInterface, LocationInterface, ProfileInterface } from '@cv-generator/shared/src/types/resume.interface';
import {
  ResultTypeInterface,
  ValidationErrorInterface,
  ValidationLayerType,
  createSuccess,
  createFailure,
  ERROR_CODES,
  TRANSLATION_KEYS,
  Success,
  Failure
} from '@cv-generator/shared';
import { Email } from '../value-objects/email.value-object';
import { Phone } from '../value-objects/phone.value-object';
import { Url } from '../value-objects/url.value-object';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

/**
 * Type standard pour les résultats de l'entité Basics
 * Conforme au pattern ResultTypeInterface standardisé
 */
export type BasicsResultType = ResultTypeInterface<BasicsInterface> & { 
  entity?: Basics,
  warnings?: ValidationErrorInterface[]
};

/**
 * Classes d'implémentation pour BasicsResultType
 */
export class BasicsSuccess extends Success<BasicsInterface> implements BasicsResultType {
  public readonly entity: Basics;
  
  constructor(basics: Basics) {
    super(basics.toJSON());
    this.entity = basics;
  }
}

export class BasicsSuccessWithWarnings extends Success<BasicsInterface> implements BasicsResultType {
  public readonly entity: Basics;
  public readonly warnings: ValidationErrorInterface[];
  
  constructor(basics: Basics, warnings: ValidationErrorInterface[]) {
    super(basics.toJSON());
    this.entity = basics;
    this.warnings = warnings;
  }
}

export class BasicsFailure extends Failure<BasicsInterface> implements BasicsResultType {
  public readonly entity?: undefined;
  
  constructor(errors: ValidationErrorInterface[]) {
    super(errors);
  }
}

/**
 * Type pour les données de validation de l'entité Basics
 * @deprecated Utilisez BasicsResultType avec ResultTypeInterface à la place
 */
export type BasicsValidationResultType = BasicsResultType;

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
    private readonly _profiles: ProfileInterface[],
    private readonly _i18n: DomainI18nPortInterface
  ) {}

  /**
   * Factory method to create a validated instance of Basics
   * @param data Raw data for basic information
   * @param i18n Internationalization adapter
   * @returns ResultTypeInterface containing either the Basics data if successful, or errors
   */
  static createWithResultType(
    data: Partial<BasicsInterface>, 
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): BasicsResultType {
    const errors: ValidationErrorInterface[] = [];
    const warnings: ValidationErrorInterface[] = [];
    
    // Validate name (required field)
    if (!data.name || data.name.trim() === '') {
      errors.push({
        code: ERROR_CODES.RESUME.BASICS.MISSING_NAME,
        message: i18n.translate(BASICS_VALIDATION_KEYS.MISSING_NAME),
        i18nKey: BASICS_VALIDATION_KEYS.MISSING_NAME,
        field: 'name',
        severity: 'error',
        layer: ValidationLayerType.DOMAIN,
        suggestion: 'Veuillez entrer votre nom complet'
      });
    } else if (data.name.length > 100) {
      errors.push({
        code: ERROR_CODES.COMMON.TOO_LONG,
        message: i18n.translate(BASICS_VALIDATION_KEYS.NAME_TOO_LONG),
        i18nKey: BASICS_VALIDATION_KEYS.NAME_TOO_LONG,
        field: 'name',
        severity: 'error',
        layer: ValidationLayerType.DOMAIN
      });
    }
    
    // Validate email with Email value object
    let emailObj: Email | null = null;
    if (!data.email) {
      errors.push({
        code: ERROR_CODES.RESUME.BASICS.MISSING_EMAIL,
        message: i18n.translate(BASICS_VALIDATION_KEYS.MISSING_EMAIL),
        i18nKey: BASICS_VALIDATION_KEYS.MISSING_EMAIL,
        field: 'email',
        severity: 'error',
        layer: ValidationLayerType.DOMAIN
      });
    } else {
      const emailResult = Email.create(data.email, i18n);
      if (emailResult.isSuccess()) {
        emailObj = emailResult.getValue();
        // Collect warnings from email validation
        if (emailResult.hasWarnings()) {
          warnings.push(...emailResult.getWarnings());
        }
      } else {
        errors.push(...emailResult.getErrors());
      }
    }
    
    // Validate phone (optional)
    let phoneObj: Phone | null = null;
    if (data.phone) {
      const phoneResult = Phone.createWithResultType(data.phone, i18n);
      if (phoneResult.isSuccess()) {
        phoneObj = phoneResult.getValue();
        // Collect warnings from phone validation
        if (phoneResult.hasWarnings()) {
          warnings.push(...phoneResult.getWarnings());
        }
      } else {
        errors.push(...phoneResult.getErrors());
      }
    }
    
    // Validate URL (optional)
    let urlObj: Url | null = null;
    if (data.url) {
      const urlResult = Url.create(data.url, 'website', i18n);
      if (urlResult.isSuccess()) {
        urlObj = urlResult.getValue();
        // Collect warnings from URL validation
        if (urlResult.hasWarnings()) {
          warnings.push(...urlResult.getWarnings());
        }
      } else {
        errors.push(...urlResult.getErrors());
      }
    }
    
    // Validate image URL (optional)
    let imageObj: Url | null = null;
    if (data.image) {
      const imageResult = Url.create(data.image, 'image', i18n);
      if (imageResult.isSuccess()) {
        imageObj = imageResult.getValue();
        // Collect warnings from image validation
        if (imageResult.hasWarnings()) {
          warnings.push(...imageResult.getWarnings());
        }
      } else {
        errors.push(...imageResult.getErrors());
      }
    }
    
    // If there are validation errors, return failure
    if (errors.length > 0) {
      return new BasicsFailure([...errors, ...warnings]);
    }
    
    // Create a new Basics instance with the validated data
    const basics = new Basics(
      data.name!,  // Safe because we validated it's not empty
      emailObj!,   // Safe because we validated it
      phoneObj,    // Optional
      data.label || null,
      urlObj,      // Optional
      imageObj,    // Optional
      data.summary || null,
      data.location || null,
      data.profiles || [],
      i18n
    );
    
    // Return success with the entity (with warnings if any)
    if (warnings.length > 0) {
      return new BasicsSuccessWithWarnings(basics, warnings);
    } else {
      return new BasicsSuccess(basics);
    }
  }

  /**
   * Factory method to create a validated instance of Basics
   * @param data Raw data for basic information
   * @param i18n Internationalization adapter
   * @returns ResultTypeInterface containing either the Basics data if successful, or errors
   * @deprecated Use createWithResultType instead, which returns a standardized ResultTypeInterface
   */
  static create(
    data: Partial<BasicsInterface>, 
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): BasicsResultType {
    return this.createWithResultType(data, i18n);
  }
  
  /**
   * Validates a specific field from Basics data
   * @param data The basics data containing the field to validate
   * @param field The specific field to validate
   * @param i18n Internationalization adapter
   * @returns ResultTypeInterface containing the validation result
   */
  static validateField(
    data: Partial<BasicsInterface>, 
    field: keyof BasicsInterface,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ResultTypeInterface<unknown> {
    switch (field) {
      case 'name':
        if (!data.name || data.name.trim() === '') {
          return createFailure([{
            code: ERROR_CODES.RESUME.BASICS.MISSING_NAME,
            message: i18n.translate(BASICS_VALIDATION_KEYS.MISSING_NAME),
            i18nKey: BASICS_VALIDATION_KEYS.MISSING_NAME,
            field: 'name',
            severity: 'error',
            layer: ValidationLayerType.DOMAIN
          }]);
        }
        return createSuccess(data.name);
      
      case 'email':
        if (!data.email) {
          return createFailure([{
            code: ERROR_CODES.RESUME.BASICS.MISSING_EMAIL,
            message: i18n.translate(BASICS_VALIDATION_KEYS.MISSING_EMAIL),
            i18nKey: BASICS_VALIDATION_KEYS.MISSING_EMAIL,
            field: 'email',
            severity: 'error',
            layer: ValidationLayerType.DOMAIN
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
        return Url.create(data.url, 'website', i18n);
      
      case 'image':
        if (!data.image) {
          return createSuccess(null);
        }
        return Url.create(data.image, 'image', i18n);
      
      // Default case for other fields
      default:
        return createSuccess(data[field] ?? null);
    }
  }
  
  /**
   * Creates a new instance with modified properties using the standardized ResultType pattern
   * Implements immutable pattern for modifications
   * @param props Properties to modify
   * @returns ResultTypeInterface containing either the updated Basics if successful, or errors
   */
  updateWithResultType(props: Partial<BasicsInterface>): BasicsResultType {
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
    
    // Use factory method to validate new data
    return Basics.createWithResultType(updatedData, this._i18n);
  }

  /**
   * Creates a new instance with modified properties
   * Implements immutable pattern for modifications
   * @param props Properties to modify
   * @returns Validation result with new instance or errors
   * @deprecated Use updateWithResultType instead, which returns a standardized ResultTypeInterface
   */
  update(props: Partial<BasicsInterface>): BasicsResultType {
    return this.updateWithResultType(props);
  }
  
  // Getters for properties
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
    return this._phone?.getValue();
  }
  
  get phoneObj(): Phone | null {
    return this._phone;
  }
  
  get label(): string | undefined {
    return this._label || undefined;
  }
  
  get url(): string | undefined {
    return this._url?.getValue();
  }
  
  get urlObj(): Url | null {
    return this._url;
  }
  
  get image(): string | undefined {
    return this._image?.getValue();
  }
  
  get imageObj(): Url | null {
    return this._image;
  }
  
  get summary(): string | undefined {
    return this._summary || undefined;
  }
  
  get location(): LocationInterface | undefined {
    return this._location || undefined;
  }
  
  get profiles(): ProfileInterface[] {
    return [...this._profiles]; // Defensive copy
  }
  
  
  /**
   * Converts entity to plain object conforming to BasicsInterface
   * @returns Object representing basics information
   */
  toJSON(): BasicsInterface {
    return {
      name: this.name,
      email: this.email,
      ...(this.phone && { phone: this.phone }),
      ...(this.label && { label: this.label }),
      ...(this.url && { url: this.url }),
      ...(this.image && { image: this.image }),
      ...(this.summary && { summary: this.summary }),
      ...(this.location && { location: this.location }),
      profiles: this.profiles
    };
  }
} 
import {
    ResultTypeInterface,
    ValidationErrorInterface,
    ValidationLayerType,
    ERROR_CODES,
    isSuccess,
    Success,
    Failure
} from '@cv-generator/shared';
import { Email } from '../../../cv/domain/value-objects/email.value-object';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

// Type standard pour les résultats de l'entité User
export type UserResultType = ResultTypeInterface<User> & { 
  entity?: User 
};

// Classes d'implémentation pour UserResultType
export class UserSuccess extends Success<User> implements UserResultType {
  public readonly entity: User;
  
  constructor(user: User) {
    super(user);
    this.entity = user;
  }
}

export class UserFailure extends Failure<User> implements UserResultType {
  public readonly entity?: undefined;
  
  constructor(errors: ValidationErrorInterface[]) {
    super(errors);
  }
}

// Export validation keys for User entity
export const USER_VALIDATION_KEYS = {
  MISSING_NAME: 'user.validation.missingName',
  NAME_TOO_SHORT: 'user.validation.nameTooShort',
  INVALID_EMAIL: 'user.validation.invalidEmail'
};

/**
 * Default i18n adapter for backwards compatibility
 */
export class DefaultUserI18nAdapter implements DomainI18nPortInterface {
  translate(key: string, _params?: Record<string, unknown>): string {
    const defaultMessages: Record<string, string> = {
      [USER_VALIDATION_KEYS.MISSING_NAME]: 'Le nom est requis',
      [USER_VALIDATION_KEYS.NAME_TOO_SHORT]: 'Le nom doit contenir au moins 2 caractères',
      [USER_VALIDATION_KEYS.INVALID_EMAIL]: 'Email invalide'
    };

    return defaultMessages[key] || key;
  }

  exists(_key: string): boolean {
    return true; // Optimistic response to avoid errors
  }
}

// Create a singleton instance for default adapter
const defaultI18nAdapter = new DefaultUserI18nAdapter();

/**
 * User entity representing a system user
 */
export class User {
  private constructor(
    private readonly id: string,
    private email: Email,
    private name: string,
    private preferences: Record<string, unknown> = {}
  ) {}
  
  /**
   * Create a new user with standardized ResultType pattern
   * @param id Unique identifier for the user
   * @param email User's email
   * @param name User's name
   * @param i18n Internationalization adapter
   * @returns ResultTypeInterface containing either the User if successful, or errors
   */
  public static createWithResultType(
    id: string, 
    email: string, 
    name: string,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): UserResultType {
    const errors: ValidationErrorInterface[] = [];

    // Validate name
    if (!name || name.trim() === '') {
      errors.push({
        code: ERROR_CODES.COMMON.REQUIRED_FIELD,
        message: i18n.translate(USER_VALIDATION_KEYS.MISSING_NAME),
        i18nKey: USER_VALIDATION_KEYS.MISSING_NAME,
        field: 'name',
        severity: 'error',
        layer: ValidationLayerType.DOMAIN
      });
    } else if (name.trim().length < 2) {
      errors.push({
        code: ERROR_CODES.COMMON.TOO_SHORT,
        message: i18n.translate(USER_VALIDATION_KEYS.NAME_TOO_SHORT),
        i18nKey: USER_VALIDATION_KEYS.NAME_TOO_SHORT,
        field: 'name',
        severity: 'error',
        layer: ValidationLayerType.DOMAIN
      });
    }

    // Validate email with Email value object
    const emailResult = Email.create(email, i18n);
    if (emailResult.isFailure()) {
      errors.push(...emailResult.getErrors());
    }

    // If there are errors, return failure
    if (errors.length > 0) {
      return new UserFailure(errors);
    }

    // Create the entity with validated data
    const entity = new User(id, emailResult.getValue(), name.trim());
    
    // Return success with entity
    return new UserSuccess(entity);
  }
  
  /**
   * Create a new user
   * @deprecated Use createWithResultType instead, which returns a standardized ResultTypeInterface
   * @param id Unique identifier for the user
   * @param email User's email
   * @param name User's name
   * @returns User instance
   * @throws Error if email is invalid
   */
  public static create(id: string, email: string, name: string): User {
    const emailResult = Email.create(email);
    if (!isSuccess(emailResult)) {
      throw new Error(`Invalid email: ${email}`);
    }
    return new User(id, emailResult.getValue(), name);
  }
  
  /**
   * Get the user's ID
   */
  public getId(): string {
    return this.id;
  }
  
  /**
   * Get the user's email
   */
  public getEmail(): Email {
    return this.email;
  }
  
  /**
   * Get the user's name
   */
  public getName(): string {
    return this.name;
  }
  
  /**
   * Update the user's name with validation
   * @param name New name for the user
   * @param i18n Internationalization adapter
   * @returns UserResultType with success or failure
   */
  public updateNameWithResultType(
    name: string,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): UserResultType {
    // Validate name
    if (!name || name.trim() === '') {
      return new UserFailure([{
        code: ERROR_CODES.COMMON.REQUIRED_FIELD,
        message: i18n.translate(USER_VALIDATION_KEYS.MISSING_NAME),
        i18nKey: USER_VALIDATION_KEYS.MISSING_NAME,
        field: 'name',
        severity: 'error',
        layer: ValidationLayerType.DOMAIN
      }]);
    } else if (name.trim().length < 2) {
      return new UserFailure([{
        code: ERROR_CODES.COMMON.TOO_SHORT,
        message: i18n.translate(USER_VALIDATION_KEYS.NAME_TOO_SHORT),
        i18nKey: USER_VALIDATION_KEYS.NAME_TOO_SHORT,
        field: 'name',
        severity: 'error',
        layer: ValidationLayerType.DOMAIN
      }]);
    }
    
    // Update name and return success
    this.name = name.trim();
    return new UserSuccess(this);
  }
  
  /**
   * Update the user's name
   * @deprecated Use updateNameWithResultType instead, which returns a standardized ResultTypeInterface
   * @param name New name for the user
   */
  public updateName(name: string): void {
    this.name = name;
  }
  
  /**
   * Update the user's email with validation
   * @param email New email object for the user
   * @returns UserResultType with success or failure
   */
  public updateEmailWithResultType(email: Email): UserResultType {
    this.email = email;
    return new UserSuccess(this);
  }
  
  /**
   * Update the user's email
   * @deprecated Use updateEmailWithResultType instead, which returns a standardized ResultTypeInterface
   * @param email New email object for the user
   */
  public updateEmail(email: Email): void {
    this.email = email;
  }
  
  /**
   * Get all user preferences
   */
  public getPreferences(): Record<string, unknown> {
    return { ...this.preferences };
  }
  
  /**
   * Get a specific preference
   */
  public getPreference<T>(key: string, defaultValue: T): T {
    return (this.preferences[key] as T) ?? defaultValue;
  }
  
  /**
   * Set a user preference
   */
  public setPreference(key: string, value: unknown): void {
    this.preferences = {
      ...this.preferences,
      [key]: value
    };
  }
} 
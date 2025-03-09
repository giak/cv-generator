import { Email } from '../../../cv/domain/value-objects/email.value-object';
import { isSuccess } from '@cv-generator/shared';

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
   * Create a new user
   */
  public static create(id: string, email: string, name: string): User {
    const emailResult = Email.create(email);
    if (!isSuccess(emailResult)) {
      throw new Error(`Invalid email: ${email}`);
    }
    return new User(id, emailResult.value, name);
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
   * Update the user's name
   */
  public updateName(name: string): void {
    this.name = name;
  }
  
  /**
   * Update the user's email
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
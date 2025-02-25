/**
 * Error thrown when validation fails in any layer of the application
 */
export class ValidationError extends Error {
  /**
   * Create a new ValidationError
   * 
   * @param errors List of validation error messages
   * @param message General error message
   */
  constructor(public readonly errors: string[], message: string = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
  }
} 
import { ValidationError } from '../../domain/errors/ValidationError';
import { ErrorInfo, ErrorMapper } from './ErrorMappingService';

/**
 * Application error mapper that handles errors at the application layer
 * This mapper transforms application-level errors into user-friendly messages
 */
export class ApplicationErrorMapper implements ErrorMapper {
  /**
   * Map an application error to a user-friendly error info object
   * 
   * @param error The application error to map
   * @returns A user-friendly error info object
   */
  map(error: Error): ErrorInfo {
    // Handle specific application errors
    if (error instanceof ValidationError) {
      return {
        id: this.generateId(),
        message: error.message,
        timestamp: Date.now(),
        severity: 'error',
        source: 'application',
        dismissed: false
      };
    }
    
    // Default error handling
    return {
      id: this.generateId(),
      message: `Application error: ${error.message}`,
      timestamp: Date.now(),
      severity: 'error',
      source: 'application',
      dismissed: false
    };
  }
  
  /**
   * Generate a unique ID for an error
   */
  private generateId(): string {
    return Date.now() + '-' + Math.random().toString(36).substring(2, 11);
  }
} 
import { ValidationError } from '../../domain/errors/ValidationError';

/**
 * Type describing an error mapping configuration
 */
export type ErrorMapping = {
  code: string;
  userMessage: string;
  severity: "info" | "warning" | "error";
  field?: string;
  action?: ErrorAction;
};

/**
 * Type for error action configuration
 */
export type ErrorAction = {
  label: string;
  handler: string;
  params?: Record<string, unknown>;
};

/**
 * Type for a user-friendly error info object
 */
export type ErrorInfo = {
  id: string;
  message: string;
  timestamp: number;
  severity: "info" | "warning" | "error";
  source: "infrastructure" | "application" | "domain" | "ui";
  field?: string;
  action?: ErrorAction;
  dismissed: boolean;
};

/**
 * Interface for an error mapper from any layer
 */
export interface ErrorMapper {
  map(error: Error): ErrorInfo;
}

/**
 * Service for mapping errors from different layers to user-friendly formats
 * This service coordinates error mapping across the application
 */
export class ErrorMappingService {
  private errorMappers: Map<string, ErrorMapper> = new Map();

  /**
   * Register an error mapper for a specific source
   * 
   * @param source The source layer of the errors this mapper handles
   * @param mapper The mapper implementation
   */
  registerMapper(source: 'infrastructure' | 'application' | 'domain', mapper: ErrorMapper): void {
    this.errorMappers.set(source, mapper);
  }

  /**
   * Map an error to user-friendly format
   * This method attempts to determine the error source and use the appropriate mapper
   * 
   * @param error The error to map
   * @returns A user-friendly error info object
   */
  mapError(error: Error): ErrorInfo {
    let source: 'infrastructure' | 'application' | 'domain' = 'application';
    
    // Determine source from error type
    if (error.name?.includes('Storage') || error.name?.includes('Repository')) {
      source = 'infrastructure';
    } else if (error instanceof ValidationError) {
      source = 'domain';
    }
    
    // Get the appropriate mapper
    const mapper = this.errorMappers.get(source);
    
    if (mapper) {
      return mapper.map(error);
    }
    
    // Default error mapping if no mapper is available
    return this.createDefaultErrorInfo(error, source);
  }

  /**
   * Create a default error info when no specific mapper is available
   * 
   * @param error The original error
   * @param source The determined source of the error
   * @returns A basic error info object
   */
  private createDefaultErrorInfo(error: Error, source: 'infrastructure' | 'application' | 'domain'): ErrorInfo {
    return {
      id: this.generateId(),
      message: `An error occurred: ${error.message}`,
      timestamp: Date.now(),
      severity: 'error',
      source,
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
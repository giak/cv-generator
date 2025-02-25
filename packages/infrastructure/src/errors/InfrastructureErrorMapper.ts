import { StorageError, StorageValidationError } from "../repositories/LocalStorageResumeRepository";

/**
 * Interface describing an error mapping configuration
 */
export interface ErrorMapping {
  code: string;
  userMessage: string;
  severity: "info" | "warning" | "error";
  field?: string;
  action?: ErrorAction;
}

/**
 * Interface for error action configuration
 */
export interface ErrorAction {
  label: string;
  handler: string;
  params?: Record<string, unknown>;
}

/**
 * Interface for a user-friendly error info object
 */
export interface ErrorInfo {
  id: string;
  message: string;
  timestamp: number;
  severity: "info" | "warning" | "error";
  source: "infrastructure" | "application" | "domain" | "ui";
  field?: string;
  action?: ErrorAction;
  dismissed: boolean;
}

/**
 * Converts infrastructure layer errors to user-friendly error information
 * that can be displayed in the UI.
 */
export class InfrastructureErrorMapper {
  /**
   * Map of error types to their user-friendly configurations
   */
  private errorMap: Record<string, ErrorMapping> = {
    // Storage validation errors
    StorageValidationError: {
      code: "STORAGE_VALIDATION",
      userMessage: "Some of your data could not be saved due to validation issues",
      severity: "error",
    },
    // Generic storage errors
    StorageError: {
      code: "STORAGE_OPERATION",
      userMessage: "Unable to save your changes. Please try again later",
      severity: "error",
      action: {
        label: "Try Again",
        handler: "resume/retryLastOperation",
      },
    },
    // Field-specific error mappings
    "STORAGE_VALIDATION:basics.name": {
      code: "FIELD_REQUIRED",
      userMessage: "Name is required",
      severity: "error",
      field: "basics.name",
    },
    "STORAGE_VALIDATION:basics.email": {
      code: "FIELD_INVALID",
      userMessage: "Please enter a valid email address",
      severity: "error",
      field: "basics.email",
    },
    // Default error
    GenericError: {
      code: "UNKNOWN_ERROR",
      userMessage: "An unexpected error occurred",
      severity: "error",
    }
  };

  /**
   * Generate a unique ID for an error
   */
  private generateUniqueId(): string {
    return Date.now() + '-' + Math.random().toString(36).substring(2, 11);
  }

  /**
   * Maps an infrastructure error to a user-friendly error info object
   * 
   * @param error The infrastructure error to map
   * @returns A user-friendly error info object
   */
  public map(error: Error): ErrorInfo {
    // Check if we have specific field errors for validation errors
    if (error instanceof StorageValidationError) {
      // For validation errors, we can extract field information
      const fieldErrors: ErrorInfo[] = error.errors.map(errorMsg => {
        // Extract field name from error message
        const match = errorMsg.match(/^([^:]+):/);
        const field = match ? match[1] : undefined;
        
        // Try to find a specific mapping for this field error
        const specificKey = `STORAGE_VALIDATION:${field}`;
        const mapping = this.errorMap[specificKey] || this.errorMap.StorageValidationError;
        
        return {
          id: this.generateUniqueId(),
          message: mapping.userMessage,
          severity: mapping.severity,
          source: "infrastructure",
          field: field || mapping.field,
          action: mapping.action,
          timestamp: Date.now(),
          dismissed: false,
        };
      });
      
      // If we have multiple field errors, return the first one
      // (The UI can handle showing multiple errors if needed)
      return fieldErrors.length > 0 ? fieldErrors[0] : this.createGenericError();
    }
    
    // Handle other error types
    const errorType = error.constructor.name;
    const mapping = this.errorMap[errorType] || this.errorMap.GenericError;

    return {
      id: this.generateUniqueId(),
      message: mapping.userMessage,
      severity: mapping.severity,
      source: "infrastructure", 
      field: mapping.field,
      action: mapping.action,
      timestamp: Date.now(),
      dismissed: false,
    };
  }

  /**
   * Creates a generic error info object
   */
  private createGenericError(): ErrorInfo {
    const mapping = this.errorMap.GenericError;
    return {
      id: this.generateUniqueId(),
      message: mapping.userMessage,
      severity: mapping.severity,
      source: "infrastructure",
      timestamp: Date.now(),
      dismissed: false,
    };
  }
} 
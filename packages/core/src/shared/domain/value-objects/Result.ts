/**
 * Generic result object for operations that can succeed or fail
 * with a typed result and error messages
 */
export class Result<T> {
  public readonly isValid: boolean;
  public readonly errors: string[];
  public readonly value?: T;

  private constructor(isValid: boolean, errors: string[] = [], value?: T) {
    this.isValid = isValid;
    this.errors = errors;
    this.value = value;
  }

  /**
   * Create a successful result
   */
  public static success<T>(value: T): Result<T> {
    return new Result<T>(true, [], value);
  }

  /**
   * Create a failed result
   */
  public static failure<T>(errors: string[]): Result<T> {
    return new Result<T>(false, errors);
  }
} 
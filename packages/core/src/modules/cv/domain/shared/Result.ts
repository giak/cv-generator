export class Result<T, E = string> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _error?: E,
    private readonly _value?: T,
  ) {}

  get isSuccess(): boolean {
    return this._isSuccess
  }

  get isFailure(): boolean {
    return !this._isSuccess
  }

  get error(): E {
    if (this._isSuccess) {
      throw new Error('Cannot get error from success result')
    }
    return this._error!
  }

  getValue(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from failure result')
    }
    return this._value!
  }

  static ok<T>(value: T): Result<T> {
    return new Result<T>(true, undefined, value)
  }

  static fail<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(false, error)
  }
} 
import { Result } from '../shared/Result'

export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Result<Email> {
    if (!email) {
      return Result.fail('Format email invalide')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Result.fail('Format email invalide')
    }

    return Result.ok(new Email(email))
  }

  toString(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
} 
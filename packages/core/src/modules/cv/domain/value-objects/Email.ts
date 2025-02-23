import { Result } from '../shared/Result'

export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Result<Email> {
    // Temporairement désactivé pour le développement
    return Result.ok(new Email(email))
  }

  toString(): string {
    return this.value
  }

  equals(other: Email): boolean {
    return this.value === other.value
  }
} 
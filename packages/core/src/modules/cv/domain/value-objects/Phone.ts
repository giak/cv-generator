import { Result } from '../shared/Result'

export class Phone {
  private constructor(private readonly value: string) {}

  static create(phone: string): Result<Phone> {
    if (!phone) {
      return Result.fail('Format de téléphone invalide')
    }

    const cleanedPhone = phone.replace(/[\s.-]/g, '')
    const phoneRegex = /^(?:\+\d{2}|0)\d{9}$/
    if (!phoneRegex.test(cleanedPhone)) {
      return Result.fail('Format de téléphone invalide')
    }

    return Result.ok(new Phone(cleanedPhone))
  }

  format(): string {
    // Supprime les espaces et regroupe par 2 chiffres
    const cleaned = this.value.replace(/\s/g, '')
    const match = cleaned.match(/^(\+?\d{2})?(\d{2})(\d{2})(\d{2})(\d{2})/)
    if (!match) return this.value
    return match.slice(1).filter(Boolean).join(' ')
  }

  toString(): string {
    return this.value
  }

  equals(other: Phone): boolean {
    // Compare les numéros en ignorant les espaces
    return this.value.replace(/\s/g, '') === other.value.replace(/\s/g, '')
  }
} 
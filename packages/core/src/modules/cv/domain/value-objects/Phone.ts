import { Result } from '../shared/Result'

export class Phone {
  private constructor(private readonly value: string) {}

  static create(phone: string): Result<Phone> {
    if (!phone) {
      return Result.fail('Format de téléphone invalide')
    }

    // Accepte uniquement les chiffres, espaces et +
    const phoneRegex = /^[0-9\s+]+$/
    if (!phoneRegex.test(phone)) {
      return Result.fail('Format de téléphone invalide')
    }

    // Vérifie qu'il y a au moins 10 chiffres
    const digitsCount = phone.replace(/[^\d]/g, '').length
    if (digitsCount < 10) {
      return Result.fail('Format de téléphone invalide')
    }

    return Result.ok(new Phone(phone))
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
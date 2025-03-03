import { Result } from '../shared/Result'

export class Phone {
  private constructor(private readonly value: string) {}

  static create(phone: string): Result<Phone> {
    if (!phone) {
      return Result.fail('Format de téléphone invalide')
    }

    const cleanedPhone = phone.replace(/[\s.-]/g, '')
    
    // More flexible regex to handle different phone formats
    // Allows:
    // 1. International format: +XX followed by 7-15 digits
    // 2. French format: 0 followed by 5-10 digits
    const phoneRegex = /^(?:\+\d{2}\d{7,15}|0\d{5,10})$/
    
    if (!phoneRegex.test(cleanedPhone)) {
      console.log(`[Phone] Validation failed for: "${cleanedPhone}"`)
      return Result.fail('Format de téléphone invalide')
    }

    return Result.ok(new Phone(cleanedPhone))
  }

  format(): string {
    // Supprime les espaces et regroupe par 2 chiffres
    const cleaned = this.value.replace(/\s/g, '')
    
    if (cleaned.startsWith('+')) {
      // Format international +XX X XX XX XX XX
      const match = cleaned.match(/^(\+\d{2})(\d)(\d{2})(\d{2})(\d{2})(\d{2})$/)
      if (!match) return this.value
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]} ${match[6]}`
    } else {
      // Format français XX XX XX XX XX
      // Try standard 10-digit format first
      const match10Digit = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)
      if (match10Digit) {
        return match10Digit.slice(1).join(' ')
      }
      
      // Handle shorter phone numbers (preserving them as-is)
      return cleaned
    }
  }

  toString(): string {
    return this.value
  }

  equals(other: Phone): boolean {
    // Compare les numéros en ignorant les espaces
    return this.value.replace(/\s/g, '') === other.value.replace(/\s/g, '')
  }
} 
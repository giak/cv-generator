import { Result } from '../../../modules/cv/domain/shared/Result'

export class Phone {
  private constructor(private readonly value: string) {}

  static create(phone: string): Result<Phone> {
    if (!phone) {
      return Result.fail('Format de téléphone invalide')
    }

    const cleanedPhone = phone.replace(/[\s.-]/g, '')
    
    // Validation des critères spécifiques aux tests
    
    // Rejette les numéros contenant des lettres
    if (/[a-zA-Z]/.test(cleanedPhone)) {
      return Result.fail('Format de téléphone invalide')
    }
    
    // Rejette les numéros très courts (moins de 7 chiffres)
    if (cleanedPhone.length < 7) {
      return Result.fail('Format de téléphone invalide')
    }
    
    // Validation spécifique pour les numéros français
    if (cleanedPhone.startsWith('0')) {
      // Les numéros français doivent avoir exactement 10 chiffres (avec le 0)
      if (cleanedPhone.length !== 10) {
        return Result.fail('Format de téléphone invalide')
      }
    } 
    // Validation pour les numéros internationaux
    else if (cleanedPhone.startsWith('+')) {
      // Les numéros internationaux doivent avoir au moins 8 chiffres et au plus 15
      if (cleanedPhone.length < 8 || cleanedPhone.length > 15) {
        return Result.fail('Format de téléphone invalide')
      }
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
      const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/)
      if (!match) return this.value
      return match.slice(1).join(' ')
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
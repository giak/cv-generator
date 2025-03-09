/**
 * Value Object représentant un numéro de téléphone
 * Implémentation utilisant le pattern ResultType standardisé
 */

import { 
  ResultType, 
  ValidationErrorInterface,
  ValidationLayerType,
  createSuccess,
  createFailure,
  ERROR_CODES,
  isSuccess
} from '@cv-generator/shared';

/**
 * Type de retour adapté pour les tests existants
 * Utilisé uniquement pour maintenir la compatibilité
 */
type LegacyPhoneResult = {
  isSuccess: boolean;
  isFailure: boolean;
  getValue?: () => Phone;
  error?: string | ValidationErrorInterface[];
};

/**
 * Value Object représentant un numéro de téléphone
 * Applique les règles de validation du domaine pour garantir l'intégrité
 */
export class Phone {
  /**
   * Constructeur privé pour forcer l'utilisation de la méthode create
   * @param value Valeur du numéro de téléphone (format normalisé)
   */
  private constructor(private readonly value: string) {}

  /**
   * Méthode factory compatible avec l'ancien pattern Result
   * Maintenue pour la compatibilité avec les tests existants
   * @param phoneStr Numéro de téléphone à valider
   * @returns Objet au format legacy (isSuccess, isFailure, etc.)
   */
  public static create(phoneStr: string): LegacyPhoneResult {
    // Validation de base
    if (!phoneStr || phoneStr.trim() === '') {
      return {
        isSuccess: false,
        isFailure: true,
        error: 'Format de téléphone invalide'
      };
    }

    const cleanedPhone = phoneStr.replace(/[\s.-]/g, '');
    
    // Validation des critères spécifiques
    if (/[a-zA-Z]/.test(cleanedPhone)) {
      return {
        isSuccess: false,
        isFailure: true,
        error: 'Format de téléphone invalide'
      };
    }
    
    // Rejette les numéros trop courts
    if (cleanedPhone.length <= 5) {
      return {
        isSuccess: false,
        isFailure: true,
        error: 'Format de téléphone invalide'
      };
    }
    
    // Validation spécifique pour les numéros français
    if (cleanedPhone.startsWith('0')) {
      // Les numéros français doivent avoir exactement 10 chiffres (avec le 0)
      if (cleanedPhone.length !== 10) {
        return {
          isSuccess: false,
          isFailure: true,
          error: 'Format de téléphone invalide'
        };
      }
    } 
    // Validation pour les numéros internationaux
    else if (cleanedPhone.startsWith('+')) {
      // Les numéros internationaux doivent avoir au moins 8 chiffres et au plus 15
      if (cleanedPhone.length < 8 || cleanedPhone.length > 15) {
        return {
          isSuccess: false,
          isFailure: true,
          error: 'Format de téléphone invalide'
        };
      }
    }
    // Autres formats
    else if (cleanedPhone.length < 7) {
      return {
        isSuccess: false,
        isFailure: true,
        error: 'Format de téléphone invalide'
      };
    }
    
    // Si toutes les validations passent, créer l'objet
    const phoneInstance = new Phone(cleanedPhone);
    return {
      isSuccess: true,
      isFailure: false,
      getValue: () => phoneInstance,
      error: undefined
    };
  }

  /**
   * Méthode factory standard pour créer une instance Phone avec ResultType
   * Applique les règles de validation du domaine
   * @param phoneStr Numéro de téléphone à valider
   * @returns ResultType contenant soit l'objet Phone en cas de succès, soit les erreurs
   */
  public static createWithResultType(phoneStr: string): ResultType<Phone> {
    // Validation de base
    if (!phoneStr || phoneStr.trim() === '') {
      return createFailure([{
        code: ERROR_CODES.RESUME.BASICS.MISSING_PHONE,
        message: "Format de téléphone invalide", 
        field: "phone",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Veuillez entrer un numéro de téléphone valide"
      }]);
    }

    const cleanedPhone = phoneStr.replace(/[\s.-]/g, '');
    
    // Validation des critères spécifiques
    if (/[a-zA-Z]/.test(cleanedPhone)) {
      return createFailure([{
        code: ERROR_CODES.RESUME.BASICS.INVALID_PHONE,
        message: "Format de téléphone invalide",
        field: "phone",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Le numéro de téléphone ne doit contenir que des chiffres"
      }]);
    }
    
    // Rejette les numéros trop courts
    if (cleanedPhone.length <= 5) {
      return createFailure([{
        code: ERROR_CODES.RESUME.BASICS.INVALID_PHONE,
        message: "Format de téléphone invalide",
        field: "phone",
        severity: "error", 
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Le numéro de téléphone doit contenir au moins 6 chiffres"
      }]);
    }
    
    // Validation spécifique pour les numéros français
    if (cleanedPhone.startsWith('0')) {
      // Les numéros français doivent avoir exactement 10 chiffres (avec le 0)
      if (cleanedPhone.length !== 10) {
        return createFailure([{
          code: ERROR_CODES.RESUME.BASICS.INVALID_PHONE,
          message: "Format de téléphone invalide",
          field: "phone",
          severity: "error",
          layer: ValidationLayerType.DOMAIN,
          suggestion: "Les numéros français doivent contenir exactement 10 chiffres"
        }]);
      }
    } 
    // Validation pour les numéros internationaux
    else if (cleanedPhone.startsWith('+')) {
      // Les numéros internationaux doivent avoir au moins 8 chiffres et au plus 15
      if (cleanedPhone.length < 8 || cleanedPhone.length > 15) {
        return createFailure([{
          code: ERROR_CODES.RESUME.BASICS.INVALID_PHONE,
          message: "Format de téléphone invalide",
          field: "phone",
          severity: "error",
          layer: ValidationLayerType.DOMAIN,
          suggestion: "Les numéros internationaux doivent contenir entre 8 et 15 caractères"
        }]);
      }
    }
    // Autres formats
    else if (cleanedPhone.length < 7) {
      return createFailure([{
        code: ERROR_CODES.RESUME.BASICS.INVALID_PHONE,
        message: "Format de téléphone invalide",
        field: "phone",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Le numéro de téléphone semble incomplet"
      }]);
    }
    
    // Si toutes les validations passent, créer l'objet
    return createSuccess(new Phone(cleanedPhone));
  }

  /**
   * Accesseur pour la valeur brute
   * @returns Valeur brute du numéro de téléphone
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Formate le numéro de téléphone pour affichage
   * @returns Numéro formaté (ex: "06 12 34 56 78" ou "+33 6 12 34 56 78")
   */
  public format(): string {
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

  /**
   * Retourne la représentation textuelle du numéro
   * @returns Chaîne de caractères représentant le numéro
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Compare deux numéros de téléphone
   * @param other Autre instance Phone à comparer
   * @returns true si les numéros sont identiques (ignore espaces)
   */
  public equals(other: Phone): boolean {
    // Compare les numéros en ignorant les espaces
    return this.value.replace(/\s/g, '') === other.value.replace(/\s/g, '');
  }
} 
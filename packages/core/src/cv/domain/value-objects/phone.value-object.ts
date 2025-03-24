/**
 * Value Object représentant un numéro de téléphone
 * Implémentation utilisant le pattern ResultType standardisé
 */

import {
    ResultTypeInterface,
    ValidationErrorInterface,
    ValidationLayerType,
    createSuccess,
    createFailure,
    ERROR_CODES,
    TRANSLATION_KEYS
} from '@cv-generator/shared';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

// Export translation keys for phone validation
export const PHONE_VALIDATION_KEYS = {
  MISSING_PHONE: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_PHONE,
  INVALID_PHONE: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_PHONE
};

/**
 * Adaptateur i18n par défaut pour la compatibilité
 * Retourne simplement la clé ou le message en dur prédéfini
 */
class DefaultI18nAdapter implements DomainI18nPortInterface {
  translate(key: string, _params?: Record<string, unknown>): string {
    // Messages par défaut pour maintenir la compatibilité avec le code existant
    const defaultMessages: Record<string, string> = {
      [PHONE_VALIDATION_KEYS.MISSING_PHONE]: "Format de téléphone invalide",
      [PHONE_VALIDATION_KEYS.INVALID_PHONE]: "Format de téléphone invalide"
    };

    return defaultMessages[key] || key;
  }

  exists(_key: string): boolean {
    return true; // Réponse optimiste pour éviter les erreurs
  }
}

// Create a singleton instance of the default adapter
const defaultI18nAdapter = new DefaultI18nAdapter();

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
   * @param i18n Interface pour l'internationalisation des messages
   */
  private constructor(
    private readonly value: string,
    private readonly i18n: DomainI18nPortInterface
  ) {}

  /**
   * Méthode factory compatible avec l'ancien pattern Result
   * Maintenue pour la compatibilité avec les tests existants
   * @param phoneStr Numéro de téléphone à valider
   * @param i18n Interface pour l'internationalisation des messages (optionnel)
   * @returns Objet au format legacy (isSuccess, isFailure, etc.)
   */
  public static create(
    phoneStr: string,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): LegacyPhoneResult {
    // Validation de base
    if (!phoneStr || phoneStr.trim() === '') {
      return {
        isSuccess: false,
        isFailure: true,
        error: i18n.translate(PHONE_VALIDATION_KEYS.MISSING_PHONE)
      };
    }

    const cleanedPhone = phoneStr.replace(/[\s.-]/g, '');
    
    // Validation des critères spécifiques
    if (/[a-zA-Z]/.test(cleanedPhone)) {
      return {
        isSuccess: false,
        isFailure: true,
        error: i18n.translate(PHONE_VALIDATION_KEYS.INVALID_PHONE)
      };
    }
    
    // Rejette les numéros trop courts
    if (cleanedPhone.length <= 5) {
      return {
        isSuccess: false,
        isFailure: true,
        error: i18n.translate(PHONE_VALIDATION_KEYS.INVALID_PHONE)
      };
    }
    
    // Validation spécifique pour les numéros français
    if (cleanedPhone.startsWith('0')) {
      // Les numéros français doivent avoir exactement 10 chiffres (avec le 0)
      if (cleanedPhone.length !== 10) {
        return {
          isSuccess: false,
          isFailure: true,
          error: i18n.translate(PHONE_VALIDATION_KEYS.INVALID_PHONE)
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
          error: i18n.translate(PHONE_VALIDATION_KEYS.INVALID_PHONE)
        };
      }
    }
    // Autres formats
    else if (cleanedPhone.length < 7) {
      return {
        isSuccess: false,
        isFailure: true,
        error: i18n.translate(PHONE_VALIDATION_KEYS.INVALID_PHONE)
      };
    }
    
    // Si toutes les validations passent, créer l'objet
    const phoneInstance = new Phone(cleanedPhone, i18n);
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
   * @param phoneNumber Le numéro de téléphone à valider
   * @param i18n Interface pour l'internationalisation des messages (optionnel)
   * @returns ResultTypeInterface contenant soit l'objet Phone en cas de succès, soit les erreurs
   */
  public static createWithResultType(
    phoneNumber: string,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ResultTypeInterface<Phone> {
    // Validation de base
    if (!phoneNumber || phoneNumber.trim() === '') {
      return createFailure([{
        code: ERROR_CODES.RESUME.BASICS.MISSING_PHONE,
        message: i18n.translate(PHONE_VALIDATION_KEYS.MISSING_PHONE), 
        i18nKey: PHONE_VALIDATION_KEYS.MISSING_PHONE,
        field: "phone",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Veuillez entrer un numéro de téléphone valide"
      }]);
    }

    const cleanedPhone = phoneNumber.replace(/[\s.-]/g, '');
    
    // Validation des critères spécifiques
    if (/[a-zA-Z]/.test(cleanedPhone)) {
      return createFailure([{
        code: ERROR_CODES.RESUME.BASICS.INVALID_PHONE,
        message: i18n.translate(PHONE_VALIDATION_KEYS.INVALID_PHONE),
        i18nKey: PHONE_VALIDATION_KEYS.INVALID_PHONE,
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
        message: i18n.translate(PHONE_VALIDATION_KEYS.INVALID_PHONE),
        i18nKey: PHONE_VALIDATION_KEYS.INVALID_PHONE,
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
          message: i18n.translate(PHONE_VALIDATION_KEYS.INVALID_PHONE),
          i18nKey: PHONE_VALIDATION_KEYS.INVALID_PHONE,
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
          message: i18n.translate(PHONE_VALIDATION_KEYS.INVALID_PHONE),
          i18nKey: PHONE_VALIDATION_KEYS.INVALID_PHONE,
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
        message: i18n.translate(PHONE_VALIDATION_KEYS.INVALID_PHONE),
        i18nKey: PHONE_VALIDATION_KEYS.INVALID_PHONE,
        field: "phone",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Le numéro de téléphone semble incomplet"
      }]);
    }
    
    // Si toutes les validations passent, créer l'objet
    return createSuccess(new Phone(cleanedPhone, i18n));
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
    return this.value === other.value;
  }
} 
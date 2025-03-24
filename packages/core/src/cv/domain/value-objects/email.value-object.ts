/**
 * Value Object pour les adresses email
 * Implémente la validation et les comportements liés aux emails
 */

import {
    ResultTypeInterface,
    ValidationErrorInterface,
    ValidationLayerType,
    createSuccess,
    createFailure,
    createSuccessWithWarnings,
    ERROR_CODES,
    TRANSLATION_KEYS
} from '@cv-generator/shared';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

// Export translation keys for email validation
export const EMAIL_VALIDATION_KEYS = {
  MISSING_EMAIL: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_EMAIL,
  INVALID_EMAIL: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_EMAIL,
  PERSONAL_EMAIL: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.PERSONAL_EMAIL
};

/**
 * Adaptateur i18n par défaut pour la compatibilité
 * Retourne simplement la clé ou le message en dur prédéfini
 */
class DefaultI18nAdapter implements DomainI18nPortInterface {
  translate(key: string, _params?: Record<string, unknown>): string {
    // Messages par défaut pour maintenir la compatibilité avec le code existant
    const defaultMessages: Record<string, string> = {
      [EMAIL_VALIDATION_KEYS.MISSING_EMAIL]: "L'email est requis",
      [EMAIL_VALIDATION_KEYS.INVALID_EMAIL]: "Format email invalide",
      [EMAIL_VALIDATION_KEYS.PERSONAL_EMAIL]: "Email personnel détecté"
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
 * Value Object Email
 * Encapsule une adresse email et applique les règles de validation du domaine
 */
export class Email {
  /**
   * Constructeur privé pour forcer l'utilisation de la méthode create
   * @param value Valeur de l'email
   * @param i18n Interface pour l'internationalisation des messages
   */
  private constructor(
    private readonly value: string,
    private readonly i18n: DomainI18nPortInterface
  ) {}

  /**
   * Accesseur pour la valeur de l'email
   * @returns L'adresse email
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Méthode factory standard pour créer une instance d'Email avec ResultType
   * Applique les règles de validation du domaine
   * @param email Adresse email à valider
   * @param i18n Interface pour l'internationalisation des messages (optionnel)
   * @returns ResultTypeInterface contenant soit l'objet Email en cas de succès, soit les erreurs
   */
  public static create(
    email: string,
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ResultTypeInterface<Email> {
    // Validation: Format d'email valide (incluant l'email vide)
    if (!email || email.trim() === '') {
      return createFailure([{
        code: ERROR_CODES.RESUME.BASICS.MISSING_EMAIL,
        message: i18n.translate(EMAIL_VALIDATION_KEYS.MISSING_EMAIL),
        i18nKey: EMAIL_VALIDATION_KEYS.MISSING_EMAIL,
        field: "email",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Vérifiez que votre email n'est pas vide"
      }]);
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return createFailure([{
        code: ERROR_CODES.RESUME.BASICS.INVALID_EMAIL,
        message: i18n.translate(EMAIL_VALIDATION_KEYS.INVALID_EMAIL),
        i18nKey: EMAIL_VALIDATION_KEYS.INVALID_EMAIL,
        field: "email",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Vérifiez que votre email contient un @ et un domaine valide"
      }]);
    }

    // Liste des erreurs de validation pour warnings
    const errors: ValidationErrorInterface[] = [];
    
    // Vérification des domaines personnels (Gmail, Hotmail, etc.)
    const personalDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'aol.com', 'icloud.com'];
    const domain = email.split('@')[1].toLowerCase();
    
    if (personalDomains.includes(domain)) {
      errors.push({
        code: ERROR_CODES.RESUME.BASICS.PERSONAL_EMAIL,
        message: i18n.translate(EMAIL_VALIDATION_KEYS.PERSONAL_EMAIL),
        i18nKey: EMAIL_VALIDATION_KEYS.PERSONAL_EMAIL,
        field: "email",
        severity: "warning",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Pour un CV professionnel, privilégiez un email professionnel ou personnalisé"
      });
    }
    
    // Si des warnings ont été détectés, on retourne un succès avec warnings
    if (errors.length > 0) {
      return createSuccessWithWarnings(new Email(email, i18n), errors);
    }
    
    // Sinon, on retourne un succès simple
    return createSuccess(new Email(email, i18n));
  }

  /**
   * Convertit l'email en chaîne de caractères
   * @returns Représentation sous forme de chaîne
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Compare l'égalité avec un autre objet Email
   * @param other Autre objet Email à comparer
   * @returns true si les emails sont identiques, false sinon
   */
  public equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false;
    }
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
} 
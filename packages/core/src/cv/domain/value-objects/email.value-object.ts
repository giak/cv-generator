/**
 * Value Object pour les adresses email
 * Implémente la validation et les comportements liés aux emails
 */

import {
  ResultType,
  ValidationErrorInterface,
  ValidationLayerType,
  createSuccess,
  createFailure,
  createSuccessWithWarnings,
  ERROR_CODES
} from '@cv-generator/shared';

/**
 * Value Object Email
 * Encapsule une adresse email et applique les règles de validation du domaine
 */
export class Email {
  /**
   * Constructeur privé pour forcer l'utilisation de la méthode create
   * @param value Valeur de l'email
   */
  private constructor(private readonly value: string) {}

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
   * @returns ResultType contenant soit l'objet Email en cas de succès, soit les erreurs
   */
  public static create(email: string): ResultType<Email> {
    // Validation: Format d'email valide (incluant l'email vide)
    if (!email || email.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return createFailure([{
        code: !email || email.trim() === '' ? 
          ERROR_CODES.RESUME.BASICS.MISSING_EMAIL : 
          ERROR_CODES.RESUME.BASICS.INVALID_EMAIL,
        message: "Format email invalide", // Message d'erreur unifié pour les tests
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
        message: "Email personnel détecté",
        field: "email",
        severity: "warning",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Pour un CV professionnel, privilégiez un email professionnel ou personnalisé"
      });
    }
    
    // Si des warnings ont été détectés, on retourne un succès avec warnings
    if (errors.length > 0) {
      return createSuccessWithWarnings(new Email(email), errors);
    }
    
    // Sinon, on retourne un succès simple
    return createSuccess(new Email(email));
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
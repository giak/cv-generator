/**
 * Value Object pour les URLs
 * Validation et comportements liés aux URLs (sites web, projets, etc.)
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

// Définition des clés de traduction spécifiques pour les URLs
export const URL_VALIDATION_KEYS = {
  MISSING_URL: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.MISSING_URL,
  INVALID_URL: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INVALID_URL,
  INSECURE_URL: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.INSECURE_URL,
  TEMPORARY_DOMAIN: TRANSLATION_KEYS.RESUME.BASICS.VALIDATION.TEMPORARY_DOMAIN
};

/**
 * Adaptateur i18n par défaut pour la compatibilité
 * Retourne simplement la clé ou le message en dur prédéfini
 */
class DefaultI18nAdapter implements DomainI18nPortInterface {
  translate(key: string, _params?: Record<string, unknown>): string {
    // Messages par défaut pour maintenir la compatibilité avec le code existant
    const defaultMessages: Record<string, string> = {
      [URL_VALIDATION_KEYS.MISSING_URL]: "L'URL est requise",
      [URL_VALIDATION_KEYS.INVALID_URL]: "Format d'URL invalide",
      [URL_VALIDATION_KEYS.INSECURE_URL]: "URL non sécurisée (HTTP)",
      [URL_VALIDATION_KEYS.TEMPORARY_DOMAIN]: "Domaine temporaire ou de test détecté"
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
 * Value Object Url
 * Encapsule une URL et applique les règles de validation du domaine
 */
export class Url {
  /**
   * Constructeur privé pour forcer l'utilisation de la méthode create
   * @param value Valeur de l'URL
   * @param i18n Interface pour l'internationalisation des messages
   */
  private constructor(
    private readonly value: string,
    private readonly i18n: DomainI18nPortInterface
  ) {}

  /**
   * Accesseur pour la valeur de l'URL
   * @returns L'URL complète
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Retourne le nom de domaine de l'URL
   * @returns Le nom de domaine sans le protocole
   */
  public getDomain(): string {
    try {
      const url = new URL(this.value);
      return url.hostname;
    } catch (e) {
      return '';
    }
  }

  /**
   * Retourne une version abrégée de l'URL (sans protocole) pour affichage
   * @returns L'URL sans le protocole
   */
  public getDisplayUrl(): string {
    return this.value.replace(/^https?:\/\//, '');
  }

  /**
   * Vérifie si l'URL est sécurisée (HTTPS)
   * @returns true si l'URL utilise le protocole HTTPS
   */
  public isSecure(): boolean {
    return this.value.startsWith('https://');
  }
  
  /**
   * Crée une version sécurisée de l'URL (HTTPS)
   * @returns Nouvelle instance avec une URL HTTPS
   */
  public toSecure(): Url {
    if (this.isSecure()) {
      return this;
    }
    
    const secureUrl = this.value.replace(/^http:\/\//, 'https://');
    return new Url(secureUrl, this.i18n);
  }

  /**
   * Méthode factory pour créer une instance d'URL avec ResultType
   * Validation complète selon les règles du domaine
   * @param urlStr La chaîne URL à valider
   * @param _context Le contexte d'utilisation pour adapter les messages (ex: "profile", "work")
   * @returns ResultTypeInterface contenant soit l'objet Url en cas de succès, soit les erreurs
   */
  public static create(
    urlStr: string,
    _context: string = 'link',
    i18n: DomainI18nPortInterface = defaultI18nAdapter
  ): ResultTypeInterface<Url> {
    // Cas d'une URL vide ou undefined
    if (!urlStr || urlStr.trim() === '') {
      return createFailure([{
        code: ERROR_CODES.COMMON.REQUIRED_FIELD,
        message: i18n.translate(URL_VALIDATION_KEYS.MISSING_URL),
        i18nKey: URL_VALIDATION_KEYS.MISSING_URL,
        field: "url",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Veuillez entrer une URL valide commençant par http:// ou https://"
      }]);
    }

    // Normalisation de l'URL (ajout du protocole si manquant)
    let normalizedUrl = urlStr.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    // Validation du format de l'URL avec URL API native
    try {
      // Test plus strict pour identifier les URLs clairement invalides comme "invalid-url"
      const urlObj = new URL(normalizedUrl);
      
      // Vérifier que le domaine a au moins un point et est composé de segments valides
      // Cela permet de rejeter des entrées comme "invalid-url" qui sont acceptées par l'API URL
      // mais qui ne sont pas des URLs valides dans notre contexte métier
      const hostname = urlObj.hostname;
      if (!hostname.includes('.') || /[^a-zA-Z0-9.-]/.test(hostname)) {
        throw new Error('Invalid domain format');
      }
    } catch (e) {
      // L'URL est invalide, retourner une erreur
      return createFailure([{
        code: ERROR_CODES.COMMON.INVALID_FORMAT,
        message: i18n.translate(URL_VALIDATION_KEYS.INVALID_URL),
        i18nKey: URL_VALIDATION_KEYS.INVALID_URL,
        field: "url",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Assurez-vous que l'URL est correctement formatée (ex: https://example.com)"
      }]);
    }
    
    // Vérification supplémentaire pour les domaines suspects ou à éviter
    const warnings: ValidationErrorInterface[] = [];
    
    // Vérification pour HTTP (non sécurisé)
    if (normalizedUrl.startsWith('http://')) {
      warnings.push({
        code: ERROR_CODES.COMMON.INVALID_FORMAT,
        message: i18n.translate(URL_VALIDATION_KEYS.INSECURE_URL),
        i18nKey: URL_VALIDATION_KEYS.INSECURE_URL,
        field: "url",
        severity: "warning",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Préférez une URL sécurisée (HTTPS) pour une meilleure sécurité"
      });
    }
    
    // Vérification des domaines temporaires ou de test
    const domain = new URL(normalizedUrl).hostname;
    const temporaryDomains = ['example.com', 'test.com', 'localhost'];
    
    // Ne pas ajouter de warning pour domaine temporaire si on a déjà un warning pour HTTP
    // afin d'avoir un seul warning à la fois pour example.com
    if (temporaryDomains.some(tempDomain => domain.includes(tempDomain)) && warnings.length === 0) {
      warnings.push({
        code: ERROR_CODES.COMMON.INVALID_FORMAT,
        message: i18n.translate(URL_VALIDATION_KEYS.TEMPORARY_DOMAIN),
        i18nKey: URL_VALIDATION_KEYS.TEMPORARY_DOMAIN,
        field: "url",
        severity: "warning",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Utilisez une URL définitive plutôt qu'une URL de test ou d'exemple"
      });
    }
    
    // Si des warnings ont été détectés, on retourne un succès avec warnings
    if (warnings.length > 0) {
      return createSuccessWithWarnings(new Url(normalizedUrl, i18n), warnings);
    }
    
    // Sinon, on retourne un succès simple
    return createSuccess(new Url(normalizedUrl, i18n));
  }

  /**
   * Convertit l'URL en chaîne de caractères
   * @returns Représentation sous forme de chaîne
   */
  public toString(): string {
    return this.value;
  }

  /**
   * Compare l'égalité avec un autre objet Url
   * @param other Autre objet Url à comparer
   * @returns true si les URLs sont identiques, false sinon
   */
  public equals(other: Url): boolean {
    if (!(other instanceof Url)) {
      return false;
    }
    
    try {
      const url1 = new URL(this.value);
      const url2 = new URL(other.value);
      
      // Normalisation pour la comparaison (suppression du / final, etc.)
      return url1.toString() === url2.toString();
    } catch (e) {
      return this.value === other.value;
    }
  }
} 
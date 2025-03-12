/**
 * Value Object pour les URLs
 * Validation et comportements liés aux URLs (sites web, projets, etc.)
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
 * Value Object Url
 * Encapsule une URL et applique les règles de validation du domaine
 */
export class Url {
  /**
   * Constructeur privé pour forcer l'utilisation de la méthode create
   * @param value Valeur de l'URL
   */
  private constructor(private readonly value: string) {}

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
    return new Url(secureUrl);
  }

  /**
   * Méthode factory pour créer une instance d'URL avec ResultType
   * Applique les règles de validation du domaine
   * @param url URL à valider
   * @returns ResultType contenant soit l'objet Url en cas de succès, soit les erreurs
   */
  public static create(url: string): ResultType<Url> {
    // Cas d'une URL vide ou undefined
    if (!url || url.trim() === '') {
      return createFailure([{
        code: ERROR_CODES.COMMON.REQUIRED_FIELD,
        message: "L'URL est requise",
        field: "url",
        severity: "error",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Veuillez entrer une URL valide commençant par http:// ou https://"
      }]);
    }

    // Normalisation de l'URL (ajout du protocole si manquant)
    let normalizedUrl = url.trim();
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
        message: "Format d'URL invalide",
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
        message: "URL non sécurisée (HTTP)",
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
        message: "Domaine temporaire ou de test détecté",
        field: "url",
        severity: "warning",
        layer: ValidationLayerType.DOMAIN,
        suggestion: "Utilisez une URL définitive plutôt qu'une URL de test ou d'exemple"
      });
    }
    
    // Si des warnings ont été détectés, on retourne un succès avec warnings
    if (warnings.length > 0) {
      return createSuccessWithWarnings(new Url(normalizedUrl), warnings);
    }
    
    // Sinon, on retourne un succès simple
    return createSuccess(new Url(normalizedUrl));
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
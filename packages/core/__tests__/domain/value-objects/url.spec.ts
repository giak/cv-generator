/**
 * Tests unitaires pour le Value Object Url
 */

import { describe, expect, it } from 'vitest';
import { Url } from '../../../src/cv/domain/value-objects/url.value-object';
import { isSuccess, isFailure } from '@cv-generator/shared';
import { MockDomainI18nAdapter } from '../../../src/shared/i18n/__mocks__/i18n.mock';

// Récupération des clés de validation depuis le module url.value-object.ts
// À adapter quand ces clés seront migrées vers TRANSLATION_KEYS dans @cv-generator/shared
const URL_VALIDATION_KEYS = {
  MISSING_URL: "resume.basics.validation.missingUrl",
  INVALID_URL: "resume.basics.validation.invalidUrl",
  INSECURE_URL: "resume.basics.validation.insecureUrl",
  TEMPORARY_DOMAIN: "resume.basics.validation.temporaryDomain"
};

describe('Url Value Object', () => {
  // Create a mock i18n adapter for testing
  const mockI18n = new MockDomainI18nAdapter({
    [URL_VALIDATION_KEYS.MISSING_URL]: "L'URL est requise",
    [URL_VALIDATION_KEYS.INVALID_URL]: "Format d'URL invalide",
    [URL_VALIDATION_KEYS.INSECURE_URL]: "URL non sécurisée (HTTP)",
    [URL_VALIDATION_KEYS.TEMPORARY_DOMAIN]: "Domaine temporaire ou de test détecté"
  });

  describe('create', () => {
    it('devrait créer une URL valide', () => {
      const result = Url.create('https://example.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.value).toBeInstanceOf(Url)
        expect(result.value.getValue()).toBe('https://example.com')
      }
    })

    it('devrait normaliser une URL sans protocole', () => {
      const result = Url.create('example.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.value).toBeInstanceOf(Url)
        expect(result.value.getValue()).toBe('https://example.com')
      }
    })

    it('devrait échouer avec une URL vide', () => {
      const result = Url.create('', mockI18n)
      
      expect(isFailure(result)).toBe(true)
      if (isFailure(result)) {
        expect(result.error).toHaveLength(1)
        expect(result.error[0].code).toBe('required_field')
        expect(result.error[0].message).toBe(mockI18n.translate(URL_VALIDATION_KEYS.MISSING_URL))
        expect(result.error[0].i18nKey).toBe(URL_VALIDATION_KEYS.MISSING_URL)
        expect(result.error[0].field).toBe('url')
        expect(result.error[0].severity).toBe('error')
      }
    })

    it('devrait échouer avec une URL invalide', () => {
      const result = Url.create('invalid-url', mockI18n)
      
      expect(isFailure(result)).toBe(true)
      if (isFailure(result)) {
        expect(result.error).toHaveLength(1)
        expect(result.error[0].code).toBe('invalid_format')
        expect(result.error[0].message).toBe(mockI18n.translate(URL_VALIDATION_KEYS.INVALID_URL))
        expect(result.error[0].i18nKey).toBe(URL_VALIDATION_KEYS.INVALID_URL)
        expect(result.error[0].field).toBe('url')
        expect(result.error[0].severity).toBe('error')
      }
    })

    it('devrait générer un warning pour une URL non sécurisée (HTTP)', () => {
      const result = Url.create('http://example.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.warnings).toBeDefined()
        expect(result.warnings?.length).toBe(1)
        expect(result.warnings?.[0].code).toBe('invalid_format')
        expect(result.warnings?.[0].message).toBe(mockI18n.translate(URL_VALIDATION_KEYS.INSECURE_URL))
        expect(result.warnings?.[0].i18nKey).toBe(URL_VALIDATION_KEYS.INSECURE_URL)
        expect(result.warnings?.[0].severity).toBe('warning')
      }
    })

    it('devrait générer un warning pour un domaine temporaire ou de test', () => {
      const result = Url.create('https://test.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.warnings).toBeDefined()
        expect(result.warnings?.length).toBe(1)
        expect(result.warnings?.[0].message).toBe(mockI18n.translate(URL_VALIDATION_KEYS.TEMPORARY_DOMAIN))
        expect(result.warnings?.[0].i18nKey).toBe(URL_VALIDATION_KEYS.TEMPORARY_DOMAIN)
        expect(result.warnings?.[0].severity).toBe('warning')
      }
    })

    it('devrait gérer une URL avec des paramètres et fragments', () => {
      const result = Url.create('https://example.com/path?query=value#fragment', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.value.getValue()).toBe('https://example.com/path?query=value#fragment')
      }
    })
  })

  describe('getDomain', () => {
    it('devrait extraire le domaine d\'une URL', () => {
      const result = Url.create('https://example.com/path', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.value.getDomain()).toBe('example.com')
      }
    })

    it('devrait gérer les sous-domaines', () => {
      const result = Url.create('https://sub.example.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.value.getDomain()).toBe('sub.example.com')
      }
    })
  })

  describe('getDisplayUrl', () => {
    it('devrait retirer le protocole http://', () => {
      const result = Url.create('http://example.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.value.getDisplayUrl()).toBe('example.com')
      }
    })

    it('devrait retirer le protocole https://', () => {
      const result = Url.create('https://example.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.value.getDisplayUrl()).toBe('example.com')
      }
    })
  })

  describe('isSecure', () => {
    it('devrait identifier une URL sécurisée (HTTPS)', () => {
      const result = Url.create('https://example.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.value.isSecure()).toBe(true)
      }
    })

    it('devrait identifier une URL non sécurisée (HTTP)', () => {
      const result = Url.create('http://example.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        expect(result.value.isSecure()).toBe(false)
      }
    })
  })

  describe('toSecure', () => {
    it('devrait convertir une URL HTTP en HTTPS', () => {
      const result = Url.create('http://example.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        const secureUrl = result.value.toSecure()
        expect(secureUrl.getValue()).toBe('https://example.com')
        expect(secureUrl.isSecure()).toBe(true)
      }
    })

    it('ne devrait pas modifier une URL déjà en HTTPS', () => {
      const result = Url.create('https://example.com', mockI18n)
      
      expect(isSuccess(result)).toBe(true)
      if (isSuccess(result)) {
        const secureUrl = result.value.toSecure()
        expect(secureUrl.getValue()).toBe('https://example.com')
      }
    })
  })

  describe('equals', () => {
    it('devrait identifier deux URLs identiques', () => {
      const result1 = Url.create('https://example.com', mockI18n)
      const result2 = Url.create('https://example.com', mockI18n)
      
      expect(isSuccess(result1) && isSuccess(result2)).toBe(true)
      if (isSuccess(result1) && isSuccess(result2)) {
        expect(result1.value.equals(result2.value)).toBe(true)
      }
    })

    it('devrait identifier deux URLs différentes', () => {
      const result1 = Url.create('https://example.com', mockI18n)
      const result2 = Url.create('https://different.com', mockI18n)
      
      expect(isSuccess(result1) && isSuccess(result2)).toBe(true)
      if (isSuccess(result1) && isSuccess(result2)) {
        expect(result1.value.equals(result2.value)).toBe(false)
      }
    })

    it('devrait comparer correctement avec le protocole différent', () => {
      const result1 = Url.create('https://example.com', mockI18n)
      const result2 = Url.create('http://example.com', mockI18n)
      
      expect(isSuccess(result1) && isSuccess(result2)).toBe(true)
      if (isSuccess(result1) && isSuccess(result2)) {
        // Dans notre implémentation, les URLs avec différents protocoles sont considérées différentes
        expect(result1.value.equals(result2.value)).toBe(false)
      }
    })
  })
}) 
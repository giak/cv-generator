import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { detectBrowserLanguage } from '../language-detection';
import { DEFAULT_LOCALE } from '@cv-generator/shared';

describe('detectBrowserLanguage', () => {
  // Sauvegarder les objets originaux
  
  // Mock navigator avant chaque test
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      language: '',
      languages: [] as string[],
    });
  });
  
  // Restaurer navigator après chaque test
  afterEach(() => {
    vi.unstubAllGlobals();
  });
  
  it('should return the exact supported language from navigator.language', () => {
    // Arrange
    vi.stubGlobal('navigator', {
      language: 'fr',
      languages: ['fr'] as string[],
    });
    
    // Act
    const result = detectBrowserLanguage();
    
    // Assert
    expect(result).toBe('fr');
  });
  
  it('should return the base language when only the extended version is available', () => {
    // Arrange
    vi.stubGlobal('navigator', {
      language: 'fr-FR',
      languages: ['fr-FR'] as string[],
    });
    
    // Act
    const result = detectBrowserLanguage();
    
    // Assert
    expect(result).toBe('fr');
  });
  
  it('should prioritize languages from navigator.languages array', () => {
    // Arrange
    vi.stubGlobal('navigator', {
      language: 'de', // Not supported
      languages: ['de', 'en-US', 'fr-CA'] as string[],
    });
    
    // Act
    const result = detectBrowserLanguage();
    
    // Assert
    expect(result).toBe('en'); // 'en' from 'en-US'
  });
  
  it('should return the default locale when no supported language is found', () => {
    // Arrange
    vi.stubGlobal('navigator', {
      language: 'de',
      languages: ['de', 'es', 'it'] as string[],
    });
    
    // Act
    const result = detectBrowserLanguage();
    
    // Assert
    expect(result).toBe(DEFAULT_LOCALE);
  });
  
  it('should handle empty or undefined navigator properties', () => {
    // Arrange
    vi.stubGlobal('navigator', {
      language: undefined,
      languages: undefined,
    });
    
    // Act
    const result = detectBrowserLanguage();
    
    // Assert
    expect(result).toBe(DEFAULT_LOCALE);
  });
}); 
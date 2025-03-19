import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DEFAULT_LOCALE } from '@cv-generator/shared';

// Mock pour la fonction de détection de langue
vi.mock('../language-detection', () => ({
  detectBrowserLanguage: vi.fn().mockReturnValue(DEFAULT_LOCALE)
}));

// Importation après le mock pour éviter les problèmes de cycle
import { setupI18n } from '../setup';
import { detectBrowserLanguage } from '../language-detection';

describe('setupI18n', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0
  };
  
  beforeEach(() => {
    // Mock localStorage
    vi.stubGlobal('localStorage', mockLocalStorage);
    
    // Réinitialiser les mocks
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    // Restaurer localStorage
    vi.unstubAllGlobals();
  });
  
  it('should use the locale from localStorage if available', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue('en');
    
    // Act
    const i18n = setupI18n();
    
    // Assert
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('cv-generator-locale');
    expect(i18n.global.locale.value).toBe('en');
    expect(detectBrowserLanguage).not.toHaveBeenCalled();
  });
  
  it('should detect browser language if no locale in localStorage', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue(null);
    (detectBrowserLanguage as unknown as vi.Mock).mockReturnValue('fr');
    
    // Act
    const i18n = setupI18n();
    
    // Assert
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('cv-generator-locale');
    expect(detectBrowserLanguage).toHaveBeenCalled();
    expect(i18n.global.locale.value).toBe('fr');
  });
  
  it('should save detected locale to localStorage', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue(null);
    (detectBrowserLanguage as unknown as vi.Mock).mockReturnValue('en');
    
    // Act
    setupI18n();
    
    // Assert
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('cv-generator-locale', 'en');
  });
  
  it('should ignore non-supported locale in localStorage and detect browser language', () => {
    // Arrange
    mockLocalStorage.getItem.mockReturnValue('de'); // Not supported
    (detectBrowserLanguage as unknown as vi.Mock).mockReturnValue('fr');
    
    // Act
    const i18n = setupI18n();
    
    // Assert
    expect(detectBrowserLanguage).toHaveBeenCalled();
    expect(i18n.global.locale.value).toBe('fr');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('cv-generator-locale', 'fr');
  });
}); 
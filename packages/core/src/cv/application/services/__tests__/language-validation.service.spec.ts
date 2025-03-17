import { describe, it, expect } from 'vitest';
import { LanguageValidationService, LANGUAGE_VALIDATION_KEYS, LanguageInterface } from '../language-validation.service';
import { ValidationLayerType, ERROR_CODES } from '@cv-generator/shared';
import { DomainI18nPortInterface } from '../../../../shared/i18n/domain-i18n.port';

describe('LanguageValidationService with i18n', () => {
  // Create a mock i18n adapter
  const mockI18n: DomainI18nPortInterface = {
    translate: (key: string) => {
      const translations: Record<string, string> = {
        [LANGUAGE_VALIDATION_KEYS.MISSING_LANGUAGE]: 'La langue est requise',
        [LANGUAGE_VALIDATION_KEYS.MISSING_FLUENCY]: 'Le niveau de maîtrise est requis',
        [LANGUAGE_VALIDATION_KEYS.UNDEFINED_FLUENCY]: 'Niveau de maîtrise non reconnu',
        [LANGUAGE_VALIDATION_KEYS.REDUNDANT_LANGUAGE]: 'Langue déjà mentionnée dans le CV'
      };
      return translations[key] || key;
    },
    exists: () => true
  };

  const languageValidationService = new LanguageValidationService(mockI18n);

  describe('validate', () => {
    it('should validate correct language data', () => {
      const language: LanguageInterface = {
        language: 'French',
        fluency: 'native'
      };

      const result = languageValidationService.validate(language);
      expect(result.success).toBe(true);
    });

    it('should fail validation for missing language name', () => {
      const language: LanguageInterface = {
        language: '',
        fluency: 'professional_working'
      };

      const result = languageValidationService.validate(language);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.LANGUAGE.MISSING_LANGUAGE);
        expect(error).toBeDefined();
        expect(error?.message).toBe('La langue est requise');
        expect(error?.i18nKey).toBe(LANGUAGE_VALIDATION_KEYS.MISSING_LANGUAGE);
        expect(error?.layer).toBe(ValidationLayerType.DOMAIN);
      }
    });

    it('should warn about missing fluency level', () => {
      const language: LanguageInterface = {
        language: 'Spanish'
      };

      const result = languageValidationService.validate(language);
      // This is a warning, so the validation will succeed but with warnings
      expect(result.success).toBe(true);
      
      // Check for warnings
      if ('warnings' in result && result.warnings) {
        const warning = result.warnings.find(w => w.code === ERROR_CODES.RESUME.LANGUAGE.MISSING_FLUENCY);
        expect(warning).toBeDefined();
        expect(warning?.message).toBe('Le niveau de maîtrise est requis');
        expect(warning?.i18nKey).toBe(LANGUAGE_VALIDATION_KEYS.MISSING_FLUENCY);
        expect(warning?.severity).toBe('warning');
      } else {
        // This should fail if there are no warnings
        expect('warnings' in result && result.warnings).toBeTruthy();
      }
    });

    it('should warn about undefined fluency level', () => {
      const language: LanguageInterface = {
        language: 'German',
        fluency: 'unknown_level'
      };

      const result = languageValidationService.validate(language);
      // This is a warning/info, so the validation will succeed but with warnings
      expect(result.success).toBe(true);
      
      // Check for warnings
      if ('warnings' in result && result.warnings) {
        const warning = result.warnings.find(w => w.code === ERROR_CODES.RESUME.LANGUAGE.UNDEFINED_FLUENCY);
        expect(warning).toBeDefined();
        expect(warning?.message).toBe('Niveau de maîtrise non reconnu');
        expect(warning?.i18nKey).toBe(LANGUAGE_VALIDATION_KEYS.UNDEFINED_FLUENCY);
        expect(warning?.severity).toBe('info');
      } else {
        // This should fail if there are no warnings
        expect('warnings' in result && result.warnings).toBeTruthy();
      }
    });
  });

  describe('validateField', () => {
    it('should validate language field correctly', () => {
      const language: LanguageInterface = {
        language: 'English',
        fluency: 'native'
      };

      const result = languageValidationService.validateField(language, 'language');
      expect(result.success).toBe(true);
    });

    it('should fail validation for missing language field', () => {
      const language: LanguageInterface = {
        language: '',
        fluency: 'native'
      };

      const result = languageValidationService.validateField(language, 'language');
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const error = result.error.find(e => e.code === ERROR_CODES.RESUME.LANGUAGE.MISSING_LANGUAGE);
        expect(error).toBeDefined();
        expect(error?.message).toBe('La langue est requise');
        expect(error?.i18nKey).toBe(LANGUAGE_VALIDATION_KEYS.MISSING_LANGUAGE);
      }
    });

    it('should validate fluency field with warnings', () => {
      const language: LanguageInterface = {
        language: 'Italian',
        fluency: ''
      };

      const result = languageValidationService.validateField(language, 'fluency');
      expect(result.success).toBe(true);
      
      // Check for warnings
      if ('warnings' in result && result.warnings) {
        const warning = result.warnings.find(w => w.code === ERROR_CODES.RESUME.LANGUAGE.MISSING_FLUENCY);
        expect(warning).toBeDefined();
        expect(warning?.message).toBe('Le niveau de maîtrise est requis');
        expect(warning?.i18nKey).toBe(LANGUAGE_VALIDATION_KEYS.MISSING_FLUENCY);
      } else {
        // This should fail if there are no warnings
        expect('warnings' in result && result.warnings).toBeTruthy();
      }
    });
  });

  describe('validateRedundantLanguages', () => {
    it('should detect redundant languages', () => {
      const languages: LanguageInterface[] = [
        { language: 'English', fluency: 'native' },
        { language: 'French', fluency: 'professional_working' },
        { language: 'english', fluency: 'c2' } // Redundant with 'English'
      ];

      const result = languageValidationService.validateRedundantLanguages(languages);
      expect(result.success).toBe(true);
      
      // Check for warnings
      if ('warnings' in result && result.warnings) {
        const warning = result.warnings.find(w => w.code === ERROR_CODES.RESUME.LANGUAGE.REDUNDANT_LANGUAGE);
        expect(warning).toBeDefined();
        expect(warning?.message).toBe('Langue déjà mentionnée dans le CV');
        expect(warning?.i18nKey).toBe(LANGUAGE_VALIDATION_KEYS.REDUNDANT_LANGUAGE);
        expect(warning?.field).toBe('languages[2].language');
      } else {
        // This should fail if there are no warnings
        expect('warnings' in result && result.warnings).toBeTruthy();
      }
    });

    it('should not detect redundancies in different languages', () => {
      const languages: LanguageInterface[] = [
        { language: 'English', fluency: 'native' },
        { language: 'French', fluency: 'professional_working' },
        { language: 'German', fluency: 'b2' }
      ];

      const result = languageValidationService.validateRedundantLanguages(languages);
      expect(result.success).toBe(true);
      expect('warnings' in result && result.warnings).toBeFalsy();
    });
  });
}); 
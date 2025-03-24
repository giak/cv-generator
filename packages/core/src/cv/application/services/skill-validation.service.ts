/**
 * Service de validation pour les compétences
 */

import {
    ResultType,
    ValidationErrorInterface,
    ValidationLayerType,
    createSuccess,
    ERROR_CODES,
    createFailure,
    createSuccessWithWarnings
} from '@cv-generator/shared';
import { BaseValidationService } from './validation.service';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';
import { z } from 'zod';

/**
 * Export validation keys for the skill validation service
 */
export const SKILL_VALIDATION_KEYS = {
  MISSING_SKILL_NAME: 'resume.skills.validation.missingSkillName',
  BRIEF_SKILL_NAME: 'resume.skills.validation.briefSkillName',
  GENERIC_SKILL: 'resume.skills.validation.genericSkill',
  UNDEFINED_LEVEL: 'resume.skills.validation.undefinedLevel',
  MISSING_KEYWORDS: 'resume.skills.validation.missingKeywords',
  UNRECOGNIZED_LEVEL: 'resume.skills.validation.unrecognizedLevel'
};

/**
 * Interface pour une compétence
 */
export interface SkillInterface {
  name: string;
  level?: string;
  keywords?: string[];
}

/**
 * Liste des niveaux de compétence valides
 */
export const VALID_SKILL_LEVELS = [
  'beginner', 'débutant',
  'intermediate', 'intermédiaire',
  'advanced', 'avancé',
  'expert'
];


/**
 * Service de validation pour les compétences
 */
export class SkillValidationService extends BaseValidationService<SkillInterface> {
  private i18nAdapter: DomainI18nPortInterface;
  
  // Schémas individuels pour chaque champ
  private nameSchema: z.ZodType<string>;
  private levelSchema: z.ZodType<string | undefined>;
  private keywordsSchema: z.ZodType<string[] | undefined>;

  /**
   * Constructeur qui initialise le service avec un adaptateur i18n
   * @param i18nAdapter Adaptateur d'internationalisation
   */
  constructor(i18nAdapter?: DomainI18nPortInterface) {
    super();
    this.i18nAdapter = i18nAdapter || this.getDefaultI18nAdapter();
    
    // Initialisation des schémas par défaut
    this.nameSchema = z.string();
    this.levelSchema = z.string().optional();
    this.keywordsSchema = z.array(z.string()).optional();
    
    
    this.initSchema();
  }

  /**
   * Récupère l'adaptateur i18n par défaut
   * @private
   */
  private getDefaultI18nAdapter(): DomainI18nPortInterface {
    return {
      translate: (key: string) => key,
      exists: () => true
    };
  }

  /**
   * Initialise le schéma Zod avec les messages traduits
   */
  private initSchema(): void {
    // Définition des schémas individuels
    this.nameSchema = z
      .string()
      .min(1, { message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.MISSING_SKILL_NAME) })
      .min(3, { message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.BRIEF_SKILL_NAME) })
      .refine(
        (val) => !['skill', 'competence', 'technology'].includes(val.toLowerCase()),
        {
          message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.GENERIC_SKILL)
        }
      );
      
    this.levelSchema = z
      .string()
      .optional()
      .refine((val) => val !== '', {
        message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.UNDEFINED_LEVEL)
      });
      
    this.keywordsSchema = z
      .array(z.string())
      .optional()
      .refine((val) => val && val.length > 0, {
        message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.MISSING_KEYWORDS)
      });
    
  }
  
  /**
   * Valide une compétence complète
   * @param skill Compétence à valider
   * @returns Résultat de validation
   */
  public validate(skill: SkillInterface): ResultType<SkillInterface> {
    // Validation manuelle pour les cas spécifiques
    const errors: ValidationErrorInterface[] = [];
    const warnings: ValidationErrorInterface[] = [];
    
    // Vérification du nom de compétence
    if (!skill.name || skill.name.trim() === '') {
      errors.push({
        code: ERROR_CODES.RESUME.SKILLS.MISSING_SKILL_NAME,
        message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.MISSING_SKILL_NAME),
        field: 'name',
        i18nKey: SKILL_VALIDATION_KEYS.MISSING_SKILL_NAME,
        severity: 'error',
        layer: ValidationLayerType.DOMAIN
      });
    } else if (skill.name.length < 3) {
      warnings.push({
        code: ERROR_CODES.RESUME.SKILLS.BRIEF_SKILL_NAME,
        message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.BRIEF_SKILL_NAME),
        field: 'name',
        i18nKey: SKILL_VALIDATION_KEYS.BRIEF_SKILL_NAME,
        severity: 'warning',
        layer: ValidationLayerType.APPLICATION,
        suggestion: "Utilisez un nom plus descriptif pour cette compétence"
      });
    }
    
    // Vérification du nom générique (warning)
    if (['skill', 'competence', 'technology', 'développement', 'development', 'programming', 'programmation']
      .includes(skill.name?.toLowerCase() || '')) {
      warnings.push({
        code: ERROR_CODES.RESUME.SKILLS.GENERIC_SKILL,
        message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.GENERIC_SKILL),
        field: 'name',
        i18nKey: SKILL_VALIDATION_KEYS.GENERIC_SKILL,
        severity: 'info',
        layer: ValidationLayerType.APPLICATION,
        suggestion: "Utilisez un nom plus spécifique pour cette compétence"
      });
    }

    // Vérification du niveau
    if (skill.level && !['beginner', 'intermediate', 'advanced', 'master', 'expert',
      'débutant', 'intermédiaire', 'avancé', 'maître', 'expert'].includes(skill.level.toLowerCase())) {
      warnings.push({
        code: ERROR_CODES.RESUME.SKILLS.UNDEFINED_LEVEL,
        message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.UNDEFINED_LEVEL),
        field: 'level',
        i18nKey: SKILL_VALIDATION_KEYS.UNDEFINED_LEVEL,
        severity: 'warning',
        layer: ValidationLayerType.APPLICATION
      });
    }
    
    // Vérification des mots-clés
    if (!skill.keywords || skill.keywords.length === 0) {
      warnings.push({
        code: ERROR_CODES.RESUME.SKILLS.MISSING_KEYWORDS,
        message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.MISSING_KEYWORDS),
        field: 'keywords',
        i18nKey: SKILL_VALIDATION_KEYS.MISSING_KEYWORDS,
        severity: 'info',
        layer: ValidationLayerType.PRESENTATION,
        suggestion: "Ajoutez des mots-clés pour améliorer la correspondance avec les offres d'emploi"
      });
    }
    
    // Si des erreurs de sévérité "error" ont été trouvées, retourner un échec
    if (errors.length > 0) {
      return createFailure([...errors, ...warnings]);
    }
    
    // Si uniquement des warnings, retourner un succès avec warnings
    if (warnings.length > 0) {
      return createSuccessWithWarnings(skill, warnings);
    }
    
    // Sinon, retourner un succès simple
    return createSuccess(skill);
  }

  /**
   * Valide un champ spécifique d'une compétence
   * @param skill Compétence
   * @param fieldName Nom du champ à valider
   * @returns Résultat de validation
   */
  public validateField<K extends keyof SkillInterface>(
    skill: SkillInterface, 
    fieldName: K
  ): ResultType<SkillInterface[K]> {
    // Validation manuelle pour chaque champ
    const errors: ValidationErrorInterface[] = [];
    const warnings: ValidationErrorInterface[] = [];
    
    switch (fieldName) {
      case 'name':
        if (!skill.name || skill.name.length < 1) {
          errors.push({
            code: ERROR_CODES.RESUME.SKILLS.MISSING_SKILL_NAME,
            message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.MISSING_SKILL_NAME),
            field: 'name',
            i18nKey: SKILL_VALIDATION_KEYS.MISSING_SKILL_NAME,
            severity: 'error',
            layer: ValidationLayerType.DOMAIN
          });
        } else if (skill.name.length < 3) {
          warnings.push({
            code: ERROR_CODES.RESUME.SKILLS.BRIEF_SKILL_NAME,
            message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.BRIEF_SKILL_NAME),
            field: 'name',
            i18nKey: SKILL_VALIDATION_KEYS.BRIEF_SKILL_NAME,
            severity: 'warning',
            layer: ValidationLayerType.APPLICATION,
            suggestion: "Utilisez un nom complet plutôt qu'un acronyme"
          });
        } else if (['skill', 'competence', 'technology', 'programming', 'programmation', 'développement', 'development'].includes(skill.name.toLowerCase())) {
          warnings.push({
            code: ERROR_CODES.RESUME.SKILLS.GENERIC_SKILL,
            message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.GENERIC_SKILL),
            field: 'name',
            i18nKey: SKILL_VALIDATION_KEYS.GENERIC_SKILL,
            severity: 'info',
            layer: ValidationLayerType.APPLICATION,
            suggestion: "Soyez plus spécifique sur cette compétence (ex: 'JavaScript' au lieu de 'Technologie')"
          });
        }
        break;
        
      case 'level':
        if (skill.level === '') {
          warnings.push({
            code: ERROR_CODES.RESUME.SKILLS.UNDEFINED_LEVEL,
            message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.UNDEFINED_LEVEL),
            field: 'level',
            i18nKey: SKILL_VALIDATION_KEYS.UNDEFINED_LEVEL,
            severity: 'warning',
            layer: ValidationLayerType.APPLICATION
          });
        }
        break;
        
      case 'keywords':
        if (!skill.keywords || skill.keywords.length === 0) {
          errors.push({
            code: ERROR_CODES.RESUME.SKILLS.MISSING_KEYWORDS,
            message: this.i18nAdapter.translate(SKILL_VALIDATION_KEYS.MISSING_KEYWORDS),
            field: 'keywords',
            i18nKey: SKILL_VALIDATION_KEYS.MISSING_KEYWORDS,
            severity: 'info',
            layer: ValidationLayerType.PRESENTATION,
            suggestion: "Ajoutez des mots-clés pour améliorer la correspondance avec les offres d'emploi"
          });
        }
        break;
        
      default:
        return createSuccess(skill[fieldName]);
    }
    
    // Si des erreurs ont été trouvées, retourner un échec
    if (errors.length > 0) {
      return createFailure(errors);
    }
    
    // Si des warnings ont été trouvés, retourner un succès avec warnings
    if (warnings.length > 0) {
      return createSuccessWithWarnings(skill[fieldName], warnings);
    }
    
    // Sinon, retourner un succès
    return createSuccess(skill[fieldName]);
  }
} 
/**
 * Service de validation pour les compétences
 */

import { z } from 'zod';
import { 
  ResultType, 
  ValidationErrorInterface,
  ValidationLayerType, 
  createSuccess, 
  createFailure,
  ERROR_CODES,
  zodToResult,
  createSuccessWithWarnings
} from '@cv-generator/shared';
import { BaseValidationService } from './validation.service';

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
  /**
   * Schéma Zod pour la validation des compétences
   */
  private readonly skillSchema = z.object({
    name: z.string({
      required_error: "Le nom de la compétence est requis"
    })
    .min(1, "Le nom de la compétence est requis")
    .min(3, "Nom de compétence trop court"),
    
    level: z.string()
      .optional()
      .refine(
        level => !level || this.isValidSkillLevel(level),
        {
          message: "Niveau de compétence non reconnu"
        }
      ),
      
    keywords: z.array(z.string())
      .optional()
      .default([])
      .refine(
        keywords => keywords && keywords.length > 0,
        {
          message: "Aucun mot-clé associé"
        }
      )
  });
  
  /**
   * Valide une compétence complète
   * @param skill Compétence à valider
   * @returns Résultat de validation
   */
  public validate(skill: SkillInterface): ResultType<SkillInterface> {
    const result = zodToResult(this.skillSchema.safeParse(skill), {
      layer: ValidationLayerType.APPLICATION,
      errorMap: (zodError) => {
        // Conversion des erreurs Zod en ValidationErrorInterface
        return zodError.errors.map(err => {
          // Extraire le champ concerné
          const field = err.path[0]?.toString() || '_global';
          const message = err.message;
          
          // Déterminer le code d'erreur approprié
          let code: string;
          let severity: 'error' | 'warning' | 'info' = 'error';
          let layer = ValidationLayerType.APPLICATION;
          
          // Mapper les erreurs selon le type et le message
          if (field === 'name') {
            if (message.includes('requis')) {
              code = ERROR_CODES.RESUME.SKILLS.MISSING_SKILL_NAME;
              layer = ValidationLayerType.DOMAIN;
            } else if (message.includes('trop court')) {
              code = ERROR_CODES.RESUME.SKILLS.BRIEF_SKILL_NAME;
              severity = 'warning';
            } else if (message.includes('générique')) {
              code = ERROR_CODES.RESUME.SKILLS.GENERIC_SKILL;
              severity = 'info';
            } else {
              code = `invalid_${field}`;
            }
          } else if (field === 'level') {
            code = ERROR_CODES.RESUME.SKILLS.UNDEFINED_LEVEL;
            severity = 'warning';
          } else if (field === 'keywords') {
            code = ERROR_CODES.RESUME.SKILLS.MISSING_KEYWORDS;
            severity = 'info';
            layer = ValidationLayerType.PRESENTATION;
          } else {
            code = `invalid_${field}`;
          }
          
          // Suggestions selon le type d'erreur
          let suggestion: string | undefined;
          if (message.includes('trop court')) {
            suggestion = "Utilisez un terme plus précis et reconnaissable";
          } else if (message.includes('générique')) {
            suggestion = "Précisez davantage, par ex. 'Programmation' → 'JavaScript ES6', 'Analyse' → 'Analyse de données avec Python'";
          } else if (field === 'level') {
            suggestion = "Utilisez un niveau standard (Débutant, Intermédiaire, Avancé, Expert)";
          } else if (field === 'keywords') {
            suggestion = "Ajoutez des mots-clés pour préciser votre expertise (frameworks, outils, méthodologies)";
          }
          
          return {
            code,
            message,
            field,
            severity,
            layer,
            suggestion
          };
        });
      }
    });
    
    // Vérifier si le nom est générique et ajouter un warning si c'est le cas
    if (result.success && skill.name && this.isGenericSkill(skill.name)) {
      const warning: ValidationErrorInterface = {
        code: ERROR_CODES.RESUME.SKILLS.GENERIC_SKILL,
        message: "Compétence trop générique",
        field: "name",
        severity: "info",
        layer: ValidationLayerType.APPLICATION,
        suggestion: "Précisez davantage, par ex. 'Programmation' → 'JavaScript ES6', 'Analyse' → 'Analyse de données avec Python'"
      };
      
      return createSuccessWithWarnings(skill, [warning]);
    }
    
    return result;
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
    // Cas spécial pour le nom - vérifier s'il est générique
    if (fieldName === 'name' && this.isGenericSkill(skill.name) && skill.name.length >= 3) {
      // Créer un avertissement pour les noms de compétence génériques
      const warning: ValidationErrorInterface = {
        code: ERROR_CODES.RESUME.SKILLS.GENERIC_SKILL,
        message: "Compétence trop générique",
        field: "name",
        severity: "info",
        layer: ValidationLayerType.APPLICATION,
        suggestion: "Précisez davantage, par ex. 'Programmation' → 'JavaScript ES6', 'Analyse' → 'Analyse de données avec Python'"
      };
      return createSuccessWithWarnings(skill[fieldName], [warning]);
    }
    
    // Créer un schéma pour le champ spécifique
    const fieldSchema = z.object({
      [fieldName]: this.skillSchema.shape[fieldName]
    });
    
    // Effectuer la validation avec Zod
    const validationResult = fieldSchema.safeParse({ [fieldName]: skill[fieldName] });
    
    // Si la validation réussit, c'est un succès
    if (validationResult.success) {
      // Vérifier s'il faut ajouter des avertissements
      if (fieldName === 'keywords' && Array.isArray(skill.keywords) && skill.keywords.length === 0) {
        // Créer un avertissement pour les mots-clés manquants
        const warning: ValidationErrorInterface = {
          code: ERROR_CODES.RESUME.SKILLS.MISSING_KEYWORDS,
          message: "Aucun mot-clé associé",
          field: "keywords",
          severity: "info",
          layer: ValidationLayerType.PRESENTATION,
          suggestion: "Ajoutez des mots-clés pour préciser votre expertise (frameworks, outils, méthodologies)"
        };
        return createSuccessWithWarnings(skill[fieldName], [warning]);
      }
      
      if (fieldName === 'level' && skill.level && !this.isValidSkillLevel(skill.level)) {
        // Créer un avertissement pour les niveaux de compétence non reconnus
        const warning: ValidationErrorInterface = {
          code: ERROR_CODES.RESUME.SKILLS.UNDEFINED_LEVEL,
          message: "Niveau de compétence non reconnu",
          field: "level",
          severity: "warning",
          layer: ValidationLayerType.APPLICATION,
          suggestion: "Utilisez un niveau standard (Débutant, Intermédiaire, Avancé, Expert)"
        };
        return createSuccessWithWarnings(skill[fieldName], [warning]);
      }
      
      return createSuccess(skill[fieldName]);
    }
    
    // En cas d'erreur, retourner un échec
    const errors = this.validate(skill).success 
      ? [] 
      : (this.validate(skill) as any).error.filter(
          (e: ValidationErrorInterface) => e.field === fieldName
        );
        
    return createFailure(errors);
  }
  
  /**
   * Vérifie si un niveau de compétence est valide
   * @param level Niveau de compétence à vérifier
   * @returns True si le niveau est valide
   */
  private isValidSkillLevel(level: string): boolean {
    return VALID_SKILL_LEVELS.some(validLevel => 
      validLevel.toLowerCase() === level.toLowerCase()
    );
  }
  
  /**
   * Vérifie si une compétence est trop générique
   * @param skillName Nom de la compétence
   * @returns True si la compétence est trop générique
   */
  private isGenericSkill(skillName: string): boolean {
    const genericTerms = [
      'programmation', 'programming',
      'développement', 'development',
      'analyse', 'analysis',
      'gestion', 'management',
      'communication',
      'langues', 'languages',
      'informatique', 'computing',
      'business',
      'technique', 'technical'
    ];
    
    return genericTerms.some(term => 
      skillName.toLowerCase() === term || 
      skillName.toLowerCase() === `${term}s`
    );
  }
} 
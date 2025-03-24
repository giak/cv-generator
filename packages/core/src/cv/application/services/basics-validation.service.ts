/**
 * Service de validation pour les informations de base du CV
 * Utilise le domaine pour la validation
 */

import {
    ResultType,
    createFailure,
    createSuccess,
    createSuccessWithWarnings,
} from '@cv-generator/shared';
import { BaseValidationService } from './validation.service';
import { Basics } from '../../domain/entities/Basics';
import type { BasicsInterface } from '@cv-generator/shared/src/types/resume.interface';
import { DomainI18nPortInterface } from '../../../shared/i18n/domain-i18n.port';

/**
 * Service de validation pour les données de base d'un CV
 * Délègue la validation à l'entité de domaine Basics
 */
export class BasicsValidationService extends BaseValidationService<BasicsInterface> {
  private i18nAdapter: DomainI18nPortInterface;

  /**
   * Constructeur qui initialise le service avec un adaptateur i18n
   * @param i18nAdapter Adaptateur d'internationalisation
   */
  constructor(i18nAdapter?: DomainI18nPortInterface) {
    super();
    this.i18nAdapter = i18nAdapter || this.getDefaultI18nAdapter();
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
   * Valide l'ensemble des données de base
   * @param basics Données de base à valider
   * @returns ResultType avec les données validées ou les erreurs
   */
  validate(basics: BasicsInterface): ResultType<BasicsInterface> {
    // Délègue la validation à l'entité de domaine avec l'adaptateur i18n
    const result = Basics.create(basics, this.i18nAdapter);
    
    // Traiter le résultat en fonction de son état
    if (result.isSuccess()) {
      if (result.hasWarnings()) {
        return createSuccessWithWarnings(basics, result.getWarnings());
      }
      return createSuccess(basics);
    }
    
    // Si échec, retourner le résultat d'échec
    return createFailure(result.getErrors());
  }

  /**
   * Valide un champ spécifique des données de base
   * @param basics Données de base complètes
   * @param fieldName Nom du champ à valider
   * @returns ResultType avec la valeur validée ou les erreurs
   */
  validateField<K extends keyof BasicsInterface>(
    basics: BasicsInterface, 
    fieldName: K
  ): ResultType<BasicsInterface[K]> {
    // Délègue la validation à l'entité de domaine avec l'adaptateur i18n
    const result = Basics.validateField(basics, fieldName, this.i18nAdapter);
    
    // On doit ajouter un cast pour gérer la conversion de type
    return result as ResultType<BasicsInterface[K]>;
  }
  
} 
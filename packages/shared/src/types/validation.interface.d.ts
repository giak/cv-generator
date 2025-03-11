/**
 * Interfaces de validation pour le système de messages d'erreur et d'aide
 * Implémentation basée sur les documents message-systeme-catalogue.md et message-systeme-validation.md
 */
import { ValidationLayerType } from '../enums/validation.enum';
/**
 * Niveaux de sévérité pour les erreurs
 */
export type ValidationSeverityType = 'info' | 'warning' | 'error';
/**
 * Interface pour les erreurs de validation
 */
export interface ValidationErrorInterface {
    /** Code unique identifiant le type d'erreur */
    code: string;
    /** Message explicatif */
    message: string;
    /** Champ concerné par l'erreur */
    field: string;
    /** Niveau de sévérité */
    severity: ValidationSeverityType;
    /** Couche architecturale responsable de la validation */
    layer: ValidationLayerType;
    /** Suggestion optionnelle pour résoudre le problème */
    suggestion?: string;
    /** Informations supplémentaires */
    additionalInfo?: Record<string, unknown>;
}
/**
 * Interface pour les messages d'aide
 */
export interface HelpMessageInterface {
    /** Identifiant unique du message */
    id: string;
    /** Titre court du message */
    title: string;
    /** Contenu détaillé */
    content: string;
    /** Champ concerné */
    field: string;
    /** Si le message doit être affiché automatiquement */
    autoShow?: boolean;
    /** Exemples de valeurs correctes */
    examples?: string[];
}

import { z } from "zod";
import type { ResultType } from "../types/result.type";
import type { ValidationErrorInterface } from "../types/validation.interface";
import { createSuccess, createFailure, createSuccessWithWarnings } from "./result.utils";
import { ValidationLayerType } from "../enums/validation.enum";

/**
 * Convertit le résultat d'une validation Zod en ResultType
 * @param zodResult Résultat de validation Zod
 * @param options Options de conversion
 * @returns ResultType contenant soit les données validées, soit les erreurs de validation
 */
export function zodToResult<T>(
  zodResult: z.SafeParseReturnType<unknown, T>,
  options: {
    layer?: ValidationLayerType;
    errorMap?: (error: z.ZodError) => ValidationErrorInterface[];
  } = {}
): ResultType<T> {
  const { layer = ValidationLayerType.APPLICATION } = options;

  if (zodResult.success) {
    return createSuccess(zodResult.data);
  }

  // Conversion des erreurs Zod en format ValidationErrorInterface
  const validationIssues: ValidationErrorInterface[] = options.errorMap
    ? options.errorMap(zodResult.error)
    : zodResult.error.errors.map((err) => ({
        code: `invalid_${err.path.join("_") || "value"}`,
        message: err.message,
        field: err.path.join(".") || "_global",
        severity: "error",
        layer,
        suggestion: getSuggestionForZodError(err),
      }));
      
  // Séparer les erreurs des avertissements
  const errors = validationIssues.filter(issue => issue.severity === "error");
  const warnings = validationIssues.filter(issue => 
    issue.severity === "warning" || issue.severity === "info"
  );
  
  // S'il y a des erreurs, on retourne un échec
  if (errors.length > 0) {
    return createFailure(errors);
  }
  
  // S'il y a seulement des avertissements, on retourne un succès avec avertissements
  if (warnings.length > 0) {
    // Utiliser zodResult.data est sécuritaire ici car nous savons qu'il n'y a pas d'erreurs bloquantes
    return createSuccessWithWarnings(
      zodResult.data as T, 
      warnings
    );
  }
  
  // Cas normal - succès sans avertissements
  return createSuccess(zodResult.data as T);
}

/**
 * Génère des suggestions en fonction du type d'erreur Zod
 * @param error Erreur Zod
 * @returns Suggestion ou undefined
 */
function getSuggestionForZodError(error: z.ZodIssue): string | undefined {
  switch (error.code) {
    case "invalid_type":
      return `Attendu: ${error.expected}, reçu: ${error.received}`;
    case "too_small":
      return `La valeur doit être ${
        error.type === "string" ? "plus longue" : "plus grande"
      } (minimum: ${error.minimum})`;
    case "too_big":
      return `La valeur doit être ${
        error.type === "string" ? "plus courte" : "plus petite"
      } (maximum: ${error.maximum})`;
    case "invalid_string":
      if (error.validation === "email") {
        return "Veuillez entrer une adresse email valide";
      }
      if (error.validation === "url") {
        return "Veuillez entrer une URL valide";
      }
      return undefined;
    default:
      return undefined;
  }
} 
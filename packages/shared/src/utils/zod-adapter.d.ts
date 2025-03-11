import { z } from "zod";
import type { ResultType } from "../types/result.type";
import type { ValidationErrorInterface } from "../types/validation.interface";
import { ValidationLayerType } from "../enums/validation.enum";
/**
 * Convertit le résultat d'une validation Zod en ResultType
 * @param zodResult Résultat de validation Zod
 * @param options Options de conversion
 * @returns ResultType contenant soit les données validées, soit les erreurs de validation
 */
export declare function zodToResult<T>(zodResult: z.SafeParseReturnType<unknown, T>, options?: {
    layer?: ValidationLayerType;
    errorMap?: (error: z.ZodError) => ValidationErrorInterface[];
}): ResultType<T>;

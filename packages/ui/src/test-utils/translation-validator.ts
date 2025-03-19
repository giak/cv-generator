import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Interface pour représenter une clé manquante ou non concordante
 */
export interface TranslationIssue {
  key: string
  type: 'missing' | 'type_mismatch'
  locale: string
  path: string[]
}

/**
 * Interface pour les résultats de validation
 */
export interface ValidationResult {
  missingKeys: TranslationIssue[]
  typeMismatches: TranslationIssue[]
  isValid: boolean
}

/**
 * Compare récursivement deux objets de traduction pour trouver les différences
 * @param source Objet source (référence)
 * @param target Objet cible à comparer
 * @param sourceLocale Code de la locale source
 * @param targetLocale Code de la locale cible
 * @param issues Tableau pour collecter les problèmes trouvés
 * @param path Chemin actuel dans l'objet (pour le reporting)
 */
function compareTranslationObjects(
  source: Record<string, any>,
  target: Record<string, any>,
  sourceLocale: string,
  targetLocale: string,
  issues: TranslationIssue[],
  path: string[] = []
) {
  // Vérifier les clés dans l'objet source qui pourraient manquer dans la cible
  for (const key of Object.keys(source)) {
    const currentPath = [...path, key]
    
    // Vérifier si la clé existe dans la cible
    if (!(key in target)) {
      issues.push({
        key,
        type: 'missing',
        locale: targetLocale,
        path: currentPath
      })
      continue
    }
    
    // Vérifier la cohérence de type
    if (typeof source[key] !== typeof target[key]) {
      issues.push({
        key,
        type: 'type_mismatch',
        locale: targetLocale,
        path: currentPath
      })
      continue
    }
    
    // Si c'est un objet, récursion
    if (typeof source[key] === 'object' && source[key] !== null) {
      compareTranslationObjects(
        source[key],
        target[key],
        sourceLocale,
        targetLocale,
        issues,
        currentPath
      )
    }
  }
}

/**
 * Charge et valide les fichiers de traduction
 * @param localesPath Chemin vers le dossier contenant les fichiers de traduction
 * @param locales Liste des locales à comparer
 * @returns Résultat de la validation
 */
export function validateTranslations(
  localesPath: string = './src/i18n/locales',
  locales: string[] = ['fr', 'en']
): ValidationResult {
  const issues: TranslationIssue[] = []
  
  try {
    // Charger tous les fichiers de traduction
    const translations: Record<string, Record<string, any>> = {}
    
    for (const locale of locales) {
      const filePath = join(localesPath, `${locale}.json`)
      try {
        const content = readFileSync(filePath, 'utf8')
        translations[locale] = JSON.parse(content)
      } catch (error) {
        console.error(`Error loading translation file for ${locale}:`, error)
        throw new Error(`Failed to load translation file for ${locale}`)
      }
    }
    
    // Comparer chaque paire de locales dans les deux sens
    for (let i = 0; i < locales.length; i++) {
      for (let j = 0; j < locales.length; j++) {
        if (i !== j) {
          compareTranslationObjects(
            translations[locales[i]],
            translations[locales[j]],
            locales[i],
            locales[j],
            issues
          )
        }
      }
    }
    
    // Séparer les problèmes par type
    const missingKeys = issues.filter(issue => issue.type === 'missing')
    const typeMismatches = issues.filter(issue => issue.type === 'type_mismatch')
    
    return {
      missingKeys,
      typeMismatches,
      isValid: issues.length === 0
    }
  } catch (error) {
    console.error('Error validating translations:', error)
    throw error
  }
}

/**
 * Génère un rapport formaté des problèmes de traduction
 * @param result Résultat de la validation
 * @returns Rapport formaté sous forme de chaîne
 */
export function generateTranslationReport(result: ValidationResult): string {
  const lines: string[] = []
  
  lines.push('# Rapport de Validation des Traductions')
  lines.push('')
  
  if (result.isValid) {
    lines.push('✅ **Aucun problème détecté**')
    return lines.join('\n')
  }
  
  // Résumé des problèmes
  lines.push('## Résumé')
  lines.push('')
  lines.push(`- Clés manquantes: ${result.missingKeys.length}`)
  lines.push(`- Incohérences de type: ${result.typeMismatches.length}`)
  lines.push('')
  
  // Détail des clés manquantes
  if (result.missingKeys.length > 0) {
    lines.push('## Clés manquantes')
    lines.push('')
    
    // Grouper par locale
    const byLocale: Record<string, TranslationIssue[]> = {}
    
    for (const issue of result.missingKeys) {
      if (!byLocale[issue.locale]) {
        byLocale[issue.locale] = []
      }
      byLocale[issue.locale].push(issue)
    }
    
    // Afficher les problèmes par locale
    for (const locale of Object.keys(byLocale)) {
      lines.push(`### Dans la locale: ${locale}`)
      lines.push('')
      lines.push('| Chemin complet | Clé manquante |')
      lines.push('|---------------|---------------|')
      
      for (const issue of byLocale[locale]) {
        const fullPath = issue.path.join('.')
        lines.push(`| \`${fullPath}\` | \`${issue.key}\` |`)
      }
      
      lines.push('')
    }
  }
  
  // Détail des incohérences de type
  if (result.typeMismatches.length > 0) {
    lines.push('## Incohérences de type')
    lines.push('')
    lines.push('| Chemin | Locale | Problème |')
    lines.push('|--------|--------|----------|')
    
    for (const issue of result.typeMismatches) {
      const fullPath = issue.path.join('.')
      lines.push(`| \`${fullPath}\` | ${issue.locale} | Type incompatible |`)
    }
    
    lines.push('')
  }
  
  return lines.join('\n')
}

/**
 * Fonction utilitaire pour exécuter une validation complète et générer un rapport
 * @param localesPath Chemin vers le dossier contenant les fichiers de traduction
 * @param locales Liste des locales à comparer
 * @returns Rapport formaté
 */
export function validateAndGenerateReport(
  localesPath: string = './src/i18n/locales',
  locales: string[] = ['fr', 'en']
): string {
  try {
    const result = validateTranslations(localesPath, locales)
    return generateTranslationReport(result)
  } catch (error) {
    return `# Erreur lors de la validation des traductions\n\n${error}`
  }
} 
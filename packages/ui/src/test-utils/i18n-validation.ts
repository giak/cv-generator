import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { validateTranslations, generateTranslationReport } from './translation-validator'
import { detectHardcodedText, generateHardcodedTextReport } from './hardcoded-text-detector'

/**
 * Options pour la validation i18n
 */
export interface I18nValidationOptions {
  // Chemin du dossier source (racine du projet)
  sourcePath: string
  // Chemin du dossier pour la sortie des rapports
  outputPath: string
  // Chemins vers les fichiers de traduction
  localesPath: string
  // Locales à comparer
  locales: string[]
  // Dossiers à analyser pour les textes codés en dur
  dirsToScan: string[]
  // Dossiers à ignorer
  ignoreFolders: string[]
}

/**
 * Options par défaut
 */
const DEFAULT_OPTIONS: I18nValidationOptions = {
  sourcePath: process.cwd(),
  outputPath: join(process.cwd(), 'reports/i18n'),
  localesPath: join(process.cwd(), 'src/i18n/locales'),
  locales: ['fr', 'en'],
  dirsToScan: ['src/components', 'src/modules'],
  ignoreFolders: ['node_modules', 'dist', 'coverage', '__tests__', '.vite', '.nuxt']
}

/**
 * Exécute une validation complète de l'internationalisation et génère des rapports
 * @param options Options de validation
 */
export async function runI18nValidation(
  customOptions: Partial<I18nValidationOptions> = {}
): Promise<void> {
  const options = { ...DEFAULT_OPTIONS, ...customOptions }
  
  // S'assurer que le dossier de sortie existe
  if (!existsSync(options.outputPath)) {
    mkdirSync(options.outputPath, { recursive: true })
  }
  
  console.log('🔍 Analyse de l\'internationalisation en cours...')
  
  try {
    // Validation des clés de traduction
    console.log('📊 Vérification de la cohérence des traductions...')
    const translations = validateTranslations(options.localesPath, options.locales)
    const translationReport = generateTranslationReport(translations)
    
    const translationReportPath = join(options.outputPath, 'translation-report.md')
    writeFileSync(translationReportPath, translationReport)
    console.log(`✅ Rapport de traduction généré: ${translationReportPath}`)
    
    if (!translations.isValid) {
      console.warn(`⚠️ ${translations.missingKeys.length} clés manquantes et ${translations.typeMismatches.length} incohérences de type détectées.`)
    } else {
      console.log('✅ Aucun problème détecté dans les traductions.')
    }
    
    // Détection des textes codés en dur
    console.log('🔍 Recherche de textes codés en dur...')
    
    const hardcodedTextIssues = []
    
    for (const dir of options.dirsToScan) {
      const dirPath = join(options.sourcePath, dir)
      console.log(`Analyse du dossier: ${dirPath}`)
      
      const issues = detectHardcodedText(dirPath, {
        ignoreFolders: options.ignoreFolders
      })
      
      hardcodedTextIssues.push(...issues)
    }
    
    const hardcodedTextReport = generateHardcodedTextReport(hardcodedTextIssues)
    const hardcodedTextReportPath = join(options.outputPath, 'hardcoded-text-report.md')
    writeFileSync(hardcodedTextReportPath, hardcodedTextReport)
    
    console.log(`✅ Rapport des textes codés en dur généré: ${hardcodedTextReportPath}`)
    
    if (hardcodedTextIssues.length > 0) {
      console.warn(`⚠️ ${hardcodedTextIssues.length} textes potentiellement codés en dur détectés.`)
    } else {
      console.log('✅ Aucun texte codé en dur détecté.')
    }
    
    // Générer le rapport résumé
    const summaryReport = generateSummaryReport(translations, hardcodedTextIssues.length)
    const summaryReportPath = join(options.outputPath, 'i18n-summary-report.md')
    writeFileSync(summaryReportPath, summaryReport)
    
    console.log(`✅ Rapport résumé généré: ${summaryReportPath}`)
    console.log('🎉 Validation i18n terminée !')
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation i18n:', error)
    throw error
  }
}

/**
 * Génère un rapport résumé de l'état de l'internationalisation
 */
function generateSummaryReport(
  translations: ReturnType<typeof validateTranslations>,
  hardcodedTextCount: number
): string {
  const lines: string[] = []
  
  lines.push('# Rapport d\'Internationalisation - Résumé')
  lines.push('')
  lines.push(`Date: ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  // Statut général
  const isFullyInternationalized = translations.isValid && hardcodedTextCount === 0
  
  lines.push('## Statut Général')
  lines.push('')
  
  if (isFullyInternationalized) {
    lines.push('✅ **L\'application est entièrement internationalisée**')
  } else {
    lines.push('⚠️ **L\'application n\'est pas entièrement internationalisée**')
  }
  
  lines.push('')
  lines.push('## Métriques')
  lines.push('')
  lines.push('| Métrique | Valeur | Statut |')
  lines.push('|----------|--------|--------|')
  
  // Cohérence des traductions
  const translationStatus = translations.isValid ? '✅' : '⚠️'
  lines.push(`| Cohérence des traductions | ${translations.missingKeys.length + translations.typeMismatches.length} problèmes | ${translationStatus} |`)
  
  // Textes codés en dur
  const hardcodedStatus = hardcodedTextCount === 0 ? '✅' : '⚠️'
  lines.push(`| Textes codés en dur | ${hardcodedTextCount} détectés | ${hardcodedStatus} |`)
  
  lines.push('')
  lines.push('## Actions Recommandées')
  lines.push('')
  
  if (translations.missingKeys.length > 0) {
    lines.push(`- [ ] Ajouter les ${translations.missingKeys.length} clés de traduction manquantes (voir rapport détaillé)`)
  }
  
  if (translations.typeMismatches.length > 0) {
    lines.push(`- [ ] Corriger les ${translations.typeMismatches.length} incohérences de type (voir rapport détaillé)`)
  }
  
  if (hardcodedTextCount > 0) {
    lines.push(`- [ ] Remplacer les ${hardcodedTextCount} textes codés en dur par des appels i18n (voir rapport détaillé)`)
  }
  
  if (isFullyInternationalized) {
    lines.push('- [x] Aucune action requise, l\'application est entièrement internationalisée')
  }
  
  lines.push('')
  lines.push('## Rapports Détaillés')
  lines.push('')
  lines.push('- [Rapport de validation des traductions](./translation-report.md)')
  lines.push('- [Rapport des textes codés en dur](./hardcoded-text-report.md)')
  
  return lines.join('\n')
}

// Exécuter la validation si le script est appelé directement
if (require.main === module) {
  runI18nValidation()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Erreur lors de la validation i18n:', error)
      process.exit(1)
    })
} 
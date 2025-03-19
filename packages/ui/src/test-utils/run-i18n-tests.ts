#!/usr/bin/env node

import { spawnSync } from 'child_process'
import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { runI18nValidation } from './i18n-validation'

// Configuration
const PROJECT_ROOT = process.cwd()
const REPORTS_DIR = join(PROJECT_ROOT, 'reports/i18n')
const TIMESTAMP = new Date().toISOString().replace(/:/g, '-').split('.')[0]
const REPORT_FILE = join(REPORTS_DIR, `i18n-test-report-${TIMESTAMP}.md`)

/**
 * Exécute une commande shell et retourne le résultat
 */
function runCommand(command: string, args: string[]): { stdout: string; stderr: string; success: boolean } {
  console.log(`Running: ${command} ${args.join(' ')}`)
  
  const result = spawnSync(command, args, {
    encoding: 'utf-8',
    stdio: 'pipe',
    cwd: PROJECT_ROOT
  })
  
  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    success: result.status === 0
  }
}

/**
 * Exécute les tests Vitest liés à l'internationalisation
 */
function runI18nTests(): { success: boolean; output: string } {
  // Exécuter les tests i18n
  console.log('🧪 Exécution des tests d\'internationalisation...')
  
  const testResult = runCommand('npx', [
    'vitest', 'run',
    // Exécuter uniquement les tests liés à i18n
    'i18n',
    '--reporter', 'verbose'
  ])
  
  return {
    success: testResult.success,
    output: testResult.stdout + (testResult.stderr ? `\nErrors:\n${testResult.stderr}` : '')
  }
}

/**
 * Génère un rapport Markdown avec les résultats des tests
 */
function generateTestReport(testResults: { success: boolean; output: string }): string {
  const lines: string[] = []
  
  lines.push('# Rapport des Tests d\'Internationalisation')
  lines.push('')
  lines.push(`Date: ${new Date().toISOString().split('T')[0]}`)
  lines.push('')
  
  // Statut général
  lines.push('## Résultats des Tests')
  lines.push('')
  
  if (testResults.success) {
    lines.push('✅ **Tous les tests d\'internationalisation ont réussi**')
  } else {
    lines.push('❌ **Certains tests d\'internationalisation ont échoué**')
  }
  
  lines.push('')
  lines.push('## Détails des Tests')
  lines.push('')
  lines.push('```')
  lines.push(testResults.output)
  lines.push('```')
  
  return lines.join('\n')
}

/**
 * Fonction principale qui exécute les tests et génère les rapports
 */
async function main() {
  console.log('🌐 Exécution des tests et validation d\'internationalisation...')
  
  // S'assurer que le dossier de rapports existe
  if (!existsSync(REPORTS_DIR)) {
    mkdirSync(REPORTS_DIR, { recursive: true })
  }
  
  try {
    // 1. Exécuter les tests d'internationalisation
    const testResults = runI18nTests()
    
    // 2. Générer le rapport de tests
    const testReport = generateTestReport(testResults)
    writeFileSync(REPORT_FILE, testReport)
    console.log(`📝 Rapport de tests généré: ${REPORT_FILE}`)
    
    // 3. Exécuter la validation de l'internationalisation
    await runI18nValidation({
      outputPath: REPORTS_DIR,
      localesPath: join(PROJECT_ROOT, 'src/i18n/locales'),
      dirsToScan: ['src/components', 'src/modules']
    })
    
    console.log('🎉 Toutes les validations d\'internationalisation sont terminées !')
    
    // Afficher un résumé
    console.log('')
    console.log('📊 Résumé:')
    console.log(`Tests: ${testResults.success ? '✅ Réussis' : '❌ Échecs'}`)
    console.log(`Reports générés dans: ${REPORTS_DIR}`)
    
    // Sortir avec un code d'erreur si les tests ont échoué
    if (!testResults.success) {
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des tests d\'internationalisation:', error)
    process.exit(1)
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main().catch(err => {
    console.error('Erreur non gérée:', err)
    process.exit(1)
  })
}

export { runI18nTests, generateTestReport } 
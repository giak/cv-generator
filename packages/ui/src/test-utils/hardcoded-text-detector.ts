import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'

/**
 * Interface pour représenter un texte codé en dur détecté
 */
export interface HardcodedTextIssue {
  filePath: string
  line: number
  column: number
  text: string
  context: string
}

/**
 * Options pour la détection de texte codé en dur
 */
export interface DetectionOptions {
  // Extensions de fichiers à analyser
  extensions: string[]
  // Dossiers à ignorer
  ignoreFolders: string[]
  // Motifs regex à ignorer (exemples, variables, etc.)
  ignorePatterns: RegExp[]
  // Longueur minimale du texte pour être considéré comme potentiellement codé en dur
  minTextLength: number
}

/**
 * Options par défaut pour la détection
 */
const DEFAULT_OPTIONS: DetectionOptions = {
  extensions: ['.vue', '.ts', '.tsx', '.js', '.jsx'],
  ignoreFolders: ['node_modules', 'dist', 'build', 'coverage', '__tests__'],
  ignorePatterns: [
    // Ignorer les variables et expressions
    /{{[^}]*}}/,
    // Ignorer les attributs de classe, style, etc.
    /class="[^"]*"/,
    /style="[^"]*"/,
    /:[a-zA-Z0-9]+="[^"]*"/,
    /v-[a-zA-Z0-9]+="[^"]*"/,
    // Ignorer les commentaires
    /<!--[\s\S]*?-->/,
    /\/\/[^\n]*/,
    /\/\*[\s\S]*?\*\//,
    // Ignorer les imports et exports
    /import\s+.*from\s+["'][^"']*["']/,
    /export\s+/,
    // Ignorer les lignes contenant t() ou $t()
    /\$t\([^)]*\)/,
    /t\([^)]*\)/
  ],
  minTextLength: 3
}

/**
 * Analyse un fichier pour trouver les textes potentiellement codés en dur
 * @param filePath Chemin du fichier à analyser
 * @param options Options de détection
 * @returns Liste des problèmes détectés
 */
function analyzeFile(
  filePath: string,
  options: DetectionOptions = DEFAULT_OPTIONS
): HardcodedTextIssue[] {
  const issues: HardcodedTextIssue[] = []
  const content = readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  // Regex pour détecter du texte dans les balises template
  const templateTextRegex = />([^<>]+)</g
  
  // Regex pour détecter du texte dans les attributs
  const attributeTextRegex = /="([^"]*)"/g
  
  // Regex pour détecter du texte dans les chaînes de caractères JavaScript
  const jsStringRegex = /["']([^"']+)["']/g
  
  lines.forEach((line, lineIndex) => {
    // Ignorer les lignes qui correspondent aux patterns à ignorer
    if (options.ignorePatterns.some(pattern => pattern.test(line))) {
      return
    }
    
    // Rechercher du texte dans les balises template
    let match: RegExpExecArray | null
    
    // Réinitialiser le regex pour chaque ligne
    templateTextRegex.lastIndex = 0
    while ((match = templateTextRegex.exec(line)) !== null) {
      const text = match[1].trim()
      if (text.length >= options.minTextLength && !/^[0-9.,]+$/.test(text)) {
        issues.push({
          filePath,
          line: lineIndex + 1,
          column: match.index + 1,
          text,
          context: line.trim()
        })
      }
    }
    
    // Rechercher du texte dans les attributs
    attributeTextRegex.lastIndex = 0
    while ((match = attributeTextRegex.exec(line)) !== null) {
      // Ignorer les attributs qui contiennent des accolades (expressions Vue)
      if (!/{{.*}}/.test(match[1])) {
        const text = match[1].trim()
        if (text.length >= options.minTextLength && !/^[0-9.,]+$/.test(text)) {
          // Vérifier que ce n'est pas un attribut spécial comme class, style, etc.
          const attributeStart = line.substring(0, match.index).trimEnd()
          if (!/(class|style|:|\@|v-)="$/.test(attributeStart)) {
            issues.push({
              filePath,
              line: lineIndex + 1,
              column: match.index + 1,
              text,
              context: line.trim()
            })
          }
        }
      }
    }
    
    // Rechercher du texte dans les chaînes JavaScript (seulement pour les sections <script>)
    if (line.includes('<script') || content.includes('<script')) {
      jsStringRegex.lastIndex = 0
      while ((match = jsStringRegex.exec(line)) !== null) {
        const text = match[1].trim()
        if (text.length >= options.minTextLength && !/^[0-9.,]+$/.test(text)) {
          // Ignorer les imports, les noms de propriétés, etc.
          const beforeString = line.substring(0, match.index).trimEnd()
          if (!/(import|from|require|path|name|component|prop|emits|key)/.test(beforeString)) {
            issues.push({
              filePath,
              line: lineIndex + 1,
              column: match.index + 1,
              text,
              context: line.trim()
            })
          }
        }
      }
    }
  })
  
  return issues
}

/**
 * Parcourt récursivement les dossiers pour analyser les fichiers
 * @param dirPath Chemin du dossier à parcourir
 * @param options Options de détection
 * @param results Tableau pour collecter les résultats
 */
function scanDirectory(
  dirPath: string,
  options: DetectionOptions,
  results: HardcodedTextIssue[] = []
): HardcodedTextIssue[] {
  const entries = readdirSync(dirPath)
  
  for (const entry of entries) {
    const fullPath = join(dirPath, entry)
    const stats = statSync(fullPath)
    
    if (stats.isDirectory()) {
      // Ignorer les dossiers spécifiés
      if (options.ignoreFolders.includes(entry)) {
        continue
      }
      
      // Récursion pour les sous-dossiers
      scanDirectory(fullPath, options, results)
    } else {
      // Vérifier l'extension du fichier
      const ext = extname(fullPath)
      if (options.extensions.includes(ext)) {
        const fileIssues = analyzeFile(fullPath, options)
        results.push(...fileIssues)
      }
    }
  }
  
  return results
}

/**
 * Détecte les textes codés en dur dans les composants
 * @param rootDir Dossier racine pour commencer l'analyse
 * @param options Options de détection
 * @returns Liste des problèmes détectés
 */
export function detectHardcodedText(
  rootDir: string,
  options: Partial<DetectionOptions> = {}
): HardcodedTextIssue[] {
  // Fusionner les options par défaut avec les options fournies
  const mergedOptions: DetectionOptions = {
    ...DEFAULT_OPTIONS,
    ...options
  }
  
  return scanDirectory(rootDir, mergedOptions)
}

/**
 * Génère un rapport formaté des textes codés en dur
 * @param issues Liste des problèmes détectés
 * @returns Rapport formaté sous forme de chaîne
 */
export function generateHardcodedTextReport(issues: HardcodedTextIssue[]): string {
  const lines: string[] = []
  
  lines.push('# Rapport de Détection des Textes Codés en Dur')
  lines.push('')
  
  if (issues.length === 0) {
    lines.push('✅ **Aucun texte codé en dur détecté**')
    return lines.join('\n')
  }
  
  lines.push(`## Résumé: ${issues.length} problèmes potentiels détectés`)
  lines.push('')
  
  // Grouper par fichier
  const byFile: Record<string, HardcodedTextIssue[]> = {}
  
  for (const issue of issues) {
    if (!byFile[issue.filePath]) {
      byFile[issue.filePath] = []
    }
    byFile[issue.filePath].push(issue)
  }
  
  // Afficher les problèmes par fichier
  for (const [filePath, fileIssues] of Object.entries(byFile)) {
    lines.push(`### ${filePath}`)
    lines.push('')
    lines.push('| Ligne | Texte | Contexte |')
    lines.push('|-------|-------|----------|')
    
    for (const issue of fileIssues) {
      const sanitizedContext = issue.context
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      
      lines.push(`| ${issue.line} | "${issue.text}" | \`${sanitizedContext}\` |`)
    }
    
    lines.push('')
  }
  
  lines.push('## Recommandations')
  lines.push('')
  lines.push('Pour chaque texte identifié:')
  lines.push('')
  lines.push('1. Créer une clé de traduction appropriée dans le fichier `shared/src/i18n/keys/index.ts`')
  lines.push('2. Ajouter les traductions dans les fichiers `fr.json` et `en.json`')
  lines.push('3. Remplacer le texte codé en dur par un appel à la fonction de traduction, par exemple:')
  lines.push('   ```vue')
  lines.push('   <template>')
  lines.push('     <!-- Avant -->')
  lines.push('     <h1>Titre codé en dur</h1>')
  lines.push('     ')
  lines.push('     <!-- Après -->')
  lines.push('     <h1>{{ $t(TRANSLATION_KEYS.COMPONENT.TITLE) }}</h1>')
  lines.push('   </template>')
  lines.push('   ```')
  
  return lines.join('\n')
} 
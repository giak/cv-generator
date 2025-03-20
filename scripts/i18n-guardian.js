#!/usr/bin/env node

/**
 * I18n Guardian - Système intelligent et sécurisé de gestion des traductions
 * 
 * Un système robuste et fiable pour gérer les traductions avec:
 * 1. Détection précise des clés utilisées avec reconnaissance de patterns complexes
 * 2. Système de sauvegarde automatique avant modification
 * 3. Protection contre la suppression des clés essentielles via listes de protection
 * 4. Analyse contextuelle pour minimiser les faux positifs/négatifs
 * 5. Interface interactive pour validation humaine des actions critiques
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { glob } from 'glob';
import readline from 'readline';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Chemins de fichiers et dossiers à analyser
const SOURCE_DIRS = [
  path.join(rootDir, 'packages/ui/src'),
  path.join(rootDir, 'packages/shared/src'),
  path.join(rootDir, 'packages/core/src'),
  path.join(rootDir, 'packages/infrastructure/src')
];

// Dossiers à exclure de l'analyse
const EXCLUDED_DIRS = [
  'node_modules',
  'dist',
  '.git',
  '.vite',
  'coverage',
  'tests',
  '__tests__',
  '.nuxt',
  '.output'
];

// Extensions de fichiers à analyser
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.vue'];

// Chemins des fichiers de traduction
const LOCALES_DIR = path.join(rootDir, 'packages/ui/src/i18n/locales');
const BACKUPS_DIR = path.join(LOCALES_DIR, 'backups');
const REPORT_DIR = path.join(rootDir, 'reports/i18n');
const REPORT_PATH = path.join(REPORT_DIR, 'i18n-guardian-report.json');

// Liste des clés de traduction essentielles à ne jamais supprimer
// Utiliser des expressions régulières pour cibler des catégories de clés
const ESSENTIAL_KEYS_PATTERNS = [
  // Préserver toutes les clés de niveau supérieur
  /^common\./,
  /^resume\./,
  /^ui\./,
  /^navigation\./
];

// Liste des clés à exclure même si détectées - ce sont des faux positifs (noms de variables ou fonctions)
const FALSE_POSITIVE_KEYS = [
  // Cas d'API et de fonctions
  'i18nPlugin',
  'useI18n',
  'createI18n',
  'setLocale',
  'LOCALE_STORAGE_KEY',
  'DomainI18nPortInterface',
  'VueI18nAdapter',
  'loadLocaleMessages',
  'preloadDefaultMessages',
  'runI18nValidation',
  'createTestingOptions',
  'DEFAULT_LOCALE',
  'useAppI18n',
  'i18n.translate',
  'i18n.exists',
  'changeLocale',
  'currentLocale',
  
  // Cas des constantes de validation
  'VALIDATION_KEYS',
  'AWARD_VALIDATION_KEYS',
  'EDUCATION_VALIDATION_KEYS',
  'WORK_VALIDATION_KEYS',
  'PROJECT_VALIDATION_KEYS',
  'SKILL_VALIDATION_KEYS',
  'CERTIFICATE_VALIDATION_KEYS',
  'VOLUNTEER_VALIDATION_KEYS',
  'LANGUAGE_VALIDATION_KEYS',
  'INTEREST_VALIDATION_KEYS',
  'PUBLICATION_VALIDATION_KEYS',
  'REFERENCE_VALIDATION_KEYS',
  
  // Autres constantes qui ne sont pas des clés directes
  'ERROR_CODES',
  'TRANSLATION_KEYS',
  'ValidationLayerType'
];

// Modèles regex pour détecter les clés de traduction dans le code
const TRANSLATION_KEY_PATTERNS = [
  // Pattern 1: t('ma.cle.de.traduction') - pattern classique avec t()
  /t\s*\(\s*['"]([\w.-]+)['"]\s*(?:,|\))/g,
  
  // Pattern 2: i18n.t('ma.cle.de.traduction')
  /i18n\.t\s*\(\s*['"]([\w.-]+)['"]\s*(?:,|\))/g,
  
  // Pattern 3: $t('ma.cle.de.traduction')
  /\$t\s*\(\s*['"]([\w.-]+)['"]\s*(?:,|\))/g,
  
  // Pattern 4: useTranslation('ma.cle.de.traduction')
  /useTranslation\s*\(\s*['"]([\w.-]+)['"]\s*\)/g,
  
  // Pattern 5: Trans i18nKey="ma.cle.de.traduction"
  /i18nKey\s*=\s*['"]([\w.-]+)['"]/g,
  
  // Pattern 6: path="ma.cle.de.traduction" dans context d'i18n
  /path\s*=\s*['"]([\w.-]+)['"]/g,
  
  // Pattern 7: translate="ma.cle.de.traduction" comme directive
  /translate\s*=\s*['"]([\w.-]+)['"]/g,
  
  // Pattern 8: 'TRANSLATION_KEYS.section.key'
  /TRANSLATION_KEYS\.([a-zA-Z0-9.]+)/g,
  
  // Pattern 9: import { ... } from 'i18n/keys' suivi de références
  /['"]i18n\/keys['"].*?{(.*?)}/gs,
  
  // Pattern 10: v-t="'ma.cle.de.traduction'"
  /v-t\s*=\s*['"]([\w.-]+)['"]/g,
  
  // Pattern 11: t(key) où key est une variable ou constante
  /t\s*\(\s*([a-zA-Z][a-zA-Z0-9_]*)\s*\)/g,
  
  // Pattern 12: intl.formatMessage({ id: 'ma.cle.de.traduction' })
  /formatMessage\s*\(\s*{\s*id\s*:\s*['"]([\w.-]+)['"]\s*}/g,
  
  // Pattern 13: i18nAdapter.translate('ma.cle.de.traduction') - cas des adaptateurs domain
  /i18nAdapter\.translate\s*\(\s*['"]([\w.-]+)['"]\s*(?:,|\))/g,
  
  // Pattern 14: this.i18nAdapter.translate('ma.cle.de.traduction') - cas des adaptateurs dans les classes
  /this\.i18nAdapter\.translate\s*\(\s*['"]([\w.-]+)['"]\s*(?:,|\))/g,
  
  // Pattern 15: i18nAdapter.translate(KEY_CONSTANT) - cas des constantes de validation
  /i18nAdapter\.translate\s*\(\s*([A-Z][A-Z0-9_]+(?:\.[A-Z][A-Z0-9_]+)*)\s*(?:,|\))/g,
  
  // Pattern 16: this.i18nAdapter.translate(KEY_CONSTANT) - cas des constantes dans les classes
  /this\.i18nAdapter\.translate\s*\(\s*([A-Z][A-Z0-9_]+(?:\.[A-Z][A-Z0-9_]+)*)\s*(?:,|\))/g,
  
  // Pattern 17: SOME_VALIDATION_KEYS.KEY_NAME: 'resume.section.validation.key'
  /[A-Z][A-Z0-9_]+(?:_KEYS|_KEY)(?:\.[A-Z0-9_]+)*\s*:\s*['"]([a-z][\w.-]+)['"]/g,
  
  // Pattern 18: Cas des constantes d'erreur avec clés i18n
  /i18nKey\s*:\s*['"]([a-z][\w.-]+)['"]/g,
  
  // Pattern 19: Cas des constantes d'erreur avec clés i18n via constantes
  /i18nKey\s*:\s*([A-Z][A-Z0-9_]+(?:\.[A-Z][A-Z0-9_]+)*)/g,
  
  // Pattern 20: messages directs dans les services de validation
  /['"]([a-z][\w.-]+(?:\.validation\.[a-z][\w.-]+))['"]/g,
  
  // Pattern 21: i18n.translate('ma.cle.de.traduction') - Epic 5 pattern (useAppI18n)
  /i18n\.translate\s*\(\s*['"]([\w.-]+)['"]\s*(?:,|\))/g,
  
  // Pattern 22: i18n.translate(TRANSLATION_KEYS.X.Y.Z) - Epic 5 pattern avec constantes
  /i18n\.translate\s*\(\s*TRANSLATION_KEYS\.([A-Z0-9_.]+)\s*(?:,|\))/g,
  
  // Pattern 23: i18n.exists('ma.cle.de.traduction') - vérification d'existence de clé
  /i18n\.exists\s*\(\s*['"]([\w.-]+)['"]\s*\)/g,
  
  // Pattern 24: i18n.exists(TRANSLATION_KEYS.X.Y.Z) - vérification avec constante
  /i18n\.exists\s*\(\s*TRANSLATION_KEYS\.([A-Z0-9_.]+)\s*\)/g,
  
  // Pattern 25: { field: i18n.translate(key) } - traduction dans objet
  /field\s*:\s*i18n\.translate\s*\(\s*['"]([\w.-]+)['"]\s*\)/g
];

// Règles heuristiques pour filtrer les faux positifs
const isLikelyTranslationKey = (key) => {
  // Les clés commencent généralement par une lettre minuscule
  if (!/^[a-z]/.test(key)) return false;
  
  // Les clés ont généralement des segments (contenant des points)
  if (!key.includes('.')) return false;
  
  // Les clés ne contiennent pas de segments vides
  if (key.includes('..')) return false;
  
  // Exclure les faux positifs connus
  if (FALSE_POSITIVE_KEYS.includes(key)) return false;
  
  return true;
};

/**
 * Vérifie si un chemin doit être exclu de l'analyse
 */
function shouldExcludePath(filePath) {
  return EXCLUDED_DIRS.some(dir => {
    const pattern = new RegExp(`[\\\\/]${dir}[\\\\/]`);
    return pattern.test(filePath);
  });
}

/**
 * S'assure que les répertoires nécessaires existent
 */
function ensureDirectoriesExist() {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
  }
}

/**
 * Crée une sauvegarde des fichiers de traduction avant modification
 */
function backupTranslationFiles() {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupDir = path.join(BACKUPS_DIR, timestamp);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  // Obtenir la liste des fichiers de traduction
  const localeFiles = fs.readdirSync(LOCALES_DIR)
    .filter(file => file.endsWith('.json'));
  
  // Créer des copies de sauvegarde
  localeFiles.forEach(file => {
    const sourcePath = path.join(LOCALES_DIR, file);
    const targetPath = path.join(backupDir, file);
    fs.copyFileSync(sourcePath, targetPath);
  });
  
  console.log(chalk.green(`✅ Sauvegarde créée dans ${backupDir}`));
  return backupDir;
}

// Dictionnaire pour stocker les constantes de traduction
let validationKeyConstants = {};

// Dictionnaire pour suivre les importations de constantes de validation
let importedValidationKeys = new Set();

/**
 * Extrait les clés de traduction utilisées dans le code source
 */
function extractUsedKeys() {
  console.log(chalk.blue('🔍 Analyse des dossiers:'), SOURCE_DIRS.join(', '));
  console.log(chalk.blue('🚫 Exclusion des dossiers:'), EXCLUDED_DIRS.join(', '));
  
  const usedKeys = new Set();
  const keyContexts = {};
  let filesAnalyzed = 0;
  
  // Stocker les utilisations de TRANSLATION_KEYS pour analyse ultérieure
  const translationKeysReferences = new Map();
  
  const scanFile = (filePath) => {
    if (shouldExcludePath(filePath)) return;
    
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      filesAnalyzed++;
      
      // Phase 1: Capturer d'abord les déclarations de constantes de validation
      const constantsDeclarationRegex = /export\s+const\s+([A-Z][A-Z0-9_]+(?:_KEYS))\s*=\s*{([^}]*)}/gs;
      let constantsMatch;
      
      while ((constantsMatch = constantsDeclarationRegex.exec(fileContent)) !== null) {
        const constantName = constantsMatch[1];
        const constantContent = constantsMatch[2];
        
        // Capturer les paires clé:valeur dans la constante
        const keyValueRegex = /([A-Z0-9_]+)\s*:\s*['"]([^'"]+)['"]/g;
        let keyValueMatch;
        
        validationKeyConstants[constantName] = {};
        
        while ((keyValueMatch = keyValueRegex.exec(constantContent)) !== null) {
          const keyName = keyValueMatch[1];
          const translationKey = keyValueMatch[2];
          validationKeyConstants[constantName][keyName] = translationKey;
          
          // Ajouter directement cette clé comme utilisée
          usedKeys.add(translationKey);
          
          // Stocker le contexte
          if (!keyContexts[translationKey]) {
            keyContexts[translationKey] = [];
          }
          
          const lineNumber = getLineNumberFromPosition(fileContent, keyValueMatch.index);
          const context = extractContextForLine(fileContent, lineNumber);
          
          keyContexts[translationKey].push({
            file: path.relative(rootDir, filePath),
            line: lineNumber,
            context: context
          });
        }
      }
      
      // Phase 1.2: Détecter les définitions de TRANSLATION_KEYS (pattern EPIC 5)
      const translationKeysDeclarationRegex = /export\s+const\s+TRANSLATION_KEYS\s*=\s*{([^}]*)}/gs;
      let translationKeysMatch;
      
      while ((translationKeysMatch = translationKeysDeclarationRegex.exec(fileContent)) !== null) {
        const keysContent = translationKeysMatch[1];
        
        // Utiliser une expression récursive pour capturer la structure imbriquée
        const parseKeysObject = (content, prefix = '') => {
          // Regex pour extraire les sections ou les clés finales
          const sectionRegex = /([A-Z][A-Z0-9_]+)\s*:\s*(?:{([^}]*)})|\s*["']([^"']+)["']/g;
          let sectionMatch;
          
          while ((sectionMatch = sectionRegex.exec(content)) !== null) {
            const sectionName = sectionMatch[1];
            const sectionContent = sectionMatch[2];
            const keyValue = sectionMatch[3];
            
            if (sectionContent) {
              // C'est une section imbriquée, récursivement l'analyser
              const newPrefix = prefix ? `${prefix}.${sectionName}` : sectionName;
              parseKeysObject(sectionContent, newPrefix);
            } else if (keyValue) {
              // C'est une clé terminale avec sa valeur
              const fullPath = prefix ? `${prefix}.${sectionName}` : sectionName;
              // Stocker la référence pour une utilisation ultérieure
              translationKeysReferences.set(fullPath, keyValue);
              
              // Ajouter la clé aux clés utilisées
              usedKeys.add(keyValue);
              
              // Stocker le contexte
              if (!keyContexts[keyValue]) {
                keyContexts[keyValue] = [];
              }
              
              const lineNumber = getLineNumberFromPosition(fileContent, sectionMatch.index);
              const context = extractContextForLine(fileContent, lineNumber);
              
              keyContexts[keyValue].push({
                file: path.relative(rootDir, filePath),
                line: lineNumber,
                context: context,
                note: `Défini comme TRANSLATION_KEYS.${fullPath}`
              });
            }
          }
        };
        
        parseKeysObject(keysContent);
      }
      
      // Phase 2: Détecter les importations de constantes de validation
      const importRegex = /import\s*{([^}]*)}\s*from\s*['"]@cv-generator\/shared['"]/g;
      let importMatch;
      
      while ((importMatch = importRegex.exec(fileContent)) !== null) {
        const importedItems = importMatch[1];
        
        // Trouver les constantes de validation dans les importations
        const validationKeyRegex = /\b([A-Z][A-Z0-9_]+(?:_KEYS))\b/g;
        let validationKeyMatch;
        
        while ((validationKeyMatch = validationKeyRegex.exec(importedItems)) !== null) {
          importedValidationKeys.add(validationKeyMatch[1]);
        }
        
        // Vérifier si TRANSLATION_KEYS est importé
        if (importedItems.includes('TRANSLATION_KEYS')) {
          // Déterminer la variable qui contient TRANSLATION_KEYS (si renommée)
          const renameMatch = /TRANSLATION_KEYS\s+as\s+(\w+)/g.exec(importedItems);
          const translationKeysVar = renameMatch ? renameMatch[1] : 'TRANSLATION_KEYS';
          
          // Phase 2.2: Détecter les références à TRANSLATION_KEYS en tant que variable
          const keyRefRegex = new RegExp(`${translationKeysVar}\\.(\\w+(?:\\.\\w+)*)`, 'g');
          let keyRefMatch;
          
          while ((keyRefMatch = keyRefRegex.exec(fileContent)) !== null) {
            const keyPath = keyRefMatch[1];
            
            // Essayer de résoudre la clé de traduction à partir de la référence
            for (const [refPath, actualKey] of translationKeysReferences.entries()) {
              if (keyPath === refPath || keyPath.startsWith(refPath + '.')) {
                usedKeys.add(actualKey);
                
                // Stocker le contexte
                if (!keyContexts[actualKey]) {
                  keyContexts[actualKey] = [];
                }
                
                const lineNumber = getLineNumberFromPosition(fileContent, keyRefMatch.index);
                const context = extractContextForLine(fileContent, lineNumber);
                
                keyContexts[actualKey].push({
                  file: path.relative(rootDir, filePath),
                  line: lineNumber,
                  context: context,
                  note: `Via référence ${translationKeysVar}.${keyPath}`
                });
                
                break;
              }
            }
          }
        }
      }
      
      // Phase 3: Utilisation des clés de traduction via les patterns
      for (const pattern of TRANSLATION_KEY_PATTERNS) {
        let match;
        const patternCopy = new RegExp(pattern.source, pattern.flags);
        
        while ((match = patternCopy.exec(fileContent)) !== null) {
          const key = match[1];
          
          // Vérifier si c'est une référence à une constante (Pattern 15-16, 19)
          if (/^[A-Z][A-Z0-9_]+(\.[A-Z0-9_]+)*$/.test(key)) {
            // C'est une référence à une constante comme AWARD_VALIDATION_KEYS.MISSING_TITLE
            const [constantName, propertyName] = key.split('.');
            
            if (importedValidationKeys.has(constantName) && 
                validationKeyConstants[constantName] && 
                validationKeyConstants[constantName][propertyName]) {
              const actualKey = validationKeyConstants[constantName][propertyName];
              usedKeys.add(actualKey);
              
              // Stocker le contexte
              if (!keyContexts[actualKey]) {
                keyContexts[actualKey] = [];
              }
              
              const lineNumber = getLineNumberFromPosition(fileContent, match.index);
              const context = extractContextForLine(fileContent, lineNumber);
              
              keyContexts[actualKey].push({
                file: path.relative(rootDir, filePath),
                line: lineNumber,
                context: context,
                note: `Via constante ${constantName}.${propertyName}`
              });
            }
            continue;
          }
          
          // Filtrer les faux positifs
          if (FALSE_POSITIVE_KEYS.includes(key)) {
            continue;
          }
          
          // Vérifier si la clé ressemble à une clé de traduction
          if (key && isLikelyTranslationKey(key)) {
            usedKeys.add(key);
            
            // Stocker le contexte
            if (!keyContexts[key]) {
              keyContexts[key] = [];
            }
            
            const lineNumber = getLineNumberFromPosition(fileContent, match.index);
            const context = extractContextForLine(fileContent, lineNumber);
            
            keyContexts[key].push({
              file: path.relative(rootDir, filePath),
              line: lineNumber,
              context: context
            });
          }
        }
      }
    } catch (error) {
      console.error(chalk.red(`Erreur lors de l'analyse du fichier ${filePath}:`), error.message);
    }
  };
  
  // Fonction pour obtenir le numéro de ligne à partir de la position dans le fichier
  function getLineNumberFromPosition(content, position) {
    const textBeforePosition = content.substring(0, position);
    return textBeforePosition.split('\n').length;
  }
  
  // Fonction pour extraire le contexte autour d'une ligne
  function extractContextForLine(content, lineNumber, contextLines = 2) {
    const lines = content.split('\n');
    const startLine = Math.max(1, lineNumber - contextLines);
    const endLine = Math.min(lines.length, lineNumber + contextLines);
    
    let contextContent = '';
    for (let i = startLine - 1; i < endLine; i++) {
      if (i === lineNumber - 1) {
        contextContent += `> ${lines[i]}\n`;
      } else {
        contextContent += `  ${lines[i]}\n`;
      }
    }
    
    return contextContent.trim();
  }
  
  // Trouver tous les fichiers correspondants et les analyser
  const allFiles = [];
  
  SOURCE_DIRS.forEach(sourceDir => {
    const files = glob.sync(`${sourceDir}/**/*`, { absolute: true });
    
    files.forEach(file => {
      if (fs.statSync(file).isFile() && 
          FILE_EXTENSIONS.includes(path.extname(file)) &&
          !shouldExcludePath(file)) {
        allFiles.push(file);
      }
    });
  });
  
  // Analyser chaque fichier
  allFiles.forEach(scanFile);
  
  console.log(chalk.green(`✅ ${filesAnalyzed} fichiers analysés`));
  console.log(chalk.green(`✅ ${usedKeys.size} clés de traduction détectées`));
  
  return { usedKeys: Array.from(usedKeys), keyContexts };
}

/**
 * Charge et analyse les fichiers de traduction
 */
function loadTranslationFiles() {
  const localeFiles = fs.readdirSync(LOCALES_DIR)
    .filter(file => file.endsWith('.json'))
    .filter(file => !file.includes('missing')); // Exclure les fichiers 'missing'
  
  const locales = {};

  localeFiles.forEach(file => {
    const localeName = path.basename(file, '.json');
    const filePath = path.join(LOCALES_DIR, file);
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const translations = JSON.parse(content);
      locales[localeName] = {
        path: filePath,
        translations
      };
    } catch (error) {
      console.error(chalk.red(`Erreur lors du chargement du fichier ${filePath}:`), error.message);
    }
  });
  
  console.log(chalk.green(`✅ ${Object.keys(locales).length} fichiers de traduction analysés`));
  return locales;
}

/**
 * Extrait toutes les clés de traduction à partir de l'objet de traduction
 */
function extractTranslationKeys(translations, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(translations)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      // Récursion pour les objets imbriqués
      keys.push(...extractTranslationKeys(value, fullKey));
    } else {
      // Clé terminale
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * Vérifie si une clé doit être protégée de la suppression
 */
function shouldProtectKey(key) {
  return ESSENTIAL_KEYS_PATTERNS.some(pattern => pattern.test(key));
}

/**
 * Analyse les traductions et identifie les clés manquantes et inutilisées
 */
function analyzeTranslations(usedKeys, locales, _keyContexts) {
  const missingKeys = {};
  const unusedKeys = {};
  const protectedKeys = {};
  
  // Pour chaque locale, vérifier les clés manquantes et inutilisées
  for (const [localeName, localeData] of Object.entries(locales)) {
    const allTranslationKeys = extractTranslationKeys(localeData.translations);
    
    // Trouver les clés manquantes (dans usedKeys mais pas dans allTranslationKeys)
    missingKeys[localeName] = usedKeys.filter(key => !allTranslationKeys.includes(key));
    
    // Trouver les clés inutilisées (dans allTranslationKeys mais pas dans usedKeys)
    const potentiallyUnused = allTranslationKeys.filter(key => !usedKeys.includes(key));
    
    // Filtrer les clés protégées
    unusedKeys[localeName] = [];
    protectedKeys[localeName] = [];
    
    potentiallyUnused.forEach(key => {
      if (shouldProtectKey(key)) {
        protectedKeys[localeName].push(key);
      } else {
        unusedKeys[localeName].push(key);
      }
    });
  }
  
  return { missingKeys, unusedKeys, protectedKeys };
}

/**
 * Génère un rapport détaillé de l'analyse
 */
function generateReport(usedKeys, locales, missingKeys, unusedKeys, protectedKeys, keyContexts) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      usedKeysCount: usedKeys.length,
      localesCount: Object.keys(locales).length,
      missingKeysCount: {},
      unusedKeysCount: {},
      protectedKeysCount: {}
    },
    usedKeys,
    missingKeys,
    unusedKeys,
    protectedKeys,
    keyContexts: {},
    validationConstants: validationKeyConstants,
    importedValidationKeysList: Array.from(importedValidationKeys)
  };
  
  // Ajouter les statistiques pour chaque locale
  for (const locale in missingKeys) {
    report.summary.missingKeysCount[locale] = missingKeys[locale].length;
    report.summary.unusedKeysCount[locale] = unusedKeys[locale].length;
    report.summary.protectedKeysCount[locale] = protectedKeys[locale].length;
  }
  
  // Convertir la Map des contextes en objet pour la sérialisation JSON
  for (const [key, contexts] of Object.entries(keyContexts)) {
    report.keyContexts[key] = contexts;
  }
  
  // S'assurer que le répertoire du rapport existe
  if (!fs.existsSync(path.dirname(REPORT_PATH))) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  }
  
  // Écrire le rapport dans un fichier JSON
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(chalk.green(`✅ Rapport généré: ${REPORT_PATH}`));
  
  return report;
}

/**
 * Ajoute les clés manquantes aux fichiers de traduction
 */
function addMissingKeys(missingKeys, locales) {
  for (const [localeName, keys] of Object.entries(missingKeys)) {
    if (keys.length === 0) continue;
    
    const locale = locales[localeName];
    let translations = locale.translations;
    
    keys.forEach(key => {
      const keyParts = key.split('.');
      let current = translations;
      
      // Naviguer dans l'arborescence et créer les objets intermédiaires si nécessaire
      for (let i = 0; i < keyParts.length - 1; i++) {
        const part = keyParts[i];
        
        if (!current[part]) {
          current[part] = {};
        }
        
        current = current[part];
      }
      
      // Définir la clé terminale avec une valeur par défaut indiquant la langue
      const lastPart = keyParts[keyParts.length - 1];
      if (!current[lastPart]) {
        // Ajouter un marqueur indiquant la langue
        current[lastPart] = `[${localeName.toUpperCase()}] ${lastPart}`;
      }
    });
    
    // Écrire le fichier mis à jour
    fs.writeFileSync(locale.path, JSON.stringify(translations, null, 2));
    console.log(chalk.green(`✅ ${keys.length} clés ajoutées au fichier ${localeName}.json`));
  }
}

/**
 * Supprime les clés inutilisées des fichiers de traduction
 */
function removeUnusedKeys(unusedKeys, locales) {
  for (const [localeName, keys] of Object.entries(unusedKeys)) {
    if (keys.length === 0) continue;
    
    const locale = locales[localeName];
    let translations = locale.translations;
    
    keys.forEach(key => {
      const keyParts = key.split('.');
      let current = translations;
      let parent = null;
      let lastPart = null;
      
      // Naviguer dans l'arborescence jusqu'au parent de la clé à supprimer
      for (let i = 0; i < keyParts.length - 1; i++) {
        const part = keyParts[i];
        
        if (!current[part]) {
          // La clé n'existe plus, peut-être déjà supprimée
          return;
        }
        
        parent = current;
        lastPart = part;
        current = current[part];
      }
      
      // Supprimer la clé
      const finalPart = keyParts[keyParts.length - 1];
      
      if (current && current[finalPart] !== undefined) {
        delete current[finalPart];
        
        // Si l'objet parent est maintenant vide, envisager de le supprimer également
        if (parent && lastPart && Object.keys(current).length === 0) {
          delete parent[lastPart];
        }
      }
    });
    
    // Écrire le fichier mis à jour
    fs.writeFileSync(locale.path, JSON.stringify(translations, null, 2));
    console.log(chalk.green(`✅ ${keys.length} clés supprimées du fichier ${localeName}.json`));
  }
}

/**
 * Pose une question à l'utilisateur et retourne sa réponse
 */
function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise(resolve => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

/**
 * Fonction principale
 */
async function main() {
  console.log(chalk.blue('🔍 I18n Guardian - Analyse des traductions'));
  
  // Créer les répertoires nécessaires
  ensureDirectoriesExist();
  
  try {
    // 1. Extraire les clés utilisées dans le code source
    const { usedKeys, keyContexts } = extractUsedKeys();
    
    // 2. Charger les fichiers de traduction
    const locales = loadTranslationFiles();
    
    // 3. Analyser les traductions
    const { missingKeys, unusedKeys, protectedKeys } = analyzeTranslations(usedKeys, locales, keyContexts);
    
    // 4. Générer un rapport
    generateReport(usedKeys, locales, missingKeys, unusedKeys, protectedKeys, keyContexts);
    
    // 5. Afficher un résumé
    console.log(chalk.yellow('\n📊 Résumé de l\'analyse:'));
    
    for (const locale in missingKeys) {
      console.log(chalk.yellow(`• ${locale}.json: ${missingKeys[locale].length} clés manquantes, ${unusedKeys[locale].length} clés inutilisées, ${protectedKeys[locale].length} clés protégées`));
    }
    
    // 6. Proposer d'ajouter les clés manquantes
    const hasMissingKeys = Object.values(missingKeys).some(keys => keys.length > 0);
    
    if (hasMissingKeys) {
      console.log(chalk.blue('\n🔧 Clés manquantes détectées'));
      
      const addMissing = await askQuestion(chalk.yellow('Voulez-vous ajouter les clés manquantes aux fichiers de traduction? (y/n) '));
      
      if (addMissing === 'y' || addMissing === 'yes') {
        // Sauvegarder les fichiers avant modification
        backupTranslationFiles();
        
        // Ajouter les clés manquantes
        addMissingKeys(missingKeys, locales);
      }
    }
    
    // 7. Proposer de supprimer les clés inutilisées
    const hasUnusedKeys = Object.values(unusedKeys).some(keys => keys.length > 0);
    
    if (hasUnusedKeys) {
      console.log(chalk.blue('\n🧹 Clés inutilisées détectées'));
      console.log(chalk.yellow('⚠️ ATTENTION: La suppression des clés inutilisées peut être dangereuse.'));
      console.log(chalk.yellow('⚠️ Certaines clés peuvent être utilisées indirectement ou dynamiquement.'));
      console.log(chalk.yellow('⚠️ Il est fortement recommandé de vérifier le rapport avant de supprimer des clés.'));
      
      const removeUnused = await askQuestion(chalk.red('Voulez-vous supprimer les clés inutilisées des fichiers de traduction? (y/n) '));
      
      if (removeUnused === 'y' || removeUnused === 'yes') {
        // Confirmer à nouveau pour éviter les suppressions accidentelles
        const confirmRemoval = await askQuestion(chalk.red('⚠️ CONFIRMATION: Êtes-vous vraiment sûr de vouloir supprimer ces clés? Cette action est irréversible. (y/n) '));
        
        if (confirmRemoval === 'y' || confirmRemoval === 'yes') {
          // Sauvegarder les fichiers avant modification
          backupTranslationFiles();
          
          // Supprimer les clés inutilisées
          removeUnusedKeys(unusedKeys, locales);
        } else {
          console.log(chalk.green('Suppression annulée.'));
        }
      }
    }
    
    console.log(chalk.green('\n✅ Analyse terminée'));
    
  } catch (error) {
    console.error(chalk.red('❌ Une erreur est survenue:'), error);
    process.exit(1);
  }
}

// Exécuter la fonction principale
main().catch(error => {
  console.error(chalk.red('❌ Erreur non gérée:'), error);
  process.exit(1);
}); 
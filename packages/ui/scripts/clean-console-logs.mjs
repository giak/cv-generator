#!/usr/bin/env node

/**
 * Script temporaire pour nettoyer les console.log du code
 * Usage: node clean-console-logs.mjs
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Fonction pour trouver la racine du monorepo (contenant pnpm-workspace.yaml)
function findMonorepoRoot() {
  let currentDir = dirname(fileURLToPath(import.meta.url));
  
  // Remonter dans l'arborescence jusqu'à trouver la racine du monorepo
  while (currentDir !== '/') {
    // Vérifier si pnpm-workspace.yaml existe dans ce dossier
    if (fs.existsSync(join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }
    
    // Si le fichier n'est pas trouvé, remonter d'un niveau
    currentDir = dirname(currentDir);
  }
  
  // Si on n'a pas trouvé, utiliser le répertoire courant
  return process.cwd();
}

// Trouver la racine du monorepo
const rootDir = findMonorepoRoot();

console.log('🔍 Racine du monorepo détectée:', rootDir);

if (!fs.existsSync(rootDir)) {
  throw new Error(`Le dossier racine n'existe pas: ${rootDir}`);
}

// Patterns pour détecter les différents types de console.log
const CONSOLE_PATTERNS = [
  // Console.log basique sur une ou plusieurs lignes
  /^\s*(\/\/\s*)?console\.(log|debug|error|warn|info)\s*\(([\s\S]*?)\);?\s*$/gm,
  
  // Console.log dans une template string ou une chaîne
  /console\.(log|debug|error|warn|info)\s*\([^)]*\)/g,
  
  // Console.log dans un attribut Vue (avec ou sans arrow function)
  /@\w+="(?:[^"]*?=>)?\s*console\.(log|debug|error|warn|info)[^"]*"/g,
  
  // Console.log dans une fonction arrow
  /=>\s*console\.(log|debug|error|warn|info)\s*\([^)]*\)/g,
  
  // Console.log avec des arguments multiples et JSON.stringify
  /console\.(log|debug|error|warn|info)\s*\([\s\S]*?(?:JSON\.stringify\([^)]*\))?[\s\S]*?\);?/g,
  
  // Console.log dans une expression JSX/TSX
  /{(?:[^}]*?console\.(log|debug|error|warn|info)[^}]*?)}/g,
  
  // Console.log dans un handler d'événement
  /(@|\()(\w+)=".*?console\.(log|debug|error|warn|info).*?"/g,
  
  // Console.log avec backticks
  /console\.(log|debug|error|warn|info)\s*\(\s*`[^`]*`\s*\)/g,
  
  // Console.log avec template literals et expressions
  /console\.(log|debug|error|warn|info)\s*\(\s*`[^`]*\${[^}]*}[^`]*`\s*\)/g,
  
  // Console.log avec plusieurs arguments séparés par des virgules
  /console\.(log|debug|error|warn|info)\s*\([^)]+,[^)]+\)/g
];

// Extensions de fichiers à traiter
const FILE_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'vue', 'mjs', 'cjs', 'mts', 'cts'];

// Dossiers à exclure
const EXCLUDED_DIRS = [
  'node_modules',
  'dist',
  'coverage',
  '.git',
  '.vite',
  '.nuxt',
  'test-utils',
  '__tests__',
  '__mocks__',
  'reports',
  '.history',
  '.vscode',
  '.idea'
];

// Fichiers spécifiques à exclure
const EXCLUDED_FILES = [
  'vite.config.ts',
  'vitest.config.ts',
  'jest.config.js',
  'babel.config.js',
  'clean-console-logs.mjs',
  'run-i18n-validation.mjs'
];

/**
 * Vérifie si un chemin doit être exclu
 */
function shouldExclude(path) {
  // Vérifier les dossiers exclus
  if (EXCLUDED_DIRS.some(dir => path.includes(`/${dir}/`) || path.endsWith(`/${dir}`))) {
    return true;
  }

  // Vérifier les fichiers exclus
  const filename = path.split('/').pop();
  if (EXCLUDED_FILES.includes(filename)) {
    return true;
  }

  return false;
}

/**
 * Nettoie les console.log d'un fichier
 */
function cleanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let totalCount = 0;
    let hasChanges = false;
    let matchesFound = [];

    // Appliquer chaque pattern
    for (const pattern of CONSOLE_PATTERNS) {
      // Réinitialiser le pattern pour chaque utilisation
      pattern.lastIndex = 0;
      
      // Compter les occurrences pour ce pattern
      const matches = newContent.match(pattern) || [];
      const count = matches.length;
      
      if (count > 0) {
        // Stocker les matches pour le logging
        matchesFound.push(...matches.map(match => match.trim()));
        
        // Remplacer les console.log
        const previousContent = newContent;
        newContent = newContent.replace(pattern, '');
        
        // Vérifier si des changements ont été effectués
        if (previousContent !== newContent) {
          hasChanges = true;
          totalCount += count;
        }
      }
    }

    if (hasChanges) {
      // Nettoyer les lignes vides multiples et le formatage
      newContent = newContent
        .replace(/\n\s*\n\s*\n/g, '\n\n')  // Réduire les lignes vides multiples à deux
        .replace(/{\s*\n\s*\n\s*}/g, '{}')  // Nettoyer les objets vides
        .replace(/\(\s*\n\s*\n\s*\)/g, '()') // Nettoyer les parenthèses vides
        .replace(/,\s*\n\s*\n\s*([}\]])/g, '\n$1')  // Nettoyer les virgules trailing
        .replace(/{\s*\n\s*\n\s*}/g, '{}')  // Nettoyer les objets vides (bis)
        .trim() + '\n';  // Assurer une seule nouvelle ligne à la fin

      // Sauvegarder le fichier
      fs.writeFileSync(filePath, newContent);

      // Afficher les détails
      console.log(`\n📝 ${filePath}:`);
      console.log('   Supprimés:');
      matchesFound.slice(0, 5).forEach(match => {
        console.log(`   - ${match.substring(0, 100)}${match.length > 100 ? '...' : ''}`);
      });
      if (matchesFound.length > 5) {
        console.log(`   ... et ${matchesFound.length - 5} autres`);
      }

      return totalCount;
    }

    return 0;
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error);
    return 0;
  }
}

/**
 * Parcourt récursivement un dossier
 */
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  let modifiedFiles = 0;
  let totalRemoved = 0;

  for (const file of files) {
    const fullPath = join(dirPath, file);

    if (shouldExclude(fullPath)) {
      continue;
    }

    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      const { files, removed } = processDirectory(fullPath);
      modifiedFiles += files;
      totalRemoved += removed;
    } else if (FILE_EXTENSIONS.some(ext => file.endsWith(`.${ext}`))) {
      const removed = cleanFile(fullPath);
      if (removed > 0) {
        modifiedFiles++;
        totalRemoved += removed;
      }
    }
  }

  return { files: modifiedFiles, removed: totalRemoved };
}

// Exécution principale
console.log('🧹 Nettoyage des console.log...');
console.log('📂 Dossier racine:', rootDir);

// Traiter les packages
const packages = fs.readdirSync(rootDir)
  .filter(dir => fs.statSync(join(rootDir, dir)).isDirectory())
  .filter(dir => !shouldExclude(join(rootDir, dir)))
  .filter(dir => dir === 'packages' || dir.startsWith('@cv-generator'));

let totalFiles = 0;
let totalRemoved = 0;

for (const pkg of packages) {
  console.log(`\n📦 Traitement du package: ${pkg}`);
  const { files, removed } = processDirectory(join(rootDir, pkg));
  totalFiles += files;
  totalRemoved += removed;
}

console.log('\n✅ Nettoyage terminé !');
console.log(`📊 Résumé:
- ${totalFiles} fichiers modifiés
- ${totalRemoved} console.log supprimés`); 
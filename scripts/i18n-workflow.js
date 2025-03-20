#!/usr/bin/env node

/**
 * Script de workflow pour la gestion des traductions
 * Combine le rapport d'analyse et les actions possibles
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Obtenir le chemin du répertoire actuel (compatible ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Chemin du rapport généré
const reportPath = path.resolve(rootDir, './reports/vue-i18n-report.json');

// Dossiers exclus de l'analyse
const EXCLUDED_DIRS = [
  'node_modules',
  'dist',
  '.git',
  '.vite',
  'coverage',
  'tests',
  '__tests__'
];

/**
 * Exécute une commande shell
 */
function runCommand(command) {
  console.log(chalk.blue(`Exécution de: ${command}`));
  try {
    execSync(command, { stdio: 'inherit', cwd: rootDir });
    return true;
  } catch (error) {
    console.error(chalk.red(`Erreur lors de l'exécution de la commande: ${command}`));
    console.error(error.message);
    return false;
  }
}

/**
 * Gère l'entrée utilisateur (version simplifiée pour le script)
 */
function askQuestion(query) {
  const { stdin, stdout } = process;
  
  return new Promise((resolve) => {
    stdout.write(`${query} `);
    
    const onData = (data) => {
      const response = data.toString().trim().toLowerCase();
      stdin.removeListener('data', onData);
      resolve(response);
    };
    
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.on('data', onData);
  });
}

/**
 * Fonction principale
 */
async function main() {
  console.log(chalk.green('🌐 Workflow de gestion des traductions'));
  console.log(chalk.yellow('=========================================\n'));
  
  // Afficher les dossiers exclus
  console.log(chalk.blue('ℹ️ Dossiers exclus de l\'analyse:'));
  EXCLUDED_DIRS.forEach(dir => {
    console.log(chalk.gray(`  - ${dir}`));
  });
  console.log('');
  
  // 1. Générer le rapport
  console.log(chalk.blue('🔍 Génération du rapport d\'analyse des traductions...'));
  const success = runCommand('pnpm i18n:report');
  
  if (!success) {
    console.error(chalk.red('❌ Échec de la génération du rapport. Arrêt du workflow.'));
    process.exit(1);
  }
  
  // 2. Analyser le rapport
  console.log(chalk.blue('\n📊 Analyse du rapport...'));
  
  if (!fs.existsSync(reportPath)) {
    console.error(chalk.red(`❌ Le rapport n'a pas été généré à l'emplacement attendu: ${reportPath}`));
    process.exit(1);
  }
  
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const missingCount = report.missingKeys.length;
  const unusedCount = report.unusedKeys.length;
  
  console.log(chalk.yellow(`\n📝 Résumé du rapport:`));
  console.log(chalk.yellow(`• Clés manquantes: ${missingCount}`));
  console.log(chalk.yellow(`• Clés inutilisées: ${unusedCount}`));
  
  // 3. Proposer des actions en fonction des résultats
  if (missingCount > 0) {
    console.log(chalk.blue('\n🔧 Clés manquantes détectées:'));
    
    // Afficher un échantillon des clés manquantes (max 5)
    const sampleSize = Math.min(5, missingCount);
    console.log(chalk.gray('Exemples:'));
    report.missingKeys.slice(0, sampleSize).forEach(key => {
      console.log(chalk.gray(`- ${key.file}: ${key.key}`));
    });
    
    if (missingCount > sampleSize) {
      console.log(chalk.gray(`... et ${missingCount - sampleSize} autres`));
    }
    
    const addMissing = await askQuestion(chalk.yellow('\nVoulez-vous ajouter les clés manquantes aux fichiers de traduction? (y/n)'));
    
    if (addMissing === 'y' || addMissing === 'yes') {
      console.log(chalk.blue('\nAjout des clés manquantes...'));
      runCommand('pnpm i18n:add-missing');
    }
  }
  
  if (unusedCount > 0) {
    console.log(chalk.blue('\n🧹 Clés inutilisées détectées:'));
    
    // Afficher un échantillon des clés inutilisées (max 5)
    const sampleSize = Math.min(5, unusedCount);
    console.log(chalk.gray('Exemples:'));
    report.unusedKeys.slice(0, sampleSize).forEach(key => {
      console.log(chalk.gray(`- ${key}`));
    });
    
    if (unusedCount > sampleSize) {
      console.log(chalk.gray(`... et ${unusedCount - sampleSize} autres`));
    }
    
    const removeUnused = await askQuestion(chalk.yellow('\nVoulez-vous supprimer les clés inutilisées des fichiers de traduction? (y/n)'));
    
    if (removeUnused === 'y' || removeUnused === 'yes') {
      console.log(chalk.blue('\nSuppression des clés inutilisées...'));
      runCommand('pnpm i18n:remove-unused');
    }
  }
  
  if (missingCount === 0 && unusedCount === 0) {
    console.log(chalk.green('\n✅ Félicitations! Tous les fichiers de traduction sont synchronisés.'));
  } else {
    console.log(chalk.green('\n✅ Workflow terminé.'));
  }
}

// Exécuter la fonction principale
main().catch(error => {
  console.error(chalk.red('❌ Une erreur est survenue:'), error);
  process.exit(1);
}); 
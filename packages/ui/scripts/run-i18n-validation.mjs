#!/usr/bin/env node

/**
 * Script pour exécuter la validation d'internationalisation et générer des rapports
 * Ce script exécute directement les utilitaires TypeScript de validation i18n sans compilation préalable
 */

import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Obtenir le chemin du répertoire actuel
const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(currentDir, '..');

/**
 * Exécute une commande shell et affiche le résultat
 */
function execCommand(command, args, options = {}) {
  console.log(`Exécution de: ${command} ${args.join(' ')}`);
  
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: options.cwd || rootDir,
    ...options,
  });
  
  if (result.status !== 0) {
    console.error(`La commande a échoué avec le code: ${result.status}`);
    if (result.error) {
      console.error('Erreur:', result.error);
    }
    return false;
  }
  
  return true;
}

/**
 * Exécute la validation d'internationalisation
 */
function runValidation() {
  console.log('🔍 Exécution de la validation d\'internationalisation...');
  
  // Créer le dossier de rapports s'il n'existe pas
  const reportsDir = join(rootDir, 'reports/i18n');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  // Exécuter l'outil de validation directement avec ts-node
  return execCommand('npx', [
    'ts-node',
    '--esm',
    join(rootDir, 'src/test-utils/run-i18n-tests.ts')
  ]);
}

/**
 * Fonction principale
 */
function main() {
  console.log('🌐 Validation d\'internationalisation du CV Generator');
  console.log('====================================================');
  
  try {
    // Exécuter la validation directement
    if (!runValidation()) {
      console.error('❌ Échec de la validation d\'internationalisation.');
      process.exit(1);
    }
    
    console.log('✅ Validation d\'internationalisation terminée avec succès !');
    console.log('Consultez les rapports dans le dossier reports/i18n/');
    
  } catch (error) {
    console.error('❌ Une erreur est survenue lors de la validation:', error);
    process.exit(1);
  }
}

// Exécuter le script
main(); 
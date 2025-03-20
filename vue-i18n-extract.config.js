/**
 * Configuration pour vue-i18n-extract
 * Utilisé pour détecter les clés de traduction manquantes ou inutilisées
 */
export default {
  // Fichiers à analyser pour détecter l'utilisation des clés de traduction
  vueFiles: './packages/**/*.?(js|vue|ts)',
  
  // Fichiers de traduction à analyser
  languageFiles: './packages/ui/src/i18n/locales/*.json',
  
  // Chemin où sera généré le rapport d'analyse
  output: './reports/vue-i18n-report.json',
  
  // Ne pas écrire les clés manquantes par défaut (mode rapport uniquement)
  add: false,
  
  // Ne pas supprimer les clés inutilisées par défaut (mode rapport uniquement)
  remove: false,
  
  // Séparateur pour les clés imbriquées
  separator: '.',
  
  // Exclure certains dossiers ou fichiers de l'analyse
  exclude: [
    '**/node_modules/**', 
    '**/dist/**', 
    '**/.git/**',
    '**/.vite/**',
    '**/coverage/**',
    '**/tests/**', 
    '**/__tests__/**'
  ],
  
  // Ne pas laisser de traductions vides
  noEmptyTranslation: true,
  
  // Marquer les traductions manquantes avec une valeur par défaut
  missingtranslationstring: '**MISSING**'
} 
/**
 * Configuration PostCSS optimisée pour CV Generator
 * 
 * - Tailwind CSS: Framework d'utilitaires principal
 * - Autoprefixer: Gestion des préfixes vendor pour compatibilité
 * - cssnano: Minification avancée du CSS en production
 * - postcss-preset-env: Fonctionnalités CSS modernes avec polyfills
 */
export default {
  plugins: {
    'tailwindcss/nesting': {}, // Support pour nesting CSS natif
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
          colormin: true,
        }],
      },
      'postcss-preset-env': {
        stage: 2, // Fonctionnalités CSS relativement stables
        features: {
          'nesting-rules': false, // Désactivé car géré par tailwindcss/nesting
          'custom-properties': false, // Préserver les custom properties
        },
        autoprefixer: false, // Déjà inclus séparément
      }
    } : {}),
  }
}; 
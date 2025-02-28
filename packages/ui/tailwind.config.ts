import type { Config } from 'tailwindcss'
import { resolve } from 'path'
import plugin from 'tailwindcss/plugin'

/**
 * Configuration Tailwind CSS optimisée pour CV Generator
 * 
 * Cette configuration centralise toutes les valeurs personnalisées du design system
 * et prépare la migration vers Tailwind v4.
 * 
 * Principales caractéristiques:
 * - Format RGB pour les couleurs (pour manipulation d'opacité)
 * - Extensions complètes pour typographie, espacement, ombres, etc.
 * - Plugins personnalisés pour composants techniques
 * - Optimisations pour JIT Compiler
 */
export default {
  content: [
    './index.html', 
    './src/**/*.{vue,js,ts,jsx,tsx}',
    // Ajout des composants partagés potentiellement utilisés
    '../shared/src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Couleurs primaires (cyan) - Format RGB pour opacité cohérente
        primary: {
          50: 'rgb(236, 254, 255)',
          100: 'rgb(207, 250, 254)',
          200: 'rgb(165, 243, 252)',
          300: 'rgb(103, 232, 249)',
          400: 'rgb(34, 211, 238)',
          500: 'rgb(6, 182, 212)',
          600: 'rgb(8, 145, 178)',
          700: 'rgb(14, 116, 144)',
          800: 'rgb(21, 94, 117)',
          900: 'rgb(22, 78, 99)',
          950: 'rgb(8, 51, 68)',
        },
        // Couleurs neutres étendues pour le thème sombre
        neutral: {
          750: 'rgb(38, 38, 38)',
          850: 'rgb(26, 26, 26)',
        },
        // États sémantiques - Format RGB cohérent
        success: {
          100: 'rgb(220, 252, 231)',
          200: 'rgb(187, 247, 208)',
          300: 'rgb(134, 239, 172)',
          400: 'rgb(74, 222, 128)',
          500: 'rgb(34, 197, 94)',
          600: 'rgb(22, 163, 74)',
          700: 'rgb(21, 128, 61)',
          800: 'rgb(22, 101, 52)',
          950: 'rgb(5, 46, 22)',
        },
        error: {
          100: 'rgb(254, 226, 226)',
          200: 'rgb(254, 202, 202)',
          300: 'rgb(252, 165, 165)',
          400: 'rgb(248, 113, 113)',
          500: 'rgb(239, 68, 68)',
          600: 'rgb(220, 38, 38)',
          700: 'rgb(185, 28, 28)',
          800: 'rgb(153, 27, 27)',
          950: 'rgb(69, 10, 10)',
        },
        warning: {
          100: 'rgb(254, 249, 195)',
          200: 'rgb(254, 240, 138)',
          300: 'rgb(253, 224, 71)',
          400: 'rgb(250, 204, 21)',
          500: 'rgb(234, 179, 8)',
          600: 'rgb(202, 138, 4)',
          700: 'rgb(161, 98, 7)',
          800: 'rgb(133, 77, 14)',
          950: 'rgb(54, 29, 10)',
        },
        info: {
          100: 'rgb(219, 234, 254)',
          200: 'rgb(191, 219, 254)',
          300: 'rgb(147, 197, 253)',
          400: 'rgb(96, 165, 250)',
          500: 'rgb(59, 130, 246)',
          600: 'rgb(37, 99, 235)',
          700: 'rgb(29, 78, 216)',
          800: 'rgb(30, 64, 175)',
          950: 'rgb(23, 37, 84)',
        },
        // Couleurs de fond et bordures pour thème sombre
        background: {
          // Harmonisation des noms avec variables CSS existantes
          body: 'rgb(18, 18, 18)',      // --color-bg-body
          surface: 'rgb(26, 35, 44)',   // --color-bg-surface
          card: 'rgb(34, 48, 61)',      // --color-bg-light
          input: 'rgb(23, 23, 23)',     // Fond des inputs techniques
        },
        // Couleurs de texte
        text: {
          primary: 'rgb(255, 255, 255)',         // Texte principal
          secondary: 'rgba(255, 255, 255, 0.7)', // Texte secondaire
          muted: 'rgba(255, 255, 255, 0.5)',     // Texte atténué
          disabled: 'rgba(255, 255, 255, 0.38)', // Texte désactivé
        },
        // Couleurs de bordure
        border: {
          base: 'rgba(64, 64, 64, 0.8)',    // --color-border-base
          hover: 'rgba(82, 82, 82, 0.8)',   // --color-border-hover
          focused: 'rgb(34, 211, 238)',     // Bordure au focus (primary-400)
          dark: 'rgb(33, 41, 54)',          // --color-border-dark
        },
      },
      // Configuration de conteneur responsive
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
      // Typographie
      fontFamily: {
        sans: ['InterTight', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
        mono: ['FiraCode', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',    // 12px
        'sm': '0.875rem',   // 14px
        'md': '0.9375rem',  // 15px
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px
        'xl': '1.25rem',    // 20px
        '2xl': '1.5rem',    // 24px
        '3xl': '1.875rem',  // 30px
        '4xl': '2.25rem',   // 36px
        '5xl': '3rem',      // 48px
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        none: '1',
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
      },
      // Espacement
      spacing: {
        '1': '0.25rem',   // 4px
        '2': '0.5rem',    // 8px
        '3': '0.75rem',   // 12px
        '4': '1rem',      // 16px
        '5': '1.25rem',   // 20px
        '6': '1.5rem',    // 24px
        '8': '2rem',      // 32px
        '10': '2.5rem',   // 40px
        '12': '3rem',     // 48px
        '16': '4rem',     // 64px
        '20': '5rem',     // 80px
        '24': '6rem',     // 96px
        '32': '8rem',     // 128px
        '40': '10rem',    // 160px
        '48': '12rem',    // 192px
        '56': '14rem',    // 224px
        '64': '16rem',    // 256px
      },
      // Rayons de bordure
      borderRadius: {
        'sm': '0.125rem',    // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',    // 6px
        'lg': '0.5rem',      // 8px
        'xl': '0.75rem',     // 12px
        '2xl': '1rem',       // 16px
        'full': '9999px',    // Cercle
      },
      // Ombres
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'inner-md': 'inset 0 3px 6px -1px rgba(0, 0, 0, 0.1)',
        'glow-primary': '0 0 5px 1px rgba(6, 182, 212, 0.3)',
        'glow-success': '0 0 5px 1px rgba(34, 197, 94, 0.3)',
        'glow-error': '0 0 5px 1px rgba(239, 68, 68, 0.3)',
      },
      // Z-index
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '100': '100',
        'auto': 'auto',
      },
      // Transitions
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      // Animations
      animation: {
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-in': 'slideIn 0.2s ease-out',
      },
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        ping: {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        pulse: {
          '50%': { opacity: '.5' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      // Échelle
      scale: {
        '120': '1.2',
      },
    },
  },
  // Configuration des plugins
  plugins: [
    // Plugin formulaires - utilise la stratégie de classe pour ne pas écraser les styles Tailwind
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    // Plugin typographie
    require('@tailwindcss/typography'),
    // Plugin ratio d'aspect
    require('@tailwindcss/aspect-ratio'),
    
    // Plugin personnalisé pour dashboard technique et formulaires spécifiques
    plugin(function ({ addComponents, addUtilities, theme }) {
      // Composants personnalisés pour formulaires techniques
      addComponents({
        // Input technique avec bordure d'accent
        '.tech-form-control': {
          position: 'relative',
          backgroundColor: 'rgba(23, 23, 23, 0.4)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(64, 64, 64, 0.8)',
          borderLeftWidth: '3px',
          borderLeftColor: theme('colors.primary.600'),
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.2)',
          '&:focus': {
            backgroundColor: 'rgba(23, 23, 23, 0.6)',
            borderLeftColor: theme('colors.primary.400'),
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(34, 211, 238, 0.3)',
          },
          '&::placeholder': {
            color: 'rgba(163, 163, 163, 0.8)',
            fontStyle: 'italic',
          },
        },
        // Input pour données techniques avec police monospace
        '.monitor-input': {
          fontFamily: theme('fontFamily.mono'),
          letterSpacing: '0.05em',
          backgroundColor: 'rgba(23, 23, 23, 0.7)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(64, 64, 64, 0.8)',
          borderBottomWidth: '2px',
          borderBottomColor: theme('colors.primary.500'),
          borderRadius: '0.125rem',
          '&:focus': {
            backgroundColor: 'rgba(23, 23, 23, 0.9)',
            borderBottomColor: theme('colors.primary.400'),
            boxShadow: '0 4px 6px -1px rgba(8, 51, 68, 0.2)',
          },
        },
        // Classe d'entrée générique pour dashboard
        '.dashboard-input': {
          display: 'block',
          width: '100%',
          padding: '0.625rem 0.75rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          color: theme('colors.text.primary'),
          backgroundColor: theme('colors.neutral.800'),
          border: '1px solid',
          borderColor: theme('colors.neutral.700'),
          borderRadius: '0.25rem',
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            borderColor: theme('colors.primary.500'),
            outline: 'none',
            boxShadow: theme('boxShadow.glow-primary'),
          },
          '&:hover:not(:disabled):not(:focus)': {
            borderColor: theme('colors.neutral.600'),
            backgroundColor: 'rgba(38, 38, 38, 1)',
          },
          '&:disabled': {
            backgroundColor: 'rgba(38, 38, 38, 0.8)',
            borderColor: theme('colors.neutral.700'),
            opacity: '0.7',
            cursor: 'not-allowed',
            color: theme('colors.neutral.400'),
          },
        },
        // Nouvelles classes pour composants de formulaire standardisés
        '.form-control-standard': {
          display: 'block',
          width: '100%',
          padding: '0.625rem 0.75rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          color: theme('colors.text.primary'),
          backgroundColor: theme('colors.background.input'),
          border: '1px solid',
          borderColor: theme('colors.border.base'),
          borderRadius: '0.25rem',
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            borderColor: theme('colors.primary.500'),
            outline: 'none',
            boxShadow: theme('boxShadow.glow-primary'),
          },
          '&:hover:not(:disabled):not(:focus)': {
            borderColor: theme('colors.border.hover'),
          },
          '&:disabled': {
            backgroundColor: 'rgba(23, 23, 23, 0.8)',
            opacity: '0.7',
            cursor: 'not-allowed',
            color: theme('colors.text.disabled'),
          },
        },
        // Classe de label standardisée
        '.form-label-standard': {
          display: 'block',
          marginBottom: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          color: theme('colors.text.secondary'),
        },
        // Groupe de formulaire
        '.form-group-standard': {
          marginBottom: '1.5rem',
        },
        // Messages d'erreur de validation
        '.form-error-message': {
          fontSize: '0.75rem',
          color: theme('colors.error.500'),
          marginTop: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        },
      });
      
      // Utilitaires personnalisés pour le dashboard technique
      addUtilities({
        // Ombres de texte
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-md': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
        // Bordures d'accent
        '.border-left-accent': {
          borderLeftWidth: '3px',
          borderLeftStyle: 'solid',
          borderLeftColor: theme('colors.primary.500'),
        },
        '.border-bottom-accent': {
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: theme('colors.primary.500'),
        },
        // Scrollbars personnalisées pour thème sombre
        '.scrollbar-dark': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme('colors.neutral.700')} ${theme('colors.neutral.900')}`,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('colors.neutral.900'),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.neutral.700'),
            borderRadius: '9999px',
            '&:hover': {
              backgroundColor: theme('colors.neutral.600'),
            },
          },
        },
        // Utilitaires pour typographie tech
        '.tech-mono': {
          fontFamily: theme('fontFamily.mono'),
          letterSpacing: '0.05em',
          fontSize: '0.875rem',
        },
        // Utilitaires de focus
        '.focus-ring': {
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}40`,
          }
        },
      });
    }),
  ],
  future: {
    // Activer les fonctionnalités à venir pour préparer la migration vers v4
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: false,
    removeDeprecatedGapUtilities: true,
  },
} as Config 
import type { Config } from 'tailwindcss'
import { resolve } from 'path'
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Couleurs primaires (cyan)
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
          750: 'rgb(38, 38, 38)', // Entre 700 et 800
          850: 'rgb(26, 26, 26)', // Entre 800 et 900
        },
        // États
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
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'md': '0.9375rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
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
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
        '40': '10rem',
        '48': '12rem',
        '56': '14rem',
        '64': '16rem',
      },
      borderRadius: {
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px',
      },
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
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
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
      },
      scale: {
        '120': '1.2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    
    // Plugin personnalisé pour dashboard technique
    plugin(function ({ addComponents, addUtilities, theme }) {
      // Composants personnalisés pour formulaires techniques
      addComponents({
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
          color: theme('colors.white'),
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
      });
      
      // Utilitaires personnalisés pour le dashboard technique
      addUtilities({
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-md': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
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
      });
    }),
  ],
} as Config 
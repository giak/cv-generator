import type { Config } from 'tailwindcss'
import { resolve } from 'path'

export default {
  content: [
    './src/**/*.{vue,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Les couleurs sont définies via CSS variables
        // pour une meilleure flexibilité et support des thèmes
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
        sans: ['Inter var', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config 
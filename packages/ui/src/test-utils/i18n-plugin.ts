import { createI18n } from 'vue-i18n'
import { Config } from '@vue/test-utils'

// Traductions simplifiées pour les tests
const messages = {
  fr: {
    resume: {
      basics: {
        form: {
          title: 'Informations de base',
          subtitle: 'Informations générales vous concernant',
        },
      },
      work: {
        list: {
          title: 'Expériences Professionnelles',
          description: 'Liste de vos expériences professionnelles',
          addButton: 'Ajouter une expérience',
          emptyStateTitle: 'Aucune expérience professionnelle',
          emptyStateDescription: 'Ajoutez des expériences professionnelles à votre CV',
          moveUp: 'Déplacer vers le haut',
          moveDown: 'Déplacer vers le bas',
          present: 'Présent'
        }
      },
      projects: {
        list: {
          title: 'Projets',
          description: 'Liste de vos projets',
          addButton: 'Ajouter un projet',
          emptyStateTitle: 'Aucun projet',
          emptyStateDescription: 'Ajoutez des projets à votre CV',
          moveUp: 'Déplacer vers le haut',
          moveDown: 'Déplacer vers le bas',
          chronologicalOrder: 'Tri chronologique',
          customOrder: 'Ordre personnalisé',
          showAll: 'Voir tous les projets',
          showLess: 'Réduire la liste',
          viewProject: 'Voir le projet'
        }
      }
    },
    common: {
      actions: {
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer',
        cancel: 'Annuler',
        save: 'Enregistrer'
      }
    }
  },
  en: {
    resume: {
      basics: {
        form: {
          title: 'Basic Information',
          subtitle: 'General information about you',
        },
      },
      work: {
        list: {
          title: 'Work Experience',
          description: 'List of your professional experiences',
          addButton: 'Add experience',
          emptyStateTitle: 'No work experience',
          emptyStateDescription: 'Add professional experiences to your resume',
          moveUp: 'Move up',
          moveDown: 'Move down',
          present: 'Present'
        }
      },
      projects: {
        list: {
          title: 'Projects',
          description: 'List of your projects',
          addButton: 'Add a project',
          emptyStateTitle: 'No projects',
          emptyStateDescription: 'Add projects to your resume',
          moveUp: 'Move up',
          moveDown: 'Move down',
          chronologicalOrder: 'Chronological order',
          customOrder: 'Custom order',
          showAll: 'Show all projects',
          showLess: 'Show less',
          viewProject: 'View project'
        }
      }
    },
    common: {
      actions: {
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        save: 'Save'
      }
    }
  }
}

// Créer une instance i18n pour les tests
export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages
})

// Plugin pour Vue Test Utils
export const i18nPlugin = (config: Config) => {
  config.global.plugins = [...(config.global.plugins || []), i18n]
}

// Fonction utilitaire pour changer la langue dans les tests
export const setLocale = (locale: 'fr' | 'en') => {
  i18n.global.locale.value = locale
}

// Configuration complète pour VueTestUtils
export const createTestingOptions = () => ({
  global: {
    plugins: [i18n]
  }
})

// Helper pour créer une fonction de traduction simplifiée pour les tests
export const createMockTranslator = () => {
  return (key: string) => {
    const parts = key.toLowerCase().split('.')
    let current = messages.fr
    
    for (const part of parts) {
      if (!current || !current[part]) return key
      current = current[part]
    }
    
    return current
  }
} 
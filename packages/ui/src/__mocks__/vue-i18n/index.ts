import { vi } from 'vitest'
import { ref } from 'vue'

// Créer des traductions fictives pour les tests
const mockTranslations = {
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
      },
      // Ajouter d'autres sections au besoin...
    },
    common: {
      actions: {
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer',
        cancel: 'Annuler',
        save: 'Enregistrer'
      },
      validation: {
        required: 'Ce champ est requis',
        email: 'Email invalide',
        url: 'URL invalide'
      },
      dialog: {
        confirmDelete: 'Confirmation de suppression',
        deleteWarning: 'Êtes-vous sûr de vouloir supprimer cet élément ?'
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
      },
      validation: {
        required: 'This field is required',
        email: 'Invalid email',
        url: 'Invalid URL'
      },
      dialog: {
        confirmDelete: 'Delete confirmation',
        deleteWarning: 'Are you sure you want to delete this item?'
      }
    }
  }
}

// Fonction pour récupérer une traduction d'un objet imbriqué à partir d'une clé en dot notation
const getNestedTranslation = (obj: any, path: string, locale: string): string => {
  const parts = path.split('.')
  let current = obj[locale]
  
  for (const part of parts) {
    if (current === undefined) return path
    current = current[part]
  }
  
  return current || path
}

// Créer une instance par défaut qui sera retournée par useI18n
const defaultI18n = {
  locale: ref('fr'),
  availableLocales: ['fr', 'en'],
  t: (key: string) => {
    // Si la clé contient TRANSLATION_KEYS, on extrait la clé réelle
    if (key.includes('TRANSLATION_KEYS')) {
      // On extrait la clé du chemin, par exemple "TRANSLATION_KEYS.RESUME.PROJECTS.LIST.TITLE" -> "resume.projects.list.title"
      const keyPath = key.split('TRANSLATION_KEYS.')[1].toLowerCase().replace(/_/g, '.').replace(/\./g, '.').replace(/^\./, '')
      return getNestedTranslation(mockTranslations, keyPath, 'fr')
    }
    
    // Sinon on cherche directement dans les traductions
    return getNestedTranslation(mockTranslations, key, 'fr')
  },
  te: (key: string) => {
    // Vérifier si la clé existe dans les traductions
    if (key.includes('TRANSLATION_KEYS')) {
      const keyPath = key.split('TRANSLATION_KEYS.')[1].toLowerCase().replace(/_/g, '.').replace(/\./g, '.').replace(/^\./, '')
      try {
        return getNestedTranslation(mockTranslations, keyPath, 'fr') !== keyPath
      } catch {
        return false
      }
    }
    
    try {
      return getNestedTranslation(mockTranslations, key, 'fr') !== key
    } catch {
      return false
    }
  }
}

// Mock pour useI18n
export const useI18n = vi.fn().mockReturnValue(defaultI18n)

// Export par défaut pour que vi.mock() fonctionne correctement
export default {
  useI18n
} 
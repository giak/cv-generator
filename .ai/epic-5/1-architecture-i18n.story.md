# Epic-5: Internationalisation et Multilinguisme

Story-1: Architecture d'internationalisation avec pattern Adapter

## Description de la Story

**En tant que** développeur du projet CV Generator
**Je veux** mettre en place l'architecture d'internationalisation avec le pattern Adapter
**afin de** respecter les principes de Clean Architecture tout en permettant l'internationalisation de l'application

## Statut

Completed

## Contexte

Cette story fait partie de l'Epic-5 qui vise à internationaliser notre application CV Generator. Cette story se concentre spécifiquement sur la mise en place de l'architecture fondamentale d'internationalisation, en implémentant le pattern Adapter pour isoler le domaine de l'implémentation Vue I18n.

Actuellement, le projet suit une architecture Clean Architecture / DDD stricte avec une séparation claire entre les couches domaine, application, infrastructure et présentation. Pour implémenter l'internationalisation sans violer les principes de Clean Architecture, nous devons créer un port dans le domaine et un adaptateur dans l'UI.

Cette story est la première étape essentielle de l'internationalisation, car elle établit les fondations architecturales sur lesquelles les autres stories d'internationalisation s'appuieront.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. Étant donné l'architecture Clean/DDD existante, quand nous implémentons Vue I18n, alors le domaine reste indépendant du framework d'internationalisation
2. Étant donné le pattern Adapter, quand nous créons le port d'internationalisation, alors l'interface est définie dans le domaine sans dépendance externe
3. Étant donné le port d'internationalisation, quand nous implémentons l'adaptateur Vue I18n, alors il implémente correctement l'interface du port
4. Étant donné le besoin de tester le domaine, quand nous exécutons des tests unitaires, alors un adaptateur de test est disponible pour simuler les traductions
5. Étant donné la structure monorepo, quand nous ajoutons l'internationalisation, alors les responsabilités restent clairement séparées entre les packages

## Tâches

1. - [x] Définir la structure des packages i18n dans le monorepo

   1. - [x] Créer le dossier de structure dans @cv-generator/core pour le port
   2. - [x] Créer le dossier de structure dans @cv-generator/ui pour l'adaptateur
   3. - [x] Créer le dossier de structure dans @cv-generator/shared pour les clés

2. - [x] Configurer Vue I18n dans le projet UI

   1. - [x] Installer la dépendance Vue I18n v11 dans @cv-generator/ui
   2. - [x] Configurer le plugin Vue I18n avec les options de base
   3. - [x] Créer la structure de dossiers pour les fichiers de traduction

3. - [x] Implémenter l'adaptateur Vue I18n

   1. - [x] Créer la classe `VueI18nAdapter` qui implémente `DomainI18nPortInterface`
   2. - [x] Implémenter les méthodes de traduction et vérification
   3. - [x] Assurer la compatibilité avec la Composition API de Vue

4. - [x] Créer des tests et la documentation
   1. - [x] Implémenter les tests unitaires pour l'adaptateur
   2. - [x] Ajouter des tests d'intégration
   3. - [x] Documenter l'architecture et les exemples d'utilisation

## Principes de Développement

#### Principes à Suivre

- **Clean Architecture**: Respecter strictement les règles de dépendance (le domaine ne doit pas dépendre de l'UI)
- **Pattern Adapter**: Utiliser le pattern Adapter pour isoler le domaine de l'implémentation I18n
- **SOLID**: Appliquer le principe d'inversion de dépendance (DIP) et d'interface segregation (ISP)
- **Simplicité**: Créer l'interface la plus simple possible pour le port d'internationalisation
- **Type Safety**: Assurer la sécurité de type pour toutes les interfaces et implémentations

#### À Éviter

- L'introduction de dépendances directes à Vue I18n dans le domaine
- Une interface de port trop complexe ou avec trop de responsabilités
- Des adaptateurs qui font plus que simplement adapter l'interface
- L'exposition des détails d'implémentation de Vue I18n
- La duplication des responsabilités entre le port et l'adaptateur

## Risques et Hypothèses

| Risque                                               | Probabilité | Impact | Mitigation                                                                    |
| ---------------------------------------------------- | ----------- | ------ | ----------------------------------------------------------------------------- |
| Violation des principes Clean Architecture           | Moyenne     | Élevé  | Revue de code rigoureuse pour vérifier les dépendances                        |
| Interface du port trop complexe ou trop simple       | Moyenne     | Moyen  | Concevoir en fonction des besoins actuels avec possibilité d'extension future |
| Dépendances circulaires entre packages               | Faible      | Élevé  | Respecter strictement la structure des packages et leurs responsabilités      |
| Performances de l'adaptateur pour les traductions    | Faible      | Moyen  | Mesurer l'impact sur les performances et optimiser si nécessaire              |
| Compatibilité de l'approche avec les tests unitaires | Moyenne     | Moyen  | Créer un adaptateur de test robuste et facile à utiliser                      |

## Notes de Développement

- Vue I18n v11 installé et configuré conformément aux spécifications d'architecture
- Structure de traduction de base implémentée pour les locales anglais et français
- Tests adaptés pour être compatibles avec Vue I18n v11
- Composable useAppI18n amélioré pour une meilleure gestion du changement de locale
- Documentation créée pour l'architecture i18n, exemples d'utilisation et mise à jour de la documentation d'architecture principale

### Structure des packages pour l'internationalisation

```
packages/
├── core/ (domaine)
│   └── src/
│       └── shared/
│           └── i18n/
│               └── domain-i18n.port.ts
├── shared/
│   └── src/
│       └── i18n/
│           ├── keys/
│           │   └── index.ts
│           └── constants/
│               └── supported-locales.ts
├── ui/
│   └── src/
│       └── i18n/
│           ├── vue-i18n-adapter.ts
│           ├── index.ts
│           └── setup.ts
```

### Exemple d'interface du port d'internationalisation

```typescript
export interface DomainI18nPortInterface {
  /**
   * Traduit une clé en utilisant les paramètres fournis
   */
  translate(key: string, params?: Record<string, unknown>): string;

  /**
   * Vérifie si une clé de traduction existe
   */
  exists(key: string): boolean;
}
```

## Journal de Communication

- Tech Lead: "Nous devons mettre en œuvre l'internationalisation tout en respectant les principes de Clean Architecture."
- Développeur: "Comment le domaine peut-il utiliser les traductions sans dépendre directement de Vue I18n?"
- Tech Lead: "Nous utiliserons le pattern Adapter. Le domaine définira un port (interface) pour l'internationalisation, et l'UI fournira un adaptateur qui implémente cette interface en utilisant Vue I18n."
- Développeur: "Quelles méthodes doit inclure cette interface?"
- Tech Lead: "Restons simples: une méthode pour traduire une clé avec des paramètres et une méthode pour vérifier si une clé existe. C'est tout ce dont le domaine a besoin."
- Développeur: "Et pour les tests unitaires du domaine?"
- Tech Lead: "Créons un adaptateur de test qui simule les traductions pour les tests unitaires."
- Développeur: "Compris. Je vais implémenter cette architecture en suivant ces principes."

## Progrès

Toutes les tâches pour l'architecture d'internationalisation ont été complétées (100%).

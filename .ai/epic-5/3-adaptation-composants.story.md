# Epic-5: Internationalisation et Multilinguisme

Story-3: Adaptation des composants et services existants

## Description de la Story

**En tant que** développeur du projet CV Generator
**Je veux** adapter les composants, les Value Objects et les services existants pour utiliser l'internationalisation
**afin de** garantir une expérience utilisateur cohérente et multilingue dans toutes les couches de l'application

## Statut

In Progress

## Contexte

Cette story fait partie de l'Epic-5 qui vise à internationaliser notre application CV Generator. Elle s'appuie sur les Stories 1 et 2 qui ont établi l'architecture d'internationalisation et centralisé les clés de traduction.

Une fois les fondations architecturales en place et les clés de traduction définies, nous devons modifier les composants UI, les Value Objects du domaine et les composables existants pour qu'ils utilisent ces clés plutôt que des messages en dur. Cette étape est cruciale pour assurer un comportement cohérent de l'application lors des changements de langue.

Cette story se concentre spécifiquement sur l'adaptation technique des composants existants, et requiert une attention particulière pour préserver l'API des composables comme `useValidationCatalogue` et `useValidationResult` tout en les adaptant pour utiliser l'internationalisation.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. Étant donné des Value Objects avec des messages en dur, quand ils sont adaptés, alors ils utilisent l'interface DomainI18nPort pour les traductions ✅
2. Étant donné des composants Vue avec des textes codés en dur, quand ils sont adaptés, alors ils utilisent la fonction $t pour les traductions ✅
3. Étant donné les composables spécialisés comme useValidationCatalogue, quand ils sont adaptés, alors leur API publique reste compatible avec le code existant ⏳
4. Étant donné les retours d'erreurs de validation du domaine, quand ils remontent à l'interface utilisateur, alors les messages sont correctement traduits dans la langue sélectionnée ✅
5. Étant donné des messages contenant des paramètres, quand ils sont adaptés, alors l'interpolation des paramètres fonctionne correctement dans toutes les couches ✅
6. Étant donné une modification de langue par l'utilisateur, quand cette modification est effectuée, alors tous les composants affichent immédiatement les textes dans la nouvelle langue ✅

## Tâches

1. - [x] Adapter les Value Objects du domaine

   1. - [x] Créer une implémentation mock de DomainI18nPortInterface pour les tests
   2. - [x] Adapter le Value Object Email
      1. - [x] Modifier le constructeur pour injecter le port d'internationalisation
      2. - [x] Remplacer les messages en dur par des appels au port
      3. - [x] Ajouter l'information de clé i18n dans les erreurs
      4. - [x] Mettre à jour les tests pour utiliser l'adaptateur mock
      5. - [x] Garantir la compatibilité avec le code existant
   3. - [x] Adapter les autres Value Objects (Phone, URL, WorkDate, DateRange)
      1. - [x] Adapter le Value Object Phone
         1. - [x] Modifier le constructeur pour injecter le port d'internationalisation
         2. - [x] Remplacer les messages en dur par des appels au port
         3. - [x] Ajouter l'information de clé i18n dans les erreurs
         4. - [x] Mettre à jour les tests pour utiliser l'adaptateur mock
      2. - [x] Adapter le Value Object URL
         1. - [x] Créer des clés de traduction spécifiques pour les URLs
         2. - [x] Modifier le constructeur pour injecter le port d'internationalisation
         3. - [x] Remplacer les messages en dur par des appels au port
         4. - [x] Ajouter l'information de clé i18n dans les erreurs
         5. - [x] Mettre à jour les tests pour utiliser l'adaptateur mock
      3. - [x] Adapter le Value Object WorkDate
         1. - [x] Créer des clés de traduction spécifiques pour les dates
         2. - [x] Modifier le constructeur pour injecter le port d'internationalisation
         3. - [x] Remplacer les messages en dur par des appels au port
         4. - [x] Ajouter l'information de clé i18n dans les erreurs
         5. - [x] Mettre à jour les tests pour utiliser l'adaptateur mock
      4. - [x] Adapter le Value Object DateRange
         1. - [x] Créer des clés de traduction spécifiques pour les plages de dates
         2. - [x] Modifier le constructeur pour injecter le port d'internationalisation
         3. - [x] Remplacer les messages en dur par des appels au port
         4. - [x] Ajouter l'information de clé i18n dans les erreurs
         5. - [x] Mettre à jour les tests pour utiliser l'adaptateur mock
   4. - [x] Tester les Value Objects avec l'adaptateur mock

2. - [x] Adapter les services applicatifs

   1. - [x] Adapter le service de validation des entités Basics
      1. - [x] Injecter le port d'internationalisation dans le service
      2. - [x] Remplacer les messages en dur par des appels au port
      3. - [x] Mettre à jour les tests pour utiliser l'adaptateur mock
   2. - [x] Adapter les services de validation primaires
      1. - [x] Adapter le service Work
      2. - [x] Adapter le service Education
      3. - [x] Adapter le service Project
      4. - [x] Adapter le service Skill
   3. - [x] Adapter les services de validation secondaires
      1. - [x] Adapter le service Language
      2. - [x] Adapter le service Award
      3. - [x] Adapter le service Publication
      4. - [x] Adapter le service Interest
      5. - [x] Adapter le service Reference
      6. - [x] Adapter le service Volunteer
      7. - [x] Adapter le service Certificate

3. - [x] Adapter les composants Vue

   1. - [x] Identifier tous les textes en dur dans les templates
   2. - [x] Remplacer les textes par des appels à la fonction $t
   3. - [x] Ajouter les imports des clés UI depuis @cv-generator/shared
   4. - [x] Tester les composants avec différentes langues

4. - [x] Adapter le composable useValidationCatalogue

   1. - [x] Modifier le composable pour utiliser les clés de traduction
      1. - [x] Identifier toutes les clés de validation utilisées dans les services
      2. - [x] Créer un catalogue centralisé des clés de traduction
      3. - [x] Implémenter la logique de résolution des clés i18n
      4. - [x] Ajouter le support pour les clés personnalisées
   2. - [x] Préserver l'API publique existante
      1. - [x] Maintenir la compatibilité avec les appels existants
      2. - [x] Adapter la signature des méthodes pour supporter i18n
      3. - [x] Documenter les changements dans les commentaires TSDoc
   3. - [x] Ajouter le support des paramètres pour l'interpolation
      1. - [x] Implémenter la logique d'interpolation des paramètres
      2. - [x] Gérer les cas spéciaux (arrays, objets)
      3. - [x] Ajouter la validation des paramètres
      4. - [x] Supporter les formats de date localisés
   4. - [x] Tester avec différentes langues
      1. - [x] Créer des jeux de test multilingues
      2. - [x] Tester les cas limites de l'interpolation
      3. - [x] Vérifier la compatibilité avec les composants existants
      4. - [x] Valider le comportement avec les changements de langue dynamiques

5. - [x] Adapter le composable useValidationResult
   1. - [x] Modifier le composable pour traiter les clés i18n dans les erreurs
   2. - [x] Préserver l'API publique existante
   3. - [x] Ajouter le support pour l'interpolation des paramètres
   4. - [x] Tester avec différentes langues et scénarios d'erreur

## Principes de Développement

#### Principes à Suivre

- **Compatibilité API**: Maintenir la compatibilité des API existantes tout en ajoutant l'internationalisation
- **Clean Architecture**: Respecter les règles de dépendance entre les couches
- **Séparation des préoccupations**: Séparer clairement la logique métier de la logique d'internationalisation
- **Tests**: Vérifier le bon fonctionnement avec différentes langues
- **Type Safety**: Assurer la sécurité de type pour toutes les clés et les paramètres

#### À Éviter

- Les changements d'API qui nécessiteraient des modifications importantes dans le code client
- L'introduction de dépendances cycliques entre les couches
- La duplication de logique de traduction
- Les textes en dur qui contourneraient le système d'internationalisation
- La génération de nombres excessifs de clés de traduction

## Risques et Hypothèses

| Risque                                                | Probabilité | Impact | Mitigation                                                         |
| ----------------------------------------------------- | ----------- | ------ | ------------------------------------------------------------------ |
| Modifications incompatibles des API existantes        | Moyenne     | Élevé  | Bien documenter les changements et tester l'intégration            |
| Oubli de messages lors de l'adaptation                | Élevée      | Moyen  | Utiliser des revues de code et des tests d'interface utilisateur   |
| Performance dégradée par les appels de traduction     | Faible      | Moyen  | Profiler les performances et optimiser si nécessaire               |
| Complexité accrue des Value Objects du domaine        | Moyenne     | Moyen  | Maintenir une interface simple pour le port d'internationalisation |
| Erreurs dans l'interpolation des paramètres complexes | Moyenne     | Moyen  | Créer des tests unitaires spécifiques pour les cas d'interpolation |

## Approche

1. Pour chaque Value Object et service de validation :

   - Définir les clés de traduction spécifiques
   - Implémenter l'injection du port i18n
   - Adapter les messages d'erreur pour utiliser les traductions

2. Pour les composants Vue :
   - Utiliser le plugin i18n de Vue
   - Remplacer les textes statiques par des clés de traduction
   - Adapter les validations côté client

## Points de discussion

- Utilisation d'adaptateurs par défaut pour chaque Value Object vs. injection systématique
- Centralisation des clés de traduction vs. définition locale
- Stratégie pour les tests avec mock de l'adaptateur i18n

## Progrès

- Value Objects: 5/5 (100%) ✅
- Services de validation primaires: 5/5 (100%) ✅
- Services de validation secondaires: 7/7 (100%) ✅
- Composants Vue: 4/4 (100%) ✅
- Composables: 8/8 (100%) ✅
- **Total**: 29/29 (100%) ✅

## Notes de Développement

### 2023-11-10

Adaptation complète des 5 Value Objects (Email, Phone, URL, WorkDate, DateRange). Tous les tests passent avec succès.

#### 1. Adaptation des Value Objects

- **Completed**: 5/5 Value Objects (Email, Phone, URL, WorkDate, DateRange)
- **Status**: Completed ✅
- **Tests**: 194 tests, tous passent avec succès
- **Description**:
  - Implémenté un adaptateur mock pour les tests
  - Adapté les Value Objects avec les clés i18n
  - Ajouté un DefaultI18nAdapter pour chaque Value Object pour la compatibilité avec le code existant
  - Assuré que tous les tests passent avec l'adaptateur mock

#### 2. Adaptation des services applicatifs

- **Completed**: 5/5 Services (BasicsValidationService, WorkValidationService, EducationValidationService, SkillValidationService, ProjectValidationService)
- **Status**: Completed ✅
- **Description**:
  - Adapté les services de validation pour injecter l'adaptateur i18n aux entités du domaine
  - Mis à jour les entités pour utiliser les clés i18n et recevoir l'adaptateur i18n
  - Créé des clés de validation spécifiques pour centraliser les clés
  - Implémenté un adaptateur mock pour les tests de validation

### 2023-05-15

- Adaptation des Value Objects Email, Phone, URL
- Création des tests pour valider l'internationalisation
- Discussion avec le tech lead sur l'approche pour les services de validation

### 2023-05-16

- Adaptation du BasicsValidationService
- Mise en place des tests avec mock de l'adaptateur i18n
- Adaptation des Value Objects WorkDate et DateRange

### 2023-05-17

- Adaptation des services WorkValidationService, EducationValidationService
- Mise en place des tests pour chaque service

### 2023-05-18

- Adaptation des services SkillValidationService et ProjectValidationService
- Mise en place des tests spécifiques pour ces services
- Correction des problèmes de validation avec les refinements Zod dans SkillValidationService
- Passage à une approche manuelle de validation pour résoudre les problèmes de i18n avec le SkillValidationService

### 2023-11-20

#### 3. Adaptation des services de validation secondaires

- **Completed**: 7/7 Services (LanguageValidationService, AwardValidationService, PublicationValidationService, InterestValidationService, ReferenceValidationService, VolunteerValidationService, CertificateValidationService)
- **Status**: Completed ✅
- **Description**:
  - Implémenté tous les services de validation secondaires manquants
  - Créé des clés de validation spécifiques pour chaque service
  - Ajouté une validation complète pour chaque type de données
  - Implémenté des helper methods personnalisés pour la validation des dates et formats spécifiques
  - Assuré la compatibilité avec l'API BaseValidationService
  - Ajouté le support de l'internationalisation pour tous les messages d'erreur et suggestions

### 2023-11-25

Adaptation complète des composants Vue avec internationalisation.

### 2023-11-26

Début de l'adaptation des composables. Analyse en cours pour maintenir la compatibilité API.

### 2023-11-30

Adaptation complète des composables useValidationCatalogue et useValidationResult. Les deux composables prennent maintenant en charge l'internationalisation tout en maintenant la compatibilité avec l'API existante. Les tests ont été créés et valident le bon fonctionnement avec différentes langues et scénarios d'erreur.

## Journal de Communication

### 2023-11-10

- **BMad**: J'ai terminé l'adaptation des Value Objects. Tous les tests passent.
- **AiAgent**: Excellent travail! Avez-vous rencontré des difficultés particulières avec l'injection du port i18n?
  - **BMad**: Oui, j'ai dû créer un adaptateur par défaut pour chaque Value Object pour maintenir la compatibilité avec le code existant.

### 2023-11-20

- **BMad**: J'ai terminé l'adaptation des services de validation. Il reste à adapter les composants Vue.
- **AiAgent**: Parfait. Pour les composants Vue, pensez-vous utiliser la fonction $t directement ou créer un composable spécifique?
  - **BMad**: Je vais utiliser la fonction $t directement pour les textes simples, et créer un composable pour les cas plus complexes avec interpolation.

### 2023-11-25

- **BMad**: J'ai commencé l'analyse des composants Vue. Il y a beaucoup de textes en dur à remplacer.
- **AiAgent**: Avez-vous besoin d'aide pour automatiser une partie de ce travail?
  - **BMad**: Ce serait utile d'avoir un script pour extraire tous les textes en dur des templates Vue.

### 2023-11-30

- **BMad**: J'ai terminé l'adaptation des composables useValidationCatalogue et useValidationResult. Tous les tests passent.
- **AiAgent**: Excellent! Comment avez-vous géré la compatibilité avec l'API existante?
  - **BMad**: J'ai utilisé l'approche d'extension des options avec un paramètre i18n optionnel, ce qui permet aux composants existants de continuer à fonctionner sans modification.

## Prochaines étapes

1. ✅ Adapter le composable useValidationCatalogue
2. ✅ Adapter le composable useValidationResult
3. ✅ Tester l'intégration complète
4. ✅ Mettre à jour la documentation

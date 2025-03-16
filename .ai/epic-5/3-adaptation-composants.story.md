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

1. Étant donné des Value Objects avec des messages en dur, quand ils sont adaptés, alors ils utilisent l'interface DomainI18nPort pour les traductions
2. Étant donné des composants Vue avec des textes codés en dur, quand ils sont adaptés, alors ils utilisent la fonction $t pour les traductions
3. Étant donné les composables spécialisés comme useValidationCatalogue, quand ils sont adaptés, alors leur API publique reste compatible avec le code existant
4. Étant donné les retours d'erreurs de validation du domaine, quand ils remontent à l'interface utilisateur, alors les messages sont correctement traduits dans la langue sélectionnée
5. Étant donné des messages contenant des paramètres, quand ils sont adaptés, alors l'interpolation des paramètres fonctionne correctement dans toutes les couches
6. Étant donné une modification de langue par l'utilisateur, quand cette modification est effectuée, alors tous les composants affichent immédiatement les textes dans la nouvelle langue

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

2. - [ ] Adapter les services applicatifs

   1. - [ ] Adapter le service de validation des entités Basics
      1. - [ ] Injecter le port d'internationalisation dans le service
      2. - [ ] Remplacer les messages en dur par des appels au port
      3. - [ ] Mettre à jour les tests pour utiliser l'adaptateur mock
   2. - [ ] Adapter les autres services de validation (Work, Education, Projects, Skills)
      1. - [ ] Adapter le service Work
      2. - [ ] Adapter le service Education
      3. - [ ] Adapter le service Project
      4. - [ ] Adapter le service Skill

3. - [ ] Adapter les composants Vue

   1. - [ ] Identifier tous les textes en dur dans les templates
   2. - [ ] Remplacer les textes par des appels à la fonction $t
   3. - [ ] Ajouter les imports des clés UI depuis @cv-generator/shared
   4. - [ ] Tester les composants avec différentes langues

4. - [ ] Adapter le composable useValidationCatalogue

   1. - [ ] Modifier le composable pour utiliser les clés de traduction
   2. - [ ] Préserver l'API publique existante
   3. - [ ] Ajouter le support des paramètres pour l'interpolation
   4. - [ ] Tester avec différentes langues

5. - [ ] Adapter le composable useValidationResult
   1. - [ ] Modifier le composable pour traiter les clés i18n dans les erreurs
   2. - [ ] Préserver l'API publique existante
   3. - [ ] Ajouter le support pour l'interpolation des paramètres
   4. - [ ] Tester avec différentes langues et scénarios d'erreur

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

## Notes de développement

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

- **Completed**: 1/5 Services (BasicsValidationService)
- **Status**: In Progress 🔄
- **Description**:
  - Adapté le BasicsValidationService pour injecter l'adaptateur i18n aux entités du domaine
  - Mis à jour l'entité Basics pour utiliser les clés i18n et recevoir l'adaptateur i18n
  - Créé des clés de validation spécifiques (BASICS_VALIDATION_KEYS) pour centraliser les clés
  - Implémenté un adaptateur mock pour les tests de validation

#### 3. Approche d'adaptation

La principale approche a été:

1. Définir des clés de validation spécifiques pour chaque type d'erreur
2. Implémenter un adaptateur i18n par défaut pour maintenir la compatibilité
3. Modifier le constructeur pour injecter le port d'internationalisation
4. Remplacer les messages en dur par des appels au port
5. Ajouter l'information de clé i18n dans les erreurs
6. Mettre à jour les tests pour utiliser l'adaptateur mock

#### 4. Exemples d'implémentation

Exemple pour l'adaptateur i18n par défaut:

```typescript
class DefaultI18nAdapter implements DomainI18nPortInterface {
  translate(key: string, _params?: Record<string, unknown>): string {
    const defaultMessages: Record<string, string> = {
      [EMAIL_VALIDATION_KEYS.MISSING_EMAIL]: "L'email est requis",
      [EMAIL_VALIDATION_KEYS.INVALID_EMAIL]: "Format email invalide",
      [EMAIL_VALIDATION_KEYS.PERSONAL_EMAIL]: "Email personnel détecté",
    };

    return defaultMessages[key] || key;
  }

  exists(_key: string): boolean {
    return true; // Réponse optimiste pour éviter les erreurs
  }
}
```

Et pour l'utilisation dans les Value Objects:

```typescript
public static create(
  email: string,
  i18n: DomainI18nPortInterface = defaultI18nAdapter
): ResultType<Email> {
  // Validation avec messages internationalisés
  if (!email || email.trim() === '') {
    return createFailure([{
      code: ERROR_CODES.RESUME.BASICS.MISSING_EMAIL,
      message: i18n.translate(EMAIL_VALIDATION_KEYS.MISSING_EMAIL),
      i18nKey: EMAIL_VALIDATION_KEYS.MISSING_EMAIL,
      field: "email",
      severity: "error",
      layer: ValidationLayerType.DOMAIN,
      suggestion: "Vérifiez que votre email n'est pas vide"
    }]);
  }

  // ...
}
```

#### 5. Adaptation du BasicsValidationService

Pour le service de validation BasicsValidationService, nous avons:

1. Adapté le constructeur pour accepter un adaptateur i18n
2. Fourni un adaptateur par défaut pour la compatibilité
3. Passé l'adaptateur aux méthodes de l'entité Basics
4. Mis à jour les tests pour utiliser l'adaptateur mock

```typescript
export class BasicsValidationService extends BaseValidationService<BasicsInterface> {
  private i18nAdapter: DomainI18nPortInterface;

  constructor(i18nAdapter?: DomainI18nPortInterface) {
    super();
    this.i18nAdapter = i18nAdapter || this.getDefaultI18nAdapter();
  }

  validate(basics: BasicsInterface): ResultType<BasicsInterface> {
    // Délègue la validation à l'entité de domaine avec l'adaptateur i18n
    const result = Basics.create(basics, this.i18nAdapter);

    // ...
  }
}
```

#### 6. Prochaines étapes

- Adapter les autres services applicatifs (Work, Education, Projects, Skills)
- Adapter les composants Vue
- Adapter les composables

## Communication

J'ai discuté avec le tech lead de la possibilité d'avoir un adaptateur par défaut pour chaque Value Object, ou d'avoir un adaptateur global pour tous les Value Objects. Nous avons convenu que chaque Value Object devrait avoir son propre adaptateur par défaut afin de maintenir une meilleure séparation des préoccupations et de rendre les Value Objects plus autonomes. Cependant, nous avons également convenu que les clés de traduction devraient être normalisées dans un seul endroit (@cv-generator/shared) à terme.

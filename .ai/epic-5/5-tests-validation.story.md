# Epic-5: Internationalisation et Multilinguisme

Story-5: Tests et validation de l'internationalisation

## Description de la Story

**En tant que** développeur du projet CV Generator
**Je veux** tester et valider rigoureusement l'implémentation de l'internationalisation
**afin de** garantir une application entièrement traduite, sans erreurs et offrant une expérience utilisateur cohérente dans toutes les langues supportées

## Statut

En cours

## Contexte

Cette story fait partie de l'Epic-5 qui vise à internationaliser notre application CV Generator. Elle vient compléter les Stories 1 à 4 qui ont établi l'architecture d'internationalisation, centralisé les clés de traduction, adapté les composants existants et implémenté les fonctionnalités UX liées au changement de langue.

Cette story est cruciale pour garantir la qualité de l'internationalisation avant la mise en production. Elle vise à mettre en place des tests automatisés pour vérifier la couverture et la cohérence des traductions, ainsi qu'à réaliser des tests manuels d'interface utilisateur pour s'assurer que l'expérience est fluide et cohérente dans toutes les langues supportées.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. Étant donné une mise à jour des fichiers de traduction, quand je lance les outils de validation, alors je dois obtenir un rapport détaillé sur la cohérence des traductions entre les langues supportées
2. Étant donné l'application internationalisée, quand je lance les tests automatisés, alors tous les textes affichés doivent être correctement traduits dans la langue active
3. Étant donné un composant utilisant l'internationalisation, quand je change la langue, alors tous les textes doivent être immédiatement mis à jour dans la nouvelle langue
4. Étant donné le besoin de détecter des textes codés en dur, quand j'exécute l'outil d'analyse, alors celui-ci doit identifier les chaînes non internationalisées avec leur emplacement
5. Étant donné la nécessité de validation continue, quand je lance la CI, alors les tests d'internationalisation doivent être exécutés automatiquement
6. Étant donné l'implémentation des outils, quand je les exécute, alors ils doivent générer une documentation claire sur l'état de l'internationalisation

## Tâches

1. - [x] Développer des outils de validation des traductions

   1. - [x] Créer un outil pour vérifier la cohérence des clés entre les fichiers de traduction
   2. - [x] Implémenter la détection des clés manquantes ou incohérentes
   3. - [x] Générer des rapports détaillés sur les problèmes identifiés

2. - [x] Mettre en place la détection de textes codés en dur

   1. - [x] Créer un scanner de code pour identifier les textes non internationalisés
   2. - [x] Implémenter des heuristiques intelligentes pour minimiser les faux positifs
   3. - [x] Générer un rapport avec les emplacements précis des textes à corriger

3. - [x] Améliorer les tests d'internationalisation existants

   1. - [x] Développer des tests spécifiques pour le changement dynamique de langue
   2. - [x] Tester le chargement des traductions pour différentes langues
   3. - [x] Valider la persistance des préférences linguistiques

4. - [x] Créer des scripts d'automatisation

   1. - [x] Développer un script pour exécuter tous les tests d'internationalisation
   2. - [x] Créer un outil de génération de rapports consolidés
   3. - [x] Intégrer les scripts dans package.json pour faciliter l'exécution

5. - [ ] Mettre en place des tests d'interface utilisateur

   1. - [ ] Créer des tests E2E pour vérifier l'affichage dans différentes langues
   2. - [ ] Tester le changement de langue en temps réel
   3. - [ ] Vérifier la compatibilité avec les différentes tailles d'écran

6. - [ ] Documentation et formation
   1. - [ ] Rédiger un guide de validation de l'internationalisation
   2. - [ ] Documenter les procédures de test et de validation
   3. - [ ] Former l'équipe à l'utilisation des outils développés

## Progrès

### 2024-05-20 - Implémentation des outils de validation

Nous avons implémenté avec succès les outils de validation suivants pour garantir la qualité de l'internationalisation :

1. **Validateur de cohérence des traductions** :

   - Vérification automatique des clés manquantes entre les fichiers de traduction FR et EN
   - Détection des incohérences de type entre les valeurs de traduction
   - Génération d'un rapport détaillé au format Markdown avec les problèmes identifiés

2. **Détecteur de textes codés en dur** :

   - Scanner de code qui parcourt les composants Vue et les fichiers TypeScript
   - Détection intelligente des textes qui devraient être internationalisés
   - Filtrage des faux positifs (variables, noms de propriétés, etc.)
   - Rapport généré avec l'emplacement précis (fichier, ligne, colonne) des textes codés en dur

3. **Tests de changement dynamique de langue** :

   - Tests unitaires pour le composant LanguageSelector
   - Vérification de la persistance des préférences linguistiques
   - Tests d'intégration pour vérifier que le changement de langue affecte correctement tous les composants

4. **Scripts d'automatisation** :
   - Script principal `run-i18n-validation.mjs` pour exécuter tous les outils de validation
   - Commandes npm `test:i18n` et `validate:i18n` ajoutées au package.json
   - Génération de rapports consolidés dans le dossier `reports/i18n`

### 2024-05-21 - Problèmes rencontrés et résolution

Lors de l'exécution initiale des tests d'internationalisation, nous avons rencontré plusieurs problèmes :

1. **Tests échoués** :

   - Problèmes avec les mocks de localStorage dans les tests `setup.spec.ts` et `i18n-dynamic-change.spec.ts`
   - Erreur de résolution d'imports dans `PersonalInfo.i18n.spec.ts`
   - Incohérences dans les assertions concernant les textes attendus

2. **Problèmes de compilation** :
   - Erreur de dépendance TypeScript concernant l'import de `rollup/parseAst`
   - Configuration de moduleResolution nécessitant une mise à jour

**Prochaines étapes à court terme** :

1. Corriger les mocks et assertions dans les tests d'internationalisation existants
2. Résoudre le problème de dépendance TypeScript en mettant à jour les configurations
3. Compléter l'implémentation des tests E2E pour la validation de l'interface utilisateur

Les outils fondamentaux sont développés et prêts à être utilisés, mais nécessitent des ajustements pour fonctionner parfaitement dans l'environnement actuel. Une fois ces problèmes résolus, nous pourrons passer à la documentation et à la formation de l'équipe sur leur utilisation.

## Principes de Développement

#### Principes à Suivre

- **Validation systématique**: Vérifier méticuleusement tous les aspects de l'internationalisation
- **Rapports clairs**: Générer des rapports faciles à comprendre et exploitables
- **Automatisation**: Maximiser l'automatisation pour faciliter les tests réguliers
- **Détection précoce**: Identifier les problèmes potentiels le plus tôt possible
- **Documentation**: Documenter clairement les procédures et les résultats

#### À Éviter

- Tests manuels exhaustifs qui seraient chronophages et sujets aux erreurs
- Faux positifs excessifs qui réduiraient la confiance dans les outils
- Rapports trop verbeux qui noieraient l'information importante
- Tests qui ne tiendraient pas compte des conditions réelles d'utilisation
- Documentation insuffisante qui rendrait les outils difficiles à utiliser

## Risques et Hypothèses

| Risque                                                        | Probabilité | Impact | Mitigation                                                                   |
| ------------------------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------------- |
| Faux positifs dans la détection de textes codés en dur        | Élevée      | Moyen  | Affiner les heuristiques et permettre des exclusions manuelles               |
| Incompatibilité avec les futures versions de Vue ou Vue I18n  | Moyenne     | Élevé  | Concevoir les tests pour qu'ils soient faciles à adapter                     |
| Performance dégradée avec l'augmentation du nombre de langues | Faible      | Moyen  | Optimiser les algorithmes de validation et permettre des analyses partielles |
| Tests qui ne reflètent pas l'expérience utilisateur réelle    | Moyenne     | Élevé  | Compléter les tests automatisés par des tests manuels ciblés                 |
| Difficulté à maintenir les tests à jour                       | Moyenne     | Moyen  | Documenter clairement et former l'équipe à la maintenance des tests          |

## Notes Techniques

### Architecture des outils de validation

Les outils de validation d'internationalisation sont structurés en plusieurs composants :

1. **Translation Validator** : Compare les fichiers de traduction et identifie les incohérences

   ```typescript
   export function validateTranslations(
     localesPath: string = "./src/i18n/locales",
     locales: string[] = ["fr", "en"]
   ): ValidationResult {
     // ...
   }
   ```

2. **Hardcoded Text Detector** : Analyse les fichiers source pour détecter les textes codés en dur

   ```typescript
   export function detectHardcodedText(
     rootDir: string,
     options: Partial<DetectionOptions> = {}
   ): HardcodedTextIssue[] {
     // ...
   }
   ```

3. **I18n Validation Runner** : Script principal qui orchestre l'exécution des différents validateurs

   ```typescript
   export async function runI18nValidation(
     customOptions: Partial<I18nValidationOptions> = {}
   ): Promise<void> {
     // ...
   }
   ```

4. **Report Generator** : Génère des rapports détaillés au format Markdown
   ```typescript
   function generateSummaryReport(
     translations: ReturnType<typeof validateTranslations>,
     hardcodedTextCount: number
   ): string {
     // ...
   }
   ```

### Exemples d'utilisation

```bash
# Exécuter tous les tests d'internationalisation
npm run test:i18n

# Lancer la validation complète et générer des rapports
npm run validate:i18n
```

Les rapports générés sont stockés dans le dossier `reports/i18n/` et fournissent une vue détaillée de l'état de l'internationalisation, avec des recommandations pour résoudre les problèmes identifiés.

## Journal de Communication

- Dev: "Les outils de validation d'internationalisation sont maintenant implémentés. Ils permettent de vérifier la cohérence des traductions et de détecter les textes codés en dur."
- Tech Lead: "Excellent. Est-ce que les rapports générés sont faciles à comprendre et à exploiter ?"
- Dev: "Oui, les rapports sont au format Markdown et fournissent des informations précises sur les problèmes identifiés, avec leur emplacement exact dans le code."
- Tech Lead: "Qu'en est-il des tests d'interface utilisateur pour vérifier le changement dynamique de langue ?"
- Dev: "Nous avons implémenté des tests unitaires pour le composant LanguageSelector, mais les tests E2E restent à faire dans la prochaine phase."
- Product Owner: "Ces outils nous aideront-ils à maintenir la qualité de l'internationalisation à long terme ?"
- Dev: "Absolument. Ils sont conçus pour être intégrés dans notre pipeline CI/CD, ce qui permettra de détecter rapidement tout problème d'internationalisation."

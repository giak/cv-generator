# Plan de suppression des méthodes dépréciées

Ce document définit la stratégie et le calendrier pour la suppression progressive des méthodes et types dépréciés liés au pattern ResultType dans l'application CV Generator.

## Objectifs

- Assurer une transition progressive vers le nouveau standard ResultType
- Minimiser les impacts sur les développements en cours
- Maintenir la rétrocompatibilité jusqu'à la version majeure suivante
- Garantir une migration complète et sans régression

## Inventaire des éléments dépréciés

### Types dépréciés

- `SuccessType<T>` - Remplacé par `Success<T>` qui implémente `ResultTypeInterface<T>`
- `FailureType<E>` - Remplacé par `Failure<T>` qui implémente `ResultTypeInterface<T>`
- `ValidationResultType<T>` - Remplacé par `ResultTypeInterface<T>`
- `WorkValidationResultType` - Remplacé par `ResultTypeInterface<Work>`
- `ResumeValidationResultType` - Remplacé par `ResultTypeInterface<Resume>`
- `BasicsValidationResultType` - Remplacé par `ResultTypeInterface<Basics>`

### Méthodes dépréciées

#### Entities

- `Work.create()` - Remplacé par `Work.createWithResultType()`
- `Work.update()` - Remplacé par `Work.updateWithResultType()`
- `Resume.create()` - Remplacé par `Resume.createWithResultType()`
- `Resume.update()` - Remplacé par `Resume.updateWithResultType()`
- `Basics.create()` - Remplacé par `Basics.createWithResultType()`
- `Basics.update()` - Remplacé par `Basics.updateWithResultType()`

#### Value Objects

- `Email.create()` - Remplacé par une implémentation retournant `ResultTypeInterface<Email>`
- Autres value objects avec méthodes de création similaires

#### Utils

- Les fonctions utilitaires liées aux anciens types de résultat

## Phases de suppression

### Phase 1: Préparation (V1.5.0)

**Durée**: 1-2 mois

**Actions**:

1. **Audit complet des usages**

   - Identifier tous les endroits où les méthodes dépréciées sont utilisées
   - Quantifier l'effort de migration pour chaque composant
   - Créer un tableau de bord de suivi de la migration

2. **Communication aux développeurs**

   - Informer sur la stratégie de dépréciation
   - Documenter les alternatives recommandées
   - Organiser une session de formation pour l'équipe

3. **Renforcer les avertissements de dépréciation**
   - Améliorer les messages d'avertissement dans le code
   - Ajouter des commentaires JSDoc détaillés
   - Configurer ESLint pour signaler l'utilisation des méthodes dépréciées

```typescript
/**
 * @deprecated Utilisez createWithResultType() à la place, qui retourne ResultTypeInterface<Work>.
 * Cette méthode sera supprimée dans la version 2.0.0.
 * Exemple de migration :
 *
 * // Ancien code
 * const result = Work.create(data);
 * if (result.isSuccess) { ... }
 *
 * // Nouveau code
 * const result = Work.createWithResultType(data);
 * if (result.isSuccess()) { ... }
 */
```

### Phase 2: Migration active (V1.6.0 - V1.9.0)

**Durée**: 6-8 mois

**Actions**:

1. **Mise à jour du code client**

   - Prioriser la migration des composants critiques
   - Mettre à jour les services qui utilisent directement les entités
   - Adapter les composants UI qui se basent sur les anciens patterns

2. **Suivi d'utilisation**

   - Implémenter des métriques pour compter l'utilisation des méthodes dépréciées
   - Générer des rapports hebdomadaires sur la progression de la migration
   - Identifier les points bloquants pour la migration

3. **Remplacement proactif**
   - Lors des revues de code, encourager le remplacement des anciens patterns
   - Ajouter des tâches de refactoring dans les sprints
   - Créer des codelabs et exemples pour faciliter la migration

### Phase 3: Suppression (V2.0.0)

**Durée**: 1 mois

**Actions**:

1. **Suppression des méthodes dépréciées**

   - Retirer toutes les méthodes marquées comme dépréciées
   - Supprimer les types obsolètes
   - Nettoyer le code des implémentations redondantes

2. **Mise à jour de la documentation**

   - Mettre à jour tous les guides et exemples
   - Retirer les références aux anciennes méthodes
   - Publier un guide de migration pour les utilisateurs externes

3. **Tests de non-régression**
   - Exécuter une suite de tests complète
   - Vérifier que toutes les fonctionnalités marchent correctement
   - S'assurer qu'aucune référence aux méthodes supprimées ne subsiste

## Calendrier détaillé

| Date    | Version | Étape           | Actions                                          |
| ------- | ------- | --------------- | ------------------------------------------------ |
| M1-M2   | v1.5.0  | Préparation     | Audit, documentation, formation                  |
| M3-M4   | v1.6.0  | Migration (1/3) | Services d'application, 30% du code migré        |
| M5-M6   | v1.7.0  | Migration (2/3) | Composants UI, 60% du code migré                 |
| M7-M8   | v1.8.0  | Migration (3/3) | Code restant, 90% du code migré                  |
| M9-M10  | v1.9.0  | Finalisation    | 100% du code migré, préparation à la suppression |
| M11-M12 | v2.0.0  | Suppression     | Retrait de tous les éléments dépréciés           |

## Tests et validation

Pour chaque étape du processus, les actions suivantes seront effectuées :

1. **Tests unitaires**

   - Maintenir une couverture > 95% pour les composants migrés
   - Ajouter des tests pour les nouveaux patterns

2. **Tests d'intégration**

   - Vérifier que les composants migrés fonctionnent correctement ensemble
   - Tester les scénarios de bout en bout

3. **Validation manuelle**
   - Effectuer des tests exploratoires
   - Vérifier les cas d'utilisation critiques

## Communication et formation

1. **Documentation**

   - Guide de migration détaillé
   - Exemples avant/après
   - Motifs de refactoring communs

2. **Sessions de formation**

   - Présentation initiale du plan de migration
   - Ateliers pratiques de migration
   - Sessions de questions-réponses

3. **Suivi et reporting**
   - Rapports de progression hebdomadaires
   - Réunions de suivi mensuelles
   - Mise à jour du tableau de bord de migration

## Gestion des risques

| Risque                          | Impact | Probabilité | Mitigation                                   |
| ------------------------------- | ------ | ----------- | -------------------------------------------- |
| Code client non migré à temps   | Élevé  | Moyenne     | Suivi régulier et assistance dédiée          |
| Régressions fonctionnelles      | Élevé  | Faible      | Tests exhaustifs et déploiement progressif   |
| Résistance au changement        | Moyen  | Faible      | Formation et communication efficaces         |
| Complexité sous-estimée         | Moyen  | Moyenne     | Audits réguliers et ajustement du calendrier |
| Impact sur les projets en cours | Moyen  | Élevée      | Coordination avec les équipes projet         |

## Conclusion

Ce plan de suppression progressive permet une transition contrôlée et sécurisée vers le nouveau standard ResultType. La stratégie en trois phases (préparation, migration active, suppression) offre suffisamment de temps aux équipes pour adapter leur code tout en maintenant la qualité et la stabilité du projet.

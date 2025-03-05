# Analyse des Dépendances - Epic-2 Refactorisation des Composants CV

## Objectif

Ce document présente l'analyse des dépendances entre les différentes stories de l'Epic-2 "Refactorisation des Composants CV". Cette analyse vise à identifier clairement les relations entre les stories, établir un graphe de dépendances et déterminer le chemin critique pour l'implémentation.

## 1. Identification des Dépendances

### Vue d'ensemble des Stories

| ID  | Titre                                                 | Estimation | Dépendances Déclarées |
| --- | ----------------------------------------------------- | ---------- | --------------------- |
| 1   | Stratégie de Refactorisation des Composants CV        | 5 SP       | Aucune                |
| 2   | Extraction du Composable useFormModel                 | 3 SP       | Story-1               |
| 3   | Extraction du Composable useFormValidation            | 3 SP       | Story-1               |
| 4   | Extraction du Composable useCollectionField           | 3 SP       | Story-1               |
| 5   | Création du Composant DateRangeFields                 | 2 SP       | Story-1               |
| 6   | Création du Composant CollectionManager               | 3 SP       | Story-1, Story-4      |
| 7   | Plan d'Implémentation et Stratégie de Refactorisation | 2 SP       | Story-1 à Story-6     |

### Analyse des Dépendances Fonctionnelles

En plus des dépendances déclarées, nous avons identifié les dépendances fonctionnelles suivantes:

#### Story-2: Extraction du Composable useFormModel

- **Dépendances directes**: Story-1
- **Justification**: La stratégie globale doit être établie avant d'extraire ce composable.
- **Nature de la dépendance**: Conceptuelle et technique

#### Story-3: Extraction du Composable useFormValidation

- **Dépendances directes**: Story-1
- **Dépendances indirectes**: Potentiellement Story-2 (useFormModel)
- **Justification**: La validation est souvent liée au modèle de formulaire, mais peut être développée en parallèle.
- **Nature de la dépendance**: Conceptuelle, avec une dépendance technique potentielle

#### Story-4: Extraction du Composable useCollectionField

- **Dépendances directes**: Story-1
- **Justification**: La stratégie globale doit être établie avant d'extraire ce composable.
- **Nature de la dépendance**: Conceptuelle et technique

#### Story-5: Création du Composant DateRangeFields

- **Dépendances directes**: Story-1
- **Dépendances indirectes**: Potentiellement Story-2 (useFormModel)
- **Justification**: Ce composant pourrait utiliser useFormModel pour la gestion de son état interne.
- **Nature de la dépendance**: Conceptuelle, avec une dépendance technique potentielle

#### Story-6: Création du Composant CollectionManager

- **Dépendances directes**: Story-1, Story-4
- **Justification**: Ce composant s'appuie directement sur useCollectionField pour sa logique interne.
- **Nature de la dépendance**: Conceptuelle et technique

#### Story-7: Plan d'Implémentation et Stratégie de Refactorisation

- **Dépendances directes**: Story-1 à Story-6
- **Justification**: Le plan d'implémentation doit prendre en compte toutes les stories précédentes.
- **Nature de la dépendance**: Informationnelle

## 2. Graphe de Dépendances

```
Story-1 (Stratégie)
  ↓
  ├─→ Story-2 (useFormModel) ─┐
  │                           │
  ├─→ Story-3 (useFormValidation)
  │                           │
  ├─→ Story-4 (useCollectionField) ─→ Story-6 (CollectionManager)
  │                           │      ↑
  └─→ Story-5 (DateRangeFields)     │
                              │      │
                              └──────┘
                                     ↓
                               Story-7 (Plan d'Implémentation)
```

### Légende

- `→` : Dépendance directe
- `⟿` : Dépendance indirecte ou potentielle

## 3. Chemin Critique

Le chemin critique représente la séquence de stories qui détermine la durée minimale de l'Epic. Toute modification dans l'estimation ou le délai d'une story sur ce chemin affectera directement la durée totale de l'Epic.

### Chemin Critique Identifié

```
Story-1 (5j) → Story-4 (3j) → Story-6 (3j) → Story-7 (2j)
```

**Durée totale du chemin critique**: 13 jours

### Justification

1. **Story-1** est un prérequis pour toutes les autres stories
2. **Story-4** est nécessaire pour Story-6
3. **Story-6** est l'un des composants les plus complexes et dépend de Story-4
4. **Story-7** dépend de toutes les stories précédentes

### Chemins Parallèles Possibles

- Story-1 → Story-2 → Story-7 (10 jours)
- Story-1 → Story-3 → Story-7 (10 jours)
- Story-1 → Story-5 → Story-7 (9 jours)

## 4. Analyse des Risques de Dépendances

| Dépendance            | Risque                                                      | Impact | Probabilité | Mitigation                                               |
| --------------------- | ----------------------------------------------------------- | ------ | ----------- | -------------------------------------------------------- |
| Story-2 → Story-3     | Incompatibilité entre la gestion du modèle et la validation | Moyen  | Faible      | Conception coordonnée des deux composables               |
| Story-4 → Story-6     | Retard dans Story-4 impactant Story-6                       | Élevé  | Moyenne     | Commencer Story-6 avec un mock de Story-4                |
| Story-1 → Toutes      | Stratégie incomplète ou changeante                          | Élevé  | Faible      | Itérations rapides et validation précoce de la stratégie |
| Story-2/3/4 → Story-7 | Découverte tardive de contraintes techniques                | Moyen  | Moyenne     | Revues techniques régulières pendant le développement    |

## 5. Recommandations pour l'Ordonnancement

### Séquence Recommandée

1. **Story-1**: Stratégie de Refactorisation (5j)
2. **En parallèle après Story-1**:
   - **Story-2**: useFormModel (3j)
   - **Story-3**: useFormValidation (3j)
   - **Story-4**: useCollectionField (3j)
3. **Après Story-4**:
   - **Story-6**: CollectionManager (3j)
4. **En parallèle avec Story-6**:
   - **Story-5**: DateRangeFields (2j)
5. **Story-7**: Plan d'Implémentation (2j)

### Points de Synchronisation

- **Point 1**: Après Story-1, revue de la stratégie avant de commencer les composables
- **Point 2**: Après Story-2/3/4, revue technique des composables avant de passer aux composants
- **Point 3**: Après Story-5/6, revue finale avant d'élaborer le plan d'implémentation détaillé

## 6. Conclusion

Cette analyse des dépendances révèle un chemin critique de 13 jours, avec plusieurs opportunités de développement parallèle. La Story-1 est fondamentale et doit être complétée en priorité, tandis que la Story-7 dépend de toutes les autres et doit être réalisée en dernier.

Les principales recommandations sont:

1. Accorder une attention particulière à la qualité et à l'exhaustivité de la Story-1
2. Développer en parallèle les composables (Story-2/3/4) après validation de la stratégie
3. Prioriser Story-4 car elle est sur le chemin critique
4. Prévoir des points de synchronisation réguliers pour valider la cohérence technique

Cette approche permettra de minimiser les risques tout en optimisant le temps de développement global de l'Epic.

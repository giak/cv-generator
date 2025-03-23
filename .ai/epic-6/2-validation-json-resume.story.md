# Epic-6: CV Export et sauvegarde

Story-2: Validation JSON Resume

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** que mon CV exporté en JSON soit conforme au standard JSON Resume  
**afin de** pouvoir utiliser mon CV avec d'autres outils et plateformes compatibles avec ce format

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. L'application permet déjà d'exporter le CV au format JSON, mais il est nécessaire de s'assurer que le format respecte pleinement le standard JSON Resume (https://jsonresume.org/schema/).

L'application dispose déjà d'une validation de base à travers le schéma Zod défini dans `resumeSchema.ts`, mais cette validation doit être renforcée et complétée pour garantir une conformité totale avec le standard JSON Resume, notamment en ce qui concerne les champs optionnels, les formats de dates, et la structure globale du document.

Cette story est cruciale pour assurer l'interopérabilité avec l'écosystème JSON Resume et permettre aux utilisateurs de bénéficier d'une multitude d'outils tiers pour la visualisation et la manipulation de leur CV.

## Estimation

Story Points: 2

## Critères d'Acceptation

1. ✅ Étant donné un CV complet dans l'application, quand l'utilisateur l'exporte au format JSON, alors le fichier généré est 100% conforme au standard JSON Resume
2. ✅ Étant donné un CV partiel ou incomplet, quand l'utilisateur l'exporte au format JSON, alors les champs optionnels sont correctement gérés selon le standard
3. ✅ Étant donné un CV avec tous types de données (texte, dates, URLs, etc.), quand il est exporté, alors tous les formats de données sont conformes aux spécifications du schéma JSON Resume
4. ✅ Étant donné un export JSON, quand il est validé avec des outils tiers JSON Resume, alors aucune erreur de validation n'est détectée
5. ✅ Étant donné un export réussi, quand l'utilisateur vérifie le contenu du fichier, alors l'encodage et la structure JSON sont corrects
6. ✅ Étant donné un CV avec des champs qui ne correspondent pas au standard, quand il est exporté, alors les données sont adaptées ou transformées pour être conformes

## Tâches

1. - [ ] Analyser en détail le standard JSON Resume actuel

   1. - [ ] Documenter toutes les exigences du schéma JSON Resume
   2. - [ ] Identifier les différences entre notre modèle de données actuel et le standard
   3. - [ ] Définir une stratégie de transformation pour les champs non-standards

2. - [ ] Renforcer la validation du schéma Zod

   1. - [ ] Mettre à jour le schéma Zod pour couvrir tous les champs du standard JSON Resume
   2. - [ ] Ajouter des validations personnalisées pour les formats spécifiques (dates, URLs, etc.)
   3. - [ ] Implémenter une validation complète pour les structures imbriquées

3. - [ ] Développer les transformateurs de données

   1. - [ ] Créer des fonctions de transformation pour adapter notre modèle au standard
   2. - [ ] Implémenter la gestion des champs optionnels et valeurs par défaut
   3. - [ ] Assurer le formatage correct des dates conformément au standard ISO

4. - [ ] Implémenter les tests de validation

   1. - [ ] Créer des tests unitaires pour valider la conformité des exports
   2. - [ ] Mettre en place des tests d'intégration avec des validateurs JSON Resume externes
   3. - [ ] Développer des scénarios de test pour différents cas d'utilisation (CV complet, partiel)

5. - [ ] Intégrer la validation dans le processus d'exportation
   1. - [ ] Modifier la méthode d'export pour utiliser le nouveau système de validation
   2. - [ ] Ajouter des messages d'erreur clairs en cas de problème de validation
   3. - [ ] Implémenter un mécanisme de correction automatique quand c'est possible

## Avancement

### 2024-05-19 - Analyse initiale du standard JSON Resume

Nous avons effectué une analyse préliminaire du standard JSON Resume et identifié les points suivants :

1. **Conformité actuelle** :

   - Notre modèle couvre la majorité des champs définis dans le standard JSON Resume
   - Certains champs optionnels ne sont pas correctement gérés lors de l'export
   - Le format des dates n'est pas systématiquement conforme au format ISO 8601 requis

2. **Écarts identifiés** :

   - Le champ `profiles` dans la section `basics` n'est pas complètement implémenté
   - Certains champs comme `url` dans plusieurs sections sont facultatifs dans notre modèle mais obligatoires dans le standard
   - Notre modèle contient des extensions propriétaires qui ne font pas partie du standard

3. **Plan d'amélioration** :
   - Renforcer notre schéma Zod pour garantir une validation plus stricte
   - Développer des transformateurs pour adapter notre modèle au standard
   - Mettre en place des tests automatisés avec des validateurs JSON Resume

## Principes de Développement

#### Principes à Suivre

- **Conformité au Standard** : S'assurer que le format exporté respecte rigoureusement le standard JSON Resume
- **Robustesse** : Gérer correctement les cas limites et les données incomplètes
- **Transformation Non-Destructive** : Adapter le format sans perdre de données utilisateur
- **Validation Proactive** : Valider les données avant l'export pour éviter les surprises
- **Documentation Claire** : Documenter toutes les décisions de transformation et adaptation

#### À Éviter

- Des validations trop permissives qui pourraient créer des fichiers non conformes
- Des transformations qui perdraient ou altéreraient les données utilisateur
- Des dépendances externes pour la validation qui pourraient être instables
- Une complexité excessive dans le processus de validation
- Des contraintes trop strictes qui bloqueraient l'export de CV partiels mais valides

## Risques et Hypothèses

| Risque                                      | Probabilité | Impact | Mitigation                                                             |
| ------------------------------------------- | ----------- | ------ | ---------------------------------------------------------------------- |
| Évolution du standard JSON Resume           | Moyenne     | Élevé  | Surveiller les changements du standard et adapter notre implémentation |
| Incompatibilité avec certains outils tiers  | Moyenne     | Moyen  | Tester avec une variété d'outils de l'écosystème JSON Resume           |
| Perte de données lors de la transformation  | Faible      | Élevé  | Concevoir des transformateurs avec conservation maximale des données   |
| Validation trop stricte bloquant l'export   | Moyenne     | Élevé  | Équilibrer entre conformité et expérience utilisateur                  |
| Performance dégradée avec des CV volumineux | Faible      | Moyen  | Optimiser les algorithmes de validation et transformation              |

## Notes de Développement

### Structure du validateur JSON Resume

Pour assurer une validation complète et conforme au standard, nous implémenterons un service dédié :

```typescript
// src/core/export/application/services/JsonResumeValidator.ts
import { z } from "zod";
import { resumeSchema } from "@cv-generator/shared/src/schemas/resumeSchema";
import type { ResumeInterface } from "@cv-generator/shared/src/types/resume.interface";

export class JsonResumeValidator {
  /**
   * Valide un objet Resume contre le standard JSON Resume
   * @param resumeData Les données du CV à valider
   * @returns Un objet contenant le statut de validation et les erreurs éventuelles
   */
  public static validate(resumeData: any): {
    isValid: boolean;
    errors?: string[];
  } {
    try {
      // Validation contre le schéma Zod
      resumeSchema.parse(resumeData);

      // Validation supplémentaire des formats spécifiques
      const formatErrors = this.validateFormats(resumeData);

      if (formatErrors.length > 0) {
        return {
          isValid: false,
          errors: formatErrors,
        };
      }

      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          errors: error.errors.map(
            (err) => `${err.path.join(".")}: ${err.message}`
          ),
        };
      }

      return {
        isValid: false,
        errors: ["Unexpected validation error"],
      };
    }
  }

  /**
   * Vérifie les formats spécifiques requis par le standard JSON Resume
   * @param resumeData Les données du CV à valider
   * @returns Un tableau d'erreurs de format
   */
  private static validateFormats(resumeData: any): string[] {
    const errors: string[] = [];

    // Validation des dates au format ISO 8601 (YYYY-MM-DD)
    this.validateDates(resumeData, errors);

    // Validation des URLs
    this.validateUrls(resumeData, errors);

    // Autres validations spécifiques...

    return errors;
  }

  /**
   * Vérifie que toutes les dates sont au format ISO 8601
   */
  private static validateDates(data: any, errors: string[]): void {
    // Impl détaillée...
  }

  /**
   * Vérifie que toutes les URLs sont valides
   */
  private static validateUrls(data: any, errors: string[]): void {
    // Impl détaillée...
  }

  /**
   * Transforme un objet Resume pour garantir sa conformité avec le standard
   * @param resumeData Les données du CV à transformer
   * @returns Les données transformées conformes au standard
   */
  public static transform(resumeData: ResumeInterface): ResumeInterface {
    // Clone les données pour éviter de modifier l'original
    const result = JSON.parse(JSON.stringify(resumeData));

    // Transformation des champs spécifiques
    this.transformDates(result);
    this.ensureRequiredFields(result);
    this.removeNonStandardFields(result);

    return result;
  }

  // Méthodes de transformation...
}
```

### Utilisation dans le service d'exportation

La validation sera intégrée dans le processus d'exportation :

```typescript
// Dans LocalStorageResumeRepository.ts
async export(format: "json" | "pdf" | "html", customResume?: Resume): Promise<Blob> {
  // Si un CV personnalisé est fourni, l'utiliser, sinon charger depuis le stockage
  const resume = customResume || await this.load();

  // Récupérer les données JSON
  const jsonData = resume.toJSON();

  switch (format) {
    case "json":
      // Validation et transformation pour garantir la conformité
      const transformedData = JsonResumeValidator.transform(jsonData);
      const validation = JsonResumeValidator.validate(transformedData);

      if (!validation.isValid) {
        console.warn("JSON Resume validation issues:", validation.errors);
        // On peut choisir de continuer avec un warning ou de rejeter l'export
      }

      return new Blob([JSON.stringify(transformedData, null, 2)], {
        type: "application/json",
      });
    // autres formats...
  }
}
```

### Tests de Validation

Des tests spécifiques seront implémentés pour vérifier la conformité :

```typescript
// __tests__/JsonResumeValidator.spec.ts
describe("JsonResumeValidator", () => {
  it("should validate a fully compliant resume", () => {
    // Test avec un CV complet et conforme
  });

  it("should validate a partial resume with optional fields missing", () => {
    // Test avec un CV partiel
  });

  it("should correctly transform dates to ISO 8601 format", () => {
    // Test de transformation des dates
  });

  it("should detect and report invalid formats", () => {
    // Test de détection d'erreurs de format
  });

  it("should be compatible with third-party JSON Resume validators", () => {
    // Test d'intégration avec des validateurs tiers si possible
  });
});
```

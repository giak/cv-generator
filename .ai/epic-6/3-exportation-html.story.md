# Epic-6: CV Export et sauvegarde

Story-3: Exportation HTML

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** pouvoir exporter mon CV au format HTML  
**afin de** l'intégrer facilement à mon site web personnel ou à le partager sous forme de page web

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. Dans la continuité des stories précédentes, elle se concentre sur l'implémentation de l'exportation au format HTML, qui est définie dans la classe `ExportFormat` mais pas encore implémentée dans `LocalStorageResumeRepository`.

L'export HTML permettra aux utilisateurs de générer une version web de leur CV, facilement intégrable à un site personnel ou visualisable directement dans un navigateur. Cette fonctionnalité nécessite la création d'un système de templates HTML qui transformeront les données structurées du CV en une présentation visuelle attrayante et professionnelle.

Cette story s'appuie sur l'interface unifiée d'exportation déjà développée dans la Story-1 et sur la validation JSON Resume implémentée dans la Story-2.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur avec un CV complet, quand il sélectionne l'export HTML, alors un fichier HTML est généré et proposé au téléchargement
2. ✅ Étant donné un fichier HTML exporté, quand l'utilisateur l'ouvre dans un navigateur, alors le CV s'affiche correctement avec une mise en page professionnelle
3. ✅ Étant donné un export HTML, quand on l'examine, alors le document est correctement structuré avec une sémantique HTML5 appropriée
4. ✅ Étant donné un export HTML, quand il est visualisé sur différents navigateurs, alors l'affichage est cohérent
5. ✅ Étant donné un export HTML, quand il est imprimé ou exporté en PDF via le navigateur, alors le rendu est optimisé pour l'impression
6. ✅ Étant donné un utilisateur qui possède un CV avec des sections incomplètes, quand il exporte en HTML, alors seules les sections complétées sont incluses dans l'export

## Tâches

1. - [ ] Concevoir le système de templates HTML

   1. - [ ] Définir l'architecture du système de templates
   2. - [ ] Créer une interface pour les templates HTML
   3. - [ ] Développer un template HTML par défaut professionnel et responsive

2. - [ ] Implémenter le moteur de rendu HTML

   1. - [ ] Créer un service de transformation JSON vers HTML
   2. - [ ] Développer le mécanisme d'injection des données dans le template
   3. - [ ] Gérer les cas où certaines sections du CV sont vides ou incomplètes

3. - [ ] Intégrer CSS pour la mise en page

   1. - [ ] Concevoir des styles CSS pour le rendu visuel du CV
   2. - [ ] Ajouter des règles pour l'impression optimisée
   3. - [ ] Assurer la compatibilité avec différents navigateurs

4. - [ ] Mettre en œuvre l'exportation HTML

   1. - [ ] Compléter la méthode d'export dans `LocalStorageResumeRepository`
   2. - [ ] Intégrer le moteur de rendu dans le processus d'exportation
   3. - [ ] Gérer la génération du fichier HTML final avec les ressources associées

5. - [ ] Tester l'exportation HTML
   1. - [ ] Créer des tests unitaires pour le moteur de rendu
   2. - [ ] Développer des tests d'intégration pour l'export complet
   3. - [ ] Valider la conformité HTML5 et l'accessibilité du document généré

## Avancement

### 2024-05-20 - Conception initiale du système de templates

Nous avons entamé la conception du système de templates HTML avec les éléments suivants :

1. **Architecture des templates** :

   - Un système basé sur une interface `HtmlTemplate` qui définit la structure commune à tous les templates
   - Un mécanisme d'enregistrement de templates multiples pour permettre des variantes de design
   - Une approche modulaire où chaque section du CV peut être rendue indépendamment

2. **Template par défaut** :

   - Design moderne et minimaliste qui met en valeur les informations clés du CV
   - Structure responsive qui s'adapte à différentes tailles d'écran
   - Styles optimisés pour l'impression avec des sauts de page stratégiques

3. **Moteur de rendu préliminaire** :
   - Utilisation d'un moteur de templating léger pour transformer les données JSON en HTML
   - Mécanisme d'échappement automatique pour éviter les problèmes de sécurité
   - Support des conditions pour gérer les sections optionnelles

## Principes de Développement

#### Principes à Suivre

- **HTML5 Sémantique** : Utiliser des balises HTML5 sémantiques pour une meilleure accessibilité et SEO
- **Design Responsive** : Assurer que le CV s'affiche correctement sur tous les appareils et navigateurs
- **Séparation Contenu/Présentation** : Maintenir une séparation claire entre les données et leur présentation
- **Optimisation pour l'Impression** : Inclure des styles spécifiques pour le rendu optimal à l'impression
- **Accessibilité** : Respecter les normes WCAG pour l'accessibilité du document généré

#### À Éviter

- Une génération de HTML inline ou mal structuré qui serait difficile à maintenir
- Des dépendances externes lourdes pour le rendu qui alourdiraient le fichier généré
- Un couplage fort entre le template et la logique d'application
- Des styles qui ne s'impriment pas correctement ou qui sont incompatibles avec certains navigateurs
- Une génération qui ne gérerait pas correctement les caractères spéciaux ou internationaux

## Risques et Hypothèses

| Risque                                                   | Probabilité | Impact | Mitigation                                                                        |
| -------------------------------------------------------- | ----------- | ------ | --------------------------------------------------------------------------------- |
| Rendu inconsistant entre navigateurs                     | Moyenne     | Élevé  | Tester sur différents navigateurs et utiliser des styles cross-browser            |
| Problèmes d'impression des styles CSS                    | Élevée      | Moyen  | Créer des media queries spécifiques à l'impression et tester exhaustivement       |
| Performance dégradée avec de gros CV                     | Faible      | Moyen  | Optimiser le moteur de rendu et limiter les styles/scripts inclus                 |
| Problèmes d'encodage avec caractères internationaux      | Moyenne     | Élevé  | Utiliser UTF-8 et assurer un échappement correct des caractères spéciaux          |
| Sécurité (XSS) si les données utilisateur sont injectées | Moyenne     | Élevé  | Implémenter un échappement rigoureux de toutes les données injectées dans le HTML |

## Notes de Développement

### Architecture du système de templates HTML

```typescript
// src/core/export/domain/templates/HtmlTemplate.ts
export interface HtmlTemplate {
  /**
   * Identifiant unique du template
   */
  id: string;

  /**
   * Nom d'affichage du template
   */
  name: string;

  /**
   * Description du template
   */
  description: string;

  /**
   * Génère le HTML complet du CV
   * @param resumeData Données du CV au format JSON Resume
   * @returns Le document HTML complet
   */
  render(resumeData: any): string;

  /**
   * Rend une section spécifique du CV
   * @param sectionName Nom de la section (basics, work, education, etc.)
   * @param sectionData Données de la section
   * @returns Fragment HTML pour la section
   */
  renderSection(sectionName: string, sectionData: any): string;
}
```

### Implémentation du template par défaut

```typescript
// src/core/export/infrastructure/templates/DefaultHtmlTemplate.ts
import { HtmlTemplate } from "../../domain/templates/HtmlTemplate";
import { sanitizeHtml } from "../../../shared/utils/sanitizeHtml";

export class DefaultHtmlTemplate implements HtmlTemplate {
  public id = "default";
  public name = "Default Template";
  public description =
    "A clean, professional resume template with a modern design.";

  /**
   * Génère le document HTML complet
   */
  public render(resumeData: any): string {
    const { basics, work, education, skills, ...otherSections } = resumeData;

    // Structure de base du document HTML
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${sanitizeHtml(basics?.name || "Resume")} - CV</title>
        <style>
          ${this.getStyles()}
        </style>
      </head>
      <body>
        <div class="resume-container">
          ${this.renderSection("basics", basics)}
          ${work?.length ? this.renderSection("work", work) : ""}
          ${education?.length ? this.renderSection("education", education) : ""}
          ${skills?.length ? this.renderSection("skills", skills) : ""}
          ${this.renderOtherSections(otherSections)}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Rend une section spécifique
   */
  public renderSection(sectionName: string, sectionData: any): string {
    if (!sectionData) return "";

    switch (sectionName) {
      case "basics":
        return this.renderBasics(sectionData);
      case "work":
        return this.renderWorkExperience(sectionData);
      case "education":
        return this.renderEducation(sectionData);
      case "skills":
        return this.renderSkills(sectionData);
      // Autres sections...
      default:
        return "";
    }
  }

  /**
   * Définit les styles CSS du document
   */
  private getStyles(): string {
    return `
      /* Base styles */
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        background: #fff;
        margin: 0;
        padding: 0;
      }
      
      .resume-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      
      /* Section styles */
      .section {
        margin-bottom: 25px;
        page-break-inside: avoid;
      }
      
      .section-title {
        border-bottom: 2px solid #3498db;
        padding-bottom: 5px;
        margin-bottom: 15px;
        font-size: 1.5em;
        color: #2c3e50;
      }
      
      /* Print styles */
      @media print {
        body {
          font-size: 12pt;
        }
        
        .resume-container {
          width: 100%;
          max-width: none;
          padding: 0;
        }
        
        .section {
          page-break-inside: avoid;
        }
        
        a {
          text-decoration: none;
          color: #333;
        }
      }
    `;
  }

  /**
   * Rend la section basics (informations personnelles)
   */
  private renderBasics(basics: any): string {
    if (!basics) return "";

    const { name, label, email, phone, website, summary, location, profiles } =
      basics;

    return `
      <header class="section" id="basics">
        <h1 class="name">${sanitizeHtml(name || "")}</h1>
        ${label ? `<h2 class="label">${sanitizeHtml(label)}</h2>` : ""}
        
        <div class="contact-info">
          ${
            email
              ? `<div class="email"><strong>Email:</strong> ${sanitizeHtml(
                  email
                )}</div>`
              : ""
          }
          ${
            phone
              ? `<div class="phone"><strong>Phone:</strong> ${sanitizeHtml(
                  phone
                )}</div>`
              : ""
          }
          ${
            website
              ? `<div class="website"><strong>Website:</strong> <a href="${sanitizeHtml(
                  website
                )}">${sanitizeHtml(website)}</a></div>`
              : ""
          }
          ${this.renderLocation(location)}
        </div>
        
        ${summary ? `<div class="summary">${sanitizeHtml(summary)}</div>` : ""}
        ${profiles?.length ? this.renderProfiles(profiles) : ""}
      </header>
    `;
  }

  // Méthodes de rendu pour les autres sections...
}
```

### Service d'exportation HTML

```typescript
// src/core/export/application/services/HtmlExportService.ts
import { HtmlTemplate } from "../../domain/templates/HtmlTemplate";
import { DefaultHtmlTemplate } from "../../infrastructure/templates/DefaultHtmlTemplate";
import type { ResumeInterface } from "@cv-generator/shared/src/types/resume.interface";

export class HtmlExportService {
  private templates: Map<string, HtmlTemplate> = new Map();

  constructor() {
    // Enregistrer le template par défaut
    const defaultTemplate = new DefaultHtmlTemplate();
    this.registerTemplate(defaultTemplate);
  }

  /**
   * Enregistre un nouveau template
   */
  public registerTemplate(template: HtmlTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * Obtient un template par son ID
   */
  public getTemplate(templateId: string): HtmlTemplate {
    const template = this.templates.get(templateId);
    if (!template) {
      // Fallback au template par défaut si l'ID demandé n'existe pas
      return this.templates.get("default")!;
    }
    return template;
  }

  /**
   * Liste tous les templates disponibles
   */
  public getAvailableTemplates(): {
    id: string;
    name: string;
    description: string;
  }[] {
    return Array.from(this.templates.values()).map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
    }));
  }

  /**
   * Exporte un CV au format HTML
   * @param resumeData Données du CV au format JSON Resume
   * @param templateId ID du template à utiliser (utilise le template par défaut si non spécifié)
   * @returns Le document HTML généré
   */
  public exportToHtml(
    resumeData: ResumeInterface,
    templateId: string = "default"
  ): string {
    const template = this.getTemplate(templateId);
    return template.render(resumeData);
  }

  /**
   * Crée un Blob HTML pour le téléchargement
   */
  public createHtmlBlob(
    resumeData: ResumeInterface,
    templateId: string = "default"
  ): Blob {
    const htmlContent = this.exportToHtml(resumeData, templateId);
    return new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  }
}
```

### Intégration dans le repository

```typescript
// Mise à jour de LocalStorageResumeRepository.ts
async export(format: "json" | "pdf" | "html", customResume?: Resume): Promise<Blob> {
  // Si un CV personnalisé est fourni, l'utiliser, sinon charger depuis le stockage
  const resume = customResume || await this.load();

  // Récupérer les données JSON
  const jsonData = resume.toJSON();

  switch (format) {
    case "json":
      // Validation et export JSON...

    case "html":
      // Créer une instance du service d'export HTML
      const htmlExportService = new HtmlExportService();

      try {
        // Générer le Blob HTML
        return htmlExportService.createHtmlBlob(jsonData);
      } catch (error) {
        console.error("HTML export error:", error);
        throw new Error(`Failed to export HTML: ${error instanceof Error ? error.message : String(error)}`);
      }

    case "pdf":
      throw new Error(`Export to ${format} not implemented yet`);
  }
}
```

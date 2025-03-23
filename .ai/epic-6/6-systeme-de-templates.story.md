# Epic-6: CV Export et sauvegarde

Story-6: Système de templates

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** avoir accès à différents templates pour mes exports HTML et PDF  
**afin de** personnaliser l'apparence de mon CV selon mes préférences et le contexte d'utilisation

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. Elle se concentre sur la création d'un système de templates flexible qui permettra aux utilisateurs de choisir différents designs pour leurs CVs exportés en formats HTML et PDF.

Les templates sont essentiels pour permettre aux utilisateurs de créer des CVs adaptés à différents secteurs d'activité, cultures d'entreprise, et préférences personnelles. Cette story s'appuie sur les stories précédentes liées à l'exportation HTML et PDF, et servira de base pour les stories futures concernant la personnalisation des exports et la gestion des templates.

## Estimation

Story Points: 5

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur qui souhaite exporter son CV, quand il accède à l'interface d'exportation, alors il peut choisir parmi plusieurs templates prédéfinis
2. ✅ Étant donné un utilisateur qui a sélectionné un template, quand il prévisualise son CV, alors il voit le rendu avec le template choisi
3. ✅ Étant donné un template sélectionné pour l'export HTML, quand l'utilisateur exporte son CV, alors le fichier HTML généré utilise le template choisi
4. ✅ Étant donné un template sélectionné pour l'export PDF, quand l'utilisateur exporte son CV, alors le fichier PDF généré utilise le template choisi
5. ✅ Étant donné l'ajout d'un nouveau template dans le système, quand un utilisateur accède à l'interface d'exportation, alors le nouveau template est disponible sans nécessiter de modification du code de l'application
6. ✅ Étant donné différents templates, quand ils sont utilisés, alors ils garantissent tous une mise en page correcte et une expérience utilisateur cohérente

## Tâches

1. - [ ] Concevoir l'architecture du système de templates

   1. - [ ] Définir la structure des templates (HTML, CSS, assets)
   2. - [ ] Établir les conventions de nommage et l'organisation des fichiers
   3. - [ ] Créer un système de découverte automatique des templates disponibles

2. - [ ] Développer le moteur de rendu des templates

   1. - [ ] Implémenter un service de rendu de templates HTML
   2. - [ ] Créer un système d'injection de données dans les templates
   3. - [ ] Mettre en place un mécanisme de prévisualisation rapide des templates

3. - [ ] Créer des templates initiaux

   1. - [ ] Développer un template "Modern" avec un design contemporain
   2. - [ ] Développer un template "Classic" avec un design traditionnel
   3. - [ ] Développer un template "Minimal" avec un design épuré
   4. - [ ] Assurer la responsivité de tous les templates

4. - [ ] Intégrer la sélection de templates dans l'interface d'exportation

   1. - [ ] Modifier l'interface d'exportation pour inclure la sélection de templates
   2. - [ ] Implémenter la prévisualisation miniature des templates
   3. - [ ] Ajouter des métadonnées descriptives pour chaque template

5. - [ ] Connecter les templates aux services d'exportation HTML et PDF
   1. - [ ] Adapter le service d'exportation HTML pour utiliser le template sélectionné
   2. - [ ] Adapter le service d'exportation PDF pour utiliser le template sélectionné
   3. - [ ] Tester la génération de fichiers avec différents templates

## Avancement

### 2024-05-20 - Conception de l'architecture du système de templates

Nous avons élaboré l'architecture du système de templates avec les caractéristiques suivantes :

1. **Structure des templates** :

   - Chaque template est un dossier autonome avec sa propre structure
   - Contient des fichiers HTML, CSS et éventuellement JavaScript
   - Inclut des métadonnées (nom, description, miniature, auteur)
   - Possibilité d'avoir des assets spécifiques (images, polices)

2. **Organisation** :

   ```
   templates/
   ├── modern/
   │   ├── template.html
   │   ├── styles.css
   │   ├── preview.png
   │   └── metadata.json
   ├── classic/
   │   ├── template.html
   │   ├── styles.css
   │   ├── preview.png
   │   └── metadata.json
   └── minimal/
       ├── template.html
       ├── styles.css
       ├── preview.png
       └── metadata.json
   ```

3. **Découverte automatique** :
   - Scan du répertoire `templates/` au démarrage de l'application
   - Chargement des métadonnées de chaque template
   - Validation de la structure et des fichiers requis

## Principes de Développement

#### Principes à Suivre

- **Séparation des préoccupations** : Strict découplage entre les données du CV et sa présentation
- **Extensibilité** : Architecture permettant d'ajouter facilement de nouveaux templates
- **Réutilisabilité** : Composants communs partagés entre les templates
- **Qualité visuelle** : Templates professionnels avec une typographie et une mise en page soignées
- **Accessibilité** : Templates conformes aux normes d'accessibilité web

#### À Éviter

- Couplage fort entre les données et la présentation
- Duplication excessive de code entre les templates
- Styles ou scripts qui pourraient interférer avec l'application principale
- Performance dégradée due à des ressources trop lourdes (images, polices, etc.)
- Dépendances externes qui pourraient poser des problèmes de maintenance

## Risques et Hypothèses

| Risque                                                | Probabilité | Impact | Mitigation                                                      |
| ----------------------------------------------------- | ----------- | ------ | --------------------------------------------------------------- |
| Complexité de maintenance avec multiple templates     | Moyenne     | Élevé  | Mettre en place des tests automatisés et des guides de style    |
| Problèmes de rendu sur certains navigateurs           | Moyenne     | Moyen  | Utiliser des approches CSS compatibles et tester extensivement  |
| Performance réduite avec des templates complexes      | Basse       | Moyen  | Optimiser les ressources et limiter la complexité des templates |
| Difficultés d'internationalisation des templates      | Moyenne     | Moyen  | Concevoir les templates avec l'i18n en tête dès le départ       |
| Conflits de style lors de l'intégration des templates | Moyenne     | Élevé  | Isoler les styles des templates dans des contextes spécifiques  |

## Notes de Développement

### Service de gestion des templates

```typescript
// src/export/infrastructure/services/TemplateManager.ts
import { readdir, readFile } from "fs/promises";
import path from "path";

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  previewImage: string;
  tags: string[];
}

export class TemplateManager {
  private templates: Map<string, TemplateMetadata> = new Map();
  private templatesDir: string;

  constructor(templatesDir: string) {
    this.templatesDir = templatesDir;
  }

  /**
   * Charge tous les templates disponibles
   */
  public async loadTemplates(): Promise<void> {
    try {
      const templateDirs = await readdir(this.templatesDir, {
        withFileTypes: true,
      });

      for (const dir of templateDirs.filter((dirent) => dirent.isDirectory())) {
        try {
          const templatePath = path.join(this.templatesDir, dir.name);
          const metadataPath = path.join(templatePath, "metadata.json");

          const metadataContent = await readFile(metadataPath, "utf-8");
          const metadata = JSON.parse(metadataContent) as TemplateMetadata;

          // Validation rapide
          if (!this.validateTemplate(templatePath, metadata)) {
            console.warn(`Template "${dir.name}" is invalid or incomplete`);
            continue;
          }

          metadata.id = dir.name;
          this.templates.set(dir.name, metadata);
          console.log(`Loaded template: ${metadata.name}`);
        } catch (error) {
          console.error(`Error loading template "${dir.name}":`, error);
        }
      }

      console.log(`Loaded ${this.templates.size} templates`);
    } catch (error) {
      console.error("Error loading templates:", error);
      throw new Error("Failed to load templates");
    }
  }

  /**
   * Récupère tous les templates disponibles
   */
  public getAllTemplates(): TemplateMetadata[] {
    return Array.from(this.templates.values());
  }

  /**
   * Récupère un template par son ID
   */
  public getTemplate(id: string): TemplateMetadata | undefined {
    return this.templates.get(id);
  }

  /**
   * Récupère le contenu HTML d'un template
   */
  public async getTemplateHtml(id: string): Promise<string> {
    if (!this.templates.has(id)) {
      throw new Error(`Template "${id}" not found`);
    }

    try {
      const templatePath = path.join(this.templatesDir, id, "template.html");
      return await readFile(templatePath, "utf-8");
    } catch (error) {
      console.error(`Error reading template HTML for "${id}":`, error);
      throw new Error(`Failed to read template HTML for "${id}"`);
    }
  }

  /**
   * Récupère le contenu CSS d'un template
   */
  public async getTemplateCss(id: string): Promise<string> {
    if (!this.templates.has(id)) {
      throw new Error(`Template "${id}" not found`);
    }

    try {
      const cssPath = path.join(this.templatesDir, id, "styles.css");
      return await readFile(cssPath, "utf-8");
    } catch (error) {
      console.error(`Error reading template CSS for "${id}":`, error);
      throw new Error(`Failed to read template CSS for "${id}"`);
    }
  }

  /**
   * Valide qu'un template contient tous les fichiers requis
   */
  private validateTemplate(
    templatePath: string,
    metadata: TemplateMetadata
  ): boolean {
    // Cette validation serait plus complète dans une implémentation réelle
    const requiredFiles = ["template.html", "styles.css", "preview.png"];
    const requiredMetadataFields = ["name", "description", "author", "version"];

    // Vérifier les champs de métadonnées
    for (const field of requiredMetadataFields) {
      if (!metadata[field as keyof TemplateMetadata]) {
        return false;
      }
    }

    // Note: Dans une implémentation réelle, nous vérifierions également
    // l'existence des fichiers requis sur le système de fichiers

    return true;
  }
}
```

### Service de rendu de template

```typescript
// src/export/infrastructure/services/TemplateRenderer.ts
import { TemplateManager } from "./TemplateManager";
import { Resume } from "@/cv/domain/entities/Resume";

export class TemplateRenderer {
  private templateManager: TemplateManager;

  constructor(templateManager: TemplateManager) {
    this.templateManager = templateManager;
  }

  /**
   * Rend un CV en utilisant le template spécifié
   */
  public async renderResumeWithTemplate(
    resume: Resume,
    templateId: string
  ): Promise<string> {
    try {
      // Récupérer le contenu du template
      const templateHtml = await this.templateManager.getTemplateHtml(
        templateId
      );
      const templateCss = await this.templateManager.getTemplateCss(templateId);

      // Convertir les données du CV en JSON pour l'injection
      const resumeData = resume.toJSON();

      // Préparer les données formatées pour le template
      const formattedData = this.formatDataForTemplate(resumeData);

      // Injecter les données dans le template
      let rendered = this.injectDataIntoTemplate(templateHtml, formattedData);

      // Injecter le CSS
      rendered = this.injectCssIntoTemplate(rendered, templateCss);

      return rendered;
    } catch (error) {
      console.error(
        `Error rendering resume with template "${templateId}":`,
        error
      );
      throw new Error(`Failed to render resume with template "${templateId}"`);
    }
  }

  /**
   * Formate les données du CV pour le template
   */
  private formatDataForTemplate(resumeData: any): any {
    // Dans une implémentation réelle, cette méthode pourrait transformer
    // les données brutes du CV en un format plus adapté au template

    // Par exemple, formater les dates, combiner certains champs, etc.
    return {
      ...resumeData,
      formattedDate: new Date().toLocaleDateString(),
      // Autres transformations...
    };
  }

  /**
   * Injecte les données dans le template HTML
   */
  private injectDataIntoTemplate(templateHtml: string, data: any): string {
    // Cette implémentation est simplifiée. Dans un cas réel,
    // nous utiliserions un moteur de templates comme Handlebars ou Mustache

    let rendered = templateHtml;

    // Remplacer les placeholders par les valeurs réelles
    // Par exemple: {{basics.name}} -> "John Doe"
    const placeholderRegex = /\{\{([^}]+)\}\}/g;

    rendered = rendered.replace(placeholderRegex, (match, path) => {
      const value = this.getValueByPath(data, path.trim());
      return value !== undefined ? value : "";
    });

    return rendered;
  }

  /**
   * Injecte le CSS dans le template HTML
   */
  private injectCssIntoTemplate(html: string, css: string): string {
    // Injecter le CSS dans la balise <head>
    return html.replace("</head>", `<style>${css}</style></head>`);
  }

  /**
   * Récupère une valeur dans un objet à partir d'un chemin (ex: "basics.name")
   */
  private getValueByPath(obj: any, path: string): any {
    return path.split(".").reduce((prev, curr) => {
      return prev ? prev[curr] : undefined;
    }, obj);
  }
}
```

### Composant de sélection de template

```vue
<!-- src/ui/components/export/TemplateSelector.vue -->
<template>
  <div class="template-selector">
    <h3 class="template-selector__title">
      {{ $t("ui.export.selectTemplate") }}
    </h3>

    <div class="template-selector__grid">
      <div
        v-for="template in templates"
        :key="template.id"
        class="template-card"
        :class="{ 'is-selected': selectedTemplateId === template.id }"
        @click="selectTemplate(template.id)"
      >
        <div class="template-card__preview">
          <img :src="template.previewImage" :alt="template.name" />
        </div>

        <div class="template-card__info">
          <h4 class="template-card__name">{{ template.name }}</h4>
          <p class="template-card__description">{{ template.description }}</p>

          <div class="template-card__tags">
            <span
              v-for="tag in template.tags"
              :key="tag"
              class="template-card__tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTemplates } from "@/composables/useTemplates";
import type { TemplateMetadata } from "@/export/infrastructure/services/TemplateManager";

const props = defineProps<{
  initialValue?: string;
}>();

const emit = defineEmits<{
  (e: "update:template", templateId: string): void;
}>();

const { getAllTemplates } = useTemplates();

const templates = ref<TemplateMetadata[]>([]);
const selectedTemplateId = ref(props.initialValue || "");

onMounted(async () => {
  try {
    templates.value = await getAllTemplates();

    // Si aucun template n'est sélectionné et qu'il y a des templates disponibles,
    // sélectionner le premier par défaut
    if (!selectedTemplateId.value && templates.value.length > 0) {
      selectTemplate(templates.value[0].id);
    }
  } catch (error) {
    console.error("Error loading templates:", error);
  }
});

function selectTemplate(templateId: string) {
  selectedTemplateId.value = templateId;
  emit("update:template", templateId);
}
</script>

<style lang="scss" scoped>
.template-selector {
  margin-bottom: 1.5rem;

  &__title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}

.template-card {
  border: 2px solid var(--color-neutral-200);
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &.is-selected {
    border-color: var(--color-primary-500);
    box-shadow: 0 0 0 2px var(--color-primary-200);
  }

  &__preview {
    height: 150px;
    overflow: hidden;
    border-bottom: 1px solid var(--color-neutral-200);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    padding: 0.75rem;
  }

  &__name {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  &__description {
    font-size: 0.75rem;
    color: var(--color-neutral-600);
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  &__tag {
    font-size: 0.625rem;
    background-color: var(--color-neutral-100);
    color: var(--color-neutral-700);
    padding: 0.125rem 0.375rem;
    border-radius: 1rem;
  }
}

/* Responsive styles */
@media (max-width: 640px) {
  .template-selector__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
```

### Exemple de template HTML "Modern"

```html
<!-- templates/modern/template.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{basics.name}} - CV</title>
    <!-- Le CSS sera injecté ici -->
  </head>
  <body>
    <div class="resume-container">
      <header class="resume-header">
        <div class="resume-header__profile">
          {{#if basics.image}}
          <div class="resume-header__avatar">
            <img src="{{basics.image}}" alt="{{basics.name}}" />
          </div>
          {{/if}}

          <div class="resume-header__info">
            <h1 class="resume-header__name">{{basics.name}}</h1>
            <p class="resume-header__label">{{basics.label}}</p>

            <div class="resume-header__contact">
              {{#if basics.email}}
              <div class="contact-item">
                <span class="contact-item__icon">✉️</span>
                <a href="mailto:{{basics.email}}">{{basics.email}}</a>
              </div>
              {{/if}} {{#if basics.phone}}
              <div class="contact-item">
                <span class="contact-item__icon">📱</span>
                <a href="tel:{{basics.phone}}">{{basics.phone}}</a>
              </div>
              {{/if}} {{#if basics.url}}
              <div class="contact-item">
                <span class="contact-item__icon">🌐</span>
                <a href="{{basics.url}}" target="_blank">{{basics.url}}</a>
              </div>
              {{/if}}
            </div>
          </div>
        </div>

        {{#if basics.summary}}
        <div class="resume-header__summary">
          <p>{{basics.summary}}</p>
        </div>
        {{/if}}
      </header>

      <div class="resume-body">
        <div class="resume-main">
          {{#if work.length}}
          <section class="resume-section">
            <h2 class="resume-section__title">Work Experience</h2>

            <div class="resume-timeline">
              {{#each work}}
              <div class="timeline-item">
                <div class="timeline-item__header">
                  <h3 class="timeline-item__title">{{position}}</h3>
                  <p class="timeline-item__subtitle">{{company}}</p>
                  <p class="timeline-item__date">
                    {{startDate}} - {{#if
                    endDate}}{{endDate}}{{else}}Present{{/if}}
                  </p>
                </div>

                <div class="timeline-item__content">
                  <p>{{summary}}</p>

                  {{#if highlights.length}}
                  <ul class="timeline-item__highlights">
                    {{#each highlights}}
                    <li>{{this}}</li>
                    {{/each}}
                  </ul>
                  {{/if}}
                </div>
              </div>
              {{/each}}
            </div>
          </section>
          {{/if}} {{#if education.length}}
          <section class="resume-section">
            <h2 class="resume-section__title">Education</h2>

            <div class="resume-timeline">
              {{#each education}}
              <div class="timeline-item">
                <div class="timeline-item__header">
                  <h3 class="timeline-item__title">{{studyType}} {{area}}</h3>
                  <p class="timeline-item__subtitle">{{institution}}</p>
                  <p class="timeline-item__date">
                    {{startDate}} - {{#if
                    endDate}}{{endDate}}{{else}}Present{{/if}}
                  </p>
                </div>

                <div class="timeline-item__content">
                  {{#if gpa}}
                  <p>GPA: {{gpa}}</p>
                  {{/if}} {{#if courses.length}}
                  <div class="timeline-item__courses">
                    <h4>Courses</h4>
                    <ul>
                      {{#each courses}}
                      <li>{{this}}</li>
                      {{/each}}
                    </ul>
                  </div>
                  {{/if}}
                </div>
              </div>
              {{/each}}
            </div>
          </section>
          {{/if}}

          <!-- Autres sections comme Projects, Volunteer, etc. -->
        </div>

        <div class="resume-sidebar">
          {{#if skills.length}}
          <section class="resume-section">
            <h2 class="resume-section__title">Skills</h2>

            <div class="skills-container">
              {{#each skills}}
              <div class="skill-group">
                <h3 class="skill-group__name">{{name}}</h3>

                <div class="skill-group__items">
                  {{#each keywords}}
                  <span class="skill-tag">{{this}}</span>
                  {{/each}}
                </div>
              </div>
              {{/each}}
            </div>
          </section>
          {{/if}} {{#if languages.length}}
          <section class="resume-section">
            <h2 class="resume-section__title">Languages</h2>

            <ul class="languages-list">
              {{#each languages}}
              <li class="language-item">
                <span class="language-item__name">{{language}}</span>
                <span class="language-item__level">{{fluency}}</span>
              </li>
              {{/each}}
            </ul>
          </section>
          {{/if}} {{#if interests.length}}
          <section class="resume-section">
            <h2 class="resume-section__title">Interests</h2>

            <div class="interests-container">
              {{#each interests}}
              <div class="interest-group">
                <h3 class="interest-group__name">{{name}}</h3>

                <div class="interest-group__items">
                  {{#each keywords}}
                  <span class="interest-tag">{{this}}</span>
                  {{/each}}
                </div>
              </div>
              {{/each}}
            </div>
          </section>
          {{/if}}
        </div>
      </div>

      <footer class="resume-footer">
        <p>Generated with CV Generator on {{formattedDate}}</p>

        {{#if basics.profiles.length}}
        <div class="social-links">
          {{#each basics.profiles}}
          <a href="{{url}}" target="_blank" class="social-link">{{network}}</a>
          {{/each}}
        </div>
        {{/if}}
      </footer>
    </div>
  </body>
</html>
```

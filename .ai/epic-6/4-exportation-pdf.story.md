# Epic-6: CV Export et sauvegarde

Story-4: Exportation PDF

## Description de la Story

**En tant qu'** utilisateur du CV Generator  
**Je veux** pouvoir exporter mon CV au format PDF  
**afin de** le partager facilement avec des recruteurs et l'utiliser pour mes candidatures

## Statut

À faire

## Contexte

Cette story fait partie de l'Epic-6 qui vise à implémenter les fonctionnalités d'exportation et de sauvegarde du CV. Dans la continuité des stories précédentes, elle se concentre sur l'implémentation de l'exportation au format PDF, qui est définie dans la classe `ExportFormat` mais pas encore implémentée dans `LocalStorageResumeRepository`.

L'export PDF est essentiel car c'est le format le plus couramment utilisé pour envoyer un CV à des recruteurs. Ce format garantit que le document sera visualisé exactement comme il a été conçu, indépendamment du système ou du logiciel utilisé pour l'ouvrir. Cette fonctionnalité s'appuiera sur le système de templates HTML développé dans la Story-3, en ajoutant les capacités de conversion HTML vers PDF.

Cette story s'appuie sur l'interface unifiée d'exportation développée dans la Story-1, sur la validation JSON Resume implémentée dans la Story-2, et sur le système de templates HTML de la Story-3.

## Estimation

Story Points: 3

## Critères d'Acceptation

1. ✅ Étant donné un utilisateur avec un CV complet, quand il sélectionne l'export PDF, alors un fichier PDF est généré et proposé au téléchargement
2. ✅ Étant donné un fichier PDF exporté, quand l'utilisateur l'ouvre, alors le CV s'affiche correctement avec une mise en page professionnelle
3. ✅ Étant donné un export PDF, quand on l'examine, alors le document respecte les standards PDF et contient du texte sélectionnable (pas une image)
4. ✅ Étant donné un export PDF, quand il est imprimé, alors la mise en page est optimisée pour l'impression papier
5. ✅ Étant donné un utilisateur qui possède un CV avec des sections incomplètes, quand il exporte en PDF, alors seules les sections complétées sont incluses dans l'export
6. ✅ Étant donné un export PDF, quand il est ouvert sur différentes plateformes (Windows, Mac, Linux, mobile), alors l'affichage est cohérent

## Tâches

1. - [ ] Évaluer et intégrer une bibliothèque de génération PDF

   1. - [ ] Rechercher et comparer les bibliothèques JavaScript/TypeScript pour la génération PDF
   2. - [ ] Tester les performances et la compatibilité des solutions envisagées
   3. - [ ] Intégrer la bibliothèque choisie dans le projet

2. - [ ] Développer le service de conversion HTML vers PDF

   1. - [ ] Créer un service qui utilise la bibliothèque PDF sélectionnée
   2. - [ ] Adapter le système de templates HTML pour une conversion optimale vers PDF
   3. - [ ] Gérer les spécificités du format PDF (pagination, en-têtes, pieds de page)

3. - [ ] Optimiser le rendu PDF

   1. - [ ] Améliorer la mise en page pour une expérience optimale sur format PDF
   2. - [ ] Ajuster les styles et la typographie pour une meilleure lisibilité
   3. - [ ] Configurer les métadonnées du document PDF (auteur, titre, mots-clés)

4. - [ ] Mettre en œuvre l'exportation PDF

   1. - [ ] Compléter la méthode d'export dans `LocalStorageResumeRepository`
   2. - [ ] Intégrer le service de conversion dans le processus d'exportation
   3. - [ ] Implémenter la génération et le téléchargement du fichier PDF

5. - [ ] Tester l'exportation PDF
   1. - [ ] Créer des tests unitaires pour le service de conversion
   2. - [ ] Développer des tests d'intégration pour l'export complet
   3. - [ ] Valider la qualité et la conformité du PDF sur différentes plateformes

## Avancement

### 2024-05-20 - Recherche et sélection de bibliothèques PDF

Nous avons effectué une recherche approfondie sur les bibliothèques de génération PDF en JavaScript/TypeScript et avons identifié les options suivantes :

1. **Bibliothèques évaluées** :

   - **jsPDF** : Bibliothèque légère pour générer des PDF côté client
   - **PDF.js** : Bibliothèque de Mozilla pour l'affichage et la manipulation de PDF
   - **html2pdf.js** : Solution spécialisée dans la conversion HTML vers PDF
   - **Puppeteer** : Outil d'automatisation de navigateur pouvant générer des PDF à partir de HTML

2. **Critères d'évaluation** :

   - Facilité d'intégration dans notre architecture
   - Performance et taille du bundle
   - Qualité du rendu et fidélité de la conversion HTML vers PDF
   - Support de fonctionnalités avancées (liens cliquables, métadonnées, etc.)
   - Licence et coût

3. **Conclusion préliminaire** :
   - **html2pdf.js** semble être la solution la plus adaptée pour notre cas d'usage, offrant un bon équilibre entre facilité d'utilisation et qualité du rendu
   - Cette bibliothèque s'intègre bien avec notre système de templates HTML existant
   - Elle peut fonctionner entièrement côté client, ce qui est cohérent avec notre architecture actuelle

## Principes de Développement

#### Principes à Suivre

- **Qualité du Rendu** : Assurer que le PDF généré est visuellement professionnel et bien structuré
- **Performance** : Optimiser le processus de génération pour minimiser le temps d'attente
- **Accessibilité** : Créer des PDF accessibles avec du texte sélectionnable et une structure logique
- **Compatibilité** : Garantir que les PDF générés s'affichent correctement sur différentes plateformes
- **Architecture Propre** : Maintenir une séparation claire entre la logique d'application et la génération PDF

#### À Éviter

- Une dépendance excessive à des bibliothèques externes trop lourdes
- Des temps de génération trop longs qui dégraderaient l'expérience utilisateur
- Une conversion qui perdrait les styles ou la mise en forme du CV
- Des dépendances sur des services tiers pour la génération PDF
- Des PDF de trop grande taille difficiles à partager par email

## Risques et Hypothèses

| Risque                                            | Probabilité | Impact | Mitigation                                                                  |
| ------------------------------------------------- | ----------- | ------ | --------------------------------------------------------------------------- |
| Performance lente de génération PDF côté client   | Élevée      | Moyen  | Optimiser le code et envisager des techniques de génération asynchrone      |
| Incohérences de rendu entre HTML et PDF           | Moyenne     | Élevé  | Tester exhaustivement et ajuster les templates pour une conversion optimale |
| Problèmes avec les polices et caractères spéciaux | Moyenne     | Moyen  | Utiliser des polices web sûres et tester avec différents jeux de caractères |
| Taille excessive des fichiers PDF générés         | Faible      | Moyen  | Optimiser les images et ressources incluses dans le PDF                     |
| Incompatibilité avec certains lecteurs PDF        | Faible      | Élevé  | Tester avec une variété de lecteurs PDF et respecter les standards          |

## Notes de Développement

### Service de conversion HTML vers PDF

```typescript
// src/core/export/application/services/PdfExportService.ts
import { html2pdf } from "html2pdf.js";
import { HtmlExportService } from "./HtmlExportService";
import type { ResumeInterface } from "@cv-generator/shared/src/types/resume.interface";

export class PdfExportService {
  private htmlExportService: HtmlExportService;

  constructor(htmlExportService?: HtmlExportService) {
    this.htmlExportService = htmlExportService || new HtmlExportService();
  }

  /**
   * Convertit les données du CV en PDF en utilisant le template HTML spécifié
   * @param resumeData Données du CV au format JSON Resume
   * @param templateId ID du template HTML à utiliser (utilise le template par défaut si non spécifié)
   * @returns Promise qui résout avec un Blob PDF
   */
  public async exportToPdf(
    resumeData: ResumeInterface,
    templateId: string = "default"
  ): Promise<Blob> {
    // Générer d'abord le HTML en utilisant le service HTML existant
    const htmlContent = this.htmlExportService.exportToHtml(
      resumeData,
      templateId
    );

    try {
      // Créer un élément DOM temporaire pour le HTML
      const container = document.createElement("div");
      container.innerHTML = htmlContent;
      document.body.appendChild(container);

      // Configurer les options de html2pdf
      const options = {
        margin: 10,
        filename: `resume-${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      // Générer le PDF
      const pdfBlob = await html2pdf()
        .set(options)
        .from(container)
        .outputPdf("blob");

      // Nettoyer le DOM
      document.body.removeChild(container);

      return pdfBlob;
    } catch (error) {
      console.error("PDF generation error:", error);
      throw new Error(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Ajoute des métadonnées au document PDF
   * @param pdfDoc Document PDF généré
   * @param resumeData Données du CV
   */
  private addMetadata(pdfDoc: any, resumeData: ResumeInterface): void {
    const { basics } = resumeData;

    if (pdfDoc && pdfDoc.setProperties) {
      pdfDoc.setProperties({
        title: `Resume - ${basics?.name || "Unnamed"}`,
        subject: "Professional Resume",
        author: basics?.name || "CV Generator User",
        keywords: "resume, cv, professional, job application",
        creator: "CV Generator Application",
      });
    }
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
      // Export HTML...

    case "pdf":
      try {
        // Créer les services nécessaires
        const htmlExportService = new HtmlExportService();
        const pdfExportService = new PdfExportService(htmlExportService);

        // Générer le PDF
        return await pdfExportService.exportToPdf(jsonData);
      } catch (error) {
        console.error("PDF export error:", error);
        throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : String(error)}`);
      }
  }
}
```

### Optimisations pour l'export PDF

Pour améliorer la qualité du rendu PDF, nous ajouterons des styles spécifiques au format PDF dans nos templates HTML :

```css
/* Styles spécifiques pour le PDF */
@media print {
  /* Règles de pagination */
  .page-break-after {
    page-break-after: always;
  }

  .avoid-break-inside {
    page-break-inside: avoid;
  }

  /* Ajustements de taille et marges */
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 15mm;
    font-size: 11pt;
  }

  /* En-têtes et pieds de page */
  @page {
    margin: 15mm;
    size: A4;
  }

  @page :first {
    margin-top: 20mm;
  }

  /* Optimisations visuelles */
  a {
    text-decoration: none;
    color: #000;
  }

  .section {
    margin-bottom: 10mm;
  }

  .work-item,
  .education-item {
    margin-bottom: 5mm;
  }
}
```

### Tests d'intégration

Nous créerons des tests spécifiques pour valider la génération PDF :

```typescript
// __tests__/PdfExportService.spec.ts
describe("PdfExportService", () => {
  it("should generate a PDF blob from resume data", async () => {
    // Simuler des données de CV
    const mockResumeData = {
      /* ... */
    };

    // Créer le service
    const htmlExportService = new HtmlExportService();
    const pdfExportService = new PdfExportService(htmlExportService);

    // Générer le PDF
    const pdfBlob = await pdfExportService.exportToPdf(mockResumeData);

    // Vérifier le type et les propriétés du blob
    expect(pdfBlob).toBeInstanceOf(Blob);
    expect(pdfBlob.type).toBe("application/pdf");
    expect(pdfBlob.size).toBeGreaterThan(0);
  });

  // Autres tests...
});
```

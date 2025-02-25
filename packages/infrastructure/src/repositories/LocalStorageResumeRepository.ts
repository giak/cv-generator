import { Resume, type ResumeRepository } from "@cv-generator/core";
import type { ResumeInterface } from "@cv-generator/shared/src/types/resume.interface";
import { z } from "zod";

const STORAGE_KEY = "cv-generator-resume";

// Schéma de validation pour l'infrastructure 
// Ce schéma garantit que les données stockées sont valides selon les contraintes de stockage
const resumeStorageSchema = z.object({
  basics: z.object({
    name: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Format email invalide"),
    label: z.string().optional(),
    phone: z.string().optional(),
    summary: z.string().optional(),
    location: z.object({
      address: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      region: z.string().optional()
    }).optional(),
    profiles: z.array(z.object({
      network: z.string(),
      username: z.string(),
      url: z.string().url("Format URL invalide")
    })).optional().default([])
  }),
  work: z.array(z.object({
    name: z.string(),
    position: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    summary: z.string().optional()
  })).optional().default([]),
  education: z.array(z.object({
    institution: z.string(),
    area: z.string(),
    studyType: z.string(),
    startDate: z.string(),
    endDate: z.string().optional()
  })).optional().default([]),
  skills: z.array(z.object({
    name: z.string(),
    level: z.string().optional(),
    keywords: z.array(z.string()).optional()
  })).optional().default([])
});

// Classes d'erreur spécifiques pour le stockage
export class StorageValidationError extends Error {
  constructor(public readonly errors: string[]) {
    super(`Storage validation failed: ${errors.join(", ")}`);
    this.name = "StorageValidationError";
  }
}

export class StorageError extends Error {
  constructor(error: unknown) {
    super(error instanceof Error ? error.message : "Storage operation failed");
    this.name = "StorageError";
  }
}

const EMPTY_RESUME = {
  basics: {
    name: "",
    email: "",
    label: "",
    phone: "",
    summary: "",
    location: {
      address: "",
      postalCode: "",
      city: "",
      region: ""
    },
    profiles: []
  },
  work: [],
  education: [],
  skills: []
};

export class LocalStorageResumeRepository implements ResumeRepository {
  constructor() {
    // Initialisation du localStorage si on est dans un environnement de test
    if (typeof window === "undefined" && process.env.NODE_ENV === "test") {
      const mockStorage = new Map<string, string>();
      global.localStorage = {
        getItem(key: string) {
          return mockStorage.get(key) || null;
        },
        setItem(key: string, value: string) {
          mockStorage.set(key, value);
        },
        removeItem(key: string) {
          mockStorage.delete(key);
        },
        clear() {
          mockStorage.clear();
        },
        key(index: number): string | null {
          return Array.from(mockStorage.keys())[index] || null;
        },
        get length() {
          return mockStorage.size;
        },
      };
    }
  }

  /**
   * Valide les données du CV contre le schéma de stockage
   * @param data Les données à valider
   * @throws StorageValidationError si les données sont invalides
   */
  private validateSchema(data: unknown): void {
    const validationResult = resumeStorageSchema.safeParse(data);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => 
        `${err.path.join(".")}: ${err.message}`
      );
      throw new StorageValidationError(errors);
    }
  }

  async save(resume: Resume): Promise<void> {
    console.log('=== [LocalStorage] save ===');
    console.log('[LocalStorage] Received resume instance:', resume);
    
    try {
      // Convertir l'instance Resume en objet JSON
      const jsonData = resume.toJSON();
      console.log('[LocalStorage] Converted to JSON:', jsonData);
      
      // Valider les données avant la sauvegarde
      this.validateSchema(jsonData);
      console.log('[LocalStorage] Data validation passed');
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonData));
      console.log('[LocalStorage] Saved successfully');
    } catch (error) {
      console.error('[LocalStorage] Error saving:', error);
      
      if (error instanceof StorageValidationError) {
        throw error;
      }
      
      throw new StorageError(error);
    }
  }

  async load(): Promise<Resume> {
    console.log('=== [LocalStorage] load ===');
    
    try {
      // Récupérer les données du localStorage
      const data = localStorage.getItem(STORAGE_KEY);
      console.log('[LocalStorage] Raw data:', data);
      
      // Si pas de données, retourner un CV vide
      if (!data) {
        console.log('[LocalStorage] No data found, creating empty resume');
        const result = Resume.create(EMPTY_RESUME);
        console.log('[LocalStorage] Empty resume created:', result);
        return result.resume!;
      }

      // Parser les données
      const parsed = JSON.parse(data);
      console.log('[LocalStorage] Parsed data:', parsed);
      
      // Valider les données contre le schéma de stockage
      this.validateSchema(parsed);
      console.log('[LocalStorage] Storage validation passed');
      
      // Créer une instance de Resume (qui valide également au niveau du domaine)
      const result = Resume.create(parsed);
      console.log('[LocalStorage] Resume instance created:', result);
      
      if (!result.isValid || !result.resume) {
        throw new Error(`Failed to create Resume instance: ${result.errors?.join(", ")}`);
      }
      
      return result.resume;
    } catch (error) {
      console.error('[LocalStorage] Error loading:', error);
      
      if (error instanceof SyntaxError) {
        throw new StorageError(new Error('Invalid JSON format in storage'));
      }
      
      throw error;
    }
  }

  async export(format: "json" | "pdf" | "html", customResume?: Resume): Promise<Blob> {
    // Si un CV personnalisé est fourni, l'utiliser, sinon charger depuis le stockage
    const resume = customResume || await this.load();
    
    // Récupérer les données JSON et valider avant l'export
    const jsonData = resume.toJSON();
    this.validateSchema(jsonData);
    
    switch (format) {
      case "json":
        return new Blob([JSON.stringify(jsonData, null, 2)], {
          type: "application/json",
        });
      case "pdf":
      case "html":
        throw new Error(`Export to ${format} not implemented yet`);
    }
  }

  async import(file: Blob): Promise<Resume> {
    try {
      // Lire le contenu du fichier
      const text = await file.text();
      
      // Parser les données JSON
      const data = JSON.parse(text);
      
      // Validation au niveau infrastructure
      this.validateSchema(data);
      
      // Création de l'entité (validation au niveau domaine)
      const result = Resume.create(data);

      if (!result.isValid || !result.resume) {
        throw new StorageValidationError(result.errors || ['Invalid resume data']);
      }

      // Sauvegarder dans le localStorage
      await this.save(result.resume);
      return result.resume;
    } catch (error) {
      console.error('[LocalStorage] Import error:', error);
      
      if (error instanceof SyntaxError) {
        throw new StorageError(new Error('Invalid JSON format'));
      }
      
      throw error;
    }
  }
}

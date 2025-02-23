import { Resume, type ResumeRepository } from "@cv-generator/core";

const STORAGE_KEY = "cv-generator-resume";

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

  async save(resume: Resume): Promise<void> {
    console.log('=== [LocalStorage] save ===')
    console.log('[LocalStorage] Received resume instance:', resume)
    
    try {
      // Convertir l'instance Resume en objet JSON
      const jsonData = resume.toJSON()
      console.log('[LocalStorage] Converted to JSON:', jsonData)
      
      // Sauvegarder dans le localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonData))
      console.log('[LocalStorage] Saved successfully')
    } catch (error) {
      console.error('[LocalStorage] Error saving:', error)
      throw error
    }
  }

  async load(): Promise<Resume> {
    console.log('=== [LocalStorage] load ===')
    
    try {
      // Récupérer les données du localStorage
      const data = localStorage.getItem(STORAGE_KEY)
      console.log('[LocalStorage] Raw data:', data)
      
      // Si pas de données, retourner un CV vide
      if (!data) {
        console.log('[LocalStorage] No data found, creating empty resume')
        const result = Resume.create(EMPTY_RESUME)
        console.log('[LocalStorage] Empty resume created:', result)
        return result.resume!
      }

      // Parser les données et créer une instance Resume
      const parsed = JSON.parse(data)
      console.log('[LocalStorage] Parsed data:', parsed)
      
      const result = Resume.create(parsed)
      console.log('[LocalStorage] Resume instance created:', result)
      
      if (!result.resume) {
        throw new Error('Failed to create Resume instance')
      }
      
      return result.resume
    } catch (error) {
      console.error('[LocalStorage] Error loading:', error)
      throw error
    }
  }

  async export(format: "json" | "pdf" | "html"): Promise<Blob> {
    const resume = await this.load();
    
    switch (format) {
      case "json":
        return new Blob([JSON.stringify(resume.toJSON(), null, 2)], {
          type: "application/json",
        });
      case "pdf":
      case "html":
        throw new Error(`Export to ${format} not implemented yet`);
    }
  }

  async import(file: Blob): Promise<Resume> {
    const text = await file.text();
    const data = JSON.parse(text);
    const result = Resume.create(data);

    if (!result.isValid || !result.resume) {
      throw new Error(`Invalid resume data: ${result.errors?.join(", ")}`);
    }

    await this.save(result.resume);
    return result.resume;
  }
}

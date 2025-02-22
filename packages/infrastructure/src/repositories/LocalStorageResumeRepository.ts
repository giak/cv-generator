import { Resume, type ResumeRepository } from "@cv-generator/core";

const STORAGE_KEY = "cv-generator-resume";

const EMPTY_RESUME = {
  basics: {
    name: "Nouveau CV",
    email: "email@exemple.com",
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume.toJSON()));
  }

  async load(): Promise<Resume> {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const result = Resume.create(EMPTY_RESUME);
      if (!result.isValid || !result.resume) {
        throw new Error(`Failed to create empty resume: ${result.errors?.join(", ")}`);
      }
      return result.resume;
    }

    const parsed = JSON.parse(data);
    const result = Resume.create(parsed);
    if (!result.isValid || !result.resume) {
      throw new Error(`Invalid resume data: ${result.errors?.join(", ")}`);
    }
    return result.resume;
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

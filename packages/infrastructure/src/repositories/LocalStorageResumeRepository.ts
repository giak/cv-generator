import { Resume } from "@cv-generator/core/src/domain/entities/Resume";
import type { ResumeRepository } from "@cv-generator/core/src/ports/ResumeRepository";

const STORAGE_KEY = "cv-generator-resume";

export class LocalStorageResumeRepository implements ResumeRepository {
  constructor() {
    // Initialisation du localStorage si on est dans un environnement de test
    if (typeof window === "undefined" && process.env.NODE_ENV === "test") {
      global.localStorage = {
        data: new Map<string, string>(),
        getItem(key: string) {
          return this.data.get(key) || null;
        },
        setItem(key: string, value: string) {
          this.data.set(key, value);
        },
        removeItem(key: string) {
          this.data.delete(key);
        },
        clear() {
          this.data.clear();
        },
        key(index: number): string | null {
          return Array.from(this.data.keys())[index] || null;
        },
        get length() {
          return this.data.size;
        },
      };
    }
  }

  async save(resume: Resume): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume.toJSON()));
  }

  async load(): Promise<Resume | null> {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const result = Resume.create(JSON.parse(data));
    if (!result.isValid || !result.resume) return null;
    return result.resume;
  }

  async export(format: "json" | "pdf" | "html"): Promise<Blob> {
    const resume = await this.load();
    if (!resume) throw new Error("No resume found");

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

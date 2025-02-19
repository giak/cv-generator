import type { Resume as ResumeType } from "@cv-generator/shared/src/types/resume";
import { Resume } from "../../domain/entities/Resume";
import type { ResumeRepository } from "../../ports/ResumeRepository";

export class ManageResume {
  constructor(private readonly repository: ResumeRepository) {}

  async createResume(data: ResumeType) {
    const result = Resume.create(data);
    if (!result.isValid || !result.resume) {
      throw new Error(`Invalid resume data: ${result.errors?.join(", ")}`);
    }

    await this.repository.save(result.resume);
    return result.resume;
  }

  async loadResume() {
    return this.repository.load();
  }

  async exportResume(format: "json" | "pdf" | "html") {
    return this.repository.export(format);
  }

  async importResume(file: Blob) {
    return this.repository.import(file);
  }
}

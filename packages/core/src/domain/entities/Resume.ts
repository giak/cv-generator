import type { Resume as ResumeType, ValidationResult } from "@cv-generator/shared/src/types/resume";
import { resumeSchema } from "@cv-generator/shared/src/validators/resumeSchema";

export class Resume {
  private constructor(private readonly data: ResumeType) {}

  static create(data: ResumeType): ValidationResult & { resume?: Resume } {
    const validation = resumeSchema.safeParse(data);

    if (!validation.success) {
      return {
        isValid: false,
        errors: validation.error.errors.map((err) => err.message),
      };
    }

    return {
      isValid: true,
      resume: new Resume(validation.data),
    };
  }

  get basics() {
    return { ...this.data.basics };
  }

  get work() {
    return this.data.work ? [...this.data.work] : [];
  }

  get education() {
    return this.data.education ? [...this.data.education] : [];
  }

  get skills() {
    return this.data.skills ? [...this.data.skills] : [];
  }

  toJSON(): ResumeType {
    return {
      basics: this.basics,
      work: this.work,
      education: this.education,
      skills: this.skills,
    };
  }
}

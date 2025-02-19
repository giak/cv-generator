import type { Resume } from "../domain/entities/Resume";

export interface ResumeRepository {
  save(resume: Resume): Promise<void>;
  load(): Promise<Resume | null>;
  export(format: "json" | "pdf" | "html"): Promise<Blob>;
  import(file: Blob): Promise<Resume>;
}

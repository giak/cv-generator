import { ExportFormat } from "../../domain/entities/ExportFormat";
import { ExportService } from "../../ports/services/ExportService";

/**
 * DTO for export requests
 */
export interface ExportResumeDTO {
  resumeData: unknown;
  formatId: string;
}

/**
 * Use case for exporting a resume to different formats
 */
export class ExportResume {
  constructor(private readonly exportServices: ExportService[]) {}
  
  /**
   * Export a resume to the specified format
   * 
   * @param dto Export request data
   * @returns A blob containing the exported resume
   * @throws Error if the format is not supported or export fails
   */
  async execute(dto: ExportResumeDTO): Promise<Blob> {
    if (!ExportFormat.isSupported(dto.formatId)) {
      throw new Error(`Unsupported export format: ${dto.formatId}`);
    }
    
    const format = ExportFormat.fromId(dto.formatId);
    
    // Find a service that supports this format
    const service = this.exportServices.find(service => 
      service.supportsFormat(format)
    );
    
    if (!service) {
      throw new Error(`No export service available for format: ${dto.formatId}`);
    }
    
    return service.export(dto.resumeData, format);
  }
} 
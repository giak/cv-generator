import { ExportFormat } from "../../domain/entities/ExportFormat";

/**
 * Interface for services that export resumes to different formats
 */
export interface ExportService {
  /**
   * Export data to a specified format
   * 
   * @param data The data to export
   * @param format The format to export to
   * @returns A blob containing the exported data
   */
  export(data: unknown, format: ExportFormat): Promise<Blob>;
  
  /**
   * Check if this service supports a given format
   * 
   * @param format The format to check
   * @returns Whether this service supports the format
   */
  supportsFormat(format: ExportFormat): boolean;
} 
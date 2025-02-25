/**
 * Represents a format for exporting resumes
 */
export class ExportFormat {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly extension: string,
    private readonly mimeType: string
  ) {}

  public static readonly PDF = new ExportFormat(
    'pdf',
    'PDF Document',
    '.pdf',
    'application/pdf'
  );

  public static readonly JSON = new ExportFormat(
    'json', 
    'JSON Document', 
    '.json', 
    'application/json'
  );

  public static readonly HTML = new ExportFormat(
    'html',
    'HTML Document',
    '.html',
    'text/html'
  );
  
  /**
   * Get the ID of the format
   */
  public getId(): string {
    return this.id;
  }
  
  /**
   * Get the display name of the format
   */
  public getName(): string {
    return this.name;
  }
  
  /**
   * Get the file extension for this format
   */
  public getExtension(): string {
    return this.extension;
  }
  
  /**
   * Get the MIME type for this format
   */
  public getMimeType(): string {
    return this.mimeType;
  }
  
  /**
   * Check if a format ID is supported
   */
  public static isSupported(formatId: string): boolean {
    return ['pdf', 'json', 'html'].includes(formatId);
  }
  
  /**
   * Get a format by ID
   */
  public static fromId(formatId: string): ExportFormat {
    switch (formatId) {
      case 'pdf':
        return ExportFormat.PDF;
      case 'json':
        return ExportFormat.JSON;
      case 'html':
        return ExportFormat.HTML;
      default:
        throw new Error(`Unsupported export format: ${formatId}`);
    }
  }
} 
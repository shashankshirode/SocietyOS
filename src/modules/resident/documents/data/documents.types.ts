
export interface DocumentGeneratedRecord {
  id: string;
  name?: string;
  status?: string;
}

export type createDocumentMetadataRecord = DocumentGeneratedRecord;
export type DocumentsByCategoryRecord = DocumentGeneratedRecord;
export type DocumentAccessLogsRecord = DocumentGeneratedRecord;
export type DocumentVersionsRecord = DocumentGeneratedRecord;
export type requestDocumentAccessRecord = DocumentGeneratedRecord;

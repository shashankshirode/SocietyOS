import type { DocumentAccessAction, DocumentAccessLog, DocumentCategory, DocumentInfo } from '../../../../shared/types/document.types';

export type DocumentDto = Partial<DocumentInfo> & Pick<DocumentInfo, 'id'>;
export type DocumentAccessLogDto = Partial<DocumentAccessLog> & Pick<DocumentAccessLog, 'id'>;

export type UploadDocumentPlaceholderInput = {
  title: string;
  category: DocumentCategory;
};

export type RecordDocumentAccessInput = {
  documentId: string;
  documentTitle: string;
  action: DocumentAccessAction;
  reason?: string;
};

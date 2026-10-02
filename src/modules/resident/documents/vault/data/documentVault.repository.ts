import { resolveDataSource } from '../../../../core/dataSource/dataSourceResolver';
import { isDevelopmentMode } from '../../../../shared/utils/isDevelopmentMode';
import type { DocumentVaultRecord } from '../../../../types/documentVault.types';

interface DocumentVaultApiSource {
  createDocument(input: CreateDocumentInput): Promise<DocumentVaultRecord>;
  getDocument(documentId: string): Promise<DocumentVaultRecord | null>;
  updateDocument(documentId: string, input: Partial<DocumentVaultRecord>): Promise<DocumentVaultRecord>;
  deleteDocument(documentId: string): Promise<{ success: boolean }>;
  listDocuments(societyId: string): Promise<DocumentVaultRecord[]>;
}

interface DocumentVaultMockSource {
  createDocument(input: CreateDocumentInput): Promise<DocumentVaultRecord>;
  getDocument(documentId: string): Promise<DocumentVaultRecord | null>;
  updateDocument(documentId: string, input: Partial<DocumentVaultRecord>): Promise<DocumentVaultRecord>;
  deleteDocument(documentId: string): Promise<{ success: boolean }>;
  listDocuments(societyId: string): Promise<DocumentVaultRecord[]>;
}

interface CreateDocumentInput {
  id: string;
  name: string;
  category: string;
  sensitivity: string;
  societyId: string;
  uploadedBy: string;
  tags: string[];
  content?: string;
  mimeType?: string;
  size?: number;
}

interface DocumentVaultRecord {
  id: string;
  name: string;
  category: string;
  sensitivity: string;
  societyId: string;
  uploadedBy: string;
  tags: string[];
  content?: string;
  mimeType?: string;
  size?: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'EXPIRED' | 'DELETED';
  createdAt: string;
  updatedAt?: string;
  uploadedAt: string;
}

function createMockSource(): DocumentVaultMockSource {
  const documents = new Map<string, any>();

  return {
    async createDocument(input) {
      const record = {
        ...input,
        id: input.id,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        uploadedAt: new Date().toISOString(),
      };
      documents.set(input.id, record);
      return record;
    },
    async getDocument(id) {
      return documents.get(id) || null;
    },
    async updateDocument(id, input) {
      const existing = documents.get(id);
      if (!existing) throw new Error('Document not found');
      const updated = { ...existing, ...input, updatedAt: new Date().toISOString() };
      documents.set(id, updated);
      return updated;
    },
    async deleteDocument(id) {
      documents.delete(id);
      return { success: true };
    },
    async listDocuments(societyId) {
      return Array.from(documents.values()).filter(d => d.societyId === societyId);
    },
  };
}

const mockSource = createMockSource();

const dataSource = (() => {
  try {
    return resolveDataSource('documents');
  } catch {
    return { isApi: false, isMock: true, mode: 'mock', moduleKey: 'documents', fallbackToMockEnabled: true };
  }
})();

const isProductionMock = !dataSource.isApi && !(__DEV__ || process.env.NODE_ENV === 'development');

function assertProductionSafety() {
  if (isProductionMock) {
    throw new Error('DOCUMENT_VAULT_CONTEXT_UNAVAILABLE: Production document vault cannot use mock source.');
  }
}

function getSource() {
  assertProductionSafety();
  if (dataSource.isApi) {
    throw new Error('API source not implemented');
  }
  return mockSource;
}

export const documentVaultRepository = {
  createDocument: (input: any) => getSource().createDocument(input),
  getDocument: (id: string) => getSource().getDocument(id),
  updateDocument: (id: string, input: any) => getSource().updateDocument(id, input),
  deleteDocument: (id: string) => getSource().deleteDocument(id),
  listDocuments: (societyId: string) => getSource().listDocuments(societyId),
};
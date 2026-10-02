import type {
  Document,
  DocumentVersion,
  DocumentUploadInput,
  DocumentReplaceInput,
  SecureDownloadUrl,
  DuplicateCheckResult,
} from '../types/documentVault.types';
import type { Absent } from '../../../../shared/types/absence.types';
import { mockStore } from '../../../../core/mockStore/mockStore';

export interface StorageUploadResult {
  storageReference: string;
  version: DocumentVersion;
}

export interface StorageDownloadResult {
  blob: Blob;
  fileName: string;
  mimeType: string;
}

export interface StorageMetadata {
  size: number;
  mimeType: string;
  lastModified: string;
  checksum: string;
}

export interface StorageService {
  upload(input: DocumentUploadInput, file: File): Promise<StorageUploadResult>;
  download(storageReference: string): Promise<StorageDownloadResult>;
  getMetadata(storageReference: string): Promise<StorageMetadata>;
  exists(storageReference: string): Promise<boolean>;
  delete(storageReference: string): Promise<boolean>;
  generateSecureAccess(storageReference: string, expiresInSeconds: number): Promise<SecureDownloadUrl>;
  getSecureAccessUrl(documentId: string, versionId: string, expiresInSeconds?: number): Promise<SecureDownloadUrl>;
  checkDuplicate(checksum: string, societyId: string): Promise<DuplicateCheckResult>;
}

const MOCK_STORAGE_PREFIX = 'society-os://documents/';
const MOCK_DOWNLOAD_EXPIRY_SECONDS = 3600;

class MockDocumentStorageService implements StorageService {
  private storage: Map<string, { file: File; metadata: { size: number; mimeType: string; lastModified: string; checksum: string } }> = new Map();
  private accessUrls: Map<string, { url: string; expiresAt: string }> = new Map();

  constructor() {
    this.initializeMockStorage();
  }

  private initializeMockStorage(): void {
    const existingDocs = mockStore.getState().documents || [];
    existingDocs.forEach(doc => {
      const storageRef = `${MOCK_STORAGE_PREFIX}${doc.id}/v${doc.currentVersionNumber}`;
      const mockFile = new File(['mock content'], doc.fileName, { type: doc.mimeType });
      this.storage.set(storageRef, {
        file: mockFile,
        metadata: {
          size: doc.fileSize,
          mimeType: doc.mimeType,
          lastModified: doc.updatedAt,
          checksum: doc.checksum,
        },
      });
    });
  }

  async upload(input: DocumentUploadInput, file: File): Promise<StorageUploadResult> {
    await this.validateUpload(input, file);

    const duplicateCheck = await this.checkDuplicate(input.checksum, input.entityId);
    if (duplicateCheck.isDuplicate) {
      throw new Error(`Duplicate document detected: ${duplicateCheck.existingDocumentId}`);
    }

    const storageReference = `${MOCK_STORAGE_PREFIX}${input.entityId}/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const versionNumber = Date.now();

    const version: DocumentVersion = {
      id: `ver-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      documentId: '',
      versionNumber,
      storageReference,
      fileName: input.fileName,
      mimeType: input.mimeType,
      fileSize: input.fileSize,
      checksum: input.checksum,
      checksumAlgorithm: input.checksumAlgorithm,
      uploadedBy: 'current-user',
      uploadedAt: new Date().toISOString(),
      status: 'CURRENT',
      changeReason: 'Initial upload',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.storage.set(storageReference, {
      file,
      metadata: {
        size: input.fileSize,
        mimeType: input.mimeType,
        lastModified: new Date().toISOString(),
        checksum: input.checksum,
      },
    });

    return { storageReference, version };
  }

  async download(storageReference: string): Promise<StorageDownloadResult> {
    const stored = this.storage.get(storageReference);
    if (!stored) {
      throw new Error(`Document not found at storage reference: ${storageReference}`);
    }

    return {
      blob: stored.file,
      fileName: stored.file.name,
      mimeType: stored.file.type,
    };
  }

  async getMetadata(storageReference: string): Promise<StorageMetadata> {
    const stored = this.storage.get(storageReference);
    if (!stored) {
      throw new Error(`Document not found at storage reference: ${storageReference}`);
    }

    return stored.metadata;
  }

  async exists(storageReference: string): Promise<boolean> {
    return this.storage.has(storageReference);
  }

  async delete(storageReference: string): Promise<boolean> {
    const existed = this.storage.has(storageReference);
    this.storage.delete(storageReference);
    return existed;
  }

  async generateSecureAccess(storageReference: string, expiresInSeconds = MOCK_DOWNLOAD_EXPIRY_SECONDS): Promise<SecureDownloadUrl> {
    const stored = this.storage.get(storageReference);
    if (!stored) {
      throw new Error(`Document not found at storage reference: ${storageReference}`);
    }

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
    const accessId = `access-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const url = `${MOCK_STORAGE_PREFIX}secure/${accessId}`;

    this.accessUrls.set(accessId, { url, expiresAt });

    return {
      url,
      expiresAt,
      documentId: '',
      versionId: '',
    };
  }

  async getSecureAccessUrl(documentId: string, versionId: string, expiresInSeconds = MOCK_DOWNLOAD_EXPIRY_SECONDS): Promise<SecureDownloadUrl> {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();
    const accessId = `access-${documentId}-${versionId}-${Date.now()}`;
    const url = `${MOCK_STORAGE_PREFIX}secure/${accessId}`;

    this.accessUrls.set(accessId, { url, expiresAt });

    return {
      url,
      expiresAt,
      documentId,
      versionId,
    };
  }

  async checkDuplicate(checksum: string, societyId: string): Promise<DuplicateCheckResult> {
    const documents = mockStore.getState().documents || [];
    const existing = documents.find(doc => doc.checksum === checksum && doc.societyId === societyId);

    if (existing) {
      return {
        isDuplicate: true,
        existingDocumentId: existing.id,
        existingVersionId: existing.currentVersionId,
      };
    }

    return { isDuplicate: false };
  }

  private async validateUpload(input: DocumentUploadInput, file: File): Promise<void> {
    if (file.size > input.fileSize) {
      throw new Error('File size exceeds declared size');
    }

    if (file.size > 50 * 1024 * 1024) {
      throw new Error('File size exceeds maximum allowed (50MB)');
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }

    const checksum = await this.computeChecksum(file);
    if (checksum !== input.checksum) {
      throw new Error('Checksum mismatch');
    }
  }

  private async computeChecksum(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

class ProductionDocumentStorageService implements StorageService {
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  async upload(input: DocumentUploadInput, file: File): Promise<StorageUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('checksum', input.checksum);
    formData.append('checksumAlgorithm', input.checksumAlgorithm);
    formData.append('metadata', JSON.stringify({
      title: input.title,
      category: input.category,
      entityType: input.entityType,
      entityId: input.entityId,
      sensitivity: input.sensitivity,
      issueDate: input.issueDate,
      expiryDate: input.expiryDate,
      description: input.description,
      metadata: input.metadata,
      tags: input.tags,
      retentionPolicy: input.retentionPolicy,
    }));

    const response = await fetch(`${this.baseUrl}/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  async download(storageReference: string): Promise<StorageDownloadResult> {
    const response = await fetch(`${this.baseUrl}/documents/download/${storageReference}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    const blob = await response.blob();
    const fileName = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'document';

    return { blob, fileName, mimeType: blob.type };
  }

  async getMetadata(storageReference: string): Promise<StorageMetadata> {
    const response = await fetch(`${this.baseUrl}/documents/metadata/${storageReference}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get metadata');
    }

    return response.json();
  }

  async exists(storageReference: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/documents/exists/${storageReference}`, {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    return response.ok;
  }

  async delete(storageReference: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/documents/${storageReference}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
      },
    });

    return response.ok;
  }

  async generateSecureAccess(storageReference: string, expiresInSeconds = 3600): Promise<SecureDownloadUrl> {
    const response = await fetch(`${this.baseUrl}/documents/secure-access`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ storageReference, expiresInSeconds }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate secure access');
    }

    return response.json();
  }

  async getSecureAccessUrl(documentId: string, versionId: string, expiresInSeconds = 3600): Promise<SecureDownloadUrl> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}/versions/${versionId}/secure-url`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresInSeconds }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate secure access URL');
    }

    return response.json();
  }

  async checkDuplicate(checksum: string, societyId: string): Promise<DuplicateCheckResult> {
    const response = await fetch(`${this.baseUrl}/documents/check-duplicate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ checksum, societyId }),
    });

    if (!response.ok) {
      throw new Error('Failed to check duplicate');
    }

    return response.json();
  }
}

const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';

export const documentStorageService: StorageService = isDevelopment
  ? new MockDocumentStorageService()
  : new ProductionDocumentStorageService(
      process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.societyos.com',
      process.env.EXPO_PUBLIC_API_ACCESS_TOKEN || ''
    );

export function createDocumentStorageService(baseUrl: string, accessToken: string): StorageService {
  return new ProductionDocumentStorageService(baseUrl, accessToken);
}

export function createMockDocumentStorageService(): StorageService {
  return new MockDocumentStorageService();
}
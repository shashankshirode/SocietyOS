import type {
  Complaint,
  ComplaintEvidence,
  EvidenceType,
} from '../../../shared/types/complaintPhase6';
import { mockStore } from '../../../core/mockStore/mockStore';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { gateIdempotencyService } from '../../guard/services/gateIdempotencyService';

export interface UploadEvidenceInput {
  complaintId: string;
  type: EvidenceType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedByUserId: string;
  uploadedByDisplayName: string;
  description?: string;
  isResolutionEvidence: boolean;
  documentId: string;
  idempotencyKey: string;
}

export interface UploadResult {
  success: boolean;
  evidence?: ComplaintEvidence;
  errorCode?: string;
  errorMessage?: string;
}

export interface DeleteEvidenceResult {
  success: boolean;
  errorCode?: string;
  errorMessage?: string;
}

const ACCEPTED_MIME_TYPES: Record<EvidenceType, string[]> = {
  PHOTO: ['image/jpeg', 'image/png', 'image/heic', 'image/webp'],
  VIDEO: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  OTHER: ['application/octet-stream'],
};

const MAX_FILE_SIZES: Record<EvidenceType, number> = {
  PHOTO: 10 * 1024 * 1024,
  VIDEO: 100 * 1024 * 1024,
  DOCUMENT: 25 * 1024 * 1024,
  AUDIO: 25 * 1024 * 1024,
  OTHER: 10 * 1024 * 1024,
};

export class EvidenceService {
  private static instance: EvidenceService;

  static getInstance(): EvidenceService {
    if (!EvidenceService.instance) {
      EvidenceService.instance = new EvidenceService();
    }
    return EvidenceService.instance;
  }

  async uploadEvidence(input: UploadEvidenceInput): Promise<UploadResult> {
    const idempotencyResult = await gateIdempotencyService.checkIdempotency(input.idempotencyKey, '');
    if (idempotencyResult.exists) {
      return { success: true, evidence: idempotencyResult.record?.evidence };
    }

    const complaints = mockStore.getState().complaints || [];
    const complaint = complaints.find(c => c.id === input.complaintId);
    if (!complaint) {
      return { success: false, errorCode: 'COMPLAINT_NOT_FOUND', errorMessage: 'Complaint not found' };
    }

    if (!this.isValidFileType(input.type, input.mimeType)) {
      return { success: false, errorCode: 'INVALID_FILE_TYPE', errorMessage: `File type ${input.mimeType} not allowed for ${input.type}` };
    }

    if (!this.isValidFileSize(input.type, input.fileSize)) {
      return { success: false, errorCode: 'FILE_TOO_LARGE', errorMessage: `File size exceeds maximum allowed for ${input.type}` };
    }

    const evidence: ComplaintEvidence = {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      complaintId: input.complaintId,
      documentId: input.documentId,
      type: input.type,
      fileName: input.fileName,
      fileSize: input.fileSize,
      mimeType: input.mimeType,
      uploadedByUserId: input.uploadedByUserId,
      uploadedByDisplayName: input.uploadedByDisplayName,
      uploadedAt: new Date().toISOString(),
      description: input.description,
      isResolutionEvidence: input.isResolutionEvidence,
      metadata: {},
      societyId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockStore.getState().complaintEvidence = [...(mockStore.getState().complaintEvidence || []), evidence];

    const complaintIndex = mockStore.getState().complaints?.findIndex(c => c.id === input.complaintId);
    if (complaintIndex !== -1) {
      const complaint = mockStore.getState().complaints[complaintIndex];
      complaint.evidenceIds = [...(complaint.evidenceIds || []), evidence.id];
      complaint.updatedAt = new Date().toISOString();
    }

    mockStore.notify();

    await gateIdempotencyService.completeIdempotency(input.idempotencyKey, '', evidence.id, { evidence });

    await createAuditEntry({
      actorUserId: input.uploadedByUserId,
      actorType: 'TECHNICIAN',
      societyId: '',
      action: 'EVIDENCE_UPLOADED',
      entityType: 'ComplaintEvidence',
      entityId: evidence.id,
      newState: { complaintId: input.complaintId, type: input.type, isResolutionEvidence: input.isResolutionEvidence },
      idempotencyKey: input.idempotencyKey,
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true, evidence };
  }

  async deleteEvidence(evidenceId: string, deletedByUserId: string, deletedByDisplayName: string): Promise<DeleteEvidenceResult> {
    const evidenceIndex = mockStore.getState().complaintEvidence?.findIndex(e => e.id === evidenceId);
    if (evidenceIndex === -1) {
      return { success: false, errorCode: 'EVIDENCE_NOT_FOUND', errorMessage: 'Evidence not found' };
    }

    const evidence = mockStore.getState().complaintEvidence[evidenceIndex];
    const complaints = mockStore.getState().complaints || [];
    const complaintIndex = complaints.findIndex(c => c.id === evidence.complaintId);

    if (complaintIndex !== -1) {
      const complaint = complaints[complaintIndex];
      complaint.evidenceIds = complaint.evidenceIds?.filter(id => id !== evidenceId) || [];
      complaint.updatedAt = new Date().toISOString();
    }

    mockStore.getState().complaintEvidence?.splice(evidenceIndex, 1);
    mockStore.notify();

    await createAuditEntry({
      actorUserId: deletedByUserId,
      actorType: 'TECHNICIAN',
      societyId: '',
      action: 'EVIDENCE_DELETED',
      entityType: 'ComplaintEvidence',
      entityId: evidenceId,
      previousState: { evidenceId },
      newState: { deleted: true },
      idempotencyKey: createIdempotencyKey(`evidence-delete-${evidenceId}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { success: true };
  }

  async getEvidenceForComplaint(complaintId: string): Promise<ComplaintEvidence[]> {
    return mockStore.getState().complaintEvidence?.filter(e => e.complaintId === complaintId) || [];
  }

  async getResolutionEvidence(complaintId: string): Promise<ComplaintEvidence[]> {
    return mockStore.getState().complaintEvidence?.filter(e => e.complaintId === complaintId && e.isResolutionEvidence) || [];
  }

  private isValidFileType(type: EvidenceType, mimeType: string): boolean {
    const accepted = ACCEPTED_MIME_TYPES[type] || [];
    return accepted.includes(mimeType);
  }

  private isValidFileSize(type: EvidenceType, size: number): boolean {
    const maxSize = MAX_FILE_SIZES[type] || MAX_FILE_SIZES.OTHER;
    return size <= maxSize;
  }
}

export const evidenceService = EvidenceService.getInstance();
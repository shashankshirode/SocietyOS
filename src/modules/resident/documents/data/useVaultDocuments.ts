import { useState, useEffect, useCallback } from 'react';
import { useLatestValue } from '../../../../shared/hooks/useLatestValue';
import type { DocumentRecord, DocumentVersionRecord } from '../vault/domain/types/document.types';
import type { VerificationCase } from '../vault/domain/types/verification.types';
import type { AccessLogEntry, RetrievalTicket, AccessGrant, DocumentAction } from '../vault/domain/types/access.types';
import type { LegalHold } from '../vault/domain/types/retention.types';
import type { TraceableRetentionRecord } from '../vault/domain/types/retention.types';
import type { TraceContext } from '../vault/domain/types/primitives';
import type { VerificationChecklist } from '../vault/domain/types/verification.types';
import type { DocumentAction as DocumentActionType, SignatureMethod } from '../vault/domain/types/policy.types';
import { createDocumentVaultService } from '../vault/application/documentVaultService';
import { vaultRepository } from '../vault/infrastructure/vaultRepository';
import type { RetentionAssessment } from '../vault/domain/types/retention.types';

let vaultService: ReturnType<typeof createDocumentVaultService> | null = null;

function getVaultService() {
  if (!vaultService) {
    vaultService = createDocumentVaultService(vaultRepository);
  }
  return vaultService;
}

export function useVaultDocuments(filters?: { categoryGroup?: string; entityType?: string; entityId?: string }) {
  const [data, setData] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const filterSignature = JSON.stringify(filters);
  const filtersHandle = useLatestValue(filters, filterSignature);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const societyId = 'society-001';
      let documents = service.listDocuments(societyId);

      if (filtersHandle.valueRef.current?.categoryGroup) {
        documents = documents.filter((d) => d.categoryGroup === filtersHandle.valueRef.current!.categoryGroup);
      }
      if (filtersHandle.valueRef.current?.entityType) {
        documents = documents.filter((d) => d.scope.owningEntityType === filtersHandle.valueRef.current!.entityType);
      }
      if (filtersHandle.valueRef.current?.entityId) {
        documents = documents.filter((d) => d.scope.owningEntityId === filtersHandle.valueRef.current!.entityId);
      }

      setData(documents);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [filtersHandle]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultDocumentDetail(documentId: string) {
  const [data, setData] = useState<DocumentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const result = service.getDocument(documentId);
      setData(result ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultDocumentVersions(documentId: string) {
  const [data, setData] = useState<DocumentVersionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const result = service.getDocumentVersions(documentId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultDocumentHistory(documentId: string) {
  const [data, setData] = useState<DocumentVersionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const result = service.getDocumentHistory(documentId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultActiveVersion(documentId: string) {
  const [data, setData] = useState<DocumentVersionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const result = service.getActiveVersion(documentId);
      setData(result ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultVerificationCases(documentId: string) {
  const [data, setData] = useState<VerificationCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const result = service.getVerificationCases(documentId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultAccessLogs(documentId: string) {
  const [data, setData] = useState<AccessLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const result = service.getAccessLogs(documentId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultRetrievalTicket(ticketId: string) {
  const [data, setData] = useState<RetrievalTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!ticketId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const result = service.getRetrievalTicket(ticketId);
      setData(result ?? null);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultAccessGrants(documentId: string) {
  const [data, setData] = useState<AccessGrant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const result = service.getAccessGrants(documentId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultLegalHolds(documentId: string) {
  const [data, setData] = useState<LegalHold[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const result = service.getLegalHolds(documentId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultRetentionHistory(documentId: string) {
  const [data, setData] = useState<TraceableRetentionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!documentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const service = getVaultService();
      const result = service.getRetentionHistory(documentId);
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => { void fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useVaultUploadDocument() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: {
    title: string;
    categoryGroup: 'SOCIETY' | 'OWNER' | 'TENANT' | 'MOVE_IN' | 'MOVE_OUT' | 'STAFF_VENDOR' | 'COMPLIANCE';
    categoryCode: string;
    entityType: 'USER' | 'RESIDENT' | 'OWNER' | 'TENANT' | 'UNIT' | 'HOUSEHOLD' | 'SOCIETY' | 'MOVE_IN_REQUEST' | 'MOVE_OUT_REQUEST' | 'NOC' | 'VEHICLE' | 'PARKING' | 'VENDOR' | 'STAFF' | 'ASSET' | 'COMPLIANCE_RECORD';
    entityId: string;
    societyId: string;
    file: Uint8Array;
    fileName: string;
    mimeType: string;
    declaredByteSize: number;
    declaredMimeType: string;
    integrityAlgorithm: 'SHA-256' | 'SHA-512';
    expectedChecksum?: string;
    changeReason: string;
    documentId?: string;
  }) => {
    setIsUploading(true);
    setError(null);
    try {
      const service = getVaultService();

      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: input.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const intent = {
        scope: { societyId: input.societyId, owningEntityType: input.entityType, owningEntityId: input.entityId },
        entityType: input.entityType,
        entityId: input.entityId,
        categoryGroup: input.categoryGroup,
        categoryCode: input.categoryCode,
        title: input.title,
        declaredFileName: input.fileName,
        declaredMimeType: input.declaredMimeType,
        declaredByteSize: input.declaredByteSize,
        integrityAlgorithm: input.integrityAlgorithm,
        expectedChecksum: input.expectedChecksum,
        changeReason: input.changeReason,
        documentId: input.documentId,
      };

      const idempotencyKey = `upload-${input.entityId}-${input.categoryCode}-${Date.now()}`;
      const head = input.file.slice(0, Math.min(4096, input.file.length));

      const sessionResult = service.upload.initiate(actor, {} as any, intent, head, idempotencyKey);
      if (!sessionResult.ok) throw new Error(sessionResult.message);

      const progressResult = service.upload.recordProgress(actor, sessionResult.value.id, input.declaredByteSize);
      if (!progressResult.ok) throw new Error(progressResult.message);

      const completeResult = await service.upload.completeBytes(actor, sessionResult.value.id, input.file);
      if (!completeResult.ok) throw new Error(completeResult.message);

      const scanResult = await service.upload.recordScanResult({ kind: 'ACTOR', actorUserId: actor.userId, societyId: actor.societyId }, sessionResult.value.id, {
        scannerId: 'mock-scanner-1',
        status: 'CLEAN',
        signatureVersion: 'sig-2026-01',
        scannedAt: new Date().toISOString(),
        detail: undefined,
      });
      if (!scanResult.ok) throw new Error(scanResult.message);

      const commitResult = await service.upload.commit(actor, {} as any, sessionResult.value.id, {
        mimeType: input.mimeType,
        confidence: 'HIGH',
        evidence: 'declared',
      });
      if (!commitResult.ok) throw new Error(commitResult.message);

      return { success: true, document: commitResult.value.document, version: commitResult.value.version };
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { execute, isUploading, error };
}

export function useVaultUploadDocumentVersion() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (input: {
    documentId: string;
    file: Uint8Array;
    fileName: string;
    mimeType: string;
    declaredByteSize: number;
    changeReason: string;
    societyId: string;
    integrityAlgorithm: 'SHA-256' | 'SHA-512';
  }) => {
    setIsUploading(true);
    setError(null);
    try {
      const service = getVaultService();

      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: input.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const document = service.getDocument(input.documentId);
      if (!document) throw new Error('Document not found.');

      const intent = {
        scope: document.scope,
        entityType: document.scope.owningEntityType as any,
        entityId: document.scope.owningEntityId,
        categoryGroup: document.categoryGroup,
        categoryCode: document.categoryCode,
        title: document.title,
        declaredFileName: input.fileName,
        declaredMimeType: input.mimeType,
        declaredByteSize: input.declaredByteSize,
        integrityAlgorithm: input.integrityAlgorithm,
        expectedChecksum: undefined,
        changeReason: input.changeReason,
        documentId: input.documentId,
      };

      const idempotencyKey = `upload-version-${input.documentId}-${input.fileName}-${Date.now()}`;
      const head = input.file.slice(0, Math.min(4096, input.file.length));

      const sessionResult = service.upload.initiate(actor, {} as any, intent, head, idempotencyKey);
      if (!sessionResult.ok) throw new Error(sessionResult.message);

      const progressResult = service.upload.recordProgress(actor, sessionResult.value.id, input.declaredByteSize);
      if (!progressResult.ok) throw new Error(progressResult.message);

      const completeResult = await service.upload.completeBytes(actor, sessionResult.value.id, input.file);
      if (!completeResult.ok) throw new Error(completeResult.message);

      const scanResult = await service.upload.recordScanResult({ kind: 'ACTOR', actorUserId: actor.userId, societyId: actor.societyId }, sessionResult.value.id, {
        scannerId: 'mock-scanner-1',
        status: 'CLEAN',
        signatureVersion: 'sig-2026-01',
        scannedAt: new Date().toISOString(),
        detail: undefined,
      });
      if (!scanResult.ok) throw new Error(scanResult.message);

      const commitResult = await service.upload.commit(actor, {} as any, sessionResult.value.id, {
        mimeType: input.mimeType,
        confidence: 'HIGH',
        evidence: 'declared',
      });
      if (!commitResult.ok) throw new Error(commitResult.message);

      return { success: true, document: commitResult.value.document, version: commitResult.value.version };
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { execute, isUploading, error };
}

export function useVaultVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const service = getVaultService();

  const createCase = useCallback(async (
    documentId: string,
    versionId: string,
    checklist: VerificationChecklist,
    traceContext: TraceContext,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const document = service.getDocument(documentId);
      if (!document) throw new Error('Document not found.');

      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: document.scope.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = service.verification.createCase(actor, document, versionId, checklist, traceContext);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitChecklist = useCallback(async (caseId: string, completedItemIds: readonly string[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.submitChecklist(actor, caseId, completedItemIds);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const failChecklistItem = useCallback(async (caseId: string, itemId: string, note: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.failChecklistItem(actor, caseId, itemId, note);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const decide = useCallback(async (caseId: string, decision: 'APPROVE' | 'REJECT' | 'REQUEST_RESUBMISSION', reason?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.decide(actor, caseId, decision, reason);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestResubmission = useCallback(async (caseId: string, deadline: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.requestResubmission(actor, caseId, deadline);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const expireResubmission = useCallback(async (caseId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SYSTEM',
        actorType: 'SYSTEM' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.expireResubmission(actor, caseId);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const closeCase = useCallback(async (caseId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.closeCase(actor, caseId);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revokeCase = useCallback(async (caseId: string, reason: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.revokeCase(actor, caseId, reason);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const requestSignature = useCallback(async (caseId: string, method: SignatureMethod, expectedSigners: readonly { signerId: string; signerRole: string }[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.requestSignature(actor, caseId, method, expectedSigners);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSignature = useCallback(async (envelopeId: string, signerId: string, signerRole: string, providerReference?: string, certificateThumbprint?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: signerId,
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.addSignature(actor, envelopeId, signerId, signerRole, providerReference, certificateThumbprint);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sealSignature = useCallback(async (envelopeId: string, expectedSigners: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.sealSignature(actor, envelopeId, expectedSigners);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const failSignature = useCallback(async (envelopeId: string, detail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SYSTEM',
        actorType: 'SYSTEM' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.failSignature(actor, envelopeId, detail);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revokeSignature = useCallback(async (envelopeId: string, reason: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.verification.revokeSignature(actor, envelopeId, reason);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    createCase,
    submitChecklist,
    failChecklistItem,
    decide,
    requestResubmission,
    expireResubmission,
    closeCase,
    revokeCase,
    requestSignature,
    addSignature,
    sealSignature,
    failSignature,
    revokeSignature,
  };
}

export function useVaultAccess() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const service = getVaultService();

  const issueRetrievalTicket = useCallback(async (input: {
    documentId: string;
    versionId: string;
    action: DocumentActionType;
    ttlSeconds: number;
    traceContext: TraceContext;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const document = service.getDocument(input.documentId);
      if (!document) throw new Error('Document not found.');

      const version = service.getActiveVersion(input.documentId);
      if (!version) throw new Error('Active version not found.');

      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: document.scope.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = service.access.issueRetrievalTicket(actor, document, version, input.action, input.ttlSeconds, {} as any, input.traceContext);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const consumeRetrievalTicket = useCallback(async (ticketId: string, action: DocumentActionType) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.access.consumeRetrievalTicket(actor, ticketId, action);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revokeRetrievalTicket = useCallback(async (ticketId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.access.revokeRetrievalTicket(actor, ticketId);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logAccess = useCallback(async (input: {
    documentId: string;
    versionId?: string;
    action: DocumentActionType;
    outcome: 'GRANTED' | 'DENIED' | 'ALLOWED_WITH_REASON' | 'QUARANTINED_BLOCK';
    reasonCode: string;
    correlationId: string;
    sessionId: string;
    deviceClass: string;
    redactedActor?: boolean;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const document = service.getDocument(input.documentId);
      if (!document) throw new Error('Document not found.');

      const actor = {
        userId: 'current-user',
        role: 'RESIDENT_OWNER',
        actorType: 'RESIDENT_OWNER' as const,
        societyId: document.scope.societyId,
        sessionId: input.sessionId,
        authenticatedAt: new Date().toISOString(),
      };

      const result = service.access.logAccess(
        actor,
        document,
        input.versionId,
        input.action,
        input.outcome,
        input.reasonCode,
        input.correlationId,
        input.sessionId,
        input.deviceClass,
        input.redactedActor ?? false,
      );
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const grantAccess = useCallback(async (input: {
    documentId: string;
    granteeUserId: string;
    granteeRole: string;
    actions: readonly DocumentActionType[];
    expiresAt?: string;
    reason: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const document = service.getDocument(input.documentId);
      if (!document) throw new Error('Document not found.');

      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: document.scope.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = service.access.grantAccess(actor, document, input.granteeUserId, input.granteeRole, input.actions, input.expiresAt, input.reason);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const revokeAccessGrant = useCallback(async (grantId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.access.revokeAccessGrant(actor, grantId);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    issueRetrievalTicket,
    consumeRetrievalTicket,
    revokeRetrievalTicket,
    logAccess,
    grantAccess,
    revokeAccessGrant,
  };
}

export function useVaultRetention() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const service = getVaultService();

  const placeLegalHold = useCallback(async (documentId: string, reason: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const document = service.getDocument(documentId);
      if (!document) throw new Error('Document not found.');

      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: document.scope.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = service.retention.placeLegalHold(actor, document, reason);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const releaseLegalHold = useCallback(async (holdId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: 'society-001',
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };
      const result = service.retention.releaseLegalHold(actor, holdId);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const assessRetention = useCallback(async (input: {
    documentId: string;
    policyId: string;
    policyVersion: number;
    retainUntil?: string;
    erasureRequest?: { subjectUserId: string; requestedBy: string };
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const document = service.getDocument(input.documentId);
      if (!document) throw new Error('Document not found.');

      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: document.scope.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = service.retention.assessRetention(actor, document, input.policyId, input.policyVersion, input.retainUntil, input.erasureRequest);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyDisposition = useCallback(async (input: {
    documentId: string;
    assessment: RetentionAssessment;
    requestedDisposition: 'ARCHIVE' | 'ANONYMISE' | 'PURGE';
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const document = service.getDocument(input.documentId);
      if (!document) throw new Error('Document not found.');

      const actor = {
        userId: 'current-user',
        role: 'SOCIETY_ADMIN',
        actorType: 'SOCIETY_ADMIN' as const,
        societyId: document.scope.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = service.retention.applyDisposition(actor, document, input.assessment, input.requestedDisposition);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const processRetentionJob = useCallback(async (input: {
    documentId: string;
    policyId: string;
    policyVersion: number;
    retainUntil?: string;
    erasureRequest?: { subjectUserId: string; requestedBy: string };
    idempotencyKey: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const document = service.getDocument(input.documentId);
      if (!document) throw new Error('Document not found.');

      const actor = {
        userId: 'current-user',
        role: 'SYSTEM',
        actorType: 'SYSTEM' as const,
        societyId: document.scope.societyId,
        sessionId: 'sess-1',
        authenticatedAt: new Date().toISOString(),
      };

      const result = service.retention.processRetentionJob(actor, document, input.policyId, input.policyVersion, input.retainUntil, input.erasureRequest, input.idempotencyKey);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    placeLegalHold,
    releaseLegalHold,
    assessRetention,
    applyDisposition,
    processRetentionJob,
  };
}

export function useVaultExpiry() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const service = getVaultService();

  const evaluateExpiry = useCallback((document: DocumentRecord) => {
    return service.expiry.evaluateExpiry(document);
  }, []);

  const updateExpiryState = useCallback(async (document: DocumentRecord) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = service.expiry.updateExpiryState(document);
      if (!result.ok) throw new Error(result.message);
      return result.value;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getExpiringDocuments = useCallback((societyId: string, warningWindowDays: number) => {
    return service.expiry.getExpiringDocuments(societyId, warningWindowDays);
  }, []);

  const getExpiredDocuments = useCallback((societyId: string) => {
    return service.expiry.getExpiredDocuments(societyId);
  }, []);

  return {
    isLoading,
    error,
    evaluateExpiry,
    updateExpiryState,
    getExpiringDocuments,
    getExpiredDocuments,
  };
}
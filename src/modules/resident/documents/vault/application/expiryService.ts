import type { Absent } from '../../../../../shared/types/absence.types';
import type { VaultClock, DocumentVaultErrorCode } from '../domain/types/primitives';
import { violation, denied, allowedWith } from '../domain/types/primitives';
import type { DocumentRecord } from '../domain/types/document.types';
import type { ExpiryLifecycleState } from '../domain/types/document.types';
import { resolveExpiryState } from '../domain/stateMachines/retentionStateMachine';
import { evaluateActionPermission } from '../domain/guards/authorizationGuard';

export interface ExpiryService {
  evaluateExpiry(document: DocumentRecord): ExpiryLifecycleState;
  updateExpiryState(document: DocumentRecord): { ok: true; value: DocumentRecord; warnings: readonly string[] } | { ok: false; code: DocumentVaultErrorCode; message: string };
  getExpiringDocuments(societyId: string, warningWindowDays: number): readonly DocumentRecord[];
  getExpiredDocuments(societyId: string): readonly DocumentRecord[];
}

export function createExpiryService(ports: { clock: VaultClock; documents: { list: (societyId: string) => readonly DocumentRecord[]; update: (doc: DocumentRecord, expectedRevision: number) => boolean } }): ExpiryService {
  const now = (): string => ports.clock.now().toISOString();
  const WARNING_WINDOW_DAYS = 30;

  const evaluateExpiry = (document: DocumentRecord): ExpiryLifecycleState => {
    return resolveExpiryState(document, ports.clock, WARNING_WINDOW_DAYS);
  };

  const updateExpiryState = (document: DocumentRecord) => {
    const permission = evaluateActionPermission(
      { userId: 'system', role: 'SOCIETY_ADMIN', actorType: 'SYSTEM', societyId: document.scope.societyId, sessionId: 'sys', authenticatedAt: now() },
      'APPLY_RETENTION',
    );
    if (!permission.allowed) return fail('ACTOR_NOT_AUTHORIZED', 'System not authorized to update expiry.');

    const newState = resolveExpiryState(document, ports.clock, WARNING_WINDOW_DAYS);
    if (newState === document.expiryLifecycle) {
      return { ok: true as const, value: document, warnings: ['NO_CHANGE'] as const };
    }

    const updated: DocumentRecord = { ...document, expiryLifecycle: newState, updatedAt: now(), revision: { revision: document.revision.revision + 1, revisionToken: `rev-${document.id}-${document.revision.revision + 1}` } };
    if (!ports.documents.update(updated, document.revision.revision)) {
      return fail('CONCURRENT_WRITE', 'Document was modified concurrently.');
    }

    return { ok: true as const, value: updated, warnings: ['EXPIRY_UPDATED'] as const };
  };

  const getExpiringDocuments = (societyId: string, warningWindowDays: number): readonly DocumentRecord[] => {
    return ports.documents.list(societyId).filter((doc) => {
      if (!doc.expiresAt) return false;
      const expiry = Date.parse(doc.expiresAt);
      if (Number.isNaN(expiry)) return false;
      const nowMs = ports.clock.now().getTime();
      return expiry > nowMs && expiry <= nowMs + warningWindowDays * 24 * 60 * 60 * 1000;
    });
  };

  const getExpiredDocuments = (societyId: string): readonly DocumentRecord[] => {
    const nowMs = ports.clock.now().getTime();
    return ports.documents.list(societyId).filter((doc) => {
      if (!doc.expiresAt) return false;
      const expiry = Date.parse(doc.expiresAt);
      if (Number.isNaN(expiry)) return false;
      return expiry <= nowMs;
    });
  };

  function fail(code: DocumentVaultErrorCode, message: string) {
    return { ok: false as const, code, message };
  }

  return { evaluateExpiry, updateExpiryState, getExpiringDocuments, getExpiredDocuments };
}
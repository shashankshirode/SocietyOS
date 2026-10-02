import { mockStore } from '../../../core/mockStore/mockStore';
import type {
  WatchlistEntry,
  CreateWatchlistEntryPayload,
  WatchlistStatus,
  WatchlistReason,
} from '../../../shared/types/visitorPhase8.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { mockStore } from '../../../core/mockStore/mockStore';
import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';

const withMockDelay = <T>(data: T, ms = 400): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const watchlistService = {
  async getAllEntries(societyId: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = mockStore.getState().watchlistEntries || [];
        const filtered = entries.filter((e) => e.societyId === societyId);
        resolve(filtered.sort((a, b) => new Date(b.createdAtIso).getTime() - new Date(a.createdAtIso).getTime()));
      }, 300);
    });
  },

  async getEntry(entryId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = mockStore.getState().watchlistEntries || [];
        const entry = entries.find((e) => e.id === entryId);
        resolve(entry);
      }, 200);
    });
  },

  async getActiveEntries(societyId: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = mockStore.getState().watchlistEntries || [];
        const filtered = entries.filter((e) => e.societyId === societyId && e.status === 'ACTIVE');
        resolve(filtered);
      }, 300);
    });
  },

  async createEntry(payload: any, createdBy: string, createdByRole: string, societyId: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date().toISOString();
        const entry = {
          id: `wl-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          visitorName: payload.visitorName,
          visitorPhone: payload.visitorPhone,
          visitorId: payload.visitorId,
          reason: payload.reason,
          description: payload.description,
          status: 'ACTIVE',
          severity: payload.severity,
          effectiveFromIso: payload.effectiveFromIso,
          effectiveUntilIso: payload.effectiveUntilIso,
          createdBy,
          createdByRole,
          createdAtIso: now,
          reviewedBy: undefined,
          reviewedAtIso: undefined,
          reviewStatus: undefined,
          reviewNotes: undefined,
          autoDenyEntry: payload.autoDenyEntry,
          requiresEscort: payload.requiresEscort,
          notifyOnAttempt: payload.notifyOnAttempt,
          metadata: {},
          societyId,
        };

        mockStore.getState().watchlistEntries?.push(entry);
        mockStore.notify();

        createAuditEntry({
          actorUserId: createdBy,
          actorType: createdByRole as any,
          societyId,
          action: 'WATCHLIST_ENTRY_CREATED',
          entityType: 'WATCHLIST_ENTRY',
          entityId: entry.id,
          newState: { visitorName: entry.visitorName, visitorPhone: entry.visitorPhone, reason: entry.reason, severity: entry.severity },
          idempotencyKey: `wl_${entry.id}`,
          source: 'MOBILE',
          outcome: 'SUCCESS',
        });

        resolve(entry);
      }, 400);
    });
  },

  async updateEntry(entryId: string, updates: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = mockStore.getState().watchlistEntries || [];
        const index = entries.findIndex((e) => e.id === entryId);
        if (index === -1) {
          resolve(null);
          return;
        }

        const updated = { ...entries[index], ...updates };
        mockStore.getState().watchlistEntries[index] = updated;
        mockStore.notify();
        resolve(updated);
      }, 400);
    });
  },

  async revokeEntry(entryId: string, revokedBy: string, reason: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = mockStore.getState().watchlistEntries || [];
        const index = entries.findIndex((e) => e.id === entryId);
        if (index === -1) {
          resolve(null);
          return;
        }

        const now = new Date().toISOString();
        const updated = {
          ...entries[index],
          status: 'INACTIVE',
          revokedAtIso: new Date().toISOString(),
          revokedBy,
          revocationReason: reason,
          statusChangedAtIso: now,
        };

        mockStore.getState().watchlistEntries[index] = updated;
        mockStore.notify();

        createAuditEntry({
          actorUserId: revokedBy,
          actorType: 'SECURITY_SUPERVISOR',
          societyId: updated.societyId,
          action: 'WATCHLIST_ENTRY_REVOKED',
          entityType: 'WATCHLIST_ENTRY',
          entityId: entryId,
          previousState: { status: entries[index].status },
          newState: { status: 'INACTIVE', revocationReason: reason },
          idempotencyKey: `wl_revoke_${entryId}`,
          source: 'MOBILE',
          outcome: 'SUCCESS',
        });

        resolve(updated);
      }, 400);
    });
  },

  async checkWatchlist(visitorPhone: string, visitorId?: string, societyId: string): Promise<{
    match: boolean;
    entry?: any;
    autoDeny: boolean;
    requiresEscort: boolean;
    notifyOnAttempt: boolean;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = mockStore.getState().watchlistEntries || [];
        const now = new Date();

        const match = entries.find((e) => {
          if (e.societyId !== societyId) return false;
          if (e.status !== 'ACTIVE') return false;
          if (e.effectiveFromIso && new Date(e.effectiveFromIso) > new Date()) return false;
          if (e.effectiveUntilIso && new Date(e.effectiveUntilIso) < new Date()) return false;

          if (e.visitorPhone && e.visitorPhone === visitorPhone) return true;
          if (visitorId && e.visitorId && e.visitorId === visitorId) return true;

          return false;
        });

        if (match) {
          resolve({
            match: true,
            entry: match,
            autoDeny: match.autoDenyEntry,
            requiresEscort: match.requiresEscort,
            notifyOnAttempt: match.notifyOnAttempt,
          });
        } else {
          resolve({ match: false, autoDeny: false, requiresEscort: false, notifyOnAttempt: false });
        }
      }, 200);
    });
  },

  async getEntriesByReason(societyId: string, reason: string): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = mockStore.getState().watchlistEntries || [];
        const filtered = entries.filter((e) => e.societyId === societyId && e.reason === reason);
        resolve(filtered);
      }, 300);
    });
  },

  async getEntriesBySeverity(societyId: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): Promise<any[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = mockStore.getState().watchlistEntries || [];
        const filtered = entries.filter((e) => e.societyId === societyId && e.severity === severity);
        resolve(filtered);
      }, 300);
    });
  },

  async getStats(societyId: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    expired: number;
    byReason: Record<string, number>;
    bySeverity: Record<string, number>;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const entries = mockStore.getState().watchlistEntries || [];
        const filtered = entries.filter((e) => e.societyId === societyId);

        const byReason: Record<string, number> = {};
        const bySeverity: Record<string, number> = {};

        filtered.forEach((e) => {
          byReason[e.reason] = (byReason[e.reason] || 0) + 1;
          bySeverity[e.severity] = (bySeverity[e.severity] || 0) + 1;
        });

        resolve({
          total: filtered.length,
          active: filtered.filter((e) => e.status === 'ACTIVE').length,
          inactive: filtered.filter((e) => e.status === 'INACTIVE').length,
          expired: filtered.filter((e) => e.status === 'EXPIRED').length,
          byReason,
          bySeverity,
        });
      }, 300);
    });
  },
};
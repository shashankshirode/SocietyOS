import { mockStore } from '../../../core/mockStore/mockStore';
import type {
  Gate,
  GateEntry,
  GateExit,
  VisitorPass,
  VisitorApprovalRequest,
  WatchlistEntry,
  EntrySource,
  ApprovalSource,
  VisitorCategory,
  VisitorPassStatus,
} from '../../../../shared/types/visitorPhase5';
import { unifiedVisitorStateMachine } from './unifiedVisitorStateMachine';
import { auditService, createAuditEntry } from '../../../core/audit';
import { createIdempotencyKey } from '../../../core/api/idempotency';

export interface GateContext {
  readonly gateId: string;
  readonly gateName: string;
  readonly societyId: string;
  readonly guardId: string;
  readonly guardName: string;
  readonly isOnline: boolean;
  readonly allowedEntrySources: readonly string[];
  readonly allowedVisitorCategories: readonly string[];
  readonly requiresGuard: boolean;
  readonly emergencyBypassEnabled: boolean;
  readonly maxConcurrentVisitors?: number;
  readonly currentOccupancy: number;
}

export interface VisitorValidationResult {
  readonly valid: boolean;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly pass?: VisitorPass;
  readonly approvalRequest?: VisitorApprovalRequest;
  readonly watchlistMatch?: boolean;
  readonly watchlistEntry?: WatchlistEntry;
}

export interface GateEntryValidation {
  readonly valid: boolean;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly pass?: VisitorPass;
  readonly requiresResidentApproval?: boolean;
  readonly approvalRequestId?: string;
  readonly watchlistMatch?: boolean;
  readonly watchlistEntry?: WatchlistEntry;
  readonly hostAccessActive?: boolean;
}

export interface ValidationContext {
  readonly gateContext: GateContext;
  readonly currentTime: Date;
  readonly actorUserId: string;
  readonly actorType: 'GUARD' | 'SYSTEM_POLICY' | 'SECURITY_SUPERVISOR';
}

export class GateContextService {
  private static instance: GateContextService;

  static getInstance(): GateContextService {
    if (!GateContextService.instance) {
      GateContextService.instance = new GateContextService();
    }
    return GateContextService.instance;
  }

  async getGateContext(gateId: string, guardId: string, guardName: string): Promise<GateContext | null> {
    const gates = mockStore.getState().gates || [];
    const gate = gates.find(g => g.gateId === gateId);
    if (!gate) return null;

    const guards = mockStore.getState().guards || [];
    const guard = guards.find(g => g.id === guardId);
    if (!guard || guard.societyId !== gate.societyId) return null;

    return {
      gateId: gate.gateId,
      gateName: gate.name,
      societyId: gate.societyId,
      guardId,
      guardName,
      isOnline: true,
      allowedEntrySources: gate.allowedEntrySources,
      allowedVisitorCategories: gate.allowedVisitorCategories,
      requiresGuard: gate.requiresGuard,
      emergencyBypassEnabled: gate.emergencyBypassEnabled,
      maxConcurrentVisitors: gate.maxConcurrentVisitors,
      currentOccupancy: gate.currentOccupancy,
    };
  }

  validateGateAccess(
    gateContext: GateContext,
    entrySource: string,
    visitorCategory: string,
    isEmergency: boolean = false
  ): { valid: boolean; errorCode?: string; errorMessage?: string } {
    if (gateContext.isOnline === false) {
      return { valid: false, errorCode: 'GATE_OFFLINE', errorMessage: 'Gate is currently offline' };
    }

    if (!gateContext.allowedEntrySources.includes(entrySource)) {
      return { valid: false, errorCode: 'ENTRY_SOURCE_NOT_ALLOWED', errorMessage: `Entry source ${entrySource} not allowed at this gate` };
    }

    if (!gateContext.allowedVisitorCategories.includes(visitorCategory)) {
      return { valid: false, errorCode: 'VISITOR_CATEGORY_NOT_ALLOWED', errorMessage: `Visitor category ${visitorCategory} not allowed at this gate` };
    }

    if (isEmergency && !gateContext.emergencyBypassEnabled) {
      return { valid: false, errorCode: 'EMERGENCY_BYPASS_DISABLED', errorMessage: 'Emergency bypass not enabled for this gate' };
    }

    if (gateContext.maxConcurrentVisitors && gateContext.currentOccupancy >= gateContext.maxConcurrentVisitors) {
      return { valid: false, errorCode: 'GATE_AT_CAPACITY', errorMessage: 'Gate has reached maximum concurrent visitors' };
    }

    return { valid: true };
  }

  validateGuardSession(guardId: string, gateId: string): { valid: boolean; errorCode?: string; errorMessage?: string } {
    const guards = mockStore.getState().guards || [];
    const guard = guards.find(g => g.id === guardId);
    if (!guard) {
      return { valid: false, errorCode: 'GUARD_NOT_FOUND', errorMessage: 'Guard not found' };
    }
    if (guard.status !== 'ACTIVE') {
      return { valid: false, errorCode: 'GUARD_INACTIVE', errorMessage: 'Guard session is not active' };
    }
    if (guard.gateId !== gateId) {
      return { valid: false, errorCode: 'GUARD_GATE_MISMATCH', errorMessage: 'Guard is not assigned to this gate' };
    }
    return { valid: true };
  }
}

export class VisitorValidationService {
  private static instance: VisitorValidationService;

  static getInstance(): VisitorValidationService {
    if (!VisitorValidationService.instance) {
      VisitorValidationService.instance = new VisitorValidationService();
    }
    return VisitorValidationService.instance;
  }

  async validatePassAtGate(
    credential: string,
    gateContext: GateContext,
    context: ValidationContext
  ): Promise<VisitorValidationResult> {
    const visitors = mockStore.getState().visitors || [];
    const pass = visitors.find(v =>
      v.id === credential ||
      v.qrCredential === credential ||
      v.otpCredential === credential
    );

    if (!pass) {
      return { valid: false, errorCode: 'PASS_NOT_FOUND', errorMessage: 'Visitor pass not found' };
    }

    if (pass.societyId !== gateContext.societyId) {
      return { valid: false, errorCode: 'CROSS_SOCIETY_PASS', errorMessage: 'Pass belongs to a different society' };
    }

    if (!unifiedVisitorStateMachine.isVisitorPassActive(pass.status)) {
      const errorMap: Record<VisitorPassStatus, { code: string; message: string }> = {
        EXPIRED: { code: 'PASS_EXPIRED', message: 'This visitor pass has expired' },
        CANCELLED: { code: 'PASS_CANCELLED', message: 'This visitor pass was cancelled by the resident' },
        REVOKED: { code: 'PASS_REVOKED', message: 'This visitor pass has been revoked' },
        COMPLETED: { code: 'PASS_COMPLETED', message: 'This visitor pass has already been used' },
        REJECTED: { code: 'PASS_REJECTED', message: 'This visitor pass was rejected' },
        DENIED: { code: 'PASS_DENIED', message: 'This visitor pass was denied' },
      };
      const error = errorMap[pass.status] || { code: 'PASS_INVALID_STATUS', message: 'This visitor pass cannot be used for entry' };
      return { valid: false, errorCode: error.code, errorMessage: error.message };
    }

    if (pass.credentialExpiresAt && new Date(pass.credentialExpiresAt) < context.currentTime) {
      return { valid: false, errorCode: 'CREDENTIAL_EXPIRED', errorMessage: 'Entry credential has expired' };
    }

    if (pass.expectedExitAt && new Date(pass.expectedExitAt) < context.currentTime) {
      return { valid: false, errorCode: 'PASS_EXPIRED', errorMessage: 'Visitor pass validity window has ended' };
    }

    const watchlistMatch = await this.checkWatchlist(pass.visitorName, pass.visitorPhone);
    if (watchlistMatch) {
      return { valid: false, errorCode: 'WATCHLIST_MATCH', errorMessage: 'Visitor matches watchlist entry', watchlistMatch: true, watchlistEntry: watchlistMatch };
    }

    const hostAccessActive = await this.validateHostAccess(pass);
    if (!hostAccessActive) {
      return { valid: false, errorCode: 'HOST_ACCESS_INACTIVE', errorMessage: 'Host no longer has access to this unit' };
    }

    return { valid: true, pass };
  }

  async validateGateEntry(
    pass: VisitorPass,
    gateContext: GateContext,
    context: ValidationContext
  ): Promise<GateEntryValidation> {
    if (pass.status === 'CHECKED_IN') {
      return { valid: false, errorCode: 'ALREADY_CHECKED_IN', errorMessage: 'Visitor is already inside the society' };
    }

    if (pass.status === 'PRESENTED') {
      return { valid: false, errorCode: 'ALREADY_PRESENTED', errorMessage: 'Visitor has already presented at gate' };
    }

    if (context.currentTime < new Date(pass.expectedEntryAt)) {
      const minutesEarly = Math.ceil((new Date(pass.expectedEntryAt).getTime() - context.currentTime.getTime()) / 60000);
      return { valid: false, errorCode: 'EARLY_ARRIVAL', errorMessage: `Visitor arrived ${minutesEarly} minutes early`, requiresResidentApproval: true };
    }

    if (pass.expectedExitAt && context.currentTime > new Date(pass.expectedExitAt)) {
      return { valid: false, errorCode: 'LATE_ARRIVAL', errorMessage: 'Visitor arrived after validity window ended' };
    }

    const watchlistMatch = await this.checkWatchlist(pass.visitorName, pass.visitorPhone);
    if (watchlistMatch) {
      return { valid: false, errorCode: 'WATCHLIST_MATCH', errorMessage: 'Visitor matches watchlist entry', watchlistMatch: true, watchlistEntry: watchlistMatch };
    }

    const hostAccessActive = await this.validateHostAccess(pass);
    if (!hostAccessActive) {
      return { valid: false, errorCode: 'HOST_ACCESS_INACTIVE', errorMessage: 'Host no longer has access to this unit' };
    }

    return { valid: true, pass };
  }

  private async checkWatchlist(visitorName: string, visitorPhone?: string): Promise<WatchlistEntry | null> {
    const watchlist = mockStore.getState().watchlistEntries || [];
    return watchlist.find(w =>
      w.status === 'ACTIVE' &&
      (w.visitorName.toLowerCase() === visitorName.toLowerCase() ||
       (visitorPhone && w.visitorPhone === visitorPhone))
    ) || null;
  }

  private async validateHostAccess(pass: VisitorPass): Promise<boolean> {
    const residences = mockStore.getState().residences || [];
    const residence = residences.find(r =>
      r.unitId === pass.unitId &&
      r.status === 'ACTIVE'
    );
    return !!residence;
  }

  async checkWatchlistForApproval(
    visitorName: string,
    visitorPhone: string,
    flatNumber: string,
    societyId: string
  ): Promise<WatchlistEntry | null> {
    return this.checkWatchlist(visitorName, visitorPhone);
  }
}

export class GateEntryService {
  private static instance: GateEntryService;

  static getInstance(): GateEntryService {
    if (!GateEntryService.instance) {
      GateEntryService.instance = new GateEntryService();
    }
    return GateEntryService.instance;
  }

  async recordEntry(
    pass: VisitorPass,
    gateContext: GateContext,
    entrySource: string,
    approvalSource: string,
    vehicleRegistration?: string,
    vehicleType?: string,
    isOffline: boolean = false,
    idempotencyKey?: string
  ): Promise<{ success: boolean; errorCode?: string; errorMessage?: string; entryId?: string; dataVersion: number }> {
    const key = idempotencyKey || createIdempotencyKey(`gate-entry-${pass.passId}-${gateContext.gateId}-${Date.now()}`);

    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, gateContext.societyId);
    if (idempotencyResult.exists) {
      return {
        success: true,
        entryId: idempotencyResult.record?.entryId,
        dataVersion: idempotencyResult.record?.dataVersion || 1,
      };
    }

    const now = new Date();
    const entry: GateEntry = {
      entryId: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      passId: pass.passId,
      personId: pass.personId,
      visitorName: pass.visitorName,
      visitorPhone: pass.visitorPhone,
      visitorCategory: pass.visitorCategory,
      flatNumber: pass.flatNumber,
      unitId: pass.unitId,
      gateId: gateContext.gateId,
      gateName: gateContext.gateName,
      guardId: gateContext.guardId,
      guardName: gateContext.guardName,
      entryType: 'PRE_APPROVED',
      entrySource: entrySource as any,
      approvalSource: approvalSource as any,
      status: 'CHECKED_IN',
      entryAt: now.toISOString(),
      vehicleRegistration,
      vehicleType: vehicleType as any,
      isOfflineCapture: false,
      dataVersion: 1,
      societyId: gateContext.societyId,
      unitId: pass.unitId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const visitors = mockStore.getState().visitors || [];
    const passIndex = visitors.findIndex(v => v.passId === pass.passId);
    if (passIndex !== -1) {
      visitors[passIndex] = {
        ...visitors[passIndex],
        status: 'CHECKED_IN',
        actualEntryAt: now.toISOString(),
        entryGateId: gateContext.gateId,
        entryGateName: gateContext.gateName,
        dataVersion: (visitors[passIndex].dataVersion || 0) + 1,
      };
    }

    mockStore.getState().gateEntries?.push(entry);
    mockStore.notify();

    await gateIdempotencyService.completeIdempotency(key, gateContext.societyId, entry.entryId, { entryId: entry.entryId, dataVersion: entry.dataVersion });

    createAuditEntry({
      actorUserId: gateContext.guardId,
      actorType: 'GUARD',
      societyId: gateContext.societyId,
      action: 'GATE_ENTRY_RECORDED',
      entityType: 'GateEntry',
      entityId: entry.entryId,
      newState: { status: 'CHECKED_IN', passId: pass.passId, gateId: gateContext.gateId },
      idempotencyKey: key,
      source: 'GATE_DEVICE',
      outcome: 'SUCCESS',
    });

    return { success: true, entryId: entry.entryId, dataVersion: entry.dataVersion };
  }

  async recordExit(
    pass: VisitorPass,
    gateContext: GateContext,
    vehicleRegistration?: string,
    isOffline: boolean = false,
    idempotencyKey?: string
  ): Promise<{ success: boolean; errorCode?: string; errorMessage?: string; exitId?: string; durationMinutes: number; dataVersion: number }> {
    const key = idempotencyKey || createIdempotencyKey(`gate-exit-${pass.passId}-${gateContext.gateId}-${Date.now()}`);

    const idempotencyResult = await gateIdempotencyService.checkIdempotency(key, gateContext.societyId);
    if (idempotencyResult.exists) {
      return {
        success: true,
        exitId: idempotencyResult.record?.exitId,
        durationMinutes: idempotencyResult.record?.durationMinutes || 0,
        dataVersion: idempotencyResult.record?.dataVersion || 1,
      };
    }

    if (pass.status !== 'CHECKED_IN') {
      return { success: false, errorCode: 'NOT_CHECKED_IN', errorMessage: 'Visitor is not currently checked in', durationMinutes: 0, dataVersion: 0 };
    }

    const now = new Date();
    const entryTime = pass.actualEntryAt ? new Date(pass.actualEntryAt) : now;
    const durationMinutes = Math.floor((now.getTime() - entryTime.getTime()) / 60000);

    const exit: GateExit = {
      exitId: `exit-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      entryId: '', // Would be linked to entry
      passId: pass.passId,
      gateId: gateContext.gateId,
      gateName: gateContext.gateName,
      guardId: gateContext.guardId,
      guardName: gateContext.guardName,
      exitAt: now.toISOString(),
      durationMinutes,
      isOfflineCapture: false,
      dataVersion: 1,
      societyId: gateContext.societyId,
      unitId: pass.unitId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const visitors = mockStore.getState().visitors || [];
    const passIndex = visitors.findIndex(v => v.passId === pass.passId);
    if (passIndex !== -1) {
      visitors[passIndex] = {
        ...visitors[passIndex],
        status: 'CHECKED_OUT',
        actualExitAt: now.toISOString(),
        exitGateId: gateContext.gateId,
        exitGateName: gateContext.gateName,
        dataVersion: (visitors[passIndex].dataVersion || 0) + 1,
      };
    }

    mockStore.getState().gateExits?.push(exit);
    mockStore.notify();

    await gateIdempotencyService.completeIdempotency(key, gateContext.societyId, exit.exitId, { exitId: exit.exitId, durationMinutes, dataVersion: exit.dataVersion });

    createAuditEntry({
      actorUserId: gateContext.guardId,
      actorType: 'GUARD',
      societyId: gateContext.societyId,
      action: 'GATE_EXIT_RECORDED',
      entityType: 'GateExit',
      entityId: exit.exitId,
      newState: { status: 'CHECKED_OUT', passId: pass.passId, gateId: gateContext.gateId, durationMinutes },
      idempotencyKey: key,
      source: 'GATE_DEVICE',
      outcome: 'SUCCESS',
    });

    return { success: true, exitId: exit.exitId, durationMinutes, dataVersion: exit.dataVersion };
  }

  async recordEmergencyBypass(
    gateContext: GateContext,
    reason: string,
    vehicleRegistration?: string,
    vehicleType?: string,
    idempotencyKey?: string
  ): Promise<{ success: boolean; errorCode?: string; errorMessage?: string; entryId?: string; dataVersion: number }> {
    const key = idempotencyKey || createIdempotencyKey(`emergency-bypass-${gateContext.gateId}-${Date.now()}`);

    const now = new Date();
    const entry: GateEntry = {
      entryId: `emergency-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      passId: 'EMERGENCY',
      visitorName: `EMERGENCY: ${reason}`,
      visitorCategory: 'EMERGENCY',
      flatNumber: 'ALL_CAMPUS',
      unitId: 'ALL',
      gateId: gateContext.gateId,
      gateName: gateContext.gateName,
      guardId: gateContext.guardId,
      guardName: gateContext.guardName,
      entryType: 'EMERGENCY_BYPASS',
      entrySource: 'EMERGENCY_BYPASS',
      approvalSource: 'SYSTEM_POLICY',
      status: 'CHECKED_IN',
      entryAt: now.toISOString(),
      vehicleRegistration,
      vehicleType: vehicleType as any,
      isOfflineCapture: false,
      dataVersion: 1,
      societyId: gateContext.societyId,
      unitId: 'ALL',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    mockStore.getState().gateEntries?.push(entry);
    mockStore.notify();

    await gateIdempotencyService.completeIdempotency(key, gateContext.societyId, entry.entryId, { entryId: entry.entryId, dataVersion: entry.dataVersion });

    createAuditEntry({
      actorUserId: gateContext.guardId,
      actorType: 'GUARD',
      societyId: gateContext.societyId,
      action: 'EMERGENCY_BYPASS_RECORDED',
      entityType: 'GateEntry',
      entityId: entry.entryId,
      newState: { status: 'CHECKED_IN', reason, gateId: gateContext.gateId },
      idempotencyKey: key,
      source: 'GATE_DEVICE',
      outcome: 'SUCCESS',
    });

    return { success: true, entryId: entry.entryId, dataVersion: entry.dataVersion };
  }
}

export const gateContextService = GateContextService.getInstance();
export const visitorValidationService = VisitorValidationService.getInstance();
export const gateEntryService = GateEntryService.getInstance();
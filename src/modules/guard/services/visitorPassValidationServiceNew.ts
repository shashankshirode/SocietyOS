import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import type {
  Visitor,
  VisitorPassStatus,
  VisitorType,
  EntrySource,
  ApprovalSource,
  VehicleType,
  WatchlistEntry,
} from '../../../shared/types/visitorPhase8.types';
import type { VisitorPassValidationResult, VisitorPassValidationContext } from '../../../shared/types/visitorPhase8.types';
import { visitorStateMachine } from './visitorStateMachine';

export interface QrOtpToken {
  visitorId: string;
  otp: string;
  qrCodeData: string;
  expiresAt: string;
  issuedAt: string;
  nonce: string;
}

export interface PassValidationResult extends VisitorPassValidationResult {
  gateEventId?: string;
  requiresResidentNotification?: boolean;
}

function generateSecureOtp(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(array[0] % 900000 + 100000).padStart(6, '0');
}

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function generateQrCodeData(visitorId: string, otp: string): string {
  const payload = {
    v: visitorId,
    o: otp,
    t: Date.now(),
    n: generateNonce(),
  };
  return btoa(JSON.stringify(payload));
}

function parseQrCodeData(qrCodeData: string): QrOtpToken | null {
  try {
    const decoded = atob(qrCodeData);
    const parsed = JSON.parse(decoded);
    if (!parsed.v || !parsed.o || !parsed.t || !parsed.n) {
      return null;
    }
    return {
      visitorId: parsed.v,
      otp: parsed.o,
      qrCodeData: qrCodeData,
      expiresAt: new Date(parsed.t + 4 * 60 * 60 * 1000).toISOString(),
      issuedAt: new Date(parsed.t).toISOString(),
      nonce: parsed.n,
    };
  } catch {
    return null;
  }
}

export const visitorPassValidationService = {
  generateOtp: generateSecureOtp,

  generateQrCode(visitorId: string): { otp: string; qrCodeData: string; expiresAt: string } {
    const otp = generateSecureOtp();
    const qrCodeData = generateQrCodeData(visitorId, otp);
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    return { otp, qrCodeData, expiresAt };
  },

  parseQrCode: parseQrCodeData,

  async validatePass(
    context: VisitorPassValidationContext,
    visitors: Visitor[],
    watchlist: WatchlistEntry[],
    gates: Map<string, { id: string; allowedVisitorTypes: VisitorType[] }>
  ): Promise<PassValidationResult> {
    const now = new Date(context.currentTime);
    const gate = gates.get(context.gateId);

    const pass = visitors.find(
      (v) => v.otp === context.passCode || v.id === context.passCode || v.qrCodeData === context.passCode
    );

    if (!pass) {
      return {
        isValid: false,
        denialReason: 'Invalid pass code or QR code',
        status: 'INVALID',
        message: 'Pass not found. Please verify and try again.',
      };
    }

    if (pass.societyId !== context.societyId) {
      return {
        isValid: false,
        denialReason: 'Cross-society access denied',
        status: 'INVALID',
        message: 'This pass is not valid for this society.',
      };
    }

    if (gate && gate.allowedVisitorTypes.length > 0 && !gate.allowedVisitorTypes.includes(pass.type)) {
      return {
        isValid: false,
        denialReason: `Visitor type ${pass.type} not allowed at this gate`,
        status: 'INVALID',
        message: `This gate does not allow ${pass.type} visitors.`,
      };
    }

    const watchlistMatch = watchlist.find(
      (w) =>
        w.societyId === context.societyId &&
        w.status === 'ACTIVE' &&
        (w.visitorPhone === pass.phone || (w.visitorId && w.visitorId === pass.id)) &&
        (!w.effectiveFromIso || new Date(w.effectiveFromIso) <= now) &&
        (!w.effectiveUntilIso || new Date(w.effectiveUntilIso) >= now)
    );

    if (watchlistMatch) {
      if (watchlistMatch.autoDenyEntry) {
        return {
          isValid: false,
          denialReason: 'Visitor is on watchlist',
          watchlistWarning: true,
          watchlistId: watchlistMatch.id,
          watchlistReason: watchlistMatch.reason,
          status: 'WATCHLIST_MATCH',
          message: 'Visitor is on watchlist. Entry denied.',
        };
      }
      return {
        isValid: true,
        pass: this.mapToGatePass(pass),
        watchlistWarning: true,
        watchlistId: watchlistMatch.id,
        watchlistReason: watchlistMatch.reason,
        status: 'VALID',
        message: 'Pass validated (watchlist match - escort required)',
        requiresResidentNotification: true,
      };
    }

    const passStatus = pass.approvalStatus || pass.status;
    if (!visitorStateMachine.isVisitorPassActive(passStatus as VisitorPassStatus)) {
      return {
        isValid: false,
        denialReason: `Pass status: ${passStatus}`,
        status: 'INVALID',
        message: `Pass is not valid for entry. Current status: ${passStatus}`,
      };
    }

    if (pass.validityEndAtIso && new Date(pass.validityEndAtIso) < now) {
      return {
        isValid: false,
        denialReason: 'Pass expired',
        status: 'EXPIRED',
        message: 'Visitor pass has expired.',
      };
    }

    if (pass.actualEntryAtIso && !pass.actualExitAtIso) {
      return {
        isValid: false,
        denialReason: 'Visitor already inside',
        status: 'INVALID',
        message: 'Visitor is already checked in.',
      };
    }

    if (context.entrySource === 'QR' || context.entrySource === 'OTP') {
      const token = parseQrCodeData(context.passCode);
      if (token && token.visitorId !== pass.id) {
        return {
          isValid: false,
          denialReason: 'QR code mismatch',
          status: 'INVALID',
          message: 'QR code does not match this visitor pass.',
        };
      }
      if (token && new Date(token.expiresAt) < now) {
        return {
          isValid: false,
          denialReason: 'QR code expired',
          status: 'EXPIRED',
          message: 'QR code has expired. Please generate a new pass.',
        };
      }
    }

    const requiresApproval = pass.status === 'WAITING_APPROVAL' || pass.status === 'PRESENTED';

    return {
      isValid: true,
      pass: this.mapToGatePass(pass),
      requiresApproval,
      status: 'VALID',
      message: 'Pass validated successfully',
    };
  },

  mapToGatePass(visitor: Visitor) {
    return {
      id: visitor.id,
      visitorName: visitor.name,
      visitorPhone: visitor.phone,
      visitorType: visitor.type,
      visitingFlat: visitor.flatNumber,
      residentName: 'Resident',
      residentPhone: visitor.phone,
      expectedTime: visitor.expectedTime,
      expectedDate: visitor.expectedDate,
      validityWindow: visitor.validityWindowMinutes ? `${visitor.validityWindowMinutes} min` : '4 Hours',
      otp: visitor.otp,
      qrCode: visitor.qrCode,
      qrCodeData: visitor.qrCodeData,
      qrCodeExpiryAtIso: visitor.qrCodeExpiryAtIso,
      approvalStatus: visitor.approvalStatus || visitor.status,
      approvalSource: visitor.approvalSource || 'PRE_APPROVED',
      vehicleNumber: visitor.vehicleNumber,
      vehicleType: visitor.vehicleNumber ? 'CAR' : undefined,
      purpose: visitor.purpose,
      peopleCount: 1,
      specialInstructions: undefined,
      watchlistWarning: visitor.watchlistWarning,
      watchlistId: visitor.watchlistId,
      watchlistReason: visitor.watchlistReason,
      previousVisitCount: visitor.previousVisitCount || 0,
      actualEntryTime: visitor.actualEntryTime,
      actualExitTime: visitor.actualExitTime,
      validityStartAtIso: visitor.validityStartAtIso,
      validityEndAtIso: visitor.validityEndAtIso,
      validityWindowMinutes: visitor.validityWindowMinutes,
    };
  },

  async checkWatchlist(
    visitorPhone: string,
    visitorId: string | undefined,
    societyId: string,
    watchlist: WatchlistEntry[]
  ): Promise<{
    match: boolean;
    watchlistId?: string;
    reason?: string;
    autoDeny: boolean;
    requiresEscort: boolean;
    notifyOnAttempt: boolean;
  }> {
    const now = new Date();
    const match = watchlist.find(
      (w) =>
        w.societyId === societyId &&
        w.status === 'ACTIVE' &&
        ((w.visitorPhone && w.visitorPhone === visitorPhone) ||
          (visitorId && w.visitorId && w.visitorId === visitorId)) &&
        (!w.effectiveFromIso || new Date(w.effectiveFromIso) <= now) &&
        (!w.effectiveUntilIso || new Date(w.effectiveUntilIso) >= now)
    );

    if (match) {
      return {
        match: true,
        watchlistId: match.id,
        reason: match.reason,
        autoDeny: match.autoDenyEntry,
        requiresEscort: match.requiresEscort,
        notifyOnAttempt: match.notifyOnAttempt,
      };
    }

    return { match: false, autoDeny: false, requiresEscort: false, notifyOnAttempt: false };
  },

  async getVisitorCurrentStatus(
    visitorId: string,
    visitors: Visitor[]
  ): Promise<{
    isInside: boolean;
    status: string;
    entryTime?: string;
    exitTime?: string;
    currentGate?: string;
  }> {
    const visitor = visitors.find((v) => v.id === visitorId);

    if (!visitor) {
      return { isInside: false, status: 'NOT_FOUND' };
    }

    const isInside = visitorStateMachine.isVisitorCurrentlyInside(visitor.status as VisitorStatus);
    return {
      isInside,
      status: visitor.status,
      entryTime: visitor.actualEntryAtIso,
      exitTime: visitor.actualExitAtIso,
      currentGate: visitor.checkInGateId,
    };
  },
};

export default visitorPassValidationService;
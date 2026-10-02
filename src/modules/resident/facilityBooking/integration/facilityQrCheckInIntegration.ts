import type { VaultActor, VaultClock } from '../../../../../core/identity/personaRegistry';
import type { FacilityBooking } from '../../../models/facilityBooking.models';
import type { FacilityBookingQrPass } from '../../../models/facilityBooking.models';

export interface QrVerificationPorts {
  readonly clock: VaultClock;
  readonly verifyToken: (input: {
    token: string;
    bookingId: string;
    facilityId: string;
    societyId: string;
  }) => Promise<{
    valid: boolean;
    bookingId?: string;
    errorCode?: string;
    errorMessage?: string;
  }>;
  readonly issueQrPass: (input: {
    bookingId: string;
    facilityId: string;
    residenceId: string;
    unitId: string;
    startsAt: string;
    endsAt: string;
    checkInStartOffsetMinutes: number;
    checkInEndOffsetMinutes: number;
  }) => Promise<{ token: string; fallbackCode: string; validFrom: string; validUntil: string }>;
  readonly revokeQrPass: (bookingId: string) => Promise<void>;
  readonly logCheckIn: (input: {
    bookingId: string;
    facilityId: string;
    residenceId: string;
    userId: string;
    checkInMethod: 'QR' | 'MANUAL';
    checkedInAt: string;
  }) => Promise<void>;
}

export interface CheckInResult {
  success: boolean;
  checkInStatus?: 'CHECKED_IN' | 'ALREADY_CHECKED_IN' | 'IN_USE';
  errorCode?: string;
  errorMessage?: string;
}

export interface QrPass {
  token: string;
  fallbackCode: string;
  validFrom: string;
  validUntil: string;
  presentationLocation: string;
  active: boolean;
}

export class FacilityQrCheckInService {
  constructor(private ports: QrVerificationPorts) {}

  async generateQrPass(booking: FacilityBooking): Promise<QrPass> {
    const checkInStartOffset = 30;
    const checkInEndOffset = 60;

    const validFrom = new Date(Date.parse(booking.startsAt) - 30 * 60 * 1000).toISOString();
    const validUntil = new Date(Date.parse(booking.endsAt) + 60 * 60 * 1000).toISOString();

    const result = await this.ports.issueQrPass({
      bookingId: booking.id,
      facilityId: booking.facilityId,
      residenceId: booking.residenceId,
      unitId: booking.unitId,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      checkInStartOffsetMinutes: 30,
      checkInEndOffsetMinutes: 60,
    });

    return {
      token: result.token,
      fallbackCode: result.fallbackCode,
      validFrom: result.validFrom,
      validUntil: result.validUntil,
      presentationLocation: 'Facility Entrance',
      active: true,
    };
  }

  async checkIn(
    actor: VaultActor,
    booking: FacilityBooking,
    token: string,
  ): Promise<CheckInResult> {
    if (booking.status !== 'CONFIRMED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: 'Booking is not in a check-in eligible state.' };
    }

    if (booking.checkInStatus === 'CHECKED_IN' || booking.checkInStatus === 'IN_USE') {
      return { success: false, errorCode: 'ALREADY_CHECKED_IN', errorMessage: 'Already checked in.' };
    }

    if (booking.checkInStatus === 'EXPIRED' || booking.checkInStatus === 'CANCELLED') {
      return { success: false, errorCode: 'INVALID_STATUS', errorMessage: 'Check-in not available for this booking.' };
    }

    const now = this.ports.clock.now().toISOString();
    const checkInStart = new Date(Date.parse(booking.startsAt) - 30 * 60 * 1000).toISOString();
    const checkInEnd = new Date(Date.parse(booking.endsAt) + 60 * 60 * 1000).toISOString();

    if (Date.parse(now) < Date.parse(checkInStart)) {
      return { success: false, errorCode: 'TOO_EARLY', errorMessage: 'Check-in is not yet open for this booking.' };
    }

    if (Date.parse(now) > Date.parse(checkInEnd)) {
      return { success: false, errorCode: 'TOO_LATE', errorMessage: 'Check-in window has closed for this booking.' };
    }

    const verification = await this.ports.verifyToken({
      token,
      bookingId: booking.id,
      facilityId: booking.facilityId,
      societyId: booking.societyId,
    });

    if (!verification.valid) {
      return { success: false, errorCode: verification.errorCode || 'INVALID_TOKEN', errorMessage: verification.errorMessage || 'Invalid or expired QR code.' };
    }

    await this.ports.logCheckIn({
      bookingId: booking.id,
      facilityId: booking.facilityId,
      residenceId: booking.residenceId,
      userId: actor.userId,
      checkInMethod: 'QR',
      checkedInAt: this.ports.clock.now().toISOString(),
    });

    return { success: true, checkInStatus: 'CHECKED_IN' };
  }

  async revokeQrPass(booking: FacilityBooking): Promise<void> {
    await this.ports.revokeQrPass(booking.id);
  }

  async validateQrForCheckIn(
    booking: FacilityBooking,
    token: string,
  ): Promise<{ valid: boolean; errorCode?: string; errorMessage?: string }> {
    const verification = await this.ports.verifyToken({
      token,
      bookingId: booking.id,
      facilityId: booking.facilityId,
      societyId: booking.societyId,
    });

    return verification;
  }
}

export function createFacilityQrCheckInService(ports: QrVerificationPorts): FacilityQrCheckInService {
  return new FacilityQrCheckInService(ports);
}
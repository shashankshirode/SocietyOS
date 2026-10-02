import type { VaultActor, VaultClock } from '../../../../../core/identity/personaRegistry';
import type { FacilityBooking } from '../../../models/facilityBooking.models';
import type { FacilityBookingPriceBreakdown } from '../../../models/facilityBooking.models';

export interface FinancePorts {
  readonly clock: VaultClock;
  readonly createPaymentObligation: (input: {
    residenceId: string;
    societyId: string;
    facilityId: string;
    bookingId: string;
    amountInMinorUnits: number;
    currencyCode: string;
    description: string;
    dueAt: string;
    metadata?: Record<string, unknown>;
  }) => Promise<{ paymentObligationId: string; paymentUrl?: string }>;
  readonly recordPayment: (input: {
    paymentObligationId: string;
    amountInMinorUnits: number;
    method: string;
    transactionId: string;
    paidAt: string;
  }) => Promise<{ success: boolean; receiptNumber?: string }>;
  readonly recordDeposit: (input: {
    residenceId: string;
    societyId: string;
    facilityId: string;
    bookingId: string;
    amountInMinorUnits: number;
    currencyCode: string;
    description: string;
    metadata?: Record<string, unknown>;
  }) => Promise<{ depositId: string }>;
  readonly refundDeposit: (input: {
    depositId: string;
    amountInMinorUnits: number;
    reason: string;
    refundMethod: 'ORIGINAL' | 'WALLET' | 'BANK_TRANSFER';
  }) => Promise<{ refundId: string; status: string }>;
  readonly recordDamageCharge: (input: {
    residenceId: string;
    societyId: string;
    facilityId: string;
    bookingId: string;
    amountInMinorUnits: number;
    currencyCode: string;
    description: string;
    evidenceDocumentId?: string;
  }) => Promise<{ chargeId: string }>;
  readonly getDepositBalance: (residenceId: string, societyId: string) => Promise<number>;
}

export interface PaymentResult {
  success: boolean;
  paymentObligationId?: string;
  paymentUrl?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface DepositResult {
  success: boolean;
  depositId?: string;
  errorCode?: string;
  errorMessage?: string;
}

export class FacilityFinanceService {
  constructor(private ports: FinancePorts) {}

  async createBookingPayment(
    actor: VaultActor,
    booking: FacilityBooking,
  ): Promise<PaymentResult> {
    const totalPayable = booking.quote.breakdown.totalPayableInMinorUnits;
    if (totalPayable <= 0) {
      return { success: true, errorMessage: 'No payment required' };
    }

    const dueAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    try {
      const result = await this.ports.createPaymentObligation({
        residenceId: booking.residenceId,
        societyId: booking.societyId,
        facilityId: booking.facilityId,
        bookingId: booking.id,
        amountInMinorUnits: totalPayable,
        currencyCode: booking.quote.currencyCode,
        description: `Facility booking: ${booking.facilityName} on ${booking.startsAt}`,
        dueAt,
        metadata: {
          bookingId: booking.id,
          bookingReference: booking.bookingReference,
          facilityName: booking.facilityName,
        },
      });

      return { success: true, paymentObligationId: result.paymentObligationId, paymentUrl: result.paymentUrl };
    } catch (error) {
      return { success: false, errorCode: 'PAYMENT_OBLIGATION_FAILED', errorMessage: error instanceof Error ? error.message : 'Failed to create payment obligation' };
    }
  }

  async processPaymentCallback(
    actor: VaultActor,
    input: {
      paymentObligationId: string;
      amountInMinorUnits: number;
      method: string;
      transactionId: string;
      paidAt: string;
    },
  ): Promise<{ success: boolean; receiptNumber?: string; errorCode?: string; errorMessage?: string }> {
    try {
      const result = await this.ports.recordPayment({
        paymentObligationId: input.paymentObligationId,
        amountInMinorUnits: input.amountInMinorUnits,
        method: input.method,
        transactionId: input.transactionId,
        paidAt: input.paidAt,
      });

      if (!result.success) {
        return { success: false, errorCode: 'PAYMENT_RECORDING_FAILED', errorMessage: 'Failed to record payment' };
      }

      return { success: true, receiptNumber: result.receiptNumber };
    } catch (error) {
      return { success: false, errorCode: 'PAYMENT_PROCESSING_FAILED', errorMessage: error instanceof Error ? error.message : 'Payment processing failed' };
    }
  }

  async collectDeposit(
    actor: VaultActor,
    booking: FacilityBooking,
  ): Promise<DepositResult> {
    const depositAmount = booking.quote.breakdown.refundableDepositInMinorUnits;
    if (depositAmount <= 0) {
      return { success: true, errorMessage: 'No deposit required' };
    }

    try {
      const result = await this.ports.recordDeposit({
        residenceId: booking.residenceId,
        societyId: booking.societyId,
        facilityId: booking.facilityId,
        bookingId: booking.id,
        amountInMinorUnits: depositAmount,
        currencyCode: booking.quote.currencyCode,
        description: `Security deposit for ${booking.facilityName}`,
        metadata: { bookingId: booking.id, bookingReference: booking.bookingReference },
      });

      return { success: true, depositId: result.depositId };
    } catch (error) {
      return { success: false, errorCode: 'DEPOSIT_COLLECTION_FAILED', errorMessage: error instanceof Error ? error.message : 'Failed to collect deposit' };
    }
  }

  async refundDeposit(
    actor: VaultActor,
    input: {
      depositId: string;
      amountInMinorUnits: number;
      reason: string;
      refundMethod: 'ORIGINAL' | 'WALLET' | 'BANK_TRANSFER';
    },
  ): Promise<{ success: boolean; refundId?: string; status?: string; errorCode?: string; errorMessage?: string }> {
    try {
      const result = await this.ports.refundDeposit({
        depositId: input.depositId,
        amountInMinorUnits: input.amountInMinorUnits,
        reason: input.reason,
        refundMethod: input.refundMethod,
      });

      return { success: true, refundId: result.refundId, status: result.status };
    } catch (error) {
      return { success: false, errorCode: 'DEPOSIT_REFUND_FAILED', errorMessage: error instanceof Error ? error.message : 'Deposit refund failed' };
    }
  }

  async applyDamageCharge(
    actor: VaultActor,
    input: {
      residenceId: string;
      societyId: string;
      facilityId: string;
      bookingId: string;
      amountInMinorUnits: number;
      currencyCode: string;
      description: string;
      evidenceDocumentId?: string;
    },
  ): Promise<{ success: boolean; chargeId?: string; errorCode?: string; errorMessage?: string }> {
    try {
      const result = await this.ports.recordDamageCharge({
        residenceId: input.residenceId,
        societyId: input.societyId,
        facilityId: input.facilityId,
        bookingId: input.bookingId,
        amountInMinorUnits: input.amountInMinorUnits,
        currencyCode: input.currencyCode,
        description: input.description,
        evidenceDocumentId: input.evidenceDocumentId,
      });

      return { success: true, chargeId: result.chargeId };
    } catch (error) {
      return { success: false, errorCode: 'DAMAGE_CHARGE_FAILED', errorMessage: error instanceof Error ? error.message : 'Failed to record damage charge' };
    }
  }

  async calculateDepositRefund(
    booking: FacilityBooking,
    damageAmountInMinorUnits: number,
  ): Promise<number> {
    const depositAmount = booking.quote.breakdown.refundableDepositInMinorUnits;
    const refundable = Math.max(0, depositAmount - damageAmountInMinorUnits);
    return refundable;
  }
}

export function createFacilityFinanceService(ports: FinancePorts): FacilityFinanceService {
  return new FacilityFinanceService(ports);
}
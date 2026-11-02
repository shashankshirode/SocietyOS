import type { Bill, BillStatus, PaymentMethod } from '../../../../shared/types/bill.types';
import { D, type Decoder } from '../../../../core/api/decoders';

export interface BillChargeDto {
  readonly id: string;
  readonly title: string;
  readonly amount: number;
  readonly currencyCode?: string;
}

export interface BillDto {
  readonly id: string;
  readonly title?: string;
  readonly amount?: number;
  readonly dueDate?: string;
  readonly status?: BillStatus;
  readonly charges?: readonly BillChargeDto[];
  readonly paidAmount?: number;
  readonly receiptNumber?: string;
}

export interface ResidentBillListPageDto {
  readonly bills: readonly BillDto[];
  readonly nextCursor: string | null;
  readonly hasMore: boolean;
}

export interface MockPaymentRequestDto {
  readonly billId: string;
  readonly paymentMethod: PaymentMethod;
  readonly amount: number;
}

export interface MockPaymentConfirmation {
  readonly transactionId: string;
  readonly receiptNumber: string;
  readonly paymentDate: string;
}

export const billChargeDtoDecoder: Decoder<BillChargeDto> = D.object({
  id: D.string,
  title: D.string,
  amount: D.number,
  currencyCode: D.optional(D.string),
});

export const billDtoDecoder: Decoder<BillDto> = D.object({
  id: D.string,
  title: D.optional(D.string),
  amount: D.optional(D.number),
  dueDate: D.optional(D.string),
  status: D.optional(D.oneOf([
    'DUE',
    'PAID',
    'OVERDUE',
    'PARTIALLY_PAID',
    'GENERATED',
    'CANCELLED',
  ] as const)),
  charges: D.optional(D.array(billChargeDtoDecoder)),
  paidAmount: D.optional(D.number),
  receiptNumber: D.optional(D.string),
});

export const residentBillListPageDtoDecoder: Decoder<ResidentBillListPageDto> = D.object({
  bills: D.array(billDtoDecoder),
  nextCursor: (input, path = '$') => {
    if (input === null || typeof input === 'string') {
      return { ok: true, value: input };
    }
    return { ok: false, path, expected: 'string or null', received: typeof input, message: `Expected string or null at ${path}` };
  },
  hasMore: D.boolean,
});

export const mockPaymentConfirmationDecoder: Decoder<MockPaymentConfirmation> = D.object({
  transactionId: D.string,
  receiptNumber: D.string,
  paymentDate: D.string,
});

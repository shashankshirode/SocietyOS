import type { Bill, BillLineItem } from '../../../../shared/types/bill.types';
import type { BillChargeDto, BillDto } from './bill.dto';

function mapChargeDtoToLineItem(charge: BillChargeDto): BillLineItem {
  return {
    lineItemId: charge.id,
    type: 'maintenance',
    label: charge.title,
    labelMessageKey: charge.title,
    amount: charge.amount,
    currencyCode: charge.currencyCode ?? 'INR',
    isCredit: false,
  };
}

export function mapBillDtoToDomain(dto: BillDto): Bill {
  return {
    id: dto.id,
    billNumber: dto.billNumber ?? `BILL-${dto.id}`,
    flatNumber: dto.flatNumber ?? '',
    societyName: dto.societyName ?? '',
    title: dto.title ?? 'Maintenance Bill',
    amount: dto.amount ?? 0,
    dueDate: dto.dueDate ?? '',
    status: dto.status ?? 'DUE',
    billingPeriod: dto.billingPeriod ?? '',
    charges: dto.charges ? dto.charges.map(mapChargeDtoToLineItem) : [],
    ...(dto.paidAmount !== undefined ? { paidAmount: dto.paidAmount } : {}),
    ...(dto.lateFee !== undefined ? { lateFee: dto.lateFee } : {}),
    ...(dto.payments ? { payments: [...dto.payments] } : {}),
    ...(dto.notes ? { notes: dto.notes } : {}),
  };
}


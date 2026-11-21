import type { EnglishMessagesType } from '../../../../messages/en';
import type { Bill, BillLineItemType, BillStatus } from '../../../../shared/types/bill.types';
import type { StatusTone } from '../../../../ui/components/StatusPill';

export function getBillStatusPresentation(
  status: BillStatus,
  messages: EnglishMessagesType,
): { label: string; tone: StatusTone } {
  const billing = messages.resident.billing;
  const presentations: Record<BillStatus, { label: string; tone: StatusTone }> = {
    DRAFT: { label: billing.draft, tone: 'muted' },
    GENERATED: { label: billing.generated, tone: 'info' },
    DUE: { label: billing.due, tone: 'warning' },
    PARTIALLY_PAID: { label: billing.partial, tone: 'info' },
    PAID: { label: billing.paid, tone: 'success' },
    OVERDUE: { label: billing.overdue, tone: 'danger' },
    CANCELLED: { label: billing.cancelled, tone: 'neutral' },
  };
  return presentations[status];
}

export function getBillOutstandingAmount(bill: Bill): number {
  if (bill.status === 'PAID' || bill.status === 'CANCELLED') return 0;
  return Math.max(0, bill.amount - (bill.paidAmount ?? 0));
}

export function getPrimaryBillLineItemType(bill: Bill): BillLineItemType {
  return bill.charges.find((item) => item.amount > 0)?.type ?? 'other';
}

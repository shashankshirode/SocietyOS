
import type { Bill } from '../../../../shared/types/bill.types';
import type {
  BillDetailViewModel,
  BillListItemViewModel,
  BillChargeViewModel,
  BillPaymentViewModel,
} from '../data/billing.viewModel.types';
import { safeString, safeNumber, safeArray } from '../../../../shared/data/safeData';
import { safeCurrencyFormat, safeDateFormat } from '../../../../shared/utils/formatters';
import { safeGetStatusPresentation } from '../../../../shared/utils/statusPresentation';


export function mapBillToDetailViewModel(bill: Bill): BillDetailViewModel {
  const statusPresentation = safeGetStatusPresentation(bill.status, 'billing');
  const rawAmount = safeNumber(bill.amount, 0);
  const paidAmount = safeNumber(bill.paidAmount, 0);
  const isPaid = bill.status === 'PAID';
  const remainingAmount = isPaid ? 0 : rawAmount - paidAmount;

  const charges: BillChargeViewModel[] = safeArray(bill.charges).map((c) => ({
    label: safeString(c.label, 'Charge'),
    formattedAmount: safeCurrencyFormat(c.amount, '—'),
  }));

  const payments: BillPaymentViewModel[] = safeArray(bill.payments).map((p) => ({
    id: safeString(p.id, ''),
    formattedAmount: safeCurrencyFormat(p.amountPaid, '—'),
    formattedDate: safeDateFormat(p.paymentDate, '—'),
    paymentMethod: safeString(p.paymentMethod, '—'),
    transactionId: safeString(p.transactionId, '—'),
    receiptNumber: safeString(p.receiptNumber, '—'),
  }));

  return {
    id: safeString(bill.id, ''),
    billNumber: safeString(bill.billNumber, '—'),
    flatNumber: safeString(bill.flatNumber, '—'),
    societyName: safeString(bill.societyName, '—'),
    title: safeString(bill.title, 'Bill'),
    formattedAmount: safeCurrencyFormat(bill.amount, '—'),
    rawAmount,
    formattedDueDate: safeDateFormat(bill.dueDate, '—'),
    statusLabel: statusPresentation.label,
    statusTone: statusPresentation.type,
    billingPeriod: safeString(bill.billingPeriod, '—'),
    formattedPaidAmount: safeCurrencyFormat(bill.paidAmount, '₹0'),
    formattedLateFee: safeCurrencyFormat(bill.lateFee, '₹0'),
    charges,
    payments,
    notes: safeString(bill.notes, ''),
    isPaid,
    formattedRemainingAmount: safeCurrencyFormat(remainingAmount, '₹0'),
    rawRemainingAmount: remainingAmount,
  };
}


export function mapBillToListItemViewModel(bill: Bill): BillListItemViewModel {
  const statusPresentation = safeGetStatusPresentation(bill.status, 'billing');

  return {
    id: safeString(bill.id, ''),
    title: safeString(bill.title, 'Bill'),
    formattedAmount: safeCurrencyFormat(bill.amount, '—'),
    formattedDueDate: safeDateFormat(bill.dueDate, '—'),
    statusLabel: statusPresentation.label,
    statusTone: statusPresentation.type,
    billingPeriod: safeString(bill.billingPeriod, '—'),
    isPaid: bill.status === 'PAID',
  };
}

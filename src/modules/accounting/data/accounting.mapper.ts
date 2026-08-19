import type { ChargeHead, BillingCycle, DraftBill, ManualPaymentRecord, Defaulter, BankTransaction } from '../../../shared/types/accounting.types';
import type { ChargeHeadDTO, BillingCycleDTO, DraftBillDTO, ManualPaymentDTO, DefaulterDTO, BankTransactionDTO } from './accounting.dto';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export const accountingMappers = {
    toChargeHead: (dto: ChargeHeadDTO): ChargeHead => ({
        id: dto.id, name: dto.name,
        type: dto.type as ChargeHead['type'],
        calculationMethod: dto.calculation_method as ChargeHead['calculationMethod'],
        ...includeWhenPresent("defaultAmount", dto.default_amount),
        ...includeWhenPresent("defaultRate", dto.default_rate),
        taxApplicable: dto.tax_applicable,
        isActive: dto.is_active,
        usedInBillingCycle: dto.used_in_billing_cycle,
        ...includeWhenPresent("description", dto.description),
        createdAt: dto.created_at,
        updatedAt: dto.updated_at
    }),
    toBillingCycle: (dto: BillingCycleDTO): BillingCycle => ({
        id: dto.id, cycleName: dto.cycle_name, month: dto.month, year: dto.year,
        billingPeriodStart: dto.billing_period_start,
        billingPeriodEnd: dto.billing_period_end,
        dueDate: dto.due_date,
        status: dto.status as BillingCycle['status'],
        applicableTowers: dto.applicable_towers,
        totalUnits: dto.total_units,
        draftBillsCount: dto.draft_bills_count,
        publishedBillsCount: dto.published_bills_count,
        totalAmount: dto.total_amount,
        collectedAmount: dto.collected_amount,
        outstandingAmount: dto.outstanding_amount,
        chargeHeadIds: dto.charge_head_ids,
        includePenalties: dto.include_penalties,
        includePreviousDues: dto.include_previous_dues,
        ...includeWhenPresent("notes", dto.notes),
        createdBy: dto.created_by, createdAt: dto.created_at,
        ...includeWhenPresent("calculatedAt", dto.calculated_at),
        ...includeWhenPresent("publishedAt", dto.published_at)
    }),
    toDraftBill: (dto: DraftBillDTO): DraftBill => ({
        id: dto.id, billingCycleId: dto.billing_cycle_id,
        unitId: dto.unit_id, unitNumber: dto.unit_number, wing: dto.wing,
        ownerName: dto.owner_name,
        ...includeWhenPresent("tenantName", dto.tenant_name),
        previousDue: dto.previous_due, currentCharges: dto.current_charges,
        penalty: dto.penalty, adjustments: dto.adjustments, totalPayable: dto.total_payable,
        status: dto.status as DraftBill['status'],
        hasWarning: dto.has_warning,
        ...includeWhenPresent("warningMessage", dto.warning_message),
        chargeBreakup: dto.charge_breakup.map(c => ({ chargeHead: c.charge_head, amount: c.amount }))
    }),
    toPayment: (dto: ManualPaymentDTO): ManualPaymentRecord => ({
        id: dto.id, paymentNumber: dto.payment_number,
        unitId: dto.unit_id, unitNumber: dto.unit_number, wing: dto.wing,
        residentName: dto.resident_name, amount: dto.amount,
        paymentMode: dto.payment_mode as ManualPaymentRecord['paymentMode'],
        paymentDate: dto.payment_date, referenceNumber: dto.reference_number,
        ...includeWhenPresent("bankName", dto.bank_name),
        ...includeWhenPresent("chequeNumber", dto.cheque_number),
        ...includeWhenPresent("notes", dto.notes),
        receivedBy: dto.received_by,
        status: dto.status as ManualPaymentRecord['status'],
        ...includeWhenPresent("receiptId", dto.receipt_id),
        ...includeWhenPresent("receiptNumber", dto.receipt_number),
        createdAt: dto.created_at, requiresApproval: dto.requires_approval
    }),
    toDefaulter: (dto: DefaulterDTO): Defaulter => ({
        unitId: dto.unit_id, unitNumber: dto.unit_number, wing: dto.wing,
        residentDisplayName: dto.resident_display_name,
        outstandingAmount: dto.outstanding_amount,
        ageingBucket: dto.ageing_bucket as Defaulter['ageingBucket'],
        ...includeWhenPresent("lastPaymentDate", dto.last_payment_date),
        reminderCount: dto.reminder_count, noticesSent: dto.notices_sent,
        isDisputed: dto.is_disputed,
        ...includeWhenPresent("disputeReason", dto.dispute_reason),
        oldestDueMonth: dto.oldest_due_month
    }),
    toBankTransaction: (dto: BankTransactionDTO): BankTransaction => ({
        id: dto.id, transactionDate: dto.transaction_date,
        bankReference: dto.bank_reference, amount: dto.amount,
        ...includeWhenPresent("probableUnitNumber", dto.probable_unit_number),
        ...includeWhenPresent("probableUnitId", dto.probable_unit_id),
        ...includeWhenPresent("suggestedPaymentId", dto.suggested_payment_id),
        ...includeWhenPresent("matchConfidence", dto.match_confidence),
        status: dto.status as BankTransaction['status'],
        ...includeWhenPresent("matchedBy", dto.matched_by),
        ...includeWhenPresent("matchedAt", dto.matched_at),
        ...includeWhenPresent("rejectionReason", dto.rejection_reason),
        bankName: dto.bank_name,
        ...includeWhenPresent("narration", dto.narration)
    })
};


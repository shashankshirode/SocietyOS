import type { Bill } from '../../../../shared/types/bill.types';
import type { BillDto } from './bill.dto';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
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
        ...includeWhenPresent("paidAmount", dto.paidAmount),
        ...includeWhenPresent("lateFee", dto.lateFee),
        charges: dto.charges ?? [],
        ...includeWhenPresent("payments", dto.payments),
        ...includeWhenPresent("notes", dto.notes)
    };
}


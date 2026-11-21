import { accountingMappers } from '../data/accounting.mapper';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
describe('Accounting Mapper Tests', () => {
    test('should map ChargeHead DTO to Domain model', () => {
        const dto = {
            id: 'ch-001',
            name: 'Monthly Maintenance',
            type: 'MAINTENANCE',
            calculation_method: 'AREA_BASED',
            default_rate: 4.5,
            tax_applicable: false,
            is_active: true,
            used_in_billing_cycle: true,
            description: 'Base maintenance charge',
            created_at: '2020-01-01T00:00:00Z',
            updated_at: '2026-01-01T00:00:00Z',
        };
        const domain = accountingMappers.toChargeHead(dto);
        expect(domain.id).toBe(dto.id);
        expect(domain.name).toBe(dto.name);
        expect(domain.type).toBe('MAINTENANCE');
        expect(domain.calculationMethod).toBe('AREA_BASED');
        expect(domain.taxApplicable).toBe(false);
    });
    test('should map BillingCycle DTO to Domain model', () => {
        const dto = {
            id: 'bc-001',
            cycle_name: 'July 2026',
            month: 'July',
            year: 2026,
            billing_period_start: '2026-07-01',
            billing_period_end: '2026-07-31',
            due_date: '2026-07-15',
            status: 'PUBLISHED',
            applicable_towers: ['A Wing', 'B Wing'],
            total_units: 300,
            draft_bills_count: 0,
            published_bills_count: 300,
            total_amount: 1843000,
            collected_amount: 1560000,
            outstanding_amount: 283000,
            charge_head_ids: ['ch-001'],
            include_penalties: true,
            include_previous_dues: true,
            created_by: 'Meena Kulkarni',
            created_at: '2026-06-28T09:00:00Z',
        };
        const domain = accountingMappers.toBillingCycle(dto);
        expect(domain.id).toBe(dto.id);
        expect(domain.cycleName).toBe(dto.cycle_name);
        expect(domain.status).toBe('PUBLISHED');
    });
    test('should map DraftBill DTO to Domain model', () => {
        const dto = {
            id: 'db-001',
            billing_cycle_id: 'bc-001',
            unit_id: 'unit-001',
            unit_number: 'A-1204',
            wing: 'A Wing',
            owner_name: 'Shashank Shirode',
            previous_due: 0,
            current_charges: 8025,
            penalty: 0,
            adjustments: 0,
            total_payable: 8025,
            status: 'DRAFT',
            has_warning: false,
            charge_breakup: [
                { charge_head: 'Monthly Maintenance', amount: 6925 },
            ],
        };
        const domain = accountingMappers.toDraftBill(dto);
        expect(domain.id).toBe(dto.id);
        expect(domain.totalPayable).toBe(8025);
        expect(getRequiredItem(domain.chargeBreakup, 0, "accounting.mapper.test.ts").chargeHead).toBe('Monthly Maintenance');
    });
    test('should map ManualPayment DTO to Domain model', () => {
        const dto = {
            id: 'pay-001',
            payment_number: 'PAY-2026-0088',
            unit_id: 'unit-001',
            unit_number: 'A-1204',
            wing: 'A Wing',
            resident_name: 'Shashank Shirode',
            amount: 8025,
            payment_mode: 'CHEQUE',
            payment_date: '2026-07-05',
            reference_number: 'CHQ987654',
            received_by: 'Society Treasurer',
            status: 'RECEIPT_GENERATED',
            receipt_id: 'rcpt-001',
            receipt_number: 'RCPT-2026-001',
            created_at: '2026-07-05T12:00:00Z',
            requires_approval: false,
        };
        const domain = accountingMappers.toPayment(dto);
        expect(domain.id).toBe(dto.id);
        expect(domain.paymentNumber).toBe(dto.payment_number);
        expect(domain.paymentMode).toBe('CHEQUE');
    });
    test('should map Defaulter DTO to Domain model', () => {
        const dto = {
            unit_id: 'unit-008',
            unit_number: 'C-0601',
            wing: 'C Wing',
            resident_display_name: 'Nalini Sharma (Owner)',
            outstanding_amount: 28000,
            ageing_bucket: 'ABOVE_90_DAYS',
            last_payment_date: '2025-12-10',
            reminder_count: 6,
            notices_sent: 2,
            is_disputed: false,
            oldest_due_month: 'March 2026',
        };
        const domain = accountingMappers.toDefaulter(dto);
        expect(domain.unitId).toBe(dto.unit_id);
        expect(domain.outstandingAmount).toBe(dto.outstanding_amount);
        expect(domain.ageingBucket).toBe('ABOVE_90_DAYS');
    });
});


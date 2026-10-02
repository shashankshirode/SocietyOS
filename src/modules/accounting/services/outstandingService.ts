import { mockStore } from '../../../core/mockStore/mockStore';
import type {
  OutstandingBalance,
  AgeingBreakdown,
  AgeingReport,
  DefaulterReport,
  DefaulterUnitItem,
  AgeingBucket,
  Invoice,
  PaymentTransaction,
  Adjustment,
} from '../../../shared/types/financial.types';
import { toMinorUnits, fromMinorUnits, addMoney } from './money';

export class OutstandingService {
  private static instance: OutstandingService;

  static getInstance(): OutstandingService {
    if (!OutstandingService.instance) {
      OutstandingService.instance = new OutstandingService();
    }
    return OutstandingService.instance;
  }

  async getOutstandingBalance(unitId: string): Promise<OutstandingBalance> {
    const invoices = (mockStore.getState().invoices ?? []) as Invoice[];
    const payments = (mockStore.getState().paymentTransactions ?? []) as PaymentTransaction[];
    const advances = mockStore.getState().advanceBalances ?? {};
    const adjustments = (mockStore.getState().adjustments ?? []) as Adjustment[];

    const unitInvoices = invoices.filter(
      (i) => i.unitId === unitId && ['PUBLISHED', 'PARTIALLY_PAID', 'OVERDUE'].includes(i.status)
    );
    const unitPayments = payments.filter((p) => p.status === 'SETTLED');

    let totalOutstandingMinor = 0;
    let currentDuesMinor = 0;
    let overdueMinor = 0;

    const now = new Date();

    for (const inv of unitInvoices) {
      const balanceMinor = toMinorUnits(inv.balance);
      if (balanceMinor > 0) {
        totalOutstandingMinor = addMoney(totalOutstandingMinor, balanceMinor);
        const dueDate = new Date(inv.dueDate);
        if (dueDate < now || inv.status === 'OVERDUE') {
          overdueMinor = addMoney(overdueMinor, balanceMinor);
        } else {
          currentDuesMinor = addMoney(currentDuesMinor, balanceMinor);
        }
      }
    }

    const unitAdvance = advances[unitId] ?? 0;
    const unitCreditsMinor = adjustments
      .filter((a) => a.unitId === unitId && a.debitCredit === 'CREDIT')
      .reduce((sum, a) => addMoney(sum, toMinorUnits(a.amount)), 0);

    const ageing = this.calculateAgeingBreakdown(unitInvoices);

    const sortedDueInvoices = [...unitInvoices].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
    const nextDue = sortedDueInvoices[0];

    const sortedPayments = [...unitPayments].sort(
      (a, b) => new Date(b.settledAt ?? '').getTime() - new Date(a.settledAt ?? '').getTime()
    );
    const lastPayment = sortedPayments[0];

    const result: OutstandingBalance = {
      unitId,
      unitNumber: unitInvoices[0]?.unitNumber ?? 'Unit',
      totalOutstanding: fromMinorUnits(totalOutstandingMinor),
      currentDues: fromMinorUnits(currentDuesMinor),
      overdueAmount: fromMinorUnits(overdueMinor),
      credits: fromMinorUnits(unitCreditsMinor),
      advances: unitAdvance,
      ageing,
    };

    if (lastPayment?.settledAt) {
      result.lastPaymentDate = lastPayment.settledAt;
    }
    if (lastPayment?.amount !== undefined) {
      result.lastPaymentAmount = lastPayment.amount;
    }
    if (nextDue?.dueDate) {
      result.nextDueDate = nextDue.dueDate;
    }
    if (nextDue?.balance !== undefined) {
      result.nextDueAmount = nextDue.balance;
    }

    return result;
  }

  calculateAgeingBreakdown(invoices: Invoice[]): AgeingBreakdown {
    const breakdown: AgeingBreakdown = {
      current: 0,
      days1_30: 0,
      days31_60: 0,
      days61_90: 0,
      days91_120: 0,
      days91_180: 0,
      above180: 0,
    };

    const now = new Date();

    for (const inv of invoices) {
      const balance = inv.balance;
      if (balance <= 0) continue;

      const dueDate = new Date(inv.dueDate);
      const diffMs = now.getTime() - dueDate.getTime();
      const daysOverdue = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      if (daysOverdue === 0) {
        breakdown.current = fromMinorUnits(addMoney(toMinorUnits(breakdown.current), toMinorUnits(balance)));
      } else if (daysOverdue <= 30) {
        breakdown.days1_30 = fromMinorUnits(addMoney(toMinorUnits(breakdown.days1_30), toMinorUnits(balance)));
      } else if (daysOverdue <= 60) {
        breakdown.days31_60 = fromMinorUnits(addMoney(toMinorUnits(breakdown.days31_60), toMinorUnits(balance)));
      } else if (daysOverdue <= 90) {
        breakdown.days61_90 = fromMinorUnits(addMoney(toMinorUnits(breakdown.days61_90), toMinorUnits(balance)));
      } else if (daysOverdue <= 120) {
        breakdown.days91_120 = fromMinorUnits(addMoney(toMinorUnits(breakdown.days91_120), toMinorUnits(balance)));
      } else if (daysOverdue <= 180) {
        breakdown.days91_180 = fromMinorUnits(addMoney(toMinorUnits(breakdown.days91_180), toMinorUnits(balance)));
      } else {
        breakdown.above180 = fromMinorUnits(addMoney(toMinorUnits(breakdown.above180), toMinorUnits(balance)));
      }
    }

    return breakdown;
  }

  async getDefaulterReport(societyId: string, asOfDate: string = new Date().toISOString()): Promise<DefaulterReport> {
    const invoices = (mockStore.getState().invoices ?? []) as Invoice[];
    const societyInvoices = invoices.filter(
      (i) => i.societyId === societyId && ['PUBLISHED', 'PARTIALLY_PAID', 'OVERDUE'].includes(i.status)
    );

    const asOfTime = new Date(asOfDate).getTime();
    const unitMap = new Map<string, { totalOverdueMinor: number; oldestDueDate: string; unitNumber: string }>();

    for (const inv of societyInvoices) {
      const dueTime = new Date(inv.dueDate).getTime();
      if (dueTime < asOfTime || inv.status === 'OVERDUE') {
        const balanceMinor = toMinorUnits(inv.balance);
        const existing = unitMap.get(inv.unitId) ?? {
          totalOverdueMinor: 0,
          oldestDueDate: inv.dueDate,
          unitNumber: inv.unitNumber,
        };
        existing.totalOverdueMinor = addMoney(existing.totalOverdueMinor, balanceMinor);
        if (new Date(inv.dueDate).getTime() < new Date(existing.oldestDueDate).getTime()) {
          existing.oldestDueDate = inv.dueDate;
        }
        unitMap.set(inv.unitId, existing);
      }
    }

    const defaulters: DefaulterUnitItem[] = [];
    let totalOutstandingMinor = 0;

    for (const [unitId, data] of unitMap.entries()) {
      if (data.totalOverdueMinor <= 0) continue;

      totalOutstandingMinor = addMoney(totalOutstandingMinor, data.totalOverdueMinor);
      const daysOverdue = Math.max(
        1,
        Math.floor((asOfTime - new Date(data.oldestDueDate).getTime()) / (1000 * 60 * 60 * 24))
      );

      let ageingBucket: AgeingBucket = '0_30_DAYS';
      if (daysOverdue > 180) ageingBucket = 'ABOVE_180_DAYS';
      else if (daysOverdue > 120) ageingBucket = '91_180_DAYS';
      else if (daysOverdue > 90) ageingBucket = '91_120_DAYS';
      else if (daysOverdue > 60) ageingBucket = '61_90_DAYS';
      else if (daysOverdue > 30) ageingBucket = '31_60_DAYS';

      defaulters.push({
        unitId,
        unitNumber: data.unitNumber,
        wing: 'A Wing',
        residentName: 'Resident',
        outstandingAmount: fromMinorUnits(data.totalOverdueMinor),
        overdueAmount: fromMinorUnits(data.totalOverdueMinor),
        ageingBucket,
        reminderCount: 1,
        noticesSent: 1,
        isDisputed: false,
        oldestDueMonth: data.oldestDueDate.substring(0, 7),
        daysOverdue,
      });
    }

    return {
      societyId,
      asOfDate,
      totalDefaulters: defaulters.length,
      totalOutstanding: fromMinorUnits(totalOutstandingMinor),
      defaulters,
    };
  }

  async getAgeingReport(societyId: string, asOfDate: string = new Date().toISOString()): Promise<AgeingReport> {
    const defaulterReport = await this.getDefaulterReport(societyId, asOfDate);
    const buckets: { bucket: AgeingBucket; amount: number; count: number; percentage: number }[] = [
      { bucket: '0_30_DAYS', amount: 0, count: 0, percentage: 0 },
      { bucket: '31_60_DAYS', amount: 0, count: 0, percentage: 0 },
      { bucket: '61_90_DAYS', amount: 0, count: 0, percentage: 0 },
      { bucket: '91_120_DAYS', amount: 0, count: 0, percentage: 0 },
      { bucket: '91_180_DAYS', amount: 0, count: 0, percentage: 0 },
      { bucket: 'ABOVE_180_DAYS', amount: 0, count: 0, percentage: 0 },
    ];

    const unitBreakdown: { unitId: string; unitNumber: string; amount: number; bucket: AgeingBucket }[] = [];

    for (const d of defaulterReport.defaulters) {
      const b = buckets.find((item) => item.bucket === d.ageingBucket);
      if (b) {
        b.amount = fromMinorUnits(addMoney(toMinorUnits(b.amount), toMinorUnits(d.overdueAmount)));
        b.count++;
      }
      unitBreakdown.push({
        unitId: d.unitId,
        unitNumber: d.unitNumber,
        amount: d.overdueAmount,
        bucket: d.ageingBucket,
      });
    }

    return {
      societyId,
      asOfDate,
      totalOutstanding: defaulterReport.totalOutstanding,
      buckets,
      unitBreakdown,
    };
  }
}

export const outstandingService = OutstandingService.getInstance();

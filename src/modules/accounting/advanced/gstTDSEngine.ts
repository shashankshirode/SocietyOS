import {
  GSTReturn,
  GSTInvoice,
  TDSReturn,
  TDSDeduction,
  MonthEndCloseTask,
  MonthEndClosePeriod,
  OpeningBalanceImport,
} from './advancedAccounting.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';

class GSTTDSEngine {
  private gstReturns: Map<string, GSTReturn> = new Map();
  private tdsReturns: Map<string, TDSReturn> = new Map();
  private listeners: Array<(returns: (GSTReturn | TDSReturn)[]) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const gst = localStorage.getItem('gst_returns');
      if (gst) JSON.parse(gst).forEach((r: GSTReturn) => this.gstReturns.set(r.id, r));
      const tds = localStorage.getItem('tds_returns');
      if (tds) JSON.parse(tds).forEach((r: TDSReturn) => this.tdsReturns.set(r.id, r));
    } catch (error) {
      console.error('[GSTTDSEngine] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('gst_returns', JSON.stringify(Array.from(this.gstReturns.values())));
      localStorage.setItem('tds_returns', JSON.stringify(Array.from(this.tdsReturns.values())));
    } catch (error) {
      console.error('[GSTTDSEngine] Failed to save to storage:', error);
    }
  }

  async createGSTReturn(
    returnData: Omit<GSTReturn, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<GSTReturn> {
    const gstReturn: GSTReturn = {
      ...returnData,
      id: `gst_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.gstReturns.set(gstReturn.id, gstReturn);
    this.saveToStorage();
    this.notifyListeners();
    return gstReturn;
  }

  async validateGSTReturn(returnId: string): Promise<{ valid: boolean; errors: string[] }> {
    const gstReturn = this.gstReturns.get(returnId);
    if (!gstReturn) throw new Error('GST Return not found');

    const errors: string[] = [];
    if (gstReturn.totalOutwardSupplies < 0) errors.push('Negative outward supplies');
    if (gstReturn.totalTaxLiability < 0) errors.push('Negative tax liability');
    if (Math.abs(gstReturn.totalTaxLiability - (gstReturn.totalITC + gstReturn.netTaxPayable)) > 0.01) {
      errors.push('Tax liability does not match ITC + Net Payable');
    }

    gstReturn.status = errors.length === 0 ? 'VALIDATED' : 'ERROR';
    gstReturn.errorDetails = errors.join('; ');
    gstReturn.updatedAt = new Date().toISOString();
    this.gstReturns.set(returnId, gstReturn);
    this.saveToStorage();
    this.notifyListeners();

    createAuditEntry({
      actorUserId: 'SYSTEM',
      actorType: 'SYSTEM',
      societyId: gstReturn.societyId,
      action: 'GST_RETURN_VALIDATION',
      entityType: 'GST_RETURN',
      entityId: returnId,
      previousState: { status: 'DRAFT' },
      newState: { status: gstReturn.status, errors },
      idempotencyKey: createIdempotencyKey('gst_validate'),
      source: 'SYSTEM_JOB',
      outcome: errors.length === 0 ? 'SUCCESS' : 'FAILURE',
    });

    return { valid: errors.length === 0, errors };
  }

  async fileGSTReturn(returnId: string, filedBy: string): Promise<GSTReturn> {
    const gstReturn = this.gstReturns.get(returnId);
    if (!gstReturn) throw new Error('GST Return not found');
    if (gstReturn.status !== 'VALIDATED') throw new Error('Return must be validated before filing');

    gstReturn.status = 'FILED';
    gstReturn.filedAt = new Date().toISOString();
    gstReturn.filedBy = filedBy;
    gstReturn.acknowledgementNumber = `ACK${Date.now()}`;
    gstReturn.updatedAt = new Date().toISOString();
    this.gstReturns.set(returnId, gstReturn);
    this.saveToStorage();
    this.notifyListeners();

    createAuditEntry({
      actorUserId: filedBy,
      actorType: 'ADMIN',
      societyId: gstReturn.societyId,
      action: 'GST_RETURN_FILED',
      entityType: 'GST_RETURN',
      entityId: returnId,
      previousState: { status: 'VALIDATED' },
      newState: { status: 'FILED', acknowledgementNumber: gstReturn.acknowledgementNumber },
      idempotencyKey: createIdempotencyKey('gst_file'),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return gstReturn;
  }

  async createTDSReturn(
    returnData: Omit<TDSReturn, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<TDSReturn> {
    const tdsReturn: TDSReturn = {
      ...returnData,
      id: `tds_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tdsReturns.set(tdsReturn.id, tdsReturn);
    this.saveToStorage();
    this.notifyListeners();
    return tdsReturn;
  }

  async validateTDSReturn(returnId: string): Promise<{ valid: boolean; errors: string[] }> {
    const tdsReturn = this.tdsReturns.get(returnId);
    if (!tdsReturn) throw new Error('TDS Return not found');

    const errors: string[] = [];
    if (tdsReturn.totalDeducted < 0) errors.push('Negative deducted amount');
    if (tdsReturn.totalDeposited < 0) errors.push('Negative deposited amount');

    tdsReturn.status = errors.length === 0 ? 'VALIDATED' : 'ERROR';
    tdsReturn.updatedAt = new Date().toISOString();
    this.tdsReturns.set(returnId, tdsReturn);
    this.saveToStorage();
    this.notifyListeners();

    createAuditEntry({
      actorUserId: 'SYSTEM',
      actorType: 'SYSTEM',
      societyId: tdsReturn.societyId,
      action: 'TDS_RETURN_VALIDATION',
      entityType: 'TDS_RETURN',
      entityId: returnId,
      previousState: { status: 'DRAFT' },
      newState: { status: tdsReturn.status, errors },
      idempotencyKey: createIdempotencyKey('tds_validate'),
      source: 'SYSTEM_JOB',
      outcome: errors.length === 0 ? 'SUCCESS' : 'FAILURE',
    });

    return { valid: errors.length === 0, errors };
  }

  getGSTReturns(societyId: string): GSTReturn[] {
    return Array.from(this.gstReturns.values()).filter(r => r.societyId === societyId);
  }

  getTDSReturns(societyId: string): TDSReturn[] {
    return Array.from(this.tdsReturns.values()).filter(r => r.societyId === societyId);
  }

  onUpdate(listener: (returns: (GSTReturn | TDSReturn)[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  private notifyListeners(): void {
    const all = [...this.gstReturns.values(), ...this.tdsReturns.values()];
    this.listeners.forEach(l => l(all));
  }
}

export const gstTDSEngine = new GSTTDSEngine();
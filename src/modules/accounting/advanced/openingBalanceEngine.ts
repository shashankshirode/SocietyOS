import { OpeningBalanceImport } from './advancedAccounting.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { apiClient } from '../../../core/api/apiClient';
import { apiEndpoints } from '../../../core/api/apiEndpoints';

class OpeningBalanceEngine {
  private imports: Map<string, OpeningBalanceImport> = new Map();
  private listeners: Array<(import_: OpeningBalanceImport) => void> = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('opening_balance_imports');
      if (stored) {
        const imports = JSON.parse(stored);
        imports.forEach((i: OpeningBalanceImport) => this.imports.set(i.id, i));
      }
    } catch (error) {
      console.error('[OpeningBalanceEngine] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('opening_balance_imports', JSON.stringify(Array.from(this.imports.values())));
    } catch (error) {
      console.error('[OpeningBalanceEngine] Failed to save to storage:', error);
    }
  }

  async uploadFile(
    file: File,
    societyId: string,
    period: string,
    uploadedBy: string
  ): Promise<{ importId: string; totalRows: number }> {
    const content = await this.readFileAsText(file);
    const rows = this.parseCSV(content);
    const fileHash = await this.computeHash(content);

    let totalDebits = 0;
    let totalCredits = 0;
    const accounts: OpeningBalanceImport['accounts'] = [];

    for (const row of rows) {
      const debit = parseFloat(row.debit_balance ?? row.debit ?? '0');
      const credit = parseFloat(row.credit_balance ?? row.credit ?? '0');
      totalDebits += debit;
      totalCredits += credit;
      accounts.push({
        accountCode: row.account_code ?? row.code ?? '',
        accountName: row.account_name ?? row.name ?? '',
        debitBalance: debit,
        creditBalance: credit,
      });
    }

    const import_: OpeningBalanceImport = {
      id: `obi_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      societyId,
      period,
      fileName: file.name,
      fileHash,
      totalRows: rows.length,
      status: 'UPLOADED',
      trialBalance: {
        totalDebits,
        totalCredits,
        balanced: Math.abs(totalDebits - totalCredits) < 0.01,
      },
      accounts,
      errors: [],
      uploadedAt: new Date().toISOString(),
      uploadedBy,
    };

    this.imports.set(import_.id, import_);
    this.saveToStorage();

    createAuditEntry({
      actorUserId: uploadedBy,
      actorType: 'ADMIN',
      societyId,
      action: 'OPENING_BALANCE_UPLOAD',
      entityType: 'OPENING_BALANCE_IMPORT',
      entityId: import_.id,
      newState: { totalRows: rows.length, trialBalanced: import_.trialBalance.balanced },
      idempotencyKey: createIdempotencyKey('obi_upload'),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    this.notifyListeners(import_);
    return { importId: import_.id, totalRows: rows.length };
  }

  private async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  private parseCSV(content: string): Record<string, string>[] {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];

    const firstLine = lines[0];
    if (!firstLine) return [];
    const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const values = line.split(',').map(v => v.trim());
      if (values.length < headers.length) continue;

      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ?? '';
      });
      rows.push(row);
    }

    return rows;
  }

  private async computeHash(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async validateImport(importId: string): Promise<OpeningBalanceImport> {
    const import_ = this.imports.get(importId);
    if (!import_) throw new Error('Import not found');

    import_.status = 'VALIDATING';
    this.saveToStorage();

    const errors: OpeningBalanceImport['errors'] = [];

    if (!import_.trialBalance.balanced) {
      errors.push({
        row: 0,
        field: 'trial_balance',
        code: 'UNBALANCED_TRIAL_BALANCE',
        message: `Trial balance not balanced: Debits ${import_.trialBalance.totalDebits} != Credits ${import_.trialBalance.totalCredits}`,
      });
    }

    for (let i = 0; i < import_.accounts.length; i++) {
      const account = import_.accounts[i];
      if (!account) continue;
      if (!account.accountCode) {
        errors.push({
          row: i + 1,
          field: 'account_code',
          code: 'MISSING_ACCOUNT_CODE',
          message: 'Account code is required',
        });
      }
      if (!account.accountName) {
        errors.push({
          row: i + 1,
          field: 'account_name',
          code: 'MISSING_ACCOUNT_NAME',
          message: 'Account name is required',
        });
      }
      if (account.debitBalance < 0 || account.creditBalance < 0) {
        errors.push({
          row: i + 1,
          field: 'balance',
          code: 'NEGATIVE_BALANCE',
          message: 'Balances cannot be negative',
        });
      }
      if (account.debitBalance > 0 && account.creditBalance > 0) {
        errors.push({
          row: i + 1,
          field: 'balance',
          code: 'BOTH_DEBIT_CREDIT',
          message: 'Account cannot have both debit and credit balance',
        });
      }
    }

    import_.errors = errors;
    import_.status = errors.length === 0 ? 'VALIDATED' : 'FAILED';
    import_.validatedAt = new Date().toISOString();
    this.imports.set(import_.id, import_);
    this.saveToStorage();

    createAuditEntry({
      actorUserId: 'SYSTEM',
      actorType: 'SYSTEM',
      societyId: import_.societyId,
      action: 'OPENING_BALANCE_VALIDATION',
      entityType: 'OPENING_BALANCE_IMPORT',
      entityId: import_.id,
      previousState: { status: 'VALIDATING' },
      newState: { status: import_.status, errorCount: errors.length },
      idempotencyKey: createIdempotencyKey('obi_validate'),
      source: 'SYSTEM_JOB',
      outcome: errors.length === 0 ? 'SUCCESS' : 'FAILURE',
    });

    this.notifyListeners(import_);
    return import_;
  }

  async previewImport(importId: string): Promise<OpeningBalanceImport> {
    const import_ = this.imports.get(importId);
    if (!import_) throw new Error('Import not found');

    if (import_.status !== 'VALIDATED') {
      throw new Error('Import must be validated before preview');
    }

    import_.status = 'PREVIEWED';
    import_.previewedAt = new Date().toISOString();
    this.imports.set(import_.id, import_);
    this.saveToStorage();
    this.notifyListeners(import_);
    return import_;
  }

  async commitImport(importId: string, committedBy: string): Promise<OpeningBalanceImport> {
    const import_ = this.imports.get(importId);
    if (!import_) throw new Error('Import not found');

    if (import_.status !== 'PREVIEWED' && import_.status !== 'VALIDATED') {
      throw new Error('Import must be previewed before commit');
    }

    import_.status = 'COMMITTING';
    this.saveToStorage();

    try {
      await apiClient.post(apiEndpoints.accounting.importOpeningBalances, {
        importId: import_.id,
        societyId: import_.societyId,
        period: import_.period,
        accounts: import_.accounts,
      });

      import_.status = 'COMMITTED';
      import_.committedAt = new Date().toISOString();
      this.imports.set(import_.id, import_);
      this.saveToStorage();

      createAuditEntry({
        actorUserId: committedBy,
        actorType: 'ADMIN',
        societyId: import_.societyId,
        action: 'OPENING_BALANCE_COMMIT',
        entityType: 'OPENING_BALANCE_IMPORT',
        entityId: import_.id,
        previousState: { status: import_.status },
        newState: { status: 'COMMITTED', accountCount: import_.accounts.length },
        idempotencyKey: createIdempotencyKey('obi_commit'),
        source: 'MOBILE',
        outcome: 'SUCCESS',
      });

      this.notifyListeners(import_);
      return import_;
    } catch (error) {
      import_.status = 'FAILED';
      this.imports.set(import_.id, import_);
      this.saveToStorage();
      throw error;
    }
  }

  async rollbackImport(importId: string, rolledBackBy: string): Promise<OpeningBalanceImport> {
    const import_ = this.imports.get(importId);
    if (!import_) throw new Error('Import not found');

    if (import_.status !== 'COMMITTED') {
      throw new Error('Only committed imports can be rolled back');
    }

    try {
      await apiClient.post(apiEndpoints.accounting.rollbackOpeningBalances, { importId: import_.id });

      const rollbackImportId = `obi_rollback_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
      import_.status = 'ROLLED_BACK';
      import_.rollbackImportId = rollbackImportId;
      this.imports.set(import_.id, import_);
      this.saveToStorage();

      createAuditEntry({
        actorUserId: rolledBackBy,
        actorType: 'ADMIN',
        societyId: import_.societyId,
        action: 'OPENING_BALANCE_ROLLBACK',
        entityType: 'OPENING_BALANCE_IMPORT',
        entityId: import_.id,
        previousState: { status: 'COMMITTED' },
        newState: { status: 'ROLLED_BACK', rollbackImportId },
        idempotencyKey: createIdempotencyKey('obi_rollback'),
        source: 'MOBILE',
        outcome: 'SUCCESS',
      });

      this.notifyListeners(import_);
      return import_;
    } catch (error) {
      throw error;
    }
  }

  getImport(importId: string): OpeningBalanceImport | null {
    return this.imports.get(importId) ?? null;
  }

  getImportsBySociety(societyId: string): OpeningBalanceImport[] {
    return Array.from(this.imports.values())
      .filter(i => i.societyId === societyId)
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  onUpdate(listener: (import_: OpeningBalanceImport) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  private notifyListeners(import_: OpeningBalanceImport): void {
    this.listeners.forEach(l => l(import_));
  }
}

export const openingBalanceEngine = new OpeningBalanceEngine();
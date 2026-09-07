import { BankTransaction, BankStatement, ReconciliationSession, ReconciliationMatch, ReconciliationDiscrepancy, MatchingRule, } from './advancedAccounting.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { apiClient } from '../../../core/api/apiClient';
import { apiEndpoints } from '../../../core/api/apiEndpoints';
class BankReconciliationEngine {
    private statements: Map<string, BankStatement> = new Map();
    private sessions: Map<string, ReconciliationSession> = new Map();
    private matches: Map<string, ReconciliationMatch[]> = new Map();
    private discrepancies: Map<string, ReconciliationDiscrepancy[]> = new Map();
    private rules: Map<string, MatchingRule> = new Map();
    private listeners: Array<(session: ReconciliationSession) => void> = [];
    constructor() {
        this.loadFromStorage();
    }
    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem('bank_reconciliation_sessions');
            if (stored) {
                const sessions = JSON.parse(stored);
                sessions.forEach((s: ReconciliationSession) => this.sessions.set(s.id, s));
            }
            const rules = localStorage.getItem('matching_rules');
            if (rules) {
                const parsed = JSON.parse(rules);
                parsed.forEach((r: MatchingRule) => this.rules.set(r.id, r));
            }
        }
        catch (error) {
            console.error('[BankReconciliationEngine] Failed to load from storage:', error);
        }
    }
    private saveToStorage(): void {
        try {
            localStorage.setItem('bank_reconciliation_sessions', JSON.stringify(Array.from(this.sessions.values())));
            localStorage.setItem('matching_rules', JSON.stringify(Array.from(this.rules.values())));
        }
        catch (error) {
            console.error('[BankReconciliationEngine] Failed to save to storage:', error);
        }
    }
    addMatchingRule(rule: Omit<MatchingRule, 'id' | 'createdAt' | 'updatedAt'>): MatchingRule {
        const newRule: MatchingRule = {
            ...rule,
            id: `rule_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.rules.set(newRule.id, newRule);
        this.saveToStorage();
        return newRule;
    }
    getMatchingRules(bankAccountId: string): MatchingRule[] {
        return Array.from(this.rules.values())
            .filter(r => r.bankAccountId === bankAccountId && r.enabled)
            .sort((a, b) => a.priority - b.priority);
    }
    async uploadStatement(bankAccountId: string, file: File, uploadedBy: string): Promise<{
        statementId: string;
        transactionCount: number;
    }> {
        const content = await this.readFileAsText(file);
        const transactions = this.parseStatement(content, bankAccountId);
        const fileHash = await this.computeHash(content);
        const statement: BankStatement = {
            id: `stmt_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            bankAccountId,
            statementPeriodStart: transactions[0]?.date ?? new Date().toISOString(),
            statementPeriodEnd: transactions[transactions.length - 1]?.date ?? new Date().toISOString(),
            openingBalance: transactions[0]?.balance ?? 0,
            closingBalance: transactions[transactions.length - 1]?.balance ?? 0,
            transactions,
            uploadedAt: new Date().toISOString(),
            uploadedBy,
            fileHash,
            status: 'UPLOADED',
        };
        this.statements.set(statement.id, statement);
        createAuditEntry({
            actorUserId: uploadedBy,
            actorType: 'ADMIN',
            societyId: '',
            action: 'BANK_STATEMENT_UPLOAD',
            entityType: 'BANK_STATEMENT',
            entityId: statement.id,
            newState: { transactionCount: transactions.length, period: `${statement.statementPeriodStart} to ${statement.statementPeriodEnd}` },
            idempotencyKey: createIdempotencyKey('bank_stmt'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return { statementId: statement.id, transactionCount: transactions.length };
    }
    private async readFileAsText(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    private parseStatement(content: string, bankAccountId: string): BankTransaction[] {
        const lines = content.trim().split('\n');
        if (lines.length < 2)
            return [];
        const firstLine = lines[0];
        if (!firstLine)
            return [];
        const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
        const transactions: BankTransaction[] = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line)
                continue;
            const values = line.split(',').map(v => v.trim());
            if (values.length < headers.length)
                continue;
            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
                row[header] = values[index] ?? '';
            });
            const date = row.date ?? row['transaction date'] ?? row['value date'] ?? '';
            const description = row.description ?? row.narration ?? row.particulars ?? '';
            const reference = row.reference ?? row.ref ?? row.chq_no ?? '';
            const debit = parseFloat(row.debit ?? row.withdrawal ?? row.dr ?? '0');
            const credit = parseFloat(row.credit ?? row.deposit ?? row.cr ?? '0');
            const balance = parseFloat(row.balance ?? row.running_balance ?? '0');
            transactions.push({
                id: `txn_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}`,
                bankAccountId,
                date,
                valueDate: row['value date'] ?? date,
                description,
                reference,
                debitAmount: debit,
                creditAmount: credit,
                balance,
                matched: false,
                rawData: row,
            });
        }
        return transactions;
    }
    private async computeHash(content: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    async startReconciliation(bankAccountId: string, statementId: string, startedBy: string): Promise<ReconciliationSession> {
        const statement = this.statements.get(statementId);
        if (!statement)
            throw new Error('Statement not found');
        statement.status = 'MATCHING';
        this.statements.set(statementId, statement);
        const session: ReconciliationSession = {
            id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            bankAccountId,
            statementId,
            status: 'IN_PROGRESS',
            startedAt: new Date().toISOString(),
            startedBy,
            matchedCount: 0,
            unmatchedCount: 0,
            discrepancyAmount: 0,
        };
        this.sessions.set(session.id, session);
        this.matches.set(session.id, []);
        this.discrepancies.set(session.id, []);
        await this.autoMatch(session);
        session.matchedCount = this.matches.get(session.id)?.length ?? 0;
        session.unmatchedCount = statement.transactions.filter(t => !t.matched).length;
        session.status = session.unmatchedCount > 0 ? 'DISCREPANCY' : 'COMPLETED';
        this.sessions.set(session.id, session);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: startedBy,
            actorType: 'ADMIN',
            societyId: '',
            action: 'BANK_RECONCILIATION_START',
            entityType: 'RECONCILIATION_SESSION',
            entityId: session.id,
            newState: { matched: session.matchedCount, unmatched: session.unmatchedCount },
            idempotencyKey: createIdempotencyKey('recon_start'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(session);
        return session;
    }
    private async autoMatch(session: ReconciliationSession): Promise<void> {
        const statement = this.statements.get(session.statementId);
        if (!statement)
            return;
        const rules = this.getMatchingRules(session.bankAccountId);
        const unmatchedTransactions = statement.transactions.filter(t => !t.matched);
        for (const transaction of unmatchedTransactions) {
            const matchedEntry = await this.findMatchingLedgerEntry(transaction, rules);
            if (matchedEntry) {
                await this.createMatch(session.id, transaction.id, matchedEntry.id, 'RULE_BASED', 0.9);
                transaction.matched = true;
                transaction.matchedEntryId = matchedEntry.id;
                transaction.matchedAt = new Date().toISOString();
                transaction.matchedBy = 'AUTO_RULE';
            }
        }
        const remainingUnmatched = statement.transactions.filter(t => !t.matched);
        for (const transaction of remainingUnmatched) {
            const fuzzyMatch = this.findFuzzyMatch(transaction, session.bankAccountId);
            if (fuzzyMatch) {
                await this.createMatch(session.id, transaction.id, fuzzyMatch.ledgerEntryId, 'AUTO', fuzzyMatch.confidence);
                transaction.matched = true;
                transaction.matchedEntryId = fuzzyMatch.ledgerEntryId;
                transaction.matchedAt = new Date().toISOString();
                transaction.matchedBy = 'AUTO_FUZZY';
            }
        }
        statement.status = 'MATCHED';
        this.statements.set(session.statementId, statement);
    }
    private async findMatchingLedgerEntry(transaction: BankTransaction, rules: MatchingRule[]): Promise<{
        id: string;
        amount: number;
    } | null> {
        for (const rule of rules) {
            let matches = true;
            for (const condition of rule.conditions) {
                const fieldValue = transaction[condition.field as keyof BankTransaction];
                if (fieldValue === undefined) {
                    matches = false;
                    break;
                }
                switch (condition.operator) {
                    case 'EQUALS':
                        if (String(fieldValue) !== String(condition.value))
                            matches = false;
                        break;
                    case 'CONTAINS':
                        if (!String(fieldValue).toLowerCase().includes(String(condition.value).toLowerCase()))
                            matches = false;
                        break;
                    case 'STARTS_WITH':
                        if (!String(fieldValue).toLowerCase().startsWith(String(condition.value).toLowerCase()))
                            matches = false;
                        break;
                    case 'ENDS_WITH':
                        if (!String(fieldValue).toLowerCase().endsWith(String(condition.value).toLowerCase()))
                            matches = false;
                        break;
                    case 'REGEX':
                        if (!new RegExp(String(condition.value)).test(String(fieldValue)))
                            matches = false;
                        break;
                    case 'AMOUNT_RANGE': {
                        const amount = Number(fieldValue);
                        const rangeParts = String(condition.value).split(',').map(Number);
                        const min = rangeParts[0] ?? 0;
                        const max = rangeParts[1] ?? Infinity;
                        if (amount < min || amount > max)
                            matches = false;
                        break;
                    }
                }
                if (!matches)
                    break;
            }
            if (matches) {
                return { id: rule.ledgerAccountCode, amount: transaction.creditAmount || transaction.debitAmount };
            }
        }
        return null;
    }
    private findFuzzyMatch(transaction: BankTransaction, bankAccountId: string): {
        ledgerEntryId: string;
        confidence: number;
    } | null {
        const amount = transaction.creditAmount || transaction.debitAmount;
        if (amount > 0 && amount < 1000000) {
            return { ledgerEntryId: `ledger_${Math.floor(amount)}`, confidence: 0.75 };
        }
        return null;
    }
    private async createMatch(sessionId: string, bankTransactionId: string, ledgerEntryId: string, matchType: 'AUTO' | 'MANUAL' | 'RULE_BASED', confidence: number): Promise<void> {
        const match: ReconciliationMatch = {
            id: `match_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            sessionId,
            bankTransactionId,
            ledgerEntryId,
            matchType,
            confidence,
            matchedAt: new Date().toISOString(),
            matchedBy: matchType === 'MANUAL' ? 'USER' : 'SYSTEM',
        };
        const sessionMatches = this.matches.get(sessionId) ?? [];
        sessionMatches.push(match);
        this.matches.set(sessionId, sessionMatches);
    }
    async manualMatch(sessionId: string, bankTransactionId: string, ledgerEntryId: string, matchedBy: string): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (!session)
            throw new Error('Session not found');
        const statement = this.statements.get(session.statementId);
        if (!statement)
            throw new Error('Statement not found');
        const transaction = statement.transactions.find(t => t.id === bankTransactionId);
        if (!transaction)
            throw new Error('Transaction not found');
        if (transaction.matched)
            throw new Error('Transaction already matched');
        await this.createMatch(sessionId, bankTransactionId, ledgerEntryId, 'MANUAL', 1.0);
        transaction.matched = true;
        transaction.matchedEntryId = ledgerEntryId;
        transaction.matchedAt = new Date().toISOString();
        transaction.matchedBy = matchedBy;
        session.matchedCount = this.matches.get(sessionId)?.length ?? 0;
        session.unmatchedCount = statement.transactions.filter(t => !t.matched).length;
        this.sessions.set(sessionId, session);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: matchedBy,
            actorType: 'ADMIN',
            societyId: '',
            action: 'BANK_RECONCILIATION_MANUAL_MATCH',
            entityType: 'RECONCILIATION_MATCH',
            entityId: bankTransactionId,
            previousState: { matched: false },
            newState: { matched: true, ledgerEntryId },
            idempotencyKey: createIdempotencyKey('recon_manual'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(session);
    }
    async createDiscrepancy(sessionId: string, discrepancy: Omit<ReconciliationDiscrepancy, 'id' | 'sessionId' | 'status'>): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (!session)
            throw new Error('Session not found');
        const newDiscrepancy: ReconciliationDiscrepancy = {
            ...discrepancy,
            id: `disc_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            sessionId,
            status: 'OPEN',
        };
        const sessionDiscrepancies = this.discrepancies.get(sessionId) ?? [];
        sessionDiscrepancies.push(newDiscrepancy);
        this.discrepancies.set(sessionId, sessionDiscrepancies);
        session.discrepancyAmount += discrepancy.amount;
        this.sessions.set(sessionId, session);
        this.saveToStorage();
    }
    async resolveDiscrepancy(discrepancyId: string, sessionId: string, resolvedBy: string, resolution: string): Promise<void> {
        const sessionDiscrepancies = this.discrepancies.get(sessionId) ?? [];
        const discrepancy = sessionDiscrepancies.find(d => d.id === discrepancyId);
        if (!discrepancy)
            throw new Error('Discrepancy not found');
        discrepancy.status = 'RESOLVED';
        discrepancy.resolvedAt = new Date().toISOString();
        discrepancy.resolvedBy = resolvedBy;
        discrepancy.resolution = resolution;
        this.discrepancies.set(sessionId, sessionDiscrepancies);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: resolvedBy,
            actorType: 'ADMIN',
            societyId: '',
            action: 'RECONCILIATION_DISCREPANCY_RESOLVED',
            entityType: 'RECONCILIATION_DISCREPANCY',
            entityId: discrepancyId,
            previousState: { status: 'OPEN' },
            newState: { status: 'RESOLVED', resolution },
            idempotencyKey: createIdempotencyKey('disc_resolve'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
    }
    async completeSession(sessionId: string, completedBy: string): Promise<void> {
        const session = this.sessions.get(sessionId);
        if (!session)
            throw new Error('Session not found');
        if (session.unmatchedCount > 0) {
            throw new Error('Cannot complete session with unmatched transactions');
        }
        session.status = 'COMPLETED';
        session.completedAt = new Date().toISOString();
        session.completedBy = completedBy;
        const statement = this.statements.get(session.statementId);
        if (statement) {
            statement.status = 'RECONCILED';
            this.statements.set(session.statementId, statement);
        }
        this.sessions.set(sessionId, session);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: completedBy,
            actorType: 'ADMIN',
            societyId: '',
            action: 'BANK_RECONCILIATION_COMPLETE',
            entityType: 'RECONCILIATION_SESSION',
            entityId: sessionId,
            previousState: { status: 'IN_PROGRESS' },
            newState: { status: 'COMPLETED' },
            idempotencyKey: createIdempotencyKey('recon_complete'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(session);
    }
    getSession(sessionId: string): ReconciliationSession | null {
        return this.sessions.get(sessionId) ?? null;
    }
    getMatches(sessionId: string): ReconciliationMatch[] {
        return this.matches.get(sessionId) ?? [];
    }
    getDiscrepancies(sessionId: string): ReconciliationDiscrepancy[] {
        return this.discrepancies.get(sessionId) ?? [];
    }
    getSessionsByAccount(bankAccountId: string): ReconciliationSession[] {
        return Array.from(this.sessions.values()).filter(s => s.bankAccountId === bankAccountId);
    }
    onSessionUpdate(listener: (session: ReconciliationSession) => void): () => void {
        this.listeners.push(listener);
        return () => {
            const idx = this.listeners.indexOf(listener);
            if (idx >= 0)
                this.listeners.splice(idx, 1);
        };
    }
    private notifyListeners(session: ReconciliationSession): void {
        this.listeners.forEach(l => l(session));
    }
}
export const bankReconciliationEngine = new BankReconciliationEngine();


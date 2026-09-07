import { DocumentCategory, DocumentStatus, VerificationStatus, VerificationDecision, SignatureMethod, VerificationCase, VerificationChecklist, DigitalSignature, DocumentMetadata, DocumentAccessLog, ChecklistItem, ResubmissionRequest, DOCUMENT_CATEGORY_CHECKLISTS, STATUS_TRANSITIONS, } from './documentVerification.types';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../../core/audit';
import { mockStore } from '../../../../core/mockStore/mockStore';
class DocumentVerificationService {
    private verificationCases: Map<string, VerificationCase> = new Map();
    private checklists: Map<string, VerificationChecklist> = new Map();
    private digitalSignatures: Map<string, DigitalSignature> = new Map();
    private documents: Map<string, DocumentMetadata> = new Map();
    private accessLogs: DocumentAccessLog[] = [];
    private resubmissionRequests: Map<string, ResubmissionRequest> = new Map();
    private listeners: Array<(case_: VerificationCase) => void> = [];
    constructor() {
        Object.values(DOCUMENT_CATEGORY_CHECKLISTS).forEach(c => this.checklists.set(c.id, c));
        this.loadFromStorage();
    }
    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem('document_verification_cases');
            if (stored) {
                const cases = JSON.parse(stored);
                cases.forEach((c: VerificationCase) => this.verificationCases.set(c.id, c));
            }
            const docs = localStorage.getItem('document_metadata');
            if (docs) {
                const parsed = JSON.parse(docs);
                parsed.forEach((d: DocumentMetadata) => this.documents.set(d.id, d));
            }
            const sigs = localStorage.getItem('digital_signatures');
            if (sigs) {
                const parsed = JSON.parse(sigs);
                parsed.forEach((s: DigitalSignature) => this.digitalSignatures.set(s.id, s));
            }
        }
        catch (_error) {
        }
    }
    private saveToStorage(): void {
        try {
            localStorage.setItem('document_verification_cases', JSON.stringify(Array.from(this.verificationCases.values())));
            localStorage.setItem('document_metadata', JSON.stringify(Array.from(this.documents.values())));
            localStorage.setItem('digital_signatures', JSON.stringify(Array.from(this.digitalSignatures.values())));
        }
        catch (_error) {
        }
    }
    getChecklist(category: DocumentCategory): VerificationChecklist {
        return DOCUMENT_CATEGORY_CHECKLISTS[category] ?? DOCUMENT_CATEGORY_CHECKLISTS.DEFAULT;
    }
    async createVerificationCase(documentId: string, documentVersion: number, category: DocumentCategory, submittedBy: string): Promise<VerificationCase> {
        const checklist = this.getChecklist(category);
        const now = new Date().toISOString();
        const verificationCase: VerificationCase = {
            id: `vc_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            documentId,
            documentVersion,
            category,
            status: 'PENDING',
            checklistId: checklist.id,
            checklist: checklist.items.map(item => ({ ...item })),
            submittedBy,
            submittedAt: now,
            resubmissionCount: 0,
            createdAt: now,
            updatedAt: now,
        };
        this.verificationCases.set(verificationCase.id, verificationCase);
        this.saveToStorage();
        await this.updateDocumentStatus(documentId, 'PENDING_ADMIN_REVIEW', verificationCase.id);
        createAuditEntry({
            actorUserId: submittedBy,
            actorType: 'RESIDENT',
            societyId: '',
            action: 'CREATE',
            entityType: 'VERIFICATION_CASE',
            entityId: verificationCase.id,
            newState: { status: 'PENDING', category, documentId },
            idempotencyKey: createIdempotencyKey('verification_case'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(verificationCase);
        return verificationCase;
    }
    async getVerificationCase(caseId: string): Promise<VerificationCase | null> {
        return this.verificationCases.get(caseId) ?? null;
    }
    async getVerificationCasesByDocument(documentId: string): Promise<VerificationCase[]> {
        return Array.from(this.verificationCases.values()).filter(c => c.documentId === documentId);
    }
    async getPendingVerificationCases(adminId: string): Promise<VerificationCase[]> {
        return Array.from(this.verificationCases.values())
            .filter(c => c.status === 'PENDING' || c.status === 'IN_REVIEW')
            .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
    }
    async reviewVerificationCase(caseId: string, adminId: string, decision: VerificationDecision, reason?: string, completedItems?: string[]): Promise<VerificationCase | null> {
        const verificationCase = this.verificationCases.get(caseId);
        if (!verificationCase)
            return null;
        if (verificationCase.status !== 'PENDING' && verificationCase.status !== 'IN_REVIEW') {
            throw new Error('Case is not in a reviewable state');
        }
        const now = new Date().toISOString();
        const previousStatus = verificationCase.status;
        if (completedItems) {
            verificationCase.checklist = verificationCase.checklist.map(item => {
                if (completedItems.includes(item.id)) {
                    return { ...item, completed: true, completedAt: now, completedBy: adminId };
                }
                return item;
            });
        }
        verificationCase.status = decision === 'APPROVE' ? 'APPROVED' :
            decision === 'REJECT' ? 'REJECTED' : 'RESUBMISSION_REQUESTED';
        verificationCase.reviewedBy = adminId;
        verificationCase.reviewedAt = now;
        verificationCase.decision = decision;
        verificationCase.decisionReason = reason;
        verificationCase.updatedAt = now;
        if (decision === 'REQUEST_RESUBMISSION') {
            verificationCase.resubmissionCount += 1;
            const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
            verificationCase.resubmissionDeadline = deadline;
        }
        this.verificationCases.set(caseId, verificationCase);
        this.saveToStorage();
        const newDocStatus = this.getDocumentStatusFromVerification(verificationCase.status);
        await this.updateDocumentStatus(verificationCase.documentId, newDocStatus, caseId);
        createAuditEntry({
            actorUserId: adminId,
            actorType: 'ADMIN',
            societyId: '',
            action: 'VERIFY',
            entityType: 'VERIFICATION_CASE',
            entityId: caseId,
            previousState: { status: previousStatus },
            newState: { status: verificationCase.status, decision, reason },
            idempotencyKey: createIdempotencyKey('verification_review'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(verificationCase);
        return verificationCase;
    }
    private getDocumentStatusFromVerification(verificationStatus: VerificationStatus): DocumentStatus {
        switch (verificationStatus) {
            case 'APPROVED': return 'VERIFIED';
            case 'REJECTED': return 'REJECTED';
            case 'RESUBMISSION_REQUESTED': return 'RESUBMISSION_REQUIRED';
            default: return 'PENDING_ADMIN_REVIEW';
        }
    }
    private async updateDocumentStatus(documentId: string, status: DocumentStatus, verificationCaseId: string): Promise<void> {
        const doc = this.documents.get(documentId);
        if (doc) {
            const previousStatus = doc.status;
            doc.status = status;
            doc.currentVerificationCaseId = verificationCaseId;
            doc.updatedAt = new Date().toISOString();
            doc.verificationHistory.push({
                caseId: verificationCaseId,
                status: this.getVerificationStatusFromDocument(status),
                decidedAt: new Date().toISOString(),
                decidedBy: 'SYSTEM',
            });
            this.documents.set(documentId, doc);
            this.saveToStorage();
            createAuditEntry({
                actorUserId: 'SYSTEM',
                actorType: 'SYSTEM',
                societyId: '',
                action: 'UPDATE',
                entityType: 'DOCUMENT',
                entityId: documentId,
                previousState: { status: previousStatus },
                newState: { status, verificationCaseId },
                idempotencyKey: createIdempotencyKey('doc_status'),
                source: 'SYSTEM_JOB',
                outcome: 'SUCCESS',
            });
        }
    }
    private getVerificationStatusFromDocument(docStatus: DocumentStatus): VerificationStatus {
        switch (docStatus) {
            case 'VERIFIED': return 'APPROVED';
            case 'REJECTED': return 'REJECTED';
            case 'RESUBMISSION_REQUIRED': return 'RESUBMISSION_REQUESTED';
            default: return 'PENDING';
        }
    }
    async signVerificationCase(caseId: string, adminId: string, signatureMethod: SignatureMethod, certificateId?: string): Promise<DigitalSignature | null> {
        const verificationCase = this.verificationCases.get(caseId);
        if (!verificationCase)
            return null;
        if (verificationCase.status !== 'APPROVED' && verificationCase.status !== 'VERIFIED') {
            throw new Error('Case must be approved before signing');
        }
        const now = new Date().toISOString();
        const dataToSign = JSON.stringify({
            caseId,
            documentId: verificationCase.documentId,
            decision: verificationCase.decision,
            reviewedAt: verificationCase.reviewedAt,
        });
        const signatureValue = await this.createDigitalSignature(dataToSign, adminId, signatureMethod);
        const signature: DigitalSignature = {
            id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            verificationCaseId: caseId,
            signedBy: adminId,
            signedAt: now,
            signatureMethod,
            certificateId,
            signatureValue,
            signedDataHash: await this.hashData(dataToSign),
            algorithm: 'RSA-SHA256',
            timestamp: now,
            isValid: true,
            validatedAt: now,
        };
        this.digitalSignatures.set(signature.id, signature);
        verificationCase.adminSignature = signature;
        verificationCase.status = 'SIGNED';
        verificationCase.updatedAt = now;
        this.verificationCases.set(caseId, verificationCase);
        await this.updateDocumentStatus(verificationCase.documentId, 'SIGNED', caseId);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: adminId,
            actorType: 'ADMIN',
            societyId: '',
            action: 'SIGN',
            entityType: 'DIGITAL_SIGNATURE',
            entityId: signature.id,
            previousState: { status: verificationCase.status },
            newState: { status: 'SIGNED', signatureMethod, certificateId },
            idempotencyKey: createIdempotencyKey('digital_sign'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        this.notifyListeners(verificationCase);
        return signature;
    }
    private async createDigitalSignature(data: string, signerId: string, method: SignatureMethod): Promise<string> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data + signerId + method + Date.now());
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    private async hashData(data: string): Promise<string> {
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    async validateSignature(signatureId: string): Promise<boolean> {
        const signature = this.digitalSignatures.get(signatureId);
        if (!signature)
            return false;
        signature.isValid = true;
        signature.validatedAt = new Date().toISOString();
        this.digitalSignatures.set(signatureId, signature);
        this.saveToStorage();
        return true;
    }
    async requestResubmission(caseId: string, residentId: string, reason: string): Promise<ResubmissionRequest> {
        const verificationCase = this.verificationCases.get(caseId);
        if (!verificationCase)
            throw new Error('Verification case not found');
        if (verificationCase.status !== 'RESUBMISSION_REQUESTED') {
            throw new Error('Case is not in resubmission state');
        }
        const deadline = verificationCase.resubmissionDeadline ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const request: ResubmissionRequest = {
            id: `resub_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            verificationCaseId: caseId,
            requestedBy: residentId,
            requestedAt: new Date().toISOString(),
            reason,
            deadline,
            newDocumentVersion: verificationCase.documentVersion + 1,
            status: 'PENDING',
        };
        this.resubmissionRequests.set(request.id, request);
        this.saveToStorage();
        createAuditEntry({
            actorUserId: residentId,
            actorType: 'RESIDENT',
            societyId: '',
            action: 'UPDATE',
            entityType: 'VERIFICATION_CASE',
            entityId: caseId,
            previousState: { status: verificationCase.status },
            newState: { status: 'RESUBMISSION_REQUESTED', resubmissionCount: verificationCase.resubmissionCount },
            idempotencyKey: createIdempotencyKey('resubmission'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return request;
    }
    async submitResubmission(requestId: string, documentId: string): Promise<void> {
        const request = this.resubmissionRequests.get(requestId);
        if (!request)
            throw new Error('Resubmission request not found');
        request.status = 'SUBMITTED';
        this.resubmissionRequests.set(requestId, request);
        const verificationCase = this.verificationCases.get(request.verificationCaseId);
        if (verificationCase) {
            verificationCase.documentVersion = request.newDocumentVersion;
            verificationCase.documentId = documentId;
            verificationCase.status = 'PENDING';
            verificationCase.updatedAt = new Date().toISOString();
            this.verificationCases.set(verificationCase.id, verificationCase);
        }
        this.saveToStorage();
        createAuditEntry({
            actorUserId: request.requestedBy,
            actorType: 'RESIDENT',
            societyId: '',
            action: 'UPDATE',
            entityType: 'VERIFICATION_CASE',
            entityId: request.verificationCaseId,
            previousState: { status: 'RESUBMISSION_REQUESTED' },
            newState: { status: 'PENDING', newVersion: request.newDocumentVersion },
            idempotencyKey: createIdempotencyKey('resubmit'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
    }
    logAccess(accessLog: Omit<DocumentAccessLog, 'id'>): void {
        const log: DocumentAccessLog = {
            id: `dal_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
            ...accessLog,
        };
        this.accessLogs.push(log);
        if (this.accessLogs.length > 10000) {
            this.accessLogs = this.accessLogs.slice(-5000);
        }
    }
    getAccessLogs(documentId: string): DocumentAccessLog[] {
        return this.accessLogs.filter(l => l.documentId === documentId);
    }
    onCaseUpdate(listener: (case_: VerificationCase) => void): () => void {
        this.listeners.push(listener);
        return () => {
            const idx = this.listeners.indexOf(listener);
            if (idx >= 0)
                this.listeners.splice(idx, 1);
        };
    }
    private notifyListeners(case_: VerificationCase): void {
        this.listeners.forEach(l => l(case_));
    }
}
export const documentVerificationService = new DocumentVerificationService();


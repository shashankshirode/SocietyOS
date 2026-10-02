import type { Document, DocumentVersion, DocumentCategory, DocumentStatus, DocumentVerificationInput, DocumentAccessLog, } from '../types/documentVault.types';
import type { AppRole } from '../../../../core/permissions/permission.types';
import { mockStore } from '../../../../core/mockStore/mockStore';
import { documentAccessService, type DocumentAccessContext } from './documentAccessService';
import { auditService } from '../../../../core/audit';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
export interface VerificationResult {
    success: boolean;
    document?: Document;
    verificationCaseId?: string;
    error?: string;
}
export interface VerificationCase {
    id: string;
    documentId: string;
    versionId: string;
    status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
    submittedBy: string;
    submittedAt: string;
    reviewedBy?: string;
    reviewedAt?: string;
    decision?: 'APPROVE' | 'REJECT';
    reason?: string;
    checklist: VerificationChecklistItem[];
    createdAt: string;
    updatedAt: string;
}
export interface VerificationChecklistItem {
    id: string;
    label: string;
    description?: string;
    required: boolean;
    completed: boolean;
    completedAt?: string;
    completedBy?: string;
    notes?: string;
}
export interface VerificationChecklist {
    id: string;
    name: string;
    category: string;
    version: number;
    items: VerificationChecklistItem[];
    createdAt: string;
    updatedAt: string;
}
export interface VerifyDocumentInput {
    documentId: string;
    action: 'APPROVE' | 'REJECT';
    reason?: string;
    completedChecklistItems?: string[];
}
export interface RejectDocumentInput {
    documentId: string;
    reason: string;
    resubmissionAllowed?: boolean;
    resubmissionDeadline?: string;
}
export interface VerificationAuditData {
    actorUserId: string;
    actorRole: string;
    societyId: string;
    action: 'VERIFY' | 'REJECT' | 'RESUBMIT';
    documentId: string;
    versionId: string;
    decision?: 'APPROVE' | 'REJECT';
    reason?: string;
}
export class DocumentVerificationService {
    private verificationCases: Map<string, VerificationCase> = new Map();
    private checklists: Map<string, VerificationChecklist> = new Map();
    private idempotencyKeys: Set<string> = new Set();
    constructor() {
        this.initializeDefaultChecklists();
    }
    private initializeDefaultChecklists(): void {
        const defaultChecklists: VerificationChecklist[] = [
            {
                id: 'checklist-kyc',
                name: 'KYC Verification Checklist',
                category: 'KYC',
                version: 1,
                items: [
                    { id: 'kyc-1', label: 'Identity proof matches resident profile', required: true, completed: false },
                    { id: 'kyc-2', label: 'Address proof is valid and current', required: true, completed: false },
                    { id: 'kyc-3', label: 'Photo is clear and matches resident', required: true, completed: false },
                    { id: 'kyc-4', label: 'Document is not expired', required: true, completed: false },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'checklist-rental',
                name: 'Rental Agreement Verification Checklist',
                category: 'RENTAL_AGREEMENT',
                version: 1,
                items: [
                    { id: 'rental-1', label: 'All pages present and legible', required: true, completed: false },
                    { id: 'rental-2', label: 'Landlord and tenant signatures present', required: true, completed: false },
                    { id: 'rental-3', label: 'Rent amount and deposit match records', required: true, completed: false },
                    { id: 'rental-4', label: 'Agreement dates are valid', required: true, completed: false },
                    { id: 'rental-5', label: 'Stamp duty paid (if applicable)', required: false, completed: false },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'checklist-ownership',
                name: 'Ownership Proof Verification Checklist',
                category: 'OWNERSHIP_PROOF',
                version: 1,
                items: [
                    { id: 'own-1', label: 'Title deed matches unit records', required: true, completed: false },
                    { id: 'own-2', label: 'No encumbrances or liens', required: true, completed: false },
                    { id: 'own-3', label: 'Chain of ownership is complete', required: false, completed: false },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'checklist-noc',
                name: 'NOC Verification Checklist',
                category: 'NOC',
                version: 1,
                items: [
                    { id: 'noc-1', label: 'All dues cleared', required: true, completed: false },
                    { id: 'noc-2', label: 'No pending complaints', required: true, completed: false },
                    { id: 'noc-3', label: 'Parking and assets returned', required: true, completed: false },
                    { id: 'noc-4', label: 'Access cards deactivated', required: false, completed: false },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: 'checklist-default',
                name: 'Default Document Verification Checklist',
                category: 'OTHER',
                version: 1,
                items: [
                    { id: 'def-1', label: 'Document is complete and legible', required: true, completed: false },
                    { id: 'def-2', label: 'Metadata matches uploaded file', required: true, completed: false },
                    { id: 'def-3', label: 'No signs of tampering', required: true, completed: false },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
        defaultChecklists.forEach(c => this.checklists.set(c.category, c));
    }
    getChecklist(category: string): VerificationChecklist {
        return this.checklists.get(category) || this.checklists.get('OTHER')!;
    }
    async createVerificationCase(document: Document, version: DocumentVersion, submittedBy: string, context: DocumentAccessContext): Promise<VerificationCase> {
        const accessCheck = await documentAccessService.checkDocumentAccess(context, document, 'VERIFY');
        if (!accessCheck.canVerify) {
            throw new Error(`Insufficient permissions: ${accessCheck.denialReason}`);
        }
        const checklist = this.getChecklist(document.category);
        const now = new Date().toISOString();
        const verificationCase: VerificationCase = {
            id: `vc-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            documentId: document.id,
            versionId: version.id,
            status: 'PENDING',
            submittedBy,
            submittedAt: now,
            checklist: checklist.items.map(item => ({ ...item })),
            createdAt: now,
            updatedAt: now,
        };
        this.verificationCases.set(verificationCase.id, verificationCase);
        await this.logVerificationActivity({
            actorUserId: submittedBy,
            actorRole: 'RESIDENT',
            societyId: context.societyId,
            action: 'CREATE_VERIFICATION_CASE',
            documentId: document.id,
            versionId: version.id,
        });
        return verificationCase;
    }
    async getVerificationCase(caseId: string): Promise<VerificationCase | null> {
        return this.verificationCases.get(caseId) || null;
    }
    async getVerificationCasesByDocument(documentId: string): Promise<VerificationCase[]> {
        return Array.from(this.verificationCases.values()).filter(c => c.documentId === documentId);
    }
    async getPendingVerificationCases(societyId: string, reviewerRole: string): Promise<VerificationCase[]> {
        const allCases = Array.from(this.verificationCases.values())
            .filter(c => c.status === 'PENDING' || c.status === 'IN_REVIEW');
        if (['SUPER_ADMIN', 'SOCIETY_ADMIN', 'CHAIRPERSON', 'SECRETARY', 'TREASURER', 'COMMITTEE_MEMBER'].includes(reviewerRole)) {
            return allCases.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
        }
        return allCases.filter(c => {
            return true;
        });
    }
    async verifyDocument(input: VerifyDocumentInput, context: DocumentAccessContext): Promise<VerificationResult> {
        const idempotencyKey = createIdempotencyKey('verify_document', input.documentId, input.action);
        if (this.idempotencyKeys.has(idempotencyKey)) {
            return { success: false, error: 'Duplicate verification request' };
        }
        this.idempotencyKeys.add(idempotencyKey);
        const document = mockStore.getState().documents?.find(d => d.id === input.documentId);
        if (!document) {
            return { success: false, error: 'Document not found' };
        }
        const version = mockStore.getState().documentVersions?.find(v => v.documentId === input.documentId && v.status === 'CURRENT');
        if (!version) {
            return { success: false, error: 'Current version not found' };
        }
        const accessCheck = await documentAccessService.checkDocumentAccess(context, document, 'VERIFY');
        if (!accessCheck.canVerify) {
            return { success: false, error: accessCheck.denialReason };
        }
        const cases = await this.getVerificationCasesByDocument(input.documentId);
        const activeCase = cases.find(c => c.status === 'PENDING' || c.status === 'IN_REVIEW');
        if (!activeCase) {
            return { success: false, error: 'No active verification case found' };
        }
        const now = new Date().toISOString();
        const checklist = activeCase.checklist.map(item => {
            if (input.completedChecklistItems?.includes(item.id)) {
                return { ...item, completed: true, completedAt: now, completedBy: context.userId };
            }
            return item;
        });
        const allRequiredCompleted = checklist.filter(i => i.required).every(i => i.completed);
        const hasRejections = input.action === 'REJECT';
        activeCase.status = hasRejections ? 'REJECTED' : (allRequiredCompleted ? 'APPROVED' : 'IN_REVIEW');
        activeCase.reviewedBy = context.userId;
        activeCase.reviewedAt = now;
        activeCase.decision = hasRejections ? 'REJECT' : 'APPROVE';
        activeCase.reason = input.reason;
        activeCase.checklist = checklist;
        activeCase.updatedAt = now;
        this.verificationCases.set(activeCase.id, activeCase);
        const newStatus = this.getDocumentStatusFromVerification(activeCase.status);
        const updatedDocument: Document = {
            ...document,
            status: newStatus,
            verificationStatus: hasRejections ? 'REJECTED' : 'VERIFIED',
            verifiedAt: hasRejections ? undefined : now,
            verifiedBy: hasRejections ? undefined : context.userId,
            rejectionReason: hasRejections ? input.reason : undefined,
            updatedAt: now,
        };
        mockStore.getState().documents = mockStore.getState().documents?.map(d => d.id === input.documentId ? updatedDocument : d) || [];
        mockStore.notify();
        await this.logVerificationActivity({
            actorUserId: context.userId,
            actorRole: context.userRole,
            societyId: context.societyId,
            action: hasRejections ? 'REJECT' : 'VERIFY',
            documentId: input.documentId,
            versionId: version.id,
            decision: hasRejections ? 'REJECT' : 'APPROVE',
            reason: input.reason,
        });
        return { success: true, document: updatedDocument, verificationCaseId: activeCase.id };
    }
    async rejectDocument(input: RejectDocumentInput, context: DocumentAccessContext): Promise<VerificationResult> {
        const document = mockStore.getState().documents?.find(d => d.id === input.documentId);
        if (!document) {
            return { success: false, error: 'Document not found' };
        }
        const accessCheck = await documentAccessService.checkDocumentAccess(context, document, 'VERIFY');
        if (!accessCheck.canVerify) {
            return { success: false, error: accessCheck.denialReason };
        }
        const cases = await this.getVerificationCasesByDocument(input.documentId);
        const activeCase = cases.find(c => c.status === 'PENDING' || c.status === 'IN_REVIEW');
        if (!activeCase) {
            return { success: false, error: 'No active verification case found' };
        }
        const now = new Date().toISOString();
        activeCase.status = 'REJECTED';
        activeCase.reviewedBy = context.userId;
        activeCase.reviewedAt = now;
        activeCase.decision = 'REJECT';
        activeCase.reason = input.reason;
        activeCase.updatedAt = now;
        if (input.resubmissionAllowed) {
            activeCase.status = 'PENDING';
            activeCase.resubmissionDeadline = input.resubmissionDeadline;
        }
        this.verificationCases.set(activeCase.id, activeCase);
        const updatedDocument: Document = {
            ...document,
            status: 'REJECTED',
            verificationStatus: 'REJECTED',
            rejectionReason: input.reason,
            updatedAt: now,
        };
        mockStore.getState().documents = mockStore.getState().documents?.map(d => d.id === input.documentId ? updatedDocument : d) || [];
        mockStore.notify();
        await this.logVerificationActivity({
            actorUserId: context.userId,
            actorRole: context.userRole,
            societyId: context.societyId,
            action: 'REJECT',
            documentId: input.documentId,
            versionId: '',
            decision: 'REJECT',
            reason: input.reason,
        });
        return { success: true, document: updatedDocument, verificationCaseId: activeCase.id };
    }
    async requestResubmission(documentId: string, context: DocumentAccessContext, reason: string, deadline?: string): Promise<VerificationResult> {
        const document = mockStore.getState().documents?.find(d => d.id === documentId);
        if (!document) {
            return { success: false, error: 'Document not found' };
        }
        const accessCheck = await documentAccessService.checkDocumentAccess(context, document, 'VERIFY');
        if (!accessCheck.canVerify) {
            return { success: false, error: accessCheck.denialReason };
        }
        const cases = await this.getVerificationCasesByDocument(documentId);
        const activeCase = cases.find(c => c.status === 'REJECTED' || c.status === 'IN_REVIEW');
        if (!activeCase) {
            return { success: false, error: 'No active verification case found for resubmission' };
        }
        const now = new Date().toISOString();
        activeCase.status = 'PENDING';
        activeCase.resubmissionDeadline = deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        activeCase.updatedAt = now;
        this.verificationCases.set(activeCase.id, activeCase);
        const updatedDocument: Document = {
            ...document,
            status: 'PENDING_VERIFICATION',
            verificationStatus: 'PENDING',
            rejectionReason: undefined,
            updatedAt: now,
        };
        mockStore.getState().documents = mockStore.getState().documents?.map(d => d.id === documentId ? updatedDocument : d) || [];
        mockStore.notify();
        await this.logVerificationActivity({
            actorUserId: context.userId,
            actorRole: context.userRole,
            societyId: context.societyId,
            action: 'RESUBMIT',
            documentId,
            versionId: '',
        });
        return { success: true, document: updatedDocument, verificationCaseId: activeCase.id };
    }
    async getVerificationHistory(documentId: string): Promise<VerificationCase[]> {
        return this.getVerificationCasesByDocument(documentId);
    }
    async getVerificationStats(societyId: string): Promise<{
        pending: number;
        inReview: number;
        approved: number;
        rejected: number;
        total: number;
    }> {
        const allCases = Array.from(this.verificationCases.values());
        return {
            pending: allCases.filter(c => c.status === 'PENDING').length,
            inReview: allCases.filter(c => c.status === 'IN_REVIEW').length,
            approved: allCases.filter(c => c.status === 'APPROVED').length,
            rejected: allCases.filter(c => c.status === 'REJECTED').length,
            total: allCases.length,
        };
    }
    private getDocumentStatusFromVerification(verificationStatus: string): DocumentStatus {
        switch (verificationStatus) {
            case 'APPROVED': return 'VERIFIED';
            case 'REJECTED': return 'REJECTED';
            default: return 'PENDING_VERIFICATION';
        }
    }
    private async logVerificationActivity(data: VerificationAuditData): Promise<void> {
        const accessLog: DocumentAccessLog = {
            id: `dal-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            documentId: data.documentId,
            versionId: data.versionId,
            societyId: data.societyId,
            actorUserId: data.actorUserId,
            actorName: data.actorUserId,
            actorRole: data.actorRole,
            action: 'VERIFY',
            timestamp: new Date().toISOString(),
            result: 'SUCCESS',
            metadata: {
                action: data.action,
                decision: data.decision,
                reason: data.reason,
            },
        };
        mockStore.getState().documentAccessLogs?.push(accessLog);
        mockStore.notify();
        auditService.log({
            actorId: data.actorUserId,
            actorRole: data.actorRole as any,
            societyId: data.societyId,
            action: data.action,
            entityType: 'DOCUMENT',
            entityId: data.documentId,
            metadata: {
                versionId: data.versionId,
                decision: data.decision,
                reason: data.reason,
            },
        });
    }
}
export const documentVerificationService = new DocumentVerificationService();


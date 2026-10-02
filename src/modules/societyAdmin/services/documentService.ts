import { mockStore } from '../../../core/mockStore/mockStore';
import type { DocumentRequirement, ResidentDocument, SubmitDocumentsRequest, ResidentRelationshipType } from '../data/residentRegistration.types';
const withMockDelay = <T>(data: T, ms = 500): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(data), ms));
function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
function getRequiredDocuments(relationshipType: ResidentRelationshipType): DocumentRequirement[] {
    const baseRequirements: DocumentRequirement[] = [
        {
            type: 'identity_proof',
            label: 'Identity Proof (Aadhaar/PAN/Passport)',
            description: 'Government issued photo ID',
            mandatory: true,
            acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
            maxSizeMB: 5,
        },
        {
            type: 'address_proof',
            label: 'Address Proof',
            description: 'Recent utility bill or bank statement',
            mandatory: true,
            acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
            maxSizeMB: 5,
        },
    ];
    if (relationshipType === 'TENANT') {
        baseRequirements.push({
            type: 'rent_agreement',
            label: 'Rent Agreement',
            description: 'Signed rental agreement with owner',
            mandatory: true,
            acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
            maxSizeMB: 10,
        }, {
            type: 'police_verification',
            label: 'Police Verification',
            description: 'Police verification certificate',
            mandatory: true,
            acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
            maxSizeMB: 5,
        });
    }
    if (relationshipType === 'OWNER' || relationshipType === 'CO_OWNER') {
        baseRequirements.push({
            type: 'ownership_proof',
            label: 'Ownership Proof',
            description: 'Sale deed or property tax receipt',
            mandatory: true,
            acceptedTypes: ['pdf', 'jpg', 'jpeg', 'png'],
            maxSizeMB: 10,
        });
    }
    return baseRequirements;
}
export const documentService = {
    async getRequiredDocuments(societyId: string, relationshipType: ResidentRelationshipType): Promise<DocumentRequirement[]> {
        return withMockDelay(getRequiredDocuments(relationshipType));
    },
    async uploadDocument(registrationId: string, file: {
        uri: string;
        name: string;
        type: string;
        size: number;
    }, documentType: string): Promise<{
        url: string;
        document: ResidentDocument;
    }> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUrl = `mock://documents/${registrationId}/${generateId('file')}`;
                const document: ResidentDocument = {
                    id: generateId('doc'),
                    registrationId,
                    type: documentType,
                    fileName: file.name,
                    fileSize: file.size,
                    mimeType: file.type,
                    status: 'UPLOADED',
                    uploadedAt: new Date().toISOString(),
                    url: mockUrl,
                };
                mockStore.addResidentDocument(document);
                resolve({ url: mockUrl, document });
            }, 800);
        });
    },
    async submitDocuments(request: SubmitDocumentsRequest): Promise<ResidentDocument[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const now = new Date().toISOString();
                const documents: ResidentDocument[] = request.documents.map((d) => ({
                    id: generateId('doc'),
                    registrationId: request.registrationId,
                    type: d.type,
                    fileName: d.fileName,
                    fileSize: d.fileSize,
                    mimeType: d.mimeType,
                    status: 'SUBMITTED',
                    uploadedAt: now,
                    submittedAt: now,
                    url: d.url,
                }));
                documents.forEach(doc => mockStore.addResidentDocument(doc));
                resolve(documents);
            }, 500);
        });
    },
    async getDocuments(registrationId: string): Promise<ResidentDocument[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const documents = (mockStore.getState().residentDocuments || []).filter((d) => d.registrationId === registrationId);
                resolve(documents);
            }, 300);
        });
    },
    async verifyDocument(documentId: string, adminId: string): Promise<ResidentDocument> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const documents = mockStore.getState().residentDocuments || [];
                const index = documents.findIndex((d) => d.id === documentId);
                if (index === -1) {
                    reject(new Error('Document not found'));
                    return;
                }
                const updated = { ...documents[index], status: 'VERIFIED' as const, verifiedAt: new Date().toISOString(), verifiedBy: adminId };
                mockStore.updateResidentDocument(documentId, updated);
                resolve(updated);
            }, 400);
        });
    },
    async rejectDocument(documentId: string, adminId: string, reason: string): Promise<ResidentDocument> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const documents = mockStore.getState().residentDocuments || [];
                const index = documents.findIndex((d) => d.id === documentId);
                if (index === -1) {
                    reject(new Error('Document not found'));
                    return;
                }
                const updated = { ...documents[index], status: 'REJECTED' as const, verifiedAt: new Date().toISOString(), verifiedBy: adminId, rejectionReason: reason };
                mockStore.updateResidentDocument(documentId, updated);
                resolve(updated);
            }, 400);
        });
    },
    async deleteDocument(documentId: string): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const documents = mockStore.getState().residentDocuments.filter((d) => d.id !== documentId);
                resolve();
            }, 300);
        });
    },
};


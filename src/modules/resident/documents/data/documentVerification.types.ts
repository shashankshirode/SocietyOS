import type { JsonObject } from '../../../../core/api/api.types';
import type { Absent } from "../../../../shared/types/absence.types";
export type DocumentCategory = 'KYC' | 'RENTAL_AGREEMENT' | 'PROOF_OF_OWNERSHIP' | 'NOC' | 'MOVE_IN_MOVE_OUT' | 'COMPLIANCE' | 'FINANCIAL' | 'LEGAL' | 'INSURANCE' | 'VEHICLE_REGISTRATION' | 'PARKING' | 'PET_REGISTRATION' | 'STAFF_CONTRACT' | 'VENDOR_CONTRACT' | 'AMC' | 'MAINTENANCE_RECORD' | 'OTHER';
export type DocumentStatus = 'DRAFT_UPLOAD' | 'VALIDATING' | 'STORED' | 'PENDING_ADMIN_REVIEW' | 'RESUBMISSION_REQUIRED' | 'VERIFIED' | 'SIGNATURE_PENDING' | 'SIGNED' | 'ACTIVE' | 'SUPERSEDED' | 'EXPIRED' | 'REJECTED' | 'ARCHIVED';
export type VerificationStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'VERIFIED' | 'SIGNED' | 'REJECTED' | 'RESUBMISSION_REQUESTED' | 'EXPIRED';
export type VerificationDecision = 'APPROVE' | 'REJECT' | 'REQUEST_RESUBMISSION';
export type SignatureMethod = 'DIGITAL' | 'E_SIGN' | 'WET_INK' | 'DSC' | 'AADHAAR_ESIGN';
export type ChecklistItem = {
    id: string;
    label: string;
    description?: string | Absent;
    required: boolean;
    completed: boolean;
    completedAt?: string | Absent;
    completedBy?: string | Absent;
    notes?: string | Absent;
};
export type VerificationChecklist = {
    id: string;
    name: string;
    category: DocumentCategory;
    items: ChecklistItem[];
    version: number;
    createdAt: string;
    updatedAt: string;
};
export type VerificationCase = {
    id: string;
    documentId: string;
    documentVersion: number;
    category: DocumentCategory;
    status: VerificationStatus;
    checklistId: string;
    checklist: ChecklistItem[];
    submittedBy: string;
    submittedAt: string;
    reviewedBy?: string | Absent;
    reviewedAt?: string | Absent;
    decision?: VerificationDecision | Absent;
    decisionReason?: string | Absent;
    resubmissionDeadline?: string | Absent;
    resubmissionCount: number;
    adminSignature?: DigitalSignature | Absent;
    createdAt: string;
    updatedAt: string;
};
export type DigitalSignature = {
    id: string;
    verificationCaseId: string;
    signedBy: string;
    signedAt: string;
    signatureMethod: SignatureMethod;
    certificateId?: string | Absent;
    certificateThumbprint?: string | Absent;
    signatureValue: string;
    signedDataHash: string;
    algorithm: string;
    timestamp: string;
    ipAddress?: string | Absent;
    deviceInfo?: string | Absent;
    isValid: boolean;
    validatedAt?: string | Absent;
};
export type DocumentMetadata = {
    id: string;
    name: string;
    category: DocumentCategory;
    version: number;
    fileSize: number;
    mimeType: string;
    checksum: string;
    checksumAlgorithm: 'SHA-256' | 'SHA-512' | 'MD5';
    uploadedBy: string;
    uploadedAt: string;
    updatedAt?: string | Absent;
    owningEntity: {
        type: 'RESIDENT' | 'UNIT' | 'SOCIETY' | 'STAFF' | 'VENDOR' | 'ASSET';
        id: string;
    };
    acl: Array<{
        role: string;
        permissions: ('READ' | 'WRITE' | 'VERIFY' | 'SIGN' | 'DELETE')[];
    }>;
    retentionPolicy?: {
        retainUntil: string;
        autoDelete: boolean;
    } | Absent;
    tags?: string[] | Absent;
    status: DocumentStatus;
    currentVerificationCaseId?: string | Absent;
    verificationHistory: Array<{
        caseId: string;
        status: VerificationStatus;
        decidedAt: string;
        decidedBy: string;
    }>;
};
export type DocumentAccessLog = {
    id: string;
    documentId: string;
    accessedBy: string;
    accessedAt: string;
    action: 'VIEW' | 'DOWNLOAD' | 'VERIFY' | 'SIGN' | 'SHARE' | 'DELETE' | 'VERSION_CREATE';
    ipAddress?: string | Absent;
    userAgent?: string | Absent;
    success: boolean;
    failureReason?: string | Absent;
};
export type ResubmissionRequest = {
    id: string;
    verificationCaseId: string;
    requestedBy: string;
    requestedAt: string;
    reason: string;
    deadline: string;
    newDocumentVersion: number;
    status: 'PENDING' | 'SUBMITTED' | 'EXPIRED';
};
export const DOCUMENT_CATEGORY_CHECKLISTS: Record<string, VerificationChecklist> & {
    DEFAULT: VerificationChecklist;
} = {
    KYC: {
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
    RENTAL_AGREEMENT: {
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
    PROOF_OF_OWNERSHIP: {
        id: 'checklist-ownership',
        name: 'Ownership Proof Verification Checklist',
        category: 'PROOF_OF_OWNERSHIP',
        version: 1,
        items: [
            { id: 'own-1', label: 'Title deed matches unit records', required: true, completed: false },
            { id: 'own-2', label: 'No encumbrances or liens', required: true, completed: false },
            { id: 'own-3', label: 'Chain of ownership is complete', required: false, completed: false },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    NOC: {
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
    DEFAULT: {
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
};
export const STATUS_TRANSITIONS: Record<DocumentStatus, DocumentStatus[]> = {
    DRAFT_UPLOAD: ['VALIDATING', 'REJECTED'],
    VALIDATING: ['STORED', 'REJECTED'],
    STORED: ['PENDING_ADMIN_REVIEW', 'SUPERSEDED', 'ARCHIVED'],
    PENDING_ADMIN_REVIEW: ['VERIFIED', 'REJECTED', 'RESUBMISSION_REQUIRED'],
    RESUBMISSION_REQUIRED: ['VALIDATING', 'REJECTED', 'EXPIRED'],
    VERIFIED: ['SIGNATURE_PENDING', 'ACTIVE', 'SUPERSEDED'],
    SIGNATURE_PENDING: ['SIGNED', 'REJECTED'],
    SIGNED: ['ACTIVE', 'SUPERSEDED'],
    ACTIVE: ['SUPERSEDED', 'EXPIRED', 'ARCHIVED'],
    SUPERSEDED: ['ARCHIVED'],
    EXPIRED: ['ARCHIVED'],
    REJECTED: ['DRAFT_UPLOAD', 'ARCHIVED'],
    ARCHIVED: [],
};


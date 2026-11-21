import type { DocumentInfo } from '../../types/document.types';

export function createDocument(overrides: Partial<DocumentInfo> = {}): DocumentInfo {
  return {
    id: 'doc-001',
    title: 'Rent Agreement 2026-27',
    category: 'RENT_AGREEMENT',
    flatNumber: 'A-1204',
    status: 'VERIFIED',
    uploadedDate: '2026-06-01',
    uploadedBy: 'Rajesh Kumar',
    verifiedDate: '2026-06-03',
    verifiedBy: 'Society Administrator',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    sensitivity: 'RESTRICTED',
    description: 'Registered Rent Agreement copy for Tenant Move-In',
    isSocietyDoc: false,
    ...overrides,
  };
}

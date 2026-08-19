export interface DocumentAccessLog {
  id: string;
  documentId: string;
  documentTitle: string;
  actorName: string;
  actorRole: string;
  action: 'VIEWED' | 'DOWNLOADED' | 'SHARED' | 'UPDATED' | 'VERIFIED' | 'REJECTED';
  timestamp: string;
  deviceInfo: string;
  reason?: string;
}

export const mockDocumentAccessLogs: DocumentAccessLog[] = [
  {
    id: 'log-001',
    documentId: 'doc-res-001',
    documentTitle: 'Owner Aadhaar Card KYC',
    actorName: 'Shashank (You)',
    actorRole: 'OWNER',
    action: 'VIEWED',
    timestamp: '29 Jun 2026, 04:30 PM',
    deviceInfo: 'Samsung SM-G998B (Android 14)',
  },
  {
    id: 'log-002',
    documentId: 'doc-res-003',
    documentTitle: 'Registered Sale Deed Wing A',
    actorName: 'Shashank (You)',
    actorRole: 'OWNER',
    action: 'VIEWED',
    timestamp: '29 Jun 2026, 02:15 PM',
    deviceInfo: 'Samsung SM-G998B (Android 14)',
  },
  {
    id: 'log-003',
    documentId: 'doc-res-003',
    documentTitle: 'Registered Sale Deed Wing A',
    actorName: 'Society Secretary (Patil)',
    actorRole: 'SECRETARY',
    action: 'VIEWED',
    timestamp: '20 Jan 2026, 11:30 AM',
    deviceInfo: 'Web Admin Panel (Chrome/Windows)',
    reason: 'Sale deed verification for flat ownership transfer validation.',
  },
  {
    id: 'log-004',
    documentId: 'doc-res-003',
    documentTitle: 'Registered Sale Deed Wing A',
    actorName: 'Society Secretary (Patil)',
    actorRole: 'SECRETARY',
    action: 'VERIFIED',
    timestamp: '20 Jan 2026, 11:35 AM',
    deviceInfo: 'Web Admin Panel (Chrome/Windows)',
  },
  {
    id: 'log-005',
    documentId: 'doc-res-006',
    documentTitle: 'Tenant Verification Certificate',
    actorName: 'Shashank (You)',
    actorRole: 'OWNER',
    action: 'UPDATED',
    timestamp: '28 Jun 2026, 10:05 AM',
    deviceInfo: 'Samsung SM-G998B (Android 14)',
  },
  {
    id: 'log-006',
    documentId: 'doc-res-007',
    documentTitle: 'Draft Rent Lease Agreement',
    actorName: 'Society Admin (Rohan)',
    actorRole: 'ADMIN',
    action: 'REJECTED',
    timestamp: '22 Jun 2026, 03:40 PM',
    deviceInfo: 'Web Admin Panel (Chrome/Windows)',
    reason: 'Stamp duty paper date mismatch. Please upload signed copy with correct stamps.',
  },
  {
    id: 'log-007',
    documentId: 'doc-res-007',
    documentTitle: 'Draft Rent Lease Agreement',
    actorName: 'Shashank (You)',
    actorRole: 'OWNER',
    action: 'VIEWED',
    timestamp: '22 Jun 2026, 05:00 PM',
    deviceInfo: 'Samsung SM-G998B (Android 14)',
  },
  {
    id: 'log-008',
    documentId: 'doc-res-004',
    documentTitle: 'Flat Share Certificate',
    actorName: 'Shashank (You)',
    actorRole: 'OWNER',
    action: 'DOWNLOADED',
    timestamp: '18 Feb 2026, 09:12 AM',
    deviceInfo: 'Samsung SM-G998B (Android 14)',
  },
];

import { FireNocStatus } from '../types/fireSafety.types';

export interface FireNocRecord {
  id: string;
  nocNumber: string;
  issueDate: string;
  expiryDate: string;
  status: FireNocStatus;
  issuingAuthority: string;
  renewalOwner: string;
  renewalTaskStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED';
}

export const mockFireNoc: FireNocRecord = {
  id: 'fire-noc-1',
  nocNumber: 'NOC-FIRE-2025-99881',
  issueDate: '2025-09-10',
  expiryDate: '2026-09-10',
  status: 'VALID',
  issuingAuthority: 'State Fire Advisory Board / Fire Service',
  renewalOwner: 'Suresh Patil (FM)',
  renewalTaskStatus: 'NOT_STARTED'
};

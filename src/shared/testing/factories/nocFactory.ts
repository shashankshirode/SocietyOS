import type { NocRequest } from '../../types/noc.types';

export function createNocRequest(overrides: Partial<NocRequest> = {}): NocRequest {
  return {
    id: 'noc-001',
    requestNumber: 'NOC-2026-0034',
    nocType: 'MOVE_OUT',
    flatNumber: 'A-1204',
    residentName: 'Rajesh Kumar',
    submittedDate: '2026-07-01',
    requiredByDate: '2026-07-15',
    status: 'UNDER_REVIEW',
    reason: 'Tenant moving out due to lease completion',
    timeline: [
      { title: 'Request Submitted', description: 'NOC application filed online', status: 'COMPLETED', updatedAt: '2026-07-01' },
      { title: 'Accounts Verification', description: 'Checking outstanding maintenance dues', status: 'COMPLETED', updatedAt: '2026-07-02' },
      { title: 'Facility Inspection', description: 'Verifying common area damage claims', status: 'CURRENT', updatedAt: '2026-07-03' },
      { title: 'Committee Approval', description: 'Final signoff by Secretary', status: 'PENDING' }
    ],
    ...overrides,
  };
}

import type { ComplianceItem } from './compliance.types';

export const mockComplianceItems: ComplianceItem[] = [
  {
    id: 'comp-1',
    category: 'FIRE_SAFETY',
    title: 'NOC Renewal Check',
    description: 'Verify if fire NOC renewal certificates are uploaded.',
    status: 'COMPLIANT',
    lastChecked: '2026-06-01',
  },
  {
    id: 'comp-2',
    category: 'LIFT_SAFETY',
    title: 'Lift Weight Capacity Audit',
    description: 'Inspect lift safety certificates in all towers.',
    status: 'PENDING_REVIEW',
    lastChecked: '2026-06-15',
  },
];

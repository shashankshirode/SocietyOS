export interface ComplianceItem {
  id: string;
  category: string;
  title: string;
  description: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW';
  lastChecked: string;
}

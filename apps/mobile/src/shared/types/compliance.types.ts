export type ComplianceCategory =
  | 'WASTE'
  | 'HOUSEKEEPING'
  | 'LIFT_SAFETY'
  | 'FIRE_SAFETY'
  | 'COMMON_AREA'
  | 'CERTIFICATE_RENEWAL'
  | 'DRILL'
  | 'INSPECTION'
  | 'DOCUMENT_REVIEW'
  | 'OTHER';

export type ComplianceTaskStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'REOPENED'
  | 'OVERDUE'
  | 'CANCELLED';

export type CompliancePriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

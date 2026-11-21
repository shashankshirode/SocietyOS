import type { PlatformOperationalAlert } from '../types/platform.types';

export const mockOperationalAlerts: PlatformOperationalAlert[] = [
  { id: 'alert-001', type: 'HIGH_SUPPORT_VOLUME', severity: 'HIGH', societyId: 'soc-004', societyName: 'Skyline Towers', message: 'Skyline Towers has 5 open tickets including 2 critical', createdAt: '2026-06-30T06:00:00Z', status: 'OPEN' },
  { id: 'alert-002', type: 'SOCIETY_ONBOARDING_BLOCKED', severity: 'MEDIUM', societyId: 'soc-002', societyName: 'Riverfront Residency', message: 'Onboarding blocked: data import failing for unit master CSV', createdAt: '2026-06-29T14:00:00Z', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-29T15:00:00Z' },
  { id: 'alert-003', type: 'SECURITY_PRIVACY_REVIEW', severity: 'CRITICAL', societyId: 'soc-006', societyName: 'Lotus Garden Society', message: 'Privacy incident: resident reported cross-unit data visibility', createdAt: '2026-06-30T05:30:00Z', status: 'IN_PROGRESS', ownerId: 'super-admin-001', ownerName: 'Platform Owner' },
  { id: 'alert-004', type: 'LOW_ADOPTION', severity: 'LOW', societyId: 'soc-013', societyName: 'Pinnacle Heights', message: 'Low module adoption: only 11 of 22 modules enabled, 35% user activity', createdAt: '2026-06-28T10:00:00Z', status: 'OPEN' },
  { id: 'alert-005', type: 'FEATURE_FLAG_RISK', severity: 'HIGH', message: 'Critical feature flag subscriptionBillingUI was toggled in staging', createdAt: '2026-06-30T08:00:00Z', status: 'OPEN' },
  { id: 'alert-006', type: 'NOTIFICATION_FAILURE_PLACEHOLDER', severity: 'MEDIUM', message: 'Push notification delivery rate dropped to 72% (threshold: 85%)', createdAt: '2026-06-30T07:00:00Z', status: 'ACKNOWLEDGED', acknowledgedAt: '2026-06-30T07:30:00Z' },
  { id: 'alert-007', type: 'API_ERROR_SPIKE_PLACEHOLDER', severity: 'HIGH', message: '5xx error rate exceeded 2% threshold in last 30 minutes', createdAt: '2026-06-30T09:15:00Z', status: 'OPEN' },
  { id: 'alert-008', type: 'DATA_IMPORT_FAILED', severity: 'MEDIUM', societyId: 'soc-018', societyName: 'Cedar Woods Township', message: 'Bulk unit import failed: 800 records, validation errors on 23 rows', createdAt: '2026-06-29T11:00:00Z', status: 'ASSIGNED', ownerId: 'eng-001', ownerName: 'Engineering Team' },
  { id: 'alert-009', type: 'PAYMENT_FAILURE_SPIKE_PLACEHOLDER', severity: 'HIGH', message: 'Payment failures increased 40% compared to last week average', createdAt: '2026-06-30T10:00:00Z', status: 'OPEN' },
  { id: 'alert-010', type: 'INTEGRATION_DOWN_PLACEHOLDER', severity: 'CRITICAL', message: 'SMS provider reporting degraded performance — delivery delays > 5min', createdAt: '2026-06-30T11:00:00Z', status: 'OPEN' },
  { id: 'alert-011', type: 'LOW_ADOPTION', severity: 'LOW', societyId: 'soc-017', societyName: 'Sagar View CHS', message: 'Low adoption: only 10 modules enabled, 22% DAU', createdAt: '2026-06-27T09:00:00Z', status: 'CLOSED' },
  { id: 'alert-012', type: 'HIGH_SUPPORT_VOLUME', severity: 'MEDIUM', message: 'Platform-wide: 12 open tickets, 3 breaching SLA', createdAt: '2026-06-30T12:00:00Z', status: 'OPEN' },
  { id: 'alert-013', type: 'SOCIETY_ONBOARDING_BLOCKED', severity: 'LOW', societyId: 'soc-008', societyName: 'Horizon Park', message: 'Onboarding draft pending review for 15 days', createdAt: '2026-06-30T08:00:00Z', status: 'OPEN' },
  { id: 'alert-014', type: 'FEATURE_FLAG_RISK', severity: 'MEDIUM', message: 'Feature flag realPayments has society override in soc-010', createdAt: '2026-06-29T16:00:00Z', status: 'RESOLVED' },
  { id: 'alert-015', type: 'SECURITY_PRIVACY_REVIEW', severity: 'HIGH', message: 'User lookup audit: 15 lookups performed in last 24 hours', createdAt: '2026-06-30T06:30:00Z', status: 'ACKNOWLEDGED' },
];

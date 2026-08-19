import type { PlatformSettingsGroup } from '../types/platform.types';

export const mockPlatformSettings: PlatformSettingsGroup[] = [
  { id: 'sg-001', groupName: 'Platform Defaults', description: 'Default values for new societies', settings: [
    { key: 'defaultLanguage', label: 'Default Language', value: 'en', type: 'SELECT', editable: true, description: 'Default language for new societies' },
    { key: 'defaultTimezone', label: 'Default Timezone', value: 'Asia/Kolkata', type: 'TEXT', editable: true, description: 'Default timezone' },
    { key: 'maxUnitsPerSociety', label: 'Max Units Per Society', value: '2000', type: 'NUMBER', editable: true, description: 'Maximum units allowed per society' },
  ]},
  { id: 'sg-002', groupName: 'Support SLA Defaults', description: 'Default SLA timelines for support tickets', settings: [
    { key: 'criticalSlaHours', label: 'Critical SLA (hours)', value: '4', type: 'NUMBER', editable: true, description: 'SLA for critical tickets' },
    { key: 'highSlaHours', label: 'High SLA (hours)', value: '12', type: 'NUMBER', editable: true, description: 'SLA for high priority tickets' },
    { key: 'mediumSlaDays', label: 'Medium SLA (days)', value: '3', type: 'NUMBER', editable: true, description: 'SLA for medium priority tickets' },
    { key: 'lowSlaDays', label: 'Low SLA (days)', value: '7', type: 'NUMBER', editable: true, description: 'SLA for low priority tickets' },
  ]},
  { id: 'sg-003', groupName: 'Audit Retention', description: 'Audit log retention policies', settings: [
    { key: 'auditRetentionDays', label: 'Audit Retention (days)', value: '365', type: 'NUMBER', editable: false, description: 'Days to retain audit logs' },
    { key: 'sensitiveAuditRetention', label: 'Sensitive Audit Retention (days)', value: '730', type: 'NUMBER', editable: false, description: 'Days to retain sensitive audit logs' },
  ]},
  { id: 'sg-004', groupName: 'Hidden Commercial Controls', description: 'Commercial control visibility settings', settings: [
    { key: 'commercialControlsVisible', label: 'Show Commercial Controls', value: 'false', type: 'BOOLEAN', editable: true, description: 'Enable hidden commercial controls for super admins' },
    { key: 'defaultPlanCode', label: 'Default Plan Code', value: 'FREE_LAUNCH', type: 'SELECT', editable: true, description: 'Default plan for new societies' },
    { key: 'defaultBillingMode', label: 'Default Billing Mode', value: 'DISABLED', type: 'SELECT', editable: true, description: 'Default billing mode' },
  ]},
  { id: 'sg-005', groupName: 'Security Policies', description: 'Platform security configuration', settings: [
    { key: 'maxLoginAttempts', label: 'Max Login Attempts', value: '5', type: 'NUMBER', editable: false, description: 'Maximum login attempts before lockout' },
    { key: 'sessionTimeoutMinutes', label: 'Session Timeout (min)', value: '30', type: 'NUMBER', editable: false, description: 'Session timeout duration' },
    { key: 'mfaRequired', label: 'MFA Required', value: 'true', type: 'BOOLEAN', editable: false, description: 'Require MFA for admin users' },
  ]},
];

import type { PlatformAuditLogEntry, PlatformAuditEventType } from '../types/platform.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
const entry = (id: string, event: string, entityType: string, entityRef: string, societyId?: string, societyName?: string, riskLevel: string = 'LOW'): PlatformAuditLogEntry => ({
    id,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    actorId: 'super-admin-001',
    actorName: 'Platform Owner',
    actorRole: 'SUPER_ADMIN',
    event: event as PlatformAuditEventType,
    entityType,
    entityReference: entityRef,
    correlationId: `corr-${id}`,
    riskLevel: riskLevel as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    safeMetadata: {},
    ...includeWhenPresent("societyId", societyId),
    ...includeWhenPresent("societyName", societyName)
});
export const mockPlatformAuditLogs: PlatformAuditLogEntry[] = [
    entry('pal-001', 'SOCIETY_CREATED', 'Society', 'soc-018', 'soc-018', 'Cedar Woods Township'),
    entry('pal-002', 'SOCIETY_ACTIVATED', 'Society', 'soc-016', 'soc-016', 'Emerald Gardens'),
    entry('pal-003', 'FEATURE_FLAG_CHANGED', 'FeatureFlag', 'communityMarketplace', undefined, undefined, 'MEDIUM'),
    entry('pal-004', 'MODULE_CONFIGURATION_CHANGED', 'ModuleConfig', 'soc-001/compliance', 'soc-001', 'Green Valley Heights'),
    entry('pal-005', 'HIDDEN_COMMERCIAL_CONTROL_VIEWED', 'CommercialControl', 'soc-007', 'soc-007', 'Sunrise Heights', 'HIGH'),
    entry('pal-006', 'PLAN_MAPPING_CHANGED', 'PlanMapping', 'soc-005', 'soc-005', 'Sahyadri Enclave', 'HIGH'),
    entry('pal-007', 'SUPPORT_TICKET_ESCALATED', 'SupportTicket', 'tkt-006', 'soc-010', 'Metro Square', 'MEDIUM'),
    entry('pal-008', 'USER_LOOKUP_PERFORMED', 'UserLookup', 'usr-015', undefined, undefined, 'MEDIUM'),
    entry('pal-009', 'DATA_EXPORT_REQUESTED', 'DataExport', 'exp-001', undefined, undefined, 'HIGH'),
    entry('pal-010', 'PLATFORM_SETTINGS_CHANGED', 'PlatformSettings', 'default-language', undefined, undefined, 'LOW'),
    entry('pal-011', 'SOCIETY_CREATED', 'Society', 'soc-012', 'soc-012', 'Silver Oaks CHS'),
    entry('pal-012', 'FEATURE_FLAG_CHANGED', 'FeatureFlag', 'staffAttendance', 'soc-004', 'Skyline Towers'),
    entry('pal-013', 'MODULE_CONFIGURATION_CHANGED', 'ModuleConfig', 'soc-007/governance', 'soc-007', 'Sunrise Heights'),
    entry('pal-014', 'HIDDEN_COMMERCIAL_CONTROL_VIEWED', 'CommercialControl', 'soc-004', 'soc-004', 'Skyline Towers', 'HIGH'),
    entry('pal-015', 'SUPPORT_TICKET_ESCALATED', 'SupportTicket', 'tkt-008', 'soc-006', 'Lotus Garden Society', 'MEDIUM'),
    entry('pal-016', 'USER_LOOKUP_PERFORMED', 'UserLookup', 'usr-003', undefined, undefined, 'MEDIUM'),
    entry('pal-017', 'SOCIETY_ACTIVATED', 'Society', 'soc-020', 'soc-020', 'Tulip Towers'),
    entry('pal-018', 'FEATURE_FLAG_CHANGED', 'FeatureFlag', 'emergencySafety', undefined, undefined, 'MEDIUM'),
    entry('pal-019', 'IMPERSONATION_PLACEHOLDER_OPENED', 'Impersonation', 'soc-001/usr-001', 'soc-001', 'Green Valley Heights', 'CRITICAL'),
    entry('pal-020', 'DATA_EXPORT_REQUESTED', 'DataExport', 'exp-002', 'soc-007', 'Sunrise Heights', 'HIGH'),
    ...Array.from({ length: 20 }, (_, i) => entry(`pal-${String(i + 21).padStart(3, '0')}`, getRequiredItem((['SOCIETY_CREATED', 'FEATURE_FLAG_CHANGED', 'MODULE_CONFIGURATION_CHANGED', 'USER_LOOKUP_PERFORMED', 'PLATFORM_SETTINGS_CHANGED'] as const), i % 5, "platformAuditLogs.mock.ts"), 'Various', `ref-${i + 21}`, i % 3 === 0 ? `soc-${String((i % 20) + 1).padStart(3, '0')}` : undefined, i % 3 === 0 ? `Society ${(i % 20) + 1}` : undefined)),
];


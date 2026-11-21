import { getRequiredItem } from "../utils/requiredItem";
export interface ComplianceAuditLogEntry {
    id: string;
    timestamp: string;
    actorName: string;
    actorRole: string;
    eventName: string;
    entityType: string;
    entityReference: string;
    details: string;
}
export const mockComplianceAuditLogs: ComplianceAuditLogEntry[] = Array.from({ length: 35 }, (_, idx) => {
    const events = [
        'Compliance Task Created', 'Task Assigned', 'Task Completed', 'Task Verified',
        'Waste Pickup Completed', 'Waste Violation Logged', 'Housekeeping Round Completed',
        'Supervisor Verification Submitted', 'Lift Breakdown Reported', 'Lift Maintenance Visit Logged',
        'Lift Certificate Updated', 'Fire Equipment Inspected', 'Fire Drill Completed', 'Fire NOC Renewal Started'
    ];
    const actors = ['Suresh Patil', 'Kavita Jadhav', 'Prakash More', 'System'];
    const roles = ['FACILITY_MANAGER', 'HOUSEKEEPING_SUPERVISOR', 'SAFETY_OFFICER', 'SYSTEM'];
    const eventIdx = idx % events.length;
    const actorIdx = idx % actors.length;
    return {
        id: `audit-${idx + 1}`,
        timestamp: `2026-06-29T${String(10 + (idx % 12)).padStart(2, '0')}:${String((idx * 7) % 60).padStart(2, '0')}:00Z`,
        actorName: getRequiredItem(actors, actorIdx, "complianceAuditLogs.mock.ts"),
        actorRole: getRequiredItem(roles, actorIdx, "complianceAuditLogs.mock.ts"),
        eventName: getRequiredItem(events, eventIdx, "complianceAuditLogs.mock.ts"),
        entityType: 'COMPLIANCE',
        entityReference: `REF-${2026}-${String(idx + 1).padStart(4, '0')}`,
        details: `Audit entry for event: ${getRequiredItem(events, eventIdx, "complianceAuditLogs.mock.ts")} initiated by ${getRequiredItem(actors, actorIdx, "complianceAuditLogs.mock.ts")} (${getRequiredItem(roles, actorIdx, "complianceAuditLogs.mock.ts")}).`
    };
});


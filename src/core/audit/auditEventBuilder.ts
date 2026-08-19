import { createCorrelationId, getMockRequestContext } from '../api/requestContext';
import type { AuditEvent, AuditEventType } from './audit.types';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
const sensitiveMetadataPattern = /(token|mobile|phone|email|aadhaar|pan|gst|rfid|password|payment|card|upi|message|chat)/i;
type BuildAuditEventInput = {
    eventType: AuditEventType;
    entityType?: string;
    entityId?: string;
    metadata?: AuditEvent['metadata'];
};
function sanitizeMetadata(metadata: AuditEvent['metadata'] = {}): AuditEvent['metadata'] {
    return Object.fromEntries(Object.entries(metadata).filter(([key, value]) => (value !== undefined &&
        !sensitiveMetadataPattern.test(key))));
}
export function buildAuditEvent(input: BuildAuditEventInput): AuditEvent {
    const context = getMockRequestContext();
    return {
        eventType: input.eventType,
        actorUserId: context.actorUserId ?? 'unknown-user',
        actorRole: context.activeRole ?? 'RESIDENT_OWNER',
        societyId: context.societyId ?? 'unknown-society',
        ...includeWhenPresent("unitId", context.unitId),
        ...includeWhenPresent("entityType", input.entityType),
        ...includeWhenPresent("entityId", input.entityId),
        timestamp: new Date().toISOString(),
        correlationId: context.correlationId ?? createCorrelationId(),
        ...includeWhenPresent("metadata", sanitizeMetadata(input.metadata))
    };
}


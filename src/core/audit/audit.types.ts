export type AuditActorType = 'RESIDENT' | 'ADMIN' | 'GUARD' | 'STAFF' | 'VENDOR' | 'SYSTEM' | 'AI_SERVICE';
export type AuditAction = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'VERIFY' | 'SIGN' | 'PAY' | 'REFUND' | 'REVERSE' | 'IMPORT' | 'EXPORT' | 'SYNC' | 'LOGIN' | 'LOGOUT' | 'OVERRIDE' | 'ESCALATE' | 'ACKNOWLEDGE' | 'BACKUP_START' | 'BACKUP_COMPLETE' | 'BACKUP_FAILED' | 'RESTORE_COMPLETE' | 'INCIDENT_PHASE_TRANSITION' | 'GATE_ENTRY_CAPTURE' | 'GATE_ENTRY_CONFLICT' | 'GATE_ENTRY_REJECTED' | 'GATE_ENTRY_SYNC_ERROR' | 'GATE_ENTRY_CONFLICT_RESOLVED' | 'IMPORT_UPLOAD' | 'IMPORT_COMMIT' | 'IMPORT_ROLLBACK' | 'EXPORT_START' | 'GLOBAL_SEARCH' | 'AI_COMPLAINT_CLASSIFICATION' | 'AI_COMPLAINT_CLASSIFICATION_FAILED' | 'AI_CLASSIFICATION_REVIEW' | 'NOTIFICATION_SEND' | 'BANK_STATEMENT_UPLOAD' | 'BANK_RECONCILIATION_START' | 'BANK_RECONCILIATION_MANUAL_MATCH' | 'RECONCILIATION_DISCREPANCY_RESOLVED' | 'BANK_RECONCILIATION_COMPLETE' | 'GST_RETURN_VALIDATION' | 'GST_RETURN_FILED' | 'TDS_RETURN_VALIDATION' | 'MONTH_END_CLOSE_OPEN' | 'MEC_TASK_START' | 'MEC_TASK_COMPLETE' | 'MEC_VALIDATION_RUN' | 'MONTH_END_CLOSE_COMPLETE' | 'MONTH_END_CLOSE_REOPEN' | 'OPENING_BALANCE_UPLOAD' | 'OPENING_BALANCE_VALIDATION' | 'OPENING_BALANCE_COMMIT' | 'OPENING_BALANCE_ROLLBACK';
export type AuditEntityType = 'RESIDENT' | 'USER' | 'UNIT' | 'VEHICLE' | 'VISITOR_PASS' | 'COMPLAINT' | 'BILL' | 'PAYMENT' | 'PAYMENT_ORDER' | 'FACILITY' | 'FACILITY_BOOKING' | 'NOTICE' | 'NOTICE_ACKNOWLEDGEMENT' | 'DOCUMENT' | 'DOCUMENT_ACCESS_GRANT' | 'NOC_REQUEST' | 'MOVE_IN_OUT_REQUEST' | 'POLL' | 'POLL_VOTE' | 'MEETING' | 'MEETING_RSVP' | 'MEETING_PROXY' | 'VENDOR' | 'VENDOR_CONTRACT' | 'VENDOR_STAFF' | 'VENDOR_RATING' | 'WORK_ORDER' | 'WORK_ORDER_STATUS_HISTORY' | 'PURCHASE_REQUEST' | 'PARKING_SLOT' | 'PARKING_ALLOCATION' | 'PARKING_INCIDENT' | 'COMMUNICATION_THREAD' | 'COMMUNICATION_MESSAGE' | 'CHAT_REPORT' | 'BROADCAST_MESSAGE' | 'RESIDENT_DIRECTORY_ENTRY' | 'EMERGENCY_CONTACT' | 'EMERGENCY_ALERT' | 'ROLE_PERMISSION' | 'CHARGE_HEAD' | 'BILLING_CYCLE' | 'JOURNAL_ENTRY' | 'RECONCILIATION' | 'IMPORT_BATCH' | 'NOTIFICATION' | 'AUDIT_LOG' | 'PARENT_INCIDENT' | 'VERIFICATION_CASE' | 'DIGITAL_SIGNATURE' | 'BACKUP_JOB' | 'RESTORE_PLAN' | 'RECOVERY_INCIDENT' | 'GATE_ENTRY' | 'OFFLINE_SYNC' | 'EXPORT_JOB' | 'SEARCH_QUERY' | 'AI_ANALYSIS' | 'BANK_STATEMENT' | 'RECONCILIATION_SESSION' | 'RECONCILIATION_MATCH' | 'RECONCILIATION_DISCREPANCY' | 'GST_RETURN' | 'TDS_RETURN' | 'MONTH_END_CLOSE' | 'MONTH_END_CLOSE_TASK' | 'OPENING_BALANCE_IMPORT';
import type { JsonObject } from '../api/api.types';
import type { Absent } from "../../shared/types/absence.types";
export type AuditEventType = 'DOCUMENT_VIEW_ATTEMPT' | 'DOCUMENT_DOWNLOAD_ATTEMPT' | 'NOC_REQUEST_CREATED' | 'MOVE_OUT_REQUEST_CREATED' | 'VISITOR_PASS_CREATED' | 'GATE_ENTRY_RECORDED' | 'COMPLAINT_CREATED' | 'PAYMENT_ATTEMPT_STARTED' | 'RESIDENT_CONTACT_REQUEST_CREATED' | 'CHAT_MESSAGE_REPORTED' | 'PARKING_INCIDENT_CREATED' | 'FACILITY_BOOKING_CREATED' | 'WORK_ORDER_CREATED' | 'VENDOR_BLACKLIST_ATTEMPTED' | 'POLL_VOTE_SUBMITTED' | 'MEETING_RSVP_SUBMITTED' | 'PROXY_AUTHORIZATION_SUBMITTED' | 'PERMISSION_DENIED_VIEW' | string;
export interface AuditEvent {
    eventType: AuditEventType;
    actorUserId: string;
    actorRole: string;
    societyId: string;
    unitId?: string | Absent;
    entityType?: string | Absent;
    entityId?: string | Absent;
    timestamp: string;
    correlationId: string;
    metadata?: Record<string, any> | Absent;
}
export type AuditLogEntry = {
    id: string;
    timestamp: string;
    correlationId: string;
    actor: {
        userId: string;
        type: AuditActorType;
        role?: string | Absent;
        societyId: string;
        unitId?: string | Absent;
    };
    action: AuditAction;
    entityType: AuditEntityType;
    entityId: string;
    previousState?: JsonObject | Absent;
    newState?: JsonObject | Absent;
    metadata?: {
        idempotencyKey?: string | Absent;
        source?: ('MOBILE' | 'WEB' | 'API' | 'GATE_DEVICE' | 'BIOMETRIC_DEVICE' | 'SYSTEM_JOB' | 'AI_SERVICE') | Absent;
        ipAddress?: string | Absent;
        deviceId?: string | Absent;
        modelVersion?: string | Absent;
        confidence?: number | Absent;
        reason?: string | Absent;
        [key: string]: JsonObject | string | number | boolean | null | Absent;
    } | Absent;
    outcome: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
    error?: {
        code: string;
        message: string;
    } | Absent;
};
export type AuditQuery = {
    societyId: string;
    entityType?: AuditEntityType | Absent;
    entityId?: string | Absent;
    actorUserId?: string | Absent;
    action?: AuditAction | Absent;
    dateFrom?: string | Absent;
    dateTo?: string | Absent;
    limit?: number | Absent;
    offset?: number | Absent;
};
export type AuditLogResult = {
    entries: AuditLogEntry[];
    total: number;
    hasMore: boolean;
};
export type AuditConfig = {
    enabled: boolean;
    retentionDays: number;
    sensitiveFields: string[];
    asyncWrite: boolean;
    batchSize: number;
    flushIntervalMs: number;
};


import type { Absent } from "../types/absence.types";
export type BadgeType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export interface StatusPresentation {
    label: string;
    type: BadgeType;
}
export function getStatusPresentation(status: string, moduleType: string): StatusPresentation {
    const normalized = status.toUpperCase().replace(/_/g, ' ');
    let label = normalized;
    let type: BadgeType = 'neutral';
    const lowerModule = moduleType.toLowerCase();
    if (lowerModule === 'visitor' || lowerModule === 'gate') {
        const map: Record<string, BadgeType> = {
            APPROVED: 'success',
            WAITING: 'warning',
            DENIED: 'danger',
            CHECKED_IN: 'success',
            CHECKED_OUT: 'neutral',
            EXPIRED: 'neutral',
            PENDING: 'warning',
            ACTIVE: 'success',
            COMPLETED: 'neutral',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'complaint' || lowerModule === 'helpdesk') {
        const map: Record<string, BadgeType> = {
            PENDING: 'warning',
            ASSIGNED: 'info',
            IN_PROGRESS: 'warning',
            RESOLVED: 'success',
            CLOSED: 'neutral',
            REOPENED: 'danger',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'notice' || lowerModule === 'document' || lowerModule === 'bylaw') {
        const map: Record<string, BadgeType> = {
            ACTIVE: 'success',
            DRAFT: 'neutral',
            SUPERSEDED: 'neutral',
            UNDER_REVIEW: 'warning',
            ARCHIVED: 'neutral',
            PUBLISHED: 'success',
            URGENT: 'danger',
            REQUIRED: 'warning',
            OPTIONAL: 'neutral',
            ACKNOWLEDGED: 'success',
            PENDING_ACKNOWLEDGEMENT: 'warning',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'billing' || lowerModule === 'invoice') {
        const map: Record<string, BadgeType> = {
            PAID: 'success',
            UNPAID: 'danger',
            PARTIALLY_PAID: 'warning',
            OVERDUE: 'danger',
            REFUNDED: 'neutral',
            PENDING: 'warning',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'noc' || lowerModule === 'clearance') {
        const map: Record<string, BadgeType> = {
            PENDING: 'warning',
            APPROVED: 'success',
            REJECTED: 'danger',
            IN_PROGRESS: 'warning',
            COMPLETED: 'success',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'ownertenant' || lowerModule === 'occupancy') {
        const map: Record<string, BadgeType> = {
            VERIFIED: 'success',
            PENDING: 'warning',
            FAILED: 'danger',
            OWNER: 'info',
            TENANT: 'neutral',
            CO_OWNER: 'info',
            ACTIVE: 'success',
            INACTIVE: 'neutral',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'residentconnect' || lowerModule === 'chat') {
        const map: Record<string, BadgeType> = {
            ONLINE: 'success',
            OFFLINE: 'neutral',
            SENDING: 'neutral',
            SENT: 'info',
            DELIVERED: 'info',
            READ: 'success',
            FAILED: 'danger',
            BLOCKED: 'danger',
            MUTED: 'warning',
            REPORTED: 'danger',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'parking' || lowerModule === 'vehicle') {
        const map: Record<string, BadgeType> = {
            VERIFIED: 'success',
            PENDING: 'warning',
            BLOCKED: 'danger',
            EXPIRED: 'neutral',
            ACTIVE: 'success',
            INACTIVE: 'neutral',
            VIOLATION: 'danger',
            RESOLVED: 'success',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'facility') {
        const map: Record<string, BadgeType> = {
            AVAILABLE: 'success',
            BOOKED: 'danger',
            MAINTENANCE: 'warning',
            CLOSED: 'neutral',
            PENDING: 'warning',
            CONFIRMED: 'success',
            CANCELLED: 'danger',
            REFUNDED: 'neutral',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'vendor' || lowerModule === 'amc' || lowerModule === 'asset' || lowerModule === 'workorder') {
        const map: Record<string, BadgeType> = {
            ACTIVE: 'success',
            EXPIRED: 'danger',
            PENDING: 'warning',
            COMPLETED: 'success',
            IN_PROGRESS: 'warning',
            CRITICAL: 'danger',
            OK: 'success',
            FAILED: 'danger',
            LOW_STOCK: 'warning',
            IN_STOCK: 'success',
            OUT_OF_STOCK: 'danger',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'governance' || lowerModule === 'meeting' || lowerModule === 'poll' || lowerModule === 'compliance') {
        const map: Record<string, BadgeType> = {
            DRAFT: 'neutral',
            NOTICE_PUBLISHED: 'info',
            RSVP_OPEN: 'warning',
            SCHEDULED: 'info',
            IN_PROGRESS: 'warning',
            COMPLETED: 'success',
            CANCELLED: 'danger',
            MINUTES_PENDING: 'warning',
            MINUTES_APPROVED: 'success',
            ARCHIVED: 'neutral',
            UPCOMING: 'info',
            DISCUSSED: 'success',
            DEFERRED: 'warning',
            APPROVED: 'success',
            REJECTED: 'danger',
            NEEDS_FOLLOW_UP: 'warning',
            PROPOSED: 'info',
            VOTING_OPEN: 'warning',
            PASSED: 'success',
            FAILED: 'danger',
            IMPLEMENTATION_PENDING: 'warning',
            IMPLEMENTED: 'success',
            CLOSED: 'neutral',
            OPEN: 'success',
            RESULT_PUBLISHED: 'info',
            ELIGIBLE: 'success',
            NOT_ELIGIBLE: 'danger',
            PROXY_ASSIGNED: 'info',
            PENDING_VERIFICATION: 'warning',
            RESTRICTED: 'danger',
            NOMINATION_OPEN: 'info',
            NOMINATION_CLOSED: 'warning',
            DUE_SOON: 'warning',
            OVERDUE: 'danger',
            WAIVED: 'neutral',
            NOT_APPLICABLE: 'neutral',
            RECEIVED: 'warning',
            UNDER_REVIEW: 'warning',
            RESPONSE_DRAFTED: 'info',
            RESPONSE_SENT: 'success',
            ESCALATED: 'danger',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'staff' ||
        lowerModule === 'attendance' ||
        lowerModule === 'biometric' ||
        lowerModule === 'staffattendance') {
        const map: Record<string, BadgeType> = {
            ACTIVE: 'success',
            ON_LEAVE: 'info',
            INACTIVE: 'neutral',
            SUSPENDED: 'warning',
            EXITED: 'neutral',
            BLOCKED: 'danger',
            PRESENT: 'success',
            ABSENT: 'danger',
            LATE: 'warning',
            HALF_DAY: 'warning',
            WEEKLY_OFF: 'neutral',
            HOLIDAY: 'info',
            MISSING_CHECKOUT: 'danger',
            PENDING_CORRECTION: 'warning',
            BIOMETRIC_DEVICE: 'success',
            MANUAL: 'warning',
            GUARD_APP: 'info',
            IMPORT_FILE: 'neutral',
            API_CONNECTOR: 'success',
            PENDING: 'warning',
            UNDER_REVIEW: 'info',
            APPROVED: 'success',
            REJECTED: 'danger',
            CANCELLED: 'neutral',
            OFFLINE: 'danger',
            ERROR: 'danger',
            MAINTENANCE: 'warning',
            NOT_CONFIGURED: 'neutral',
            PENDING_REVIEW: 'warning',
            CONFLICT: 'danger',
            QUEUED: 'neutral',
            RUNNING: 'info',
            COMPLETED: 'success',
            COMPLETED_WITH_ERRORS: 'warning',
            FAILED: 'danger',
            OPEN: 'danger',
            REVIEWED: 'info',
            RESOLVED: 'success',
            IGNORED: 'neutral',
            NOT_REVIEWED: 'neutral',
            VERIFIED: 'success',
            DISPUTED: 'danger',
            LOCKED: 'success',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'interflat' ||
        lowerModule === 'dispute' ||
        lowerModule === 'mediation') {
        const map: Record<string, BadgeType> = {
            SUBMITTED: 'info',
            NEIGHBOUR_NOTIFIED: 'warning',
            NEIGHBOUR_RESPONDED: 'success',
            INSPECTION_SCHEDULED: 'warning',
            INSPECTION_COMPLETED: 'success',
            MEDIATION_REQUIRED: 'warning',
            MEDIATION_IN_PROGRESS: 'warning',
            PROPOSAL_SUBMITTED: 'info',
            RESOLVED: 'success',
            CLOSED: 'neutral',
            ESCALATED: 'danger',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'community' ||
        lowerModule === 'marketplace' ||
        lowerModule === 'borrow' ||
        lowerModule === 'lostfound' ||
        lowerModule === 'moderation') {
        const map: Record<string, BadgeType> = {
            ACTIVE: 'success',
            AVAILABLE: 'success',
            APPROVED: 'success',
            RESOLVED: 'success',
            FOUND: 'success',
            CLAIMED: 'success',
            VERIFIED: 'success',
            PENDING: 'warning',
            PENDING_MODERATION: 'warning',
            PENDING_REVIEW: 'warning',
            PENDING_APPROVAL: 'warning',
            PAUSED: 'warning',
            FLAGGED: 'warning',
            UNDER_REVIEW: 'warning',
            SOLD: 'neutral',
            EXPIRED: 'neutral',
            RETURNED: 'neutral',
            INACTIVE: 'neutral',
            CANCELLED: 'neutral',
            DISMISSED: 'neutral',
            REPORTED: 'danger',
            REMOVED: 'danger',
            REJECTED: 'danger',
            OVERDUE: 'danger',
            LOST: 'danger',
            BLOCKED: 'danger',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'platform' ||
        lowerModule === 'superadmin' ||
        lowerModule === 'support' ||
        lowerModule === 'alert' ||
        lowerModule === 'export') {
        const map: Record<string, BadgeType> = {
            DRAFT: 'neutral',
            ONBOARDING: 'warning',
            ACTIVE: 'success',
            SUSPENDED_PLACEHOLDER: 'danger',
            ARCHIVED_PLACEHOLDER: 'neutral',
            FREE_LAUNCH: 'success',
            STARTER: 'info',
            GROWTH: 'info',
            PREMIUM: 'warning',
            ENTERPRISE: 'danger',
            DISABLED: 'danger',
            ENABLED: 'success',
            MANUAL: 'warning',
            TRIAL: 'warning',
            PAUSED: 'warning',
            EXPIRED: 'danger',
            CANCELLED: 'neutral',
            LOW: 'success',
            MEDIUM: 'warning',
            HIGH: 'danger',
            URGENT: 'danger',
            CRITICAL: 'danger',
            OPEN: 'danger',
            ASSIGNED: 'info',
            IN_PROGRESS: 'warning',
            WAITING_FOR_SOCIETY: 'warning',
            WAITING_FOR_PLATFORM: 'info',
            RESOLVED: 'success',
            CLOSED: 'neutral',
            ESCALATED: 'danger',
            ACKNOWLEDGED: 'success',
            NOT_CONFIGURED: 'neutral',
            CONFIGURED: 'info',
            HEALTHY: 'success',
            DEGRADED: 'warning',
            DOWN: 'danger',
            FUTURE_PLACEHOLDER: 'neutral',
            REQUESTED: 'warning',
            APPROVAL_REQUIRED: 'warning',
            APPROVED: 'success',
            PROCESSING_PLACEHOLDER: 'info',
            READY_PLACEHOLDER: 'success',
        };
        type = map[status.toUpperCase()] || 'neutral';
    }
    else if (lowerModule === 'hardware' ||
        lowerModule === 'gatehardware' ||
        lowerModule === 'cctv' ||
        lowerModule === 'smartmeter' ||
        lowerModule === 'evcharging') {
        if (status.toUpperCase() === 'OPEN') {
            type = (lowerModule === 'gatehardware') ? 'success' : 'danger';
        }
        else {
            const map: Record<string, BadgeType> = {
                ONLINE: 'success',
                OFFLINE: 'neutral',
                ERROR: 'danger',
                MAINTENANCE: 'warning',
                NOT_CONFIGURED: 'neutral',
                DISABLED: 'neutral',
                UNKNOWN: 'neutral',
                QUEUED: 'neutral',
                RUNNING: 'info',
                COMPLETED: 'success',
                COMPLETED_WITH_ERRORS: 'warning',
                FAILED: 'danger',
                CANCELLED: 'neutral',
                RECEIVED: 'info',
                MATCHED: 'success',
                UNMATCHED: 'danger',
                IGNORED: 'neutral',
                REVIEW_REQUIRED: 'warning',
                REVIEWED: 'info',
                RESOLVED: 'success',
                ESCALATED: 'danger',
                ALLOWED: 'success',
                DENIED: 'danger',
                UNKNOWN_TAG: 'danger',
                EXPIRED_TAG: 'danger',
                BLOCKED_VEHICLE: 'danger',
                MANUAL_REVIEW: 'warning',
                ACTIVE: 'success',
                INACTIVE: 'neutral',
                LOST: 'danger',
                EXPIRED: 'danger',
                BLOCKED: 'danger',
                PENDING_MAPPING: 'warning',
                MATCH_TO_VEHICLE: 'success',
                MARK_UNKNOWN: 'neutral',
                MARK_VISITOR: 'info',
                MARK_FALSE_READ: 'neutral',
                BLOCKED_REVIEW: 'danger',
                CLOSED: 'neutral',
                OPENING: 'warning',
                CLOSING: 'warning',
                MANUAL_OVERRIDE: 'warning',
                SECURITY_ONLY: 'info',
                FACILITY_AND_SECURITY: 'info',
                ADMIN_APPROVAL_REQUIRED: 'warning',
                EMERGENCY_ONLY: 'danger',
                IMPORTED: 'info',
                VALIDATED: 'success',
                ESTIMATED: 'info',
                DUPLICATE: 'warning',
                MISSING: 'danger',
                BILLING_READY: 'success',
                AVAILABLE: 'success',
                OCCUPIED: 'danger',
                RESERVED: 'info',
                FAULTED: 'danger',
                STARTED: 'info',
                IN_PROGRESS: 'warning',
                BILLING_PENDING: 'warning',
                HEALTHY: 'success',
                DEGRADED: 'warning',
                DOWN: 'danger',
                FUTURE_PLACEHOLDER: 'neutral',
                LOW: 'success',
                MEDIUM: 'warning',
                HIGH: 'danger',
                CRITICAL: 'danger',
            };
            type = map[status.toUpperCase()] || 'neutral';
        }
    }
    label = normalized.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
    return { label, type };
}
export type StatusDisplayModel = {
    labelMessageKey: string;
    label: string;
    tone: BadgeType;
};
const UNKNOWN_STATUS_LABEL = 'Status Unavailable';
export function safeGetStatusPresentation(status: string | null | Absent, moduleType: string): StatusPresentation {
    if (!status || status.trim().length === 0) {
        return { label: UNKNOWN_STATUS_LABEL, type: 'neutral' };
    }
    return getStatusPresentation(status, moduleType);
}


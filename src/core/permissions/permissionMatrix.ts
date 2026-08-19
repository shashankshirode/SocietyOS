import { permissions } from './permissions';
import type { AppRole, Permission } from './permission.types';
import type { Absent } from "../../shared/types/absence.types";
const residentBase: Permission[] = [
    'VISITOR_VIEW',
    'VISITOR_CREATE',
    'COMPLAINT_VIEW',
    'COMPLAINT_CREATE',
    'BILL_VIEW',
    'BILL_PAY',
    'NOTICE_VIEW',
    'NOTICE_ACKNOWLEDGE',
    'DOCUMENT_VIEW_OWN',
    'DOCUMENT_VIEW_SOCIETY',
    'NOC_VIEW',
    'MOVE_OUT_CREATE',
    'OWNER_TENANT_VIEW_CURRENT',
    'RESIDENT_DIRECTORY_VIEW',
    'RESIDENT_CONNECT_REQUEST',
    'RESIDENT_CHAT',
    'PARKING_VIEW',
    'FACILITY_BOOK',
    'GOVERNANCE_VIEW',
    'MEETING_RSVP',
    'POLL_RESULT_VIEW',
];
const committeeBase: Permission[] = [
    ...residentBase,
    'VISITOR_APPROVE',
    'COMPLAINT_ASSIGN',
    'COMPLAINT_RESOLVE',
    'DOCUMENT_VIEW_RESTRICTED',
    'DOCUMENT_ACCESS_LOG_VIEW',
    'NOC_APPROVE',
    'MOVE_OUT_CLEARANCE_UPDATE',
    'OWNER_TENANT_VIEW_HISTORY',
    'OWNER_TENANT_VIEW_RESTRICTED_DOCS',
    'FACILITY_BOOKING_APPROVE',
    'GOVERNANCE_AUDIT_VIEW',
];
export const rolePermissionMatrix: Record<AppRole, Permission[]> = {
    RESIDENT_OWNER: [
        ...residentBase,
        'DOCUMENT_UPLOAD',
        'NOC_CREATE',
        'PARKING_VEHICLE_MANAGE',
        'PARKING_INCIDENT_CREATE',
        'POLL_VOTE',
        'DOMESTIC_HELP_VIEW',
        'DOMESTIC_HELP_MANAGE',
    ],
    RESIDENT_TENANT: [
        ...residentBase,
        'DOCUMENT_UPLOAD',
        'NOC_CREATE',
        'PARKING_INCIDENT_CREATE',
        'DOMESTIC_HELP_VIEW',
        'DOMESTIC_HELP_MANAGE',
    ],
    RESIDENT_FAMILY: [
        'VISITOR_VIEW',
        'VISITOR_CREATE',
        'NOTICE_VIEW',
        'DOCUMENT_VIEW_OWN',
        'RESIDENT_DIRECTORY_VIEW',
        'RESIDENT_CONNECT_REQUEST',
        'RESIDENT_CHAT',
        'PARKING_VIEW',
        'FACILITY_BOOK',
    ],
    SECURITY_GUARD: ['VISITOR_VIEW', 'VISITOR_APPROVE', 'GATE_ENTRY_RECORD', 'PARKING_VIEW'],
    SECURITY_SUPERVISOR: [
        'VISITOR_VIEW',
        'VISITOR_APPROVE',
        'GATE_ENTRY_RECORD',
        'PARKING_VIEW',
        'PARKING_INCIDENT_RESOLVE',
    ],
    FACILITY_MANAGER: [
        'COMPLAINT_VIEW',
        'COMPLAINT_ASSIGN',
        'COMPLAINT_RESOLVE',
        'FACILITY_BOOKING_APPROVE',
        'FACILITY_OPS_VIEW',
        'VENDOR_MANAGE',
        'ASSET_MANAGE',
        'WORK_ORDER_MANAGE',
        'INVENTORY_MANAGE',
    ],
    COMMITTEE_MEMBER: committeeBase,
    SECRETARY: [...committeeBase, 'VENDOR_MANAGE', 'WORK_ORDER_MANAGE'],
    CHAIRPERSON: committeeBase,
    TREASURER: [...committeeBase, 'BILL_VIEW'],
    SOCIETY_ADMIN: [...committeeBase, 'FACILITY_OPS_VIEW', 'VENDOR_MANAGE', 'ASSET_MANAGE', 'WORK_ORDER_MANAGE', 'INVENTORY_MANAGE', 'FEATURE_FLAGS_MANAGE'],
    SUPER_ADMIN: permissions,
    ELECTION_OFFICER: ['GOVERNANCE_VIEW', 'POLL_RESULT_VIEW', 'ELECTION_MANAGE', 'GOVERNANCE_AUDIT_VIEW'],
    AUDITOR: ['BILL_VIEW', 'DOCUMENT_VIEW_SOCIETY', 'DOCUMENT_VIEW_RESTRICTED', 'DOCUMENT_ACCESS_LOG_VIEW', 'GOVERNANCE_VIEW', 'GOVERNANCE_AUDIT_VIEW'],
    VENDOR_USER: ['FACILITY_OPS_VIEW', 'WORK_ORDER_MANAGE'],
    STAFF_USER: ['GATE_ENTRY_RECORD', 'FACILITY_OPS_VIEW'],
};
export function getPermissionsForRoles(roles: AppRole[] = []): Permission[] {
    return Array.from(new Set(roles.flatMap((role) => rolePermissionMatrix[role] ?? [])));
}
export function hasPermission(roles: AppRole[] | Absent, permission: Permission): boolean {
    return getPermissionsForRoles(roles).includes(permission);
}
export function hasPermissions(roles: AppRole[] | Absent, requested: Permission[], requireAll = false): boolean {
    if (requested.length === 0) {
        return true;
    }
    const granted = getPermissionsForRoles(roles);
    return requireAll
        ? requested.every((permission) => granted.includes(permission))
        : requested.some((permission) => granted.includes(permission));
}


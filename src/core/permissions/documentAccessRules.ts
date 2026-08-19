import { hasPermission } from './permissionMatrix';
import type { AppRole } from './permission.types';
import type { DocumentInfo } from '../../shared/types/document.types';
import type { Absent } from "../../shared/types/absence.types";
export function canViewDocument(userRoles: AppRole[] | Absent, document: DocumentInfo): boolean {
    if (!document) {
        return false;
    }
    if (document.sensitivity === 'PUBLIC' || document.sensitivity === 'RESIDENT_ONLY') {
        return true;
    }
    if (document.sensitivity === 'OWNER_ONLY') {
        return Boolean(userRoles?.includes('RESIDENT_OWNER') ||
            hasPermission(userRoles, 'DOCUMENT_VIEW_RESTRICTED'));
    }
    if (document.sensitivity === 'TENANT_ONLY') {
        return Boolean(userRoles?.includes('RESIDENT_TENANT') ||
            hasPermission(userRoles, 'DOCUMENT_VIEW_RESTRICTED'));
    }
    if (document.sensitivity === 'COMMITTEE_ONLY' || document.sensitivity === 'ADMIN_ONLY' || document.sensitivity === 'RESTRICTED') {
        return hasPermission(userRoles, 'DOCUMENT_VIEW_RESTRICTED');
    }
    return hasPermission(userRoles, 'DOCUMENT_VIEW_OWN');
}
export function canDownloadDocument(userRoles: AppRole[] | Absent, document: DocumentInfo): boolean {
    return canViewDocument(userRoles, document) && document.status === 'VERIFIED';
}
export function canViewAccessLogs(userRoles: AppRole[] | Absent, document: DocumentInfo): boolean {
    return canViewDocument(userRoles, document) && hasPermission(userRoles, 'DOCUMENT_ACCESS_LOG_VIEW');
}


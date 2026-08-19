import { hasPermission } from './permissionMatrix';
import type { AppRole } from './permission.types';
import type { ResidentConnectionStatus } from '../../shared/types/residentConnect.types';
import type { Absent } from "../../shared/types/absence.types";
export type ChatThreadStatus = 'PENDING' | 'ACCEPTED' | 'BLOCKED' | 'REPORTED' | 'CLOSED';
export function canSendContactRequest(connectionStatus: ResidentConnectionStatus): boolean {
    return connectionStatus === 'NOT_CONNECTED' || connectionStatus === 'REQUEST_RECEIVED';
}
export function canOpenChat(threadStatus: ChatThreadStatus): boolean {
    return threadStatus === 'ACCEPTED';
}
export function canViewReportedContext(userRoles: AppRole[] | Absent): boolean {
    return hasPermission(userRoles, 'RESIDENT_CHAT_MODERATE_REPORTED');
}
export function shouldShowResidentContactInfo(userRoles: AppRole[] | Absent): boolean {
    return hasPermission(userRoles, 'SYSTEM_ADMIN');
}


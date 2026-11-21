export type { AppRole, MockSecurityUser, Permission, PermissionCheck } from './permission.types';
export { getPermissionsForRoles, hasPermission, hasPermissions, rolePermissionMatrix } from './rolePermissionMap';
export { permissions } from './permissions';
export { appRoles } from './roles';
export { useCurrentSecurityUser, usePermission } from './usePermission';
export { PermissionGate } from './PermissionGate';
export { RouteGuard } from './RouteGuard';
export { canDownloadDocument, canViewAccessLogs, canViewDocument } from './documentAccessRules';
export {
  canOpenChat,
  canSendContactRequest,
  canViewReportedContext,
  shouldShowResidentContactInfo,
} from './residentConnectPrivacyRules';
export type { ChatThreadStatus } from './residentConnectPrivacyRules';

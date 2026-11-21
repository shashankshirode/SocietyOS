import React from 'react';
import { usePermission } from './usePermission';
import type { Permission, PermissionCheck } from './permission.types';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
type PermissionGateProps = PermissionCheck & {
    permission?: Permission;
    permissions?: Permission[];
    fallback?: React.ReactNode;
    children: React.ReactNode;
};
export function PermissionGate({ permission, permissions, requireAll, fallback = null, children, }: PermissionGateProps) {
    const { isAllowed } = usePermission({ ...includeWhenPresent("permission", permission), ...includeWhenPresent("permissions", permissions), ...includeWhenPresent("requireAll", requireAll) });
    return isAllowed ? <>{children}</> : <>{fallback}</>;
}


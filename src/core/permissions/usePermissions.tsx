import React from 'react';
import { getPermissionsForRoles, hasPermissions } from './permissionMatrix';
import type { Permission, AppRole } from './permission.types';
import { useAuth } from '../auth/AuthProvider';

export function usePermissions() {
  const { userRole } = useAuth();
  const roles = userRole ? [userRole] : [];

  const checkPermission = React.useCallback((permission: Permission): boolean => {
    return hasPermissions(roles, [permission]);
  }, [roles]);

  const checkAnyPermission = React.useCallback((permissions: Permission[]): boolean => {
    return hasPermissions(roles, permissions, false);
  }, [roles]);

  const checkAllPermissions = React.useCallback((permissions: Permission[]): boolean => {
    return hasPermissions(roles, permissions, true);
  }, [roles]);

  const grantedPermissions = React.useMemo(() => getPermissionsForRoles(roles), [roles]);

  return {
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    grantedPermissions,
    userRole,
  };
}

export function PermissionGuard({ permission, permissions, requireAll, children, fallback }: {
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  const allowed = React.useMemo(() => {
    if (permission) {
      return hasPermission(permission);
    }
    if (permissions && permissions.length > 0) {
      return requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
    }
    return true;
  }, [permission, permissions, requireAll, hasPermission, hasAnyPermission, hasAllPermissions]);

  if (!allowed) {
    return <>{fallback ?? null}</>;
  }

  return <>{children}</>;
}
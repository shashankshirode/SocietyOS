import * as React from 'react';
import { getCurrentSession, subscribeToSession } from '../auth/sessionStore';
import { getPermissionsForRoles, hasPermissions } from './permissionMatrix';
import type { MockSecurityUser, Permission, PermissionCheck } from './permission.types';
import { absentValue, type Absent } from "../../shared/types/absence.types";

export function useCurrentSecurityUser(): MockSecurityUser | Absent {
    const session = React.useSyncExternalStore(subscribeToSession, getCurrentSession, getCurrentSession);
    if (!session) {
        return absentValue;
    }
    return {
        id: session.userId,
        displayName: session.name,
        roles: [session.role],
        activeRole: session.role,
    };
}
export function usePermission(check: PermissionCheck = {}) {
    const user = useCurrentSecurityUser();
    const requested = React.useMemo(() => {
        const list: Permission[] = [];
        if (check.permission) {
            list.push(check.permission);
        }
        if (check.permissions) {
            list.push(...check.permissions);
        }
        return list;
    }, [check.permission, check.permissions]);
    const grantedPermissions = React.useMemo(() => getPermissionsForRoles(user?.roles ?? []), [user?.roles]);
    return {
        user,
        grantedPermissions,
        isAllowed: hasPermissions(user?.roles, requested, check.requireAll),
    };
}


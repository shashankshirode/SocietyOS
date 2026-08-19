import * as React from 'react';
import { getCurrentSession, subscribeToSession } from '../auth/sessionStore';
import { getPermissionsForRoles, hasPermissions } from './permissionMatrix';
import type { MockSecurityUser, Permission, PermissionCheck } from './permission.types';
import { residentHomeContextStore } from '../../modules/resident/homeContext/state/residentHomeContext.store';
import { mapContextRoleToAppRole } from '../../modules/resident/homeContext/utils/residentHomeContextPermissions';
import type { Absent } from "../../shared/types/absence.types";
const mockCurrentUser: MockSecurityUser = {
    id: 'resident-001',
    displayName: 'Mock Resident Owner',
    roles: ['RESIDENT_OWNER'],
    activeRole: 'RESIDENT_OWNER',
};
export function useCurrentSecurityUser(): MockSecurityUser | Absent {
    const session = React.useSyncExternalStore(subscribeToSession, getCurrentSession, getCurrentSession);
    const activeHome = React.useSyncExternalStore(residentHomeContextStore.subscribe, residentHomeContextStore.getActiveContext, residentHomeContextStore.getActiveContext);
    if (!session) {
        const activeRole = mapContextRoleToAppRole(activeHome.residentRole);
        return {
            ...mockCurrentUser,
            roles: [activeRole],
            activeRole,
        };
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


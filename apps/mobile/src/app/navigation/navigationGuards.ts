import type { AppRole, Permission } from '../../core/permissions/permission.types';
import { hasPermission } from '../../core/permissions/rolePermissionMap';
import type { Absent } from "../../shared/types/absence.types";
export function canAccessRoute(roles: AppRole[] | Absent, requiredPermission?: Permission): boolean {
    if (!requiredPermission) {
        return true;
    }
    return hasPermission(roles, requiredPermission);
}


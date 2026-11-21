import React from 'react';
import { AccessRestrictedState } from '../../shared/feedback/AccessRestrictedState';
import { usePermission } from './usePermission';
import type { Permission, PermissionCheck } from './permission.types';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
type RouteGuardProps = PermissionCheck & {
    permission?: Permission;
    permissions?: Permission[];
    children: React.ReactNode;
};
export function RouteGuard({ permission, permissions, requireAll, children }: RouteGuardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { isAllowed } = usePermission({ ...includeWhenPresent("permission", permission), ...includeWhenPresent("permissions", permissions), ...includeWhenPresent("requireAll", requireAll) });
    if (!isAllowed) {
        return (<AccessRestrictedState title={localizedUiText.m_233f644f36b8} {...includeWhenPresent("requiredPermission", permission ?? permissions?.join(', '))}/>);
    }
    return <>{children}</>;
}


import React from 'react';
import { AccessRestrictedState } from '../../shared/feedback/AccessRestrictedState';
import { useFeatureFlags } from '../../core/featureFlags/featureFlags';
import { hasPermission } from '../../core/permissions/permissionMatrix';
import { useActiveResidentHome } from '../../modules/resident/homeContext/hooks/useActiveResidentHome';
import { mapContextRoleToAppRole } from '../../modules/resident/homeContext/utils/residentHomeContextPermissions';
import { getResidentCapability } from './configuration/residentCapabilityRegistry';
import { hasOwnerConfiguredFamilyCapability } from './configuration/residentFamilyCapabilityGrants';
import type { ResidentCapabilityId } from './models/ResidentCapability';
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
type ResidentCapabilityGuardProps = {
    capabilityId: ResidentCapabilityId;
    children: React.ReactNode;
};
export function withResidentCapability<TProps extends object>(Component: React.ComponentType<TProps>, capabilityId: ResidentCapabilityId): (props: TProps) => React.ReactElement {
    return function CapabilityProtectedScreen(props: TProps) {
        return (<ResidentCapabilityGuard capabilityId={capabilityId}>
        <Component {...props}/>
      </ResidentCapabilityGuard>);
    };
}
export function ResidentCapabilityGuard({ capabilityId, children }: ResidentCapabilityGuardProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const capability = getResidentCapability(capabilityId);
    const { activeContext } = useActiveResidentHome();
    const { isEnabled } = useFeatureFlags();
    const appRole = mapContextRoleToAppRole(activeContext.residentRole);
    const roleAllowed = capability.allowedRoles.includes(activeContext.residentRole);
    const statusAllowed = capability.allowedMembershipStatuses.includes(activeContext.status);
    const permissionAllowed = capability.permission ? hasPermission([appRole], capability.permission) : true;
    const guardianAccessAllowed = !activeContext.isGuardianManaged || capability.guardianManagedAccessAllowed;
    const familyPermissionAllowed = !capability.ownerConfiguredFamilyPermissionRequired
        || (activeContext.residentRole !== 'familyMember' && activeContext.residentRole !== 'authorizedOccupant')
        || hasOwnerConfiguredFamilyCapability(activeContext.permissionScopeId, capability.id);
    if (!isEnabled(capability.requiredFeatureFlag)) {
        return <AccessRestrictedState title={localizedUiText.m_783b44f66d1a} requiredPermission={capability.requiredFeatureFlag}/>;
    }
    if (!roleAllowed || !statusAllowed || !permissionAllowed || !guardianAccessAllowed || !familyPermissionAllowed) {
        return <AccessRestrictedState title={localizedUiText.m_233f644f36b8} requiredPermission={capability.id}/>;
    }
    return <>{children}</>;
}

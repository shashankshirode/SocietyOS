import React from 'react';
import { AccessRestrictedState } from '../../shared/feedback/AccessRestrictedState';
import { getResidentCapability } from './configuration/residentCapabilityRegistry';
import type { ResidentCapabilityId } from './models/ResidentCapability';
import { useResidentCapabilityAvailability } from './useResidentCapabilityAvailability';
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
    const { getCapabilityAvailability } = useResidentCapabilityAvailability();
    const availability = getCapabilityAvailability(capabilityId);
    if (availability === 'featureDisabled') {
        return <AccessRestrictedState title={localizedUiText.m_783b44f66d1a} requiredPermission={capability.requiredFeatureFlag}/>;
    }
    if (availability === 'restricted') {
        return <AccessRestrictedState title={localizedUiText.m_233f644f36b8} requiredPermission={capability.id}/>;
    }
    return <>{children}</>;
}

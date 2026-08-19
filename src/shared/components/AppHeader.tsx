import React from 'react';
import { useAuthSession } from '../../core/auth/useAuthSession';
import { ResidentAppHeader } from '../../modules/resident/navigation/ResidentAppHeader';
import type { MessageKey } from '../../modules/resident/navigation/residentHeader.types';
import { includeWhenPresent } from "../utils/presentProperty";
interface AppHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightLabel?: string;
    onRightPress?: () => void;
}
function getResidentRoleLabelKey(role?: string): MessageKey {
    switch (role) {
        case 'RESIDENT_TENANT':
            return 'resident.header.roles.tenant';
        case 'RESIDENT_FAMILY':
            return 'resident.header.roles.family';
        default:
            return 'resident.header.roles.owner';
    }
}
export function AppHeader({ title, subtitle, showBack = false, onBack, }: AppHeaderProps) {
    const { session } = useAuthSession();
    return (<ResidentAppHeader variant="detail" titleKey={title} {...includeWhenPresent("subtitleKey", subtitle || session?.societyName || undefined)} roleLabelKey={getResidentRoleLabelKey(session?.role)} showBackButton={showBack} {...includeWhenPresent("onBackPress", onBack)}/>);
}


import React from 'react';
import { useAuthSession } from '../../core/auth/useAuthSession';
import { ResidentAppHeader } from '../../modules/resident/navigation/ResidentAppHeader';
import type { MessageKey } from '../../modules/resident/navigation/residentHeader.types';
import { includeWhenPresent } from "../utils/presentProperty";
interface ResponsivePageHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    rightActions?: React.ReactNode;
    roleContext?: string;
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
export function ResponsivePageHeader({ title, subtitle, onBack, rightActions, roleContext }: ResponsivePageHeaderProps) {
    const { session } = useAuthSession();
    return (<ResidentAppHeader variant="detail" titleKey={title} {...includeWhenPresent("subtitleKey", subtitle || session?.societyName || undefined)} {...includeWhenPresent("contextLabelKey", roleContext)} roleLabelKey={getResidentRoleLabelKey(session?.role)} showBackButton={!!onBack} {...includeWhenPresent("onBackPress", onBack)} {...includeWhenPresent("contextualAction", rightActions)}/>);
}
export default ResponsivePageHeader;

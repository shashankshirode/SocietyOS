import React from 'react';
import type { AppIconName } from '../icons/icon.types';
import { SurfaceCard } from './SurfaceCard';
import { includeWhenPresent } from "../utils/presentProperty";
type FeatureActionTileProps = {
    title: string;
    description?: string;
    icon: AppIconName;
    countBadge?: string | number;
    statusBadge?: string;
    disabled?: boolean;
    hidden?: boolean;
    onPress: () => void;
};
export function FeatureActionTile({ title, description, icon, countBadge, statusBadge, disabled = false, hidden = false, onPress }: FeatureActionTileProps) {
    if (hidden)
        return null;
    return (<SurfaceCard title={title} {...includeWhenPresent("subtitle", description)} icon={icon} {...includeWhenPresent("status", statusBadge ?? (countBadge !== undefined ? String(countBadge) : undefined))} statusTone={countBadge !== undefined ? 'info' : 'neutral'} {...includeWhenPresent("onPress", disabled ? undefined : onPress)} variant="elevated" {...includeWhenPresent("style", disabled ? { opacity: 0.5 } : undefined)}/>);
}


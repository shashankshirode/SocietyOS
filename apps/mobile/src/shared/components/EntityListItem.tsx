import React from 'react';
import type { AppIconName } from '../icons/icon.types';
import { SurfaceCard } from './SurfaceCard';
import { includeWhenPresent } from "../utils/presentProperty";
type EntityListItemProps = {
    title: string;
    subtitle?: string;
    metadata?: string;
    icon?: AppIconName;
    status?: string;
    onPress?: () => void;
};
export function EntityListItem({ title, subtitle, metadata, icon = 'info', status, onPress }: EntityListItemProps) {
    return (<SurfaceCard title={title} subtitle={[subtitle, metadata].filter(Boolean).join(' · ')} icon={icon} {...includeWhenPresent("status", status)} statusTone="info" {...includeWhenPresent("onPress", onPress)} variant="elevated"/>);
}


import React from 'react';
import type { AppIconName } from '../icons/icon.types';
import { SurfaceCard } from './SurfaceCard';
import { includeWhenPresent } from "../utils/presentProperty";
type DetailHeaderPanelProps = {
    title: string;
    subtitle?: string;
    icon?: AppIconName;
    status?: string;
};
export function DetailHeaderPanel({ title, subtitle, icon = 'info', status }: DetailHeaderPanelProps) {
    return <SurfaceCard title={title} {...includeWhenPresent("subtitle", subtitle)} icon={icon} {...includeWhenPresent("status", status)} statusTone="info" variant="gradient"/>;
}


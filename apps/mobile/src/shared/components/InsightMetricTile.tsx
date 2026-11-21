import React from 'react';
import type { AppIconName } from '../icons/icon.types';
import { SurfaceCard } from './SurfaceCard';
import { includeWhenPresent } from "../utils/presentProperty";
type InsightMetricTileProps = {
    label: string;
    value: string | number;
    detail?: string;
    icon?: AppIconName;
};
export function InsightMetricTile({ label, value, detail, icon = 'info' }: InsightMetricTileProps) {
    return <SurfaceCard title={String(value)} subtitle={label} {...includeWhenPresent("body", detail)} icon={icon} variant="elevated"/>;
}


import React from 'react';
import { ResponsiveGrid } from '../layout/ResponsiveGrid';
import { Spacing } from '../theme/spacing';
import { FeatureActionTile } from './FeatureActionTile';
import type { AppIconName } from '../icons/icon.types';
import { includeWhenPresent } from "../utils/presentProperty";
export type FeatureActionGridItem = {
    id: string;
    title: string;
    description?: string;
    icon: AppIconName;
    onPress: () => void;
    badge?: string | number;
};
type FeatureActionGridProps = {
    actions: FeatureActionGridItem[];
};
export function FeatureActionGrid({ actions }: FeatureActionGridProps) {
    return (<ResponsiveGrid columnsPhone={2} columnsTablet={3} gap={Spacing.md}>
      {actions.map((action) => (<FeatureActionTile key={action.id} title={action.title} {...includeWhenPresent("description", action.description)} icon={action.icon} {...includeWhenPresent("countBadge", action.badge)} onPress={action.onPress}/>))}
    </ResponsiveGrid>);
}


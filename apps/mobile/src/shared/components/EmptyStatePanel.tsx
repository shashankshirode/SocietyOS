import React from 'react';
import type { AppIconName } from '../icons/icon.types';
import { SurfaceCard } from './SurfaceCard';

type EmptyStatePanelProps = {
  title: string;
  description: string;
  icon?: AppIconName;
  actionArea?: React.ReactNode;
};

export function EmptyStatePanel({ title, description, icon = 'empty', actionArea }: EmptyStatePanelProps) {
  return <SurfaceCard title={title} subtitle={description} icon={icon} actionArea={actionArea} variant="glass" />;
}

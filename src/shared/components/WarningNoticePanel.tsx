import React from 'react';
import { SurfaceCard } from './SurfaceCard';

export function WarningNoticePanel({ title, description }: { title: string; description: string }) {
  return <SurfaceCard title={title} subtitle={description} icon="warning" status="ATTENTION" statusTone="warning" variant="warning" />;
}

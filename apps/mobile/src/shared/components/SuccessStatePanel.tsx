import React from 'react';
import { SurfaceCard } from './SurfaceCard';

export function SuccessStatePanel({ title, description }: { title: string; description: string }) {
  return <SurfaceCard title={title} subtitle={description} icon="success" status="DONE" statusTone="success" variant="success" />;
}

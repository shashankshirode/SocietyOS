import React from 'react';
import { SocietyShimmerProvider } from './SocietySkeleton';
import { DashboardSkeleton } from './DashboardSkeleton';
import { ListSkeleton } from './ListSkeleton';
import { CardSkeleton } from './CardSkeleton';
import { FormSkeleton } from './FormSkeleton';
import { TimelineSkeleton } from './TimelineSkeleton';

export type ScreenSkeletonVariant = 'dashboard' | 'list' | 'detail' | 'form' | 'timeline';

export interface ScreenSkeletonProps {
  variant?: ScreenSkeletonVariant;
}

export function ScreenSkeleton({ variant = 'list' }: ScreenSkeletonProps) {
  return (
    <SocietyShimmerProvider>
      {variant === 'dashboard' ? (
        <DashboardSkeleton />
      ) : variant === 'form' ? (
        <FormSkeleton />
      ) : variant === 'timeline' ? (
        <TimelineSkeleton />
      ) : variant === 'detail' ? (
        <CardSkeleton lines={4} />
      ) : (
        <ListSkeleton count={5} />
      )}
    </SocietyShimmerProvider>
  );
}

export default ScreenSkeleton;

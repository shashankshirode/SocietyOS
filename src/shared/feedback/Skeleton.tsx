import React from 'react';
import type { DimensionValue, ViewStyle, StyleProp } from 'react-native';
import { SocietySkeleton, SocietyShimmerProvider } from '../../ui/loading/SocietySkeleton';
import { SocietySkeletonSurface } from '../../ui/loading/SocietySkeletonPrimitives';
import { AppCard } from '../cards/AppCard';
import { Radius } from '../theme/radius';
import { styles } from './styles/Skeleton.styles';

export interface SkeletonProps {
  readonly width?: DimensionValue;
  readonly height?: DimensionValue;
  readonly borderRadius?: number;
  readonly style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = Radius.xs, style }: SkeletonProps) {
  return (
    <SocietySkeleton
      width={width}
      height={height}
      borderRadius={borderRadius}
      style={style}
    />
  );
}

export function ListCardSkeleton() {
  return (
    <SocietyShimmerProvider>
      <AppCard style={styles.card}>
        <SocietySkeletonSurface style={{ borderBottomWidth: 0, padding: 0 }}>
          <SocietySkeleton width={40} height={40} borderRadius={Radius.sm} style={styles.marginRight} />
          <SocietySkeleton width="60%" height={14} style={styles.marginBottomSm} />
          <SocietySkeleton width="40%" height={10} />
        </SocietySkeletonSurface>
      </AppCard>
    </SocietyShimmerProvider>
  );
}

export function DetailBlockSkeleton() {
  return (
    <SocietyShimmerProvider>
      <AppCard style={styles.card}>
        <SocietySkeleton height={18} width="35%" style={styles.marginBottomLg} />
        <SocietySkeleton height={14} width="100%" style={styles.marginBottomSm} />
        <SocietySkeleton height={14} width="95%" style={styles.marginBottomSm} />
        <SocietySkeleton height={14} width="85%" style={styles.marginBottomSm} />
        <SocietySkeleton height={14} width="50%" />
      </AppCard>
    </SocietyShimmerProvider>
  );
}

export default Skeleton;

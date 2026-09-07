import React from 'react';
import { View } from 'react-native';
import { SocietySkeleton, SocietyShimmerProvider } from '../../../../ui/loading/SocietySkeleton';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { Radius } from '../../../../shared/theme/radius';
import { styles } from '../styles/components/HouseholdScreenSkeleton.styles';

export type HouseholdScreenSkeletonProps = {
  variant?: 'summary' | 'family' | 'tenant' | 'emergency' | 'access' | 'pending';
};

export function HouseholdScreenSkeleton({ variant = 'summary' }: HouseholdScreenSkeletonProps) {
  const { semantic } = useAppTheme();

  return (
    <SocietyShimmerProvider>
      <View
        style={[
          styles.card,
          { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
        ]}
      >
        <View style={styles.headerRow}>
          <SocietySkeleton width={44} height={44} borderRadius={22} />
          <View style={{ flex: 1, gap: 5 }}>
            <SocietySkeleton width="60%" height={16} borderRadius={Radius.xs} />
            <SocietySkeleton width="35%" height={12} borderRadius={Radius.xs} />
          </View>
          <SocietySkeleton width={64} height={22} borderRadius={Radius.pill} />
        </View>

        {variant === 'family' || variant === 'emergency' || variant === 'pending' ? (
          <View style={{ gap: 8, marginTop: 4 }}>
            <View style={styles.chipRow}>
              <SocietySkeleton width={70} height={24} borderRadius={Radius.pill} />
              <SocietySkeleton width={90} height={24} borderRadius={Radius.pill} />
              <SocietySkeleton width={60} height={24} borderRadius={Radius.pill} />
            </View>
            <SocietySkeleton width="100%" height={40} borderRadius={Radius.md} />
          </View>
        ) : null}

        {variant === 'tenant' ? (
          <View style={{ gap: 10, marginTop: 4 }}>
            <SocietySkeleton width="85%" height={14} borderRadius={Radius.xs} />
            <View style={styles.chipRow}>
              <SocietySkeleton width={100} height={36} borderRadius={Radius.sm} />
              <SocietySkeleton width={100} height={36} borderRadius={Radius.sm} />
            </View>
          </View>
        ) : null}

        {variant === 'access' ? (
          <View style={{ gap: 8, marginTop: 4 }}>
            <SocietySkeleton width="100%" height={10} borderRadius={Radius.xs} />
            <SocietySkeleton width="70%" height={10} borderRadius={Radius.xs} />
          </View>
        ) : null}
      </View>
    </SocietyShimmerProvider>
  );
}

export default HouseholdScreenSkeleton;

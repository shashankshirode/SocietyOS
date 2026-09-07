import React from 'react';
import { View } from 'react-native';
import { SocietySkeleton, SocietyShimmerProvider } from '../../../ui/loading/SocietySkeleton';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { Radius } from '../../../shared/theme/radius';
import { residenceAccessMessages } from '../../../messages/en/residenceAccess.messages';
import { styles } from '../styles/components/ResidenceAccessSkeleton.styles';

export interface ResidenceAccessSkeletonProps {
  readonly count?: number;
}

export function ResidenceAccessSkeleton({ count = 3 }: ResidenceAccessSkeletonProps) {
  const { semantic } = useAppTheme();

  return (
    <SocietyShimmerProvider>
      <View
        accessibilityLabel={residenceAccessMessages.common.loading}
        style={styles.list}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {Array.from({ length: count }, (_, index) => (
          <View
            key={`residence-skeleton-${index}`}
            style={[
              styles.card,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
            ]}
          >
            <SocietySkeleton width="100%" height={120} borderRadius={Radius.md} />
            <View style={[styles.content, { gap: 8, marginTop: 8 }]}>
              <SocietySkeleton width="65%" height={18} borderRadius={Radius.xs} />
              <SocietySkeleton width="45%" height={12} borderRadius={Radius.xs} />
              <SocietySkeleton width={80} height={22} borderRadius={Radius.pill} />
              <SocietySkeleton width="100%" height={40} borderRadius={Radius.md} style={{ marginTop: 4 }} />
            </View>
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export default ResidenceAccessSkeleton;

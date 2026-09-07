import React from 'react';
import { View } from 'react-native';
import { SocietySkeleton, SocietyShimmerProvider } from '../../../../ui/loading/SocietySkeleton';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { Radius } from '../../../../shared/theme/radius';
import { styles } from '../styles/components/ContextualInsightSkeleton.styles';

export function ContextualInsightSkeleton() {
  const { semantic } = useAppTheme();

  return (
    <SocietyShimmerProvider>
      <View
        style={[
          styles.container,
          { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
        ]}
      >
        <SocietySkeleton width={20} height={20} borderRadius={Radius.pill} />
        <SocietySkeleton width="75%" height={14} borderRadius={Radius.xs} />
      </View>
    </SocietyShimmerProvider>
  );
}

export default ContextualInsightSkeleton;

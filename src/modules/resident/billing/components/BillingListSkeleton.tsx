import React from 'react';
import { View, ScrollView } from 'react-native';
import { SocietySkeleton, SocietyShimmerProvider } from '../../../../ui/loading/SocietySkeleton';
import { useResidentTheme } from '../../../../ui/foundation/residentTheme';
import { Radius } from '../../../../shared/theme/radius';
import { styles } from '../styles/components/BillingListSkeleton.styles';

export function BillingListSkeleton() {
  const theme = useResidentTheme();

  return (
    <SocietyShimmerProvider>
      <View
        testID="billing-list-skeleton"
        style={styles.stack}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {/* 4 Top Stat Cards */}
        <View style={styles.statsRow}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.statCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <SocietySkeleton width={20} height={20} borderRadius={Radius.xs} />
              <SocietySkeleton width="75%" height={16} borderRadius={Radius.xs} />
              <SocietySkeleton width="50%" height={10} borderRadius={Radius.xs} />
            </View>
          ))}
        </View>

        {/* Filter Tabs */}
        <View style={styles.chips}>
          <SocietySkeleton width={76} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={70} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={78} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={64} height={34} borderRadius={Radius.pill} />
        </View>

        {/* Hero Bill Summary Card */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ gap: 4 }}>
              <SocietySkeleton width={110} height={12} borderRadius={Radius.xs} />
              <SocietySkeleton width={150} height={26} borderRadius={Radius.xs} />
            </View>
            <SocietySkeleton width={70} height={22} borderRadius={Radius.pill} />
          </View>
          <SocietySkeleton width="100%" height={42} borderRadius={Radius.md} />
        </View>

        {/* Bill Rows */}
        {[0, 1, 2].map((index) => (
          <View
            key={index}
            style={[
              styles.billRow,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={[styles.row, { gap: 12 }]}>
              <SocietySkeleton width={38} height={38} borderRadius={Radius.sm} />
              <View style={{ flex: 1, gap: 4 }}>
                <SocietySkeleton width="60%" height={15} borderRadius={Radius.xs} />
                <SocietySkeleton width="40%" height={11} borderRadius={Radius.xs} />
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <SocietySkeleton width={64} height={16} borderRadius={Radius.xs} />
                <SocietySkeleton width={50} height={18} borderRadius={Radius.pill} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export default BillingListSkeleton;

import React from 'react';
import { View, ScrollView } from 'react-native';
import { SocietySkeleton, SocietyShimmerProvider } from '../loading/SocietySkeleton';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { Radius } from '../../shared/theme/radius';
import { styles } from './styles/FeatureSkeletons.styles';

export function ResidencePulseSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="residence-pulse-skeleton">
        <View style={styles.greetingBlock}>
          <SocietySkeleton width="65%" height={28} borderRadius={Radius.xs} />
          <SocietySkeleton width="45%" height={16} borderRadius={Radius.xs} />
        </View>
        <View
          style={[
            styles.pulseCard,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
          ]}
        >
          <View style={styles.rowBetween}>
            <SocietySkeleton width={130} height={20} borderRadius={Radius.pill} />
            <SocietySkeleton width={74} height={20} borderRadius={Radius.pill} />
          </View>
          <View style={{ gap: 6 }}>
            <SocietySkeleton width="80%" height={22} borderRadius={Radius.xs} />
            <SocietySkeleton width="55%" height={14} borderRadius={Radius.xs} />
          </View>
          <View style={styles.pulsePillsRow}>
            <SocietySkeleton width={100} height={34} borderRadius={Radius.pill} />
            <SocietySkeleton width={115} height={34} borderRadius={Radius.pill} />
            <SocietySkeleton width={90} height={34} borderRadius={Radius.pill} />
          </View>
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function PriorityRailSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="priority-rail-skeleton">
        <View style={styles.rowBetween}>
          <SocietySkeleton width={150} height={18} borderRadius={Radius.xs} />
          <SocietySkeleton width={60} height={14} borderRadius={Radius.xs} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, marginTop: 12 }}
        >
          {[1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.card,
                { width: 260, height: 128, backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 8 },
              ]}
            >
              <View style={styles.rowBetween}>
                <SocietySkeleton width={32} height={32} borderRadius={Radius.sm} />
                <SocietySkeleton width={70} height={18} borderRadius={Radius.pill} />
              </View>
              <SocietySkeleton width="85%" height={16} borderRadius={Radius.xs} />
              <SocietySkeleton width="60%" height={12} borderRadius={Radius.xs} />
            </View>
          ))}
        </ScrollView>
      </View>
    </SocietyShimmerProvider>
  );
}

export function VisitorTimelineSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="visitor-timeline-skeleton">
        <View style={styles.rowBetween}>
          <SocietySkeleton width={160} height={18} borderRadius={Radius.xs} />
          <SocietySkeleton width={60} height={14} borderRadius={Radius.xs} />
        </View>
        <View style={{ marginTop: 12, gap: 12 }}>
          {[1, 2].map((i) => (
            <View key={i} style={[styles.row, { gap: 12 }]}>
              <View style={styles.timelineNode}>
                <SocietySkeleton width={12} height={12} borderRadius={6} />
                <SocietySkeleton width={2} height={50} style={styles.timelineLine} />
              </View>
              <View
                style={[
                  styles.card,
                  { flex: 1, backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, padding: 12 },
                ]}
              >
                <View style={[styles.row, { gap: 10 }]}>
                  <SocietySkeleton width={38} height={38} borderRadius={19} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <SocietySkeleton width="65%" height={14} borderRadius={Radius.xs} />
                    <SocietySkeleton width="40%" height={11} borderRadius={Radius.xs} />
                  </View>
                  <SocietySkeleton width={60} height={20} borderRadius={Radius.pill} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function BillSummarySkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="bill-summary-skeleton">
        <SocietySkeleton width={160} height={18} borderRadius={Radius.xs} style={{ marginBottom: 12 }} />
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 14 },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ gap: 4 }}>
              <SocietySkeleton width={100} height={12} borderRadius={Radius.xs} />
              <SocietySkeleton width={140} height={26} borderRadius={Radius.xs} />
            </View>
            <SocietySkeleton width={70} height={24} borderRadius={Radius.pill} />
          </View>
          <SocietySkeleton width="100%" height={44} borderRadius={Radius.md} />
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function ComplaintProgressSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="complaint-progress-skeleton">
        <SocietySkeleton width={150} height={18} borderRadius={Radius.xs} style={{ marginBottom: 12 }} />
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 10 },
          ]}
        >
          <View style={styles.rowBetween}>
            <SocietySkeleton width={90} height={14} borderRadius={Radius.xs} />
            <SocietySkeleton width={70} height={20} borderRadius={Radius.pill} />
          </View>
          <SocietySkeleton width="85%" height={16} borderRadius={Radius.xs} />
          <SocietySkeleton width="100%" height={6} borderRadius={3} />
          <View style={styles.rowBetween}>
            <SocietySkeleton width={80} height={12} borderRadius={Radius.xs} />
            <SocietySkeleton width={100} height={12} borderRadius={Radius.xs} />
          </View>
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function ResidentConnectSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="resident-connect-skeleton">
        <SocietySkeleton width={150} height={18} borderRadius={Radius.xs} style={{ marginBottom: 12 }} />
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
          ]}
        >
          <View style={[styles.row, { gap: 12 }]}>
            <SocietySkeleton width={44} height={44} borderRadius={22} />
            <View style={{ flex: 1, gap: 6 }}>
              <SocietySkeleton width="65%" height={15} borderRadius={Radius.xs} />
              <SocietySkeleton width="45%" height={12} borderRadius={Radius.xs} />
            </View>
            <SocietySkeleton width={32} height={32} borderRadius={Radius.pill} />
          </View>
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function NoticeRailSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="notice-rail-skeleton">
        <View style={styles.rowBetween}>
          <SocietySkeleton width={130} height={18} borderRadius={Radius.xs} />
          <SocietySkeleton width={60} height={14} borderRadius={Radius.xs} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, marginTop: 12 }}
        >
          {[1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.card,
                { width: 280, height: 130, backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 8 },
              ]}
            >
              <View style={styles.rowBetween}>
                <SocietySkeleton width={80} height={18} borderRadius={Radius.pill} />
                <SocietySkeleton width={60} height={12} borderRadius={Radius.xs} />
              </View>
              <SocietySkeleton width="90%" height={16} borderRadius={Radius.xs} />
              <SocietySkeleton width="100%" height={28} borderRadius={Radius.xs} />
            </View>
          ))}
        </ScrollView>
      </View>
    </SocietyShimmerProvider>
  );
}

export function DocumentReadinessSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="document-readiness-skeleton">
        <SocietySkeleton width={160} height={18} borderRadius={Radius.xs} style={{ marginBottom: 12 }} />
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
          ]}
        >
          <View style={[styles.row, { gap: 12 }]}>
            <SocietySkeleton width={40} height={40} borderRadius={Radius.sm} />
            <View style={{ flex: 1, gap: 6 }}>
              <SocietySkeleton width="70%" height={15} borderRadius={Radius.xs} />
              <SocietySkeleton width="45%" height={12} borderRadius={Radius.xs} />
            </View>
          </View>
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function AmenityRailSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="amenity-rail-skeleton">
        <SocietySkeleton width={140} height={18} borderRadius={Radius.xs} style={{ marginBottom: 12 }} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {[1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.card,
                { width: 180, height: 150, backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, padding: 8, gap: 8 },
              ]}
            >
              <SocietySkeleton width="100%" height={90} borderRadius={Radius.sm} />
              <SocietySkeleton width="75%" height={14} borderRadius={Radius.xs} />
              <SocietySkeleton width="45%" height={11} borderRadius={Radius.xs} />
            </View>
          ))}
        </ScrollView>
      </View>
    </SocietyShimmerProvider>
  );
}

export function CommunityServicesSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="community-services-skeleton">
        <SocietySkeleton width={150} height={18} borderRadius={Radius.xs} style={{ marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.card,
                { flex: 1, height: 80, backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, alignItems: 'center', justifyContent: 'center', gap: 6 },
              ]}
            >
              <SocietySkeleton width={32} height={32} borderRadius={16} />
              <SocietySkeleton width={60} height={10} borderRadius={Radius.xs} />
            </View>
          ))}
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function RecentActivitySkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.section} testID="recent-activity-skeleton">
        <SocietySkeleton width={140} height={18} borderRadius={Radius.xs} style={{ marginBottom: 12 }} />
        <View style={{ gap: 10 }}>
          {[1, 2].map((i) => (
            <View
              key={i}
              style={[
                styles.card,
                { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, padding: 12 },
              ]}
            >
              <View style={[styles.row, { gap: 12 }]}>
                <SocietySkeleton width={36} height={36} borderRadius={18} />
                <View style={{ flex: 1, gap: 4 }}>
                  <SocietySkeleton width="75%" height={13} borderRadius={Radius.xs} />
                  <SocietySkeleton width="40%" height={10} borderRadius={Radius.xs} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function ResidentDashboardSkeleton() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 12 }}>
      <ResidencePulseSkeleton />
      <PriorityRailSkeleton />
      <VisitorTimelineSkeleton />
      <BillSummarySkeleton />
      <ComplaintProgressSkeleton />
      <NoticeRailSkeleton />
    </ScrollView>
  );
}

export function NoticesListSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="notices-list-skeleton">
        {/* Search Bar */}
        <View
          style={{
            height: 44,
            borderRadius: Radius.md,
            backgroundColor: semantic.surface.raised,
            borderWidth: 1,
            borderColor: semantic.border.subtle,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            gap: 10,
          }}
        >
          <SocietySkeleton width={18} height={18} borderRadius={9} />
          <SocietySkeleton width="50%" height={14} borderRadius={Radius.xs} />
        </View>

        {/* Filter Chips */}
        <View style={styles.chipRow}>
          <SocietySkeleton width={64} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={90} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={110} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={76} height={34} borderRadius={Radius.pill} />
        </View>

        {/* Important Notice Hero Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 8, padding: 16 },
          ]}
        >
          <View style={styles.rowBetween}>
            <SocietySkeleton width={90} height={18} borderRadius={Radius.pill} />
            <SocietySkeleton width={70} height={12} borderRadius={Radius.xs} />
          </View>
          <SocietySkeleton width="85%" height={18} borderRadius={Radius.xs} />
          <SocietySkeleton width="100%" height={32} borderRadius={Radius.xs} />
          <SocietySkeleton width={95} height={14} borderRadius={Radius.xs} style={{ marginTop: 4 }} />
        </View>

        {/* Regular Notice Rows */}
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.noticeRow,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
            ]}
          >
            <View style={{ flex: 1, gap: 5 }}>
              <SocietySkeleton width="40%" height={11} borderRadius={Radius.xs} />
              <SocietySkeleton width="75%" height={16} borderRadius={Radius.xs} />
              <SocietySkeleton width="95%" height={12} borderRadius={Radius.xs} />
            </View>
            <SocietySkeleton width={18} height={18} borderRadius={Radius.xs} />
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function NoticeDetailsSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="notice-details-skeleton">
        <View style={styles.rowBetween}>
          <SocietySkeleton width={90} height={20} borderRadius={Radius.pill} />
          <SocietySkeleton width={100} height={14} borderRadius={Radius.xs} />
        </View>
        <SocietySkeleton width="90%" height={26} borderRadius={Radius.xs} />
        <View style={[styles.divider, { backgroundColor: semantic.border.subtle }]} />
        <View style={{ gap: 8 }}>
          <SocietySkeleton width="100%" height={14} borderRadius={Radius.xs} />
          <SocietySkeleton width="95%" height={14} borderRadius={Radius.xs} />
          <SocietySkeleton width="90%" height={14} borderRadius={Radius.xs} />
          <SocietySkeleton width="60%" height={14} borderRadius={Radius.xs} />
        </View>
        <View
          style={[
            styles.card,
            { marginTop: 12, backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, flexDirection: 'row', alignItems: 'center', gap: 12 },
          ]}
        >
          <SocietySkeleton width={36} height={36} borderRadius={Radius.sm} />
          <View style={{ flex: 1, gap: 4 }}>
            <SocietySkeleton width="60%" height={14} borderRadius={Radius.xs} />
            <SocietySkeleton width="30%" height={10} borderRadius={Radius.xs} />
          </View>
          <SocietySkeleton width={24} height={24} borderRadius={Radius.xs} />
        </View>
        <SocietySkeleton width="100%" height={48} borderRadius={Radius.md} style={{ marginTop: 16 }} />
      </View>
    </SocietyShimmerProvider>
  );
}

export function BillsListSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="bills-list-skeleton">
        {/* Stat Cards */}
        <View style={styles.statGrid}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.statCard,
                { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
              ]}
            >
              <SocietySkeleton width={22} height={22} borderRadius={Radius.xs} />
              <SocietySkeleton width="80%" height={18} borderRadius={Radius.xs} />
              <SocietySkeleton width="60%" height={10} borderRadius={Radius.xs} />
            </View>
          ))}
        </View>

        {/* Filter Tabs */}
        <View style={styles.chipRow}>
          <SocietySkeleton width={80} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={76} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={82} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={68} height={34} borderRadius={Radius.pill} />
        </View>

        {/* Summary Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 12 },
          ]}
        >
          <View style={styles.rowBetween}>
            <SocietySkeleton width={110} height={14} borderRadius={Radius.xs} />
            <SocietySkeleton width={70} height={20} borderRadius={Radius.pill} />
          </View>
          <SocietySkeleton width="50%" height={28} borderRadius={Radius.xs} />
          <SocietySkeleton width="100%" height={42} borderRadius={Radius.md} />
        </View>

        {/* Bill List Items */}
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.card,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 10, padding: 14 },
            ]}
          >
            <View style={styles.rowBetween}>
              <View style={[styles.row, { gap: 10 }]}>
                <SocietySkeleton width={36} height={36} borderRadius={Radius.sm} />
                <View style={{ gap: 4 }}>
                  <SocietySkeleton width={120} height={15} borderRadius={Radius.xs} />
                  <SocietySkeleton width={80} height={11} borderRadius={Radius.xs} />
                </View>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <SocietySkeleton width={70} height={16} borderRadius={Radius.xs} />
                <SocietySkeleton width={55} height={18} borderRadius={Radius.pill} />
              </View>
            </View>
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function BillDetailsSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="bill-details-skeleton">
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 16 },
          ]}
        >
          <View style={styles.rowBetween}>
            <View style={{ gap: 4 }}>
              <SocietySkeleton width={100} height={12} borderRadius={Radius.xs} />
              <SocietySkeleton width={150} height={28} borderRadius={Radius.xs} />
            </View>
            <SocietySkeleton width={80} height={24} borderRadius={Radius.pill} />
          </View>
          <View style={[styles.divider, { backgroundColor: semantic.border.subtle }]} />
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.rowBetween}>
              <SocietySkeleton width="45%" height={14} borderRadius={Radius.xs} />
              <SocietySkeleton width="25%" height={14} borderRadius={Radius.xs} />
            </View>
          ))}
          <SocietySkeleton width="100%" height={48} borderRadius={Radius.md} style={{ marginTop: 12 }} />
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function PaymentCheckoutSkeleton() {
  return <BillDetailsSkeleton />;
}

export function ComplaintsListSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="complaints-list-skeleton">
        {/* Search */}
        <View
          style={{
            height: 44,
            borderRadius: Radius.md,
            backgroundColor: semantic.surface.raised,
            borderWidth: 1,
            borderColor: semantic.border.subtle,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            gap: 10,
          }}
        >
          <SocietySkeleton width={18} height={18} borderRadius={9} />
          <SocietySkeleton width="50%" height={14} borderRadius={Radius.xs} />
        </View>

        {/* Chips */}
        <View style={styles.chipRow}>
          <SocietySkeleton width={64} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={85} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={90} height={34} borderRadius={Radius.pill} />
        </View>

        {/* Complaints Cards */}
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.card,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 8 },
            ]}
          >
            <View style={styles.rowBetween}>
              <SocietySkeleton width={80} height={12} borderRadius={Radius.xs} />
              <SocietySkeleton width={75} height={20} borderRadius={Radius.pill} />
            </View>
            <SocietySkeleton width="85%" height={16} borderRadius={Radius.xs} />
            <SocietySkeleton width="60%" height={12} borderRadius={Radius.xs} />
            <View style={[styles.rowBetween, { marginTop: 4 }]}>
              <SocietySkeleton width={70} height={18} borderRadius={Radius.pill} />
              <SocietySkeleton width={90} height={11} borderRadius={Radius.xs} />
            </View>
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function ComplaintDetailsSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="complaint-details-skeleton">
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 12 },
          ]}
        >
          <View style={styles.rowBetween}>
            <SocietySkeleton width={90} height={14} borderRadius={Radius.xs} />
            <SocietySkeleton width={80} height={22} borderRadius={Radius.pill} />
          </View>
          <SocietySkeleton width="90%" height={22} borderRadius={Radius.xs} />
          <SocietySkeleton width="100%" height={40} borderRadius={Radius.xs} />
        </View>

        {/* Timeline Stepper */}
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 12 },
          ]}
        >
          <SocietySkeleton width={140} height={16} borderRadius={Radius.xs} />
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={[styles.row, { gap: 12 }]}>
              <SocietySkeleton width={12} height={12} borderRadius={6} />
              <View style={{ flex: 1, gap: 4 }}>
                <SocietySkeleton width="50%" height={14} borderRadius={Radius.xs} />
                <SocietySkeleton width="70%" height={11} borderRadius={Radius.xs} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function DocumentVaultSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="document-vault-skeleton">
        {/* Category Pills */}
        <View style={styles.chipRow}>
          <SocietySkeleton width={70} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={95} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={85} height={34} borderRadius={Radius.pill} />
        </View>

        {/* Documents */}
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.noticeRow,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
            ]}
          >
            <SocietySkeleton width={42} height={42} borderRadius={Radius.sm} />
            <View style={{ flex: 1, gap: 5 }}>
              <SocietySkeleton width="75%" height={15} borderRadius={Radius.xs} />
              <SocietySkeleton width="45%" height={11} borderRadius={Radius.xs} />
            </View>
            <SocietySkeleton width={24} height={24} borderRadius={Radius.xs} />
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function DocumentDetailsSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="document-details-skeleton">
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 14 },
          ]}
        >
          <View style={[styles.row, { gap: 12 }]}>
            <SocietySkeleton width={44} height={44} borderRadius={Radius.sm} />
            <View style={{ flex: 1, gap: 6 }}>
              <SocietySkeleton width="80%" height={16} borderRadius={Radius.xs} />
              <SocietySkeleton width="40%" height={12} borderRadius={Radius.xs} />
            </View>
          </View>
          <SocietySkeleton width="100%" height={220} borderRadius={Radius.md} />
          <View style={styles.rowBetween}>
            <SocietySkeleton width={120} height={40} borderRadius={Radius.md} />
            <SocietySkeleton width={120} height={40} borderRadius={Radius.md} />
          </View>
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function NocListSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="noc-list-skeleton">
        <View style={styles.chipRow}>
          <SocietySkeleton width={70} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={90} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={80} height={34} borderRadius={Radius.pill} />
        </View>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.card,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 8 },
            ]}
          >
            <View style={styles.rowBetween}>
              <SocietySkeleton width={120} height={16} borderRadius={Radius.xs} />
              <SocietySkeleton width={80} height={20} borderRadius={Radius.pill} />
            </View>
            <SocietySkeleton width="50%" height={12} borderRadius={Radius.xs} />
            <SocietySkeleton width="100%" height={36} borderRadius={Radius.sm} style={{ marginTop: 6 }} />
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function NocDetailsSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="noc-details-skeleton">
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 12 },
          ]}
        >
          <SocietySkeleton width="35%" height={12} borderRadius={Radius.xs} />
          <SocietySkeleton width="75%" height={20} borderRadius={Radius.xs} />
          <SocietySkeleton width="50%" height={12} borderRadius={Radius.xs} />
          <View style={[styles.divider, { backgroundColor: semantic.border.subtle }]} />
          <SocietySkeleton width="100%" height={44} borderRadius={Radius.md} />
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function FacilityListSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="facility-list-skeleton">
        <View style={styles.chipRow}>
          <SocietySkeleton width={60} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={90} height={34} borderRadius={Radius.pill} />
          <SocietySkeleton width={80} height={34} borderRadius={Radius.pill} />
        </View>
        {[1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.facilityCard,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
            ]}
          >
            <SocietySkeleton width="100%" height={140} borderRadius={Radius.md} />
            <View style={styles.rowBetween}>
              <SocietySkeleton width="60%" height={18} borderRadius={Radius.xs} />
              <SocietySkeleton width={70} height={20} borderRadius={Radius.pill} />
            </View>
            <SocietySkeleton width="40%" height={12} borderRadius={Radius.xs} />
            <SocietySkeleton width="100%" height={40} borderRadius={Radius.md} style={{ marginTop: 4 }} />
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function FacilityDetailsSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="facility-details-skeleton">
        <SocietySkeleton width="100%" height={200} borderRadius={Radius.lg} style={{ marginBottom: 16 }} />
        <View style={{ gap: 10 }}>
          <SocietySkeleton width="60%" height={24} borderRadius={Radius.xs} />
          <SocietySkeleton width="80%" height={14} borderRadius={Radius.xs} />
          <View style={styles.chipRow}>
            <SocietySkeleton width={80} height={28} borderRadius={Radius.pill} />
            <SocietySkeleton width={90} height={28} borderRadius={Radius.pill} />
          </View>
          <SocietySkeleton width="100%" height={48} borderRadius={Radius.md} style={{ marginTop: 14 }} />
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function BookingCalendarSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="booking-calendar-skeleton">
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 14 },
          ]}
        >
          <SocietySkeleton width="50%" height={18} borderRadius={Radius.xs} />
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <SocietySkeleton key={i} width={38} height={48} borderRadius={Radius.sm} />
            ))}
          </View>
          <SocietySkeleton width="100%" height={44} borderRadius={Radius.md} />
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function MarketplaceListSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="marketplace-list-skeleton">
        <View style={styles.grid2Col}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[
                styles.gridItem,
                { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
              ]}
            >
              <SocietySkeleton width="100%" height={110} borderRadius={Radius.sm} />
              <SocietySkeleton width="85%" height={14} borderRadius={Radius.xs} />
              <SocietySkeleton width="50%" height={12} borderRadius={Radius.xs} />
            </View>
          ))}
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function MarketplaceDetailsSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="marketplace-details-skeleton">
        <SocietySkeleton width="100%" height={240} borderRadius={Radius.lg} style={{ marginBottom: 16 }} />
        <View style={{ gap: 10 }}>
          <View style={styles.rowBetween}>
            <SocietySkeleton width="65%" height={22} borderRadius={Radius.xs} />
            <SocietySkeleton width="25%" height={22} borderRadius={Radius.xs} />
          </View>
          <SocietySkeleton width="40%" height={14} borderRadius={Radius.xs} />
          <SocietySkeleton width="100%" height={60} borderRadius={Radius.xs} />
          <SocietySkeleton width="100%" height={48} borderRadius={Radius.md} style={{ marginTop: 12 }} />
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function VendorListSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="vendor-list-skeleton">
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.card,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, padding: 14 },
            ]}
          >
            <View style={[styles.row, { gap: 12 }]}>
              <SocietySkeleton width={48} height={48} borderRadius={24} />
              <View style={{ flex: 1, gap: 5 }}>
                <SocietySkeleton width="65%" height={16} borderRadius={Radius.xs} />
                <SocietySkeleton width="40%" height={12} borderRadius={Radius.xs} />
              </View>
              <SocietySkeleton width={56} height={26} borderRadius={Radius.pill} />
            </View>
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function ResidentDirectorySkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="resident-directory-skeleton">
        <View
          style={{
            height: 44,
            borderRadius: Radius.md,
            backgroundColor: semantic.surface.raised,
            borderWidth: 1,
            borderColor: semantic.border.subtle,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            gap: 10,
          }}
        >
          <SocietySkeleton width={18} height={18} borderRadius={9} />
          <SocietySkeleton width="50%" height={14} borderRadius={Radius.xs} />
        </View>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.noticeRow,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
            ]}
          >
            <SocietySkeleton width={44} height={44} borderRadius={22} />
            <View style={{ flex: 1, gap: 4 }}>
              <SocietySkeleton width="55%" height={15} borderRadius={Radius.xs} />
              <SocietySkeleton width="35%" height={12} borderRadius={Radius.xs} />
            </View>
            <SocietySkeleton width={32} height={32} borderRadius={16} />
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function SettingsSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="settings-skeleton">
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 14 },
          ]}
        >
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.rowBetween}>
              <View style={[styles.row, { gap: 12 }]}>
                <SocietySkeleton width={24} height={24} borderRadius={Radius.xs} />
                <SocietySkeleton width={130} height={14} borderRadius={Radius.xs} />
              </View>
              <SocietySkeleton width={18} height={18} borderRadius={Radius.xs} />
            </View>
          ))}
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

export function ProfileSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="profile-skeleton">
        <View style={{ alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <SocietySkeleton width={80} height={80} borderRadius={40} />
          <SocietySkeleton width={150} height={20} borderRadius={Radius.xs} />
          <SocietySkeleton width={100} height={13} borderRadius={Radius.xs} />
        </View>
        <FamilyFormSkeleton />
      </View>
    </SocietyShimmerProvider>
  );
}

export function ChatListSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="chat-list-skeleton">
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              styles.noticeRow,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle },
            ]}
          >
            <SocietySkeleton width={48} height={48} borderRadius={24} />
            <View style={{ flex: 1, gap: 6 }}>
              <View style={styles.rowBetween}>
                <SocietySkeleton width="45%" height={16} borderRadius={Radius.xs} />
                <SocietySkeleton width="15%" height={10} borderRadius={Radius.xs} />
              </View>
              <SocietySkeleton width="70%" height={12} borderRadius={Radius.xs} />
            </View>
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function ChatConversationSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="chat-conversation-skeleton">
        {[1, 2, 3].map((i) => (
          <View key={i} style={{ gap: 14, marginVertical: 6 }}>
            <View style={[styles.row, { gap: 8, alignSelf: 'flex-start', maxWidth: '75%' }]}>
              <SocietySkeleton width={28} height={28} borderRadius={14} />
              <SocietySkeleton width={200} height={56} borderRadius={Radius.md} />
            </View>
            <View style={{ alignSelf: 'flex-end', maxWidth: '75%' }}>
              <SocietySkeleton width={160} height={44} borderRadius={Radius.md} />
            </View>
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function FamilyFormSkeleton() {
  return (
    <SocietyShimmerProvider>
      <View style={styles.formContainer} testID="family-form-skeleton">
        {[80, 60, 100].map((width, i) => (
          <View key={i} style={{ gap: 6 }}>
            <SocietySkeleton width={width} height={14} borderRadius={Radius.xs} />
            <SocietySkeleton width="100%" height={48} borderRadius={Radius.md} />
          </View>
        ))}
        <SocietySkeleton width="100%" height={48} borderRadius={Radius.md} style={{ marginTop: 12 }} />
      </View>
    </SocietyShimmerProvider>
  );
}

export function ContactRequestFormSkeleton() {
  return <FamilyFormSkeleton />;
}

export function TenantManagementSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="tenant-management-skeleton">
        <SocietySkeleton width={180} height={22} borderRadius={Radius.xs} style={{ marginBottom: 12 }} />
        {[1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.card,
              { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 10 },
            ]}
          >
            <View style={styles.rowBetween}>
              <SocietySkeleton width="50%" height={16} borderRadius={Radius.xs} />
              <SocietySkeleton width={70} height={20} borderRadius={Radius.pill} />
            </View>
            <SocietySkeleton width="35%" height={12} borderRadius={Radius.xs} />
            <View style={styles.rowBetween}>
              <SocietySkeleton width={80} height={32} borderRadius={Radius.sm} />
              <SocietySkeleton width={80} height={32} borderRadius={Radius.sm} />
            </View>
          </View>
        ))}
      </View>
    </SocietyShimmerProvider>
  );
}

export function TenantStatusSkeleton() {
  const { semantic } = useAppTheme();
  return (
    <SocietyShimmerProvider>
      <View style={styles.listContainer} testID="tenant-status-skeleton">
        <View
          style={[
            styles.card,
            { backgroundColor: semantic.surface.raised, borderColor: semantic.border.subtle, gap: 12 },
          ]}
        >
          <SocietySkeleton width="45%" height={18} borderRadius={Radius.xs} />
          <SocietySkeleton width="80%" height={14} borderRadius={Radius.xs} />
          <SocietySkeleton width="100%" height={10} borderRadius={Radius.xs} />
          <SocietySkeleton width="100%" height={44} borderRadius={Radius.md} />
        </View>
      </View>
    </SocietyShimmerProvider>
  );
}

import React, { useState, useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, View, RefreshControl } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { useResponsiveLayout } from "../../../../ui/layout/useResponsiveLayout";
import { getResidentScreenBottomPadding } from "../../../../ui/layout/residentScreenSpacing";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ScreenErrorState } from "../../../../ui/states/ScreenErrorState";
import type { BillListScreenProps } from "../../../../app/navigation/navigation.types";
import type { Bill } from "../../../../shared/types/bill.types";
import type { BillListFilter } from "../data/residentBilling.types";
import { useResidentRoleNavigation } from "../../navigation/useResidentRoleNavigation";
import { useResidentBills } from "../hooks/useResidentBills";
import { BillingListSkeleton } from "../components/BillingListSkeleton";
import { BillFilterTabs } from "../components/BillFilterTabs";
import { BillListItem } from "../components/BillListItem";
import { BillSummaryCard } from "../components/BillSummaryCard";
import { UpiPaymentSheet } from "../components/UpiPaymentSheet";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBackgroundColorStyle5, createPressableBorderColorStyle, createFlatListPaddingBottomPaddingHorizontalStyle } from "../styles/screens/BillListScreen.styles";

type BillListScreenNavigation = Pick<BillListScreenProps['navigation'], 'navigate'>;

const FILTER_TABS: { key: BillListFilter; label: string; icon: keyof typeof Ionicons.glyphMap; countKey?: string }[] = [
  { key: 'all', label: 'All Bills', icon: 'document-text-outline' },
  { key: 'unpaid', label: 'Unpaid', icon: 'alert-circle-outline', countKey: 'unpaidBillCount' },
  { key: 'overdue', label: 'Overdue', icon: 'time-outline', countKey: 'overdueBillCount' },
  { key: 'paid', label: 'Paid', icon: 'checkmark-circle-outline', countKey: 'paidBillCount' },
];

export function BillListScreen({ navigation }: { navigation: BillListScreenNavigation }) {
  const theme = useResidentTheme();
  const messages = useMessages();
  const insets = useSafeAreaInsets();
  const { isTablet, screenPadding } = useResponsiveLayout();
  const { isEnabled } = useFeatureFlags();
  const { canPerformAction } = useResidentRoleNavigation();
  const [filter, setFilter] = useState<BillListFilter>('all');
  const [upiModalVisible, setUpiModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const { bills, summary, isInitialLoading, isLoadingMore, hasMore, error, loadMore, refresh, retry } = useResidentBills(filter);
  const billing = messages.resident.billing;
  
  const bottomPadding = getResidentScreenBottomPadding({
    safeAreaBottom: insets.bottom,
    hasBottomTabs: true,
    hasStickyFooter: false,
  });

  const handleBillPress = useCallback((bill: Bill) => {
    navigation.navigate('BillDetail', { bill });
  }, [navigation]);

  const handlePayOutstanding = useCallback(() => {
    if (!summary || summary.totalOutstanding <= 0) return;
    setUpiModalVisible(true);
  }, [summary]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);


  if (!canPerformAction('maintenance')) {
    return (
      <View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={billing.title} titleKey="resident.billing.title" subtitleKey="resident.billing.subtitle" showBackButton />
        <View style={styles.centerState}>
          <Animated.View entering={FadeInUp.duration(400)}>
            <View style={[styles.emptyIcon, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
              <Ionicons name="lock-closed-outline" size={42} color={theme.danger} />
            </View>
            <SafeText variant="title" style={createSafeTextColorStyle(theme.textPrimary)}>{billing.accessRestrictedTitle}</SafeText>
            <SafeText variant="caption" align="center" style={createSafeTextColorStyle2(theme.textSecondary)}>{billing.accessRestrictedDescription}</SafeText>
          </Animated.View>
        </View>
      </View>
    );
  }

  if (!isEnabled('maintenanceBilling')) {
    return (
      <View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
        <ResidentPageHeader title={billing.title} titleKey="resident.billing.title" subtitleKey="resident.billing.subtitle" showBackButton />
        <View style={styles.centerState}>
          <Animated.View entering={FadeInUp.duration(400)}>
            <View style={[styles.emptyIcon, { backgroundColor: 'rgba(100, 116, 139, 0.12)' }]}>
              <Ionicons name="lock-closed-outline" size={42} color={theme.textSecondary} />
            </View>
            <SafeText variant="title" style={createSafeTextColorStyle3(theme.textPrimary)}>{billing.featureUnavailableTitle}</SafeText>
            <SafeText variant="caption" align="center" style={createSafeTextColorStyle4(theme.textSecondary)}>{billing.featureUnavailableDescription}</SafeText>
          </Animated.View>
        </View>
      </View>
    );
  }

  if (isInitialLoading && bills.length === 0) {
    return (
      <View style={[styles.root, createViewBackgroundColorStyle3(theme.background)]}>
        <ResidentPageHeader title={billing.title} titleKey="resident.billing.title" subtitleKey="resident.billing.subtitle" showBackButton />
        <ContentFrame style={styles.skeletonFrame}>
          <BillingListSkeleton />
        </ContentFrame>
      </View>
    );
  }

  if (error && bills.length === 0) {
    return (
      <View style={[styles.root, createViewBackgroundColorStyle4(theme.background)]}>
        <ResidentPageHeader title={billing.title} titleKey="resident.billing.title" subtitleKey="resident.billing.subtitle" showBackButton />
        <ScreenErrorState title={billing.errors.loadTitle} message={billing.errors.loadDescription} onRetry={() => void retry()} />
      </View>
    );
  }

  const emptyDescription = billing.empty[filter];
  const latestBill = summary?.latestBill ?? null;
  const totalOutstanding = summary?.totalOutstanding ?? 0;
  const unpaidCount = bills.filter(b => b.status === 'DUE' || b.status === 'PARTIALLY_PAID').length;
  const overdueCount = bills.filter(b => b.status === 'OVERDUE').length;
  const paidCount = bills.filter(b => b.status === 'PAID').length;

  const filterTabsWithCounts = FILTER_TABS.map(tab => ({
    ...tab,
    count: tab.countKey ? (tab.countKey === 'unpaidBillCount' ? unpaidCount : tab.countKey === 'overdueBillCount' ? overdueCount : paidCount) : bills.length,
  }));

  return (
    <View style={[styles.root, createViewBackgroundColorStyle5(theme.background)]}>
      <ResidentPageHeader 
        title={billing.title} 
        titleKey="resident.billing.title" 
        subtitleKey="resident.billing.subtitle" 
        showBackButton
      />
      
      <ContentFrame style={styles.listFrame}>
        <Animated.ScrollView
          contentContainerStyle={[
            styles.listContent,
            createFlatListPaddingBottomPaddingHorizontalStyle(bottomPadding, screenPadding),
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.accent}
              colors={[theme.accent, theme.selectedBackground]}
            />
          }
        >
          {/* Animated Stats Row */}
          <Animated.View
            style={styles.statsRow}
            entering={FadeInUp.delay(100).duration(400)}
          >
            <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.12)' }]}>
                <Ionicons name="cash-outline" size={20} color={theme.accent} />
              </View>
              <View>
                <SafeText variant="bodyStrong" style={{ color: theme.textPrimary, fontSize: 22, fontWeight: '800' }}>
                  ₹{totalOutstanding.toLocaleString('en-IN')}
                </SafeText>
                <SafeText variant="tiny" style={{ color: theme.textSecondary }}>Total Outstanding</SafeText>
              </View>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(239, 68, 68, 0.12)' }]}>
                <Ionicons name="alert-circle-outline" size={20} color={theme.danger} />
              </View>
              <View>
                <SafeText variant="bodyStrong" style={{ color: theme.textPrimary, fontSize: 22, fontWeight: '800' }}>{overdueCount}</SafeText>
                <SafeText variant="tiny" style={{ color: theme.textSecondary }}>Overdue Bills</SafeText>
              </View>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(245, 158, 11, 0.12)' }]}>
                <Ionicons name="time-outline" size={20} color={theme.warning} />
              </View>
              <View>
                <SafeText variant="bodyStrong" style={{ color: theme.textPrimary, fontSize: 22, fontWeight: '800' }}>{unpaidCount}</SafeText>
                <SafeText variant="tiny" style={{ color: theme.textSecondary }}>Unpaid Bills</SafeText>
              </View>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.statIcon, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                <Ionicons name="checkmark-circle-outline" size={20} color={theme.success} />
              </View>
              <View>
                <SafeText variant="bodyStrong" style={{ color: theme.textPrimary, fontSize: 22, fontWeight: '800' }}>{paidCount}</SafeText>
                <SafeText variant="tiny" style={{ color: theme.textSecondary }}>Paid Bills</SafeText>
              </View>
            </View>
          </Animated.View>

          {/* Filter Tabs */}
          <Animated.View
            style={styles.filterTabsContainer}
            entering={FadeInUp.delay(200).duration(400)}
          >
            <View style={styles.filterTabsScroll}>
              {filterTabsWithCounts.map((tab, index) => (
                <Pressable
                  key={tab.key}
                  onPress={() => setFilter(tab.key)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: filter === tab.key }}
                  testID={`bill-filter-${tab.key}`}
                  style={[
                    styles.filterTab,
                    filter === tab.key ? styles.filterTabActive : {},
                    { backgroundColor: filter === tab.key ? theme.selectedBackground : theme.surface, borderColor: filter === tab.key ? theme.selectedBackground : theme.border }
                  ]}
                >
                  <Ionicons name={tab.icon} size={16} color={filter === tab.key ? theme.textInverse : theme.textSecondary} />
                  <SafeText variant="tiny" style={{ color: filter === tab.key ? theme.textInverse : theme.textSecondary, fontWeight: '600' }}>
                    {tab.label}
                  </SafeText>
                  <View style={[styles.filterTabBadge, { backgroundColor: filter === tab.key ? 'rgba(255,255,255,0.2)' : theme.background }]}>
                    <SafeText variant="tiny" style={{ color: filter === tab.key ? theme.textInverse : theme.textSecondary, fontWeight: '700', fontSize: 10 }}>
                      {tab.count}
                    </SafeText>
                  </View>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Bills List */}
          {bills.length === 0 ? (
            <Animated.View
              style={styles.emptyState}
              entering={FadeIn.duration(400)}
            >
              <View style={[styles.emptyIcon, { backgroundColor: 'rgba(100, 116, 139, 0.1)' }]}>
                <Ionicons name="receipt-outline" size={48} color={theme.textSecondary} />
              </View>
              <SafeText variant="title" style={createSafeTextColorStyle5(theme.textPrimary)}>{billing.noBillsFound}</SafeText>
              <SafeText variant="caption" align="center" style={createSafeTextColorStyle6(theme.textSecondary)}>{emptyDescription}</SafeText>
              {filter !== 'all' && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setFilter('all')}
                  style={[styles.clearFilter, createPressableBorderColorStyle(theme.border)]}
                >
                  <SafeText variant="caption" style={createSafeTextColorStyle7(theme.accent)}>{billing.clearFilter}</SafeText>
                </Pressable>
              )}
            </Animated.View>
          ) : (
            <FlatList
              key={isTablet ? 'billing-tablet-grid' : 'billing-phone-list'}
              testID="resident-bills-list"
              accessibilityLabel={billing.pullToRefresh}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              data={bills}
              keyExtractor={(bill) => bill.id}
              numColumns={isTablet ? 2 : 1}
              columnWrapperStyle={isTablet ? styles.tabletRow : undefined}
              renderItem={({ item, index }) => (
                <Animated.View style={isTablet ? styles.tabletItem : styles.phoneItem} entering={FadeInUp.delay(index * 60).duration(400).springify()}>
                  <BillListItem bill={item} onPress={() => handleBillPress(item)} />
                </Animated.View>
              )}
              ListHeaderComponent={
                <View style={styles.headerStack}>
                  {summary && (
                    <BillSummaryCard
                      summary={summary}
                      onPayOutstanding={handlePayOutstanding}
                      onPayInAdvance={() => navigation.navigate('AdvancePayment')}
                      onViewBill={() => latestBill && handleBillPress(latestBill)}
                      onLedger={() => navigation.navigate('FlatLedger', {})}
                    />
                  )}
                </View>
              }
              ListFooterComponent={
                <View style={styles.footer}>
                  {isLoadingMore ? (
                    <View style={styles.loadingMore} accessibilityLabel={messages.residentAccessibility.billing.loadMore}>
                      <ActivityIndicator size="small" color={theme.accent} />
                      <SafeText variant="tiny" style={createSafeTextColorStyle8(theme.textSecondary)}>{billing.loadingMore}</SafeText>
                    </View>
                  ) : bills.length > 0 && !hasMore ? (
                    <SafeText variant="tiny" align="center" style={createSafeTextColorStyle9(theme.textSecondary)}>{billing.noMoreBills}</SafeText>
                  ) : null}
                </View>
              }
              contentContainerStyle={[
                styles.listContentInner,
                createFlatListPaddingBottomPaddingHorizontalStyle(bottomPadding, screenPadding),
              ]}
              onEndReached={() => void loadMore()}
              onEndReachedThreshold={0.35}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Animated.ScrollView>
      </ContentFrame>

      <UpiPaymentSheet
        visible={upiModalVisible}
        amount={summary?.totalOutstanding ?? 4500}
        billId={summary?.latestBill?.id ?? 'bill-jul-2026-001'}
        billMonth={summary?.latestBill?.billingPeriod ?? 'July 2026'}
        onClose={() => setUpiModalVisible(false)}
        onPaymentComplete={(method, transactionId, receiptNumber) => {
          setUpiModalVisible(false);
          void refresh();
        }}
      />
    </View>
  );
}

export default BillListScreen;

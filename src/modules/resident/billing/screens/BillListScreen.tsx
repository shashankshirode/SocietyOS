import React from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
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
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBackgroundColorStyle5, createPressableBorderColorStyle, createFlatListPaddingBottomPaddingHorizontalStyle } from "../styles/screens/BillListScreen.styles";
type BillListScreenNavigation = Pick<BillListScreenProps['navigation'], 'navigate'>;
export function BillListScreen({ navigation }: {
    navigation: BillListScreenNavigation;
}) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const insets = useSafeAreaInsets();
    const { isTablet, screenPadding } = useResponsiveLayout();
    const { isEnabled } = useFeatureFlags();
    const { canPerformAction } = useResidentRoleNavigation();
    const [filter, setFilter] = React.useState<BillListFilter>('all');
    const { bills, summary, isInitialLoading, isLoadingMore, isRefreshing, hasMore, error, loadMore, refresh, retry, } = useResidentBills(filter);
    const billing = messages.resident.billing;
    const bottomPadding = getResidentScreenBottomPadding({
        safeAreaBottom: insets.bottom,
        hasBottomTabs: true,
        hasStickyFooter: false,
    });
    const handleBillPress = React.useCallback((bill: Bill) => {
        navigation.navigate('BillDetail', { bill });
    }, [navigation]);
    const handlePayOutstanding = React.useCallback(() => {
        if (!summary || summary.totalOutstanding <= 0) return;
        const virtualBill: Bill = {
            id: 'total_outstanding',
            billNumber: `TOT-${Date.now()}`,
            flatNumber: summary?.latestBill?.flatNumber || '',
            societyName: summary?.latestBill?.societyName || '',
            title: messages.resident.billing.payOutstanding,
            amount: summary.totalOutstanding,
            dueDate: new Date().toISOString().slice(0, 10),
            status: 'DRAFT' as const,
            billingPeriod: 'Outstanding Dues',
            charges: [
                {
                    lineItemId: `charge-outstanding-${Date.now()}`,
                    type: 'maintenance' as const,
                    label: messages.resident.billing.totalOutstanding,
                    labelMessageKey: 'resident.billing.totalOutstanding',
                    amount: summary.totalOutstanding,
                    currencyCode: summary.currencyCode,
                    isCredit: false,
                }
            ],
            homeContextId: summary?.latestBill?.homeContextId || '',
            societyId: summary?.latestBill?.societyId || '',
        };
        navigation.navigate('MockPaymentConfirmation', { bill: virtualBill });
    }, [summary, navigation, messages.resident.billing]);
    if (!canPerformAction('maintenance')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}> 
        <ResidentPageHeader title={billing.title} titleKey="resident.billing.title" subtitleKey="resident.billing.subtitle" showBackButton/>
        <View style={styles.centerState}>
          <Ionicons name="lock-closed-outline" size={42} color={theme.danger}/>
          <SafeText variant="title" style={createSafeTextColorStyle(theme.textPrimary)}>{billing.accessRestrictedTitle}</SafeText>
          <SafeText variant="caption" align="center" style={createSafeTextColorStyle2(theme.textSecondary)}>{billing.accessRestrictedDescription}</SafeText>
        </View>
      </View>);
    }
    if (!isEnabled('maintenanceBilling')) {
        return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}> 
        <ResidentPageHeader title={billing.title} titleKey="resident.billing.title" subtitleKey="resident.billing.subtitle" showBackButton/>
        <View style={styles.centerState}>
          <Ionicons name="lock-closed-outline" size={42} color={theme.textSecondary}/>
          <SafeText variant="title" style={createSafeTextColorStyle3(theme.textPrimary)}>{billing.featureUnavailableTitle}</SafeText>
          <SafeText variant="caption" align="center" style={createSafeTextColorStyle4(theme.textSecondary)}>{billing.featureUnavailableDescription}</SafeText>
        </View>
      </View>);
    }
    if (isInitialLoading && bills.length === 0) {
        return (<View style={[styles.root, createViewBackgroundColorStyle3(theme.background)]}> 
        <ResidentPageHeader title={billing.title} titleKey="resident.billing.title" subtitleKey="resident.billing.subtitle" showBackButton/>
        <ContentFrame style={styles.skeletonFrame}>
          <BillingListSkeleton />
        </ContentFrame>
      </View>);
    }
    if (error && bills.length === 0) {
        return (<View style={[styles.root, createViewBackgroundColorStyle4(theme.background)]}> 
        <ResidentPageHeader title={billing.title} titleKey="resident.billing.title" subtitleKey="resident.billing.subtitle" showBackButton/>
        <ScreenErrorState title={billing.errors.loadTitle} message={billing.errors.loadDescription} onRetry={() => void retry()}/>
      </View>);
    }
    const emptyDescription = billing.empty[filter];
    const latestBill = summary?.latestBill ?? null;
    return (<View style={[styles.root, createViewBackgroundColorStyle5(theme.background)]}> 
      <ResidentPageHeader title={billing.title} titleKey="resident.billing.title" subtitleKey="resident.billing.subtitle" showBackButton/>
      <ContentFrame style={styles.listFrame}>
        <FlatList key={isTablet ? 'billing-tablet-grid' : 'billing-phone-list'} testID="resident-bills-list" accessibilityLabel={billing.pullToRefresh} data={bills} keyExtractor={(bill) => bill.id} numColumns={isTablet ? 2 : 1} columnWrapperStyle={isTablet ? styles.tabletRow : undefined} renderItem={({ item }) => (<View style={isTablet ? styles.tabletItem : styles.phoneItem}>
              <BillListItem bill={item} onPress={() => handleBillPress(item)}/>
            </View>)} ListHeaderComponent={(<View style={styles.headerStack}>
              {summary ? (<BillSummaryCard summary={summary} onPayOutstanding={handlePayOutstanding} onPayInAdvance={() => navigation.navigate('AdvancePayment')} onViewBill={() => latestBill && handleBillPress(latestBill)} onLedger={() => navigation.navigate('FlatLedger', {})}/>) : null}
              <BillFilterTabs value={filter} onChange={setFilter}/>
            </View>)} ListEmptyComponent={(<View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={40} color={theme.textSecondary}/>
              <SafeText variant="title" style={createSafeTextColorStyle5(theme.textPrimary)}>{billing.noBillsFound}</SafeText>
              <SafeText variant="caption" align="center" style={createSafeTextColorStyle6(theme.textSecondary)}>{emptyDescription}</SafeText>
              {filter !== 'all' ? (<Pressable accessibilityRole="button" onPress={() => setFilter('all')} style={[styles.clearFilter, createPressableBorderColorStyle(theme.border)]}>
                  <SafeText variant="caption" style={createSafeTextColorStyle7(theme.accent)}>{billing.clearFilter}</SafeText>
                </Pressable>) : null}
            </View>)} ListFooterComponent={(<View style={styles.footer}>
              {isLoadingMore ? (<View style={styles.loadingMore} accessibilityLabel={messages.residentAccessibility.billing.loadMore}>
                  <ActivityIndicator size="small" color={theme.accent}/>
                  <SafeText variant="tiny" style={createSafeTextColorStyle8(theme.textSecondary)}>{billing.loadingMore}</SafeText>
                </View>) : bills.length > 0 && !hasMore ? (<SafeText variant="tiny" align="center" style={createSafeTextColorStyle9(theme.textSecondary)}>{billing.noMoreBills}</SafeText>) : null}
            </View>)} contentContainerStyle={[
            styles.listContent,
            createFlatListPaddingBottomPaddingHorizontalStyle(bottomPadding, screenPadding),
        ]} refreshing={isRefreshing} onRefresh={() => void refresh()} onEndReached={() => void loadMore()} onEndReachedThreshold={0.35} showsVerticalScrollIndicator={false}/>
      </ContentFrame>
    </View>);
}
export default BillListScreen;

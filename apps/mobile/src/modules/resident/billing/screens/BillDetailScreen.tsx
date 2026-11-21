import React, { useMemo } from "react";
import { ScrollView, View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { SafeText } from "../../../../shared/components/SafeText";
import { AppButton } from "../../../../shared/components/AppButton";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatBillingPeriod, formatDate } from "../../../../shared/formatters/dateFormatter";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { getResidentScreenBottomPadding } from "../../../../ui/layout/residentScreenSpacing";
import { ScreenErrorState } from "../../../../ui/states/ScreenErrorState";
import type { BillDetailFromHomeScreenProps, BillDetailScreenProps, RootTabParamList } from "../../../../app/navigation/navigation.types";
import { useBillDetail } from "../data/useBillDetail";
import { BillInvoiceHero } from "../components/BillInvoiceHero";
import { BillLineItemBreakdown } from "../components/BillLineItemBreakdown";
import { BillTotalSection } from "../components/BillTotalSection";
import { BillUsageCategoryCard } from "../components/BillUsageCategoryCard";
import { BillPaymentSummary } from "../components/BillPaymentSummary";
import { getBillStatusPresentation } from "../mappers/billingPresentation";
import Animated, { FadeInUp, FadeIn, useSharedValue, withTiming, withDelay, useAnimatedStyle } from "react-native-reanimated";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBackgroundColorStyle5, createViewBackgroundColorStyle6, createScrollViewPaddingBottomStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2 } from "../styles/screens/BillDetailScreen.styles";

type Props = BillDetailScreenProps | BillDetailFromHomeScreenProps;

function MetadataRow({ label, value, icon }: { label: string; value: string; icon?: keyof typeof Ionicons.glyphMap }) {
  const theme = useResidentTheme();
  return (
    <View style={styles.metadataRow}>
      {icon && <Ionicons name={icon} size={16} color={theme.textSecondary} style={{ marginRight: 8 }} />}
      <View style={{ flex: 1 }}>
        <SafeText variant="tiny" style={createSafeTextColorStyle(theme.textSecondary)}>{label}</SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)} numberOfLines={2}>{value}</SafeText>
      </View>
    </View>
  );
}

export function BillDetailScreen({ navigation, route }: Props) {
  const theme = useResidentTheme();
  const messages = useMessages();
  const focusCopy = messages.resident.experience.focus;
  const insets = useSafeAreaInsets();
  const billing = messages.resident.billing;
  const { bill: routeBill } = route.params;
  const { data: bill, isLoading, error, refetch } = useBillDetail(routeBill.id);
  const isPaid = bill?.status === 'PAID';
  const isOverdue = bill?.status === 'OVERDUE';
  const isPartial = bill?.status === 'PARTIALLY_PAID';
  
  const bottomPadding = getResidentScreenBottomPadding({
    safeAreaBottom: insets.bottom,
    hasBottomTabs: true,
    hasStickyFooter: false,
  });

  const handlePayNow = () => {
    if (!bill) return;
    if (route.name === 'BillDetail') {
      const billNavigation = navigation as BillDetailScreenProps['navigation'];
      billNavigation.navigate('MockPaymentConfirmation', { bill });
    } else {
      navigation.getParent<BottomTabNavigationProp<RootTabParamList>>()?.navigate('BillTab', {
        screen: 'MockPaymentConfirmation',
        params: { bill },
      });
    }
  };

  const handleViewLedger = () => {
    if (route.name === 'BillDetail') {
      const billNavigation = navigation as BillDetailScreenProps['navigation'];
      billNavigation.navigate('FlatLedger', {});
    } else {
      navigation.getParent<BottomTabNavigationProp<RootTabParamList>>()?.navigate('BillTab', {
        screen: 'FlatLedger',
        params: {},
      });
    }
  };

  const status = getBillStatusPresentation(bill?.status ?? 'DUE', messages);
  const statusColor = isPaid ? theme.success : isOverdue ? theme.danger : isPartial ? theme.warning : theme.accent;
  const outstandingAmount = Math.max(0, (bill?.amount ?? 0) - (bill?.paidAmount ?? 0));
  const paidPercentage = bill?.amount ? Math.min(100, Math.round(((bill.paidAmount ?? 0) / bill.amount) * 100)) : 0;

  const animatedProgress = useSharedValue(0);
  const animatedHeader = useSharedValue(0);

  React.useEffect(() => {
    animatedProgress.value = withDelay(300, withTiming(paidPercentage / 100, { duration: 800 }));
    animatedHeader.value = withTiming(1, { duration: 500 });
  }, [paidPercentage]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: animatedHeader.value,
    transform: [{ translateY: (1 - animatedHeader.value) * 20 }],
  }));

  if (isLoading && !bill) {
    return (
      <View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>
        <ResidentPageHeader title={billing.invoice.title} titleKey="resident.billing.invoice.title" />
        <ContentFrame style={styles.loadingStack}>
          <Animated.View entering={FadeInUp.delay(0).duration(400)} style={[styles.loadingHero, createViewBackgroundColorStyle2(theme.accentSoft)]} />
          <Animated.View entering={FadeInUp.delay(100).duration(400)} style={[styles.loadingCard, createViewBackgroundColorStyle3(theme.accentSoft)]} />
          <Animated.View entering={FadeInUp.delay(200).duration(400)} style={[styles.loadingCard, createViewBackgroundColorStyle4(theme.accentSoft)]} />
        </ContentFrame>
      </View>
    );
  }

  if (error || !bill) {
    return (
      <View style={[styles.root, createViewBackgroundColorStyle5(theme.background)]}>
        <ResidentPageHeader title={billing.invoice.title} titleKey="resident.billing.invoice.title" />
        <ScreenErrorState title={billing.errors.detailTitle} message={billing.errors.detailDescription} onRetry={() => void refetch()} />
      </View>
    );
  }

  const guidanceStep = bill.status === 'PAID'
    ? billing.guidance.paidStep
    : bill.status === 'OVERDUE'
      ? billing.guidance.overdueStep
      : bill.status === 'PARTIALLY_PAID'
        ? billing.guidance.partialStep
        : bill.status === 'CANCELLED'
          ? billing.guidance.cancelledStep
          : billing.guidance.unpaidStep;

  const canPay = bill.status === 'DUE' || bill.status === 'OVERDUE' || bill.status === 'PARTIALLY_PAID';
  const highlightedItems = bill.charges.filter((item) => item.amount > 0).slice(0, 4);

  return (
    <View style={[styles.root, createViewBackgroundColorStyle6(theme.background)]}>
      <ResidentPageHeader
        contextLabel={focusCopy.money}
        title={isPaid ? focusCopy.moneySettled : focusCopy.moneyOutstanding(formatCurrencyAmount(outstandingAmount, 'INR'))}
        subtitle={`${formatBillingPeriod(bill.billingPeriod)} · ${status.label}`}
        showBackButton
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, createScrollViewPaddingBottomStyle(bottomPadding)]}
        showsVerticalScrollIndicator={false}
      >
        <ContentFrame style={styles.contentStack}>
          {/* Status Progress Ring - Animated Header */}
          <Animated.View entering={FadeInUp.duration(500)}>
            <View style={styles.statusProgressContainer}>
              <Animated.View
                style={[
                  styles.statusProgressRing,
                  { borderColor: statusColor },
                ]}
                entering={FadeIn.delay(200).duration(600)}
              >
                <View style={styles.progressInner}>
                  <SafeText variant="display" style={{ color: statusColor, fontSize: 28, fontWeight: '800' }}>
                    {paidPercentage}%
                  </SafeText>
                  <SafeText variant="tiny" style={{ color: theme.textSecondary }}>
                    {isPaid ? 'Settled' : 'Paid'}
                  </SafeText>
                </View>
              </Animated.View>
              
              <View style={styles.statusBadges}>
                <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15`, borderColor: statusColor }]}>
                  <Ionicons name={isPaid ? 'checkmark-circle' : isOverdue ? 'alert-circle' : isPartial ? 'time' : 'document-text'} size={16} color={statusColor} />
                  <SafeText variant="tiny" style={{ color: statusColor, fontWeight: '700', marginLeft: 4 }}>{status.label}</SafeText>
                </View>
                {!isPaid && outstandingAmount > 0 && (
                  <View style={[styles.amountBadge, { backgroundColor: statusColor }]}>
                    <SafeText variant="caption" style={{ color: theme.textInverse, fontWeight: '700' }}>
                      ₹{outstandingAmount.toLocaleString('en-IN')}
                    </SafeText>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Invoice Hero */}
          <Animated.View entering={FadeInUp.delay(100).duration(400)}>
            <BillInvoiceHero bill={bill} />
          </Animated.View>

          {/* Quick Metadata */}
          <Animated.View entering={FadeInUp.delay(150).duration(400)} style={[styles.metadataCard, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <MetadataRow label={billing.invoice.number} value={bill.billNumber} icon="pricetag-outline" />
            <MetadataRow label={billing.invoice.billingPeriod} value={formatBillingPeriod(bill.billingPeriod)} icon="calendar-outline" />
            <MetadataRow label={billing.invoice.dueDate} value={formatDate(bill.dueDate)} icon={isOverdue ? 'alert-circle-outline' : 'time-outline'} />
            <MetadataRow label={billing.guidance.status} value={status.label} icon={isPaid ? 'checkmark-circle-outline' : isOverdue ? 'alert-circle-outline' : 'hourglass-outline'} />
          </Animated.View>

          {/* Usage Breakdown */}
          <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.section}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{billing.invoice.usageBreakdown}</SafeText>
            <View style={styles.usageGrid}>
              {highlightedItems.map((item) => <BillUsageCategoryCard key={item.lineItemId} item={item} />)}
            </View>
          </Animated.View>

          {/* Line Items */}
          <Animated.View entering={FadeInUp.delay(250).duration(400)}>
            <BillLineItemBreakdown items={bill.charges} />
          </Animated.View>

          {/* Totals */}
          <Animated.View entering={FadeInUp.delay(300).duration(400)}>
            <BillTotalSection bill={bill} />
          </Animated.View>

          {/* Payment History */}
          <Animated.View entering={FadeInUp.delay(350).duration(400)}>
            <BillPaymentSummary bill={bill} />
          </Animated.View>

          {/* Guidance Card */}
          <View style={[styles.guidanceCard, createViewBackgroundColorBorderColorStyle2(theme.accentSoft, theme.border)]}>
            <View style={styles.guidanceContent}>
              <View style={styles.guidanceHeaderRow}>
                <View style={[styles.guidanceIcon, { backgroundColor: statusColor + "15" }]}>
                  <Ionicons name={isPaid ? 'checkmark-circle' : isOverdue ? 'alert-circle' : 'information-circle'} size={20} color={statusColor} />
                </View>
                <SafeText variant="bodyStrong" style={[createSafeTextColorStyle4(theme.textPrimary), { flex: 1 }]}>{billing.guidance.title}</SafeText>
              </View>
              <View style={styles.guidanceRows}>
                <MetadataRow label={billing.guidance.status} value={status.label} icon="information-circle-outline" />
                <MetadataRow label={billing.guidance.nextStep} value={guidanceStep} icon="arrow-forward-outline" />
                <MetadataRow label={billing.guidance.deadline} value={canPay ? formatDate(bill.dueDate) : billing.guidance.noDeadline} icon="calendar-outline" />
                <MetadataRow label={billing.guidance.responsiblePerson} value={isPaid ? billing.guidance.self : billing.guidance.resident} icon="person-outline" />
              </View>
            </View>
          </View>

          {/* Actions */}
          <Animated.View entering={FadeInUp.delay(450).duration(400)} style={styles.actions}>
            {canPay ? (
              <AppButton
                title={bill.status === 'PARTIALLY_PAID' ? billing.actions.payBalance : billing.actions.payNow}
                accessibilityLabel={messages.residentAccessibility.billing.payNow}
                onPress={handlePayNow}
                iconLeft={<Ionicons name="card-outline" size={18} color={theme.selectedForeground} />}
                style={styles.primaryAction}
              />
            ) : null}
            <AppButton
              title={billing.actions.ledger}
              accessibilityLabel={messages.residentAccessibility.billing.ledger}
              variant="secondary"
              onPress={handleViewLedger}
              iconLeft={<Ionicons name="document-text-outline" size={18} color={theme.accent} />}
              style={styles.secondaryAction}
            />
          </Animated.View>
        </ContentFrame>
      </ScrollView>
    </View>
  );
}

export default BillDetailScreen;

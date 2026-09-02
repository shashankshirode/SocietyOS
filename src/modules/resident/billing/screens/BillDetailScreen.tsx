import { ScrollView, View } from "react-native";
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
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBackgroundColorStyle5, createViewBackgroundColorStyle6, createScrollViewPaddingBottomStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle2 } from "../styles/screens/BillDetailScreen.styles";
type Props = BillDetailScreenProps | BillDetailFromHomeScreenProps;
function MetadataRow({ label, value }: {
    label: string;
    value: string;
}) {
    const theme = useResidentTheme();
    return (<View style={styles.metadataRow}>
      <SafeText variant="tiny" style={createSafeTextColorStyle(theme.textSecondary)}>{label}</SafeText>
      <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)}>{value}</SafeText>
    </View>);
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
    const bottomPadding = getResidentScreenBottomPadding({
        safeAreaBottom: insets.bottom,
        hasBottomTabs: true,
        hasStickyFooter: false,
    });
    const handlePayNow = () => {
        if (!bill)
            return;
        if (route.name === 'BillDetail') {
            const billNavigation = navigation as BillDetailScreenProps['navigation'];
            billNavigation.navigate('MockPaymentConfirmation', { bill });
        }
        else {
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
        }
        else {
            navigation.getParent<BottomTabNavigationProp<RootTabParamList>>()?.navigate('BillTab', {
                screen: 'FlatLedger',
                params: {},
            });
        }
    };
    if (isLoading && !bill) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}> 
        <ResidentPageHeader title={billing.invoice.title} titleKey="resident.billing.invoice.title"/>
        <ContentFrame style={styles.loadingStack}>
          <View style={[styles.loadingHero, createViewBackgroundColorStyle2(theme.accentSoft)]}/>
          <View style={[styles.loadingCard, createViewBackgroundColorStyle3(theme.accentSoft)]}/>
          <View style={[styles.loadingCard, createViewBackgroundColorStyle4(theme.accentSoft)]}/>
        </ContentFrame>
      </View>);
    }
    if (error || !bill) {
        return (<View style={[styles.root, createViewBackgroundColorStyle5(theme.background)]}> 
        <ResidentPageHeader title={billing.invoice.title} titleKey="resident.billing.invoice.title"/>
        <ScreenErrorState title={billing.errors.detailTitle} message={billing.errors.detailDescription} onRetry={() => void refetch()}/>
      </View>);
    }
    const status = getBillStatusPresentation(bill.status, messages);
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
    return (<View style={[styles.root, createViewBackgroundColorStyle6(theme.background)]}> 
      <ResidentPageHeader
        contextLabel={focusCopy.money}
        title={isPaid ? focusCopy.moneySettled : focusCopy.moneyOutstanding(formatCurrencyAmount(Math.max(0, bill.amount - (bill.paidAmount ?? 0)), 'INR'))}
        subtitle={`${formatBillingPeriod(bill.billingPeriod)} · ${status.label}`}
      />
      <ScrollView contentContainerStyle={[styles.scrollContent, createScrollViewPaddingBottomStyle(bottomPadding)]} showsVerticalScrollIndicator={false}>
        <ContentFrame style={styles.contentStack}>
          <BillInvoiceHero bill={bill}/>

          {!isPaid ? (<View style={[styles.metadataCard, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}> 
              <MetadataRow label={billing.invoice.number} value={bill.billNumber}/>
              <MetadataRow label={billing.invoice.billingPeriod} value={formatBillingPeriod(bill.billingPeriod)}/>
              <MetadataRow label={billing.invoice.dueDate} value={formatDate(bill.dueDate)}/>
              <MetadataRow label={billing.guidance.status} value={status.label}/>
            </View>) : null}

          <View style={styles.section}>
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>{billing.invoice.usageBreakdown}</SafeText>
            <View style={styles.usageGrid}>
              {highlightedItems.map((item) => <BillUsageCategoryCard key={item.lineItemId} item={item}/>)}
            </View>
          </View>

          <BillLineItemBreakdown items={bill.charges}/>
          <BillTotalSection bill={bill}/>
          <BillPaymentSummary bill={bill}/>

          <View style={[styles.guidanceCard, createViewBackgroundColorBorderColorStyle2(theme.accentSoft, theme.border)]}> 
            <SafeText variant="bodyStrong" style={createSafeTextColorStyle4(theme.textPrimary)}>{billing.guidance.title}</SafeText>
            <MetadataRow label={billing.guidance.status} value={status.label}/>
            <MetadataRow label={billing.guidance.nextStep} value={guidanceStep}/>
            <MetadataRow label={billing.guidance.deadline} value={canPay ? formatDate(bill.dueDate) : billing.guidance.noDeadline}/>
            <MetadataRow label={billing.guidance.responsiblePerson} value={isPaid ? billing.guidance.self : billing.guidance.resident}/>
          </View>

          <View style={styles.actions}>
            {canPay ? (<AppButton title={bill.status === 'PARTIALLY_PAID' ? billing.actions.payBalance : billing.actions.payNow} accessibilityLabel={messages.residentAccessibility.billing.payNow} onPress={handlePayNow} iconLeft={<Ionicons name="card-outline" size={18} color={theme.selectedForeground}/>}/>) : null}
            <AppButton title={billing.actions.ledger} accessibilityLabel={messages.residentAccessibility.billing.ledger} variant="secondary" onPress={handleViewLedger} iconLeft={<Ionicons name="document-text-outline" size={18} color={theme.accent}/>}/>
          </View>
        </ContentFrame>
      </ScrollView>
    </View>);
}
export default BillDetailScreen;

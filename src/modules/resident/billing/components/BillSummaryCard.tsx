import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { formatBillingPeriod } from "../../../../shared/formatters/dateFormatter";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import type { ResidentBillingSummary } from "../data/residentBilling.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createSafeTextColorStyle5, createPressableBackgroundColorStyle, createPressableBorderColorStyle, createViewBackgroundColorStyle3, createSafeTextColorStyle6 } from "../styles/components/BillSummaryCard.styles";
export type BillSummaryCardProps = {
    summary: ResidentBillingSummary;
    onPayOutstanding: () => void;
    onPayInAdvance: () => void;
    onViewBill: () => void;
    onLedger: () => void;
};
export function BillSummaryCard({ summary, onPayOutstanding, onPayInAdvance, onViewBill, onLedger }: BillSummaryCardProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const billing = messages.resident.billing;
    const latestBill = summary.latestBill;
    const hasOutstanding = summary.totalOutstanding > 0;
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surfaceRaised, theme.border)]}> 
      <View style={[styles.orb, createViewBackgroundColorStyle(theme.accentSoft)]}/>
      <View style={styles.header}>
        <View style={[styles.icon, createViewBackgroundColorStyle2(theme.accentSoft)]}>
          <Ionicons name="wallet-outline" size={22} color={theme.accent}/>
        </View>
        <View style={styles.headerText}>
          <SafeText variant="tiny" style={createSafeTextColorStyle(theme.textSecondary)}>
            {billing.totalOutstanding}
          </SafeText>
          <SafeText variant="display" style={[styles.amount, createSafeTextColorStyle5(theme.textPrimary)]}>
            {formatCurrencyAmount(summary.totalOutstanding, summary.currencyCode)}
          </SafeText>
        </View>
      </View>
      
      {summary.advanceBalance !== undefined && summary.advanceBalance > 0 ? (<View style={createViewBackgroundColorStyle3(theme.successSoft)}>
          <Ionicons name="shield-checkmark-outline" size={14} color={theme.success}/>
          <SafeText variant="tiny" style={createSafeTextColorStyle6(theme.success)}>
            {billing.availableAdvanceBalance}: {formatCurrencyAmount(summary.advanceBalance, summary.currencyCode)}
          </SafeText>
        </View>) : null}

      <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>
        {latestBill
            ? `${formatBillingPeriod(latestBill.billingPeriod)} · ${billing.pendingBills(summary.pendingBillCount)}`
            : billing.noDuesPending}
      </SafeText>
      
      <View style={styles.actions}>
        {hasOutstanding ? (<Pressable onPress={onPayOutstanding} accessibilityRole="button" accessibilityLabel={messages.residentAccessibility.billing.payNow} style={[styles.primaryAction, createPressableBackgroundColorStyle(theme.accent)]}>
            <Ionicons name="card-outline" size={16} color="#FFFFFF"/>
            <SafeText variant="caption" style={styles.primaryLabel}>{billing.payOutstanding}</SafeText>
          </Pressable>) : null}
        
        <Pressable onPress={onPayInAdvance} accessibilityRole="button" style={[styles.secondaryAction, createPressableBorderColorStyle(theme.border), styles.pressableFlexDirectionAlignItemsGap]}>
            <Ionicons name="arrow-forward-circle-outline" size={16} color={theme.accent}/>
            <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textPrimary)}>{billing.payInAdvance}</SafeText>
          </Pressable>

        <Pressable onPress={onLedger} accessibilityRole="button" style={styles.ledgerAction}>
          <SafeText variant="caption" style={createSafeTextColorStyle4(theme.accent)}>
            {billing.actions.ledger}
          </SafeText>
        </Pressable>
      </View>
    </View>);
}
export default BillSummaryCard;


import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { StatusPill, type StatusTone } from "../components/StatusPill";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { WrapRow } from "../layout/WrapRow";
import type { MaintenancePaymentData, BillStatus } from "../../modules/resident/dashboard/data/dashboard.types";
import { useMessages } from "../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../shared/formatters/currencyFormatter";
import { formatDate } from "../../shared/formatters/dateFormatter";
import { DashboardSectionHeader } from "../components/SectionHeader";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBorderTopColorStyle, createPressableBackgroundColorStyle, createSafeTextColorStyle6, createPressableBorderColorStyle } from "./styles/MaintenancePaymentWallet.styles";
export interface MaintenancePaymentWalletProps extends MaintenancePaymentData {
    onPayNowPress: () => void;
    onBillPress: () => void;
    onLedgerPress: () => void;
    sectionTitle?: string;
    sectionSubtitle?: string;
}
export function MaintenancePaymentWallet({ billingMonth, billAmount, dueInDays, status, chargeTags, lastPaidAmount, lastPaidDate, pendingBillsCount, dueDateLabel, totalOutstanding, paidAmount, onPayNowPress, onBillPress, onLedgerPress, sectionTitle, sectionSubtitle, }: MaintenancePaymentWalletProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const billing = messages.resident.billing;
    const statusConfig: Record<BillStatus, {
        label: string;
        tone: StatusTone;
    }> = {
        paid: { label: billing.paid, tone: 'success' },
        unpaid: { label: billing.unpaid, tone: 'warning' },
        overdue: { label: billing.overdue, tone: 'danger' },
        partial: { label: billing.partial, tone: 'info' },
        processing: { label: billing.processing, tone: 'info' }
    };
    const config = statusConfig[status];
    const displayedOutstanding = totalOutstanding ?? billAmount;
    const formattedBillAmount = formatCurrencyAmount(displayedOutstanding);
    const currencySymbol = formattedBillAmount.startsWith('₹') ? '₹' : '';
    const displayAmount = currencySymbol ? formattedBillAmount.slice(currencySymbol.length) : formattedBillAmount;
    const isPaid = status === 'paid';
    const isProcessing = status === 'processing';
    const isOverdue = status === 'overdue';
    const accentColor = isOverdue ? colors.danger : colors.primary;
    return (<View style={styles.wrapper}>
      {sectionTitle ? (<DashboardSectionHeader title={sectionTitle} {...includeWhenPresent("subtitle", sectionSubtitle)} style={styles.sectionHeader}/>) : null}
      <PressableScale onPress={onBillPress}>
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
          
          <View style={[styles.pattern, createViewBackgroundColorStyle(colors.primarySoft)]}/>

          
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.walletIcon, createViewBackgroundColorStyle2(colors.primarySoft)]}> 
                <Ionicons name="wallet-outline" size={20} color={accentColor}/>
              </View>
              <View>
                <SafeText variant="caption" color="muted">{billingMonth}</SafeText>
                <SafeText variant="tiny" color="muted">{billing.totalOutstanding}</SafeText>
              </View>
            </View>
            <StatusPill label={config.label} tone={config.tone}/>
          </View>

          
          <View style={styles.amountRow}>
            {currencySymbol ? <SafeText variant="tiny" color="muted" style={styles.currencySymbol}>{currencySymbol}</SafeText> : null}
            <SafeText variant="display" color="primary" style={styles.amount}>
              {displayAmount}
            </SafeText>
            {!isPaid && (<View style={styles.viewMarginLeftAlignSelf}>
                <SafeText variant="tiny" style={createSafeTextColorStyle(isOverdue ? colors.danger : colors.warning)}>
                  {isOverdue
                ? billing.overdue
                : dueDateLabel
                    ? `${billing.dueDatePrefix} ${dueDateLabel}`
                    : billing.dueInDays(dueInDays)}
                </SafeText>
                {pendingBillsCount && pendingBillsCount > 1 ? (<Pressable onPress={onBillPress} accessibilityRole="button" style={styles.moreBillsButton}>
                    <SafeText variant="tiny" style={createSafeTextColorStyle2(colors.primary)}>
                      {billing.pendingAdditional(pendingBillsCount - 1)}
                    </SafeText>
                  </Pressable>) : null}
              </View>)}
          </View>

          {status === 'partial' && paidAmount != null ? (<View style={[styles.partialRow, createViewBackgroundColorStyle3(colors.infoSoft)]}> 
              <SafeText variant="tiny" style={createSafeTextColorStyle3(colors.info)}>
                {billing.invoice.amountPaid}: {formatCurrencyAmount(paidAmount)}
              </SafeText>
            </View>) : null}

          
          <WrapRow gap={6} style={styles.tags}>
            {chargeTags.map((tag) => (<View key={tag} style={[styles.tag, createViewBackgroundColorStyle4(colors.surfaceMuted)]}> 
                <SafeText variant="tiny" color="muted" style={styles.safeTextFontSize}>{tag}</SafeText>
              </View>))}
          </WrapRow>

          
          {lastPaidAmount != null && lastPaidDate && (<View style={[styles.lastPaidRow, createViewBorderTopColorStyle(colors.border)]}> 
              <Ionicons name="checkmark-circle" size={14} color={colors.success}/>
              <SafeText variant="tiny" color="muted">
                {billing.lastPaidPrefix} {formatCurrencyAmount(lastPaidAmount)} · {formatDate(lastPaidDate)}
              </SafeText>
            </View>)}

          
          <View style={styles.actions}>
            {!isPaid && !isProcessing && (<Pressable onPress={onPayNowPress} style={[styles.payBtn, createPressableBackgroundColorStyle(accentColor)]}>
                <Ionicons name="card-outline" size={16} color={colors.textInverse}/>
                <SafeText variant="caption" style={[styles.payBtnText, createSafeTextColorStyle6(colors.textInverse)]}>{billing.actions.payNow}</SafeText>
              </Pressable>)}
            <Pressable onPress={onBillPress} style={[styles.secondaryBtn, createPressableBorderColorStyle(colors.border)]}> 
              <SafeText variant="caption" style={createSafeTextColorStyle4(colors.textSecondary)}>{billing.actions.viewBill}</SafeText>
            </Pressable>
            <Pressable onPress={onLedgerPress} hitSlop={8}>
              <SafeText variant="caption" style={createSafeTextColorStyle5(colors.primary)}>{billing.actions.ledger}</SafeText>
            </Pressable>
          </View>
        </View>
      </PressableScale>
    </View>);
}


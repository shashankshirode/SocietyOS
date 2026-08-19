import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { formatBillingPeriod, formatDate } from "../../../../shared/formatters/dateFormatter";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import type { Bill } from "../../../../shared/types/bill.types";
import { BillingVisualBadge } from "./BillingVisualBadge";
import { getBillStatusPresentation, getPrimaryBillLineItemType } from "../mappers/billingPresentation";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorBorderColorStyle } from "../styles/components/BillListItem.styles";
export type BillListItemProps = {
    bill: Bill;
    onPress: () => void;
};
export function BillListItem({ bill, onPress }: BillListItemProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const status = getBillStatusPresentation(bill.status, messages);
    const currencyCode = bill.charges[0]?.currencyCode ?? 'INR';
    return (<PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={`${messages.residentAccessibility.billing.billCard}: ${bill.title}`} style={styles.pressable}>
      <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}> 
        <BillingVisualBadge type={getPrimaryBillLineItemType(bill)} isPaid={bill.status === 'PAID'}/>
        <View style={styles.info}>
          <SafeText variant="caption" style={createSafeTextColorStyle(theme.textPrimary)} numberOfLines={2}>
            {bill.title}
          </SafeText>
          <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.textSecondary)}>
            {formatBillingPeriod(bill.billingPeriod)} · {messages.resident.billing.dueDatePrefix} {formatDate(bill.dueDate)}
          </SafeText>
        </View>
        <View style={styles.amountColumn}>
          <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textPrimary)}>
            {formatCurrencyAmount(bill.amount, currencyCode)}
          </SafeText>
          <StatusPill label={status.label} tone={status.tone} small/>
        </View>
      </View>
    </PressableScale>);
}


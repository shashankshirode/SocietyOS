import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { formatBillingPeriod, formatDate } from "../../../../shared/formatters/dateFormatter";
import { StatusPill } from "../../../../ui/components/StatusPill";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import type { Bill } from "../../../../shared/types/bill.types";
import { BillingVisualBadge } from "./BillingVisualBadge";
import { getBillOutstandingAmount, getBillStatusPresentation, getPrimaryBillLineItemType } from "../mappers/billingPresentation";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle5 } from "../styles/components/BillInvoiceHero.styles";
export function BillInvoiceHero({ bill }: {
    bill: Bill;
}) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const billing = messages.resident.billing;
    const status = getBillStatusPresentation(bill.status, messages);
    const currency = bill.charges[0]?.currencyCode ?? 'INR';
    const amount = bill.status === 'PAID' ? bill.paidAmount ?? bill.amount : getBillOutstandingAmount(bill);
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surfaceRaised, theme.border)]}> 
      <View style={styles.topRow}>
        <BillingVisualBadge type={getPrimaryBillLineItemType(bill)} isPaid={bill.status === 'PAID'} size={58}/>
        <View style={styles.titleBlock}>
          <SafeText variant="title" style={createSafeTextColorStyle(theme.textPrimary)} numberOfLines={2}>{bill.title}</SafeText>
          <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.textSecondary)}>
            {formatBillingPeriod(bill.billingPeriod)}
          </SafeText>
        </View>
        <StatusPill label={status.label} tone={status.tone}/>
      </View>
      <View style={styles.amountBlock}>
        <SafeText variant="tiny" style={createSafeTextColorStyle3(theme.textSecondary)}>
          {bill.status === 'PAID' ? billing.receipt.amountPaid : billing.invoice.totalOutstanding}
        </SafeText>
        <SafeText variant="display" style={[styles.amount, createSafeTextColorStyle5(theme.textPrimary)]}>
          {formatCurrencyAmount(amount, currency)}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle4(theme.textSecondary)}>
          {billing.invoice.dueDate}: {formatDate(bill.dueDate)}
        </SafeText>
      </View>
    </View>);
}


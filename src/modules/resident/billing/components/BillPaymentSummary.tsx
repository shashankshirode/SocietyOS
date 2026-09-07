import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { formatDate } from "../../../../shared/formatters/dateFormatter";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import type { Bill } from "../../../../shared/types/bill.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle } from "../styles/components/BillPaymentSummary.styles";
function DetailRow({ label, value }: {
    label: string;
    value: string;
}) {
    const theme = useResidentTheme();
    return (<View style={styles.row}>
      <SafeText variant="tiny" style={createSafeTextColorStyle(theme.textSecondary)}>{label}</SafeText>
      <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)}>{value}</SafeText>
    </View>);
}
export function BillPaymentSummary({ bill }: {
    bill: Bill;
}) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const billing = messages.resident.billing;
    const payments = bill.payments;
    const payment = payments && payments.length > 0 ? payments[payments.length - 1] : undefined;
    if (!payment)
        return null;
    const currency = bill.charges[0]?.currencyCode ?? 'INR';
    const isPaid = bill.status === 'PAID';
    const paymentMethod = payment.paymentMethod === 'UPI'
        ? billing.paymentMethodUPI
        : payment.paymentMethod === 'CARD'
            ? billing.paymentMethodCard
            : payment.paymentMethod === 'NET_BANKING'
                ? billing.paymentMethodNetBanking
                : billing.paymentMethodCashCheque;
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}> 
      <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)}>
        {isPaid ? billing.receipt.title : billing.paymentHistory.title}
      </SafeText>
      <DetailRow label={billing.receipt.number} value={payment.receiptNumber}/>
      <DetailRow label={billing.receipt.amountPaid} value={formatCurrencyAmount(payment.amountPaid, currency)}/>
      <DetailRow label={billing.receipt.transactionDate} value={formatDate(payment.paymentDate)}/>
      <DetailRow label={billing.receipt.paymentMode} value={paymentMethod}/>
      <DetailRow label={billing.receipt.transactionId} value={payment.transactionId}/>
      {isPaid ? (<SafeText variant="tiny" style={createSafeTextColorStyle4(theme.textSecondary)}>
          {billing.receipt.digitalSignatureNote}
        </SafeText>) : null}
    </View>);
}


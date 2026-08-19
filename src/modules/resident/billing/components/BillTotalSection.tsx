import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import type { Bill, BillLineItem } from "../../../../shared/types/bill.types";
import { getBillOutstandingAmount } from "../mappers/billingPresentation";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/BillTotalSection.styles";
export type CalculatedBillTotals = {
    subtotal: number;
    penalties: number;
    adjustments: number;
    calculatedTotal: number;
    sourceTotal: number;
    matchesSource: boolean;
};
export function calculateBillTotals(items: readonly BillLineItem[], sourceTotal: number): CalculatedBillTotals {
    const penalties = items
        .filter((item) => item.type === 'penalty' || item.type === 'lateFee')
        .reduce((total, item) => total + item.amount, 0);
    const adjustments = items
        .filter((item) => item.type === 'adjustment')
        .reduce((total, item) => total + item.amount, 0);
    const subtotal = items
        .filter((item) => item.type !== 'penalty' && item.type !== 'lateFee' && item.type !== 'adjustment')
        .reduce((total, item) => total + item.amount, 0);
    const calculatedTotal = subtotal + penalties + adjustments;
    return {
        subtotal,
        penalties,
        adjustments,
        calculatedTotal,
        sourceTotal,
        matchesSource: Math.abs(calculatedTotal - sourceTotal) < 0.01,
    };
}
function TotalRow({ label, value, strong = false }: {
    label: string;
    value: string;
    strong?: boolean;
}) {
    const theme = useResidentTheme();
    return (<View style={styles.row}>
      <SafeText variant={strong ? 'bodyStrong' : 'caption'} style={createSafeTextColorStyle(strong ? theme.textPrimary : theme.textSecondary)}>{label}</SafeText>
      <SafeText variant={strong ? 'bodyStrong' : 'caption'} style={createSafeTextColorStyle2(theme.textPrimary)}>{value}</SafeText>
    </View>);
}
export function BillTotalSection({ bill }: {
    bill: Bill;
}) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const invoice = messages.resident.billing.invoice;
    const currency = bill.charges[0]?.currencyCode ?? 'INR';
    const totals = calculateBillTotals(bill.charges, bill.amount);
    const paidAmount = bill.paidAmount ?? 0;
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}> 
      <TotalRow label={invoice.subtotal} value={formatCurrencyAmount(totals.subtotal, currency)}/>
      {totals.penalties !== 0 ? <TotalRow label={invoice.penalties} value={formatCurrencyAmount(totals.penalties, currency)}/> : null}
      {totals.adjustments !== 0 ? <TotalRow label={invoice.adjustments} value={formatCurrencyAmount(totals.adjustments, currency)}/> : null}
      <View style={[styles.divider, createViewBackgroundColorStyle(theme.border)]}/>
      <TotalRow label={invoice.totalBill} value={formatCurrencyAmount(totals.sourceTotal, currency)} strong/>
      {paidAmount > 0 ? (<TotalRow label={invoice.amountPaid} value={formatCurrencyAmount(paidAmount, currency)}/>) : null}
      <TotalRow label={invoice.outstandingAmount} value={formatCurrencyAmount(getBillOutstandingAmount(bill), currency)} strong/>
    </View>);
}


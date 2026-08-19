import { ScrollView, View } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ReceiptPanel } from "../../../../ui/patterns/ReceiptPanel";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/ReceiptDetailScreen.styles";
type ReceiptDetailRouteParams = {
    receiptNumber?: string;
    billingMonth?: string;
    amountPaid?: number;
    paymentDate?: string;
    paymentMethod?: string;
    transactionId?: string;
};
type ReceiptDetailScreenProps = {
    route?: {
        params?: ReceiptDetailRouteParams;
    };
};
export function ReceiptDetailScreen({ route }: ReceiptDetailScreenProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const billing = messages.resident.billing;
    const { receiptNumber = '—', billingMonth = billing.currentPeriod, amountPaid = 0, paymentDate = '—', paymentMethod = billing.paymentMethodUPI, transactionId = '—', } = route?.params ?? {};
    const charges = [
        { label: billing.lineItem.maintenance, amount: 3500 },
        { label: billing.lineItem.sinkingFund, amount: 800 },
        { label: billing.lineItem.water, amount: 550 },
    ];
    return (<View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}> 
      <ResidentPageHeader title={billing.receipt.invoiceTitle} titleKey="resident.billing.receipt.invoiceTitle"/>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ReceiptPanel receiptNumber={receiptNumber} billingMonth={billingMonth} amountPaid={amountPaid} paymentDate={paymentDate} paymentMethod={paymentMethod} transactionId={transactionId} status="SUCCESS" items={charges.map((charge) => ({ label: charge.label, value: formatCurrencyAmount(charge.amount) }))}/>
        <View style={styles.disclaimer}>
          <SafeText variant="tiny" color="muted" align="center">{billing.receipt.disclaimer}</SafeText>
        </View>
      </ScrollView>
    </View>);
}
export default ReceiptDetailScreen;


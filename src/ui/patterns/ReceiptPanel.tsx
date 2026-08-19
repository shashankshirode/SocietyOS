import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { StatusPill } from "../components/StatusPill";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBorderBottomColorStyle, createViewBackgroundColorStyle2 } from "./styles/ReceiptPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
export interface ReceiptItem {
    label: string;
    value: string;
}
export interface ReceiptPanelProps {
    receiptNumber: string;
    billingMonth: string;
    amountPaid: number;
    paymentDate: string;
    paymentMethod: string;
    transactionId: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    items?: ReceiptItem[];
}
export function ReceiptPanel({ receiptNumber, billingMonth, amountPaid, paymentDate, paymentMethod, transactionId, status, items = [], }: ReceiptPanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const theme = useResidentTheme();
    const isSuccess = status === 'SUCCESS';
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
      
      <View style={[styles.indicator, createViewBackgroundColorStyle(isSuccess ? theme.success : theme.danger)]}/>

      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>{localizedUiText.m_7e677ab8c7f3}</SafeText>
          <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.textSecondary)}>
            {receiptNumber}
          </SafeText>
        </View>
        <StatusPill label={status} tone={isSuccess ? 'success' : 'danger'}/>
      </View>

      
      <View style={[styles.amountContainer, createViewBorderBottomColorStyle(theme.border)]}>
        <SafeText variant="tiny" color="muted">{localizedUiText.m_ef0296095c96}</SafeText>
        <SafeText variant="display" color="primary" style={styles.amount}>
          ₹{amountPaid.toLocaleString('en-IN')}
        </SafeText>
        <SafeText variant="caption" color="secondary" style={styles.safeTextFontWeight}>{localizedUiText.m_6c20a35c1884}{billingMonth}
        </SafeText>
      </View>

      
      <View style={styles.fields}>
        <View style={styles.fieldRow}>
          <SafeText variant="caption" color="muted">{localizedUiText.m_b3cf57b85296}</SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textPrimary)}>{paymentDate}</SafeText>
        </View>

        <View style={styles.fieldRow}>
          <SafeText variant="caption" color="muted">{localizedUiText.m_f14417611f08}</SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle4(theme.textPrimary)}>{paymentMethod}</SafeText>
        </View>

        <View style={styles.fieldRow}>
          <SafeText variant="caption" color="muted">{localizedUiText.m_be8c62270423}</SafeText>
          <SafeText variant="caption" style={createSafeTextColorStyle5(theme.textPrimary)}>{transactionId}</SafeText>
        </View>

        {items.map((item, idx) => (<View key={idx} style={styles.fieldRow}>
            <SafeText variant="caption" color="muted">{item.label}</SafeText>
            <SafeText variant="caption" style={createSafeTextColorStyle6(theme.textPrimary)}>{item.value}</SafeText>
          </View>))}
      </View>

      
      <View style={[styles.footer, createViewBackgroundColorStyle2(theme.background)]}>
        <Ionicons name="shield-checkmark-outline" size={16} color={theme.success}/>
        <SafeText variant="tiny" style={createSafeTextColorStyle7(theme.textSecondary)}>{localizedUiText.m_5e400c9efed4}</SafeText>
      </View>
    </View>);
}
export default ReceiptPanel;


import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import type { BillLineItem } from "../../../../shared/types/bill.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBorderBottomColorStyle } from "../styles/components/BillLineItemRow.styles";
export function BillLineItemRow({ item }: {
    item: BillLineItem;
}) {
    const theme = useResidentTheme();
    const messages = useMessages();
    return (<View style={[styles.row, createViewBorderBottomColorStyle(theme.border)]}> 
      <SafeText variant="caption" style={createSafeTextColorStyle(theme.textSecondary)}>
        {t(messages, item.labelMessageKey)}
      </SafeText>
      <SafeText variant="caption" style={createSafeTextColorStyle2(item.isCredit ? theme.success : theme.textPrimary)}>
        {formatCurrencyAmount(item.amount, item.currencyCode)}
      </SafeText>
    </View>);
}


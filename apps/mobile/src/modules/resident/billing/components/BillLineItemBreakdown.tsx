import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import type { BillLineItem } from "../../../../shared/types/bill.types";
import { BillLineItemRow } from "./BillLineItemRow";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle } from "../styles/components/BillLineItemBreakdown.styles";
export function BillLineItemBreakdown({ items }: {
    items: readonly BillLineItem[];
}) {
    const theme = useResidentTheme();
    const messages = useMessages();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}> 
      <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
        {messages.resident.billing.invoice.lineItemBreakdown}
      </SafeText>
      <View>{items.map((item) => <BillLineItemRow key={item.lineItemId} item={item}/>)}</View>
    </View>);
}


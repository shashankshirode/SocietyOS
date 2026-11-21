import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import { formatCurrencyAmount } from "../../../../shared/formatters/currencyFormatter";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import type { BillLineItem } from "../../../../shared/types/bill.types";
import { BillingVisualBadge } from "./BillingVisualBadge";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorBorderColorStyle } from "../styles/components/BillUsageCategoryCard.styles";
export function BillUsageCategoryCard({ item }: {
    item: BillLineItem;
}) {
    const theme = useResidentTheme();
    const messages = useMessages();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}> 
      <BillingVisualBadge type={item.type} size={40}/>
      <View style={styles.text}>
        <SafeText variant="tiny" style={createSafeTextColorStyle(theme.textSecondary)} numberOfLines={1}>
          {t(messages, item.labelMessageKey)}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textPrimary)}>
          {formatCurrencyAmount(item.amount, item.currencyCode)}
        </SafeText>
      </View>
    </View>);
}


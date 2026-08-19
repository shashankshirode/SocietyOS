import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMessages } from "../../../../shared/constants/useMessages";
import type { BillLineItemType } from "../../../../shared/types/bill.types";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { t } from "../../household/components/householdComponentUtils";
import { getBillingVisual, getBillingVisualId, type BillingVisualTone } from "../media/billingImageRegistry";
import { styles, createViewWidthHeightBorderRadiusBackgroundColorStyle } from "../styles/components/BillingVisualBadge.styles";
export type BillingVisualBadgeProps = {
    type: BillLineItemType;
    isPaid?: boolean;
    size?: number;
};
export function BillingVisualBadge({ type, isPaid = false, size = 44 }: BillingVisualBadgeProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const visual = getBillingVisual(getBillingVisualId(type, isPaid));
    const colors: Record<BillingVisualTone, {
        foreground: string;
        background: string;
    }> = {
        accent: { foreground: theme.accent, background: theme.accentSoft },
        success: { foreground: theme.success, background: theme.successSoft },
        warning: { foreground: theme.warning, background: theme.warningSoft },
        danger: { foreground: theme.danger, background: theme.warningSoft },
    };
    const tone = colors[visual.tone];
    return (<View accessibilityRole="image" accessibilityLabel={t(messages, visual.accessibilityMessageKey)} style={[
            styles.visual,
            createViewWidthHeightBorderRadiusBackgroundColorStyle(size, size, Math.round(size * 0.3), tone.background),
        ]}>
      <Ionicons name={visual.icon} size={Math.round(size * 0.5)} color={tone.foreground}/>
    </View>);
}


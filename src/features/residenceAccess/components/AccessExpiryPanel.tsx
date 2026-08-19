import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import { presentResidenceDateOnly } from "../services/residenceAccessDateTime";
import type { ResidenceAccessRecord } from "../models/residenceAccess.types";
import { styles, createViewBackgroundColorBorderColorStyle } from "../styles/components/AccessExpiryPanel.styles";
interface AccessExpiryPanelProps {
    readonly record: ResidenceAccessRecord;
}
export function AccessExpiryPanel({ record }: AccessExpiryPanelProps) {
    const { colors } = useAppTheme();
    const date = presentResidenceDateOnly(record.effectiveUntil ?? record.statusUpdatedAt);
    return (<View style={[styles.panel, createViewBackgroundColorBorderColorStyle(colors.warningSoft, colors.warning)]}>
      <AppText variant="sectionTitle" weight="800" color={colors.warning}>
        {residenceAccessMessages.expiry.expiredOn(date)}
      </AppText>
      <AppText variant="body">
        {record.statusReason}
      </AppText>
      <AppText variant="bodySmall" tone="secondary">
        {residenceAccessMessages.expiry.renewalGuidance}
      </AppText>
      <AppText variant="caption" tone="secondary">
        {residenceAccessMessages.expiry.previousRecords}
      </AppText>
    </View>);
}


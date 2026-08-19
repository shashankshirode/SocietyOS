import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import { presentResidenceDate } from "../services/residenceAccessDateTime";
import type { OwnerConsentRequest } from "../models/residenceAccess.types";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/OwnerConsentPanel.styles";
interface OwnerConsentPanelProps {
    readonly consent: OwnerConsentRequest;
}
export function OwnerConsentPanel({ consent }: OwnerConsentPanelProps) {
    const { colors } = useAppTheme();
    const requested = presentResidenceDate(consent.requestedAt);
    const expires = presentResidenceDate(consent.expiresAt);
    return (<View style={[styles.panel, createViewBackgroundColorBorderColorStyle(colors.infoSoft, colors.info)]}>
      <View style={styles.ownerRow}>
        <View style={[styles.icon, createViewBackgroundColorStyle(colors.surface)]}>
          <Ionicons name="person-outline" size={22} color={colors.info}/>
        </View>
        <View style={styles.ownerText}>
          <AppText variant="caption" tone="secondary">
            {residenceAccessMessages.consent.ownerLabel}
          </AppText>
          <AppText variant="body" weight="800">
            {consent.maskedOwnerName}
          </AppText>
        </View>
      </View>
      <View style={styles.row}>
        <AppText variant="caption" tone="secondary">
          {residenceAccessMessages.consent.statusLabel}
        </AppText>
        <AppText variant="bodySmall" weight="700">
          {consent.status.replaceAll('_', ' ')}
        </AppText>
      </View>
      {consent.requestedAt ? (<View style={styles.row}>
          <AppText variant="caption" tone="secondary">
            {residenceAccessMessages.consent.requestedAt}
          </AppText>
          <AppText variant="bodySmall" weight="700">
            {requested.absolute}
          </AppText>
        </View>) : null}
      {consent.expiresAt ? (<View style={styles.row}>
          <AppText variant="caption" tone="secondary">
            {residenceAccessMessages.consent.expiresAt}
          </AppText>
          <AppText variant="bodySmall" weight="700">
            {expires.absolute}
          </AppText>
        </View>) : null}
      {consent.residentVisibleDecisionReason ? (<AppText variant="bodySmall" tone="danger">
          {consent.residentVisibleDecisionReason}
        </AppText>) : null}
      <AppText variant="caption" tone="secondary">
        {residenceAccessMessages.consent.privacy}
      </AppText>
    </View>);
}


import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { t } from "../../household/components/householdComponentUtils";
import type { VisitorExitAlert } from "../../../../shared/types/visitor.types";
import { formatVisitorExitTime, resolvePriorityLabel } from "./visitorExitFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/VisitorOverstayAlertCard.styles";
export interface VisitorOverstayAlertCardProps {
    alert: VisitorExitAlert;
    onConfirmLeft: () => void;
    onStillInside: () => void;
    onExtendTime: () => void;
    onContactSecurity: () => void;
}
export function VisitorOverstayAlertCard({ alert, onConfirmLeft, onStillInside, onExtendTime, onContactSecurity, }: VisitorOverstayAlertCardProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.warning)]}>
      <View style={styles.header}>
        <View style={[styles.icon, createViewBackgroundColorStyle(theme.warning + '22')]}>
          <Ionicons name="shield-half-outline" size={18} color={theme.warning}/>
        </View>
        <View style={styles.headerText}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
            {t(messages, 'visitor.exitAssurance.exitNotConfirmed')}
          </SafeText>
          <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.textSecondary)}>
            {resolvePriorityLabel(messages, alert.priority)}
          </SafeText>
        </View>
      </View>
      <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textPrimary)}>
        {t(messages, 'visitor.exitAssurance.visitorAlertMessage', alert.visitorName)}
      </SafeText>
      <SafeText variant="tiny" style={createSafeTextColorStyle4(theme.textSecondary)}>
        {t(messages, 'visitor.exitAssurance.expectedExitSummary', formatVisitorExitTime(alert.expectedExitAtIso))}
      </SafeText>
      <View style={styles.actions}>
        <AppButton title={t(messages, 'visitor.exitAssurance.confirmLeft')} onPress={onConfirmLeft}/>
        <AppButton title={t(messages, 'visitor.exitAssurance.stillInside')} variant="secondary" onPress={onStillInside}/>
        <AppButton title={t(messages, 'visitor.exitAssurance.extendTime')} variant="ghost" onPress={onExtendTime}/>
        <AppButton title={t(messages, 'visitor.exitAssurance.contactSecurity')} variant="ghost" onPress={onContactSecurity}/>
      </View>
    </View>);
}


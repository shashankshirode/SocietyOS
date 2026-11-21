import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { t } from "../../household/components/householdComponentUtils";
import type { VisitorExitPolicy } from "../data/visitorExitPolicy.types";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorBorderColorStyle } from "../styles/components/VisitorExitPolicyNotice.styles";
export interface VisitorExitPolicyNoticeProps {
    policy: VisitorExitPolicy;
}
export function VisitorExitPolicyNotice({ policy }: VisitorExitPolicyNoticeProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const primaryMessageKey = policy.expectedExitSelectionRequired
        ? 'visitor.exitAssurance.manualExitPolicy'
        : policy.residentCanOverrideExitTime
            ? 'visitor.exitAssurance.overrideExitPolicy'
            : 'visitor.exitAssurance.autoExitPolicy';
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
      <Ionicons name="shield-checkmark-outline" size={18} color={theme.accent}/>
      <View style={styles.text}>
        <SafeText variant="caption" style={createSafeTextColorStyle(theme.textPrimary)}>
          {t(messages, primaryMessageKey)}
        </SafeText>
        <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.textSecondary)}>
          {t(messages, 'visitor.exitAssurance.reminderHelper')}
        </SafeText>
        {policy.expectedExitSelectionRequired ? (<SafeText variant="tiny" style={createSafeTextColorStyle3(theme.warning)}>
            {t(messages, 'visitor.exitAssurance.longVisitWarning')}
          </SafeText>) : null}
      </View>
    </View>);
}


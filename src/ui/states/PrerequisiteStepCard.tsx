import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { t } from "../../modules/resident/household/components/householdComponentUtils";
import type { PrerequisiteCheck } from "../../shared/prerequisites";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "./styles/PrerequisiteStepCard.styles";
export interface PrerequisiteStepCardProps {
    check: PrerequisiteCheck;
}
const statusIcon: Record<PrerequisiteCheck['status'], keyof typeof Ionicons.glyphMap> = {
    satisfied: 'checkmark-circle',
    missing: 'alert-circle-outline',
    blocked: 'remove-circle-outline',
    restricted: 'lock-closed-outline',
    notApplicable: 'ellipse-outline',
};
export function PrerequisiteStepCard({ check }: PrerequisiteStepCardProps) {
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    const isSatisfied = check.status === 'satisfied';
    const isRestricted = check.status === 'restricted';
    const accent = isSatisfied ? colors.success : isRestricted ? colors.danger : colors.warning;
    const backgroundColor = dark ? colors.surfaceElevated : colors.surface;
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(backgroundColor, colors.border)]}>
      <View style={[styles.iconWrap, createViewBackgroundColorStyle(dark ? `${accent}22` : `${accent}14`)]}>
        <Ionicons name={statusIcon[check.status]} size={18} color={accent}/>
      </View>
      <View style={styles.content}>
        <SafeText variant="bodyStrong" color="primary" numberOfLines={2}>
          {t(messages, check.titleMessageKey)}
        </SafeText>
        <SafeText variant="caption" color="secondary" numberOfLines={3}>
          {t(messages, check.descriptionMessageKey)}
        </SafeText>
        {check.resolutionStepsMessageKeys.map((stepKey) => (<View key={stepKey} style={styles.stepRow}>
            <Ionicons name="arrow-forward-circle-outline" size={13} color={colors.textMuted}/>
            <SafeText variant="tiny" color="muted" numberOfLines={2} style={styles.stepText}>
              {t(messages, stepKey)}
            </SafeText>
          </View>))}
      </View>
    </View>);
}


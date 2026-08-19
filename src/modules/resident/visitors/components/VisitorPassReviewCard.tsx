import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { t } from "../../household/components/householdComponentUtils";
import type { VisitorExitPolicy } from "../data/visitorExitPolicy.types";
import { formatVisitorExitTime, resolvePriorityLabel } from "./visitorExitFormatters";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4, createSafeTextColorStyle5, createSafeTextColorStyle6, createSafeTextColorStyle7, createSafeTextColorStyle8, createSafeTextColorStyle9, createSafeTextColorStyle10, createSafeTextColorStyle11, createViewBackgroundColorBorderColorStyle } from "../styles/components/VisitorPassReviewCard.styles";
export interface VisitorPassReviewCardProps {
    visitorTypeLabel: string;
    expectedEntryAtIso: string;
    expectedExitAtIso: string;
    policy: VisitorExitPolicy;
}
export function VisitorPassReviewCard({ visitorTypeLabel, expectedEntryAtIso, expectedExitAtIso, policy, }: VisitorPassReviewCardProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
      <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.textPrimary)}>
        {t(messages, 'visitor.exitAssurance.title')}
      </SafeText>
      <View style={styles.row}>
        <SafeText variant="caption" style={createSafeTextColorStyle2(theme.textSecondary)}>
          {t(messages, 'visitor.exitAssurance.expectedEntryTime')}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle3(theme.textPrimary)}>
          {formatVisitorExitTime(expectedEntryAtIso)}
        </SafeText>
      </View>
      <View style={styles.row}>
        <SafeText variant="caption" style={createSafeTextColorStyle4(theme.textSecondary)}>
          {t(messages, 'visitor.exitAssurance.expectedExitTime')}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle5(theme.textPrimary)}>
          {formatVisitorExitTime(expectedExitAtIso)}
        </SafeText>
      </View>
      <View style={styles.row}>
        <SafeText variant="caption" style={createSafeTextColorStyle6(theme.textSecondary)}>
          {t(messages, 'visitors.labelType')}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle7(theme.textPrimary)}>
          {visitorTypeLabel}
        </SafeText>
      </View>
      <View style={styles.row}>
        <SafeText variant="caption" style={createSafeTextColorStyle8(theme.textSecondary)}>
          {t(messages, 'visitor.exitAssurance.gracePeriod')}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle9(theme.textPrimary)}>
          {t(messages, 'visitor.exitAssurance.minutesLabel', policy.gracePeriodMinutes)}
        </SafeText>
      </View>
      <View style={styles.row}>
        <SafeText variant="caption" style={createSafeTextColorStyle10(theme.textSecondary)}>
          {t(messages, 'visitor.exitAssurance.alertPolicy')}
        </SafeText>
        <SafeText variant="caption" style={createSafeTextColorStyle11(theme.textPrimary)}>
          {resolvePriorityLabel(messages, policy.alertPriority)}
        </SafeText>
      </View>
    </View>);
}


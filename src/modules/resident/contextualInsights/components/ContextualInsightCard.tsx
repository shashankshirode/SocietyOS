import { Pressable, View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import type { ResidentContextualSuggestion } from "../data/residentContextualInsights.types";
import { ContextualInsightIcon } from "./ContextualInsightIcon";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle } from "../styles/components/ContextualInsightCard.styles";
export interface ContextualInsightCardProps {
    suggestion: ResidentContextualSuggestion;
    onDismiss: (id: string) => void;
}
export function ContextualInsightCard({ suggestion, onDismiss }: ContextualInsightCardProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    return (<View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <View style={styles.cardHeader}>
        <ContextualInsightIcon name={suggestion.iconName} priority={suggestion.priority} size={18}/>
        <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>
          {t(messages, suggestion.oneLineMessageKey)}
        </SafeText>
        <Pressable onPress={() => onDismiss(suggestion.id)} accessibilityRole="button" accessibilityLabel={t(messages, 'residentAccessibility.contextualInsights.dismiss')} style={styles.closeBtn}>
          <ContextualInsightIcon name="close" priority="low" size={16}/>
        </Pressable>
      </View>
    </View>);
}
export default ContextualInsightCard;


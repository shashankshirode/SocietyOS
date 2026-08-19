import { View } from "react-native";
import { SafeText } from "../../../../shared/components/SafeText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import type { LocalAreaAdvisory } from "../data/residentContextualInsights.types";
import { styles, createSafeTextColorStyle, createViewBorderColorStyle, createViewBackgroundColorStyle } from "../styles/components/LocalAdvisoryPill.styles";
export interface LocalAdvisoryPillProps {
    advisory: LocalAreaAdvisory;
}
export function LocalAdvisoryPill({ advisory }: LocalAdvisoryPillProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    let color = '#EF4444';
    if (advisory.priority === 'low')
        color = '#38BDF8';
    else if (advisory.priority === 'medium')
        color = '#6366F1';
    else if (advisory.priority === 'high')
        color = '#F59E0B';
    const label = t(messages, advisory.titleMessageKey);
    return (<View style={[styles.pill, createViewBorderColorStyle(color)]}>
      <View style={[styles.dot, createViewBackgroundColorStyle(color)]}/>
      <SafeText variant="tiny" style={createSafeTextColorStyle(colors.textPrimary)}>
        {label}
      </SafeText>
    </View>);
}
export default LocalAdvisoryPill;


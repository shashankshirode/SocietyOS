import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { SafeText } from "../../shared/components/SafeText";
import { styles, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle, createSafeTextColorStyle2 } from "./styles/OfflineState.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
export function OfflineState() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(colors.warningSoft, colors.warning)]} testID="offline-state-banner">
      <Ionicons name="cloud-offline-outline" size={16} color={colors.warning}/>
      <View style={styles.textContainer}>
        <SafeText variant="tiny" style={[styles.title, createSafeTextColorStyle(colors.textPrimary)]}>{localizedUiText.m_4d5c943931a4}</SafeText>
        <SafeText variant="tiny" style={[styles.subtitle, createSafeTextColorStyle2(colors.textSecondary)]}>{localizedUiText.m_e0dc377700cd}</SafeText>
      </View>
    </View>);
}
export default OfflineState;


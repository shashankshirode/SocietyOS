import { View } from "react-native";
import { AppText } from "../../../../shared/components/AppText";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createAppTextColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorWidthStyle } from "../styles/components/HomeSetupProgress.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface HomeSetupProgressProps {
    current: number;
    total: number;
}
export function HomeSetupProgress({ current, total }: HomeSetupProgressProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const progress = total > 0 ? current / total : 0;
    return (<View style={styles.container}>
      <View style={[styles.barBg, createViewBackgroundColorStyle(colors.border)]}>
        <View style={[
            styles.barFill,
            createViewBackgroundColorWidthStyle(colors.primary, `${progress * 100}%`),
        ]}/>
      </View>
      <AppText variant="caption" style={createAppTextColorStyle(colors.textSecondary)}>
        {current}{" " + localizedUiText.m_28391d3bc64e + " "}{total}{localizedUiText.m_5d2bfc1b51c1}</AppText>
    </View>);
}


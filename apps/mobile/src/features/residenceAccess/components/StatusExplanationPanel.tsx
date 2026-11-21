import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorStyle } from "../styles/components/StatusExplanationPanel.styles";
interface StatusExplanationPanelProps {
    readonly title: string;
    readonly body: string;
    readonly tone?: 'info' | 'warning' | 'danger' | 'success' | 'neutral';
}
export function StatusExplanationPanel({ title, body, tone = 'info', }: StatusExplanationPanelProps) {
    const { colors } = useAppTheme();
    const toneColor = tone === 'warning'
        ? colors.warning
        : tone === 'danger'
            ? colors.danger
            : tone === 'success'
                ? colors.success
                : tone === 'neutral'
                    ? colors.textSecondary
                    : colors.info;
    const background = tone === 'warning'
        ? colors.warningSoft
        : tone === 'danger'
            ? colors.dangerSoft
            : tone === 'success'
                ? colors.successSoft
                : tone === 'neutral'
                    ? colors.surfaceMuted
                    : colors.infoSoft;
    return (<View style={[styles.panel, createViewBackgroundColorBorderColorStyle(background, toneColor)]}>
      <AppText variant="bodySmall" weight="800" color={toneColor}>
        {title}
      </AppText>
      <AppText variant="body" color={colors.textPrimary}>
        {body}
      </AppText>
    </View>);
}


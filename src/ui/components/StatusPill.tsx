import { View, ViewStyle, StyleProp } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createSafeTextColorStyle } from "./styles/StatusPill.styles";
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'muted';
export interface StatusPillProps {
    label: string;
    tone?: StatusTone;
    small?: boolean;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
export function StatusPill({ label, tone = 'neutral', small = false, style, testID }: StatusPillProps) {
    const { semantic } = useAppTheme();
    const tones: Record<StatusTone, { bg: string; text: string }> = {
        success: { bg: semantic.status.successSurface, text: semantic.status.success },
        warning: { bg: semantic.status.warningSurface, text: semantic.status.warning },
        danger: { bg: semantic.status.dangerSurface, text: semantic.status.danger },
        info: { bg: semantic.status.infoSurface, text: semantic.status.info },
        neutral: { bg: semantic.status.neutralSurface, text: semantic.status.neutral },
        muted: { bg: semantic.surface.soft, text: semantic.text.tertiary },
    };
    const palette = tones[tone];
    return (<View style={[
            styles.pill,
            small && styles.pillSmall,
            createViewBackgroundColorStyle(palette.bg),
            style,
        ]} testID={testID}>
      <SafeText variant="tiny" style={[
            styles.text,
            small && styles.textSmall,
            createSafeTextColorStyle(palette.text),
        ]}>
        {label}
      </SafeText>
    </View>);
}

import { StyleProp, TextProps, TextStyle } from "react-native";
import { Typography, type TypographyToken } from "../theme/typography";
import { SafeText } from "./SafeText";
import { useAppTheme } from "../theme/useAppTheme";
import { createSafeTextColorStyle, createSafeTextFontWeightStyle } from "./styles/AppText.styles";
type AppTextTone = 'primary' | 'secondary' | 'muted' | 'danger' | 'success' | 'warning' | 'info' | 'inverse';
type AppTextProps = TextProps & {
    variant?: TypographyToken;
    tone?: AppTextTone;
    color?: AppTextTone | string;
    weight?: TextStyle['fontWeight'];
    style?: StyleProp<TextStyle>;
};
export function AppText({ variant = 'body', tone = 'primary', color, weight, style, children, ...props }: AppTextProps) {
    const { colors } = useAppTheme();
    const toneColors: Record<AppTextTone, string> = {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
        muted: colors.textMuted,
        danger: colors.danger,
        success: colors.success,
        warning: colors.warning,
        info: colors.info,
        inverse: colors.textInverse,
    };
    const resolvedColor = color
        ? toneColors[color as AppTextTone] ?? color
        : toneColors[tone];
    return (<SafeText style={[Typography[variant], createSafeTextColorStyle(resolvedColor), weight && createSafeTextFontWeightStyle(weight), style]} {...props}>
      {children}
    </SafeText>);
}
export default AppText;


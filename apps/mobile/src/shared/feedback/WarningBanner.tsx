import { StyleProp, View, ViewStyle } from "react-native";
import { useAppTheme } from "../theme/useAppTheme";
import { SafeText } from "../components/SafeText";
import { AppIcon } from "../icons/AppIcon";
import type { AppIconName } from "../icons/icon.types";
import { styles, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle } from "./styles/WarningBanner.styles";
interface WarningBannerProps {
    message: string;
    type?: 'warning' | 'danger' | 'info';
    style?: StyleProp<ViewStyle>;
}
export function WarningBanner({ message, type = 'warning', style }: WarningBannerProps) {
    const { colors } = useAppTheme();
    const getColors = () => {
        switch (type) {
            case 'danger':
                return {
                    bg: colors.dangerSoft,
                    border: colors.danger,
                    text: colors.danger,
                    icon: 'alert' as AppIconName,
                };
            case 'info':
                return {
                    bg: colors.infoSoft,
                    border: colors.info,
                    text: colors.info,
                    icon: 'info' as AppIconName,
                };
            default:
                return {
                    bg: colors.warningSoft,
                    border: colors.warning,
                    text: colors.warning,
                    icon: 'warning' as AppIconName,
                };
        }
    };
    const scheme = getColors();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(scheme.bg, scheme.border), style]}>
      <View style={styles.icon}>
        <AppIcon name={scheme.icon} size={20} color={scheme.text}/>
      </View>
      <SafeText variant="caption" numberOfLines={4} style={[styles.text, createSafeTextColorStyle(scheme.text)]}>{message}</SafeText>
    </View>);
}


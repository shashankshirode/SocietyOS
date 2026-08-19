import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle } from "./styles/ResidentContextBanner.styles";
export interface ResidentContextBannerProps {
    message: string;
    type: 'info' | 'warning' | 'success' | 'danger';
    iconName?: string;
}
export function ResidentContextBanner({ message, type, iconName }: ResidentContextBannerProps) {
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    const getColors = () => {
        switch (type) {
            case 'danger':
                return {
                    bg: dark ? '#450A0A' : '#FEF2F2',
                    border: dark ? '#EF4444' : '#FCA5A5',
                    icon: dark ? '#F87171' : '#DC2626',
                    defaultIcon: 'alert-circle-outline',
                };
            case 'warning':
                return {
                    bg: dark ? '#451A03' : '#FFFBEB',
                    border: dark ? '#F59E0B' : '#FDE68A',
                    icon: dark ? '#FBBF24' : '#D97706',
                    defaultIcon: 'warning-outline',
                };
            case 'success':
                return {
                    bg: dark ? '#064E3B' : '#F0FDF4',
                    border: dark ? '#10B981' : '#A7F3D0',
                    icon: dark ? '#34D399' : '#059669',
                    defaultIcon: 'checkmark-circle-outline',
                };
            case 'info':
            default:
                return {
                    bg: dark ? '#1E293B' : '#EFF6FF',
                    border: dark ? '#3B82F6' : '#BFDBFE',
                    icon: dark ? '#60A5FA' : '#2563EB',
                    defaultIcon: 'information-circle-outline',
                };
        }
    };
    const themeColors = getColors();
    return (<View style={[
            styles.container,
            createViewBackgroundColorBorderColorStyle(themeColors.bg, themeColors.border),
        ]} accessibilityLabel={messages.residentAccessibility.contextBanner}>
      <Ionicons name={(iconName || themeColors.defaultIcon) as keyof typeof Ionicons.glyphMap} size={18} color={themeColors.icon}/>
      <SafeText variant="caption" style={createSafeTextColorStyle(colors.textPrimary)}>
        {message}
      </SafeText>
    </View>);
}


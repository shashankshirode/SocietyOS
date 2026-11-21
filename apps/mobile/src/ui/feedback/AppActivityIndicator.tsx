import { ActivityIndicator, View } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { SafeText } from "../../shared/components/SafeText";
import { styles, createSafeTextColorStyle } from "./styles/AppActivityIndicator.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
export interface AppActivityIndicatorProps {
    size?: 'small' | 'large';
    color?: string;
    label?: string;
}
export function AppActivityIndicator({ size = 'small', color, label }: AppActivityIndicatorProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const spinnerColor = color ?? colors.primary;
    return (<View style={styles.container} accessibilityRole="progressbar" accessibilityState={{ busy: true }} accessibilityLabel={label ?? localizedUiText.m_d1049c5e8c3b}>
      <ActivityIndicator size={size} color={spinnerColor}/>
      {label && (<SafeText variant="caption" style={[styles.label, createSafeTextColorStyle(colors.textSecondary)]}>
          {label}
        </SafeText>)}
    </View>);
}
export default AppActivityIndicator;


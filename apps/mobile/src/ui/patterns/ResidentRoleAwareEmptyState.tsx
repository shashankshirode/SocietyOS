import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle } from "./styles/ResidentRoleAwareEmptyState.styles";
export interface ResidentRoleAwareEmptyStateProps {
    requiredRole: 'Owner' | 'Tenant' | 'Family';
    currentRole: string;
}
export function ResidentRoleAwareEmptyState({ requiredRole, currentRole, }: ResidentRoleAwareEmptyStateProps) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    return (<View style={[
            styles.container,
            createViewBackgroundColorBorderColorStyle(dark ? colors.surfaceElevated : colors.surface, colors.border),
        ]} accessibilityLabel={messages.residentAccessibility.roleEmptyState}>
      <View style={[styles.iconCircle, createViewBackgroundColorStyle(dark ? 'rgba(239,68,68,0.15)' : '#FEF2F2')]}>
        <Ionicons name="lock-closed" size={32} color="#EF4444"/>
      </View>
      <SafeText variant="bodyStrong" style={styles.title}>{localizedUiText.m_a3966fe9958a}</SafeText>
      <SafeText variant="caption" color="muted" align="center">{localizedUiText.m_123fe83a9402}{requiredRole}{" " + localizedUiText.m_acff97102d2f + " "}{currentRole}.
      </SafeText>
    </View>);
}


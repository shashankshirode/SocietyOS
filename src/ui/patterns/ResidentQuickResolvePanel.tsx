import { View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle, createPressableBackgroundColorStyle } from "./styles/ResidentQuickResolvePanel.styles";
export interface ResidentQuickResolvePanelProps {
    title: string;
    description: string;
    actionLabel: string;
    onPress: () => void;
}
export function ResidentQuickResolvePanel({ title, description, actionLabel, onPress, }: ResidentQuickResolvePanelProps) {
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    return (<View style={[
            styles.container,
            createViewBackgroundColorBorderColorStyle(dark ? '#1E293B' : '#F8FAFC', colors.border),
        ]} accessibilityLabel={messages.residentAccessibility.quickResolve}>
      <View style={styles.content}>
        <Ionicons name="help-buoy-outline" size={20} color={colors.primary}/>
        <View style={styles.text}>
          <SafeText variant="caption" style={createSafeTextColorStyle(colors.textPrimary)}>
            {title}
          </SafeText>
          <SafeText variant="tiny" color="muted">
            {description}
          </SafeText>
        </View>
      </View>

      <Pressable style={[styles.btn, createPressableBackgroundColorStyle(colors.primary)]} onPress={onPress}>
        <SafeText variant="caption" style={styles.safeTextColorFontWeight}>
          {actionLabel}
        </SafeText>
      </Pressable>
    </View>);
}


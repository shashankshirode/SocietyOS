import { View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorBorderColorStyle, createPressableBorderColorStyle, createPressableBackgroundColorStyle } from "./styles/ResidentNextStepPanel.styles";
export interface ResidentNextStepPanelProps {
    title: string;
    description?: string;
    urgency: 'low' | 'medium' | 'high';
    primaryActionLabel?: string;
    secondaryActionLabel?: string;
    onPrimaryActionPress?: () => void;
    onSecondaryActionPress?: () => void;
}
export function ResidentNextStepPanel({ title, description, urgency, primaryActionLabel, secondaryActionLabel, onPrimaryActionPress, onSecondaryActionPress, }: ResidentNextStepPanelProps) {
    const { colors, dark } = useAppTheme();
    const messages = useMessages();
    const getUrgencyColors = () => {
        switch (urgency) {
            case 'high':
                return {
                    bg: dark ? '#450A0A' : '#FEF2F2',
                    border: dark ? '#EF4444' : '#FCA5A5',
                    icon: dark ? '#F87171' : '#DC2626',
                };
            case 'medium':
                return {
                    bg: dark ? '#451A03' : '#FFFBEB',
                    border: dark ? '#F59E0B' : '#FDE68A',
                    icon: dark ? '#FBBF24' : '#D97706',
                };
            case 'low':
            default:
                return {
                    bg: dark ? '#064E3B' : '#F0FDF4',
                    border: dark ? '#10B981' : '#A7F3D0',
                    icon: dark ? '#34D399' : '#059669',
                };
        }
    };
    const currentTheme = getUrgencyColors();
    return (<View style={[
            styles.container,
            createViewBackgroundColorBorderColorStyle(currentTheme.bg, currentTheme.border),
        ]} accessibilityLabel={messages.residentAccessibility.nextStepPanel}>
      <View style={styles.header}>
        <Ionicons name="alert-circle-outline" size={20} color={currentTheme.icon}/>
        <View style={styles.textWrap}>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>
            {title}
          </SafeText>
          {description && (<SafeText variant="caption" style={createSafeTextColorStyle2(colors.textSecondary)}>
              {description}
            </SafeText>)}
        </View>
      </View>

      {(onPrimaryActionPress || onSecondaryActionPress) && (<View style={styles.actions}>
          {onSecondaryActionPress && (<Pressable style={[styles.btn, styles.btnSecondary, createPressableBorderColorStyle(colors.border)]} onPress={onSecondaryActionPress}>
              <SafeText variant="caption" color="primary">
                {secondaryActionLabel || messages.actions.secondaryActionLabel}
              </SafeText>
            </Pressable>)}

          {onPrimaryActionPress && (<Pressable style={[styles.btn, createPressableBackgroundColorStyle(colors.primary)]} onPress={onPrimaryActionPress}>
              <SafeText variant="caption" style={styles.safeTextColorFontWeight}>
                {primaryActionLabel || messages.actions.primaryActionLabel}
              </SafeText>
            </Pressable>)}
        </View>)}
    </View>);
}


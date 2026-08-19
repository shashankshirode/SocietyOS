import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../shared/components/SafeText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { styles, createSafeTextColorStyle, createPressableBorderBottomColorBorderBottomWidthBackgroundColorOpacitStyle, createViewBackgroundColorStyle, createSafeTextColorStyle2 } from "../styles/components/SettingsRow.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
export type SettingsRowProps = {
    icon: React.ReactNode;
    title: string;
    description?: string;
    onPress: () => void;
    trailingContent?: React.ReactNode;
    showChevron?: boolean;
    disabled?: boolean;
    isLast?: boolean;
    testID?: string;
};
export function SettingsRow({ icon, title, description, onPress, trailingContent, showChevron = true, disabled = false, isLast = false, testID, }: SettingsRowProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const accessibilityLabel = `${title}${description ? `, ${description}` : ''}${disabled ? getActiveUiLiteral("m_e9c01a0d4d52") : ''}`;
    return (<Pressable testID={testID} onPress={disabled ? undefined : onPress} accessibilityRole="button" accessibilityState={{ disabled }} accessibilityLabel={accessibilityLabel} style={({ pressed }) => [
            styles.row,
            createPressableBorderBottomColorBorderBottomWidthBackgroundColorOpacitStyle(colors.border, isLast ? 0 : StyleSheet.hairlineWidth, colors.surface, disabled ? 0.5 : pressed ? 0.7 : 1),
        ]}>
      <View style={[styles.iconContainer, createViewBackgroundColorStyle(colors.backgroundSoft)]}>
        {icon}
      </View>
      
      <View style={styles.textColumn}>
        <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.textPrimary)}>
          {title}
        </SafeText>
        {description ? (<SafeText variant="tiny" numberOfLines={2} style={[styles.description, createSafeTextColorStyle2(colors.textSecondary)]}>
            {description}
          </SafeText>) : null}
      </View>

      {trailingContent ? (<View style={styles.trailingContainer}>
          {trailingContent}
        </View>) : null}

      {showChevron && !disabled ? (<View style={styles.chevronContainer}>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted}/>
        </View>) : null}
    </Pressable>);
}
export default SettingsRow;


import React from "react";
import { View, Pressable, type ViewStyle } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../../shared/components/SafeText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles, createSafeTextColorStyle, createViewPaddingTopBackgroundColorBorderBottomColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createSafeTextColorStyle3 } from "../styles/components/ChatPageHeader.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export type ChatPageHeaderProps = {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    roleLabel?: string;
    rightAction?: React.ReactNode;
    style?: ViewStyle;
    testID?: string;
};
export function ChatPageHeader({ title, subtitle, showBackButton = false, onBackPress, roleLabel, rightAction, style, testID, }: ChatPageHeaderProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors, dark } = useAppTheme();
    const insets = useSafeAreaInsets();
    return (<View testID={testID} style={[
            styles.container,
            createViewPaddingTopBackgroundColorBorderBottomColorStyle(insets.top, colors.surface, colors.border),
            style,
        ]}>
      <View style={styles.contentRow}>
        {showBackButton && (<Pressable onPress={onBackPress} accessibilityRole="button" accessibilityLabel={localizedUiText.m_76900f1bfd16} style={styles.backButton} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary}/>
          </Pressable>)}
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle2(colors.textPrimary)]} numberOfLines={1}>
              {title}
            </SafeText>
            {roleLabel ? (<View style={[styles.badge, createViewBackgroundColorStyle(dark ? 'rgba(129,140,248,0.2)' : 'rgba(67,56,202,0.1)')]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle(colors.primary)}>
                  {roleLabel}
                </SafeText>
              </View>) : null}
          </View>
          {subtitle ? (<SafeText variant="tiny" style={[styles.subtitle, createSafeTextColorStyle3(colors.textSecondary)]} numberOfLines={1}>
              {subtitle}
            </SafeText>) : null}
        </View>
        {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
      </View>
    </View>);
}
export default ChatPageHeader;


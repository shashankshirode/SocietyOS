import { Pressable, View, ViewStyle, StyleProp } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createSafeTextColorStyle } from "./styles/SectionHeader.styles";
export interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    actionIcon?: string;
    onActionPress?: () => void;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
export function DashboardSectionHeader({ title, subtitle, actionLabel, onActionPress, style, testID, }: SectionHeaderProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, style]} testID={testID}>
      <View style={styles.left}>
        <SafeText variant="title" color="primary" numberOfLines={1}>
          {title}
        </SafeText>
        {subtitle ? (<SafeText variant="caption" color="muted" numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </SafeText>) : null}
      </View>
      {actionLabel && onActionPress ? (<Pressable onPress={onActionPress} hitSlop={8} style={styles.action} accessibilityRole="button">
          <SafeText variant="caption" style={createSafeTextColorStyle(colors.primary)}>
            {actionLabel}
          </SafeText>
          <Ionicons name="chevron-forward" size={14} color={colors.primary}/>
        </Pressable>) : null}
    </View>);
}


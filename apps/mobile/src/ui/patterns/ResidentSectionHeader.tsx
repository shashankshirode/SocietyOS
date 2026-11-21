import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3 } from "./styles/ResidentSectionHeader.styles";
export interface ResidentSectionHeaderProps {
    title: string;
    subtitle?: string;
    actionLabel?: string;
    onActionPress?: () => void;
}
export function ResidentSectionHeader({ title, subtitle, actionLabel, onActionPress, }: ResidentSectionHeaderProps) {
    const theme = useResidentTheme();
    return (<View style={styles.container}>
      <View style={styles.left}>
        <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle3(theme.textPrimary)]} numberOfLines={1}>
          {title}
        </SafeText>
        {subtitle && (<SafeText variant="tiny" style={createSafeTextColorStyle(theme.textSecondary)} numberOfLines={1}>
            {subtitle}
          </SafeText>)}
      </View>
      {actionLabel && onActionPress && (<Pressable onPress={onActionPress} style={styles.action} hitSlop={12}>
          <SafeText variant="caption" style={createSafeTextColorStyle2(theme.accent)}>
            {actionLabel}
          </SafeText>
          <Ionicons name="chevron-forward" size={14} color={theme.accent}/>
        </Pressable>)}
    </View>);
}
export default ResidentSectionHeader;


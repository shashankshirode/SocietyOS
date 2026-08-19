import { Pressable, Text, View, ViewStyle } from "react-native";
import { styles } from "./styles/SectionHeader.styles";
interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
    style?: ViewStyle;
}
export function SectionHeader({ title, actionLabel, onAction, style, }: SectionHeaderProps) {
    return (<View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel && onAction && (<Pressable onPress={onAction} hitSlop={8} accessibilityRole="button" accessibilityLabel={actionLabel}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>)}
    </View>);
}


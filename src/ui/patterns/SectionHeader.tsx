import { View } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createSafeTextColorStyle } from "./styles/SectionHeader.styles";
interface SectionHeaderProps {
    title: string;
    trailing?: string;
    onTrailingPress?: () => void;
}
export function SectionHeader({ title, trailing, onTrailingPress }: SectionHeaderProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.row}>
      <SafeText variant="bodyStrong" color="secondary" style={styles.title} accessibilityRole="header">{title}</SafeText>
      {trailing && (<SafeText variant="caption" style={[styles.trailing, createSafeTextColorStyle(colors.primary)]} onPress={onTrailingPress} accessibilityRole={onTrailingPress ? 'button' : undefined} accessibilityLabel={trailing}>
          {trailing}
        </SafeText>)}
    </View>);
}


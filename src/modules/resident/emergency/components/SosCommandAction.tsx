import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { SafeText } from "../../../../shared/components/SafeText";
import type { SosCommandActionConfig } from "../data/sosCommand.types";
import { styles, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createSafeTextColorStyle } from "../styles/components/SosCommandAction.styles";
interface SosCommandActionProps {
    config: SosCommandActionConfig;
    labelText: string;
    accessibilityLabel: string;
    onPress: () => void;
}
export function SosCommandAction({ config, labelText, accessibilityLabel, onPress, }: SosCommandActionProps) {
    const { colors } = useAppTheme();
    return (<Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={({ pressed }) => [
            styles.tile,
            createPressableBackgroundColorBorderColorStyle(pressed ? `${config.color}25` : `${config.color}12`, `${config.color}40`),
        ]}>
      <View style={[styles.iconContainer, createViewBackgroundColorStyle(`${config.color}18`)]}>
        <Ionicons name={config.icon as keyof typeof Ionicons.glyphMap} size={22} color={config.color}/>
      </View>
      <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle(colors.textPrimary)]}>
        {labelText}
      </SafeText>
    </Pressable>);
}
export default SosCommandAction;


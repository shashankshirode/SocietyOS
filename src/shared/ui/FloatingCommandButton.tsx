import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createPressableBackgroundColorTransformStyle, createPressableScaleStyle } from "./styles/FloatingCommandButton.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
interface FloatingCommandButtonProps {
    onPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap;
}
export function FloatingCommandButton({ onPress, icon = 'add' }: FloatingCommandButtonProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    return (<Pressable onPress={onPress} style={({ pressed }) => [
            styles.fab,
            createPressableBackgroundColorTransformStyle(colors.primary, [createPressableScaleStyle(pressed ? 0.95 : 1)]),
        ]} accessibilityRole="button" accessibilityLabel={localizedUiText.m_a282108b5fd0}>
      <Ionicons name={icon} size={28} color="#FFFFFF"/>
    </Pressable>);
}


import { Text, Pressable, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles, createPressableBorderColorStyle, createTextColorStyle } from "../styles/components/EmergencyActionCard.styles";
interface Props {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    onPress: () => void;
    style?: ViewStyle;
}
export function EmergencyActionCard({ title, icon, color, onPress, style }: Props) {
    return (<Pressable style={({ pressed }) => [styles.card, createPressableBorderColorStyle(color), pressed && styles.pressed, style]} onPress={onPress}>
      <Ionicons name={icon} size={28} color={color}/>
      <Text style={[styles.title, createTextColorStyle(color)]}>{title}</Text>
    </Pressable>);
}


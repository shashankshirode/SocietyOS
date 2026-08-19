import { Pressable, View } from "react-native";
import { styles, createPressableWidthHeightBorderRadiusStyle, createViewBackgroundColorStyle } from "./styles/MediaActionButton.styles";
interface MediaActionButtonProps {
    onPress: () => void;
    color?: string;
    size?: number;
}
export function MediaActionButton({ onPress, color = '#fff', size = 70 }: MediaActionButtonProps) {
    return (<Pressable onPress={onPress} style={[styles.outer, createPressableWidthHeightBorderRadiusStyle(size, size, size / 2)]}>
      <View style={[styles.inner, createViewBackgroundColorStyle(color)]}/>
    </Pressable>);
}


import { Animated, Pressable } from "react-native";
import { styles, createAnimatedViewOpacityStyle } from "../styles/components/SosBackdrop.styles";
interface SosBackdropProps {
    animValue: Animated.Value;
    onPress: () => void;
    accessibilityLabel: string;
}
export function SosBackdrop({ animValue, onPress, accessibilityLabel }: SosBackdropProps) {
    const backdropOpacity = animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.4],
    });
    return (<>
      <Animated.View style={[
            styles.backdrop,
            createAnimatedViewOpacityStyle(backdropOpacity),
        ]}/>
      <Pressable style={styles.backdropPressable} onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel}/>
    </>);
}
export default SosBackdrop;


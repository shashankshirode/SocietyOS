import { ActivityIndicator, Text, View } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createTextColorStyle } from "./styles/InlineLoadingState.styles";
interface InlineLoadingStateProps {
    message?: string;
    size?: 'small' | 'large';
}
export function InlineLoadingState({ message, size = 'small' }: InlineLoadingStateProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator size={size} color={colors.primary}/>
      {message && (<Text style={[styles.text, createTextColorStyle(colors.textSecondary)]}>{message}</Text>)}
    </View>);
}
export default InlineLoadingState;


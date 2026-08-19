import { View } from "react-native";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "../styles/components/ContextualInsightSkeleton.styles";
export function ContextualInsightSkeleton() {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}>
      <View style={[styles.shimmerIcon, createViewBackgroundColorStyle(colors.border)]}/>
      <View style={[styles.shimmerText, createViewBackgroundColorStyle2(colors.border)]}/>
    </View>);
}
export default ContextualInsightSkeleton;


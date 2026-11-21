import { View } from "react-native";
import { useAppTheme } from "../../../../../shared/theme/useAppTheme";
import { ShimmerBlock } from "../../../../../ui/loading/ShimmerBlock";
import { styles, createViewBorderColorStyle } from "../../styles/components/insights/InsightLoadingState.styles";
export function InsightLoadingState() {
    const { colors } = useAppTheme();
    return (<View style={styles.container} testID="insight-loading-state">
      
      <View style={styles.badgeRow}>
        <ShimmerBlock width={100} height={20} borderRadius={8}/>
        <ShimmerBlock width={80} height={20} borderRadius={8}/>
      </View>

      
      <View style={styles.heroRow}>
        <ShimmerBlock width={24} height={24} borderRadius={12}/>
        <View style={styles.heroText}>
          <ShimmerBlock width="90%" height={18} borderRadius={4} style={styles.shimmerBlockMarginBottom}/>
          <ShimmerBlock width="70%" height={14} borderRadius={4}/>
        </View>
      </View>

      
      <View style={styles.metadataContainer}>
        <ShimmerBlock width="60%" height={12} borderRadius={4} style={styles.shimmerBlockMarginBottom2}/>
        <ShimmerBlock width="40%" height={10} borderRadius={4}/>
      </View>

      
      <View style={[styles.recommendationPanel, createViewBorderColorStyle(colors.border)]}>
        <View style={styles.recommendationHeader}>
          <ShimmerBlock width={14} height={14} borderRadius={7}/>
          <ShimmerBlock width={120} height={10} borderRadius={4}/>
        </View>
        <ShimmerBlock width="90%" height={12} borderRadius={4}/>
      </View>

      
      <View style={styles.actionRow}>
        <ShimmerBlock width={100} height={44} borderRadius={12}/>
      </View>
    </View>);
}
export default InsightLoadingState;


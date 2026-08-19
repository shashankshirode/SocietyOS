import { View } from "react-native";
import { ShimmerBlock } from "./ShimmerBlock";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorStyle } from "./styles/TimelineSkeleton.styles";
interface TimelineSkeletonProps {
    items?: number;
}
export function TimelineSkeleton({ items = 4 }: TimelineSkeletonProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: items }).map((_, i) => (<View key={i} style={styles.row}>
          
          <View style={styles.dotCol}>
            <ShimmerBlock width={12} height={12} borderRadius={6}/>
            {i < items - 1 && (<View style={[styles.line, createViewBackgroundColorStyle(colors.surfaceMuted)]}/>)}
          </View>
          
          <View style={styles.content}>
            <ShimmerBlock width="40%" height={10}/>
            <ShimmerBlock width="80%" height={14} style={styles.shimmerBlockMarginTop}/>
            <ShimmerBlock width="55%" height={12} style={styles.shimmerBlockMarginTop2}/>
          </View>
        </View>))}
    </View>);
}
export default TimelineSkeleton;


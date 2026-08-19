import { View } from "react-native";
import { ShimmerBlock } from "./ShimmerBlock";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { Radius } from "../../shared/theme/radius";
import { styles, createViewBackgroundColorStyle } from "./styles/CardSkeleton.styles";
interface CardSkeletonProps {
    showIcon?: boolean;
    showBadge?: boolean;
    lines?: number;
}
export function CardSkeleton({ showIcon = true, showBadge = true, lines = 2 }: CardSkeletonProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.card, createViewBackgroundColorStyle(colors.surface)]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.row}>
        {showIcon && (<ShimmerBlock width={40} height={40} borderRadius={Radius.sm} style={styles.icon}/>)}
        <View style={styles.textCol}>
          <ShimmerBlock width="70%" height={14}/>
          {lines >= 2 && <ShimmerBlock width="50%" height={12} style={styles.line}/>}
          {lines >= 3 && <ShimmerBlock width="40%" height={12} style={styles.line}/>}
        </View>
        {showBadge && <ShimmerBlock width={56} height={24} borderRadius={Radius.pill}/>}
      </View>
    </View>);
}
export default CardSkeleton;


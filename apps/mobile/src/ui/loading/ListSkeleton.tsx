import { View } from "react-native";
import { CardSkeleton } from "./CardSkeleton";
import { styles } from "./styles/ListSkeleton.styles";
interface ListSkeletonProps {
    count?: number;
    showIcon?: boolean;
    showBadge?: boolean;
    lines?: number;
}
export function ListSkeleton({ count = 5, showIcon = true, showBadge = true, lines = 2, }: ListSkeletonProps) {
    return (<View style={styles.container} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: count }).map((_, i) => (<CardSkeleton key={i} showIcon={showIcon} showBadge={showBadge} lines={lines}/>))}
    </View>);
}
export default ListSkeleton;


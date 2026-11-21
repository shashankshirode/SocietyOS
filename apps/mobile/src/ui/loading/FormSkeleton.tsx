import { View } from "react-native";
import { ShimmerBlock } from "./ShimmerBlock";
import { Radius } from "../../shared/theme/radius";
import { styles } from "./styles/FormSkeleton.styles";
interface FormSkeletonProps {
    fields?: number;
    showButton?: boolean;
}
export function FormSkeleton({ fields = 4, showButton = true }: FormSkeletonProps) {
    return (<View style={styles.container} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {Array.from({ length: fields }).map((_, i) => (<View key={i} style={styles.field}>
          <ShimmerBlock width="30%" height={12}/>
          <ShimmerBlock width="100%" height={48} borderRadius={Radius.input} style={styles.shimmerBlockMarginTop}/>
        </View>))}
      {showButton && (<ShimmerBlock width="100%" height={48} borderRadius={Radius.button} style={styles.shimmerBlockMarginTop2}/>)}
    </View>);
}
export default FormSkeleton;


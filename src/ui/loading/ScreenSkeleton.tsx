import { View } from "react-native";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { ListSkeleton } from "./ListSkeleton";
import { FormSkeleton } from "./FormSkeleton";
import { ShimmerBlock } from "./ShimmerBlock";
import { CardSkeleton } from "./CardSkeleton";
import { TimelineSkeleton } from "./TimelineSkeleton";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { Radius } from "../../shared/theme/radius";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "./styles/ScreenSkeleton.styles";
type ScreenVariant = 'dashboard' | 'list' | 'detail' | 'form' | 'timeline';
interface ScreenSkeletonProps {
    variant?: ScreenVariant;
}
export function ScreenSkeleton({ variant = 'list' }: ScreenSkeletonProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorStyle(colors.background)]}>
      {variant === 'dashboard' && <DashboardSkeleton />}
      {variant === 'list' && (<View style={styles.padded}>
          
          <ShimmerBlock width="100%" height={44} borderRadius={Radius.input}/>
          
          <View style={styles.filterRow}>
            {Array.from({ length: 4 }).map((_, i) => (<ShimmerBlock key={i} width={64} height={32} borderRadius={Radius.pill}/>))}
          </View>
          <ListSkeleton count={6}/>
        </View>)}
      {variant === 'detail' && (<View style={styles.padded}>
          <ShimmerBlock width="60%" height={20}/>
          <ShimmerBlock width="40%" height={14} style={styles.shimmerBlockMarginTop}/>
          <View style={[styles.detailCard, createViewBackgroundColorStyle2(colors.surface)]}>
            <ShimmerBlock width="100%" height={120} borderRadius={Radius.sm}/>
          </View>
          <ShimmerBlock width="30%" height={16} style={styles.shimmerBlockMarginTop2}/>
          <CardSkeleton lines={3}/>
          <ShimmerBlock width="35%" height={16} style={styles.shimmerBlockMarginTop3}/>
          <TimelineSkeleton items={3}/>
        </View>)}
      {variant === 'form' && (<View style={styles.padded}>
          <ShimmerBlock width="50%" height={20}/>
          <ShimmerBlock width="80%" height={12} style={styles.shimmerBlockMarginTop4}/>
          <FormSkeleton fields={5}/>
        </View>)}
      {variant === 'timeline' && (<View style={styles.padded}>
          <ShimmerBlock width="50%" height={20}/>
          <TimelineSkeleton items={6}/>
        </View>)}
    </View>);
}
export default ScreenSkeleton;


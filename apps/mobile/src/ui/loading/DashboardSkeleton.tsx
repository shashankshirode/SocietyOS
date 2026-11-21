import { View } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { ContentFrame } from "../layout/ContentFrame";
import { useResponsiveLayout } from "../layout/useResponsiveLayout";
import { resolveResidentDashboardLayout } from "../../modules/resident/dashboard/layout/residentDashboardLayout";
import { ShimmerBlock } from "./ShimmerBlock";
import { styles, createViewBackgroundColorBorderColorStyle, createViewGapStyle, createViewGapStyle2, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewGapStyle3 } from "./styles/DashboardSkeleton.styles";
type SkeletonShape = 'priority' | 'pulse' | 'timeline' | 'finance' | 'complaint' | 'editorial' | 'media' | 'matrix';
function DashboardSectionSkeleton({ shape }: {
    shape: SkeletonShape;
}) {
    const { colors } = useAppTheme();
    const rowCount = shape === 'priority'
        ? 3
        : shape === 'matrix'
            ? 4
            : shape === 'timeline' || shape === 'complaint'
                ? 3
                : 2;
    return (<View style={[styles.sectionCard, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderCopy}>
          <ShimmerBlock width="44%" height={17}/>
          <ShimmerBlock width="68%" height={10}/>
        </View>
        <ShimmerBlock width={44} height={26} borderRadius={13}/>
      </View>
      {shape === 'pulse' ? (<View style={styles.pulseGrid}>
          {Array.from({ length: 6 }).map((_, index) => (<ShimmerBlock key={index} width="31%" height={54} borderRadius={14}/>))}
        </View>) : null}
      {shape === 'media' ? <ShimmerBlock height={154} borderRadius={16}/> : null}
      {shape !== 'pulse' && shape !== 'media' ? Array.from({ length: rowCount }).map((_, index) => (<View key={index} style={styles.sectionRow}>
          <ShimmerBlock width={42} height={42} borderRadius={14}/>
          <View style={styles.rowCopy}>
            <ShimmerBlock width="68%" height={13}/>
            <ShimmerBlock width="88%" height={10}/>
          </View>
        </View>)) : null}
    </View>);
}
export function DashboardSkeleton() {
    const { colors } = useAppTheme();
    const responsive = useResponsiveLayout();
    const layout = resolveResidentDashboardLayout(responsive.width, responsive.height);
    const leftColumn = (<View style={[styles.column, createViewGapStyle(layout.sectionGap)]}> 
      <DashboardSectionSkeleton shape="priority"/>
      <DashboardSectionSkeleton shape="pulse"/>
      <DashboardSectionSkeleton shape="timeline"/>
      <DashboardSectionSkeleton shape="complaint"/>
      <DashboardSectionSkeleton shape="timeline"/>
    </View>);
    const rightColumn = (<View style={[styles.column, createViewGapStyle2(layout.sectionGap)]}> 
      <DashboardSectionSkeleton shape="matrix"/>
      <DashboardSectionSkeleton shape="finance"/>
      <DashboardSectionSkeleton shape="editorial"/>
      <DashboardSectionSkeleton shape="editorial"/>
      <DashboardSectionSkeleton shape="media"/>
    </View>);
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" testID="resident-dashboard-skeleton">
      <View style={[styles.identityHeader, createViewBackgroundColorStyle2(colors.primary)]}> 
        <View style={styles.headerTop}>
          <View style={styles.headerCopy}>
            <ShimmerBlock width="32%" height={12}/>
            <ShimmerBlock width="72%" height={26}/>
            <ShimmerBlock width="58%" height={13}/>
          </View>
          <View style={styles.headerActions}>
            <ShimmerBlock width={44} height={44} borderRadius={16}/>
            <ShimmerBlock width={44} height={44} borderRadius={22}/>
          </View>
        </View>
        <ShimmerBlock height={40} borderRadius={12}/>
      </View>
      <ContentFrame maxWidth={layout.contentMaxWidth} style={styles.frame}>
        {layout.usesTwoPane ? (<View style={[styles.twoPane, createViewGapStyle3(layout.horizontalGap)]}> 
            <View style={styles.left}>{leftColumn}</View>
            <View style={styles.right}>{rightColumn}</View>
          </View>) : (<View style={styles.phone}>{leftColumn}{rightColumn}</View>)}
      </ContentFrame>
    </View>);
}
export default DashboardSkeleton;


import { View } from "react-native";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import { styles, createViewBorderColorBackgroundColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBackgroundColorStyle5 } from "../styles/components/ResidenceAccessSkeleton.styles";
interface ResidenceAccessSkeletonProps {
    readonly count?: number;
}
export function ResidenceAccessSkeleton({ count = 3 }: ResidenceAccessSkeletonProps) {
    const { colors } = useAppTheme();
    return (<View accessibilityLabel={residenceAccessMessages.common.loading} style={styles.list}>
      {Array.from({ length: count }, (_, index) => (<View key={`residence-skeleton-${index}`} style={[styles.card, createViewBorderColorBackgroundColorStyle(colors.border, colors.surface)]}>
          <View style={[styles.image, createViewBackgroundColorStyle(colors.surfaceMuted)]}/>
          <View style={styles.content}>
            <View style={[styles.title, createViewBackgroundColorStyle2(colors.surfaceMuted)]}/>
            <View style={[styles.line, createViewBackgroundColorStyle3(colors.surfaceMuted)]}/>
            <View style={[styles.badge, createViewBackgroundColorStyle4(colors.surfaceMuted)]}/>
            <View style={[styles.button, createViewBackgroundColorStyle5(colors.surfaceMuted)]}/>
          </View>
        </View>))}
    </View>);
}


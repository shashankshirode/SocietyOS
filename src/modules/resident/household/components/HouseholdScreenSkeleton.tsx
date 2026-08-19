import { View } from "react-native";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBackgroundColorStyle5 } from "../styles/components/HouseholdScreenSkeleton.styles";
type HouseholdScreenSkeletonProps = {
    variant?: 'summary' | 'family' | 'tenant' | 'emergency' | 'access' | 'pending';
};
export function HouseholdScreenSkeleton({ variant = 'summary' }: HouseholdScreenSkeletonProps) {
    const { colors } = useAppTheme();
    const card = [styles.card, { backgroundColor: colors.surface, borderColor: colors.border }];
    return (<View style={card}>
      <View style={[styles.bar, createViewBackgroundColorStyle(colors.backgroundSoft)]}/>
      <View style={[styles.bar, createViewBackgroundColorStyle2(colors.backgroundSoft)]}/>
      {variant === 'family' || variant === 'emergency' || variant === 'pending' ? (<View style={[styles.row, createViewBackgroundColorStyle3(colors.backgroundSoft)]}/>) : null}
      {variant === 'tenant' ? <View style={[styles.row, createViewBackgroundColorStyle4(colors.backgroundSoft)]}/> : null}
      {variant === 'access' ? <View style={[styles.row, createViewBackgroundColorStyle5(colors.backgroundSoft)]}/> : null}
    </View>);
}


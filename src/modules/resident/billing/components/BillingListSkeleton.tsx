import { View } from "react-native";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { styles, createViewBackgroundColorStyle, createViewWidthBackgroundColorStyle, createViewBackgroundColorStyle2 } from "../styles/components/BillingListSkeleton.styles";
export function BillingListSkeleton() {
    const theme = useResidentTheme();
    const fill = theme.accentSoft;
    return (<View testID="billing-list-skeleton" style={styles.stack} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.hero, createViewBackgroundColorStyle(fill)]}/>
      <View style={styles.chips}>
        {[84, 72, 66, 86].map((width) => <View key={width} style={[styles.chip, createViewWidthBackgroundColorStyle(width, fill)]}/>)}
      </View>
      {[0, 1, 2, 3].map((index) => <View key={index} style={[styles.row, createViewBackgroundColorStyle2(fill)]}/>)}
    </View>);
}


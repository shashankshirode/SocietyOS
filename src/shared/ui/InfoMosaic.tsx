import { View } from "react-native";
import { SafeText } from "../typography/SafeText";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle4, createViewBackgroundColorBorderColorStyle2, createViewBackgroundColorBorderColorStyle3 } from "./styles/InfoMosaic.styles";
interface MosaicItem {
    value: string;
    label: string;
    trend?: string;
    isPositive?: boolean;
}
interface InfoMosaicProps {
    primary: MosaicItem;
    secondaryLeft: MosaicItem;
    secondaryRight: MosaicItem;
}
export function InfoMosaic({ primary, secondaryLeft, secondaryRight }: InfoMosaicProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      
      <View style={[styles.card, styles.primaryCard, createViewBackgroundColorBorderColorStyle(colors.card, colors.border)]}>
        <SafeText variant="caption" color="muted">
          {primary.label}
        </SafeText>
        <SafeText variant="display" style={[styles.primaryVal, createSafeTextColorStyle4(colors.textPrimary)]}>
          {primary.value}
        </SafeText>
        {primary.trend ? (<SafeText variant="tiny" style={createSafeTextColorStyle(primary.isPositive ? colors.success : colors.danger)}>
            {primary.trend}
          </SafeText>) : null}
      </View>

      
      <View style={styles.secondaryRow}>
        <View style={[styles.card, styles.secondaryCard, createViewBackgroundColorBorderColorStyle2(colors.card, colors.border)]}>
          <SafeText variant="caption" color="muted">
            {secondaryLeft.label}
          </SafeText>
          <SafeText variant="h2" style={createSafeTextColorStyle2(colors.textPrimary)}>
            {secondaryLeft.value}
          </SafeText>
        </View>
        <View style={[styles.card, styles.secondaryCard, createViewBackgroundColorBorderColorStyle3(colors.card, colors.border)]}>
          <SafeText variant="caption" color="muted">
            {secondaryRight.label}
          </SafeText>
          <SafeText variant="h2" style={createSafeTextColorStyle3(colors.textPrimary)}>
            {secondaryRight.value}
          </SafeText>
        </View>
      </View>
    </View>);
}


import { View } from "react-native";
import { SafeText } from "../typography/SafeText";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewWidthHeightBorderRadiusBorderColorBackgroundColorStyle, createSafeTextColorStyle } from "./styles/ProgressArc.styles";
interface ProgressArcProps {
    percentage: number;
    label?: string;
    size?: number;
}
export function ProgressArc({ percentage, label, size = 120 }: ProgressArcProps) {
    const { colors } = useAppTheme();
    return (<View style={styles.container}>
      <View style={[
            styles.circle,
            createViewWidthHeightBorderRadiusBorderColorBackgroundColorStyle(size, size, size / 2, colors.border, colors.backgroundSoft),
        ]}>
        <SafeText variant="h1" style={[styles.valText, createSafeTextColorStyle(colors.textPrimary)]}>
          {percentage}%
        </SafeText>
      </View>
      {label ? (<SafeText variant="caption" color="secondary" style={styles.label}>
          {label}
        </SafeText>) : null}
    </View>);
}


import { View } from "react-native";
import { AppText } from "../../../shared/components/AppText";
import { useAppTheme } from "../../../shared/theme/useAppTheme";
import { residenceAccessMessages } from "../../../messages/en/residenceAccess.messages";
import { styles, createViewBackgroundColorStyle, createViewWidthBackgroundColorStyle } from "../styles/components/ResidenceAccessProgress.styles";
interface ResidenceAccessProgressProps {
    readonly completed: number;
    readonly total: number;
    readonly showLabel?: boolean;
}
export function ResidenceAccessProgress({ completed, total, showLabel = true, }: ResidenceAccessProgressProps) {
    const { colors } = useAppTheme();
    const safeTotal = Math.max(1, total);
    const safeCompleted = Math.min(Math.max(0, completed), safeTotal);
    const percentage = Math.round((safeCompleted / safeTotal) * 100);
    if (total <= 0) {
        return null;
    }
    return (<View style={styles.container} accessible accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: completed }} accessibilityLabel={residenceAccessMessages.accessibility.progress(completed, total)}>
      {showLabel ? (<View style={styles.labelRow}>
          <AppText variant="caption" tone="secondary">
            {residenceAccessMessages.list.progress(completed, total)}
          </AppText>
          <AppText variant="caption" weight="700" color={colors.primary}>
            {`${percentage}%`}
          </AppText>
        </View>) : null}
      <View style={[styles.track, createViewBackgroundColorStyle(colors.surfaceMuted)]}>
        <View style={[
            styles.fill,
            createViewWidthBackgroundColorStyle(`${percentage}%`, colors.primary),
        ]}/>
      </View>
    </View>);
}


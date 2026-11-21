import { View } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { residentColors } from "../../shared/theme/residentColors";
import type { ResidentPrioritySummaryData } from "../../modules/resident/dashboard/data/dashboard.types";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorStyle } from "./styles/ResidentPrioritySummary.styles";
export interface ResidentPrioritySummaryProps {
    summary: ResidentPrioritySummaryData;
}
export function ResidentPrioritySummary({ summary }: ResidentPrioritySummaryProps) {
    const { colors, dark } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(dark ? colors.surfaceElevated : residentColors.lightElevatedSurface, colors.border)]}> 
      <SafeText variant="tiny" color="muted" numberOfLines={1} style={styles.label}>
        {summary.label}
      </SafeText>
      <SafeText variant="title" style={createSafeTextColorStyle(colors.primary)} numberOfLines={1}>
        {summary.value}
      </SafeText>
    </View>);
}


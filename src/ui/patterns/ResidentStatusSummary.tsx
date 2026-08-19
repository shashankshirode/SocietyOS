import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorBorderColorStyle, createSafeTextColorStyle3, createViewBackgroundColorStyle } from "./styles/ResidentStatusSummary.styles";
export interface ResidentStatusItem {
    id: string;
    label: string;
    status: string;
    isCompleted: boolean;
}
export interface ResidentStatusSummaryProps {
    title: string;
    items: ResidentStatusItem[];
}
export function ResidentStatusSummary({ title, items }: ResidentStatusSummaryProps) {
    const theme = useResidentTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
      <SafeText variant="bodyStrong" style={[styles.title, createSafeTextColorStyle3(theme.textPrimary)]}>
        {title}
      </SafeText>

      <View style={styles.list}>
        {items.map((item) => (<View key={item.id} style={styles.row}>
            <View style={styles.left}>
              <View style={[styles.dot, createViewBackgroundColorStyle(item.isCompleted ? theme.success : theme.warning)]}/>
              <SafeText variant="caption" style={createSafeTextColorStyle(theme.textPrimary)}>
                {item.label}
              </SafeText>
            </View>
            <View style={styles.right}>
              <SafeText variant="tiny" style={createSafeTextColorStyle2(item.isCompleted ? theme.success : theme.warning)}>
                {item.status}
              </SafeText>
              <Ionicons name={item.isCompleted ? "checkmark-circle-outline" : "ellipse-outline"} size={14} color={item.isCompleted ? theme.success : theme.warning}/>
            </View>
          </View>))}
      </View>
    </View>);
}
export default ResidentStatusSummary;


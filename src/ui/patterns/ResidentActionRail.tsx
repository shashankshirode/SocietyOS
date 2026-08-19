import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useResidentTheme } from "../foundation/residentTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { styles, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createSafeTextColorStyle, createViewBackgroundColorStyle2 } from "./styles/ResidentActionRail.styles";
export interface ResidentAction {
    id: string;
    label: string;
    iconName: string;
    badge?: string;
    onPress: () => void;
}
export interface ResidentActionRailProps {
    actions: ResidentAction[];
}
export function ResidentActionRail({ actions }: ResidentActionRailProps) {
    const theme = useResidentTheme();
    return (<View style={styles.container}>
      {actions.map((action) => (<PressableScale key={action.id} onPress={action.onPress} style={styles.actionItem}>
          <View style={[styles.tile, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
            <View style={[styles.iconWrap, createViewBackgroundColorStyle(theme.accentSoft)]}>
              <Ionicons name={action.iconName as keyof typeof Ionicons.glyphMap} size={20} color={theme.accent}/>
            </View>
            <SafeText variant="caption" style={[styles.label, createSafeTextColorStyle(theme.textPrimary)]} numberOfLines={2}>
              {action.label}
            </SafeText>
            {action.badge && (<View style={[styles.badge, createViewBackgroundColorStyle2(theme.danger)]}>
                <SafeText variant="tiny" style={styles.badgeText}>{action.badge}</SafeText>
              </View>)}
          </View>
        </PressableScale>))}
    </View>);
}
export default ResidentActionRail;


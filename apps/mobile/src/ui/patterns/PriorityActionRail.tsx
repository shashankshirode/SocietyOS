import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import type { PriorityAction } from "../../modules/resident/dashboard/data/dashboard.types";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2 } from "./styles/PriorityActionRail.styles";
export interface PriorityActionRailProps {
    actions: PriorityAction[];
    onActionPress: (id: string) => void;
}
export function PriorityActionRail({ actions, onActionPress }: PriorityActionRailProps) {
    const { colors, dark } = useAppTheme();
    if (actions.length === 0)
        return null;
    const [primary, ...secondary] = actions;
    return (<View style={styles.container}>
      
      {primary && (<PressableScale onPress={() => onActionPress(primary.id)}>
          <View style={[styles.primaryCard, createViewBackgroundColorStyle(colors.primary)]}>
            <View style={styles.primaryIconWrap}>
              <Ionicons name={primary.iconName as keyof typeof Ionicons.glyphMap} size={28} color="#FFFFFF"/>
            </View>
            <View style={styles.primaryText}>
              <SafeText variant="title" style={styles.primaryLabel}>{primary.label}</SafeText>
              <SafeText variant="caption" style={styles.primaryDesc} numberOfLines={1}>{primary.description}</SafeText>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)"/>
          </View>
        </PressableScale>)}

      
      <View style={styles.secondaryRow}>
        {secondary.map((action) => {
            const isCritical = action.urgency === 'critical';
            const cardBg = isCritical
                ? (dark ? '#450A0A' : '#FEF2F2')
                : (dark ? colors.surfaceElevated : colors.surface);
            const iconColor = isCritical
                ? (dark ? '#F87171' : '#DC2626')
                : colors.primary;
            const iconBg = isCritical
                ? (dark ? 'rgba(248,113,113,0.15)' : 'rgba(220,38,38,0.08)')
                : (dark ? 'rgba(129,140,248,0.15)' : 'rgba(67,56,202,0.08)');
            return (<PressableScale key={action.id} onPress={() => onActionPress(action.id)} style={styles.secondaryItem}>
              <View style={[styles.secondaryCard, createViewBackgroundColorBorderColorStyle(cardBg, dark ? colors.border : '#E5E7EB')]}>
                <View style={[styles.secondaryIconWrap, createViewBackgroundColorStyle2(iconBg)]}>
                  <Ionicons name={action.iconName as keyof typeof Ionicons.glyphMap} size={20} color={iconColor}/>
                </View>
                <SafeText variant="caption" color="primary" style={styles.secondaryLabel} numberOfLines={2}>
                  {action.label}
                </SafeText>
              </View>
            </PressableScale>);
        })}
      </View>
    </View>);
}


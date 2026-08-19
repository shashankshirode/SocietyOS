import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { PressableScale } from "../../shared/motion/PressableScale";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import type { ResidentPriorityItem, ResidentPriorityTone } from "../../modules/resident/dashboard/data/dashboard.types";
import { styles, createViewBackgroundColorBorderColorShadowColorStyle, createSafeTextColorStyle, createViewBackgroundColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3 } from "./styles/ResidentPriorityCard.styles";
export interface ResidentPriorityCardProps {
    item: ResidentPriorityItem;
    onActionPress: (id: string) => void;
    rank?: number;
}
export function ResidentPriorityCard({ item, onActionPress, rank }: ResidentPriorityCardProps) {
    const { colors } = useAppTheme();
    const toneColors: Record<ResidentPriorityTone, {
        accent: string;
        soft: string;
    }> = {
        info: { accent: colors.info, soft: colors.infoSoft },
        warning: { accent: colors.warning, soft: colors.warningSoft },
        danger: { accent: colors.danger, soft: colors.dangerSoft },
        success: { accent: colors.success, soft: colors.successSoft },
    };
    const accent = toneColors[item.tone].accent;
    const accentSoft = toneColors[item.tone].soft;
    return (<PressableScale onPress={() => onActionPress(item.actionId ?? item.id)} accessibilityRole="button" accessibilityLabel={item.actionLabel}>
      <View style={[styles.card, createViewBackgroundColorBorderColorShadowColorStyle(colors.surface, colors.border, colors.shadow)]}> 
        <View style={styles.leading}> 
          {rank ? (<SafeText variant="tiny" style={[styles.rank, createSafeTextColorStyle(accent)]}> 
              {String(rank).padStart(2, '0')}
            </SafeText>) : null}
          <View style={[styles.iconWrap, createViewBackgroundColorStyle(accentSoft)]}> 
            <Ionicons name={item.iconName} size={20} color={accent}/>
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <SafeText variant="bodyStrong" color="primary" numberOfLines={2} style={styles.title}>
              {item.title}
            </SafeText>
            <SafeText variant="tiny" style={[styles.meta, createSafeTextColorStyle2(accent)]} numberOfLines={1}>
              {item.metaLabel}
            </SafeText>
          </View>
          <SafeText variant="caption" color="secondary" numberOfLines={2}>
            {item.description}
          </SafeText>
          <View style={styles.actionRow}>
            <SafeText variant="caption" style={[styles.actionLabel, createSafeTextColorStyle3(accent)]} numberOfLines={1}>
              {item.actionLabel}
            </SafeText>
            <Ionicons name="chevron-forward" size={14} color={accent}/>
          </View>
        </View>
      </View>
    </PressableScale>);
}


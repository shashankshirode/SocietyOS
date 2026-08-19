import { useState } from "react";
import { ActivityIndicator, Vibration, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { PressableScale } from "../../shared/motion/PressableScale";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import type { ResidentCommandAction, ResidentCommandTone } from "../../modules/resident/dashboard/data/dashboard.types";
import { useMessages } from "../../shared/constants/useMessages";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorBorderColorStyle, createViewBorderTopColorStyle, createPressableScaleBackgroundColorStyle } from "./styles/ResidentCommandDock.styles";
export interface ResidentCommandDockProps {
    title: string;
    subtitle: string;
    actions: ResidentCommandAction[];
    onActionPress: (id: string) => void;
}
export function ResidentCommandDock({ title, subtitle, actions, onActionPress, }: ResidentCommandDockProps) {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const [expanded, setExpanded] = useState(false);
    const primaryActions = actions.slice(0, 3);
    const secondaryActions = actions.slice(3);
    const toneColors: Record<ResidentCommandTone, {
        accent: string;
        soft: string;
    }> = {
        primary: { accent: colors.primary, soft: colors.primarySoft },
        neutral: { accent: colors.textSecondary, soft: colors.surfaceMuted },
        success: { accent: colors.success, soft: colors.successSoft },
        warning: { accent: colors.warning, soft: colors.warningSoft },
        danger: { accent: colors.danger, soft: colors.dangerSoft },
    };
    const handleActionPress = (id: string) => {
        Vibration.vibrate(8);
        onActionPress(id);
    };
    const renderAction = (action: ResidentCommandAction, isPrimary: boolean) => {
        const tone = toneColors[action.tone];
        return (<PressableScale key={action.id} onPress={() => handleActionPress(action.id)} style={[styles.action, isPrimary ? styles.primaryAction : styles.secondaryAction]} accessibilityRole="button" accessibilityLabel={action.accessibilityLabel} accessibilityState={{ disabled: action.disabled, busy: action.loading }} disabled={action.disabled || action.loading}>
        <View style={[styles.iconWrap, createViewBackgroundColorStyle(tone.soft)]}> 
          {action.loading ? (<ActivityIndicator size="small" color={tone.accent}/>) : (<Ionicons name={action.iconName} size={isPrimary ? 22 : 19} color={tone.accent}/>)}
        </View>
        <SafeText variant="tiny" color="primary" align="center" numberOfLines={2} style={styles.actionLabel}>
          {action.label}
        </SafeText>
        {action.badgeLabel ? (<View style={[styles.actionBadge, createViewBackgroundColorStyle2(tone.soft)]}> 
            <SafeText variant="tiny" style={createSafeTextColorStyle(tone.accent)} numberOfLines={1}>
              {action.badgeLabel}
            </SafeText>
          </View>) : null}
      </PressableScale>);
    };
    return (<View style={styles.container} testID="resident-command-dock">
      <View style={styles.titleBlock}>
        <SafeText variant="title" color="primary" numberOfLines={1}>
          {title}
        </SafeText>
        <SafeText variant="caption" color="muted" numberOfLines={2}>
          {subtitle}
        </SafeText>
      </View>
      <View style={[styles.dock, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
        <View style={styles.primaryRow}>{primaryActions.map((action) => renderAction(action, true))}</View>
        {expanded && secondaryActions.length > 0 ? (<View style={[styles.secondaryGrid, createViewBorderTopColorStyle(colors.divider)]}> 
            {secondaryActions.map((action) => renderAction(action, false))}
          </View>) : null}
        {secondaryActions.length > 0 ? (<PressableScale onPress={() => setExpanded((current) => !current)} style={[styles.moreButton, createPressableScaleBackgroundColorStyle(colors.surfaceMuted)]} accessibilityRole="button" accessibilityState={{ expanded }}>
            <SafeText variant="caption" style={createSafeTextColorStyle2(colors.primary)}>
              {expanded
                ? messages.resident.dashboard.actions.fewerActions
                : messages.resident.dashboard.actions.moreActions}
            </SafeText>
            <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.primary}/>
          </PressableScale>) : null}
      </View>
    </View>);
}


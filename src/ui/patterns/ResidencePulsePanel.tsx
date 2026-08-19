import { View } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import type { ResidencePulseData, ResidencePulseTone } from "../../modules/resident/dashboard/data/dashboard.types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles, createSafeTextColorStyle, createViewBackgroundColorBorderColorShadowColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createSafeTextColorStyle2, createViewBorderTopColorStyle } from "./styles/ResidencePulsePanel.styles";
export interface ResidencePulsePanelProps {
    pulse: ResidencePulseData;
}
export function ResidencePulsePanel({ pulse }: ResidencePulsePanelProps) {
    const { colors } = useAppTheme();
    const toneColors: Record<ResidencePulseTone, {
        accent: string;
        soft: string;
    }> = {
        normal: { accent: colors.textMuted, soft: colors.surfaceMuted },
        info: { accent: colors.info, soft: colors.infoSoft },
        success: { accent: colors.success, soft: colors.successSoft },
        warning: { accent: colors.warning, soft: colors.warningSoft },
        danger: { accent: colors.danger, soft: colors.dangerSoft },
    };
    const needsAction = pulse.items.some((item) => item.tone === 'danger');
    const statusColor = needsAction ? colors.danger : colors.warning;
    const statusSoft = needsAction ? colors.dangerSoft : colors.warningSoft;
    return (<View style={styles.container} testID="residence-pulse-panel">
      <View style={styles.titleBlock}>
        <SafeText variant="title" color="primary" numberOfLines={1}>
          {pulse.title}
        </SafeText>
        <SafeText variant="caption" color="muted" numberOfLines={2}>
          {pulse.subtitle}
        </SafeText>
      </View>

      <View style={[styles.card, createViewBackgroundColorBorderColorShadowColorStyle(colors.surface, colors.border, colors.shadow)]}> 
        <View style={[styles.statusBand, createViewBackgroundColorStyle(statusSoft)]}> 
          <View style={[styles.statusIcon, createViewBackgroundColorStyle2(colors.surface)]}> 
            <Ionicons name={needsAction ? 'alert-circle-outline' : 'pulse-outline'} size={20} color={statusColor}/>
          </View>
          <View style={styles.statusText}>
            <SafeText variant="tiny" style={createSafeTextColorStyle(statusColor)} numberOfLines={1}>
              {pulse.centerLabel}
            </SafeText>
            <SafeText variant="title" color="primary" numberOfLines={1}>
              {pulse.centerValue}
            </SafeText>
          </View>
        </View>
        <View style={styles.indicators}>
          {pulse.items.map((item) => {
            const tone = toneColors[item.tone];
            return (<View key={item.id} style={[styles.indicator, createViewBackgroundColorStyle3(tone.soft)]}> 
                <View style={[styles.indicatorDot, createViewBackgroundColorStyle4(tone.accent)]}/>
                <SafeText variant="tiny" style={[styles.chipLabel, createSafeTextColorStyle2(tone.accent)]} numberOfLines={1}>
                  {item.label}
                </SafeText>
                <SafeText variant="caption" color="primary" numberOfLines={1} style={styles.chipValue}>
                  {item.value}
                </SafeText>
              </View>);
        })}
        </View>
        {pulse.recommendedAction ? (<View style={[styles.recommendation, createViewBorderTopColorStyle(colors.divider)]}> 
            <Ionicons name="sparkles-outline" size={16} color={colors.primary}/>
            <SafeText variant="caption" color="secondary" style={styles.recommendationText}>
              {pulse.recommendedAction}
            </SafeText>
          </View>) : null}
        {pulse.lastUpdatedLabel ? (<SafeText variant="tiny" color="muted">{pulse.lastUpdatedLabel}</SafeText>) : null}
      </View>
    </View>);
}


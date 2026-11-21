import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeText } from "../../shared/components/SafeText";
import { StatusPill, type StatusTone } from "../components/StatusPill";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { DashboardSectionHeader } from "../components/SectionHeader";
import type { ComplaintProgressData, ComplaintPriority } from "../../modules/resident/dashboard/data/dashboard.types";
import { useResponsiveLayout } from "../layout/useResponsiveLayout";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createSafeTextColorStyle3, createViewBackgroundColorStyle4, createViewWidthBackgroundColorStyle, createViewBackgroundColorStyle5 } from "./styles/ComplaintProgressPanel.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface ComplaintProgressPanelProps extends ComplaintProgressData {
    onComplaintPress?: (complaintId: string) => void;
    interactive?: boolean;
    sectionTitle?: string;
    sectionSubtitle?: string;
    slaTitle?: string;
    assignedToPrefix?: string;
    latestUpdateLabel?: string;
    nextActionLabel?: string;
    viewComplaintLabel?: string;
    additionalComplaintsLabel?: string;
    priorityLabels?: Record<ComplaintPriority, string>;
}
const priorityTones: Record<ComplaintPriority, StatusTone> = {
    low: 'neutral',
    medium: 'info',
    high: 'warning',
    critical: 'danger'
};
export function ComplaintProgressPanel({ complaintId, title, priority, assignedTo, slaRemainingLabel, slaProgressPercent, steps, latestUpdate, nextExpectedAction, additionalActiveCount, onComplaintPress, interactive = true, sectionTitle = getActiveUiLiteral("m_b3e750ba75e4"), sectionSubtitle, slaTitle = getActiveUiLiteral("m_419339cbb45f"), assignedToPrefix = getActiveUiLiteral("m_08ee4565a256"), latestUpdateLabel = getActiveUiLiteral("m_997ed3a4e617"), nextActionLabel = getActiveUiLiteral("m_b63837bbaea4"), viewComplaintLabel = getActiveUiLiteral("m_448d5c359018"), additionalComplaintsLabel, priorityLabels, }: ComplaintProgressPanelProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const { isSmall } = useResponsiveLayout();
    const clampedProgress = Math.min(Math.max(slaProgressPercent, 0), 100);
    const isUrgent = clampedProgress > 75;
    const progressColor = isUrgent
        ? colors.danger
        : colors.primary;
    const currentStepIndex = Math.max(0, steps.findIndex((step) => step.status === 'current'));
    const compactStart = Math.max(0, Math.min(currentStepIndex - 1, steps.length - 3));
    const visibleSteps = isSmall ? steps.slice(compactStart, compactStart + 3) : steps;
    return (<View style={styles.container}>
      <DashboardSectionHeader title={sectionTitle} {...includeWhenPresent("subtitle", sectionSubtitle)}/>

      <PressableScale disabled={!interactive} onPress={() => onComplaintPress?.(complaintId)}>
        <View style={[styles.card, createViewBackgroundColorBorderColorStyle(colors.surface, colors.border)]}> 
          
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <SafeText variant="tiny" color="muted">{complaintId}</SafeText>
              <StatusPill label={priorityLabels?.[priority] ?? priority.toUpperCase()} tone={priorityTones[priority]} small/>
            </View>
          </View>

          <SafeText variant="bodyStrong" color="primary" numberOfLines={2}>{title}</SafeText>

          
          <View style={styles.stepper}>
            {visibleSteps.map((step, index) => {
            const isLast = index === visibleSteps.length - 1;
            const isDone = step.status === 'done';
            const isCurrent = step.status === 'current';
            const nodeColor = isDone
                ? colors.success
                : isCurrent
                    ? colors.primary
                    : colors.border;
            const lineColor = isDone
                ? colors.successSoft
                : colors.border;
            return (<View key={step.id} style={styles.stepItem}>
                  <View style={styles.stepVisual}>
                    <View style={[
                    styles.stepNode,
                    createViewBackgroundColorStyle(nodeColor),
                    isCurrent && styles.stepNodeCurrent,
                ]}>
                      {isDone && <Ionicons name="checkmark" size={10} color={colors.textInverse}/>}
                      {isCurrent && <View style={[styles.stepPulse, createViewBackgroundColorStyle2(colors.textInverse)]}/>}
                    </View>
                    {!isLast && <View style={[styles.stepLine, createViewBackgroundColorStyle3(lineColor)]}/>}
                  </View>
                  <SafeText variant="tiny" style={[
                    styles.stepLabel,
                    createSafeTextColorStyle3(isCurrent ? colors.primary : (isDone ? colors.textSecondary : colors.textMuted)),
                ]} numberOfLines={1}>
                    {step.label}
                  </SafeText>
                </View>);
        })}
          </View>

          
          <View style={styles.slaSection}>
            <View style={styles.slaHeader}>
              <SafeText variant="tiny" color="muted">{slaTitle}</SafeText>
              <SafeText variant="tiny" style={createSafeTextColorStyle(progressColor)}>{slaRemainingLabel}</SafeText>
            </View>
            <View style={[styles.slaTrack, createViewBackgroundColorStyle4(colors.surfaceMuted)]}> 
              <View style={[styles.slaBar, createViewWidthBackgroundColorStyle(`${clampedProgress}%`, progressColor)]}/>
            </View>
          </View>

          
          <View style={styles.assignedRow}>
            <Ionicons name="people-circle-outline" size={14} color={colors.textMuted}/>
            <SafeText variant="tiny" color="muted">{assignedToPrefix} {assignedTo}</SafeText>
          </View>

          {latestUpdate ? (<View style={[styles.updateBlock, createViewBackgroundColorStyle5(colors.surfaceMuted)]}> 
              <SafeText variant="tiny" color="muted" style={styles.updateLabel}>{latestUpdateLabel}</SafeText>
              <SafeText variant="caption" color="primary">{latestUpdate}</SafeText>
            </View>) : null}

          {nextExpectedAction ? (<View style={styles.nextActionRow}>
              <Ionicons name="arrow-forward-circle-outline" size={16} color={colors.primary}/>
              <View style={styles.nextActionText}>
                <SafeText variant="tiny" color="muted">{nextActionLabel}</SafeText>
                <SafeText variant="caption" color="primary">{nextExpectedAction}</SafeText>
              </View>
            </View>) : null}

          {interactive && (<View style={styles.footerRow}>
              {additionalActiveCount && additionalActiveCount > 0 && additionalComplaintsLabel ? (<SafeText variant="tiny" color="muted">{additionalComplaintsLabel}</SafeText>) : <View />}
              <View style={styles.viewAction}>
                <SafeText variant="caption" style={createSafeTextColorStyle2(colors.primary)}>
                  {viewComplaintLabel}
                </SafeText>
                <Ionicons name="chevron-forward" size={15} color={colors.primary}/>
              </View>
            </View>)}
        </View>
      </PressableScale>
    </View>);
}


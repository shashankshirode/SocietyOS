import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeText } from "../../shared/components/SafeText";
import { StatusPill, type StatusTone } from "../components/StatusPill";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { PressableScale } from "../../shared/motion/PressableScale";
import { useReducedMotion } from "../../shared/motion/useReducedMotion";
import { DashboardSectionHeader } from "../components/SectionHeader";
import type { VisitorAccessItem, VisitorType, VisitorStatus, AccessType } from "../../modules/resident/dashboard/data/dashboard.types";
import { ResidentDisplayName } from "../typography/ResidentDisplayName";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createPressableBackgroundColorStyle, createViewPaddingLeftPaddingRightStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle2, createViewBackgroundColorStyle3, createViewBackgroundColorBorderColorShadowColorStyle, createViewBackgroundColorStyle4, createViewBackgroundColorStyle5, createViewBackgroundColorStyle6 } from "./styles/VisitorAccessTimeline.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { formatUiLiteral } from "../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../shared/localization/activeUiLiteral";
export interface VisitorAccessTimelineProps {
    items: VisitorAccessItem[];
    onCreateVisitorPress: () => void;
    onVisitorPress: (visitorId: string) => void;
    onViewAllPress?: () => void;
    contentPaddingHorizontal?: number;
    title?: string;
    subtitle?: string;
    createPassLabel?: string;
    viewAllLabel?: string;
    noVisitorsLabel?: string;
    noVisitorsCtaLabel?: string;
    statusLabels?: Partial<Record<VisitorStatus, string>>;
    accessLabels?: Partial<Record<AccessType, string>>;
    otpLabel?: string;
}
const visitorTypeIcons: Record<VisitorType, keyof typeof Ionicons.glyphMap> = {
    guest: 'people-outline',
    delivery: 'bicycle-outline',
    cab: 'car-sport-outline',
    vendor: 'storefront-outline',
    staff: 'people-circle-outline',
    domesticHelp: 'home-outline'
};
const statusTones: Record<VisitorStatus, StatusTone> = {
    upcoming: 'info',
    waitingAtGate: 'warning',
    inside: 'success',
    exitConfirmationRequired: 'danger',
    completed: 'neutral',
    expired: 'muted',
    cancelled: 'danger'
};
const defaultStatusLabels: Record<VisitorStatus, string> = {
    upcoming: 'Upcoming',
    waitingAtGate: getActiveUiLiteral("m_d9c6fb1eb014"),
    inside: 'Inside',
    exitConfirmationRequired: 'Confirm exit',
    completed: 'Done',
    expired: 'Expired',
    cancelled: 'Cancelled'
};
const defaultAccessLabels: Record<AccessType, string> = {
    oneDay: 'One-Day',
    limitedHours: 'Limited',
    recurring: 'Recurring',
    expired: 'Expired'
};
const accessTones: Record<AccessType, StatusTone> = {
    oneDay: 'info',
    limitedHours: 'warning',
    recurring: 'neutral',
    expired: 'muted'
};
export function VisitorAccessTimeline({ items, onCreateVisitorPress, onVisitorPress, onViewAllPress, contentPaddingHorizontal = 20, title = getActiveUiLiteral("m_87209f8a9b7d"), subtitle, createPassLabel = getActiveUiLiteral("m_dcaa9ee4aa0a"), viewAllLabel, noVisitorsLabel = getActiveUiLiteral("m_ba9c8f4f4953"), noVisitorsCtaLabel = getActiveUiLiteral("m_911bf7379819"), statusLabels: statusLabelsProp, accessLabels: accessLabelsProp, otpLabel = 'OTP', }: VisitorAccessTimelineProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { colors } = useAppTheme();
    const reducedMotion = useReducedMotion();
    const timelineColor = colors.border;
    const resolvedStatusLabels = { ...defaultStatusLabels, ...statusLabelsProp };
    const resolvedAccessLabels = { ...defaultAccessLabels, ...accessLabelsProp };
    const nodeActiveColor = colors.primary;
    return (<View style={styles.container}>
      <DashboardSectionHeader title={title} subtitle={subtitle ?? formatUiLiteral(localizedUiText.m_8ac655935efb, [items.length])} actionLabel={viewAllLabel ?? createPassLabel} onActionPress={onViewAllPress ?? onCreateVisitorPress}/>

      {items.length === 0 ? (<View style={[styles.emptyState, createViewBackgroundColorStyle(colors.surface)]}> 
          <Ionicons name="people-outline" size={32} color={colors.textMuted}/>
          <SafeText variant="body" color="muted" align="center">{noVisitorsLabel}</SafeText>
          <Pressable onPress={onCreateVisitorPress} style={[styles.emptyCta, createPressableBackgroundColorStyle(colors.primary)]}>
            <SafeText variant="caption" style={createSafeTextColorStyle(colors.textInverse)}>{noVisitorsCtaLabel}</SafeText>
          </Pressable>
        </View>) : (<View style={[styles.timeline, createViewPaddingLeftPaddingRightStyle(contentPaddingHorizontal, contentPaddingHorizontal)]}>
          {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isActive = item.status === 'upcoming' || item.status === 'inside' || item.status === 'waitingAtGate';
                const needsExit = item.status === 'exitConfirmationRequired';
                const nodeColor = needsExit ? colors.danger : isActive ? nodeActiveColor : colors.textMuted;
                return (<Animated.View key={item.id} {...includeWhenPresent("entering", reducedMotion ? undefined : FadeInDown.delay(index * 60).duration(300))}>
                <PressableScale onPress={() => onVisitorPress(item.id)}>
                  <View style={styles.timelineItem}>
                    
                    <View style={styles.timelineLeft}>
                      <View style={[styles.node, createViewBackgroundColorBorderColorStyle(nodeColor, isActive ? `${nodeColor}40` : 'transparent')]}>
                        {item.status === 'inside' && (<View style={[styles.nodeInner, createViewBackgroundColorStyle2(colors.textInverse)]}/>)}
                      </View>
                      {!isLast && <View style={[styles.line, createViewBackgroundColorStyle3(timelineColor)]}/>}
                    </View>

                    
                    <View style={[
                        styles.card,
                        createViewBackgroundColorBorderColorShadowColorStyle(colors.surface, colors.border, colors.shadow),
                    ]}>
                      <View style={styles.cardHeader}>
                        <View style={[styles.typeIconWrap, createViewBackgroundColorStyle4(colors.primarySoft)]}> 
                          <Ionicons name={visitorTypeIcons[item.visitorType]} size={16} color={colors.primary}/>
                        </View>
                        <View style={styles.cardHeaderText}>
                          <ResidentDisplayName displayName={item.visitorName} variant="bodyStrong" color="primary"/>
                          <SafeText variant="tiny" color="muted" numberOfLines={1}>{item.purpose}</SafeText>
                        </View>
                        <StatusPill label={resolvedStatusLabels[item.status]} tone={statusTones[item.status]} small/>
                      </View>

                      <View style={styles.cardMeta}>
                        <View style={styles.metaRow}>
                          <Ionicons name="time-outline" size={12} color={colors.textMuted}/>
                          <SafeText variant="tiny" color="muted" style={styles.metaText}>{item.validFrom} · {item.validTill}</SafeText>
                        </View>
                        <View style={styles.metaRow}>
                          <Ionicons name="location-outline" size={12} color={colors.textMuted}/>
                          <SafeText variant="tiny" color="muted">{item.gateName}</SafeText>
                        </View>
                      </View>

                      {item.securityConfirmationLabel ? (<View style={[styles.securityRow, createViewBackgroundColorStyle5(needsExit ? colors.dangerSoft : colors.surfaceMuted)]}> 
                          <Ionicons name={needsExit ? 'alert-circle-outline' : 'shield-checkmark-outline'} size={13} color={needsExit ? colors.danger : colors.textSecondary}/>
                          <SafeText variant="tiny" style={createSafeTextColorStyle2(needsExit ? colors.danger : colors.textSecondary)}>
                            {item.securityConfirmationLabel}
                          </SafeText>
                        </View>) : null}

                      <View style={styles.cardFooter}>
                        <StatusPill label={resolvedAccessLabels[item.accessType]} tone={accessTones[item.accessType]} small/>
                        {item.otpAvailable && (<View style={[styles.otpBadge, createViewBackgroundColorStyle6(colors.warningSoft)]}> 
                            <Ionicons name="key-outline" size={11} color={colors.warning}/>
                            <SafeText variant="tiny" style={createSafeTextColorStyle3(colors.warning)}>{otpLabel}</SafeText>
                          </View>)}
                      </View>
                    </View>
                  </View>
                </PressableScale>
              </Animated.View>);
            })}
        </View>)}
    </View>);
}


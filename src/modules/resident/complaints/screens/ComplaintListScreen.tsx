import { useMemo, useState } from "react";
import { Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComplaintListScreenProps } from "../../../../app/navigation/navigation.types";
import { formatResidentDate } from "../../../../core/localization/dateTimeFormatters";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { SafeText } from "../../../../shared/components/SafeText";
import { useMessages } from "../../../../shared/constants/useMessages";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import type { ComplaintPriority, ComplaintStatus } from "../../../../shared/types/complaint.types";
import { StatusPill, type StatusTone } from "../../../../ui/components/StatusPill";
import { useResidentTheme } from "../../../../ui/foundation/residentTheme";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { WrapRow } from "../../../../ui/layout/WrapRow";
import { useResponsiveLayout } from "../../../../ui/layout/useResponsiveLayout";
import { ListSkeleton } from "../../../../ui/loading/ListSkeleton";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { ScreenEmptyState } from "../../../../ui/states/ScreenEmptyState";
import { ScreenErrorState } from "../../../../ui/states/ScreenErrorState";
import { resolveResidentTabBarObstruction } from "../../navigation/useResidentTabBarLayout";
import { getAppPlatform } from "../../../../shared/platform";
import { useComplaints } from "../data/useComplaints";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createPressableBackgroundColorBorderColorStyle, createViewBackgroundColorBorderColorStyle, createViewBackgroundColorStyle3, createViewBackgroundColorStyle4, createViewBorderTopColorStyle, createViewBottomStyle, createPressableScaleBackgroundColorStyle, createScrollPaddingBottomStyle } from "../styles/screens/ComplaintListScreen.styles";
type FilterType = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
const categoryIcons = {
    PLUMBING: 'water-outline',
    LIFT: 'arrow-up-circle-outline',
    SECURITY: 'shield-outline',
    HOUSEKEEPING: 'sparkles-outline',
    PARKING: 'car-outline',
    NOISE: 'volume-high-outline',
    WATER_LEAKAGE: 'rainy-outline',
    ELECTRICAL: 'flash-outline',
    OTHER: 'help-circle-outline',
} as const;
function getPriorityTone(priority: ComplaintPriority): StatusTone {
    if (priority === 'URGENT')
        return 'danger';
    if (priority === 'HIGH')
        return 'warning';
    return 'info';
}
function getStatusTone(status: ComplaintStatus): StatusTone {
    if (status === 'RESOLVED' || status === 'CLOSED')
        return 'success';
    if (status === 'IN_PROGRESS' || status === 'WAITING_FOR_RESIDENT')
        return 'info';
    if (status === 'REOPENED')
        return 'danger';
    return 'warning';
}
export function ComplaintListScreen({ navigation }: ComplaintListScreenProps) {
    const theme = useResidentTheme();
    const messages = useMessages();
    const complaintMessages = messages.complaints;
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const tabBarObstruction = resolveResidentTabBarObstruction(width, insets.bottom, getAppPlatform());
    const { isTablet } = useResponsiveLayout();
    const { isEnabled } = useFeatureFlags();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const { data: complaints = [], isLoading, error, refetch } = useComplaints();
    const filteredComplaints = useMemo(() => complaints.filter((complaint) => {
        if (filter === 'OPEN')
            return complaint.status === 'OPEN' || complaint.status === 'REOPENED';
        if (filter === 'IN_PROGRESS')
            return complaint.status === 'IN_PROGRESS' || complaint.status === 'WAITING_FOR_RESIDENT';
        if (filter === 'RESOLVED')
            return complaint.status === 'RESOLVED';
        if (filter === 'CLOSED')
            return complaint.status === 'CLOSED';
        return true;
    }), [complaints, filter]);
    const chips: {
        key: FilterType;
        label: string;
    }[] = [
        { key: 'ALL', label: complaintMessages.filterAll },
        { key: 'OPEN', label: complaintMessages.statusOpen },
        { key: 'IN_PROGRESS', label: complaintMessages.statusInProgress },
        { key: 'RESOLVED', label: complaintMessages.statusResolved },
        { key: 'CLOSED', label: complaintMessages.statusClosed },
    ];
    const header = (<ResidentPageHeader title={messages.resident.navigation.complaints.title} subtitle={messages.resident.navigation.complaints.subtitle} showBackButton/>);
    const emptyMessages = filter === 'OPEN'
        ? complaintMessages.empty.open
        : filter === 'IN_PROGRESS'
            ? complaintMessages.empty.inProgress
            : filter === 'RESOLVED'
                ? complaintMessages.empty.resolved
                : filter === 'CLOSED'
                    ? complaintMessages.empty.closed
                    : complaintMessages.empty.all;
    const priorityLabels: Record<ComplaintPriority, string> = {
        LOW: complaintMessages.priorityLow,
        MEDIUM: complaintMessages.priorityMedium,
        HIGH: complaintMessages.priorityHigh,
        URGENT: complaintMessages.priorityUrgent,
    };
    const statusLabels: Record<ComplaintStatus, string> = {
        OPEN: complaintMessages.statusOpen,
        IN_PROGRESS: complaintMessages.statusInProgress,
        WAITING_FOR_RESIDENT: complaintMessages.statusWaitingForResident,
        RESOLVED: complaintMessages.statusResolved,
        CLOSED: complaintMessages.statusClosed,
        REOPENED: complaintMessages.statusReopened,
    };
    if (!isEnabled('complaints')) {
        return <View style={[styles.root, createViewBackgroundColorStyle(theme.background)]}>{header}<ScreenEmptyState title={complaintMessages.featureUnavailableTitle} description={complaintMessages.featureUnavailableDescription} iconName="lock-closed-outline"/></View>;
    }
    return (<View style={[styles.root, createViewBackgroundColorStyle2(theme.background)]}>
      {header}
      <ContentFrame style={styles.tabContainer}>
        <WrapRow gap={8}>
          {chips.map((chip) => {
            const selected = filter === chip.key;
            return (<Pressable key={chip.key} onPress={() => setFilter(chip.key)} accessibilityRole="button" accessibilityState={{ selected }} testID={`complaint-filter-${chip.key}`} style={[styles.tabChip, createPressableBackgroundColorBorderColorStyle(selected ? theme.selectedBackground : theme.surface, selected ? theme.selectedBorder : theme.border)]}>
                <SafeText variant="tiny" style={createSafeTextColorStyle(selected ? theme.selectedForeground : theme.textSecondary)}>{chip.label}</SafeText>
              </Pressable>);
        })}
        </WrapRow>
      </ContentFrame>

      {isLoading ? (<ContentFrame style={styles.loading}><ListSkeleton count={4}/></ContentFrame>) : error ? (<ScreenErrorState title={complaintMessages.errorTitle} message={complaintMessages.errorDescription} onRetry={refetch}/>) : filteredComplaints.length === 0 ? (<ScreenEmptyState title={emptyMessages.title} description={emptyMessages.description} iconName="chatbox-ellipses-outline" primaryAction={{ label: complaintMessages.actionRaise, onPress: () => navigation.navigate('CreateComplaint') }}/>) : (<ScrollView contentContainerStyle={[styles.scrollContent, createScrollPaddingBottomStyle(tabBarObstruction + 72)]} showsVerticalScrollIndicator={false}>
          <ContentFrame style={styles.list}>
            {filteredComplaints.map((complaint) => (<PressableScale key={complaint.id} onPress={() => navigation.navigate('ComplaintDetail', { complaint })} accessibilityLabel={complaintMessages.openComplaintAccessibility(complaint.title)} style={isTablet ? styles.tabletCardWrapper : styles.cardWrapper}>
                <View style={[styles.card, createViewBackgroundColorBorderColorStyle(theme.surface, theme.border)]}>
                  {complaint.slaText ? (<View style={[styles.slaRibbon, createViewBackgroundColorStyle3(theme.accentSoft)]}>
                      <Ionicons name="time-outline" size={12} color={theme.accent}/>
                      <SafeText variant="tiny" style={createSafeTextColorStyle2(theme.accent)}>{complaintMessages.slaLabel}: {complaint.slaText}</SafeText>
                    </View>) : null}
                  <View style={styles.cardHeader}>
                    <View style={[styles.catIconWrap, createViewBackgroundColorStyle4(theme.background)]}>
                      <Ionicons name={categoryIcons[complaint.category]} size={17} color={theme.accent}/>
                    </View>
                    <View style={styles.headerInfo}>
                      <SafeText variant="bodyStrong" style={createSafeTextColorStyle3(theme.textPrimary)} numberOfLines={2}>{complaint.title}</SafeText>
                      <SafeText variant="tiny" color="muted">{complaintMessages.createdOn(formatResidentDate(complaint.createdAt))}</SafeText>
                    </View>
                  </View>
                  <View style={[styles.cardFooter, createViewBorderTopColorStyle(theme.border)]}>
                    <WrapRow gap={6}>
                      <StatusPill label={priorityLabels[complaint.priority]} tone={getPriorityTone(complaint.priority)} small/>
                      <StatusPill label={statusLabels[complaint.status]} tone={getStatusTone(complaint.status)} small/>
                    </WrapRow>
                    <Ionicons name="chevron-forward" size={16} color={theme.textSecondary}/>
                  </View>
                </View>
              </PressableScale>))}
          </ContentFrame>
        </ScrollView>)}

      {complaints.length > 0 ? <View style={[styles.fabContainer, createViewBottomStyle(tabBarObstruction + 16)]}>
        <PressableScale onPress={() => navigation.navigate('CreateComplaint')} accessibilityLabel={complaintMessages.addComplaintAccessibility} style={[styles.fab, createPressableScaleBackgroundColorStyle(theme.selectedBackground)]}>
          <Ionicons name="add" size={20} color={theme.selectedForeground}/>
          <SafeText variant="bodyStrong" style={createSafeTextColorStyle(theme.selectedForeground)}>{complaintMessages.actionRaise}</SafeText>
        </PressableScale>
      </View> : null}
    </View>);
}
export default ComplaintListScreen;

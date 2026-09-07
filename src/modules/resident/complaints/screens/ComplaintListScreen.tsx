import { useMemo, useState } from "react";
import { ScrollView, View, Pressable, useWindowDimensions } from "react-native";
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
import { StyleSheet } from "react-native";
import { Screen } from "../../../../design-system/layouts";
import { Button } from "../../../../design-system/components";
import { Card } from "../../../../design-system/components";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { spacing, colors, getColors } from "../../../../design-system/tokens/premium-index";

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

const chips: { key: FilterType; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'OPEN', label: 'Open' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'RESOLVED', label: 'Resolved' },
    { key: 'CLOSED', label: 'Closed' },
];

export function ComplaintListScreen({ navigation }: ComplaintListScreenProps) {
    const { dark } = useAppTheme();
    const themeColors = getColors(dark ? 'dark' : 'light');
    const insets = useSafeAreaInsets();
    const { width } = useWindowDimensions();
    const tabBarObstruction = resolveResidentTabBarObstruction(width, insets.bottom, getAppPlatform());
    const { isEnabled } = useFeatureFlags();
    const [filter, setFilter] = useState<FilterType>('ALL');
    const { data: complaints = [], isLoading, error, refetch } = useComplaints();
    const complaintMessages = useMessages().complaints;
    const messages = useMessages();
    const filteredComplaints = useMemo(() => {
        if (filter === 'ALL')
            return complaints;
        return complaints.filter((c) => c.status === filter);
    }, [complaints, filter]);
    const isTablet = useResponsiveLayout().isTablet;
    const priorityLabels: Record<ComplaintPriority, string> = {
        URGENT: complaintMessages.priorityUrgent,
        HIGH: complaintMessages.priorityHigh,
        MEDIUM: complaintMessages.priorityMedium,
        LOW: complaintMessages.priorityLow,
    };
    const statusLabels: Record<ComplaintStatus, string> = {
        OPEN: complaintMessages.statusOpen,
        IN_PROGRESS: complaintMessages.statusInProgress,
        WAITING_FOR_RESIDENT: complaintMessages.statusInProgress || 'Waiting',
        RESOLVED: complaintMessages.statusResolved,
        CLOSED: complaintMessages.statusClosed,
        REOPENED: complaintMessages.statusReopened,
    };
    const emptyConfig = useMemo(() => {
        if (filter === 'ALL') return complaintMessages.empty.all;
        if (filter === 'OPEN') return complaintMessages.empty.open;
        if (filter === 'IN_PROGRESS') return complaintMessages.empty.inProgress;
        if (filter === 'RESOLVED') return complaintMessages.empty.resolved;
        if (filter === 'CLOSED') return complaintMessages.empty.closed;
        return complaintMessages.empty.all;
    }, [filter, complaintMessages]);
    if (!isEnabled('complaints')) {
        return (
            <Screen
                title={complaintMessages.featureUnavailableTitle}
                subtitle={complaintMessages.featureUnavailableDescription}
                showBackButton
                onBack={() => navigation.goBack()}
            >
                <View style={styles.unavailableContainer}>
                    <SafeText variant="bodyStrong" style={{ color: themeColors.text.primary }}>{complaintMessages.featureUnavailableTitle}</SafeText>
                    <SafeText variant="caption" style={{ color: themeColors.text.secondary }}>{complaintMessages.featureUnavailableDescription}</SafeText>
                </View>
            </Screen>
        );
    }
    return (
        <Screen
            title={messages.resident.navigation.complaints.title}
            subtitle={messages.resident.navigation.complaints.subtitle}
            showBackButton
            onBack={() => navigation.goBack()}
        >
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                    {chips.map((chip) => {
                        const selected = filter === chip.key;
                        return (
                            <Pressable key={chip.key} onPress={() => setFilter(chip.key)} accessibilityRole="button" accessibilityState={{ selected }} testID={`complaint-filter-${chip.key}`} style={[
                                styles.tabChip,
                                { backgroundColor: selected ? themeColors.brand.primary : themeColors.surface.secondary, borderColor: selected ? themeColors.brand.primary : themeColors.border.default },
                            ]}>
                                <SafeText variant="tiny" style={{ color: selected ? themeColors.text.inverse : themeColors.text.secondary }}>
                                    {chip.label}
                                </SafeText>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarObstruction + 72 }]} showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <ListSkeleton count={4} />
                ) : error ? (
                    <ScreenErrorState title={complaintMessages.errorTitle} message={complaintMessages.errorDescription} onRetry={refetch} />
                ) : filteredComplaints.length === 0 ? (
                    <ScreenEmptyState
                        title={emptyConfig.title}
                        description={emptyConfig.description}
                        iconName="chatbox-ellipses-outline"
                        primaryAction={{ label: complaintMessages.actionRaise, onPress: () => navigation.navigate('CreateComplaint') }}
                    />
                ) : (
                    <>
                        <View style={styles.list}>
                            {filteredComplaints.map((complaint) => (
                                <PressableScale key={complaint.id} onPress={() => navigation.navigate('ComplaintDetail', { complaint })} accessibilityLabel={complaintMessages.openComplaintAccessibility(complaint.title)} style={isTablet ? styles.tabletCardWrapper : styles.cardWrapper}>
                                    <Card variant="elevated" padding="md">
                                        {complaint.slaText ? (
                                            <View style={styles.slaRibbon}>
                                                <Ionicons name="time-outline" size={12} color={themeColors.brand.primary} />
                                                <SafeText variant="tiny" style={{ color: themeColors.brand.primary }}>{complaintMessages.slaLabel}: {complaint.slaText}</SafeText>
                                            </View>
                                        ) : null}
                                        <View style={styles.cardHeader}>
                                            <View style={styles.catIconWrap}>
                                                <Ionicons name={categoryIcons[complaint.category]} size={17} color={themeColors.brand.primary} />
                                            </View>
                                            <View style={styles.headerInfo}>
                                                <SafeText variant="bodyStrong" style={{ color: themeColors.text.primary }} numberOfLines={2}>{complaint.title}</SafeText>
                                                <SafeText variant="tiny" color="muted">{complaintMessages.createdOn(formatResidentDate(complaint.createdAt))}</SafeText>
                                            </View>
                                        </View>
                                        <View style={styles.cardFooter}>
                                            <WrapRow gap={6}>
                                                <StatusPill label={priorityLabels[complaint.priority]} tone={getPriorityTone(complaint.priority)} small />
                                                <StatusPill label={statusLabels[complaint.status]} tone={getStatusTone(complaint.status)} small />
                                            </WrapRow>
                                            <Ionicons name="chevron-forward" size={16} color={themeColors.text.secondary} />
                                        </View>
                                    </Card>
                                </PressableScale>
                            ))}
                        </View>
                        {complaints.length > 0 && (
                            <View style={styles.fabContainer}>
                                <PressableScale onPress={() => navigation.navigate('CreateComplaint')} accessibilityLabel={complaintMessages.addComplaintAccessibility} style={[styles.fab, { backgroundColor: themeColors.brand.primary }]}>
                                    <Ionicons name="add" size={20} color={themeColors.text.inverse} />
                                    <SafeText variant="bodyStrong" style={{ color: themeColors.text.inverse }}>{complaintMessages.actionRaise}</SafeText>
                                </PressableScale>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    unavailableContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    tabContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    tabScroll: {
        gap: 8,
    },
    tabChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 16,
    },
    list: {
        gap: 12,
    },
    cardWrapper: {
        width: '100%',
    },
    tabletCardWrapper: {
        width: '48%',
    },
    slaRibbon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    catIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    headerInfo: {
        flex: 1,
        gap: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    fabContainer: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        zIndex: 10,
    },
    fab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
});

export default ComplaintListScreen;

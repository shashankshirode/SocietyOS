import { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useVisitors } from "../data/useVisitors";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useFeatureFlags } from "../../../../core/featureFlags/useFeatureFlag";
import { SafeText } from "../../../../shared/components/SafeText";
import { PressableScale } from "../../../../shared/motion/PressableScale";
import { DeliveryPreApprovalPanel } from "../components/DeliveryPreApprovalPanel";
import { PartyPassModal } from "../components/PartyPassModal";
import type { VisitorListScreenProps } from "../../../../app/navigation/navigation.types";
import type { VisitorAccessItem, VisitorType, VisitorStatus, AccessType } from "../../dashboard/data/dashboard.types";
import { formatVisitorEntryExit } from "../../../../core/localization/dateTimeFormatters";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
import { useMessages } from "../../../../messages/useMessages";
import { StatusPill, type StatusTone } from "../../../../ui/components/StatusPill";
import { ScreenEmptyState } from "../../../../ui/states/ScreenEmptyState";
import { SocietyPageShell } from "../../experience/SocietyPageShell";
import { ResidentAppHeader } from "../../navigation/ResidentAppHeader";
import { FilterChipBar, type EliteFilterOption } from "../../../../shared/components/FilterChipBar";
import { Spacing } from "../../../../shared/theme/spacing";
import { Radius } from "../../../../shared/theme/radius";
import { VisitorTabFilter } from "../data/visitors.enums";

function getVisitorStatusTone(status: VisitorStatus): StatusTone {
    switch (status) {
        case 'upcoming':
            return 'warning';
        case 'inside':
            return 'info';
        case 'completed':
            return 'success';
        case 'expired':
            return 'muted';
        case 'cancelled':
            return 'danger';
        default:
            return 'neutral';
    }
}

function getVisitorCategoryIcon(type: VisitorType): keyof typeof Ionicons.glyphMap {
    switch (type) {
        case 'delivery':
            return 'bicycle-outline';
        case 'cab':
            return 'car-outline';
        case 'vendor':
            return 'construct-outline';
        case 'guest':
        default:
            return 'person-outline';
    }
}

export function VisitorListScreen({ navigation }: VisitorListScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const messages = useMessages();
    const theme = useAppTheme();
    const { isEnabled } = useFeatureFlags();
    const [activeTab, setActiveTab] = useState<VisitorTabFilter>(VisitorTabFilter.ALL);
    const [partyPassModalVisible, setPartyPassModalVisible] = useState(false);
    const { data: visitorsData = [] } = useVisitors();

    const mappedVisitors = useMemo((): VisitorAccessItem[] => {
        return visitorsData.map((v) => {
            let mappedStatus: VisitorStatus = 'upcoming';
            if (v.status === 'COMPLETED')
                mappedStatus = 'completed';
            else if (v.status === 'EXPIRED')
                mappedStatus = 'expired';
            else if (v.status === 'REJECTED' || v.status === 'CANCELLED')
                mappedStatus = 'cancelled';
            else if (v.actualEntryTime && !v.actualExitTime)
                mappedStatus = 'inside';

            let mappedType: VisitorType = 'guest';
            if (v.type === 'DELIVERY')
                mappedType = 'delivery';
            else if (v.type === 'CAB')
                mappedType = 'cab';
            else if (v.type === 'VENDOR')
                mappedType = 'vendor';

            let validFrom = v.expectedTime || '12:00 PM';
            let validTill = '8:00 PM';
            if (v.exitTracking?.expectedEntryAtIso) {
                const formatted = formatVisitorEntryExit(v.exitTracking.expectedEntryAtIso, v.exitTracking.expectedExitAtIso);
                validFrom = formatted.validFrom;
                validTill = formatted.validTill;
            }
            else if (v.expectedDate && v.expectedTime) {
                const entryIso = `${v.expectedDate}T${v.expectedTime}:00`;
                const formatted = formatVisitorEntryExit(entryIso);
                validFrom = formatted.validFrom;
                validTill = formatted.validTill;
            }

            return {
                id: v.id,
                visitorName: v.name,
                visitorType: mappedType,
                accessType: 'oneDay' as AccessType,
                purpose: v.purpose || String(localizedUiText.m_1c8ac867f052),
                validFrom,
                validTill,
                status: mappedStatus,
                gateName: 'Main Gate',
                otpAvailable: v.status === 'APPROVED' || v.status === 'EXPECTED',
            };
        });
    }, [visitorsData, localizedUiText]);

    const filteredVisitors = useMemo(() => {
        return mappedVisitors.filter((v) => {
            if (activeTab === VisitorTabFilter.ALL)
                return true;
            if (activeTab === VisitorTabFilter.UPCOMING)
                return v.status === 'upcoming';
            if (activeTab === VisitorTabFilter.INSIDE)
                return v.status === 'inside';
            if (activeTab === VisitorTabFilter.COMPLETED)
                return v.status === 'completed';
            if (activeTab === VisitorTabFilter.PAST)
                return v.status === 'expired' || v.status === 'cancelled';
            return true;
        });
    }, [mappedVisitors, activeTab]);

    const upcomingCount = mappedVisitors.filter((v) => v.status === 'upcoming').length;
    const insideCount = mappedVisitors.filter((v) => v.status === 'inside').length;
    const completedCount = mappedVisitors.filter((v) => v.status === 'completed').length;
    const pastCount = mappedVisitors.filter((v) => v.status === 'expired' || v.status === 'cancelled').length;

    const filterOptions: EliteFilterOption<VisitorTabFilter>[] = [
        { label: 'All', value: VisitorTabFilter.ALL, count: mappedVisitors.length },
        { label: messages.visitors.arrivingSection, value: VisitorTabFilter.UPCOMING, count: upcomingCount },
        { label: messages.visitors.atGateSection, value: VisitorTabFilter.INSIDE, count: insideCount },
        { label: messages.visitors.enteredTodaySection, value: VisitorTabFilter.COMPLETED, count: completedCount },
        { label: messages.visitors.pastSection, value: VisitorTabFilter.PAST, count: pastCount },
    ];

    if (!isEnabled('visitorManagement')) {
        return (
            <SocietyPageShell showHeader={false} showDockClearance={true} testID="visitor-list-screen">
                <ResidentAppHeader
                    showBackButton={true}
                    onBackPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        }
                    }}
                    fallbackTab="HomeTab"
                    fallbackRoute="ResidentHome"
                    showNarrative={false}
                />
                <View style={styles.unavailableContainer}>
                    <SafeText variant="bodyStrong" color="primary">
                        Visitor Management Unavailable
                    </SafeText>
                    <SafeText variant="caption" color="secondary">
                        This feature is not enabled for your society
                    </SafeText>
                </View>
            </SocietyPageShell>
        );
    }

    return (
        <SocietyPageShell showHeader={false} showDockClearance={true} testID="visitor-list-screen">
            <ResidentAppHeader
                showBackButton={true}
                onBackPress={() => {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    }
                }}
                fallbackTab="HomeTab"
                fallbackRoute="ResidentHome"
                showNarrative={false}
            />

            <View style={styles.pageContent}>
                <View style={styles.heroSection}>
                    <View style={styles.heroBadgeRow}>
                        <View style={[styles.eyebrowBadge, { backgroundColor: theme.semantic.surface.soft }]}>
                            <Ionicons name="shield-checkmark" size={14} color={theme.semantic.accent.moss} />
                            <SafeText variant="tiny" style={[styles.eyebrowText, { color: theme.semantic.accent.moss }]}>
                                Visitor Passes
                            </SafeText>
                        </View>
                    </View>

                    <SafeText variant="display" color="primary" style={styles.heroTitle}>
                        {messages.visitors.arrivalWorldTitle}
                    </SafeText>

                    <SafeText variant="body" color="secondary" style={styles.heroSubtitle}>
                        {upcomingCount > 0
                            ? messages.visitors.expectedToday(upcomingCount)
                            : messages.visitors.quietToday}
                    </SafeText>
                </View>

                <PressableScale
                    onPress={() => navigation.navigate('CreateVisitorPass')}
                    style={[styles.primaryActionBtn, { backgroundColor: theme.semantic.accent.moss }]}
                >
                    <Ionicons name="add-circle" size={20} color={theme.semantic.text.inverse} />
                    <SafeText variant="bodyStrong" style={{ color: theme.semantic.text.inverse }}>
                        Create Visitor Pass
                    </SafeText>
                </PressableScale>

                <DeliveryPreApprovalPanel />

                <PressableScale
                    onPress={() => setPartyPassModalVisible(true)}
                    style={styles.partyPassCard}
                >
                    <View style={styles.partyPassLeft}>
                        <View style={styles.partyIconBadge}>
                            <Ionicons name="sparkles" size={20} color="#D97706" />
                        </View>
                        <View style={styles.partyPassTextCol}>
                            <SafeText variant="bodyStrong" style={{ color: '#92400E' }}>
                                Host an Event / Party Pass
                            </SafeText>
                            <SafeText variant="caption" style={{ color: '#B45309' }}>
                                Single digital invite link for multiple guests
                            </SafeText>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#D97706" />
                </PressableScale>

                <View style={styles.filterSection}>
                    <FilterChipBar
                        options={filterOptions}
                        value={activeTab}
                        onChange={(val) => setActiveTab(val)}
                    />
                </View>

                <View style={styles.listSection}>
                    {filteredVisitors.length > 0 ? (
                        filteredVisitors.map((item) => {
                            const rawVisitor = visitorsData.find((v) => v.id === item.id);
                            const statusTone = getVisitorStatusTone(item.status);
                            const categoryIcon = getVisitorCategoryIcon(item.visitorType);

                            return (
                                <PressableScale
                                    key={item.id}
                                    onPress={() => {
                                        if (rawVisitor) {
                                            navigation.navigate('VisitorDetail', { visitor: rawVisitor as never });
                                        }
                                    }}
                                    style={[
                                        styles.visitorCard,
                                        {
                                            backgroundColor: theme.semantic.surface.raised,
                                            borderColor: theme.semantic.border.subtle,
                                        },
                                    ]}
                                >
                                    <View style={styles.visitorCardHeader}>
                                        <View style={styles.visitorIdentityWrap}>
                                            <View
                                                style={[
                                                    styles.visitorAvatar,
                                                    { backgroundColor: theme.semantic.surface.soft },
                                                ]}
                                            >
                                                <Ionicons
                                                    name={categoryIcon}
                                                    size={20}
                                                    color={theme.semantic.accent.moss}
                                                />
                                            </View>
                                            <View style={styles.visitorNameCol}>
                                                <SafeText variant="bodyStrong" color="primary">
                                                    {item.visitorName}
                                                </SafeText>
                                                <SafeText variant="caption" color="secondary">
                                                    {item.purpose}
                                                </SafeText>
                                            </View>
                                        </View>
                                        <StatusPill label={item.status.toUpperCase()} tone={statusTone} small />
                                    </View>

                                    <View
                                        style={[
                                            styles.visitorCardFooter,
                                            { borderTopColor: theme.semantic.border.subtle },
                                        ]}
                                    >
                                        <View style={styles.visitorMetaRow}>
                                            <View style={styles.metaChip}>
                                                <Ionicons name="time-outline" size={14} color={theme.semantic.text.tertiary} />
                                                <SafeText variant="tiny" color="secondary">
                                                    {item.validFrom} - {item.validTill}
                                                </SafeText>
                                            </View>
                                            <View style={styles.metaChip}>
                                                <Ionicons name="location-outline" size={14} color={theme.semantic.text.tertiary} />
                                                <SafeText variant="tiny" color="secondary">
                                                    {item.gateName}
                                                </SafeText>
                                            </View>
                                        </View>
                                        <Ionicons name="chevron-forward" size={16} color={theme.semantic.text.tertiary} />
                                    </View>
                                </PressableScale>
                            );
                        })
                    ) : (
                        <ScreenEmptyState
                            title="No Visitors Scheduled"
                            description="There are no active visitor passes under this category. Generate a pass for your guests or deliveries."
                            iconName="people-outline"
                            primaryAction={{
                                label: "+ Create Visitor Pass",
                                onPress: () => navigation.navigate('CreateVisitorPass'),
                            }}
                        />
                    )}
                </View>
            </View>

            <PartyPassModal
                visible={partyPassModalVisible}
                onClose={() => setPartyPassModalVisible(false)}
            />
        </SocietyPageShell>
    );
}

const styles = StyleSheet.create({
    pageContent: {
        gap: Spacing.md,
        paddingTop: Spacing.xs,
    },
    heroSection: {
        gap: Spacing.xs,
    },
    heroBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyebrowBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: Radius.pill,
    },
    eyebrowText: {
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.6,
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: '700',
        lineHeight: 32,
    },
    heroSubtitle: {
        fontSize: 15,
        lineHeight: 22,
    },
    primaryActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.control,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    partyPassCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(245, 158, 11, 0.12)',
        borderColor: 'rgba(245, 158, 11, 0.35)',
        borderWidth: 1,
        borderRadius: Radius.card,
        padding: Spacing.md,
    },
    partyPassLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    partyIconBadge: {
        width: 40,
        height: 40,
        borderRadius: Radius.control,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    partyPassTextCol: {
        flex: 1,
        gap: 2,
    },
    filterSection: {
        marginTop: 2,
    },
    listSection: {
        gap: Spacing.sm,
    },
    visitorCard: {
        borderRadius: Radius.card,
        borderWidth: 1,
        padding: Spacing.md,
        gap: Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    visitorCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: Spacing.sm,
    },
    visitorIdentityWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    visitorAvatar: {
        width: 42,
        height: 42,
        borderRadius: Radius.control,
        alignItems: 'center',
        justifyContent: 'center',
    },
    visitorNameCol: {
        flex: 1,
        gap: 2,
    },
    visitorCardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: StyleSheet.hairlineWidth,
        paddingTop: Spacing.xs,
    },
    visitorMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    metaChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    unavailableContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
});

export default VisitorListScreen;

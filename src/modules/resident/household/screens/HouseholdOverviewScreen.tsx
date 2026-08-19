import React from "react";
import { ScrollView, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../../../app/navigation/navigation.types";
import { useResponsiveLayout } from "../../../../ui/layout/useResponsiveLayout";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { ResidentPageHeader } from "../../../../ui/patterns/ResidentPageHeader";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { AppButton } from "../../../../shared/components/AppButton";
import { SafeText } from "../../../../shared/components/SafeText";
import { useHouseholdOverview } from "../hooks/useHouseholdOverview";
import { HouseholdIdentityCard } from "../components/HouseholdIdentityCard";
import { HouseholdReadinessPanel } from "../components/HouseholdReadinessPanel";
import { FamilyMemberPreviewRow } from "../components/FamilyMemberPreviewRow";
import { TenantOccupancyCard } from "../components/TenantOccupancyCard";
import { EmergencyContactPreviewRow } from "../components/EmergencyContactPreviewRow";
import { HouseholdAccessSummary } from "../components/HouseholdAccessSummary";
import { HouseholdPendingActionCard } from "../components/HouseholdPendingActionCard";
import { HouseholdEmptyState } from "../components/HouseholdEmptyState";
import { HouseholdScreenSkeleton } from "../components/HouseholdScreenSkeleton";
import { HouseholdSectionHeader } from "../components/HouseholdSectionHeader";
import { t } from "../components/householdComponentUtils";
import type { HouseholdSummary } from "../data/residentHousehold.types";
import { residentHouseholdRepository } from "../data/residentHousehold.repository";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { resolveRequestContext } from "../../homeContext/utils/resolveRequestContext";
import { styles, createViewBackgroundColorStyle } from "../styles/screens/HouseholdOverviewScreen.styles";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<HomeStackParamList, 'HouseholdOverview'>;
type HouseholdPendingActionHandlers = {
    onTenantStatus: () => void;
    onEmergencyContacts: () => void;
};
function buildHouseholdSummaryFromOverview(overview: Awaited<ReturnType<typeof residentHouseholdRepository.getHouseholdOverview>>, handlers: HouseholdPendingActionHandlers): HouseholdSummary {
    return {
        residenceId: overview.unitId,
        societyId: 'society-green-valley',
        unitId: overview.unitId,
        occupancyStatus: overview.currentTenantCount > 0 ? 'tenantOccupied' : 'ownerOccupied',
        familyMemberCount: overview.familyMemberCount,
        activeAccessCount: overview.activeFamilyAccessCount,
        emergencyContactCount: overview.emergencyContactCount,
        pendingActionCount: overview.pendingTenantRequestCount,
        familyMembers: [
            { id: '1', fullName: 'Sunita Deshmukh', get relationship() {
                    return getActiveUiLiteral("m_86605cac7f06");
                }, get statusLabel() {
                    return getActiveUiLiteral("m_f46bbef836ad");
                }, get accessLabel() {
                    return getActiveUiLiteral("m_4538f2dc67b5");
                }, isEmergencyContact: true },
            { id: '2', fullName: 'Aniket Deshmukh', get relationship() {
                    return getActiveUiLiteral("m_4e850716074e");
                }, get statusLabel() {
                    return getActiveUiLiteral("m_5717c39b819d");
                }, get accessLabel() {
                    return getActiveUiLiteral("m_8d5940a39442");
                }, isEmergencyContact: false },
        ].slice(0, overview.familyMemberCount > 0 ? 2 : 0),
        tenantSummary: overview.currentTenantCount > 0 ? { name: 'Rohan Mehta', moveInLabel: '12 April 2026', verificationLabel: getActiveUiLiteral("m_a8597126e3e8") } : null,
        emergencyContacts: [
            { id: '1', name: 'Sunita Deshmukh', get relationship() {
                    return getActiveUiLiteral("m_1700917b69b2");
                }, get verificationLabel() {
                    return getActiveUiLiteral("m_4f7838402f37");
                }, isPrimary: true },
            { id: '2', name: 'Rahul Patil', relationship: getActiveUiLiteral("m_eb2e414de4c6"), get verificationLabel() {
                    return getActiveUiLiteral("m_f4c4a9c652c4");
                }, isPrimary: false },
        ].slice(0, overview.emergencyContactCount > 0 ? 2 : 0),
        accessSummary: {
            activeAccessCount: overview.activeFamilyAccessCount,
            permissions: [
                { get label() {
                        return getActiveUiLiteral("m_645448427092");
                    }, value: `${overview.familyMemberCount > 0 ? 3 : 0} members` },
                { get label() {
                        return getActiveUiLiteral("m_f583f83f8f06");
                    }, value: `${overview.familyMemberCount > 0 ? 2 : 0} members` },
                { get label() {
                        return getActiveUiLiteral("m_92c0692d1853");
                    }, value: overview.familyMemberCount > 0 ? 'Limited' : 'None' },
            ],
        },
        pendingActions: [
            {
                id: 'pending-1',
                get title() {
                    return getActiveUiLiteral("m_a8597126e3e8");
                },
                get description() {
                    return getActiveUiLiteral("m_3962f8ff18c7");
                },
                severity: 'high' as const,
                get deadline() {
                    return getActiveUiLiteral("m_19e82138c35f");
                },
                get actionLabel() {
                    return getActiveUiLiteral("m_701efb8e3747");
                },
                onPress: handlers.onTenantStatus,
            },
            {
                id: 'pending-2',
                get title() {
                    return getActiveUiLiteral("m_67c0fb73d497");
                },
                get description() {
                    return getActiveUiLiteral("m_f6eb3bdd707c");
                },
                severity: 'medium' as const,
                get actionLabel() {
                    return getActiveUiLiteral("m_2d2203b66bfb");
                },
                onPress: handlers.onEmergencyContacts,
            },
        ].slice(0, overview.pendingTenantRequestCount > 0 ? 2 : 0),
        readiness: {
            status: overview.pendingTenantRequestCount > 0 ? 'actionRequired' : overview.emergencyContactCount > 0 ? 'needsReview' : 'incomplete',
            progress: Math.min(100, 20 + overview.familyMemberCount * 10 + overview.emergencyContactCount * 10 + overview.activeFamilyAccessCount * 5),
            completedItems: Math.min(10, overview.familyMemberCount + overview.emergencyContactCount + overview.activeFamilyAccessCount),
            totalItems: 10,
            get message() {
                return getActiveUiLiteral("m_405e5eaee4e7");
            },
        },
        residenceLabel: overview.unitLabel,
        societyName: overview.societyName,
        unitLabel: overview.unitLabel,
        get residenceContext() {
            return getActiveUiLiteral("m_dab5581974ad");
        },
    };
}
export function HouseholdOverviewScreen({ navigation }: Props) {
    const localizedUiText = useMessages().uiLiterals;
    const { colors } = useAppTheme();
    const { isTablet } = useResponsiveLayout();
    const { activeContext } = useActiveResidentHome();
    const messages = useMessages();
    const { data, isLoading, error, refetch } = useHouseholdOverview();
    const [summary, setSummary] = React.useState<HouseholdSummary | null>(null);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    React.useEffect(() => {
        if (!data) {
            setSummary(null);
            return;
        }
        setSummary(buildHouseholdSummaryFromOverview(data, {
            onTenantStatus: () => navigation.navigate('TenantOnboardingStatus', { requestId: 'tenant-request-001' }),
            onEmergencyContacts: () => navigation.navigate('FamilyMemberList'),
        }));
    }, [data, navigation]);
    const handleRefresh = React.useCallback(async () => {
        setIsRefreshing(true);
        try {
            const refreshed = await residentHouseholdRepository.getHouseholdOverview(resolveRequestContext({ activeHome: activeContext, dataScopeKey: activeContext.dataScopeKey }));
            setSummary(buildHouseholdSummaryFromOverview(refreshed, {
                onTenantStatus: () => navigation.navigate('TenantOnboardingStatus', { requestId: 'tenant-request-001' }),
                onEmergencyContacts: () => navigation.navigate('FamilyMemberList'),
            }));
        }
        finally {
            setIsRefreshing(false);
        }
    }, [activeContext, navigation]);
    const renderContent = () => {
        if (isLoading || (!summary && isRefreshing)) {
            return (<View style={styles.skeletonGroup}>
          <HouseholdScreenSkeleton variant="summary"/>
          <HouseholdScreenSkeleton variant="family"/>
          <HouseholdScreenSkeleton variant="tenant"/>
          <HouseholdScreenSkeleton variant="emergency"/>
          <HouseholdScreenSkeleton variant="access"/>
          <HouseholdScreenSkeleton variant="pending"/>
        </View>);
        }
        if (error || !summary) {
            return (<View style={styles.errorBlock}>
          <HouseholdEmptyState title={t(messages, 'resident.household.errors.loadTitle')} description={t(messages, 'resident.household.errors.loadDescription')} actionLabel={t(messages, 'buttons.retry')} onActionPress={refetch}/>
        </View>);
        }
        const familySection = summary.familyMemberCount > 0 ? (<View style={styles.sectionCard}>
        <HouseholdSectionHeader title={t(messages, 'resident.household.family.title')} subtitle={`${summary.familyMemberCount} ${t(messages, 'resident.household.family.membersLabel')}`} actionLabel={t(messages, 'resident.household.family.viewAll')} onActionPress={() => navigation.navigate('FamilyMemberList')}/>
        {summary.familyMembers.map((member) => (<FamilyMemberPreviewRow key={member.id} member={member} onPress={() => navigation.navigate('FamilyMemberDetail', { familyMemberId: member.id })}/>))}
        <AppButton title={t(messages, 'resident.household.family.add')} onPress={() => navigation.navigate('AddFamilyMember')} variant="outline" size="md"/>
        <AppButton title={localizedUiText.m_0a8868ce3e28} onPress={() => navigation.navigate('FamilyPortability')} variant="outline" size="md"/>
      </View>) : (<View style={styles.sectionCard}>
        <HouseholdSectionHeader title={t(messages, 'resident.household.family.title')} subtitle={t(messages, 'resident.household.family.emptySubtitle')}/>
        <HouseholdEmptyState title={t(messages, 'resident.household.family.emptyTitle')} description={t(messages, 'resident.household.family.emptyDescription')} actionLabel={t(messages, 'resident.household.family.add')} onActionPress={() => navigation.navigate('AddFamilyMember')}/>
      </View>);
        const tenantSection = (<View style={styles.sectionCard}>
        <HouseholdSectionHeader title={t(messages, 'resident.household.tenant.title')} subtitle={t(messages, 'resident.household.tenant.subtitle')}/>
        <TenantOccupancyCard summary={summary} onManageTenant={() => navigation.navigate('TenantManagement')} onViewTenant={() => navigation.navigate('TenantDetail', { tenantId: 'tenant-rohan-mehta' })}/>
      </View>);
        const emergencySection = summary.emergencyContactCount > 0 ? (<View style={styles.sectionCard}>
        <HouseholdSectionHeader title={t(messages, 'resident.household.emergency.title')} subtitle={`${summary.emergencyContactCount} ${t(messages, 'resident.household.emergency.active')}`} actionLabel={t(messages, 'resident.household.emergency.manage')} onActionPress={() => navigation.navigate('FamilyMemberList')}/>
        {summary.emergencyContacts.map((contact) => (<EmergencyContactPreviewRow key={contact.id} contact={contact}/>))}
        <AppButton title={t(messages, 'resident.household.emergency.configureSos')} onPress={() => navigation.navigate('FamilyMemberList')} variant="outline" size="md"/>
      </View>) : (<View style={styles.sectionCard}>
        <HouseholdSectionHeader title={t(messages, 'resident.household.emergency.title')} subtitle={t(messages, 'resident.household.emergency.emptySubtitle')}/>
        <HouseholdEmptyState title={t(messages, 'resident.household.emergency.emptyTitle')} description={t(messages, 'resident.household.emergency.emptyDescription')} actionLabel={t(messages, 'resident.household.emergency.manage')} onActionPress={() => navigation.navigate('FamilyMemberList')}/>
      </View>);
        const accessSection = (<View style={styles.sectionCard}>
        <HouseholdSectionHeader title={t(messages, 'resident.household.access.title')} subtitle={t(messages, 'resident.household.access.subtitle')} actionLabel={t(messages, 'resident.household.access.manage')} onActionPress={() => navigation.navigate('FamilyAccessPermissions', { familyMemberId: 'resident-owner-shashank' })}/>
        <HouseholdAccessSummary summary={summary}/>
      </View>);
        const pendingSection = summary.pendingActions.length > 0 ? (<View style={styles.sectionCard}>
        <HouseholdSectionHeader title={t(messages, 'resident.household.pending.title')} subtitle={`${summary.pendingActionCount} ${t(messages, 'resident.household.pending.active')}`}/>
        {summary.pendingActions.map((action) => (<HouseholdPendingActionCard key={action.id} action={action}/>))}
      </View>) : (<View style={styles.sectionCard}>
        <HouseholdSectionHeader title={t(messages, 'resident.household.pending.title')} subtitle={t(messages, 'resident.household.pending.completeSubtitle')}/>
        <HouseholdEmptyState title={t(messages, 'resident.household.pending.emptyTitle')} description={t(messages, 'resident.household.pending.emptyDescription')}/>
      </View>);
        return (<View style={styles.contentStack}>
        <HouseholdIdentityCard summary={summary}/>
        <HouseholdReadinessPanel summary={summary}/>
        {familySection}
        {tenantSection}
        {emergencySection}
        {accessSection}
        {pendingSection}
      </View>);
    };
    return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]}> 
      <ResidentPageHeader title={t(messages, 'resident.household.screen.title')} titleKey="resident.household.screen.title" subtitleKey="resident.household.screen.subtitle" showBackButton roleLabelKey="resident.header.roles.owner"/>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ContentFrame style={[styles.content, isTablet ? styles.tabletContent : null]}>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <SafeText variant="bodyStrong" color="primary">{t(messages, 'resident.household.screen.title')}</SafeText>
              <SafeText variant="caption" color="secondary">{t(messages, 'resident.household.screen.subtitle')}</SafeText>
            </View>
            <AppButton title={t(messages, 'buttons.refresh')} onPress={handleRefresh} variant="outline" size="sm"/>
          </View>
          {renderContent()}
          <View style={styles.bottomSpacing}/>
        </ContentFrame>
      </ScrollView>
    </View>);
}
export default HouseholdOverviewScreen;


import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { Complaint } from "../../../../shared/types/complaint.types";
import type { Notice, NoticeCategory as DetailNoticeCategory } from "../../../../shared/types/notice.types";
import type { Visitor } from "../../../../shared/types/visitor.types";
import { ErrorState } from "../../../../shared/feedback/ErrorState";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { DashboardSkeleton } from "../../../../ui/loading/DashboardSkeleton";
import { ContentFrame } from "../../../../ui/layout/ContentFrame";
import { SafeText } from "../../../../shared/components/SafeText";
import { useResponsiveLayout } from "../../../../ui/layout/useResponsiveLayout";
import type { ResidentHomeScreenProps, RootTabParamList } from "../../../../app/navigation/navigation.types";
import { useResidentDashboard } from "../hooks/useResidentDashboard";
import type { DashboardSectionKey, DashboardSectionStatus, ComplaintPriority, NoticeCategory, VisitorAccessItem } from "../data/dashboard.types";
import { createResidentDashboardPersonalization, RESIDENT_DASHBOARD_LIMITS } from "../hooks/useResidentDashboardPersonalization";
import { normalizeDashboardIsoDate } from "../data/dashboard.normalization";
import { ResidentHomeHeader } from "../../../../ui/patterns/ResidentHomeHeader";
import { FloatingSosButton } from "../../../../ui/patterns/FloatingSosButton";
import { useResidentRoleNavigation } from "../../navigation/useResidentRoleNavigation";
import { useActiveResidentHome } from "../../homeContext/hooks/useActiveResidentHome";
import { mapContextRoleToAppRole } from "../../homeContext/utils/residentHomeContextPermissions";
import { residentAmenityImageById, residentAmenityImageByName } from "../../media/residentImageUsageMap";
import { getAppPlatform } from "../../../../shared/platform";
import { resolveResidentTabBarObstruction } from "../../navigation/useResidentTabBarLayout";
import { resolveResidentDashboardLayout } from "../layout/residentDashboardLayout";
import { AmenityDiscoveryRail, ActivityOverviewSheet, AsyncContentBoundary, CommunityServiceMatrix, ComplaintJourney, DocumentReadinessPanel, FinancialSnapshot, HomePulsePanel, PriorityOverviewSheet, ResidentActivityStream, ResidentCommandDock, SocietyNoticeRail, TodayCommandCenter, VisitorJourneyTimeline } from "../components";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { styles, createSafeTextColorStyle, createViewBackgroundColorStyle, createViewBackgroundColorStyle2, createViewGapStyle, createViewGapStyle2, createViewGapStyle3, createViewGapStyle4, createViewBackgroundColorStyle3, createScrollViewPaddingBottomStyle, createViewBackgroundColorBorderColorStyle } from "../styles/screens/ResidentHomeScreen.styles";
import { getActiveUiLiteral } from "../../../../shared/localization/activeUiLiteral";
function mapVisitorType(item: VisitorAccessItem): Visitor['type'] {
    if (item.visitorType === 'delivery')
        return 'DELIVERY';
    if (item.visitorType === 'cab')
        return 'CAB';
    if (item.visitorType === 'guest')
        return 'GUEST';
    return 'VENDOR';
}
function mapVisitorStatus(item: VisitorAccessItem): Visitor['status'] {
    if (item.status === 'inside' || item.status === 'exitConfirmationRequired')
        return 'CHECKED_IN';
    if (item.status === 'waitingAtGate')
        return 'WAITING_APPROVAL';
    if (item.status === 'completed')
        return 'COMPLETED';
    if (item.status === 'expired' || item.status === 'cancelled')
        return 'EXPIRED';
    return 'EXPECTED';
}
function mapNoticeCategory(category: NoticeCategory): DetailNoticeCategory {
    if (category === 'maintenance')
        return 'MAINTENANCE';
    if (category === 'event')
        return 'FESTIVAL_EVENT';
    if (category === 'emergency')
        return 'EMERGENCY';
    if (category === 'important')
        return 'AGM_MEETING';
    return 'GENERAL';
}
function mapComplaintPriority(priority: ComplaintPriority): Complaint['priority'] {
    if (priority === 'critical')
        return 'URGENT';
    if (priority === 'high')
        return 'HIGH';
    if (priority === 'medium')
        return 'MEDIUM';
    return 'LOW';
}
export function ResidentHomeScreen({ navigation }: ResidentHomeScreenProps) {
    const localizedUiText = useMessages().uiLiterals;
    void localizedUiText;
    const { colors } = useAppTheme();
    const responsive = useResponsiveLayout();
    const insets = useSafeAreaInsets();
    const dashboardLayout = useMemo(() => resolveResidentDashboardLayout(responsive.width, responsive.height), [responsive.height, responsive.width]);
    const messages = useMessages();
    const dashboardMessages = messages.resident.dashboard;
    const { canPerformAction, role } = useResidentRoleNavigation();
    const { activeContext } = useActiveResidentHome();
    const residentRoleKey = mapContextRoleToAppRole(activeContext.residentRole);
    const { data: dashboard, error, isLoading, refetch, } = useResidentDashboard();
    const [refreshing, setRefreshing] = useState(false);
    const [prioritySheetVisible, setPrioritySheetVisible] = useState(false);
    const [activitySheetVisible, setActivitySheetVisible] = useState(false);
    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await refetch();
        }
        finally {
            setRefreshing(false);
        }
    }, [refetch]);
    if (isLoading && !dashboard && !error && !refreshing) {
        return (<View style={[styles.root, createViewBackgroundColorStyle(colors.background)]} accessibilityLabel={messages.resident.loading.dashboard}>
        <DashboardSkeleton />
      </View>);
    }
    if (error || !dashboard) {
        return (<View style={[styles.root, createViewBackgroundColorStyle2(colors.background)]}> 
        <ErrorState title={dashboardMessages.errors.dashboardTitle} message={dashboardMessages.errors.dashboardDescription} retryLabel={dashboardMessages.actions.retrySection} onRetry={refetch}/>
      </View>);
    }
    const experience = createResidentDashboardPersonalization({
        dashboard,
        messages,
        role
    });
    const tabNavigation = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();
    const openVisitorTab = () => tabNavigation?.navigate('VisitorTab', { screen: 'VisitorList' });
    const openBillTab = () => tabNavigation?.navigate('BillTab', { screen: 'BillList' });
    const openComplaintTab = () => tabNavigation?.navigate('ComplaintTab', { screen: 'ComplaintList' });
    const openProfile = () => navigation.navigate('ProfileTab');
    const openDocumentVault = () => navigation.navigate('DocumentVaultHome');
    const openResidentConnect = () => navigation.navigate('ResidentConnectStack');
    const openAmenities = () => navigation.navigate('FacilityStack', { screen: 'FacilityList' });
    const openServices = () => navigation.navigate('CommunityStack', { screen: 'ResidentServiceListing' });
    const handleVisitorPress = (id: string) => {
        const item = dashboard.visitorTimeline.find((visitor) => visitor.id === id);
        if (!item)
            return;
        const visitor: Visitor = {
            id: item.id,
            homeContextId: activeContext.homeContextId,
            societyId: activeContext.societyId,
            unitId: activeContext.unitId,
            dataScopeKey: activeContext.dataScopeKey,
            name: item.visitorName,
            phone: '••••••••••',
            type: mapVisitorType(item),
            status: mapVisitorStatus(item),
            expectedDate: item.validFrom,
            expectedTime: item.validTill,
            flatNumber: activeContext.flatNumber,
            societyName: activeContext.societyName,
            purpose: item.purpose,
            otp: item.otpAvailable ? '••••••' : '—',
            createdAt: new Date().toISOString(),
            visitorCategory: item.visitorType === 'vendor' ? 'serviceProvider' : item.visitorType
        };
        navigation.navigate('VisitorDetailFromHome', { visitor });
    };
    const handleComplaintPress = () => {
        const item = dashboard.complaintProgress;
        if (!item) {
            openComplaintTab();
            return;
        }
        const complaint: Complaint = {
            id: item.complaintId,
            homeContextId: activeContext.homeContextId,
            societyId: activeContext.societyId,
            unitId: activeContext.unitId,
            dataScopeKey: activeContext.dataScopeKey,
            title: item.title,
            description: item.latestUpdate ?? item.title,
            category: 'OTHER',
            status: item.steps.some((step) => step.status === 'current' && step.label === 'Resolved')
                ? 'RESOLVED'
                : 'IN_PROGRESS',
            priority: mapComplaintPriority(item.priority),
            location: activeContext.displayUnitName,
            flatNumber: activeContext.flatNumber,
            residentName: dashboard.residentName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            slaText: item.slaRemainingLabel,
            assignedTo: item.assignedTo,
            updates: item.latestUpdate
                ? [{ id: `${item.complaintId}:latest`, status: 'IN_PROGRESS', note: item.latestUpdate, timestamp: new Date().toISOString() }]
                : []
        };
        navigation.navigate('ComplaintDetailFromHome', { complaint });
    };
    const handleNoticePress = (id: string) => {
        const item = dashboard.notices.find((notice) => notice.id === id);
        if (!item) {
            navigation.navigate('NoticeListFromHome');
            return;
        }
        const notice: Notice = {
            id: item.id,
            homeContextId: activeContext.homeContextId,
            societyId: activeContext.societyId,
            unitId: activeContext.unitId,
            dataScopeKey: activeContext.dataScopeKey,
            title: item.title,
            body: item.summary ?? item.title,
            category: mapNoticeCategory(item.category),
            date: normalizeDashboardIsoDate(item.publishedDate, new Date().toISOString()),
            postedBy: item.publishedBy ?? activeContext.societyName,
            isImportant: item.category === 'important' || item.category === 'emergency',
            priority: item.category === 'emergency' ? 'URGENT' : item.category === 'important' ? 'IMPORTANT' : 'NORMAL',
            status: item.acknowledgementStatus === 'pending' ? 'UNREAD' : 'READ',
            societyName: activeContext.societyName,
            ...includeWhenPresent("attachment", item.attachmentName
                ? { name: item.attachmentName, type: 'PDF', size: '1.2 MB' }
                : undefined),
            ...includeWhenPresent("acknowledgementRequired", item.acknowledgementRequired),
            acknowledged: item.acknowledgementStatus === 'acknowledged'
        };
        navigation.navigate('NoticeDetailFromHome', { notice });
    };
    const handlePriorityAction = (id: string) => {
        if (id.startsWith('visitor-exit-')) {
            openVisitorTab();
            return;
        }
        const actionHandlers: Record<string, () => void> = {
            'act-visitor': () => navigation.navigate('CreateVisitorFromHome'),
            'act-pay': openBillTab,
            'act-complaint': () => navigation.navigate('CreateComplaintFromHome'),
            'act-sos': () => navigation.navigate('EmergencySos'),
            'act-documents': () => navigation.navigate('UploadDocument'),
            'act-noc': () => navigation.navigate('NocRequestList'),
            'act-family': () => navigation.navigate('AddFamilyMember'),
            'act-tenant': () => navigation.navigate('TenantManagement'),
            'act-connect': openResidentConnect,
            'act-amenity': openAmenities,
            'act-notice': () => navigation.navigate('NoticeListFromHome'),
            'act-domestic-help': () => navigation.navigate('DomesticHelpStack', { screen: 'DomesticHelpHome' })
        };
        actionHandlers[id]?.();
    };
    const handleActivityPress = (id: string) => {
        const item = dashboard.activities.find((activity) => activity.id === id);
        if (!item)
            return;
        if (item.module === 'visitor')
            openVisitorTab();
        else if (item.module === 'billing')
            openBillTab();
        else if (item.module === 'complaint')
            openComplaintTab();
        else if (item.module === 'notice')
            navigation.navigate('NoticeListFromHome');
        else if (item.module === 'document')
            openDocumentVault();
        else if (item.module === 'facility')
            openAmenities();
        else if (item.module === 'residentConnect')
            openResidentConnect();
        else
            navigation.navigate('EmergencySos');
    };
    const resolveSectionStatus = (key: DashboardSectionKey, hasContent = true): DashboardSectionStatus => dashboard.sectionStates?.[key]?.status ?? (hasContent ? 'ready' : 'empty');
    const boundaryMessages = {
        errorTitle: dashboardMessages.errors.partialTitle,
        errorDescription: dashboardMessages.errors.partialDescription,
        offlineTitle: dashboardMessages.errors.offlineTitle,
        offlineDescription: dashboardMessages.errors.offlineDescription,
        retryLabel: dashboardMessages.actions.retrySection,
        onRetry: refetch
    };
    const prioritiesSection = (<AsyncContentBoundary {...boundaryMessages} status={resolveSectionStatus('priorities', experience.priorities.length > 0)} skeletonVariant="priority" emptyTitle={dashboardMessages.todayCommandCentre.noPrioritiesTitle} emptyDescription={dashboardMessages.todayCommandCentre.noPrioritiesMessage} testID="dashboard-priorities">
      <TodayCommandCenter title={dashboardMessages.todayCommandCentre.title} subtitle={dashboardMessages.todayCommandCentre.subtitle} viewAllLabel={dashboardMessages.todayCommandCentre.viewAll} emptyTitle={dashboardMessages.todayCommandCentre.noPrioritiesTitle} emptyDescription={dashboardMessages.todayCommandCentre.noPrioritiesMessage} items={experience.priorities} summary={experience.prioritySummary} onActionPress={handlePriorityAction} onViewAllPress={() => setPrioritySheetVisible(true)}/>
    </AsyncContentBoundary>);
    const pulseSection = (<AsyncContentBoundary {...boundaryMessages} status={resolveSectionStatus('pulse')} skeletonVariant="pulse" emptyTitle={messages.resident.pulse.ready} emptyDescription={messages.resident.pulse.subtitle} testID="dashboard-home-pulse">
      <HomePulsePanel pulse={experience.pulse}/>
    </AsyncContentBoundary>);
    const commandSection = (<ResidentCommandDock title={dashboardMessages.sections.commandDock} subtitle={dashboardMessages.sections.commandDockSubtitle} actions={experience.commandActions} onActionPress={handlePriorityAction}/>);
    const visitorsSection = canPerformAction('visitors') ? (<AsyncContentBoundary {...boundaryMessages} status={resolveSectionStatus('visitors', dashboard.visitorTimeline.length > 0)} skeletonVariant="timeline" emptyTitle={dashboardMessages.empty.visitorsTitle} emptyDescription={dashboardMessages.empty.visitorsDescription} testID="dashboard-visitors">
      <VisitorJourneyTimeline items={dashboard.visitorTimeline.slice(0, RESIDENT_DASHBOARD_LIMITS.visitors)} onCreateVisitorPress={() => navigation.navigate('CreateVisitorFromHome')} onVisitorPress={handleVisitorPress} onViewAllPress={openVisitorTab} title={dashboardMessages.sections.visitors} subtitle={dashboardMessages.sections.visitorsSubtitle} createPassLabel={dashboardMessages.actions.createVisitor} viewAllLabel={dashboardMessages.actions.viewAllVisitors} noVisitorsLabel={dashboardMessages.empty.visitorsTitle} noVisitorsCtaLabel={dashboardMessages.actions.createVisitor} statusLabels={{
            upcoming: dashboardMessages.status.upcoming,
            waitingAtGate: dashboardMessages.status.waitingAtGate,
            inside: dashboardMessages.status.insideSociety,
            exitConfirmationRequired: dashboardMessages.status.exitConfirmationRequired,
            completed: dashboardMessages.status.completed,
            expired: dashboardMessages.status.expired,
            cancelled: dashboardMessages.status.cancelled
        }} accessLabels={{
            oneDay: dashboardMessages.status.oneDay,
            limitedHours: dashboardMessages.status.limited,
            recurring: dashboardMessages.status.recurring,
            expired: dashboardMessages.status.expired
        }} otpLabel={dashboardMessages.status.otp}/>
    </AsyncContentBoundary>) : null;
    const financeSection = canPerformAction('maintenance') ? (<AsyncContentBoundary {...boundaryMessages} status={resolveSectionStatus('finance')} skeletonVariant="finance" emptyTitle={dashboardMessages.empty.billsTitle} emptyDescription={dashboardMessages.empty.billsDescription} testID="dashboard-finance">
      <FinancialSnapshot {...dashboard.maintenancePayment} sectionTitle={dashboardMessages.sections.finance} sectionSubtitle={dashboardMessages.sections.financeSubtitle} onPayNowPress={openBillTab} onBillPress={openBillTab} onLedgerPress={openBillTab}/>
    </AsyncContentBoundary>) : null;
    const complaintSection = canPerformAction('complaints') ? (<AsyncContentBoundary {...boundaryMessages} status={resolveSectionStatus('complaints', Boolean(dashboard.complaintProgress))} skeletonVariant="complaint" emptyTitle={dashboardMessages.empty.complaintsTitle} emptyDescription={dashboardMessages.empty.complaintsDescription} testID="dashboard-complaints">
      {dashboard.complaintProgress ? (<ComplaintJourney {...dashboard.complaintProgress} onComplaintPress={handleComplaintPress} sectionTitle={dashboardMessages.sections.complaints} sectionSubtitle={dashboardMessages.sections.complaintsSubtitle} slaTitle={dashboardMessages.complaint.slaProgress} assignedToPrefix={dashboardMessages.complaint.assignedTo} latestUpdateLabel={dashboardMessages.complaint.latestUpdate} nextActionLabel={dashboardMessages.complaint.nextAction} viewComplaintLabel={dashboardMessages.actions.viewComplaint} {...includeWhenPresent("additionalComplaintsLabel", dashboard.complaintProgress.additionalActiveCount
            ? dashboardMessages.complaint.additionalComplaints(dashboard.complaintProgress.additionalActiveCount)
            : undefined)} priorityLabels={dashboardMessages.complaint.priority}/>) : null}
    </AsyncContentBoundary>) : null;
    const isNoticesEnabled = dashboard.residenceDetails?.featureFlags?.includes('notices') ?? true;
    const noticeSection = (<AsyncContentBoundary {...boundaryMessages} status={isNoticesEnabled ? resolveSectionStatus('notices', dashboard.notices.length > 0) : 'empty'} skeletonVariant="editorial" emptyTitle={isNoticesEnabled ? dashboardMessages.empty.noticesTitle : getActiveUiLiteral("m_7d45e2bcbeee")} emptyDescription={isNoticesEnabled ? dashboardMessages.empty.noticesDescription : getActiveUiLiteral("m_ee334e545021")} testID="dashboard-notices">
      <SocietyNoticeRail notices={dashboard.notices.slice(0, RESIDENT_DASHBOARD_LIMITS.notices)} onNoticePress={handleNoticePress} onViewAllPress={() => navigation.navigate('NoticeListFromHome')} sectionTitle={dashboardMessages.sections.notices} sectionSubtitle={dashboardMessages.sections.noticesSubtitle} viewAllLabel={dashboardMessages.actions.viewAllNotices} emptyTitle={isNoticesEnabled ? dashboardMessages.empty.noticesTitle : getActiveUiLiteral("m_7d45e2bcbeee")} emptyDescription={isNoticesEnabled ? dashboardMessages.empty.noticesDescription : getActiveUiLiteral("m_ee334e545021")}/>
    </AsyncContentBoundary>);
    const documentSection = canPerformAction('documents') ? (<AsyncContentBoundary {...boundaryMessages} status={resolveSectionStatus('documents', dashboard.documents.length > 0)} skeletonVariant="editorial" emptyTitle={dashboardMessages.empty.documentsTitle} emptyDescription={dashboardMessages.empty.documentsDescription} testID="dashboard-documents">
      <DocumentReadinessPanel documents={dashboard.documents.slice(0, RESIDENT_DASHBOARD_LIMITS.documents)} onDocumentPress={(id) => navigation.navigate('DocumentDetail', { documentId: id })} onAddDocumentPress={() => navigation.navigate('UploadDocument')} onOpenVaultPress={openDocumentVault} sectionTitle={dashboardMessages.sections.documents} sectionSubtitle={dashboardMessages.sections.documentsSubtitle} securityNote={dashboardMessages.status.secureAccess} addDocumentLabel={dashboardMessages.actions.uploadDocument} openVaultLabel={dashboardMessages.actions.openDocumentVault} summaryLabels={dashboardMessages.documents} statusLabels={{
            verified: dashboardMessages.documents.verified,
            pending: dashboardMessages.documents.pending,
            expiring: dashboardMessages.documents.expiringSoon,
            expired: dashboardMessages.documents.expired,
            missing: dashboardMessages.documents.missing
        }} emptyTitle={dashboardMessages.empty.documentsTitle} emptyDescription={dashboardMessages.empty.documentsDescription}/>
    </AsyncContentBoundary>) : null;
    const amenitySection = canPerformAction('facilityBooking') && dashboard.amenities.length > 0 ? (<AsyncContentBoundary {...boundaryMessages} status={resolveSectionStatus('amenities', dashboard.amenities.length > 0)} skeletonVariant="media" emptyTitle={dashboardMessages.empty.amenitiesTitle} emptyDescription={dashboardMessages.empty.amenitiesDescription} testID="dashboard-amenities">
      <AmenityDiscoveryRail amenities={dashboard.amenities.slice(0, RESIDENT_DASHBOARD_LIMITS.amenities)} onAmenityPress={(id) => navigation.navigate('FacilityStack', { screen: 'FacilityDetail', params: { facilityId: id } })} onBookPress={(id) => navigation.navigate('FacilityStack', { screen: 'CreateFacilityBooking', params: { facilityId: id } })} onViewAllPress={openAmenities} imageAssetsByAmenityId={residentAmenityImageById} imageAssetsByAmenityName={residentAmenityImageByName} sectionTitle={dashboardMessages.sections.amenities} sectionSubtitle={dashboardMessages.sections.amenitiesSubtitle} bookLabel={dashboardMessages.actions.bookAmenity} viewAllLabel={dashboardMessages.actions.exploreAmenities} availabilityLabels={{
            available: dashboardMessages.status.available,
            limited: dashboardMessages.status.limitedSlots,
            closed: dashboardMessages.status.closed
        }} emptyTitle={dashboardMessages.empty.amenitiesTitle} emptyDescription={dashboardMessages.empty.amenitiesDescription}/>
    </AsyncContentBoundary>) : null;
    const serviceSection = canPerformAction('marketplace') ? (<AsyncContentBoundary {...boundaryMessages} status={resolveSectionStatus('services', dashboard.communityServices.length > 0)} skeletonVariant="matrix" emptyTitle={dashboardMessages.empty.servicesTitle} emptyDescription={dashboardMessages.empty.servicesDescription} testID="dashboard-services">
      <CommunityServiceMatrix services={dashboard.communityServices.slice(0, RESIDENT_DASHBOARD_LIMITS.communityServices)} onServicePress={openServices} onViewAllPress={openServices} paddingHorizontal={responsive.isTablet ? 0 : 20} sectionTitle={dashboardMessages.sections.services} sectionSubtitle={dashboardMessages.sections.servicesSubtitle} viewAllLabel={dashboardMessages.actions.viewAllServices} verifiedLabel={dashboardMessages.status.societyVerified} independentLabel={dashboardMessages.status.independentProvider} emptyTitle={dashboardMessages.empty.servicesTitle} emptyDescription={dashboardMessages.empty.servicesDescription}/>
    </AsyncContentBoundary>) : null;
    const activitySection = (<AsyncContentBoundary {...boundaryMessages} status={resolveSectionStatus('activity', dashboard.activities.length > 0)} skeletonVariant="timeline" emptyTitle={dashboardMessages.empty.activityTitle} emptyDescription={dashboardMessages.empty.activityDescription} testID="dashboard-activity">
      <ResidentActivityStream title={dashboardMessages.sections.activity} subtitle={dashboardMessages.sections.activitySubtitle} activities={dashboard.activities.slice(0, RESIDENT_DASHBOARD_LIMITS.activities)} onActivityPress={handleActivityPress} viewAllLabel={dashboardMessages.actions.viewAllActivity} {...includeWhenPresent("onViewAllPress", dashboard.activities.length > RESIDENT_DASHBOARD_LIMITS.activities
        ? () => setActivitySheetVisible(true)
        : undefined)} emptyTitle={dashboardMessages.empty.activityTitle} emptyDescription={dashboardMessages.empty.activityDescription}/>
    </AsyncContentBoundary>);
    const phoneContent = (<View style={[styles.sections, createViewGapStyle(dashboardLayout.sectionGap)]} testID="resident-dashboard-phone-layout">
      {prioritiesSection}
      {pulseSection}
      {commandSection}
      {visitorsSection}
      {dashboardLayout.usesWidePhonePairs ? (<View style={styles.widePhonePair}>
          <View style={styles.widePhonePairItem}>{financeSection}</View>
          <View style={styles.widePhonePairItem}>{complaintSection}</View>
        </View>) : (<>{financeSection}{complaintSection}</>)}
      {noticeSection}
      {documentSection}
      {amenitySection}
      {serviceSection}
      {activitySection}
    </View>);
    const tabletContent = (<View style={[styles.tabletColumns, createViewGapStyle2(dashboardLayout.horizontalGap)]} testID="resident-dashboard-tablet-layout">
      <View style={[styles.tabletLeft, createViewGapStyle3(dashboardLayout.sectionGap)]}> 
        {prioritiesSection}
        {pulseSection}
        {visitorsSection}
        {complaintSection}
        {activitySection}
      </View>
      <View style={[styles.tabletRight, createViewGapStyle4(dashboardLayout.sectionGap)]}> 
        {commandSection}
        {financeSection}
        {noticeSection}
        {documentSection}
        {amenitySection}
        {serviceSection}
      </View>
    </View>);
    const tabBarObstruction = resolveResidentTabBarObstruction(responsive.width, insets.bottom, getAppPlatform());
    return (<View style={[styles.root, createViewBackgroundColorStyle3(colors.background)]} testID="resident-dashboard">
      <ScrollView contentContainerStyle={[
            styles.scrollContent,
            createScrollViewPaddingBottomStyle(tabBarObstruction + 56 + dashboardLayout.bottomContentInset),
        ]} showsVerticalScrollIndicator={false} bounces refreshControl={(<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} colors={[colors.primary]} accessibilityLabel={dashboardMessages.accessibility.dashboardRefreshing}/>)}>
        <ResidentHomeHeader residentName={dashboard.residentName} unitLabel={dashboard.unitLabel} societyName={dashboard.societyName} roleLabel={dashboard.roleLabel} residentRoleKey={residentRoleKey} unreadNoticeCount={dashboard.unreadNoticeCount} pendingActionCount={experience.priorities.length} onProfilePress={openProfile} onNotificationsPress={() => navigation.navigate('NoticeListFromHome')}/>

        <ContentFrame style={styles.contentFrame} maxWidth={dashboardLayout.contentMaxWidth}>
          {activeContext.status === 'accessRestricted' ? (<View accessible accessibilityRole="alert" style={[styles.restrictionNotice, createViewBackgroundColorBorderColorStyle(colors.warningSoft, colors.warning)]}>
              <SafeText variant="bodyStrong" style={createSafeTextColorStyle(colors.warning)}>
                {messages.resident.homeContext.partialRestrictionTitle}
              </SafeText>
              <SafeText variant="caption" color="secondary">
                {messages.resident.homeContext.partialRestrictionDescription}
              </SafeText>
            </View>) : null}
          {dashboardLayout.usesTwoPane ? tabletContent : phoneContent}
        </ContentFrame>
      </ScrollView>

      <PriorityOverviewSheet visible={prioritySheetVisible} title={dashboardMessages.sections.commandCenter} closeLabel={messages.common.close} items={experience.priorities} onClose={() => setPrioritySheetVisible(false)} onActionPress={handlePriorityAction}/>
      <ActivityOverviewSheet visible={activitySheetVisible} title={dashboardMessages.sections.activity} closeLabel={messages.common.close} activities={dashboard.activities} onClose={() => setActivitySheetVisible(false)} onActivityPress={handleActivityPress}/>
      <FloatingSosButton />
    </View>);
}
export default ResidentHomeScreen;


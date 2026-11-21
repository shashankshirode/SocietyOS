import { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, useWindowDimensions, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { ResidentHomeScreenProps, RootTabParamList } from '../../../../app/navigation/navigation.types';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { isDevelopmentMode } from '../../../../shared/utils/isDevelopmentMode';
import { useMessages } from '../../../../shared/constants/useMessages';
import { ErrorState } from '../../../../shared/feedback/ErrorState';
import { FloatingSosButton } from '../../../../ui/patterns/FloatingSosButton';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import { useResidentRoleNavigation } from '../../navigation/useResidentRoleNavigation';
import { resolveResidentTabBarObstruction } from '../../navigation/useResidentTabBarLayout';
import { getAppPlatform } from '../../../../shared/platform';
import { useResidentDashboard } from '../hooks/useResidentDashboard';
import { useResidentGreeting } from '../hooks/useResidentGreeting';
import { useAuthSession } from '../../../../core/auth/useAuthSession';
import { createResidentDashboardPersonalization } from '../hooks/useResidentDashboardPersonalization';
import { PriorityOverviewSheet } from '../components/PriorityOverviewSheet';
import { ResidencePulseExpanded } from '../components/ResidencePulseExpanded';
import type { HomeActivityItem, VisitorAccessItem } from '../data/dashboard.types';
import { createResidencePulseSignals } from '../data/pulseSignal.model';
import { SocietyExperienceFrame } from '../../experience/SocietyExperienceFrame';
import { PartyPassModal } from '../../visitors/components/PartyPassModal';
import { UpiPaymentSheet } from '../../billing/components/UpiPaymentSheet';
import { ConnectHomeView } from '../../homeContext/components/ConnectHomeView';
import { VisitorArrivalAlertModal } from '../../visitors/components/VisitorArrivalAlertModal';
import { visitorLifecycleStore } from '../../visitors/data/visitorLifecycle.store';
import { ScenarioLabDrawer } from '../../../../core/scenario/ScenarioLabDrawer';
import { ResidentHomeSwitcherSheet } from '../../homeContext/components/ResidentHomeSwitcherSheet';
import {
  ResidencePulseSkeleton,
  VisitorTimelineSkeleton,
  BillSummarySkeleton,
} from '../../../../ui/skeletons/FeatureSkeletons';
import {
  ResidentHomeHeader,
  ResidentHomeGreeting,
  ContextualPriorityCard,
  ResidentQuickActions,
  ResidentHomePulse,
  HomeActivityTimeline,
  CommunityHighlight,
} from '../components';
import { SharedResidentTopBar } from '../../navigation/SharedResidentTopBar';
import {
  createConnectLabTopStyle,
  createLabTextColorStyle,
  createRootStyle,
  createScrollContentStyle,
  styles,
} from '../styles/screens/ResidentHomeScreen.styles';

function formatAmount(amount: number): string {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function ResidentHomeScreen({ navigation }: ResidentHomeScreenProps) {
  const { colors } = useAppTheme();
  const messages = useMessages();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { session } = useAuthSession();
  const { activeContext } = useActiveResidentHome();
  const greeting = useResidentGreeting(activeContext);
  const { canPerformAction, role } = useResidentRoleNavigation();
  const { data: dashboard, error, isLoading, refetch } = useResidentDashboard();
  const pulseSignals = useMemo(
    () => (dashboard ? createResidencePulseSignals(dashboard) : []),
    [dashboard],
  );

  const [refreshing, setRefreshing] = useState(false);
  const [pulseVisible, setPulseVisible] = useState(false);
  const [prioritiesVisible, setPrioritiesVisible] = useState(false);
  const [partyPassVisible, setPartyPassVisible] = useState(false);
  const [upiSheetVisible, setUpiSheetVisible] = useState(false);
  const [scenarioLabVisible, setScenarioLabVisible] = useState(false);
  const [switcherVisible, setSwitcherVisible] = useState(false);
  const [arrivalAlertVisible, setArrivalAlertVisible] = useState(false);

  const isDev = isDevelopmentMode();
  const copy = messages.resident.dashboard.homeExperience;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const experience = useMemo(
    () =>
      dashboard
        ? createResidentDashboardPersonalization({ dashboard, messages, role })
        : null,
    [dashboard, messages, role],
  );

  const isZeroHome =
    activeContext.homeContextId === 'ctx-zero-home' ||
    activeContext.societyId === 'soc-none';
  const isPendingHome =
    activeContext.displayUnitName?.includes('Under Review') ||
    activeContext.societyName?.includes('Pending');

  if (isZeroHome || isPendingHome) {
    return (
      <SocietyExperienceFrame showAmbientChrome={false}>
        <View
          style={[styles.root, createRootStyle(colors.background)]}
          testID="resident-dashboard"
        >
          <ConnectHomeView
            status={isPendingHome ? 'PENDING_APPROVAL' : 'NONE'}
            societyName={activeContext.societyName}
            unitName={activeContext.displayUnitName}
            onLinkResidence={() => setSwitcherVisible(true)}
            onViewInvitations={() => setSwitcherVisible(true)}
            onWithdrawRequest={() => setSwitcherVisible(true)}
          />
          {isDev && scenarioLabVisible ? (
            <ScenarioLabDrawer
              visible={scenarioLabVisible}
              onClose={() => setScenarioLabVisible(false)}
            />
          ) : null}
          <ResidentHomeSwitcherSheet
            visible={switcherVisible}
            onClose={() => setSwitcherVisible(false)}
          />
        </View>
      </SocietyExperienceFrame>
    );
  }

  if (isLoading && !dashboard && !error) {
    return (
      <SocietyExperienceFrame showAmbientChrome={false}>
        <View style={[styles.root, createRootStyle(colors.background)]}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <ResidencePulseSkeleton />
            <BillSummarySkeleton />
            <VisitorTimelineSkeleton />
          </ScrollView>
        </View>
      </SocietyExperienceFrame>
    );
  }

  if (error || !dashboard || !experience) {
    return (
      <SocietyExperienceFrame showAmbientChrome={false}>
        <View style={[styles.centeredState, createRootStyle(colors.background)]}>
          <ErrorState
            title={copy.errorTitle}
            message={copy.errorDescription}
            retryLabel={messages.resident.dashboard.actions.retrySection}
            onRetry={refetch}
          />
        </View>
      </SocietyExperienceFrame>
    );
  }

  const tabNavigation = navigation.getParent<BottomTabNavigationProp<RootTabParamList>>();

  const openVisitors = () =>
    tabNavigation?.navigate('VisitorTab', { screen: 'VisitorList' });
  const openBills = () =>
    tabNavigation?.navigate('BillTab', { screen: 'BillList' });
  const openComplaints = () =>
    tabNavigation?.navigate('ComplaintTab', { screen: 'ComplaintList' });
  const openFacilities = () =>
    navigation.navigate('FacilityStack', { screen: 'FacilityList' });
  const openProfile = () =>
    navigation.navigate('ProfileTab', { screen: 'ProfileHome' });
  const openNotifications = () =>
    navigation.navigate('NotificationInbox');
  const openUpdates = () =>
    tabNavigation?.navigate('ActivityTab');

  const urgentNotice = dashboard.notices.find(
    (notice) => notice.category === 'emergency' || notice.category === 'important',
  );
  const urgentComplaint =
    dashboard.complaintProgress &&
    ['high', 'critical'].includes(dashboard.complaintProgress.priority);
  const billDue =
    dashboard.maintenancePayment.status !== 'paid' && canPerformAction('maintenance');
  const waitingVisitor = dashboard.visitorTimeline.find(
    (visitor) => visitor.status === 'waitingAtGate',
  );

  const attentionCount = experience.priorities.length;
  const attentionLabel = copy.attentionCount(attentionCount);

  const pulseState =
    urgentNotice || urgentComplaint || dashboard.maintenancePayment.status === 'overdue'
      ? 'attention'
      : pulseSignals.length > 0
      ? 'active'
      : 'calm';

  const statusLine =
    waitingVisitor
      ? '1 visitor waiting at the Main Gate'
      : dashboard.maintenancePayment.status === 'overdue' && canPerformAction('maintenance')
      ? 'Maintenance payment overdue'
      : attentionCount > 0
      ? copy.attentionToday(attentionLabel)
      : copy.calmSupport;

  const moments: HomeActivityItem[] =
    dashboard.activities.length > 0
      ? dashboard.activities
      : dashboard.visitorTimeline.slice(0, 4).map((visitor: VisitorAccessItem) => {
          const category =
            visitor.visitorType === 'delivery'
              ? 'delivery'
              : visitor.visitorType === 'cab'
              ? 'cab'
              : visitor.visitorType === 'staff' || visitor.visitorType === 'domesticHelp'
              ? 'staff'
              : visitor.visitorType === 'vendor'
              ? 'service'
              : 'visitor';
          const status = visitor.status === 'inside' ? 'Inside society' : 'Access completed';
          return {
            id: visitor.id,
            title: visitor.visitorName,
            description: status,
            module: 'visitor' as const,
            activityCategory: category,
            location: visitor.gateName || 'Main Gate',
            statusLabel: status,
            timestampLabel: visitor.enteredAtLabel ?? visitor.validFrom,
          } as HomeActivityItem;
        });

  const handleAction = (actionId?: string) => {
    if (actionId === 'act-pay') setUpiSheetVisible(true);
    else if (actionId === 'act-complaint') navigation.navigate('CreateComplaintFromHome');
    else if (actionId === 'act-amenity') openFacilities();
    else if (actionId === 'act-documents') navigation.navigate('DocumentVaultHome');
    else if (actionId === 'act-noc') navigation.navigate('NocRequestList');
    else if (actionId === 'act-passport') navigation.navigate('DigitalHomePassport', { unitId: activeContext?.unitId });
    else if (actionId === 'act-family') navigation.navigate('HouseholdOverview');
    else if (actionId === 'act-tenant') navigation.navigate('TenantManagement');
    else if (actionId === 'act-notice') navigation.navigate('NoticeListFromHome');
    else if (actionId === 'act-sos') navigation.navigate('EmergencySos');
    else if (actionId === 'act-visitor') {
      if (waitingVisitor) setArrivalAlertVisible(true);
      else navigation.navigate('CreateVisitorFromHome');
    } else openComplaints();
  };

  const handleMomentPress = (item: HomeActivityItem) => {
    if (item.module === 'facility') openFacilities();
    else if (item.module === 'billing') openBills();
    else if (item.module === 'complaint') openComplaints();
    else if (item.module === 'notice') navigation.navigate('NoticeListFromHome');
    else openVisitors();
  };

  const communityNotice = dashboard.notices.find((notice) => notice.category === 'event');
  const bottomInset = resolveResidentTabBarObstruction(width, insets.bottom, getAppPlatform()) + 44;

  const residentFullName =
    dashboard.residentName?.trim() || session?.name?.trim() || 'Resident';

  return (
    <SocietyExperienceFrame showAmbientChrome={false}>
      <View
        style={[styles.root, createRootStyle(colors.background)]}
        testID="resident-dashboard"
      >
        <SharedResidentTopBar
          societyName={activeContext.societyName || 'Greenwood Heights'}
          unitName={activeContext.displayUnitName || 'A-1204 • Pune'}
          topInset={insets.top + 6}
          onSwitchResidence={() => setSwitcherVisible(true)}
          onOpenNotifications={openNotifications}
          onOpenProfile={openProfile}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            createScrollContentStyle(0, bottomInset),
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          <ResidentHomeGreeting
            greeting={greeting}
            residentName={residentFullName}
            statusText={statusLine}
            statusTone={pulseState}
          />

          <ContextualPriorityCard
            dashboard={dashboard}
            canManageBills={canPerformAction('maintenance')}
            attentionCount={attentionCount}
            attentionLabel={attentionLabel}
            sectionHeading={copy.needsAttention}
            onViewAllPriorities={() => setPrioritiesVisible(true)}
            onAction={handleAction}
          />

          <ResidentQuickActions
            canManageBills={canPerformAction('maintenance')}
            hasUnpaidBill={billDue}
            onInviteGuest={() => navigation.navigate('CreateVisitorFromHome')}
            onPayOrBilling={() => {
              if (billDue) setUpiSheetVisible(true);
              else openBills();
            }}
            onRaiseRequest={() => navigation.navigate('CreateComplaintFromHome')}
            onBookFacility={openFacilities}
          />

          <ResidentHomePulse
            dashboard={dashboard}
            canManageBills={canPerformAction('maintenance')}
            onOpenVisitors={openVisitors}
            onOpenBills={openBills}
            onOpenComplaints={openComplaints}
            onOpenFacilities={openFacilities}
            onExpandPulse={() => setPulseVisible(true)}
          />

          <HomeActivityTimeline
            activities={moments}
            onItemPress={handleMomentPress}
            onViewAll={openUpdates}
          />

          <CommunityHighlight
            notice={communityNotice}
            onPress={() =>
              tabNavigation?.navigate('CommunityTab', { screen: 'CommunityHome' })
            }
          />
        </ScrollView>

        <PriorityOverviewSheet
          visible={prioritiesVisible}
          title={copy.needsAttention}
          closeLabel={copy.closePriorities}
          items={experience.priorities}
          onClose={() => setPrioritiesVisible(false)}
          onActionPress={handleAction}
        />

        <ResidencePulseExpanded
          visible={pulseVisible}
          onClose={() => setPulseVisible(false)}
          unitLabel={activeContext.displayUnitName}
          signals={pulseSignals}
          billAmountLabel={formatAmount(
            dashboard.maintenancePayment.totalOutstanding ??
              dashboard.maintenancePayment.billAmount,
          )}
          billDue={billDue}
          onPay={() => {
            setPulseVisible(false);
            openBills();
          }}
          onActivityPress={(item) => {
            setPulseVisible(false);
            handleMomentPress(item);
          }}
        />

        <PartyPassModal
          visible={partyPassVisible}
          onClose={() => setPartyPassVisible(false)}
        />

        <UpiPaymentSheet
          visible={upiSheetVisible}
          amount={
            dashboard.maintenancePayment.totalOutstanding ??
            dashboard.maintenancePayment.billAmount ??
            4500
          }
          billId={dashboard.maintenancePayment.billId ?? 'bill-jul-2026-001'}
          billMonth={dashboard.maintenancePayment.billingMonth ?? 'July 2026'}
          onClose={() => setUpiSheetVisible(false)}
          onPaymentComplete={() => {
            setUpiSheetVisible(false);
            refetch();
          }}
        />

        <ResidentHomeSwitcherSheet
          visible={switcherVisible}
          onClose={() => setSwitcherVisible(false)}
        />

        {isDev && scenarioLabVisible ? (
          <ScenarioLabDrawer
            visible={scenarioLabVisible}
            onClose={() => setScenarioLabVisible(false)}
          />
        ) : null}

        <VisitorArrivalAlertModal
          visible={arrivalAlertVisible}
          visitorName={waitingVisitor?.visitorName || 'Visitor at Gate'}
          gateName={waitingVisitor?.gateName || 'Main Gate'}
          scanTime="Just now"
          vehicleNumber={(waitingVisitor as { vehicleNumber?: string })?.vehicleNumber}
          onAllow={async () => {
            const pending = visitorLifecycleStore.getPendingApprovals();
            const first = pending[0];
            if (first?.requestId) {
              await visitorLifecycleStore.respondToWalkIn(first.requestId, 'APPROVE');
            }
            setArrivalAlertVisible(false);
            refetch();
          }}
          onWait={() => setArrivalAlertVisible(false)}
          onDeny={async () => {
            const pending = visitorLifecycleStore.getPendingApprovals();
            const first = pending[0];
            if (first?.requestId) {
              await visitorLifecycleStore.respondToWalkIn(first.requestId, 'DENY', 'res-001', 'Denied by resident');
            }
            setArrivalAlertVisible(false);
            refetch();
          }}
        />

        <FloatingSosButton />
      </View>
    </SocietyExperienceFrame>
  );
}

export default ResidentHomeScreen;

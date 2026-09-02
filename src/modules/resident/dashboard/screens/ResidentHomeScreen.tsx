import { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, useWindowDimensions, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { ResidentHomeScreenProps, RootTabParamList } from '../../../../app/navigation/navigation.types';
import { SafeText } from '../../../../shared/components/SafeText';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
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
import { ContextCommand } from '../components/ContextCommand';
import { HomeAttentionField } from '../components/HomeAttentionField';
import { LivingTimeline } from '../components/LivingTimeline';
import { ResidencePulseExpanded } from '../components/ResidencePulseExpanded';
import { ResidencePulseField, type ResidencePulseState } from '../components/ResidencePulseField';
import type { HomeActivityItem, ResidentPriorityItem, VisitorAccessItem } from '../data/dashboard.types';
import { createResidencePulseSignals } from '../data/pulseSignal.model';
import { SocietyExperienceFrame } from '../../experience/SocietyExperienceFrame';
import { ResidenceBeacon } from '../../experience/ResidenceBeacon';
import { IdentityOrb } from '../../experience/IdentityOrb';
import { PartyPassModal } from '../../visitors/components/PartyPassModal';
import { UpiPaymentSheet } from '../../billing/components/UpiPaymentSheet';
import { ConnectHomeView } from '../../homeContext/components/ConnectHomeView';
import { ScenarioLabDrawer } from '../../../../core/scenario/ScenarioLabDrawer';
import { ResidencePulseSkeleton, VisitorTimelineSkeleton, BillSummarySkeleton } from '../../../../ui/skeletons/FeatureSkeletons';
import {
  createCommunityBorderStyle,
  createContextSocietyStyle,
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
  const pulseSignals = useMemo(() => dashboard ? createResidencePulseSignals(dashboard) : [], [dashboard]);
  const [refreshing, setRefreshing] = useState(false);
  const [pulseVisible, setPulseVisible] = useState(false);
  const [prioritiesVisible, setPrioritiesVisible] = useState(false);
  const [partyPassVisible, setPartyPassVisible] = useState(false);
  const [upiSheetVisible, setUpiSheetVisible] = useState(false);
  const [scenarioLabVisible, setScenarioLabVisible] = useState(false);
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
    () => (dashboard ? createResidentDashboardPersonalization({ dashboard, messages, role }) : null),
    [dashboard, messages, role]
  );

  const isZeroHome = activeContext.homeContextId === 'ctx-zero-home' || activeContext.societyId === 'soc-none';
  const isPendingHome = activeContext.displayUnitName?.includes('Under Review') || activeContext.societyName?.includes('Pending');

  if (isZeroHome || isPendingHome) {
    return (
      <SocietyExperienceFrame>
        <View style={[styles.root, createRootStyle(colors.background)]} testID="resident-dashboard">
          <ConnectHomeView
            status={isPendingHome ? 'PENDING_APPROVAL' : 'NONE'}
            societyName={activeContext.societyName}
            unitName={activeContext.displayUnitName}
            onLinkResidence={() => setScenarioLabVisible(true)}
            onViewInvitations={() => setScenarioLabVisible(true)}
            onWithdrawRequest={() => setScenarioLabVisible(true)}
          />
          <Pressable
            onPress={() => setScenarioLabVisible(true)}
            style={{
              position: 'absolute',
              top: insets.top + 8,
              right: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Ionicons name="flask-outline" size={14} color={colors.primary} />
            <SafeText variant="tiny" style={{ color: colors.primary, fontWeight: '700' }}>Lab</SafeText>
          </Pressable>
          {scenarioLabVisible ? (
            <ScenarioLabDrawer visible={scenarioLabVisible} onClose={() => setScenarioLabVisible(false)} />
          ) : null}
        </View>
      </SocietyExperienceFrame>
    );
  }

  if (isLoading && !dashboard && !error) {
    return (
      <SocietyExperienceFrame>
        <View style={[styles.root, createRootStyle(colors.background)]}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
      <SocietyExperienceFrame>
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
  const openVisitors = () => tabNavigation?.navigate('VisitorTab', { screen: 'VisitorList' });
  const openBills = () => tabNavigation?.navigate('BillTab', { screen: 'BillList' });
  const openComplaints = () => tabNavigation?.navigate('ComplaintTab', { screen: 'ComplaintList' });
  const openFacilities = () => navigation.navigate('FacilityStack', { screen: 'FacilityList' });

  const urgentNotice = dashboard.notices.find((notice) => notice.category === 'emergency' || notice.category === 'important');
  const urgentComplaint = dashboard.complaintProgress && ['high', 'critical'].includes(dashboard.complaintProgress.priority);
  const billDue = dashboard.maintenancePayment.status !== 'paid';
  const waitingVisitor = dashboard.visitorTimeline.find((visitor) => visitor.status === 'waitingAtGate');

  const moments: HomeActivityItem[] = dashboard.activities.length > 0
    ? dashboard.activities
    : dashboard.visitorTimeline.slice(0, 4).map((visitor: VisitorAccessItem) => ({
        id: visitor.id,
        title: visitor.visitorName,
        description: visitor.status === 'inside' ? copy.enteredThrough(visitor.gateName) : visitor.purpose,
        module: 'visitor' as const,
        timestampLabel: visitor.enteredAtLabel ?? visitor.validFrom,
      }));

  const pulseState: ResidencePulseState =
    urgentNotice || urgentComplaint || dashboard.maintenancePayment.status === 'overdue'
      ? 'attention'
      : pulseSignals.length > 0
      ? 'active'
      : 'calm';

  const pulseTitle =
    pulseState === 'attention'
      ? copy.attentionRequired
      : pulseState === 'calm'
      ? copy.allClear
      : copy.momentsAroundHome(pulseSignals.length);

  const attentionCount = experience.priorities.length;
  const attentionLabel = copy.attentionCount(attentionCount);
  const supportingCopy =
    pulseState === 'attention'
      ? copy.attentionToday(attentionLabel)
      : pulseState === 'calm'
      ? copy.calmSupport
      : copy.activeSupport;

  const actionable = experience.priorities.filter((item) => item.actionId).slice(0, 3);
  const nextAction: ResidentPriorityItem = waitingVisitor
    ? {
        id: 'waiting-visitor',
        actionId: 'act-visitor',
        title: copy.viewAtGate(waitingVisitor.visitorName),
        description: copy.waitingNow(waitingVisitor.gateName),
        metaLabel: copy.rightNow,
        actionLabel: copy.viewVisitor,
        iconName: 'person-outline',
        tone: 'warning',
      }
    : actionable[0] ?? {
        id: 'add-visitor',
        actionId: 'act-visitor',
        title: copy.addVisitor,
        description: copy.addVisitorDescription,
        metaLabel: copy.doNext,
        actionLabel: copy.addVisitor,
        iconName: 'person-add-outline',
        tone: 'success',
      };

  const handleAction = (actionId?: string) => {
    if (actionId === 'act-pay') setUpiSheetVisible(true);
    else if (actionId === 'act-complaint') navigation.navigate('CreateComplaintFromHome');
    else if (actionId === 'act-amenity') openFacilities();
    else if (actionId === 'act-documents') navigation.navigate('DocumentVaultHome');
    else if (actionId === 'act-noc') navigation.navigate('NocRequestList');
    else if (actionId === 'act-family') navigation.navigate('HouseholdOverview');
    else if (actionId === 'act-tenant') navigation.navigate('TenantManagement');
    else if (actionId === 'act-notice') navigation.navigate('NoticeListFromHome');
    else if (actionId === 'act-sos') navigation.navigate('EmergencySos');
    else if (actionId === 'act-visitor') {
      if (waitingVisitor) openVisitors();
      else navigation.navigate('CreateVisitorFromHome');
    } else openComplaints();
  };

  const communityNotice = dashboard.notices.find((notice) => notice.category === 'event');
  const bottomInset = resolveResidentTabBarObstruction(width, insets.bottom, getAppPlatform());
  const pulseSubtitle =
    pulseState === 'attention'
      ? urgentNotice?.title ?? dashboard.complaintProgress?.title ?? copy.maintenanceAttention
      : pulseState === 'calm'
      ? copy.homeQuiet
      : copy.nothingUrgent;

  const handleMomentPress = (item: HomeActivityItem) => {
    if (item.module === 'facility') openFacilities();
    else if (item.module === 'billing') openBills();
    else if (item.module === 'complaint') openComplaints();
    else if (item.module === 'notice') navigation.navigate('NoticeListFromHome');
    else openVisitors();
  };

  const residentFullName =
    dashboard?.residentName?.trim() ||
    session?.name?.trim() ||
    'Resident';
  const residentFirstName = residentFullName.split(' ')[0] || 'Resident';

  return (
    <SocietyExperienceFrame>
      <View style={[styles.root, createRootStyle(colors.background)]} testID="resident-dashboard">
        <ScrollView
          contentContainerStyle={[styles.scrollContent, createScrollContentStyle(0, bottomInset)]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* Large Canvas-Level Human Greeting */}
          <View style={styles.greetingBlock}>
            <SafeText testID="resident-dashboard-name" variant="h1" color="primary" style={{ fontSize: 28, fontWeight: '700', lineHeight: 34, marginBottom: 2 }}>
              {greeting}, {residentFirstName}.
            </SafeText>
            <SafeText variant="body" color="secondary" style={{ fontSize: 16, lineHeight: 22 }}>
              {supportingCopy}
            </SafeText>
          </View>

          {/* 3. Hero Residence Pulse */}
          <ResidencePulseField
            state={pulseState}
            eyebrow={copy.pulseTitle}
            title={pulseTitle}
            subtitle={pulseSubtitle}
            signals={pulseSignals}
            accessibilityLabel={copy.openPulse(pulseTitle)}
            onPress={() => setPulseVisible(true)}
          />

          {/* 4. Needs Your Attention */}
          <HomeAttentionField
            title={copy.needsAttention}
            viewAllLabel={copy.viewAll}
            accessibilityLabel={attentionLabel}
            items={actionable}
            totalCount={experience.priorities.length}
            onViewAll={() => setPrioritiesVisible(true)}
            onAction={handleAction}
          />

          {/* 5. What Should I Do Next? */}
          <ContextCommand
            sectionLabel={copy.doNext}
            item={nextAction}
            onPress={() => handleAction(nextAction.actionId)}
          />

          {/* 6. Today Around Home (Chronological Moments) */}
          <LivingTimeline
            title={copy.todayAroundHome}
            quietTitle={copy.homeQuiet}
            quietDescription={copy.quietTimelineDescription}
            moments={moments}
            onMomentPress={handleMomentPress}
          />

          {/* Contextual Community Event Notice (if active) */}
          {communityNotice ? (
            <Pressable
              onPress={() => navigation.navigate('NoticeListFromHome')}
              style={[styles.communityRow, createCommunityBorderStyle(colors.border)]}
            >
              <View style={{ flex: 1 }}>
                <SafeText variant="tiny" style={createContextSocietyStyle(colors.success)}>
                  {copy.inYourCommunity}
                </SafeText>
                <SafeText variant="bodyStrong" color="primary">
                  {communityNotice.title}
                </SafeText>
                <SafeText variant="caption" color="muted">
                  {communityNotice.publishedAtLabel}
                </SafeText>
              </View>
              <Ionicons name="arrow-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </ScrollView>

        {/* Modal Sheets & Floating Controls */}
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
          billAmountLabel={formatAmount(dashboard.maintenancePayment.totalOutstanding ?? dashboard.maintenancePayment.billAmount)}
          billDue={billDue && canPerformAction('maintenance')}
          onPay={() => {
            setPulseVisible(false);
            setUpiSheetVisible(true);
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
          amount={dashboard.maintenancePayment.totalOutstanding ?? dashboard.maintenancePayment.billAmount ?? 4500}
          onClose={() => setUpiSheetVisible(false)}
          onPaymentComplete={() => {
            setUpiSheetVisible(false);
            refetch();
          }}
        />

        {scenarioLabVisible ? (
          <ScenarioLabDrawer
            visible={scenarioLabVisible}
            onClose={() => setScenarioLabVisible(false)}
          />
        ) : null}

        <FloatingSosButton />
      </View>
    </SocietyExperienceFrame>
  );
}

export default ResidentHomeScreen;

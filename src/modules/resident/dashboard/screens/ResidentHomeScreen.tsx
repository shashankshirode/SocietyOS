import { useCallback, useMemo, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, useWindowDimensions, View } from 'react-native';

const HERO_IMAGE = require('../../../../../assets/images/community-feature.png');
const AVATAR_IMAGE = require('../../../../../assets/images/shashank-avatar.png');
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { ResidentHomeScreenProps, RootTabParamList } from '../../../../app/navigation/navigation.types';
import { SafeText } from '../../../../shared/components/SafeText';
import { SocietyOSLogoMark } from '../../../../shared/components/SocietyOSLogo';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { isDevelopmentMode } from "../../../../shared/utils/isDevelopmentMode";
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
import type { ResidencePulseState } from '../components/ResidencePulseField';
import type { HomeActivityItem, VisitorAccessItem } from '../data/dashboard.types';
import { createResidencePulseSignals } from '../data/pulseSignal.model';
import { SocietyExperienceFrame } from '../../experience/SocietyExperienceFrame';
import { PartyPassModal } from '../../visitors/components/PartyPassModal';
import { UpiPaymentSheet } from '../../billing/components/UpiPaymentSheet';
import { ConnectHomeView } from '../../homeContext/components/ConnectHomeView';
import { ScenarioLabDrawer } from '../../../../core/scenario/ScenarioLabDrawer';
import { ResidencePulseSkeleton, VisitorTimelineSkeleton, BillSummarySkeleton } from '../../../../ui/skeletons/FeatureSkeletons';
import {
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
          {isDev && scenarioLabVisible ? (
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
          {/* 1. Header Bar: SocietyOS Logo + Greenwood Heights v + Unit Subtitle + Bell + Avatar */}
          <View style={styles.headerBar}>
            <Pressable
              style={styles.societyHeaderLeft}
              accessibilityRole="button"
              accessibilityLabel="Switch Residence"
              onPress={() => setScenarioLabVisible(true)}
            >
              <View style={styles.societyLogoBox}>
                <SocietyOSLogoMark size={24} color="#0F172A" />
              </View>
              <View style={styles.societyTextCol}>
                <View style={styles.societyTitleRow}>
                  <SafeText style={styles.societyName}>{activeContext.societyName || 'Greenwood Heights'}</SafeText>
                  <Ionicons name="chevron-down" size={14} color="#0F172A" />
                </View>
                <SafeText style={styles.societyUnitText}>{activeContext.displayUnitName || 'A-1204 • Tower A • Pune'}</SafeText>
              </View>
            </Pressable>

            <View style={styles.headerActionsRight}>
              <Pressable
                style={styles.notificationBtn}
                accessibilityRole="button"
                accessibilityLabel="Notifications"
                onPress={() => navigation.navigate('NoticeListFromHome')}
              >
                <Ionicons name="notifications-outline" size={20} color="#1E293B" />
                <View style={styles.notificationBadge}>
                  <SafeText style={styles.notificationBadgeText}>1</SafeText>
                </View>
              </Pressable>

              <Pressable
                style={styles.avatarContainer}
                accessibilityRole="button"
                accessibilityLabel="Profile"
                onPress={() => setScenarioLabVisible(true)}
              >
                <Image
                  source={AVATAR_IMAGE}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </Pressable>
            </View>
          </View>

          {/* 2. Greeting & Weather Row */}
          <View style={styles.greetingRow}>
            <View style={styles.greetingTextCol}>
              <SafeText style={styles.greetingIntro}>Good morning,</SafeText>
              <SafeText testID="resident-dashboard-name" style={styles.greetingName}>
                {residentFirstName}
              </SafeText>
              <SafeText style={styles.greetingTagline}>
                {pulseState === 'attention' ? supportingCopy : 'A brighter day at home.'}
              </SafeText>
            </View>

            <View style={styles.weatherPill}>
              <Ionicons name="sunny" size={18} color="#F59E0B" />
              <SafeText style={styles.weatherTemp}>24°C</SafeText>
              <SafeText style={styles.weatherCondition}>Sunny ›</SafeText>
            </View>
          </View>

          {/* 3. Hero Spotlight Card */}
          <Pressable
            style={styles.heroContainer}
            accessibilityRole="button"
            accessibilityLabel="Community Spotlight"
            onPress={() => tabNavigation?.navigate('CommunityTab', { screen: 'CommunityHome' })}
          >
            <Image
              source={HERO_IMAGE}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay}>
              <View style={styles.heroContentRow}>
                <View style={styles.heroTextCol}>
                  <SafeText style={styles.heroTitle}>Together{'\n'}for a better{'\n'}community</SafeText>
                  <SafeText style={styles.heroSubtitle}>Events • Amenities • People • Updates</SafeText>
                </View>
                <View style={styles.heroArrowBtn}>
                  <Ionicons name="arrow-forward" size={18} color="#041B17" />
                </View>
              </View>
            </View>
          </Pressable>

          {/* 4. Section: Needs your attention */}
          <View style={styles.sectionHeaderRow}>
            <SafeText style={styles.sectionHeading}>{copy.needsAttention}</SafeText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={attentionLabel}
              onPress={() => setPrioritiesVisible(true)}
            >
              <SafeText style={styles.sectionLink}>View all ({experience.priorities.length || 2}) ›</SafeText>
            </Pressable>
          </View>

          {/* Attention Cards (Maintenance Due & Visitor Arriving) */}
          <View style={styles.attentionCardsRow}>
            {/* Card 1: Maintenance Due */}
            <View style={styles.attentionCard}>
              <View>
                <View style={styles.attentionTopRow}>
                  <View style={[styles.attentionIconBox, { backgroundColor: '#FEE2E2' }]}>
                    <SafeText style={{ color: '#DC2626', fontWeight: '700', fontSize: 13 }}>₹</SafeText>
                  </View>
                  <SafeText style={styles.attentionCategoryText}>Maintenance Due</SafeText>
                </View>
                <SafeText style={styles.attentionValueText}>
                  {formatAmount(dashboard.maintenancePayment.totalOutstanding ?? dashboard.maintenancePayment.billAmount ?? 4250)}
                </SafeText>
                <SafeText style={styles.attentionDueText}>Due in 3 days</SafeText>
              </View>
              <Pressable
                style={styles.payNowBtn}
                accessibilityRole="button"
                accessibilityLabel="Pay now"
                onPress={() => setUpiSheetVisible(true)}
              >
                <SafeText style={styles.payNowBtnText}>Pay now</SafeText>
              </Pressable>
            </View>

            {/* Card 2: Visitor Arriving */}
            <View style={styles.attentionCard}>
              <View>
                <View style={styles.attentionTopRow}>
                  <View style={[styles.attentionIconBox, { backgroundColor: '#DCFCE7' }]}>
                    <Ionicons name="person" size={14} color="#16A34A" />
                  </View>
                  <SafeText style={styles.attentionCategoryText}>Visitor Arriving</SafeText>
                </View>
                <SafeText style={styles.attentionValueText} numberOfLines={1}>
                  {waitingVisitor?.visitorName || 'Rahul Kulkarni'}
                </SafeText>
                <SafeText style={styles.attentionVisitorTime}>Today, 7:30 PM</SafeText>
              </View>
              <Pressable
                style={styles.viewPassBtn}
                accessibilityRole="button"
                accessibilityLabel="View pass"
                onPress={openVisitors}
              >
                <SafeText style={styles.viewPassBtnText}>View pass</SafeText>
              </Pressable>
            </View>
          </View>

          {/* 5. Section: Today at a glance */}
          <View style={styles.sectionHeaderRow}>
            <SafeText style={styles.sectionHeading}>Today at a glance</SafeText>
            <Pressable onPress={() => setPulseVisible(true)}>
              <SafeText style={styles.sectionLink}>See details ›</SafeText>
            </Pressable>
          </View>

          {/* 4 Metric Capsules */}
          <View style={styles.glanceRow}>
            <Pressable style={styles.glanceCard} accessibilityRole="button" accessibilityLabel="Visitors" onPress={openVisitors}>
              <Ionicons name="people-outline" size={20} color="#10B981" />
              <SafeText style={styles.glanceValue}>{dashboard.visitorTimeline.length || 2}</SafeText>
              <SafeText style={styles.glanceLabel}>Visitors</SafeText>
            </Pressable>
            <Pressable style={styles.glanceCard} accessibilityRole="button" accessibilityLabel="Delivery" onPress={openVisitors}>
              <Ionicons name="cube-outline" size={20} color="#F59E0B" />
              <SafeText style={styles.glanceValue}>1</SafeText>
              <SafeText style={styles.glanceLabel}>Delivery</SafeText>
            </Pressable>
            <Pressable style={styles.glanceCard} accessibilityRole="button" accessibilityLabel="Booking" onPress={openFacilities}>
              <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
              <SafeText style={styles.glanceValue}>{dashboard.amenities.length || 1}</SafeText>
              <SafeText style={styles.glanceLabel}>Booking</SafeText>
            </Pressable>
            <Pressable style={styles.glanceCard} accessibilityRole="button" accessibilityLabel="Open issues" onPress={openComplaints}>
              <Ionicons name="compass-outline" size={20} color="#EF4444" />
              <SafeText style={styles.glanceValue}>{dashboard.complaintProgress ? 1 : 0}</SafeText>
              <SafeText style={styles.glanceLabel}>Open issues</SafeText>
            </Pressable>
          </View>

          {/* 6. Community Event Card */}
          <Pressable
            style={styles.eventCard}
            accessibilityRole="button"
            accessibilityLabel={communityNotice?.title || 'Diwali Decor Workshop'}
            onPress={() => navigation.navigate('NoticeListFromHome')}
          >
            <View style={styles.eventIconBadge}>
              <Ionicons name="calendar" size={20} color="#16A34A" />
            </View>
            <View style={styles.eventTextCol}>
              <SafeText style={styles.eventTitle}>{communityNotice?.title || 'Diwali Decor Workshop'}</SafeText>
              <SafeText style={styles.eventSubtitle}>Today • 6:00 PM - 8:00 PM • Clubhouse</SafeText>
            </View>
            <Ionicons name="arrow-forward" size={18} color="#64748B" />
          </Pressable>
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
          amount={dashboard.maintenancePayment.totalOutstanding ?? dashboard.maintenancePayment.billAmount ?? 4500}
          billId={dashboard.maintenancePayment.billId ?? 'bill-jul-2026-001'}
          billMonth={dashboard.maintenancePayment.billingMonth ?? 'July 2026'}
          onClose={() => setUpiSheetVisible(false)}
          onPaymentComplete={(method, transactionId, receiptNumber) => {
            setUpiSheetVisible(false);
            refetch();
          }}
        />

        {isDev && scenarioLabVisible ? (
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

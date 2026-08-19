import { mockStore } from '../../../../core/mockStore/mockStore';
import { CommunityMockSource } from '../../../community/data/community.mockSource';
import { billMockSource } from '../../billing/data/billing.mockSource';
import { complaintMockSource } from '../../complaints/data/complaints.mockSource';
import { residentContextualInsightsMockSource } from '../../contextualInsights/data/residentContextualInsights.mockSource';
import { residentDashboardMockSource } from '../../dashboard/data/dashboard.mockSource';
import { documentMockSource } from '../../documents/data/document.mockSource';
import { emergencySafetyMockSource } from '../../emergency/data/emergencySafety.mockSource';
import { facilityMockSource } from '../../facilityBooking/data/facility.mockSource';
import { governanceMockSource } from '../../governance/data/governance.mockSource';
import { activeHomeStore } from '../../homeContext/data/activeHomeStore';
import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { mapContextToActive } from '../../homeContext/state/residentHomeContext.store';
import { nocMockSource } from '../../noc/data/noc.mockSource';
import { noticeMockSource } from '../../notices/data/notice.mockSource';
import { residentNotificationsMockSource } from '../../notifications/data/residentNotifications.mockSource';
import { parkingMockSource } from '../../parking/data/parking.mockSource';
import { residentConnectMockSource } from '../../residentConnect/data/residentConnect.mockSource';
import { visitorsMockSource } from '../../visitors/data/visitors.mockSource';
import { residentHouseholdMockSource } from '../../household/data/residentHousehold.mockSource';
import { getResidentMockRecords } from '../residentMockRegistry';

jest.setTimeout(20_000);

function requestContext(homeContextId: string): ResidentRepositoryRequestContext {
  const home = mockResidentHomeContexts.find((candidate) => candidate.homeContextId === homeContextId);
  if (!home) {
    throw new Error('TEST_HOME_CONTEXT_MISSING');
  }
  const activeHome = mapContextToActive(home);
  return { activeHome, dataScopeKey: activeHome.dataScopeKey };
}

describe('resident feature context-scoped mock data', () => {
  beforeEach(() => {
    mockStore.reset();
    activeHomeStore.setActiveContextId('context-001');
  });

  it.each(['context-001', 'context-004'])('serves full UI datasets for %s', async (homeContextId) => {
    activeHomeStore.setActiveContextId(homeContextId);
    const context = requestContext(homeContextId);
    const [dashboard, visitors, bills, complaints, documents, nocs, notices, notifications, family, facilities, vehicles, chats, governance, insights, contacts] = await Promise.all([
      residentDashboardMockSource.getDashboardSections(context),
      visitorsMockSource.list(context),
      billMockSource.list(context),
      complaintMockSource.list(context),
      documentMockSource.allDocuments(context),
      nocMockSource.listRequests(context),
      noticeMockSource.list(context),
      residentNotificationsMockSource.list(context),
      residentHouseholdMockSource.getFamilyMembers(context),
      facilityMockSource.getFacilities(),
      parkingMockSource.getMyVehicles(context.activeHome.unitId),
      residentConnectMockSource.getChatThreads(context),
      governanceMockSource.getGovernanceHome(context),
      residentContextualInsightsMockSource.getContextualInsights({
        userId: context.activeHome.residentId,
        societyId: context.activeHome.societyId,
        unitId: context.activeHome.unitId,
      }),
      emergencySafetyMockSource.getEmergencyContacts(),
    ]);

    expect(dashboard.ok && dashboard.data.reminders).toHaveLength(12);
    expect(dashboard.ok && dashboard.data.activities).toHaveLength(20);
    expect(visitors.ok && visitors.data).toHaveLength(40);
    expect(bills.ok && bills.data).toHaveLength(36);
    expect(complaints.ok && complaints.data).toHaveLength(25);
    expect(documents.ok && documents.data).toHaveLength(30);
    expect(nocs.ok && nocs.data).toHaveLength(10);
    expect(notices.ok && notices.data).toHaveLength(40);
    expect(notifications.ok && notifications.data).toHaveLength(60);
    expect(family).toHaveLength(12);
    expect(facilities.ok && facilities.data).toHaveLength(20);
    expect(vehicles.ok && vehicles.data).toHaveLength(12);
    expect(chats.ok && chats.data).toHaveLength(20);
    expect(governance.ok && governance.data.upcomingMeetings).toHaveLength(8);
    const contextualRecords = getResidentMockRecords(context, 'contextualInsights');
    const currentContextualRecordCount = contextualRecords.filter(
      (record) => record.status === 'active' || record.status === 'pending',
    ).length;
    expect(contextualRecords).toHaveLength(8);
    expect(insights.advisories).toHaveLength(currentContextualRecordCount);
    expect(insights.advisories.every((advisory) => Date.parse(advisory.validUntilIso) > Date.now())).toBe(true);
    expect(contacts).toHaveLength(8);
    expect(await CommunityMockSource.getListings()).toHaveLength(50);
    expect(getResidentMockRecords(context, 'notifications')).toHaveLength(60);
  });

  it('never returns records from the previous residence after a switch', async () => {
    const first = requestContext('context-001');
    const second = requestContext('context-004');
    const firstVisitors = await visitorsMockSource.list(first);
    activeHomeStore.setActiveContextId('context-004');
    const secondVisitors = await visitorsMockSource.list(second);

    expect(firstVisitors.ok).toBe(true);
    expect(secondVisitors.ok).toBe(true);
    if (!firstVisitors.ok || !secondVisitors.ok) return;

    const firstIds = new Set(firstVisitors.data.map((visitor) => visitor.id));
    expect(secondVisitors.data.every((visitor) => !firstIds.has(visitor.id))).toBe(true);
    expect(secondVisitors.data.every((visitor) => visitor.homeContextId === 'context-004')).toBe(true);
    expect(secondVisitors.data.every((visitor) => visitor.unitId === second.activeHome.unitId)).toBe(true);

    const firstDashboard = await residentDashboardMockSource.getDashboardSections(first);
    const secondDashboard = await residentDashboardMockSource.getDashboardSections(second);
    const firstBills = await billMockSource.list(first);
    const secondBills = await billMockSource.list(second);
    expect(firstDashboard.ok && secondDashboard.ok && firstDashboard.data.unreadNoticeCount)
      .not.toBe(secondDashboard.ok ? secondDashboard.data.unreadNoticeCount : undefined);
    expect(firstBills.ok && secondBills.ok && firstBills.data[0]?.amount)
      .not.toBe(secondBills.ok ? secondBills.data[0]?.amount : undefined);
  });
});

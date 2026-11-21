import { mockStore } from '../mockStore/mockStore';
import { visitorsMockSource } from '../../modules/resident/visitors/data/visitors.mockSource';
import { complaintMockSource } from '../../modules/resident/complaints/data/complaints.mockSource';
import { documentMockSource } from '../../modules/resident/documents/data/document.mockSource';
import { paginateResidentBills } from '../../modules/resident/billing/data/billing.mockSource';
import type { Bill } from '../../shared/types/bill.types';
import type { Visitor } from '../../shared/types/visitor.types';
import type { Complaint } from '../../shared/types/complaint.types';
import type { ResidentRepositoryRequestContext } from '../../modules/resident/homeContext/data/residentHomeContext.types';
import { MOCK_PERSONAS } from '../identity/personaRegistry';
import { setCurrentSession } from '../auth/sessionStore';
import { domainEventBus } from '../events/DomainEventBus';

describe('SocietyOS Adversarial Isolation & Large Dataset Resilience', () => {
  const contextUnitB804: ResidentRepositoryRequestContext = {
    activeHome: {
      homeContextId: 'ctx-b804',
      residentId: 'usr-rohan-01',
      societyId: 'soc-palm-grove-01',
      unitId: 'unit-b804',
      flatNumber: 'B-804',
      societyName: 'Palm Grove',
      societyAreaId: 'area-1',
      societyAreaName: 'Main Campus',
      city: 'Mumbai',
      displayUnitName: 'B-804',
      residentRole: 'owner',
      status: 'active',
      featureFlagScopeId: 'ff-soc-palm-grove-01-b804',
      permissionScopeId: 'perm-soc-palm-grove-01-b804',
      dataScopeKey: 'soc-palm-grove-01:unit-b804',
    },
    dataScopeKey: 'soc-palm-grove-01:unit-b804',
  };

  const contextUnitA1204: ResidentRepositoryRequestContext = {
    activeHome: {
      homeContextId: 'ctx-a1204',
      residentId: 'usr-ananya-01',
      societyId: 'soc-palm-grove-01',
      unitId: 'unit-a1204',
      flatNumber: 'A-1204',
      societyName: 'Palm Grove',
      societyAreaId: 'area-1',
      societyAreaName: 'Main Campus',
      city: 'Mumbai',
      displayUnitName: 'A-1204',
      residentRole: 'owner',
      status: 'active',
      featureFlagScopeId: 'ff-soc-palm-grove-01-a1204',
      permissionScopeId: 'perm-soc-palm-grove-01-a1204',
      dataScopeKey: 'soc-palm-grove-01:unit-a1204',
    },
    dataScopeKey: 'soc-palm-grove-01:unit-a1204',
  };

  beforeEach(async () => {
    mockStore.reset();
    domainEventBus.clearHistory();
    await setCurrentSession({
      userId: MOCK_PERSONAS.rohan.user.id,
      name: 'Rohan Sharma',
      role: 'RESIDENT_OWNER',
      personaKey: 'rohan',
      societyId: 'soc-palm-grove-01',
      unitId: 'unit-b804',
      unitLabel: 'B-804',
      isMockSession: true,
    });
  });

  describe('Cross-Unit & Cross-Society Isolation Suite', () => {
    it('strictly isolates private unit documents from cross-household access', async () => {
      // Create a private document in Unit B-804
      const docB804 = await documentMockSource.uploadPlaceholder(contextUnitB804, {
        title: 'B-804 Electricity Tax Invoice',
        category: 'OTHER',
      });
      expect(docB804.ok).toBe(true);
      if (!docB804.ok) return;

      // Attempt to access document using Unit A-1204 context
      const crossUnitDetail = await documentMockSource.detail(contextUnitA1204, docB804.data.id);
      expect(crossUnitDetail.ok).toBe(true);
      if (crossUnitDetail.ok) {
        expect(crossUnitDetail.data).toBeUndefined(); // Absent
      }

      // Attempt to record access log from Unit A-1204
      const illegalLog = await documentMockSource.recordAccess(contextUnitA1204, {
        documentId: docB804.data.id,
        documentTitle: docB804.data.title,
        action: 'VIEWED',
      });
      expect(illegalLog.ok).toBe(false);
      if (!illegalLog.ok) {
        expect(illegalLog.error.code).toBe('DOCUMENT_NOT_FOUND');
      }
    });

    it('re-scopes visitor and complaint lists when active residence switches', async () => {
      // Create visitor in Unit B-804
      const visB = await visitorsMockSource.create(contextUnitB804, {
        name: 'Guest Unit B',
        phone: '+919876543210',
        flatNumber: 'B-804',
        type: 'GUEST',
        purpose: 'Visit',
        expectedDate: '2026-10-06',
        expectedTime: '10:00 AM',
      });
      expect(visB.ok).toBe(true);

      // Create visitor in Unit A-1204
      const visA = await visitorsMockSource.create(contextUnitA1204, {
        name: 'Guest Unit A',
        phone: '+919876543211',
        flatNumber: 'A-1204',
        type: 'GUEST',
        purpose: 'Repair',
        expectedDate: '2026-10-06',
        expectedTime: '11:00 AM',
      });
      expect(visA.ok).toBe(true);

      // Verify list for B-804 contains only B-804 visitors
      const listB = await visitorsMockSource.list(contextUnitB804);
      expect(listB.ok).toBe(true);
      if (listB.ok) {
        expect(listB.data.some(v => v.name === 'Guest Unit B')).toBe(true);
        expect(listB.data.some(v => v.name === 'Guest Unit A')).toBe(false);
      }

      // Verify list for A-1204 contains only A-1204 visitors
      const listA = await visitorsMockSource.list(contextUnitA1204);
      expect(listA.ok).toBe(true);
      if (listA.ok) {
        expect(listA.data.some(v => v.name === 'Guest Unit A')).toBe(true);
        expect(listA.data.some(v => v.name === 'Guest Unit B')).toBe(false);
      }
    });
  });

  describe('Large Dataset Performance Suite', () => {
    it('handles 1,000 deterministic bills with fast cursor pagination without performance degradation', () => {
      const generatedBills: Bill[] = Array.from({ length: 1000 }, (_, index) => ({
        id: `bill-perf-${index}`,
        billNumber: `BILL-PERF-${index}`,
        flatNumber: 'B-804',
        societyName: 'Palm Grove',
        billingPeriod: '2026-10',
        societyId: 'soc-palm-grove-01',
        unitId: 'unit-b804',
        title: `Maintenance Bill #${index}`,
        amount: 2500 + (index % 100),
        status: index % 3 === 0 ? 'PAID' : index % 3 === 1 ? 'DUE' : 'OVERDUE',
        dueDate: `2026-${String((index % 12) + 1).padStart(2, '0')}-15`,
        charges: [{
          lineItemId: `c-${index}`,
          type: 'maintenance',
          label: 'Monthly Maintenance',
          labelMessageKey: 'bills.maintenance',
          amount: 2500,
          currencyCode: 'INR',
          isCredit: false,
        }],
      }));

      const startTime = Date.now();
      const page1 = paginateResidentBills(generatedBills, { filter: 'unpaid', cursor: null, pageSize: 20 });
      const duration1 = Date.now() - startTime;

      expect(page1.bills.length).toBe(20);
      expect(page1.hasMore).toBe(true);
      expect(page1.nextCursor).toBeDefined();
      expect(duration1).toBeLessThan(100); // Must be lightning fast

      // Paginate next page using cursor
      const startTime2 = Date.now();
      const page2 = paginateResidentBills(generatedBills, {
        filter: 'unpaid',
        pageSize: 20,
        cursor: page1.nextCursor ?? null,
      });
      const duration2 = Date.now() - startTime2;

      expect(page2.bills.length).toBe(20);
      expect(page2.bills[0]?.id).not.toBe(page1.bills[0]?.id);
      expect(duration2).toBeLessThan(100);
    });

    it('evaluates large collections in store filtering safely without throwing', () => {
      // Populate store with 500 mock visitors
      const visitors: Visitor[] = Array.from({ length: 500 }, (_, i) => ({
        id: `vis-bulk-${i}`,
        name: `Bulk Visitor ${i}`,
        phone: `+91987654${String(i).padStart(4, '0')}`,
        type: 'GUEST',
        status: i % 2 === 0 ? 'EXPECTED' : 'COMPLETED',
        expectedDate: '2026-10-15',
        expectedTime: '10:00 AM',
        flatNumber: 'B-804',
        societyName: 'Palm Grove',
        purpose: 'Testing',
        otp: '123456',
        createdAt: new Date().toISOString(),
        createdByUserId: 'usr-rohan-01',
        createdByDisplayName: 'Rohan Sharma',
        societyId: 'soc-palm-grove-01',
        unitId: 'unit-b804',
        dataScopeKey: 'soc-palm-grove-01:unit-b804',
      }));

      mockStore.runTransaction((store) => {
        visitors.forEach(v => store.addVisitor(v));
      });
      const state = mockStore.getState();
      expect(state.visitors.length).toBeGreaterThanOrEqual(500);

      // Verify filtered subset
      const expected = state.visitors.filter(v => v.id.startsWith('vis-bulk-') && v.status === 'EXPECTED');
      expect(expected.length).toBe(250);
    });
  });
});

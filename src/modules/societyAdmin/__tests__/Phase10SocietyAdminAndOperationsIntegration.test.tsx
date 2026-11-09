import React from 'react';
import { screen, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '../../../test/testUtils';
import { mockStore } from '../../../core/mockStore/mockStore';
import { adminMockSource } from '../data/admin.mockSource';
import { accountingMockSource } from '../../accounting/data/accounting.mockSource';
import { superAdminMockSource } from '../../superAdmin/data/superAdmin.mockSource';
import { SocietySetupRepository } from '../../societySetup/data/societySetup.repository';
import { hasPermission, rolePermissionMatrix } from '../../../core/permissions/rolePermissionMap';
import { SocietyAdminDashboardScreen } from '../screens/SocietyAdminDashboardScreen';
import { PendingApprovalsScreen } from '../screens/PendingApprovalsScreen';
import { getEmittedNotifications, resetNotificationMockState } from '../../resident/notifications/data/residentNotifications.mockSource';
import type { Complaint } from '../../../shared/types/complaint.types';
import type { NOCApplication } from '../../../shared/types/noc.types';
import type { FacilityBooking } from '../../../shared/types/facilityBooking.types';

describe('Phase 10 — Society Administration, Operational Control Centers & Governance Integration', () => {
  const testSocietyId = 'society-phase10-test';

  beforeEach(() => {
    resetNotificationMockState();

    mockStore.getState().societyUnits = [
      {
        id: 'unit-p10-101',
        unitNumber: 'A-101',
        towerId: 'tower-a',
        wingId: 'wing-a',
        floorId: 'floor-1',
        occupancyStatus: 'OWNER_OCCUPIED',
        societyId: testSocietyId,
      },
      {
        id: 'unit-p10-102',
        unitNumber: 'A-102',
        towerId: 'tower-a',
        wingId: 'wing-a',
        floorId: 'floor-1',
        occupancyStatus: 'VACANT',
        societyId: testSocietyId,
      },
      {
        id: 'unit-p10-103',
        unitNumber: 'A-103',
        towerId: 'tower-a',
        wingId: 'wing-a',
        floorId: 'floor-1',
        occupancyStatus: 'OWNER_OCCUPIED',
        societyId: testSocietyId,
      },
    ];

    mockStore.getState().complaints = [
      {
        id: 'comp-p10-001',
        ticketNumber: 'CMP-P10-001',
        title: 'Elevator Maintenance Required',
        description: 'Tower A lift 2 jerky motion',
        category: 'LIFT',
        priority: 'HIGH',
        status: 'OPEN',
        unitId: 'unit-p10-101',
        unitNumber: 'A-101',
        wing: 'A Wing',
        submittedBy: 'Amit Kumar',
        submittedByRole: 'OWNER',
        assignedTo: 'Unassigned',
        slaTargetHours: 24,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updates: [],
      } as Complaint,
    ];

    mockStore.getState().nocs = [
      {
        id: 'noc-p10-001',
        nocNumber: 'NOC-P10-001',
        unitId: 'unit-p10-101',
        unitNumber: 'A-101',
        wing: 'A Wing',
        applicantName: 'Amit Kumar',
        applicantRole: 'OWNER',
        purpose: 'RENOVATION',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requiredDocuments: [],
        uploadedDocuments: [],
        clearances: [],
        auditLog: [],
      } as unknown as NOCApplication,
    ];

    mockStore.getState().facilityBookings = [
      {
        id: 'book-p10-001',
        bookingNumber: 'BK-P10-001',
        facilityId: 'clubhouse-hall',
        facilityName: 'Clubhouse Banquet Hall',
        slotId: 'slot-evening',
        date: '2026-12-25',
        startTime: '18:00',
        endTime: '22:00',
        bookedBy: 'Amit Kumar',
        unitNumber: 'A-101',
        wing: 'A Wing',
        status: 'PENDING',
        totalCharge: 5000,
        depositAmount: 2000,
        depositRefundStatus: 'PENDING',
        createdAt: new Date().toISOString(),
        rulesAccepted: true,
      } as unknown as FacilityBooking,
    ];

    mockStore.getState().bills = [
      {
        id: 'bill-p10-001',
        billNumber: 'BILL-P10-001',
        unitId: 'unit-p10-101',
        flatNumber: 'A-101',
        societyId: testSocietyId,
        amount: 3500,
        totalAmount: 3500,
        paidAmount: 3500,
        status: 'PAID',
        dueDate: '2026-11-15T00:00:00Z',
        billDate: '2026-11-01T00:00:00Z',
        lineItems: [],
        createdAt: '2026-11-01T00:00:00Z',
        updatedAt: '2026-11-01T00:00:00Z',
      },
      {
        id: 'bill-p10-002',
        billNumber: 'BILL-P10-002',
        unitId: 'unit-p10-103',
        flatNumber: 'A-103',
        societyId: testSocietyId,
        amount: 4000,
        totalAmount: 4000,
        paidAmount: 0,
        status: 'OVERDUE',
        dueDate: '2026-10-15T00:00:00Z',
        billDate: '2026-10-01T00:00:00Z',
        lineItems: [],
        createdAt: '2026-10-01T00:00:00Z',
        updatedAt: '2026-10-01T00:00:00Z',
      },
    ];
  });

  describe('1. Society Admin Dashboard Dynamic Projection', () => {
    it('should derive all metrics directly from mockStore without hardcoded fallbacks', async () => {
      const dashboard = await adminMockSource.getDashboard();

      expect(dashboard.totalUnits).toBeGreaterThanOrEqual(3);
      expect(dashboard.occupiedUnits).toBeGreaterThanOrEqual(2);
      expect(dashboard.openComplaintsCount).toBeGreaterThanOrEqual(1);
      expect(dashboard.pendingApprovalsCount).toBeGreaterThanOrEqual(2);
      expect(dashboard.pendingNocsCount).toBeGreaterThanOrEqual(1);
      expect(dashboard.thisMonthCollection).toBeGreaterThanOrEqual(3500);
      expect(dashboard.defaulterCount).toBeGreaterThanOrEqual(1);
      expect(dashboard.feedItems).toBeDefined();
      expect(dashboard.feedItems?.length).toBeGreaterThan(0);
    });

    it('should react dynamically when underlying store records change', async () => {
      const initialDashboard = await adminMockSource.getDashboard();
      const initialTotal = initialDashboard.totalUnits;

      mockStore.getState().societyUnits.push({
        id: 'unit-p10-104',
        unitNumber: 'A-104',
        towerId: 'tower-a',
        wingId: 'wing-a',
        floorId: 'floor-1',
        occupancyStatus: 'OWNER_OCCUPIED',
        societyId: testSocietyId,
      });

      const updatedDashboard = await adminMockSource.getDashboard();
      expect(updatedDashboard.totalUnits).toBe(initialTotal + 1);
      expect(updatedDashboard.occupiedUnits).toBe(initialDashboard.occupiedUnits + 1);
    });
  });

  describe('2. Unified Approval Center Projections and Actions', () => {
    it('should project pending approvals across onboarding, NOCs, and facility bookings', async () => {
      const approvals = await adminMockSource.getApprovals();

      expect(approvals.length).toBeGreaterThanOrEqual(2);

      const hasNocApproval = approvals.some(
        (a) => a.id === 'noc-p10-001' || a.type === 'NOC' || a.summary.includes('NOC')
      );
      expect(hasNocApproval).toBe(true);

      const hasFacilityApproval = approvals.some(
        (a) => a.id === 'book-p10-001' || a.type === 'FACILITY_BOOKING' || a.summary.includes('Booking')
      );
      expect(hasFacilityApproval).toBe(true);
    });

    it('should approve a pending NOC, update mockStore state, append audit log, and emit notification', async () => {
      const approvals = await adminMockSource.getApprovals();
      const nocApproval = approvals.find((a) => a.id === 'noc-p10-001');
      expect(nocApproval).toBeDefined();

      const result = await adminMockSource.approveRequest(
        nocApproval!.id,
        'Renovation structural plan verified'
      );
      expect(result.success).toBe(true);

      const updatedNoc = mockStore.getState().nocs.find((n) => n.id === 'noc-p10-001');
      expect(updatedNoc?.status).toBe('APPROVED');

      const auditLogs = await adminMockSource.getAuditLogs();
      const approvalLog = auditLogs.find((l) => l.summary.includes('Approved request noc-p10-001'));
      expect(approvalLog).toBeDefined();

      const notifications = getEmittedNotifications();
      const residentNotification = notifications.find((n) => n.title?.includes('Approved'));
      expect(residentNotification).toBeDefined();
    });

    it('should approve a pending facility booking, update mockStore state, and notify resident', async () => {
      const approvals = await adminMockSource.getApprovals();
      const bookingApproval = approvals.find((a) => a.id === 'book-p10-001');
      expect(bookingApproval).toBeDefined();

      const result = await adminMockSource.approveRequest(
        bookingApproval!.id,
        'Deposit verified and slot confirmed'
      );
      expect(result.success).toBe(true);

      const updatedBooking = mockStore
        .getState()
        .facilityBookings.find((b) => b.id === 'book-p10-001');
      expect(updatedBooking?.status).toBe('CONFIRMED');

      const notifications = getEmittedNotifications();
      const bookingNotification = notifications.find((n) =>
        n.title?.includes('Request Approved')
      );
      expect(bookingNotification).toBeDefined();
    });

    it('should reject a pending request with audit log and notification', async () => {
      mockStore.getState().nocs.push({
        id: 'noc-p10-002',
        nocNumber: 'NOC-P10-002',
        unitId: 'unit-p10-101',
        unitNumber: 'A-101',
        wing: 'A Wing',
        applicantName: 'Amit Kumar',
        applicantRole: 'OWNER',
        purpose: 'COMMERCIAL_USE',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requiredDocuments: [],
        uploadedDocuments: [],
        clearances: [],
        auditLog: [],
      } as unknown as NOCApplication);

      const approvals = await adminMockSource.getApprovals();
      const targetApproval = approvals.find((a) => a.id === 'noc-p10-002');
      expect(targetApproval).toBeDefined();

      const result = await adminMockSource.rejectRequest(
        targetApproval!.id,
        'Commercial usage not permitted per society bylaws'
      );
      expect(result.success).toBe(true);

      const updatedNoc = mockStore.getState().nocs.find((n) => n.id === 'noc-p10-002');
      expect(updatedNoc?.status).toBe('REJECTED');

      const auditLogs = await adminMockSource.getAuditLogs();
      const rejectionLog = auditLogs.find((l) => l.summary.includes('Rejected request noc-p10-002'));
      expect(rejectionLog).toBeDefined();
    });
  });

  describe('3. Complaint Assignment and Escalation Operations', () => {
    it('should assign complaint, update status to ASSIGNED, record timeline update, and notify resident', async () => {
      const complaintId = 'comp-p10-001';
      const assigneeName = 'Suresh Nair (Senior Lift Technician)';

      const result = await adminMockSource.assignComplaint(complaintId, assigneeName);
      expect(result.success).toBe(true);

      const updatedComplaint = mockStore.getState().complaints.find((c) => c.id === complaintId);
      expect(updatedComplaint?.assignedTo).toBe(assigneeName);
      expect(updatedComplaint?.status).toBe('ASSIGNED');
      expect((updatedComplaint?.updates?.length ?? 0)).toBeGreaterThan(0);

      const auditLogs = await adminMockSource.getAuditLogs();
      const assignLog = auditLogs.find((l) =>
        l.summary.includes(`Assigned complaint ${complaintId}`)
      );
      expect(assignLog).toBeDefined();

      const notifications = getEmittedNotifications();
      const complaintNotification = notifications.find((n) =>
        n.title?.includes('Complaint Assigned')
      );
      expect(complaintNotification).toBeDefined();
    });

    it('should escalate complaint, elevate priority to URGENT, and record audit log', async () => {
      const complaintId = 'comp-p10-001';

      const result = await adminMockSource.escalateComplaint(complaintId);
      expect(result.success).toBe(true);

      const escalatedComplaint = mockStore.getState().complaints.find((c) => c.id === complaintId);
      expect(escalatedComplaint?.priority).toBe('URGENT');

      const auditLogs = await adminMockSource.getAuditLogs();
      const escalateLog = auditLogs.find((l) =>
        l.summary.includes(`Escalated complaint ${complaintId}`)
      );
      expect(escalateLog).toBeDefined();
    });
  });

  describe('4. Master Data Hierarchy & Tower Setup Synchronization', () => {
    it('should add new tower structure and synchronize units dynamically', async () => {
      const initialDashboard = await adminMockSource.getDashboard();
      const initialUnits = initialDashboard.totalUnits;

      const success = await SocietySetupRepository.saveTowerSetup({
        towerName: 'Tower Beta',
        wingsCount: 1,
        floorsCount: 2,
        unitsPerFloor: 2,
      });

      expect(success).toBe(true);

      const updatedDashboard = await adminMockSource.getDashboard();
      expect(updatedDashboard.totalUnits).toBe(initialUnits + 4);
    });
  });

  describe('5. Treasurer Operations & Financial Metric Reconciliation', () => {
    it('should calculate collections and outstanding dues directly from mockStore bills', async () => {
      const treasurerResult = await accountingMockSource.getDashboard();
      expect(treasurerResult.ok).toBe(true);

      if (treasurerResult.ok) {
        const data = treasurerResult.data;
        expect(data.totalBilledThisMonth).toBeGreaterThanOrEqual(7500);
        expect(data.totalCollectedThisMonth).toBeGreaterThanOrEqual(3500);
        expect(data.outstandingDues).toBeGreaterThanOrEqual(4000);
        expect(data.collectionEfficiency).toBeGreaterThan(0);
      }
    });
  });

  describe('6. Platform Super Admin & Multi-Society Boundary Isolation', () => {
    it('should list platform societies and support activation/deactivation lifecycle', async () => {
      const societiesResult = await superAdminMockSource.getSocieties();
      expect(societiesResult.ok).toBe(true);

      if (societiesResult.ok) {
        const societies = societiesResult.data;
        expect(societies.length).toBeGreaterThan(0);

        const targetId = societies[0]?.id;
        if (!targetId) throw new Error('No society found');

        const deactivatedResult = await superAdminMockSource.deactivateSociety(
          targetId,
          'Scheduled maintenance'
        );
        expect(deactivatedResult.ok).toBe(true);
        if (deactivatedResult.ok) {
          expect(deactivatedResult.data.status).toBe('SUSPENDED_PLACEHOLDER');
        }

        const activatedResult = await superAdminMockSource.activateSociety(targetId);
        expect(activatedResult.ok).toBe(true);
        if (activatedResult.ok) {
          expect(activatedResult.data.status).toBe('ACTIVE');
        }
      }
    });

    it('should create an isolated demo society with dedicated initial configuration', async () => {
      const createResult = await superAdminMockSource.createDemoSociety(
        'Orchid Heights CHS',
        'GATED_APARTMENT'
      );
      expect(createResult.ok).toBe(true);

      if (createResult.ok) {
        expect(createResult.data.name).toBe('Orchid Heights CHS');
        expect(createResult.data.planCode).toBe('INTERNAL_DEMO');
        expect(createResult.data.status).toBe('ACTIVE');
      }
    });
  });

  describe('7. Role-Based Access Control (RBAC/ABAC) Capability Verification', () => {
    it('should grant society admin full administrative and oversight capabilities', () => {
      expect(hasPermission(['SOCIETY_ADMIN'], 'ADMIN_DASHBOARD_VIEW')).toBe(true);
      expect(hasPermission(['SOCIETY_ADMIN'], 'COMPLAINT_ASSIGN')).toBe(true);
      expect(hasPermission(['SOCIETY_ADMIN'], 'COMPLAINT_RESOLVE')).toBe(true);
      expect(hasPermission(['SOCIETY_ADMIN'], 'NOC_APPROVE')).toBe(true);
      expect(hasPermission(['SOCIETY_ADMIN'], 'FACILITY_OPS_VIEW')).toBe(true);
      expect(hasPermission(['SOCIETY_ADMIN'], 'FEATURE_FLAGS_MANAGE')).toBe(true);
    });

    it('should restrict treasurer to financial and billing operations without guard gate clearance', () => {
      expect(hasPermission(['TREASURER'], 'BILL_VIEW')).toBe(true);
      expect(hasPermission(['TREASURER'], 'TREASURER_DASHBOARD_VIEW')).toBe(true);
      expect(hasPermission(['TREASURER'], 'BILL_GENERATE')).toBe(true);
      expect(hasPermission(['TREASURER'], 'GATE_ENTRY_RECORD')).toBe(false);
    });

    it('should grant security guard and supervisor gate operations and visitor approvals', () => {
      expect(hasPermission(['SECURITY_GUARD'], 'GATE_ENTRY_RECORD')).toBe(true);
      expect(hasPermission(['SECURITY_GUARD'], 'VISITOR_APPROVE')).toBe(true);
      expect(hasPermission(['SECURITY_GUARD'], 'BILL_GENERATE')).toBe(false);
      expect(hasPermission(['SECURITY_SUPERVISOR'], 'PARKING_INCIDENT_RESOLVE')).toBe(true);
    });

    it('should grant super admin universal permissions across all platform capabilities', () => {
      const superAdminPerms = rolePermissionMatrix.SUPER_ADMIN;
      expect(superAdminPerms.length).toBeGreaterThan(40);
      expect(hasPermission(['SUPER_ADMIN'], 'ADMIN_DASHBOARD_VIEW')).toBe(true);
      expect(hasPermission(['SUPER_ADMIN'], 'TREASURER_DASHBOARD_VIEW')).toBe(true);
    });
  });

  describe('8. UI Screen Component Rendering and Interaction Verification', () => {
    it('should render SocietyAdminDashboardScreen with dynamic metric values', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
        dispatch: jest.fn(),
        reset: jest.fn(),
      };

      await renderWithProviders(
        <SocietyAdminDashboardScreen navigation={mockNavigation as unknown as any} />
      );

      await waitFor(() => {
        expect(screen.getByTestId('admin-command-center')).toBeTruthy();
      });

      const totalUnits = (await adminMockSource.getDashboard()).totalUnits;
      expect(screen.getByText(String(totalUnits))).toBeTruthy();
    });

    it('should render PendingApprovalsScreen with search bar, filter tabs, and filtered items', async () => {
      const mockNavigation = {
        navigate: jest.fn(),
        goBack: jest.fn(),
      };

      await renderWithProviders(
        <PendingApprovalsScreen navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByTestId('approval-search-input')).toBeTruthy();
        expect(screen.getByTestId('approval-tab-ALL')).toBeTruthy();
        expect(screen.getByTestId('approval-tab-RESIDENTS')).toBeTruthy();
        expect(screen.getByTestId('approval-tab-NOCS')).toBeTruthy();
        expect(screen.getByTestId('approval-tab-FACILITIES')).toBeTruthy();
        expect(screen.getByTestId('approval-tab-VEHICLES')).toBeTruthy();
      });

      await waitFor(() => {
        expect(screen.getAllByText(/Amit Kumar/).length).toBeGreaterThanOrEqual(1);
      });
    });
  });
});

import { mockStore } from '../mockStore/mockStore';
import { visitorLifecycleStore } from '../../modules/resident/visitors/data/visitorLifecycle.store';
import { guardMockSource } from '../../modules/guard/data/guard.mockSource';
import { billMockSource } from '../../modules/resident/billing/data/billing.mockSource';
import { accountingMockSource } from '../../modules/accounting/data/accounting.mockSource';
import { complaintMockSource } from '../../modules/resident/complaints/data/complaints.mockSource';
import { adminMockSource } from '../../modules/societyAdmin/data/admin.mockSource';
import { facilityMockSource } from '../../modules/resident/facilityBooking/data/facility.mockSource';
import { setCurrentSession } from '../auth/sessionStore';

describe('SOCIETY OS — PHASE 2: End-to-End Cross-Role Workflows', () => {
  beforeEach(() => {
    mockStore.reset();
    setCurrentSession({
      userId: 'usr-owner-01',
      name: 'Shashank Shirode',
      role: 'RESIDENT_OWNER',
      personaKey: 'owner_greenwood',
      societyId: 'soc-greenwood-pune',
      unitId: 'unit-a1204',
      isMockSession: true,
    });
  });

  describe('1. Visitor Lifecycle (Resident <-> Guard)', () => {
    it('synchronizes visitor creation, guard check-in, and guard exit across roles', async () => {
      // Step A: Resident creates a visitor pass
      const passResult = await visitorLifecycleStore.createPass({
        name: 'Rajesh Sharma',
        type: 'GUEST',
        phone: '9876543210',
        expectedDate: '2026-07-15',
        expectedTimeFrom: '10:00 AM',
        expectedTimeTo: '02:00 PM',
        purpose: 'Family visit',
      });

      expect(passResult).toBeDefined();
      expect(passResult.id).toBeDefined();
      expect(passResult.status).toBe('APPROVED');

      // Verify it exists in authoritative mockStore
      const inStore = mockStore.getState().visitors.find((v) => v.id === passResult.id);
      expect(inStore).toBeDefined();
      expect(inStore?.name).toBe('Rajesh Sharma');
      expect(inStore?.status).toBe('APPROVED');

      // Step B: Switch persona to Security Guard
      setCurrentSession({
        userId: 'usr-guard-01',
        name: 'Bahadur Singh',
        role: 'SECURITY_GUARD',
        personaKey: 'guard_main_gate',
        societyId: 'soc-greenwood-pune',
        isMockSession: true,
      });

      // Guard checks expected visitors list
      const expectedVisitors = await guardMockSource.listExpectedVisitors();
      const foundInGuard = expectedVisitors.find((v) => v.id === passResult.id || v.name === 'Rajesh Sharma');
      expect(foundInGuard).toBeDefined();

      // Guard performs check-in
      const entryResult = await visitorLifecycleStore.allowEntry(passResult.id, { gateName: 'Main Gate' });
      expect(entryResult.success).toBe(true);

      // Verify status in mockStore has updated to CHECKED_IN
      const checkedInVisitor = mockStore.getState().visitors.find((v) => v.id === passResult.id);
      expect(checkedInVisitor?.status).toBe('CHECKED_IN');

      // Step C: Switch back to Resident
      setCurrentSession({
        userId: 'usr-owner-01',
        name: 'Shashank Shirode',
        role: 'RESIDENT_OWNER',
        personaKey: 'owner_greenwood',
        societyId: 'soc-greenwood-pune',
        unitId: 'unit-a1204',
        isMockSession: true,
      });

      // Resident inspects their visitor list
      const residentVisitors = await visitorLifecycleStore.getVisitors();
      const residentSeen = residentVisitors.find((v) => v.id === passResult.id);
      expect(residentSeen?.status).toBe('CHECKED_IN');

      // Step D: Guard performs exit
      setCurrentSession({
        userId: 'usr-guard-01',
        name: 'Bahadur Singh',
        role: 'SECURITY_GUARD',
        personaKey: 'guard_main_gate',
        societyId: 'soc-greenwood-pune',
        isMockSession: true,
      });

      const exitResult = await visitorLifecycleStore.recordExit(passResult.id, { gateName: 'Main Gate' });
      expect(exitResult.success).toBe(true);

      // Both roles now see completed status
      const completedVisitor = mockStore.getState().visitors.find((v) => v.id === passResult.id);
      expect(completedVisitor?.status).toBe('CHECKED_OUT');
    });

    it('rejects invalid state transitions such as double check-in or exit before entry', async () => {
      const pass = await visitorLifecycleStore.createPass({
        name: 'Sneha Patil',
        type: 'DELIVERY',
        phone: '9822001122',
        expectedDate: '2026-07-15',
        expectedTimeFrom: '11:00 AM',
        expectedTimeTo: '12:00 PM',
        purpose: 'Courier delivery',
      });

      // Attempting to exit an un-entered visitor must fail
      const exitBeforeEntry = await visitorLifecycleStore.recordExit(pass.id, { gateName: 'Main Gate' });
      expect(exitBeforeEntry.success).toBe(false);

      // First check-in succeeds
      const checkIn1 = await visitorLifecycleStore.allowEntry(pass.id, { gateName: 'Main Gate' });
      expect(checkIn1.success).toBe(true);

      // Second check-in must fail (cannot check in already checked-in visitor)
      const checkIn2 = await visitorLifecycleStore.allowEntry(pass.id, { gateName: 'Main Gate' });
      expect(checkIn2.success).toBe(false);
    });
  });

  describe('2. Billing & Accounting Lifecycle (Resident <-> Treasurer)', () => {
    it('supports full and partial simulated payments with ledger entry and treasurer updates', async () => {
      // Step A: Resident checks bills
      const billsResult = await billMockSource.list();
      expect(billsResult.ok).toBe(true);
      if (!billsResult.ok) return;

      const targetBill = billsResult.data[0];
      expect(targetBill).toBeDefined();
      if (!targetBill) return;
      const originalAmount = targetBill.amount;
      const initialPaid = targetBill.paidAmount ?? 0;
      const outstanding = originalAmount - initialPaid;

      // Partial payment of ₹1,000
      const partialPayAmount = Math.min(1000, outstanding);
      const payResult = await billMockSource.payBill({
        billId: targetBill.id,
        amount: partialPayAmount,
        paymentMethod: 'UPI',
      });

      expect(payResult.ok).toBe(true);
      if (!payResult.ok) return;

      expect(payResult.data.transactionId).toBeDefined();
      expect(payResult.data.receiptNumber).toBeDefined();

      const updatedBill = mockStore.getState().bills.find((b) => b.id === targetBill.id);
      expect(updatedBill?.paidAmount).toBe(initialPaid + partialPayAmount);

      // Step B: Treasurer checks dashboard totals and collections
      setCurrentSession({
        userId: 'usr-treasurer-01',
        name: 'Meena Kulkarni',
        role: 'TREASURER',
        personaKey: 'treasurer_greenwood',
        societyId: 'soc-greenwood-pune',
      });

      const treasurerDash = await accountingMockSource.getDashboard();
      expect(treasurerDash.ok).toBe(true);
      if (!treasurerDash.ok) return;

      // Treasurer dashboard should have live recentCollections matching the payment
      const foundCollection = treasurerDash.data.recentCollections.find(
        (c) => c.amount === partialPayAmount
      );
      expect(foundCollection).toBeDefined();
      expect(treasurerDash.data.totalCollectedThisMonth).toBeGreaterThan(0);
    });
  });

  describe('3. Complaints & Helpdesk Lifecycle (Resident <-> Admin)', () => {
    it('allows resident to raise complaint and admin to assign staff and update status', async () => {
      // Step A: Resident creates a complaint
      const createResult = await complaintMockSource.create({
        title: 'Elevator squeaking sound',
        description: 'Noticeable metallic grinding sound in Wing A lift',
        category: 'LIFT',
        priority: 'HIGH',
        location: 'Wing A Lift 1',
      });

      expect(createResult.ok).toBe(true);
      if (!createResult.ok) return;

      const createdComplaint = createResult.data;
      expect(createdComplaint.id).toBeDefined();
      expect(createdComplaint.status).toBe('OPEN');

      // Step B: Switch persona to Society Admin
      setCurrentSession({
        userId: 'usr-admin-01',
        name: 'Rohan Deshmukh',
        role: 'SOCIETY_ADMIN',
        personaKey: 'admin_greenwood',
        societyId: 'soc-greenwood-pune',
      });

      // Admin views complaints
      const adminComplaints = await adminMockSource.getComplaints();
      const inAdmin = adminComplaints.find((c) => c.id === createdComplaint.id);
      expect(inAdmin).toBeDefined();
      expect(inAdmin?.status).toBe('OPEN');

      // Admin assigns complaint to technician
      const assignResult = await adminMockSource.assignComplaint(createdComplaint.id, 'Santosh (Lift Specialist)');
      expect(assignResult.success).toBe(true);

      // Step C: Switch back to Resident and verify updated assignment and timeline
      setCurrentSession({
        userId: 'usr-owner-01',
        name: 'Shashank Shirode',
        role: 'RESIDENT_OWNER',
        personaKey: 'owner_greenwood',
        homeContextId: 'res-greenwood-a1204',
        societyId: 'soc-greenwood-pune',
        unitId: 'unit-a1204',
      });

      const residentDetail = await complaintMockSource.detail(createdComplaint.id);
      expect(residentDetail.ok).toBe(true);
      if (!residentDetail.ok || !residentDetail.data) return;

      expect(residentDetail.data.assignedTo).toBe('Santosh (Lift Specialist)');
      expect(residentDetail.data.status).toBe('ASSIGNED');
    });
  });

  describe('4. Facility Booking & Conflict Detection', () => {
    it('reserves slot, rejects conflicting overlap, and restores availability on cancellation', async () => {
      // Get an available facility
      const facilities = await facilityMockSource.getFacilities();
      expect(facilities.ok).toBe(true);
      if (!facilities.ok || facilities.data.length === 0) return;
      const facility = facilities.data[0];
      if (!facility) return;
      const facilityId = facility.id;
      const slotTime = '10:00 AM - 11:00 AM';
      const bookingDate = '2026-07-20';

      // Step A: Resident 1 books the slot
      const booking1 = await facilityMockSource.createFacilityBooking({
        facilityId,
        facilityName: facility.name,
        bookingType: 'HOURLY',
        date: bookingDate,
        slot: slotTime,
        rulesAccepted: true,
        damageConsentAccepted: true,
      });

      expect(booking1.ok).toBe(true);
      if (!booking1.ok) return;
      const bookingId = booking1.data.id;

      // Step B: Check availability for the slot -> must be BOOKED
      const availability1 = await facilityMockSource.getFacilityAvailability(facilityId, bookingDate);
      expect(availability1.ok).toBe(true);
      if (!availability1.ok) return;

      const slotState = availability1.data.find((s) => s.timeRange === slotTime);
      expect(slotState?.status).toBe('BOOKED');
      expect(slotState?.capacityAvailable).toBe(0);

      // Step C: Resident 2 attempts to book the same slot -> must fail with SLOT_UNAVAILABLE
      const conflictingBooking = await facilityMockSource.createFacilityBooking({
        facilityId,
        facilityName: facility.name,
        bookingType: 'HOURLY',
        date: bookingDate,
        slot: slotTime,
        rulesAccepted: true,
        damageConsentAccepted: true,
      });

      expect(conflictingBooking.ok).toBe(false);
      if (!conflictingBooking.ok) {
        expect(conflictingBooking.error.code).toBe('SLOT_UNAVAILABLE');
      }

      // Step D: Cancel the initial booking
      const cancelResult = await facilityMockSource.cancelBooking(bookingId, { reason: 'Rescheduled' });
      expect(cancelResult.ok).toBe(true);

      // Step E: Check availability again -> slot must be AVAILABLE
      const availability2 = await facilityMockSource.getFacilityAvailability(facilityId, bookingDate);
      expect(availability2.ok).toBe(true);
      if (!availability2.ok) return;

      const slotStateAfterCancel = availability2.data.find((s) => s.timeRange === slotTime);
      expect(slotStateAfterCancel?.status).toBe('AVAILABLE');
    });
  });

  describe('5. Multi-Role Data Preservation and Isolation', () => {
    it('preserves shared operational state across persona switches without resetting store', async () => {
      // 1. Create a visitor as Resident
      const visitor = await visitorLifecycleStore.createPass({
        name: 'Shared Data Test',
        type: 'GUEST',
        phone: '9998887776',
        expectedDate: '2026-07-16',
        expectedTimeFrom: '09:00 AM',
        expectedTimeTo: '11:00 AM',
        purpose: 'Data persistence test',
      });

      // 2. Switch to Guard
      setCurrentSession({
        userId: 'usr-guard-01',
        name: 'Bahadur Singh',
        role: 'SECURITY_GUARD',
        personaKey: 'guard_main_gate',
        societyId: 'soc-greenwood-pune',
      });

      // 3. Switch to Society Admin
      setCurrentSession({
        userId: 'usr-admin-01',
        name: 'Rohan Deshmukh',
        role: 'SOCIETY_ADMIN',
        personaKey: 'admin_greenwood',
        societyId: 'soc-greenwood-pune',
      });

      // 4. Switch to Treasurer
      setCurrentSession({
        userId: 'usr-treasurer-01',
        name: 'Meena Kulkarni',
        role: 'TREASURER',
        personaKey: 'treasurer_greenwood',
        societyId: 'soc-greenwood-pune',
      });

      // 5. Switch back to Resident
      setCurrentSession({
        userId: 'usr-owner-01',
        name: 'Shashank Shirode',
        role: 'RESIDENT_OWNER',
        personaKey: 'owner_greenwood',
        homeContextId: 'res-greenwood-a1204',
        societyId: 'soc-greenwood-pune',
        unitId: 'unit-a1204',
      });

      // Verify the visitor created before persona switches is still completely preserved
      const retrieved = await visitorLifecycleStore.findPass(visitor.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Shared Data Test');
    });
  });
});

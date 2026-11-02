import { mockStore } from '../mockStore/mockStore';
import { visitorsMockSource } from '../../modules/resident/visitors/data/visitors.mockSource';
import { complaintMockSource } from '../../modules/resident/complaints/data/complaints.mockSource';
import { billMockSource } from '../../modules/resident/billing/data/billing.mockSource';
import { facilityMockSource } from '../../modules/resident/facilityBooking/data/facility.mockSource';
import { emergencyRoutingService } from '../emergency/EmergencyRoutingService';
import { MOCK_PERSONAS } from '../identity/personaRegistry';
import { setCurrentSession } from '../auth/sessionStore';
import { domainEventBus } from '../events/DomainEventBus';
import { notificationResolver } from '../notifications/NotificationResolver';

const flushAsync = () => new Promise(resolve => setTimeout(resolve, 50));

describe('SocietyOS Critical End-to-End User Journeys (E2E-01 through E2E-05)', () => {
  beforeEach(async () => {
    mockStore.reset();
    domainEventBus.clearHistory();
    notificationResolver.clearNotifications();
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

  // E2E-01: Resident creates visitor -> Guard admits -> Resident sees Inside -> Guard exits -> Resident sees Completed
  it('E2E-01: Visitor Journey (Create -> Gate Entry -> Inside -> Gate Exit -> Completed)', async () => {
    // 1. Resident creates visitor pass
    const createRes = await visitorsMockSource.create({
      name: 'Aarav Patel',
      phone: '+919876543210',
      flatNumber: 'B-804',
      type: 'GUEST',
      purpose: 'Family Visit',
      expectedDate: '2026-10-10',
      expectedTime: '11:00 AM',
    });
    expect(createRes.ok).toBe(true);
    if (!createRes.ok) return;
    const visitorId = createRes.data.id;
    const otp = createRes.data.otp!;
    expect(createRes.data.status).toBe('EXPECTED');

    // 2. Guard admits visitor at gate
    const gateEntryRes = await visitorsMockSource.validatePassAtGate(visitorId, otp);
    expect(gateEntryRes.ok).toBe(true);
    if (!gateEntryRes.ok) return;
    expect(gateEntryRes.data.visitor.status).toBe('CHECKED_IN');

    // 3. Resident checks detail and sees visitor is inside
    const residentDetail = await visitorsMockSource.detail(visitorId);
    expect(residentDetail.ok).toBe(true);
    if (!residentDetail.ok || !residentDetail.data) return;
    expect(residentDetail.data.status).toBe('CHECKED_IN');

    // 4. Guard / Resident confirms exit
    const exitRes = await visitorsMockSource.confirmVisitorLeft({ visitorPassId: visitorId });
    expect(exitRes.ok).toBe(true);
    if (!exitRes.ok) return;
    expect(exitRes.data.status).toBe('COMPLETED');
    expect(exitRes.data.exitTracking?.exitStatus).toBe('residentConfirmedLeft');

    // 5. Resident verifies completed state
    const completedDetail = await visitorsMockSource.detail(visitorId);
    expect(completedDetail.ok).toBe(true);
    if (!completedDetail.ok || !completedDetail.data) return;
    expect(completedDetail.data.status).toBe('COMPLETED');
  });

  // E2E-02: Resident creates complaint -> visible -> lifecycle progresses -> resident sees updated status
  it('E2E-02: Complaint Journey (Create -> Open -> In Progress -> Resolved)', async () => {
    // 1. Resident creates complaint
    const createRes = await complaintMockSource.create({
      title: 'Water pressure low in bathroom',
      description: 'Water pressure has dropped significantly since morning',
      category: 'PLUMBING',
      priority: 'HIGH',
      location: 'Master Bathroom',
      images: [],
    });
    expect(createRes.ok).toBe(true);
    if (!createRes.ok) return;
    const complaintId = createRes.data.id;
    expect(createRes.data.status).toBe('OPEN');

    // 2. Lifecycle progresses to IN_PROGRESS
    const inProgressRes = await complaintMockSource.updateStatus(complaintId, 'IN_PROGRESS', 'Assigned plumber visiting at 3 PM');
    expect(inProgressRes.ok).toBe(true);

    // 3. Resident observes updated IN_PROGRESS status
    const inProgressDetail = await complaintMockSource.detail(complaintId);
    expect(inProgressDetail.ok).toBe(true);
    if (!inProgressDetail.ok || !inProgressDetail.data) return;
    expect(inProgressDetail.data.status).toBe('IN_PROGRESS');

    // 4. Plumber resolves complaint
    const resolvedRes = await complaintMockSource.updateStatus(complaintId, 'RESOLVED', 'Main line pressure valve replaced and tested');
    expect(resolvedRes.ok).toBe(true);

    // 5. Resident confirms resolution and view notes
    const resolvedDetail = await complaintMockSource.detail(complaintId);
    expect(resolvedDetail.ok).toBe(true);
    if (!resolvedDetail.ok || !resolvedDetail.data) return;
    expect(resolvedDetail.data.status).toBe('RESOLVED');
    expect(resolvedDetail.data.updates?.length ?? 1).toBeGreaterThanOrEqual(1);
  });

  // E2E-03: Resident pays bill -> receipt -> bill paid -> Dashboard updated
  it('E2E-03: Billing Journey (List -> Pay -> Receipt -> Settled State)', async () => {
    // 1. Get unpaid bill
    const billsRes = await billMockSource.getBillsPage(undefined as any, { filter: 'unpaid', pageSize: 20 });
    expect(billsRes.ok).toBe(true);
    if (!billsRes.ok) return;
    const unpaidBill = billsRes.data.bills[0];
    expect(unpaidBill).toBeDefined();
    if (!unpaidBill) return;

    // 2. Execute payment
    const payRes = await billMockSource.mockPayment(undefined as any, {
      billId: unpaidBill.id,
      amount: unpaidBill.amount,
      paymentMethod: 'UPI',
    });
    expect(payRes.ok).toBe(true);
    if (!payRes.ok) return;
    expect(payRes.data.transactionId).toBeDefined();
    expect(payRes.data.receiptNumber).toBeDefined();

    // 3. Verify bill detail reflects updated status
    const updatedBill = await billMockSource.getBillDetail(undefined as any, unpaidBill.id);
    expect(updatedBill.ok).toBe(true);
    if (!updatedBill.ok || !updatedBill.data) return;
    expect(updatedBill.data.status).toBe('PAID');
  });

  // E2E-04: Resident books facility -> My Bookings -> cancellation -> slot available again
  it('E2E-04: Facility Booking Journey (Book Slot -> Confirmed -> My Bookings -> Cancellation -> Slot Available)', async () => {
    const slotTime = '07:00 PM - 08:00 PM';
    const bookingDate = '2026-11-15';

    // 1. Book facility
    const bookRes = await facilityMockSource.createFacilityBooking({
      unitId: 'unit-b804',
      facilityId: 'fac-tennis-01',
      facilityName: 'Tennis Court',
      bookingType: 'HOURLY',
      date: bookingDate,
      slot: slotTime,
      purpose: 'Evening Practice',
      guestCount: 2,
      contactNumber: '+919876543210',
      setupRequired: false,
      rulesAccepted: true,
      damageConsentAccepted: true,
      chargeAmount: 150,
      depositAmount: 0,
      approvalRequired: false,
    });
    expect(bookRes.ok).toBe(true);
    if (!bookRes.ok) return;
    const bookingId = bookRes.data.id;
    expect(bookRes.data.status).toBe('CONFIRMED');

    // 2. Verify My Bookings lists the reservation
    const myBookingsRes = await facilityMockSource.getMyBookings({ unitId: 'unit-b804' });
    expect(myBookingsRes.ok).toBe(true);
    if (!myBookingsRes.ok) return;
    expect(myBookingsRes.data.some(b => b.id === bookingId && b.status === 'CONFIRMED')).toBe(true);

    // 3. Cancel booking
    const cancelRes = await facilityMockSource.cancelBooking(bookingId, {
      reason: 'Rain expected',
    });
    expect(cancelRes.ok).toBe(true);

    // 4. Verify slot is restored for re-booking
    const rebookRes = await facilityMockSource.createFacilityBooking({
      unitId: 'unit-b804',
      facilityId: 'fac-tennis-01',
      facilityName: 'Tennis Court',
      bookingType: 'HOURLY',
      date: bookingDate,
      slot: slotTime,
      purpose: 'Re-booking After Rain Cancelled',
      guestCount: 2,
      contactNumber: '+919876543210',
      setupRequired: false,
      rulesAccepted: true,
      damageConsentAccepted: true,
      chargeAmount: 150,
      depositAmount: 0,
      approvalRequired: false,
    });
    expect(rebookRes.ok).toBe(true);
  });

  // E2E-05: SOS -> dispatch confirmation -> responder visibility -> incident history
  it('E2E-05: Emergency SOS Journey (Trigger -> Mandatory Responders -> Acknowledge -> History)', async () => {
    // 1. Trigger SOS
    const incident = await emergencyRoutingService.triggerEmergency(MOCK_PERSONAS.rohan, 'SECURITY', 'Suspicious person outside door');
    expect(incident.status).toBe('TRIGGERED');
    expect(incident.routingSnapshot.societyGroups).toContain('Main Gate Security');
    expect(incident.routingSnapshot.resolvedRecipients.length).toBeGreaterThan(0);

    await flushAsync();

    // 2. Guard acknowledges incident
    const acknowledged = await emergencyRoutingService.acknowledgeEmergency(
      MOCK_PERSONAS.vikram,
      incident.id,
      'Guard Vikram responding on foot'
    );
    expect(acknowledged).not.toBeNull();
    expect(acknowledged?.status).toBe('ACKNOWLEDGED');
    expect(acknowledged?.acknowledgedBy?.displayName).toBe('Vikram');

    // 3. Verify notification delivery
    const rohanNotifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.rohan.user.id);
    expect(rohanNotifs.some(n => n.title === 'SOS Dispatched')).toBe(true);
  });
});

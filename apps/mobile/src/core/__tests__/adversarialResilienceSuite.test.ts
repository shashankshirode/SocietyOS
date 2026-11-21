import { mockStore } from '../mockStore/mockStore';
import { domainEventBus } from '../events/DomainEventBus';
import { notificationResolver } from '../notifications/NotificationResolver';
import { setCurrentSession } from '../auth/sessionStore';
import { MOCK_PERSONAS } from '../identity/personaRegistry';
import { visitorsMockSource } from '../../modules/resident/visitors/data/visitors.mockSource';
import { complaintMockSource } from '../../modules/resident/complaints/data/complaints.mockSource';
import { billMockSource } from '../../modules/resident/billing/data/billing.mockSource';
import { facilityMockSource } from '../../modules/resident/facilityBooking/data/facility.mockSource';
import { emergencyRoutingService } from '../emergency/EmergencyRoutingService';
import { VisitorPassCancellationReason } from '../../shared/types/visitor.types';
import { resolveRequestContext } from '../../modules/resident/homeContext/utils/resolveRequestContext';
import { executeGuardedOperation, clearOperationStore } from '../operations/operationGuard';
import { setFaultProfile, resetFaultProfile } from '../faultInjection/faultProfile';

const flushAsync = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('SocietyOS Adversarial Resilience & Flow Certification', () => {
  beforeEach(async () => {
    notificationResolver.clear();
    emergencyRoutingService.clear();
    domainEventBus.clearHistory();
    mockStore.reset();
    clearOperationStore();
    resetFaultProfile();

    await setCurrentSession({
      userId: MOCK_PERSONAS.sunita.user.id,
      name: 'Sunita Sharma',
      role: 'RESIDENT_FAMILY',
      personaKey: 'sunita',
      societyId: 'soc-palm-grove-01',
      unitId: 'unit-b804',
      unitLabel: 'B-804',
      isMockSession: true,
    });
  });

  afterEach(() => {
    resetFaultProfile();
    clearOperationStore();
  });

  // ==========================================
  // VISITORS ADVERSARIAL SUITE
  // ==========================================
  describe('Visitors Adversarial Suite', () => {
    it('prevents admitting a cancelled visitor pass', async () => {
      const created = await visitorsMockSource.create({
        name: 'Adversarial Guest',
        phone: '+919876543210',
        flatNumber: 'B-804',
        type: 'GUEST',
        purpose: 'Dinner',
        expectedDate: '2026-10-05',
        expectedTime: '07:00 PM',
      });
      expect(created.ok).toBe(true);
      if (!created.ok) return;

      // Cancel the pass
      const cancel = await visitorsMockSource.cancelVisitorPass({
        visitorPassId: created.data.id,
        reason: VisitorPassCancellationReason.PlansChanged,
      });
      expect(cancel.ok).toBe(true);

      // Gate credential validation must mark CANCELLED
      const validation = visitorsMockSource.validateCredential(created.data.id, created.data.otp);
      expect(validation).toBe('CANCELLED');
    });

    it('prevents duplicate exit on an already completed visitor', async () => {
      const created = await visitorsMockSource.create({
        name: 'Exit Test Guest',
        phone: '+919876543210',
        flatNumber: 'B-804',
        type: 'GUEST',
        purpose: 'Delivery',
        expectedDate: '2026-10-05',
        expectedTime: '02:00 PM',
      });
      expect(created.ok).toBe(true);
      if (!created.ok) return;

      // Admit at gate
      const admit = await visitorsMockSource.validatePassAtGate(created.data.id, created.data.otp!);
      expect(admit.ok).toBe(true);

      // Confirm left (first exit)
      const firstExit = await visitorsMockSource.confirmVisitorLeft({
        visitorPassId: created.data.id,
      });
      expect(firstExit.ok).toBe(true);
      if (!firstExit.ok) return;
      expect(firstExit.data.status).toBe('COMPLETED');
      expect(firstExit.data.exitTracking?.exitStatus).toBe('residentConfirmedLeft');

      // Attempt duplicate exit on already completed visitor
      const duplicateExit = await visitorsMockSource.confirmVisitorLeft({
        visitorPassId: created.data.id,
      });
      expect(duplicateExit.ok).toBe(false);
      if (!duplicateExit.ok) {
        expect(duplicateExit.error.code).toBe('ALREADY_COMPLETED');
      }
    });

    it('protects visitor creation against concurrent double-tap submissions', async () => {
      let runCount = 0;
      const createOp = async () => {
        runCount++;
        return visitorsMockSource.create({
          name: 'Double Tap Visitor',
          phone: '+919876543210',
          flatNumber: 'B-804',
          type: 'GUEST',
          purpose: 'Meeting',
          expectedDate: '2026-10-05',
          expectedTime: '03:00 PM',
        });
      };

      const [res1, res2] = await Promise.all([
        executeGuardedOperation('vis-create-btn', createOp, { idempotencyKey: 'idem-create-vis-1' }),
        executeGuardedOperation('vis-create-btn', createOp, { idempotencyKey: 'idem-create-vis-1' }),
      ]);

      expect(res1.ok).toBe(true);
      expect(res2.ok).toBe(true);
      expect(runCount).toBe(1);
    });
  });

  // ==========================================
  // COMPLAINTS ADVERSARIAL SUITE
  // ==========================================
  describe('Complaints Adversarial Suite', () => {
    it('preserves history and appends updates upon status transitions', async () => {
      const created = await complaintMockSource.create({
        title: 'Elevator squeaking sound',
        description: 'Loud squeaking noise on floor 8',
        category: 'LIFT',
        priority: 'HIGH',
        location: 'Wing B Elevator',
      });
      expect(created.ok).toBe(true);
      if (!created.ok) return;

      const updated = await complaintMockSource.updateStatus(created.data.id, 'IN_PROGRESS', 'Technician dispatched');
      expect(updated.ok).toBe(true);
      if (!updated.ok) return;

      expect(updated.data.status).toBe('IN_PROGRESS');
      expect(updated.data.updates?.length).toBeGreaterThanOrEqual(2);
      expect(updated.data.updates?.some(u => u.note === 'Technician dispatched')).toBe(true);
    });

    it('rejects update on a non-existent complaint cleanly with COMPLAINT_NOT_FOUND', async () => {
      const result = await complaintMockSource.updateStatus('comp-404-nonexistent', 'RESOLVED');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('COMPLAINT_NOT_FOUND');
      }
    });
  });

  // ==========================================
  // BILLING ADVERSARIAL SUITE
  // ==========================================
  describe('Billing Adversarial Suite', () => {
    it('strictly prevents double payment of an already-settled bill', async () => {
      const context = resolveRequestContext();
      const bills = await billMockSource.list(context);
      expect(bills.ok).toBe(true);
      if (!bills.ok) return;

      const dueBill = bills.data.find(b => b.status === 'DUE');
      expect(dueBill).toBeDefined();
      if (!dueBill) return;

      // First payment
      const p1 = await billMockSource.mockPayment(context, {
        billId: dueBill.id,
        amount: dueBill.amount,
        paymentMethod: 'NET_BANKING',
      });
      expect(p1.ok).toBe(true);

      // Second payment on same bill
      const p2 = await billMockSource.mockPayment(context, {
        billId: dueBill.id,
        amount: dueBill.amount,
        paymentMethod: 'NET_BANKING',
      });
      expect(p2.ok).toBe(false);
      if (!p2.ok) {
        expect(p2.error.code).toBe('RESIDENT_BILL_ALREADY_PAID');
      }
    });

    it('deduplicates rapid double-tap on payment checkout using idempotency key', async () => {
      const context = resolveRequestContext();
      const bills = await billMockSource.list(context);
      if (!bills.ok) return;

      const dueBill = bills.data.find(b => b.status === 'OVERDUE' || b.status === 'DUE');
      if (!dueBill) return;

      let paymentCalls = 0;
      const payAction = async () => {
        paymentCalls++;
        return billMockSource.mockPayment(context, {
          billId: dueBill.id,
          amount: dueBill.amount,
          paymentMethod: 'UPI',
        });
      };

      const [r1, r2] = await Promise.all([
        executeGuardedOperation('checkout-pay', payAction, { idempotencyKey: `idem-pay-${dueBill.id}` }),
        executeGuardedOperation('checkout-pay', payAction, { idempotencyKey: `idem-pay-${dueBill.id}` }),
      ]);

      expect(r1.ok).toBe(true);
      expect(r2.ok).toBe(true);
      expect(paymentCalls).toBe(1);
    });
  });

  // ==========================================
  // FACILITY BOOKING ADVERSARIAL SUITE
  // ==========================================
  describe('Facility Booking Adversarial Suite', () => {
    it('restores slot availability when an active booking is cancelled', async () => {
      const date = '2026-12-01';
      const slot = '04:00 PM - 05:00 PM';
      const facilityId = 'fac-badminton-01';

      // 1. Create booking
      const bookRes = await facilityMockSource.createFacilityBooking({
        unitId: 'unit-b804',
        facilityId,
        facilityName: 'Badminton Court',
        bookingType: 'HOURLY',
        date,
        slot,
        purpose: 'Friendly match',
        guestCount: 2,
        contactNumber: '+919876543210',
        setupRequired: false,
        rulesAccepted: true,
        damageConsentAccepted: true,
        chargeAmount: 0,
        depositAmount: 0,
        approvalRequired: false,
      });
      expect(bookRes.ok).toBe(true);
      if (!bookRes.ok) return;

      // 2. Cancellation
      const cancelRes = await facilityMockSource.cancelBooking(bookRes.data.id, {
        reason: 'Weather',
        consentAccepted: true,
      });
      expect(cancelRes.ok).toBe(true);

      // 3. New booking for the same slot can now succeed
      const rebookRes = await facilityMockSource.createFacilityBooking({
        unitId: 'unit-b804',
        facilityId,
        facilityName: 'Badminton Court',
        bookingType: 'HOURLY',
        date,
        slot,
        purpose: 'Rescheduled match',
        guestCount: 2,
        contactNumber: '+919876543210',
        setupRequired: false,
        rulesAccepted: true,
        damageConsentAccepted: true,
        chargeAmount: 0,
        depositAmount: 0,
        approvalRequired: false,
      });
      expect(rebookRes.ok).toBe(true);
    });
  });

  // ==========================================
  // EMERGENCY SOS ADVERSARIAL SUITE
  // ==========================================
  describe('Emergency SOS Adversarial Suite', () => {
    it('dispatches to mandatory society responders and emits emergency event', async () => {
      const incident = await emergencyRoutingService.triggerEmergency(MOCK_PERSONAS.sunita, 'MEDICAL', 'Clubhouse poolside');
      expect(incident.category).toBe('MEDICAL');
      expect(incident.routingSnapshot.societyGroups.length).toBeGreaterThan(0);
      expect(incident.status).toBe('TRIGGERED');

      await flushAsync();

      const events = domainEventBus.getHistory();
      const sosEvent = events.find(e => e.eventType === 'emergency.sos.triggered');
      expect(sosEvent).toBeDefined();

      const notifications = notificationResolver.getUserNotifications(MOCK_PERSONAS.sunita.user.id);
      expect(notifications.some(n => n.title === 'SOS Dispatched')).toBe(true);
    });
  });
});

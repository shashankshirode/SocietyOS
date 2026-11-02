import { mockStore } from '../mockStore/mockStore';
import { domainEventBus } from '../events/DomainEventBus';
import { notificationResolver } from '../notifications/NotificationResolver';
import { setCurrentSession } from '../auth/sessionStore';
import { MOCK_PERSONAS } from '../identity/personaRegistry';
import { visitorsMockSource } from '../../modules/resident/visitors/data/visitors.mockSource';
import { complaintMockSource } from '../../modules/resident/complaints/data/complaints.mockSource';
import { billMockSource } from '../../modules/resident/billing/data/billing.mockSource';
import { facilityMockSource } from '../../modules/resident/facilityBooking/data/facility.mockSource';
import { VisitorPassCancellationReason } from '../../shared/types/visitor.types';
import { resolveRequestContext } from '../../modules/resident/homeContext/utils/resolveRequestContext';
import { createFixedClock } from '../temporal/temporal.service';
import { createSequentialIdGenerator, setIdGenerator, resetIdGenerator } from '../id/idGenerator';

const flushAsync = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('SocietyOS Contract Hardening & Failure Certification', () => {
  beforeEach(async () => {
    notificationResolver.clear();
    domainEventBus.clearHistory();
    mockStore.reset();
    resetIdGenerator();

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
    resetIdGenerator();
  });

  describe('Deterministic Runtime & Clocks', () => {
    it('uses FixedClock and SequentialIdGenerator for reproducible test runs', () => {
      const fixedClock = createFixedClock('2026-10-02T10:00:00.000Z');
      expect(fixedClock.nowIso()).toBe('2026-10-02T10:00:00.000Z');
      expect(fixedClock.nowUtc().getFullYear()).toBe(2026);

      const seqGen = createSequentialIdGenerator(1);
      setIdGenerator(seqGen);
      expect(seqGen.nextVisitorId()).toBe('vis-0001');
      expect(seqGen.nextVisitorId()).toBe('vis-0002');
      expect(seqGen.nextBookingId()).toBe('fb-0003');
    });
  });

  describe('Section 85 Failure Certification — Things that SHOULD fail', () => {
    it('rejects payment on an already-paid bill without partial state mutation', async () => {
      const context = resolveRequestContext();
      const billsRes = await billMockSource.list(context);
      expect(billsRes.ok).toBe(true);
      if (!billsRes.ok) return;

      const unpaidBill = billsRes.data.find(b => b.status === 'DUE');
      expect(unpaidBill).toBeDefined();
      if (!unpaidBill) return;

      // 1. Pay the bill in full
      const firstPay = await billMockSource.mockPayment(context, {
        billId: unpaidBill.id,
        amount: unpaidBill.amount,
        paymentMethod: 'UPI',
      });
      expect(firstPay.ok).toBe(true);

      const initialLedgerCount = mockStore.getState().ledgerEntries.length;

      // 2. Attempt duplicate payment on the already-paid bill
      const duplicatePay = await billMockSource.mockPayment(context, {
        billId: unpaidBill.id,
        amount: unpaidBill.amount,
        paymentMethod: 'UPI',
      });

      // Must fail cleanly with typed error
      expect(duplicatePay.ok).toBe(false);
      if (!duplicatePay.ok) {
        expect(duplicatePay.error.code).toBe('RESIDENT_BILL_ALREADY_PAID');
        expect(duplicatePay.error.category).toBe('VALIDATION');
      }

      // Proves no partial ledger entry was inserted
      expect(mockStore.getState().ledgerEntries.length).toBe(initialLedgerCount);
    });

    it('rejects double-booking on an already-reserved facility slot', async () => {
      const context = resolveRequestContext();
      const date = '2026-11-10';
      const slot = '06:00 PM - 07:00 PM';
      const facilityId = 'fac-badminton-01';

      // 1. First booking succeeds
      const first = await facilityMockSource.createFacilityBooking({
        unitId: 'unit-b804',
        facilityId,
        facilityName: 'Badminton Court',
        bookingType: 'HOURLY',
        date,
        slot,
        purpose: 'Match',
        guestCount: 2,
        contactNumber: '+919876543210',
        setupRequired: false,
        rulesAccepted: true,
        damageConsentAccepted: true,
        chargeAmount: 0,
        depositAmount: 0,
        approvalRequired: false,
      });
      expect(first.ok).toBe(true);

      // 2. Second booking on the exact same slot must be rejected
      const second = await facilityMockSource.createFacilityBooking({
        unitId: 'unit-b804',
        facilityId,
        facilityName: 'Badminton Court',
        bookingType: 'HOURLY',
        date,
        slot,
        purpose: 'Match 2',
        guestCount: 2,
        contactNumber: '+919876543210',
        setupRequired: false,
        rulesAccepted: true,
        damageConsentAccepted: true,
        chargeAmount: 0,
        depositAmount: 0,
        approvalRequired: false,
      });

      expect(second.ok).toBe(false);
      if (!second.ok) {
        expect(second.error.code).toBe('SLOT_UNAVAILABLE');
      }
    });

    it('rejects cancellation of a non-existent or already-cancelled visitor pass', async () => {
      // 1. Non-existent pass returns VISITOR_NOT_FOUND
      const nonExistent = await visitorsMockSource.cancelVisitorPass({
        visitorPassId: 'vis-does-not-exist-999',
        reason: VisitorPassCancellationReason.PlansChanged,
      });
      expect(nonExistent.ok).toBe(false);
      if (!nonExistent.ok) {
        expect(nonExistent.error.code).toBe('VISITOR_NOT_FOUND');
      }

      // 2. Create and cancel once
      const created = await visitorsMockSource.create({
        name: 'Temporary Guest',
        phone: '+919876543210',
        flatNumber: 'B-804',
        type: 'GUEST',
        purpose: 'Dinner',
        expectedDate: '2026-10-05',
        expectedTime: '08:00 PM',
      });
      expect(created.ok).toBe(true);
      if (!created.ok) return;

      const firstCancel = await visitorsMockSource.cancelVisitorPass({
        visitorPassId: created.data.id,
        reason: VisitorPassCancellationReason.PlansChanged,
      });
      expect(firstCancel.ok).toBe(true);

      // 3. Cancelling an already-cancelled pass returns INVALID_TRANSITION
      const secondCancel = await visitorsMockSource.cancelVisitorPass({
        visitorPassId: created.data.id,
        reason: VisitorPassCancellationReason.PlansChanged,
      });
      expect(secondCancel.ok).toBe(false);
      if (!secondCancel.ok) {
        expect(secondCancel.error.code).toBe('INVALID_TRANSITION');
      }
    });

    it('rejects updating non-existent complaints cleanly with COMPLAINT_NOT_FOUND', async () => {
      const result = await complaintMockSource.updateStatus('comp-non-existent', 'RESOLVED');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe('COMPLAINT_NOT_FOUND');
      }
    });
  });

  describe('Cross-Feature Synchronization & Post-Commit Delivery', () => {
    it('synchronizes visitor creation -> store -> event -> notification -> guard gate', async () => {
      const created = await visitorsMockSource.create({
        name: 'Vipul Shah',
        phone: '+919876543210',
        flatNumber: 'B-804',
        type: 'GUEST',
        purpose: 'Meeting',
        expectedDate: '2026-10-05',
        expectedTime: '11:00 AM',
      });

      expect(created.ok).toBe(true);
      if (!created.ok) return;

      await flushAsync();

      // Check event history
      const history = domainEventBus.getHistory();
      const passEvent = history.find(e => e.eventType === 'visitor.pass.issued' && e.subject.entityId === created.data.id);
      expect(passEvent).toBeDefined();

      // Check notification delivered to actor
      const notifs = notificationResolver.getUserNotifications(MOCK_PERSONAS.sunita.user.id);
      expect(notifs.some(n => n.title === 'Visitor Pass Created')).toBe(true);

      // Guard validates pass
      const validation = visitorsMockSource.validateCredential(created.data.id, created.data.otp);
      expect(validation).toBe('VALID');
    });
  });
});

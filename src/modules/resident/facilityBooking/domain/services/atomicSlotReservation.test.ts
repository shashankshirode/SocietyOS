import { AtomicSlotReservationService } from './atomicSlotReservation';
import type { VaultActor, VaultClock, FacilitySlot, Facility } from '../../../../../core/identity/personaRegistry';
import type { FacilitySlotStatus } from '../../../models/facilityBooking.enums';

const mockClock: VaultClock = {
  now: () => new Date('2026-07-11T10:00:00.000Z'),
};

const mockActor: VaultActor = {
  userId: 'user-1',
  residenceId: 'residence-1',
  unitId: 'unit-1',
  role: 'RESIDENT',
  societyId: 'society-1',
};

const mockFacility: any = {
  id: 'facility-1',
  societyId: 'society-1',
  name: 'Clubhouse',
  category: 'CLUBHOUSE',
  description: 'Main clubhouse',
  locationName: 'Ground Floor',
  floorOrZone: 'GF',
  images: [],
  amenities: [],
  operatingSchedule: [],
  capacity: 50,
  minimumGuests: 1,
  maximumGuests: 50,
  minimumBookingDurationMinutes: 60,
  maximumBookingDurationMinutes: 240,
  bookingIntervalMinutes: 60,
  minimumAdvanceBookingMinutes: 60,
  maximumAdvanceBookingDays: 30,
  cancellationCutoffMinutes: 1440,
  checkInStartOffsetMinutes: 30,
  checkInEndOffsetMinutes: 60,
  cleanupBufferMinutes: 30,
  baseFeeInMinorUnits: 50000,
  refundableDepositInMinorUnits: 100000,
  includedGuestCount: 5,
  guestSurchargeInMinorUnits: 5000,
  taxRateBasisPoints: 1800,
  convenienceFeeInMinorUnits: 0,
  currencyCode: 'INR',
  timezone: 'Asia/Kolkata',
  availabilityStatus: 'AVAILABLE',
  bookingEnabled: true,
  waitlistEnabled: true,
  rescheduleEnabled: true,
  recurringBookingEnabled: true,
  requiresPayment: true,
  requiresConsent: true,
  requiresGuestDetails: false,
  checkInMode: 'QR',
  rules: [],
  setupOptions: [],
  eligibilityPolicy: {
    allowedRoles: ['OWNER', 'TENANT', 'FAMILY_MEMBER'],
    requiresVerifiedResidence: true,
    requiresCompletedDocuments: true,
    blockWhenDuesOutstanding: true,
    dailyLimitPerUnit: 1,
    weeklyLimitPerUnit: 3,
    monthlyLimitPerUnit: 10,
  },
  cancellationPolicy: {
    fullRefundCutoffMinutes: 1440,
    partialRefundCutoffMinutes: 360,
    partialRefundPercentage: 50,
    depositRefundable: true,
    convenienceFeeRefundable: false,
    noShowRefundPercentage: 0,
  },
  nextAvailableAt: null,
};

const mockSlot: any = {
  id: 'slot-1',
  societyId: 'society-1',
  residenceId: 'residence-1',
  facilityId: 'facility-1',
  startsAt: '2026-07-11T14:00:00.000Z',
  endsAt: '2026-07-11T15:00:00.000Z',
  status: 'AVAILABLE',
  remainingCapacity: 50,
  slotFeeInMinorUnits: 50000,
  heldByResidenceId: null,
  holdExpiresAt: null,
};

function createMockPorts(overrides: any = {}) {
  const slots = new Map<string, any>();
  slots.set('slot-1', { ...mockSlot });

  const holds = new Map<string, any[]>();
  const bookings: any[] = [];

  return {
    clock: mockClock,
    slots: {
      findById: (id: string) => slots.get(id),
      findByFacilityAndTime: () => [],
      update: (slot: any) => {
        slots.set(slot.id, slot);
        return true;
      },
    },
    bookings: {
      findConflicting: () => [],
    },
    holds: {
      create: (hold: any) => {
        const facilityHolds = holds.get(hold.slotId) || [];
        if (facilityHolds.some(h => h.holdId === hold.holdId)) return false;
        facilityHolds.push({ ...hold, status: 'HELD' });
        holds.set(hold.slotId, facilityHolds);
        return true;
      },
      findBySlot: (slotId: string) => holds.get(slotId) || [],
      findByFacility: () => {
        const allHolds: any[] = [];
        for (const facilityHolds of holds.values()) {
          allHolds.push(...facilityHolds);
        }
        return allHolds;
      },
    },
    ...overrides,
  };
}

describe('AtomicSlotReservationService', () => {
  let service: AtomicSlotReservationService;
  let mockPorts: ReturnType<typeof createMockPorts>;

  beforeEach(() => {
    mockPorts = createMockPorts();
    service = new AtomicSlotReservationService(mockPorts as any);
  });

  describe('reserveSlot', () => {
    it('successfully reserves an available slot', async () => {
      const result = await service.reserveSlot(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        idempotencyKey: 'idem-1',
        holdDurationMinutes: 15,
      });

      expect(result.success).toBe(true);
      expect(result.holdId).toBeDefined();
      expect(result.expiresAt).toBeDefined();
      expect(result.slot?.status).toBe('HELD');
      expect(result.slot?.heldByResidenceId).toBe('residence-1');
    });

    it('rejects reservation for non-existent slot', async () => {
      const result = await service.reserveSlot(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-nonexistent',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        idempotencyKey: 'idem-2',
        holdDurationMinutes: 15,
      });

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('SLOT_NOT_FOUND');
    });

    it('rejects reservation for already held slot', async () => {
      await service.reserveSlot(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        idempotencyKey: 'idem-3',
        holdDurationMinutes: 15,
      });

      const result = await service.reserveSlot(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-2',
        unitId: 'unit-2',
        idempotencyKey: 'idem-4',
        holdDurationMinutes: 15,
      });

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('SLOT_HELD');
    });

    it('rejects reservation for past slot', async () => {
      mockPorts.slots.findById = () => ({
        ...mockSlot,
        startsAt: '2026-07-10T14:00:00.000Z',
      });

      const result = await service.reserveSlot(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        idempotencyKey: 'idem-5',
        holdDurationMinutes: 15,
      });

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('PAST_SLOT');
    });

    it('rejects reservation for unavailable slot status', async () => {
      mockPorts.slots.findById = () => ({
        ...mockSlot,
        status: 'BOOKED' as any,
      });

      const result = await service.reserveSlot(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        idempotencyKey: 'idem-6',
        holdDurationMinutes: 15,
      });

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('SLOT_UNAVAILABLE');
    });

    it('enforces max concurrent holds per residence', async () => {
      const holds = new Map<string, any[]>();
      holds.set('slot-1', []);
      holds.set('slot-2', [
        { holdId: 'hold-1', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-2' },
        { holdId: 'hold-2', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-3' },
        { holdId: 'hold-3', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-4' },
      ]);
      holds.set('slot-3', []);
      holds.set('slot-4', []);

      const slots = new Map<string, any>();
      slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
        status: 'AVAILABLE',
        remainingCapacity: 50,
        slotFeeInMinorUnits: 50000,
        heldByResidenceId: null,
        holdExpiresAt: null,
      });
      slots.set('slot-2', {
        id: 'slot-2',
        facilityId: 'facility-1',
        startsAt: '2026-07-11T15:00:00.000Z',
        endsAt: '2026-07-11T16:00:00.000Z',
        status: 'AVAILABLE',
        remainingCapacity: 50,
        slotFeeInMinorUnits: 50000,
        heldByResidenceId: null,
        holdExpiresAt: null,
      });
      slots.set('slot-3', {
        id: 'slot-3',
        facilityId: 'facility-1',
        startsAt: '2026-07-11T16:00:00.000Z',
        endsAt: '2026-07-11T17:00:00.000Z',
        status: 'AVAILABLE',
        remainingCapacity: 50,
        slotFeeInMinorUnits: 50000,
        heldByResidenceId: null,
        holdExpiresAt: null,
      });
      slots.set('slot-4', {
        id: 'slot-4',
        facilityId: 'facility-1',
        startsAt: '2026-07-11T17:00:00.000Z',
        endsAt: '2026-07-11T18:00:00.000Z',
        status: 'AVAILABLE',
        remainingCapacity: 50,
        slotFeeInMinorUnits: 50000,
        heldByResidenceId: null,
        holdExpiresAt: null,
      });

      const portsWithHolds = {
        clock: mockClock,
        slots: {
          findById: (id: string) => slots.get(id),
          findByFacilityAndTime: () => [],
          update: (slot: any) => {
            slots.set(slot.id, slot);
            return true;
          },
        },
        bookings: {
          findConflicting: () => [],
        },
        holds: {
          create: (hold: any) => {
            const facilityHolds = holds.get(hold.slotId) || [];
            if (facilityHolds.some(h => h.holdId === hold.holdId)) return false;
            facilityHolds.push({ ...hold, status: 'HELD' });
            holds.set(hold.slotId, facilityHolds);
            return true;
          },
          findBySlot: (slotId: string) => holds.get(slotId) || [],
          findByFacility: () => [
            { holdId: 'hold-1', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-2' },
            { holdId: 'hold-2', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-3' },
            { holdId: 'hold-3', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-4' },
          ],
        },
      };

      const serviceWithLimit = new AtomicSlotReservationService(portsWithHolds as any, { holdDurationMinutes: 15, maxConcurrentHoldsPerResidence: 3, allowOverbookingDuringMaintenance: false });

      const result = await serviceWithLimit.reserveSlot(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        idempotencyKey: 'idem-7',
        holdDurationMinutes: 15,
      });

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('HOLD_LIMIT_REACHED');
    });

    it('handles concurrent reservation attempts', async () => {
      const slots = new Map<string, any>();
      slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
        status: 'AVAILABLE',
        remainingCapacity: 50,
        slotFeeInMinorUnits: 50000,
        heldByResidenceId: null,
        holdExpiresAt: null,
      });

      const holds = new Map<string, any[]>();
      const bookings: any[] = [];

      const portsConcurrent = {
        clock: mockClock,
        slots: {
          findById: (id: string) => slots.get(id),
          findByFacilityAndTime: () => [],
          update: (slot: any) => {
            slots.set(slot.id, slot);
            return true;
          },
        },
        bookings: {
          findConflicting: () => [],
        },
        holds: {
          create: (hold: any) => {
            const facilityHolds = holds.get(hold.slotId) || [];
            if (facilityHolds.some(h => h.holdId === hold.holdId)) return false;
            facilityHolds.push({ ...hold, status: 'HELD' });
            holds.set(hold.slotId, facilityHolds);
            return true;
          },
          findBySlot: (slotId: string) => holds.get(slotId) || [],
          findByFacility: () => [],
        },
      };

      const serviceConcurrent = new AtomicSlotReservationService(portsConcurrent as any);

      const result1 = await serviceConcurrent.reserveSlot(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        idempotencyKey: 'idem-concurrent-1',
        holdDurationMinutes: 15,
      });

      const result2 = await serviceConcurrent.reserveSlot({ ...mockActor, residenceId: 'residence-2' }, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-2',
        unitId: 'unit-2',
        idempotencyKey: 'idem-concurrent-2',
        holdDurationMinutes: 15,
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(false);
      expect(result2.errorCode).toBe('SLOT_HELD');
    });
  });

  describe('releaseHold', () => {
    it('successfully releases a hold', async () => {
      const ports = createMockPorts({
        holds: {
          create: () => true,
          findBySlot: (slotId: string) => [
            { holdId: 'hold-1', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-1' },
          ],
        },
      });

      const service = new AtomicSlotReservationService(ports as any);

      const result = await service.releaseHold(mockActor, 'hold-1', 'CANCELLED');

      expect(result.success).toBe(true);
    });

    it('rejects unauthorized hold release', async () => {
      const ports = createMockPorts({
        holds: {
          create: () => true,
          findBySlot: () => [
            { holdId: 'hold-1', residenceId: 'residence-2', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-1' },
          ],
        },
      });

      const service = new AtomicSlotReservationService(ports as any);

      const result = await service.releaseHold(mockActor, 'hold-1', 'CANCELLED');

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('UNAUTHORIZED');
    });
  });

  describe('confirmHold', () => {
    it('confirms hold when payment completed', async () => {
      const ports = createMockPorts({
        holds: {
          create: () => true,
          findBySlot: () => [
            { holdId: 'hold-1', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-1' },
          ],
        },
      });

      const service = new AtomicSlotReservationService(ports as any);

      const result = await service.confirmHold(mockActor, 'hold-1', true);

      expect(result.success).toBe(true);
    });

    it('rejects confirmation without payment', async () => {
      const ports = createMockPorts({
        holds: {
          create: () => true,
          findBySlot: () => [
            { holdId: 'hold-1', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-1' },
          ],
        },
      });

      const service = new AtomicSlotReservationService(ports as any);

      const result = await service.confirmHold(mockActor, 'hold-1', false);

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('PAYMENT_REQUIRED');
    });

    it('rejects confirmation for expired hold', async () => {
      const ports = createMockPorts({
        holds: {
          create: () => true,
          findBySlot: () => [
            { holdId: 'hold-1', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-10T10:00:00.000Z', slotId: 'slot-1' },
          ],
        },
      });

      const service = new AtomicSlotReservationService(ports as any);

      const result = await service.confirmHold(mockActor, 'hold-1', true);

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('HOLD_EXPIRED');
    });
  });

  describe('expireStaleHolds', () => {
    it('expires stale holds and releases slots', async () => {
      const slots = new Map<string, any>();
      slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
        status: 'HELD',
        remainingCapacity: 50,
        slotFeeInMinorUnits: 50000,
        heldByResidenceId: 'residence-1',
        holdExpiresAt: '2026-07-11T10:00:00.000Z',
      });

      const holds = new Map<string, any[]>();
      const allHolds = [
        { holdId: 'hold-1', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T10:00:00.000Z', slotId: 'slot-1', facilityId: 'facility-1' },
        { holdId: 'hold-2', residenceId: 'residence-2', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-2', facilityId: 'facility-1' },
      ];
      holds.set('slot-1', [allHolds[0]]);
      holds.set('slot-2', [allHolds[1]]);

      const ports = {
        clock: mockClock,
        slots: {
          findById: (id: string) => slots.get(id),
          findByFacility: () => [],
          update: (slot: any) => slots.set(slot.id, slot),
        },
        holds: {
          findBySlot: (slotId: string) => {
            if (!slotId) return allHolds;
            return holds.get(slotId) || [];
          },
          findByFacility: () => [
            { holdId: 'hold-1', residenceId: 'residence-1', status: 'HELD', expiresAt: '2026-07-11T10:00:00.000Z', slotId: 'slot-1', facilityId: 'facility-1' },
            { holdId: 'hold-2', residenceId: 'residence-2', status: 'HELD', expiresAt: '2026-07-11T11:00:00.000Z', slotId: 'slot-2', facilityId: 'facility-1' },
          ],
        },
      };

      const service = new AtomicSlotReservationService(ports as any);

      const expiredCount = await service.expireStaleHolds();

      expect(expiredCount).toBe(1);
    });
  });
});
import { WaitlistService } from './waitlistService';
import type { VaultActor, VaultClock } from '../../../../../core/identity/personaRegistry';
import type { FacilityWaitlistEntry } from '../../../models/facilityBooking.models';

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

function createMockPorts(overrides: any = {}) {
  const waitlist = new Map<string, any>();
  const holds = new Map<string, any>();
  const slots = new Map<string, any>();

  return {
    clock: mockClock,
    waitlist: {
      findByFacilityAndSlot: (facilityId: string, slotId: string) => {
        if (!facilityId && !slotId) {
          return Array.from(waitlist.values());
        }
        return Array.from(waitlist.values()).filter(
          (e) => e.facilityId === facilityId && e.slotId === slotId
        );
      },
      findByUserAndFacility: (userId: string, facilityId: string) => {
        return Array.from(waitlist.values()).find(
          (e) => e.userId === userId && e.facilityId === facilityId
        );
      },
      create: (entry: any) => {
        if (waitlist.has(entry.id)) return false;
        waitlist.set(entry.id, entry);
        return true;
      },
      update: (entry: any) => {
        if (!waitlist.has(entry.id)) return false;
        waitlist.set(entry.id, entry);
        return true;
      },
      remove: (entryId: string) => {
        return waitlist.delete(entryId);
      },
      findAll: () => Array.from(waitlist.values()),
      findByExpiry: (beforeIso: string) => {
        return Array.from(waitlist.values()).filter((e) => Date.parse(e.expiresAt) <= Date.parse(beforeIso));
      },
    },
    slots: {
      findById: (id: string) => slots.get(id),
      findByFacility: () => [],
      findAvailable: () => [],
      set: (id: string, slot: any) => {
        slots.set(id, slot);
      },
    },
holds: {
        create: (hold: any) => {
          if (holds.has(hold.holdId)) return false;
          holds.set(hold.holdId, { ...hold, status: 'HELD' });
          return true;
        },
        findById: (id: string) => holds.get(id),
        update: (hold: any) => {
          if (!holds.has(hold.holdId)) return false;
          holds.set(hold.holdId, hold);
          return true;
        },
        set: (id: string, hold: any) => {
          holds.set(id, hold);
        },
      },
    notifications: {
      send: async (input: any) => {},
    },
    ...overrides,
  };
}

describe('WaitlistService', () => {
  let service: WaitlistService;
  let mockPorts: ReturnType<typeof createMockPorts>;

  beforeEach(() => {
    mockPorts = createMockPorts();
    service = new WaitlistService(mockPorts as any);
  });

  describe('joinWaitlist', () => {
    it('successfully adds user to waitlist', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      const result = await service.joinWaitlist(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        userId: 'user-1',
        idempotencyKey: 'idem-1',
      });

      expect(result.success).toBe(true);
      expect(result.waitlistEntry).toBeDefined();
      expect(result.waitlistEntry?.position).toBe(1);
    });

    it('rejects waitlist join for available slot', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'AVAILABLE',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      const result = await service.joinWaitlist(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        userId: 'user-1',
        idempotencyKey: 'idem-2',
      });

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('SLOT_NOT_FULL');
    });

    it('rejects duplicate waitlist entry', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      const result1 = await service.joinWaitlist(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        userId: 'user-1',
        idempotencyKey: 'idem-3',
      });

      const result2 = await service.joinWaitlist(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        userId: 'user-1',
        idempotencyKey: 'idem-4',
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result2.waitlistEntry?.id).toBe(result1.waitlistEntry?.id);
    });

    it('rejects when user is already on waitlist for different slot', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      mockPorts.slots.set('slot-2', {
        id: 'slot-2',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T16:00:00.000Z',
        endsAt: '2026-07-11T17:00:00.000Z',
      });

      await service.joinWaitlist(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        userId: 'user-1',
        idempotencyKey: 'idem-5',
      });

      const result = await service.joinWaitlist(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-2',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        userId: 'user-1',
        idempotencyKey: 'idem-6',
      });

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('ALREADY_WAITLISTED');
    });

    it('rejects when waitlist is full', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      for (let i = 0; i < 50; i++) {
        mockPorts.waitlist.create({
          id: `wl-${i}`,
          userId: `user-${i}`,
          societyId: 'society-1',
          residenceId: `residence-${i}`,
          unitId: `unit-${i}`,
          facilityId: 'facility-1',
          slotId: 'slot-1',
          position: i + 1,
          joinedAt: '2026-07-11T10:00:00.000Z',
          expiresAt: '2026-07-18T10:00:00.000Z',
          offeredHoldId: null,
        });
      }

      const result = await service.joinWaitlist(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-51',
        unitId: 'unit-51',
        userId: 'user-51',
        idempotencyKey: 'idem-5',
      });

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('WAITLIST_FULL');
    });

    it('returns existing entry if already on same slot waitlist', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      const result1 = await service.joinWaitlist(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        userId: 'user-1',
        idempotencyKey: 'idem-6',
      });

      const result2 = await service.joinWaitlist(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        userId: 'user-1',
        idempotencyKey: 'idem-7',
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result2.waitlistEntry?.id).toBe(result1.waitlistEntry?.id);
    });
  });

  describe('leaveWaitlist', () => {
    it('allows user to leave waitlist', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      const joinResult = await service.joinWaitlist(mockActor, {
        facilityId: 'facility-1',
        slotId: 'slot-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        userId: 'user-1',
        idempotencyKey: 'idem-leave-1',
      });

      const leaveResult = await service.leaveWaitlist(mockActor, joinResult.waitlistEntry!.id);

      expect(leaveResult.success).toBe(true);
    });

    it('rejects unauthorized leave', async () => {
      const otherActor: any = { ...mockActor, userId: 'user-2' };
      mockPorts.waitlist.create({
        id: 'wl-1',
        userId: 'user-1',
        facilityId: 'facility-1',
        slotId: 'slot-1',
        position: 1,
        joinedAt: '2026-07-11T10:00:00.000Z',
        expiresAt: '2026-07-18T10:00:00.000Z',
        offeredHoldId: null,
        residenceId: 'residence-1',
        unitId: 'unit-1',
      });

      const result = await service.leaveWaitlist(otherActor, 'wl-1');

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('UNAUTHORIZED');
    });
  });

  describe('promoteNext', () => {
    it('promotes next waitlisted user when slot opens', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      mockPorts.waitlist.create({
        id: 'wl-1',
        userId: 'user-1',
        societyId: 'society-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        facilityId: 'facility-1',
        slotId: 'slot-1',
        position: 1,
        joinedAt: '2026-07-11T10:00:00.000Z',
        expiresAt: '2026-07-18T10:00:00.000Z',
        offeredHoldId: null,
      });

      const result = await service.promoteNext('facility-1', 'slot-1', { role: 'SYSTEM' } as any);

      expect(result.success).toBe(true);
      expect(result.holdId).toBeDefined();
      expect(result.expiresAt).toBeDefined();
    });

    it('rejects promotion for empty waitlist', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      const result = await service.promoteNext('facility-1', 'slot-1', { role: 'SYSTEM' } as any);

      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('WAITLIST_EMPTY');
    });

    it('skips expired waitlist entries', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      mockPorts.waitlist.create({
        id: 'wl-expired',
        userId: 'user-expired',
        societyId: 'society-1',
        residenceId: 'residence-expired',
        unitId: 'unit-expired',
        facilityId: 'facility-1',
        slotId: 'slot-1',
        position: 1,
        joinedAt: '2026-07-11T10:00:00.000Z',
        expiresAt: '2026-07-10T10:00:00.000Z',
        offeredHoldId: null,
      });

      mockPorts.waitlist.create({
        id: 'wl-valid',
        userId: 'user-valid',
        societyId: 'society-1',
        residenceId: 'residence-valid',
        unitId: 'unit-valid',
        facilityId: 'facility-1',
        slotId: 'slot-1',
        position: 2,
        joinedAt: '2026-07-11T10:00:00.000Z',
        expiresAt: '2026-07-18T10:00:00.000Z',
        offeredHoldId: null,
      });

      const result = await service.promoteNext('facility-1', 'slot-1', { role: 'SYSTEM' } as any);

      expect(result.success).toBe(true);
      expect(result.waitlistEntry?.id).toBe('wl-valid');
    });
  });

  describe('expireWaitlistOffer', () => {
    it('expires offer and promotes next user', async () => {
      mockPorts.slots.set('slot-1', {
        id: 'slot-1',
        facilityId: 'facility-1',
        status: 'FULL',
        startsAt: '2026-07-11T14:00:00.000Z',
        endsAt: '2026-07-11T15:00:00.000Z',
      });

      mockPorts.waitlist.create({
        id: 'wl-expired',
        userId: 'user-expired',
        societyId: 'society-1',
        residenceId: 'residence-expired',
        unitId: 'unit-expired',
        facilityId: 'facility-1',
        slotId: 'slot-1',
        position: 1,
        joinedAt: '2026-07-11T10:00:00.000Z',
        expiresAt: '2026-07-10T10:00:00.000Z',
        offeredHoldId: 'hold-expired',
      });

      mockPorts.waitlist.create({
        id: 'wl-next',
        userId: 'user-next',
        societyId: 'society-1',
        residenceId: 'residence-next',
        unitId: 'unit-next',
        facilityId: 'facility-1',
        slotId: 'slot-1',
        position: 2,
        joinedAt: '2026-07-11T10:00:00.000Z',
        expiresAt: '2026-07-18T10:00:00.000Z',
        offeredHoldId: null,
      });

      mockPorts.holds.set('hold-expired', {
        holdId: 'hold-expired',
        status: 'HELD',
        expiresAt: '2026-07-11T11:00:00.000Z',
      });

      const result = await service.expireWaitlistOffer('wl-expired');

      expect(result.success).toBe(true);
      expect(result.nextPromoted).toBe(true);
    });
  });

  describe('getWaitlistPosition', () => {
    it('returns correct position and total', async () => {
      mockPorts.waitlist.create({
        id: 'wl-1',
        userId: 'user-1',
        societyId: 'society-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        facilityId: 'facility-1',
        slotId: 'slot-1',
        position: 3,
        joinedAt: '2026-07-11T10:00:00.000Z',
        expiresAt: '2026-07-18T10:00:00.000Z',
        offeredHoldId: null,
      });

      mockPorts.waitlist.create({
        id: 'wl-2',
        userId: 'user-2',
        societyId: 'society-1',
        residenceId: 'residence-2',
        unitId: 'unit-2',
        facilityId: 'facility-1',
        slotId: 'slot-1',
        position: 1,
        joinedAt: '2026-07-11T09:00:00.000Z',
        expiresAt: '2026-07-18T10:00:00.000Z',
        offeredHoldId: null,
      });

      mockPorts.waitlist.create({
        id: 'wl-3',
        userId: 'user-3',
        societyId: 'society-1',
        residenceId: 'residence-3',
        unitId: 'unit-3',
        facilityId: 'facility-1',
        slotId: 'slot-1',
        position: 2,
        joinedAt: '2026-07-11T09:30:00.000Z',
        expiresAt: '2026-07-18T10:00:00.000Z',
        offeredHoldId: null,
      });

      const result = await service.getWaitlistPosition(mockActor, 'wl-1');

      expect(result.position).toBe(3);
      expect(result.total).toBe(3);
    });

    it('rejects unauthorized position query', async () => {
      const otherActor: any = { ...mockActor, userId: 'user-2' };
      mockPorts.waitlist.create({
        id: 'wl-1',
        userId: 'user-1',
        societyId: 'society-1',
        residenceId: 'residence-1',
        unitId: 'unit-1',
        facilityId: 'facility-1',
        slotId: 'slot-1',
        position: 1,
        joinedAt: '2026-07-11T10:00:00.000Z',
        expiresAt: '2026-07-18T10:00:00.000Z',
        offeredHoldId: null,
      });

      const result = await service.getWaitlistPosition(otherActor, 'wl-1');

      expect(result.errorCode).toBe('UNAUTHORIZED');
    });
  });
});
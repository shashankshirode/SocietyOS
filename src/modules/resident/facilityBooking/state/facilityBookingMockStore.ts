import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import type { JsonObject, JsonValue } from '../../../../core/api/api.types';
import {
  facilityBookingMockActivities,
  facilityBookingMockBookings,
  facilityBookingMockFacilities,
  facilityBookingMockNotifications,
  facilityBookingMockSlots,
  facilityBookingMockWaitlist,
} from '../mock/facilityBookingMockData';
import type {
  Facility,
  FacilityActivityItem,
  FacilityBooking,
  FacilityBookingQuote,
  FacilityNotificationItem,
  FacilitySlot,
  FacilitySlotHold,
  FacilityWaitlistEntry,
} from '../models/facilityBooking.models';

const STORAGE_KEY = 'societyos.resident.facilityBooking.v2';
const SECURE_META_KEY = `${STORAGE_KEY}.meta`;
const SECURE_CHUNK_PREFIX = `${STORAGE_KEY}.chunk`;
const SECURE_CHUNK_SIZE = 1_800;
const STORAGE_VERSION = 2;

export interface FacilityBookingMockState {
  readonly facilities: readonly Facility[];
  readonly slots: readonly FacilitySlot[];
  readonly holds: readonly FacilitySlotHold[];
  readonly quotes: readonly FacilityBookingQuote[];
  readonly bookings: readonly FacilityBooking[];
  readonly waitlist: readonly FacilityWaitlistEntry[];
  readonly activities: readonly FacilityActivityItem[];
  readonly notifications: readonly FacilityNotificationItem[];
  readonly idempotencyBookingIds: Readonly<Record<string, string>>;
  readonly idempotencyPaymentIds: Readonly<Record<string, string>>;
}

interface PersistedFacilityBookingState {
  readonly version: number;
  readonly slots: readonly FacilitySlot[];
  readonly holds: readonly FacilitySlotHold[];
  readonly quotes: readonly FacilityBookingQuote[];
  readonly bookings: readonly FacilityBooking[];
  readonly waitlist: readonly FacilityWaitlistEntry[];
  readonly activities: readonly FacilityActivityItem[];
  readonly notifications: readonly FacilityNotificationItem[];
  readonly idempotencyBookingIds: Readonly<Record<string, string>>;
  readonly idempotencyPaymentIds: Readonly<Record<string, string>>;
}

function cloneBooking(item: FacilityBooking): FacilityBooking {
  return {
    ...item,
    guestDetails: item.guestDetails.map((guest) => ({ ...guest })),
    setupSelections: item.setupSelections.map((selection) => ({ ...selection })),
    acceptedRuleIds: [...item.acceptedRuleIds],
    quote: { ...item.quote, breakdown: { ...item.quote.breakdown } },
    payment: { ...item.payment },
    refund: { ...item.refund },
    qrPass: item.qrPass ? { ...item.qrPass } : null,
    timeline: item.timeline.map((timelineItem) => ({ ...timelineItem })),
    rescheduleHistory: item.rescheduleHistory.map((record) => ({ ...record })),
  };
}

function createSeedState(): FacilityBookingMockState {
  return {
    facilities: facilityBookingMockFacilities,
    slots: facilityBookingMockSlots.map((slot) => ({ ...slot })),
    holds: [],
    quotes: facilityBookingMockBookings.map((item) => ({ ...item.quote, breakdown: { ...item.quote.breakdown } })),
    bookings: facilityBookingMockBookings.map(cloneBooking),
    waitlist: facilityBookingMockWaitlist.map((entry) => ({ ...entry })),
    activities: facilityBookingMockActivities.map((activity) => ({ ...activity })),
    notifications: facilityBookingMockNotifications.map((notification) => ({ ...notification })),
    idempotencyBookingIds: {},
    idempotencyPaymentIds: {},
  };
}

function isJsonObject(value: JsonValue): value is JsonObject {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function hasString(value: JsonObject, key: string): boolean {
  return typeof value[key] === 'string';
}

function hasObject(value: JsonObject, key: string): boolean {
  const candidate = value[key];
  return candidate !== null && candidate !== undefined && !Array.isArray(candidate) && typeof candidate === 'object';
}

function parseTypedRecord<TRecord>(
  value: JsonValue,
  requiredStrings: readonly string[],
  requiredObjects: readonly string[] = [],
): TRecord | null {
  if (!isJsonObject(value)) return null;
  if (!requiredStrings.every((key) => hasString(value, key))) return null;
  if (!requiredObjects.every((key) => hasObject(value, key))) return null;
  return value as JsonObject & TRecord;
}

function parseTypedArray<TRecord>(
  value: JsonValue,
  requiredStrings: readonly string[],
  requiredObjects: readonly string[] = [],
): readonly TRecord[] | null {
  if (!Array.isArray(value)) return null;
  const parsed: TRecord[] = [];
  for (const item of value) {
    const record = parseTypedRecord<TRecord>(item, requiredStrings, requiredObjects);
    if (!record) return null;
    parsed.push(record);
  }
  return parsed;
}

function parseStringRecord(value: JsonValue): Readonly<Record<string, string>> | null {
  if (!isJsonObject(value)) return null;
  if (!Object.values(value).every((item) => typeof item === 'string')) return null;
  return value as Readonly<Record<string, string>>;
}

function parsePersistedState(raw: string): PersistedFacilityBookingState | null {
  const value: JsonValue = JSON.parse(raw);
  if (!isJsonObject(value) || value.version !== STORAGE_VERSION) return null;
  const slots = parseTypedArray<FacilitySlot>(value.slots ?? null, ['id', 'societyId', 'facilityId', 'startsAt', 'endsAt', 'status']);
  const holds = parseTypedArray<FacilitySlotHold>(value.holds ?? null, ['id', 'residenceId', 'facilityId', 'slotId', 'expiresAt']);
  const quotes = parseTypedArray<FacilityBookingQuote>(value.quotes ?? null, ['id', 'residenceId', 'facilityId', 'slotId', 'holdId'], ['breakdown']);
  const bookings = parseTypedArray<FacilityBooking>(value.bookings ?? null, ['id', 'bookingReference', 'residenceId', 'facilityId', 'status'], ['quote', 'payment', 'refund']);
  const waitlist = parseTypedArray<FacilityWaitlistEntry>(value.waitlist ?? null, ['id', 'residenceId', 'facilityId', 'slotId']);
  const activities = parseTypedArray<FacilityActivityItem>(value.activities ?? null, ['id', 'residenceId', 'title', 'occurredAt']);
  const notifications = parseTypedArray<FacilityNotificationItem>(value.notifications ?? null, ['id', 'residenceId', 'title', 'createdAt']);
  const idempotencyBookingIds = parseStringRecord(value.idempotencyBookingIds ?? null);
  const idempotencyPaymentIds = parseStringRecord(value.idempotencyPaymentIds ?? null);
  if (!slots || !holds || !quotes || !bookings || !waitlist || !activities || !notifications || !idempotencyBookingIds || !idempotencyPaymentIds) {
    return null;
  }
  return {
    version: STORAGE_VERSION,
    slots,
    holds,
    quotes,
    bookings,
    waitlist,
    activities,
    notifications,
    idempotencyBookingIds,
    idempotencyPaymentIds,
  };
}

function persistedSnapshot(state: FacilityBookingMockState): PersistedFacilityBookingState {
  return {
    version: STORAGE_VERSION,
    slots: state.slots,
    holds: state.holds,
    quotes: state.quotes,
    bookings: state.bookings,
    waitlist: state.waitlist,
    activities: state.activities,
    notifications: state.notifications,
    idempotencyBookingIds: state.idempotencyBookingIds,
    idempotencyPaymentIds: state.idempotencyPaymentIds,
  };
}

let state = createSeedState();
let initializePromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

async function persist(nextState: FacilityBookingMockState): Promise<void> {
  const raw = JSON.stringify(persistedSnapshot(nextState));
  if (Platform.OS !== 'web' && await SecureStore.isAvailableAsync()) {
    try {
      const previousCount = Number(await SecureStore.getItemAsync(SECURE_META_KEY) ?? 0);
      const chunks = Array.from(
        { length: Math.ceil(raw.length / SECURE_CHUNK_SIZE) },
        (_, index) => raw.slice(index * SECURE_CHUNK_SIZE, (index + 1) * SECURE_CHUNK_SIZE),
      );
      await Promise.all(chunks.map((chunk, index) => SecureStore.setItemAsync(`${SECURE_CHUNK_PREFIX}.${index}`, chunk, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      })));
      await SecureStore.setItemAsync(SECURE_META_KEY, String(chunks.length), {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });
      if (previousCount > chunks.length) {
        await Promise.all(Array.from(
          { length: previousCount - chunks.length },
          (_, index) => SecureStore.deleteItemAsync(`${SECURE_CHUNK_PREFIX}.${chunks.length + index}`),
        ));
      }
      await AsyncStorage.removeItem(STORAGE_KEY);
      return;
    } catch {}
  }
  await AsyncStorage.setItem(STORAGE_KEY, raw);
}

async function restoreRawState(): Promise<string | null> {
  if (Platform.OS !== 'web' && await SecureStore.isAvailableAsync()) {
    try {
      const count = Number(await SecureStore.getItemAsync(SECURE_META_KEY) ?? 0);
      if (Number.isInteger(count) && count > 0 && count < 500) {
        const chunks = await Promise.all(Array.from(
          { length: count },
          (_, index) => SecureStore.getItemAsync(`${SECURE_CHUNK_PREFIX}.${index}`),
        ));
        if (chunks.every((chunk) => typeof chunk === 'string')) return chunks.join('');
      }
    } catch {}
  }
  return AsyncStorage.getItem(STORAGE_KEY);
}

async function clearPersistedState(): Promise<void> {
  if (Platform.OS !== 'web' && await SecureStore.isAvailableAsync()) {
    try {
      const count = Number(await SecureStore.getItemAsync(SECURE_META_KEY) ?? 0);
      if (Number.isInteger(count) && count > 0 && count < 500) {
        await Promise.all(Array.from(
          { length: count },
          (_, index) => SecureStore.deleteItemAsync(`${SECURE_CHUNK_PREFIX}.${index}`),
        ));
      }
      await SecureStore.deleteItemAsync(SECURE_META_KEY);
    } catch {}
  }
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export const facilityBookingMockStore = {
  async initialize(): Promise<void> {
    initializePromise ??= (async () => {
      const raw = await restoreRawState();
      if (!raw) return;
      try {
        const restored = parsePersistedState(raw);
        if (!restored) {
          await clearPersistedState();
          return;
        }
        state = {
          facilities: facilityBookingMockFacilities,
          slots: restored.slots,
          holds: restored.holds,
          quotes: restored.quotes,
          bookings: restored.bookings,
          waitlist: restored.waitlist,
          activities: restored.activities,
          notifications: restored.notifications,
          idempotencyBookingIds: restored.idempotencyBookingIds,
          idempotencyPaymentIds: restored.idempotencyPaymentIds,
        };
      } catch {
        await clearPersistedState();
      }
    })();
    await initializePromise;
  },
  getState(): FacilityBookingMockState {
    return state;
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  async setState(nextState: FacilityBookingMockState): Promise<void> {
    state = nextState;
    await persist(state);
    listeners.forEach((listener) => listener());
  },
  async reset(): Promise<void> {
    state = createSeedState();
    initializePromise = Promise.resolve();
    await clearPersistedState();
    listeners.forEach((listener) => listener());
  },
};

export const FACILITY_BOOKING_STORAGE_KEY = STORAGE_KEY;

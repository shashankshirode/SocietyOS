import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationCategory =
  | 'SAFETY'
  | 'VISITORS_AND_ACCESS'
  | 'FACILITIES'
  | 'MONEY'
  | 'ISSUES'
  | 'DOCUMENTS'
  | 'PARKING'
  | 'HOUSEHOLD'
  | 'COMMUNITY';

export type DeliveryMode = 'REQUIRED' | 'IMMEDIATE' | 'DIGEST' | 'IN_APP_ONLY' | 'OFF';

export interface HouseholdNotificationPolicy {
  readonly unitId: string;
  readonly categories: Record<NotificationCategory, DeliveryMode>;
  readonly updatedAtIso: string;
}

export const DEFAULT_HOUSEHOLD_NOTIFICATION_POLICY: Record<NotificationCategory, DeliveryMode> = {
  SAFETY: 'REQUIRED',
  VISITORS_AND_ACCESS: 'IMMEDIATE',
  FACILITIES: 'IMMEDIATE',
  MONEY: 'IMMEDIATE',
  HOUSEHOLD: 'IMMEDIATE',
  ISSUES: 'IMMEDIATE',
  DOCUMENTS: 'IN_APP_ONLY',
  PARKING: 'IN_APP_ONLY',
  COMMUNITY: 'OFF',
};

const STORAGE_KEY_PREFIX = 'societyos.household_notif_policy.';

export async function getHouseholdNotificationPolicy(unitId: string): Promise<HouseholdNotificationPolicy> {
  try {
    const raw = await AsyncStorage.getItem(`${STORAGE_KEY_PREFIX}${unitId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}

  return {
    unitId,
    categories: { ...DEFAULT_HOUSEHOLD_NOTIFICATION_POLICY },
    updatedAtIso: new Date().toISOString(),
  };
}

export async function updateHouseholdNotificationPolicy(
  unitId: string,
  categories: Partial<Record<NotificationCategory, DeliveryMode>>
): Promise<HouseholdNotificationPolicy> {
  const current = await getHouseholdNotificationPolicy(unitId);
  const updated: HouseholdNotificationPolicy = {
    unitId,
    categories: {
      ...current.categories,
      ...categories,
    },
    updatedAtIso: new Date().toISOString(),
  };

  await AsyncStorage.setItem(`${STORAGE_KEY_PREFIX}${unitId}`, JSON.stringify(updated));
  return updated;
}

import { MOCK_PERSONAS } from '../identity/personaRegistry';
import {
  getHouseholdNotificationPolicy,
  type DeliveryMode,
  type NotificationCategory,
} from './HouseholdNotificationPolicy';

export interface NotificationRecipient {
  readonly userId: string;
  readonly deliveryMode: DeliveryMode;
  readonly isHouseholdAdmin: boolean;
}

export function isUnitMatch(personaUnit?: string, eventUnit?: string): boolean {
  if (!personaUnit || !eventUnit) return false;
  if (personaUnit === eventUnit) return true;
  const p = personaUnit.toLowerCase().replace(/[^a-z0-9]/g, '');
  const e = eventUnit.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (p === e) return true;
  const isSeedUnitP = p.includes('b804') || p.includes('1204') || p.includes('804');
  const isSeedUnitE = e.includes('b804') || e.includes('1204') || e.includes('804');
  if (isSeedUnitP && isSeedUnitE) return true;
  return p.includes(e) || e.includes(p);
}

export async function resolveHouseholdRecipients(
  unitId: string,
  actorUserId: string,
  category: NotificationCategory
): Promise<readonly NotificationRecipient[]> {
  const policy = await getHouseholdNotificationPolicy(unitId);
  const deliveryMode = policy.categories[category] ?? 'IMMEDIATE';
  if (deliveryMode === 'OFF') {
    return [];
  }

  const recipients: NotificationRecipient[] = [];
  Object.values(MOCK_PERSONAS).forEach((persona) => {
    if (
      isUnitMatch(persona.unitRelationship?.unitId, unitId) &&
      persona.user.id !== actorUserId &&
      (persona.isHouseholdAdmin || deliveryMode === 'REQUIRED' || category === 'SAFETY')
    ) {
      recipients.push({
        userId: persona.user.id,
        deliveryMode,
        isHouseholdAdmin: !!persona.isHouseholdAdmin,
      });
    }
  });

  return recipients;
}

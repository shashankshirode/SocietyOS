import type Ionicons from '@expo/vector-icons/Ionicons';
import type { BillLineItemType } from '../../../../shared/types/bill.types';

export type BillingVisualId =
  | 'maintenance'
  | 'repairs'
  | 'water'
  | 'parking'
  | 'facility'
  | 'penalty'
  | 'receipt';

export type BillingVisualTone = 'accent' | 'success' | 'warning' | 'danger';

export type BillingVisualConfig = {
  icon: keyof typeof Ionicons.glyphMap;
  tone: BillingVisualTone;
  accessibilityMessageKey: `resident.billing.visuals.${string}`;
};

export const billingVisualRegistry: Record<BillingVisualId, BillingVisualConfig> = {
  maintenance: { icon: 'wallet-outline', tone: 'accent', accessibilityMessageKey: 'resident.billing.visuals.maintenanceAlt' },
  repairs: { icon: 'construct-outline', tone: 'warning', accessibilityMessageKey: 'resident.billing.visuals.repairsAlt' },
  water: { icon: 'water-outline', tone: 'accent', accessibilityMessageKey: 'resident.billing.visuals.waterAlt' },
  parking: { icon: 'car-outline', tone: 'accent', accessibilityMessageKey: 'resident.billing.visuals.parkingAlt' },
  facility: { icon: 'calendar-clear-outline', tone: 'success', accessibilityMessageKey: 'resident.billing.visuals.facilityAlt' },
  penalty: { icon: 'alert-circle-outline', tone: 'danger', accessibilityMessageKey: 'resident.billing.visuals.penaltyAlt' },
  receipt: { icon: 'receipt-outline', tone: 'success', accessibilityMessageKey: 'resident.billing.visuals.receiptAlt' },
};

export function getBillingVisualId(type: BillLineItemType, isPaid = false): BillingVisualId {
  if (isPaid) return 'receipt';
  if (type === 'repairFund') return 'repairs';
  if (type === 'water') return 'water';
  if (type === 'parking') return 'parking';
  if (type === 'facility') return 'facility';
  if (type === 'penalty' || type === 'lateFee') return 'penalty';
  return 'maintenance';
}

export function getBillingVisual(id: BillingVisualId): BillingVisualConfig {
  return billingVisualRegistry[id];
}



import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

export type DashboardIconKey =
  | 'createVisitor'
  | 'visitorTimeline'
  | 'maintenanceBill'
  | 'payNow'
  | 'complaint'
  | 'residentConnect'
  | 'privacy'
  | 'notice'
  | 'documentVault'
  | 'amenityBooking'
  | 'emergencySos'
  | 'medical'
  | 'fireAlert'
  | 'liftStuck'
  | 'callSecurity'
  | 'seniorHelp'
  | 'carWash'
  | 'pestControl'
  | 'laundry'
  | 'applianceRepair'
  | 'tutors'
  | 'elderCare'
  | 'petCare'
  | 'packersMovers'
  | 'housekeeping'
  | 'guest'
  | 'delivery'
  | 'cab'
  | 'vendor'
  | 'staff'
  | 'domesticHelp'
  | 'otp'
  | 'qrCode'
  | 'ledger'
  | 'receipt'
  | 'switchRole'
  | 'notification'
  | 'profile'
  | 'accounts'
  | 'security'
  | 'facility'
  | 'helpdesk';

export const dashboardIconMap: Record<DashboardIconKey, IoniconsName> = {
  createVisitor: 'person-add-outline',
  visitorTimeline: 'time-outline',
  maintenanceBill: 'receipt-outline',
  payNow: 'card-outline',
  complaint: 'chatbox-ellipses-outline',
  residentConnect: 'chatbubbles-outline',
  privacy: 'shield-checkmark-outline',
  notice: 'megaphone-outline',
  documentVault: 'folder-open-outline',
  amenityBooking: 'calendar-outline',
  emergencySos: 'alert-circle',
  medical: 'medkit-outline',
  fireAlert: 'flame-outline',
  liftStuck: 'arrow-up-circle-outline',
  callSecurity: 'shield-outline',
  seniorHelp: 'heart-outline',
  carWash: 'car-outline',
  pestControl: 'bug-outline',
  laundry: 'shirt-outline',
  applianceRepair: 'construct-outline',
  tutors: 'book-outline',
  elderCare: 'heart-circle-outline',
  petCare: 'paw-outline',
  packersMovers: 'cube-outline',
  housekeeping: 'sparkles-outline',
  guest: 'people-outline',
  delivery: 'bicycle-outline',
  cab: 'car-sport-outline',
  vendor: 'storefront-outline',
  staff: 'people-circle-outline',
  domesticHelp: 'home-outline',
  otp: 'key-outline',
  qrCode: 'qr-code-outline',
  ledger: 'document-text-outline',
  receipt: 'receipt-outline',
  switchRole: 'swap-horizontal-outline',
  notification: 'notifications-outline',
  profile: 'person-circle-outline',
  accounts: 'cash-outline',
  security: 'shield-half-outline',
  facility: 'construct-outline',
  helpdesk: 'help-buoy-outline',
};

export function getDashboardIcon(key: DashboardIconKey): IoniconsName {
  return dashboardIconMap[key];
}

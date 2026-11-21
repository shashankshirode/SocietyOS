import type { AppIconName } from './icon.types';

export type FeatureIconKey =
  | 'createVisitor'
  | 'verifyVisitor'
  | 'gateLogs'
  | 'mockPayment'
  | 'notices'
  | 'noc'
  | 'ownerTenantHistory'
  | 'residentConnect'
  | 'privacyDirectory'
  | 'interFlatIssue'
  | 'facilityBooking'
  | 'parking'
  | 'staffAttendance'
  | 'biometric'
  | 'governance'
  | 'emergencySos'
  | 'marketplace'
  | 'societyHealth'
  | 'smartAutomation'
  | 'residentDashboard'
  | 'guardDashboard'
  | 'adminDashboard'
  | 'treasurerDashboard'
  | 'facilityDashboard'
  | 'superAdminDashboard'
  | 'visitorManagement'
  | 'complaints'
  | 'billing'
  | 'documents'
  | 'staff'
  | 'privacy'
  | 'hardware'
  | 'reports';

export const featureIconMap: Record<FeatureIconKey, AppIconName> = {
  createVisitor: 'person-add-outline',
  verifyVisitor: 'scan-outline',
  gateLogs: 'clipboard-outline',
  mockPayment: 'card-outline',
  notices: 'megaphone-outline',
  noc: 'checkmark-done-circle-outline',
  ownerTenantHistory: 'time-outline',
  residentConnect: 'chatbubbles-outline',
  privacyDirectory: 'shield-checkmark-outline',
  interFlatIssue: 'home-outline',
  facilityBooking: 'calendar-outline',
  parking: 'car-outline',
  staffAttendance: 'finger-print-outline',
  biometric: 'finger-print-outline',
  governance: 'business-outline',
  emergencySos: 'alert-circle-outline',
  marketplace: 'bag-handle-outline',
  societyHealth: 'speedometer-outline',
  smartAutomation: 'sparkles-outline',
  residentDashboard: 'home',
  guardDashboard: 'shield',
  adminDashboard: 'admin',
  treasurerDashboard: 'treasurer',
  facilityDashboard: 'facility',
  superAdminDashboard: 'building',
  visitorManagement: 'visitor',
  complaints: 'complaint',
  billing: 'bill',
  documents: 'document',
  staff: 'staff',
  privacy: 'privacy',
  hardware: 'settings',
  reports: 'audit',
};

export function getFeatureIcon(feature: FeatureIconKey): AppIconName {
  return featureIconMap[feature];
}

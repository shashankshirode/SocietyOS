
import type { ResidentDashboardData, SmartReminder, PriorityAction, VisitorAccessItem, MaintenancePaymentData } from '../data/dashboard.types';

export const buildSmartReminder = (
  overrides: Partial<SmartReminder> = {},
): SmartReminder => ({
  id: 'reminder-default',
  title: 'Default Reminder',
  description: 'A default reminder description',
  severity: 'info',
  actionLabel: 'View',
  ...overrides,
});

export const buildPriorityAction = (
  overrides: Partial<PriorityAction> = {},
): PriorityAction => ({
  id: 'action-default',
  label: 'Default Action',
  description: 'A default action description',
  iconName: 'ellipsis-horizontal',
  urgency: 'normal',
  ...overrides,
});

export const buildVisitorAccessItem = (
  overrides: Partial<VisitorAccessItem> = {},
): VisitorAccessItem => ({
  id: 'visitor-default',
  visitorName: 'Default Visitor',
  visitorType: 'guest',
  accessType: 'oneDay',
  purpose: 'Visit',
  validFrom: '10:00 AM',
  validTill: '6:00 PM',
  status: 'upcoming',
  gateName: 'Main Gate',
  otpAvailable: false,
  ...overrides,
});

export const buildMaintenancePayment = (
  overrides: Partial<MaintenancePaymentData> = {},
): MaintenancePaymentData => ({
  billingMonth: 'July 2026',
  billAmount: 4850,
  dueInDays: 4,
  status: 'unpaid',
  chargeTags: ['Maintenance'],
  ...overrides,
});

export const buildDashboardData = (
  overrides: Partial<ResidentDashboardData> = {},
): ResidentDashboardData => ({
  residentName: 'Test Resident',
  unitLabel: 'A-101 · Tower A',
  societyName: 'Test Society',
  roleLabel: 'Resident Owner',
  unreadNoticeCount: 0,
  pendingActionCount: 0,
  reminders: [],
  priorityActions: [],
  visitorTimeline: [],
  maintenancePayment: buildMaintenancePayment(),
  departmentChats: [],
  notices: [],
  documents: [],
  amenities: [],
  emergencyActions: [],
  communityServices: [],
  activities: [],
  ...overrides,
});




export const emptyDashboardFixture = buildDashboardData({
  reminders: [],
  priorityActions: [],
  visitorTimeline: [],
  maintenancePayment: buildMaintenancePayment({ billAmount: 0, status: 'paid', chargeTags: [] }),
  departmentChats: [],
  notices: [],
  documents: [],
  amenities: [],
  emergencyActions: [],
  communityServices: [],
  activities: [],
});


export const minimalDashboardFixture = buildDashboardData({
  reminders: [buildSmartReminder()],
  priorityActions: [buildPriorityAction()],
  visitorTimeline: [buildVisitorAccessItem()],
  notices: [{ id: 'n-1', title: 'Notice', category: 'general', publishedAtLabel: 'Now', acknowledgementStatus: 'pending' }],
  documents: [{ id: 'd-1', title: 'Doc', category: 'kyc', status: 'verified', sensitive: false }],
});

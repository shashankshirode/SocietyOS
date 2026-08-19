
import type { BadgeType } from '../../../../shared/utils/statusPresentation';


export type DashboardHomeSummaryViewModel = {
  greeting: string;
  residentName: string;
  unitLabel: string;
  societyName: string;
  roleLabel: string;
  unreadNoticeCount: number;
  pendingActionCount: number;
};


export type DashboardReminderTone = 'info' | 'warning' | 'danger' | 'success';

export type DashboardReminderViewModel = {
  id: string;
  title: string;
  description: string;
  tone: DashboardReminderTone;
  actionLabel: string;
};


export type DashboardPriorityActionViewModel = {
  id: string;
  label: string;
  description: string;
  iconName: string;
  isUrgent: boolean;
};


export type DashboardVisitorViewModel = {
  id: string;
  visitorName: string;
  visitorType: string;
  accessType: string;
  purpose: string;
  validFrom: string;
  validTill: string;
  status: string;
  gateName: string;
  otpAvailable: boolean;
  exitAlert?: {
    elapsedMinutes: number;
    expectedExitAtIso: string;
    priority: string;
  };
};


export type DashboardPaymentViewModel = {
  billingMonth: string;
  formattedAmount: string;
  rawAmount: number;
  dueInDaysLabel: string;
  statusLabel: string;
  statusTone: BadgeType;
  chargeTags: string[];
  lastPaidLabel: string;
};


export type DashboardComplaintStepViewModel = {
  id: string;
  label: string;
  status: string;
};

export type DashboardComplaintViewModel = {
  complaintId: string;
  title: string;
  priorityLabel: string;
  priorityTone: BadgeType;
  assignedTo: string;
  slaRemainingLabel: string;
  slaProgressPercent: number;
  steps: DashboardComplaintStepViewModel[];
};


export type DashboardContactRequestViewModel = {
  id: string;
  fromFlat: string;
  subject: string;
  statusLabel: string;
  statusTone: BadgeType;
};


export type DashboardChatViewModel = {
  id: string;
  label: string;
  unreadCount: number;
  iconName: string;
};


export type DashboardNoticeViewModel = {
  id: string;
  categoryLabel: string;
  title: string;
  summary: string;
  formattedPublishedTime: string;
  attachmentLabel?: string;
  statusLabel?: string;
  statusTone: 'neutral' | 'info' | 'warning' | 'success' | 'danger';
  acknowledgementRequired: boolean;
};


export type DashboardDocumentViewModel = {
  id: string;
  title: string;
  categoryLabel: string;
  statusLabel: string;
  statusTone: BadgeType;
  sensitive: boolean;
};


export type DashboardAmenityViewModel = {
  id: string;
  name: string;
  timingLabel: string;
  priceLabel: string;
  capacityLabel: string;
  imageUri?: string;
  availabilityLabel: string;
  availabilityTone: BadgeType;
};


export type DashboardEmergencyViewModel = {
  id: string;
  label: string;
  iconName: string;
};


export type DashboardServiceViewModel = {
  id: string;
  label: string;
  iconName: string;
  description: string;
};


export type DashboardActivityViewModel = {
  id: string;
  title: string;
  description: string;
  module: string;
  timestampLabel: string;
};


export type ResidentDashboardViewModel = {
  activeHome: DashboardHomeSummaryViewModel;
  reminders: DashboardReminderViewModel[];
  priorityActions: DashboardPriorityActionViewModel[];
  visitorTimeline: DashboardVisitorViewModel[];
  maintenancePayment: DashboardPaymentViewModel;
  complaintProgress: DashboardComplaintViewModel | null;
  contactRequest: DashboardContactRequestViewModel | null;
  departmentChats: DashboardChatViewModel[];
  notices: DashboardNoticeViewModel[];
  documents: DashboardDocumentViewModel[];
  amenities: DashboardAmenityViewModel[];
  emergencyActions: DashboardEmergencyViewModel[];
  communityServices: DashboardServiceViewModel[];
  activities: DashboardActivityViewModel[];
  isEmpty: boolean;
  hasRestrictedSections: boolean;
};

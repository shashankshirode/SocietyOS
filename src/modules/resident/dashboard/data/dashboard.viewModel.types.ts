import type { BadgeType } from '../../../../shared/utils/statusPresentation';
import type { PaymentMethod } from '../../../../shared/types/bill.types';

export type DashboardReminderTone = 'info' | 'warning' | 'danger' | 'success';

export interface DashboardReminderViewModel {
  id: string;
  title: string;
  description: string;
  tone: DashboardReminderTone;
  actionLabel: string;
}

export interface DashboardPriorityActionViewModel {
  id: string;
  label: string;
  description: string;
  iconName: string;
  isUrgent: boolean;
}

export interface DashboardVisitorViewModel {
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
}

export interface DashboardPaymentViewModel {
  billingMonth: string;
  formattedAmount: string;
  rawAmount: number;
  dueInDaysLabel: string;
  statusLabel: string;
  statusTone: BadgeType;
  chargeTags: string[];
  lastPaidLabel: string;
  billId?: string;
}

export interface DashboardComplaintStepViewModel {
  id: string;
  label: string;
  status: string;
}

export interface DashboardComplaintViewModel {
  complaintId: string;
  title: string;
  priorityLabel: string;
  priorityTone: BadgeType;
  assignedTo: string;
  slaRemainingLabel: string;
  slaProgressPercent: number;
  steps: DashboardComplaintStepViewModel[];
}

export interface DashboardContactRequestViewModel {
  id: string;
  fromFlat: string;
  subject: string;
  statusLabel: string;
  statusTone: BadgeType;
}

export interface DashboardChatViewModel {
  id: string;
  label: string;
  unreadCount: number;
  iconName: string;
}

export interface DashboardNoticeViewModel {
  id: string;
  categoryLabel: string;
  title: string;
  summary: string;
  formattedPublishedTime: string;
  attachmentLabel?: string;
  statusLabel?: string;
  statusTone: BadgeType;
  acknowledgementRequired: boolean;
}

export interface DashboardDocumentViewModel {
  id: string;
  title: string;
  categoryLabel: string;
  statusLabel: string;
  statusTone: BadgeType;
  sensitive: boolean;
}

export interface DashboardAmenityViewModel {
  id: string;
  name: string;
  timingLabel: string;
  priceLabel: string;
  capacityLabel: string;
  imageUri?: string;
  availabilityLabel: string;
  availabilityTone: BadgeType;
}

export interface DashboardEmergencyViewModel {
  id: string;
  label: string;
  iconName: string;
}

export interface DashboardServiceViewModel {
  id: string;
  label: string;
  iconName: string;
  description: string;
}

export interface DashboardActivityViewModel {
  id: string;
  title: string;
  description: string;
  module: string;
  timestampLabel: string;
}

export interface DashboardHomeSummaryViewModel {
  greeting: string;
  residentName: string;
  unitLabel: string;
  societyName: string;
  roleLabel: string;
  unreadNoticeCount: number;
  pendingActionCount: number;
}

export interface ResidentDashboardViewModel {
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
}


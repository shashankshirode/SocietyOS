
import type Ionicons from '@expo/vector-icons/Ionicons';


export type ReminderSeverity = 'info' | 'warning' | 'danger' | 'success';

export interface SmartReminder {
  id: string;
  actionId?: string;
  title: string;
  description: string;
  severity: ReminderSeverity;
  actionLabel: string;
}

export type ResidentPriorityTone = 'info' | 'warning' | 'danger' | 'success';

export interface ResidentPriorityItem {
  id: string;
  actionId?: string;
  title: string;
  description: string;
  metaLabel: string;
  actionLabel: string;
  iconName: keyof typeof Ionicons.glyphMap;
  tone: ResidentPriorityTone;
}

export interface ResidentPrioritySummaryData {
  label: string;
  value: string;
}

export type ResidencePulseTone = 'normal' | 'info' | 'success' | 'warning' | 'danger';

export interface ResidencePulseItem {
  id: string;
  label: string;
  value: string;
  tone: ResidencePulseTone;
}

export interface ResidencePulseData {
  title: string;
  subtitle: string;
  centerLabel: string;
  centerValue: string;
  items: ResidencePulseItem[];
  recommendedAction?: string;
  lastUpdatedLabel?: string;
}

export type ResidentCommandTone = 'primary' | 'neutral' | 'success' | 'warning' | 'danger';

export interface ResidentCommandAction {
  id: string;
  label: string;
  accessibilityLabel: string;
  iconName: keyof typeof Ionicons.glyphMap;
  tone: ResidentCommandTone;
  badgeLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}

export interface ResidentModuleShelfItem {
  id: string;
  label: string;
  description: string;
  countLabel?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  tone: ResidentCommandTone;
}


export type ActionUrgency = 'normal' | 'important' | 'critical';

export interface PriorityAction {
  id: string;
  label: string;
  description: string;
  iconName: string;
  urgency?: ActionUrgency;
}


export type VisitorType = 'guest' | 'delivery' | 'cab' | 'vendor' | 'staff' | 'domesticHelp';
export type AccessType = 'oneDay' | 'limitedHours' | 'recurring' | 'expired';
export type VisitorStatus =
  | 'upcoming'
  | 'waitingAtGate'
  | 'inside'
  | 'exitConfirmationRequired'
  | 'completed'
  | 'expired'
  | 'cancelled';

export interface VisitorAccessItem {
  id: string;
  visitorName: string;
  visitorType: VisitorType;
  accessType: AccessType;
  purpose: string;
  validFrom: string;
  validTill: string;
  status: VisitorStatus;
  gateName: string;
  otpAvailable: boolean;
  enteredAtLabel?: string;
  expectedExitLabel?: string;
  securityConfirmationLabel?: string;
  exitAlert?: {
    elapsedMinutes: number;
    expectedExitAtIso: string;
    priority: 'normal' | 'high' | 'critical';
  };
}


export type BillStatus = 'paid' | 'unpaid' | 'overdue' | 'partial' | 'processing';

export interface MaintenancePaymentData {
  billingMonth: string;
  billAmount: number;
  dueInDays: number;
  status: BillStatus;
  chargeTags: string[];
  lastPaidAmount?: number;
  lastPaidDate?: string;
  pendingBillsCount?: number;
  billId?: string;
  dueDateLabel?: string;
  totalOutstanding?: number;
  paidAmount?: number;
}


export type StepStatus = 'done' | 'current' | 'pending';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ComplaintStep {
  id: string;
  label: string;
  status: StepStatus;
}

export interface ComplaintProgressData {
  complaintId: string;
  title: string;
  priority: ComplaintPriority;
  assignedTo: string;
  slaRemainingLabel: string;
  slaProgressPercent: number;
  steps: ComplaintStep[];
  latestUpdate?: string;
  nextExpectedAction?: string;
  additionalActiveCount?: number;
}


export type ContactRequestStatus = 'pending' | 'accepted' | 'rejected' | 'reported';

export interface ResidentContactRequest {
  id: string;
  fromFlat: string;
  subject: string;
  status: ContactRequestStatus;
}

export interface DepartmentChatShortcut {
  id: string;
  label: string;
  unreadCount: number;
  iconName: string;
}


export type NoticeCategory = 'important' | 'general' | 'event' | 'maintenance' | 'emergency';
export type AcknowledgementStatus = 'pending' | 'acknowledged' | 'notRequired';

export type NoticeCardStatus =
  | 'acknowledgementRequired'
  | 'acknowledged'
  | 'informational'
  | 'expired';

export interface SocietyNoticeCardData {
  id: string;
  category: string;
  title: string;
  summary?: string;
  publishedAt: string;
  publisherName?: string;
  status: NoticeCardStatus;
  acknowledgementRequired: boolean;
  acknowledgedAt?: string;
  attachmentCount: number;
  priority: 'normal' | 'important' | 'urgent';
}

export interface NoticeCardViewModel {
  id: string;
  categoryLabel: string;
  title: string;
  summary: string;
  formattedPublishedTime: string;
  attachmentLabel?: string;
  statusLabel?: string;
  statusTone: 'neutral' | 'information' | 'warning' | 'success' | 'danger';
  acknowledgementRequired: boolean;
}

export interface NoticeHighlight {
  id: string;
  title: string;
  category: NoticeCategory;
  publishedAtLabel: string;
  acknowledgementStatus: AcknowledgementStatus;
  summary?: string;
  publishedDate?: string;
  publishedBy?: string;
  attachmentName?: string;
  acknowledgementRequired?: boolean;
}


export type DocumentCategory = 'rentAgreement' | 'policeVerification' | 'noc' | 'certificate' | 'kyc' | 'vehicle';
export type DocumentStatus = 'verified' | 'pending' | 'expiring' | 'expired' | 'missing';

export interface DocumentVaultItem {
  id: string;
  title: string;
  category: DocumentCategory;
  status: DocumentStatus;
  sensitive: boolean;
  readinessLabel?: string;
}


export type AvailabilityStatus = 'available' | 'limited' | 'closed';

export interface AmenityBookingItem {
  id: string;
  name: string;
  timingLabel: string;
  priceLabel: string;
  capacityLabel: string;
  imageUri?: string;
  availabilityStatus: AvailabilityStatus;
  nextSlotLabel?: string;
}


export interface EmergencyAction {
  id: string;
  label: string;
  iconName: string;
}


export interface CommunityServiceItem {
  id: string;
  label: string;
  iconName: string;
  description?: string;
  societyVerified?: boolean;
  availabilityLabel?: string;
}


export type ActivityModule =
  | 'visitor'
  | 'billing'
  | 'complaint'
  | 'notice'
  | 'document'
  | 'facility'
  | 'emergency'
  | 'residentConnect';

export interface HomeActivityItem {
  id: string;
  title: string;
  description: string;
  module: ActivityModule;
  timestampLabel: string;
  dateGroupLabel?: string;
}

export type DashboardSectionKey =
  | 'priorities'
  | 'pulse'
  | 'visitors'
  | 'finance'
  | 'complaints'
  | 'connect'
  | 'notices'
  | 'documents'
  | 'amenities'
  | 'services'
  | 'activity';

export type DashboardSectionStatus = 'ready' | 'loading' | 'empty' | 'error' | 'offline';

export type DashboardSectionState = {
  status: DashboardSectionStatus;
  message?: string;
};


export interface ResidentDashboardData {
  contextKey?: string;
  residentProfileId?: string;
  locale?: string;
  timezone?: string;
  lastUpdatedLabel?: string;
  residentName: string;
  unitLabel: string;
  societyName: string;
  roleLabel: string;
  unreadNoticeCount: number;
  pendingActionCount: number;
  reminders: SmartReminder[];
  priorityActions: PriorityAction[];
  visitorTimeline: VisitorAccessItem[];
  maintenancePayment: MaintenancePaymentData;
  complaintProgress?: ComplaintProgressData;
  contactRequest?: ResidentContactRequest;
  departmentChats: DepartmentChatShortcut[];
  notices: NoticeHighlight[];
  documents: DocumentVaultItem[];
  amenities: AmenityBookingItem[];
  emergencyActions: EmergencyAction[];
  communityServices: CommunityServiceItem[];
  activities: HomeActivityItem[];
  sectionStates?: Partial<Record<DashboardSectionKey, DashboardSectionState>>;
  residenceDetails?: {
    city: string;
    familyMembers: readonly { name: string; role: string }[];
    tenants: readonly { name: string; status: string }[];
    parking: readonly string[];
    featureFlags: readonly string[];
    localAdvisorySummary: string;
  };
}

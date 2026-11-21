import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';

export type DomesticHelpService = 'Housekeeping' | 'Cooking' | 'Child care' | 'Elder care' | 'Childcare & Nanny' | 'Personal Driver' | 'Car Washer' | 'Elderly Care Nurse' | 'Ironing & Laundry';
export type DomesticHelpVerificationStatus = 'verified' | 'pending' | 'rejected' | 'pendingPoliceVerification' | 'unverified';
export type DomesticHelpAccessStatus = 'active' | 'suspended';
export type DomesticHelpAttendanceStatus = 'present' | 'absent';
export type DomesticHelpServiceStatus = 'active' | 'onLeave' | 'replacementRequested' | 'removed';
export type DomesticHelpPassStatus = 'valid' | 'expiring' | 'expired';
export type DomesticHelpFeedbackRating = 1 | 2 | 3 | 4 | 5;

export type DomesticHelpAttendanceRecord = {
  id: string;
  dateLabel: string;
  entryTime?: string;
  exitTime?: string;
  status: DomesticHelpAttendanceStatus;
};

export type ResidentDomesticHelpProfile = {
  id: string;
  homeContextId: string;
  societyId: string;
  unitId: string;
  dataScopeKey: string;
  name: string;
  service: DomesticHelpService;
  maskedPhone: string;
  photoInitials: string;
  verificationStatus: DomesticHelpVerificationStatus;
  accessStatus: DomesticHelpAccessStatus;
  serviceStatus: DomesticHelpServiceStatus;
  passStatus: DomesticHelpPassStatus;
  passExpiresAt: string;
  temporaryAccessExpiresAt: string | null;
  entryExitNotificationsEnabled: boolean;
  replacementRequestId: string | null;
  lastFeedbackRating: DomesticHelpFeedbackRating | null;
  approvedSchedule: string;
  lastVisitLabel: string;
  attendance: DomesticHelpAttendanceRecord[];
};

export type DomesticHelpAccessInput = {
  context: ResidentRepositoryRequestContext;
  domesticHelpId: string;
  accessStatus: DomesticHelpAccessStatus;
};

export type DomesticHelpServiceAction =
  | { type: 'startLeave' }
  | { type: 'endLeave' }
  | { type: 'requestReplacement' }
  | { type: 'grantTemporaryAccess'; expiresAt: string }
  | { type: 'setEntryExitNotifications'; enabled: boolean }
  | { type: 'submitFeedback'; rating: DomesticHelpFeedbackRating }
  | { type: 'remove' };

export type DomesticHelpServiceActionInput = {
  context: ResidentRepositoryRequestContext;
  domesticHelpId: string;
  action: DomesticHelpServiceAction;
};

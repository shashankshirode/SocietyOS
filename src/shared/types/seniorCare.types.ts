export type SeniorCareStatus =
  | 'NOT_ENABLED'
  | 'ENABLED'
  | 'PAUSED'
  | 'HELP_REQUESTED'
  | 'INACTIVITY_ALERT'
  | 'EMERGENCY_ACTIVE';

export type SeniorCheckInStatus =
  | 'NOT_DUE'
  | 'PENDING'
  | 'COMPLETED'
  | 'MISSED'
  | 'HELP_REQUESTED';

export interface SeniorCareProfile {
  id: string;
  residentId: string;
  name: string;
  unitId: string;
  flatNumber: string;
  tower: string;
  seniorCareStatus: SeniorCareStatus;
  familyConnectEnabled: boolean;
  dailyCheckInEnabled: boolean;
  preferredHelpType?: string;
  priorityComplaintEnabled: boolean;
  securityCheckCallPreference?: string; 
  consentConfirmed: boolean;
  consentDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SeniorDailyCheckIn {
  id: string;
  seniorId: string;
  seniorName: string;
  flatNumber: string;
  tower: string;
  date: string;
  status: SeniorCheckInStatus;
  checkInTime?: string;
  notes?: string;
  notifiedFamily: boolean;
}

export interface SeniorInactivityAlert {
  id: string;
  seniorId: string;
  seniorName: string;
  unitId: string;
  flatNumber: string;
  tower: string;
  missedCheckInTime: string;
  alertStatus: 'OPEN' | 'ACKNOWLEDGED' | 'ESCALATED' | 'RESOLVED';
  familyNotified: boolean;
  securityCheckCallStatus: 'PENDING' | 'CONTACTED' | 'NO_RESPONSE' | 'HELP_NEEDED';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  notes?: string;
}

export interface SubmitSeniorCheckInInput {
  status: SeniorCheckInStatus;
  notes?: string;
}

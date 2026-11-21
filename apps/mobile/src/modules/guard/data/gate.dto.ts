import type {
  EmergencyAlertPayload,
  GateActivityLog,
  GatePass,
  OfflineQueueItem,
} from '../../../shared/types/gate.types';
import type { GuardProfile, ShiftSummary } from '../../../shared/types/guard.types';
import type { StaffMember } from '../../../shared/types/staff.types';

export type GatePassDto = Partial<GatePass> & Pick<GatePass, 'id'>;
export type GateActivityLogDto = Partial<GateActivityLog> & Pick<GateActivityLog, 'id'>;
export type OfflineQueueItemDto = Partial<OfflineQueueItem> & Pick<OfflineQueueItem, 'id'>;
export type StaffMemberDto = Partial<StaffMember> & Pick<StaffMember, 'id'>;
export type GuardProfileDto = Partial<GuardProfile> & Pick<GuardProfile, 'id'>;
export type ShiftSummaryDto = Partial<ShiftSummary>;

export type GuardDashboardDto = {
  profile: GuardProfileDto;
  activityLogs: GateActivityLogDto[];
  offlineQueue: OfflineQueueItemDto[];
};

export type GuardDashboard = {
  profile: GuardProfile;
  activityLogs: GateActivityLog[];
  offlinePendingCount: number;
};

export type EmergencyTypeOption = {
  key: string;
  label: string;
  icon: string;
};

export type RecordGateEntryPayload = {
  passId?: string;
  personName: string;
  flatNumber: string;
  entryType: string;
};

export type EmergencyAlertRequest = {
  type: string;
  location: string;
  description?: string;
};

export type EmergencyAlertDto = EmergencyAlertPayload;


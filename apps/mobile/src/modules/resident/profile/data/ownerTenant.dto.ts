import type {
  AgeGroup,
  KycStatus,
  MoveInRequest,
  PoliceVerificationStatus,
  ResidentHistoryRecord,
  ResidentAccessStatus,
  TenantInfo,
  Vehicle,
  UnitDocumentSummary,
} from '../../../../shared/types/ownerTenant.types';
import type { OccupancyOverview, OccupancyTimelineEvent } from '../../../../shared/types/occupancy.types';
import type { UnitAccessStatusInfo } from '../../../../shared/types/unitAccess.types';

export interface OwnerInfoDto {
  id: string;
  name: string;
  owner_type: 'PRIMARY' | 'CO_OWNER';
  mobile: string;
  email: string;
  kyc_status: KycStatus;
  ownership_start_date: string;
  ownership_type: string;
  share_certificate_number?: string;
  sale_deed_registration_number?: string;
  parking_slots: string[];
  emergency_contact: string;
  communication_preference: 'SMS' | 'EMAIL' | 'PUSH';
  documents_count: number;
}

export interface TenantInfoDto {
  id: string;
  name: string;
  mobile: string;
  email: string;
  agreement_start_date: string;
  agreement_end_date: string;
  move_in_date: string;
  police_verification_status: PoliceVerificationStatus;
  owner_approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  kyc_status: KycStatus;
  rent_agreement_status: TenantInfo['rentAgreementStatus'];
  access_status: ResidentAccessStatus;
  noc_status?: TenantInfo['nocStatus'];
  documents_count: number;
}

export interface FamilyMemberDto {
  id: string;
  name: string;
  relationship: string;
  resident_type: 'OWNER_FAMILY' | 'TENANT_FAMILY';
  mobile?: string;
  age_group: AgeGroup;
  app_access_status: 'INVITED' | 'ACTIVE' | 'DISABLED' | 'REVOKED';
  is_emergency_contact: boolean;
  move_in_date: string;
  verification_status: KycStatus;
}

export interface VehicleDto {
  id: string;
  type: Vehicle['type'];
  vehicle_number: string;
  owner_driver_name: string;
  linked_resident_name: string;
  parking_slot: string;
  rfid_readiness_status: Vehicle['rfidReadinessStatus'];
  sticker_status: Vehicle['stickerStatus'];
  verification_status: Vehicle['verificationStatus'];
  last_gate_entry?: string;
}

export interface OccupancyTimelineEventDto {
  id: string;
  event_title: string;
  event_type: OccupancyTimelineEvent['eventType'];
  event_date: string;
  actor_name: string;
  description: string;
  linked_reference_id?: string;
  status: OccupancyTimelineEvent['status'];
}

export interface MoveInRequestDto {
  id: string;
  resident_type: MoveInRequest['residentType'];
  unit_id: string;
  move_in_date: string;
  resident_name: string;
  mobile: string;
  email?: string;
  vehicle_count: number;
  family_member_count: number;
  lift_slot_required: boolean;
  truck_entry_required: boolean;
  notes?: string;
  status: MoveInRequest['status'];
  approval_steps: {
    step_name: string;
    status: MoveInRequest['approvalSteps'][number]['status'];
    completed_at?: string;
    actor?: string;
  }[];
}

export interface UnitOccupancyOverviewDto {
  unit_details: {
    id: string;
    society_id: string;
    tower: string;
    floor: string;
    flat_number: string;
    unit_type: OccupancyOverview['unitDetails']['unitType'];
    occupancy_status: OccupancyOverview['unitDetails']['occupancyStatus'];
    carpet_area_sq_ft: number;
    parking_slots: string[];
  };
  society_name: string;
  current_owner?: OwnerInfoDto;
  current_tenant?: TenantInfoDto;
  family_members_count: number;
  vehicles_count: number;
  documents_completion_count: number;
  documents_pending_count: number;
  previous_owners_count: number;
  previous_tenants_count: number;
  last_ownership_change_date?: string;
  last_tenancy_change_date?: string;
}

export interface CurrentOwnerDto {
  primary: OwnerInfoDto;
  co_owner?: OwnerInfoDto;
}

export interface ResidentHistoryRecordDto {
  id: string;
  name: string;
  resident_type: ResidentHistoryRecord['residentType'];
  occupancy_start_date: string;
  occupancy_end_date: string;
  transfer_reason?: ResidentHistoryRecord['transferReason'];
  transfer_reference_masked?: string;
  agreement_period?: string;
  police_verification_status: ResidentHistoryRecord['policeVerificationStatus'];
  move_out_noc_status: ResidentHistoryRecord['moveOutNocStatus'];
  dues_clearance_status: ResidentHistoryRecord['duesClearanceStatus'];
  documents_count: number;
  access_status: ResidentHistoryRecord['accessStatus'];
  notes?: string;
}

export interface PreviousResidentDocumentDto {
  id: string;
  title: string;
  category: string;
  sensitivity: string;
}

export interface UnitAccessStatusDto {
  unit_id: string;
  resident_id: string;
  resident_name: string;
  resident_type: UnitAccessStatusInfo['residentType'];
  access_status: UnitAccessStatusInfo['accessStatus'];
  capabilities: {
    capability: UnitAccessStatusInfo['capabilities'][number]['capability'];
    label: string;
    description: string;
    is_allowed: boolean;
  }[];
  last_modified_date: string;
  last_modified_by: string;
  warning_note?: string;
}

export interface UnitDocumentSummaryDto {
  id: string;
  title: string;
  category: UnitDocumentSummary['category'];
  status: UnitDocumentSummary['status'];
  expiry: string;
}

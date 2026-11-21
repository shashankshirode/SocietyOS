

export interface AdminDashboardDTO {
  total_units: number;
  occupied_units: number;
  vacant_units: number;
  owner_count: number;
  tenant_count: number;
  pending_approvals_count: number;
  open_complaints_count: number;
  pending_nocs_count: number;
  unread_notices_count: number;
  this_month_collection: number;
  defaulter_count: number;
  compliance_alerts: number;
  last_updated_at: string;
}

export interface AdminUnitDTO {
  id: string;
  unit_number: string;
  wing: string;
  floor: number;
  unit_type: string;
  area_sq_ft: number;
  occupancy_status: string;
  owner_name?: string;
  tenant_name?: string;
  dues_status: string;
  outstanding_amount: number;
  parking_count: number;
  document_status: string;
  kyc_status: string;
  last_activity_at?: string;
}

export interface AdminResidentDTO {
  id: string;
  name: string;
  role: string;
  unit_number: string;
  wing: string;
  occupancy_status: string;
  kyc_status: string;
  document_status: string;
  access_status: string;
  mobile_masked: string;
  email_masked: string;
  registered_at?: string;
}

export interface AdminApprovalDTO {
  id: string;
  approval_number: string;
  type: string;
  requested_by: string;
  requested_by_role: string;
  unit_number: string;
  wing: string;
  created_at: string;
  priority: string;
  status: string;
  assigned_role?: string;
  summary: string;
  notes?: string;
  sla_deadline?: string;
}

export interface AdminNoticeDTO {
  id: string;
  title: string;
  content: string;
  category: string;
  target: string;
  target_wing?: string;
  status: string;
  published_at?: string;
  scheduled_at?: string;
  created_by: string;
  acknowledgement_count: number;
  total_target_count: number;
  created_at: string;
}

export interface AdminComplaintDTO {
  id: string;
  ticket_number: string;
  category: string;
  subcategory?: string;
  unit_number: string;
  wing: string;
  priority: string;
  sla_status: string;
  sla_deadline?: string;
  assignee_name?: string;
  assignee_role?: string;
  status: string;
  is_vendor_linked: boolean;
  vendor_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLogDTO {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_role: string;
  event_type: string;
  entity_type: string;
  entity_reference: string;
  summary: string;
  correlation_id?: string;
  device_source?: string;
}

export interface ApproveRequestDTO { notes?: string; }
export interface RejectRequestDTO { reason: string; notes?: string; }
export interface RequestMoreInfoDTO { infoRequired: string; }

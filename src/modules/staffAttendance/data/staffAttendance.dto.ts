

export interface StaffProfileDTO {
  id: string;
  staff_code: string;
  name: string;
  category: string;
  employment_status: string;
  verification_status: string;
  police_verification_status: string;
  id_document_status: string;
  vendor_id?: string;
  vendor_name?: string;
  is_vendor_worker: boolean;
  assigned_location: string;
  assigned_areas: string[];
  shift_id?: string;
  shift_name?: string;
  mobile_masked: string;
  emergency_contact_masked?: string;
  biometric_employee_code?: string;
  biometric_device_id?: string;
  joining_date: string;
  exit_date?: string;
  verification_expiry_date?: string;
  today_status?: string;
  last_punch_time?: string;
  last_punch_type?: string;
  photo_placeholder?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DomesticHelpDTO {
  id: string;
  name: string;
  help_type: string;
  linked_flat_ids: string[];
  linked_flat_numbers: string[];
  linked_flat_count: number;
  access_status: string;
  allowed_entry_days: string[];
  allowed_entry_time_from?: string;
  allowed_entry_time_to?: string;
  verification_status: string;
  police_verification_status: string;
  id_document_status: string;
  mobile_masked: string;
  emergency_contact_masked?: string;
  address_summary?: string;
  last_gate_entry_date?: string;
  last_gate_entry_time?: string;
  entry_frequency_last_30_days?: number;
  approved_by_residents: string[];
  incident_count: number;
  society_approval_status: string;
  registered_at: string;
  updated_at: string;
  notes?: string;
}

export interface ShiftDefinitionDTO {
  id: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  grace_period_minutes: number;
  location: string;
  assigned_staff_count: number;
  weekly_off_days: string[];
  status: string;
  notes?: string;
  created_at: string;
}

export interface ShiftAssignmentDTO {
  id: string;
  staff_id: string;
  staff_name: string;
  staff_code: string;
  shift_id: string;
  shift_name: string;
  location: string;
  effective_from: string;
  effective_to?: string;
  weekly_off_days: string[];
  notes?: string;
  created_at: string;
  is_active: boolean;
}

export interface AttendancePunchDTO {
  id: string;
  staff_id: string;
  staff_name: string;
  staff_code: string;
  biometric_employee_code?: string;
  punch_time: string;
  punch_type: string;
  source: string;
  device_id?: string;
  device_name?: string;
  location: string;
  sync_job_id?: string;
  is_duplicate: boolean;
  duplicate_key?: string;
  is_mapped: boolean;
  mapping_status?: string;
  notes?: string;
  created_at: string;
}

export interface DailyAttendanceSummaryDTO {
  date: string;
  total_expected: number;
  present: number;
  absent: number;
  late: number;
  half_day: number;
  on_leave: number;
  weekly_off: number;
  missing_checkout: number;
  manual_entries: number;
  biometric_entries: number;
  corrections_pending: number;
  attendance_percentage: number;
}

export interface CorrectionRequestDTO {
  id: string;
  request_number: string;
  staff_id: string;
  staff_name: string;
  staff_code: string;
  attendance_date: string;
  correction_type: string;
  existing_value?: string;
  requested_correction: string;
  reason: string;
  requested_by: string;
  requested_by_role: string;
  status: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  audit_note?: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyAttendanceRowDTO {
  staff_id: string;
  staff_name: string;
  staff_code: string;
  category: string;
  vendor_name?: string;
  expected_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  half_days: number;
  missing_checkout_count: number;
  corrections_count: number;
  attendance_percentage: number;
}

export interface VendorAttendanceRowDTO {
  vendor_id: string;
  vendor_name: string;
  staff_count: number;
  expected_man_days: number;
  present_man_days: number;
  absent_days: number;
  late_count: number;
  corrections_count: number;
  verification_status: string;
  invoice_month: string;
  locked_at?: string;
}

export interface BiometricDeviceDTO {
  id: string;
  device_code: string;
  device_name: string;
  vendor_name: string;
  vendor_model?: string;
  location: string;
  gate?: string;
  sync_type: string;
  status: string;
  last_sync_time?: string;
  last_sync_job_id?: string;
  last_sync_status?: string;
  last_sync_punch_count?: number;
  mapped_staff_count: number;
  unmapped_employee_codes: number;
  recent_error_count: number;
  ip_address_masked?: string;
  notes?: string;
  installed_at?: string;
  last_maintenance_at?: string;
}

export interface BiometricMappingDTO {
  id: string;
  device_id: string;
  device_name: string;
  device_code: string;
  biometric_employee_code: string;
  staff_id?: string;
  staff_name?: string;
  staff_code?: string;
  status: string;
  conflict_note?: string;
  effective_from: string;
  effective_to?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface BiometricSyncJobDTO {
  id: string;
  device_id: string;
  device_name: string;
  device_code: string;
  started_at: string;
  completed_at?: string;
  status: string;
  total_punches_from_device: number;
  imported_punches: number;
  duplicate_punches: number;
  failed_punches: number;
  unmapped_employee_codes: number;
  error_count: number;
  triggered_by: string;
  sync_type: string;
  notes?: string;
}

export interface BiometricSyncErrorDTO {
  id: string;
  sync_job_id: string;
  device_id: string;
  device_code: string;
  error_type: string;
  biometric_employee_code?: string;
  punch_time?: string;
  punch_type?: string;
  error_message: string;
  suggested_action: string;
  status: string;
  resolved_by?: string;
  resolved_at?: string;
  resolution_note?: string;
  created_at: string;
}

export interface DuplicatePunchCandidateDTO {
  id: string;
  staff_id?: string;
  staff_name?: string;
  staff_code?: string;
  biometric_employee_code?: string;
  device_id: string;
  device_code: string;
  punch_time: string;
  punch_type: string;
  duplicate_key: string;
  existing_punch_id: string;
  new_punch_id: string;
  suggested_action: string;
  status: string;
  created_at: string;
}

export interface MissingCheckoutRecordDTO {
  id: string;
  staff_id: string;
  staff_name: string;
  staff_code: string;
  date: string;
  first_check_in_time: string;
  shift_end_time: string;
  shift_name: string;
  hours_worked_estimate?: number;
  correction_status: string;
  correction_request_id?: string;
  created_at: string;
}

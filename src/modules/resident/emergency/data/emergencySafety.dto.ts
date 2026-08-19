import type { Absent } from "../../../../shared/types/absence.types";
export interface EmergencyContactDTO {
    id: string;
    name: string;
    relationship: string;
    mobile_number: string;
    mobile_masked: string;
    priority: number;
    notify_for_all: boolean;
    notify_for_senior_only: boolean;
    consent_confirmed: boolean;
    created_at: string;
}
export interface EmergencyResponderDTO {
    id: string;
    name: string;
    role: string;
    mobile_masked?: string;
    status: string;
    eta_minutes?: number;
    assigned_at: string;
    acknowledged_at?: string;
    reached_at?: string;
}
export interface EmergencyIncidentDTO {
    id: string;
    incident_number: string;
    emergency_type: string;
    severity: string;
    status: string;
    reported_by_user_id: string;
    reported_by_user_name: string;
    reported_by_user_mobile_masked: string;
    unit_id: string;
    flat_number: string;
    tower: string;
    location: string;
    description?: string;
    is_senior_citizen: boolean;
    need_ambulance: boolean;
    need_volunteer: boolean;
    notify_family: boolean;
    is_private: boolean;
    fire_type?: string;
    is_people_trapped?: boolean;
    lift_number?: string;
    number_of_people_stuck?: number;
    threat_type?: string;
    responders: EmergencyResponderDTO[];
    created_at: string;
    resolved_at?: string;
    closed_at?: string;
    closure_summary?: string;
}
export interface EmergencyTimelineEventDTO {
    id: string;
    incident_id: string;
    timestamp: string;
    actor_id: string;
    actor_name: string;
    actor_role: string;
    event_type: string;
    note?: string;
    source: string;
}
export interface SeniorCareProfileDTO {
    id: string;
    resident_id: string;
    name: string;
    unit_id: string;
    flat_number: string;
    tower: string;
    senior_care_status: string;
    family_connect_enabled: boolean;
    daily_check_in_enabled: boolean;
    preferred_help_type?: string;
    priority_complaint_enabled: boolean;
    security_check_call_preference?: string;
    consent_confirmed: boolean;
    consent_date?: string;
    created_at: string;
    updated_at?: string;
}
export interface SeniorDailyCheckInDTO {
    id: string;
    senior_id: string;
    senior_name: string;
    flat_number: string;
    tower: string;
    date: string;
    status: string;
    check_in_time?: string;
    notes?: string;
    notified_family: boolean;
}
export interface SeniorInactivityAlertDTO {
    id: string;
    senior_id: string;
    senior_name: string;
    unit_id: string;
    flat_number: string;
    tower: string;
    missed_check_in_time: string;
    alert_status: string;
    family_notified: boolean;
    security_check_call_status: string;
    acknowledged_by?: string;
    acknowledged_at?: string;
    notes?: string;
}
export interface EmergencyVolunteerDTO {
    id: string;
    resident_id: string;
    name: string;
    volunteer_type: string;
    availability: string;
    tower: string;
    flat_number: string;
    skills_note?: string;
    verification_status: string;
    contact_visibility_consent: boolean;
    mobile_masked: string;
    created_at: string;
}
export interface VolunteerAlertDTO {
    id: string;
    incident_id: string;
    emergency_type: string;
    location: string;
    severity: string;
    volunteer_id: string;
    volunteer_name: string;
    status: string;
    alerted_at: string;
    responded_at?: string;
    response_note?: string;
}
export interface EmergencyBroadcastDTO {
    id: string;
    broadcast_type: string;
    sender_name: string;
    sender_role: string;
    message: string;
    severity: string;
    target_audience: string;
    affected_area?: string;
    status: string;
    sent_at: string;
}
export interface SafetyInstructionDTO {
    id: string;
    category: string;
    title: string;
    steps: string[];
    emergency_numbers: {
        label: string;
        number: string;
    }[];
    audience: string;
    last_updated_at: string;
}
export interface SafetyDrillRecordDTO {
    id: string;
    drill_type: string;
    drill_name: string;
    scheduled_date: string;
    target_area: string;
    participants_count: number;
    status: string;
    observations?: string;
    improvement_actions?: string;
    completed_at?: string;
}
export interface PostIncidentReviewDTO {
    id: string;
    incident_id: string;
    incident_number: string;
    emergency_type: string;
    review_owner_name: string;
    what_happened: string;
    response_time_minutes: number;
    what_worked_well: string;
    what_failed: string;
    follow_up_actions: string;
    responsible_person: string;
    due_date?: string;
    status: string;
    created_at: string;
}
export interface EmergencyAuditLogDTO {
    id: string;
    timestamp: string;
    actor_id: string;
    actor_name: string;
    actor_role: string;
    event_type: string;
    entity_reference: string;
    correlation_id: string;
    metadata: Record<string, string | number | boolean | Absent>;
}


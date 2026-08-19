import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { emergencyMappers } from './emergencySafety.mapper';
import type { EmergencyContactDTO, EmergencyIncidentDTO, EmergencyTimelineEventDTO, SeniorCareProfileDTO, SeniorDailyCheckInDTO, SeniorInactivityAlertDTO, EmergencyVolunteerDTO, VolunteerAlertDTO, EmergencyBroadcastDTO, SafetyInstructionDTO, SafetyDrillRecordDTO, PostIncidentReviewDTO, EmergencyAuditLogDTO } from './emergencySafety.dto';
import type { EmergencyIncident, EmergencyTimelineEvent, CreateSosInput, CreateEmergencyIncidentInput, EmergencyContact, EmergencyDashboardSummary } from '../../../../shared/types/emergency.types';
import type { SeniorCareProfile, SeniorDailyCheckIn, SeniorInactivityAlert, SubmitSeniorCheckInInput } from '../../../../shared/types/seniorCare.types';
import type { EmergencyVolunteer, VolunteerAlert, RegisterVolunteerInput } from '../../../../shared/types/volunteer.types';
import type { EmergencyBroadcast, SafetyInstruction, SafetyDrillRecord, PostIncidentReview, EmergencyAuditLog, CreateBroadcastInput, CreateSafetyDrillInput, CreatePostIncidentReviewInput } from '../../../../shared/types/safety.types';
import type { ResponderAcknowledgementInput } from './emergencySafety.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export const emergencySafetyApiSource = {
    getEmergencyHome: async (): Promise<EmergencyDashboardSummary> => {
        const data = await apiClient.get<{
            societyName: string;
            activeCount: number;
            medicalCount: number;
            fireCount: number;
            liftCount: number;
            securityCount: number;
            recentIncidents: EmergencyIncidentDTO[];
        }>(apiEndpoints.emergency.dashboard);
        return {
            ...data,
            recentIncidents: data.recentIncidents.map(emergencyMappers.toIncident)
        };
    },
    createSos: async (input: CreateSosInput): Promise<EmergencyIncident> => {
        const dto = await apiClient.post<EmergencyIncidentDTO>(apiEndpoints.emergency.sos, { unit_id: input.unitId, flat_number: input.flatNumber, tower: input.tower, note: input.note }, { idempotencyKey: `sos-${Date.now()}` });
        return emergencyMappers.toIncident(dto);
    },
    createEmergencyIncident: async (input: CreateEmergencyIncidentInput): Promise<EmergencyIncident> => {
        const dto = await apiClient.post<EmergencyIncidentDTO>(apiEndpoints.emergency.incidents, {
            emergency_type: input.emergencyType,
            severity: input.severity,
            location: input.location,
            description: input.description,
            is_senior_citizen: input.isSeniorCitizen,
            need_ambulance: input.needAmbulance,
            need_volunteer: input.needVolunteer,
            notify_family: input.notifyFamily,
            is_private: input.isPrivate,
            fire_type: input.fireType,
            is_people_trapped: input.isPeopleTrapped,
            lift_number: input.liftNumber,
            number_of_people_stuck: input.numberOfPeopleStuck,
            threat_type: input.threatType
        }, { idempotencyKey: `incident-${Date.now()}` });
        return emergencyMappers.toIncident(dto);
    },
    getActiveEmergencyDetail: async (incidentId: string): Promise<EmergencyIncident> => {
        const dto = await apiClient.get<EmergencyIncidentDTO>(apiEndpoints.emergency.incidentDetail(incidentId));
        return emergencyMappers.toIncident(dto);
    },
    getEmergencyTimeline: async (incidentId: string): Promise<EmergencyTimelineEvent[]> => {
        const dtos = await apiClient.get<EmergencyTimelineEventDTO[]>(apiEndpoints.emergency.timeline(incidentId));
        return dtos.map(emergencyMappers.toTimelineEvent);
    },
    addEmergencyTimelineEvent: async (incidentId: string, input: {
        eventType: string;
        note?: string;
        source: string;
    }): Promise<EmergencyTimelineEvent> => {
        const dto = await apiClient.post<EmergencyTimelineEventDTO>(apiEndpoints.emergency.addTimelineEvent(incidentId), { event_type: input.eventType, note: input.note, source: input.source }, { idempotencyKey: `timeline-${Date.now()}` });
        return emergencyMappers.toTimelineEvent(dto);
    },
    acknowledgeIncident: async (incidentId: string, input: {
        note?: string;
    }): Promise<EmergencyIncident> => {
        const dto = await apiClient.post<EmergencyIncidentDTO>(apiEndpoints.emergency.acknowledgeIncident(incidentId), { note: input.note }, { idempotencyKey: `ack-${Date.now()}` });
        return emergencyMappers.toIncident(dto);
    },
    markResponderReached: async (incidentId: string, input: {
        note?: string;
    }): Promise<EmergencyIncident> => {
        const dto = await apiClient.post<EmergencyIncidentDTO>(apiEndpoints.emergency.markReached(incidentId), { note: input.note }, { idempotencyKey: `reached-${Date.now()}` });
        return emergencyMappers.toIncident(dto);
    },
    escalateIncident: async (incidentId: string, input: {
        note: string;
    }): Promise<EmergencyIncident> => {
        const dto = await apiClient.post<EmergencyIncidentDTO>(apiEndpoints.emergency.escalate(incidentId), { note: input.note }, { idempotencyKey: `escalate-${Date.now()}` });
        return emergencyMappers.toIncident(dto);
    },
    markResidentSafe: async (incidentId: string, input: {
        note?: string;
    }): Promise<EmergencyIncident> => {
        const dto = await apiClient.post<EmergencyIncidentDTO>(apiEndpoints.emergency.markSafe(incidentId), { note: input.note }, { idempotencyKey: `safe-${Date.now()}` });
        return emergencyMappers.toIncident(dto);
    },
    closeIncident: async (incidentId: string, input: {
        closureSummary: string;
    }): Promise<EmergencyIncident> => {
        const dto = await apiClient.post<EmergencyIncidentDTO>(apiEndpoints.emergency.close(incidentId), { closure_summary: input.closureSummary }, { idempotencyKey: `close-${Date.now()}` });
        return emergencyMappers.toIncident(dto);
    },
    getMyEmergencyHistory: async (filters?: Record<string, string>): Promise<EmergencyIncident[]> => {
        const dtos = await apiClient.get<EmergencyIncidentDTO[]>(apiEndpoints.emergency.myHistory, { ...includeWhenPresent("query", filters) });
        return dtos.map(emergencyMappers.toIncident);
    },
    getEmergencyContacts: async (): Promise<EmergencyContact[]> => {
        const dtos = await apiClient.get<EmergencyContactDTO[]>(apiEndpoints.emergency.contacts);
        return dtos.map(emergencyMappers.toContact);
    },
    createEmergencyContact: async (input: Omit<EmergencyContact, 'id' | 'mobileMasked' | 'createdAt'>): Promise<EmergencyContact> => {
        const dto = await apiClient.post<EmergencyContactDTO>(apiEndpoints.emergency.contacts, {
            name: input.name,
            relationship: input.relationship,
            mobile_number: input.mobileNumber,
            priority: input.priority,
            notify_for_all: input.notifyForAll,
            notify_for_senior_only: input.notifyForSeniorOnly,
            consent_confirmed: input.consentConfirmed
        }, { idempotencyKey: `contact-${Date.now()}` });
        return emergencyMappers.toContact(dto);
    },
    updateEmergencyContact: async (contactId: string, input: Partial<EmergencyContact>): Promise<EmergencyContact> => {
        const dto = await apiClient.patch<EmergencyContactDTO>(apiEndpoints.emergency.updateContact(contactId), {
            name: input.name,
            relationship: input.relationship,
            mobile_number: input.mobileNumber,
            priority: input.priority,
            notify_for_all: input.notifyForAll,
            notify_for_senior_only: input.notifyForSeniorOnly,
            consent_confirmed: input.consentConfirmed
        });
        return emergencyMappers.toContact(dto);
    },
    deleteEmergencyContact: async (contactId: string): Promise<{
        success: boolean;
    }> => {
        return apiClient.delete<{
            success: boolean;
        }>(apiEndpoints.emergency.deleteContact(contactId));
    },
    getFamilyConnect: async (): Promise<{
        enabled: boolean;
        contacts: EmergencyContact[];
    }> => {
        const data = await apiClient.get<{
            enabled: boolean;
            contacts: EmergencyContactDTO[];
        }>(apiEndpoints.emergency.familyConnect);
        return {
            enabled: data.enabled,
            contacts: data.contacts.map(emergencyMappers.toContact)
        };
    },
    updateFamilyConnect: async (input: {
        enabled: boolean;
    }): Promise<{
        success: boolean;
    }> => {
        return apiClient.patch<{
            success: boolean;
        }>(apiEndpoints.emergency.updateFamilyConnect, { enabled: input.enabled }, { idempotencyKey: `famconn-${Date.now()}` });
    },
    getSeniorCareProfile: async (): Promise<SeniorCareProfile> => {
        const dto = await apiClient.get<SeniorCareProfileDTO>(apiEndpoints.emergency.seniorCareProfile);
        return emergencyMappers.toSeniorProfile(dto);
    },
    updateSeniorCareProfile: async (input: Partial<SeniorCareProfile>): Promise<SeniorCareProfile> => {
        const dto = await apiClient.patch<SeniorCareProfileDTO>(apiEndpoints.emergency.updateSeniorCareProfile, {
            senior_care_status: input.seniorCareStatus,
            family_connect_enabled: input.familyConnectEnabled,
            daily_check_in_enabled: input.dailyCheckInEnabled,
            preferred_help_type: input.preferredHelpType,
            priority_complaint_enabled: input.priorityComplaintEnabled,
            security_check_call_preference: input.securityCheckCallPreference,
            consent_confirmed: input.consentConfirmed
        });
        return emergencyMappers.toSeniorProfile(dto);
    },
    submitSeniorCheckIn: async (input: SubmitSeniorCheckInInput): Promise<SeniorDailyCheckIn> => {
        const dto = await apiClient.post<SeniorDailyCheckInDTO>(apiEndpoints.emergency.seniorCheckIn, { status: input.status, notes: input.notes }, { idempotencyKey: `chkin-${Date.now()}` });
        return emergencyMappers.toSeniorCheckIn(dto);
    },
    getSeniorCheckIns: async (filters?: Record<string, string>): Promise<SeniorDailyCheckIn[]> => {
        const dtos = await apiClient.get<SeniorDailyCheckInDTO[]>(apiEndpoints.emergency.seniorCheckIns, { ...includeWhenPresent("query", filters) });
        return dtos.map(emergencyMappers.toSeniorCheckIn);
    },
    getSeniorInactivityAlerts: async (filters?: Record<string, string>): Promise<SeniorInactivityAlert[]> => {
        const dtos = await apiClient.get<SeniorInactivityAlertDTO[]>(apiEndpoints.emergency.seniorInactivityAlerts, { ...includeWhenPresent("query", filters) });
        return dtos.map(emergencyMappers.toSeniorInactivityAlert);
    },
    acknowledgeSeniorInactivityAlert: async (alertId: string, input: {
        notes?: string;
    }): Promise<SeniorInactivityAlert> => {
        const dto = await apiClient.post<SeniorInactivityAlertDTO>(apiEndpoints.emergency.acknowledgeInactivityAlert(alertId), { notes: input.notes }, { idempotencyKey: `ack-inact-${Date.now()}` });
        return emergencyMappers.toSeniorInactivityAlert(dto);
    },
    escalateSeniorInactivityAlert: async (alertId: string, input: {
        notes?: string;
    }): Promise<SeniorInactivityAlert> => {
        const dto = await apiClient.post<SeniorInactivityAlertDTO>(apiEndpoints.emergency.escalateInactivityAlert(alertId), { notes: input.notes }, { idempotencyKey: `esc-inact-${Date.now()}` });
        return emergencyMappers.toSeniorInactivityAlert(dto);
    },
    getEmergencyVolunteers: async (filters?: Record<string, string>): Promise<EmergencyVolunteer[]> => {
        const dtos = await apiClient.get<EmergencyVolunteerDTO[]>(apiEndpoints.emergency.volunteers, { ...includeWhenPresent("query", filters) });
        return dtos.map(emergencyMappers.toVolunteer);
    },
    registerEmergencyVolunteer: async (input: RegisterVolunteerInput): Promise<EmergencyVolunteer> => {
        const dto = await apiClient.post<EmergencyVolunteerDTO>(apiEndpoints.emergency.volunteers, {
            volunteer_type: input.volunteerType,
            availability: input.availability,
            skills_note: input.skillsNote,
            contact_visibility_consent: input.contactVisibilityConsent
        }, { idempotencyKey: `vol-reg-${Date.now()}` });
        return emergencyMappers.toVolunteer(dto);
    },
    getVolunteerAlertDetail: async (alertId: string): Promise<VolunteerAlert> => {
        const dto = await apiClient.get<VolunteerAlertDTO>(apiEndpoints.emergency.volunteerAlertDetail(alertId));
        return emergencyMappers.toVolunteerAlert(dto);
    },
    acceptVolunteerAlert: async (alertId: string, input: {
        note?: string;
    }): Promise<VolunteerAlert> => {
        const dto = await apiClient.post<VolunteerAlertDTO>(apiEndpoints.emergency.acceptVolunteerAlert(alertId), { note: input.note }, { idempotencyKey: `vol-accept-${Date.now()}` });
        return emergencyMappers.toVolunteerAlert(dto);
    },
    declineVolunteerAlert: async (alertId: string, input: {
        note?: string;
    }): Promise<VolunteerAlert> => {
        const dto = await apiClient.post<VolunteerAlertDTO>(apiEndpoints.emergency.declineVolunteerAlert(alertId), { note: input.note }, { idempotencyKey: `vol-decline-${Date.now()}` });
        return emergencyMappers.toVolunteerAlert(dto);
    },
    getGuardEmergencyConsole: async (): Promise<JsonValue> => {
        return apiClient.get<JsonObject>(apiEndpoints.emergency.guardConsole);
    },
    getFacilityEmergencyConsole: async (): Promise<JsonValue> => {
        return apiClient.get<JsonObject>(apiEndpoints.emergency.facilityConsole);
    },
    submitResponderAcknowledgement: async (input: ResponderAcknowledgementInput): Promise<{
        success: boolean;
    }> => {
        return apiClient.post<{
            success: boolean;
        }>(apiEndpoints.emergency.responderAcknowledge(input.incidentId), { status: input.status, note: input.note }, { idempotencyKey: `resp-ack-${Date.now()}` });
    },
    createEmergencyBroadcast: async (input: CreateBroadcastInput): Promise<EmergencyBroadcast> => {
        const dto = await apiClient.post<EmergencyBroadcastDTO>(apiEndpoints.emergency.broadcasts, {
            broadcast_type: input.broadcastType,
            message: input.message,
            severity: input.severity,
            target_audience: input.targetAudience,
            affected_area: input.affectedArea
        }, { idempotencyKey: `bcast-${Date.now()}` });
        return emergencyMappers.toBroadcast(dto);
    },
    getSafetyInstructions: async (filters?: Record<string, string>): Promise<SafetyInstruction[]> => {
        const dtos = await apiClient.get<SafetyInstructionDTO[]>(apiEndpoints.emergency.safetyInstructions, { ...includeWhenPresent("query", filters) });
        return dtos.map(emergencyMappers.toSafetyInstruction);
    },
    getSafetyDrills: async (filters?: Record<string, string>): Promise<SafetyDrillRecord[]> => {
        const dtos = await apiClient.get<SafetyDrillRecordDTO[]>(apiEndpoints.emergency.safetyDrills, { ...includeWhenPresent("query", filters) });
        return dtos.map(emergencyMappers.toDrillRecord);
    },
    createSafetyDrill: async (input: CreateSafetyDrillInput): Promise<SafetyDrillRecord> => {
        const dto = await apiClient.post<SafetyDrillRecordDTO>(apiEndpoints.emergency.safetyDrills, {
            drill_type: input.drillType,
            drill_name: input.drillName,
            scheduled_date: input.scheduledDate,
            target_area: input.targetArea
        }, { idempotencyKey: `drill-${Date.now()}` });
        return emergencyMappers.toDrillRecord(dto);
    },
    createPostIncidentReview: async (input: CreatePostIncidentReviewInput): Promise<PostIncidentReview> => {
        const dto = await apiClient.post<PostIncidentReviewDTO>(apiEndpoints.emergency.postIncidentReviews, {
            incident_id: input.incidentId,
            what_happened: input.whatHappened,
            response_time_minutes: input.responseTimeMinutes,
            what_worked_well: input.whatWorkedWell,
            what_failed: input.whatFailed,
            follow_up_actions: input.followUpActions,
            responsible_person: input.responsiblePerson,
            due_date: input.dueDate
        }, { idempotencyKey: `review-${Date.now()}` });
        return emergencyMappers.toPostIncidentReview(dto);
    },
    getEmergencySettings: async (): Promise<JsonValue> => {
        return apiClient.get<JsonObject>(apiEndpoints.emergency.settings);
    },
    getEmergencyAuditLogs: async (filters?: Record<string, string>): Promise<EmergencyAuditLog[]> => {
        const dtos = await apiClient.get<EmergencyAuditLogDTO[]>(apiEndpoints.emergency.auditLogs, { ...includeWhenPresent("query", filters) });
        return dtos.map(emergencyMappers.toAuditLog);
    }
};
export type { EmergencyIncident, EmergencyTimelineEvent, EmergencyContact, SeniorCareProfile, SeniorDailyCheckIn, SeniorInactivityAlert, EmergencyVolunteer, VolunteerAlert, EmergencyBroadcast, SafetyInstruction, SafetyDrillRecord, PostIncidentReview, EmergencyAuditLog };


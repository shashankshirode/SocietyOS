import { mockEmergencyIncidents } from '../../../../shared/mock/emergencyIncidents.mock';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import { mockEmergencyTimeline } from '../../../../shared/mock/emergencyTimeline.mock';
import { mockSeniorCareProfile, mockSeniorCheckIns, mockSeniorInactivityAlerts } from '../../../../shared/mock/seniorCare.mock';
import { mockEmergencyVolunteers } from '../../../../shared/mock/emergencyVolunteers.mock';
import { mockVolunteerAlerts } from '../../../../shared/mock/volunteerAlerts.mock';
import { mockSafetyInstructions } from '../../../../shared/mock/safetyInstructions.mock';
import { mockSafetyDrills } from '../../../../shared/mock/safetyDrills.mock';
import { mockPostIncidentReviews } from '../../../../shared/mock/postIncidentReviews.mock';
import { mockEmergencyAuditLogs } from '../../../../shared/mock/emergencyAuditLogs.mock';
import type { EmergencyIncident, EmergencyTimelineEvent, CreateSosInput, CreateEmergencyIncidentInput, EmergencyContact, EmergencyDashboardSummary } from '../../../../shared/types/emergency.types';
import type { SeniorCareProfile, SeniorDailyCheckIn, SeniorInactivityAlert, SubmitSeniorCheckInInput } from '../../../../shared/types/seniorCare.types';
import type { EmergencyVolunteer, VolunteerAlert, RegisterVolunteerInput } from '../../../../shared/types/volunteer.types';
import type { EmergencyBroadcast, SafetyInstruction, SafetyDrillRecord, PostIncidentReview, EmergencyAuditLog, CreateBroadcastInput, CreateSafetyDrillInput, CreatePostIncidentReviewInput } from '../../../../shared/types/safety.types';
import { getResidentMockRecords } from '../../mock/residentMockRegistry';
import { enMessages } from '../../../../messages/en';
import type { EmergencyQueryFilters, EmergencySettingsData, FacilityEmergencyConsoleData, GuardEmergencyConsoleData, ResponderAcknowledgementInput, } from './emergencySafety.types';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));
const emergencyContactsByHomeContext = new Map<string, EmergencyContact[]>();
function getScopedEmergencyContacts(): EmergencyContact[] {
    const context = resolveRequestContext();
    const cached = emergencyContactsByHomeContext.get(context.activeHome.homeContextId);
    if (cached) {
        return cached;
    }
    const contacts = getResidentMockRecords(context, 'emergency').map((record) => ({
        id: record.id,
        name: enMessages.resident.mockData.recordTitle(enMessages.resident.mockData.featureLabels.emergency, record.ordinal + 1, context.activeHome.displayUnitName),
        relationship: getRequiredItem((['FAMILY', 'FRIEND', 'NEIGHBOUR', 'DOCTOR', 'SECURITY', 'HOSPITAL', 'POLICE'] as const), record.ordinal % 7, "emergencySafety.mockSource.ts"),
        mobileNumber: `91000${String(record.ordinal + 1).padStart(5, '0')}`,
        mobileMasked: `91000*****`,
        priority: (record.ordinal % 3 + 1) as 1 | 2 | 3,
        notifyForAll: record.ordinal % 2 === 0,
        notifyForSeniorOnly: record.ordinal % 2 !== 0,
        consentConfirmed: true,
        createdAt: record.createdAtIso
    }));
    emergencyContactsByHomeContext.set(context.activeHome.homeContextId, contacts);
    return contacts;
}
export const emergencySafetyMockSource = {
    getEmergencyHome: async (): Promise<EmergencyDashboardSummary> => {
        await delay();
        const ctx = resolveRequestContext();
        return {
            societyName: ctx.activeHome.societyName,
            activeCount: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.status !== 'CANCELLED').length,
            medicalCount: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.emergencyType === 'MEDICAL').length,
            fireCount: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.emergencyType === 'FIRE').length,
            liftCount: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.emergencyType === 'LIFT_STUCK').length,
            securityCount: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.emergencyType === 'SECURITY_THREAT').length,
            recentIncidents: [...mockEmergencyIncidents].reverse().slice(0, 5)
        };
    },
    createSos: async (input: CreateSosInput): Promise<EmergencyIncident> => {
        await delay();
        const newIncident: EmergencyIncident = {
            id: `inc-${Date.now()}`,
            incidentNumber: `EMR-2026-${Math.floor(100 + Math.random() * 900)}`,
            emergencyType: 'SOS',
            severity: 'CRITICAL',
            status: 'CREATED',
            reportedByUserId: 'resident-001',
            reportedByUserName: 'Shashank',
            reportedByUserMobileMasked: '98765*****',
            unitId: input.unitId,
            flatNumber: input.flatNumber,
            tower: input.tower,
            location: `Flat ${input.flatNumber}`,
            description: input.note || 'Panic SOS button triggered.',
            isSeniorCitizen: false,
            needAmbulance: false,
            needVolunteer: true,
            notifyFamily: true,
            isPrivate: false,
            responders: [],
            createdAt: new Date().toISOString()
        };
        mockEmergencyIncidents.unshift(newIncident);
        mockEmergencyTimeline.unshift({
            id: `evt-${Date.now()}`,
            incidentId: newIncident.id,
            timestamp: newIncident.createdAt,
            actorId: 'resident-001',
            actorName: 'Shashank',
            actorRole: 'RESIDENT_OWNER',
            eventType: 'CREATED',
            note: 'SOS triggered by resident.',
            source: 'RESIDENT_APP'
        });
        return newIncident;
    },
    createEmergencyIncident: async (input: CreateEmergencyIncidentInput): Promise<EmergencyIncident> => {
        await delay();
        const newIncident: EmergencyIncident = {
            id: `inc-${Date.now()}`,
            incidentNumber: `EMR-2026-${Math.floor(100 + Math.random() * 900)}`,
            emergencyType: input.emergencyType,
            severity: input.severity,
            status: 'CREATED',
            reportedByUserId: 'resident-001',
            reportedByUserName: 'Shashank',
            reportedByUserMobileMasked: '98765*****',
            unitId: 'unit-a-1204',
            flatNumber: 'A-1204',
            tower: 'A Wing',
            location: input.location,
            ...includeWhenPresent("description", input.description),
            isSeniorCitizen: input.isSeniorCitizen || false,
            needAmbulance: input.needAmbulance || false,
            needVolunteer: input.needVolunteer || false,
            notifyFamily: input.notifyFamily || false,
            isPrivate: input.isPrivate || false,
            ...includeWhenPresent("fireType", input.fireType),
            ...includeWhenPresent("isPeopleTrapped", input.isPeopleTrapped),
            ...includeWhenPresent("liftNumber", input.liftNumber),
            ...includeWhenPresent("numberOfPeopleStuck", input.numberOfPeopleStuck),
            ...includeWhenPresent("threatType", input.threatType),
            responders: [],
            createdAt: new Date().toISOString()
        };
        mockEmergencyIncidents.unshift(newIncident);
        mockEmergencyTimeline.unshift({
            id: `evt-${Date.now()}`,
            incidentId: newIncident.id,
            timestamp: newIncident.createdAt,
            actorId: 'resident-001',
            actorName: 'Shashank',
            actorRole: 'RESIDENT_OWNER',
            eventType: 'CREATED',
            note: `${input.emergencyType} emergency reported.`,
            source: 'RESIDENT_APP'
        });
        return newIncident;
    },
    getActiveEmergencyDetail: async (incidentId: string): Promise<EmergencyIncident | Absent> => {
        await delay();
        return mockEmergencyIncidents.find(i => i.id === incidentId);
    },
    getEmergencyTimeline: async (incidentId: string): Promise<EmergencyTimelineEvent[]> => {
        await delay();
        return mockEmergencyTimeline.filter(e => e.incidentId === incidentId);
    },
    addEmergencyTimelineEvent: async (incidentId: string, input: {
        eventType: string;
        note?: string;
        source: EmergencyTimelineEvent['source'];
    }): Promise<EmergencyTimelineEvent> => {
        await delay();
        const newEvent: EmergencyTimelineEvent = {
            id: `evt-${Date.now()}`,
            incidentId,
            timestamp: new Date().toISOString(),
            actorId: 'resident-001',
            actorName: 'Shashank',
            actorRole: 'RESIDENT_OWNER',
            eventType: input.eventType,
            ...includeWhenPresent("note", input.note),
            source: input.source
        };
        mockEmergencyTimeline.unshift(newEvent);
        return newEvent;
    },
    acknowledgeIncident: async (incidentId: string, input: {
        note?: string;
    }): Promise<EmergencyIncident> => {
        await delay();
        const incident = mockEmergencyIncidents.find(i => i.id === incidentId);
        if (!incident)
            throw new Error('Incident not found');
        incident.status = 'ACKNOWLEDGED';
        incident.responders.push({
            id: `resp-${Date.now()}`,
            name: 'Ramesh Pawar',
            role: 'GUARD',
            mobileMasked: '98200*****',
            status: 'ACKNOWLEDGED',
            etaMinutes: 3,
            assignedAt: new Date().toISOString(),
            acknowledgedAt: new Date().toISOString()
        });
        mockEmergencyTimeline.unshift({
            id: `evt-${Date.now()}`,
            incidentId,
            timestamp: new Date().toISOString(),
            actorId: 'guard-001',
            actorName: 'Ramesh Pawar',
            actorRole: 'SECURITY_GUARD',
            eventType: 'ACKNOWLEDGED',
            note: input.note || 'Incident acknowledged by Guard Ramesh Pawar.',
            source: 'GUARD_CONSOLE'
        });
        return incident;
    },
    markResponderReached: async (incidentId: string, input: {
        note?: string;
    }): Promise<EmergencyIncident> => {
        await delay();
        const incident = mockEmergencyIncidents.find(i => i.id === incidentId);
        if (!incident)
            throw new Error('Incident not found');
        incident.status = 'RESPONDER_REACHED';
        const guard = incident.responders.find(r => r.role === 'GUARD');
        if (guard) {
            guard.status = 'REACHED';
            guard.reachedAt = new Date().toISOString();
        }
        mockEmergencyTimeline.unshift({
            id: `evt-${Date.now()}`,
            incidentId,
            timestamp: new Date().toISOString(),
            actorId: 'guard-001',
            actorName: 'Ramesh Pawar',
            actorRole: 'SECURITY_GUARD',
            eventType: 'RESPONDER_REACHED',
            note: input.note || 'Guard reached the location.',
            source: 'GUARD_CONSOLE'
        });
        return incident;
    },
    escalateIncident: async (incidentId: string, input: {
        note: string;
    }): Promise<EmergencyIncident> => {
        await delay();
        const incident = mockEmergencyIncidents.find(i => i.id === incidentId);
        if (!incident)
            throw new Error('Incident not found');
        incident.status = 'ESCALATED';
        mockEmergencyTimeline.unshift({
            id: `evt-${Date.now()}`,
            incidentId,
            timestamp: new Date().toISOString(),
            actorId: 'guard-001',
            actorName: 'Ramesh Pawar',
            actorRole: 'SECURITY_GUARD',
            eventType: 'ESCALATED',
            note: input.note,
            source: 'GUARD_CONSOLE'
        });
        return incident;
    },
    markResidentSafe: async (incidentId: string, input: {
        note?: string;
    }): Promise<EmergencyIncident> => {
        await delay();
        const incident = mockEmergencyIncidents.find(i => i.id === incidentId);
        if (!incident)
            throw new Error('Incident not found');
        incident.status = 'UNDER_CONTROL';
        mockEmergencyTimeline.unshift({
            id: `evt-${Date.now()}`,
            incidentId,
            timestamp: new Date().toISOString(),
            actorId: 'resident-001',
            actorName: 'Shashank',
            actorRole: 'RESIDENT_OWNER',
            eventType: 'UNDER_CONTROL',
            note: input.note || 'Resident marked safe / under control.',
            source: 'RESIDENT_APP'
        });
        return incident;
    },
    closeIncident: async (incidentId: string, input: {
        closureSummary: string;
    }): Promise<EmergencyIncident> => {
        await delay();
        const incident = mockEmergencyIncidents.find(i => i.id === incidentId);
        if (!incident)
            throw new Error('Incident not found');
        incident.status = 'CLOSED';
        incident.closedAt = new Date().toISOString();
        incident.closureSummary = input.closureSummary;
        mockEmergencyTimeline.unshift({
            id: `evt-${Date.now()}`,
            incidentId,
            timestamp: new Date().toISOString(),
            actorId: 'facility-manager-001',
            actorName: 'Suresh Patil',
            actorRole: 'FACILITY_MANAGER',
            eventType: 'CLOSED',
            note: `Incident closed. Summary: ${input.closureSummary}`,
            source: 'FACILITY_CONSOLE'
        });
        return incident;
    },
    getMyEmergencyHistory: async (_params?: EmergencyQueryFilters): Promise<EmergencyIncident[]> => {
        await delay();
        return mockEmergencyIncidents.filter(i => i.reportedByUserId === 'resident-001');
    },
    getEmergencyContacts: async (): Promise<EmergencyContact[]> => {
        await delay();
        return [...getScopedEmergencyContacts()];
    },
    createEmergencyContact: async (input: Omit<EmergencyContact, 'id' | 'mobileMasked' | 'createdAt'>): Promise<EmergencyContact> => {
        await delay();
        const newContact: EmergencyContact = {
            ...input,
            id: `cont-${Date.now()}`,
            mobileMasked: (input.mobileNumber ? input.mobileNumber.slice(0, 5) : '98765') + '*****',
            createdAt: new Date().toISOString()
        };
        getScopedEmergencyContacts().push(newContact);
        return newContact;
    },
    updateEmergencyContact: async (contactId: string, input: Partial<EmergencyContact>): Promise<EmergencyContact> => {
        await delay();
        const contact = getScopedEmergencyContacts().find(c => c.id === contactId);
        if (!contact)
            throw new Error('Contact not found');
        Object.assign(contact, input);
        if (input.mobileNumber) {
            contact.mobileMasked = input.mobileNumber.slice(0, 5) + '*****';
        }
        return contact;
    },
    deleteEmergencyContact: async (contactId: string): Promise<{
        success: boolean;
    }> => {
        await delay();
        const contacts = getScopedEmergencyContacts();
        const idx = contacts.findIndex(c => c.id === contactId);
        if (idx > -1) {
            contacts.splice(idx, 1);
        }
        return { success: true };
    },
    getFamilyConnect: async (): Promise<{
        enabled: boolean;
        contacts: EmergencyContact[];
    }> => {
        await delay();
        return {
            enabled: mockSeniorCareProfile.familyConnectEnabled,
            contacts: getScopedEmergencyContacts().filter(c => c.relationship === 'FAMILY')
        };
    },
    updateFamilyConnect: async (input: {
        enabled: boolean;
    }): Promise<{
        success: boolean;
    }> => {
        await delay();
        mockSeniorCareProfile.familyConnectEnabled = input.enabled;
        return { success: true };
    },
    getSeniorCareProfile: async (): Promise<SeniorCareProfile> => {
        await delay();
        return mockSeniorCareProfile;
    },
    updateSeniorCareProfile: async (input: Partial<SeniorCareProfile>): Promise<SeniorCareProfile> => {
        await delay();
        Object.assign(mockSeniorCareProfile, input);
        return mockSeniorCareProfile;
    },
    submitSeniorCheckIn: async (input: SubmitSeniorCheckInInput): Promise<SeniorDailyCheckIn> => {
        await delay();
        const newCheckIn: SeniorDailyCheckIn = {
            id: `chkin-${Date.now()}`,
            seniorId: mockSeniorCareProfile.id,
            seniorName: mockSeniorCareProfile.name,
            flatNumber: mockSeniorCareProfile.flatNumber,
            tower: mockSeniorCareProfile.tower,
            date: getRequiredItem(new Date().toISOString().split('T'), 0, "emergencySafety.mockSource.ts"),
            status: input.status,
            checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ...includeWhenPresent("notes", input.notes),
            notifiedFamily: true
        };
        mockSeniorCheckIns.unshift(newCheckIn);
        return newCheckIn;
    },
    getSeniorCheckIns: async (_params?: EmergencyQueryFilters): Promise<SeniorDailyCheckIn[]> => {
        await delay();
        return mockSeniorCheckIns;
    },
    getSeniorInactivityAlerts: async (_params?: EmergencyQueryFilters): Promise<SeniorInactivityAlert[]> => {
        await delay();
        return mockSeniorInactivityAlerts;
    },
    acknowledgeSeniorInactivityAlert: async (alertId: string, input: {
        notes?: string;
    }): Promise<SeniorInactivityAlert> => {
        await delay();
        const alert = mockSeniorInactivityAlerts.find(a => a.id === alertId);
        if (!alert)
            throw new Error('Alert not found');
        alert.alertStatus = 'ACKNOWLEDGED';
        alert.securityCheckCallStatus = 'CONTACTED';
        alert.acknowledgedBy = 'Ramesh Pawar';
        alert.acknowledgedAt = new Date().toISOString();
        if (input.notes !== undefined) {
            alert.notes = input.notes;
        }
        return alert;
    },
    escalateSeniorInactivityAlert: async (alertId: string, input: {
        notes?: string;
    }): Promise<SeniorInactivityAlert> => {
        await delay();
        const alert = mockSeniorInactivityAlerts.find(a => a.id === alertId);
        if (!alert)
            throw new Error('Alert not found');
        alert.alertStatus = 'ESCALATED';
        if (input.notes !== undefined) {
            alert.notes = input.notes;
        }
        return alert;
    },
    getEmergencyVolunteers: async (params?: EmergencyQueryFilters): Promise<EmergencyVolunteer[]> => {
        await delay();
        let res = mockEmergencyVolunteers;
        if (params?.type && params.type !== 'ALL') {
            res = res.filter(v => v.volunteerType === params.type);
        }
        return res;
    },
    registerEmergencyVolunteer: async (input: RegisterVolunteerInput): Promise<EmergencyVolunteer> => {
        await delay();
        const newVol: EmergencyVolunteer = {
            id: `vol-${Date.now()}`,
            residentId: 'resident-001',
            name: 'Shashank',
            volunteerType: input.volunteerType,
            availability: input.availability,
            tower: 'A Wing',
            flatNumber: 'A-1204',
            ...includeWhenPresent("skillsNote", input.skillsNote),
            verificationStatus: 'PENDING',
            contactVisibilityConsent: input.contactVisibilityConsent,
            mobileMasked: '98765*****',
            createdAt: new Date().toISOString()
        };
        mockEmergencyVolunteers.unshift(newVol);
        return newVol;
    },
    getVolunteerAlertDetail: async (alertId: string): Promise<VolunteerAlert | Absent> => {
        await delay();
        return mockVolunteerAlerts.find(a => a.id === alertId);
    },
    acceptVolunteerAlert: async (alertId: string, input: {
        note?: string;
    }): Promise<VolunteerAlert> => {
        await delay();
        const alert = mockVolunteerAlerts.find(a => a.id === alertId);
        if (!alert)
            throw new Error('Alert not found');
        alert.status = 'AVAILABLE';
        alert.respondedAt = new Date().toISOString();
        if (input.note !== undefined) {
            alert.responseNote = input.note;
        }
        return alert;
    },
    declineVolunteerAlert: async (alertId: string, input: {
        note?: string;
    }): Promise<VolunteerAlert> => {
        await delay();
        const alert = mockVolunteerAlerts.find(a => a.id === alertId);
        if (!alert)
            throw new Error('Alert not found');
        alert.status = 'NOT_AVAILABLE';
        alert.respondedAt = new Date().toISOString();
        if (input.note !== undefined) {
            alert.responseNote = input.note;
        }
        return alert;
    },
    getGuardEmergencyConsole: async (): Promise<GuardEmergencyConsoleData> => {
        await delay();
        return {
            activeCount: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.status !== 'CANCELLED').length,
            acknowledgedCount: mockEmergencyIncidents.filter(i => i.status === 'ACKNOWLEDGED').length,
            unacknowledgedCount: mockEmergencyIncidents.filter(i => i.status === 'CREATED').length,
            emergencies: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.status !== 'CANCELLED')
        };
    },
    getFacilityEmergencyConsole: async (): Promise<FacilityEmergencyConsoleData> => {
        await delay();
        return {
            activeCount: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.status !== 'CANCELLED').length,
            escalatedCount: mockEmergencyIncidents.filter(i => i.status === 'ESCALATED').length,
            needsPostReviewCount: mockEmergencyIncidents.filter(i => i.status === 'CLOSED' && !mockPostIncidentReviews.some(r => r.incidentId === i.id)).length,
            emergencies: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.status !== 'CANCELLED')
        };
    },
    submitResponderAcknowledgement: async (input: ResponderAcknowledgementInput): Promise<{
        success: boolean;
    }> => {
        await delay();
        const incident = mockEmergencyIncidents.find(i => i.id === input.incidentId);
        if (!incident)
            throw new Error('Incident not found');
        incident.status = 'RESPONDER_ON_THE_WAY';
        incident.responders.push({
            id: `resp-${Date.now()}`,
            name: 'Suresh Patil',
            role: 'FACILITY_MANAGER',
            mobileMasked: '99333*****',
            status: input.status,
            assignedAt: new Date().toISOString()
        });
        return { success: true };
    },
    createEmergencyBroadcast: async (input: CreateBroadcastInput): Promise<EmergencyBroadcast> => {
        await delay();
        const newBroadcast: EmergencyBroadcast = {
            id: `bcast-${Date.now()}`,
            broadcastType: input.broadcastType,
            senderName: 'Suresh Patil',
            senderRole: 'FACILITY_MANAGER',
            message: input.message,
            severity: input.severity,
            targetAudience: input.targetAudience,
            ...includeWhenPresent("affectedArea", input.affectedArea),
            status: 'SENT',
            sentAt: new Date().toISOString()
        };
        return newBroadcast;
    },
    getSafetyInstructions: async (_params?: EmergencyQueryFilters): Promise<SafetyInstruction[]> => {
        await delay();
        return mockSafetyInstructions;
    },
    getSafetyDrills: async (_params?: EmergencyQueryFilters): Promise<SafetyDrillRecord[]> => {
        await delay();
        return mockSafetyDrills;
    },
    createSafetyDrill: async (input: CreateSafetyDrillInput): Promise<SafetyDrillRecord> => {
        await delay();
        const newDrill: SafetyDrillRecord = {
            id: `drill-${Date.now()}`,
            drillType: input.drillType,
            drillName: input.drillName,
            scheduledDate: input.scheduledDate,
            targetArea: input.targetArea,
            participantsCount: 0,
            status: 'PLANNED'
        };
        mockSafetyDrills.push(newDrill);
        return newDrill;
    },
    createPostIncidentReview: async (input: CreatePostIncidentReviewInput): Promise<PostIncidentReview> => {
        await delay();
        const incident = mockEmergencyIncidents.find(i => i.id === input.incidentId);
        const newReview: PostIncidentReview = {
            id: `rev-${Date.now()}`,
            incidentId: input.incidentId,
            incidentNumber: incident?.incidentNumber || 'EMR-2026-TBD',
            emergencyType: incident?.emergencyType || 'UNKNOWN',
            reviewOwnerName: 'Suresh Patil',
            whatHappened: input.whatHappened,
            responseTimeMinutes: input.responseTimeMinutes,
            whatWorkedWell: input.whatWorkedWell,
            whatFailed: input.whatFailed,
            followUpActions: input.followUpActions,
            responsiblePerson: input.responsiblePerson,
            ...includeWhenPresent("dueDate", input.dueDate),
            status: 'PENDING',
            createdAt: new Date().toISOString()
        };
        mockPostIncidentReviews.push(newReview);
        return newReview;
    },
    getEmergencySettings: async (): Promise<EmergencySettingsData> => {
        await delay();
        return {
            sosRecipients: ['GUARD_GATE', 'FACILITY_OFFICE', 'VOLUNTEER_MEDICAL'],
            guardEscalationMinutes: 5,
            facilityEscalationMinutes: 10,
            volunteerAlertRadiusMeters: 500,
            seniorCheckInHour: 10,
            missedCheckInEscalationMinutes: 60
        };
    },
    getEmergencyAuditLogs: async (_params?: EmergencyQueryFilters): Promise<EmergencyAuditLog[]> => {
        await delay();
        return mockEmergencyAuditLogs;
    }
};
export type { EmergencyIncident, EmergencyTimelineEvent, EmergencyContact, SeniorCareProfile, SeniorDailyCheckIn, SeniorInactivityAlert, EmergencyVolunteer, VolunteerAlert, EmergencyBroadcast, SafetyInstruction, SafetyDrillRecord, PostIncidentReview, EmergencyAuditLog };


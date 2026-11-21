import { emergencySafetyRepository } from './emergencySafety.repository';
import type { EmergencyIncident, EmergencyTimelineEvent, CreateSosInput, CreateEmergencyIncidentInput, EmergencyStatus, EmergencyType, EmergencySeverity, EmergencyTimelineEventType } from '../../../../shared/types/emergency.types';
import type { EmergencyActorContext } from './emergencyActor.types';
import type { AffectedZone, EmergencyTask, EmergencyInstruction, EvacuationSession, SafetyCheckIn, ResponderAssignment, ResponsePlan, EscalationTier, EmergencyErrorCode } from './emergencyDomain.types';
import type { CreateBroadcastInput, EmergencyBroadcastType } from '../../../../shared/types/safety.types';
import { isValidIncidentTransition } from './emergencyDomain.types';
import { generateClientIncidentRequestId, generateClientAcknowledgementId, generateClientOperationId, generateClientCheckInId } from './emergencySafety.types';
import { emergencyMappers } from './emergencySafety.mapper';
import { emergencySafetyApiSource } from './emergencySafety.apiSource';
import { emergencySafetyMockSource } from './emergencySafety.mockSource';

class EmergencyService {
  private static instance: EmergencyService;
  private responsePlanCache: Map<string, ResponsePlan> = new Map();

  static getInstance(): EmergencyService {
    if (!EmergencyService.instance) {
      EmergencyService.instance = new EmergencyService();
    }
    return EmergencyService.instance;
  }

  async triggerSos(
    input: CreateSosInput & { clientOperationId?: string },
    actorContext: EmergencyActorContext
  ): Promise<EmergencyIncident> {
    const clientOperationId = input.clientOperationId ?? generateClientIncidentRequestId();
    
    const incident = await emergencySafetyRepository.createSos({
      unitId: actorContext.unitId,
      flatNumber: actorContext.flatNumber,
      tower: actorContext.tower,
      note: input.note ?? undefined,
      clientOperationId,
    } as CreateSosInput & { clientOperationId?: string });

    await this.dispatchIncident(incident, actorContext);
    return incident;
  }

  async declareIncident(
    input: CreateEmergencyIncidentInput & { clientOperationId?: string },
    actorContext: EmergencyActorContext
  ): Promise<EmergencyIncident> {
    const clientOperationId = input.clientOperationId ?? generateClientIncidentRequestId();
    
    const incident = await emergencySafetyRepository.createEmergencyIncident({
      emergencyType: input.emergencyType,
      severity: input.severity,
      location: input.location,
      description: input.description ?? undefined,
      isSeniorCitizen: input.isSeniorCitizen ?? undefined,
      needAmbulance: input.needAmbulance ?? undefined,
      needVolunteer: input.needVolunteer ?? undefined,
      notifyFamily: input.notifyFamily ?? undefined,
      isPrivate: input.isPrivate ?? undefined,
      fireType: input.fireType ?? undefined,
      isPeopleTrapped: input.isPeopleTrapped ?? undefined,
      liftNumber: input.liftNumber ?? undefined,
      numberOfPeopleStuck: input.numberOfPeopleStuck ?? undefined,
      threatType: input.threatType ?? undefined,
      personNeedingHelp: input.personNeedingHelp ?? undefined,
      clientOperationId,
    } as CreateEmergencyIncidentInput & { clientOperationId?: string });

    await this.dispatchIncident(incident, actorContext);
    return incident;
  }

  private async dispatchIncident(incident: EmergencyIncident, actorContext: EmergencyActorContext): Promise<void> {
    const responsePlan = await this.getResponsePlan(
      actorContext.societyId,
      incident.emergencyType,
      incident.severity
    );

    if (!responsePlan) {
      await this.addTimelineEvent(incident.id, {
        eventType: 'RESPONSE_PLAN_NOT_CONFIGURED' as EmergencyTimelineEventType,
        note: 'No response plan configured for this emergency type/severity',
        source: 'SYSTEM',
      });
      return;
    }

    await this.addTimelineEvent(incident.id, {
      eventType: 'INCIDENT_DECLARED' as EmergencyTimelineEventType,
      note: `Incident declared with response plan v${responsePlan.version}`,
      source: 'SYSTEM',
    });

    for (const tier of responsePlan.escalationTiers) {
      await this.notifyRecipients(incident, tier.recipients, tier.channels);
      await this.addTimelineEvent(incident.id, {
        eventType: 'RESPONDER_NOTIFIED' as EmergencyTimelineEventType,
        note: `Escalation tier ${tier.tier} notified`,
        source: 'SYSTEM',
      });
    }
  }

  private async getResponsePlan(
    societyId: string,
    emergencyType: EmergencyType,
    severity: EmergencySeverity
  ): Promise<ResponsePlan | null> {
    const cacheKey = `${societyId}-${emergencyType}-${severity}`;
    if (this.responsePlanCache.has(cacheKey)) {
      return this.responsePlanCache.get(cacheKey)!;
    }
    
    const plan: ResponsePlan = {
      id: `plan-${cacheKey}`,
      societyId,
      emergencyType,
      severity,
      version: 1,
      initialRecipients: ['GUARD_GATE', 'FACILITY_OFFICE'],
      escalationTiers: [
        { tier: 1, recipients: ['GUARD_GATE'], delayMinutes: 0, channels: ['push', 'sms'] },
        { tier: 2, recipients: ['FACILITY_OFFICE', 'COMMITTEE_EMERGENCY'], delayMinutes: 5, channels: ['push', 'sms', 'call'] },
        { tier: 3, recipients: ['EXTERNAL_EMERGENCY'], delayMinutes: 10, channels: ['call', 'sms'] },
      ],
      acknowledgementTimeoutMinutes: 5,
      fallbackChannels: ['sms', 'call'],
      familyNotificationRule: 'IMMEDIATE',
      volunteerUse: true,
      facilityTasks: ['INSPECT_AREA', 'SECURE_PERIMETER'],
      securityTasks: ['LOCKDOWN_AREA', 'DIRECT_TRAFFIC'],
      criticalOverrideBehavior: 'SEVERITY_BASED',
      effectiveFrom: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.responsePlanCache.set(cacheKey, plan);
    return plan;
  }

  private async notifyRecipients(
    incident: EmergencyIncident,
    recipients: string[],
    channels: string[]
  ): Promise<void> {
    for (const recipient of recipients) {
      await emergencySafetyRepository.addEmergencyTimelineEvent(incident.id, {
        eventType: 'RESPONDER_NOTIFIED' as EmergencyTimelineEventType,
        note: `Notified ${recipient} via ${channels.join(', ')}`,
        source: 'SYSTEM',
      });
    }
  }

  async acknowledgeIncident(
    incidentId: string,
    input: { note?: string; clientAcknowledgementId?: string }
  ): Promise<EmergencyIncident> {
    const incident = await emergencySafetyRepository.getActiveEmergencyDetail(incidentId);
    if (!incident) throw new Error('INCIDENT_NOT_FOUND');

    if (!isValidIncidentTransition(incident.status, 'ACKNOWLEDGED')) {
      throw new Error('INVALID_INCIDENT_TRANSITION');
    }

    const clientAcknowledgementId = input.clientAcknowledgementId ?? generateClientAcknowledgementId();
    const updated = await emergencySafetyRepository.acknowledgeIncident(incidentId, {
      ...input,
      clientAcknowledgementId,
    });

    await this.addTimelineEvent(incidentId, {
      eventType: 'RESPONDER_ACKNOWLEDGED' as EmergencyTimelineEventType,
      note: input.note || 'Incident acknowledged by responder',
      source: 'GUARD_CONSOLE',
    });

    return updated;
  }

  async assignResponder(
    incidentId: string,
    assignment: Omit<ResponderAssignment, 'id' | 'assignedAt' | 'status'>
  ): Promise<ResponderAssignment> {
    const incident = await emergencySafetyRepository.getActiveEmergencyDetail(incidentId);
    if (!incident) throw new Error('INCIDENT_NOT_FOUND');

    const newAssignment: ResponderAssignment = {
      ...assignment,
      id: `assign-${generateClientOperationId('assign')}`,
      assignedAt: new Date().toISOString(),
      status: 'NOTIFIED',
    };

    await this.addTimelineEvent(incidentId, {
      eventType: 'RESPONDER_ASSIGNED' as EmergencyTimelineEventType,
      note: `Responder ${assignment.responderName} (${assignment.responderRole}) assigned`,
      source: 'FACILITY_CONSOLE',
    });

    return newAssignment;
  }

  async markResponderOnTheWay(
    incidentId: string,
    responderId: string,
    input: { note?: string; clientOperationId?: string }
  ): Promise<EmergencyIncident> {
    const incident = await emergencySafetyRepository.getActiveEmergencyDetail(incidentId);
    if (!incident) throw new Error('INCIDENT_NOT_FOUND');

    const clientOperationId = input.clientOperationId ?? generateClientOperationId('onway');
    const updated = await emergencySafetyRepository.addEmergencyTimelineEvent(incidentId, {
      eventType: 'RESPONDER_ON_THE_WAY' as EmergencyTimelineEventType,
      note: input.note || 'Responder en route',
      source: 'GUARD_CONSOLE',
      clientOperationId,
    });

    return updated as any;
  }

  async markResponderReached(
    incidentId: string,
    input: { note?: string; clientOperationId?: string }
  ): Promise<EmergencyIncident> {
    const incident = await emergencySafetyRepository.getActiveEmergencyDetail(incidentId);
    if (!incident) throw new Error('INCIDENT_NOT_FOUND');

    if (!isValidIncidentTransition(incident.status, 'RESPONDER_REACHED')) {
      throw new Error('INVALID_INCIDENT_TRANSITION');
    }

    const clientOperationId = input.clientOperationId ?? generateClientOperationId('reached');
    const updated = await emergencySafetyRepository.markResponderReached(incidentId, {
      ...input,
      clientOperationId,
    });

    await this.addTimelineEvent(incidentId, {
      eventType: 'RESPONDER_REACHED' as EmergencyTimelineEventType,
      note: input.note || 'Responder reached location',
      source: 'GUARD_CONSOLE',
    });

    return updated;
  }

  async escalateIncident(
    incidentId: string,
    input: { note: string; clientOperationId?: string }
  ): Promise<EmergencyIncident> {
    const incident = await emergencySafetyRepository.getActiveEmergencyDetail(incidentId);
    if (!incident) throw new Error('INCIDENT_NOT_FOUND');

    if (!isValidIncidentTransition(incident.status, 'ESCALATED')) {
      throw new Error('INVALID_INCIDENT_TRANSITION');
    }

    const clientOperationId = input.clientOperationId ?? generateClientOperationId('escalate');
    const updated = await emergencySafetyRepository.escalateIncident(incidentId, {
      ...input,
      clientOperationId,
    });

    await this.addTimelineEvent(incidentId, {
      eventType: 'INCIDENT_ESCALATED' as EmergencyTimelineEventType,
      note: input.note,
      source: 'FACILITY_CONSOLE',
    });

    return updated;
  }

  async markUnderControl(
    incidentId: string,
    input: { note?: string; clientOperationId?: string }
  ): Promise<EmergencyIncident> {
    const incident = await emergencySafetyRepository.getActiveEmergencyDetail(incidentId);
    if (!incident) throw new Error('INCIDENT_NOT_FOUND');

    if (!isValidIncidentTransition(incident.status, 'UNDER_CONTROL')) {
      throw new Error('INVALID_INCIDENT_TRANSITION');
    }

    const clientOperationId = input.clientOperationId ?? generateClientOperationId('undercontrol');
    const updated = await emergencySafetyRepository.markResidentSafe(incidentId, {
      ...input,
      clientOperationId,
    });

    await this.addTimelineEvent(incidentId, {
      eventType: 'INCIDENT_UNDER_CONTROL' as EmergencyTimelineEventType,
      note: input.note || 'Incident marked under control',
      source: 'FACILITY_CONSOLE',
    });

    return updated;
  }

  async resolveIncident(
    incidentId: string,
    input: { closureSummary: string; clientOperationId?: string }
  ): Promise<EmergencyIncident> {
    const incident = await emergencySafetyRepository.getActiveEmergencyDetail(incidentId);
    if (!incident) throw new Error('INCIDENT_NOT_FOUND');

    if (!isValidIncidentTransition(incident.status, 'RESOLVED') && !isValidIncidentTransition(incident.status, 'CLOSED')) {
      throw new Error('INVALID_INCIDENT_TRANSITION');
    }

    const clientOperationId = input.clientOperationId ?? generateClientOperationId('resolve');
    const updated = await emergencySafetyRepository.closeIncident(incidentId, {
      ...input,
      clientOperationId,
    });

    await this.addTimelineEvent(incidentId, {
      eventType: 'INCIDENT_RESOLVED' as EmergencyTimelineEventType,
      note: input.closureSummary,
      source: 'FACILITY_CONSOLE',
    });

    return updated;
  }

  async closeIncident(
    incidentId: string,
    input: { closureSummary: string; clientOperationId?: string }
  ): Promise<EmergencyIncident> {
    const incident = await emergencySafetyRepository.getActiveEmergencyDetail(incidentId);
    if (!incident) throw new Error('INCIDENT_NOT_FOUND');

    if (!isValidIncidentTransition(incident.status, 'CLOSED')) {
      throw new Error('INVALID_INCIDENT_TRANSITION');
    }

    const clientOperationId = input.clientOperationId ?? generateClientOperationId('close');
    const updated = await emergencySafetyRepository.closeIncident(incidentId, {
      ...input,
      clientOperationId,
    });

    await this.addTimelineEvent(incidentId, {
      eventType: 'INCIDENT_CLOSED' as EmergencyTimelineEventType,
      note: input.closureSummary,
      source: 'FACILITY_CONSOLE',
    });

    return updated;
  }

  async cancelIncident(
    incidentId: string,
    input: { reason: string; clientOperationId?: string }
  ): Promise<EmergencyIncident> {
    const incident = await emergencySafetyRepository.getActiveEmergencyDetail(incidentId);
    if (!incident) throw new Error('INCIDENT_NOT_FOUND');

    if (!isValidIncidentTransition(incident.status, 'CANCELLED') && !isValidIncidentTransition(incident.status, 'FALSE_ALARM')) {
      throw new Error('INVALID_INCIDENT_TRANSITION');
    }

    const clientOperationId = input.clientOperationId ?? generateClientOperationId('cancel');
    const status = incident.status === 'CREATED' ? 'CANCELLED' : 'FALSE_ALARM';
    
    await this.addTimelineEvent(incidentId, {
      eventType: status === 'CANCELLED' ? 'FALSE_ALARM_CONFIRMED' : 'INCIDENT_CLOSED' as EmergencyTimelineEventType,
      note: `Incident ${status.toLowerCase()}: ${input.reason}`,
      source: 'RESIDENT_APP',
      clientOperationId,
    });

    const updated = await emergencySafetyRepository.closeIncident(incidentId, {
      closureSummary: `Cancelled/False Alarm: ${input.reason}`,
      clientOperationId,
    });

    return updated;
  }

  async addAffectedZone(
    incidentId: string,
    zone: Omit<AffectedZone, 'id' | 'incidentId' | 'affectedAt'>
  ): Promise<AffectedZone> {
    const newZone: AffectedZone = {
      ...zone,
      id: `zone-${generateClientOperationId('zone')}`,
      incidentId,
      affectedAt: new Date().toISOString(),
    };

    await this.addTimelineEvent(incidentId, {
      eventType: 'AREA_EVACUATION_STARTED' as EmergencyTimelineEventType,
      note: `Zone ${zone.zoneName} (${zone.zoneType}) marked as affected`,
      source: 'FACILITY_CONSOLE',
    });

    return newZone;
  }

  async updateZoneStatus(
    incidentId: string,
    zoneId: string,
    status: AffectedZone['status'],
    input: { note?: string }
  ): Promise<void> {
    await this.addTimelineEvent(incidentId, {
      eventType: status === 'EVACUATED' ? 'AREA_EVACUATION_STARTED' : 'RESIDENT_CHECKED_SAFE' as EmergencyTimelineEventType,
      note: `Zone ${zoneId} status updated to ${status}: ${input.note || ''}`,
      source: 'FACILITY_CONSOLE',
    });
  }

  async createTask(
    incidentId: string,
    task: Omit<EmergencyTask, 'id' | 'incidentId' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<EmergencyTask> {
    const newTask: EmergencyTask = {
      ...task,
      id: `task-${generateClientOperationId('task')}`,
      incidentId,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.addTimelineEvent(incidentId, {
      eventType: 'TASK_CREATED' as EmergencyTimelineEventType,
      note: `Task created: ${task.title}`,
      source: 'FACILITY_CONSOLE',
    });

    return newTask;
  }

  async updateTaskStatus(
    incidentId: string,
    taskId: string,
    status: EmergencyTask['status'],
    input: { note?: string; evidence?: string[] }
  ): Promise<void> {
    await this.addTimelineEvent(incidentId, {
      eventType: status === 'COMPLETED' ? 'TASK_COMPLETED' : 'TASK_CREATED' as EmergencyTimelineEventType,
      note: `Task ${taskId} status: ${status}: ${input.note || ''}`,
      source: 'FACILITY_CONSOLE',
    });
  }

  async publishInstruction(
    incidentId: string,
    instruction: Omit<EmergencyInstruction, 'id' | 'incidentId' | 'version' | 'publishedAt' | 'publishedBy' | 'supersededAt'>
  ): Promise<EmergencyInstruction> {
    const existingInstructions = await this.getInstructions(incidentId);
    const version = existingInstructions.length + 1;

    const newInstruction: EmergencyInstruction = {
      ...instruction,
      id: `instr-${generateClientOperationId('instr')}`,
      incidentId,
      version,
      publishedAt: new Date().toISOString(),
      publishedBy: 'FACILITY_CONSOLE',
    };

    if (version > 1) {
      const previous = existingInstructions[existingInstructions.length - 1];
      if (previous) {
        previous.supersededAt = new Date().toISOString();
      }
    }

    await this.addTimelineEvent(incidentId, {
      eventType: 'BROADCAST_PUBLISHED' as EmergencyTimelineEventType,
      note: `Emergency instruction v${version} published: ${instruction.content}`,
      source: 'FACILITY_CONSOLE',
    });

    return newInstruction;
  }

  async getInstructions(incidentId: string): Promise<EmergencyInstruction[]> {
    return [];
  }

  async startEvacuation(
    incidentId: string,
    session: Omit<EvacuationSession, 'id' | 'incidentId' | 'startedAt' | 'checkInStatus' | 'instructions'>
  ): Promise<EvacuationSession> {
    const newSession: EvacuationSession = {
      ...session,
      id: `evac-${generateClientOperationId('evac')}`,
      incidentId,
      startedAt: new Date().toISOString(),
      checkInStatus: {},
      instructions: [],
    };

    await this.addTimelineEvent(incidentId, {
      eventType: 'AREA_EVACUATION_STARTED' as EmergencyTimelineEventType,
      note: `Evacuation started for ${session.affectedZones.join(', ')}`,
      source: 'FACILITY_CONSOLE',
    });

    return newSession;
  }

  async submitSafetyCheckIn(
    evacuationSessionId: string,
    incidentId: string,
    checkIn: Omit<SafetyCheckIn, 'id' | 'evacuationSessionId' | 'incidentId' | 'checkedAt'>
  ): Promise<SafetyCheckIn> {
    const newCheckIn: SafetyCheckIn = {
      ...checkIn,
      id: `checkin-${generateClientCheckInId()}`,
      evacuationSessionId,
      incidentId,
      checkedAt: new Date().toISOString(),
    };

    await this.addTimelineEvent(incidentId, {
      eventType: 'RESIDENT_CHECKED_SAFE' as EmergencyTimelineEventType,
      note: `Resident ${checkIn.flatNumber} ${checkIn.tower} checked in as ${checkIn.status}`,
      source: 'RESIDENT_APP',
    });

    return newCheckIn;
  }

  async createEmergencyBroadcast(
    incidentId: string,
    input: {
      broadcastType: EmergencyBroadcastType;
      message: string;
      severity: 'INFO' | 'WARNING' | 'CRITICAL';
      targetAudience: string;
      affectedArea?: string;
      clientOperationId?: string;
    }
  ): Promise<void> {
    const clientOperationId = input.clientOperationId ?? generateClientOperationId('bcast');
    
    await emergencySafetyRepository.createEmergencyBroadcast({
      broadcastType: input.broadcastType,
      message: input.message,
      severity: input.severity,
      targetAudience: input.targetAudience,
      affectedArea: input.affectedArea ?? undefined,
      clientOperationId: clientOperationId,
    } as CreateBroadcastInput & { clientOperationId?: string });

    await this.addTimelineEvent(incidentId, {
      eventType: 'BROADCAST_PUBLISHED' as EmergencyTimelineEventType,
      note: `Emergency broadcast sent: ${input.message.substring(0, 100)}...`,
      source: 'FACILITY_CONSOLE',
    });
  }

  async addTimelineEvent(
    incidentId: string,
    input: {
      eventType: EmergencyTimelineEventType;
      note?: string;
      source: EmergencyTimelineEvent['source'];
      clientOperationId?: string;
    }
  ): Promise<EmergencyTimelineEvent> {
    const clientOperationId = input.clientOperationId ?? generateClientOperationId('timeline');
    return emergencySafetyRepository.addEmergencyTimelineEvent(incidentId, {
      eventType: input.eventType,
      note: input.note ?? undefined,
      source: input.source,
      clientOperationId,
    } as { eventType: EmergencyTimelineEventType; note?: string; source: EmergencyTimelineEvent['source']; clientOperationId?: string });
  }

  async getTimeline(incidentId: string): Promise<EmergencyTimelineEvent[]> {
    return emergencySafetyRepository.getEmergencyTimeline(incidentId);
  }
}

export const emergencyService = EmergencyService.getInstance();
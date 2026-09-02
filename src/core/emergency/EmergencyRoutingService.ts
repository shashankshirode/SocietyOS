import AsyncStorage from '@react-native-async-storage/async-storage';
import { domainEventBus } from '../events/DomainEventBus';
import type { ActiveContext } from '../identity/identity.types';
import { MOCK_PERSONAS } from '../identity/personaRegistry';

export type EmergencyCategory = 'GENERIC_SOS' | 'MEDICAL' | 'FIRE' | 'SECURITY' | 'LIFT' | 'CARE';

export type IncidentStatus = 'TRIGGERED' | 'DISPATCHED' | 'ACKNOWLEDGED' | 'RESPONDING' | 'RESOLVED' | 'FALSE_ALARM';

export interface ResponderGroup {
  readonly groupId: string;
  readonly groupName: string;
  readonly isMandatory: boolean;
  readonly memberUserIds: readonly string[];
}

export interface SocietyEmergencyPolicy {
  readonly societyId: string;
  readonly responderGroups: readonly ResponderGroup[];
  readonly escalationThresholdSeconds: number;
}

export interface HouseholdEmergencyContact {
  readonly id: string;
  readonly name: string;
  readonly relationship: string;
  readonly phone: string;
  readonly userId?: string | undefined;
  readonly isNotifyImmediate: boolean;
}

export interface HouseholdEmergencyPolicy {
  readonly unitId: string;
  readonly additionalContacts: readonly HouseholdEmergencyContact[];
  readonly updatedAtIso: string;
}

export interface EmergencyIncident {
  readonly id: string;
  readonly category: EmergencyCategory;
  readonly societyId: string;
  readonly unitId: string;
  readonly unitNumber: string;
  readonly actor: {
    readonly userId: string;
    readonly displayName: string;
    readonly role: string;
  };
  readonly status: IncidentStatus;
  readonly routingSnapshot: {
    readonly societyGroups: readonly string[];
    readonly resolvedRecipients: readonly string[];
  };
  readonly acknowledgedBy?: {
    readonly userId: string;
    readonly displayName: string;
    readonly role: string;
    readonly acknowledgedAtIso: string;
  } | undefined;
  readonly createdAtIso: string;
  readonly updatedAtIso: string;
  readonly locationNotes?: string | undefined;
}

const DEFAULT_SOCIETY_EMERGENCY_POLICY: SocietyEmergencyPolicy = {
  societyId: 'soc-palm-grove-01',
  responderGroups: [
    {
      groupId: 'MAIN_GATE_SECURITY',
      groupName: 'Main Gate Security',
      isMandatory: true,
      memberUserIds: [MOCK_PERSONAS.vikram.user.id],
    },
    {
      groupId: 'SOCIETY_EMERGENCY_PRIMARY',
      groupName: 'Society Emergency Primary',
      isMandatory: true,
      memberUserIds: [MOCK_PERSONAS.rajesh.user.id, MOCK_PERSONAS.suresh.user.id],
    },
    {
      groupId: 'SOCIETY_EMERGENCY_SECONDARY',
      groupName: 'Society Emergency Secondary',
      isMandatory: false,
      memberUserIds: [MOCK_PERSONAS.meera.user.id],
    },
  ],
  escalationThresholdSeconds: 120,
};

const HOUSEHOLD_POLICY_PREFIX = 'societyos.household_sos_policy.';
const SOCIETY_POLICY_KEY = 'societyos.society_sos_policy';

class EmergencyRoutingService {
  private activeIncidents: Map<string, EmergencyIncident> = new Map();

  public async getSocietyEmergencyPolicy(): Promise<SocietyEmergencyPolicy> {
    try {
      const raw = await AsyncStorage.getItem(SOCIETY_POLICY_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return DEFAULT_SOCIETY_EMERGENCY_POLICY;
  }

  public async updateSocietyEmergencyPolicy(policy: SocietyEmergencyPolicy): Promise<void> {
    await AsyncStorage.setItem(SOCIETY_POLICY_KEY, JSON.stringify(policy));
  }

  public async getHouseholdEmergencyPolicy(unitId: string): Promise<HouseholdEmergencyPolicy> {
    try {
      const raw = await AsyncStorage.getItem(`${HOUSEHOLD_POLICY_PREFIX}${unitId}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      unitId,
      additionalContacts: [
        {
          id: 'contact-rohan',
          name: 'Rohan Sharma',
          relationship: 'Primary Owner',
          phone: '+919876543210',
          userId: MOCK_PERSONAS.rohan.user.id,
          isNotifyImmediate: true,
        },
        {
          id: 'contact-sunita',
          name: 'Sunita Sharma',
          relationship: 'Family Member',
          phone: '+919876543211',
          userId: MOCK_PERSONAS.sunita.user.id,
          isNotifyImmediate: true,
        },
      ],
      updatedAtIso: new Date().toISOString(),
    };
  }

  public async updateHouseholdEmergencyPolicy(
    unitId: string,
    contacts: readonly HouseholdEmergencyContact[]
  ): Promise<HouseholdEmergencyPolicy> {
    const policy: HouseholdEmergencyPolicy = {
      unitId,
      additionalContacts: contacts,
      updatedAtIso: new Date().toISOString(),
    };
    await AsyncStorage.setItem(`${HOUSEHOLD_POLICY_PREFIX}${unitId}`, JSON.stringify(policy));
    return policy;
  }

  public async triggerEmergency(
    actorContext: ActiveContext,
    category: EmergencyCategory = 'GENERIC_SOS',
    locationNotes?: string
  ): Promise<EmergencyIncident> {
    const societyPolicy = await this.getSocietyEmergencyPolicy();
    const unitId = actorContext.unitRelationship?.unitId ?? 'unit-b804';
    const unitNumber = actorContext.unitRelationship?.unitNumber ?? 'B-804';
    const householdPolicy = await this.getHouseholdEmergencyPolicy(unitId);

    // Guaranteed society responder resolution
    const mandatoryGroupNames = societyPolicy.responderGroups
      .filter((g) => g.isMandatory)
      .map((g) => g.groupName);

    const societyUserIds = societyPolicy.responderGroups
      .filter((g) => g.isMandatory)
      .flatMap((g) => g.memberUserIds);

    const householdUserIds = householdPolicy.additionalContacts
      .filter((c) => c.userId && c.userId !== actorContext.user.id)
      .map((c) => c.userId!);

    const resolvedRecipients = Array.from(new Set([...societyUserIds, ...householdUserIds]));

    const incident: EmergencyIncident = {
      id: `sos-${Date.now()}`,
      category,
      societyId: actorContext.membership.societyId,
      unitId,
      unitNumber,
      actor: {
        userId: actorContext.user.id,
        displayName: actorContext.person.preferredName ?? `${actorContext.person.firstName} ${actorContext.person.lastName}`,
        role: actorContext.activeRole,
      },
      status: 'TRIGGERED',
      routingSnapshot: {
        societyGroups: mandatoryGroupNames,
        resolvedRecipients,
      },
      createdAtIso: new Date().toISOString(),
      updatedAtIso: new Date().toISOString(),
      locationNotes,
    };

    this.activeIncidents.set(incident.id, incident);

    // Emit Domain Event for downstream notifications & Guard Work Queue
    await domainEventBus.emit({
      eventId: `evt-sos-${incident.id}`,
      eventType: 'emergency.sos.triggered',
      societyId: incident.societyId,
      unitId: incident.unitId,
      actor: {
        userId: incident.actor.userId,
        personId: actorContext.person.id,
        displayName: incident.actor.displayName,
        role: incident.actor.role,
        unitRelationshipId: actorContext.unitRelationship?.id,
      },
      subject: {
        entityType: 'EmergencyIncident',
        entityId: incident.id,
      },
      severity: 'CRITICAL',
      createdAtIso: incident.createdAtIso,
      correlationId: `corr-${incident.id}`,
      payload: {
        incidentId: incident.id,
        category: incident.category,
        unitNumber: incident.unitNumber,
        routingSnapshot: incident.routingSnapshot,
      },
    });

    return incident;
  }

  public async acknowledgeEmergency(
    responderContext: ActiveContext,
    incidentId: string,
    notes?: string
  ): Promise<EmergencyIncident | null> {
    const existing = this.activeIncidents.get(incidentId);
    if (!existing) return null;

    const responderName = responderContext.person.preferredName ?? `${responderContext.person.firstName} ${responderContext.person.lastName}`;

    const updated: EmergencyIncident = {
      ...existing,
      status: 'ACKNOWLEDGED',
      acknowledgedBy: {
        userId: responderContext.user.id,
        displayName: responderName,
        role: responderContext.activeRole,
        acknowledgedAtIso: new Date().toISOString(),
      },
      updatedAtIso: new Date().toISOString(),
      locationNotes: notes ?? existing.locationNotes,
    };

    this.activeIncidents.set(incidentId, updated);

    await domainEventBus.emit({
      eventId: `evt-sos-ack-${incidentId}`,
      eventType: 'emergency.sos.acknowledged',
      societyId: updated.societyId,
      unitId: updated.unitId,
      actor: {
        userId: responderContext.user.id,
        personId: responderContext.person.id,
        displayName: responderName,
        role: responderContext.activeRole,
      },
      subject: {
        entityType: 'EmergencyIncident',
        entityId: incidentId,
      },
      severity: 'ACTION_REQUIRED',
      createdAtIso: new Date().toISOString(),
      correlationId: `corr-${incidentId}`,
      payload: {
        incidentId,
        acknowledgedBy: updated.acknowledgedBy,
      },
    });

    return updated;
  }

  public getActiveIncidents(): readonly EmergencyIncident[] {
    return Array.from(this.activeIncidents.values());
  }

  public getIncidentById(id: string): EmergencyIncident | undefined {
    return this.activeIncidents.get(id);
  }

  public clear(): void {
    this.activeIncidents.clear();
  }
}

export const emergencyRoutingService = new EmergencyRoutingService();

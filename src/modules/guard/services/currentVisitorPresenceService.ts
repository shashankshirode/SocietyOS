import type {
  GateEvent,
  GateEventType,
  Visitor,
  VisitorStatus,
  VisitorType,
  CurrentVisitorPresence,
  CurrentVisitorPresenceSummary,
} from '../../../shared/types/visitorPhase8.types';
import { visitorStateMachine } from './visitorStateMachine';

export interface VisitorPresenceOptions {
  includeOverdue?: boolean;
  includeExtended?: boolean;
  includeEscalated?: boolean;
  gateFilter?: string;
  visitorTypeFilter?: VisitorType;
}

function computeDurationMinutes(entryAtIso: string): number {
  if (!entryAtIso) return 0;
  return Math.floor((Date.now() - new Date(entryAtIso).getTime()) / 60000);
}

function isOverdue(expectedExitAtIso?: string): boolean {
  if (!expectedExitAtIso) return false;
  return new Date(expectedExitAtIso) < new Date();
}

function isExtended(visitor: Visitor): boolean {
  return visitor.exitTracking?.exitStatus === 'extended';
}

export const currentVisitorPresenceService = {
  derivePresence(
    visitors: Visitor[],
    gateEvents: GateEvent[],
    options: VisitorPresenceOptions = {}
  ): CurrentVisitorPresence[] {
    const now = new Date();
    const checkInEvents = new Map<string, GateEvent>();
    const checkOutEvents = new Map<string, GateEvent>();

    for (const event of gateEvents) {
      if (['CHECK_IN', 'WALK_IN_REGISTRATION', 'EMERGENCY_BYPASS'].includes(event.eventType)) {
        const existing = checkInEvents.get(event.visitorId || '');
        if (!existing || new Date(event.eventTimestamp) > new Date(existing.eventTimestamp)) {
          checkInEvents.set(event.visitorId || '', event);
        }
      }
      if (event.eventType === 'CHECK_OUT') {
        const existing = checkOutEvents.get(event.visitorId || '');
        if (!existing || new Date(event.eventTimestamp) > new Date(existing.eventTimestamp)) {
          checkOutEvents.set(event.visitorId || '', event);
        }
      }
    }

    const presence: CurrentVisitorPresence[] = [];

    for (const visitor of visitors) {
      const checkIn = checkInEvents.get(visitor.id);
      const checkOut = checkOutEvents.get(visitor.id);

      const hasValidCheckIn = checkIn && (!checkOut || new Date(checkIn.eventTimestamp) > new Date(checkOut.eventTimestamp));
      const status = visitor.status as VisitorStatus;
      const isInside = visitorStateMachine.isVisitorCurrentlyInside(status);

      if (hasValidCheckIn && isInside) {
        const entryAtIso = checkIn.eventTimestamp;
        const expectedExitAtIso = visitor.expectedExitAtIso;
        const actualExitAtIso = visitor.actualExitAtIso;
        const overdue = isOverdue(expectedExitAtIso);
        const extended = isExtended(visitor);

        if (options.gateFilter && checkIn.gateId !== options.gateFilter) continue;
        if (options.visitorTypeFilter && visitor.type !== options.visitorTypeFilter) continue;
        if (!options.includeOverdue && overdue) continue;
        if (!options.includeExtended && extended) continue;
        if (!options.includeEscalated && visitor.escalationStatus && visitor.escalationStatus !== 'NOT_ESCALATED') continue;

        presence.push({
          visitorId: visitor.id,
          visitorName: visitor.name,
          visitorPhone: visitor.phone,
          visitorType: visitor.type,
          unitNumber: visitor.flatNumber,
          unitId: visitor.unitId || '',
          entryAtIso,
          entryGateId: checkIn.gateId,
          entryGateName: checkIn.gateName,
          entrySource: checkIn.entrySource,
          approvalSource: checkIn.approvalSource || 'PRE_APPROVED',
          expectedExitAtIso,
          actualExitAtIso,
          vehicleRegistration: visitor.vehicleNumber,
          vehicleType: visitor.vehicleNumber ? 'CAR' : undefined,
          isInside: true,
          durationMinutes: computeDurationMinutes(entryAtIso),
          isOverdue: overdue,
          isExtended: extended,
          escalationStatus: visitor.escalationStatus,
          lastMovementAtIso: entryAtIso,
        });
      }
    }

    return presence.sort((a, b) => new Date(a.entryAtIso).getTime() - new Date(b.entryAtIso).getTime());
  },

  getSummary(presence: CurrentVisitorPresence[]): CurrentVisitorPresenceSummary {
    const summary: CurrentVisitorPresenceSummary = {
      totalInside: presence.length,
      byType: {} as Record<VisitorType, number>,
      overdueCount: 0,
      extendedCount: 0,
      escalatedCount: 0,
      lastUpdatedAtIso: new Date().toISOString(),
    };

    for (const p of presence) {
      summary.byType[p.visitorType] = (summary.byType[p.visitorType] || 0) + 1;
      if (p.isOverdue) summary.overdueCount++;
      if (p.isExtended) summary.extendedCount++;
      if (p.escalationStatus && p.escalationStatus !== 'NOT_ESCALATED') summary.escalatedCount++;
    }

    return summary;
  },

  getVisitorPresence(
    visitorId: string,
    visitors: Visitor[],
    gateEvents: GateEvent[]
  ): CurrentVisitorPresence | null {
    const presence = this.derivePresence(visitors, gateEvents);
    return presence.find((p) => p.visitorId === visitorId) || null;
  },

  getPresenceByUnit(
    unitId: string,
    visitors: Visitor[],
    gateEvents: GateEvent[]
  ): CurrentVisitorPresence[] {
    const presence = this.derivePresence(visitors, gateEvents);
    return presence.filter((p) => p.unitId === unitId);
  },

  getPresenceByGate(
    gateId: string,
    visitors: Visitor[],
    gateEvents: GateEvent[]
  ): CurrentVisitorPresence[] {
    const presence = this.derivePresence(visitors, gateEvents);
    return presence.filter((p) => p.entryGateId === gateId);
  },

  validatePresenceConsistency(
    visitors: Visitor[],
    gateEvents: GateEvent[]
  ): { consistent: boolean; issues: string[] } {
    const issues: string[] = [];
    const presence = this.derivePresence(visitors, gateEvents);

    for (const visitor of visitors) {
      const status = visitor.status as VisitorStatus;
      const isInsideByStatus = visitorStateMachine.isVisitorCurrentlyInside(status);
      const presenceRecord = presence.find((p) => p.visitorId === visitor.id);
      const isInsideByEvents = !!presenceRecord;

      if (isInsideByStatus !== isInsideByEvents) {
        issues.push(
          `Visitor ${visitor.id} (${visitor.name}): status=${status} implies ${isInsideByStatus ? 'inside' : 'outside'}, but events imply ${isInsideByEvents ? 'inside' : 'outside'}`
        );
      }

      if (isInsideByEvents && presenceRecord) {
        const checkInEvents = gateEvents.filter(
          (e) => e.visitorId === visitor.id && ['CHECK_IN', 'WALK_IN_REGISTRATION', 'EMERGENCY_BYPASS'].includes(e.eventType)
        );
        const checkOutEvents = gateEvents.filter((e) => e.visitorId === visitor.id && e.eventType === 'CHECK_OUT');

        if (checkInEvents.length !== checkOutEvents.length + 1) {
          issues.push(
            `Visitor ${visitor.id}: check-in count (${checkInEvents.length}) != check-out count (${checkOutEvents.length}) + 1`
          );
        }
      }
    }

    return { consistent: issues.length === 0, issues };
  },
};

export default currentVisitorPresenceService;
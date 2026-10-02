import type {
  Complaint,
  SlaPolicy,
  SlaPausePolicy,
  SlaPauseReason,
  HoldReason,
  EscalationLevel,
  EscalationReason,
  EscalationPolicy,
  EscalationLevelConfig,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintSlaMetrics,
} from '../../../shared/types/complaintPhase6';
import { mockStore } from '../../../core/mockStore/mockStore';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';

export interface SlaSnapshot {
  complaintId: string;
  createdAt: string;
  responseDeadline?: string;
  resolutionDeadline?: string;
  acknowledgementDeadline?: string;
  firstResponseAt?: string;
  acknowledgedAt?: string;
  workStartedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  totalPauseDurationMs: number;
  holdEvents: { reason: HoldReason; startAt: string; endAt?: string; durationMs?: number }[];
  escalationEvents: { level: EscalationLevel; at: string }[];
  isBreached: boolean;
  breachedAt?: string;
  breachType?: 'RESPONSE' | 'RESOLUTION' | 'ACKNOWLEDGEMENT';
  compliancePercent: number;
  slaPolicyVersion: number;
}

export interface SlaCalculationResult {
  responseDeadline?: string;
  resolutionDeadline?: string;
  acknowledgementDeadline?: string;
}

export interface SlaBreachResult {
  isBreached: boolean;
  breachType?: 'RESPONSE' | 'RESOLUTION' | 'ACKNOWLEDGEMENT';
  breachedAt?: string;
}

export interface SlaPauseResult {
  paused: boolean;
  pausePolicy: SlaPausePolicy;
  reason: SlaPauseReason;
  pausedAt: string;
  startedBy: string;
}

export interface SlaResumeResult {
  resumed: boolean;
  resumedAt: string;
  totalPauseDurationMs: number;
}

export interface EscalationCheckResult {
  shouldEscalate: boolean;
  newLevel?: EscalationLevel;
  reason?: EscalationReason;
  escalatedAt?: string;
}

const MS_PER_HOUR = 60 * 60 * 1000;

export class SlaEngine {
  private static instance: SlaEngine;

  static getInstance(): SlaEngine {
    if (!SlaEngine.instance) {
      SlaEngine.instance = new SlaEngine();
    }
    return SlaEngine.instance;
  }

  private constructor() {}

  async calculateSlaDeadlines(
    complaint: Complaint,
    slaPolicy: SlaPolicy,
    createdAt: string = new Date().toISOString()
  ): Promise<SlaCalculationResult> {
    const baseTime = new Date(createdAt).getTime();
    const businessHoursOnly = slaPolicy.businessHoursOnly;
    const calendarId = slaPolicy.calendarId;

    const responseHours = slaPolicy.responseTimeHours ?? 4;
    const resolutionHours = slaPolicy.resolutionTimeHours ?? 24;
    const ackHours = slaPolicy.acknowledgementTimeHours ?? 2;

    const responseDeadline = this.addBusinessHours(
      baseTime,
      responseHours,
      businessHoursOnly,
      calendarId
    );
    const resolutionDeadline = this.addBusinessHours(
      baseTime,
      resolutionHours,
      businessHoursOnly,
      calendarId
    );
    const acknowledgementDeadline = this.addBusinessHours(
      baseTime,
      ackHours,
      businessHoursOnly,
      calendarId
    );

    return {
      responseDeadline: responseDeadline.toISOString(),
      resolutionDeadline: resolutionDeadline.toISOString(),
      acknowledgementDeadline: acknowledgementDeadline.toISOString(),
    };
  }

  private addBusinessHours(
    startTime: number,
    hours: number,
    businessHoursOnly: boolean,
    calendarId?: string
  ): Date {
    if (!businessHoursOnly) {
      return new Date(startTime + hours * MS_PER_HOUR);
    }

    const calendar = calendarId
      ? mockStore.getState().calendars?.find((c: any) => c.id === calendarId)
      : null;

    const businessHours = calendar?.businessHours || {
      monday: { start: 9, end: 18 },
      tuesday: { start: 9, end: 18 },
      wednesday: { start: 9, end: 18 },
      thursday: { start: 9, end: 18 },
      friday: { start: 9, end: 18 },
      saturday: { start: 10, end: 14 },
      sunday: { start: 10, end: 14 },
    };

    const holidays = calendar?.holidays || [];
    const timezone = calendar?.timezone || 'Asia/Kolkata';

    let currentTime = startTime;
    let remainingMs = hours * MS_PER_HOUR;

    while (remainingMs > 0) {
      const date = new Date(currentTime);
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'lowercase', timeZone: timezone });
      const dayHours = businessHours[dayOfWeek];

      if (!dayHours || isHoliday(date, holidays)) {
        currentTime = getNextBusinessDayStart(date, businessHours, holidays, timezone);
        continue;
      }

      const dayStart = new Date(date);
      dayStart.setHours(dayHours.start, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(dayHours.end, 0, 0, 0);

      if (currentTime < dayStart.getTime()) {
        currentTime = dayStart.getTime();
      }

      const availableMs = dayEnd.getTime() - currentTime;
      if (availableMs <= 0) {
        currentTime = getNextBusinessDayStart(date, businessHours, holidays, timezone);
        continue;
      }

      if (remainingMs <= availableMs) {
        currentTime += remainingMs;
        remainingMs = 0;
      } else {
        currentTime = dayEnd.getTime();
        remainingMs -= availableMs;
        currentTime = getNextBusinessDayStart(new Date(currentTime), businessHours, holidays, timezone);
      }
    }

    return new Date(currentTime);
  }

  async pauseSla(
    complaint: Complaint,
    reason: SlaPauseReason,
    startedBy: string,
    policy: SlaPausePolicy = 'FULL_PAUSE'
  ): Promise<SlaPauseResult> {
    if (complaint.slaIsPaused) {
      return { paused: false, pausePolicy: policy, reason, pausedAt: '', startedBy: '' };
    }

    const now = new Date().toISOString();
    const pauseDuration = complaint.totalPauseDurationMs || 0;

    mockStore.updateComplaint(complaint.id, {
      slaIsPaused: true,
      slaPausePolicy: policy,
      slaPausedAt: now,
      slaPauseReason: reason,
      slaPauseStartedBy: startedBy,
      updatedAt: now,
    });

    await createAuditEntry({
      actorUserId: startedBy,
      actorType: 'ADMIN',
      societyId: complaint.societyId,
      action: 'SLA_PAUSED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: { slaIsPaused: false },
      newState: { slaIsPaused: true, pauseReason: reason, pausePolicy: policy },
      idempotencyKey: createIdempotencyKey(`sla-pause-${complaint.id}`),
      source: 'MOBILE',
      outcome: 'SUCCESS',
    });

    return { paused: true, pausePolicy: policy, reason, pausedAt: now, startedBy };
  }

  async resumeSla(complaint: Complaint, resumedBy: string): Promise<SlaResumeResult> {
    if (!complaint.slaIsPaused || !complaint.slaPausedAt) {
      return { resumed: false, resumedAt: '', totalPauseDurationMs: 0 };
    }

    const now = new Date().toISOString();
    const pauseDurationMs = new Date(now).getTime() - new Date(complaint.slaPausedAt).getTime();
    const totalPauseDurationMs = (complaint.totalPauseDurationMs || 0) + pauseDurationMs;

    const nowDate = new Date(now);
    const pauseStart = new Date(complaint.slaPausedAt);

    mockStore.updateComplaint(complaint.id, {
      slaIsPaused: false,
      slaPausePolicy: undefined,
      slaPausedAt: undefined,
      slaPauseReason: undefined,
      slaPauseStartedBy: undefined,
      totalPauseDurationMs,
      updatedAt: now,
    });

    await createAuditEntry({
      actorUserId: 'SYSTEM',
      actorType: 'SYSTEM',
      societyId: complaint.societyId,
      action: 'SLA_RESUMED',
      entityType: 'Complaint',
      entityId: complaint.id,
      previousState: { slaIsPaused: true },
      newState: { slaIsPaused: false, totalPauseDurationMs },
      idempotencyKey: createIdempotencyKey(`sla-resume-${complaint.id}`),
      source: 'SYSTEM',
      outcome: 'SUCCESS',
    });

    return { resumed: true, resumedAt: now, totalPauseDurationMs };
  }

  async checkSlaBreach(complaint: Complaint): Promise<SlaBreachResult> {
    if (!complaint.slaResolutionDeadline && !complaint.slaResponseDeadline && !complaint.slaAcknowledgementDeadline) {
      return { isBreached: false };
    }

    const now = new Date().getTime();

    if (complaint.slaAcknowledgementDeadline) {
      const ackDeadline = new Date(complaint.slaAcknowledgementDeadline).getTime();
      if (now > ackDeadline && !complaint.acknowledgedAt) {
        return { isBreached: true, breachType: 'ACKNOWLEDGEMENT', breachedAt: new Date().toISOString() };
      }
    }

    if (complaint.slaResponseDeadline) {
      const responseDeadline = new Date(complaint.slaResponseDeadline).getTime();
      if (now > responseDeadline && !complaint.workStartedAt && !complaint.firstResponseAt) {
        return { isBreached: true, breachType: 'RESPONSE', breachedAt: new Date().toISOString() };
      }
    }

    if (complaint.slaResolutionDeadline) {
      const resolutionDeadline = new Date(complaint.slaResolutionDeadline).getTime();
      if (now > resolutionDeadline && !complaint.resolvedAt) {
        return { isBreached: true, breachType: 'RESOLUTION', breachedAt: new Date().toISOString() };
      }
    }

    return { isBreached: false };
  }

  async checkEscalation(
    complaint: Complaint,
    escalationPolicy: EscalationPolicy
  ): Promise<EscalationCheckResult> {
    const now = new Date().getTime();
    const createdAt = new Date(complaint.createdAt).getTime();
    const elapsedHours = (now - createdAt) / MS_PER_HOUR;

    for (const levelConfig of escalationPolicy.levels) {
      if (elapsedHours >= levelConfig.triggerAfterHours) {
        if (complaint.escalationLevel === levelConfig.level) {
          continue;
        }
        return {
          shouldEscalate: true,
          newLevel: levelConfig.level,
          reason: 'SLA_BREACH',
          escalatedAt: new Date().toISOString(),
        };
      }
    }

    return { shouldEscalate: false };
  }

  async processHold(
    complaint: Complaint,
    holdReason: HoldReason,
    notes: string,
    expectedResumeAt?: string,
    startedBy: string
  ): Promise<SlaPauseResult> {
    const now = new Date().toISOString();

    const pausePolicy = this.getSlaPausePolicyForHoldReason(holdReason);

    const holdRecord = {
      id: `hold_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      complaintId: complaint.id,
      reason: holdReason,
      notes,
      startedAt: new Date().toISOString(),
      expectedResumeAt,
      startedBy: startedBy,
      isActive: true,
    };

    mockStore.getState().complaintHolds?.push(holdRecord);

    return this.pauseSla(complaint, this.mapHoldReasonToSlaPauseReason(holdReason), startedBy, 'FULL_PAUSE');
  }

  async pauseSlaForHoldReason(
    complaint: Complaint,
    holdReason: HoldReason,
    startedBy: string
  ): Promise<SlaPauseResult> {
    const pausePolicy = this.getSlaPausePolicyForHoldReason(holdReason);
    return this.pauseSla(complaint, this.mapHoldReasonToSlaPauseReason(holdReason), startedBy, pausePolicy);
  }

  async resumeFromHold(
    complaint: Complaint,
    resumedBy: string
  ): Promise<SlaResumeResult> {
    const holds = mockStore.getState().complaintHolds?.filter(h => h.complaintId === complaint.id && h.isActive) || [];

    for (const hold of holds) {
      hold.isActive = false;
      hold.resumedAt = new Date().toISOString();
      hold.resumedByUserId = resumedBy;
      hold.resumedByDisplayName = 'Resumed by';
    }

    return this.resumeSla(complaint, resumedBy);
  }

  private getSlaPausePolicyForHoldReason(reason: HoldReason): SlaPausePolicy {
    switch (reason) {
      case 'SPARE_PART_REQUIRED':
      case 'VENDOR_REQUIRED':
      case 'EXTERNAL_DEPENDENCY':
        return 'FULL_PAUSE';
      case 'RESIDENT_UNAVAILABLE':
      case 'SOCIETY_APPROVAL_REQUIRED':
      case 'WEATHER_DELAY':
      case 'SAFETY_CONCERN':
        return 'PARTIAL_PAUSE';
      default:
        return 'FULL_PAUSE';
    }
  }

  private mapHoldReasonToSlaPauseReason(reason: HoldReason): SlaPauseReason {
    switch (reason) {
      case 'SPARE_PART_REQUIRED':
        return 'WAITING_FOR_PART';
      case 'VENDOR_REQUIRED':
        return 'WAITING_FOR_VENDOR';
      case 'RESIDENT_UNAVAILABLE':
        return 'WAITING_FOR_RESIDENT';
      case 'EXTERNAL_DEPENDENCY':
        return 'WAITING_FOR_VENDOR';
      case 'SOCIETY_APPROVAL_REQUIRED':
        return 'WAITING_FOR_APPROVAL';
      case 'ANOTHER_OPERATIONAL_REASON':
        return 'WAITING_FOR_OTHER';
      case 'WEATHER_DELAY':
        return 'WAITING_FOR_WEATHER';
      case 'SAFETY_CONCERN':
        return 'HOLD_SAFETY_CONCERN';
      default:
        return 'WAITING_FOR_OTHER';
    }
  }

  async calculateSlaMetrics(complaint: Complaint): Promise<ComplaintSlaMetrics> {
    const createdAt = new Date(complaint.createdAt).getTime();
    const now = new Date().getTime();

    const responseDeadline = complaint.slaResponseDeadline ? new Date(complaint.slaResponseDeadline).getTime() : undefined;
    const resolutionDeadline = complaint.slaResolutionDeadline ? new Date(complaint.slaResolutionDeadline).getTime() : undefined;
    const acknowledgementDeadline = complaint.slaAcknowledgementDeadline ? new Date(complaint.slaAcknowledgementDeadline).getTime() : undefined;

    const breachResult = await this.checkSlaBreach(complaint);

    const holdEvents = mockStore.getState().complaintHolds
      ?.filter(h => h.complaintId === complaint.id)
      .map(h => ({
        reason: h.reason,
        startAt: h.startedAt,
        endAt: h.resumedAt,
        durationMs: h.resumedAt ? new Date(h.resumedAt).getTime() - new Date(h.startedAt).getTime() : undefined,
      })) || [];

    const escalationEvents = mockStore.getState().complaintEscalations
      ?.filter(e => e.complaintId === complaint.id)
      .map(e => ({ level: e.toLevel, at: e.triggeredAt })) || [];

    const totalPauseDurationMs = complaint.totalPauseDurationMs || 0;

    return {
      complaintId: complaint.id,
      createdAt: complaint.createdAt,
      responseDeadline: complaint.slaResponseDeadline,
      resolutionDeadline: complaint.slaResolutionDeadline,
      acknowledgementDeadline: complaint.slaAcknowledgementDeadline,
      firstResponseAt: complaint.firstResponseAt,
      acknowledgedAt: complaint.acknowledgedAt,
      workStartedAt: complaint.workStartedAt,
      resolvedAt: complaint.resolvedAt,
      closedAt: complaint.closedAt,
      totalPauseDurationMs,
      holdEvents,
      escalationEvents,
      isBreached: breachResult.isBreached,
      breachedAt: breachResult.breachedAt,
      breachType: breachResult.breachType,
      compliancePercent: this.calculateCompliancePercent(complaint),
    };
  }

  private calculateCompliancePercent(complaint: Complaint): number {
    if (!complaint.slaResolutionDeadline || !complaint.resolvedAt) {
      return 100;
    }

    const createdAt = new Date(complaint.createdAt).getTime();
    const resolvedAt = new Date(complaint.resolvedAt).getTime();
    const deadline = new Date(complaint.slaResolutionDeadline).getTime();
    const totalPauseMs = complaint.totalPauseDurationMs || 0;

    const actualDuration = resolvedAt - createdAt - totalPauseMs;
    const allowedDuration = deadline - createdAt - totalPauseMs;

    if (allowedDuration <= 0) return 100;
    return Math.max(0, Math.min(100, Math.round((allowedDuration / actualDuration) * 100)));
  }

  private isHoliday(date: Date, holidays: string[]): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.includes(dateStr);
  }

  private getNextBusinessDayStart(date: Date, businessHours: any, holidays: string[], timezone: string): number {
    let nextDay = new Date(date.getTime() + 24 * MS_PER_HOUR);
    while (this.isHoliday(nextDay, holidays) || !businessHours[nextDay.toLocaleString('en-US', { weekday: 'lowercase', timeZone: 'Asia/Kolkata' })]) {
      nextDay = new Date(nextDay.getTime() + 24 * MS_PER_HOUR);
    }
    nextDay.setHours(businessHours[nextDay.toLocaleString('en-US', { weekday: 'lowercase', timeZone: timezone })].start, 0, 0, 0);
    return nextDay.getTime();
  }

  private MS_PER_HOUR = 60 * 60 * 1000;
}

export const slaEngine = SlaEngine.getInstance();
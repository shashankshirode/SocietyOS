import { auditService, createAuditEntry } from '../../../core/audit';
import type { Visitor, VisitorStatus, VisitorType, VisitorInvitation, VisitorApprovalRequest } from '../../../shared/types/visitorPhase8.types';
import type { GateEvent, GateEventType } from '../../../shared/types/visitorPhase8.types';

export interface VisitorNotificationPayload {
  type: VisitorNotificationType;
  societyId: string;
  unitId?: string;
  recipientUserIds: string[];
  title: string;
  body: string;
  data: Record<string, unknown>;
  priority: 'normal' | 'high' | 'critical';
  actionUrl?: string;
  correlationId: string;
}

export type VisitorNotificationType =
  | 'VISITOR_PRE_APPROVED'
  | 'VISITOR_ARRIVED'
  | 'VISITOR_CHECKED_IN'
  | 'VISITOR_CHECKED_OUT'
  | 'VISITOR_APPROVAL_REQUESTED'
  | 'VISITOR_APPROVED'
  | 'VISITOR_DENIED'
  | 'VISITOR_EXPIRED'
  | 'VISITOR_REVOKED'
  | 'VISITOR_WATCHLIST_MATCH'
  | 'VISITOR_EMERGENCY_BYPASS'
  | 'VISITOR_OVERDUE'
  | 'VISITOR_OFFLINE_SYNC_FAILED';

const NOTIFICATION_TEMPLATES: Record<VisitorNotificationType, { title: string; body: string }> = {
  VISITOR_PRE_APPROVED: {
    title: 'Visitor Pre-Approved',
    body: 'Your visitor {visitorName} has been pre-approved for {date} at {time}.',
  },
  VISITOR_ARRIVED: {
    title: 'Visitor Arrived',
    body: 'Your visitor {visitorName} has arrived at {gateName}.',
  },
  VISITOR_CHECKED_IN: {
    title: 'Visitor Checked In',
    body: 'Your visitor {visitorName} has been checked in at {gateName}.',
  },
  VISITOR_CHECKED_OUT: {
    title: 'Visitor Checked Out',
    body: 'Your visitor {visitorName} has left the society.',
  },
  VISITOR_APPROVAL_REQUESTED: {
    title: 'Visitor Approval Required',
    body: '{visitorName} is at {gateName} requesting entry to your unit. Please approve or deny.',
  },
  VISITOR_APPROVED: {
    title: 'Visitor Approved',
    body: 'You approved entry for {visitorName}.',
  },
  VISITOR_DENIED: {
    title: 'Visitor Denied',
    body: 'You denied entry for {visitorName}. Reason: {reason}',
  },
  VISITOR_EXPIRED: {
    title: 'Visitor Pass Expired',
    body: 'The visitor pass for {visitorName} has expired.',
  },
  VISITOR_REVOKED: {
    title: 'Visitor Pass Revoked',
    body: 'The visitor pass for {visitorName} has been revoked.',
  },
  VISITOR_WATCHLIST_MATCH: {
    title: 'Security Alert: Watchlist Match',
    body: 'Visitor {visitorName} matched watchlist entry: {reason}',
  },
  VISITOR_EMERGENCY_BYPASS: {
    title: 'Emergency Bypass Activated',
    body: 'Emergency entry granted for {visitorName} at {gateName}. Reason: {reason}',
  },
  VISITOR_OVERDUE: {
    title: 'Visitor Overdue',
    body: 'Visitor {visitorName} has exceeded their expected exit time.',
  },
  VISITOR_OFFLINE_SYNC_FAILED: {
    title: 'Offline Sync Failed',
    body: 'Gate events from {gateName} failed to sync. Manual intervention required.',
  },
};

function interpolate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => String(data[key] ?? match));
}

function generateCorrelationId(): string {
  return `corr_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export const visitorNotificationService = {
  async sendVisitorPreApproved(
    visitor: Visitor,
    residentUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_PRE_APPROVED;

    await this.sendNotification({
      type: 'VISITOR_PRE_APPROVED',
      societyId,
      unitId: visitor.unitId,
      recipientUserIds: residentUserIds,
      title: interpolate(template.title, { visitorName: visitor.name, date: visitor.expectedDate, time: visitor.expectedTime }),
      body: interpolate(template.body, { visitorName: visitor.name, date: visitor.expectedDate, time: visitor.expectedTime }),
      data: { visitorId: visitor.id, visitorName: visitor.name, visitorType: visitor.type, expectedDate: visitor.expectedDate, expectedTime: visitor.expectedTime },
      priority: 'normal',
      actionUrl: `/visitors/${visitor.id}`,
      correlationId,
    });
  },

  async sendVisitorArrived(
    visitor: Visitor,
    gateName: string,
    residentUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_ARRIVED;

    await this.sendNotification({
      type: 'VISITOR_ARRIVED',
      societyId,
      unitId: visitor.unitId,
      recipientUserIds: residentUserIds,
      title: interpolate(template.title, { visitorName: visitor.name, gateName }),
      body: interpolate(template.body, { visitorName: visitor.name, gateName }),
      data: { visitorId: visitor.id, visitorName: visitor.name, gateName },
      priority: 'high',
      actionUrl: `/visitors/${visitor.id}`,
      correlationId,
    });
  },

  async sendVisitorCheckedIn(
    visitor: Visitor,
    gateName: string,
    residentUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_CHECKED_IN;

    await this.sendNotification({
      type: 'VISITOR_CHECKED_IN',
      societyId,
      unitId: visitor.unitId,
      recipientUserIds: residentUserIds,
      title: interpolate(template.title, { visitorName: visitor.name, gateName }),
      body: interpolate(template.body, { visitorName: visitor.name, gateName }),
      data: { visitorId: visitor.id, visitorName: visitor.name, gateName, entryTime: new Date().toISOString() },
      priority: 'normal',
      actionUrl: `/visitors/${visitor.id}`,
      correlationId,
    });
  },

  async sendVisitorCheckedOut(
    visitor: Visitor,
    residentUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_CHECKED_OUT;

    await this.sendNotification({
      type: 'VISITOR_CHECKED_OUT',
      societyId,
      unitId: visitor.unitId,
      recipientUserIds: residentUserIds,
      title: interpolate(template.title, { visitorName: visitor.name }),
      body: interpolate(template.body, { visitorName: visitor.name }),
      data: { visitorId: visitor.id, visitorName: visitor.name, exitTime: new Date().toISOString() },
      priority: 'normal',
      actionUrl: `/visitors/${visitor.id}`,
      correlationId,
    });
  },

  async sendApprovalRequested(
    approvalRequest: VisitorApprovalRequest,
    residentUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_APPROVAL_REQUESTED;

    await this.sendNotification({
      type: 'VISITOR_APPROVAL_REQUESTED',
      societyId,
      unitId: approvalRequest.unitId,
      recipientUserIds: residentUserIds,
      title: interpolate(template.title, { visitorName: approvalRequest.visitorName, gateName: approvalRequest.gateName }),
      body: interpolate(template.body, { visitorName: approvalRequest.visitorName, gateName: approvalRequest.gateName }),
      data: {
        approvalRequestId: approvalRequest.id,
        visitorId: approvalRequest.visitorId,
        visitorName: approvalRequest.visitorName,
        visitorType: approvalRequest.visitorType,
        gateId: approvalRequest.gateId,
        gateName: approvalRequest.gateName,
        flatNumber: approvalRequest.flatNumber,
        expiresAt: approvalRequest.expiresAtIso,
      },
      priority: 'critical',
      actionUrl: `/visitor-approval/${approvalRequest.id}`,
      correlationId,
    });
  },

  async sendVisitorApproved(
    approvalRequest: VisitorApprovalRequest,
    residentUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_APPROVED;

    await this.sendNotification({
      type: 'VISITOR_APPROVED',
      societyId,
      unitId: approvalRequest.unitId,
      recipientUserIds: residentUserIds,
      title: interpolate(template.title, { visitorName: approvalRequest.visitorName }),
      body: interpolate(template.body, { visitorName: approvalRequest.visitorName }),
      data: { approvalRequestId: approvalRequest.id, visitorId: approvalRequest.visitorId },
      priority: 'normal',
      actionUrl: `/visitor-approval/${approvalRequest.id}`,
      correlationId,
    });
  },

  async sendVisitorDenied(
    approvalRequest: VisitorApprovalRequest,
    denialReason: string,
    residentUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_DENIED;

    await this.sendNotification({
      type: 'VISITOR_DENIED',
      societyId,
      unitId: approvalRequest.unitId,
      recipientUserIds: residentUserIds,
      title: interpolate(template.title, { visitorName: approvalRequest.visitorName }),
      body: interpolate(template.body, { visitorName: approvalRequest.visitorName, reason: denialReason }),
      data: { approvalRequestId: approvalRequest.id, visitorId: approvalRequest.visitorId, denialReason },
      priority: 'normal',
      actionUrl: `/visitor-approval/${approvalRequest.id}`,
      correlationId,
    });
  },

  async sendVisitorExpired(
    visitor: Visitor,
    residentUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_EXPIRED;

    await this.sendNotification({
      type: 'VISITOR_EXPIRED',
      societyId,
      unitId: visitor.unitId,
      recipientUserIds: residentUserIds,
      title: interpolate(template.title, { visitorName: visitor.name }),
      body: interpolate(template.body, { visitorName: visitor.name }),
      data: { visitorId: visitor.id, visitorName: visitor.name },
      priority: 'normal',
      actionUrl: `/visitors/${visitor.id}`,
      correlationId,
    });
  },

  async sendVisitorRevoked(
    visitor: Visitor,
    revocationReason: string,
    residentUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_REVOKED;

    await this.sendNotification({
      type: 'VISITOR_REVOKED',
      societyId,
      unitId: visitor.unitId,
      recipientUserIds: residentUserIds,
      title: interpolate(template.title, { visitorName: visitor.name }),
      body: interpolate(template.body, { visitorName: visitor.name }),
      data: { visitorId: visitor.id, visitorName: visitor.name, revocationReason },
      priority: 'high',
      actionUrl: `/visitors/${visitor.id}`,
      correlationId,
    });
  },

  async sendWatchlistMatch(
    visitor: Visitor,
    watchlistReason: string,
    securityUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_WATCHLIST_MATCH;

    await this.sendNotification({
      type: 'VISITOR_WATCHLIST_MATCH',
      societyId,
      recipientUserIds: securityUserIds,
      title: interpolate(template.title, { visitorName: visitor.name, reason: watchlistReason }),
      body: interpolate(template.body, { visitorName: visitor.name, reason: watchlistReason }),
      data: { visitorId: visitor.id, visitorName: visitor.name, watchlistReason },
      priority: 'critical',
      actionUrl: `/visitors/${visitor.id}`,
      correlationId,
    });
  },

  async sendEmergencyBypass(
    visitor: Visitor,
    gateName: string,
    reason: string,
    securityUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_EMERGENCY_BYPASS;

    await this.sendNotification({
      type: 'VISITOR_EMERGENCY_BYPASS',
      societyId,
      recipientUserIds: securityUserIds,
      title: interpolate(template.title, { visitorName: visitor.name, gateName, reason }),
      body: interpolate(template.body, { visitorName: visitor.name, gateName, reason }),
      data: { visitorId: visitor.id, visitorName: visitor.name, gateName, reason },
      priority: 'critical',
      actionUrl: `/visitors/${visitor.id}`,
      correlationId,
    });
  },

  async sendVisitorOverdue(
    visitor: Visitor,
    residentUserIds: string[],
    societyId: string
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_OVERDUE;

    await this.sendNotification({
      type: 'VISITOR_OVERDUE',
      societyId,
      unitId: visitor.unitId,
      recipientUserIds: residentUserIds,
      title: interpolate(template.title, { visitorName: visitor.name }),
      body: interpolate(template.body, { visitorName: visitor.name }),
      data: { visitorId: visitor.id, visitorName: visitor.name, expectedExitAt: visitor.expectedExitAtIso },
      priority: 'high',
      actionUrl: `/visitors/${visitor.id}`,
      correlationId,
    });
  },

  async sendOfflineSyncFailed(
    gateName: string,
    securityUserIds: string[],
    societyId: string,
    failedCount: number
  ): Promise<void> {
    const correlationId = generateCorrelationId();
    const template = NOTIFICATION_TEMPLATES.VISITOR_OFFLINE_SYNC_FAILED;

    await this.sendNotification({
      type: 'VISITOR_OFFLINE_SYNC_FAILED',
      societyId,
      recipientUserIds: securityUserIds,
      title: interpolate(template.title, { gateName }),
      body: interpolate(template.body, { gateName }),
      data: { gateName, failedCount },
      priority: 'high',
      actionUrl: '/guard/offline-queue',
      correlationId,
    });
  },

  async sendNotification(payload: VisitorNotificationPayload): Promise<void> {
    createAuditEntry({
      actorUserId: 'SYSTEM',
      actorType: 'SYSTEM',
      societyId: payload.societyId,
      action: `NOTIFICATION_${payload.type}`,
      entityType: 'NOTIFICATION',
      entityId: payload.correlationId,
      newState: { type: payload.type, recipients: payload.recipientUserIds.length, priority: payload.priority },
      idempotencyKey: payload.correlationId,
      source: 'SYSTEM',
      outcome: 'SUCCESS',
    });

    console.log('[VisitorNotificationService] Notification sent:', {
      type: payload.type,
      recipients: payload.recipientUserIds.length,
      correlationId: payload.correlationId,
    });
  },

  getTemplate(type: VisitorNotificationType): { title: string; body: string } {
    return NOTIFICATION_TEMPLATES[type];
  },
};

export default visitorNotificationService;
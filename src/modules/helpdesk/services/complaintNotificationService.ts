import { auditService, createAuditEntry } from '../../../core/audit';
import type { Complaint, ComplaintStatus, ComplaintPriority } from '../../../shared/types/complaintPhase6';

export interface ComplaintNotificationPayload {
  type: 'COMPLAINT_CREATED' | 'COMPLAINT_ASSIGNED' | 'COMPLAINT_ACKNOWLEDGED' | 'COMPLAINT_STARTED' | 'COMPLAINT_WAITING' | 'COMPLAINT_HOLD' | 'COMPLAINT_RESOLVED' | 'COPARENT_INCIDENT_UPDATE' | 'COMPLAINT_REOPENED' | 'COMPLAINT_CLOSED' | 'COMPLAINT_REOPENED' | 'COMPLAINT_ESCALATED' | 'SLA_BREACH' | 'SLA_AT_RISK';
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

const NOTIFICATION_TEMPLATES: Record<string, { title: string; body: string }> = {
  COMPLAINT_CREATED: {
    title: 'Complaint Registered',
    body: 'Your complaint "{title}" has been registered with ticket number {ticketNumber}.',
  },
  COMPLAINT_ASSIGNED: {
    title: 'Complaint Assigned',
    body: 'Complaint "{title}" has been assigned to {assigneeName}.',
  },
  COMPLAINT_ACKNOWLEDGED: {
    title: 'Complaint Acknowledged',
    body: 'Technician {assigneeName} has acknowledged complaint "{title}".',
  },
  COMPLAINT_STARTED: {
    title: 'Work Started',
    body: 'Work has started on complaint "{title}" by {technicianName}.',
  },
  COMPLAINT_WAITING: {
    title: 'Complaint Waiting',
    body: 'Complaint "{title}" is waiting for {reason}. Expected resume: {expectedTime}.',
  },
  COMPLAINT_HOLD: {
    title: 'Complaint On Hold',
    body: 'Complaint "{title}" has been placed on hold. Reason: {reason}.',
  },
  COMPLAINT_RESOLVED: {
    title: 'Complaint Resolved',
    body: 'Complaint "{title}" has been marked as resolved. {confirmationNote}',
  },
  COMPLAINT_CLOSED: {
    title: 'Complaint Closed',
    body: 'Complaint "{title}" has been closed.',
  },
  COMPLAINT_REOPENED: {
    title: 'Complaint Reopened',
    body: 'Complaint "{title}" has been reopened. Reason: {reason}.',
  },
  COMPLAINT_ESCALATED: {
    title: 'Complaint Escalated',
    body: 'Complaint "{title}" has been escalated to {newLevel}. Reason: {reason}.',
  },
  SLA_BREACH: {
    title: 'SLA Breach Alert',
    body: 'Complaint "{title}" has breached its SLA deadline.',
  },
  SLA_AT_RISK: {
    title: 'SLA At Risk',
    body: 'Complaint "{title}" is at risk of SLA breach.',
  },
  PARENT_INCIDENT_UPDATE: {
    title: 'Parent Incident Update',
    body: 'Update on incident "{parentTitle}": {updateText}.',
  },
};

function interpolate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => String(data[key] ?? match));
}

function generateCorrelationId(): string {
  return `corr_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export class ComplaintNotificationService {
  private static instance: ComplaintNotificationService;

  static getInstance(): ComplaintNotificationService {
    if (!ComplaintNotificationService.instance) {
      ComplaintNotificationService.instance = new ComplaintNotificationService();
    }
    return ComplaintNotificationService.instance;
  }

  async sendComplaintCreated(
    complaint: any,
    recipientUserIds: string[],
    societyId: string
  ): Promise<void> {
    await this.sendNotification({
      type: 'COMPLAINT_CREATED',
      societyId,
      unitId: complaint.unitId,
      recipientUserIds,
      title: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_CREATED.title, { title: complaint.title }),
      body: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_CREATED.body, { title: complaint.title, ticketNumber: complaint.ticketNumber }),
      data: { complaintId: complaint.id, ticketNumber: complaint.ticketNumber, category: complaint.category },
      priority: 'normal',
      actionUrl: `/complaints/${complaint.id}`,
      correlationId: generateCorrelationId(),
    });
  }

  async sendComplaintAssigned(
    complaint: any,
    assigneeName: string,
    recipientUserIds: string[],
    societyId: string
  ): Promise<void> {
    await this.sendNotification({
      type: 'COMPLAINT_ASSIGNED',
      societyId,
      unitId: complaint.unitId,
      recipientUserIds,
      title: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_ASSIGNED.title, { title: complaint.title }),
      body: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_ASSIGNED.body, { title: complaint.title, assigneeName }),
      data: { complaintId: complaint.id, assigneeName },
      priority: 'high',
      actionUrl: `/complaints/${complaint.id}`,
      correlationId: generateCorrelationId(),
    });
  }

  async sendComplaintAcknowledged(
    complaint: any,
    technicianName: string,
    recipientUserIds: string[],
    societyId: string
  ): Promise<void> {
    await this.sendNotification({
      type: 'COMPLAINT_ACKNOWLEDGED',
      societyId,
      unitId: complaint.unitId,
      recipientUserIds,
      title: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_ACKNOWLEDGED.title, { title: complaint.title }),
      body: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_ACKNOWLEDGED.body, { title: complaint.title, technicianName }),
      data: { complaintId: complaint.id, technicianName },
      priority: 'normal',
      actionUrl: `/complaints/${complaint.id}`,
      correlationId: generateCorrelationId(),
    });
  }

  async sendComplaintResolved(
    complaint: any,
    confirmationRequired: boolean,
    recipientUserIds: string[],
    societyId: string
  ): Promise<void> {
    const confirmationNote = confirmationRequired
      ? 'Please review and confirm the resolution.'
      : 'The complaint will auto-close after 24 hours if no action is taken.';

    await this.sendNotification({
      type: 'COMPLAINT_RESOLVED',
      societyId,
      unitId: complaint.unitId,
      recipientUserIds,
      title: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_RESOLVED.title, { title: complaint.title }),
      body: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_RESOLVED.body, { title: complaint.title, confirmationNote }),
      data: { complaintId: complaint.id, confirmationRequired },
      priority: 'high',
      actionUrl: `/complaints/${complaint.id}`,
      correlationId: generateCorrelationId(),
    });
  }

  async sendComplaintReopened(
    complaint: any,
    reason: string,
    recipientUserIds: string[],
    societyId: string
  ): Promise<void> {
    await this.sendNotification({
      type: 'COMPLAINT_REOPENED',
      societyId,
      unitId: complaint.unitId,
      recipientUserIds,
      title: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_REOPENED.title, { title: complaint.title }),
      body: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_REOPENED.body, { title: complaint.title, reason }),
      data: { complaintId: complaint.id, reason },
      priority: 'high',
      actionUrl: `/complaints/${complaint.id}`,
      correlationId: generateCorrelationId(),
    });
  }

  async sendComplaintClosed(
    complaint: any,
    recipientUserIds: string[],
    societyId: string
  ): Promise<void> {
    await this.sendNotification({
      type: 'COMPLAINT_CLOSED',
      societyId,
      unitId: complaint.unitId,
      recipientUserIds,
      title: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_CLOSED.title, { title: complaint.title }),
      body: interpolate(NOTIFICATION_TEMPLATES.COMPLAINT_CLOSED.body, { title: complaint.title }),
      data: { complaintId: complaint.id },
      priority: 'normal',
      actionUrl: `/complaints/${complaint.id}`,
      correlationId: generateCorrelationId(),
    });
  }

  async sendSlaBreachAlert(
    complaint: any,
    breachType: 'RESPONSE' | 'RESOLUTION' | 'ACKNOWLEDGEMENT',
    recipientUserIds: string[],
    societyId: string
  ): Promise<void> {
    await this.sendNotification({
      type: 'SLA_BREACH',
      societyId,
      unitId: complaint.unitId,
      recipientUserIds,
      title: NOTIFICATION_TEMPLATES.SLA_BREACH.title,
      body: interpolate(NOTIFICATION_TEMPLATES.SLA_BREACH.body, { title: complaint.title }),
      data: { complaintId: complaint.id, breachType },
      priority: 'critical',
      actionUrl: `/complaints/${complaint.id}`,
      correlationId: generateCorrelationId(),
    });
  }

  async sendSlaAtRiskAlert(
    complaint: any,
    recipientUserIds: string[],
    societyId: string
  ): Promise<void> {
    await this.sendNotification({
      type: 'SLA_AT_RISK',
      societyId,
      unitId: complaint.unitId,
      recipientUserIds,
      title: NOTIFICATION_TEMPLATES.SLA_AT_RISK.title,
      body: interpolate(NOTIFICATION_TEMPLATES.SLA_AT_RISK.body, { title: complaint.title }),
      data: { complaintId: complaint.id },
      priority: 'high',
      actionUrl: `/complaints/${complaint.id}`,
      correlationId: generateCorrelationId(),
    });
  }

  async sendParentIncidentUpdate(
    parentIncident: any,
    updateText: string,
    recipientUserIds: string[],
    societyId: string
  ): Promise<void> {
    await this.sendNotification({
      type: 'PARENT_INCIDENT_UPDATE',
      societyId,
      recipientUserIds,
      title: interpolate(NOTIFICATION_TEMPLATES.PARENT_INCIDENT_UPDATE.title, { parentTitle: parentIncident.title }),
      body: interpolate(NOTIFICATION_TEMPLATES.PARENT_INCIDENT_UPDATE.body, { parentTitle: parentIncident.title, updateText }),
      data: { parentIncidentId: complaint.id, updateText },
      priority: 'high',
      actionUrl: `/parent-incidents/${complaint.id}`,
      correlationId: generateCorrelationId(),
    });
  }

  private async sendNotification(payload: any): Promise<void> {
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

    console.log('[ComplaintNotificationService] Notification sent:', {
      type: payload.type,
      recipients: payload.recipientUserIds.length,
      correlationId: payload.correlationId,
    });
  }
}

export const complaintNotificationService = ComplaintNotificationService.getInstance();
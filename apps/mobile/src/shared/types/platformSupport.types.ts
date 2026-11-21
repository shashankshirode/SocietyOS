

export type SupportTicketCategory =
  | 'ONBOARDING'
  | 'BILLING_HELP'
  | 'TECHNICAL_ISSUE'
  | 'USER_ACCESS'
  | 'PAYMENT_ISSUE'
  | 'DOCUMENT_ACCESS'
  | 'FEATURE_REQUEST'
  | 'BUG_REPORT'
  | 'DATA_CORRECTION'
  | 'SECURITY_PRIVACY'
  | 'OTHER';

export type SupportTicketStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_SOCIETY'
  | 'WAITING_FOR_PLATFORM'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ESCALATED';

export type SupportPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT'
  | 'CRITICAL';

export type SupportEscalationTeam =
  | 'PRODUCT'
  | 'ENGINEERING'
  | 'OPERATIONS'
  | 'CUSTOMER_SUCCESS'
  | 'SECURITY_PRIVACY'
  | 'BILLING_INTERNAL';

export type IntegrationStatus =
  | 'NOT_CONFIGURED'
  | 'CONFIGURED'
  | 'HEALTHY'
  | 'DEGRADED'
  | 'DOWN'
  | 'DISABLED'
  | 'FUTURE_PLACEHOLDER';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  societyId: string;
  societyName: string;
  category: SupportTicketCategory;
  priority: SupportPriority;
  status: SupportTicketStatus;
  subject: string;
  description: string;
  createdBy: string;
  assignedTo?: string;
  slaStatus: 'WITHIN_SLA' | 'SLA_WARNING' | 'SLA_BREACHED';
  lastUpdate: string;
  createdAt: string;
  resolvedAt?: string;
  linkedModule?: string;
  internalNotes?: string;
  resolutionSummary?: string;
}

export interface SupportTicketEscalation {
  ticketId: string;
  reason: string;
  targetTeam: SupportEscalationTeam;
  priority: SupportPriority;
  internalNote: string;
  confirmed: boolean;
}

export interface IntegrationRecord {
  id: string;
  integrationName: string;
  category: string;
  status: IntegrationStatus;
  provider?: string;
  lastChecked?: string;
  failureCountPlaceholder: number;
  affectedSocietiesPlaceholder: number;
  notes?: string;
}

export interface NotificationChannelRecord {
  id: string;
  channelName: string;
  providerPlaceholder: string;
  status: IntegrationStatus;
  lastTest?: string;
  failureCountPlaceholder: number;
  affectedSocietiesPlaceholder: number;
}

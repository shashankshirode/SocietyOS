import type { JsonObject } from '../api/api.types';
import type { Absent } from '../../shared/types/absence.types';

export interface VisitorPassIssuedPayload extends JsonObject {
  readonly visitorName: string;
  readonly visitorType?: string | Absent;
  readonly flatNumber?: string | Absent;
}

export interface VisitorAtGatePayload extends JsonObject {
  readonly visitorName: string;
  readonly entryGate: string;
  readonly hostUserId?: string | Absent;
}

export interface VisitorAdmittedPayload extends JsonObject {
  readonly visitorId: string;
  readonly visitorName?: string | Absent;
  readonly unitId?: string | Absent;
  readonly entryTimeIso?: string | Absent;
}

export interface VisitorExitedPayload extends JsonObject {
  readonly visitorId: string;
  readonly visitorName?: string | Absent;
  readonly unitId?: string | Absent;
  readonly exitTimeIso?: string | Absent;
}

export interface VisitorCancelledPayload extends JsonObject {
  readonly visitorId: string;
  readonly reason?: string | Absent;
}

export interface ComplaintCreatedPayload extends JsonObject {
  readonly title: string;
  readonly category?: string | Absent;
  readonly unitNumber?: string | Absent;
}

export interface ComplaintStatusChangedPayload extends JsonObject {
  readonly ticketId: string;
  readonly previousStatus?: string | Absent;
  readonly newStatus: string;
  readonly note?: string | Absent;
}

export interface PaymentSettledPayload extends JsonObject {
  readonly amount: number;
  readonly billTitle: string;
  readonly receiptNumber: string;
  readonly transactionId?: string | Absent;
}

export interface FacilityBookingConfirmedPayload extends JsonObject {
  readonly facilityName: string;
  readonly slotTime: string;
  readonly chargeAmount?: number | Absent;
  readonly unitNumber?: string | Absent;
}

export interface FacilityBookingCancelledPayload extends JsonObject {
  readonly bookingId: string;
  readonly facilityName?: string | Absent;
  readonly reason?: string | Absent;
}

export interface SosTriggeredPayload extends JsonObject {
  readonly incidentId?: string | Absent;
  readonly category?: string | Absent;
  readonly locationNotes?: string | Absent;
  readonly severity?: string | Absent;
  readonly dispatchTimeIso?: string | Absent;
}

export interface SosAcknowledgedPayload extends JsonObject {
  readonly incidentId?: string | Absent;
  readonly acknowledgedByUserId?: string | Absent;
  readonly acknowledgedAtIso?: string | Absent;
}

export interface HouseholdMemberInvitedPayload extends JsonObject {
  readonly memberName: string;
  readonly relation: string;
}

export interface HouseholdPermissionsChangedPayload extends JsonObject {
  readonly memberName: string;
  readonly permissions: Record<string, unknown>;
}

export interface HouseholdMemberRemovedPayload extends JsonObject {
  readonly memberName: string;
}

export interface SocietyDomainEventMap {
  'visitor.pass.issued': VisitorPassIssuedPayload;
  'visitor.at.gate': VisitorAtGatePayload;
  'visitor.admitted': VisitorAdmittedPayload;
  'visitor.exited': VisitorExitedPayload;
  'visitor.cancelled': VisitorCancelledPayload;
  'helpdesk.ticket.created': ComplaintCreatedPayload;
  'helpdesk.ticket.status.changed': ComplaintStatusChangedPayload;
  'billing.payment.settled': PaymentSettledPayload;
  'facility.booking.confirmed': FacilityBookingConfirmedPayload;
  'facility.booking.cancelled': FacilityBookingCancelledPayload;
  'emergency.sos.triggered': SosTriggeredPayload;
  'emergency.sos.acknowledged': SosAcknowledgedPayload;
  'household.member.invited': HouseholdMemberInvitedPayload;
  'household.permissions.changed': HouseholdPermissionsChangedPayload;
  'household.member.removed': HouseholdMemberRemovedPayload;
}

export type SocietyDomainEventType = keyof SocietyDomainEventMap;

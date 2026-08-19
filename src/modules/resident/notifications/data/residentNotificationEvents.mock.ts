export type ResidentMockNotificationEvent = {
  eventId: string;
  societyId: string;
  recipientResidentProfileId: string;
  kind:
    | 'contactRequestReceived'
    | 'contactRequestAccepted'
    | 'contactRequestRejected'
    | 'familyPortabilityCompleted'
    | 'rentalDeclarationSubmitted'
    | 'shortStayCreated'
    | 'shortStayStatusChanged';
  createdAtIso: string;
};

type PublishResidentMockNotificationInput = Omit<ResidentMockNotificationEvent, 'eventId' | 'createdAtIso'>;

let sequence = 100;
const events: ResidentMockNotificationEvent[] = [];

export function publishResidentMockNotification(input: PublishResidentMockNotificationInput): ResidentMockNotificationEvent {
  sequence += 1;
  const event: ResidentMockNotificationEvent = {
    ...input,
    eventId: `resident-notification-${sequence}`,
    createdAtIso: '2026-07-12T08:00:00.000Z',
  };
  events.push(event);
  return event;
}

export function getResidentMockNotificationEvents(): readonly ResidentMockNotificationEvent[] {
  return events;
}

export function resetResidentMockNotificationEvents(): void {
  events.splice(0, events.length);
  sequence = 100;
}

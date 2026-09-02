import { resolveNotificationRecipients } from './householdActionGovernance.engine';
import type { HouseholdActionEvent, HouseholdNotificationMode, HouseholdNotificationRecipient, HouseholdSponsor } from './householdActionGovernance.types';

export type NotificationIntent = {
  intentId: string;
  eventId: string;
  recipientUserId: string;
  residenceId: string;
  mode: HouseholdNotificationMode;
  channel: 'IN_APP' | 'PUSH';
  body: string;
};

let intentSequence = 0;

function actionBody(event: HouseholdActionEvent): string {
  if (event.actionType === 'FACILITY_BOOKED') return `${event.actorDisplayName} booked a facility.`;
  if (event.actionType === 'SOS_TRIGGERED') return `${event.actorDisplayName} requested urgent help.`;
  if (event.actionType === 'VISITOR_CREATED') return `${event.actorDisplayName} created visitor access.`;
  if (event.actionType === 'PAYMENT_CONFIRMED') return `${event.actorDisplayName} completed a household payment.`;
  return `${event.actorDisplayName} completed an action for the home.`;
}

export function createNotificationIntents(input: {
  event: HouseholdActionEvent;
  householdSponsor?: HouseholdSponsor;
  coOwners?: HouseholdSponsor[];
  configuredRecipients?: HouseholdNotificationRecipient[];
  societyResponders?: HouseholdNotificationRecipient[];
  sponsorMode?: HouseholdNotificationMode;
  quietHours?: boolean;
}): NotificationIntent[] {
  const recipients = resolveNotificationRecipients(input);
  return recipients.map((recipient) => {
    intentSequence += 1;
    const mode = input.event.actionClass === 'CRITICAL_SAFETY' ? 'INSTANT' : input.quietHours && recipient.mode === 'INSTANT' ? 'DIGEST' : recipient.mode;
    return {
      intentId: `notification-intent-${intentSequence}`,
      eventId: input.event.eventId,
      recipientUserId: recipient.userId,
      residenceId: `${input.event.societyId}:${input.event.unitId}`,
      mode,
      channel: mode === 'INSTANT' ? 'PUSH' : 'IN_APP',
      body: actionBody(input.event),
    };
  });
}
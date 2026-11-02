import type { DomainEvent } from '../../events/DomainEventBus';
import type { JsonObject } from '../../api/api.types';
import type { DomainNotificationPolicy, ResolvedNotificationPolicy } from './notificationPolicy.types';

export const complaintNotificationPolicy: DomainNotificationPolicy = {
  supports(eventType: string): boolean {
    return eventType === 'helpdesk.ticket.created';
  },

  resolve(event: DomainEvent<JsonObject>): ResolvedNotificationPolicy | null {
    if (event.eventType !== 'helpdesk.ticket.created') {
      return null;
    }

    const { actor, payload } = event;
    const actorFirstName = actor.displayName.split(' ')[0] ?? actor.displayName;
    const issueTitle =
      (payload['title'] as string | undefined) ??
      (payload['category'] as string | undefined) ??
      'Issue';

    return {
      category: 'ISSUES',
      activityText: `${actorFirstName} reported ${issueTitle}`,
      actorNotification: {
        title: 'Complaint Registered',
        body: `Your ticket for "${issueTitle}" has been queued for technician assignment.`,
        messageKey: 'notification.complaint.registered.actor',
        params: { issueTitle },
      },
      householdNotification: {
        title: 'New Household Complaint',
        body: `${actorFirstName} reported ${issueTitle}.`,
        messageKey: 'notification.complaint.registered.household',
        params: { actorFirstName, issueTitle },
      },
    };
  },
};

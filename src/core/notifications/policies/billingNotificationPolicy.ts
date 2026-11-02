import type { DomainEvent } from '../../events/DomainEventBus';
import type { JsonObject } from '../../api/api.types';
import type { DomainNotificationPolicy, ResolvedNotificationPolicy } from './notificationPolicy.types';

export const billingNotificationPolicy: DomainNotificationPolicy = {
  supports(eventType: string): boolean {
    return eventType === 'billing.payment.settled';
  },

  resolve(event: DomainEvent<JsonObject>): ResolvedNotificationPolicy | null {
    if (event.eventType !== 'billing.payment.settled') {
      return null;
    }

    const { actor, payload } = event;
    const actorFirstName = actor.displayName.split(' ')[0] ?? actor.displayName;
    const amountVal = payload['amount'] as number | undefined;
    const amountStr = amountVal ? `₹${amountVal}` : 'payment';
    const billTitle = (payload['billTitle'] as string | undefined) ?? 'Maintenance';

    return {
      category: 'MONEY',
      activityText: `${actorFirstName} paid ${amountStr} toward ${billTitle}`,
      actorNotification: {
        title: 'Payment Successful',
        body: `Receipt generated for your payment of ${amountStr}.`,
        messageKey: 'notification.billing.paymentSuccess.actor',
        params: { amount: amountStr, billTitle },
      },
      householdNotification: {
        title: 'Maintenance Payment Completed',
        body: `${actorFirstName} paid ${amountStr} toward ${billTitle}.`,
        messageKey: 'notification.billing.paymentSuccess.household',
        params: { actorFirstName, amount: amountStr, billTitle },
      },
    };
  },
};

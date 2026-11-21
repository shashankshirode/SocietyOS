import { notificationPolicyRegistry } from '../policies/notificationPolicyRegistry';
import { visitorNotificationPolicy } from '../policies/visitorNotificationPolicy';
import { billingNotificationPolicy } from '../policies/billingNotificationPolicy';
import { complaintNotificationPolicy } from '../policies/complaintNotificationPolicy';
import { facilityNotificationPolicy } from '../policies/facilityNotificationPolicy';
import { emergencyNotificationPolicy } from '../policies/emergencyNotificationPolicy';
import type { DomainEvent } from '../../events/DomainEventBus';

describe('Notification Policies and Registry', () => {
  it('correctly routes and resolves visitor.pass.issued policy', () => {
    const event: DomainEvent = {
      eventId: 'evt-v-1',
      eventType: 'visitor.pass.issued',
      societyId: 'soc-1',
      actor: {
        userId: 'usr-1',
        personId: 'per-1',
        displayName: 'Rohan Sharma',
        role: 'RESIDENT_OWNER',
      },
      subject: { entityType: 'VisitorPass', entityId: 'v-1' },
      severity: 'INFO',
      createdAtIso: new Date().toISOString(),
      correlationId: 'corr-1',
      payload: { visitorName: 'John Doe' },
    };

    expect(visitorNotificationPolicy.supports('visitor.pass.issued')).toBe(true);
    const resolved = notificationPolicyRegistry.resolvePolicy(event);
    expect(resolved).not.toBeNull();
    expect(resolved?.category).toBe('VISITORS_AND_ACCESS');
    expect(resolved?.activityText).toBe('Rohan created visitor access for John Doe');
    expect(resolved?.actorNotification?.title).toBe('Visitor Pass Created');
    expect(resolved?.householdNotification?.title).toBe('New Visitor Pass');
  });

  it('correctly routes and resolves billing.payment.settled policy', () => {
    const event: DomainEvent = {
      eventId: 'evt-p-1',
      eventType: 'billing.payment.settled',
      societyId: 'soc-1',
      actor: {
        userId: 'usr-1',
        personId: 'per-1',
        displayName: 'Sunita Sharma',
        role: 'RESIDENT_FAMILY',
      },
      subject: { entityType: 'BillPayment', entityId: 'pay-1' },
      severity: 'INFO',
      createdAtIso: new Date().toISOString(),
      correlationId: 'corr-2',
      payload: { amount: 3500, billTitle: 'Maintenance October' },
    };

    expect(billingNotificationPolicy.supports('billing.payment.settled')).toBe(true);
    const resolved = notificationPolicyRegistry.resolvePolicy(event);
    expect(resolved).not.toBeNull();
    expect(resolved?.category).toBe('MONEY');
    expect(resolved?.activityText).toBe('Sunita paid ₹3500 toward Maintenance October');
    expect(resolved?.actorNotification?.title).toBe('Payment Successful');
  });

  it('returns null for unknown domain event types', () => {
    const event: DomainEvent = {
      eventId: 'evt-u-1',
      eventType: 'unknown.test.event',
      societyId: 'soc-1',
      actor: {
        userId: 'usr-1',
        personId: 'per-1',
        displayName: 'User',
        role: 'RESIDENT_OWNER',
      },
      subject: { entityType: 'Test', entityId: '1' },
      severity: 'INFO',
      createdAtIso: new Date().toISOString(),
      correlationId: 'corr-3',
      payload: {},
    };

    expect(notificationPolicyRegistry.resolvePolicy(event)).toBeNull();
  });
});

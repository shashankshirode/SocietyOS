import type { DomainNotificationPolicy, ResolvedNotificationPolicy } from './notificationPolicy.types';
import type { DomainEvent } from '../../events/DomainEventBus';
import type { JsonObject } from '../../api/api.types';
import { visitorNotificationPolicy } from './visitorNotificationPolicy';
import { complaintNotificationPolicy } from './complaintNotificationPolicy';
import { billingNotificationPolicy } from './billingNotificationPolicy';
import { facilityNotificationPolicy } from './facilityNotificationPolicy';
import { emergencyNotificationPolicy } from './emergencyNotificationPolicy';

export class NotificationPolicyRegistry {
  private policies: DomainNotificationPolicy[] = [];

  constructor() {
    this.registerPolicy(visitorNotificationPolicy);
    this.registerPolicy(complaintNotificationPolicy);
    this.registerPolicy(billingNotificationPolicy);
    this.registerPolicy(facilityNotificationPolicy);
    this.registerPolicy(emergencyNotificationPolicy);
  }

  public registerPolicy(policy: DomainNotificationPolicy): void {
    this.policies.push(policy);
  }

  public resolvePolicy(event: DomainEvent<JsonObject>): ResolvedNotificationPolicy | null {
    for (const policy of this.policies) {
      if (policy.supports(event.eventType)) {
        const resolved = policy.resolve(event);
        if (resolved) {
          return resolved;
        }
      }
    }
    return null;
  }
}

export const notificationPolicyRegistry = new NotificationPolicyRegistry();

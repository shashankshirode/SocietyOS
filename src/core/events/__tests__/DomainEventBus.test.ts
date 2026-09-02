import { domainEventBus, type DomainEvent } from '../DomainEventBus';

describe('DomainEventBus & Event Telemetry', () => {
  beforeEach(() => {
    domainEventBus.clearHistory();
  });

  it('emits domain events and notifies registered type listeners', async () => {
    const listener = jest.fn();
    const unsubscribe = domainEventBus.subscribe('visitor.pass.issued', listener);

    const testEvent: DomainEvent<{ visitorName: string }> = {
      eventId: 'evt-001',
      eventType: 'visitor.pass.issued',
      societyId: 'soc-palm-grove-01',
      unitId: 'unit-b804',
      actor: {
        userId: 'usr-sunita-02',
        personId: 'per-sunita-02',
        displayName: 'Sunita Sharma',
        role: 'RESIDENT_FAMILY',
      },
      subject: {
        entityType: 'VisitorPass',
        entityId: 'vp-100',
      },
      severity: 'INFO',
      createdAtIso: new Date().toISOString(),
      correlationId: 'corr-001',
      payload: {
        visitorName: 'Rajesh',
      },
    };

    await domainEventBus.emit(testEvent);

    expect(listener).toHaveBeenCalledWith(testEvent);
    expect(domainEventBus.getHistory()).toContainEqual(testEvent);

    unsubscribe();
  });

  it('notifies global event subscribers for audit and telemetry', async () => {
    const globalListener = jest.fn();
    const unsubscribe = domainEventBus.subscribeAll(globalListener);

    const event: DomainEvent = {
      eventId: 'evt-002',
      eventType: 'emergency.sos.triggered',
      societyId: 'soc-palm-grove-01',
      actor: {
        userId: 'usr-amit-03',
        personId: 'per-amit-03',
        displayName: 'Amit Sharma',
        role: 'RESIDENT_FAMILY',
      },
      subject: {
        entityType: 'EmergencyIncident',
        entityId: 'sos-001',
      },
      severity: 'CRITICAL',
      createdAtIso: new Date().toISOString(),
      correlationId: 'corr-002',
      payload: {},
    };

    await domainEventBus.emit(event);

    expect(globalListener).toHaveBeenCalledWith(event);
    unsubscribe();
  });
});

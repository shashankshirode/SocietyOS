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

  it('delivers typed payload to specific domain event listeners', async () => {
    let capturedPayload: { amount: number; billTitle: string; receiptNumber: string } | null = null;

    const unsubscribe = domainEventBus.subscribe('billing.payment.settled', (event) => {
      capturedPayload = event.payload;
    });

    await domainEventBus.emit({
      eventId: 'evt-pay-test-1',
      eventType: 'billing.payment.settled',
      societyId: 'soc-palm-grove-01',
      unitId: 'unit-b804',
      actor: {
        userId: 'usr-sunita-02',
        personId: 'per-sunita-02',
        displayName: 'Sunita Sharma',
        role: 'RESIDENT_FAMILY',
      },
      subject: {
        entityType: 'BillPayment',
        entityId: 'pay-123',
      },
      severity: 'INFO',
      createdAtIso: new Date().toISOString(),
      correlationId: 'corr-pay-1',
      payload: {
        amount: 2500,
        billTitle: 'October Maintenance',
        receiptNumber: 'REC-2026-001',
      },
    });

    expect(capturedPayload).toEqual({
      amount: 2500,
      billTitle: 'October Maintenance',
      receiptNumber: 'REC-2026-001',
    });

    unsubscribe();
  });

  it('stops notifying listener after unsubscribe is called', async () => {
    const listener = jest.fn();
    const unsubscribe = domainEventBus.subscribe('helpdesk.ticket.created', listener);

    await domainEventBus.emit({
      eventId: 'evt-help-1',
      eventType: 'helpdesk.ticket.created',
      societyId: 'soc-palm-grove-01',
      actor: {
        userId: 'usr-1',
        personId: 'per-1',
        displayName: 'User',
        role: 'RESIDENT_OWNER',
      },
      subject: {
        entityType: 'Complaint',
        entityId: 'comp-1',
      },
      severity: 'INFO',
      createdAtIso: new Date().toISOString(),
      correlationId: 'corr-comp-1',
      payload: {
        title: 'Water leakage',
      },
    });

    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();

    await domainEventBus.emit({
      eventId: 'evt-help-2',
      eventType: 'helpdesk.ticket.created',
      societyId: 'soc-palm-grove-01',
      actor: {
        userId: 'usr-1',
        personId: 'per-1',
        displayName: 'User',
        role: 'RESIDENT_OWNER',
      },
      subject: {
        entityType: 'Complaint',
        entityId: 'comp-2',
      },
      severity: 'INFO',
      createdAtIso: new Date().toISOString(),
      correlationId: 'corr-comp-2',
      payload: {
        title: 'Lift malfunction',
      },
    });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('isolates subscriber errors so other subscribers still receive the event', async () => {
    const failingListener = jest.fn().mockImplementation(() => {
      throw new Error('Subscriber failed');
    });
    const succeedingListener = jest.fn();

    const unsubFail = domainEventBus.subscribe('facility.booking.confirmed', failingListener);
    const unsubSuccess = domainEventBus.subscribe('facility.booking.confirmed', succeedingListener);

    await domainEventBus.emit({
      eventId: 'evt-fb-1',
      eventType: 'facility.booking.confirmed',
      societyId: 'soc-palm-grove-01',
      actor: {
        userId: 'usr-1',
        personId: 'per-1',
        displayName: 'User',
        role: 'RESIDENT_OWNER',
      },
      subject: {
        entityType: 'FacilityBooking',
        entityId: 'fb-1',
      },
      severity: 'INFO',
      createdAtIso: new Date().toISOString(),
      correlationId: 'corr-fb-1',
      payload: {
        facilityName: 'Clubhouse',
        slotTime: '10:00 AM',
      },
    });

    expect(failingListener).toHaveBeenCalledTimes(1);
    expect(succeedingListener).toHaveBeenCalledTimes(1);

    unsubFail();
    unsubSuccess();
  });
});

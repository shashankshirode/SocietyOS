import { CircuitBreaker } from '../services/circuitBreaker';
import { ConnectorFrameworkService } from '../services/connectorFrameworkService';
import type { HardwareActorContext } from '../services/hardwareActor';

describe('Connector Framework Invariants', () => {
  let breaker: CircuitBreaker;
  let service: ConnectorFrameworkService;
  const adminActor: HardwareActorContext = {
    userId: 'admin-01',
    userName: 'Admin',
    userRole: 'SUPER_ADMIN',
    societyId: 'soc-alpha',
  };

  beforeEach(() => {
    breaker = new CircuitBreaker({ failureThreshold: 3, recoveryTimeoutMs: 100 });
    service = new ConnectorFrameworkService();
  });

  test('circuit breaker opens after threshold failures and resets on recovery', async () => {
    expect(breaker.getState()).toBe('CLOSED');
    breaker.recordFailure();
    breaker.recordFailure();
    expect(breaker.getState()).toBe('CLOSED');

    breaker.recordFailure();
    expect(breaker.getState()).toBe('OPEN');
    expect(breaker.isOpen()).toBe(true);

    await new Promise(r => setTimeout(r, 120));
    expect(breaker.getState()).toBe('HALF_OPEN');

    breaker.recordSuccess();
    expect(breaker.getState()).toBe('CLOSED');
    expect(breaker.isOpen()).toBe(false);
  });

  test('computes deterministic deduplication key and rejects rapid duplicates', () => {
    const key1 = service.computeDeterministicDedupeKey('RFID', 'dev-01', 'TAG99', '2026-07-01T10:00:00Z');
    const key2 = service.computeDeterministicDedupeKey('RFID', 'dev-01', 'TAG99', '2026-07-01T10:00:00Z');
    expect(key1).toBe(key2);

    expect(service.isDuplicateEvent(key1)).toBe(false);
    expect(service.isDuplicateEvent(key2)).toBe(true);
  });

  test('records dead letter events and allows authorized replay or discard', () => {
    const dl = service.recordDeadLetter('dev-anpr-01', 'ANPR_CAPTURE', { plate: 'MH12AB1234' }, 'CONNECTOR_TIMEOUT');
    expect(dl.id).toBeDefined();
    expect(dl.replayStatus).toBe('PENDING');

    const replayed = service.replayDeadLetter(adminActor, dl.id);
    expect(replayed.replayStatus).toBe('REPLAYED');
    expect(replayed.retryCount).toBe(1);

    const discarded = service.discardDeadLetter(adminActor, dl.id, 'Malformed test payload');
    expect(discarded.replayStatus).toBe('DISCARDED');
  });

  test('enforces rate limits per minute', () => {
    service.registerConnector({
      connectorId: 'conn-limited',
      name: 'Limited Connector',
      connectorType: 'ANPR',
      protocol: 'REST',
      timeoutMs: 5000,
      maxRetries: 2,
      rateLimitPerMinute: 3,
      isOnline: true,
    });

    expect(service.checkRateLimit('conn-limited')).toBe(true);
    expect(service.checkRateLimit('conn-limited')).toBe(true);
    expect(service.checkRateLimit('conn-limited')).toBe(true);
    expect(service.checkRateLimit('conn-limited')).toBe(false);
  });
});

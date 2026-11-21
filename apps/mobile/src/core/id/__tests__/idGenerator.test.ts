import {
  createSequentialIdGenerator,
  systemIdGenerator,
  getIdGenerator,
  setIdGenerator,
  resetIdGenerator,
} from '../idGenerator';

describe('IdGenerator', () => {
  afterEach(() => {
    resetIdGenerator();
  });

  it('generates sequential deterministic IDs', () => {
    const generator = createSequentialIdGenerator(1);
    expect(generator.nextVisitorId()).toBe('vis-0001');
    expect(generator.nextVisitorId()).toBe('vis-0002');
    expect(generator.nextEventId('evt-vis')).toBe('evt-vis-0003');
    expect(generator.nextNotificationId()).toBe('notif-0004');
    expect(generator.nextActivityId()).toBe('act-0005');

    generator.reset();
    expect(generator.nextVisitorId()).toBe('vis-0001');
  });

  it('switches global active generator and resets cleanly', () => {
    expect(getIdGenerator()).toBe(systemIdGenerator);

    const testGenerator = createSequentialIdGenerator(100);
    setIdGenerator(testGenerator);

    expect(getIdGenerator().nextVisitorId()).toBe('vis-0100');
    expect(getIdGenerator().nextBookingId()).toBe('fb-0101');

    resetIdGenerator();
    expect(getIdGenerator()).toBe(systemIdGenerator);
  });
});

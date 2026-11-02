import { mockStore } from '../mockStore';

describe('MockStore Atomic Transactions', () => {
  beforeEach(() => {
    mockStore.reset();
  });

  it('commits multiple mutations atomically and notifies once', () => {
    const initialVisitorCount = mockStore.getState().visitors.length;
    const initialLedgerCount = mockStore.getState().ledgerEntries.length;
    const listener = jest.fn();
    const unsub = mockStore.subscribe(listener);

    mockStore.runTransaction((store) => {
      store.addVisitor({
        id: 'vis-atomic-1',
        name: 'Atomic Visitor',
        phone: '+919876543210',
        flatNumber: 'B-804',
        purpose: 'GUEST',
        type: 'GUEST',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        expectedDate: '2026-10-02',
        expectedTime: '10:00 AM',
        passCode: '1234',
        visitorCategory: 'GUEST',
      });

      store.addLedgerEntry({
        id: 'led-atomic-1',
        residenceId: 'unit-b804',
        type: 'CREDIT',
        amount: 500,
        description: 'Atomic Deposit',
        date: '2026-10-02',
      });
    });

    expect(mockStore.getState().visitors.length).toBe(initialVisitorCount + 1);
    expect(mockStore.getState().ledgerEntries.length).toBe(initialLedgerCount + 1);
    // Listener notified once at the end of transaction
    expect(listener).toHaveBeenCalledTimes(1);

    unsub();
  });

  it('rolls back all mutations if an error occurs inside the transaction', () => {
    const initialVisitorCount = mockStore.getState().visitors.length;
    const initialLedgerCount = mockStore.getState().ledgerEntries.length;
    const listener = jest.fn();
    const unsub = mockStore.subscribe(listener);

    expect(() => {
      mockStore.runTransaction((store) => {
        store.addVisitor({
          id: 'vis-atomic-fail',
          name: 'Failing Visitor',
          phone: '+919876543210',
          flatNumber: 'B-804',
          purpose: 'GUEST',
          type: 'GUEST',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          expectedDate: '2026-10-02',
          expectedTime: '10:00 AM',
          passCode: '5678',
          visitorCategory: 'GUEST',
        });

        // Intentional failure mid-transaction
        throw new Error('Database constraint simulated failure');
      });
    }).toThrow('Database constraint simulated failure');

    // State rolled back
    expect(mockStore.getState().visitors.length).toBe(initialVisitorCount);
    expect(mockStore.getState().ledgerEntries.length).toBe(initialLedgerCount);
    // No notification fired for rolled back transaction
    expect(listener).not.toHaveBeenCalled();

    unsub();
  });
});

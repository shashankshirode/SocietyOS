import { createIdempotencyKey } from '../idempotency';

describe('idempotency keys', () => {
  it('generates unique prefixed keys', () => {
    const one = createIdempotencyKey('payment');
    const two = createIdempotencyKey('payment');
    expect(one).toMatch(/^payment_/);
    expect(two).toMatch(/^payment_/);
    expect(one).not.toBe(two);
  });
});

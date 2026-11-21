import { createCorrelationId, getMockRequestContext } from '../requestContext';

describe('request context', () => {
  it('returns mock society, unit, actor, and role context', () => {
    const context = getMockRequestContext();
    expect(context.societyId).toBe('society-001');
    expect(context.unitId).toBe('unit-a-1204');
    expect(context.actorUserId).toBe('resident-001');
    expect(context.activeRole).toBe('RESIDENT_OWNER');
  });

  it('generates correlation IDs with prefix', () => {
    expect(createCorrelationId('test')).toMatch(/^test_/);
  });
});

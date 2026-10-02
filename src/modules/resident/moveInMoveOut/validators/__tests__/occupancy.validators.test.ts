import {
  validateOccupancyInput,
  validateOccupancyRecord,
  validateUnitScopeInput,
} from '../occupancy.validators';

describe('occupancy validators', () => {
  it('accepts a complete unit scope', () => {
    expect(validateUnitScopeInput({ societyId: 'soc-1', unitId: 'unit-1' })).toEqual({
      isValid: true,
      errors: [],
    });
  });

  it('rejects a missing unit scope', () => {
    const result = validateUnitScopeInput(null);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects a blank societyId', () => {
    const result = validateUnitScopeInput({ societyId: '   ', unitId: 'unit-1' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('societyId is required.');
  });

  it('accepts a well formed occupancy record', () => {
    const result = validateOccupancyRecord({
      id: 'occ-1',
      unitId: 'unit-1',
      occupantName: 'Asha Rao',
      occupantType: 'OWNER',
      documentStatus: 'APPROVED',
    });
    expect(result.isValid).toBe(true);
  });

  it('rejects an unknown occupant type instead of defaulting it', () => {
    const result = validateOccupancyRecord({
      id: 'occ-1',
      unitId: 'unit-1',
      occupantName: 'Asha Rao',
      occupantType: 'ALIEN',
      documentStatus: 'APPROVED',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBe(1);
  });

  it('rejects a non object record', () => {
    expect(validateOccupancyRecord('nope').isValid).toBe(false);
    expect(validateOccupancyRecord(null).isValid).toBe(false);
    expect(validateOccupancyRecord([]).isValid).toBe(false);
  });

  it('reports every missing field at once', () => {
    const result = validateOccupancyRecord({});
    expect(result.errors).toHaveLength(5);
  });

  it('keeps validateOccupancyInput aligned with unit scope rules', () => {
    expect(validateOccupancyInput({ societyId: 'soc-1', unitId: 'unit-1' }).isValid).toBe(true);
    expect(validateOccupancyInput({ societyId: 'soc-1' }).isValid).toBe(false);
  });
});

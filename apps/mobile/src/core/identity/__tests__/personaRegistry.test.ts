import { MOCK_PERSONAS } from '../personaRegistry';

describe('Normalized Identity & Persona Kernel', () => {
  it('defines 9 distinct switchable personas with decoupled user, profile, and membership entities', () => {
    const personas = Object.keys(MOCK_PERSONAS);
    expect(personas).toEqual([
      'rohan',
      'sunita',
      'amit',
      'priya',
      'vikram',
      'rajesh',
      'meera',
      'suresh',
      'superadmin',
    ]);
  });

  it('correctly associates Rohan as Primary Owner and Household Admin for B-804', () => {
    const rohan = MOCK_PERSONAS.rohan;
    expect(rohan.activeRole).toBe('RESIDENT_OWNER');
    expect(rohan.isHouseholdAdmin).toBe(true);
    expect(rohan.unitRelationship?.unitNumber).toBe('B-804');
    expect(rohan.unitRelationship?.relationshipType).toBe('PRIMARY_OWNER');
  });

  it('correctly associates Sunita and Amit as Family Members under B-804 with individual logins', () => {
    const sunita = MOCK_PERSONAS.sunita;
    const amit = MOCK_PERSONAS.amit;

    expect(sunita.user.id).not.toBe(amit.user.id);
    expect(sunita.activeRole).toBe('RESIDENT_FAMILY');
    expect(amit.activeRole).toBe('RESIDENT_FAMILY');
    expect(sunita.unitRelationship?.unitId).toBe('unit-b804');
    expect(amit.unitRelationship?.unitId).toBe('unit-b804');
    expect(sunita.isHouseholdAdmin).toBe(false);
  });

  it('correctly scopes Security Guard Vikram to gate operations without unit relationship', () => {
    const vikram = MOCK_PERSONAS.vikram;
    expect(vikram.activeRole).toBe('SECURITY_GUARD');
    expect(vikram.unitRelationship).toBeUndefined();
  });
});

import { MOCK_PERSONAS } from '../../identity/personaRegistry';
import { evaluateCapability } from '../capabilityEngine';

describe('Capability Authorization Engine', () => {
  it('allows Owner to create visitors and manage household', () => {
    const rohan = MOCK_PERSONAS.rohan;
    const res = evaluateCapability(rohan, 'VISITOR_CREATE');
    expect(res.status).toBe('ALLOWED');
  });

  it('allows Family member to create visitor if capability is granted', () => {
    const sunita = MOCK_PERSONAS.sunita;
    const res = evaluateCapability(sunita, 'VISITOR_CREATE');
    expect(res.status).toBe('ALLOWED');
  });

  it('denies Security Guard from creating visitors directly for a flat', () => {
    const vikram = MOCK_PERSONAS.vikram;
    const res = evaluateCapability(vikram, 'VISITOR_CREATE');
    expect(res.status).toBe('DENIED');
  });

  it('allows Security Guard to validate visitors at gate', () => {
    const vikram = MOCK_PERSONAS.vikram;
    const res = evaluateCapability(vikram, 'VISITOR_VALIDATE_GATE');
    expect(res.status).toBe('ALLOWED');
  });

  it('requires household approval when family member books expensive paid facility', () => {
    const sunita = MOCK_PERSONAS.sunita;
    const res = evaluateCapability(sunita, 'FACILITY_BOOK_PAID', { price: 2500 });
    expect(res.status).toBe('REQUIRES_HOUSEHOLD_APPROVAL');
  });

  it('allows Owner to cancel any household pass and prevents non-admin from cancelling others', () => {
    const rohan = MOCK_PERSONAS.rohan;
    const sunita = MOCK_PERSONAS.sunita;

    const rohanCancel = evaluateCapability(rohan, 'VISITOR_CANCEL_HOUSEHOLD');
    expect(rohanCancel.status).toBe('ALLOWED');

    const sunitaCancel = evaluateCapability(sunita, 'VISITOR_CANCEL_HOUSEHOLD');
    expect(sunitaCancel.status).toBe('DENIED');
  });
});

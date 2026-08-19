import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_SUBJECT_MAX_LENGTH,
  validateResidentContactRequest,
} from '../domain/residentContact.validation';

describe('resident contact request validation', () => {
  it('rejects whitespace-only and short values', () => {
    expect(validateResidentContactRequest('     ', '          ').formValid).toBe(false);
    expect(validateResidentContactRequest('Help', 'Too short').formValid).toBe(false);
  });

  it('accepts trimmed values within the configured limits', () => {
    expect(validateResidentContactRequest(' Parking clarification ', ' Please help coordinate the visitor parking space. ').formValid).toBe(true);
  });

  it('rejects values beyond their maximum lengths', () => {
    expect(validateResidentContactRequest('S'.repeat(CONTACT_SUBJECT_MAX_LENGTH + 1), 'Valid introductory message').subjectValid).toBe(false);
    expect(validateResidentContactRequest('Valid subject', 'M'.repeat(CONTACT_MESSAGE_MAX_LENGTH + 1)).messageValid).toBe(false);
  });
});

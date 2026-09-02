import { resolveIdentityInitials } from '../IdentityOrb';

describe('IdentityOrb', () => {
  it('uses first and last names for stable initials', () => {
    expect(resolveIdentityInitials('Meera Anjali Patil')).toBe('MP');
  });

  it('never returns an empty fallback', () => {
    expect(resolveIdentityInitials('')).toBe('SO');
    expect(resolveIdentityInitials('Shashank')).toBe('SH');
  });
});

import type { AppRole } from '../permissions/permission.types';

export type AuthSession = {
  userId: string;
  name: string;
  role: AppRole;
  personaKey?: string | undefined;
  societyId?: string | undefined;
  societyName?: string | undefined;
  unitId?: string | undefined;
  unitLabel?: string | undefined;
  isHouseholdAdmin?: boolean | undefined;
  gateName?: string | undefined;
  shiftLabel?: string | undefined;
  token?: string | undefined;
  refreshToken?: string | undefined;
  expiresAt?: string | undefined;
  isMockSession: boolean;
};

export type AuthSessionSnapshot = {
  session: AuthSession | null;
  status: 'signedOut' | 'signedIn';
};

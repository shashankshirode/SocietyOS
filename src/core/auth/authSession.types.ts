import type { AppRole } from '../permissions/permission.types';

export type AuthSession = {
  userId: string;
  name: string;
  role: AppRole;
  societyId?: string;
  societyName?: string;
  unitId?: string;
  unitLabel?: string;
  gateName?: string;
  shiftLabel?: string;
  token?: string;
  refreshToken?: string;
  expiresAt?: string;
  isMockSession: boolean;
};

export type AuthSessionSnapshot = {
  session: AuthSession | null;
  status: 'signedOut' | 'signedIn';
};

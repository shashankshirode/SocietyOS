import type { AppRole } from '../permissions/permission.types';
import type { Absent } from "../../shared/types/absence.types";
export type AuthSession = {
    userId: string;
    name: string;
    role: AppRole;
    personaKey?: string | Absent;
    societyId?: string | Absent;
    societyName?: string | Absent;
    unitId?: string | Absent;
    unitLabel?: string | Absent;
    isHouseholdAdmin?: boolean | Absent;
    gateName?: string | Absent;
    shiftLabel?: string | Absent;
    token?: string | Absent;
    refreshToken?: string | Absent;
    expiresAt?: string | Absent;
    isMockSession: boolean;
};
export type AuthSessionSnapshot = {
    session: AuthSession | null;
    status: 'signedOut' | 'signedIn';
};


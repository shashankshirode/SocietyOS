import type { AppRole } from '../permissions/permission.types';
import type { Absent } from "../../shared/types/absence.types";
export type AuthSession = {
    userId: string;
    name: string;
    role: AppRole;
    user?: {
        id: string;
        name: string;
        email?: string;
        phone?: string;
        role?: AppRole;
        societyId?: string;
        unitId?: string;
    } | Absent;
    personaKey?: string | Absent;
    societyId?: string | Absent;
    societyName?: string | Absent;
    unitId?: string | Absent;
    unitLabel?: string | Absent;
    homeContextId?: string | Absent;
    isHouseholdAdmin?: boolean | Absent;
    gateName?: string | Absent;
    shiftLabel?: string | Absent;
    token?: string | Absent;
    refreshToken?: string | Absent;
    expiresAt?: string | Absent;
    isMockSession?: boolean | Absent;
};
export type AuthSessionSnapshot = {
    session: AuthSession | null;
    status: 'signedOut' | 'signedIn';
};


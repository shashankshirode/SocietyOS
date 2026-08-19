import type { AuthSession, AuthSessionSnapshot } from './authSession.types';
import { setAccessToken } from './tokenStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppRole } from '../permissions/permission.types';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import type { Absent } from "../../shared/types/absence.types";
type SessionListener = () => void;
let currentSession: AuthSession | null = null;
const listeners = new Set<SessionListener>();
const AUTH_SESSION_STORAGE_KEY = 'societyos.auth.session';
const appRoles: readonly AppRole[] = [
    'RESIDENT_OWNER', 'RESIDENT_TENANT', 'RESIDENT_FAMILY', 'SECURITY_GUARD', 'SECURITY_SUPERVISOR',
    'FACILITY_MANAGER', 'COMMITTEE_MEMBER', 'SECRETARY', 'CHAIRPERSON', 'TREASURER', 'SOCIETY_ADMIN',
    'SUPER_ADMIN', 'ELECTION_OFFICER', 'AUDITOR', 'VENDOR_USER', 'STAFF_USER',
];
function optionalString(value: JsonValue | Absent): string | Absent {
    return typeof value === 'string' ? value : undefined;
}
function parseStoredSession(raw: string): AuthSession | null {
    const value: JsonValue = JSON.parse(raw);
    if (!value || Array.isArray(value) || typeof value !== 'object')
        return null;
    const roleValue = value.role;
    if (typeof value.userId !== 'string' ||
        typeof value.name !== 'string' ||
        typeof roleValue !== 'string' ||
        !appRoles.includes(roleValue as AppRole) ||
        typeof value.isMockSession !== 'boolean')
        return null;
    return {
        userId: value.userId,
        name: value.name,
        role: roleValue as AppRole,
        ...includeWhenPresent("societyId", optionalString(value.societyId)),
        ...includeWhenPresent("societyName", optionalString(value.societyName)),
        ...includeWhenPresent("unitId", optionalString(value.unitId)),
        ...includeWhenPresent("unitLabel", optionalString(value.unitLabel)),
        ...includeWhenPresent("gateName", optionalString(value.gateName)),
        ...includeWhenPresent("shiftLabel", optionalString(value.shiftLabel)),
        ...includeWhenPresent("token", optionalString(value.token)),
        ...includeWhenPresent("refreshToken", optionalString(value.refreshToken)),
        ...includeWhenPresent("expiresAt", optionalString(value.expiresAt)),
        isMockSession: value.isMockSession
    };
}
function emitSessionChange() {
    listeners.forEach((listener) => listener());
}
export function getCurrentSession(): AuthSession | null {
    return currentSession;
}
export function getSessionSnapshot(): AuthSessionSnapshot {
    return {
        session: currentSession,
        status: currentSession ? 'signedIn' : 'signedOut'
    };
}
export function subscribeToSession(listener: SessionListener): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
export async function setCurrentSession(session: AuthSession): Promise<void> {
    currentSession = session;
    await AsyncStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
    if (session.token) {
        await setAccessToken(session.token);
    }
    emitSessionChange();
}
export async function clearCurrentSession(): Promise<void> {
    currentSession = null;
    await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    emitSessionChange();
}
export async function restoreCurrentSession(): Promise<AuthSession | null> {
    if (currentSession)
        return currentSession;
    const raw = await AsyncStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw)
        return null;
    try {
        const restored = parseStoredSession(raw);
        if (!restored) {
            await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
            return null;
        }
        if (restored.expiresAt && Date.parse(restored.expiresAt) <= Date.now()) {
            await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
            return null;
        }
        currentSession = restored;
        if (restored.token)
            await setAccessToken(restored.token);
        emitSessionChange();
        return restored;
    }
    catch {
        await AsyncStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
        return null;
    }
}
export async function clearSensitiveCachedDataPlaceholder(): Promise<void> {
    return undefined;
}


import type { RootStackParamList } from '../../app/navigation/navigation.types';
import type { AppRole } from '../permissions/permission.types';
import type { AuthSession } from './authSession.types';
import { MOCK_PERSONAS } from '../identity/personaRegistry';

type AppRouteName = keyof RootStackParamList;

export function createMockSessionForPersona(personaKey: keyof typeof MOCK_PERSONAS): AuthSession {
  const p = MOCK_PERSONAS[personaKey] ?? MOCK_PERSONAS.rohan;
  const displayName = p.person.preferredName ?? `${p.person.firstName} ${p.person.lastName}`;

  return {
    userId: p.user.id,
    name: displayName,
    role: p.activeRole,
    personaKey,
    societyId: p.membership.societyId,
    societyName: p.membership.societyName,
    unitId: p.unitRelationship?.unitId,
    unitLabel: p.unitRelationship?.unitNumber,
    isHouseholdAdmin: p.isHouseholdAdmin,
    gateName: p.activeRole === 'SECURITY_GUARD' ? 'Main Gate' : undefined,
    shiftLabel: p.activeRole === 'SECURITY_GUARD' ? 'Morning Shift' : undefined,
    token: `mock-token-${p.user.id}`,
    refreshToken: `mock-refresh-${p.user.id}`,
    isMockSession: true,
  };
}

const personaByRoute: Partial<Record<AppRouteName, keyof typeof MOCK_PERSONAS>> = {
  ResidentApp: 'rohan',
  GuardApp: 'vikram',
  SocietyAdminApp: 'suresh',
  TreasurerApp: 'meera',
  FacilityManagerApp: 'rajesh',
  SuperAdminApp: 'superadmin',
  HardwareApp: 'suresh',
};

export function createMockSessionForRoute(routeName: AppRouteName): AuthSession | null {
  const personaKey = personaByRoute[routeName];
  if (!personaKey) {
    return null;
  }
  return createMockSessionForPersona(personaKey);
}

export function getMockSessionSeedForRole(role: AppRole): AuthSession {
  const match = (Object.keys(MOCK_PERSONAS) as (keyof typeof MOCK_PERSONAS)[]).find(
    (k) => MOCK_PERSONAS[k].activeRole === role
  );
  return createMockSessionForPersona(match ?? 'rohan');
}

import type { RootStackParamList } from '../../app/navigation/navigation.types';
import type { AppRole } from '../permissions/permission.types';
import type { AuthSession } from './authSession.types';

type AppRouteName = keyof RootStackParamList;

type MockSessionSeed = {
  userId: string;
  name: string;
  role: AppRole;
  societyId?: string;
  societyName?: string;
  unitId?: string;
  unitLabel?: string;
  gateName?: string;
  shiftLabel?: string;
};

const residentMockSessionSeed: MockSessionSeed = {
  userId: 'resident-001',
  name: 'Aarav Mehta',
  role: 'RESIDENT_OWNER',
  societyId: 'society-gv',
  societyName: 'Green Valley Heights',
  unitId: 'unit-a-1204',
  unitLabel: 'A-1204',
};

const mockSessionByRoute: Partial<Record<AppRouteName, MockSessionSeed>> = {
  ResidentApp: {
    ...residentMockSessionSeed,
  },
  GuardApp: {
    userId: 'guard-amit',
    name: 'Amit Jadhav',
    role: 'SECURITY_GUARD',
    societyId: 'society-gv',
    societyName: 'Green Valley Heights',
    gateName: 'Main Gate',
    shiftLabel: 'Morning Shift',
  },
  SocietyAdminApp: {
    userId: 'admin-001',
    name: 'Neha Kulkarni',
    role: 'SOCIETY_ADMIN',
    societyId: 'society-gv',
    societyName: 'Green Valley Heights',
  },
  TreasurerApp: {
    userId: 'treasurer-001',
    name: 'Rohan Deshpande',
    role: 'TREASURER',
    societyId: 'society-gv',
    societyName: 'Green Valley Heights',
  },
  FacilityManagerApp: {
    userId: 'facility-001',
    name: 'Kavita Nair',
    role: 'FACILITY_MANAGER',
    societyId: 'society-gv',
    societyName: 'Green Valley Heights',
  },
  SuperAdminApp: {
    userId: 'platform-001',
    name: 'Platform Admin',
    role: 'SUPER_ADMIN',
  },
  HardwareApp: {
    userId: 'hardware-001',
    name: 'Hardware Operator',
    role: 'SOCIETY_ADMIN',
    societyId: 'society-gv',
    societyName: 'Green Valley Heights',
  },
};

export function createMockSessionForRoute(routeName: AppRouteName): AuthSession | null {
  const seed = mockSessionByRoute[routeName];
  if (!seed) {
    return null;
  }

  return {
    ...seed,
    token: `mock-token-${seed.userId}`,
    refreshToken: `mock-refresh-${seed.userId}`,
    isMockSession: true,
  };
}

export function getMockSessionSeedForRole(role: AppRole): AuthSession {
  const match = Object.values(mockSessionByRoute).find((seed) => seed?.role === role);
  const seed = match ?? residentMockSessionSeed;

  return {
    ...seed,
    token: `mock-token-${seed.userId}`,
    refreshToken: `mock-refresh-${seed.userId}`,
    isMockSession: true,
  };
}

import { MOCK_PERSONAS } from './personaRegistry';
import type { ActiveContext, AppRole, UnitRelationship, SocietyMembership, UserAccount, PersonProfile } from './identity.types';
import { mockStore } from '../mockStore/mockStore';
import type { AdminApproval } from '../../shared/types/admin.types';

export interface RegisteredIdentity {
  user: UserAccount;
  person: PersonProfile;
  membership?: SocietyMembership;
  unitRelationship?: UnitRelationship;
  activeRole: AppRole;
  isHouseholdAdmin: boolean;
  personaKey?: string;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
}

export type IdentityLookupResult =
  | { status: 'REGISTERED'; identity: RegisteredIdentity }
  | { status: 'NEW_USER'; mobileNumber: string }
  | { status: 'SUSPENDED'; message: string };

// Dynamic registry of newly registered users
const dynamicUsersByPhone = new Map<string, RegisteredIdentity>();

// Dynamic pending residence onboarding requests
let dynamicPendingRequests: AdminApproval[] = [];

export function normalizePhoneNumber(rawPhone: string | undefined | null): string {
  if (!rawPhone) return '';
  const digits = String(rawPhone).replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

export function lookupIdentityByPhone(rawPhone: string): IdentityLookupResult {
  const normalized = normalizePhoneNumber(rawPhone);

  // Check simulated suspended account
  if (normalized === '9999999999' || normalized === '0000000000') {
    return {
      status: 'SUSPENDED',
      message: 'Your account has been suspended by the society administration. Please contact support.',
    };
  }

  // 1. Check MOCK_PERSONAS
  for (const [key, persona] of Object.entries(MOCK_PERSONAS)) {
    const personaPhone = normalizePhoneNumber(persona.user.phone);
    if (personaPhone === normalized) {
      return {
        status: 'REGISTERED',
        identity: {
          user: persona.user,
          person: persona.person,
          membership: persona.membership,
          unitRelationship: persona.unitRelationship,
          activeRole: persona.activeRole,
          isHouseholdAdmin: persona.isHouseholdAdmin,
          personaKey: key,
          status: 'ACTIVE',
        },
      };
    }
  }

  // 2. Check dynamically registered users
  const dynamicMatch = dynamicUsersByPhone.get(normalized);
  if (dynamicMatch) {
    return {
      status: 'REGISTERED',
      identity: dynamicMatch,
    };
  }

  // 3. Check mockStore residents
  const storeResidents = mockStore.getState().residents;
  const storeMatch = storeResidents.find((r) => r.phone && normalizePhoneNumber(r.phone) === normalized);
  if (storeMatch) {
    const isOwner = storeMatch.role === 'OWNER';
    const role: AppRole = isOwner ? 'RESIDENT_OWNER' : 'RESIDENT_TENANT';
    const dynamicId: RegisteredIdentity = {
      user: {
        id: storeMatch.id,
        email: storeMatch.email,
        phone: `+91${normalized}`,
        createdAtIso: new Date().toISOString(),
        isVerified: true,
      },
      person: {
        id: `per-${storeMatch.id}`,
        userId: storeMatch.id,
        firstName: storeMatch.name.split(' ')[0] || 'Resident',
        lastName: storeMatch.name.split(' ').slice(1).join(' ') || '',
        preferredName: storeMatch.name,
      },
      membership: {
        id: `mem-${storeMatch.id}`,
        userId: storeMatch.id,
        societyId: 'soc-greenwood-pune',
        societyName: 'Greenwood Heights',
        status: 'ACTIVE',
        joinedAtIso: new Date().toISOString(),
        defaultRole: role,
      },
      unitRelationship: {
        id: `rel-${storeMatch.id}`,
        userId: storeMatch.id,
        personId: `per-${storeMatch.id}`,
        societyId: 'soc-greenwood-pune',
        unitId: `unit-${storeMatch.unitNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        unitNumber: storeMatch.unitNumber,
        towerOrBlock: storeMatch.wing,
        relationshipType: isOwner ? 'PRIMARY_OWNER' : 'TENANT',
        status: 'ACTIVE',
        isHouseholdAdmin: isOwner,
        allowedCapabilities: ['*'],
        validFromIso: new Date().toISOString(),
      },
      activeRole: role,
      isHouseholdAdmin: isOwner,
      status: 'ACTIVE',
    };
    dynamicUsersByPhone.set(normalized, dynamicId);
    return {
      status: 'REGISTERED',
      identity: dynamicId,
    };
  }

  return {
    status: 'NEW_USER',
    mobileNumber: normalized,
  };
}

export function registerNewUserAccount(input: {
  mobileNumber: string;
  fullName: string;
  email?: string;
}): RegisteredIdentity {
  const normalized = normalizePhoneNumber(input.mobileNumber);
  const nameParts = input.fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Resident';
  const lastName = nameParts.slice(1).join(' ') || '';
  const userId = `usr-${Date.now().toString().slice(-6)}`;
  const personId = `per-${Date.now().toString().slice(-6)}`;

  const newIdentity: RegisteredIdentity = {
    user: {
      id: userId,
      email: input.email || `${firstName.toLowerCase()}@societyos.mock`,
      phone: `+91${normalized}`,
      createdAtIso: new Date().toISOString(),
      isVerified: true,
    },
    person: {
      id: personId,
      userId,
      firstName,
      lastName,
      preferredName: input.fullName.trim(),
    },
    activeRole: 'RESIDENT_OWNER',
    isHouseholdAdmin: false,
    status: 'PENDING_APPROVAL',
  };

  dynamicUsersByPhone.set(normalized, newIdentity);
  return newIdentity;
}

export function submitResidenceOnboardingRequest(input: {
  userId: string;
  userName: string;
  societyId: string;
  societyName: string;
  unitNumber: string;
  wing: string;
  relationshipType: 'OWNER' | 'TENANT' | 'FAMILY_MEMBER';
  notes?: string;
}): AdminApproval {
  const approvalId = `appr-req-${Date.now()}`;
  const approval: AdminApproval = {
    id: approvalId,
    approvalNumber: `APR-2026-${Date.now().toString().slice(-4)}`,
    type: 'MOVE_IN',
    requestedBy: input.userName,
    requestedByRole: input.relationshipType === 'OWNER' ? 'RESIDENT_OWNER' : 'RESIDENT_TENANT',
    unitNumber: input.unitNumber,
    wing: input.wing,
    createdAt: new Date().toISOString(),
    priority: 'HIGH',
    status: 'PENDING',
    assignedRole: 'SECRETARY',
    summary: `${input.relationshipType} residence request for ${input.unitNumber} (${input.wing}) by ${input.userName}`,
    notes: input.notes || 'Submitted via resident onboarding',
  };

  dynamicPendingRequests = [approval, ...dynamicPendingRequests];
  return approval;
}

export function getPendingResidenceRequests(): AdminApproval[] {
  return [...dynamicPendingRequests];
}

export function approveResidenceRequest(approvalId: string): boolean {
  const req = dynamicPendingRequests.find((r) => r.id === approvalId);
  if (!req) return false;

  req.status = 'APPROVED';

  // Find user by name in dynamic users
  for (const [phone, user] of dynamicUsersByPhone.entries()) {
    if (user.person.preferredName === req.requestedBy || user.user.name === req.requestedBy) {
      const isOwner = req.requestedByRole === 'RESIDENT_OWNER';
      const role: AppRole = isOwner ? 'RESIDENT_OWNER' : 'RESIDENT_TENANT';
      const updated: RegisteredIdentity = {
        ...user,
        status: 'ACTIVE',
        activeRole: role,
        membership: {
          id: `mem-${user.user.id}`,
          userId: user.user.id,
          societyId: 'soc-greenwood-pune',
          societyName: 'Greenwood Heights',
          status: 'ACTIVE',
          joinedAtIso: new Date().toISOString(),
          defaultRole: role,
        },
        unitRelationship: {
          id: `rel-${user.user.id}`,
          userId: user.user.id,
          personId: user.person.id,
          societyId: 'soc-greenwood-pune',
          unitId: `unit-${req.unitNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          unitNumber: req.unitNumber,
          towerOrBlock: req.wing,
          relationshipType: isOwner ? 'PRIMARY_OWNER' : 'TENANT',
          status: 'ACTIVE',
          isHouseholdAdmin: isOwner,
          allowedCapabilities: ['*'],
          validFromIso: new Date().toISOString(),
        },
      };
      dynamicUsersByPhone.set(phone, updated);
      break;
    }
  }

  return true;
}

export function rejectResidenceRequest(approvalId: string, reason?: string): boolean {
  const req = dynamicPendingRequests.find((r) => r.id === approvalId);
  if (!req) return false;

  req.status = 'REJECTED';
  req.notes = reason ? `Rejected: ${reason}` : 'Rejected by administrator';
  return true;
}

export function resetIdentityResolverState(): void {
  dynamicUsersByPhone.clear();
  dynamicPendingRequests = [];
}

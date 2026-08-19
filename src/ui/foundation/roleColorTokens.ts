

import { residentColors } from '../../shared/theme/residentColors';

export type RoleIdentityKey =
  | 'residentOwner'
  | 'residentTenant'
  | 'familyMember'
  | 'securityGuard'
  | 'securitySupervisor'
  | 'facilityManager'
  | 'treasurer'
  | 'accountant'
  | 'secretary'
  | 'chairperson'
  | 'committeeMember'
  | 'societyAdmin'
  | 'superAdmin'
  | 'staffUser'
  | 'vendorUser';

export interface RoleIdentity {
  label: string;
  gradient: [string, string, string];
  accent: string;
  soft: string;
}

export const roleIdentities: Record<RoleIdentityKey, RoleIdentity> = {
  residentOwner: {
    label: 'Resident Owner',
    gradient: [residentColors.brandInk, residentColors.brandIndigo, residentColors.brandCobalt],
    accent: residentColors.brandIndigo,
    soft: residentColors.lightElevatedSurface,
  },
  residentTenant: {
    label: 'Resident Tenant',
    gradient: [residentColors.brandInk, residentColors.brandCobalt, residentColors.accentAqua],
    accent: residentColors.brandCobalt,
    soft: residentColors.lightElevatedSurface,
  },
  familyMember: {
    label: 'Family Member',
    gradient: [residentColors.brandInk, residentColors.brandIndigo, residentColors.accentAqua],
    accent: residentColors.accentAqua,
    soft: residentColors.lightElevatedSurface,
  },
  securityGuard: {
    label: 'Security Guard',
    gradient: ['#064E3B', '#0F766E', '#14B8A6'],
    accent: '#0F766E',
    soft: '#CCFBF1',
  },
  securitySupervisor: {
    label: 'Security Supervisor',
    gradient: ['#134E4A', '#14B8A6', '#2DD4BF'],
    accent: '#14B8A6',
    soft: '#CCFBF1',
  },
  facilityManager: {
    label: 'Facility Manager',
    gradient: ['#312E81', '#7C3AED', '#A855F7'],
    accent: '#7C3AED',
    soft: '#EDE9FE',
  },
  treasurer: {
    label: 'Treasurer',
    gradient: ['#78350F', '#B7791F', '#F59E0B'],
    accent: '#B7791F',
    soft: '#FEF3C7',
  },
  accountant: {
    label: 'Accountant',
    gradient: ['#713F12', '#CA8A04', '#FBBF24'],
    accent: '#CA8A04',
    soft: '#FEF9C3',
  },
  secretary: {
    label: 'Secretary',
    gradient: ['#0F172A', '#2563EB', '#38BDF8'],
    accent: '#2563EB',
    soft: '#DBEAFE',
  },
  chairperson: {
    label: 'Chairperson',
    gradient: ['#111827', '#1D4ED8', '#6366F1'],
    accent: '#1D4ED8',
    soft: '#DBEAFE',
  },
  committeeMember: {
    label: 'Committee Member',
    gradient: ['#1E293B', '#0284C7', '#38BDF8'],
    accent: '#0284C7',
    soft: '#BAE6FD',
  },
  societyAdmin: {
    label: 'Society Admin',
    gradient: ['#0F172A', '#1D4ED8', '#38BDF8'],
    accent: '#1D4ED8',
    soft: '#DBEAFE',
  },
  superAdmin: {
    label: 'Super Admin',
    gradient: ['#111827', '#BE123C', '#F97316'],
    accent: '#BE123C',
    soft: '#FFE4E6',
  },
  staffUser: {
    label: 'Staff',
    gradient: ['#374151', '#475569', '#64748B'],
    accent: '#475569',
    soft: '#E5E7EB',
  },
  vendorUser: {
    label: 'Vendor',
    gradient: ['#3F2A0A', '#B7791F', '#F59E0B'],
    accent: '#B7791F',
    soft: '#FEF3C7',
  },
};


export function resolveRoleIdentity(role: string): RoleIdentity {
  const map: Record<string, RoleIdentityKey> = {
    RESIDENT_OWNER: 'residentOwner',
    RESIDENT_TENANT: 'residentTenant',
    RESIDENT_FAMILY: 'familyMember',
    SECURITY_GUARD: 'securityGuard',
    SECURITY_SUPERVISOR: 'securitySupervisor',
    FACILITY_MANAGER: 'facilityManager',
    TREASURER: 'treasurer',
    ACCOUNTANT: 'accountant',
    SECRETARY: 'secretary',
    CHAIRPERSON: 'chairperson',
    COMMITTEE_MEMBER: 'committeeMember',
    SOCIETY_ADMIN: 'societyAdmin',
    SUPER_ADMIN: 'superAdmin',
    STAFF_USER: 'staffUser',
    VENDOR_USER: 'vendorUser',
  };
  return roleIdentities[map[role] ?? 'societyAdmin'];
}

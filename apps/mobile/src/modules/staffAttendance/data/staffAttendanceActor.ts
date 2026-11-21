import type { StaffOperationsActor } from './staffAttendanceActor.types';

export function assertSocietyContext(actor: StaffOperationsActor, targetSocietyId: string): void {
  if (actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM') {
    return;
  }
  if (actor.societyId !== targetSocietyId) {
    throw new Error(`CROSS_SOCIETY_ACCESS_DENIED: Actor society ${actor.societyId} does not match target ${targetSocietyId}`);
  }
}

export function canRegisterStaff(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canVerifyStaff(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canExitStaff(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canSuspendStaff(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SECURITY_SUPERVISOR' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canManageDomesticHelp(actor: StaffOperationsActor): boolean {
  return actor.role === 'RESIDENT' || actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canApproveDomesticHelp(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canBlockDomesticHelpSociety(actor: StaffOperationsActor): boolean {
  return actor.role === 'SECURITY_SUPERVISOR' || actor.role === 'HR_ADMIN' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canManageShifts(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SECURITY_SUPERVISOR' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canRecordManualAttendance(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SECURITY_SUPERVISOR' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canRequestAttendanceCorrection(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SECURITY_SUPERVISOR' || actor.role === 'GUARD' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canApproveAttendanceCorrection(actor: StaffOperationsActor, requesterUserId: string): boolean {
  if (actor.userId === requesterUserId && actor.role !== 'SYSTEM') {
    return false;
  }
  return actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canManageBiometricDevices(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canVerifyVendorAttendance(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canGeneratePayrollSnapshot(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canInspectHousekeeping(actor: StaffOperationsActor): boolean {
  return actor.role === 'FACILITY_MANAGER' || actor.role === 'HR_ADMIN' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canViewStaffSensitiveDocs(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

export function canViewPhoneUnmasked(actor: StaffOperationsActor): boolean {
  return actor.role === 'HR_ADMIN' || actor.role === 'FACILITY_MANAGER' || actor.role === 'SUPER_ADMIN' || actor.role === 'SYSTEM';
}

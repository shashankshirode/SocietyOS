export type StaffOperationsRole =
  | 'HR_ADMIN'
  | 'FACILITY_MANAGER'
  | 'SECURITY_SUPERVISOR'
  | 'GUARD'
  | 'RESIDENT'
  | 'VENDOR_MANAGER'
  | 'SUPER_ADMIN'
  | 'SYSTEM';

export interface StaffOperationsActor {
  userId: string;
  societyId: string;
  role: StaffOperationsRole;
  displayName?: string;
  vendorId?: string;
  unitId?: string;
}

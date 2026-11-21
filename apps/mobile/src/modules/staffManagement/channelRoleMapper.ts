import type { StaffCategory } from '../../shared/types/staff.types';
import type { StaffRoleCode } from '../chat/domain/chat.types';

export function mapStaffCategoryToChatRole(category: StaffCategory): StaffRoleCode | null {
  switch (category) {
    case 'SECURITY_GUARD': return 'securityGuard';
    case 'SECURITY_SUPERVISOR': return 'securitySupervisor';
    case 'FACILITY_STAFF': return 'facilityExecutive';
    case 'OFFICE_STAFF': return 'officeExecutive';
    case 'ACCOUNTS_STAFF': return 'accountant';
    case 'TREASURER': return 'treasurer';
    case 'COMMITTEE_MEMBER': return 'committeeMember';
    case 'SECRETARY': return 'secretary';
    case 'CHAIRPERSON': return 'chairperson';
    case 'SOCIETY_MANAGER': return 'societyManager';
    default: return null;
  }
}

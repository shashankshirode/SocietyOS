import type { ResidentProfile } from '../../../../shared/types/resident.types';
import type { ResidentDashboard, ResidentDashboardDto, ResidentDto } from './resident.dto';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function mapResidentDtoToDomain(dto: ResidentDto): ResidentProfile {
    return {
        id: dto.id,
        name: dto.name ?? 'Resident',
        role: dto.role ?? 'OWNER',
        societyName: dto.societyName ?? 'Society',
        tower: dto.tower ?? '',
        flatNumber: dto.flatNumber ?? '',
        city: dto.city ?? '',
        memberSince: dto.memberSince ?? '',
        ...includeWhenPresent("phone", dto.phone),
        ...includeWhenPresent("email", dto.email)
    };
}
export function mapResidentDashboardDtoToDomain(dto: ResidentDashboardDto): ResidentDashboard {
    return {
        resident: mapResidentDtoToDomain(dto.resident),
        todayVisitors: dto.visitors.filter((visitor) => visitor.status === 'EXPECTED' ||
            visitor.status === 'WAITING_APPROVAL' ||
            visitor.status === 'APPROVED'),
        activeComplaints: dto.complaints.filter((complaint) => complaint.status === 'OPEN' ||
            complaint.status === 'IN_PROGRESS' ||
            complaint.status === 'WAITING_FOR_RESIDENT'),
        ...includeWhenPresent("pendingBill", dto.bills.find((bill) => bill.status === 'DUE' ||
            bill.status === 'OVERDUE' ||
            bill.status === 'PARTIALLY_PAID')),
        ...includeWhenPresent("latestNotice", dto.notices[0])
    };
}


import type { Complaint, CreateComplaintPayload } from '../../../../shared/types/complaint.types';
import type { ComplaintDto, CreateComplaintRequestDto } from './complaint.dto';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function mapComplaintDtoToDomain(dto: ComplaintDto): Complaint {
    return {
        id: dto.id,
        title: dto.title ?? 'Complaint',
        description: dto.description ?? '',
        category: dto.category ?? 'OTHER',
        status: dto.status ?? 'OPEN',
        priority: dto.priority ?? 'MEDIUM',
        location: dto.location ?? '',
        flatNumber: dto.flatNumber ?? '',
        residentName: dto.residentName ?? '',
        createdAt: dto.createdAt ?? new Date().toISOString(),
        updatedAt: dto.updatedAt ?? new Date().toISOString(),
        slaText: dto.slaText ?? '',
        ...includeWhenPresent("assignedTo", dto.assignedTo),
        ...includeWhenPresent("resolutionNote", dto.resolutionNote)
    };
}
export function mapCreateComplaintPayloadToDto(payload: CreateComplaintPayload): CreateComplaintRequestDto {
    return payload;
}


import type { ClearanceChecklistItem, MoveOutRequest } from '../../../../shared/types/moveOut.types';
import type { NocCertificate, NocRequest } from '../../../../shared/types/noc.types';
import type { ClearanceChecklistItemDto, MoveOutRequestDto, NocCertificateDto, NocRequestDto } from './noc.dto';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function mapNocRequestDtoToDomain(dto: NocRequestDto): NocRequest {
    return {
        id: dto.id,
        requestNumber: dto.requestNumber ?? `NOC-${dto.id}`,
        nocType: dto.nocType ?? 'NO_DUES',
        flatNumber: dto.flatNumber ?? '',
        residentName: dto.residentName ?? '',
        submittedDate: dto.submittedDate ?? '',
        requiredByDate: dto.requiredByDate ?? '',
        status: dto.status ?? 'DRAFT',
        reason: dto.reason ?? '',
        ...includeWhenPresent("notes", dto.notes),
        timeline: dto.timeline ?? [],
        ...includeWhenPresent("rejectionReason", dto.rejectionReason),
        ...includeWhenPresent("certificateId", dto.certificateId)
    };
}
export function mapNocCertificateDtoToDomain(dto: NocCertificateDto): NocCertificate {
    return {
        id: dto.id,
        title: dto.title ?? 'NOC Certificate',
        nocType: dto.nocType ?? 'NO_DUES',
        certificateNumber: dto.certificateNumber ?? '',
        societyName: dto.societyName ?? '',
        flatNumber: dto.flatNumber ?? '',
        residentName: dto.residentName ?? '',
        issueDate: dto.issueDate ?? '',
        ...includeWhenPresent("expiryDate", dto.expiryDate),
        issuedBy: dto.issuedBy ?? '',
        clearanceSummary: dto.clearanceSummary ?? '',
        verificationCode: dto.verificationCode ?? '',
        disclaimer: dto.disclaimer ?? ''
    };
}
export function mapClearanceChecklistDtoToDomain(dto: ClearanceChecklistItemDto): ClearanceChecklistItem {
    return {
        id: dto.id,
        title: dto.title ?? '',
        description: dto.description ?? '',
        status: dto.status ?? 'NOT_STARTED',
        responsibleTeam: dto.responsibleTeam ?? '',
        ...includeWhenPresent("lastUpdated", dto.lastUpdated),
        ...includeWhenPresent("actionRequiredLabel", dto.actionRequiredLabel)
    };
}
export function mapMoveOutRequestDtoToDomain(dto: MoveOutRequestDto): MoveOutRequest {
    return {
        id: dto.id,
        requestNumber: dto.requestNumber ?? `MO-${dto.id}`,
        personType: dto.personType ?? 'TENANT',
        flatNumber: dto.flatNumber ?? '',
        proposedMoveOutDate: dto.proposedMoveOutDate ?? '',
        reason: dto.reason ?? '',
        ...includeWhenPresent("newAddress", dto.newAddress),
        contactNumber: dto.contactNumber ?? '',
        vehicleEntryRequired: dto.vehicleEntryRequired ?? false,
        liftSlotRequired: dto.liftSlotRequired ?? false,
        ...includeWhenPresent("moverName", dto.moverName),
        ...includeWhenPresent("notes", dto.notes),
        checklist: (dto.checklist ?? []).map(mapClearanceChecklistDtoToDomain),
        status: dto.status ?? 'PENDING_CLEARANCE'
    };
}


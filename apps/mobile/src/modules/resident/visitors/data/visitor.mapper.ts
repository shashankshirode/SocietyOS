import type { CreateVisitorPayload, Visitor } from '../../../../shared/types/visitor.types';
import type { CreateVisitorPassRequestDto, VisitorDto } from './visitor.dto';
import { createVisitorExitTracking, resolveVisitorCategory } from '../utils/visitorExitPolicyResolver';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function mapVisitorDtoToDomain(dto: VisitorDto): Visitor {
    return {
        id: dto.id,
        name: dto.name ?? 'Visitor',
        phone: dto.phone ?? '',
        type: dto.type ?? 'GUEST',
        status: dto.status ?? 'EXPECTED',
        expectedDate: dto.expectedDate ?? '',
        expectedTime: dto.expectedTime ?? '',
        ...includeWhenPresent("actualEntryTime", dto.actualEntryTime),
        ...includeWhenPresent("actualExitTime", dto.actualExitTime),
        flatNumber: dto.flatNumber ?? '',
        societyName: dto.societyName ?? '',
        purpose: dto.purpose ?? '',
        ...includeWhenPresent("vehicleNumber", dto.vehicleNumber),
        otp: dto.otp ?? '',
        createdAt: dto.createdAt ?? new Date().toISOString(),
        visitorCategory: resolveVisitorCategory(dto.type ?? 'GUEST', dto.purpose),
        exitTracking: createVisitorExitTracking({
            payload: {
                name: dto.name ?? 'Visitor',
                phone: dto.phone ?? '',
                type: dto.type ?? 'GUEST',
                expectedDate: dto.expectedDate ?? '',
                expectedTime: dto.expectedTime ?? '',
                purpose: dto.purpose ?? ''
            },
            nowIso: dto.createdAt ?? new Date().toISOString()
        })
    };
}
export function mapCreateVisitorPayloadToDto(payload: CreateVisitorPayload, context: {
    flatNumber: string;
    societyName: string;
}): CreateVisitorPassRequestDto {
    return {
        ...payload,
        flatNumber: context.flatNumber,
        societyName: context.societyName
    };
}


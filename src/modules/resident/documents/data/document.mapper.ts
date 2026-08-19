import type { DocumentAccessLog, DocumentInfo } from '../../../../shared/types/document.types';
import type { DocumentAccessLogDto, DocumentDto } from './document.dto';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function mapDocumentDtoToDomain(dto: DocumentDto): DocumentInfo {
    return {
        id: dto.id,
        title: dto.title ?? 'Document',
        category: dto.category ?? 'OTHER',
        ...includeWhenPresent("flatNumber", dto.flatNumber),
        status: dto.status ?? 'UPLOADED',
        ...includeWhenPresent("uploadedDate", dto.uploadedDate),
        ...includeWhenPresent("uploadedBy", dto.uploadedBy),
        ...includeWhenPresent("verifiedDate", dto.verifiedDate),
        ...includeWhenPresent("verifiedBy", dto.verifiedBy),
        ...includeWhenPresent("expiryDate", dto.expiryDate),
        fileType: dto.fileType ?? 'pdf',
        fileSize: dto.fileSize ?? '',
        sensitivity: dto.sensitivity ?? 'RESIDENT_ONLY',
        ...includeWhenPresent("description", dto.description),
        ...includeWhenPresent("rejectionReason", dto.rejectionReason),
        ...includeWhenPresent("isSocietyDoc", dto.isSocietyDoc)
    };
}
export function mapDocumentAccessLogDtoToDomain(dto: DocumentAccessLogDto): DocumentAccessLog {
    return {
        id: dto.id,
        documentId: dto.documentId ?? '',
        documentTitle: dto.documentTitle ?? '',
        actorName: dto.actorName ?? '',
        actorRole: dto.actorRole ?? '',
        action: dto.action ?? 'VIEWED',
        timestamp: dto.timestamp ?? '',
        deviceInfo: dto.deviceInfo ?? '',
        ...includeWhenPresent("reason", dto.reason)
    };
}


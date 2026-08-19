import type { Notice } from '../../../../shared/types/notice.types';
import type { NoticeDto } from './notice.dto';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function mapNoticeDtoToDomain(dto: NoticeDto): Notice {
    return {
        id: dto.id,
        title: dto.title ?? 'Notice',
        body: dto.body ?? '',
        category: dto.category ?? 'GENERAL',
        date: dto.date ?? new Date().toISOString(),
        postedBy: dto.postedBy ?? 'Society Admin',
        isImportant: dto.isImportant ?? false,
        priority: dto.priority ?? 'NORMAL',
        status: dto.status ?? 'UNREAD',
        societyName: dto.societyName ?? '',
        ...includeWhenPresent("targetAudience", dto.targetAudience),
        ...includeWhenPresent("attachment", dto.attachment),
        ...includeWhenPresent("acknowledgementRequired", dto.acknowledgementRequired),
        ...includeWhenPresent("acknowledged", dto.acknowledged)
    };
}


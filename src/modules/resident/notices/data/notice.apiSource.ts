import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { Notice } from '../../../../shared/types/notice.types';
import type { NoticeDto } from './notice.dto';
import { mapNoticeDtoToDomain } from './notice.mapper';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { Absent } from "../../../../shared/types/absence.types";
export const noticeApiSource = {
    async list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Notice[]>> {
        try {
            const dtos = await apiClient.get<NoticeDto[]>(apiEndpoints.notices.list);
            return repositorySuccess(dtos.map(mapNoticeDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async detail(context: ResidentRepositoryRequestContext | string, noticeId?: string): Promise<RepositoryResult<Notice | Absent>> {
        try {
            let actualId: string;
            if (typeof context === 'string') {
                actualId = context;
            }
            else {
                actualId = noticeId || '';
            }
            const dto = await apiClient.get<NoticeDto>(apiEndpoints.notices.detail(actualId));
            return repositorySuccess(mapNoticeDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async acknowledge(context: ResidentRepositoryRequestContext | string, noticeId?: string): Promise<RepositoryResult<Notice | Absent>> {
        try {
            let actualId: string;
            if (typeof context === 'string') {
                actualId = context;
            }
            else {
                actualId = noticeId || '';
            }
            const dto = await apiClient.post<NoticeDto>(apiEndpoints.notices.acknowledge(actualId), {}, { idempotencyKey: createIdempotencyKey('notice-acknowledge') });
            return repositorySuccess(mapNoticeDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async create(context: ResidentRepositoryRequestContext | Partial<Notice>, payload?: Partial<Notice>): Promise<RepositoryResult<Notice>> {
        try {
            let actualPayload: Partial<Notice>;
            if (payload) {
                actualPayload = payload;
            }
            else {
                actualPayload = context as Partial<Notice>;
            }
            const requestBody: JsonObject = {
                ...actualPayload.id ? { id: actualPayload.id } : {},
                ...actualPayload.title ? { title: actualPayload.title } : {},
                ...actualPayload.body ? { body: actualPayload.body } : {},
                ...actualPayload.category ? { category: actualPayload.category } : {},
                ...actualPayload.date ? { date: actualPayload.date } : {},
                ...actualPayload.postedBy ? { postedBy: actualPayload.postedBy } : {},
                ...actualPayload.priority ? { priority: actualPayload.priority } : {},
                ...actualPayload.status ? { status: actualPayload.status } : {},
                ...actualPayload.societyName ? { societyName: actualPayload.societyName } : {},
                ...actualPayload.targetAudience ? { targetAudience: actualPayload.targetAudience } : {},
                ...actualPayload.attachment ? { attachment: {
                    name: actualPayload.attachment.name,
                    type: actualPayload.attachment.type,
                    size: actualPayload.attachment.size,
                } } : {},
                ...actualPayload.acknowledgementRequired === undefined ? {} : { acknowledgementRequired: actualPayload.acknowledgementRequired },
                ...actualPayload.isImportant === undefined ? {} : { isImportant: actualPayload.isImportant },
            };
            const dto = await apiClient.post<NoticeDto>(apiEndpoints.notices.list, requestBody);
            return repositorySuccess(mapNoticeDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
};
export default noticeApiSource;

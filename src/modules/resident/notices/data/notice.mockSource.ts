import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { Notice } from '../../../../shared/types/notice.types';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { matchesResidentRepositoryContext } from '../../homeContext/utils/matchesResidentRepositoryContext';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import type { Absent } from "../../../../shared/types/absence.types";
export const noticeMockSource = {
    async list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Notice[]>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const all = mockStore.getState().notices;
        const scoped = all.filter((notice) => matchesResidentRepositoryContext(notice, ctx));
        return repositorySuccess(scoped);
    },
    async detail(context: ResidentRepositoryRequestContext | string, noticeId?: string): Promise<RepositoryResult<Notice | Absent>> {
        await withMockDelay();
        let actualId: string;
        if (typeof context === 'string') {
            actualId = context;
        }
        else {
            actualId = noticeId || '';
        }
        const requestContext = typeof context === 'string' ? resolveRequestContext() : context;
        return repositorySuccess(mockStore.getState().notices.find((notice) => notice.id === actualId && matchesResidentRepositoryContext(notice, requestContext)));
    },
    async acknowledge(context: ResidentRepositoryRequestContext | string, noticeId?: string): Promise<RepositoryResult<Notice | Absent>> {
        await withMockDelay();
        let actualId: string;
        if (typeof context === 'string') {
            actualId = context;
        }
        else {
            actualId = noticeId || '';
        }
        mockStore.updateNotice(actualId, {
            acknowledged: true,
            status: 'READ',
        });
        const updated = mockStore.getState().notices.find((notice) => notice.id === actualId);
        return repositorySuccess(updated);
    },
    async create(context: ResidentRepositoryRequestContext | Partial<Notice>, payload?: Partial<Notice>): Promise<RepositoryResult<Notice>> {
        await withMockDelay();
        let actualContext: ResidentRepositoryRequestContext;
        let actualPayload: Partial<Notice>;
        if (payload) {
            actualContext = context as ResidentRepositoryRequestContext;
            actualPayload = payload;
        }
        else {
            actualContext = resolveRequestContext();
            actualPayload = context as Partial<Notice>;
        }
        const newNotice: Notice = {
            id: `notice-${Date.now()}`,
            title: actualPayload.title || 'Untitled Notice',
            body: actualPayload.body || '',
            category: actualPayload.category || 'GENERAL',
            date: getRequiredItem(new Date().toISOString().split('T'), 0, "notice.mockSource.ts"),
            postedBy: actualPayload.postedBy || 'Society Office',
            isImportant: actualPayload.isImportant || false,
            priority: actualPayload.priority || 'NORMAL',
            status: 'UNREAD',
            societyName: actualContext.activeHome.societyName,
            targetAudience: actualPayload.targetAudience || 'All Residents',
            acknowledgementRequired: actualPayload.acknowledgementRequired || false,
            acknowledged: false,
            homeContextId: actualContext.activeHome.homeContextId,
            societyId: actualContext.activeHome.societyId,
            unitId: actualContext.activeHome.unitId,
            dataScopeKey: actualContext.dataScopeKey,
        };
        mockStore.addNotice(newNotice);
        return repositorySuccess(newNotice);
    },
};
export default noticeMockSource;


import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { Complaint, ComplaintStatus, CreateComplaintPayload } from '../../../../shared/types/complaint.types';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { matchesResidentRepositoryContext } from '../../homeContext/utils/matchesResidentRepositoryContext';
import type { Absent } from "../../../../shared/types/absence.types";
export const complaintMockSource = {
    async list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Complaint[]>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const all = mockStore.getState().complaints;
        const scoped = all.filter((complaint) => matchesResidentRepositoryContext(complaint, ctx));
        return repositorySuccess(scoped);
    },
    async detail(context: ResidentRepositoryRequestContext | string, complaintId?: string): Promise<RepositoryResult<Complaint | Absent>> {
        await withMockDelay();
        let actualId: string;
        if (typeof context === 'string') {
            actualId = context;
        }
        else {
            actualId = complaintId || '';
        }
        const requestContext = typeof context === 'string' ? resolveRequestContext() : context;
        return repositorySuccess(mockStore.getState().complaints.find((complaint) => complaint.id === actualId && matchesResidentRepositoryContext(complaint, requestContext)));
    },
    async create(context: ResidentRepositoryRequestContext | CreateComplaintPayload, payload?: CreateComplaintPayload): Promise<RepositoryResult<Complaint>> {
        await withMockDelay();
        let actualContext: ResidentRepositoryRequestContext;
        let actualPayload: CreateComplaintPayload;
        if (payload) {
            actualContext = context as ResidentRepositoryRequestContext;
            actualPayload = payload;
        }
        else {
            actualContext = resolveRequestContext();
            actualPayload = context as CreateComplaintPayload;
        }
        const newComplaint: Complaint = {
            id: `comp-${Date.now()}`,
            title: actualPayload.title.trim(),
            description: actualPayload.description.trim(),
            category: actualPayload.category,
            status: 'OPEN',
            priority: actualPayload.priority,
            location: actualPayload.location.trim(),
            flatNumber: actualContext.activeHome.flatNumber,
            residentName: actualContext.activeHome.residentRole === 'tenant' ? 'Amit' : 'Shashank',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            slaText: 'Resolution within 48 hours',
            isPrivate: actualPayload.isPrivate ?? false,
            homeContextId: actualContext.activeHome.homeContextId,
            societyId: actualContext.activeHome.societyId,
            unitId: actualContext.activeHome.unitId,
            dataScopeKey: actualContext.dataScopeKey,
            updates: [
                {
                    id: `update-${Date.now()}`,
                    status: 'OPEN',
                    note: 'Complaint registered successfully.',
                    timestamp: new Date().toISOString(),
                },
            ],
        };
        mockStore.addComplaint(newComplaint);
        return repositorySuccess(newComplaint);
    },
    async updateStatus(id: string, status: ComplaintStatus, note?: string): Promise<RepositoryResult<Complaint>> {
        await withMockDelay();
        const complaint = mockStore.getState().complaints.find((item) => item.id === id);
        if (!complaint) {
            throw new Error('Complaint not found');
        }
        const newUpdates = [
            ...(complaint.updates || []),
            {
                id: `update-${Date.now()}`,
                status,
                note: note || `Status updated to ${status}.`,
                timestamp: new Date().toISOString(),
            },
        ];
        mockStore.updateComplaint(id, {
            status,
            updates: newUpdates,
            updatedAt: new Date().toISOString(),
        });
        return repositorySuccess(mockStore.getState().complaints.find((item) => item.id === id)!);
    },
};
export default complaintMockSource;


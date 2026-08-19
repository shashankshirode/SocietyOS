import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { mockMoveOutChecklist } from '../../../../shared/mock/moveOut.mock';
import { mockNocCertificates } from '../../../../shared/mock/nocRequests.mock';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { ClearanceChecklistItem, MoveOutRequest } from '../../../../shared/types/moveOut.types';
import type { NocCertificate, NocRequest, NocType } from '../../../../shared/types/noc.types';
import type { CreateNocRequestInput, MoveOutRequestInput } from './noc.dto';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { matchesResidentRepositoryContext } from '../../homeContext/utils/matchesResidentRepositoryContext';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
export const nocMockSource = {
    async listRequests(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<NocRequest[]>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const all = mockStore.getState().nocs;
        const scoped = all.filter((request) => matchesResidentRepositoryContext(request, ctx));
        return repositorySuccess(scoped);
    },
    async requestDetail(context: ResidentRepositoryRequestContext | string, requestId?: string): Promise<RepositoryResult<NocRequest | Absent>> {
        await withMockDelay();
        let actualId: string;
        if (typeof context === 'string') {
            actualId = context;
        }
        else {
            actualId = requestId || '';
        }
        const requestContext = typeof context === 'string' ? resolveRequestContext() : context;
        const noc = mockStore.getState().nocs.find((request) => request.id === actualId && matchesResidentRepositoryContext(request, requestContext));
        return repositorySuccess(noc);
    },
    async createRequest(context: ResidentRepositoryRequestContext | CreateNocRequestInput, input?: CreateNocRequestInput): Promise<RepositoryResult<NocRequest>> {
        await withMockDelay();
        let actualContext: ResidentRepositoryRequestContext;
        let actualInput: CreateNocRequestInput;
        if (input) {
            actualContext = context as ResidentRepositoryRequestContext;
            actualInput = input;
        }
        else {
            actualContext = resolveRequestContext();
            actualInput = context as CreateNocRequestInput;
        }
        const newNoc: NocRequest = {
            id: `noc-${Date.now()}`,
            requestNumber: `NOC-${Date.now()}`,
            nocType: actualInput.nocType as NocType,
            flatNumber: actualContext.activeHome.flatNumber,
            residentName: actualContext.activeHome.residentRole === 'tenant' ? 'Amit' : 'Shashank',
            submittedDate: getRequiredItem(new Date().toISOString().split('T'), 0, "noc.mockSource.ts"),
            requiredByDate: actualInput.requiredByDate,
            status: 'DRAFT',
            reason: actualInput.reason,
            ...includeWhenPresent("notes", actualInput.notes),
            timeline: [{ title: 'Draft Created', status: 'CURRENT', actor: actualContext.activeHome.residentRole === 'tenant' ? 'Amit' : 'Shashank' }],
            homeContextId: actualContext.activeHome.homeContextId,
            societyId: actualContext.activeHome.societyId,
            unitId: actualContext.activeHome.unitId,
            dataScopeKey: actualContext.dataScopeKey
        };
        mockStore.addNoc(newNoc);
        return repositorySuccess(newNoc);
    },
    async certificate(context: JsonValue, certificateId?: string): Promise<RepositoryResult<NocCertificate | Absent>> {
        await withMockDelay();
        let actualId = certificateId;
        if (typeof context === 'string') {
            actualId = context;
        }
        return repositorySuccess(mockNocCertificates.find((certificateItem) => certificateItem.id === actualId) ?? getRequiredItem(mockNocCertificates, 0, "noc.mockSource.ts"));
    },
    async createMoveOut(context: ResidentRepositoryRequestContext | MoveOutRequestInput, input?: MoveOutRequestInput): Promise<RepositoryResult<MoveOutRequest>> {
        await withMockDelay();
        let actualContext: ResidentRepositoryRequestContext;
        let actualInput: MoveOutRequestInput;
        if (input) {
            actualContext = context as ResidentRepositoryRequestContext;
            actualInput = input;
        }
        else {
            actualContext = resolveRequestContext();
            actualInput = context as MoveOutRequestInput;
        }
        return repositorySuccess({
            id: `mo-${Date.now()}`,
            requestNumber: `MO-${Date.now()}`,
            personType: actualInput.personType === 'OWNER' ? 'OWNER' : 'TENANT',
            flatNumber: actualContext.activeHome.flatNumber,
            proposedMoveOutDate: actualInput.proposedMoveOutDate,
            reason: actualInput.reason,
            contactNumber: actualInput.contactNumber,
            vehicleEntryRequired: false,
            liftSlotRequired: false,
            status: 'PENDING_CLEARANCE',
            checklist: mockMoveOutChecklist
        });
    },
    async moveOutClearance(moveOutRequestId: string): Promise<RepositoryResult<ClearanceChecklistItem[]>> {
        await withMockDelay();
        return repositorySuccess(mockMoveOutChecklist);
    }
};
export default nocMockSource;


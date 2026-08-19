import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { getMockRequestContext } from '../../../../core/api/requestContext';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ConfirmVisitorLeftInput, ConfirmVisitorStillInsideInput, ContactSecurityForVisitorExitInput, CreateVisitorPayload, ExtendVisitorExpectedExitInput, Visitor, VisitorExitAlert, VisitorExitEscalationResult, CancelVisitorPassRequest, CancelVisitorPassResult } from '../../../../shared/types/visitor.types';
import type { VisitorDto } from './visitor.dto';
import { mapCreateVisitorPayloadToDto, mapVisitorDtoToDomain } from './visitor.mapper';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { Absent } from "../../../../shared/types/absence.types";
export const visitorsApiSource = {
    async list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Visitor[]>> {
        try {
            const dtos = await apiClient.get<VisitorDto[]>(apiEndpoints.visitors.list);
            return repositorySuccess(dtos.map(mapVisitorDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async detail(context: ResidentRepositoryRequestContext | string, visitorPassId?: string): Promise<RepositoryResult<Visitor | Absent>> {
        try {
            let actualPassId: string;
            if (typeof context === 'string') {
                actualPassId = context;
            }
            else {
                actualPassId = visitorPassId || '';
            }
            const dto = await apiClient.get<VisitorDto>(apiEndpoints.visitors.detail(actualPassId));
            return repositorySuccess(mapVisitorDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async create(context: ResidentRepositoryRequestContext | CreateVisitorPayload, payload?: CreateVisitorPayload): Promise<RepositoryResult<Visitor>> {
        try {
            let actualPayload: CreateVisitorPayload;
            if (payload) {
                actualPayload = payload;
            }
            else {
                actualPayload = context as CreateVisitorPayload;
            }
            const reqContext = getMockRequestContext();
            const dto = await apiClient.post<VisitorDto>(apiEndpoints.visitors.preapprove, mapCreateVisitorPayloadToDto(actualPayload, {
                flatNumber: reqContext.unitId ?? '',
                societyName: reqContext.societyId ?? '',
            }), { idempotencyKey: createIdempotencyKey('visitor-preapprove') });
            return repositorySuccess(mapVisitorDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async updateStatus(id: string, status: string): Promise<RepositoryResult<Visitor>> {
        try {
            const dto = await apiClient.post<VisitorDto>(apiEndpoints.visitors.detail(id) + '/status', { status });
            return repositorySuccess(mapVisitorDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getVisitorExitAlerts(): Promise<RepositoryResult<VisitorExitAlert[]>> {
        try {
            const alerts = await apiClient.get<VisitorExitAlert[]>(apiEndpoints.visitors.exitAlerts);
            return repositorySuccess(alerts);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async confirmVisitorLeft(input: ConfirmVisitorLeftInput): Promise<RepositoryResult<Visitor>> {
        try {
            const dto = await apiClient.post<VisitorDto>(apiEndpoints.visitors.confirmExitLeft(input.visitorPassId), input);
            return repositorySuccess(mapVisitorDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async confirmVisitorStillInside(input: ConfirmVisitorStillInsideInput): Promise<RepositoryResult<Visitor>> {
        try {
            const dto = await apiClient.post<VisitorDto>(apiEndpoints.visitors.confirmExitStillInside(input.visitorPassId), input);
            return repositorySuccess(mapVisitorDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async extendVisitorExpectedExit(input: ExtendVisitorExpectedExitInput): Promise<RepositoryResult<Visitor>> {
        try {
            const dto = await apiClient.post<VisitorDto>(apiEndpoints.visitors.extendExit(input.visitorPassId), input);
            return repositorySuccess(mapVisitorDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async contactSecurityForVisitorExit(input: ContactSecurityForVisitorExitInput): Promise<RepositoryResult<VisitorExitEscalationResult>> {
        try {
            const result = await apiClient.post<VisitorExitEscalationResult>(apiEndpoints.visitors.contactSecurityForExit(input.visitorPassId), input);
            return repositorySuccess(result);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async cancelVisitorPass(context: ResidentRepositoryRequestContext | CancelVisitorPassRequest, request?: CancelVisitorPassRequest): Promise<RepositoryResult<CancelVisitorPassResult>> {
        try {
            const actualRequest = request || (context as CancelVisitorPassRequest);
            const result = await apiClient.post<CancelVisitorPassResult>(apiEndpoints.visitors.cancel(actualRequest.visitorPassId), {
                residenceId: actualRequest.residenceId,
                visitorPassId: actualRequest.visitorPassId,
                reason: actualRequest.reason,
                notes: actualRequest.notes,
                requestedAt: actualRequest.requestedAt,
            });
            return repositorySuccess(result);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
};
export default visitorsApiSource;

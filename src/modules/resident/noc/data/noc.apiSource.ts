import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ClearanceChecklistItem, MoveOutRequest } from '../../../../shared/types/moveOut.types';
import type { NocCertificate, NocRequest } from '../../../../shared/types/noc.types';
import type { ClearanceChecklistItemDto, CreateNocRequestInput, MoveOutRequestDto, MoveOutRequestInput, NocCertificateDto, NocRequestDto } from './noc.dto';
import { mapClearanceChecklistDtoToDomain, mapMoveOutRequestDtoToDomain, mapNocCertificateDtoToDomain, mapNocRequestDtoToDomain } from './noc.mapper';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { Absent } from "../../../../shared/types/absence.types";
export const nocApiSource = {
    async listRequests(): Promise<RepositoryResult<NocRequest[]>> {
        try {
            const dtos = await apiClient.get<NocRequestDto[]>(apiEndpoints.noc.requests);
            return repositorySuccess(dtos.map(mapNocRequestDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async requestDetail(context: ResidentRepositoryRequestContext | string, requestId?: string): Promise<RepositoryResult<NocRequest | Absent>> {
        try {
            let actualId: string;
            if (typeof context === 'string') {
                actualId = context;
            }
            else {
                actualId = requestId || '';
            }
            const dto = await apiClient.get<NocRequestDto>(apiEndpoints.noc.requestDetail(actualId));
            return repositorySuccess(mapNocRequestDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async createRequest(context: ResidentRepositoryRequestContext | CreateNocRequestInput, input?: CreateNocRequestInput): Promise<RepositoryResult<NocRequest>> {
        try {
            let actualInput: CreateNocRequestInput;
            if (input) {
                actualInput = input;
            }
            else {
                actualInput = context as CreateNocRequestInput;
            }
            const dto = await apiClient.post<NocRequestDto>(apiEndpoints.noc.createRequest, actualInput, { idempotencyKey: createIdempotencyKey('noc-request') });
            return repositorySuccess(mapNocRequestDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async certificate(context: JsonValue, certificateId?: string): Promise<RepositoryResult<NocCertificate | Absent>> {
        try {
            let actualId = certificateId;
            if (typeof context === 'string') {
                actualId = context;
            }
            const dto = await apiClient.get<NocCertificateDto>(apiEndpoints.noc.certificate(actualId ?? ''));
            return repositorySuccess(mapNocCertificateDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async createMoveOut(context: ResidentRepositoryRequestContext | MoveOutRequestInput, input?: MoveOutRequestInput): Promise<RepositoryResult<MoveOutRequest>> {
        try {
            let actualInput: MoveOutRequestInput;
            if (input) {
                actualInput = input;
            }
            else {
                actualInput = context as MoveOutRequestInput;
            }
            const dto = await apiClient.post<MoveOutRequestDto>(apiEndpoints.move.createMoveOut, actualInput, { idempotencyKey: createIdempotencyKey('move-out-request') });
            return repositorySuccess(mapMoveOutRequestDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async moveOutClearance(moveOutRequestId: string): Promise<RepositoryResult<ClearanceChecklistItem[]>> {
        try {
            const dtos = await apiClient.get<ClearanceChecklistItemDto[]>(apiEndpoints.move.moveOutClearanceChecklist(moveOutRequestId));
            return repositorySuccess(dtos.map(mapClearanceChecklistDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
};


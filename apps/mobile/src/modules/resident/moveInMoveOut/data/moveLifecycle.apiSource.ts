import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import {
  repositoryErrorFromUnknown,
  repositoryFailure,
  repositorySuccess,
  type RepositoryResult,
} from '../../../../core/repositories/repository.types';
import type { MoveInRequestState } from '../domain/types/moveIn.types';
import type { MoveOutRequestState } from '../domain/types/moveOut.types';
import type { NocRequestState } from '../domain/types/noc.types';
import type {
  CreateMoveInRequestBody,
  CreateMoveOutRequestBody,
  MoveInRequestDto,
  MoveOutClearanceChecklistDto,
  MoveOutRequestDto,
  NocRequestDto,
} from './moveLifecycle.dto';
import {
  mapMoveInDto,
  mapMoveOutDto,
  mapNocRequestDto,
} from './moveLifecycle.mapper';

export const moveLifecycleApiSource = {
  async listMoveInRequests(): Promise<RepositoryResult<MoveInRequestState[]>> {
    try {
      const dtos = await apiClient.get<MoveInRequestDto[]>(apiEndpoints.move.createMoveIn);
      return repositorySuccess(dtos.map(mapMoveInDto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async getMoveInRequest(requestId: string): Promise<RepositoryResult<MoveInRequestState>> {
    try {
      const dto = await apiClient.get<MoveInRequestDto>(apiEndpoints.move.moveInDetail(requestId));
      return repositorySuccess(mapMoveInDto(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async createMoveInRequest(
    body: Omit<CreateMoveInRequestBody, 'idempotencyKey'>,
  ): Promise<RepositoryResult<MoveInRequestState>> {
    try {
      const idempotencyKey = createIdempotencyKey('move-in');
      const dto = await apiClient.post<MoveInRequestDto>(
        apiEndpoints.move.createMoveIn,
        { ...body, idempotencyKey },
        { idempotencyKey },
      );
      return repositorySuccess(mapMoveInDto(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async submitMoveInRequest(
    requestId: string,
  ): Promise<RepositoryResult<MoveInRequestState>> {
    try {
      const dto = await apiClient.post<MoveInRequestDto>(
        apiEndpoints.occupancy.submitMoveInRequest(requestId),
        undefined,
        { idempotencyKey: createIdempotencyKey('move-in-submit') },
      );
      return repositorySuccess(mapMoveInDto(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async cancelMoveInRequest(requestId: string, reasonKey: string): Promise<RepositoryResult<MoveInRequestState>> {
    try {
      const dto = await apiClient.post<MoveInRequestDto>(
        apiEndpoints.occupancy.cancelMoveInRequest(requestId),
        { reasonKey },
        { idempotencyKey: createIdempotencyKey('move-in-cancel') },
      );
      return repositorySuccess(mapMoveInDto(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async listMoveOutRequests(): Promise<RepositoryResult<MoveOutRequestState[]>> {
    try {
      const dtos = await apiClient.get<MoveOutRequestDto[]>(apiEndpoints.move.createMoveOut);
      return repositorySuccess(dtos.map(mapMoveOutDto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async getMoveOutRequest(requestId: string): Promise<RepositoryResult<MoveOutRequestState>> {
    try {
      const dto = await apiClient.get<MoveOutRequestDto>(apiEndpoints.move.moveOutDetail(requestId));
      return repositorySuccess(mapMoveOutDto(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async createMoveOutRequest(
    body: Omit<CreateMoveOutRequestBody, 'idempotencyKey'>,
  ): Promise<RepositoryResult<MoveOutRequestState>> {
    try {
      const idempotencyKey = createIdempotencyKey('move-out');
      const dto = await apiClient.post<MoveOutRequestDto>(
        apiEndpoints.move.createMoveOut,
        { ...body, idempotencyKey },
        { idempotencyKey },
      );
      return repositorySuccess(mapMoveOutDto(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async submitMoveOutRequest(requestId: string): Promise<RepositoryResult<MoveOutRequestState>> {
    try {
      const dto = await apiClient.post<MoveOutRequestDto>(
        apiEndpoints.move.submitMoveOut(requestId),
        undefined,
        { idempotencyKey: createIdempotencyKey('move-out-submit') },
      );
      return repositorySuccess(mapMoveOutDto(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async cancelMoveOutRequest(requestId: string, reasonKey: string): Promise<RepositoryResult<MoveOutRequestState>> {
    try {
      const dto = await apiClient.post<MoveOutRequestDto>(
        apiEndpoints.move.cancelMoveOut(requestId),
        { reasonKey },
        { idempotencyKey: createIdempotencyKey('move-out-cancel') },
      );
      return repositorySuccess(mapMoveOutDto(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async getMoveOutClearanceChecklist(
    requestId: string,
  ): Promise<RepositoryResult<MoveOutClearanceChecklistDto>> {
    try {
      const dto = await apiClient.get<MoveOutClearanceChecklistDto>(
        apiEndpoints.move.moveOutClearanceChecklist(requestId),
      );
      return repositorySuccess(dto);
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async listNocRequests(): Promise<RepositoryResult<NocRequestState[]>> {
    try {
      const dtos = await apiClient.get<NocRequestDto[]>(apiEndpoints.noc.requests);
      return repositorySuccess(dtos.map(mapNocRequestDto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async getNocRequest(requestId: string): Promise<RepositoryResult<NocRequestState>> {
    try {
      const dto = await apiClient.get<NocRequestDto>(apiEndpoints.noc.requestDetail(requestId));
      return repositorySuccess(mapNocRequestDto(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },
};

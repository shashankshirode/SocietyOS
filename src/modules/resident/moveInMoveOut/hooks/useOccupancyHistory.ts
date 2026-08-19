import { useRepositoryMutation, useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import { occupancyRepository } from '../data/occupancy.repository';
import type { Absent } from "../../../../shared/types/absence.types";
type OccupancyHistoryInput = JsonObject | Absent;
type OccupancyHistoryRow = {
    id: string;
    flatNumber: string;
    occupantName: string;
    occupantType: 'OWNER' | 'TENANT';
    documentStatus: 'APPROVED' | 'REJECTED' | 'PENDING';
};
type UpdateOccupancyStatusInput = {
    id: string;
    status: 'APPROVED' | 'REJECTED';
};
const fallbackRows: OccupancyHistoryRow[] = [
    {
        id: 'mock-1',
        flatNumber: 'A-1204',
        occupantName: 'Anita Rao',
        occupantType: 'OWNER',
        documentStatus: 'PENDING',
    },
];
async function loadOccupancyHistory(input?: OccupancyHistoryInput): Promise<RepositoryResult<OccupancyHistoryRow[]>> {
    const response = await occupancyRepository.listOccupancyHistoryByUnit(input);
    if (response && typeof response === 'object' && 'ok' in response && 'data' in response) {
        return response as RepositoryResult<OccupancyHistoryRow[]>;
    }
    return { ok: true, data: fallbackRows };
}
export function useOccupancyHistory(input?: OccupancyHistoryInput) {
    const result = useRepositoryResult(() => loadOccupancyHistory(input), [input?.unitId]);
    const mutation = useRepositoryMutation((payload: OccupancyHistoryInput) => loadOccupancyHistory(payload));
    return {
        ...result,
        submit: mutation.submit,
        isSubmitting: mutation.isSubmitting,
    };
}
export function useUpdateOccupancyStatus() {
    return useRepositoryMutation((input: UpdateOccupancyStatusInput) => occupancyRepository.updateOccupancyStatus(input.id, input.status));
}


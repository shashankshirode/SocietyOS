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
    const payload = input ? (input as JsonObject) : undefined;
    const response = await occupancyRepository.listOccupancyHistoryByUnit(payload);
    if (response.ok) {
        if (Array.isArray(response.data)) {
            const rows: OccupancyHistoryRow[] = response.data.map(item => ({
                id: typeof item.id === 'string' ? item.id : 'unknown',
                flatNumber: typeof item.flatNumber === 'string' ? item.flatNumber : '',
                occupantName: typeof item.occupantName === 'string' ? item.occupantName : (typeof item.name === 'string' ? item.name : ''),
                occupantType: (item.occupantType === 'TENANT' ? 'TENANT' : 'OWNER') as OccupancyHistoryRow['occupantType'],
                documentStatus: (item.documentStatus === 'APPROVED' || item.documentStatus === 'REJECTED' ? item.documentStatus : 'PENDING') as OccupancyHistoryRow['documentStatus'],
            }));
            return { ok: true, data: rows };
        }
        return { ok: true, data: fallbackRows };
    }
    return response;
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


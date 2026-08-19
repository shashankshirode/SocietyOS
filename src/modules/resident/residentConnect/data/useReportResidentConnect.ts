import { useRepositoryMutation, useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';
import type { ReportCategory } from '../../../../shared/types/privacy.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function useReportResidentConnect() {
    return useRepositoryMutation((payload: {
        targetId: string;
        category: ReportCategory;
        description: string;
        contextText?: string;
    }) => residentConnectRepository.reportMessage(payload.targetId, {
        category: payload.category,
        description: payload.description,
        ...includeWhenPresent("contextText", payload.contextText)
    }));
}
export function useModerationReports() {
    return useRepositoryResult(() => residentConnectRepository.getReportedItems(), []);
}


import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import type { ResidentContextualInsightsRepository, GetResidentContextualInsightsInput, GetAreaWeatherSnapshotInput, GetLocalAdvisoriesInput, DismissContextualSuggestionInput, } from './residentContextualInsights.repository.types';
import type { ResidentContextualInsightsResult, AreaWeatherSnapshot, LocalAreaAdvisory, } from './residentContextualInsights.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export const residentContextualInsightsApiSource: ResidentContextualInsightsRepository = {
    getContextualInsights: async (input: GetResidentContextualInsightsInput): Promise<ResidentContextualInsightsResult> => {
        return apiClient.get(apiEndpoints.resident.contextualInsights, {
            query: { societyId: input.societyId, unitId: input.unitId }
        });
    },
    getAreaWeatherSnapshot: async (input: GetAreaWeatherSnapshotInput): Promise<AreaWeatherSnapshot> => {
        return apiClient.get(apiEndpoints.areas.weatherSnapshot(input.areaId));
    },
    getLocalAdvisories: async (input: GetLocalAdvisoriesInput): Promise<LocalAreaAdvisory[]> => {
        return apiClient.get(apiEndpoints.areas.localAdvisories(input.areaId), {
            ...includeWhenPresent("query", input.societyId ? { societyId: input.societyId } : undefined)
        });
    },
    dismissSuggestion: async (input: DismissContextualSuggestionInput): Promise<ResidentContextualInsightsResult> => {
        return apiClient.post(apiEndpoints.resident.dismissContextualInsight(input.suggestionId), { societyId: input.societyId, unitId: input.unitId }, { idempotencyKey: createIdempotencyKey(`dismiss-contextual-insight-${input.suggestionId}`) });
    }
};
export default residentContextualInsightsApiSource;


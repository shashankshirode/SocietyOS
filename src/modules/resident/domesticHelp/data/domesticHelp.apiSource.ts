import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { mapContextRoleToAppRole } from '../../homeContext/utils/residentHomeContextPermissions';
import type { DomesticHelpAccessInput, DomesticHelpServiceActionInput, ResidentDomesticHelpProfile } from './domesticHelp.types';
import type { Absent } from "../../../../shared/types/absence.types";
function requestContext(context: ResidentRepositoryRequestContext) {
    return {
        societyId: context.activeHome.societyId,
        unitId: context.activeHome.unitId,
        residentProfileId: context.activeHome.residentId,
        activeRole: mapContextRoleToAppRole(context.activeHome.residentRole),
    };
}
export const domesticHelpApiSource = {
    async list(context: ResidentRepositoryRequestContext): Promise<RepositoryResult<ResidentDomesticHelpProfile[]>> {
        try {
            const data = await apiClient.get<ResidentDomesticHelpProfile[]>(apiEndpoints.staffAttendance.unitDomesticHelp(context.activeHome.unitId), { context: requestContext(context) });
            return repositorySuccess(data.filter((record) => record.dataScopeKey === context.dataScopeKey && record.serviceStatus !== 'removed'));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async detail(context: ResidentRepositoryRequestContext, domesticHelpId: string): Promise<RepositoryResult<ResidentDomesticHelpProfile | Absent>> {
        try {
            const data = await apiClient.get<ResidentDomesticHelpProfile>(apiEndpoints.staffAttendance.domesticHelpDetail(domesticHelpId), { context: requestContext(context) });
            return repositorySuccess(data.dataScopeKey === context.dataScopeKey ? data : undefined);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async setAccess(input: DomesticHelpAccessInput): Promise<RepositoryResult<ResidentDomesticHelpProfile | Absent>> {
        try {
            const data = await apiClient.patch<ResidentDomesticHelpProfile>(apiEndpoints.staffAttendance.updateDomesticHelp(input.domesticHelpId), { accessStatus: input.accessStatus }, {
                context: requestContext(input.context),
                idempotencyKey: createIdempotencyKey(`domestic-help-access-${input.domesticHelpId}-${input.accessStatus}`),
            });
            return repositorySuccess(data.dataScopeKey === input.context.dataScopeKey ? data : undefined);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async applyServiceAction(input: DomesticHelpServiceActionInput): Promise<RepositoryResult<ResidentDomesticHelpProfile | Absent>> {
        try {
            const data = await apiClient.patch<ResidentDomesticHelpProfile>(apiEndpoints.staffAttendance.updateDomesticHelp(input.domesticHelpId), { serviceAction: input.action }, {
                context: requestContext(input.context),
                idempotencyKey: createIdempotencyKey(`domestic-help-service-${input.domesticHelpId}-${input.action.type}`),
            });
            return repositorySuccess(data.dataScopeKey === input.context.dataScopeKey ? data : undefined);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
};


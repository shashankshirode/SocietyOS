import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult, } from '../../../../core/repositories/repository.types';
import type { Bill } from '../../../../shared/types/bill.types';
import type { BillDto, MockPaymentConfirmation, ResidentBillListPageDto } from './bill.dto';
import { billDtoDecoder, residentBillListPageDtoDecoder, mockPaymentConfirmationDecoder } from './bill.dto';
import { decodeOrThrow } from '../../../../core/api/decoders';
import { mapBillDtoToDomain } from './bill.mapper';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { AppRole } from '../../../../core/permissions/permission.types';
import type { ResidentBillingRepository } from './residentBilling.repository.types';
import type { ResidentBillListPage, ResidentBillingSummary, ResidentLedgerPage, } from './residentBilling.types';
import type { Absent } from "../../../../shared/types/absence.types";

function requestContext(context: ResidentRepositoryRequestContext) {
    const role: AppRole = context.activeHome.residentRole === 'tenant'
        ? 'RESIDENT_TENANT'
        : context.activeHome.residentRole === 'familyMember' || context.activeHome.residentRole === 'authorizedOccupant'
            ? 'RESIDENT_FAMILY'
            : 'RESIDENT_OWNER';
    return {
        societyId: context.activeHome.societyId,
        unitId: context.activeHome.unitId,
        activeRole: role,
    };
}
const residentBillingApiRepository: ResidentBillingRepository = {
    async getBillSummary(context) {
        try {
            const summary = await apiClient.get<ResidentBillingSummary>(apiEndpoints.billing.residentSummary, { context: requestContext(context) });
            return repositorySuccess(summary);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getBillsPage(context, request) {
        try {
            const raw = await apiClient.get<unknown>(apiEndpoints.billing.residentBills, {
                context: requestContext(context),
                query: {
                    filter: request.filter,
                    cursor: request.cursor ?? undefined,
                    pageSize: request.pageSize,
                },
            });
            const page = decodeOrThrow(residentBillListPageDtoDecoder, raw, 'billing.residentBills');
            const result: ResidentBillListPage = {
                bills: page.bills.map(mapBillDtoToDomain),
                nextCursor: page.nextCursor,
                hasMore: page.hasMore,
            };
            return repositorySuccess(result);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getBillDetail(context, billId) {
        try {
            const raw = await apiClient.get<unknown>(apiEndpoints.billing.residentBillDetail(billId), { context: requestContext(context) });
            const dto = decodeOrThrow(billDtoDecoder, raw, `billing.detail(${billId})`);
            return repositorySuccess(mapBillDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getLedgerEntriesPage(context, request) {
        try {
            const page = await apiClient.get<ResidentLedgerPage>(apiEndpoints.billing.residentLedger, {
                context: requestContext(context),
                query: {
                    cursor: request.cursor ?? undefined,
                    pageSize: request.pageSize,
                },
            });
            return repositorySuccess(page);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async mockPayment(context, input) {
        try {
            const raw = await apiClient.post<unknown>(apiEndpoints.billing.residentMockPayment, input, {
                context: requestContext(context),
                idempotencyKey: createIdempotencyKey('resident-payment'),
            });
            const confirmation = decodeOrThrow(mockPaymentConfirmationDecoder, raw, 'billing.payment');
            return repositorySuccess(confirmation);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
};
export const billApiSource = {
    ...residentBillingApiRepository,
    async list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Bill[]>> {
        if (!context) {
            return repositorySuccess([]);
        }
        const result = await residentBillingApiRepository.getBillsPage(context, {
            filter: 'all',
            cursor: null,
            pageSize: 50,
        });
        return result.ok ? repositorySuccess(result.data.bills) : result;
    },
    async detail(context: ResidentRepositoryRequestContext | string, billId?: string): Promise<RepositoryResult<Bill | Absent>> {
        if (typeof context === 'string') {
            return repositorySuccess(undefined);
        }
        return residentBillingApiRepository.getBillDetail(context, billId ?? '');
    },
};
export default billApiSource;


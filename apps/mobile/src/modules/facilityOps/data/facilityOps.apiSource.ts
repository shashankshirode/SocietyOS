import { apiClient } from '../../../core/api/apiClient';
import { apiEndpoints } from '../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { AmcContract, AmcRenewalReminder } from '../../../shared/types/amc.types';
import type { Asset, AssetDocument, PreventiveMaintenanceSchedule } from '../../../shared/types/asset.types';
import type { ComplianceExpiryRecord, InventoryItem, InventoryTransaction, InventoryTransactionInput, PurchaseRequest, PurchaseRequestInput } from '../../../shared/types/inventory.types';
import type { RegisterVendorInput, Vendor, VendorDocument, VendorScorecard } from '../../../shared/types/vendor.types';
import type { AssetBreakdownInput, FacilityIncident, ServiceHistoryItem, WorkOrder, CreateWorkOrderInput } from '../../../shared/types/workOrder.types';
import type { FacilityOpsHome, OpsListParams } from './facilityOps.dto';
import type { Absent } from "../../../shared/types/absence.types";
async function safe<T>(loader: () => Promise<T>): Promise<RepositoryResult<T>> {
    try {
        return repositorySuccess(await loader());
    }
    catch (error) {
        return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
}
export const facilityOpsApiSource = {
    getFacilityOpsHome: () => safe<FacilityOpsHome>(() => apiClient.get(apiEndpoints.facilityOps.dashboard)),
    getVendors: (params: OpsListParams = {}) => safe<Vendor[]>(() => apiClient.get(apiEndpoints.facilityOps.vendors, { query: params })),
    getVendorDetail: (vendorId: string) => safe<Vendor | Absent>(() => apiClient.get(apiEndpoints.facilityOps.vendorDetail(vendorId))),
    registerVendor: (input: RegisterVendorInput) => safe<Vendor>(() => apiClient.post(apiEndpoints.facilityOps.vendors, input, { idempotencyKey: createIdempotencyKey('register-vendor') })),
    getVendorDocuments: (vendorId: string) => safe<VendorDocument[]>(() => apiClient.get(apiEndpoints.facilityOps.vendorDocuments(vendorId))),
    getAmcContracts: (params: OpsListParams = {}) => safe<AmcContract[]>(() => apiClient.get(apiEndpoints.facilityOps.amcContracts, { query: params })),
    getAmcContractDetail: (contractId: string) => safe<AmcContract | Absent>(() => apiClient.get(apiEndpoints.facilityOps.amcContractDetail(contractId))),
    getAmcRenewalReminders: () => safe<AmcRenewalReminder[]>(() => apiClient.get(apiEndpoints.facilityOps.amcRenewalReminders('all'))),
    markAmcRenewalStarted: (contractId: string) => safe<AmcRenewalReminder | Absent>(() => apiClient.post(apiEndpoints.facilityOps.amcMarkRenewalStarted(contractId), {}, { idempotencyKey: createIdempotencyKey('amc-renewal-started') })),
    markAmcRenewed: (contractId: string) => safe<AmcRenewalReminder | Absent>(() => apiClient.post(apiEndpoints.facilityOps.amcMarkRenewed(contractId), {}, { idempotencyKey: createIdempotencyKey('amc-renewed') })),
    getAssets: (params: OpsListParams = {}) => safe<Asset[]>(() => apiClient.get(apiEndpoints.facilityOps.assets, { query: params })),
    getAssetDetail: (assetId: string) => safe<Asset | Absent>(() => apiClient.get(apiEndpoints.facilityOps.assetDetail(assetId))),
    getAssetDocuments: (assetId: string) => safe<AssetDocument[]>(() => apiClient.get(apiEndpoints.facilityOps.assetDocuments(assetId))),
    getPreventiveMaintenanceSchedule: () => safe<PreventiveMaintenanceSchedule[]>(() => apiClient.get(apiEndpoints.facilityOps.preventiveSchedules)),
    createWorkOrder: (input: CreateWorkOrderInput) => safe<WorkOrder>(() => apiClient.post(apiEndpoints.facilityOps.workOrders, input, { idempotencyKey: createIdempotencyKey('work-order') })),
    getWorkOrders: (params: OpsListParams = {}) => safe<WorkOrder[]>(() => apiClient.get(apiEndpoints.facilityOps.workOrders, { query: params })),
    getWorkOrderDetail: (workOrderId: string) => safe<WorkOrder | Absent>(() => apiClient.get(apiEndpoints.facilityOps.workOrderDetail(workOrderId))),
    assignVendor: (workOrderId: string) => safe<WorkOrder | Absent>(() => apiClient.post(apiEndpoints.facilityOps.workOrderAssignVendor(workOrderId), {}, { idempotencyKey: createIdempotencyKey('work-order-assign') })),
    startWorkOrder: (workOrderId: string) => safe<WorkOrder | Absent>(() => apiClient.post(apiEndpoints.facilityOps.workOrderStart(workOrderId), {}, { idempotencyKey: createIdempotencyKey('work-order-start') })),
    completeWorkOrder: (workOrderId: string) => safe<WorkOrder | Absent>(() => apiClient.post(apiEndpoints.facilityOps.workOrderComplete(workOrderId), {}, { idempotencyKey: createIdempotencyKey('work-order-complete') })),
    verifyWorkOrder: (workOrderId: string) => safe<WorkOrder | Absent>(() => apiClient.post(apiEndpoints.facilityOps.workOrderVerify(workOrderId), {}, { idempotencyKey: createIdempotencyKey('work-order-verify') })),
    closeWorkOrder: (workOrderId: string) => safe<WorkOrder | Absent>(() => apiClient.post(apiEndpoints.facilityOps.workOrderClose(workOrderId), {}, { idempotencyKey: createIdempotencyKey('work-order-close') })),
    reopenWorkOrder: (workOrderId: string) => safe<WorkOrder | Absent>(() => apiClient.post(apiEndpoints.facilityOps.workOrderReopen(workOrderId), {}, { idempotencyKey: createIdempotencyKey('work-order-reopen') })),
    getServiceHistory: () => safe<ServiceHistoryItem[]>(() => apiClient.get(apiEndpoints.facilityOps.serviceHistory)),
    getInventoryItems: (params: OpsListParams = {}) => safe<InventoryItem[]>(() => apiClient.get(apiEndpoints.facilityOps.inventoryItems, { query: params })),
    createInventoryTransaction: (input: InventoryTransactionInput) => safe<InventoryTransaction>(() => apiClient.post(apiEndpoints.facilityOps.inventoryTransactions, input, { idempotencyKey: createIdempotencyKey('inventory-transaction') })),
    createPurchaseRequest: (input: PurchaseRequestInput) => safe<PurchaseRequest>(() => apiClient.post(apiEndpoints.facilityOps.purchaseRequests, input, { idempotencyKey: createIdempotencyKey('purchase-request') })),
    getVendorScorecard: (vendorId: string) => safe<VendorScorecard | Absent>(() => apiClient.get(apiEndpoints.facilityOps.vendorScorecard(vendorId))),
    getComplianceExpiry: () => safe<ComplianceExpiryRecord[]>(() => apiClient.get(apiEndpoints.facilityOps.complianceExpiry)),
    reportAssetBreakdown: (input: AssetBreakdownInput) => safe<FacilityIncident>(() => apiClient.post(apiEndpoints.facilityOps.facilityIncidents, input, { idempotencyKey: createIdempotencyKey('asset-breakdown') })),
};


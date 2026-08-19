import { repositoryFailure, repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import { mockAmcContracts, mockAmcRenewalReminders } from '../../../shared/mock/amcContracts.mock';
import { mockAssetDocuments, mockAssets, mockPreventiveMaintenanceSchedules } from '../../../shared/mock/assets.mock';
import { mockComplianceExpiryRecords, mockInventoryItems, mockInventoryTransactions, mockPurchaseRequests } from '../../../shared/mock/inventory.mock';
import { mockServiceHistory } from '../../../shared/mock/serviceHistory.mock';
import { mockFacilityIncidents, mockWorkOrders } from '../../../shared/mock/workOrders.mock';
import { mockVendorDocuments, mockVendors, mockVendorScorecards } from '../../../shared/mock/vendors.mock';
import type { AmcContract, AmcRenewalReminder } from '../../../shared/types/amc.types';
import type { Asset, AssetDocument, PreventiveMaintenanceSchedule } from '../../../shared/types/asset.types';
import type { ComplianceExpiryRecord, InventoryItem, InventoryTransaction, InventoryTransactionInput, PurchaseRequest, PurchaseRequestInput } from '../../../shared/types/inventory.types';
import type { RegisterVendorInput, Vendor, VendorDocument, VendorScorecard } from '../../../shared/types/vendor.types';
import type { AssetBreakdownInput, FacilityIncident, ServiceHistoryItem, WorkOrder, CreateWorkOrderInput, WorkOrderStatus } from '../../../shared/types/workOrder.types';
import type { FacilityOpsHome, OpsListParams } from './facilityOps.dto';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import type { Absent } from "../../../shared/types/absence.types";
const vendors: Vendor[] = [...mockVendors];
const workOrders: WorkOrder[] = [...mockWorkOrders];
const inventoryItems: InventoryItem[] = [...mockInventoryItems];
const inventoryTransactions: InventoryTransaction[] = [...mockInventoryTransactions];
const purchaseRequests: PurchaseRequest[] = [...mockPurchaseRequests];
const facilityIncidents: FacilityIncident[] = [...mockFacilityIncidents];
const amcReminders: AmcRenewalReminder[] = [...mockAmcRenewalReminders];
function matches(query: string | Absent, values: string[]) {
    const normalized = query?.trim().toLowerCase();
    return !normalized || values.some((value) => value.toLowerCase().includes(normalized));
}
function setWorkOrderStatus(workOrderId: string, status: WorkOrderStatus): WorkOrder | Absent {
    const order = workOrders.find((item) => item.id === workOrderId);
    if (order) {
        order.status = status;
        order.timeline.push({ id: `wo-timeline-${Date.now()}`, title: status.replace(/_/g, ' '), note: 'Mock lifecycle action recorded.', createdAt: new Date().toISOString() });
    }
    return order;
}
export const facilityOpsMockSource = {
    async getFacilityOpsHome(): Promise<RepositoryResult<FacilityOpsHome>> {
        await withMockDelay();
        return repositorySuccess({
            managerName: 'Suresh Patil',
            societyName: 'Green Valley Heights',
            assignedAreas: ['Main Gate', 'A Wing', 'B Wing', 'Clubhouse', 'Basement B2'],
            openWorkOrders: workOrders.filter((order) => !['COMPLETED', 'VERIFIED', 'CLOSED'].includes(order.status)).length,
            overdueWorkOrders: workOrders.filter((order) => order.status === 'OVERDUE').length,
            amcRenewalsDue: amcReminders.filter((reminder) => ['DUE_SOON', 'OVERDUE'].includes(reminder.status)).length,
            assetBreakdowns: facilityIncidents.length,
            complianceExpiring: mockComplianceExpiryRecords.filter((record) => record.status !== 'VALID').length,
            lowInventoryAlerts: inventoryItems.filter((item) => item.stockStatus === 'LOW_STOCK').length,
            vendorSlaSummary: '86% vendor SLA compliance this month'
        });
    },
    async getVendors(params: OpsListParams = {}): Promise<RepositoryResult<Vendor[]>> {
        await withMockDelay();
        return repositorySuccess(vendors.filter((vendor) => matches(params.query, [vendor.name, vendor.category, vendor.contactPerson, vendor.servicesOffered.join(' ')])));
    },
    async getVendorDetail(vendorId: string): Promise<RepositoryResult<Vendor | Absent>> {
        await withMockDelay();
        return repositorySuccess(vendors.find((vendor) => vendor.id === vendorId));
    },
    async registerVendor(input: RegisterVendorInput): Promise<RepositoryResult<Vendor>> {
        await withMockDelay();
        const vendor: Vendor = {
            id: `vendor-${Date.now()}`,
            name: input.vendorName,
            category: input.category,
            contactPerson: input.contactPerson,
            maskedPhone: input.mobileNumber.replace(/\d(?=\d{4})/g, '*'),
            maskedEmail: input.email ? `${input.email.slice(0, 2)}****${input.email.slice(input.email.indexOf('@'))}` : 'Not provided',
            officeAddress: input.officeAddress,
            ...includeWhenPresent("gstMasked", input.gstNumber ? `${input.gstNumber.slice(0, 7)}****${input.gstNumber.slice(-3)}` : undefined),
            ...includeWhenPresent("panMasked", input.pan ? `${input.pan.slice(0, 4)}*****${input.pan.slice(-1)}` : undefined),
            contractStatus: 'PENDING_APPROVAL',
            complianceStatus: 'PENDING',
            activeAmcCount: 0,
            openWorkOrders: 0,
            rating: 0,
            lastServiceDate: 'No service yet',
            servicesOffered: input.servicesOffered.split(',').map((item) => item.trim()),
            assignedAssets: [],
            completedWorkOrders: 0,
            slaScore: 0,
            notes: input.notes ?? 'Registered in mock mode.'
        };
        vendors.unshift(vendor);
        return repositorySuccess(vendor);
    },
    async getVendorDocuments(vendorId: string): Promise<RepositoryResult<VendorDocument[]>> {
        await withMockDelay();
        return repositorySuccess(mockVendorDocuments.filter((document) => document.vendorId === vendorId));
    },
    async getAmcContracts(params: OpsListParams = {}): Promise<RepositoryResult<AmcContract[]>> {
        await withMockDelay();
        return repositorySuccess(mockAmcContracts.filter((contract) => matches(params.query, [contract.vendorName, contract.contractNumber, contract.category])));
    },
    async getAmcContractDetail(contractId: string): Promise<RepositoryResult<AmcContract | Absent>> {
        await withMockDelay();
        return repositorySuccess(mockAmcContracts.find((contract) => contract.id === contractId));
    },
    async getAmcRenewalReminders(): Promise<RepositoryResult<AmcRenewalReminder[]>> {
        await withMockDelay();
        return repositorySuccess(amcReminders);
    },
    async markAmcRenewalStarted(contractId: string): Promise<RepositoryResult<AmcRenewalReminder | Absent>> {
        await withMockDelay();
        const reminder = amcReminders.find((item) => item.contractId === contractId);
        if (reminder)
            reminder.status = 'RENEWAL_STARTED';
        return repositorySuccess(reminder);
    },
    async markAmcRenewed(contractId: string): Promise<RepositoryResult<AmcRenewalReminder | Absent>> {
        await withMockDelay();
        const reminder = amcReminders.find((item) => item.contractId === contractId);
        if (reminder)
            reminder.status = 'RENEWED';
        return repositorySuccess(reminder);
    },
    async getAssets(params: OpsListParams = {}): Promise<RepositoryResult<Asset[]>> {
        await withMockDelay();
        return repositorySuccess(mockAssets.filter((asset) => matches(params.query, [asset.assetName, asset.assetCode, asset.location, asset.category])));
    },
    async getAssetDetail(assetId: string): Promise<RepositoryResult<Asset | Absent>> {
        await withMockDelay();
        return repositorySuccess(mockAssets.find((asset) => asset.id === assetId));
    },
    async getAssetDocuments(assetId: string): Promise<RepositoryResult<AssetDocument[]>> {
        await withMockDelay();
        return repositorySuccess(mockAssetDocuments.filter((document) => document.assetId === assetId));
    },
    async getPreventiveMaintenanceSchedule(): Promise<RepositoryResult<PreventiveMaintenanceSchedule[]>> {
        await withMockDelay();
        return repositorySuccess(mockPreventiveMaintenanceSchedules);
    },
    async createWorkOrder(input: CreateWorkOrderInput): Promise<RepositoryResult<WorkOrder>> {
        await withMockDelay();
        const workOrder: WorkOrder = {
            id: `work-order-${Date.now()}`,
            workOrderNumber: `WO-GVH-2026-${Date.now().toString().slice(-4)}`,
            title: input.title,
            type: input.type,
            ...includeWhenPresent("linkedAssetId", input.linkedAssetId),
            ...includeWhenPresent("linkedAssetName", input.linkedAssetId ? `Asset ${input.linkedAssetId}` : undefined),
            ...includeWhenPresent("vendorId", input.vendorId),
            ...includeWhenPresent("vendorName", input.vendorId ? `Vendor ${input.vendorId}` : undefined),
            priority: input.priority,
            status: input.vendorId ? 'ASSIGNED' : 'OPEN',
            dueDate: input.dueDate,
            assignedTo: input.assignedTo,
            slaStatus: 'Within SLA',
            source: input.sourceComplaintId ? 'COMPLAINT' : 'MANUAL',
            description: input.description,
            ...includeWhenPresent("notes", input.notes),
            ...includeWhenPresent("evidenceLabel", input.evidenceLabel),
            verificationStatus: 'Pending work',
            ...includeWhenPresent("linkedComplaintId", input.sourceComplaintId),
            timeline: [{ id: `wo-${Date.now()}-t1`, title: 'Work order created', note: 'Created in mock mode.', createdAt: new Date().toISOString() }]
        };
        workOrders.unshift(workOrder);
        return repositorySuccess(workOrder);
    },
    async getWorkOrders(params: OpsListParams = {}): Promise<RepositoryResult<WorkOrder[]>> {
        await withMockDelay();
        return repositorySuccess(workOrders.filter((order) => matches(params.query, [order.workOrderNumber, order.title, order.linkedAssetName ?? '', order.vendorName ?? ''])));
    },
    async getWorkOrderDetail(workOrderId: string): Promise<RepositoryResult<WorkOrder | Absent>> {
        await withMockDelay();
        return repositorySuccess(workOrders.find((order) => order.id === workOrderId));
    },
    async assignVendor(workOrderId: string): Promise<RepositoryResult<WorkOrder | Absent>> { await withMockDelay(); return repositorySuccess(setWorkOrderStatus(workOrderId, 'ASSIGNED')); },
    async startWorkOrder(workOrderId: string): Promise<RepositoryResult<WorkOrder | Absent>> { await withMockDelay(); return repositorySuccess(setWorkOrderStatus(workOrderId, 'IN_PROGRESS')); },
    async completeWorkOrder(workOrderId: string): Promise<RepositoryResult<WorkOrder | Absent>> { await withMockDelay(); return repositorySuccess(setWorkOrderStatus(workOrderId, 'COMPLETED')); },
    async verifyWorkOrder(workOrderId: string): Promise<RepositoryResult<WorkOrder | Absent>> { await withMockDelay(); return repositorySuccess(setWorkOrderStatus(workOrderId, 'VERIFIED')); },
    async closeWorkOrder(workOrderId: string): Promise<RepositoryResult<WorkOrder | Absent>> { await withMockDelay(); return repositorySuccess(setWorkOrderStatus(workOrderId, 'CLOSED')); },
    async reopenWorkOrder(workOrderId: string): Promise<RepositoryResult<WorkOrder | Absent>> { await withMockDelay(); return repositorySuccess(setWorkOrderStatus(workOrderId, 'OPEN')); },
    async getServiceHistory(): Promise<RepositoryResult<ServiceHistoryItem[]>> { await withMockDelay(); return repositorySuccess(mockServiceHistory); },
    async getInventoryItems(params: OpsListParams = {}): Promise<RepositoryResult<InventoryItem[]>> {
        await withMockDelay();
        return repositorySuccess(inventoryItems.filter((item) => matches(params.query, [item.itemName, item.category, item.location])));
    },
    async createInventoryTransaction(input: InventoryTransactionInput): Promise<RepositoryResult<InventoryTransaction>> {
        await withMockDelay();
        const item = inventoryItems.find((candidate) => candidate.id === input.itemId);
        if (input.transactionType === 'ISSUE' && item && input.quantity > item.currentStock) {
            return repositoryFailure({ code: 'INVENTORY_NEGATIVE_STOCK', message: 'Issue quantity cannot exceed current stock.' });
        }
        const transaction: InventoryTransaction = {
            id: `inventory-txn-${Date.now()}`,
            itemId: input.itemId,
            itemName: item?.itemName ?? 'Inventory item',
            transactionType: input.transactionType,
            quantity: input.quantity,
            actor: input.actor,
            purpose: input.purpose,
            ...includeWhenPresent("linkedWorkOrderId", input.linkedWorkOrderId),
            ...includeWhenPresent("notes", input.notes),
            createdAt: new Date().toISOString()
        };
        inventoryTransactions.unshift(transaction);
        return repositorySuccess(transaction);
    },
    async createPurchaseRequest(input: PurchaseRequestInput): Promise<RepositoryResult<PurchaseRequest>> {
        await withMockDelay();
        const request: PurchaseRequest = { ...input, id: `purchase-request-${Date.now()}`, requestNumber: `PR-GVH-2026-${Date.now().toString().slice(-4)}`, status: 'SUBMITTED' };
        purchaseRequests.unshift(request);
        return repositorySuccess(request);
    },
    async getVendorScorecard(vendorId: string): Promise<RepositoryResult<VendorScorecard | Absent>> { await withMockDelay(); return repositorySuccess(mockVendorScorecards.find((score) => score.vendorId === vendorId) ?? mockVendorScorecards[0]); },
    async getComplianceExpiry(): Promise<RepositoryResult<ComplianceExpiryRecord[]>> { await withMockDelay(); return repositorySuccess(mockComplianceExpiryRecords); },
    async reportAssetBreakdown(input: AssetBreakdownInput): Promise<RepositoryResult<FacilityIncident>> {
        await withMockDelay();
        const incident: FacilityIncident = { ...input, id: `facility-incident-${Date.now()}`, assetName: `Asset ${input.assetId}`, ...includeWhenPresent("linkedWorkOrderId", undefined) };
        facilityIncidents.unshift(incident);
        return repositorySuccess(incident);
    }
};


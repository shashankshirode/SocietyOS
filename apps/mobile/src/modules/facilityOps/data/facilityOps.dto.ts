import type { AmcContract, AmcRenewalReminder } from '../../../shared/types/amc.types';
import type { Asset, AssetDocument, PreventiveMaintenanceSchedule } from '../../../shared/types/asset.types';
import type { ComplianceExpiryRecord, InventoryItem, InventoryTransaction, InventoryTransactionInput, PurchaseRequest, PurchaseRequestInput } from '../../../shared/types/inventory.types';
import type { RegisterVendorInput, Vendor, VendorDocument, VendorScorecard } from '../../../shared/types/vendor.types';
import type { AssetBreakdownInput, FacilityIncident, ServiceHistoryItem, WorkOrder, CreateWorkOrderInput } from '../../../shared/types/workOrder.types';

export type FacilityOpsHome = {
  managerName: string;
  societyName: string;
  assignedAreas: string[];
  openWorkOrders: number;
  overdueWorkOrders: number;
  amcRenewalsDue: number;
  assetBreakdowns: number;
  complianceExpiring: number;
  lowInventoryAlerts: number;
  vendorSlaSummary: string;
};

export type VendorDto = Vendor;
export type VendorDocumentDto = VendorDocument;
export type RegisterVendorRequestDto = RegisterVendorInput;
export type VendorScorecardDto = VendorScorecard;
export type AmcContractDto = AmcContract;
export type AmcRenewalReminderDto = AmcRenewalReminder;
export type AssetDto = Asset;
export type AssetDocumentDto = AssetDocument;
export type PreventiveMaintenanceScheduleDto = PreventiveMaintenanceSchedule;
export type WorkOrderDto = WorkOrder;
export type CreateWorkOrderRequestDto = CreateWorkOrderInput;
export type ServiceHistoryItemDto = ServiceHistoryItem;
export type InventoryItemDto = InventoryItem;
export type InventoryTransactionDto = InventoryTransaction;
export type InventoryTransactionRequestDto = InventoryTransactionInput;
export type PurchaseRequestDto = PurchaseRequest;
export type PurchaseRequestRequestDto = PurchaseRequestInput;
export type ComplianceExpiryRecordDto = ComplianceExpiryRecord;
export type FacilityIncidentDto = FacilityIncident;
export type AssetBreakdownRequestDto = AssetBreakdownInput;

export type OpsListParams = {
  query?: string;
  filter?: string;
};

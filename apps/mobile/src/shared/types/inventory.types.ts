import type { Absent } from './absence.types';

export type InventoryCategory =
  | 'ELECTRICAL' | 'PLUMBING' | 'CLEANING' | 'SAFETY' | 'GARDENING' | 'STATIONERY' | 'SPARE_PARTS' | 'TOOLS' | 'OTHER';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCKED';
export type InventoryTransactionType = 'ISSUE' | 'RETURN' | 'ADJUSTMENT' | 'RECEIPT';
export type PurchaseRequestStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';

export type InventoryItem = {
  id: string;
  itemName: string;
  category: InventoryCategory;
  currentStock: number;
  unit: string;
  minimumStockLevel: number;
  reorderThreshold?: number | Absent;
  reservedStock?: number | Absent;
  isActive?: boolean | Absent;
  stockStatus: StockStatus;
  location: string;
  lastIssuedDate: string;
  lastPurchasedDate: string;
};

export type InventoryTransaction = {
  id: string;
  itemId: string;
  itemName: string;
  transactionType: InventoryTransactionType;
  quantity: number;
  unit?: string | Absent;
  fromLocation?: string | Absent;
  toLocation?: string | Absent;
  actor: string;
  actorId?: string | Absent;
  purpose: string;
  linkedWorkOrderId?: string | Absent;
  linkedPurchaseOrderId?: string | Absent;
  linkedGoodsReceiptId?: string | Absent;
  returnReason?: string | Absent;
  balanceAfter?: number | Absent;
  adjustmentReason?: string | Absent;
  notes?: string | Absent;
  createdAt: string;
};

export type InventoryTransactionInput = {
  itemId: string;
  transactionType: InventoryTransactionType;
  quantity: number;
  unit?: string | Absent;
  fromLocation?: string | Absent;
  toLocation?: string | Absent;
  actor?: string | Absent;
  actorId?: string | Absent;
  purpose: string;
  linkedWorkOrderId?: string | Absent;
  linkedPurchaseOrderId?: string | Absent;
  linkedGoodsReceiptId?: string | Absent;
  returnReason?: string | Absent;
  balanceAfter?: number | Absent;
  adjustmentReason?: string | Absent;
  notes?: string | Absent;
  clientOperationId?: string | Absent;
};

export type PurchaseRequestInput = {
  itemOrCategory: string;
  requiredQuantity: number;
  reason: string;
  linkedAssetOrWorkOrder?: string | Absent;
  estimatedAmount: number;
  currency?: string | Absent;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  preferredVendor?: string | Absent;
  notes?: string | Absent;
  clientOperationId?: string | Absent;
};

export type PurchaseRequest = PurchaseRequestInput & {
  id: string;
  requestNumber: string;
  status: PurchaseRequestStatus;
  requesterId?: string | Absent;
  approvedBy?: string | Absent;
  approvedAt?: string | Absent;
  approvalNotes?: string | Absent;
};

export type PurchaseOrderLine = {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  acceptedQuantity: number;
};

export type PurchaseOrderStatus = 'ISSUED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';

export type PurchaseOrder = {
  id: string;
  poNumber: string;
  purchaseRequestId: string;
  vendorId: string;
  vendorName: string;
  lines: PurchaseOrderLine[];
  status: PurchaseOrderStatus;
  totalAmount: number;
  currency: string;
  deliveryDate: string;
  deliveryLocation: string;
  terms: string;
  version: number;
  previousVersionId?: string | Absent;
  createdAt: string;
  createdBy: string;
};

export type GoodsReceiptLine = {
  id: string;
  poLineId: string;
  itemId: string;
  itemName: string;
  orderedQuantity: number;
  deliveredQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  rejectionReason?: string | Absent;
};

export type GoodsReceipt = {
  id: string;
  receiptNumber: string;
  poId: string;
  vendorId: string;
  vendorName?: string | Absent;
  lines: GoodsReceiptLine[];
  status?: string | Absent;
  documentVaultId?: string | Absent;
  receivedAt: string;
  receivedBy: string;
};

export type ReturnToVendorLine = {
  itemId: string;
  quantity: number;
  reason: string;
};

export type ReturnToVendor = {
  id: string;
  returnNumber: string;
  poId: string;
  goodsReceiptId: string;
  vendorId: string;
  lines: ReturnToVendorLine[];
  returnedAt: string;
  returnedBy: string;
};

export type ComplianceExpiryRecord = {
  id: string;
  documentName: string;
  linkedEntity: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' | 'RENEWAL_IN_PROGRESS' | 'NOT_AVAILABLE';
  responsiblePerson: string;
};

export type MatchTolerancePolicy = {
  policyVersion: string;
  priceTolerancePercent: number;
  taxTolerancePercent: number;
  quantityTolerancePercent: number;
  effectiveFrom: string;
};

export type MatchException = {
  type: string;
  expected: string | number;
  actual: string | number;
  variance: number;
  tolerance: number;
  reason: string;
  resolved: boolean;
  resolutionReason?: string;
  resolvedBy?: string;
  resolvedAt?: string;
};

export type InvoiceMatchResult = {
  status: 'MATCHED' | 'EXCEPTION';
  matchType: 'THREE_WAY_GOODS' | 'TWO_WAY_SERVICE';
  exceptions: MatchException[];
  toleranceApplied: MatchTolerancePolicy;
  evaluatedAt: string;
  poId?: string;
  goodsReceiptId?: string;
  workOrderId?: string;
};

export type VendorInvoiceLine = {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  poLineId?: string;
};

export type VendorInvoice = {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  poId?: string;
  workOrderId?: string;
  lines: VendorInvoiceLine[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  invoiceDate: string;
  dueDate: string;
  documentVaultId?: string;
  clientOperationId?: string;
  status: 'RECEIVED' | 'MATCHED' | 'EXCEPTION' | 'APPROVED' | 'PAYABLE_CREATED' | 'PAID' | 'CANCELLED';
  matchResult?: InvoiceMatchResult;
  approvedBy?: string;
  approvedAt?: string;
  financePayableReferenceId?: string;
};

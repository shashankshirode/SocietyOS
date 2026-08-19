export type InventoryCategory =
  | 'ELECTRICAL' | 'PLUMBING' | 'CLEANING' | 'SAFETY' | 'GARDENING' | 'STATIONERY' | 'SPARE_PARTS' | 'TOOLS' | 'OTHER';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCKED';
export type InventoryTransactionType = 'ISSUE' | 'RETURN' | 'ADJUSTMENT';
export type PurchaseRequestStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';

export type InventoryItem = {
  id: string;
  itemName: string;
  category: InventoryCategory;
  currentStock: number;
  unit: string;
  minimumStockLevel: number;
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
  actor: string;
  purpose: string;
  linkedWorkOrderId?: string;
  notes?: string;
  createdAt: string;
};

export type InventoryTransactionInput = {
  itemId: string;
  transactionType: InventoryTransactionType;
  quantity: number;
  actor: string;
  purpose: string;
  linkedWorkOrderId?: string;
  notes?: string;
};

export type PurchaseRequestInput = {
  itemOrCategory: string;
  requiredQuantity: number;
  reason: string;
  linkedAssetOrWorkOrder?: string;
  estimatedAmount: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  preferredVendor?: string;
  notes?: string;
};

export type PurchaseRequest = PurchaseRequestInput & {
  id: string;
  requestNumber: string;
  status: PurchaseRequestStatus;
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

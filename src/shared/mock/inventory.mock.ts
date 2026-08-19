import type { ComplianceExpiryRecord, InventoryItem, InventoryTransaction, PurchaseRequest } from '../types/inventory.types';
import { getRequiredItem } from "../utils/requiredItem";
const inventoryCategories = ['ELECTRICAL', 'PLUMBING', 'CLEANING', 'SAFETY', 'GARDENING', 'STATIONERY', 'SPARE_PARTS', 'TOOLS', 'OTHER'] as const;
export const mockInventoryItems: InventoryItem[] = Array.from({ length: 15 }, (_, index) => ({
    id: `inventory-${index + 1}`,
    itemName: getRequiredItem(['LED tube light', 'PVC elbow', 'Floor cleaner', 'Fire extinguisher seal', 'Garden hose'], index % 5, "inventory.mock.ts"),
    category: getRequiredItem(inventoryCategories, index % inventoryCategories.length, "inventory.mock.ts"),
    currentStock: index % 4 === 0 ? 2 : 20 + index,
    unit: index % 3 === 0 ? 'pcs' : 'box',
    minimumStockLevel: 5,
    stockStatus: index % 4 === 0 ? 'LOW_STOCK' : 'IN_STOCK',
    location: getRequiredItem(['Main Store', 'Basement B2 Store', 'Clubhouse Store'], index % 3, "inventory.mock.ts"),
    lastIssuedDate: '2026-06-20',
    lastPurchasedDate: '2026-05-10',
}));
export const mockInventoryTransactions: InventoryTransaction[] = Array.from({ length: 10 }, (_, index) => ({
    id: `inventory-txn-${index + 1}`,
    itemId: `inventory-${(index % 8) + 1}`,
    itemName: getRequiredItem(mockInventoryItems, index % mockInventoryItems.length, "inventory.mock.ts").itemName,
    transactionType: index % 3 === 0 ? 'RETURN' : 'ISSUE',
    quantity: index + 1,
    actor: 'Facility Technician',
    purpose: 'Linked maintenance task',
    linkedWorkOrderId: `work-order-${(index % 8) + 1}`,
    notes: 'Mock inventory audit trail.',
    createdAt: '2026-06-29T08:00:00.000Z',
}));
export const mockPurchaseRequests: PurchaseRequest[] = Array.from({ length: 6 }, (_, index) => ({
    id: `purchase-request-${index + 1}`,
    requestNumber: `PR-GVH-2026-${String(index + 1).padStart(4, '0')}`,
    itemOrCategory: getRequiredItem(mockInventoryItems, index, "inventory.mock.ts").itemName,
    requiredQuantity: 10 + index,
    reason: 'Low stock replenishment placeholder.',
    linkedAssetOrWorkOrder: `work-order-${index + 1}`,
    estimatedAmount: 2500 + index * 500,
    urgency: index < 2 ? 'HIGH' : 'MEDIUM',
    preferredVendor: 'Preferred Nashik supplier',
    notes: 'No real procurement backend.',
    status: index % 2 === 0 ? 'SUBMITTED' : 'DRAFT',
}));
export const mockComplianceExpiryRecords: ComplianceExpiryRecord[] = Array.from({ length: 8 }, (_, index) => ({
    id: `compliance-${index + 1}`,
    documentName: getRequiredItem(['Fire NOC', 'Lift certificate', 'Vendor insurance', 'Police verification', 'AMC contract', 'Safety certificate', 'Pest control certificate', 'Water tank cleaning certificate'], index, "inventory.mock.ts"),
    linkedEntity: getRequiredItem(['Fire System', 'Lift A1', 'Security Vendor', 'Housekeeping Staff', 'Generator AMC', 'Clubhouse', 'Pest Vendor', 'Water Tank'], index, "inventory.mock.ts"),
    expiryDate: `2026-${String((index % 5) + 7).padStart(2, '0')}-15`,
    daysRemaining: index === 0 ? -5 : 10 + index * 12,
    status: index === 0 ? 'EXPIRED' : index < 3 ? 'EXPIRING_SOON' : 'VALID',
    responsiblePerson: 'Suresh Patil',
}));


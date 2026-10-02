import {
  InventoryItem,
  InventoryTransaction,
  InventoryTransactionInput,
  StockStatus,
} from '../../../shared/types/inventory.types';
import { FacilityOperationsActor } from '../data/facilityOpsActor.types';

export class InventoryService {
  private static instance: InventoryService;
  private items: Map<string, InventoryItem> = new Map();
  private transactions: Map<string, InventoryTransaction[]> = new Map();
  private locks: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): InventoryService {
    if (!InventoryService.instance) {
      InventoryService.instance = new InventoryService();
    }
    return InventoryService.instance;
  }

  public registerItem(item: InventoryItem): InventoryItem {
    const stockStatus = this.calculateStockStatus(
      item.currentStock,
      item.minimumStockLevel,
      item.reorderThreshold
    );
    const storedItem: InventoryItem = {
      ...item,
      stockStatus,
      reservedStock: item.reservedStock ?? 0,
      isActive: item.isActive ?? true,
    };
    this.items.set(item.id, storedItem);
    if (!this.transactions.has(item.id)) {
      this.transactions.set(item.id, []);
    }
    return storedItem;
  }

  public getItem(itemId: string): InventoryItem | null {
    return this.items.get(itemId) ?? null;
  }

  public getItems(): InventoryItem[] {
    return Array.from(this.items.values());
  }

  public getTransactions(itemId: string): InventoryTransaction[] {
    return this.transactions.get(itemId) ?? [];
  }

  public calculateStockStatus(
    currentStock: number,
    minimumStockLevel: number,
    reorderThreshold?: number
  ): StockStatus {
    if (currentStock <= 0) {
      return 'OUT_OF_STOCK';
    }
    const threshold = reorderThreshold ?? minimumStockLevel;
    if (currentStock <= threshold) {
      return 'LOW_STOCK';
    }
    return 'IN_STOCK';
  }

  public async acquireLock(resourceKey: string): Promise<boolean> {
    if (this.locks.has(resourceKey)) {
      return false;
    }
    this.locks.add(resourceKey);
    return true;
  }

  public releaseLock(resourceKey: string): void {
    this.locks.delete(resourceKey);
  }

  public issueStock(
    input: InventoryTransactionInput,
    actor: FacilityOperationsActor
  ): InventoryTransaction {
    if (!actor.hasPermission('MANAGE_INVENTORY')) {
      throw new Error('ACCESS_DENIED: Actor lacks MANAGE_INVENTORY permission');
    }

    const item = this.items.get(input.itemId);
    if (!item) {
      throw new Error('INVENTORY_ITEM_NOT_FOUND');
    }

    if (item.isActive === false) {
      throw new Error('INVENTORY_ITEM_INACTIVE');
    }

    if (input.quantity <= 0) {
      throw new Error('INVALID_INVENTORY_QUANTITY: Issue quantity must be positive');
    }

    if (item.currentStock < input.quantity) {
      throw new Error(
        `INSUFFICIENT_STOCK: Available ${item.currentStock}, requested ${input.quantity}`
      );
    }

    const newStock = item.currentStock - input.quantity;
    const newStatus = this.calculateStockStatus(
      newStock,
      item.minimumStockLevel,
      item.reorderThreshold
    );

    const transaction: InventoryTransaction = {
      id: input.clientOperationId ?? `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      itemId: item.id,
      itemName: item.itemName,
      transactionType: 'ISSUE',
      quantity: input.quantity,
      unit: input.unit ?? item.unit,
      fromLocation: input.fromLocation ?? item.location,
      actor: actor.name,
      actorId: actor.userId,
      purpose: input.purpose,
      balanceAfter: newStock,
      createdAt: new Date().toISOString(),
      ...(input.toLocation ? { toLocation: input.toLocation } : {}),
      ...(input.linkedWorkOrderId ? { linkedWorkOrderId: input.linkedWorkOrderId } : {}),
      ...(input.notes ? { notes: input.notes } : {}),
    };

    const updatedItem: InventoryItem = {
      ...item,
      currentStock: newStock,
      stockStatus: newStatus,
      lastIssuedDate: new Date().toISOString().split('T')[0] ?? '',
    };

    this.items.set(item.id, updatedItem);
    const txList = this.transactions.get(item.id) ?? [];
    txList.push(transaction);
    this.transactions.set(item.id, txList);

    return transaction;
  }

  public receiveStock(
    input: InventoryTransactionInput,
    actor: FacilityOperationsActor
  ): InventoryTransaction {
    if (!actor.hasPermission('MANAGE_INVENTORY')) {
      throw new Error('ACCESS_DENIED: Actor lacks MANAGE_INVENTORY permission');
    }

    if (input.quantity <= 0) {
      throw new Error('INVALID_INVENTORY_QUANTITY: Receipt quantity must be positive');
    }

    let item = this.items.get(input.itemId);
    if (!item) {
      item = this.registerItem({
        id: input.itemId,
        itemName: `Item ${input.itemId}`,
        category: 'SPARE_PARTS',
        currentStock: 0,
        unit: input.unit ?? 'PIECES',
        minimumStockLevel: 5,
        location: input.toLocation ?? 'Central Store',
        lastIssuedDate: '',
        lastPurchasedDate: '',
        stockStatus: 'OUT_OF_STOCK',
      });
    }

    const newStock = item.currentStock + input.quantity;
    const newStatus = this.calculateStockStatus(
      newStock,
      item.minimumStockLevel,
      item.reorderThreshold
    );

    const transaction: InventoryTransaction = {
      id: input.clientOperationId ?? `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      itemId: item.id,
      itemName: item.itemName,
      transactionType: 'RECEIPT',
      quantity: input.quantity,
      unit: input.unit ?? item.unit,
      toLocation: input.toLocation ?? item.location,
      actor: actor.name,
      actorId: actor.userId,
      purpose: input.purpose,
      balanceAfter: newStock,
      createdAt: new Date().toISOString(),
      ...(input.linkedPurchaseOrderId ? { linkedPurchaseOrderId: input.linkedPurchaseOrderId } : {}),
      ...(input.linkedGoodsReceiptId ? { linkedGoodsReceiptId: input.linkedGoodsReceiptId } : {}),
      ...(input.notes ? { notes: input.notes } : {}),
    };

    const updatedItem: InventoryItem = {
      ...item,
      currentStock: newStock,
      stockStatus: newStatus,
      lastPurchasedDate: new Date().toISOString().split('T')[0] ?? '',
    };

    this.items.set(item.id, updatedItem);
    const txList = this.transactions.get(item.id) ?? [];
    txList.push(transaction);
    this.transactions.set(item.id, txList);

    return transaction;
  }

  public returnStock(
    input: InventoryTransactionInput,
    actor: FacilityOperationsActor
  ): InventoryTransaction {
    if (!actor.hasPermission('MANAGE_INVENTORY')) {
      throw new Error('ACCESS_DENIED: Actor lacks MANAGE_INVENTORY permission');
    }

    const item = this.items.get(input.itemId);
    if (!item) {
      throw new Error('INVENTORY_ITEM_NOT_FOUND');
    }

    if (input.quantity <= 0) {
      throw new Error('INVALID_INVENTORY_QUANTITY: Return quantity must be positive');
    }

    if (input.linkedWorkOrderId) {
      const issuedForWorkOrder = this.getIssuedQuantityForWorkOrder(
        item.id,
        input.linkedWorkOrderId
      );
      const returnedForWorkOrder = this.getReturnedQuantityForWorkOrder(
        item.id,
        input.linkedWorkOrderId
      );
      if (returnedForWorkOrder + input.quantity > issuedForWorkOrder) {
        throw new Error(
          `RETURN_EXCEEDS_ISSUED_QUANTITY: Issued ${issuedForWorkOrder}, already returned ${returnedForWorkOrder}, cannot return ${input.quantity}`
        );
      }
    }

    const newStock = item.currentStock + input.quantity;
    const newStatus = this.calculateStockStatus(
      newStock,
      item.minimumStockLevel,
      item.reorderThreshold
    );

    const transaction: InventoryTransaction = {
      id: input.clientOperationId ?? `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      itemId: item.id,
      itemName: item.itemName,
      transactionType: 'RETURN',
      quantity: input.quantity,
      unit: input.unit ?? item.unit,
      toLocation: input.toLocation ?? item.location,
      actor: actor.name,
      actorId: actor.userId,
      purpose: input.purpose,
      balanceAfter: newStock,
      createdAt: new Date().toISOString(),
      ...(input.linkedWorkOrderId ? { linkedWorkOrderId: input.linkedWorkOrderId } : {}),
      ...(input.returnReason ? { returnReason: input.returnReason } : {}),
      ...(input.notes ? { notes: input.notes } : {}),
    };

    const updatedItem: InventoryItem = {
      ...item,
      currentStock: newStock,
      stockStatus: newStatus,
    };

    this.items.set(item.id, updatedItem);
    const txList = this.transactions.get(item.id) ?? [];
    txList.push(transaction);
    this.transactions.set(item.id, txList);

    return transaction;
  }

  public adjustStock(
    itemId: string,
    delta: number,
    reason: string,
    actor: FacilityOperationsActor
  ): InventoryTransaction {
    if (!actor.hasPermission('MANAGE_INVENTORY')) {
      throw new Error('ACCESS_DENIED: Actor lacks MANAGE_INVENTORY permission');
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error('ADJUSTMENT_REASON_REQUIRED: Reason must be provided for stock adjustment');
    }

    const item = this.items.get(itemId);
    if (!item) {
      throw new Error('INVENTORY_ITEM_NOT_FOUND');
    }

    const newStock = item.currentStock + delta;
    if (newStock < 0) {
      throw new Error(`NEGATIVE_STOCK_PREVENTED: Cannot adjust stock below zero (target: ${newStock})`);
    }

    const newStatus = this.calculateStockStatus(
      newStock,
      item.minimumStockLevel,
      item.reorderThreshold
    );

    const transaction: InventoryTransaction = {
      id: `adj-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      itemId: item.id,
      itemName: item.itemName,
      transactionType: 'ADJUSTMENT',
      quantity: Math.abs(delta),
      unit: item.unit,
      actor: actor.name,
      actorId: actor.userId,
      purpose: 'STOCK_ADJUSTMENT',
      adjustmentReason: reason,
      balanceAfter: newStock,
      createdAt: new Date().toISOString(),
    };

    const updatedItem: InventoryItem = {
      ...item,
      currentStock: newStock,
      stockStatus: newStatus,
    };

    this.items.set(item.id, updatedItem);
    const txList = this.transactions.get(item.id) ?? [];
    txList.push(transaction);
    this.transactions.set(item.id, txList);

    return transaction;
  }

  public getIssuedQuantityForWorkOrder(itemId: string, workOrderId: string): number {
    const txList = this.transactions.get(itemId) ?? [];
    return txList
      .filter((t) => t.transactionType === 'ISSUE' && t.linkedWorkOrderId === workOrderId)
      .reduce((sum, t) => sum + t.quantity, 0);
  }

  public getReturnedQuantityForWorkOrder(itemId: string, workOrderId: string): number {
    const txList = this.transactions.get(itemId) ?? [];
    return txList
      .filter((t) => t.transactionType === 'RETURN' && t.linkedWorkOrderId === workOrderId)
      .reduce((sum, t) => sum + t.quantity, 0);
  }

  public evaluateReorderRecommendations(): Array<{ item: InventoryItem; recommendedQuantity: number }> {
    const recommendations: Array<{ item: InventoryItem; recommendedQuantity: number }> = [];
    for (const item of this.items.values()) {
      if (item.stockStatus === 'LOW_STOCK' || item.stockStatus === 'OUT_OF_STOCK') {
        const targetStock = (item.reorderThreshold ?? item.minimumStockLevel) * 2;
        const recommendedQuantity = Math.max(targetStock - item.currentStock, item.minimumStockLevel);
        recommendations.push({ item, recommendedQuantity });
      }
    }
    return recommendations;
  }

  public clear(): void {
    this.items.clear();
    this.transactions.clear();
    this.locks.clear();
  }
}

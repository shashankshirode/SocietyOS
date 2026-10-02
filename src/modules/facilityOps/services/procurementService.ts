import {
  GoodsReceipt,
  GoodsReceiptLine,
  PurchaseOrder,
  PurchaseOrderLine,
  PurchaseRequest,
  PurchaseRequestInput,
  ReturnToVendor,
} from '../../../shared/types/inventory.types';
import { FacilityOperationsActor } from '../data/facilityOpsActor.types';
import { InventoryService } from './inventoryService';

export class ProcurementService {
  private static instance: ProcurementService;
  private purchaseRequests: Map<string, PurchaseRequest> = new Map();
  private purchaseOrders: Map<string, PurchaseOrder> = new Map();
  private goodsReceipts: Map<string, GoodsReceipt> = new Map();
  private returnsToVendor: Map<string, ReturnToVendor> = new Map();

  private constructor() {}

  public static getInstance(): ProcurementService {
    if (!ProcurementService.instance) {
      ProcurementService.instance = new ProcurementService();
    }
    return ProcurementService.instance;
  }

  public submitPurchaseRequest(
    input: PurchaseRequestInput,
    actor: FacilityOperationsActor
  ): PurchaseRequest {
    if (!actor.hasPermission('MANAGE_INVENTORY')) {
      throw new Error('ACCESS_DENIED: Actor lacks permission to submit purchase requests');
    }

    if (input.requiredQuantity <= 0) {
      throw new Error('INVALID_QUANTITY: Required quantity must be greater than zero');
    }

    if (input.estimatedAmount < 0) {
      throw new Error('INVALID_AMOUNT: Estimated amount cannot be negative');
    }

    const prId = input.clientOperationId ?? `pr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const requestNumber = `PR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const pr: PurchaseRequest = {
      ...input,
      id: prId,
      requestNumber,
      status: 'SUBMITTED',
      requesterId: actor.userId,
      currency: input.currency ?? 'INR',
    };

    this.purchaseRequests.set(pr.id, pr);
    return pr;
  }

  public approvePurchaseRequest(
    prId: string,
    notes: string,
    actor: FacilityOperationsActor
  ): PurchaseRequest {
    if (!actor.hasPermission('APPROVE_PURCHASE_REQUEST')) {
      throw new Error('ACCESS_DENIED: Actor lacks APPROVE_PURCHASE_REQUEST permission');
    }

    const pr = this.purchaseRequests.get(prId);
    if (!pr) {
      throw new Error('PURCHASE_REQUEST_NOT_FOUND');
    }

    if (pr.status !== 'SUBMITTED' && pr.status !== 'UNDER_REVIEW') {
      throw new Error(`INVALID_PR_STATE: Cannot approve PR in status ${pr.status}`);
    }

    const approvedPr: PurchaseRequest = {
      ...pr,
      status: 'APPROVED',
      approvedBy: actor.name,
      approvedAt: new Date().toISOString(),
      approvalNotes: notes,
    };

    this.purchaseRequests.set(prId, approvedPr);
    return approvedPr;
  }

  public rejectPurchaseRequest(
    prId: string,
    notes: string,
    actor: FacilityOperationsActor
  ): PurchaseRequest {
    if (!actor.hasPermission('APPROVE_PURCHASE_REQUEST')) {
      throw new Error('ACCESS_DENIED: Actor lacks APPROVE_PURCHASE_REQUEST permission');
    }

    const pr = this.purchaseRequests.get(prId);
    if (!pr) {
      throw new Error('PURCHASE_REQUEST_NOT_FOUND');
    }

    const rejectedPr: PurchaseRequest = {
      ...pr,
      status: 'REJECTED',
      approvedBy: actor.name,
      approvedAt: new Date().toISOString(),
      approvalNotes: notes,
    };

    this.purchaseRequests.set(prId, rejectedPr);
    return rejectedPr;
  }

  public createPurchaseOrder(
    input: {
      purchaseRequestId: string;
      vendorId: string;
      vendorName: string;
      lines: Array<{
        itemId: string;
        itemName: string;
        quantity: number;
        unitPrice: number;
      }>;
      deliveryDate: string;
      deliveryLocation: string;
      terms: string;
      currency?: string;
      clientOperationId?: string;
    },
    actor: FacilityOperationsActor
  ): PurchaseOrder {
    if (!actor.hasPermission('CREATE_PURCHASE_ORDER')) {
      throw new Error('ACCESS_DENIED: Actor lacks CREATE_PURCHASE_ORDER permission');
    }

    const pr = this.purchaseRequests.get(input.purchaseRequestId);
    if (!pr) {
      throw new Error('PURCHASE_REQUEST_NOT_FOUND');
    }

    if (pr.status !== 'APPROVED') {
      throw new Error(`PURCHASE_REQUEST_NOT_APPROVED: PR is in status ${pr.status}`);
    }

    if (input.lines.length === 0) {
      throw new Error('PO_LINES_REQUIRED: Purchase order must have at least one line');
    }

    const poLines: PurchaseOrderLine[] = input.lines.map((line, index) => {
      if (line.quantity <= 0) {
        throw new Error('INVALID_PO_LINE_QUANTITY: Line quantity must be positive');
      }
      if (line.unitPrice <= 0) {
        throw new Error('INVALID_PO_LINE_PRICE: Unit price must be positive');
      }
      return {
        id: `pol-${index + 1}`,
        itemId: line.itemId,
        itemName: line.itemName,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        totalPrice: line.quantity * line.unitPrice,
        receivedQuantity: 0,
        acceptedQuantity: 0,
      };
    });

    const totalAmount = poLines.reduce((sum, line) => sum + line.totalPrice, 0);
    const poId = input.clientOperationId ?? `po-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const po: PurchaseOrder = {
      id: poId,
      poNumber,
      purchaseRequestId: pr.id,
      vendorId: input.vendorId,
      vendorName: input.vendorName,
      lines: poLines,
      status: 'ISSUED',
      totalAmount,
      currency: input.currency ?? 'INR',
      deliveryDate: input.deliveryDate,
      deliveryLocation: input.deliveryLocation,
      terms: input.terms,
      version: 1,
      createdAt: new Date().toISOString(),
      createdBy: actor.name,
    };

    this.purchaseOrders.set(po.id, po);

    const updatedPr: PurchaseRequest = {
      ...pr,
      status: 'ORDERED',
    };
    this.purchaseRequests.set(pr.id, updatedPr);

    return po;
  }

  public revisePurchaseOrder(
    poId: string,
    updatedLines: Array<{
      itemId: string;
      itemName: string;
      quantity: number;
      unitPrice: number;
    }>,
    actor: FacilityOperationsActor
  ): PurchaseOrder {
    if (!actor.hasPermission('CREATE_PURCHASE_ORDER')) {
      throw new Error('ACCESS_DENIED: Actor lacks CREATE_PURCHASE_ORDER permission');
    }

    const currentPo = this.purchaseOrders.get(poId);
    if (!currentPo) {
      throw new Error('PURCHASE_ORDER_NOT_FOUND');
    }

    if (currentPo.status === 'CANCELLED' || currentPo.status === 'RECEIVED') {
      throw new Error(`PO_REVISION_NOT_ALLOWED: Cannot revise PO in status ${currentPo.status}`);
    }

    const newLines: PurchaseOrderLine[] = updatedLines.map((line, index) => {
      const existingLine = currentPo.lines.find((l) => l.itemId === line.itemId);
      const received = existingLine?.receivedQuantity ?? 0;
      const accepted = existingLine?.acceptedQuantity ?? 0;

      if (line.quantity < accepted) {
        throw new Error(
          `REVISED_QUANTITY_BELOW_ACCEPTED: Revised quantity ${line.quantity} cannot be less than already accepted quantity ${accepted}`
        );
      }

      return {
        id: `pol-${index + 1}`,
        itemId: line.itemId,
        itemName: line.itemName,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        totalPrice: line.quantity * line.unitPrice,
        receivedQuantity: received,
        acceptedQuantity: accepted,
      };
    });

    const newTotal = newLines.reduce((sum, l) => sum + l.totalPrice, 0);
    const newVersionNumber = currentPo.version + 1;
    const revisedPoId = `${currentPo.id}-v${newVersionNumber}`;

    const revisedPo: PurchaseOrder = {
      ...currentPo,
      id: revisedPoId,
      lines: newLines,
      totalAmount: newTotal,
      version: newVersionNumber,
      previousVersionId: currentPo.id,
      createdAt: new Date().toISOString(),
      createdBy: actor.name,
    };

    this.purchaseOrders.set(revisedPo.id, revisedPo);
    return revisedPo;
  }

  public cancelPurchaseOrder(
    poId: string,
    reason: string,
    actor: FacilityOperationsActor
  ): PurchaseOrder {
    if (!actor.hasPermission('CREATE_PURCHASE_ORDER')) {
      throw new Error('ACCESS_DENIED: Actor lacks CREATE_PURCHASE_ORDER permission');
    }

    const po = this.purchaseOrders.get(poId);
    if (!po) {
      throw new Error('PURCHASE_ORDER_NOT_FOUND');
    }

    const hasAnyAccepted = po.lines.some((l) => l.acceptedQuantity > 0);
    if (hasAnyAccepted) {
      const allAccepted = po.lines.every((l) => l.acceptedQuantity >= l.quantity);
      if (allAccepted) {
        throw new Error('PO_ALREADY_FULFILLED: Cannot cancel fully received purchase order');
      }
    }

    const cancelledPo: PurchaseOrder = {
      ...po,
      status: 'CANCELLED',
      terms: `${po.terms} | Cancelled by ${actor.name}: ${reason}`,
    };

    this.purchaseOrders.set(po.id, cancelledPo);
    return cancelledPo;
  }

  public receiveGoods(
    input: {
      poId: string;
      lines: Array<{
        poLineId: string;
        deliveredQuantity: number;
        acceptedQuantity: number;
        rejectedQuantity: number;
        rejectionReason?: string;
      }>;
      documentVaultId?: string;
      clientOperationId?: string;
    },
    actor: FacilityOperationsActor
  ): GoodsReceipt {
    if (!actor.hasPermission('MANAGE_INVENTORY')) {
      throw new Error('ACCESS_DENIED: Actor lacks MANAGE_INVENTORY permission');
    }

    const po = this.purchaseOrders.get(input.poId);
    if (!po) {
      throw new Error('PURCHASE_ORDER_NOT_FOUND');
    }

    if (po.status === 'CANCELLED') {
      throw new Error('PO_CANCELLED: Cannot receive goods against cancelled purchase order');
    }

    const receiptLines: GoodsReceiptLine[] = [];
    const updatedPoLines: PurchaseOrderLine[] = [];

    for (const lineInput of input.lines) {
      const poLine = po.lines.find((l) => l.id === lineInput.poLineId);
      if (!poLine) {
        throw new Error(`PO_LINE_NOT_FOUND: Line ${lineInput.poLineId} does not exist on PO`);
      }

      if (lineInput.deliveredQuantity < 0 || lineInput.acceptedQuantity < 0 || lineInput.rejectedQuantity < 0) {
        throw new Error('INVALID_RECEIPT_QUANTITY: Quantities must be non-negative');
      }

      if (lineInput.acceptedQuantity + lineInput.rejectedQuantity !== lineInput.deliveredQuantity) {
        throw new Error(
          `RECEIPT_QUANTITY_MISMATCH: Accepted (${lineInput.acceptedQuantity}) + Rejected (${lineInput.rejectedQuantity}) must equal Delivered (${lineInput.deliveredQuantity})`
        );
      }

      const previouslyReceived = poLine.receivedQuantity;
      const previouslyAccepted = poLine.acceptedQuantity;

      if (previouslyReceived + lineInput.deliveredQuantity > poLine.quantity) {
        throw new Error(
          `RECEIPT_EXCEEDS_ORDERED: Total delivered (${previouslyReceived + lineInput.deliveredQuantity}) exceeds ordered (${poLine.quantity})`
        );
      }

      receiptLines.push({
        id: `grl-${receiptLines.length + 1}`,
        poLineId: poLine.id,
        itemId: poLine.itemId,
        itemName: poLine.itemName,
        orderedQuantity: poLine.quantity,
        deliveredQuantity: lineInput.deliveredQuantity,
        acceptedQuantity: lineInput.acceptedQuantity,
        rejectedQuantity: lineInput.rejectedQuantity,
        ...(lineInput.rejectionReason ? { rejectionReason: lineInput.rejectionReason } : {}),
      });

      updatedPoLines.push({
        ...poLine,
        receivedQuantity: previouslyReceived + lineInput.deliveredQuantity,
        acceptedQuantity: previouslyAccepted + lineInput.acceptedQuantity,
      });
    }

    const allLinesFulfilled = updatedPoLines.every((l) => l.acceptedQuantity >= l.quantity);
    const newStatus = allLinesFulfilled ? 'RECEIVED' : 'PARTIALLY_RECEIVED';

    const receiptId = input.clientOperationId ?? `gr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const receiptNumber = `GR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const goodsReceipt: GoodsReceipt = {
      id: receiptId,
      receiptNumber,
      poId: po.id,
      vendorId: po.vendorId,
      vendorName: po.vendorName,
      lines: receiptLines,
      receivedAt: new Date().toISOString(),
      receivedBy: actor.name,
      status: allLinesFulfilled ? 'COMPLETED' : 'PARTIAL',
      ...(input.documentVaultId ? { documentVaultId: input.documentVaultId } : {}),
    };

    this.goodsReceipts.set(goodsReceipt.id, goodsReceipt);

    const updatedPo: PurchaseOrder = {
      ...po,
      lines: updatedPoLines,
      status: newStatus,
    };
    this.purchaseOrders.set(po.id, updatedPo);

    const inventoryService = InventoryService.getInstance();
    for (const rLine of receiptLines) {
      if (rLine.acceptedQuantity > 0) {
        inventoryService.receiveStock(
          {
            itemId: rLine.itemId,
            transactionType: 'RECEIPT',
            quantity: rLine.acceptedQuantity,
            actor: actor.name,
            actorId: actor.userId,
            purpose: `PO Receipt ${po.poNumber}`,
            linkedPurchaseOrderId: po.id,
            linkedGoodsReceiptId: goodsReceipt.id,
          },
          actor
        );
      }
    }

    return goodsReceipt;
  }

  public createReturnToVendor(
    input: {
      goodsReceiptId: string;
      lines: Array<{
        itemId: string;
        quantity: number;
        reason: string;
      }>;
      clientOperationId?: string;
    },
    actor: FacilityOperationsActor
  ): ReturnToVendor {
    if (!actor.hasPermission('MANAGE_INVENTORY')) {
      throw new Error('ACCESS_DENIED: Actor lacks MANAGE_INVENTORY permission');
    }

    const gr = this.goodsReceipts.get(input.goodsReceiptId);
    if (!gr) {
      throw new Error('GOODS_RECEIPT_NOT_FOUND');
    }

    const po = this.purchaseOrders.get(gr.poId);
    if (!po) {
      throw new Error('PURCHASE_ORDER_NOT_FOUND');
    }

    for (const line of input.lines) {
      const grLine = gr.lines.find((l) => l.itemId === line.itemId);
      if (!grLine) {
        throw new Error(`ITEM_NOT_IN_RECEIPT: Item ${line.itemId} was not received in receipt ${gr.id}`);
      }
      if (line.quantity <= 0) {
        throw new Error('INVALID_RETURN_QUANTITY: Return quantity must be positive');
      }
      if (line.quantity > grLine.acceptedQuantity) {
        throw new Error(
          `RETURN_EXCEEDS_ACCEPTED_QUANTITY: Cannot return ${line.quantity} when accepted was ${grLine.acceptedQuantity}`
        );
      }
    }

    const returnId = input.clientOperationId ?? `rtv-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const returnNumber = `RTV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const rtv: ReturnToVendor = {
      id: returnId,
      returnNumber,
      poId: gr.poId,
      goodsReceiptId: gr.id,
      vendorId: gr.vendorId,
      lines: input.lines,
      returnedAt: new Date().toISOString(),
      returnedBy: actor.name,
    };

    this.returnsToVendor.set(rtv.id, rtv);

    const inventoryService = InventoryService.getInstance();
    for (const line of input.lines) {
      inventoryService.adjustStock(
        line.itemId,
        -line.quantity,
        `Return to Vendor: ${line.reason} (RTV: ${rtv.returnNumber})`,
        actor
      );
    }

    return rtv;
  }

  public getPurchaseRequest(id: string): PurchaseRequest | null {
    return this.purchaseRequests.get(id) ?? null;
  }

  public getPurchaseOrder(id: string): PurchaseOrder | null {
    return this.purchaseOrders.get(id) ?? null;
  }

  public getGoodsReceipt(id: string): GoodsReceipt | null {
    return this.goodsReceipts.get(id) ?? null;
  }

  public getReturnToVendor(id: string): ReturnToVendor | null {
    return this.returnsToVendor.get(id) ?? null;
  }

  public getPurchaseOrders(): PurchaseOrder[] {
    return Array.from(this.purchaseOrders.values());
  }

  public getGoodsReceipts(): GoodsReceipt[] {
    return Array.from(this.goodsReceipts.values());
  }

  public clear(): void {
    this.purchaseRequests.clear();
    this.purchaseOrders.clear();
    this.goodsReceipts.clear();
    this.returnsToVendor.clear();
  }
}
